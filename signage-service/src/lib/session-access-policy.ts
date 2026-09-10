import { SessionScope, type Session } from '@prisma/client';

export type SessionAccessPolicyRecord = Pick<
  Session,
  | 'scope'
  | 'caseId'
  | 'portalUserId'
  | 'verifiedAt'
  | 'expiresAt'
  | 'revokedAt'
>;

export function isActiveSession(
  session: SessionAccessPolicyRecord | null | undefined,
  now: Date = new Date()
): session is SessionAccessPolicyRecord {
  return Boolean(
    session &&
      session.revokedAt === null &&
      session.expiresAt > now
  );
}

export function isAnonymousChatSession(
  session: SessionAccessPolicyRecord | null | undefined,
  now: Date = new Date()
): session is SessionAccessPolicyRecord {
  return (
    isActiveSession(session, now) &&
    session.scope === SessionScope.ANONYMOUS_DRAFT &&
    session.caseId === null &&
    session.portalUserId === null &&
    session.verifiedAt === null
  );
}

// Current-device case sessions are created during request intake without
// verifiedAt. Status links and the legacy contact-lookup flow set verifiedAt,
// which keeps those existing tokens usable for status while denying chat.
export function isSameDeviceCaseSession(
  session: SessionAccessPolicyRecord | null | undefined,
  now: Date = new Date()
): session is SessionAccessPolicyRecord {
  return (
    isActiveSession(session, now) &&
    session.scope === SessionScope.CASE_ACCESS &&
    session.caseId !== null &&
    session.portalUserId === null &&
    session.verifiedAt === null
  );
}

export function isStatusOnlyCaseSession(
  session: SessionAccessPolicyRecord | null | undefined,
  now: Date = new Date()
): session is SessionAccessPolicyRecord {
  return (
    isActiveSession(session, now) &&
    session.scope === SessionScope.CASE_ACCESS &&
    session.caseId !== null &&
    session.portalUserId === null &&
    session.verifiedAt !== null
  );
}

export function isChatAccessSession(
  session: SessionAccessPolicyRecord | null | undefined,
  now: Date = new Date()
): session is SessionAccessPolicyRecord {
  return (
    isAnonymousChatSession(session, now) ||
    isSameDeviceCaseSession(session, now)
  );
}

export function isCaseStatusSession(
  session: SessionAccessPolicyRecord | null | undefined,
  now: Date = new Date()
): session is SessionAccessPolicyRecord {
  return (
    isSameDeviceCaseSession(session, now) ||
    isStatusOnlyCaseSession(session, now)
  );
}
