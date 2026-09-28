import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from '@/lib/portal/auth';
import { getPublicWorkResult } from '@/lib/work-results/service';
export async function GET(request: NextRequest, { params }: { params: Promise<{ publicRequestNumber: string }> }) {
  const session = await getPortalSessionContext(prisma, request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value);
  const { publicRequestNumber } = await params;
  const result = session ? await getPublicWorkResult(session.portalUserId, publicRequestNumber) : null;
  return NextResponse.json(result ?? { error: 'Not found' }, {
    status: result ? 200 : 404, headers: { 'Cache-Control': 'private, no-store' },
  });
}
