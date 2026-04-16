'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BentoGridCmsContent } from '@/lib/cms/pages';

interface BentoGridSectionProps {
  content?: BentoGridCmsContent;
}

const BentoGridSection = ({ content }: BentoGridSectionProps) => {
  const t = useTranslations('Bento');

  const steps = [
    {
      id: 1,
      title: content?.steps?.[0]?.title ?? t('steps.0.title'),
      description: content?.steps?.[0]?.description ?? t('steps.0.description'),
      className: 'md:col-span-2 lg:col-span-2 bg-white',
    },
    {
      id: 2,
      title: content?.steps?.[1]?.title ?? t('steps.1.title'),
      description: content?.steps?.[1]?.description ?? t('steps.1.description'),
      className: 'bg-white',
    },
    {
      id: 3,
      title: content?.steps?.[2]?.title ?? t('steps.2.title'),
      description: content?.steps?.[2]?.description ?? t('steps.2.description'),
      className: 'bg-white',
    },
    {
      id: 4,
      title: content?.steps?.[3]?.title ?? t('steps.3.title'),
      description: content?.steps?.[3]?.description ?? t('steps.3.description'),
      className: 'md:col-span-2 lg:col-span-3 bg-[#B8643E] text-white',
    },
    {
      id: 5,
      title: content?.steps?.[4]?.title ?? t('steps.4.title'),
      description: content?.steps?.[4]?.description ?? t('steps.4.description'),
      className: 'bg-white',
    },
  ];

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
                <span className={`text-[14px] font-bold uppercase tracking-widest ${step.id === 4 ? 'text-white/70' : 'text-[#B8643E]'}`}>
                  Step 0{step.id}
                </span>
                <h3 className={`text-[24px] md:text-[28px] font-bold leading-tight ${step.id === 4 ? 'text-white' : 'text-[#0E1A2B]'}`}>
                  {step.title}
                </h3>
              </div>
              <p className={`text-[16px] leading-[1.6] ${step.id === 4 ? 'text-white/90' : 'text-[#72665D]'}`}>
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
