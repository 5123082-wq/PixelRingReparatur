'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useInView } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ReviewCmsContent } from '@/lib/cms/pages';
import SectionEyebrow from '../common/SectionEyebrow';

interface ReviewsSectionProps {
  content?: ReviewCmsContent;
}

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type CaseLink = {
  label: string;
  href: string;
};

const CASE_LINKS_BY_LOCALE: Record<Locale, CaseLink[][]> = {
  de: [
    [
      { label: 'LED flackert', href: '/probleme-loesungen/werbeanlage-flackert' },
      { label: 'LED-Service', href: '/leistungen/lichtwerbung-led-modernisierung' },
      { label: 'Reparatur', href: '/leistungen/werbeanlagen-reparatur' },
    ],
    [
      { label: 'Folie löst sich', href: '/probleme-loesungen/folie-loest-sich' },
      { label: 'Buchstabe defekt', href: '/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'Regenausfall', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
    ],
    [
      { label: 'Montage', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Standortwechsel', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Werbeanlagen-Reparatur', href: '/leistungen/werbeanlagen-reparatur' },
    ],
  ],
  en: [
    [
      { label: 'Flickering LED', href: '/probleme-loesungen/werbeanlage-flackert' },
      { label: 'LED service', href: '/leistungen/lichtwerbung-led-modernisierung' },
      { label: 'Repair', href: '/leistungen/werbeanlagen-reparatur' },
    ],
    [
      { label: 'Peeling film', href: '/probleme-loesungen/folie-loest-sich' },
      { label: 'Letter outage', href: '/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'Rain failure', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
    ],
    [
      { label: 'Installation', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Relocation', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Signage repair', href: '/leistungen/werbeanlagen-reparatur' },
    ],
  ],
  ru: [
    [
      { label: 'LED мерцает', href: '/probleme-loesungen/werbeanlage-flackert' },
      { label: 'LED-сервис', href: '/leistungen/lichtwerbung-led-modernisierung' },
      { label: 'Ремонт', href: '/leistungen/werbeanlagen-reparatur' },
    ],
    [
      { label: 'Пленка отошла', href: '/probleme-loesungen/folie-loest-sich' },
      { label: 'Буква не горит', href: '/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'После дождя', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
    ],
    [
      { label: 'Монтаж', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Переезд объекта', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Ремонт вывесок', href: '/leistungen/werbeanlagen-reparatur' },
    ],
  ],
  tr: [
    [
      { label: 'LED titriyor', href: '/probleme-loesungen/werbeanlage-flackert' },
      { label: 'LED servis', href: '/leistungen/lichtwerbung-led-modernisierung' },
      { label: 'Onarim', href: '/leistungen/werbeanlagen-reparatur' },
    ],
    [
      { label: 'Folyo kalkiyor', href: '/probleme-loesungen/folie-loest-sich' },
      { label: 'Harf yanmiyor', href: '/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'Yagmur arizasi', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
    ],
    [
      { label: 'Montaj', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Adres degisimi', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Tabela onarimi', href: '/leistungen/werbeanlagen-reparatur' },
    ],
  ],
  pl: [
    [
      { label: 'LED miga', href: '/probleme-loesungen/werbeanlage-flackert' },
      { label: 'Serwis LED', href: '/leistungen/lichtwerbung-led-modernisierung' },
      { label: 'Naprawa', href: '/leistungen/werbeanlagen-reparatur' },
    ],
    [
      { label: 'Folia odchodzi', href: '/probleme-loesungen/folie-loest-sich' },
      { label: 'Litera nie swieci', href: '/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'Awaria po deszczu', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
    ],
    [
      { label: 'Montaz', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Zmiana lokalu', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'Naprawa szyldow', href: '/leistungen/werbeanlagen-reparatur' },
    ],
  ],
  ar: [
    [
      { label: 'وميض LED', href: '/probleme-loesungen/werbeanlage-flackert' },
      { label: 'خدمة LED', href: '/leistungen/lichtwerbung-led-modernisierung' },
      { label: 'اصلاح', href: '/leistungen/werbeanlagen-reparatur' },
    ],
    [
      { label: 'تقشر الفيلم', href: '/probleme-loesungen/folie-loest-sich' },
      { label: 'حرف لا يضيء', href: '/probleme-loesungen/buchstabe-leuchtet-nicht' },
      { label: 'عطل بعد المطر', href: '/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab' },
    ],
    [
      { label: 'تركيب', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'نقل الموقع', href: '/leistungen/montage-demontage-werbeanlagen' },
      { label: 'اصلاح اللوحات', href: '/leistungen/werbeanlagen-reparatur' },
    ],
  ],
};

function getCaseLinks(locale: string, index: number): CaseLink[] {
  const safeLocale = (locale in CASE_LINKS_BY_LOCALE ? locale : 'de') as Locale;
  const links = CASE_LINKS_BY_LOCALE[safeLocale];

  return links[index % links.length] ?? links[0];
}

const TypewriterQuote = ({ content, shouldAnimate }: { content: string; shouldAnimate: boolean }) => {
  const words = content.split(' ');
  const splitIndex = Math.max(0, words.length - 4); // Animate last 4 words
  const firstPart = words.slice(0, splitIndex).join(' ');
  const lastPart = words.slice(splitIndex).join(' ') + '"';
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [typedChars, setTypedChars] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!shouldAnimate) return;
    
    if (isInView) {
      // Add a slight delay before typing starts for better effect
      let interval: ReturnType<typeof setInterval> | null = null;
      const timeout = setTimeout(() => {
        let currentLength = 0;
        interval = setInterval(() => {
          currentLength++;
          setTypedChars(lastPart.slice(0, currentLength));
          if (currentLength >= lastPart.length) {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
            setIsFinished(true);
          }
        }, 40); // typing speed
      }, 400);
      return () => {
        clearTimeout(timeout);
        if (interval) clearInterval(interval);
      };
    }
  }, [isInView, lastPart, shouldAnimate]);

  if (!shouldAnimate) {
    return (
      <blockquote className="line-clamp-7 text-[19px] font-medium italic leading-[1.35] tracking-[0] text-[#0E1A2B] sm:text-[22px] sm:leading-[1.28] md:line-clamp-none md:text-[30px]">
        &quot;{content}&quot;
      </blockquote>
    );
  }

  return (
    <blockquote ref={ref} className="relative line-clamp-7 text-[19px] font-medium italic leading-[1.35] tracking-[0] text-[#0E1A2B] sm:text-[22px] sm:leading-[1.28] md:line-clamp-none md:text-[30px]">
      <span className="sr-only">&quot;{content}&quot;</span>
      <span aria-hidden="true">
        &quot;{firstPart}{firstPart ? ' ' : ''}
        {typedChars}
        {!isFinished && isInView && (
          <span className="inline-block w-[3px] h-[0.9em] bg-[#B8643E] ml-[2px] align-baseline opacity-70 animate-pulse" />
        )}
      </span>
    </blockquote>
  );
};

const ReviewsSection = ({ content }: ReviewsSectionProps) => {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Original indices or items
  const reviewsCount = content?.items?.length || 3;
  const originalIndices = Array.from({ length: reviewsCount }, (_, i) => i);
  
  const [virtualIndex, setVirtualIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Initialize scroll position to the middle set
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollLeft = 0;
    const readyFrame = window.requestAnimationFrame(() => setIsReady(true));

    return () => window.cancelAnimationFrame(readyFrame);
  }, [isRTL]);

  const handleInfiniteScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !isReady) return;

    const scrollLeft = Math.abs(el.scrollLeft);
    const firstCard = el.firstElementChild instanceof HTMLElement ? el.firstElementChild : null;
    const cardWidth = firstCard?.offsetWidth ?? el.offsetWidth * 0.82;
    const currentVirtual = Math.min(reviewsCount - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
    setVirtualIndex(currentVirtual);
  }, [reviewsCount, isReady]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleInfiniteScroll);
  }, [handleInfiniteScroll]);

  const scrollToVirtualIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild instanceof HTMLElement ? el.firstElementChild : null;
    const cardWidth = firstCard?.offsetWidth ?? el.offsetWidth * 0.82;
    el.scrollTo({
      left: isRTL ? -(index * cardWidth) : (index * cardWidth),
      behavior: 'smooth',
    });
  };

  const next = () => {
    scrollToVirtualIndex(virtualIndex + 1);
  };

  const prev = () => {
    scrollToVirtualIndex(virtualIndex - 1);
  };

  const activeReviewIndex = reviewsCount > 0 ? virtualIndex % reviewsCount : 0;

  return (
    <section className="w-full bg-[#F7F1E8] py-24 overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto flex flex-col gap-16 px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <SectionEyebrow>CASES</SectionEyebrow>
              <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[42px]">
                {content?.title || ''}
              </h2>
              {content?.subtitle ? (
                <p className="text-[18px] md:text-[20px] text-[#72665D] max-w-xl leading-relaxed">
                  {content.subtitle}
                </p>
              ) : null}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={prev}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-[#B8643E] text-[#B8643E] hover:bg-[#B8643E] hover:text-white group"
              aria-label="Previous service case"
            >
              <svg className={`w-6 h-6 transition-transform group-active:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-[#B8643E] text-[#B8643E] hover:bg-[#B8643E] hover:text-white group"
              aria-label="Next service case"
            >
              <svg className={`w-6 h-6 transition-transform group-active:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container with Gradients */}
      <div className="relative mt-12 w-full">
        {/* Gradients: reduced width for better visibility of neighbor peak */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 hidden w-[10%] bg-gradient-to-r from-[#F7F1E8] via-[#F7F1E8]/60 to-transparent md:block" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 hidden w-[10%] bg-gradient-to-l from-[#F7F1E8] via-[#F7F1E8]/60 to-transparent md:block" />

        <div 
          ref={scrollRef}
          className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory px-[3%] md:px-[4%]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {originalIndices.map((idx, i) => (
            <div 
              key={`${idx}-${i}`} 
              className="flex w-[82%] flex-shrink-0 snap-center px-2.5 sm:w-[74%] md:w-[88%] md:px-3"
            >
              <div className="group relative flex min-h-[370px] w-full flex-col gap-5 overflow-hidden rounded-[24px] border border-[#E7DDD3] bg-white p-5 shadow-2xl shadow-[#0E1A2B08] sm:min-h-[360px] sm:gap-7 sm:p-7 md:rounded-[36px] md:p-10">
                {/* Large Background Quote Symbol */}
                <div className="absolute -top-6 -right-6 text-[#B8643E] opacity-[0.03] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                  <svg className="w-64 h-64 fill-current" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-1 flex-col gap-5 sm:gap-6">
                  <div className="flex flex-wrap gap-2">
                    {getCaseLinks(locale, idx).map((link) => (
                      <Link
                        key={`${idx}-${link.href}-${link.label}`}
                        href={link.href}
                        className="inline-flex min-h-7 items-center rounded-full border border-[#E7DDD3] bg-[#FFF7EF] px-2.5 py-1 text-[11px] font-extrabold leading-none text-[#B8643E] transition-colors duration-200 hover:border-[#B8643E] hover:bg-[#F1E2D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/40 sm:min-h-8 sm:px-3 sm:text-[12px]"
                      >
                        #{link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="text-[#B8643E]">
                    <svg className="w-10 h-10 fill-current opacity-20" viewBox="0 0 32 32">
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                    </svg>
                  </div>
                  <TypewriterQuote 
                    content={content?.items?.[idx]?.content || ''} 
                    shouldAnimate={idx === 0} 
                  />
                </div>

                <div className="relative z-10 mt-auto flex items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B8643E] to-[#D47A4E] text-[20px] font-bold text-white shadow-xl shadow-[#B8643E30] transition-transform duration-500 group-hover:rotate-6 sm:h-14 sm:w-14 sm:text-[22px]">
                    {(content?.items?.[idx]?.name || '').charAt(0)}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="break-words text-[16px] font-bold leading-tight tracking-[0] text-[#0E1A2B] sm:text-[18px]">{content?.items?.[idx]?.name || ''}</span>
                    <span className="mt-1 break-words text-[11px] font-bold uppercase leading-[1.45] tracking-[0.14em] text-[#B8643E] sm:text-[13px]">{content?.items?.[idx]?.role || ''}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="mt-12 flex justify-center items-center gap-2.5">
        {originalIndices.map((idx) => (
          <button
            key={idx}
            onClick={() => scrollToVirtualIndex(idx + reviewsCount)}
            className={`h-2.5 rounded-full transition-all duration-500 ${activeReviewIndex === idx ? 'w-10 bg-[#B8643E]' : 'w-2.5 bg-[#C9BAA9] hover:bg-[#B8643E50]'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
