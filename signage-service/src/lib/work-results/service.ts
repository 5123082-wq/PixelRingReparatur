import 'server-only';
import { Prisma, type Case, type CaseStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createAdminAuditLog, type AdminRequestActor } from '@/lib/admin-audit';
import { canTransitionCaseStatus } from '@/lib/case-status-machine';
import { canAccessWorkResult } from './access';
import { readWorkResultFile, validateWorkResultImage } from './files';
import { normalizeWorkResultDraft, workResultMissingFields, newWorkResultDraft, WorkResultError, type WorkResultDraft, type PublicWorkResult } from './types';

export async function lockWorkResultCase(tx: Prisma.TransactionClient, caseId: string, actor: AdminRequestActor) {
  await tx.$queryRaw(Prisma.sql`SELECT id FROM cases WHERE id = ${caseId}::uuid FOR UPDATE`);
  const record = await tx.case.findUnique({ where: { id: caseId } });
  if (!record || !canAccessWorkResult(actor, record.assignedOperator)) throw new WorkResultError('not_found', 404);
  return record;
}

export async function requirePublishedWorkResult(tx: Prisma.TransactionClient, caseId: string, to: CaseStatus) {
  if (to !== 'WORK_COMPLETED') return;
  const result = await tx.workResult.findUnique({ where: { caseId } });
  if (!result?.publishedVersion) throw new WorkResultError('work_result_required', 409, ['photos', 'completedOn']);
  const record = await tx.case.findUnique({ where: { id: caseId }, select: { statusUpdatedAt: true } });
  const revision = await tx.workResultRevision.findUnique({ where: {
    workResultId_number: { workResultId: result.id, number: result.publishedVersion },
  } });
  if (result.draft || !revision || (record?.statusUpdatedAt && revision.publishedAt < record.statusUpdatedAt)) {
    throw new WorkResultError('work_result_required', 409, ['photos', 'completedOn']);
  }
}

async function checkPhotos(tx: Prisma.TransactionClient, caseId: string, draft: WorkResultDraft) {
  const ids = draft.photos.map((photo) => photo.attachmentId);
  const attachments = await tx.attachment.findMany({
    where: { id: { in: ids }, caseId, kind: 'IMAGE',
      mimeType: { in: ['image/jpeg', 'image/png', 'image/webp'] },
      storageProvider: { in: ['LOCAL', 'VERCEL_BLOB'] } },
  });
  if (attachments.length !== ids.length) throw new WorkResultError('invalid_photos', 400, ['photos']);
}

export async function getAdminWorkResult(caseId: string, db: Prisma.TransactionClient = prisma) {
  const result = await db.workResult.findUnique({
    where: { caseId }, include: { revisions: {
      orderBy: { number: 'desc' },
      include: { photos: { orderBy: { position: 'asc' } },
        notifications: { select: { id: true, state: true, attempts: true, lastError: true, sentAt: true, startedAt: true } } },
    } },
  });
  const latest = result?.revisions[0];
  const draft = result?.draft ? normalizeWorkResultDraft(result.draft) :
    latest ? { ...normalizeWorkResultDraft(latest.content), noPhotoReason: '', correctionReason: '' } : newWorkResultDraft();
  return {
    version: result?.version ?? 0,
    publishedVersion: result?.publishedVersion ?? 0,
    hasDraft: Boolean(result?.draft),
    draft,
    published: latest ? { ...normalizeWorkResultDraft(latest.content), publishedAt: latest.publishedAt, number: latest.number } : null,
    history: result?.revisions.map((revision) => ({
      number: revision.number, publishedAt: revision.publishedAt,
      correctionReason: revision.correctionReason, noPhotoReason: revision.noPhotoReason,
    })) ?? [],
    notifications: latest?.notifications ?? [],
  };
}

