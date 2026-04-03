'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const RoadmapSection = () => {
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
    return icons[index];
  };

  const steps = [
    { title: t('steps.0.title'), description: t('steps.0.description') },
    { title: t('steps.1.title'), description: t('steps.1.description') },
    { title: t('steps.2.title'), description: t('steps.2.description') },
    { title: t('steps.3.title'), description: t('steps.3.description') },
  ];

  return (
    <section className="relative w-full bg-[#F5F8FA] py-24 px-6 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#9FBFE030] rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#B8643E10] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-[40px] md:text-[52px] font-bold text-[#0E1A2B] leading-tight flex flex-col md:block">
            {t('title')}
          </h2>
          <div className="w-16 h-1.5 bg-[#B8643E] rounded-full mx-auto" />
        </div>

        <div className="relative group/line">
          {/* Connecting Line with Dynamic Glow */}
          <div className="absolute top-[48px] left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#0E1A2B15] to-transparent hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-8 group">
                
                {/* Step Connector Label (Vertical on Mobile) */}
                <div className="md:hidden absolute top-[-20px] left-1/2 -translate-x-1/2 w-[2px] h-8 bg-[#0E1A2B10]" />

                {/* Circle Marker / Icon Wrapper */}
                <div className="relative">
                  {/* Decorative Outer Glow */}
                  <div className="absolute inset-0 bg-[#B8643E20] rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />
                  
                  <div className="relative w-24 h-24 rounded-3xl bg-white shadow-[0_20px_50px_rgba(14,26,43,0.08)] border border-black/5 flex items-center justify-center text-[#B8643E] group-hover:bg-[#B8643E] group-hover:text-white transition-all duration-500 group-hover:-translate-y-2 z-20 overflow-hidden">
                    {/* Index Number Indicator */}
                    <div className="absolute top-2 right-3 text-[12px] font-bold opacity-30 group-hover:opacity-100 transition-opacity">
                      0{index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="scale-125 transform transition-transform group-hover:scale-135 duration-500">
                      <StepIcon index={index} />
                    </div>

                    {/* Subtle Internal Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex flex-col gap-4 p-8 pt-6 bg-white/40 backdrop-blur-sm rounded-[32px] border border-white/60 shadow-lg shadow-[#0E1A2B04] group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-[#0E1A2B10] transition-all duration-500 flex-grow w-full max-w-[280px] group-hover:-translate-y-1">
                  <h3 className="text-[22px] font-bold text-[#0E1A2B] leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-[#0E1A2BA0] leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Connector (Mobile Only) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex flex-col items-center gap-2 text-[#0E1A2B20]">
                    <div className="w-[2px] h-8 bg-current" />
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
