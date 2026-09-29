import PortalRequestDetailRoute from '@/components/portal/PortalRequestDetailRoute';

export default async function PortalRequestDetailModalPage({
  params,
  searchParams,
}: {
  searchParams: Promise<{ attention?: string }>;
  params: Promise<{ locale: string; publicRequestNumber: string }>;
}) {
  const { locale, publicRequestNumber } = await params;
  const { attention } = await searchParams;

  return (
    <PortalRequestDetailRoute
      attentionId={typeof attention === 'string' ? attention : undefined}
      locale={locale}
      publicRequestNumber={publicRequestNumber}
      presentation="modal"
    />
  );
}
