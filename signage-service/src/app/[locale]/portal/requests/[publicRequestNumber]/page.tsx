import { cookies } from 'next/headers';

import PortalDemoGate from '@/components/portal/PortalDemoGate';
import PortalRequestDetail, { PortalRequestNotFound } from '@/components/portal/PortalRequestDetail';
import { PORTAL_DEMO_COOKIE_NAME, verifyPortalDemoCookie } from '@/lib/portal/auth';
import {
  getPortalDemoEmail,
  getPortalDemoRequestDetail,
  isPortalDemoEnabled,
  portalDemoOrganization,
} from '@/lib/portal/demo-data';

export default async function PortalRequestDetailPage({
  params,
}: {
  params: Promise<{ publicRequestNumber: string }>;
}) {
  const cookieStore = await cookies();
  const hasDemoAccess = verifyPortalDemoCookie(cookieStore.get(PORTAL_DEMO_COOKIE_NAME)?.value);

  if (!hasDemoAccess) {
    return (
      <PortalDemoGate
        demoEnabled={isPortalDemoEnabled()}
        demoEmail={getPortalDemoEmail()}
      />
    );
  }

  const { publicRequestNumber } = await params;
  const detail = getPortalDemoRequestDetail(publicRequestNumber);

  if (!detail) {
    return <PortalRequestNotFound organization={portalDemoOrganization} />;
  }

  return <PortalRequestDetail {...detail} />;
}
