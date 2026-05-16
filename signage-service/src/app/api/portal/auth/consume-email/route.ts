import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  PORTAL_SESSION_COOKIE_NAME,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from '@/lib/portal/auth';
import { consumePortalLoginVerification } from '@/lib/portal/login';
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

  try {
    const body = (await request.json().catch(() => null)) as {
      token?: unknown;
    } | null;
    const token = typeof body?.token === 'string' ? body.token : '';
    const result = await consumePortalLoginVerification(prisma, {
      token,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ip,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: 'Verification link is invalid or expired.' },
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
  } catch (error) {
    console.error('Portal login verification consume failed:', error);

    return NextResponse.json(
      { success: false, message: 'Verification could not be completed.' },
      { status: 500 }
    );
  }
}
