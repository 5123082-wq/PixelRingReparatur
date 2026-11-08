import type { PrismaClient } from '@prisma/client';
import { lockCase, registerPortalMessage } from '../portal-operator/state.ts';
import { getCancellationCopy } from './cancellation-copy.ts';
import { isTerminalRequest } from './request-filters.ts';

export async function requestPortalCancellation(db: PrismaClient, input: {
  portalUserId: string; portalSessionId: string; publicRequestNumber: string;
  reason: unknown; locale?: string;
}) {
  if (input.reason !== undefined && typeof input.reason !== 'string') return { error: 'invalid_input' as const };
  const reason = (input.reason as string | undefined)?.trim() || '';
  if (reason.length > 1000) return { error: 'invalid_input' as const };

  return db.$transaction(async tx => {
    const accessWhere = {
      publicRequestNumber: input.publicRequestNumber.trim().toUpperCase(),
      portalCaseAccesses: { some: { portalUserId: input.portalUserId, revokedAt: null, portalUser: { status: 'ACTIVE' as const } } },
    };
    const candidate = await tx.case.findFirst({ where: accessWhere, select: { id: true } });
    if (!candidate) return { error: 'not_found' as const };
    await lockCase(tx, candidate.id);
    const [record, session] = await Promise.all([
      tx.case.findFirst({ where: { ...accessWhere, id: candidate.id } }),
      tx.session.findFirst({ where: { id: input.portalSessionId, portalUserId: input.portalUserId,
        scope: 'PORTAL_AUTH', revokedAt: null, expiresAt: { gt: new Date() } }, select: { id: true } }),
    ]);
    if (!record || !session) return { error: 'not_found' as const };
    if (isTerminalRequest(record.status)) return { error: 'closed' as const };
    if (record.cancellationRequestedAt) return { caseId: record.id, changed: false, requestedAt: record.cancellationRequestedAt };

    const now = new Date();
    const version = await registerPortalMessage(tx, record.id);
    await tx.case.update({ where: { id: record.id }, data: { cancellationRequestedAt: now, cancellationReason: reason || null } });
    await tx.message.create({ data: {
      caseId: record.id, sessionId: session.id, channel: 'WEBSITE_CHAT', authorRole: 'CUSTOMER',
      authorName: 'Kundenportal', body: [getCancellationCopy(input.locale).message, reason].filter(Boolean).join('\n\n'),
      isCustomerVisible: true, sentAt: now, portalAttentionVersion: version.latestVersion,
    } });
    // Durable notification intent is committed with the request, without running AI.
    await tx.portalOperatorAlertState.update({ where: { caseId: record.id }, data: {
      pendingVersion: version.latestVersion, pendingReason: 'human_requested',
    } });
    await tx.adminAuditLog.create({ data: {
      action: 'PORTAL_CASE_CANCELLATION_REQUESTED', resourceType: 'CASE', resourceId: record.id, caseId: record.id,
      details: { portalUserId: input.portalUserId, portalSessionId: session.id, hasReason: Boolean(reason) },
    } });
    return { caseId: record.id, changed: true, requestedAt: now };
  });
}
