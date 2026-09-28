import 'server-only';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor, type AdminRequestActor } from '@/lib/admin-audit';
import { checkRateLimit } from '@/lib/rate-limit';
import { WorkResultError } from './types';

export function canAccessWorkResult(actor: AdminRequestActor, assignedOperator: string | null) {
  return actor.role === 'OWNER' || assignedOperator === null ||
    [actor.adminUserId, actor.email, actor.displayName].includes(assignedOperator);
}

export async function workResultActor(request: NextRequest, caseId: string, write = false) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(caseId)) {
    throw new WorkResultError('not_found', 404);
  }
  const actor = await requireAdminPermissionActor(prisma, request, CRM_SESSION_COOKIE_NAME,
    [write ? 'CRM_WORK_RESULT_WRITE' : 'CRM_CASE_READ']);
  if (!actor) throw new WorkResultError('not_found', 404);
  const record = await prisma.case.findUnique({ where: { id: caseId }, select: { assignedOperator: true } });
  if (!record || !canAccessWorkResult(actor, record.assignedOperator)) throw new WorkResultError('not_found', 404);
  return actor;
}

export function limitWorkResultMutation(actorId: string) {
  const result = checkRateLimit('work-result:' + actorId, { maxRequests: 60, windowMs: 60_000 });
  if (!result.allowed) throw new WorkResultError('rate_limited', 429);
}

export function workResultFailure(error: unknown) {
  if (error instanceof WorkResultError) {
    return NextResponse.json({ error: error.code, code: error.code, missingFields: error.fields }, { status: error.status });
  }
  // Do not log customer text, filenames, addresses, or storage credentials.
  console.error('Work result operation failed');
  return NextResponse.json({ error: 'operation_failed' }, { status: 500 });
}
