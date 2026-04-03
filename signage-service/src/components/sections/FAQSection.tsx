'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const FAQSection = () => {
  const t = useTranslations('FAQ');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems = [
    { q: t('items.0.question'), a: t('items.0.answer') },
    { q: t('items.1.question'), a: t('items.1.answer') },
    { q: t('items.2.question'), a: t('items.2.answer') },
    { q: t('items.3.question'), a: t('items.3.answer') },
  ];

  return (
    <section className="w-full bg-[#f8f9fa] py-24 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-[36px] md:text-[44px] font-bold text-[#0E1A2B] leading-tight">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-[#C86E4A] rounded-full mx-auto" />
        </div>

        <div className="flex flex-col gap-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-[#E7DDD3] overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-[#F6F0E950] transition-colors"
                aria-expanded={activeIndex === index}
              >
                <span className="text-[18px] font-bold text-[#0E1A2B]">
                  {item.q}
                </span>
                <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-[#C86E4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-6 text-[16px] leading-[1.6] text-[#72665D] border-t border-[#E7DDD310] pt-2">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
