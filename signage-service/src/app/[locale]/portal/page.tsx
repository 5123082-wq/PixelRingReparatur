import { cookies } from 'next/headers';

import PortalAccessRequired from '@/components/portal/PortalAccessRequired';
import PortalDashboard from '@/components/portal/PortalDashboard';
import PortalDemoGate from '@/components/portal/PortalDemoGate';
import { prisma } from '@/lib/prisma';
import {
  PORTAL_DEMO_COOKIE_NAME,
  PORTAL_SESSION_COOKIE_NAME,
  getPortalSessionContext,
  verifyPortalDemoCookie,
} from '@/lib/portal/auth';
import { getPortalDemoEmail, isPortalDemoEnabled, portalDemoOrganization } from '@/lib/portal/demo-data';
import { getPortalOrganizationForUser } from '@/lib/portal/production-data';

export default async function PortalPage() {
  const cookieStore = await cookies();
  const portalSession = await getPortalSessionContext(
    prisma,
    cookieStore.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (portalSession) {
    const organization = await getPortalOrganizationForUser(
      prisma,
      portalSession.portalUserId,
      portalSession.email
    );

    if (organization) {
      return <PortalDashboard organization={organization} />;
    }
  }

  const hasDemoAccess = verifyPortalDemoCookie(cookieStore.get(PORTAL_DEMO_COOKIE_NAME)?.value);

  if (hasDemoAccess) {
    return <PortalDashboard organization={portalDemoOrganization} />;
  }

  if (isPortalDemoEnabled()) {
    return (
      <PortalDemoGate
        demoEnabled={isPortalDemoEnabled()}
        demoEmail={getPortalDemoEmail()}
      />
    );
  }

  return <PortalAccessRequired />;
}
