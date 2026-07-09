import 'server-only';

import crypto from 'node:crypto';
import type { Prisma, PrismaClient } from '@prisma/client';

import { syncCaseCustomerProfile } from '@/lib/customer-profiles';
import { buildLocaleUrl, SITE_LOCALES } from '@/lib/seo';

const PORTAL_CLAIM_TOKEN_BYTES = 32;
export const PORTAL_CLAIM_LINK_TTL_HOURS = 24;
export const PORTAL_EMAIL_VERIFICATION_TTL_MINUTES = 30;

type ClaimDb = PrismaClient | Prisma.TransactionClient;

export type PortalClaimLinkResult = {
  url: string;
  expiresAt: Date;
  publicRequestNumber: string;
};

export type PortalClaimContext =
  | {
      ok: true;
      token: string;
      claimLinkId: string;
      caseId: string;
      locale: string;
      publicRequestNumber: string;
      prefillEmail: string | null;
      customerEmail: string | null;
      customerPhone: string | null;
      expiresAt: string;
    }
  | {
      ok: false;
      reason: 'missing_token' | 'invalid_or_expired';
    };

function createToken(): string {
  return crypto.randomBytes(PORTAL_CLAIM_TOKEN_BYTES).toString('base64url');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function normalizePortalEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isLikelyPortalEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizePortalEmail(value));
}

export function normalizePortalLocale(value?: string | null): string {
  const locale = value?.trim().toLowerCase();

  return SITE_LOCALES.includes(locale as (typeof SITE_LOCALES)[number])
    ? (locale as (typeof SITE_LOCALES)[number])
    : 'de';
}

