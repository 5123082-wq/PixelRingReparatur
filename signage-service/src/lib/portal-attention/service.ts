import { publishPortalUserInvalidation } from '@/lib/portal/realtime';
import 'server-only';
import { getAttentionCopy } from './copy';
import { getWorkResultCopy } from '@/lib/work-results/copy';
import { Prisma, type PortalAttention } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { DocumentError, DOCUMENT_ID } from '@/lib/case-documents/types';
import { createAdminAuditLog, type AdminRequestActor } from '@/lib/admin-audit';
import { checkRateLimit } from '@/lib/rate-limit';
import { ATTENTION_IMAGE_MIME_TYPES, type AttentionEvidence, ATTENTION_LOCALES, ATTENTION_MODES, type AttentionItem, type AttentionKind, type AttentionMode } from './types';

export function attentionOptions(input: unknown) {
  const value = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const mode = value.attentionMode ?? value.mode ?? 'ACKNOWLEDGE';
  if (!ATTENTION_MODES.includes(mode as AttentionMode)) throw new DocumentError('invalid_input');
  const rawDate = value.attentionDueAt ?? value.dueAt;
  const dueAt = rawDate ? new Date(String(rawDate)) : null;
  if (dueAt && (!Number.isFinite(dueAt.getTime()) || dueAt.getTime() < Date.now() - 60_000)) throw new DocumentError('invalid_due_date');
  return { mode: mode as AttentionMode, dueAt: mode === 'NONE' ? null : dueAt };
}
export function attentionView(row: PortalAttention & { case: { publicRequestNumber: string | null } }, locale = 'de'): AttentionItem {
  const language = ATTENTION_LOCALES.includes(locale) ? locale : 'de';
  const copy = getAttentionCopy(language);
  const reportCopy = getWorkResultCopy(language);
  const statusTitles: Record<string, string> = { WAITING_FOR_CUSTOMER: copy.waitingStatus, IN_PROGRESS: copy.progressStatus, ON_HOLD: copy.holdStatus, COMPLETED: copy.closedStatus, CANCELLED: copy.closedStatus, WORK_COMPLETED: reportCopy.next, READY_FOR_PICKUP: reportCopy.ready };
  const title = row.kind === 'STATUS' ? statusTitles[row.title] || copy.reviewStatus : row.kind === 'REPORT' ? reportCopy.title : row.kind === 'MESSAGE' ? copy.MESSAGE : row.title;
  const requestNumber = row.case.publicRequestNumber || '';
  const base = `/portal/requests/${encodeURIComponent(requestNumber)}`;
  const anchor = row.kind === 'DOCUMENT' ? 'document-' + row.sourceId : row.kind === 'REPORT' ? 'repair-report' : row.kind === 'REQUEST' ? 'request-chat' : row.kind === 'MESSAGE' ? 'request-chat' : 'request-status';
  return { id: row.id, publicRequestNumber: requestNumber, kind: row.kind as AttentionKind, sourceId: row.sourceId,
    title, body: row.body, documentType: row.documentType, mode: row.mode as AttentionItem['mode'], state: row.state as AttentionItem['state'],
    readAt: row.readAt?.toISOString() ?? null, dueAt: row.dueAt?.toISOString() ?? null,
    submittedAt: row.submittedAt?.toISOString() ?? null, completedAt: row.completedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(), href: `${base}?attention=${row.id}#${anchor}` };
}
export async function createAttentionForCase(tx: Prisma.TransactionClient, input: {
  caseId: string; kind: AttentionKind; sourceId: string; title: string; body?: string; documentType?: string;
  mode?: AttentionMode; dueAt?: Date | null; createdAt?: Date; email?: boolean;
}) {
  const record = await tx.case.findUnique({ where: { id: input.caseId }, select: { publicRequestNumber: true, locale: true } });
  if (!record?.publicRequestNumber) return [];
  const grants = await tx.portalCaseAccess.findMany({ where: { caseId: input.caseId, revokedAt: null, portalUser: { status: 'ACTIVE' } }, include: { portalUser: { include: { emails: true } } } });
  const items = [];
  for (const { portalUser } of grants) {
    const sourceKey = `${input.kind}:${input.caseId}:${input.sourceId}`;
    const row = await tx.portalAttention.upsert({ where: { portalUserId_sourceKey: { portalUserId: portalUser.id, sourceKey } }, update: {}, create: {
      caseId: input.caseId, portalUserId: portalUser.id, sourceKey, sourceId: input.sourceId,
      kind: input.kind, title: input.title, body: input.body ?? '', documentType: input.documentType,
      mode: input.mode ?? 'ACKNOWLEDGE', dueAt: input.dueAt, createdAt: input.createdAt,
    } });
    if (input.email !== false && portalUser.emails.some(e => e.emailNormalized === portalUser.primaryEmailNormalized && e.verifiedAt)) {
      const locale = portalUser.preferredLocale || record.locale || 'de';
      await tx.portalAttentionEmail.upsert({ where: { attentionId: row.id }, update: {}, create: {
        attentionId: row.id, email: portalUser.primaryEmailNormalized, locale: ATTENTION_LOCALES.includes(locale) ? locale : 'de',
      } });
    }
    items.push(row);
  }
  return items;
}
export async function attentionSession(request: NextRequest, mutation = false) {
  const session = await getPortalSessionContext(prisma, request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value);
  if (!session) throw new DocumentError('unauthorized', 401);
  if (mutation && !checkRateLimit('attention:' + session.portalUserId, { maxRequests: 90, windowMs: 60_000 }).allowed) throw new DocumentError('rate_limited', 429);
  return session;
}
export function attentionAccess(portalUserId: string): Prisma.PortalAttentionWhereInput {
  return { portalUserId, portalUser: { status: 'ACTIVE' }, case: { portalCaseAccesses: { some: { portalUserId, revokedAt: null } } } };
}
export async function listAttention(portalUserId: string, locale: string, publicRequestNumber?: string | null) {
  const where: Prisma.PortalAttentionWhereInput = { ...attentionAccess(portalUserId), ...(publicRequestNumber ? { case: { publicRequestNumber, portalCaseAccesses: { some: { portalUserId, revokedAt: null } } } } : {}) };
  const rows = await prisma.portalAttention.findMany({ where, include: { case: { select: { publicRequestNumber: true } } }, orderBy: { createdAt: 'desc' } });
  return { items: rows.map(row => attentionView(row, locale)), unreadCount: rows.filter(row => !row.readAt && row.state !== 'CANCELLED').length,
    openCount: rows.filter(row => row.mode !== 'NONE' && ['OPEN', 'SUBMITTED'].includes(row.state)).length };
}
export async function attentionEvidence(tx: Pick<Prisma.TransactionClient, 'message' | 'attachment'>, row: PortalAttention): Promise<AttentionEvidence | null> {
  if (!row.evidenceId) return null;
  if (row.mode === 'REPLY') {
    const message = await tx.message.findFirst({ where: { id: row.evidenceId, caseId: row.caseId, authorRole: 'CUSTOMER', isCustomerVisible: true,
      createdAt: { gte: row.createdAt }, session: { portalUserId: row.portalUserId } }, select: { id: true, body: true, createdAt: true } });
    return message ? { id: message.id, kind: 'REPLY', body: message.body ?? '', createdAt: message.createdAt.toISOString() } : null;
  }
  if (row.mode === 'UPLOAD') {
    const attachment = await tx.attachment.findFirst({ where: { id: row.evidenceId, caseId: row.caseId, isCustomerVisible: true,
      kind: 'IMAGE', mimeType: { in: ATTENTION_IMAGE_MIME_TYPES }, createdAt: { gte: row.createdAt }, uploadedBySession: { portalUserId: row.portalUserId } },
      select: { id: true, originalFilename: true, mimeType: true, createdAt: true } });
    return attachment ? { id: attachment.id, kind: 'UPLOAD', filename: attachment.originalFilename, mimeType: attachment.mimeType,
      href: '/api/admin/attachments/' + attachment.id, createdAt: attachment.createdAt.toISOString() } : null;
  }
  return null;
}
export async function mutateAttention(request: NextRequest, id: string, input: unknown) {
  const session = await attentionSession(request, true);
  if (!DOCUMENT_ID.test(id)) throw new DocumentError('not_found', 404);
  const body = input as { action?: unknown; messageId?: unknown; attachmentId?: unknown } | null;
  if (!body || !['read', 'acknowledge', 'submit'].includes(String(body.action))) throw new DocumentError('invalid_input');
  const result = await prisma.$transaction(async tx => {
    const accessible = await tx.portalAttention.findFirst({ where: { id, ...attentionAccess(session.portalUserId) }, select: { caseId: true } });
    if (!accessible) throw new DocumentError('not_found', 404);
    await tx.$queryRaw(Prisma.sql`SELECT id FROM cases WHERE id = ${accessible.caseId}::uuid FOR UPDATE`);
    await tx.$queryRaw(Prisma.sql`SELECT id FROM portal_attention WHERE id = ${id}::uuid FOR UPDATE`);
    const row = await tx.portalAttention.findFirst({ where: { id, ...attentionAccess(session.portalUserId) }, include: { case: { select: { publicRequestNumber: true } } } });
    if (!row) throw new DocumentError('not_found', 404);
    const now = new Date();
    const data: Prisma.PortalAttentionUpdateInput = { readAt: row.readAt ?? now };
    if (body.action === 'acknowledge') {
      if (row.mode !== 'ACKNOWLEDGE' || row.state === 'CANCELLED') throw new DocumentError('invalid_action', 409);
      data.state = 'COMPLETED'; data.completedAt = row.completedAt ?? now;
    }
    if (body.action === 'submit') {
      if (!['REPLY', 'UPLOAD'].includes(row.mode) || ['CANCELLED', 'COMPLETED'].includes(row.state)) throw new DocumentError('invalid_action', 409);
      const evidence = row.mode === 'REPLY' ? body.messageId : body.attachmentId;
      if (typeof evidence !== 'string' || !DOCUMENT_ID.test(evidence)) throw new DocumentError('evidence_required');
      if (row.state === 'SUBMITTED') {
        if (row.evidenceId !== evidence) throw new DocumentError('invalid_action', 409);
        return attentionView(row, request.nextUrl.searchParams.get('locale') || 'de');
      }
      const verified = await attentionEvidence(tx, { ...row, evidenceId: evidence });
      if (!verified) throw new DocumentError('evidence_required');
      data.state = 'SUBMITTED'; data.submittedAt = row.submittedAt ?? now; data.evidenceId = evidence;
    }
    const saved = await tx.portalAttention.update({ where: { id }, data, include: { case: { select: { publicRequestNumber: true } } } });
    await tx.adminAuditLog.create({ data: { action: 'PORTAL_ATTENTION_' + String(body.action).toUpperCase(), resourceType: 'PORTAL_ATTENTION', resourceId: id, caseId: row.caseId, details: { portalUserId: session.portalUserId, portalSessionId: session.sessionId } } });
    return attentionView(saved, request.nextUrl.searchParams.get('locale') || 'de');
  });
  await publishPortalUserInvalidation(session.portalUserId).catch(() => console.error('Portal invalidation publish failed'));
  return result;
}
export async function adminAttentionAudit(tx: Prisma.TransactionClient, actor: AdminRequestActor, caseId: string, id: string, action: string) {
  await createAdminAuditLog(tx, { actorSessionId: actor.sessionId, actorAdminUserId: actor.adminUserId, actorRole: actor.role,
    action, resourceType: 'PORTAL_ATTENTION', resourceId: id, caseId, ipAddress: actor.ipAddress, userAgent: actor.userAgent });
}
export function attentionJson(value: unknown) { return NextResponse.json(value, { headers: { 'Cache-Control': 'private, no-store' } }); }
