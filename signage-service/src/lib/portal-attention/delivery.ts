import 'server-only';
import { prisma } from '@/lib/prisma';
import { sendWorkResultEmail } from '@/lib/email/portal-claim-email';
import { SITE_BASE_URL } from '@/lib/seo';
import { getDocumentCopy } from '@/lib/case-documents/copy';
import { attentionEmailLocale, getAttentionEmailCopy } from './email-copy';
import { EMAIL_LEASE_MS, MAX_EMAIL_ATTEMPTS, nextEmailAttempt } from './delivery-policy';

// SENT means accepted by the email transport, not inbox delivery or reading.
// A compare-and-swap lease prevents concurrent workers sending the same row.
export async function deliverAttentionEmails(options: { caseId?: string; limit?: number } = {}) {
  const now = new Date();
  await prisma.portalAttentionEmail.updateMany({
    where: { state: 'SENDING', attempts: { gte: MAX_EMAIL_ATTEMPTS },
      startedAt: { lt: new Date(now.getTime() - EMAIL_LEASE_MS) },
      ...(options.caseId ? { attention: { caseId: options.caseId } } : {}),
    },
    data: { state: 'FAILED', lastError: 'transport_not_confirmed' },
  });
  const rows = await prisma.portalAttentionEmail.findMany({
    where: {
      ...(options.caseId ? { attention: { caseId: options.caseId } } : {}),
      attempts: { lt: MAX_EMAIL_ATTEMPTS },
      OR: [
        { state: { in: ['PENDING', 'FAILED'] }, nextAttemptAt: { lte: now } },
        { state: 'SENDING', startedAt: { lt: new Date(now.getTime() - EMAIL_LEASE_MS) } },
      ],
    },
    orderBy: { nextAttemptAt: 'asc' }, take: Math.max(1, Math.min(options.limit || 10, 20)),
    include: { attention: { include: { case: true, portalUser: true } } },
  });
  const result = { accepted: 0, failed: 0, skipped: 0 };
  for (const row of rows) {
    // Leave time for one bounded transport operation and persisting its outcome.
    if (Date.now() - now.getTime() > 20_000) break;
    const startedAt = new Date();
    const claimed = await prisma.portalAttentionEmail.updateMany({
      where: { id: row.id, state: row.state, startedAt: row.startedAt, attempts: row.attempts },
      data: { state: 'SENDING', startedAt, attempts: { increment: 1 }, lastError: null },
    });
    if (!claimed.count) continue;
    const claim = { id: row.id, state: 'SENDING', startedAt };
    try {
      const attention = await prisma.portalAttention.findUnique({ where: { id: row.attentionId }, include: { case: true, portalUser: true } });
      if (!attention) continue;
      const currentReport = attention.kind === 'REPORT'
        ? await prisma.workResultRevision.findFirst({ where: { id: attention.sourceId, workResult: { caseId: attention.caseId } }, select: { number: true, workResult: { select: { publishedVersion: true } } } })
        : null;
      const obsoleteReport = attention.kind === 'REPORT' && (!currentReport || currentReport.number !== currentReport.workResult.publishedVersion);
      const grant = await prisma.portalCaseAccess.findFirst({ where: {
        caseId: attention.caseId, portalUserId: attention.portalUserId, revokedAt: null,
        portalUser: { status: 'ACTIVE', primaryEmailNormalized: row.email,
          emails: { some: { emailNormalized: row.email, verifiedAt: { lte: new Date() } } } },
      } });
      if (!grant || !attention.case.publicRequestNumber || attention.state === 'CANCELLED' || obsoleteReport) {
        await prisma.portalAttentionEmail.updateMany({ where: claim, data: { state: 'SKIPPED', lastError: 'access_or_event_changed' } });
        result.skipped++; continue;
      }
      const locale = attentionEmailLocale(attention.portalUser.preferredLocale || row.locale);
      const copy = getAttentionEmailCopy(locale);
      const documentTypes = getDocumentCopy(locale).types;
      const documentType = attention.documentType && attention.documentType in documentTypes
        ? documentTypes[attention.documentType as keyof typeof documentTypes] : copy.document;
      const heading = attention.kind === 'DOCUMENT' ? `${copy.document}: ${documentType}`
        : attention.kind === 'REPORT' ? copy.report : attention.kind === 'REQUEST' ? copy.request : copy.update;
      const url = new URL(`/${locale}/portal/requests/${encodeURIComponent(attention.case.publicRequestNumber)}`, SITE_BASE_URL);
      url.searchParams.set('attention', attention.id);
      url.hash = `attention-${attention.id}`;
      const sent = await sendWorkResultEmail({
        to: row.email, subject: `${heading} · ${attention.case.publicRequestNumber}`,
        portalLabel: copy.portal, heading, publicRequestNumber: attention.case.publicRequestNumber,
        body: attention.title ? `${copy.body}\n\n${attention.title}` : copy.body,
        url: url.toString(), linkLabel: copy.open, locale, deliveryKey: row.id,
      });
      if (!sent.sent) throw new Error('email_not_configured');
      await prisma.portalAttentionEmail.updateMany({ where: claim, data: {
        state: 'SENT', sentAt: new Date(), providerId: sent.providerId || null, lastError: null,
      } });
      result.accepted++;
    } catch {
      await prisma.portalAttentionEmail.updateMany({ where: claim, data: {
        state: 'FAILED', lastError: 'transport_not_confirmed', nextAttemptAt: nextEmailAttempt(row.attempts + 1),
      } });
      result.failed++;
    }
  }
  return result;
}
