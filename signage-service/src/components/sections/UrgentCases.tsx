'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface UrgentCasesProps {
  isSidebar?: boolean;
}

const UrgentCases = ({ isSidebar = false }: UrgentCasesProps) => {
  const t = useTranslations('Support');

  const handlePhoneClick = () => {
    window.location.href = 'tel:+491234567890'; // Placeholder
  };

  const containerPadding = isSidebar ? 'p-6 md:p-8' : 'p-8 md:p-16';
  const gridLayout = isSidebar ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2';
  const titleSize = isSidebar ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl';
  const descSize = isSidebar ? 'text-lg' : 'text-xl';
  const buttonLayout = isSidebar ? 'flex-col' : 'flex-col sm:flex-row lg:justify-end';
  const buttonPadding = isSidebar ? 'px-6 py-4' : 'px-10 py-5';

  return (
    <div className={`${isSidebar ? '' : 'py-12 md:py-20'} relative overflow-hidden`}>
      <div className={isSidebar ? '' : 'max-w-7xl mx-auto px-4 sm:px-6'}>
        <div className={`bg-[#B8643E] rounded-[32px] ${containerPadding} relative overflow-hidden text-[#FFFDF9] shadow-2xl shadow-[#B8643E]/30`}>
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
              <path d="M0 100L100 0H0V100Z" fill="white" />
            </svg>
          </div>

          <div className={`relative z-10 grid ${gridLayout} gap-8 items-center`}>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-[12px] md:text-[14px] font-bold tracking-wider uppercase">{t('urgent_badge')}</span>
              </div>
              
              <h2 className={`${titleSize} font-bold mb-4 leading-tight`}>
                {t('urgent_cases_title')}
              </h2>
              
              <p className={`${descSize} text-white/90 leading-relaxed ${isSidebar ? 'mb-6' : 'mb-10'}`}>
                {t('urgent_cases_desc')}
              </p>
            </div>

            <div className={`flex ${buttonLayout} gap-4`}>
              <button 
                onClick={handlePhoneClick}
                className={`${buttonPadding} bg-white text-[#B8643E] text-[16px] md:text-[18px] font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('call_technician')}
              </button>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                className={`${buttonPadding} bg-[#A65835] text-white text-[16px] md:text-[18px] font-bold rounded-2xl shadow-xl hover:bg-[#8B482A] active:scale-[0.98] transition-all flex items-center justify-center`}
              >
                {t('send_request')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgentCases;
