'use client';

import { useEffect, useState } from 'react';
import {
  persistGoogleAdsConsent,
  readGoogleAdsConsent,
  type GoogleAdsConsentChoice,
} from '@/lib/google-ads-consent';

const copyByLocale: Record<string, {
  title: string;
  intro: string;
  currentAll: string;
  currentNecessary: string;
  currentUnset: string;
  accept: string;
  decline: string;
}> = {
  de: {
    title: 'Cookie-Einstellungen',
    intro: 'Hier können Sie optionale Google Ads- und Analyse-Cookies erlauben oder ablehnen. Technisch notwendige Cookies bleiben für Sicherheit, Sprache und Website-Funktionen aktiv.',
    currentAll: 'Aktuelle Auswahl: optionale Cookies erlaubt.',
    currentNecessary: 'Aktuelle Auswahl: nur notwendige Cookies.',
    currentUnset: 'Aktuelle Auswahl: noch nicht gespeichert.',
    accept: 'Alle akzeptieren',
    decline: 'Nur notwendige',
  },
  en: {
    title: 'Cookie settings',
    intro: 'You can allow or reject optional Google Ads and analytics cookies here. Necessary cookies remain active for security, language, and website functions.',
    currentAll: 'Current choice: optional cookies allowed.',
    currentNecessary: 'Current choice: necessary cookies only.',
    currentUnset: 'Current choice: not saved yet.',
    accept: 'Accept all',
    decline: 'Necessary only',
  },
  ru: {
    title: 'Настройки cookies',
    intro: 'Здесь можно разрешить или отклонить необязательные cookies Google Ads и аналитики. Необходимые cookies остаются активными для безопасности, языка и функций сайта.',
    currentAll: 'Текущий выбор: необязательные cookies разрешены.',
    currentNecessary: 'Текущий выбор: только необходимые cookies.',
    currentUnset: 'Текущий выбор: пока не сохранен.',
    accept: 'Принять все',
    decline: 'Только необходимые',
  },
  tr: {
    title: 'Cookie ayarları',
    intro: 'Burada isteğe bağlı Google Ads ve analiz çerezlerine izin verebilir veya bunları reddedebilirsiniz. Zorunlu çerezler güvenlik, dil ve site işlevleri için aktif kalır.',
    currentAll: 'Geçerli seçim: isteğe bağlı çerezlere izin verildi.',
    currentNecessary: 'Geçerli seçim: yalnızca zorunlu çerezler.',
    currentUnset: 'Geçerli seçim: henüz kaydedilmedi.',
    accept: 'Tümünü kabul et',
    decline: 'Sadece gerekli',
  },
  pl: {
    title: 'Ustawienia plików cookie',
    intro: 'Tutaj możesz zezwolić na opcjonalne pliki cookie Google Ads i analityki albo je odrzucić. Niezbędne pliki cookie pozostają aktywne dla bezpieczeństwa, języka i funkcji strony.',
    currentAll: 'Aktualny wybór: opcjonalne pliki cookie dozwolone.',
    currentNecessary: 'Aktualny wybór: tylko niezbędne pliki cookie.',
    currentUnset: 'Aktualny wybór: jeszcze niezapisany.',
    accept: 'Akceptuj wszystko',
    decline: 'Tylko niezbędne',
  },
  ar: {
    title: 'اعدادات ملفات تعريف الارتباط',
    intro: 'يمكنك هنا السماح بملفات تعريف الارتباط الاختيارية الخاصة بإعلانات Google والتحليلات أو رفضها. تبقى ملفات تعريف الارتباط الضرورية فعالة للأمان واللغة ووظائف الموقع.',
    currentAll: 'الاختيار الحالي: ملفات تعريف الارتباط الاختيارية مسموحة.',
    currentNecessary: 'الاختيار الحالي: ملفات تعريف الارتباط الضرورية فقط.',
    currentUnset: 'الاختيار الحالي: لم يتم حفظه بعد.',
    accept: 'قبول الكل',
    decline: 'الضرورية فقط',
  },
};

function getCopy(locale: string) {
  return copyByLocale[locale] ?? copyByLocale.de;
}

function getStatusText(choice: GoogleAdsConsentChoice | null, copy: ReturnType<typeof getCopy>) {
  if (choice === 'all') {
    return copy.currentAll;
  }

  if (choice === 'necessary') {
    return copy.currentNecessary;
  }

  return copy.currentUnset;
}

export default function CookieConsentSettings({ locale }: { locale: string }) {
  const [choice, setChoice] = useState<GoogleAdsConsentChoice | null>(null);
  const copy = getCopy(locale);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(readGoogleAdsConsent());
  }, []);

  const chooseConsent = (nextChoice: GoogleAdsConsentChoice) => {
    persistGoogleAdsConsent(nextChoice);
    setChoice(nextChoice);
  };

  return (
    <section id="cookie-settings" className="bg-white px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-4xl rounded-lg border border-[#E7DDD3] bg-[#F7F1E8] p-5 sm:p-7">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[#0E1A2B]">{copy.title}</h2>
          <p className="text-[15px] leading-7 text-[#5E554E]">{copy.intro}</p>
          <p className="text-[14px] font-semibold text-[#0E1A2B]">
            {getStatusText(choice, copy)}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => chooseConsent('necessary')}
            className="min-h-11 rounded-full border border-[#B8643E] px-5 py-2 text-[14px] font-semibold text-[#B8643E] transition-colors hover:bg-white"
          >
            {copy.decline}
          </button>
          <button
            type="button"
            onClick={() => chooseConsent('all')}
            className="min-h-11 rounded-full bg-[#B8643E] px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#A65835]"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </section>
  );
}
