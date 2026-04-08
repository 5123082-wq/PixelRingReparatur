import crypto from 'node:crypto';
import type { PrismaClient, AdminRole } from '@prisma/client';

export type { AdminRole } from '@prisma/client';

export const CRM_SESSION_COOKIE_NAME = 'pixelring_crm_session';
export const CMS_SESSION_COOKIE_NAME = 'pixelring_cms_session';

const ADMIN_TOKEN_BYTES = 32;

function getManagerCrmKey(): string {
  const key = process.env.ADMIN_MASTER_KEY_CRM;
  if (!key || key.length < 16) {
    throw new Error('ADMIN_MASTER_KEY_CRM is not configured or too short.');
  }
  return key;
}

function getAdminCmsKey(): string {
  const key = process.env.ADMIN_MASTER_KEY_CMS;
  if (!key || key.length < 16) {
    throw new Error('ADMIN_MASTER_KEY_CMS is not configured or too short.');
  }
  return key;
}

function getAdminSessionTtlMs(): number {
  const hours = Number(process.env.ADMIN_SESSION_TTL_HOURS) || 12;
  return hours * 60 * 60 * 1000;
}

/**
 * Validates the master key for a specific role.
 */
export function validateAdminMasterKey(candidate: string, role: AdminRole): boolean {
  try {
    const expected = role === 'OWNER' ? getAdminCmsKey() : getManagerCrmKey();
    const candidateBuffer = Buffer.from(candidate);
    const expectedBuffer = Buffer.from(expected);

    if (candidateBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
  } catch (e) {
    console.error('Auth error:', e);
    return false;
  }
}

export function createAdminSessionToken(): string {
  return crypto.randomBytes(ADMIN_TOKEN_BYTES).toString('base64url');
}

export function hashAdminToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getAdminSessionExpiryDate(now: Date): Date {
  return new Date(now.getTime() + getAdminSessionTtlMs());
}

export async function createAdminSession(
  prisma: PrismaClient,
  options: {
    userAgent?: string | null;
    ipAddress?: string | null;
    role: AdminRole;
  }
): Promise<string> {
  const token = createAdminSessionToken();
  const tokenHash = hashAdminToken(token);
  const now = new Date();

  await prisma.adminSession.create({
    data: {
      tokenHash,
      role: options.role,
      label: options.role === 'OWNER' ? 'CMS Auth' : 'CRM Auth',
      ipAddress: options.ipAddress ?? null,
      userAgent: options.userAgent ?? null,
      expiresAt: getAdminSessionExpiryDate(now),
    },
  });

  return token;
}

/**
 * Verifies a session and returns the role if valid.
 */
export async function verifyAdminSession(
  prisma: PrismaClient,
  token: string | null | undefined
): Promise<AdminRole | null> {
  if (!token || token.trim().length === 0) {
    return null;
  }

  const tokenHash = hashAdminToken(token);
  const now = new Date();

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    select: { expiresAt: true, role: true },
  });

  if (!session || session.expiresAt <= now) {
    return null;
  }

  return session.role;
}

export async function revokeAdminSession(
  prisma: PrismaClient,
  token: string
): Promise<void> {
  const tokenHash = hashAdminToken(token);

  await prisma.adminSession.deleteMany({
    where: { tokenHash },
  });
}
