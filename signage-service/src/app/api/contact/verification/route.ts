import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
import { getIntakeSession } from '@/lib/intake-session';
import { getIntakeVerification, INTAKE_VERIFICATION_COOKIE, INTAKE_VERIFICATION_TTL_SECONDS, startIntakeVerification, verifyIntakeCode } from '@/lib/intake-verification';
import { sendIntakeCodeEmail } from '@/lib/email/portal-claim-email';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { SITE_LOCALES, type SiteLocale } from '@/lib/seo';

function reply(body: object, status = 200, retryAfter?: number) {
  return NextResponse.json(body, { status, headers: {
    'Cache-Control': 'private, no-store', Vary: 'Cookie',
    ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {}),
  } });
}

export async function POST(request: NextRequest) {
  const mutationError = validatePortalMutationRequest(request);
  if (mutationError) return mutationError;
  const body = await request.json().catch(() => null);
  if (!body || !['state', 'start', 'verify'].includes(body.action)) return reply({ code: 'invalid_request' }, 400);
  const email = typeof body.email === 'string' ? body.email : '';
  const limit = checkRateLimit(getClientIP(request), {
    prefix: `intake-verification-${body.action}`, maxRequests: body.action === 'state' ? 60 : 8, windowMs: 5 * 60_000,
  });
  if (!limit.allowed) return reply({ code: 'rate_limited' }, 429, Math.max(1, Math.ceil(limit.resetMs / 1000)));
  const token = request.cookies.get(INTAKE_VERIFICATION_COOKIE)?.value;
  try {
    if (body.action === 'state') {
      const context = await getIntakeSession(prisma, request, body.isFromChat === true);
      const required = Boolean(context.session?.caseId && !context.portalSession);
      const previous = required ? await prisma.case.findUnique({
        where: { id: context.session!.caseId! }, select: { publicRequestNumber: true },
      }) : null;
      return reply({ required, verified: required && Boolean(await getIntakeVerification(prisma, token, email)), previousRequestNumber: previous?.publicRequestNumber });
    }
    if (body.action === 'verify') {
      const code = typeof body.code === 'string' ? body.code.trim() : '';
      return await verifyIntakeCode(prisma, token, email, code)
        ? reply({ verified: true }) : reply({ code: 'invalid_code' }, 400);
    }
    const challenge = await startIntakeVerification(prisma, email);
    if (!challenge.ok) return challenge.reason === 'rate_limited'
      ? reply({ code: challenge.reason }, 429, challenge.retryAfter)
      : reply({ code: challenge.reason }, 400);
    const locale = SITE_LOCALES.includes(body.locale as SiteLocale) ? body.locale as SiteLocale : 'de';
    const delivery = await sendIntakeCodeEmail({ to: challenge.email, code: challenge.code, expiresAt: challenge.expiresAt, locale });
    // Never display "sent" (or expose a development code) without actual delivery.
    if (!delivery.sent) return reply({ code: 'delivery_failed' }, 503);
    const response = reply({ sent: true, retryAfter: 60 });
    response.cookies.set(INTAKE_VERIFICATION_COOKIE, challenge.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      path: '/', maxAge: INTAKE_VERIFICATION_TTL_SECONDS,
    });
    return response;
  } catch {
    // Do not log provider errors, codes or email addresses.
    return reply({ code: body.action === 'start' ? 'delivery_failed' : 'unavailable' }, 503);
  }
}
