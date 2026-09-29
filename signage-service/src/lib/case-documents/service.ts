import 'server-only';
import { Prisma, type CaseDocument, type Attachment } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { createAdminAuditLog, requireAdminPermissionActor, type AdminRequestActor } from '@/lib/admin-audit';
import { checkRateLimit } from '@/lib/rate-limit';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { readWorkResultFile } from '@/lib/work-results/files';
import { getDocumentCopy } from './copy';
import { DocumentError, DOCUMENT_ID, MAX_DOCUMENT_BYTES, documentMetadata, type CustomerDocument, type DocumentType } from './types';

function assigned(actor: AdminRequestActor, operator: string | null) {
  return actor.role === 'OWNER' || operator === null || [actor.adminUserId, actor.email, actor.displayName].includes(operator);
}
export async function documentActor(request: NextRequest, caseId: string, write = false) {
  if (!DOCUMENT_ID.test(caseId)) throw new DocumentError('not_found', 404);
  const actor = await requireAdminPermissionActor(prisma, request, CRM_SESSION_COOKIE_NAME, [write ? 'CRM_DOCUMENT_WRITE' : 'CRM_CASE_READ']);
  if (!actor) throw new DocumentError('not_found', 404);
  const record = await prisma.case.findUnique({ where: { id: caseId }, select: { assignedOperator: true } });
  if (!record || !assigned(actor, record.assignedOperator)) throw new DocumentError('not_found', 404);
  if (write && !checkRateLimit('case-documents:' + actor.adminUserId, { maxRequests: 30, windowMs: 60_000 }).allowed) throw new DocumentError('rate_limited', 429);
  return actor;
}
export async function lockDocumentCase(tx: Prisma.TransactionClient, caseId: string, actor: AdminRequestActor) {
  await tx.$queryRaw(Prisma.sql`SELECT id FROM cases WHERE id = ${caseId}::uuid FOR UPDATE`);
  const record = await tx.case.findUnique({ where: { id: caseId } });
  if (!record || !assigned(actor, record.assignedOperator)) throw new DocumentError('not_found', 404);
  return record;
}
export function documentView(row: CaseDocument & { attachment: Pick<Attachment, 'originalFilename' | 'byteSize'> }): CustomerDocument {
  return { id: row.id, type: row.type as DocumentType, title: row.title, comment: row.comment,
    filename: row.attachment.originalFilename || 'document.pdf', byteSize: row.attachment.byteSize,
    createdAt: row.createdAt.toISOString(), publishedAt: row.publishedAt?.toISOString() || null };
}
export async function documentAudit(tx: Prisma.TransactionClient, actor: AdminRequestActor, action: string, caseId: string, id: string) {
  await createAdminAuditLog(tx, { actorSessionId: actor.sessionId, actorAdminUserId: actor.adminUserId, actorRole: actor.role,
    action, resourceType: 'CASE_DOCUMENT', resourceId: id, caseId, ipAddress: actor.ipAddress, userAgent: actor.userAgent });
}
export async function publishDocument(caseId: string, id: string, actor: AdminRequestActor, input: unknown) {
  if (!DOCUMENT_ID.test(id)) throw new DocumentError('not_found', 404);
  const metadata = documentMetadata(input);
  return prisma.$transaction(async (tx) => {
    const record = await lockDocumentCase(tx, caseId, actor);
    const current = await tx.caseDocument.findFirst({ where: { id, caseId }, include: { attachment: true } });
    if (!current) throw new DocumentError('not_found', 404);
    if (current.publishedAt) return documentView(current); // A lost response can be retried without a second message.
    if (!record.publicRequestNumber) throw new DocumentError('request_number_required', 409);
    const access = await tx.portalCaseAccess.findFirst({ where: { caseId, revokedAt: null, portalUser: { status: 'ACTIVE' } } });
    if (!access) throw new DocumentError('portal_required', 409);
    const publishedAt = new Date();
    const saved = await tx.caseDocument.update({ where: { id }, data: { ...metadata, publishedAt, publishedById: actor.adminUserId }, include: { attachment: true } });
    // Keep generic attachment visibility false: documents are exposed only through the publication-aware route.
    const copy = getDocumentCopy(record.locale);
    await tx.message.create({ data: { caseId, channel: 'WEBSITE_CHAT', authorRole: 'OPERATOR', authorName: 'PixelRing',
      body: copy.sent + ': ' + copy.types[metadata.type] + ' — ' + metadata.title + '\n' +
        '/api/portal/requests/' + encodeURIComponent(record.publicRequestNumber) + '/documents/' + id,
      isCustomerVisible: true, sentAt: publishedAt } });
    await tx.case.update({ where: { id: caseId }, data: { updatedAt: publishedAt } });
    await documentAudit(tx, actor, 'CASE_DOCUMENT_PUBLISHED', caseId, id);
    return documentView(saved);
  });
}
export async function portalDocumentCase(request: NextRequest, publicRequestNumber: string) {
  const session = await getPortalSessionContext(prisma, request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value);
  if (!session) throw new DocumentError('not_found', 404);
  const grant = await prisma.portalCaseAccess.findFirst({ where: { portalUserId: session.portalUserId, revokedAt: null,
    portalUser: { status: 'ACTIVE' }, case: { publicRequestNumber } }, select: { caseId: true } });
  if (!grant) throw new DocumentError('not_found', 404);
  return grant.caseId;
}
export async function documentFile(attachment: Attachment, download: boolean) {
  const buffer = await readWorkResultFile(attachment);
  return new NextResponse(new Uint8Array(buffer), { headers: {
    'Content-Type': 'application/pdf', 'Content-Length': String(buffer.length), 'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox",
    'Content-Disposition': (download ? 'attachment' : 'inline') + "; filename=\"document.pdf\"; filename*=UTF-8''" + encodeURIComponent(attachment.originalFilename || 'document.pdf'),
  } });
}
export function documentFailure(error: unknown) {
  const known = error instanceof DocumentError;
  if (!known) console.error('Case document operation failed');
  return NextResponse.json({ error: known ? error.code : 'operation_failed' }, { status: known ? error.status : 500, headers: { 'Cache-Control': 'private, no-store' } });
}
export async function readDocumentForm(request: NextRequest) {
  // Bound the actual streamed request, including requests without Content-Length.
  const limit = MAX_DOCUMENT_BYTES + 64 * 1024;
  if (Number(request.headers.get('content-length')) > limit) throw new DocumentError('file_size', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new DocumentError('invalid_input');
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const part = await reader.read(); if (part.done) break;
      size += part.value.byteLength;
      if (size > limit) throw new DocumentError('file_size', 413);
      chunks.push(part.value);
    }
  } finally { await reader.cancel().catch(() => undefined); }
  try { return await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData(); }
  catch { throw new DocumentError('invalid_input'); }
}
