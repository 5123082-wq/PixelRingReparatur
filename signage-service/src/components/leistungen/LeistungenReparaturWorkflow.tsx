'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenProblemDrawer from './LeistungenProblemDrawer';

type Symptom = {
  id: string;
  title: string;
  cardText: string;
  reassuringText: string;
  prefillMessage: string;
};

interface LeistungenReparaturWorkflowProps {
  symptoms: Symptom[];
  title: string;
  locale: string;
  closeLabel?: string;
  formTitle?: string;
}

const WORKFLOW_LABELS: Record<
  string,
  {
    eyebrow: string;
    intro: string;
    fallbackCta: string;
    fallbackTitle: string;
    fallbackText: string;
    selectCta: string;
    previous: string;
    next: string;
  }
> = {
  de: {
    eyebrow: 'Schnelle Einordnung',
    intro: 'Wählen Sie den ähnlichsten Fall aus und beschreiben Sie kurz Ihre Störung. Wenn nichts passt, reichen ein Foto oder wenige Worte.',
    fallbackCta: 'Foto oder eigenen Fall senden',
    fallbackTitle: 'Nicht sicher, welcher Fall passt?',
    fallbackText: 'Senden Sie ein Foto der Werbeanlage oder beschreiben Sie kurz den eigenen Fall.',
    selectCta: 'Diesen Fall beschreiben',
    previous: 'Vorherige Fälle',
    next: 'Weitere Fälle',
  },
  en: {
    eyebrow: 'Fast classification',
    intro: 'Choose the closest case and briefly describe the problem. If nothing fits, a photo or a few words are enough.',
    fallbackCta: 'Send photo or own case',
    fallbackTitle: 'Not sure which case fits?',
    fallbackText: 'Send a photo of the sign or briefly describe your own case.',
    selectCta: 'Describe this case',
    previous: 'Previous cases',
    next: 'More cases',
  },
  ru: {
    eyebrow: 'Быстрая ориентация',
    intro: 'Выберите похожий случай и кратко опишите проблему. Если ничего не подходит, достаточно фото или пары слов.',
    fallbackCta: 'Отправить фото или свой случай',
    fallbackTitle: 'Не уверены, какой случай подходит?',
    fallbackText: 'Отправьте фото вывески или коротко опишите свой случай.',
    selectCta: 'Описать этот случай',
    previous: 'Предыдущие случаи',
    next: 'Еще случаи',
  },
  tr: {
    eyebrow: 'Hızlı sınıflandırma',
    intro: 'En yakın durumu seçin ve sorunu kısaca açıklayın. Hiçbiri uymuyorsa fotoğraf veya birkaç kelime yeterlidir.',
    fallbackCta: 'Fotoğraf veya kendi durumunu gönder',
    fallbackTitle: 'Hangi durumun uygun olduğundan emin değil misiniz?',
    fallbackText: 'Tabelanın fotoğrafını gönderin veya kendi durumunuzu kısaca açıklayın.',
    selectCta: 'Bu durumu açıkla',
    previous: 'Önceki durumlar',
    next: 'Daha fazla durum',
  },
  pl: {
    eyebrow: 'Szybka klasyfikacja',
    intro: 'Wybierz najbardziej podobny przypadek i krótko opisz problem. Jeśli nic nie pasuje, wystarczy zdjęcie albo kilka słów.',
    fallbackCta: 'Wyślij zdjęcie lub własny przypadek',
    fallbackTitle: 'Nie wiesz, który przypadek pasuje?',
    fallbackText: 'Wyślij zdjęcie reklamy albo krótko opisz swój przypadek.',
    selectCta: 'Opisz ten przypadek',
    previous: 'Poprzednie przypadki',
    next: 'Więcej przypadków',
  },
  ar: {
    eyebrow: 'تصنيف سريع',
    intro: 'اختر الحالة الأقرب واصف المشكلة باختصار. إذا لم تكن أي حالة مناسبة، تكفي صورة أو بضع كلمات.',
    fallbackCta: 'أرسل صورة أو حالتك',
    fallbackTitle: 'ألست متأكداً من الحالة المناسبة؟',
    fallbackText: 'أرسل صورة اللوحة أو صف حالتك باختصار.',
    selectCta: 'وصف هذه الحالة',
    previous: 'الحالات السابقة',
    next: 'حالات أخرى',
  },
};

