import { NextRequest, NextResponse } from 'next/server';

import { sendPortalCodeEmail } from '@/lib/email/portal-claim-email';
import { prisma } from '@/lib/prisma';
import { createPortalSignupCode } from '@/lib/portal/login';
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

  try {
    const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
    const email = typeof body?.email === 'string' ? body.email : '';
    const code = await createPortalSignupCode(prisma, { email });

    if (!code.ok) {
      return NextResponse.json(
        { success: false, message: 'Bitte geben Sie eine gueltige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    const delivery = await sendPortalCodeEmail({
      to: code.email,
      code: code.code,
      expiresAt: code.expiresAt,
      mode: 'signup',
    });

    return NextResponse.json({
      success: true,
      sent: delivery.sent,
      devCode: delivery.sent || process.env.NODE_ENV === 'production' ? undefined : code.code,
      expiresAt: code.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Portal signup code creation failed:', error);

    return NextResponse.json(
      { success: false, message: 'Der Code konnte nicht gesendet werden.' },
      { status: 400 }
    );
  }
}
