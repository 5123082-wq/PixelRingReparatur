'use client';

const GOOGLE_ADS_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LEAD_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL;

type ConsentState = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateGoogleAdsConsent(consent: ConsentState) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('consent', 'update', {
    ad_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
    analytics_storage: consent,
  });
}

export function trackGoogleAdsLeadConversion() {
  if (
    typeof window === 'undefined' ||
    typeof window.gtag !== 'function' ||
    !GOOGLE_ADS_ENABLED ||
    !GOOGLE_ADS_ID ||
    !LEAD_CONVERSION_LABEL
  ) {
    return;
  }

  window.gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${LEAD_CONVERSION_LABEL}`,
    value: 1.0,
    currency: 'EUR',
  });
}
