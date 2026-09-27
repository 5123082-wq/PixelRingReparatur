import type { NextRequest } from 'next/server';
import type { PrismaClient } from '@prisma/client';
import { CASE_SESSION_COOKIE_NAME, CHAT_SESSION_COOKIE_NAME, hashCaseSessionToken } from './case-session';
import { getPortalSessionContext, PORTAL_SESSION_COOKIE_NAME } from './portal/auth';
import { isChatAccessSession } from './session-access-policy';

export async function getIntakeSession(db: PrismaClient, request: NextRequest, isFromChat: boolean) {
  const portalSession = await getPortalSessionContext(db,
    request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value, { touchLastSeen: false });
  const caseToken = request.cookies.get(CASE_SESSION_COOKIE_NAME)?.value;
  const tokens = isFromChat
    ? [request.cookies.get(CHAT_SESSION_COOKIE_NAME)?.value, caseToken]
    : [caseToken];
  for (const token of tokens) {
    if (!token) continue;
    const session = await db.session.findUnique({ where: { tokenHash: hashCaseSessionToken(token) } });
    if (isChatAccessSession(session)) return { portalSession, session, token };
  }
  return { portalSession, session: null, token: null };
}
