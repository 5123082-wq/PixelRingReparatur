import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { markCaseRead } from '@/lib/portal-operator/state';
import { notifyPortalOperator } from '@/lib/portal-operator/notify';

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

  const body = await request.json().catch(() => null) as { lastMessageId?: unknown; lastPortalMessageId?: unknown } | null;
  if (typeof body?.lastMessageId !== 'string' || !isUuidLike(body.lastMessageId) ||
    (body.lastPortalMessageId != null && (typeof body.lastPortalMessageId !== 'string' || !isUuidLike(body.lastPortalMessageId)))) {
    return NextResponse.json({ error: 'Visible message is required' }, { status: 400 });
  }
  const lastReadAt = await markCaseRead(prisma, {
    caseId: id, actor, lastMessageId: body.lastMessageId,
    lastPortalMessageId: body.lastPortalMessageId as string | null | undefined,
  });
  if (!lastReadAt) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await notifyPortalOperator(id);
  return NextResponse.json({ success: true, lastReadAt: lastReadAt.toISOString() });
}
