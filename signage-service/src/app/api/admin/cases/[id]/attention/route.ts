import { publishPortalInvalidation } from '@/lib/portal/realtime';
export const maxDuration = 60;
import { Prisma } from '@prisma/client';
import { after } from 'next/server';
import { deliverAttentionEmails } from '@/lib/portal-attention/delivery';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { documentActor, documentFailure, lockDocumentCase } from '@/lib/case-documents/service';
import { DocumentError, DOCUMENT_ID } from '@/lib/case-documents/types';
import { attentionEvidence, attentionOptions, attentionView, attentionJson, createAttentionForCase, adminAttentionAudit } from '@/lib/portal-attention/service';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, { params }: Context) {
  try { const { id } = await params; await documentActor(request, id);
    const rows = await prisma.portalAttention.findMany({ where: { caseId: id }, include: { case: true, portalUser: true, email: true }, orderBy: { createdAt: 'desc' } });
    return attentionJson({ items: await Promise.all(rows.map(async row => ({ ...attentionView(row, request.nextUrl.searchParams.get('locale') || 'de'),
      evidence: await attentionEvidence(prisma, row),
      recipient: { id: row.portalUserId, displayName: row.portalUser.displayName, email: row.portalUser.primaryEmail },
      email: row.email ? { state: row.email.state, attempts: row.email.attempts, lastError: row.email.lastError, sentAt: row.email.sentAt?.toISOString() ?? null } : null }))) });
  } catch (error) { return documentFailure(error); }
}
export async function POST(request: NextRequest, { params }: Context) {
  const guard = validateAdminCsrf(request); if (guard) return guard;
  try { const { id } = await params; const actor = await documentActor(request, id, true); const body = await request.json().catch(() => null);
    if (!body || !DOCUMENT_ID.test(body.id || '') || !['create', 'complete', 'cancel', 'retry-email'].includes(body.action)) throw new DocumentError('invalid_input');
    await prisma.$transaction(async tx => {
      const record = await lockDocumentCase(tx, id, actor);
      if (body.action === 'create') {
        if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 160 || typeof body.body !== 'string' || body.body.length > 2000) throw new DocumentError('invalid_input');
        if (!record.publicRequestNumber) throw new DocumentError('request_number_required', 409);
        const rows = await createAttentionForCase(tx, { caseId: id, sourceId: body.id, kind: 'REQUEST', title: body.title.trim(), body: body.body.trim(), ...attentionOptions(body) });
        if (!rows.length) throw new DocumentError('portal_required', 409);
        await tx.case.update({ where: { id }, data: { updatedAt: new Date() } });
      } else {
        await tx.$queryRaw(Prisma.sql`SELECT id FROM portal_attention WHERE id = ${body.id}::uuid FOR UPDATE`);
        const row = await tx.portalAttention.findFirst({ where: { id: body.id, caseId: id } });
        if (!row) throw new DocumentError('not_found', 404);
        if (body.action === 'retry-email') {
          await tx.portalAttentionEmail.updateMany({ where: { attentionId: row.id, state: 'FAILED' }, data: { state: 'PENDING', attempts: 0, nextAttemptAt: new Date(), lastError: null } });
        } else {
          if (row.mode === 'NONE' || ['COMPLETED', 'CANCELLED'].includes(row.state)) throw new DocumentError('invalid_action', 409);
          if (body.action === 'complete' && (row.state !== 'SUBMITTED' || body.evidenceId !== row.evidenceId || !(await attentionEvidence(tx, row)))) throw new DocumentError('response_required', 409);
          await tx.portalAttention.update({ where: { id: row.id }, data: { state: body.action === 'complete' ? 'COMPLETED' : 'CANCELLED', completedAt: new Date() } });
        }
      }
      await adminAttentionAudit(tx, actor, id, body.id, 'ATTENTION_' + body.action.toUpperCase());
    });
    await publishPortalInvalidation(id).catch(() => console.error('Portal invalidation publish failed'));
    after(() => deliverAttentionEmails({ caseId: id }).then(() => undefined));
    return attentionJson({ success: true });
  } catch (error) { return documentFailure(error); }
}
