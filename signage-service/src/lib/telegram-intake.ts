import 'server-only';

import crypto from 'node:crypto';

import {
  CaseOriginChannel,
  CaseStatus,
  MessageAuthorRole,
  type PrismaClient,
} from '@prisma/client';

import type { StoredAttachmentInput } from './attachments';
import { createCaseSessionToken, hashCaseSessionToken } from './case-session';
import { ensurePublicRequestNumberForCase } from './request-number';
import { parseContact } from './request-intake';
import { buildLocalePath, buildLocaleUrl, DEFAULT_SITE_LOCALE, SITE_LOCALES, type SiteLocale } from './seo';
import { createCaseStatusAccessLink } from './status-access-link';
import { isTelegramContactAllowed } from './telegram-contact-lock';
import { getTelegramBotUsername } from './telegram';

const TELEGRAM_INTAKE_TOKEN_TTL_MS = 60 * 60 * 1000;
const RETURN_NONCE_BYTES = 18;

type TelegramIntakeLinkDb = Pick<PrismaClient, 'telegramIntakeLink'>;

export class TelegramIntakeError extends Error {
  status: number;
  code: string;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = 'TelegramIntakeError';
    this.code = code;
    this.status = status;
  }
}

function normalizeLocale(locale?: string | null): SiteLocale {
  const value = locale?.trim().toLowerCase();

  return SITE_LOCALES.includes(value as SiteLocale) ? (value as SiteLocale) : DEFAULT_SITE_LOCALE;
}

function createReturnNonce(): string {
  return crypto.randomBytes(RETURN_NONCE_BYTES).toString('base64url');
}

function buildUrlFromOrigin(origin: string | null | undefined, path: string): string {
  if (origin) {
    try {
      return new URL(path, origin).toString();
    } catch {
      // Fall back to the configured site URL.
    }
  }

  return buildLocaleUrl(DEFAULT_SITE_LOCALE, path.replace(/^\/[a-z]{2}(?=\/|$)/, ''));
}

export function buildTelegramDialogUrl(returnNonce: string): string | null {
  const botUsername = getTelegramBotUsername();

  if (!botUsername) {
    return null;
  }

  return `https://t.me/${botUsername}?start=return_${encodeURIComponent(returnNonce)}`;
}

export async function createTelegramIntakeLink(
  db: TelegramIntakeLinkDb,
  input: {
    caseId: string;
    externalConversationId: string;
    telegramChatId: string;
    telegramUserId?: string | null;
    locale?: string | null;
    origin?: string | null;
    now?: Date;
  }
): Promise<{ token: string; url: string; expiresAt: Date; returnNonce: string }> {
  const now = input.now ?? new Date();
  const locale = normalizeLocale(input.locale);
  const token = createCaseSessionToken();
  const returnNonce = createReturnNonce();
  const expiresAt = new Date(now.getTime() + TELEGRAM_INTAKE_TOKEN_TTL_MS);

  await db.telegramIntakeLink.create({
    data: {
      tokenHash: hashCaseSessionToken(token),
      caseId: input.caseId,
      externalConversationId: input.externalConversationId,
      telegramChatId: input.telegramChatId,
      telegramUserId: input.telegramUserId ?? null,
      locale,
      returnNonce,
      expiresAt,
    },
  });

  const path = buildLocalePath(locale, `/telegram/request?t=${encodeURIComponent(token)}`);

  return {
    token,
    url: input.origin ? buildUrlFromOrigin(input.origin, path) : buildLocaleUrl(locale, `/telegram/request?t=${encodeURIComponent(token)}`),
    expiresAt,
    returnNonce,
  };
}

