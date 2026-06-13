import { cookies } from 'next/headers';

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

import PortalAccessRequired from './PortalAccessRequired';
import PortalDemoGate from './PortalDemoGate';
import PortalRequestDetail, { PortalRequestNotFound, type PortalRequestDetailPresentation } from './PortalRequestDetail';

export default async function PortalRequestDetailRoute({
  publicRequestNumber,
  presentation = 'page',
}: {
  publicRequestNumber: string;
  presentation?: PortalRequestDetailPresentation;
}) {
  const cookieStore = await cookies();
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
      return <PortalRequestDetail {...result.detail} canPostMessages presentation={presentation} />;
    }

    if (result?.organization) {
      return <PortalRequestNotFound organization={result.organization} presentation={presentation} />;
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
    return <PortalRequestNotFound organization={portalDemoOrganization} presentation={presentation} />;
  }

  return <PortalRequestDetail {...detail} canPostMessages={false} presentation={presentation} />;
}
