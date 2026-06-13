'use client';

import React, { useState } from 'react';
import { FaqCmsContent } from '@/lib/cms/pages';
import SectionEyebrow from '../common/SectionEyebrow';

interface FAQSectionProps {
  content?: FaqCmsContent;
  titleClassName?: string;
}

const FAQSection = ({ content, titleClassName }: FAQSectionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const headingClassName = titleClassName || 'text-[36px] md:text-[44px] font-bold text-[#0E1A2B] leading-tight';

  const faqItems = (content?.items || []).map((item) => ({
    q: item.question || '',
    a: item.answer || '',
  }));

  return (
    <section className="w-full bg-[#F9F6F2] py-24 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className={headingClassName}>
            {content?.title || ''}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqItems.map((item, index) => {
            const isActive = activeIndex === index;

            return (
            <div
              key={index}
              className="bg-white rounded-3xl border border-[#E7DDD3] overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveIndex(isActive ? null : index)}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-start transition-colors hover:bg-[#F4EDE450] sm:px-8 sm:py-6"
                aria-expanded={isActive}
              >
                <span className="min-w-0 text-[17px] font-bold leading-snug text-[#0E1A2B] [overflow-wrap:anywhere] sm:text-[18px]">
                  {item.q}
                </span>
                <span className={`mt-0.5 shrink-0 transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="border-t border-[#E7DDD310] px-5 pb-6 pt-3 text-[15px] leading-[1.65] text-[#72665D] sm:px-8 sm:text-[16px]">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
