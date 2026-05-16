import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  PORTAL_SESSION_COOKIE_NAME,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from '@/lib/portal/auth';
import { authenticatePortalPasswordLogin } from '@/lib/portal/login';
import { checkRateLimit, getClientIP, PORTAL_AUTH_LIMIT } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, PORTAL_AUTH_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: 'E-Mail oder Passwort ist nicht korrekt.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;
  const email = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const result = await authenticatePortalPasswordLogin(prisma, {
    email,
    password,
    userAgent: request.headers.get('user-agent'),
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ip,
  });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: 'E-Mail oder Passwort ist nicht korrekt.' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
    redirectTo: '/portal',
  });

  response.cookies.set({
    name: PORTAL_SESSION_COOKIE_NAME,
    value: result.sessionToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: PORTAL_SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
