import 'server-only';
import { createHash } from 'node:crypto';
import { CaseStatus, type Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createAdminAuditLog, type AdminRequestActor } from '@/lib/admin-audit';
import { nextCaseStatus, normalizeTransitionReason, requiresTransitionReason } from '@/lib/case-status-machine';
import { getAdminWorkResult, lockWorkResultCase, publishWorkResultInTransaction } from '@/lib/work-results/service';
import { WorkResultError, workResultMissingFields } from '@/lib/work-results/types';
import type { CaseStatusSnapshot, CaseTransitionInput, CaseTransitionResult } from '@/lib/case-transition-types';

const statuses: string[] = Object.values(CaseStatus);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseInput(value: unknown): CaseTransitionInput {
  if (!value || typeof value !== 'object') throw new WorkResultError('invalid_input');
  const input = value as CaseTransitionInput;
  if (!statuses.includes(input.targetStatus) || typeof input.stepId !== 'string' || !uuid.test(input.stepId) ||
      !input.expected || !statuses.includes(input.expected.status) ||
      !(input.expected.statusUpdatedAt === null || (typeof input.expected.statusUpdatedAt === 'string' &&
        Number.isFinite(Date.parse(input.expected.statusUpdatedAt)))) ||
      !(input.expected.lastEventId === null || (typeof input.expected.lastEventId === 'string' && uuid.test(input.expected.lastEventId)))) {
    throw new WorkResultError('invalid_input');
  }
  const confirmation = input.confirmation;
  if (confirmation !== undefined && (!confirmation || typeof confirmation !== 'object' ||
      !(confirmation.kind === 'reason' && typeof confirmation.reason === 'string' && normalizeTransitionReason(confirmation.reason)) &&
      !(confirmation.kind === 'work_result' && Number.isInteger(confirmation.version) && confirmation.version >= 0))) {
    throw new WorkResultError('invalid_input');
  }
  return {
    targetStatus: input.targetStatus, stepId: input.stepId,
    expected: { status: input.expected.status, statusUpdatedAt: input.expected.statusUpdatedAt, lastEventId: input.expected.lastEventId },
    ...(confirmation ? { confirmation: confirmation.kind === 'reason'
      ? { kind: 'reason', reason: confirmation.reason.trim() } : { kind: 'work_result', version: confirmation.version } } : {}),
  };
}

export async function caseStatusSnapshot(tx: Prisma.TransactionClient, record: { id: string; status: CaseStatus; statusUpdatedAt: Date | null }): Promise<CaseStatusSnapshot> {
  const event = await tx.caseStatusEvent.findFirst({ where: { caseId: record.id }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], select: { id: true } });
  return { status: record.status, statusUpdatedAt: record.statusUpdatedAt?.toISOString() ?? null, lastEventId: event?.id ?? null };
}

function sameState(a: CaseStatusSnapshot, b: CaseStatusSnapshot) {
  return a.status === b.status && a.statusUpdatedAt === b.statusUpdatedAt && a.lastEventId === b.lastEventId;
}

export async function advanceCaseStatus(caseId: string, actor: AdminRequestActor, value: unknown): Promise<CaseTransitionResult> {
  const input = parseInput(value);
  const fingerprint = createHash('sha256').update(JSON.stringify({ actor: actor.adminUserId, ...input })).digest('hex');
  return prisma.$transaction(async (tx) => {
    const record = await lockWorkResultCase(tx, caseId, actor);
    if (!record.publicRequestNumber) throw new WorkResultError('request_number_required', 409);
    const state = await caseStatusSnapshot(tx, record);
    const receipt = await tx.caseStatusEvent.findFirst({
      where: { caseId, metadata: { path: ['statusTransition', 'stepId'], equals: input.stepId } },
    });
    if (receipt) {
      const metadata = receipt.metadata as { statusTransition?: { fingerprint: string } } | null;
      if (metadata?.statusTransition?.fingerprint !== fingerprint) throw new WorkResultError('step_conflict', 409);
      if (state.lastEventId !== receipt.id || state.status !== receipt.toStatus) throw new WorkResultError('status_conflict', 409);
      return { outcome: state.status === input.targetStatus ? 'done' : 'advanced', state, targetStatus: input.targetStatus };
    }
    if (!sameState(state, input.expected)) throw new WorkResultError('status_conflict', 409);
    const next = nextCaseStatus(record.status, input.targetStatus);
    if (!next) throw new WorkResultError('invalid_status', 409);
    if (next === record.status) return { outcome: 'done', state, targetStatus: input.targetStatus };
    let reason: string | null = null;
    if (next === CaseStatus.WORK_COMPLETED) {
      if (!input.confirmation) {
        const report = await getAdminWorkResult(caseId, tx);
        return { outcome: 'requires_input', state, targetStatus: input.targetStatus,
          requirement: { kind: 'work_result', stage: next, missingFields: workResultMissingFields(report.draft, actor.role, report.publishedVersion > 0) } };
      }
      if (input.confirmation.kind !== 'work_result') throw new WorkResultError('invalid_input');
    } else if (requiresTransitionReason(next)) {
      if (!input.confirmation) return { outcome: 'requires_input', state, targetStatus: input.targetStatus,
        requirement: { kind: 'reason', stage: next, missingFields: ['reason'] } };
      if (input.confirmation.kind !== 'reason') throw new WorkResultError('invalid_input');
      reason = normalizeTransitionReason(input.confirmation.reason);
    } else if (input.confirmation) throw new WorkResultError('invalid_input');

    const metadata = { statusTransition: { stepId: input.stepId, targetStatus: input.targetStatus, fingerprint } };
    if (next === CaseStatus.WORK_COMPLETED && input.confirmation?.kind === 'work_result') {
      await publishWorkResultInTransaction(tx, record, actor, input.confirmation.version, metadata);
    } else {
      const now = new Date(Math.max(Date.now(), (record.statusUpdatedAt?.getTime() ?? 0) + 1));
      await tx.case.update({ where: { id: caseId }, data: { status: next, statusUpdatedAt: now } });
      await tx.caseStatusEvent.create({ data: {
        caseId, actorSessionId: actor.sessionId, actorRole: actor.role, fromStatus: record.status,
        toStatus: next, reason, metadata, createdAt: now,
      } });
      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId, actorAdminUserId: actor.adminUserId, actorRole: actor.role,
        action: 'CASE_STATUS_CHANGED', resourceType: 'CASE', resourceId: caseId, caseId, reason,
        details: { fromStatus: record.status, toStatus: next, targetStatus: input.targetStatus },
        ipAddress: actor.ipAddress, userAgent: actor.userAgent,
      });
    }
    const updated = await tx.case.findUniqueOrThrow({ where: { id: caseId } });
    return { outcome: updated.status === input.targetStatus ? 'done' : 'advanced',
      state: await caseStatusSnapshot(tx, updated), targetStatus: input.targetStatus };
  }, { timeout: 15_000 });
}
