import { createHash, randomInt, randomBytes, timingSafeEqual } from 'node:crypto';
import type { Prisma, PrismaClient } from '@prisma/client';
import { createPortalSession } from './portal/auth';

export const INTAKE_VERIFICATION_COOKIE = 'pixelring_intake_verification';
export const INTAKE_VERIFICATION_TTL_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 5;
type Db = PrismaClient | Prisma.TransactionClient;

export class IntakeVerificationRequiredError extends Error {
  constructor() { super('verification_required'); }
}

export function normalizeIntakeEmail(email: string) { return email.trim().toLowerCase(); }
export function validIntakeEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function hash(value: string) { return createHash('sha256').update(value).digest('hex'); }
function codeHash(token: string, email: string, code: string) {
  return hash(`intake:${token}:${email}:${code}`);
}

export async function startIntakeVerification(db: PrismaClient, emailInput: string, now = new Date()) {
  const email = normalizeIntakeEmail(emailInput);
  if (!validIntakeEmail(email)) return { ok: false as const, reason: 'invalid_email' as const };
  const token = randomBytes(32).toString('base64url');
  const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
  return db.$transaction(async (tx) => {
    // Serialize issuance per recipient across server instances. Never use account existence.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`intake:${email}`}))`;
    const recent = await tx.intakeEmailVerification.findMany({
      where: { emailNormalized: email, createdAt: { gt: new Date(now.getTime() - 15 * 60_000) } },
      orderBy: { createdAt: 'desc' }, select: { createdAt: true },
    });
    const cooldown = recent[0] ? 60 - Math.floor((now.getTime() - recent[0].createdAt.getTime()) / 1000) : 0;
    if (recent.length >= 3 || cooldown > 0) {
      return { ok: false as const, reason: 'rate_limited' as const,
        retryAfter: recent.length >= 3 ? Math.max(1, Math.ceil((recent[recent.length - 1].createdAt.getTime() + 15 * 60_000 - now.getTime()) / 1000)) : cooldown };
    }
    const expiresAt = new Date(now.getTime() + INTAKE_VERIFICATION_TTL_SECONDS * 1000);
    await tx.intakeEmailVerification.create({ data: {
      tokenHash: hash(token), emailNormalized: email, codeHash: codeHash(token, email, code), expiresAt, createdAt: now,
    } });
    return { ok: true as const, token, code, email, expiresAt };
  });
}

export async function getIntakeVerification(db: Db, token: string | undefined, emailInput: string, now = new Date()) {
  if (!token) return null;
  return db.intakeEmailVerification.findFirst({ where: {
    tokenHash: hash(token), emailNormalized: normalizeIntakeEmail(emailInput),
    consumedAt: null, expiresAt: { gt: now }, verifiedAt: { not: null },
  }, select: { id: true } });
}

export async function verifyIntakeCode(db: PrismaClient, token: string | undefined, emailInput: string, code: string, context: {
  alreadyAuthenticated?: boolean;
  userAgent?: string | null;
  ipAddress?: string | null;
} = {}, now = new Date()) {
  if (!token || !/^\d{6}$/.test(code)) return { verified: false as const };
  const email = normalizeIntakeEmail(emailInput);
  return db.$transaction(async (tx) => {
    // Reserve an attempt atomically before comparing, including concurrent guesses.
    const attempt = await tx.intakeEmailVerification.updateMany({ where: {
      tokenHash: hash(token), emailNormalized: email, consumedAt: null,
      verifiedAt: null, expiresAt: { gt: now }, attempts: { lt: MAX_ATTEMPTS },
    }, data: { attempts: { increment: 1 } } });
    if (attempt.count !== 1) return { verified: false as const };
    const record = await tx.intakeEmailVerification.findUnique({ where: { tokenHash: hash(token) } });
    if (!record || !timingSafeEqual(Buffer.from(record.codeHash), Buffer.from(codeHash(token, email, code)))) return { verified: false as const };
    const verified = await tx.intakeEmailVerification.updateMany({
      where: { id: record.id, verifiedAt: null, consumedAt: null, expiresAt: { gt: now } },
      data: { verifiedAt: now },
    });
    if (verified.count !== 1) return { verified: false as const };

    // Account lookup is allowed only after proving ownership of this email.
    // Never replace an account that signed in while this form was open.
    const account = context.alreadyAuthenticated ? null : await tx.portalUser.findFirst({
      where: { status: 'ACTIVE', OR: [
        { primaryEmailNormalized: email },
        { emails: { some: { emailNormalized: email } } },
      ] },
      select: { id: true },
    });
    if (!account) return { verified: true as const, sessionToken: null };

    // Verification and login commit together; a verified guest proof cannot later
    // be replayed to create a login, and concurrent code submissions issue one session.
    await tx.intakeEmailVerification.update({ where: { id: record.id }, data: { consumedAt: now } });
    const sessionToken = await createPortalSession(tx, {
      portalUserId: account.id, email, userAgent: context.userAgent, ipAddress: context.ipAddress, now,
    });
    await tx.portalUser.update({ where: { id: account.id }, data: { lastLoginAt: now }, select: { id: true } });
    return { verified: true as const, sessionToken };
  });
}

export async function consumeIntakeVerification(db: Db, token: string, email: string, now = new Date()) {
  const result = await db.intakeEmailVerification.updateMany({ where: {
    tokenHash: hash(token), emailNormalized: normalizeIntakeEmail(email),
    verifiedAt: { not: null }, consumedAt: null, expiresAt: { gt: now },
  }, data: { consumedAt: now } });
  if (result.count !== 1) throw new IntakeVerificationRequiredError();
}
