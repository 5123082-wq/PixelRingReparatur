'use client';

import { useEffect, useState } from 'react';
import { updateGoogleAdsConsent } from '@/lib/google-ads';

const STORAGE_KEY = 'pixelring_google_ads_consent';

type ConsentChoice = 'granted' | 'denied';

const copyByLocale: Record<string, {
  title: string;
  text: string;
  accept: string;
  decline: string;
  privacy: string;
}> = {
  de: {
    title: 'Cookie-Einstellungen',
    text: 'Wir nutzen Google Ads nur nach Ihrer Zustimmung, um Kampagnen und Anfragen besser zu messen.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    privacy: 'Datenschutz',
  },
  en: {
    title: 'Cookie settings',
    text: 'We use Google Ads only after your consent to measure campaigns and service requests.',
    accept: 'Accept',
    decline: 'Decline',
    privacy: 'Privacy',
  },
  ru: {
    title: 'Настройка cookies',
    text: 'Мы используем Google Ads только после вашего согласия, чтобы измерять кампании и заявки.',
    accept: 'Принять',
    decline: 'Отклонить',
    privacy: 'Конфиденциальность',
  },
  tr: {
    title: 'Cookie ayarlari',
    text: 'Google Ads sadece onayinizdan sonra kampanyalari ve talepleri olcmek icin kullanilir.',
    accept: 'Kabul et',
    decline: 'Reddet',
    privacy: 'Gizlilik',
  },
  pl: {
    title: 'Ustawienia cookies',
    text: 'Google Ads uzywamy tylko po zgodzie, aby mierzyc kampanie i zapytania.',
    accept: 'Akceptuj',
    decline: 'Odrzuc',
    privacy: 'Prywatnosc',
  },
  ar: {
    title: 'اعدادات ملفات تعريف الارتباط',
    text: 'نستخدم Google Ads فقط بعد موافقتك لقياس الحملات والطلبات.',
    accept: 'قبول',
    decline: 'رفض',
    privacy: 'الخصوصية',
  },
};

function getCopy(locale: string) {
  return copyByLocale[locale] ?? copyByLocale.de;
}

export default function GoogleAdsConsentBanner({ locale }: { locale: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const copy = getCopy(locale);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;

    if (stored === 'granted' || stored === 'denied') {
      updateGoogleAdsConsent(stored);
      return;
    }

    // The banner depends on browser-only localStorage, so it becomes visible after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
  }, []);

  const chooseConsent = (choice: ConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    updateGoogleAdsConsent(choice);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="h-[272px] sm:hidden" aria-hidden="true" />
      <section
        aria-label={copy.title}
        className="fixed inset-x-4 bottom-4 z-[80] mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#E7DDD3] bg-white px-4 py-4 text-[#0E1A2B] shadow-[0_18px_44px_rgba(14,26,43,0.18)] sm:inset-x-auto sm:right-5 sm:max-w-md"
      >
        <div className="space-y-1">
          <h2 className="text-[15px] font-bold">{copy.title}</h2>
          <p className="text-[13px] leading-5 text-[#5E554E]">{copy.text}</p>
          <a
            href={`/${locale}/privacy`}
            className="inline-flex text-[12px] font-semibold text-[#B8643E] underline-offset-4 hover:underline"
          >
            {copy.privacy}
          </a>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => chooseConsent('denied')}
            className="rounded-full border border-[#D8CCC0] px-4 py-2 text-[13px] font-semibold text-[#5E554E] transition-colors hover:bg-[#F7F1E8]"
          >
            {copy.decline}
          </button>
          <button
            type="button"
            onClick={() => chooseConsent('granted')}
            className="rounded-full bg-[#B8643E] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#A65835]"
          >
            {copy.accept}
          </button>
        </div>
      </section>
    </>
  );
}
