import crypto from 'node:crypto';

import { getPortalDemoEmail, isPortalDemoEnabled } from './demo-data';

export const PORTAL_DEMO_COOKIE_NAME = 'pixelring_portal_demo';
export const PORTAL_DEMO_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

export function normalizePortalEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function createPortalDemoCookieValue(email: string): string {
  const normalizedEmail = normalizePortalEmail(email);
  return crypto
    .createHash('sha256')
    .update(`portal-demo:${normalizedEmail}:${getPortalDemoEmail()}`)
    .digest('hex');
}

export function isValidPortalDemoEmail(email: string): boolean {
  return normalizePortalEmail(email) === getPortalDemoEmail();
}

export function verifyPortalDemoCookie(value: string | undefined | null): boolean {
  if (!isPortalDemoEnabled() || !value) {
    return false;
  }

  const expected = createPortalDemoCookieValue(getPortalDemoEmail());
  if (value.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
