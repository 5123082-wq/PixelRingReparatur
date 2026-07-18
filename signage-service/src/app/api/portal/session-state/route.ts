import { NextRequest, NextResponse } from 'next/server';

import {
  PORTAL_DEMO_COOKIE_NAME,
  PORTAL_SESSION_COOKIE_NAME,
  verifyPortalDemoCookie,
  verifyPortalSessionCookie,
} from '@/lib/portal/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const PRIVATE_RESPONSE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  Vary: 'Cookie',
  'X-Robots-Tag': 'noindex, nofollow',
};

function sessionStateResponse(authenticated: boolean, status = 200) {
  return NextResponse.json(
    { authenticated },
    {
      status,
      headers: PRIVATE_RESPONSE_HEADERS,
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const hasProductionSession = await verifyPortalSessionCookie(
      prisma,
      request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value
    );
    const hasDemoSession = verifyPortalDemoCookie(
      request.cookies.get(PORTAL_DEMO_COOKIE_NAME)?.value
    );

    return sessionStateResponse(hasProductionSession || hasDemoSession);
  } catch (error) {
    console.error('Portal session state check failed:', error);
    return sessionStateResponse(false, 503);
  }
}
