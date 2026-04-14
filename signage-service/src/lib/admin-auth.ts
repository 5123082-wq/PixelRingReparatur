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
  | {
      mode: 'password';
      email: string;
      password: string;
    }
  | {
      mode: 'master-key';
      masterKey: string;
    };

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

export function getAdminSessionTtlSeconds(): number {
  return Math.floor(getAdminSessionTtlMs() / 1000);
}

export function normalizeAdminEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isMasterKeyFallbackEnabled(): boolean {
  return process.env.ADMIN_ENABLE_MASTER_KEY_FALLBACK === 'true';
}

export function getBootstrapAdminEmail(role: AdminRole): string | null {
  const value = role === 'OWNER'
    ? process.env.ADMIN_BOOTSTRAP_OWNER_EMAIL
    : process.env.ADMIN_BOOTSTRAP_MANAGER_EMAIL;

  if (!value) {
    return null;
  }

  const normalized = normalizeAdminEmail(value);
  return normalized.length > 0 ? normalized : null;
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
  const masterKey = typeof body.masterKey === 'string' ? body.masterKey.trim() : '';

  const hasPasswordMode = email.length > 0 || password.length > 0;
  const hasMasterKeyMode = masterKey.length > 0;

  if (hasPasswordMode && hasMasterKeyMode) {
    return null;
  }

  if (hasPasswordMode) {
    if (!email || !password) {
      return null;
    }

    return {
      mode: 'password',
      email,
      password,
    };
  }

  if (hasMasterKeyMode) {
    return {
      mode: 'master-key',
      masterKey,
    };
  }

  return null;
}

export async function authenticateAdminLogin(
  prisma: AdminClient,
  role: AdminRole,
  input: AdminLoginInput
): Promise<{ user: AuthenticatedAdminUser; method: AdminLoginInput['mode'] } | null> {
  if (input.mode === 'password') {
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
      method: 'password',
    };
  }

  if (!isMasterKeyFallbackEnabled() || !validateAdminMasterKey(input.masterKey, role)) {
    return null;
  }

  const bootstrapEmail = getBootstrapAdminEmail(role);
  if (!bootstrapEmail) {
    return null;
  }

  const user = await findAdminUserByEmail(prisma, bootstrapEmail);
  if (!user || user.role !== role || user.status !== 'ACTIVE') {
    return null;
  }

  return {
    user: sanitizeAdminUser(user),
    method: 'master-key',
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
