import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  createPortalSession,
  PORTAL_SESSION_COOKIE_NAME,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from '@/lib/portal/auth';
import { consumePortalEmailVerification } from '@/lib/portal/claim';
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
    const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
    const token = typeof body?.token === 'string' ? body.token : '';
    const result = await consumePortalEmailVerification(prisma, token);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: 'Verification link is invalid or expired.' },
        { status: 400 }
      );
    }

    const sessionToken = await createPortalSession(prisma, {
      caseId: result.caseId,
      portalUserId: result.portalUserId,
      email: result.email,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    });

    const response = NextResponse.json({
      success: true,
      redirectTo: `/${result.locale}/portal`,
      publicRequestNumber: result.publicRequestNumber,
    });

    response.cookies.set({
      name: PORTAL_SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: PORTAL_SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('Portal email verification consume failed:', error);

    return NextResponse.json(
      { success: false, message: 'Verification could not be completed.' },
      { status: 500 }
    );
  }
}
