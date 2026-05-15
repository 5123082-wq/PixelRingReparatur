import {
  CaseOriginChannel,
  CaseStatus,
  MessageAuthorRole,
  PrismaClient,
  SessionScope,
} from '@prisma/client';

import {
  createCaseSessionToken,
  getCaseSessionExpiryDate,
  hashCaseSessionToken,
} from './case-session';
import type { StoredAttachmentInput } from './attachments';
import { ensurePublicRequestNumberForCase } from './request-number';
import { createPortalClaimLink } from './portal/claim';

export type IntakeContactMethod = 'EMAIL' | 'PHONE';

export type ParsedContact = {
  method: IntakeContactMethod;
  value: string;
  customerEmail: string | null;
  customerPhone: string | null;
};

export type WebsiteRequestInput = {
  name?: string;
  contact: string;
  message: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  locale?: string | null;
  origin?: string | null;
  attachments?: StoredAttachmentInput[];
  existingSessionId?: string | null;
  existingSessionToken?: string | null;
  isFromChat?: boolean;
};

export type WebsiteRequestResult = {
  caseId: string;
  publicRequestNumber: string;
  portalClaimUrl: string;
  portalClaimExpiresAt: string;
  sessionToken: string;
  photoReceived: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_REGEX = /\d/;
const MIN_PHONE_DIGITS = 7;
function buildSummary(message: string): string {
  const clean = message.trim().replace(/\s+/g, ' ');

  return clean.length <= 180 ? clean : `${clean.slice(0, 177)}...`;
}

function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const digitCount = trimmed.replace(/\D/g, '').length;

  if (digitCount < MIN_PHONE_DIGITS) {
    throw new Error(
      'Please provide a valid email address or phone number to formalize the request.'
    );
  }

  const hasLeadingPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  return hasLeadingPlus ? `+${digits}` : digits;
}

function normalizeEmail(value: string): string {
  const trimmed = value.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    throw new Error(
      'Please provide a valid email address or phone number to formalize the request.'
    );
  }

  return trimmed;
}

export function parseContact(contact: string): ParsedContact {
  const value = contact.trim();

  if (!value) {
    throw new Error(
      'Please provide a valid email address or phone number to formalize the request.'
    );
  }

  if (value.includes('@')) {
    const customerEmail = normalizeEmail(value);

    return {
      method: 'EMAIL',
      value: customerEmail,
      customerEmail,
      customerPhone: null,
    };
  }

  if (!DIGITS_REGEX.test(value)) {
    throw new Error(
      'Please provide a valid email address or phone number to formalize the request.'
    );
  }

  const customerPhone = normalizePhone(value);

  return {
    method: 'PHONE',
    value: customerPhone,
    customerEmail: null,
    customerPhone,
  };
}

