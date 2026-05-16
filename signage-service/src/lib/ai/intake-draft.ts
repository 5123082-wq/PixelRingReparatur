import 'server-only';

import type { Prisma, PrismaClient, SessionIntakeDraft } from '@prisma/client';

import type { ExtractedPii } from './pii-redaction';

type DraftDb = PrismaClient | Prisma.TransactionClient;

export type SessionIntakeDraftPatch = ExtractedPii & {
  issueType?: string;
  summary?: string;
  locale?: string;
};

function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function clean(value: string | null | undefined): string | undefined {
  return hasText(value) ? value.trim() : undefined;
}

function isDraftTableUnavailable(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const code = 'code' in error ? String(error.code) : '';
  const message =
    'message' in error && typeof error.message === 'string'
      ? error.message
      : '';

  return (
    code === 'P2021' ||
    code === 'P2022' ||
    message.includes('session_intake_drafts')
  );
}

function buildUpdateData(
  patch: SessionIntakeDraftPatch
): Prisma.SessionIntakeDraftUncheckedUpdateInput {
  const data: Prisma.SessionIntakeDraftUncheckedUpdateInput = {};

  if (clean(patch.customerName)) data.customerName = patch.customerName?.trim();
  if (clean(patch.customerEmail)) data.customerEmail = patch.customerEmail?.trim();
  if (clean(patch.customerPhone)) data.customerPhone = patch.customerPhone?.trim();
  if (clean(patch.serviceLocation)) data.serviceLocation = patch.serviceLocation?.trim();
  if (clean(patch.issueType)) data.issueType = patch.issueType?.trim();
  if (clean(patch.summary)) data.summary = patch.summary?.trim();
  if (clean(patch.locale)) data.locale = patch.locale?.trim();

  return data;
}

function buildCreateData(
  sessionId: string,
  patch: SessionIntakeDraftPatch
): Prisma.SessionIntakeDraftUncheckedCreateInput {
  const data = buildUpdateData(patch);

  return {
    sessionId,
    customerName: typeof data.customerName === 'string' ? data.customerName : null,
    customerEmail: typeof data.customerEmail === 'string' ? data.customerEmail : null,
    customerPhone: typeof data.customerPhone === 'string' ? data.customerPhone : null,
    serviceLocation: typeof data.serviceLocation === 'string' ? data.serviceLocation : null,
    issueType: typeof data.issueType === 'string' ? data.issueType : null,
    summary: typeof data.summary === 'string' ? data.summary : null,
    locale: typeof data.locale === 'string' ? data.locale : null,
  };
}

export async function upsertSessionIntakeDraft(
  db: DraftDb,
  sessionId: string,
  patch: SessionIntakeDraftPatch
): Promise<SessionIntakeDraft | null> {
  const updateData = buildUpdateData(patch);

  if (Object.keys(updateData).length === 0) {
    return getSessionIntakeDraft(db, sessionId);
  }

  try {
    return await db.sessionIntakeDraft.upsert({
      where: { sessionId },
      create: buildCreateData(sessionId, patch),
      update: updateData,
    });
  } catch (error) {
    if (isDraftTableUnavailable(error)) {
      console.warn(
        'SessionIntakeDraft table is unavailable; skipping privacy draft persistence until migration is applied.'
      );
      return null;
    }

    throw error;
  }
}

export async function getSessionIntakeDraft(
  db: DraftDb,
  sessionId: string
): Promise<SessionIntakeDraft | null> {
  try {
    return await db.sessionIntakeDraft.findUnique({
      where: { sessionId },
    });
  } catch (error) {
    if (isDraftTableUnavailable(error)) {
      console.warn(
        'SessionIntakeDraft table is unavailable; returning empty privacy draft until migration is applied.'
      );
      return null;
    }

    throw error;
  }
}

export function mergeDraftPii(
  draft: SessionIntakeDraft | null | undefined,
  fallback?: ExtractedPii
): ExtractedPii {
  return {
    customerName: draft?.customerName || fallback?.customerName || undefined,
    customerEmail: draft?.customerEmail || fallback?.customerEmail || undefined,
    customerPhone: draft?.customerPhone || fallback?.customerPhone || undefined,
    serviceLocation: draft?.serviceLocation || fallback?.serviceLocation || undefined,
  };
}