export async function getTelegramIntakeLinkState(
  db: TelegramIntakeLinkDb,
  token: string,
  options: { markOpened?: boolean; now?: Date } = {}
): Promise<{ status: 'valid' | 'invalid' | 'expired' | 'submitted'; locale: SiteLocale }> {
  const cleanToken = token.trim();

  if (!cleanToken) {
    return { status: 'invalid', locale: DEFAULT_SITE_LOCALE };
  }

  const now = options.now ?? new Date();
  const link = await db.telegramIntakeLink.findUnique({
    where: { tokenHash: hashCaseSessionToken(cleanToken) },
    select: {
      id: true,
      locale: true,
      expiresAt: true,
      submittedAt: true,
      revokedAt: true,
      openedAt: true,
    },
  });

  if (!link || link.revokedAt) {
    return { status: 'invalid', locale: DEFAULT_SITE_LOCALE };
  }

  const locale = normalizeLocale(link.locale);

  if (link.submittedAt) {
    return { status: 'submitted', locale };
  }

  if (link.expiresAt <= now) {
    return { status: 'expired', locale };
  }

  if (options.markOpened && !link.openedAt) {
    await db.telegramIntakeLink.update({
      where: { id: link.id },
      data: { openedAt: now },
      select: { id: true },
    });
  }

  return { status: 'valid', locale };
}

function buildSummary(message: string): string {
  const clean = message.trim().replace(/\s+/g, ' ');

  return clean.length <= 180 ? clean : `${clean.slice(0, 177)}...`;
}

function buildStoredMessage(input: { issueType?: string | null; message: string }): string {
  const issueType = input.issueType?.trim();

  return issueType ? `Typ: ${issueType}\n\n${input.message.trim()}` : input.message.trim();
}

function assertTelegramContactAllowed(existing: Parameters<typeof isTelegramContactAllowed>[0], nextContact: Parameters<typeof isTelegramContactAllowed>[1]): void {
  if (!isTelegramContactAllowed(existing, nextContact)) {
    throw new TelegramIntakeError(
      'contact_locked',
      'This Telegram chat is already linked to a different contact. Please use the existing contact or ask a manager to change it.',
      409
    );
  }
}

