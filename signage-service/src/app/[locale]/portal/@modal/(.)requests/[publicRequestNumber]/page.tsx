import PortalRequestDetailRoute from '@/components/portal/PortalRequestDetailRoute';

export default async function PortalRequestDetailModalPage({
  params,
}: {
  params: Promise<{ publicRequestNumber: string }>;
}) {
  const { publicRequestNumber } = await params;

  return (
    <PortalRequestDetailRoute
      publicRequestNumber={publicRequestNumber}
      presentation="modal"
    />
  );
}