export async function saveWorkResult(caseId: string, actor: AdminRequestActor, version: unknown, input: unknown) {
  const draft = normalizeWorkResultDraft(input);
  if (draft.noPhotoReason && actor.role !== 'OWNER') throw new WorkResultError('owner_required', 403);
  const selected = await prisma.attachment.findMany({ where: { caseId, id: { in: draft.photos.map((photo) => photo.attachmentId) } } });
  if (selected.length !== draft.photos.length) throw new WorkResultError('invalid_photos', 400, ['photos']);
  // Also validate legacy intake images selected for the report. Their declared
  // MIME types alone are not evidence of a decodable image.
  for (const attachment of selected) {
    await validateWorkResultImage(await readWorkResultFile(attachment), attachment.mimeType);
  }
  return prisma.$transaction(async (tx) => {
    await lockWorkResultCase(tx, caseId, actor);
    const current = await tx.workResult.findUnique({ where: { caseId } });
    if (!Number.isInteger(version) || version !== (current?.version ?? 0)) throw new WorkResultError('version_conflict', 409);
    await checkPhotos(tx, caseId, draft);
    const saved = await tx.workResult.upsert({
      where: { caseId },
      create: { caseId, version: 1, draft: draft as unknown as Prisma.InputJsonValue },
      update: { version: { increment: 1 }, draft: draft as unknown as Prisma.InputJsonValue },
    });
    await createAdminAuditLog(tx, {
      actorSessionId: actor.sessionId, actorAdminUserId: actor.adminUserId, actorRole: actor.role,
      action: 'WORK_RESULT_DRAFT_SAVED', resourceType: 'WORK_RESULT', resourceId: saved.id, caseId,
      details: { version: saved.version }, ipAddress: actor.ipAddress, userAgent: actor.userAgent,
    });
    // Return the saved version under the same lock. A later editor must not
    // replace the version that the caller will use for publication.
    return getAdminWorkResult(caseId, tx);
  });
}

export async function publishWorkResult(caseId: string, actor: AdminRequestActor, version: unknown) {
  return prisma.$transaction(async (tx) => {
    const caseRecord = await lockWorkResultCase(tx, caseId, actor);
    return publishWorkResultInTransaction(tx, caseRecord, actor, version);
  }, { timeout: 15_000 });
}

