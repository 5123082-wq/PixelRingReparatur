import { after, NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
import { requestPortalCancellation } from '@/lib/portal/cancellation';
import { notifyPortalOperator } from '@/lib/portal-operator/notify';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import { checkRateLimit, getClientIP, PORTAL_REQUEST_UPDATE_LIMIT } from '@/lib/rate-limit';

export async function POST(request: NextRequest, { params }: { params: Promise<{ publicRequestNumber: string }> }) {
  const invalid = validatePortalMutationRequest(request);
  if (invalid) return invalid;
  const limit = checkRateLimit(getClientIP(request), PORTAL_REQUEST_UPDATE_LIMIT);
  if (!limit.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } });
  const session = await getPortalSessionContext(prisma, request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  const { publicRequestNumber } = await params;
  try {
    const result = await requestPortalCancellation(prisma, {
      portalUserId: session.portalUserId, portalSessionId: session.sessionId, publicRequestNumber,
      reason: body.reason, locale: typeof body.locale === 'string' ? body.locale : 'de',
    });
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.error === 'not_found' ? 404 : result.error === 'closed' ? 409 : 400 });
    after(async () => { await Promise.allSettled([
      publishCaseRealtimeEvent({ caseId: result.caseId, reason: 'case.updated' }),
      notifyPortalOperator(result.caseId),
    ]); });
    return NextResponse.json({ success: true, requestedAt: result.requestedAt });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
}
