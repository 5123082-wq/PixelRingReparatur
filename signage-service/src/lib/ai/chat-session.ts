import 'server-only';

import type { PrismaClient, Session } from '@prisma/client';
import { SessionScope } from '@prisma/client';

import {
  createCaseSessionToken,
  getCaseSessionExpiryDate,
  hashCaseSessionToken,
} from '../case-session';
import { isChatAccessSession } from '../session-access-policy';

export type ResolvedChatSession = {
  session: Session;
  cookieToken?: string;
};

export async function resolveChatSession(
  prisma: PrismaClient,
  token: string | null | undefined,
  options: {
    createIfMissing: boolean;
    fallbackToken?: string | null;
    userAgent?: string | null;
    ipAddress?: string | null;
  }
): Promise<ResolvedChatSession | null> {
  const now = new Date();

  const tokenCandidates = [token, options.fallbackToken].filter(
    (candidate, index, candidates): candidate is string =>
      Boolean(candidate?.trim()) && candidates.indexOf(candidate) === index
  );

  for (const candidate of tokenCandidates) {
    const existingSession = await prisma.session.findUnique({
      where: { tokenHash: hashCaseSessionToken(candidate) },
    });

    if (isChatAccessSession(existingSession, now)) {
      await prisma.session.update({
        where: { id: existingSession.id },
        data: { lastSeenAt: now },
      });

      return {
        session: existingSession,
        cookieToken: candidate === options.fallbackToken ? candidate : undefined,
      };
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
      scope: SessionScope.ANONYMOUS_DRAFT,
      caseId: null,
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
