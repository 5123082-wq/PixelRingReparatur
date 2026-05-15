'use client';

import React from 'react';
import { useState } from 'react';
import { RoadmapCmsContent } from '@/lib/cms/pages';

interface RoadmapSectionProps {
  content?: RoadmapCmsContent;
}

const RoadmapSection = ({ content }: RoadmapSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

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

  const steps = (content?.steps || []).map((cmsStep) => ({
    title: cmsStep.title || '',
    description: cmsStep.description || '',
  }));
  const eyebrow = content?.subtitle?.trim();
  const description = content?.description?.trim();
  const activeNumber = String(activeIndex + 1).padStart(2, '0');

  return (
    <section className="relative w-full bg-[#F7F1E8] pt-12 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid gap-8 lg:grid-cols-[0.64fr_1.9fr] lg:items-start">
          <div className="relative flex flex-col gap-4 pr-0 lg:pr-8">
            <div className="relative z-10 flex flex-col gap-3">
              {eyebrow ? (
                <div className="flex items-center gap-3">
                  <div className="h-px w-7 bg-[#C7A58F]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#A88775]">
                    {eyebrow}
                  </span>
                </div>
              ) : null}
              <h2 className="max-w-[360px] text-[24px] md:text-[28px] font-extrabold leading-[1.12] tracking-tight text-[#0E1A2B]">
                {content?.title || ''}
              </h2>
            </div>
            <div className="relative z-10 flex items-end justify-between gap-5">
              {description ? (
                <p className="max-w-[330px] text-[13px] leading-relaxed text-[#72665D]/74">
                  {description}
                </p>
              ) : null}
              <div className="relative h-10 w-14 shrink-0 overflow-hidden text-right" aria-hidden="true">
                <span
                  key={activeNumber}
                  className="absolute inset-0 text-[34px] font-black leading-none text-[#D9C7BA]/60 transition-all duration-500 motion-safe:animate-[roadmap-number-in_500ms_ease-out]"
                >
                  {activeNumber}
                </span>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-3 md:gap-4 ${
            steps.length === 3 ? 'md:grid-cols-3' :
            steps.length === 4 ? 'md:grid-cols-4' :
            steps.length === 2 ? 'md:grid-cols-2' :
            'md:grid-cols-4'
          }`}>
            {steps.map((step, index) => {
              const isActive = activeIndex === index;

              return (
                <article
                  key={index}
                  tabIndex={0}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative flex min-h-[150px] cursor-default flex-col gap-3.5 rounded-[18px] border outline-none transition-all duration-500 md:min-h-[168px] ${
                    isActive
                      ? 'border-[#E1CCBD]/70 bg-white/40 shadow-[0_10px_26px_rgba(14,26,43,0.025)]'
                      : 'border-transparent bg-transparent hover:border-[#E7DDD3]/70 hover:bg-white/28 focus-visible:border-[#E7DDD3]/70 focus-visible:bg-white/28'
                  }`}
                  aria-label={`${index + 1}. ${step.title}`}
                >
                  <div className="flex items-center justify-between gap-4 px-4 pt-5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-[13px] border transition-all duration-500 ${
                      isActive
                        ? 'border-[#D8B9A4] bg-[#F7F1E8] text-[#A45F42]'
                        : 'border-[#E7DDD3]/80 bg-transparent text-[#B28E7A]/80 group-hover:border-[#D8B9A4]'
                    }`}>
                      <StepIcon index={index} />
                    </div>
                    <span className={`text-[13px] font-black tracking-[0.18em] transition-all duration-500 ${
                      isActive ? 'text-[#A45F42]' : 'text-[#D9C7BA]/85'
                    }`}>
                      0{index + 1}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2.5 px-4 pb-5">
                    <h3 className={`text-[18px] font-extrabold leading-tight transition-colors duration-500 ${
                      isActive ? 'text-[#0E1A2B]' : 'text-[#18263A]'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-[13px] leading-[1.55] transition-colors duration-500 ${
                      isActive ? 'text-[#5F544D]' : 'text-[#72665D]/82'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`hidden md:block absolute right-[-14px] top-[34px] z-10 transition-all duration-500 ${
                      isActive ? 'text-[#A45F42]/80' : 'text-[#D0B7A5]/70'
                    }`}>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes roadmap-number-in {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default RoadmapSection;
