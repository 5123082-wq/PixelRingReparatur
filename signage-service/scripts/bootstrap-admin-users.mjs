import crypto from 'node:crypto';
import { promisify } from 'node:util';
import readline from 'node:readline/promises';

import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const scryptAsync = promisify(crypto.scrypt);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;

function getDatabaseUrl() {
  const value = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;

  if (!value) {
    throw new Error('Missing POSTGRES_PRISMA_URL or DATABASE_URL for bootstrap script.');
  }

  return value;
}

function normalizeConnectionString(value) {
  try {
    const url = new URL(value);
    const sslmode = url.searchParams.get('sslmode');

    if (
      sslmode &&
      ['prefer', 'require', 'verify-ca'].includes(sslmode) &&
      !url.searchParams.has('uselibpqcompat')
    ) {
      url.searchParams.set('sslmode', 'verify-full');
    }

    return url.toString();
  } catch {
    return value;
  }
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizeConnectionString(getDatabaseUrl()) }),
    log: ['error'],
  });
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

async function hashPassword(password) {
  const normalized = password.trim();

  if (normalized.length < 12) {
    throw new Error('Admin password must be at least 12 characters long.');
  }

  const salt = crypto.randomBytes(SALT_BYTES);
  const derivedKey = await scryptAsync(normalized, salt, KEY_LENGTH);
  return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
}

async function ask(question, fallback = '') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const answer = await rl.question(question);
    return answer.trim() || fallback;
  } finally {
    rl.close();
  }
}

async function collectBootstrapConfig(role) {
  const prefix = role === 'OWNER' ? 'ADMIN_BOOTSTRAP_OWNER' : 'ADMIN_BOOTSTRAP_MANAGER';
  const defaultEmail = process.env[`${prefix}_EMAIL`] ?? '';
  const defaultPassword = process.env[`${prefix}_PASSWORD`] ?? '';
  const defaultDisplayName = process.env[`${prefix}_DISPLAY_NAME`] ?? '';

  const emailInput = defaultEmail || (process.stdin.isTTY ? await ask(`${role} email: `) : '');
  const passwordInput = defaultPassword || (process.stdin.isTTY ? await ask(`${role} password: `) : '');
  const displayNameInput = defaultDisplayName || (process.stdin.isTTY ? await ask(`${role} display name (optional): `) : '');

  if (!emailInput || !passwordInput) {
    throw new Error(`Missing ${role} bootstrap credentials. Provide env vars or run interactively.`);
  }

  return {
    email: normalizeEmail(emailInput),
    password: passwordInput,
    displayName: displayNameInput || null,
  };
}

async function upsertBootstrapUser(prisma, role, config) {
  const passwordHash = await hashPassword(config.password);
  const now = new Date();
  const existing = await prisma.adminUser.findUnique({ where: { email: config.email } });

  const user = existing
    ? await prisma.adminUser.update({
        where: { id: existing.id },
        data: {
          displayName: config.displayName,
          passwordHash,
          role,
          status: 'ACTIVE',
        },
      })
    : await prisma.adminUser.create({
        data: {
          email: config.email,
          displayName: config.displayName,
          passwordHash,
          role,
          status: 'ACTIVE',
        },
      });

  await prisma.adminSession.updateMany({
    where: {
      adminUserId: user.id,
      revokedAt: null,
    },
    data: {
      revokedAt: now,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      actorAdminUserId: user.id,
      actorRole: role,
      action: existing ? 'ADMIN_BOOTSTRAP_USER_ROTATED' : 'ADMIN_BOOTSTRAP_USER_CREATED',
      resourceType: 'ADMIN_USER',
      resourceId: user.id,
      details: {
        bootstrap: true,
        email: user.email,
      },
      outcome: 'SUCCESS',
    },
  });

  return {
    email: user.email,
    created: !existing,
  };
}

async function main() {
  const prisma = createPrismaClient();

  try {
    const owner = await collectBootstrapConfig('OWNER');
    const manager = await collectBootstrapConfig('MANAGER');

    if (owner.email === manager.email) {
      throw new Error('OWNER and MANAGER bootstrap emails must be different.');
    }

    const results = [];
    results.push(await upsertBootstrapUser(prisma, 'OWNER', owner));
    results.push(await upsertBootstrapUser(prisma, 'MANAGER', manager));

    console.log(
      JSON.stringify(
        {
          success: true,
          users: results,
          masterKeyFallbackEnabled: process.env.ADMIN_ENABLE_MASTER_KEY_FALLBACK === 'true',
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