export async function submitTelegramIntake(
  prisma: PrismaClient,
  input: {
    token: string;
    name?: string | null;
    contact: string;
    serviceLocation?: string | null;
    serviceLatitude?: number | null;
    serviceLongitude?: number | null;
    serviceLocationSource?: string | null;
    issueType?: string | null;
    message: string;
    attachments?: StoredAttachmentInput[];
    now?: Date;
  }
): Promise<{
  caseId: string;
  publicRequestNumber: string;
  locale: SiteLocale;
  telegramChatId: string;
  returnNonce: string;
  telegramReturnUrl: string | null;
  statusUrl: string;
  photoReceived: boolean;
}> {
  const now = input.now ?? new Date();
  const tokenHash = hashCaseSessionToken(input.token.trim());
  const parsedContact = parseContact(input.contact);
  const attachments = input.attachments ?? [];
  const finalMessage = buildStoredMessage({
    issueType: input.issueType,
    message: input.message,
  });
  const customerName = input.name?.trim() || null;
  const serviceLocation = input.serviceLocation?.trim() || null;
  const serviceLocationSource = input.serviceLocationSource?.trim() || null;

  return prisma.$transaction(async (tx) => {
    const link = await tx.telegramIntakeLink.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        caseId: true,
        externalConversationId: true,
        telegramChatId: true,
        locale: true,
        returnNonce: true,
        submittedAt: true,
        revokedAt: true,
        expiresAt: true,
        case: {
          select: {
            id: true,
            originChannel: true,
            customerEmail: true,
            customerPhone: true,
            primaryContactMethod: true,
            primaryContactValue: true,
            formalizedAt: true,
            numberIssuedAt: true,
            customerProfile: {
              select: {
                emailNormalized: true,
                phoneNormalized: true,
              },
            },
          },
        },
        externalConversation: {
          select: {
            id: true,
            caseId: true,
            channel: true,
            externalChatId: true,
          },
        },
      },
    });

    if (!link || link.revokedAt) {
      throw new TelegramIntakeError('invalid_token', 'Invalid Telegram intake link.', 404);
    }

    if (link.submittedAt) {
      throw new TelegramIntakeError('used_token', 'This Telegram intake link was already used.', 409);
    }

    if (link.expiresAt <= now) {
      throw new TelegramIntakeError('expired_token', 'This Telegram intake link has expired.', 410);
    }

    if (
      link.case.originChannel !== CaseOriginChannel.TELEGRAM ||
      link.externalConversation.channel !== CaseOriginChannel.TELEGRAM ||
      link.externalConversation.caseId !== link.caseId ||
      link.externalConversation.externalChatId !== link.telegramChatId
    ) {
      throw new TelegramIntakeError('invalid_link_context', 'Invalid Telegram intake context.', 400);
    }

    assertTelegramContactAllowed(link.case, parsedContact);

    const locale = normalizeLocale(link.locale);
    const publicRequestNumber = await ensurePublicRequestNumberForCase(tx, link.caseId);
    const customerMessage = await tx.message.create({
      data: {
        caseId: link.caseId,
        channel: CaseOriginChannel.TELEGRAM,
        authorRole: MessageAuthorRole.CUSTOMER,
        authorName: customerName,
        body: finalMessage,
        externalChatId: link.telegramChatId,
        isCustomerVisible: true,
        sentAt: now,
      },
      select: { id: true },
    });

    await tx.case.update({
      where: { id: link.caseId },
      data: {
        status: CaseStatus.NUMBER_ISSUED,
        customerName,
        customerEmail: parsedContact.customerEmail,
        customerPhone: parsedContact.customerPhone,
        primaryContactMethod: parsedContact.method,
        primaryContactValue: parsedContact.value,
        serviceLocation,
        serviceLatitude: input.serviceLatitude ?? null,
        serviceLongitude: input.serviceLongitude ?? null,
        serviceLocationSource,
        locale,
        summary: buildSummary(finalMessage),
        description: finalMessage,
        formalizedAt: link.case.formalizedAt ?? now,
        numberIssuedAt: link.case.numberIssuedAt ?? now,
        statusUpdatedAt: now,
      },
      select: { id: true },
    });

    if (attachments.length > 0) {
      await tx.attachment.createMany({
        data: attachments.map((attachment) => ({
          ...attachment,
          caseId: link.caseId,
          messageId: customerMessage.id,
          isCustomerVisible: true,
        })),
      });
    }

    await tx.telegramIntakeLink.update({
      where: { id: link.id },
      data: { submittedAt: now },
      select: { id: true },
    });

    const statusUrl = await createCaseStatusAccessLink(tx, {
      caseId: link.caseId,
      publicRequestNumber,
      locale,
      now,
    });

    return {
      caseId: link.caseId,
      publicRequestNumber,
      locale,
      telegramChatId: link.telegramChatId,
      returnNonce: link.returnNonce,
      telegramReturnUrl: buildTelegramDialogUrl(link.returnNonce),
      statusUrl,
      photoReceived: attachments.length > 0,
    };
  });
}

export async function getTelegramReturnTarget(
  db: TelegramIntakeLinkDb,
  returnNonce: string
): Promise<{ telegramReturnUrl: string | null; status: 'valid' | 'invalid' }> {
  const cleanNonce = returnNonce.trim();

  if (!cleanNonce) {
    return { telegramReturnUrl: null, status: 'invalid' };
  }

  const link = await db.telegramIntakeLink.findUnique({
    where: { returnNonce: cleanNonce },
    select: {
      submittedAt: true,
      revokedAt: true,
      expiresAt: true,
    },
  });

  if (!link || link.revokedAt || !link.submittedAt) {
    return { telegramReturnUrl: null, status: 'invalid' };
  }

  return {
    telegramReturnUrl: buildTelegramDialogUrl(cleanNonce),
    status: 'valid',
  };
}
