import PortalRequestDetailRoute from '@/components/portal/PortalRequestDetailRoute';

export default async function PortalRequestDetailModalPage({
  params,
}: {
  params: Promise<{ locale: string; publicRequestNumber: string }>;
}) {
  const { locale, publicRequestNumber } = await params;

  return (
    <PortalRequestDetailRoute
      locale={locale}
      publicRequestNumber={publicRequestNumber}
      presentation="modal"
    />
  );
}
