import { NextRequest, NextResponse } from 'next/server';

import { CASE_SESSION_COOKIE_NAME } from '@/lib/case-session';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP, STATUS_LIMIT } from '@/lib/rate-limit';
import { lookupPublicCaseStatus } from '@/lib/status-lookup';

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, STATUS_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { verified: false, message: 'Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as
      | {
          requestNumber?: string;
          contact?: string;
        }
      | null;

    const result = await lookupPublicCaseStatus(prisma, {
      publicRequestNumber: body?.requestNumber,
      contact: body?.contact,
      sessionToken: request.cookies.get(CASE_SESSION_COOKIE_NAME)?.value ?? null,
      userAgent: request.headers.get('user-agent'),
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    });

    if (!result.verified) {
      return NextResponse.json(
        {
          verified: false,
          verificationRequired: true,
          message: result.message,
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      verified: true,
      verifiedVia: result.case.verifiedVia,
      case: result.case,
    });

    if (result.cookieToken) {
      response.cookies.set({
        name: CASE_SESSION_COOKIE_NAME,
        value: result.cookieToken,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
      });
    }

    return response;
  } catch (error) {
    console.error('Status lookup error:', error);

    return NextResponse.json(
      { verified: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
