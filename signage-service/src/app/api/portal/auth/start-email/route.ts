import { NextRequest, NextResponse } from 'next/server';

import { sendPortalVerificationEmail } from '@/lib/email/portal-claim-email';
import { prisma } from '@/lib/prisma';
import { createPortalLoginVerification } from '@/lib/portal/login';
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
      email?: unknown;
      locale?: unknown;
    } | null;
    const email = typeof body?.email === 'string' ? body.email : '';
    const locale = typeof body?.locale === 'string' ? body.locale : 'de';
    const verification = await createPortalLoginVerification(prisma, {
      email,
      locale,
      origin: request.headers.get('origin') ?? new URL(request.url).origin,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ip,
    });

    const delivery = await sendPortalVerificationEmail({
      to: verification.email,
      verificationUrl: verification.verificationUrl,
      expiresAt: verification.expiresAt,
      mode: 'login',
    });

    return NextResponse.json({
      success: true,
      sent: delivery.sent,
      verificationUrl: delivery.sent ? undefined : verification.verificationUrl,
    });
  } catch (error) {
    console.error('Portal login verification creation failed:', error);

    return NextResponse.json(
      { success: false, message: 'Verification e-mail could not be sent.' },
      { status: 400 }
    );
  }
}
