'use client';

import React, { useState } from 'react';
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
  { eyebrow: string; fallbackCta: string; selectCta: string }
> = {
  de: {
    eyebrow: 'Schnelle Diagnose',
    fallbackCta: 'Eigenes Problem beschreiben',
    selectCta: 'Auswählen & reparieren',
  },
  en: {
    eyebrow: 'Fast diagnosis',
    fallbackCta: 'Describe your case',
    selectCta: 'Select & repair',
  },
  ru: {
    eyebrow: 'Быстрая диагностика',
    fallbackCta: 'Описать свой случай',
    selectCta: 'Выбрать и починить',
  },
  tr: {
    eyebrow: 'Hızlı teşhis',
    fallbackCta: 'Kendi durumunuzu açıklayın',
    selectCta: 'Seç ve onar',
  },
  pl: {
    eyebrow: 'Szybka diagnoza',
    fallbackCta: 'Opisz swój przypadek',
    selectCta: 'Wybierz i napraw',
  },
  ar: {
    eyebrow: 'تشخيص سريع',
    fallbackCta: 'صف حالتك',
    selectCta: 'اختر وابدأ الإصلاح',
  },
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
  const labels = WORKFLOW_LABELS[locale] ?? WORKFLOW_LABELS.de;

  const handleCardClick = (symptom: Symptom) => {
    setActiveSymptom(symptom);
    setIsDrawerOpen(true);
  };

  return (
    <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl ltr:text-left rtl:text-right">
          <SectionEyebrow className="mb-3">
            {labels.eyebrow}
          </SectionEyebrow>
          <h2 className="mt-2 max-w-full break-words text-3xl font-extrabold leading-[1.08] text-[#0E1A2B] [overflow-wrap:anywhere] sm:text-5xl">
            {title}
          </h2>
        </div>

        {/* Symptoms Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {symptoms.map((symptom) => {
            const isFallback = symptom.id === 'custom-issue';
            return (
              <article
                key={symptom.id}
                onClick={() => handleCardClick(symptom)}
                className={`group flex cursor-pointer flex-col justify-between rounded-[28px] border p-6 transition-all duration-300 ${
                  isFallback
                    ? 'min-h-[220px] border-dashed border-[#B8643E]/45 bg-[#FFF4EC]/20 hover:bg-[#FFF4EC]/40 hover:border-[#B8643E] md:col-span-2 lg:col-start-2'
                    : 'min-h-[280px] border-[#E2E8F0] bg-white hover:border-[#B8643E]/40 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col gap-5">
                  <div className="ltr:text-left rtl:text-right">
                    <h3 className="break-words text-xl font-bold leading-snug text-[#0E1A2B] transition-colors [overflow-wrap:anywhere] group-hover:text-[#B8643E]">
                      {symptom.title}
                    </h3>
                    <p className="mt-3 break-words text-[14.5px] leading-relaxed text-[#72665D] [overflow-wrap:anywhere]">
                      {symptom.cardText}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#E8EEF5] pt-4 text-[13px] font-bold text-[#B8643E]">
                  <span>
                    {isFallback ? labels.fallbackCta : labels.selectCta}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
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
