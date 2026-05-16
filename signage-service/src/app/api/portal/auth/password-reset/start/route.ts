import { NextRequest, NextResponse } from 'next/server';

import { sendPortalCodeEmail } from '@/lib/email/portal-claim-email';
import { prisma } from '@/lib/prisma';
import { createPortalPasswordResetCode } from '@/lib/portal/login';
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
    const code = await createPortalPasswordResetCode(prisma, { email });

    if (code.ok) {
      const delivery = await sendPortalCodeEmail({
        to: code.email,
        code: code.code,
        expiresAt: code.expiresAt,
        mode: 'password-reset',
      });

      return NextResponse.json({
        success: true,
        sent: delivery.sent,
        devCode: delivery.sent || process.env.NODE_ENV === 'production' ? undefined : code.code,
        expiresAt: code.expiresAt.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      sent: false,
    });
  } catch (error) {
    console.error('Portal password reset code creation failed:', error);

    return NextResponse.json({
      success: true,
      sent: false,
    });
  }
}
