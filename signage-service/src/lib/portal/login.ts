import 'server-only';

import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { type PortalEmailCodePurpose, type Prisma, type PrismaClient } from '@prisma/client';

import { createCaseSessionToken } from '@/lib/case-session';
import { syncCaseCustomerProfile } from '@/lib/customer-profiles';
import { createPortalSession } from './auth';
import {
  getPortalClaimContext,
  isLikelyPortalEmail,
  normalizePortalEmail,
} from './claim';

const scryptAsync = promisify(crypto.scrypt);
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_HASH_PREFIX = 'scrypt';
const CODE_HASH_PREFIX = 'sha256';
const PORTAL_EMAIL_CODE_TTL_MINUTES = 15;
const PORTAL_EMAIL_CODE_MAX_ATTEMPTS = 5;
const PORTAL_PASSWORD_MIN_LENGTH = 10;

type PortalLoginDb = PrismaClient | Prisma.TransactionClient;

type PortalEmailCodeInput = {
  email: string;
  purpose: PortalEmailCodePurpose;
  claimToken?: string | null;
  now?: Date;
};

type PortalEmailCodeResult =
  | {
      ok: true;
      email: string;
      code: string;
      expiresAt: Date;
      publicRequestNumber?: string;
    }
  | {
      ok: false;
      reason: 'invalid_email' | 'invalid_claim' | 'not_eligible';
      email?: string;
    };

type PortalCodeVerificationResult =
  | {
      ok: true;
      email: string;
      verificationToken: string;
      expiresAt: Date;
      accountHasPassword: boolean;
    }
  | {
      ok: false;
      reason: 'invalid_or_expired' | 'too_many_attempts';
    };

type PortalPasswordCompletionResult =
  | {
      ok: true;
      email: string;
      portalUserId: string;
      sessionToken: string;
    }
  | {
      ok: false;
      reason: 'invalid_or_expired' | 'invalid_password';
    };

function addMinutes(now: Date, minutes: number): Date {
  return new Date(now.getTime() + minutes * 60 * 1000);
}

function timingSafeEquals(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createEmailCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function normalizeEmailCode(value: string): string {
  return value.replace(/[\s-]+/g, '').trim();
}

function getPortalClaimBoundEmail(input: {
  prefillEmail?: string | null;
  customerEmail?: string | null;
}): { email: string | null; hasInvalidEmailBoundary: boolean } {
  const candidates = [input.prefillEmail, input.customerEmail]
    .map((value) => (value ? normalizePortalEmail(value) : ''))
    .filter(Boolean);
  const validEmail = candidates.find(isLikelyPortalEmail);

  return {
    email: validEmail ?? null,
    hasInvalidEmailBoundary: candidates.length > 0 && !validEmail,
  };
}

function isPortalClaimEmailAllowed(input: {
  email: string;
  prefillEmail?: string | null;
  customerEmail?: string | null;
}): boolean {
  const boundEmail = getPortalClaimBoundEmail(input);

  if (boundEmail.hasInvalidEmailBoundary) {
    return false;
  }

  return !boundEmail.email || normalizePortalEmail(input.email) === boundEmail.email;
}

function hashEmailCode(input: {
  code: string;
  emailNormalized: string;
  purpose: PortalEmailCodePurpose;
  salt?: string;
}): string {
  const salt = input.salt ?? crypto.randomBytes(16).toString('base64url');
  const normalizedCode = normalizeEmailCode(input.code);
  const digest = crypto
    .createHash('sha256')
    .update(`${salt}:${input.emailNormalized}:${input.purpose}:${normalizedCode}`)
    .digest('base64url');

  return [CODE_HASH_PREFIX, salt, digest].join('$');
}

function verifyEmailCode(input: {
  code: string;
  emailNormalized: string;
  purpose: PortalEmailCodePurpose;
  storedHash: string;
}): boolean {
  const [prefix, salt, expectedDigest] = input.storedHash.split('$');

  if (prefix !== CODE_HASH_PREFIX || !salt || !expectedDigest) {
    return false;
  }

  const actual = hashEmailCode({
    code: input.code,
    emailNormalized: input.emailNormalized,
    purpose: input.purpose,
    salt,
  }).split('$')[2];

  return timingSafeEquals(Buffer.from(actual), Buffer.from(expectedDigest));
}

export function isValidPortalPassword(password: string): boolean {
  return password.trim().length >= PORTAL_PASSWORD_MIN_LENGTH;
}

export async function hashPortalPassword(password: string): Promise<string> {
  const normalized = password.trim();

  if (!isValidPortalPassword(normalized)) {
    throw new Error('Portal password must be at least 10 characters long.');
  }

  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES);
  const derivedKey = (await scryptAsync(normalized, salt, PASSWORD_KEY_LENGTH)) as Buffer;

  return [PASSWORD_HASH_PREFIX, salt.toString('base64url'), derivedKey.toString('base64url')].join('$');
}