const SYMPTOM_VISUALS: Record<string, { image: string; repairedImage?: string; unoptimized?: boolean }> = {
  flackern: {
    image: '/images/leistungen/repair-symptoms/generated/pixelring-lightbox-flicker-smooth-before.webp',
    repairedImage: '/images/leistungen/repair-symptoms/generated/pixelring-lightbox-flicker-after.webp',
    unoptimized: true,
  },
  'led-letters': {
    image: '/images/leistungen/repair-symptoms/generated/pixelring-led-letters-before.webp',
    repairedImage: '/images/leistungen/repair-symptoms/generated/pixelring-led-letters-after.webp',
  },
  'rain-short': {
    image: '/images/leistungen/repair-symptoms/generated/pixelring-rain-short-before.webp',
    repairedImage: '/images/leistungen/repair-symptoms/generated/pixelring-rain-short-after.webp',
  },
  trafo: {
    image: '/images/leistungen/repair-symptoms/generated/pixelring-power-supply-before.webp',
    repairedImage: '/images/leistungen/repair-symptoms/generated/pixelring-power-supply-after.webp',
  },
  structure: {
    image: '/images/leistungen/repair-symptoms/generated/pixelring-mechanical-damage-before.webp',
    repairedImage: '/images/leistungen/repair-symptoms/generated/pixelring-mechanical-damage-after.webp',
  },
  film: {
    image: '/images/leistungen/repair-symptoms/generated/pixelring-film-damage-before.webp',
    repairedImage: '/images/leistungen/repair-symptoms/generated/pixelring-film-damage-after.webp',
  },
  neon: {
    image: '/images/leistungen/repair-symptoms/generated/pixelring-neon-repair-before.webp',
    repairedImage: '/images/leistungen/repair-symptoms/generated/pixelring-neon-repair-after.webp',
  },
  mounting: {
    image: '/images/references/lightbox-lift.webp',
  },
  'custom-issue': {
    image: '/images/leistungen/repair-symptoms/symptom-send-photo-assessment.webp',
  },
};

const SYMPTOM_ACCENTS: Record<string, Record<string, string>> = {
  de: {
    flackern: 'LED / Lichtbild',
    'led-letters': 'Buchstaben',
    'rain-short': 'Regen / Feuchtigkeit',
    trafo: 'Elektrik',
    structure: 'Rahmen / Acryl',
    film: 'Folie',
    neon: 'Neon',
    mounting: 'Montage',
    'custom-issue': 'Foto reicht',
  },
  en: {
    flackern: 'LED / light image',
    'led-letters': 'Letters',
    'rain-short': 'Rain / moisture',
    trafo: 'Electrical',
    structure: 'Frame / acrylic',
    film: 'Film',
    neon: 'Neon',
    mounting: 'Mounting',
    'custom-issue': 'Photo is enough',
  },
  ru: {
    flackern: 'LED / свет',
    'led-letters': 'Буквы',
    'rain-short': 'Дождь / влага',
    trafo: 'Электрика',
    structure: 'Рама / акрил',
    film: 'Пленка',
    neon: 'Неон',
    mounting: 'Монтаж',
    'custom-issue': 'Достаточно фото',
  },
  tr: {
    flackern: 'LED / ışık',
    'led-letters': 'Harfler',
    'rain-short': 'Yağmur / nem',
    trafo: 'Elektrik',
    structure: 'Çerçeve / akrilik',
    film: 'Folyo',
    neon: 'Neon',
    mounting: 'Montaj',
    'custom-issue': 'Fotoğraf yeterli',
  },
  pl: {
    flackern: 'LED / światło',
    'led-letters': 'Litery',
    'rain-short': 'Deszcz / wilgoć',
    trafo: 'Elektryka',
    structure: 'Rama / akryl',
    film: 'Folia',
    neon: 'Neon',
    mounting: 'Montaż',
    'custom-issue': 'Wystarczy zdjęcie',
  },
  ar: {
    flackern: 'LED / إضاءة',
    'led-letters': 'حروف',
    'rain-short': 'مطر / رطوبة',
    trafo: 'كهرباء',
    structure: 'إطار / أكريليك',
    film: 'فيلم',
    neon: 'نيون',
    mounting: 'تثبيت',
    'custom-issue': 'الصورة تكفي',
  },
};

