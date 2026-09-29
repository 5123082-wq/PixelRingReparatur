import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import { storePdfAttachment, deleteAttachment, type StoredAttachmentInput } from '@/lib/attachments';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import { documentActor, documentAudit, documentFailure, documentView, lockDocumentCase, publishDocument, readDocumentForm } from '@/lib/case-documents/service';
import { DocumentError, DOCUMENT_ID, validatePdf } from '@/lib/case-documents/types';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params; await documentActor(request, id);
    const rows = await prisma.caseDocument.findMany({ where: { caseId: id }, include: { attachment: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(rows.map(documentView), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return documentFailure(error); }
}
export async function POST(request: NextRequest, { params }: Context) {
  const guard = validateAdminCsrf(request); if (guard) return guard;
  let stored: StoredAttachmentInput | null = null;
  try {
    const { id } = await params; const actor = await documentActor(request, id, true);
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      const body = await request.json().catch(() => null);
      if (body?.action !== 'publish' || typeof body.id !== 'string') throw new DocumentError('invalid_input');
      const result = await publishDocument(id, body.id, actor, body);
      await publishCaseRealtimeEvent({ caseId: id, reason: 'case.updated' }).catch(() => undefined);
      return NextResponse.json(result);
    }
    const form = await readDocumentForm(request);
    const file = form.get('file'); const documentId = form.get('id');
    if (!(file instanceof File) || file.type !== 'application/pdf' || !/\.pdf$/i.test(file.name) || file.name.length > 255) throw new DocumentError('file_type');
    if (typeof documentId !== 'string' || !DOCUMENT_ID.test(documentId)) throw new DocumentError('invalid_input');
    const buffer = Buffer.from(await file.arrayBuffer()); validatePdf(buffer);
    const checksum = createHash('sha256').update(buffer).digest('hex');
    const existing = await prisma.caseDocument.findUnique({ where: { id: documentId }, include: { attachment: true } });
    if (existing) {
      if (existing.caseId !== id || existing.attachment.checksumSha256 !== checksum) throw new DocumentError('upload_conflict', 409);
      return NextResponse.json(documentView(existing));
    }
    stored = await storePdfAttachment(buffer, file.name);
    const candidate = stored;
    const result = await prisma.$transaction(async (tx) => {
      await lockDocumentCase(tx, id, actor);
      const duplicate = await tx.caseDocument.findUnique({ where: { id: documentId }, include: { attachment: true } });
      if (duplicate) {
        if (duplicate.caseId !== id || duplicate.attachment.checksumSha256 !== checksum) throw new DocumentError('upload_conflict', 409);
        return { document: documentView(duplicate), used: false };
      }
      const attachment = await tx.attachment.create({ data: { ...candidate, originalFilename: file.name, caseId: id, isCustomerVisible: false } });
      const row = await tx.caseDocument.create({ data: { id: documentId, caseId: id, attachmentId: attachment.id, createdById: actor.adminUserId, title: file.name.slice(0, 160) }, include: { attachment: true } });
      await documentAudit(tx, actor, 'CASE_DOCUMENT_UPLOADED', id, row.id);
      return { document: documentView(row), used: true };
    });
    if (!result.used) await deleteAttachment(stored).catch(() => undefined);
    stored = null;
    return NextResponse.json(result.document);
  } catch (error) {
    if (stored) await deleteAttachment(stored).catch(() => undefined);
    return documentFailure(error);
  }
}
