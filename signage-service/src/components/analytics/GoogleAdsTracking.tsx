'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import GoogleAdsConsentBanner from './GoogleAdsConsentBanner';
import {
  listenForGoogleAdsConsentChanges,
  persistGoogleAdsConsent,
  readGoogleAdsConsent,
  type GoogleAdsConsentChoice,
} from '@/lib/google-ads-consent';

const GOOGLE_ADS_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default function GoogleAdsTracking({ locale }: { locale: string }) {
  const [consent, setConsent] = useState<GoogleAdsConsentChoice | null>(null);

  useEffect(() => {
    const stored = readGoogleAdsConsent();

    if (stored) {
      persistGoogleAdsConsent(stored);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent(stored);
    }

    return listenForGoogleAdsConsentChanges(setConsent);
  }, []);

  if (!GOOGLE_ADS_ENABLED || !GOOGLE_ADS_ID) {
    return null;
  }

  const shouldLoadGoogleAds = consent === 'all';

  return (
    <>
      {shouldLoadGoogleAds && (
        <>
          <Script
            id="google-ads-consent-granted"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  ad_storage: 'granted',
                  ad_user_data: 'granted',
                  ad_personalization: 'granted',
                  analytics_storage: 'granted',
                  functionality_storage: 'granted',
                  security_storage: 'granted'
                });
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `,
            }}
          />
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
        </>
      )}
      <GoogleAdsConsentBanner locale={locale} />
    </>
  );
}
