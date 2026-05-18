import { cookies } from 'next/headers';

import PortalAccessRequired from '@/components/portal/PortalAccessRequired';
import PortalDemoGate from '@/components/portal/PortalDemoGate';
import PortalRequestDetail, { PortalRequestNotFound } from '@/components/portal/PortalRequestDetail';
import { prisma } from '@/lib/prisma';
import {
  PORTAL_DEMO_COOKIE_NAME,
  PORTAL_SESSION_COOKIE_NAME,
  getPortalSessionContext,
  verifyPortalDemoCookie,
} from '@/lib/portal/auth';
import {
  getPortalDemoEmail,
  getPortalDemoRequestDetail,
  isPortalDemoEnabled,
  portalDemoOrganization,
} from '@/lib/portal/demo-data';
import { getPortalRequestDetailForUser } from '@/lib/portal/production-data';

export default async function PortalRequestDetailPage({
  params,
}: {
  params: Promise<{ publicRequestNumber: string }>;
}) {
  const cookieStore = await cookies();
  const { publicRequestNumber } = await params;
  const portalSession = await getPortalSessionContext(
    prisma,
    cookieStore.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (portalSession) {
    const result = await getPortalRequestDetailForUser(
      prisma,
      portalSession.portalUserId,
      portalSession.email,
      publicRequestNumber
    );

    if (result?.detail) {
      return <PortalRequestDetail {...result.detail} canPostMessages />;
    }

    if (result?.organization) {
      return <PortalRequestNotFound organization={result.organization} />;
    }
  }

  const hasDemoAccess = verifyPortalDemoCookie(cookieStore.get(PORTAL_DEMO_COOKIE_NAME)?.value);

  if (!hasDemoAccess && isPortalDemoEnabled()) {
    return (
      <PortalDemoGate
        demoEnabled={isPortalDemoEnabled()}
        demoEmail={getPortalDemoEmail()}
      />
    );
  }

  if (!hasDemoAccess) {
    return <PortalAccessRequired />;
  }

  const detail = getPortalDemoRequestDetail(publicRequestNumber);

  if (!detail) {
    return <PortalRequestNotFound organization={portalDemoOrganization} />;
  }

  return <PortalRequestDetail {...detail} canPostMessages={false} />;
}
