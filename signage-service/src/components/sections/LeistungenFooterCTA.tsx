'use client';

import React, { useState } from 'react';
import SectionEyebrow from '../common/SectionEyebrow';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';

interface LeistungenFooterCTAProps {
  locale: string;
  finalHeadline: string;
  finalText: string;
}

const LOCALIZED_TEXTS: Record<string, { eyebrow: string; trustIntro: string; ctaLabel: string }> = {
  de: {
    eyebrow: 'NEXT STEP',
    trustIntro: 'Geben Sie die Verantwortung für Ihre sichtbare Marke in die Hände von Spezialisten.',
    ctaLabel: 'Anfrage starten',
  },
  en: {
    eyebrow: 'NEXT STEP',
    trustIntro: 'Place the responsibility for your visible brand in the hands of specialists.',
    ctaLabel: 'Start request',
  },
  ru: {
    eyebrow: 'СЛЕДУЮЩИЙ ШАГ',
    trustIntro: 'Передайте ответственность за ваш визуальный бренд в руки специалистов.',
    ctaLabel: 'Начать заявку',
  },
  tr: {
    eyebrow: 'SONRAKİ ADIM',
    trustIntro: 'Görünür markanızın sorumluluğunu uzmanların ellerine bırakın.',
    ctaLabel: 'Talebi başlat',
  },
  pl: {
    eyebrow: 'NASTĘPNY KROK',
    trustIntro: 'Powierz odpowiedzialność za swoją widoczną markę w ręce specjalistów.',
    ctaLabel: 'Rozpocznij zapytanie',
  },
  ar: {
    eyebrow: 'الخطوة التالية',
    trustIntro: 'ضع مسؤولية علامتك التجارية المرئية بين أيدي المتخصصين.',
    ctaLabel: 'بدء الطلب',
  },
};

export default function LeistungenFooterCTA({
  locale,
  finalHeadline,
  finalText,
}: LeistungenFooterCTAProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const texts = LOCALIZED_TEXTS[locale] || LOCALIZED_TEXTS.de;

  return (
    <>
      <section className="bg-white px-6 py-14 sm:py-18">
        <div className="mx-auto max-w-7xl">
          <div
            className="grid gap-8 overflow-hidden rounded-[28px] border border-[#d3b2a2]/50 px-6 py-7 shadow-[0_18px_50px_rgba(8,24,39,0.08)] sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12"
            style={{
              background:
                'radial-gradient(circle at 88% 18%, rgba(184,100,62,0.16) 0%, transparent 30%), linear-gradient(135deg, #F3E7DE 0%, #EEF3F8 100%)',
            }}
          >
            {/* Left Column: Text Content */}
            <div className="min-w-0 flex flex-col items-start text-start">
              <SectionEyebrow className="mb-5">{texts.eyebrow}</SectionEyebrow>
              <h2 className="max-w-3xl text-[28px] font-extrabold leading-[1.12] tracking-[0] text-[#081827] sm:text-[34px] lg:text-[38px]">
                {finalHeadline}
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-[#526174] sm:text-[17px]">
                {finalText}
              </p>
              <p className="mt-4 max-w-2xl border-l-2 border-[#B8643E] pl-4 text-[14px] font-semibold leading-6 text-[#526174] rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
                {texts.trustIntro}
              </p>
            </div>

            {/* Right Column: Single CTA Button */}
            <div className="flex flex-wrap items-center gap-3 lg:justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#B8643E] px-7 py-3 text-[15px] font-black text-white shadow-[0_16px_34px_rgba(184,100,62,0.22)] transition-all duration-300 hover:bg-[#A65835] active:scale-[0.98] cursor-pointer"
              >
                {texts.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