function addHours(now: Date, hours: number): Date {
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

function addMinutes(now: Date, minutes: number): Date {
  return new Date(now.getTime() + minutes * 60 * 1000);
}

function buildClaimUrl(input: {
  locale?: string | null;
  token: string;
}): string {
  const locale = normalizePortalLocale(input.locale);

  return buildLocaleUrl(locale, `/portal/claim?token=${encodeURIComponent(input.token)}`);
}

export function buildPortalVerificationUrl(input: {
  locale?: string | null;
  token: string;
}): string {
  const locale = normalizePortalLocale(input.locale);

  return buildLocaleUrl(locale, `/portal/claim/verify?token=${encodeURIComponent(input.token)}`);
}

export function buildPortalClaimMessage(input: {
  publicRequestNumber: string;
  claimUrl: string;
  expiresAt: Date;
}): string {
  return [
    'Kundenportal vorbereiten',
    `Anfrage: ${input.publicRequestNumber}`,
    `Link: ${input.claimUrl}`,
    '',
    'Der Link ist 24 Stunden gueltig. Er oeffnet noch keine privaten Daten, sondern startet die E-Mail-Code-Bestaetigung fuer das Kundenportal.',
    `Gueltig bis: ${input.expiresAt.toISOString()}`,
  ].join('\n');
}

function extractPortalClaimUrls(value: string): string[] {
  const matches = value.match(/https?:\/\/[^\s<>"']*\/portal\/claim\?token=[^\s<>"']+/gi);

  return matches ?? [];
}

function extractClaimTokenFromUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const token = url.searchParams.get('token')?.trim();

    return token || null;
  } catch {
    return null;
  }
}

export async function getActivePortalClaimLinkForCase(
  db: ClaimDb,
  input: {
    caseId: string;
    now?: Date;
  }
): Promise<{ url: string; expiresAt: string } | null> {
  const now = input.now ?? new Date();
  const messages = await db.message.findMany({
    where: {
      caseId: input.caseId,
      authorRole: 'SYSTEM',
      body: { contains: '/portal/claim?token=' },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { body: true },
  });

  for (const message of messages) {
    for (const url of extractPortalClaimUrls(message.body)) {
      const token = extractClaimTokenFromUrl(url);

      if (!token) {
        continue;
      }

      const claim = await getPortalClaimContext(db, token, now);

      if (claim.ok && claim.caseId === input.caseId) {
        return {
          url,
          expiresAt: claim.expiresAt,
        };
      }
    }
  }

  return null;
}

export async function createPortalClaimLink(
  db: ClaimDb,
  input: {
    caseId: string;
    locale?: string | null;
    createdByAdminSessionId?: string | null;
    now?: Date;
  }
): Promise<PortalClaimLinkResult> {
  const now = input.now ?? new Date();
  const token = createToken();
  const tokenHash = hashToken(token);
  const expiresAt = addHours(now, PORTAL_CLAIM_LINK_TTL_HOURS);

  const caseRecord = await db.case.findUnique({
    where: { id: input.caseId },
    select: {
      id: true,
      publicRequestNumber: true,
      customerEmail: true,
      locale: true,
    },
  });

  if (!caseRecord?.publicRequestNumber) {
    throw new Error('Portal claim link requires a public request number.');
  }

  const locale = input.locale
    ? normalizePortalLocale(input.locale)
    : normalizePortalLocale(caseRecord.locale);

  await db.portalClaimLink.updateMany({
    where: {
      caseId: input.caseId,
      consumedAt: null,
      revokedAt: null,
      expiresAt: { gt: now },
    },
    data: {
      revokedAt: now,
    },
  });

  await db.portalClaimLink.create({
    data: {
      tokenHash,
      caseId: input.caseId,
      locale: locale || normalizePortalLocale(caseRecord.locale),
      prefillEmail: caseRecord.customerEmail?.trim().toLowerCase() || null,
      createdByAdminSessionId: input.createdByAdminSessionId ?? null,
      expiresAt,
    },
    select: { id: true },
  });

  return {
    url: buildClaimUrl({ locale, token }),
    expiresAt,
    publicRequestNumber: caseRecord.publicRequestNumber,
  };
}

export async function getPortalClaimContext(
  db: ClaimDb,
  token: string | null | undefined,
  now = new Date()
): Promise<PortalClaimContext> {
  const cleanToken = token?.trim();

  if (!cleanToken) {
    return { ok: false, reason: 'missing_token' };
  }

  const claim = await db.portalClaimLink.findUnique({
    where: { tokenHash: hashToken(cleanToken) },
    select: {
      id: true,
      locale: true,
      prefillEmail: true,
      expiresAt: true,
      consumedAt: true,
      revokedAt: true,
      case: {
        select: {
          id: true,
          publicRequestNumber: true,
          customerEmail: true,
          customerPhone: true,
        },
      },
    },
  });

  if (
    !claim ||
    claim.consumedAt ||
    claim.revokedAt ||
    claim.expiresAt <= now ||
    !claim.case.publicRequestNumber
  ) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  await db.portalClaimLink.update({
    where: { id: claim.id },
    data: { lastOpenedAt: now },
    select: { id: true },
  });

  return {
    ok: true,
    token: cleanToken,
    claimLinkId: claim.id,
    caseId: claim.case.id,
    locale: normalizePortalLocale(claim.locale),
    publicRequestNumber: claim.case.publicRequestNumber,
    prefillEmail: claim.prefillEmail,
    customerEmail: claim.case.customerEmail,
    customerPhone: claim.case.customerPhone,
    expiresAt: claim.expiresAt.toISOString(),
  };
}

export async function createPortalEmailVerification(
  db: ClaimDb,
  input: {
    claimToken: string;
    email: string;
    now?: Date;
  }
): Promise<{
  email: string;
  verificationUrl: string;
  publicRequestNumber: string;
  expiresAt: Date;
}> {
  const now = input.now ?? new Date();
  const email = normalizePortalEmail(input.email);

  if (!isLikelyPortalEmail(email)) {
    throw new Error('Invalid email address.');
  }

  const claim = await getPortalClaimContext(db, input.claimToken, now);

  if (!claim.ok) {
    throw new Error('Portal claim link is invalid or expired.');
  }

  const token = createToken();
  const tokenHash = hashToken(token);
  const expiresAt = addMinutes(now, PORTAL_EMAIL_VERIFICATION_TTL_MINUTES);

  await db.portalEmailVerification.updateMany({
    where: {
      claimLinkId: claim.claimLinkId,
      verifiedAt: null,
      consumedAt: null,
      expiresAt: { gt: now },
    },
    data: {
      consumedAt: now,
    },
  });

  await db.portalEmailVerification.create({
    data: {
      tokenHash,
      claimLinkId: claim.claimLinkId,
      caseId: claim.caseId,
      email,
      emailNormalized: email,
      expiresAt,
    },
    select: { id: true },
  });

  await db.portalClaimLink.update({
    where: { id: claim.claimLinkId },
    data: { requestedEmail: email },
    select: { id: true },
  });

  return {
    email,
    verificationUrl: buildPortalVerificationUrl({
      locale: claim.locale,
      token,
    }),
    publicRequestNumber: claim.publicRequestNumber,
    expiresAt,
  };
}

export async function consumePortalEmailVerification(
  db: PrismaClient,
  token: string | null | undefined,
  now = new Date()
): Promise<
  | {
      ok: true;
      caseId: string;
      portalUserId: string;
      email: string;
      locale: string;
      publicRequestNumber: string;
    }
  | {
      ok: false;
      reason: 'missing_token' | 'invalid_or_expired';
    }
> {
  const cleanToken = token?.trim();

  if (!cleanToken) {
    return { ok: false, reason: 'missing_token' };
  }

  const verification = await db.portalEmailVerification.findUnique({
    where: { tokenHash: hashToken(cleanToken) },
    select: {
      id: true,
      email: true,
      emailNormalized: true,
      expiresAt: true,
      verifiedAt: true,
      consumedAt: true,
      claimLink: {
        select: {
          id: true,
          locale: true,
          consumedAt: true,
          revokedAt: true,
          expiresAt: true,
        },
      },
      case: {
        select: {
          id: true,
          publicRequestNumber: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          primaryContactMethod: true,
          locale: true,
        },
      },
    },
  });

  if (
    !verification ||
    verification.verifiedAt ||
    verification.consumedAt ||
    verification.expiresAt <= now ||
    verification.claimLink.consumedAt ||
    verification.claimLink.revokedAt ||
    verification.claimLink.expiresAt <= now ||
    !verification.case.publicRequestNumber
  ) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  let portalUserId = '';

  await db.$transaction(async (tx) => {
    await tx.portalEmailVerification.update({
      where: { id: verification.id },
      data: {
        verifiedAt: now,
        consumedAt: now,
      },
      select: { id: true },
    });

    await tx.portalClaimLink.update({
      where: { id: verification.claimLink.id },
      data: {
        consumedAt: now,
        requestedEmail: verification.emailNormalized,
      },
      select: { id: true },
    });

    const preferredContactMethod =
      verification.case.primaryContactMethod ?? 'EMAIL';

    await tx.case.update({
      where: { id: verification.case.id },
      data: {
        customerEmail: verification.emailNormalized,
        primaryContactMethod: verification.case.primaryContactMethod ?? 'EMAIL',
        primaryContactValue:
          verification.case.primaryContactMethod === null
            ? verification.emailNormalized
            : undefined,
      },
      select: { id: true },
    });

    await syncCaseCustomerProfile(tx, {
      caseId: verification.case.id,
      customerName: verification.case.customerName,
      customerEmail: verification.emailNormalized,
      customerPhone: verification.case.customerPhone,
      preferredLanguage: verification.case.locale,
      preferredContactMethod,
    });

    const existingPortalEmail = await tx.portalUserEmail.findUnique({
      where: { emailNormalized: verification.emailNormalized },
      select: {
        portalUserId: true,
      },
    });

    if (existingPortalEmail) {
      portalUserId = existingPortalEmail.portalUserId;

      await tx.portalUser.update({
        where: { id: portalUserId },
        data: {
          displayName: verification.case.customerName?.trim() || undefined,
          primaryEmail: verification.emailNormalized,
          primaryEmailNormalized: verification.emailNormalized,
          status: 'ACTIVE',
          lastLoginAt: now,
        },
        select: { id: true },
      });

      await tx.portalUserEmail.update({
        where: { emailNormalized: verification.emailNormalized },
        data: {
          email: verification.emailNormalized,
          verifiedAt: now,
        },
        select: { id: true },
      });
    } else {
      const portalUser = await tx.portalUser.create({
        data: {
          displayName: verification.case.customerName?.trim() || null,
          primaryEmail: verification.emailNormalized,
          primaryEmailNormalized: verification.emailNormalized,
          status: 'ACTIVE',
          lastLoginAt: now,
          emails: {
            create: {
              email: verification.emailNormalized,
              emailNormalized: verification.emailNormalized,
              verifiedAt: now,
            },
          },
        },
        select: { id: true },
      });

      portalUserId = portalUser.id;
    }

    await tx.portalCaseAccess.upsert({
      where: {
        portalUserId_caseId: {
          portalUserId,
          caseId: verification.case.id,
        },
      },
      create: {
        portalUserId,
        caseId: verification.case.id,
        source: 'CLAIM_LINK',
        grantedAt: now,
      },
      update: {
        source: 'CLAIM_LINK',
        grantedAt: now,
        revokedAt: null,
      },
      select: { id: true },
    });
  });

  return {
    ok: true,
    caseId: verification.case.id,
    portalUserId,
    email: verification.emailNormalized,
    locale: normalizePortalLocale(verification.claimLink.locale || verification.case.locale),
    publicRequestNumber: verification.case.publicRequestNumber,
  };
}
