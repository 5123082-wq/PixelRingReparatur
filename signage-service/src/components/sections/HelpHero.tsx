'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const HelpHero = () => {
  const t = useTranslations('Hilfe');

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B8643E]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#4A90E2]/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B8643E]/10 border border-[#B8643E]/20 rounded-full mb-6">
            <span className="text-[12px] font-bold text-[#B8643E] tracking-[1.4px] uppercase">
              Support Center
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] leading-[1.1] mb-6">
            <span className="text-[#B8643E]">{t('hero_title').split(' ')[0]}</span>{' '}
            {t('hero_title').split(' ').slice(1).join(' ')}
          </h1>
          
          <p className="text-lg md:text-xl text-[#72665D] leading-relaxed mb-8 max-w-2xl">
            {t('hero_description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HelpHero;
