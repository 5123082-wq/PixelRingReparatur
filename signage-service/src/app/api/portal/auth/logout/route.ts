import { NextRequest, NextResponse } from 'next/server';

import {
  PORTAL_SESSION_COOKIE_NAME,
  revokePortalSessionCookie,
} from '@/lib/portal/auth';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const mutationError = validatePortalMutationRequest(request);

  if (mutationError) {
    return mutationError;
  }

  await revokePortalSessionCookie(
    prisma,
    request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: PORTAL_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
