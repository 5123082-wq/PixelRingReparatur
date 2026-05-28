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

// Inline SVG Icon components mapped by symptom ID
function SymptomIcon({ id, className = "w-10 h-10 text-[#B8643E]" }: { id: string; className?: string }) {
  switch (id) {
    case 'flackern':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3.5l1.5 1.5M19 3.5L17.5 5M2 10.5h2M20 10.5h2" />
        </svg>
      );
    case 'led-letters':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19L12 4l8 15M6.5 14h11" />
          <path strokeLinecap="round" d="M12 9l6 11M3 21l18-18" stroke="currentColor" strokeWidth={2} />
        </svg>
      );
    case 'rain-short':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M4 7l2 2M20 7l-2 2" />
        </svg>
      );
    case 'trafo':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6v4H9z" />
        </svg>
      );
    case 'structure':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1M3 18l3-1m0-11l12-3a2 2 0 012 2v10a2 2 0 01-2 2L6 17M6 7v10M14 5v12M17 19v2M7 17v4" />
          <path strokeLinecap="round" d="M2 13h12" />
        </svg>
      );
    case 'film':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h1m0 4h3m-3 4h5M12 3v5h5" />
        </svg>
      );
    case 'neon':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12a4 4 0 108 0 4 4 0 00-8 0z" />
        </svg>
      );
    case 'mounting':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export default function LeistungenReparaturWorkflow({
  symptoms,
  title,
  locale,
  closeLabel = 'Schließen',
  formTitle = 'Service anfragen',
}: LeistungenReparaturWorkflowProps) {
  const [activeSymptom, setActiveSymptom] = useState<Symptom | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCardClick = (symptom: Symptom) => {
    setActiveSymptom(symptom);
    setIsDrawerOpen(true);
  };

  return (
    <section className="bg-[#F8FAFC] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl ltr:text-left rtl:text-right">
          <SectionEyebrow className="mb-3">
            {locale === 'ru' ? 'Быстрая диагностика' : locale === 'de' ? 'Schnelle Diagnose' : 'Diagnostics'}
          </SectionEyebrow>
          <h2 className="mt-2 text-3xl font-extrabold leading-[1.08] text-[#0E1A2B] sm:text-5xl">
            {title}
          </h2>
        </div>

        {/* Symptoms Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {symptoms.map((symptom, index) => {
            const isFallback = symptom.id === 'custom-issue';
            return (
              <article
                key={symptom.id}
                onClick={() => handleCardClick(symptom)}
                className={`group flex flex-col justify-between min-h-[300px] rounded-[28px] border p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                  isFallback
                    ? 'border-dashed border-[#B8643E]/45 bg-[#FFF4EC]/20 hover:bg-[#FFF4EC]/40 hover:border-[#B8643E]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#B8643E]/40 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl transition-colors duration-300 ${isFallback ? 'bg-[#FFF4EC]' : 'bg-[#F8FAFC] group-hover:bg-[#FFF4EC]'}`}>
                      <SymptomIcon id={symptom.id} className="w-7 h-7 text-[#B8643E]" />
                    </div>
                    <span className="text-[13px] font-black text-[#B8643E]/50 tracking-wider">
                      {isFallback ? 'INFO' : String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="ltr:text-left rtl:text-right">
                    <h3 className="text-xl font-bold leading-snug text-[#0E1A2B] group-hover:text-[#B8643E] transition-colors">
                      {symptom.title}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-[#72665D]">
                      {symptom.cardText}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8EEF5] flex items-center justify-between text-[13px] font-bold text-[#B8643E]">
                  <span>
                    {isFallback
                      ? (locale === 'ru' ? 'Описать свой случай' : locale === 'de' ? 'Eigenes Problem beschreiben' : 'Describe your case')
                      : (locale === 'ru' ? 'Выбрать и починить' : locale === 'de' ? 'Auswählen & reparieren' : 'Select & Repair')
                    }
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#FFF4EC] text-[#B8643E] flex items-center justify-center group-hover:bg-[#B8643E] group-hover:text-white transition-colors duration-300">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
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
