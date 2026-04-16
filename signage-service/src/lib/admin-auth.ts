import crypto from 'node:crypto';
import type { Prisma, PrismaClient, AdminRole, AdminUserStatus } from '@prisma/client';

import { verifyAdminPassword } from './admin-password.ts';

export type { AdminRole, AdminUserStatus } from '@prisma/client';

export const CRM_SESSION_COOKIE_NAME = 'pixelring_crm_session';
export const CMS_SESSION_COOKIE_NAME = 'pixelring_cms_session';

const ADMIN_TOKEN_BYTES = 32;
const SESSION_TOUCH_INTERVAL_MS = 5 * 60 * 1000;

type AdminClient = PrismaClient | Prisma.TransactionClient;

type AdminUserRecord = {
  id: string;
  email: string;
  displayName: string | null;
  passwordHash: string;
  role: AdminRole;
  status: AdminUserStatus;
};

export type AuthenticatedAdminUser = Omit<AdminUserRecord, 'passwordHash'>;

export type VerifiedAdminSession = {
  sessionId: string;
  adminUserId: string;
  email: string;
  displayName: string | null;
  role: AdminRole;
  status: AdminUserStatus;
  expiresAt: Date;
  lastSeenAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
};

export type AdminLoginInput =
  {
    email: string;
    password: string;
  };

function getAdminSessionTtlMs(): number {
  const hours = Number(process.env.ADMIN_SESSION_TTL_HOURS) || 12;
  return hours * 60 * 60 * 1000;
}

export function getAdminSessionTtlSeconds(): number {
  return Math.floor(getAdminSessionTtlMs() / 1000);
}

export function normalizeAdminEmail(value: string): string {
  return value.trim().toLowerCase();
}

function sanitizeAdminUser(user: AdminUserRecord): AuthenticatedAdminUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    status: user.status,
  };
}

async function findAdminUserByEmail(
  prisma: AdminClient,
  email: string
): Promise<AdminUserRecord | null> {
  return prisma.adminUser.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      displayName: true,
      passwordHash: true,
      role: true,
      status: true,
    },
  });
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

export function parseAdminLoginInput(payload: unknown): AdminLoginInput | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const body = payload as {
    email?: unknown;
    password?: unknown;
    masterKey?: unknown;
  };

  const email = typeof body.email === 'string' ? normalizeAdminEmail(body.email) : '';
  const password = typeof body.password === 'string' ? body.password.trim() : '';

  if (typeof body.masterKey === 'string' && body.masterKey.trim().length > 0) {
    return null;
  }

  if (!email || !password) {
    return null;
  }

  return {
    email,
    password,
  };
}

export async function authenticateAdminLogin(
  prisma: AdminClient,
  role: AdminRole,
  input: AdminLoginInput
): Promise<{ user: AuthenticatedAdminUser } | null> {
  const user = await findAdminUserByEmail(prisma, input.email);
  if (!user || user.role !== role || user.status !== 'ACTIVE') {
    return null;
  }

  const validPassword = await verifyAdminPassword(input.password, user.passwordHash);
  if (!validPassword) {
    return null;
  }

  return {
    user: sanitizeAdminUser(user),
  };
}

export async function createAdminSession(
  prisma: AdminClient,
  options: {
    adminUserId: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    role: AdminRole;
    label?: string | null;
  }
): Promise<string> {
  const token = createAdminSessionToken();
  const tokenHash = hashAdminToken(token);
  const now = new Date();

  await prisma.adminSession.create({
    data: {
      adminUserId: options.adminUserId,
      tokenHash,
      role: options.role,
      label: options.label ?? (options.role === 'OWNER' ? 'CMS Auth' : 'CRM Auth'),
      ipAddress: options.ipAddress ?? null,
      userAgent: options.userAgent ?? null,
      lastSeenAt: now,
      expiresAt: getAdminSessionExpiryDate(now),
    },
  });

  return token;
}

export async function markAdminLoginSuccess(
  prisma: AdminClient,
  adminUserId: string,
  now = new Date()
): Promise<void> {
  await prisma.adminUser.update({
    where: { id: adminUserId },
    data: {
      lastLoginAt: now,
    },
  });
}

async function touchAdminSession(
  prisma: AdminClient,
  sessionId: string,
  previousLastSeenAt: Date | null,
  now: Date
): Promise<void> {
  if (previousLastSeenAt && now.getTime() - previousLastSeenAt.getTime() < SESSION_TOUCH_INTERVAL_MS) {
    return;
  }

  await prisma.adminSession.update({
    where: { id: sessionId },
    data: { lastSeenAt: now },
  });
}

/**
 * Verifies a session and returns the full actor if valid.
 */
export async function verifyAdminSession(
  prisma: AdminClient,
  token: string | null | undefined
): Promise<VerifiedAdminSession | null> {
  if (!token || token.trim().length === 0) {
    return null;
  }

  const tokenHash = hashAdminToken(token);
  const now = new Date();

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      adminUserId: true,
      role: true,
      expiresAt: true,
      revokedAt: true,
      lastSeenAt: true,
      ipAddress: true,
      userAgent: true,
      adminUser: {
        select: {
          email: true,
          displayName: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (
    !session ||
    session.expiresAt <= now ||
    session.revokedAt !== null ||
    session.adminUser.status !== 'ACTIVE' ||
    session.adminUser.role !== session.role
  ) {
    return null;
  }

  await touchAdminSession(prisma, session.id, session.lastSeenAt, now);

  return {
    sessionId: session.id,
    adminUserId: session.adminUserId,
    email: session.adminUser.email,
    displayName: session.adminUser.displayName,
    role: session.role,
    status: session.adminUser.status,
    expiresAt: session.expiresAt,
    lastSeenAt: session.lastSeenAt,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
  };
}

export function hasRequiredAdminRole(
  actor: Pick<VerifiedAdminSession, 'role'> | null | undefined,
  allowedRoles: AdminRole[]
): actor is Pick<VerifiedAdminSession, 'role'> {
  return Boolean(actor && allowedRoles.includes(actor.role));
}

export async function requireAdminSession(
  prisma: AdminClient,
  token: string | null | undefined,
  allowedRoles: AdminRole[]
): Promise<VerifiedAdminSession | null> {
  const actor = await verifyAdminSession(prisma, token);

  if (!hasRequiredAdminRole(actor, allowedRoles)) {
    return null;
  }

  return actor;
}

export async function revokeAdminSession(
  prisma: AdminClient,
  token: string
): Promise<void> {
  const tokenHash = hashAdminToken(token);

  await prisma.adminSession.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAdminSessionsForUser(
  prisma: AdminClient,
  adminUserId: string
): Promise<void> {
  await prisma.adminSession.updateMany({
    where: {
      adminUserId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
