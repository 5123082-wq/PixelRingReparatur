import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { validateAdminCsrf } from '@/lib/admin-csrf';
import { prisma } from '@/lib/prisma';
import { createCaseRealtimeTokenRequest } from '@/lib/realtime';
import { NextRequest, NextResponse } from 'next/server';

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(request: NextRequest) {
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

  const body = (await request.json().catch(() => null)) as
    | { caseId?: string }
    | null;
  const caseId = body?.caseId?.trim() ?? '';

  if (!isUuidLike(caseId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const caseRecord = await prisma.case.findUnique({
    where: { id: caseId },
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

  try {
    const tokenRequest = await createCaseRealtimeTokenRequest({
      caseId,
      clientId: `crm:${actor.adminUserId}`,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error('Ably CRM token error:', error);

    return NextResponse.json(
      { error: 'Realtime is not configured' },
      { status: 503 }
    );
  }
}
