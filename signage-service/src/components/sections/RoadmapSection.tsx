'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { RoadmapCmsContent } from '@/lib/cms/pages';

interface RoadmapSectionProps {
  content?: RoadmapCmsContent;
}

const RoadmapSection = ({ content }: RoadmapSectionProps) => {
  const t = useTranslations('Roadmap');

  const StepIcon = ({ index }: { index: number }) => {
    const iconSize = "w-6 h-6";
    const icons = [
      // 1. Bestätigung (Confirmation/Ticket)
      <svg key="1" className={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.79252 19.2475 3.6249 17.4404C2.45728 15.6333 1.90528 13.5044 2.05047 11.3736C2.19565 9.24283 3.03043 7.22829 4.42935 5.63155C5.82827 4.03481 7.71886 2.94317 9.81848 2.51852C11.9181 2.09388 14.1107 2.35943 16.06 3.275" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      // 2. Zuweisung (User/Assignment)
      <svg key="2" className={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="18" y1="8" x2="23" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="23" y1="8" x2="18" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      // 3. Audit (Search/Analysis)
      <svg key="3" className={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 7V11L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>,
      // 4. Realisierung (Implementation/Service)
      <svg key="4" className={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ];
    return icons[index % icons.length];
  };

  const DEFAULT_STEP_KEYS = [0, 1, 2, 3] as const;

  // If CMS provides steps — use them dynamically; otherwise fall back to 4 static defaults
  const steps =
    content?.steps && content.steps.length > 0
      ? content.steps.map((cmsStep, idx) => ({
          title: cmsStep.title ?? t(`steps.${DEFAULT_STEP_KEYS[idx % DEFAULT_STEP_KEYS.length]}.title`),
          description: cmsStep.description ?? t(`steps.${DEFAULT_STEP_KEYS[idx % DEFAULT_STEP_KEYS.length]}.description`),
        }))
      : DEFAULT_STEP_KEYS.map((i) => ({
          title: t(`steps.${i}.title`),
          description: t(`steps.${i}.description`),
        }));

  return (
    <section className="relative w-full bg-[#F5F8FA] py-24 px-6 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#9FBFE030] rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#B8643E10] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-[40px] md:text-[52px] font-bold text-[#0E1A2B] leading-tight flex flex-col md:block">
            {content?.title ?? t('title')}
          </h2>
          <div className="w-16 h-1.5 bg-[#B8643E] rounded-full mx-auto" />
        </div>

        <div className="relative group/line">
          {/* Connecting Line with Dynamic Glow */}
          <div className="absolute top-[72px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0E1A2B15] to-transparent hidden md:block" />
          
          <div className={`grid grid-cols-1 gap-2 md:gap-6 relative ${
              steps.length === 3 ? 'md:grid-cols-3' :
              steps.length === 4 ? 'md:grid-cols-4' :
              steps.length === 2 ? 'md:grid-cols-2' :
              'md:grid-cols-4'
            }`}>
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col group w-full max-w-[320px] mx-auto md:max-w-none">
                
                {/* Unified Card */}
                <div className="flex flex-col bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/60 shadow-lg shadow-[#0E1A2B04] group-hover:shadow-2xl group-hover:shadow-[#0E1A2B10] group-hover:-translate-y-2 transition-all duration-500 overflow-hidden flex-grow relative z-10 w-full">
                  
                  {/* Top part: Icon & Number Background */}
                  <div className="relative p-6 flex flex-col items-center md:items-start justify-center bg-white/60 group-hover:bg-white transition-colors duration-500 border-b border-black/5">
                    {/* Number */}
                    <div className="absolute top-4 right-6 text-[44px] font-black text-[#0E1A2B] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none tracking-tighter">
                      0{index + 1}
                    </div>
                    
                    {/* Icon Wrapper */}
                    <div className="relative w-24 h-24 md:w-20 md:h-20 rounded-3xl bg-white shadow-[0_10px_30px_rgba(14,26,43,0.06)] border border-black/5 flex items-center justify-center text-[#B8643E] group-hover:bg-[#B8643E] group-hover:text-white transition-all duration-500 z-10">
                      <div className="scale-[1.15] group-hover:scale-[1.25] transition-transform duration-500">
                        <StepIcon index={index} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom part: Text Content */}
                  <div className="flex flex-col gap-3 p-6 pt-5 bg-transparent flex-grow text-center md:text-left">
                    <h3 className="text-[20px] font-bold text-[#0E1A2B] leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-[#0E1A2BA0] leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector (Mobile Only) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-3 text-[#B8643E] opacity-50 transition-opacity group-hover:opacity-100">
                    <svg className="w-6 h-6 animate-bounce" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
