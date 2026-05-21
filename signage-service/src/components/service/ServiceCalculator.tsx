'use client';

import { useState } from 'react';

import type { ServiceCalculatorOptionCmsContent } from '@/lib/cms/pages';

type ServiceCalculatorProps = {
  title?: string;
  description?: string;
  note?: string;
  defaultLocations?: number;
  options?: ServiceCalculatorOptionCmsContent[];
  footnote?: string;
  locale?: string;
};

const TRANSLATIONS: Record<string, {
  locations: string;
  aboPackage: string;
  monthly: string;
  yearly: string;
}> = {
  de: {
    locations: 'Standorte',
    aboPackage: 'Abo-Paket',
    monthly: 'Monatliche Orientierung',
    yearly: 'Jährliche Orientierung',
  },
  en: {
    locations: 'Locations',
    aboPackage: 'Subscription Package',
    monthly: 'Monthly Estimate',
    yearly: 'Yearly Estimate',
  },
  ru: {
    locations: 'Филиалы',
    aboPackage: 'Тарифный пакет',
    monthly: 'Ориентировочно в месяц',
    yearly: 'Ориентировочно в год',
  },
  tr: {
    locations: 'Şubeler',
    aboPackage: 'Abonelik Paketi',
    monthly: 'Aylık Tahmini',
    yearly: 'Yıllık Tahmini',
  },
  pl: {
    locations: 'Lokalizacje',
    aboPackage: 'Pakiet abonamentowy',
    monthly: 'Szacunek miesięczny',
    yearly: 'Szacunek roczny',
  },
  ar: {
    locations: 'المواقع',
    aboPackage: 'باقة الاشتراك',
    monthly: 'التقدير الشهري',
    yearly: 'التقدير السنوي',
  },
};

const FALLBACK_OPTIONS: ServiceCalculatorOptionCmsContent[] = [
  { label: 'PixelRing Check - 79€ / Standort', price: 79 },
  { label: 'PixelRing Care - 199€ / Standort', price: 199, default: true },
  { label: 'PixelRing Protect - 349€ / Standort', price: 349 },
];

function formatEuro(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ServiceCalculator({
  title = 'Grobe Monatskalkulation',
  description = 'Dieses Tool erzeugt nur eine Orientierung für den Vertrieb.',
  note = 'Abo-Rechner',
  defaultLocations = 8,
  options,
  footnote = 'Empfehlung: Reparaturen, Hebebühnen, Sondermaterial, Sturm-/Vandalismusschäden und große Erneuerungen separat kalkulieren.',
  locale = 'de',
}: ServiceCalculatorProps) {
  const normalizedOptions = (options ?? []).filter(
    (option): option is ServiceCalculatorOptionCmsContent & { label: string; price: number } =>
      Boolean(option.label && typeof option.price === 'number')
  );
  const calculatorOptions = normalizedOptions.length ? normalizedOptions : FALLBACK_OPTIONS;
  const defaultOption = calculatorOptions.find((option) => option.default) ?? calculatorOptions[0]!;
  const [locations, setLocations] = useState(defaultLocations);
  const [price, setPrice] = useState(defaultOption.price ?? 199);

  const monthly = locations * price;
  const yearly = monthly * 12;

  const t = TRANSLATIONS[locale] ?? TRANSLATIONS.de;

  return (
    <section id="rechner" className="bg-transparent px-6 py-20 text-white sm:py-24" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        <div className="calculator grid gap-7 items-stretch p-8 lg:p-[34px] rounded-[20px] bg-[#0D1B2A] shadow-2xl lg:grid-cols-[0.86fr_1.14fr]">
          <div className="flex flex-col justify-center min-w-0 pr-0 lg:pr-6">
            <div className="relative inline-flex items-center gap-2 text-xs font-black uppercase tracking-[1.4px] text-[#B8643E]">
              <span className="w-4 h-[2px] bg-white/72"></span>
              {note}
            </div>
            <h2 className="mt-4 font-outfit text-3xl font-extrabold leading-[1.1] sm:text-[44px] text-white">
              {title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/68 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="min-w-0 p-6 sm:p-[26px] border border-white/12 rounded-3xl bg-white/6 backdrop-blur-2xl">
            <div className="space-y-5">
              <label className="block">
                <span className="flex items-center justify-between gap-4 text-sm font-extrabold text-white">
                  {t.locations}
                  <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-[#B8643E]">
                    {locations}
                  </span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={locations}
                  onChange={(event) => setLocations(Number(event.target.value))}
                  className="mt-4 w-full accent-[#B8643E] cursor-pointer"
                />
              </label>

              <label className="block">
                <span className="text-sm font-extrabold text-white">{t.aboPackage}</span>
                <select
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  className="mt-3 min-h-[50px] w-full rounded-[14px] border border-white/18 bg-[#0D1B2A]/86 px-4 text-sm font-bold text-white outline-none transition focus:border-[#B8643E] cursor-pointer"
                >
                  {calculatorOptions.map((option) => (
                    <option key={`${option.label}-${option.price}`} value={option.price} className="bg-[#0D1B2A] text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3.5">
              <div className="rounded-[18px] bg-white/92 p-[18px] text-[#0D1B2A]">
                <small className="block text-[12px] font-extrabold uppercase tracking-[0.8px] text-[#4A5568]">
                  {t.monthly}
                </small>
                <strong className="mt-2 block font-outfit text-[28px] font-black leading-tight text-[#B8643E]">
                  {formatEuro(monthly)}
                </strong>
              </div>
              <div className="rounded-[18px] bg-white/92 p-[18px] text-[#0D1B2A]">
                <small className="block text-[12px] font-extrabold uppercase tracking-[0.8px] text-[#4A5568]">
                  {t.yearly}
                </small>
                <strong className="mt-2 block font-outfit text-[28px] font-black leading-tight text-[#B8643E]">
                  {formatEuro(yearly)}
                </strong>
              </div>
            </div>

            {footnote ? (
              <p className="mt-5 text-sm leading-relaxed text-white/68">
                {footnote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
