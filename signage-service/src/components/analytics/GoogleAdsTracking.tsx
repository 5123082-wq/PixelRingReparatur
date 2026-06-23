import Script from 'next/script';
import GoogleAdsConsentBanner from './GoogleAdsConsentBanner';

const GOOGLE_ADS_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default function GoogleAdsTracking({ locale }: { locale: string }) {
  if (!GOOGLE_ADS_ENABLED || !GOOGLE_ADS_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="google-ads-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ads_data_redaction: true,
              wait_for_update: 500
            });
          `,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-ads-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
      <GoogleAdsConsentBanner locale={locale} />
    </>
  );
}