const getSymptomAccent = (symptomId: string, locale: string) => {
  const accentSet = SYMPTOM_ACCENTS[locale] ?? SYMPTOM_ACCENTS.de;
  return accentSet[symptomId] ?? accentSet['custom-issue'];
};

const getCardPreviewText = (text: string) => {
  const [firstSentence] = text.split(/(?<=[.!?])\s+/);
  return firstSentence || text;
};

export default function LeistungenReparaturWorkflow({
  symptoms,
  title,
  locale,
  closeLabel = 'Schließen',
  formTitle = 'Service anfragen',
}: LeistungenReparaturWorkflowProps) {
  const [activeSymptom, setActiveSymptom] = useState<Symptom | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previewedSymptomId, setPreviewedSymptomId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const labels = WORKFLOW_LABELS[locale] ?? WORKFLOW_LABELS.de;
  const fallbackSymptom = symptoms.find((symptom) => symptom.id === 'custom-issue');
  const regularSymptoms = symptoms.filter((symptom) => symptom.id !== 'custom-issue');

  const handleCardClick = (symptom: Symptom) => {
    setActiveSymptom(symptom);
    setIsDrawerOpen(true);
  };

  const scrollRail = (direction: 'previous' | 'next') => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const scrollDistance = Math.min(rail.clientWidth * 0.86, 760);
    rail.scrollBy({
      left: direction === 'next' ? scrollDistance : -scrollDistance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="overflow-hidden bg-[#F5F5F7] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl ltr:text-left rtl:text-right">
            <SectionEyebrow className="mb-3">
              {labels.eyebrow}
            </SectionEyebrow>
            <h2 className="mt-2 max-w-full break-words text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] [overflow-wrap:anywhere] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] font-semibold leading-8 text-[#526174]">
              {labels.intro}
            </p>
          </div>

          <div className="flex gap-3 self-start lg:self-end">
            <button
              type="button"
              onClick={() => scrollRail('previous')}
              aria-label={labels.previous}
              className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#B8643E] text-[#B8643E] transition-all duration-300 hover:bg-[#B8643E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
            >
              <svg
                className="h-6 w-6 transition-transform group-active:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollRail('next')}
              aria-label={labels.next}
              className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#B8643E] text-[#B8643E] transition-all duration-300 hover:bg-[#B8643E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
            >
              <svg
                className="h-6 w-6 transition-transform group-active:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Symptoms Rail */}
      <div
        ref={railRef}
        className="mt-12 w-screen overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInlineEnd: '1.5rem',
          paddingInlineStart: 'max(1rem, calc((100vw - 80rem) / 2 + 1rem))',
        }}
      >
        <div className="flex w-max snap-x snap-mandatory gap-5 lg:gap-6">
          {regularSymptoms.map((symptom) => {
            const visual = SYMPTOM_VISUALS[symptom.id] ?? SYMPTOM_VISUALS['custom-issue'];
            const showRepairPreview = previewedSymptomId === symptom.id;

            return (
              <button
                type="button"
                key={symptom.id}
                onClick={() => handleCardClick(symptom)}
                onBlur={() => setPreviewedSymptomId(null)}
                onFocus={() => setPreviewedSymptomId(symptom.id)}
                onMouseEnter={() => setPreviewedSymptomId(symptom.id)}
                onMouseLeave={() => setPreviewedSymptomId(null)}
                onMouseMove={() => setPreviewedSymptomId(symptom.id)}
                onPointerDown={() => setPreviewedSymptomId(symptom.id)}
                onPointerEnter={() => setPreviewedSymptomId(symptom.id)}
                onPointerLeave={() => setPreviewedSymptomId(null)}
                onPointerMove={() => setPreviewedSymptomId(symptom.id)}
                aria-label={`${labels.selectCta}: ${symptom.title}`}
                className="group relative min-h-[500px] w-[82vw] shrink-0 snap-start cursor-pointer overflow-hidden rounded-[28px] border border-white/35 bg-[#101827] p-0 text-start shadow-[0_10px_26px_rgba(0,0,0,0.055)] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] sm:w-[390px] lg:w-[392px] xl:w-[414px]"
              >
                <div className="absolute inset-x-0 top-0 h-[90%] overflow-hidden">
                  <Image
                    src={visual.image}
                    alt=""
                    fill
                    unoptimized={visual.unoptimized}
                    sizes="(min-width: 1280px) 414px, (min-width: 1024px) 392px, (min-width: 640px) 390px, 82vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  {visual.repairedImage ? (
                    <Image
                      src={visual.repairedImage}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 414px, (min-width: 1024px) 392px, (min-width: 640px) 390px, 82vw"
                      className={`object-cover transition duration-700 ${showRepairPreview ? 'scale-[1.04] opacity-100' : 'opacity-0'}`}
                    />
                  ) : null}
                </div>

                <div className="absolute left-5 top-5 z-20 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F] shadow-sm rtl:left-auto rtl:right-5">
                  {getSymptomAccent(symptom.id, locale)}
                </div>

                <div className="absolute -inset-x-px -bottom-px z-10 flex min-h-[252px] flex-col justify-end px-6 pb-6 pt-16 sm:px-8 sm:pb-7 sm:pt-20">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/84 via-white/58 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,#000_0%,#000_66%,rgba(0,0,0,0)_100%)]" />
                  <div className="relative z-10">
                    <h3 className="break-words text-[30px] font-extrabold leading-[1.04] tracking-[0] text-[#0E1A2B] [overflow-wrap:anywhere] sm:text-[34px]">
                      {symptom.title}
                    </h3>
                    <p className="mt-4 line-clamp-2 break-words pe-14 text-[17px] font-semibold leading-7 text-[#4E5A5A] [overflow-wrap:anywhere] sm:pe-16">
                      {getCardPreviewText(symptom.cardText)}
                    </p>
                    <p className="sr-only">{symptom.cardText}</p>
                  </div>
                </div>

                <span className="absolute bottom-5 end-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#B8643E] text-[24px] font-black leading-none text-white shadow-[0_14px_28px_rgba(13,27,42,0.18)] transition duration-300 group-hover:bg-[#A65835]" aria-hidden="true">
                  →
                </span>
                <span className="sr-only">{labels.selectCta}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {fallbackSymptom ? (
          <div className="mt-8 rounded-[24px] border border-[#D9C7BA] bg-white px-6 py-6 shadow-[0_16px_45px_rgba(13,27,42,0.05)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-3xl text-start">
              <h3 className="text-[22px] font-extrabold leading-tight tracking-[0] text-[#0E1A2B] sm:text-[28px]">
                {labels.fallbackTitle}
              </h3>
              <p className="mt-2 text-[15px] font-semibold leading-7 text-[#526174]">
                {labels.fallbackText}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCardClick(fallbackSymptom)}
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#B8643E] px-6 py-3 text-[14px] font-black text-white shadow-[0_16px_34px_rgba(184,100,62,0.22)] transition hover:bg-[#A65835] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] lg:mt-0 lg:shrink-0"
            >
              {labels.fallbackCta}
            </button>
          </div>
        ) : null}
      </div>

      {/* Slide-over Problem Drawer */}
      <LeistungenProblemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={activeSymptom?.title || ''}
        reassuringText={activeSymptom?.reassuringText || ''}
        initialMessage={activeSymptom?.prefillMessage || ''}
        initialIssueType="Repair"
        closeLabel={closeLabel}
        formTitle={formTitle}
      />
    </section>
  );
}
