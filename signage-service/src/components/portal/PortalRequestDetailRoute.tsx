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
import { getPublicWorkResult } from '@/lib/work-results/service';

import PortalAccessRequired from './PortalAccessRequired';
import PortalEntry from './PortalEntry';
import PortalDemoGate from './PortalDemoGate';
import PortalRequestDetail, { PortalRequestNotFound, type PortalRequestDetailPresentation } from './PortalRequestDetail';

export default async function PortalRequestDetailRoute({
  publicRequestNumber,
  locale,
  attentionId,
  presentation = 'page',
}: {
  publicRequestNumber: string;
  locale?: string | null;
  attentionId?: string;
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
      publicRequestNumber,
      locale || 'de'
    );

    if (result?.detail) {
      const workResult = await getPublicWorkResult(portalSession.portalUserId, publicRequestNumber);
      return <PortalRequestDetail {...result.detail} workResult={workResult} canPostMessages presentation={presentation} />;
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
    if (!portalSession) {
      return <PortalEntry returnTo={'/portal/requests/' + encodeURIComponent(publicRequestNumber) + (attentionId && /^[a-zA-Z0-9-]{1,80}$/.test(attentionId) ? '?attention=' + encodeURIComponent(attentionId) + '#attention-' + encodeURIComponent(attentionId) : '')} />;
    }
    return <PortalAccessRequired locale={locale} />;
  }

  const detail = getPortalDemoRequestDetail(publicRequestNumber);

  if (!detail) {
    return <PortalRequestNotFound organization={portalDemoOrganization} presentation={presentation} />;
  }

  return <PortalRequestDetail {...detail} canPostMessages={false} presentation={presentation} />;
}
