import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import PortalDashboard from '@/components/portal/PortalDashboard';
import PortalDemoGate from '@/components/portal/PortalDemoGate';
import { PORTAL_DEMO_COOKIE_NAME, verifyPortalDemoCookie } from '@/lib/portal/auth';
import { getPortalDemoEmail, isPortalDemoEnabled, portalDemoOrganization } from '@/lib/portal/demo-data';

export default async function PortalPage() {
  if (!isPortalDemoEnabled()) {
    notFound();
  }

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

  return <PortalDashboard organization={portalDemoOrganization} />;
}
