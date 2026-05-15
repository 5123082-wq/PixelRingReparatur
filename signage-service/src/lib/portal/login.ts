import 'server-only';

import { SessionScope, type Prisma, type PrismaClient } from '@prisma/client';

import {
  createCaseSessionToken,
  hashCaseSessionToken,
} from '@/lib/case-session';
import { buildLocaleUrl } from '@/lib/seo';
import { createPortalSession } from './auth';
import {
  isLikelyPortalEmail,
  normalizePortalEmail,
  normalizePortalLocale,
} from './claim';

const PORTAL_LOGIN_VERIFICATION_TTL_MINUTES = 30;

type PortalLoginDb = PrismaClient | Prisma.TransactionClient;

function addMinutes(now: Date, minutes: number): Date {
  return new Date(now.getTime() + minutes * 60 * 1000);
}

function buildPortalLoginVerificationUrl(input: {
  origin?: string | null;
  locale?: string | null;
  token: string;
}): string {
  const locale = normalizePortalLocale(input.locale);
  const path = `/${locale}/portal/login/verify?token=${encodeURIComponent(input.token)}`;

  if (input.origin) {
    try {
      return new URL(path, input.origin).toString();
    } catch {
      // Fall through to configured site URL.
    }
  }

  return buildLocaleUrl(locale, `/portal/login/verify?token=${encodeURIComponent(input.token)}`);
}

async function upsertPortalUserByEmail(
  db: PortalLoginDb,
  email: string,
  now: Date
): Promise<string> {
  const normalizedEmail = normalizePortalEmail(email);
  const existingPortalEmail = await db.portalUserEmail.findUnique({
    where: { emailNormalized: normalizedEmail },
    select: { portalUserId: true },
  });

  if (existingPortalEmail) {
    await db.portalUser.update({
      where: { id: existingPortalEmail.portalUserId },
      data: {
        primaryEmail: normalizedEmail,
        primaryEmailNormalized: normalizedEmail,
        status: 'ACTIVE',
        lastLoginAt: now,
      },
      select: { id: true },
    });

    await db.portalUserEmail.update({
      where: { emailNormalized: normalizedEmail },
      data: {
        email: normalizedEmail,
        verifiedAt: now,
      },
      select: { id: true },
    });

    return existingPortalEmail.portalUserId;
  }

  const existingPortalUser = await db.portalUser.findUnique({
    where: { primaryEmailNormalized: normalizedEmail },
    select: { id: true },
  });

  if (existingPortalUser) {
    await db.portalUser.update({
      where: { id: existingPortalUser.id },
      data: {
        primaryEmail: normalizedEmail,
        primaryEmailNormalized: normalizedEmail,
        status: 'ACTIVE',
        lastLoginAt: now,
      },
      select: { id: true },
    });

    await db.portalUserEmail.upsert({
      where: { emailNormalized: normalizedEmail },
      create: {
        portalUserId: existingPortalUser.id,
        email: normalizedEmail,
        emailNormalized: normalizedEmail,
        verifiedAt: now,
      },
      update: {
        email: normalizedEmail,
        verifiedAt: now,
      },
      select: { id: true },
    });

    return existingPortalUser.id;
  }

  const portalUser = await db.portalUser.create({
    data: {
      primaryEmail: normalizedEmail,
      primaryEmailNormalized: normalizedEmail,
      status: 'ACTIVE',
      lastLoginAt: now,
      emails: {
        create: {
          email: normalizedEmail,
          emailNormalized: normalizedEmail,
          verifiedAt: now,
        },
      },
    },
    select: { id: true },
  });

  return portalUser.id;
}

export async function createPortalLoginVerification(
  db: PrismaClient,
  input: {
    email: string;
    locale?: string | null;
    origin?: string | null;
    userAgent?: string | null;
    ipAddress?: string | null;
    now?: Date;
  }
): Promise<{
  email: string;
  verificationUrl: string;
  expiresAt: Date;
}> {
  const now = input.now ?? new Date();
  const email = normalizePortalEmail(input.email);

  if (!isLikelyPortalEmail(email)) {
    throw new Error('Invalid email address.');
  }

  const token = createCaseSessionToken();
  const expiresAt = addMinutes(now, PORTAL_LOGIN_VERIFICATION_TTL_MINUTES);

  await db.session.create({
    data: {
      tokenHash: hashCaseSessionToken(token),
      scope: SessionScope.ANONYMOUS_DRAFT,
      contactMethod: 'EMAIL',
      contactValue: email,
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
      expiresAt,
    },
    select: { id: true },
  });

  return {
    email,
    verificationUrl: buildPortalLoginVerificationUrl({
      origin: input.origin,
      locale: input.locale,
      token,
    }),
    expiresAt,
  };
}

export async function consumePortalLoginVerification(
  db: PrismaClient,
  input: {
    token: string | null | undefined;
    userAgent?: string | null;
    ipAddress?: string | null;
    now?: Date;
  }
): Promise<
  | {
      ok: true;
      portalUserId: string;
      email: string;
      sessionToken: string;
    }
  | {
      ok: false;
      reason: 'missing_token' | 'invalid_or_expired';
    }
> {
  const cleanToken = input.token?.trim();

  if (!cleanToken) {
    return { ok: false, reason: 'missing_token' };
  }

  const now = input.now ?? new Date();
  const pendingSession = await db.session.findUnique({
    where: { tokenHash: hashCaseSessionToken(cleanToken) },
    select: {
      id: true,
      scope: true,
      caseId: true,
      portalUserId: true,
      contactMethod: true,
      contactValue: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  if (
    !pendingSession ||
    pendingSession.scope !== SessionScope.ANONYMOUS_DRAFT ||
    pendingSession.caseId ||
    pendingSession.portalUserId ||
    pendingSession.contactMethod !== 'EMAIL' ||
    !pendingSession.contactValue ||
    pendingSession.revokedAt ||
    pendingSession.expiresAt <= now
  ) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  const email = normalizePortalEmail(pendingSession.contactValue);
  let portalUserId = '';
  let sessionToken = '';

  await db.$transaction(async (tx) => {
    await tx.session.update({
      where: { id: pendingSession.id },
      data: {
        revokedAt: now,
        verifiedAt: now,
        lastSeenAt: now,
      },
      select: { id: true },
    });

    portalUserId = await upsertPortalUserByEmail(tx, email, now);
    sessionToken = await createPortalSession(tx, {
      caseId: null,
      portalUserId,
      email,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      now,
    });
  });

  return {
    ok: true,
    portalUserId,
    email,
    sessionToken,
  };
}
