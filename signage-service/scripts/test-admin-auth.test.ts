/* eslint-disable @typescript-eslint/no-explicit-any */
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

import {
  authenticateAdminLogin,
  createAdminSession,
  hasRequiredAdminRole,
  parseAdminLoginInput,
  revokeAdminSession,
  revokeAdminSessionsForUser,
  verifyAdminSession,
  type AdminRole,
} from '../src/lib/admin-auth.ts';
import { hashAdminPassword } from '../src/lib/admin-password.ts';

type UserRecord = {
  id: string;
  email: string;
  displayName: string | null;
  passwordHash: string;
  role: AdminRole;
  status: 'ACTIVE' | 'DISABLED';
  lastLoginAt: Date | null;
};

type SessionRecord = {
  id: string;
  adminUserId: string;
  tokenHash: string;
  role: AdminRole;
  label: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastSeenAt: Date | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

class FakePrisma {
  users = new Map<string, UserRecord>();
  sessions = new Map<string, SessionRecord>();
  emailIndex = new Map<string, string>();
  tokenIndex = new Map<string, string>();
  adminUser: any;
  adminSession: any;

  constructor(users: UserRecord[]) {
    this.adminUser = {};
    this.adminSession = {};

    for (const user of users) {
      this.users.set(user.id, user);
      this.emailIndex.set(user.email, user.id);
    }

    this.adminUser.findUnique = async ({ where, select }: any) => {
      if (where.email) {
        const id = this.emailIndex.get(where.email);
        const user = id ? this.users.get(id) ?? null : null;
        return user ? pick(user, select) : null;
      }

      if (where.id) {
        const user = this.users.get(where.id) ?? null;
        return user ? pick(user, select) : null;
      }

      return null;
    };

    this.adminUser.update = async ({ where, data }: any) => {
      const user = this.users.get(where.id);
      if (!user) {
        throw new Error(`Unknown user ${where.id}`);
      }

      const next = {
        ...user,
        ...data,
      };
      this.users.set(user.id, next);
      this.emailIndex.set(next.email, next.id);
      return next;
    };

    this.adminSession.create = async ({ data }: any) => {
      const id = crypto.randomUUID();
      const record: SessionRecord = {
        id,
        adminUserId: data.adminUserId,
        tokenHash: data.tokenHash,
        role: data.role,
        label: data.label ?? null,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        lastSeenAt: data.lastSeenAt ?? null,
        expiresAt: data.expiresAt,
        revokedAt: data.revokedAt ?? null,
        createdAt: new Date(),
      };

      this.sessions.set(id, record);
      this.tokenIndex.set(record.tokenHash, id);
      return record;
    };

    this.adminSession.findUnique = async ({ where, select }: any) => {
      let session: SessionRecord | null = null;

      if (where.tokenHash) {
        const id = this.tokenIndex.get(where.tokenHash);
        session = id ? this.sessions.get(id) ?? null : null;
      } else if (where.id) {
        session = this.sessions.get(where.id) ?? null;
      }

      if (!session) {
        return null;
      }

      const user = this.users.get(session.adminUserId);
      return pick(
        {
          ...session,
          adminUser: user
            ? {
                email: user.email,
                displayName: user.displayName,
                role: user.role,
                status: user.status,
              }
            : null,
        },
        select
      );
    };

    this.adminSession.update = async ({ where, data }: any) => {
      const session = this.sessions.get(where.id);
      if (!session) {
        throw new Error(`Unknown session ${where.id}`);
      }

      const next = {
        ...session,
        ...data,
      };

      this.sessions.set(session.id, next);
      this.tokenIndex.set(next.tokenHash, next.id);
      return next;
    };

    this.adminSession.updateMany = async ({ where, data }: any) => {
      let count = 0;
      for (const [id, session] of this.sessions.entries()) {
        if (where.adminUserId && session.adminUserId !== where.adminUserId) {
          continue;
        }
        if (where.tokenHash && session.tokenHash !== where.tokenHash) {
          continue;
        }
        if (Object.hasOwn(where, 'revokedAt') && session.revokedAt !== where.revokedAt) {
          continue;
        }

        this.sessions.set(id, {
          ...session,
          ...data,
        });
        count += 1;
      }

      return { count };
    };
  }
}

function pick(source: any, select: any) {
  if (!select) {
    return source;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(select)) {
    if (!value) {
      continue;
    }

    if (typeof value === 'object' && source[key] && typeof source[key] === 'object') {
      result[key] = pick(source[key], (value as any).select);
      continue;
    }

    result[key] = source[key];
  }

  return result;
}

async function buildFixture() {
  const ownerPasswordHash = await hashAdminPassword('OwnerPassword123');
  const managerPasswordHash = await hashAdminPassword('ManagerPassword123');
  const disabledPasswordHash = await hashAdminPassword('DisabledPassword123');

  return new FakePrisma([
    {
      id: 'owner-1',
      email: 'owner@pixelring.test',
      displayName: 'Owner User',
      passwordHash: ownerPasswordHash,
      role: 'OWNER',
      status: 'ACTIVE',
      lastLoginAt: null,
    },
    {
      id: 'manager-1',
      email: 'manager@pixelring.test',
      displayName: 'Manager User',
      passwordHash: managerPasswordHash,
      role: 'MANAGER',
      status: 'ACTIVE',
      lastLoginAt: null,
    },
    {
      id: 'owner-disabled',
      email: 'disabled@pixelring.test',
      displayName: 'Disabled Owner',
      passwordHash: disabledPasswordHash,
      role: 'OWNER',
      status: 'DISABLED',
      lastLoginAt: null,
    },
  ]);
}

test('parseAdminLoginInput accepts password and master-key modes and rejects mixed payloads', () => {
  assert.deepEqual(parseAdminLoginInput({ email: 'Owner@PixelRing.Test', password: 'abc123456789' }), {
    mode: 'password',
    email: 'owner@pixelring.test',
    password: 'abc123456789',
  });
  assert.deepEqual(parseAdminLoginInput({ masterKey: ' secret-key ' }), {
    mode: 'master-key',
    masterKey: 'secret-key',
  });
  assert.equal(parseAdminLoginInput({ email: 'owner@pixelring.test', password: 'x', masterKey: 'y' }), null);
  assert.equal(parseAdminLoginInput({ email: 'owner@pixelring.test' }), null);
});

test('authenticateAdminLogin succeeds for the correct role and rejects wrong-zone access', async () => {
  const prisma = await buildFixture();

  const ownerLogin = await authenticateAdminLogin(prisma as any, 'OWNER', {
    mode: 'password',
    email: 'owner@pixelring.test',
    password: 'OwnerPassword123',
  });
  assert.equal(ownerLogin?.user.role, 'OWNER');

  const wrongZone = await authenticateAdminLogin(prisma as any, 'OWNER', {
    mode: 'password',
    email: 'manager@pixelring.test',
    password: 'ManagerPassword123',
  });
  assert.equal(wrongZone, null);

  const disabledUser = await authenticateAdminLogin(prisma as any, 'OWNER', {
    mode: 'password',
    email: 'disabled@pixelring.test',
    password: 'DisabledPassword123',
  });
  assert.equal(disabledUser, null);
});

test('authenticateAdminLogin only allows master-key fallback when explicitly enabled and mapped to a bootstrap user', async (t) => {
  const prisma = await buildFixture();
  const originalEnv = {
    ADMIN_ENABLE_MASTER_KEY_FALLBACK: process.env.ADMIN_ENABLE_MASTER_KEY_FALLBACK,
    ADMIN_MASTER_KEY_CMS: process.env.ADMIN_MASTER_KEY_CMS,
    ADMIN_BOOTSTRAP_OWNER_EMAIL: process.env.ADMIN_BOOTSTRAP_OWNER_EMAIL,
  };

  t.after(() => {
    process.env.ADMIN_ENABLE_MASTER_KEY_FALLBACK = originalEnv.ADMIN_ENABLE_MASTER_KEY_FALLBACK;
    process.env.ADMIN_MASTER_KEY_CMS = originalEnv.ADMIN_MASTER_KEY_CMS;
    process.env.ADMIN_BOOTSTRAP_OWNER_EMAIL = originalEnv.ADMIN_BOOTSTRAP_OWNER_EMAIL;
  });

  process.env.ADMIN_ENABLE_MASTER_KEY_FALLBACK = 'false';
  process.env.ADMIN_MASTER_KEY_CMS = '0123456789abcdef0123456789abcdef';
  process.env.ADMIN_BOOTSTRAP_OWNER_EMAIL = 'owner@pixelring.test';

  assert.equal(
    await authenticateAdminLogin(prisma as any, 'OWNER', { mode: 'master-key', masterKey: process.env.ADMIN_MASTER_KEY_CMS }),
    null
  );

  process.env.ADMIN_ENABLE_MASTER_KEY_FALLBACK = 'true';

  const authResult = await authenticateAdminLogin(prisma as any, 'OWNER', {
    mode: 'master-key',
    masterKey: process.env.ADMIN_MASTER_KEY_CMS,
  });
  assert.equal(authResult?.user.email, 'owner@pixelring.test');
});

test('verifyAdminSession returns the named actor for valid sessions and enforces role checks', async () => {
  const prisma = await buildFixture();
  const token = await createAdminSession(prisma as any, {
    adminUserId: 'manager-1',
    role: 'MANAGER',
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
    label: 'CRM Password Login',
  });

  const actor = await verifyAdminSession(prisma as any, token);
  assert.equal(actor?.adminUserId, 'manager-1');
  assert.equal(actor?.email, 'manager@pixelring.test');
  assert.equal(hasRequiredAdminRole(actor, ['MANAGER']), true);
  assert.equal(hasRequiredAdminRole(actor, ['OWNER']), false);
});

test('verifyAdminSession rejects expired, revoked, and disabled-user sessions', async () => {
  const prisma = await buildFixture();
  const token = await createAdminSession(prisma as any, {
    adminUserId: 'owner-1',
    role: 'OWNER',
    ipAddress: null,
    userAgent: null,
    label: 'CMS Password Login',
  });

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const sessionId = prisma.tokenIndex.get(tokenHash);
  assert.ok(sessionId);

  const session = prisma.sessions.get(sessionId!);
  assert.ok(session);
  session!.expiresAt = new Date(Date.now() - 60_000);
  prisma.sessions.set(sessionId!, session!);
  assert.equal(await verifyAdminSession(prisma as any, token), null);

  const token2 = await createAdminSession(prisma as any, {
    adminUserId: 'owner-1',
    role: 'OWNER',
    ipAddress: null,
    userAgent: null,
    label: 'CMS Password Login',
  });
  await revokeAdminSession(prisma as any, token2);
  assert.equal(await verifyAdminSession(prisma as any, token2), null);

  const token3 = await createAdminSession(prisma as any, {
    adminUserId: 'owner-disabled',
    role: 'OWNER',
    ipAddress: null,
    userAgent: null,
    label: 'CMS Password Login',
  });
  assert.equal(await verifyAdminSession(prisma as any, token3), null);
});

test('revokeAdminSessionsForUser revokes every active session for the selected admin user', async () => {
  const prisma = await buildFixture();
  const first = await createAdminSession(prisma as any, {
    adminUserId: 'owner-1',
    role: 'OWNER',
    ipAddress: null,
    userAgent: null,
  });
  const second = await createAdminSession(prisma as any, {
    adminUserId: 'owner-1',
    role: 'OWNER',
    ipAddress: null,
    userAgent: null,
  });
  await createAdminSession(prisma as any, {
    adminUserId: 'manager-1',
    role: 'MANAGER',
    ipAddress: null,
    userAgent: null,
  });

  await revokeAdminSessionsForUser(prisma as any, 'owner-1');

  assert.equal(await verifyAdminSession(prisma as any, first), null);
  assert.equal(await verifyAdminSession(prisma as any, second), null);

  const remainingManagerSessions = [...prisma.sessions.values()].filter(
    (session) => session.adminUserId === 'manager-1' && session.revokedAt === null
  );
  assert.equal(remainingManagerSessions.length, 1);
});
