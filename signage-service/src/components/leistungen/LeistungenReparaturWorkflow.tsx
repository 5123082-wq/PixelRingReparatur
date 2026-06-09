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
    intro: 'Wählen Sie, was von außen sichtbar ist. Wenn Sie unsicher sind, reicht ein Foto oder eine kurze Beschreibung.',
    fallbackCta: 'Foto oder eigenen Fall senden',
    fallbackTitle: 'Nicht sicher, welcher Fall passt?',
    fallbackText: 'Senden Sie ein Foto der Werbeanlage oder beschreiben Sie kurz, was sichtbar ist.',
    selectCta: 'Diesen Fall beschreiben',
    previous: 'Vorherige Fälle',
    next: 'Weitere Fälle',
  },
  en: {
    eyebrow: 'Fast classification',
    intro: 'Choose what is visible from the outside. If you are not sure, a photo or short description is enough.',
    fallbackCta: 'Send photo or own case',
    fallbackTitle: 'Not sure which case fits?',
    fallbackText: 'Send a photo of the sign or briefly describe what is visible.',
    selectCta: 'Describe this case',
    previous: 'Previous cases',
    next: 'More cases',
  },
  ru: {
    eyebrow: 'Быстрая ориентация',
    intro: 'Выберите то, что видно снаружи. Если не уверены, просто отправьте фото или короткое описание.',
    fallbackCta: 'Отправить фото или свой случай',
    fallbackTitle: 'Не уверены, какой случай подходит?',
    fallbackText: 'Отправьте фото вывески или коротко опишите, что видно снаружи.',
    selectCta: 'Описать этот случай',
    previous: 'Предыдущие случаи',
    next: 'Еще случаи',
  },
  tr: {
    eyebrow: 'Hızlı sınıflandırma',
    intro: 'Dışarıdan görünen durumu seçin. Emin değilseniz fotoğraf veya kısa açıklama yeterlidir.',
    fallbackCta: 'Fotoğraf veya kendi durumunu gönder',
    fallbackTitle: 'Hangi durumun uygun olduğundan emin değil misiniz?',
    fallbackText: 'Tabelanın fotoğrafını gönderin veya dışarıdan görünen durumu kısaca açıklayın.',
    selectCta: 'Bu durumu açıkla',
    previous: 'Önceki durumlar',
    next: 'Daha fazla durum',
  },
  pl: {
    eyebrow: 'Szybka klasyfikacja',
    intro: 'Wybierz to, co widać z zewnątrz. Jeśli nie masz pewności, wystarczy zdjęcie albo krótki opis.',
    fallbackCta: 'Wyślij zdjęcie lub własny przypadek',
    fallbackTitle: 'Nie wiesz, który przypadek pasuje?',
    fallbackText: 'Wyślij zdjęcie reklamy albo krótko opisz, co widać z zewnątrz.',
    selectCta: 'Opisz ten przypadek',
    previous: 'Poprzednie przypadki',
    next: 'Więcej przypadków',
  },
  ar: {
    eyebrow: 'تصنيف سريع',
    intro: 'اختر ما يظهر من الخارج. إذا لم تكن متأكداً، تكفي صورة أو وصف قصير.',
    fallbackCta: 'أرسل صورة أو حالتك',
    fallbackTitle: 'ألست متأكداً من الحالة المناسبة؟',
    fallbackText: 'أرسل صورة اللوحة أو صف باختصار ما يظهر من الخارج.',
    selectCta: 'وصف هذه الحالة',
    previous: 'الحالات السابقة',
    next: 'حالات أخرى',
  },
};

const SYMPTOM_VISUALS: Record<string, { image: string }> = {
  flackern: {
    image: '/images/leistungen/repair-symptoms/symptom-flicker-led-modules.webp',
  },
  'led-letters': {
    image: '/images/leistungen/repair-symptoms/symptom-channel-letter-out.webp',
  },
  'rain-short': {
    image: '/images/leistungen/repair-symptoms/symptom-rain-water-damage.webp',
  },
  trafo: {
    image: '/images/leistungen/repair-symptoms/symptom-power-supply-replacement.webp',
  },
  structure: {
    image: '/images/leistungen/repair-symptoms/symptom-mechanical-storm-damage.webp',
  },
  film: {
    image: '/images/references/window-film-install.webp',
  },
  neon: {
    image: '/images/references/neon-bench.webp',
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
    <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
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

        {/* Symptoms Rail */}
        <div
          ref={railRef}
          className="-mx-4 mt-12 overflow-x-auto scroll-smooth px-4 pb-5 [scrollbar-width:none] [-ms-overflow-style:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex snap-x snap-mandatory gap-5 lg:gap-6">
            {regularSymptoms.map((symptom) => {
              const visual = SYMPTOM_VISUALS[symptom.id] ?? SYMPTOM_VISUALS['custom-issue'];

              return (
                <button
                  type="button"
                  key={symptom.id}
                  onClick={() => handleCardClick(symptom)}
                  aria-label={`${labels.selectCta}: ${symptom.title}`}
                  className="group relative flex min-h-[500px] w-[82vw] shrink-0 snap-start cursor-pointer flex-col overflow-hidden rounded-[24px] border border-[#E5EBF1] bg-white p-0 text-start shadow-[0_18px_50px_rgba(13,27,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(13,27,42,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] sm:w-[390px] lg:w-[392px] xl:w-[414px]"
                >
                  <div className="relative z-10 flex min-h-[252px] flex-1 flex-col px-6 pb-4 pt-7 sm:px-8 sm:pt-8">
                    <div className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#8F4C2F]">
                      {getSymptomAccent(symptom.id, locale)}
                    </div>
                    <h3 className="mt-4 break-words text-[30px] font-extrabold leading-[1.04] tracking-[0] text-[#0E1A2B] [overflow-wrap:anywhere] sm:text-[34px]">
                      {symptom.title}
                    </h3>
                    <p className="mt-4 line-clamp-2 break-words text-[17px] font-semibold leading-7 text-[#4E5A5A] [overflow-wrap:anywhere]">
                      {getCardPreviewText(symptom.cardText)}
                    </p>
                    <p className="sr-only">{symptom.cardText}</p>
                  </div>

                  <div className="relative mt-auto aspect-[1.28] w-full overflow-hidden">
                    <Image
                      src={visual.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 414px, (min-width: 1024px) 392px, (min-width: 640px) 390px, 82vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
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
