import { timingSafeEqual } from 'node:crypto';
export const MAX_EMAIL_ATTEMPTS = 5;
export const EMAIL_LEASE_MS = 5 * 60_000;
export function nextEmailAttempt(attempts: number, now = new Date()): Date {
  const delays = [60_000, 5 * 60_000, 30 * 60_000, 6 * 60 * 60_000, 24 * 60 * 60_000];
  return new Date(now.getTime() + delays[Math.min(Math.max(attempts - 1, 0), delays.length - 1)]);
}
export function validCronAuthorization(header: string | null, secret: string | undefined): boolean {
  if (!secret || secret.length < 16 || !header) return false;
  const actual = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
