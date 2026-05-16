import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  PORTAL_SESSION_COOKIE_NAME,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from '@/lib/portal/auth';
import { completePortalPasswordCode } from '@/lib/portal/login';
import { checkRateLimit, getClientIP, PORTAL_AUTH_LIMIT } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, PORTAL_AUTH_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: 'Bitte versuchen Sie es spaeter erneut.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    verificationToken?: unknown;
    password?: unknown;
    passwordRepeat?: unknown;
  } | null;
  const verificationToken = typeof body?.verificationToken === 'string' ? body.verificationToken : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const passwordRepeat = typeof body?.passwordRepeat === 'string' ? body.passwordRepeat : '';

  if (password !== passwordRepeat) {
    return NextResponse.json(
      { success: false, message: 'Die Passwoerter stimmen nicht ueberein.' },
      { status: 400 }
    );
  }

  const result = await completePortalPasswordCode(prisma, {
    verificationToken,
    password,
    purpose: 'PASSWORD_RESET',
    userAgent: request.headers.get('user-agent'),
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ip,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        message:
          result.reason === 'invalid_password'
            ? 'Das Passwort muss mindestens 10 Zeichen lang sein.'
            : 'Die Bestaetigung ist ungueltig oder abgelaufen.',
      },
      { status: 400 }
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
