import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { CMS_SESSION_COOKIE_NAME, requireAdminSession } from '@/lib/admin-auth';

function notFoundResponse() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(CMS_SESSION_COOKIE_NAME)?.value;
    const actor = await requireAdminSession(prisma, token, ['OWNER']);

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
