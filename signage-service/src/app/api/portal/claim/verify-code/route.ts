import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { verifyPortalCode } from '@/lib/portal/login';
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

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    code?: unknown;
  } | null;
  const email = typeof body?.email === 'string' ? body.email : '';
  const code = typeof body?.code === 'string' ? body.code : '';
  const result = await verifyPortalCode(prisma, {
    email,
    code,
    purpose: 'CLAIM_ACCESS',
  });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: 'Der Code ist ungueltig oder abgelaufen.' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    verificationToken: result.verificationToken,
    accountHasPassword: result.accountHasPassword,
  });
}
