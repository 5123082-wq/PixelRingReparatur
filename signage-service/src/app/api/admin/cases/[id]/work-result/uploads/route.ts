import { validateAdminCsrf } from '@/lib/admin-csrf';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { head } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { createAdminAuditLog } from '@/lib/admin-audit';
import { storeAttachmentBuffer, deleteAttachment, type StoredAttachmentInput } from '@/lib/attachments';
import { workResultActor, workResultFailure, limitWorkResultMutation } from '@/lib/work-results/access';
import { lockWorkResultCase } from '@/lib/work-results/service';
import { validateWorkResultImage, WORK_RESULT_MIME_TYPES, workResultMaxBytes, readWorkResultFile } from '@/lib/work-results/files';
import { WorkResultError } from '@/lib/work-results/types';

type Context = { params: Promise<{ id: string }> };
export async function POST(request: NextRequest, { params }: Context) {
  const guard = validateAdminCsrf(request); if (guard) return guard;
  let localStored: StoredAttachmentInput | null = null;
  try {
    const { id } = await params;
    const actor = await workResultActor(request, id, true);
    limitWorkResultMutation(actor.adminUserId);
    const isFile = request.headers.get('content-type')?.includes('multipart/form-data');
    const form = isFile ? await request.formData() : null;
    const body = form ? { action: 'complete', uploadId: form.get('uploadId') } : await request.json();
    if (body?.action === 'prepare') {
      if (typeof body.mimeType !== 'string' || !WORK_RESULT_MIME_TYPES.includes(body.mimeType) ||
          typeof body.filename !== 'string' || !body.filename || body.filename.length > 255) throw new WorkResultError('file_type');
      if (!Number.isInteger(body.size) || body.size <= 0 || body.size > workResultMaxBytes()) throw new WorkResultError('file_size');
      const uploadId = crypto.randomUUID();
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[body.mimeType as string];
      const upload = await prisma.workResultUpload.create({ data: {
        id: uploadId, caseId: id, adminUserId: actor.adminUserId,
        pathname: 'work-results/' + id + '/' + uploadId + '.' + extension,
        mimeType: body.mimeType, filename: body.filename.replace(/[^\w. -]/g, '-').slice(0, 100),
        expiresAt: new Date(Date.now() + 15 * 60_000),
      } });
      return NextResponse.json({ uploadId, pathname: upload.pathname, provider: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local' });
    }
    if (body?.action !== 'complete' || typeof body.uploadId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.uploadId)) throw new WorkResultError('invalid_input');
    const upload = await prisma.workResultUpload.findFirst({ where: { id: body.uploadId, caseId: id, adminUserId: actor.adminUserId } });
    if (!upload) throw new WorkResultError('not_found', 404);
    if (upload.attachmentId) return NextResponse.json({ attachmentId: upload.attachmentId });
    if (upload.expiresAt < new Date()) throw new WorkResultError('upload_expired', 409);
    let stored: StoredAttachmentInput;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      if (form) throw new WorkResultError('invalid_input');
      const blob = await head(upload.pathname);
      if (blob.pathname !== upload.pathname || blob.size > workResultMaxBytes() || blob.contentType !== upload.mimeType) throw new WorkResultError('file_type');
      const buffer = await readWorkResultFile({ storageKey: blob.url, storageProvider: 'VERCEL_BLOB', byteSize: blob.size });
      await validateWorkResultImage(buffer, upload.mimeType);
      stored = { kind: 'IMAGE', storageProvider: 'VERCEL_BLOB', storageKey: blob.url,
        originalFilename: upload.filename, mimeType: upload.mimeType, byteSize: buffer.length,
        checksumSha256: crypto.createHash('sha256').update(buffer).digest('hex') };
    } else {
      const file = form?.get('file');
      if (!(file instanceof File) || file.size > workResultMaxBytes()) throw new WorkResultError('file_size');
      const buffer = Buffer.from(await file.arrayBuffer());
      await validateWorkResultImage(buffer, upload.mimeType);
      localStored = await storeAttachmentBuffer({ buffer, mimeType: upload.mimeType, originalFilename: upload.filename, source: 'work-results' });
      stored = localStored;
    }
    const attachmentId = await prisma.$transaction(async (tx) => {
      await lockWorkResultCase(tx, id, actor);
      const current = await tx.workResultUpload.findUniqueOrThrow({ where: { id: upload.id } });
      if (current.attachmentId) return current.attachmentId;
      if (current.expiresAt < new Date()) throw new WorkResultError('upload_expired', 409);
      const attachment = await tx.attachment.create({ data: { ...stored, caseId: id, isCustomerVisible: false } });
      await tx.workResultUpload.update({ where: { id: upload.id }, data: { attachmentId: attachment.id } });
      await createAdminAuditLog(tx, {
        actorSessionId: actor.sessionId, actorAdminUserId: actor.adminUserId, actorRole: actor.role,
        action: 'WORK_RESULT_PHOTO_UPLOADED', resourceType: 'ATTACHMENT', resourceId: attachment.id, caseId: id,
        ipAddress: actor.ipAddress, userAgent: actor.userAgent,
      });
      return attachment.id;
    });
    if (localStored) {
      const used = await prisma.attachment.findUnique({ where: { id: attachmentId }, select: { storageKey: true } });
      if (used?.storageKey !== localStored.storageKey) await deleteAttachment(localStored);
    }
    localStored = null;
    return NextResponse.json({ attachmentId });
  } catch (error) {
    if (localStored) await deleteAttachment(localStored).catch(() => undefined);
    return workResultFailure(error);
  }
}
