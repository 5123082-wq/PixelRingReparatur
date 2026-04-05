import crypto from 'node:crypto';
import type { PrismaClient } from '@prisma/client';

export const DEFAULT_PUBLIC_REQUEST_NUMBER_PREFIX = 'PR';
export const PUBLIC_REQUEST_NUMBER_SEGMENT_LENGTH = 4;
export const PUBLIC_REQUEST_NUMBER_SEGMENT_COUNT = 2;
export const PUBLIC_REQUEST_NUMBER_REGEX = /^[A-Z]{2,8}(?:-[A-Z0-9]{4}){2}$/;

export type PublicRequestNumberOptions = {
  prefix?: string;
  segmentLength?: number;
  segmentCount?: number;
  maxAttempts?: number;
};

export type PrismaCaseClient = Pick<PrismaClient, 'case'>;

function normalizePrefix(prefix: string): string {
  const normalized = prefix.trim().toUpperCase().replace(/[^A-Z]/g, '');

  if (!/^[A-Z]{2,8}$/.test(normalized)) {
    throw new Error(
      'Public request number prefix must be 2-8 letters after normalization.'
    );
  }

  return normalized;
}

function buildRandomSegment(length: number): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let segment = '';

  for (let index = 0; index < length; index += 1) {
    segment += alphabet[crypto.randomInt(alphabet.length)];
  }

  return segment;
}

export function generatePublicRequestNumber(
  options: PublicRequestNumberOptions = {}
): string {
  const prefix = normalizePrefix(
    options.prefix ?? DEFAULT_PUBLIC_REQUEST_NUMBER_PREFIX
  );
  const segmentLength = options.segmentLength ?? PUBLIC_REQUEST_NUMBER_SEGMENT_LENGTH;
  const segmentCount = options.segmentCount ?? PUBLIC_REQUEST_NUMBER_SEGMENT_COUNT;

  if (!Number.isInteger(segmentLength) || segmentLength <= 0) {
    throw new Error('Public request number segment length must be a positive integer.');
  }

  if (!Number.isInteger(segmentCount) || segmentCount <= 0) {
    throw new Error('Public request number segment count must be a positive integer.');
  }

  const segments = Array.from({ length: segmentCount }, () =>
    buildRandomSegment(segmentLength)
  );

  return [prefix, ...segments].join('-');
}

export function isPublicRequestNumberFormat(value: string): boolean {
  return PUBLIC_REQUEST_NUMBER_REGEX.test(value);
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}

async function isPublicRequestNumberTaken(
  prisma: PrismaCaseClient,
  publicRequestNumber: string
): Promise<boolean> {
  const existingCase = await prisma.case.findUnique({
    where: { publicRequestNumber },
    select: { id: true },
  });

  return existingCase !== null;
}

export async function findAvailablePublicRequestNumber(
  prisma: PrismaCaseClient,
  options: PublicRequestNumberOptions = {}
): Promise<string> {
  const maxAttempts = options.maxAttempts ?? 25;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = generatePublicRequestNumber(options);

    if (await isPublicRequestNumberTaken(prisma, candidate)) {
      continue;
    }

    return candidate;
  }

  throw new Error(
    `Unable to generate a free public request number after ${maxAttempts} attempts.`
  );
}

export async function ensurePublicRequestNumberForCase(
  prisma: PrismaCaseClient,
  caseId: string,
  options: PublicRequestNumberOptions = {}
): Promise<string> {
  const maxAttempts = options.maxAttempts ?? 25;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const currentCase = await prisma.case.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        publicRequestNumber: true,
      },
    });

    if (!currentCase) {
      throw new Error(`Case not found: ${caseId}`);
    }

    if (currentCase.publicRequestNumber) {
      return currentCase.publicRequestNumber;
    }

    const candidate = generatePublicRequestNumber(options);

    if (await isPublicRequestNumberTaken(prisma, candidate)) {
      continue;
    }

    try {
      const updateResult = await prisma.case.updateMany({
        where: {
          id: caseId,
          publicRequestNumber: null,
        },
        data: { publicRequestNumber: candidate },
      });

      if (updateResult.count === 1) {
        return candidate;
      }
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `Unable to assign a public request number to case ${caseId} after ${maxAttempts} attempts.`
  );
}
