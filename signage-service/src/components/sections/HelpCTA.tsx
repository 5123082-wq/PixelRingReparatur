'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const HelpCTA = () => {
  const t = useTranslations('Hilfe');

  return (
    <section className="py-20 md:py-32 bg-[#EEF3FB]/50 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-[#B8643E]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-6 max-w-3xl mx-auto leading-tight">
          {t('cta_title')}
        </h2>
        
        <p className="text-lg md:text-xl text-[#72665D] mb-12 max-w-2xl mx-auto">
          {t('cta_desc')}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-xl mx-auto">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
            className="flex-1 px-8 py-5 bg-[#B8643E] text-white text-[18px] font-bold rounded-2xl shadow-xl shadow-[#B8643E22] hover:bg-[#A65835] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            {t('cta_primary')}
          </button>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
            className="flex-1 px-8 py-5 bg-white text-[#72665D] text-[18px] font-bold rounded-2xl border border-[#E7DDD3] hover:border-[#B8643E] hover:bg-white/80 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('cta_secondary')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelpCTA;
