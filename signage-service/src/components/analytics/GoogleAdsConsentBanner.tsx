'use client';

import { useEffect, useState } from 'react';
import {
  persistGoogleAdsConsent,
  readGoogleAdsConsent,
  type GoogleAdsConsentChoice,
} from '@/lib/google-ads-consent';

const copyByLocale: Record<string, {
  title: string;
  text: string;
  accept: string;
  decline: string;
  privacy: string;
}> = {
  de: {
    title: 'Cookie-Einstellungen',
    text: 'Wir verwenden Cookies. Einige davon sind für den Betrieb der Website notwendig, andere helfen uns, die Nutzung zu analysieren und zu verbessern.',
    accept: 'Alle akzeptieren',
    decline: 'Nur notwendige',
    privacy: 'Datenschutz',
  },
  en: {
    title: 'Cookie settings',
    text: 'We use cookies. Some are necessary for the website to work, while others help us analyze and improve how it works.',
    accept: 'Accept all',
    decline: 'Necessary only',
    privacy: 'Privacy',
  },
  ru: {
    title: 'Настройка cookies',
    text: 'Мы используем cookies. Часть из них необходима для работы сайта, а остальные помогают нам анализировать и улучшать его работу.',
    accept: 'Принять все',
    decline: 'Только необходимые',
    privacy: 'Конфиденциальность',
  },
  tr: {
    title: 'Cookie ayarları',
    text: 'Çerezler kullanıyoruz. Bunların bir kısmı sitenin çalışması için gereklidir, diğerleri ise sitenin işleyişini analiz etmemize ve iyileştirmemize yardımcı olur.',
    accept: 'Tümünü kabul et',
    decline: 'Sadece gerekli',
    privacy: 'Gizlilik',
  },
  pl: {
    title: 'Ustawienia cookies',
    text: 'Używamy plików cookie. Część z nich jest niezbędna do działania strony, a pozostałe pomagają nam analizować i ulepszać jej działanie.',
    accept: 'Akceptuj wszystko',
    decline: 'Tylko niezbędne',
    privacy: 'Prywatność',
  },
  ar: {
    title: 'اعدادات ملفات تعريف الارتباط',
    text: 'نستخدم ملفات تعريف الارتباط. بعضها ضروري لعمل الموقع، والباقي يساعدنا على تحليل عمله وتحسينه.',
    accept: 'قبول الكل',
    decline: 'الضرورية فقط',
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
    const stored = readGoogleAdsConsent();

    if (stored) {
      persistGoogleAdsConsent(stored);
      return;
    }

    // The banner depends on browser-only consent storage, so it becomes visible after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
  }, []);

  const chooseConsent = (choice: GoogleAdsConsentChoice) => {
    persistGoogleAdsConsent(choice);
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
            href={`/${locale}/privacy#cookie-settings`}
            className="inline-flex text-[12px] font-semibold text-[#B8643E] underline-offset-4 hover:underline"
          >
            {copy.privacy}
          </a>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => chooseConsent('necessary')}
            className="rounded-full border border-[#D8CCC0] px-4 py-2 text-[13px] font-semibold text-[#5E554E] transition-colors hover:bg-[#F7F1E8]"
          >
            {copy.decline}
          </button>
          <button
            type="button"
            onClick={() => chooseConsent('all')}
            className="rounded-full bg-[#B8643E] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#A65835]"
          >
            {copy.accept}
          </button>
        </div>
      </section>
    </>
  );
}
