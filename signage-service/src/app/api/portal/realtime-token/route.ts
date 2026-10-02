import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
import { portalToken } from '@/lib/portal/realtime';
import { checkRateLimit } from '@/lib/rate-limit';
export async function POST(request: NextRequest) {
  const guard = validatePortalMutationRequest(request); if (guard) return guard;
  const session = await getPortalSessionContext(prisma, request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value);
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers });
  if (!checkRateLimit('portal-realtime:' + session.sessionId, { maxRequests: 30, windowMs: 60_000 }).allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers });
  try { const token = await portalToken(session.portalUserId, session.sessionId);
    return NextResponse.json(token || { error: 'unavailable' }, { status: token ? 200 : 503, headers });
  } catch { return NextResponse.json({ error: 'unavailable' }, { status: 503, headers }); }
}
