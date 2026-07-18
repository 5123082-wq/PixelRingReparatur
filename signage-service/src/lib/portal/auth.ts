import crypto from 'node:crypto';
import { SessionScope, type Prisma, type PrismaClient } from '@prisma/client';

import { getPortalDemoEmail, isPortalDemoEnabled } from './demo-data';
import {
  createCaseSessionToken,
  hashCaseSessionToken,
} from '@/lib/case-session';

export const PORTAL_DEMO_COOKIE_NAME = 'pixelring_portal_demo';
export const PORTAL_DEMO_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;
export const PORTAL_SESSION_COOKIE_NAME = 'pixelring_portal_session';
export const PORTAL_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type PortalAuthDb = PrismaClient | Prisma.TransactionClient;

export type PortalSessionContext = {
  sessionId: string;
  portalUserId: string;
  email: string;
};

export function normalizePortalEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function createPortalDemoCookieValue(email: string): string {
  const normalizedEmail = normalizePortalEmail(email);
  return crypto
    .createHash('sha256')
    .update(`portal-demo:${normalizedEmail}:${getPortalDemoEmail()}`)
    .digest('hex');
}

export function isValidPortalDemoEmail(email: string): boolean {
  return normalizePortalEmail(email) === getPortalDemoEmail();
}

export function verifyPortalDemoCookie(value: string | undefined | null): boolean {
  if (!isPortalDemoEnabled() || !value) {
    return false;
  }

  const expected = createPortalDemoCookieValue(getPortalDemoEmail());
  if (value.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function getPortalSessionExpiryDate(now: Date): Date {
  return new Date(now.getTime() + PORTAL_SESSION_MAX_AGE_SECONDS * 1000);
}

export async function createPortalSession(
  db: PortalAuthDb,
  input: {
    caseId?: string | null;
    portalUserId: string;
    email: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    now?: Date;
  }
): Promise<string> {
  const now = input.now ?? new Date();
  const token = createCaseSessionToken();

  await db.session.create({
    data: {
      tokenHash: hashCaseSessionToken(token),
      scope: SessionScope.PORTAL_AUTH,
      caseId: input.caseId ?? null,
      portalUserId: input.portalUserId,
      contactMethod: 'EMAIL',
      contactValue: normalizePortalEmail(input.email),
      verifiedAt: now,
      lastSeenAt: now,
      expiresAt: getPortalSessionExpiryDate(now),
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
    },
    select: { id: true },
  });

  return token;
}

export async function verifyPortalSessionCookie(
  db: PrismaClient,
  value: string | undefined | null
): Promise<boolean> {
  return (
    (await getPortalSessionContext(db, value, { touchLastSeen: false })) !== null
  );
}

export async function getPortalSessionContext(
  db: PrismaClient,
  value: string | undefined | null,
  options: { touchLastSeen?: boolean } = {}
): Promise<PortalSessionContext | null> {
  if (!value) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { tokenHash: hashCaseSessionToken(value) },
    select: {
      id: true,
      scope: true,
      revokedAt: true,
      expiresAt: true,
      caseId: true,
      portalUserId: true,
      contactValue: true,
      portalUser: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (
    !session ||
    session.scope !== SessionScope.PORTAL_AUTH ||
    session.revokedAt ||
    session.expiresAt <= new Date() ||
    !session.portalUserId ||
    !session.contactValue ||
    session.portalUser?.status !== 'ACTIVE'
  ) {
    return null;
  }

  if (options.touchLastSeen !== false) {
    await db.session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
      select: { id: true },
    });
  }

  return {
    sessionId: session.id,
    portalUserId: session.portalUserId,
    email: normalizePortalEmail(session.contactValue),
  };
}

export async function revokePortalSessionCookie(
  db: PrismaClient,
  value: string | undefined | null
): Promise<void> {
  if (!value) {
    return;
  }

  await db.session.updateMany({
    where: {
      tokenHash: hashCaseSessionToken(value),
      scope: SessionScope.PORTAL_AUTH,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
