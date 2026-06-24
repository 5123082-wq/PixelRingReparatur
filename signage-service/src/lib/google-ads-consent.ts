'use client';

import { updateGoogleAdsConsent } from '@/lib/google-ads';

export type GoogleAdsConsentChoice = 'necessary' | 'all';

const COOKIE_NAME = 'pixelring_cookie_consent';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const STORAGE_KEY = 'pixelring_google_ads_consent:v2';
const LEGACY_STORAGE_KEY = 'pixelring_google_ads_consent';
const CONSENT_CHANGE_EVENT = 'pixelring-google-ads-consent-change';

const OPTIONAL_GOOGLE_COOKIE_NAMES = [
  '_ga',
  '_gid',
  '_gat',
  '_gcl_au',
  '_gcl_aw',
  '_gcl_dc',
  '_gcl_gb',
];

function normalizeConsentValue(value: string | null | undefined): GoogleAdsConsentChoice | null {
  if (value === 'all' || value === 'granted') {
    return 'all';
  }

  if (value === 'necessary' || value === 'denied') {
    return 'necessary';
  }

  return null;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const encodedName = `${encodeURIComponent(name)}=`;
  const match = document.cookie
    .split('; ')
    .find((part) => part.startsWith(encodedName));

  return match ? decodeURIComponent(match.slice(encodedName.length)) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') {
    return;
  }

  const attributes = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAgeSeconds}`,
    'Path=/',
    'SameSite=Lax',
  ];

  if (window.location.protocol === 'https:') {
    attributes.push('Secure');
  }

  document.cookie = attributes.join('; ');
}

function removeCookieForDomain(name: string, domain?: string) {
  const attributes = [
    `${encodeURIComponent(name)}=`,
    'Max-Age=0',
    'Path=/',
    'SameSite=Lax',
  ];

  if (domain) {
    attributes.push(`Domain=${domain}`);
  }

  if (window.location.protocol === 'https:') {
    attributes.push('Secure');
  }

  document.cookie = attributes.join('; ');
}

function getCookieRemovalDomains(): Array<string | undefined> {
  if (typeof window === 'undefined') {
    return [undefined];
  }

  const hostname = window.location.hostname;

  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return [undefined];
  }

  const parts = hostname.split('.');
  const parentDomain = parts.length > 2 ? `.${parts.slice(-2).join('.')}` : `.${hostname}`;

  return [undefined, hostname, parentDomain];
}

function removeOptionalGoogleCookies() {
  if (typeof document === 'undefined') {
    return;
  }

  const domains = getCookieRemovalDomains();

  for (const name of OPTIONAL_GOOGLE_COOKIE_NAMES) {
    for (const domain of domains) {
      removeCookieForDomain(name, domain);
    }
  }
}

export function readGoogleAdsConsent(): GoogleAdsConsentChoice | null {
  const cookieChoice = normalizeConsentValue(readCookie(COOKIE_NAME));

  if (cookieChoice) {
    return cookieChoice;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return (
      normalizeConsentValue(window.localStorage.getItem(STORAGE_KEY)) ??
      normalizeConsentValue(window.localStorage.getItem(LEGACY_STORAGE_KEY))
    );
  } catch {
    return null;
  }
}

export function persistGoogleAdsConsent(choice: GoogleAdsConsentChoice) {
  if (typeof window === 'undefined') {
    return;
  }

  writeCookie(COOKIE_NAME, choice, COOKIE_MAX_AGE_SECONDS);

  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Storage may be unavailable in strict privacy modes; the first-party cookie is primary.
  }

  updateGoogleAdsConsent(choice === 'all' ? 'granted' : 'denied');

  if (choice === 'necessary') {
    removeOptionalGoogleCookies();
  }

  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGE_EVENT, {
      detail: { choice },
    })
  );
}

export function listenForGoogleAdsConsentChanges(
  callback: (choice: GoogleAdsConsentChoice) => void
) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event: Event) => {
    const choice = normalizeConsentValue((event as CustomEvent).detail?.choice);
    if (choice) {
      callback(choice);
    }
  };

  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
}
