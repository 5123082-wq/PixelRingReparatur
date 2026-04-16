'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BentoGridCmsContent } from '@/lib/cms/pages';

interface BentoGridSectionProps {
  content?: BentoGridCmsContent;
}

const BentoGridSection = ({ content }: BentoGridSectionProps) => {
  const t = useTranslations('Bento');

  const DEFAULT_STEP_KEYS = [0, 1, 2, 3, 4] as const;

  // Helper: assign span class by position pattern (same visual rhythm as original design)
  const getCardClass = (idx: number, total: number): string => {
    // First card always spans 2 columns
    if (idx === 0) return 'md:col-span-2 lg:col-span-2 bg-white';
    // For 5-card layout: index 3 (4th card) gets accent wide span
    if (total === 5 && idx === 3) return 'md:col-span-2 lg:col-span-3 bg-[#B8643E] text-white';
    // For other layouts: last card gets accent wide span
    if (idx === total - 1 && total !== 5) return 'md:col-span-2 lg:col-span-3 bg-[#B8643E] text-white';
    return 'bg-white';
  };

  // If CMS provides steps — use them dynamically; otherwise fall back to 5 static defaults
  const steps =
    content?.steps && content.steps.length > 0
      ? content.steps.map((cmsStep, idx) => ({
          id: idx + 1,
          title: cmsStep.title ?? t(`steps.${DEFAULT_STEP_KEYS[idx % DEFAULT_STEP_KEYS.length]}.title`),
          description: cmsStep.description ?? t(`steps.${DEFAULT_STEP_KEYS[idx % DEFAULT_STEP_KEYS.length]}.description`),
          className: getCardClass(idx, content.steps!.length),
        }))
      : DEFAULT_STEP_KEYS.map((i) => ({
          id: i + 1,
          title: t(`steps.${i}.title`),
          description: t(`steps.${i}.description`),
          className: getCardClass(i, DEFAULT_STEP_KEYS.length),
        }));

  return (
    <section className="w-full bg-[#EED8C8] py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-[40px] md:text-[48px] font-bold text-[#0E1A2B] leading-tight">
            {content?.title ?? t('title')}
          </h2>
          <div className="w-20 h-1 bg-[#B8643E] rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-10 rounded-[40px] shadow-xl shadow-[#0E1A2B08] border border-[#E7DDD3] hover:translate-y-[-8px] transition-all duration-300 flex flex-col justify-between gap-8 ${step.className}`}
            >
              <div className="flex flex-col gap-4">
                <span className={`text-[14px] font-bold uppercase tracking-widest ${step.className.includes('text-white') ? 'text-white/70' : 'text-[#B8643E]'}`}>
                  Step 0{step.id}
                </span>
                <h3 className={`text-[24px] md:text-[28px] font-bold leading-tight ${step.className.includes('text-white') ? 'text-white' : 'text-[#0E1A2B]'}`}>
                  {step.title}
                </h3>
              </div>
              <p className={`text-[16px] leading-[1.6] ${step.className.includes('text-white') ? 'text-white/90' : 'text-[#72665D]'}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
