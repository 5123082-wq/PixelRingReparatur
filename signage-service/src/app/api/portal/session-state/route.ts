import { NextRequest, NextResponse } from 'next/server';

import {
  PORTAL_DEMO_COOKIE_NAME,
  PORTAL_SESSION_COOKIE_NAME,
  getPortalSessionContext,
  verifyPortalDemoCookie,
} from '@/lib/portal/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const PRIVATE_RESPONSE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0',
  Vary: 'Cookie',
  'X-Robots-Tag': 'noindex, nofollow',
};

function sessionStateResponse(
  mode: 'production' | 'demo' | null,
  email: string | null = null,
  status = 200
) {
  return NextResponse.json(
    { authenticated: mode !== null, mode, email },
    {
      status,
      headers: PRIVATE_RESPONSE_HEADERS,
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const productionSession = await getPortalSessionContext(
      prisma,
      request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value,
      { touchLastSeen: false }
    );

    if (productionSession) {
      return sessionStateResponse('production', productionSession.email);
    }

    const hasDemoSession = verifyPortalDemoCookie(
      request.cookies.get(PORTAL_DEMO_COOKIE_NAME)?.value
    );

    return sessionStateResponse(hasDemoSession ? 'demo' : null);
  } catch (error) {
    console.error('Portal session state check failed:', error);
    return sessionStateResponse(null, null, 503);
  }
}