export async function verifyPortalPassword(
  password: string,
  storedHash: string | null | undefined
): Promise<boolean> {
  if (!storedHash) {
    return false;
  }

  const [prefix, saltValue, keyValue] = storedHash.split('$');

  if (prefix !== PASSWORD_HASH_PREFIX || !saltValue || !keyValue) {
    return false;
  }

  try {
    const salt = Buffer.from(saltValue, 'base64url');
    const expectedKey = Buffer.from(keyValue, 'base64url');
    const actualKey = (await scryptAsync(password.trim(), salt, expectedKey.length)) as Buffer;

    return timingSafeEquals(actualKey, expectedKey);
  } catch {
    return false;
  }
}

async function upsertPortalUserWithVerifiedEmail(
  db: PortalLoginDb,
  input: {
    email: string;
    passwordHash?: string | null;
    displayName?: string | null;
    now: Date;
  }
): Promise<string> {
  const email = normalizePortalEmail(input.email);
  const existingPortalEmail = await db.portalUserEmail.findUnique({
    where: { emailNormalized: email },
    select: { portalUserId: true },
  });

  const passwordData = input.passwordHash
    ? {
        passwordHash: input.passwordHash,
        passwordSetAt: input.now,
      }
    : {};

  if (existingPortalEmail) {
    await db.portalUser.update({
      where: { id: existingPortalEmail.portalUserId },
      data: {
        displayName: input.displayName?.trim() || undefined,
        primaryEmail: email,
        primaryEmailNormalized: email,
        status: 'ACTIVE',
        lastLoginAt: input.now,
        ...passwordData,
      },
      select: { id: true },
    });

    await db.portalUserEmail.update({
      where: { emailNormalized: email },
      data: {
        email,
        verifiedAt: input.now,
      },
      select: { id: true },
    });

    return existingPortalEmail.portalUserId;
  }

  const existingPortalUser = await db.portalUser.findUnique({
    where: { primaryEmailNormalized: email },
    select: { id: true },
  });

  if (existingPortalUser) {
    await db.portalUser.update({
      where: { id: existingPortalUser.id },
      data: {
        displayName: input.displayName?.trim() || undefined,
        primaryEmail: email,
        primaryEmailNormalized: email,
        status: 'ACTIVE',
        lastLoginAt: input.now,
        ...passwordData,
      },
      select: { id: true },
    });

    await db.portalUserEmail.upsert({
      where: { emailNormalized: email },
      create: {
        portalUserId: existingPortalUser.id,
        email,
        emailNormalized: email,
        verifiedAt: input.now,
      },
      update: {
        email,
        verifiedAt: input.now,
      },
      select: { id: true },
    });

    return existingPortalUser.id;
  }

  const portalUser = await db.portalUser.create({
    data: {
      displayName: input.displayName?.trim() || null,
      primaryEmail: email,
      primaryEmailNormalized: email,
      status: 'ACTIVE',
      lastLoginAt: input.now,
      ...passwordData,
      emails: {
        create: {
          email,
          emailNormalized: email,
          verifiedAt: input.now,
        },
      },
    },
    select: { id: true },
  });

  return portalUser.id;
}

