import { NextRequest, NextResponse } from 'next/server';

import { sendPortalVerificationEmail } from '@/lib/email/portal-claim-email';
import { prisma } from '@/lib/prisma';
import { createPortalEmailVerification } from '@/lib/portal/claim';
import { checkRateLimit, getClientIP, PORTAL_CLAIM_LIMIT } from '@/lib/rate-limit';

function requestOrigin(request: NextRequest): string {
  return request.headers.get('origin') || request.nextUrl.origin;
}

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
    const body = (await request.json().catch(() => null)) as
      | {
          token?: unknown;
          email?: unknown;
        }
      | null;

    const token = typeof body?.token === 'string' ? body.token : '';
    const email = typeof body?.email === 'string' ? body.email : '';

    const verification = await createPortalEmailVerification(prisma, {
      claimToken: token,
      email,
      origin: requestOrigin(request),
    });

    const delivery = await sendPortalVerificationEmail({
      to: verification.email,
      verificationUrl: verification.verificationUrl,
      publicRequestNumber: verification.publicRequestNumber,
      expiresAt: verification.expiresAt,
    });

    return NextResponse.json({
      success: true,
      email: verification.email,
      devVerificationUrl: delivery.sent ? undefined : delivery.verificationUrl,
    });
  } catch (error) {
    console.error('Portal claim verification start failed:', error);

    return NextResponse.json(
      { success: false, message: 'Verification could not be started.' },
      { status: 400 }
    );
  }
}