export async function createWebsiteRequest(
  prisma: PrismaClient,
  input: WebsiteRequestInput
): Promise<WebsiteRequestResult> {
  const parsedContact = parseContact(input.contact);
  const now = new Date();
  const sessionToken = createCaseSessionToken();
  const sessionTokenHash = hashCaseSessionToken(sessionToken);
  const attachments = input.attachments ?? [];

  return prisma.$transaction(async (tx) => {
    const createdCase = await tx.case.create({
      data: {
        status: CaseStatus.FORMALIZED,
        originChannel: CaseOriginChannel.WEBSITE_FORM,
        customerName: input.name?.trim() || null,
        customerEmail: parsedContact.customerEmail,
        customerPhone: parsedContact.customerPhone,
        primaryContactMethod: parsedContact.method,
        primaryContactValue: parsedContact.value,
        locale: input.locale?.trim() || null,
        summary: buildSummary(input.message),
        description: input.message.trim(),
        formalizedAt: now,
        statusUpdatedAt: now,
      },
      select: { id: true },
    });

    const publicRequestNumber = await ensurePublicRequestNumberForCase(
      tx,
      createdCase.id
    );

    const previousRegistrationMessage =
      input.existingSessionId && input.existingSessionToken
        ? await tx.message.findFirst({
            where: {
              sessionId: input.existingSessionId,
              authorRole: MessageAuthorRole.SYSTEM,
              body: { startsWith: 'Anfrage erfolgreich registriert. Nummer:' },
            },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
          })
        : null;

    let initialMessageId = null;
    if (!input.isFromChat) {
      const initialMessage = await tx.message.create({
        data: {
          caseId: createdCase.id,
          channel: CaseOriginChannel.WEBSITE_FORM,
          authorRole: MessageAuthorRole.CUSTOMER,
          authorName: input.name?.trim() || null,
          body: input.message.trim(),
          isCustomerVisible: true,
          sentAt: now,
        },
        select: { id: true },
      });
      initialMessageId = initialMessage.id;
    } else {
      const sysMsg = await tx.message.create({
        data: {
          caseId: createdCase.id,
          sessionId: input.existingSessionId || undefined,
          channel: CaseOriginChannel.WEBSITE_CHAT,
          authorRole: MessageAuthorRole.SYSTEM,
          body: `Anfrage erfolgreich registriert. Nummer: ${publicRequestNumber}`,
          isCustomerVisible: true,
          sentAt: now,
        },
        select: { id: true },
      });
      initialMessageId = sysMsg.id;
    }

    await tx.case.update({
      where: { id: createdCase.id },
      data: {
        status: CaseStatus.NUMBER_ISSUED,
        numberIssuedAt: now,
        statusUpdatedAt: now,
      },
    });

    let session;
    let finalSessionToken = sessionToken;
    let linkedSessionAttachmentCount = 0;
    if (input.existingSessionId && input.existingSessionToken) {
      session = await tx.session.update({
        where: { id: input.existingSessionId },
        data: {
          scope: SessionScope.CASE_ACCESS,
          caseId: createdCase.id,
          contactMethod: parsedContact.method,
          contactValue: parsedContact.value,
          lastSeenAt: now,
          expiresAt: getCaseSessionExpiryDate(now),
        },
        select: { id: true },
      });
      finalSessionToken = input.existingSessionToken;

      await tx.message.updateMany({
        where: {
          sessionId: input.existingSessionId,
          ...(previousRegistrationMessage
            ? { createdAt: { gt: previousRegistrationMessage.createdAt } }
            : {}),
        },
        data: { caseId: createdCase.id },
      });

      const linkedSessionAttachments = await tx.attachment.updateMany({
        where: {
          uploadedBySessionId: input.existingSessionId,
          isCustomerVisible: true,
          ...(previousRegistrationMessage
            ? { createdAt: { gt: previousRegistrationMessage.createdAt } }
            : {}),
        },
        data: { caseId: createdCase.id },
      });
      linkedSessionAttachmentCount = linkedSessionAttachments.count;
    } else {
      session = await tx.session.create({
        data: {
          tokenHash: sessionTokenHash,
          scope: SessionScope.CASE_ACCESS,
          caseId: createdCase.id,
          contactMethod: parsedContact.method,
          contactValue: parsedContact.value,
          userAgent: input.userAgent ?? null,
          ipAddress: input.ipAddress ?? null,
          lastSeenAt: now,
          expiresAt: getCaseSessionExpiryDate(now),
        },
        select: { id: true },
      });
    }

    if (attachments.length > 0) {
      await tx.attachment.createMany({
        data: attachments.map((attachment) => ({
          ...attachment,
          caseId: createdCase.id,
          messageId: initialMessageId,
          uploadedBySessionId: session.id,
          isCustomerVisible: true,
        })),
      });
    }

    const portalClaimLink = await createPortalClaimLink(tx, {
      caseId: createdCase.id,
      locale: input.locale,
      origin: input.origin,
      now,
    });

    await tx.message.create({
      data: {
        caseId: createdCase.id,
        sessionId: session.id,
        channel: input.isFromChat ? CaseOriginChannel.WEBSITE_CHAT : CaseOriginChannel.WEBSITE_FORM,
        authorRole: MessageAuthorRole.SYSTEM,
        authorName: 'Portal Access',
        body: [
          `Kundenportal-Link: ${portalClaimLink.url}`,
          '',
          'Dieser Link ist 24 Stunden gueltig und startet die E-Mail-Bestaetigung fuer das Kundenportal.',
        ].join('\n'),
        isCustomerVisible: true,
        sentAt: now,
      },
    });

    return {
      caseId: createdCase.id,
      publicRequestNumber,
      portalClaimUrl: portalClaimLink.url,
      portalClaimExpiresAt: portalClaimLink.expiresAt.toISOString(),
      sessionToken: finalSessionToken,
      photoReceived: attachments.length + linkedSessionAttachmentCount > 0,
    };
  });
}