export async function publishWorkResultInTransaction(
  tx: Prisma.TransactionClient, caseRecord: Case, actor: AdminRequestActor,
  version: unknown, statusEventMetadata?: Prisma.InputJsonValue,
) {
  const caseId = caseRecord.id;
  if (!caseRecord.publicRequestNumber) throw new WorkResultError('request_number_required', 409);
  const current = await tx.workResult.findUnique({ where: { caseId } });
  if (!current || !Number.isInteger(version)) throw new WorkResultError('work_result_required', 409, ['photos', 'completedOn']);
  // The same publication may be retried after a lost response.
  if (!statusEventMetadata && !current.draft && current.publishedVersion && (version === current.version || version === current.version - 1)) {
    return { changed: false, revisionId: null };
  }
  if (current.version !== version) throw new WorkResultError('version_conflict', 409);
  if (!current.draft) throw new WorkResultError('work_result_required', 409, ['photos', 'completedOn']);
  const draft = normalizeWorkResultDraft(current.draft);
  if (draft.noPhotoReason && actor.role !== 'OWNER') throw new WorkResultError('owner_required', 403);
  const fields = workResultMissingFields(draft, actor.role, current.publishedVersion > 0);
  if (fields.length) throw new WorkResultError('work_result_required', 409, fields);
  await checkPhotos(tx, caseId, draft);
  const completing = caseRecord.status === 'IN_PROGRESS';
  if (!completing && !['WORK_COMPLETED', 'READY_FOR_PICKUP', 'COMPLETED'].includes(caseRecord.status)) {
    throw new WorkResultError('invalid_status', 409);
  }
  if (completing && !canTransitionCaseStatus(caseRecord.status, 'WORK_COMPLETED')) throw new WorkResultError('invalid_status', 409);
  const content = { ...draft, noPhotoReason: '', correctionReason: '' };
  const publishedAt = new Date(Math.max(Date.now(), (caseRecord.statusUpdatedAt?.getTime() ?? 0) + 1));
  const revision = await tx.workResultRevision.create({
    data: {
      workResultId: current.id, number: current.publishedVersion + 1,
      publishedAt,
      content: content as unknown as Prisma.InputJsonValue,
      correctionReason: draft.correctionReason || null,
      noPhotoReason: draft.noPhotoReason || null, publishedById: actor.adminUserId,
      photos: { create: draft.photos.map((photo, position) => ({
        attachmentId: photo.attachmentId, position, category: photo.category, caption: photo.caption || null,
      })) },
    },
  });
  await tx.workResult.update({ where: { id: current.id },
    data: { version: { increment: 1 }, publishedVersion: revision.number, draft: Prisma.DbNull } });
  if (completing) {
    await tx.case.update({ where: { id: caseId }, data: { status: 'WORK_COMPLETED', statusUpdatedAt: revision.publishedAt } });
    await tx.caseStatusEvent.create({ data: {
      caseId, actorSessionId: actor.sessionId, actorRole: actor.role,
      fromStatus: caseRecord.status, toStatus: 'WORK_COMPLETED',
      metadata: statusEventMetadata, createdAt: revision.publishedAt,
    } });
    await createAdminAuditLog(tx, {
      actorSessionId: actor.sessionId, actorAdminUserId: actor.adminUserId, actorRole: actor.role,
      action: 'CASE_STATUS_CHANGED', resourceType: 'CASE', resourceId: caseId, caseId,
      details: { fromStatus: caseRecord.status, toStatus: 'WORK_COMPLETED' },
    });
  }
  await createAdminAuditLog(tx, {
    actorSessionId: actor.sessionId, actorAdminUserId: actor.adminUserId, actorRole: actor.role,
    action: 'WORK_RESULT_PUBLISHED', resourceType: 'WORK_RESULT', resourceId: current.id, caseId,
    details: { revision: revision.number, photoException: Boolean(draft.noPhotoReason) },
    ipAddress: actor.ipAddress, userAgent: actor.userAgent,
  });
  const grants = await tx.portalCaseAccess.findMany({
    where: { caseId, revokedAt: null, portalUser: { status: 'ACTIVE' } },
    include: { portalUser: { include: { emails: true } } },
  });
  const recipients = new Map<string, string>();
  for (const { portalUser } of grants) {
    if (portalUser.emails.some((email) => email.emailNormalized === portalUser.primaryEmailNormalized && email.verifiedAt)) {
      recipients.set(portalUser.primaryEmailNormalized, portalUser.id);
    }
  }
  if (recipients.size) await tx.workResultNotification.createMany({ data: [...recipients].map(([email, portalUserId]) => ({
    email, portalUserId, revisionId: revision.id,
  })), skipDuplicates: true });
  return { changed: true, revisionId: revision.id };
}

export async function getPublicWorkResult(portalUserId: string, publicRequestNumber: string): Promise<PublicWorkResult | null> {
  const grant = await prisma.portalCaseAccess.findFirst({
    where: { portalUserId, revokedAt: null, portalUser: { status: 'ACTIVE' },
      case: { publicRequestNumber } },
    select: { case: { select: { workResult: { select: {
      publishedVersion: true, revisions: { orderBy: { number: 'desc' }, take: 1,
        include: { photos: { orderBy: { position: 'asc' } } } },
    } } } } },
  });
  const result = grant?.case.workResult;
  const revision = result?.revisions[0];
  if (!revision || revision.number !== result?.publishedVersion) return null;
  const content = normalizeWorkResultDraft(revision.content);
  return {
    id: revision.id, number: revision.number, completedOn: content.completedOn,
    publishedAt: revision.publishedAt.toISOString(), note: content.note, items: content.items,
    photos: revision.photos.map((photo) => ({
      id: photo.id,
      url: '/api/portal/requests/' + encodeURIComponent(publicRequestNumber) + '/work-result/photos/' + photo.id,
      category: photo.category as WorkResultDraft['photos'][number]['category'], caption: photo.caption || '',
    })),
  };
}
