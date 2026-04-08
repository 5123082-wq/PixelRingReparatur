'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const TrustSection = () => {
  const t = useTranslations('Trust');

  type FeatureIconType = 'reinraum' | 'doc' | 'audit';

  const FeatureIcon = ({ type }: { type: FeatureIconType }) => {
    const icons = {
      reinraum: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      doc: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      audit: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[type] || null;
  };

  const statKeys = ['turnaround', 'warranty', 'hardware', 'rating'] as const;
  const featureItems: Array<{
    key: 'feature1' | 'feature2' | 'feature3';
    icon: FeatureIconType;
  }> = [
    { key: 'feature1', icon: 'reinraum' },
    { key: 'feature2', icon: 'doc' },
    { key: 'feature3', icon: 'audit' },
  ];

  return (
    <section className="relative w-full bg-[#F9F6F2] py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-stretch relative z-10">
        
        {/* Left Column: Vision & Features */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 max-w-xl">
            <h2 className="text-[40px] md:text-[56px] font-bold text-[#0E1A2B] leading-[1.1] tracking-tight">
              {t('title_start')}
              <span className="text-[#B8643E]">{t('title_accent')}</span>
              {t('title_end')}
            </h2>
            <p className="text-[18px] md:text-[20px] text-[#4A5568] leading-[1.6]">
              {t('description')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {featureItems.map((feature) => (
              <div 
                key={feature.key}
                className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-sm border border-black/[0.03] hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#B8643E0A] text-[#B8643E] rounded-xl group-hover:bg-[#B8643E] group-hover:text-white transition-colors">
                  <FeatureIcon type={feature.icon} />
                </div>
                <span className="text-[18px] font-semibold text-[#0E1A2B]">
                  {t(feature.key)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stats Grid Card */}
        <div className="w-full flex flex-col">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#0E1A2B08] border border-black/[0.04] p-10 md:p-14 h-full flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {statKeys.map((key) => (
                <div key={key} className="flex flex-col gap-3">
                  <div className="text-[44px] md:text-[52px] font-bold text-[#B8643E] leading-none tracking-tight">
                    {t(`stats.${key}.value`)}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[14px] font-black text-[#0E1A2B] tracking-widest uppercase">
                      {t(`stats.${key}.label`)}
                    </h3>
                    <p className="text-[15px] leading-[1.5] text-[#718096]">
                      {t(`stats.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#B8643E05] to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
    </section>
  );
};

export default TrustSection;
