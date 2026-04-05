'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const SupportCTA = () => {
  const t = useTranslations('Support');

  const handleOpenContactModal = () => {
    window.dispatchEvent(new CustomEvent('openContactModal'));
  };

  return (
    <section className="py-24 bg-[#B8643E]/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#B8643E]/5 blur-[80px] rounded-full translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
            {t('cta_title')}
          </h2>
          <p className="text-lg text-[#72665D] mb-10 leading-relaxed">
            {t('cta_desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleOpenContactModal}
              className="w-full sm:w-auto px-8 py-4 bg-[#B8643E] text-white font-bold rounded-full hover:bg-[#A05532] transition-all duration-300 shadow-lg shadow-[#B8643E]/20"
            >
              {t('cta_primary')}
            </button>
            <button
              onClick={handleOpenContactModal}
              className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm border border-[#E8DFD5] text-[#1A1A1A] font-bold rounded-full hover:bg-white transition-all duration-300"
            >
              {t('cta_secondary')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportCTA;
