import 'server-only';
import { prisma } from '@/lib/prisma';
import { sendWorkResultEmail } from '@/lib/email/portal-claim-email';
import { SITE_BASE_URL } from '@/lib/seo';
import { getWorkResultCopy, workResultLocale } from './copy';

export async function deliverWorkResultNotifications(caseId: string, retryStale = false) {
  const staleBefore = new Date(Date.now() - 5 * 60_000);
  const rows = await prisma.workResultNotification.findMany({
    where: { revision: { workResult: { caseId } }, OR: [
      { state: { in: ['PENDING', 'FAILED'] } },
      ...(retryStale ? [{ state: 'SENDING', startedAt: { lt: staleBefore } }] : []),
    ] },
    include: { revision: { include: { workResult: { include: { case: true } } } } },
  });
  for (const row of rows) {
    const startedAt = new Date();
    const claimed = await prisma.workResultNotification.updateMany({
      where: { id: row.id, state: row.state, startedAt: row.startedAt },
      data: { state: 'SENDING', startedAt, attempts: { increment: 1 }, lastError: null },
    });
    if (!claimed.count) continue;
    const claim = { id: row.id, state: 'SENDING', startedAt };
    try {
      const record = row.revision.workResult.case;
      const grant = await prisma.portalCaseAccess.findFirst({ where: {
        caseId, portalUserId: row.portalUserId, revokedAt: null,
        portalUser: { status: 'ACTIVE', primaryEmailNormalized: row.email,
          emails: { some: { emailNormalized: row.email } } },
      } });
      if (!grant || row.revision.number !== row.revision.workResult.publishedVersion) {
        await prisma.workResultNotification.updateMany({ where: claim, data: { state: 'SKIPPED', lastError: 'access_or_revision_changed' } });
        continue;
      }
      const locale = workResultLocale(record.locale);
      const copy = getWorkResultCopy(locale);
      const url = new URL('/' + locale + '/portal/requests/' + encodeURIComponent(record.publicRequestNumber || ''), SITE_BASE_URL).toString();
      const sent = await sendWorkResultEmail({
        to: row.email, subject: copy.emailSubject + ' · ' + record.publicRequestNumber,
        portalLabel: copy.emailPortalLabel, heading: copy.title,
        publicRequestNumber: record.publicRequestNumber || '',
        body: copy.emailBody, url, linkLabel: copy.openRequest, locale,
      });
      await prisma.workResultNotification.updateMany({ where: claim,
        data: sent.sent ? { state: 'SENT', sentAt: new Date() } : { state: 'FAILED', lastError: 'missing_email_config' } });
    } catch {
      await prisma.workResultNotification.updateMany({ where: claim, data: { state: 'FAILED', lastError: 'delivery_failed' } });
    }
  }
}
