import 'server-only';

import { SessionScope, type PrismaClient } from '@prisma/client';

import {
  createCaseSessionToken,
  getCaseSessionExpiryDate,
  hashCaseSessionToken,
} from './case-session';
import { buildLocaleUrl } from './seo';

type StatusAccessLinkDb = Pick<PrismaClient, 'session'>;

export function buildStatusTrackingUrl(input: {
  locale?: string | null;
  publicRequestNumber: string;
  accessToken: string;
}): string {
  const locale = input.locale?.trim() || 'de';
  const params = new URLSearchParams({
    request: input.publicRequestNumber,
    access: input.accessToken,
  });

  return buildLocaleUrl(locale, `/status?${params.toString()}`);
}

export async function createCaseStatusAccessLink(
  db: StatusAccessLinkDb,
  input: {
    caseId: string;
    publicRequestNumber: string;
    locale?: string | null;
    now?: Date;
  }
): Promise<string> {
  const now = input.now ?? new Date();
  const accessToken = createCaseSessionToken();

  await db.session.create({
    data: {
      tokenHash: hashCaseSessionToken(accessToken),
      scope: SessionScope.CASE_ACCESS,
      caseId: input.caseId,
      verifiedAt: now,
      lastSeenAt: now,
      expiresAt: getCaseSessionExpiryDate(now),
    },
  });

  return buildStatusTrackingUrl({
    locale: input.locale,
    publicRequestNumber: input.publicRequestNumber,
    accessToken,
  });
}
