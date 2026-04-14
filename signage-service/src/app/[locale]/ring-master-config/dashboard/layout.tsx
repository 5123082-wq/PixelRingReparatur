import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { CMS_SESSION_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

import CmsDashboardShell from './DashboardShell';

export default async function CmsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_SESSION_COOKIE_NAME)?.value;
  const actor = await verifyAdminSession(prisma, token);

  if (!actor || actor.role !== 'OWNER') {
    notFound();
  }

  return <CmsDashboardShell>{children}</CmsDashboardShell>;
}
