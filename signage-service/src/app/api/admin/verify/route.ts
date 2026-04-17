import { CRM_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET(request: NextRequest) {
  try {
    const actor = await requireAdminPermissionActor(
      prisma,
      request,
      CRM_SESSION_COOKIE_NAME,
      ['CRM_CASE_READ']
    );

    if (!actor) {
      return notFoundResponse();
    }

    return NextResponse.json({
      authenticated: true,
      actor: {
        id: actor.adminUserId,
        email: actor.email,
        displayName: actor.displayName,
        role: actor.role,
        expiresAt: actor.expiresAt.toISOString(),
      },
    });
  } catch {
    return notFoundResponse();
  }
}
