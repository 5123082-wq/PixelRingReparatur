import { Suspense } from 'react';
import PortalLoading from '@/components/portal/PortalLoading';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

import PortalDashboard from '@/components/portal/PortalDashboard';
import PortalEntry from '@/components/portal/PortalEntry';
import { prisma } from '@/lib/prisma';
import {
  PORTAL_DEMO_COOKIE_NAME,
  PORTAL_SESSION_COOKIE_NAME,
  getCachedPortalSessionContext,
  verifyPortalDemoCookie,
} from '@/lib/portal/auth';
import { getPortalDemoEmail, isPortalDemoEnabled, portalDemoOrganization } from '@/lib/portal/demo-data';
import { getPortalOrganizationForUser } from '@/lib/portal/production-data';

async function PortalContent() {
  const cookieStore = await cookies();
  const portalSession = await getCachedPortalSessionContext(
    prisma,
    cookieStore.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (portalSession) {
    const organization = await getPortalOrganizationForUser(
      prisma,
      portalSession.portalUserId,
      portalSession.email,
      await getLocale()
    );

    if (organization) {
      return <PortalDashboard organization={organization} canCreateRequests />;
    }
  }

  const hasDemoAccess = verifyPortalDemoCookie(cookieStore.get(PORTAL_DEMO_COOKIE_NAME)?.value);

  if (hasDemoAccess) {
    return <PortalDashboard organization={portalDemoOrganization} canCreateRequests={false} />;
  }

  return (
    <PortalEntry
      demoEnabled={isPortalDemoEnabled()}
      demoEmail={getPortalDemoEmail()}
    />
  );
}

export default function PortalPage() { return <Suspense fallback={<PortalLoading />}><PortalContent /></Suspense>; }
