import { listAttention } from '@/lib/portal-attention/service';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getCachedPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import PortalLiveProvider from '@/components/portal/PortalLiveProvider';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  const session = await getCachedPortalSessionContext(prisma, (await cookies()).get(PORTAL_SESSION_COOKIE_NAME)?.value);
  const attentionSeed = session ? await listAttention(session.portalUserId, await getLocale(), undefined, { filter: 'actions' }) : undefined;
  return (
    <PortalLiveProvider key={session?.portalUserId || 'anonymous'} accountKey={session?.portalUserId} attentionSeed={attentionSeed}>
      {children}
      {modal}
    </PortalLiveProvider>
  );
}