async function createCodeForEligibleEmail(
  db: PrismaClient,
  input: PortalEmailCodeInput,
  eligible: boolean
): Promise<PortalEmailCodeResult> {
  const now = input.now ?? new Date();
  const email = normalizePortalEmail(input.email);

  if (!isLikelyPortalEmail(email)) {
    return { ok: false, reason: 'invalid_email' };
  }

  if (!eligible) {
    return { ok: false, reason: 'not_eligible', email };
  }

  let claimData:
    | {
        claimLinkId: string;
        caseId: string;
        publicRequestNumber: string;
      }
    | null = null;

  if (input.purpose === 'CLAIM_ACCESS') {
    const claim = await getPortalClaimContext(db, input.claimToken, now);

    if (!claim.ok) {
      return { ok: false, reason: 'invalid_claim', email };
    }

    if (
      !isPortalClaimEmailAllowed({
        email,
        prefillEmail: claim.prefillEmail,
        customerEmail: claim.customerEmail,
      })
    ) {
      return { ok: false, reason: 'not_eligible', email };
    }

    claimData = {
      claimLinkId: claim.claimLinkId,
      caseId: claim.caseId,
      publicRequestNumber: claim.publicRequestNumber,
    };
  }

  const code = createEmailCode();
  const expiresAt = addMinutes(now, PORTAL_EMAIL_CODE_TTL_MINUTES);

  await db.portalEmailCode.updateMany({
    where: {
      emailNormalized: email,
      purpose: input.purpose,
      consumedAt: null,
      expiresAt: { gt: now },
    },
    data: {
      consumedAt: now,
    },
  });

  await db.portalEmailCode.create({
    data: {
      email,
      emailNormalized: email,
      codeHash: hashEmailCode({
        code,
        emailNormalized: email,
        purpose: input.purpose,
      }),
      purpose: input.purpose,
      claimLinkId: claimData?.claimLinkId ?? null,
      caseId: claimData?.caseId ?? null,
      expiresAt,
    },
    select: { id: true },
  });

  return {
    ok: true,
    email,
    code,
    expiresAt,
    publicRequestNumber: claimData?.publicRequestNumber,
  };
}

export async function createPortalSignupCode(
  db: PrismaClient,
  input: Omit<PortalEmailCodeInput, 'purpose'>
): Promise<PortalEmailCodeResult> {
  return createCodeForEligibleEmail(db, { ...input, purpose: 'SIGNUP' }, true);
}

export async function createPortalPasswordResetCode(
  db: PrismaClient,
  input: Omit<PortalEmailCodeInput, 'purpose'>
): Promise<PortalEmailCodeResult> {
  const email = normalizePortalEmail(input.email);
  const existingUser = isLikelyPortalEmail(email)
    ? await db.portalUser.findUnique({
        where: { primaryEmailNormalized: email },
        select: { id: true, status: true },
      })
    : null;

  return createCodeForEligibleEmail(db, { ...input, purpose: 'PASSWORD_RESET' }, existingUser?.status === 'ACTIVE');
}

export async function createPortalClaimAccessCode(
  db: PrismaClient,
  input: Omit<PortalEmailCodeInput, 'purpose'>
): Promise<PortalEmailCodeResult> {
  return createCodeForEligibleEmail(db, { ...input, purpose: 'CLAIM_ACCESS' }, true);
}

