import 'server-only';

import type { PrismaClient, Session } from '@prisma/client';
import { SessionScope } from '@prisma/client';

import {
  createCaseSessionToken,
  getCaseSessionExpiryDate,
  hashCaseSessionToken,
} from '../case-session';

export type ResolvedChatSession = {
  session: Session;
  cookieToken?: string;
};

function isSessionActive(session: Pick<Session, 'expiresAt' | 'revokedAt'>): boolean {
  return session.revokedAt === null && session.expiresAt > new Date();
}

export async function resolveChatSession(
  prisma: PrismaClient,
  token: string | null | undefined,
  options: {
    createIfMissing: boolean;
    userAgent?: string | null;
    ipAddress?: string | null;
    caseId?: string | null;
  }
): Promise<ResolvedChatSession | null> {
  const now = new Date();

  if (token?.trim()) {
    const existingSession = await prisma.session.findUnique({
      where: { tokenHash: hashCaseSessionToken(token) },
    });

    if (existingSession && isSessionActive(existingSession)) {
      const desiredScope = existingSession.caseId
        ? SessionScope.CASE_ACCESS
        : SessionScope.ANONYMOUS_DRAFT;

      if (existingSession.lastSeenAt === null || existingSession.scope !== desiredScope) {
        await prisma.session.update({
          where: { id: existingSession.id },
          data: {
            lastSeenAt: now,
            scope: desiredScope,
          },
        });
      } else {
        await prisma.session.update({
          where: { id: existingSession.id },
          data: {
            lastSeenAt: now,
          },
        });
      }

      return { session: existingSession };
    }
  }

  if (!options.createIfMissing) {
    return null;
  }

  const sessionToken = createCaseSessionToken();
  const tokenHash = hashCaseSessionToken(sessionToken);
  const session = await prisma.session.create({
    data: {
      tokenHash,
      scope: options.caseId ? SessionScope.CASE_ACCESS : SessionScope.ANONYMOUS_DRAFT,
      caseId: options.caseId ?? null,
      userAgent: options.userAgent ?? null,
      ipAddress: options.ipAddress ?? null,
      lastSeenAt: now,
      expiresAt: getCaseSessionExpiryDate(now),
    },
  });

  return {
    session,
    cookieToken: sessionToken,
  };
}
