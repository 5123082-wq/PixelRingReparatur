import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { CRM_SESSION_COOKIE_NAME, requireAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

import CrmDashboardShell from './DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CRM_SESSION_COOKIE_NAME)?.value;
  const actor = await requireAdminSession(prisma, token, ['MANAGER']);

  if (!actor) {
    notFound();
  }

  return <CrmDashboardShell>{children}</CrmDashboardShell>;
}