export async function verifyPortalCode(
  db: PrismaClient,
  input: {
    email: string;
    code: string;
    purpose: PortalEmailCodePurpose;
    now?: Date;
  }
): Promise<PortalCodeVerificationResult> {
  const now = input.now ?? new Date();
  const email = normalizePortalEmail(input.email);
  const code = normalizeEmailCode(input.code);

  if (!isLikelyPortalEmail(email) || !code) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  const record = await db.portalEmailCode.findFirst({
    where: {
      emailNormalized: email,
      purpose: input.purpose,
      consumedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      codeHash: true,
      attempts: true,
      expiresAt: true,
    },
  });

  if (!record) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  if (record.attempts >= PORTAL_EMAIL_CODE_MAX_ATTEMPTS) {
    await db.portalEmailCode.update({
      where: { id: record.id },
      data: { consumedAt: now },
      select: { id: true },
    });

    return { ok: false, reason: 'too_many_attempts' };
  }

  const valid = verifyEmailCode({
    code,
    emailNormalized: email,
    purpose: input.purpose,
    storedHash: record.codeHash,
  });

  if (!valid) {
    await db.portalEmailCode.update({
      where: { id: record.id },
      data: {
        attempts: { increment: 1 },
        consumedAt: record.attempts + 1 >= PORTAL_EMAIL_CODE_MAX_ATTEMPTS ? now : undefined,
      },
      select: { id: true },
    });

    return { ok: false, reason: 'invalid_or_expired' };
  }

  const verificationToken = createCaseSessionToken();
  const account = await db.portalUser.findUnique({
    where: { primaryEmailNormalized: email },
    select: { passwordHash: true, status: true },
  });

  await db.portalEmailCode.update({
    where: { id: record.id },
    data: {
      attempts: { increment: 1 },
      verifiedAt: now,
      verificationTokenHash: hashToken(verificationToken),
    },
    select: { id: true },
  });

  return {
    ok: true,
    email,
    verificationToken,
    expiresAt: record.expiresAt,
    accountHasPassword: Boolean(account?.status === 'ACTIVE' && account.passwordHash),
  };
}

