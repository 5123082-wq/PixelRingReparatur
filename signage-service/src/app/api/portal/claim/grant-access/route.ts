import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  getPortalSessionContext,
  PORTAL_SESSION_COOKIE_NAME,
} from '@/lib/portal/auth';
import { grantPortalClaimAccessToSessionUser } from '@/lib/portal/login';
import { checkRateLimit, getClientIP, PORTAL_CLAIM_LIMIT } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, PORTAL_CLAIM_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: 'Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  const session = await getPortalSessionContext(
    prisma,
    request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Bitte melden Sie sich zuerst an.' },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof body?.token === 'string' ? body.token : '';
  const result = await grantPortalClaimAccessToSessionUser(prisma, {
    claimToken: token,
    portalUserId: session.portalUserId,
    email: session.email,
  });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: 'Der Portal-Link ist ungueltig oder abgelaufen.' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    redirectTo: '/portal',
  });
}
