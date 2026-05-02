import { NextRequest, NextResponse } from 'next/server';

import {
  PORTAL_DEMO_COOKIE_MAX_AGE_SECONDS,
  PORTAL_DEMO_COOKIE_NAME,
  createPortalDemoCookieValue,
  isValidPortalDemoEmail,
} from '@/lib/portal/auth';
import { isPortalDemoEnabled } from '@/lib/portal/demo-data';
import { checkRateLimit, getClientIP, PORTAL_DEMO_AUTH_LIMIT } from '@/lib/rate-limit';

function genericDenied() {
  return NextResponse.json({ success: false, message: 'Access could not be verified.' }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, PORTAL_DEMO_AUTH_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: 'Access could not be verified.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  if (!isPortalDemoEnabled()) {
    return genericDenied();
  }

  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === 'string' ? body.email : '';

  if (!isValidPortalDemoEmail(email)) {
    return genericDenied();
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: PORTAL_DEMO_COOKIE_NAME,
    value: createPortalDemoCookieValue(email),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: PORTAL_DEMO_COOKIE_MAX_AGE_SECONDS,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: PORTAL_DEMO_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
