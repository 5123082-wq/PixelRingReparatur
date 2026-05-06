import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CRM_SESSION_COOKIE_NAME,
    ['CRM_CASE_READ']
  );

  if (!actor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  if (!isUuidLike(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id },
    select: {
      id: true,
      assignedOperator: true,
    },
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (
    actor.role === 'MANAGER' &&
    caseRecord.assignedOperator !== null &&
    caseRecord.assignedOperator !== actor.adminUserId &&
    caseRecord.assignedOperator !== actor.email &&
    caseRecord.assignedOperator !== actor.displayName
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const now = new Date();

  await prisma.caseReadState.upsert({
    where: {
      caseId_adminUserId: {
        caseId: id,
        adminUserId: actor.adminUserId,
      },
    },
    create: {
      caseId: id,
      adminUserId: actor.adminUserId,
      lastReadAt: now,
    },
    update: {
      lastReadAt: now,
    },
  });

  return NextResponse.json({ success: true, lastReadAt: now.toISOString() });
}
