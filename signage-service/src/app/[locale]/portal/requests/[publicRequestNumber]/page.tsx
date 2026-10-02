import { Suspense } from 'react';
import PortalLoading from '@/components/portal/PortalLoading';
import PortalRequestDetailRoute from '@/components/portal/PortalRequestDetailRoute';

export default async function PortalRequestDetailPage({
  params,
  searchParams,
}: {
  searchParams: Promise<{ attention?: string }>;
  params: Promise<{ locale: string; publicRequestNumber: string }>;
}) {
  const { locale, publicRequestNumber } = await params;
  const { attention } = await searchParams;

  return <Suspense fallback={<PortalLoading />}><PortalRequestDetailRoute attentionId={typeof attention === 'string' ? attention : undefined} locale={locale} publicRequestNumber={publicRequestNumber} /></Suspense>;
}
