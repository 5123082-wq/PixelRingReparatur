import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { CRM_SESSION_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

import CrmDashboardShell from './DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CRM_SESSION_COOKIE_NAME)?.value;
  const actor = await verifyAdminSession(prisma, token);

  if (!actor || actor.role !== 'MANAGER') {
    notFound();
  }

  return <CrmDashboardShell>{children}</CrmDashboardShell>;
}
