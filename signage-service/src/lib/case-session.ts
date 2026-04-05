import crypto from 'node:crypto';

export const CASE_SESSION_COOKIE_NAME = 'pixelring_case_session';
export const CASE_SESSION_TTL_DAYS = 180;

const SESSION_TOKEN_BYTES = 32;

export function createCaseSessionToken(): string {
  return crypto.randomBytes(SESSION_TOKEN_BYTES).toString('base64url');
}

export function hashCaseSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getCaseSessionExpiryDate(now: Date): Date {
  return new Date(now.getTime() + CASE_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}
