'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const RoadmapSection = () => {
  const t = useTranslations('Roadmap');

  const steps = [
    { title: t('steps.0.title'), description: t('steps.0.description') },
    { title: t('steps.1.title'), description: t('steps.1.description') },
    { title: t('steps.2.title'), description: t('steps.2.description') },
    { title: t('steps.3.title'), description: t('steps.3.description') },
  ];

  return (
    <section className="w-full bg-[#9FBFE0] py-24 px-6 border-y border-white/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-[36px] md:text-[44px] font-bold text-[#0E1A2B] leading-tight">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-[#B8643E] rounded-full mx-auto" />
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#0E1A2B20] -translate-y-1/2 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-6 group">
                {/* Circle Marker */}
                <div className="w-12 h-12 rounded-full bg-white border-4 border-[#9FBFE0] shadow-lg flex items-center justify-center text-[#0E1A2B] font-bold text-[18px] z-10 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[20px] font-bold text-[#0E1A2B]">
                    {step.title}
                  </h3>
                  <p className="text-[16px] text-[#0E1A2BA0] leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
