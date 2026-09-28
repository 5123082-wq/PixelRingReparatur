import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { getPublicWorkResult } from '@/lib/work-results/service';
import { getWorkResultCopy } from '@/lib/work-results/copy';
import WorkResultView from '@/components/portal/WorkResultView';
import PortalEntry from '@/components/portal/PortalEntry';

export default async function PrintReportPage({ params }: { params: Promise<{ locale: string; publicRequestNumber: string }> }) {
  const { locale, publicRequestNumber } = await params;
  const session = await getPortalSessionContext(prisma, (await cookies()).get(PORTAL_SESSION_COOKIE_NAME)?.value);
  if (!session) return <PortalEntry returnTo={'/portal/requests/' + encodeURIComponent(publicRequestNumber) + '/report/print'} />;
  const result = await getPublicWorkResult(session.portalUserId, publicRequestNumber);
  if (!result) notFound();
  return <main className="mx-auto min-h-screen max-w-5xl bg-white p-4 sm:p-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <Link className="report-controls mb-5 inline-block text-sm font-bold" href={'/portal/requests/' + encodeURIComponent(publicRequestNumber)}>{getWorkResultCopy(locale).back}</Link>
    <WorkResultView result={result} locale={locale} publicRequestNumber={publicRequestNumber} printVersion />
  </main>;
}