export async function completePortalPasswordCode(
  db: PrismaClient,
  input: {
    verificationToken: string;
    password: string;
    purpose: PortalEmailCodePurpose;
    userAgent?: string | null;
    ipAddress?: string | null;
    now?: Date;
  }
): Promise<PortalPasswordCompletionResult> {
  const now = input.now ?? new Date();
  const cleanToken = input.verificationToken.trim();

  if (!cleanToken) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  if (!isValidPortalPassword(input.password)) {
    return { ok: false, reason: 'invalid_password' };
  }

  const passwordHash = await hashPortalPassword(input.password);
  let result: PortalPasswordCompletionResult = { ok: false, reason: 'invalid_or_expired' };

  await db.$transaction(async (tx) => {
    const codeRecord = await tx.portalEmailCode.findUnique({
      where: { verificationTokenHash: hashToken(cleanToken) },
      select: {
        id: true,
        email: true,
        emailNormalized: true,
        purpose: true,
        expiresAt: true,
        verifiedAt: true,
        consumedAt: true,
        claimLinkId: true,
        caseId: true,
        claimLink: {
          select: {
            id: true,
            locale: true,
            prefillEmail: true,
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
      !codeRecord ||
      codeRecord.purpose !== input.purpose ||
      !codeRecord.verifiedAt ||
      codeRecord.consumedAt ||
      codeRecord.expiresAt <= now
    ) {
      return;
    }

    if (
      input.purpose === 'CLAIM_ACCESS' &&
      (
        !codeRecord.claimLink ||
        !codeRecord.case ||
        !codeRecord.case.publicRequestNumber ||
        codeRecord.claimLink.consumedAt ||
        codeRecord.claimLink.revokedAt ||
        codeRecord.claimLink.expiresAt <= now
      )
    ) {
      return;
    }

    if (
      input.purpose === 'CLAIM_ACCESS' &&
      codeRecord.claimLink &&
      !isPortalClaimEmailAllowed({
        email: codeRecord.emailNormalized,
        prefillEmail: codeRecord.claimLink.prefillEmail,
        customerEmail: codeRecord.case?.customerEmail,
      })
    ) {
      return;
    }

    const portalUserId = await upsertPortalUserWithVerifiedEmail(tx, {
      email: codeRecord.emailNormalized,
      passwordHash,
      displayName: codeRecord.case?.customerName ?? null,
      now,
    });

    if (input.purpose === 'CLAIM_ACCESS' && codeRecord.case && codeRecord.claimLink) {
      const preferredContactMethod = codeRecord.case.primaryContactMethod ?? 'EMAIL';

      await tx.case.update({
        where: { id: codeRecord.case.id },
        data: {
          customerEmail: codeRecord.emailNormalized,
          primaryContactMethod: codeRecord.case.primaryContactMethod ?? 'EMAIL',
          primaryContactValue:
            codeRecord.case.primaryContactMethod === null
              ? codeRecord.emailNormalized
              : undefined,
        },
        select: { id: true },
      });

      await syncCaseCustomerProfile(tx, {
        caseId: codeRecord.case.id,
        customerName: codeRecord.case.customerName,
        customerEmail: codeRecord.emailNormalized,
        customerPhone: codeRecord.case.customerPhone,
        preferredLanguage: codeRecord.case.locale,
        preferredContactMethod,
      });

      await tx.portalClaimLink.update({
        where: { id: codeRecord.claimLink.id },
        data: {
          consumedAt: now,
          requestedEmail: codeRecord.emailNormalized,
        },
        select: { id: true },
      });

      await tx.portalCaseAccess.upsert({
        where: {
          portalUserId_caseId: {
            portalUserId,
            caseId: codeRecord.case.id,
          },
        },
        create: {
          portalUserId,
          caseId: codeRecord.case.id,
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
    }

    await tx.portalEmailCode.update({
      where: { id: codeRecord.id },
      data: {
        consumedAt: now,
      },
      select: { id: true },
    });

    const sessionToken = await createPortalSession(tx, {
      caseId: input.purpose === 'CLAIM_ACCESS' ? codeRecord.caseId : null,
      portalUserId,
      email: codeRecord.emailNormalized,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      now,
    });

    result = {
      ok: true,
      email: codeRecord.emailNormalized,
      portalUserId,
      sessionToken,
    };
  });

  return result;
}

export async function authenticatePortalPasswordLogin(
  db: PrismaClient,
  input: {
    email: string;
    password: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    now?: Date;
  }
): Promise<PortalPasswordCompletionResult> {
  const now = input.now ?? new Date();
  const email = normalizePortalEmail(input.email);

  if (!isLikelyPortalEmail(email) || !input.password.trim()) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  const user = await db.portalUser.findUnique({
    where: { primaryEmailNormalized: email },
    select: {
      id: true,
      status: true,
      passwordHash: true,
    },
  });

  if (!user || user.status !== 'ACTIVE') {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  const validPassword = await verifyPortalPassword(input.password, user.passwordHash);

  if (!validPassword) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  const sessionToken = await db.$transaction(async (tx) => {
    await tx.portalUser.update({
      where: { id: user.id },
      data: { lastLoginAt: now },
      select: { id: true },
    });

    return createPortalSession(tx, {
      caseId: null,
      portalUserId: user.id,
      email,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      now,
    });
  });

  return {
    ok: true,
    email,
    portalUserId: user.id,
    sessionToken,
  };
}

export async function grantPortalClaimAccessToSessionUser(
  db: PrismaClient,
  input: {
    claimToken: string;
    portalUserId: string;
    email: string;
    now?: Date;
  }
): Promise<{ ok: true } | { ok: false; reason: 'invalid_or_expired' }> {
  const now = input.now ?? new Date();
  const claim = await getPortalClaimContext(db, input.claimToken, now);

  if (!claim.ok) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  const email = normalizePortalEmail(input.email);

  if (
    !isPortalClaimEmailAllowed({
      email,
      prefillEmail: claim.prefillEmail,
      customerEmail: claim.customerEmail,
    })
  ) {
    return { ok: false, reason: 'invalid_or_expired' };
  }

  await db.$transaction(async (tx) => {
    await tx.portalClaimLink.update({
      where: { id: claim.claimLinkId },
      data: {
        consumedAt: now,
        requestedEmail: email,
      },
      select: { id: true },
    });

    await tx.portalCaseAccess.upsert({
      where: {
        portalUserId_caseId: {
          portalUserId: input.portalUserId,
          caseId: claim.caseId,
        },
      },
      create: {
        portalUserId: input.portalUserId,
        caseId: claim.caseId,
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

  return { ok: true };
}
