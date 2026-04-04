'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useInView } from 'framer-motion';

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
      const timeout = setTimeout(() => {
        let currentLength = 0;
        const interval = setInterval(() => {
          currentLength++;
          setTypedChars(lastPart.slice(0, currentLength));
          if (currentLength >= lastPart.length) {
            clearInterval(interval);
            setIsFinished(true);
          }
        }, 40); // typing speed
        return () => clearInterval(interval);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isInView, lastPart, shouldAnimate]);

  if (!shouldAnimate) {
    return (
      <blockquote className="text-[26px] md:text-[36px] font-medium text-[#0E1A2B] leading-[1.3] tracking-tight italic">
        "{content}"
      </blockquote>
    );
  }

  return (
    <blockquote ref={ref} className="text-[26px] md:text-[36px] font-medium text-[#0E1A2B] leading-[1.3] tracking-tight italic relative">
      <span className="sr-only">"{content}"</span>
      <span aria-hidden="true">
        "{firstPart}{firstPart ? ' ' : ''}
        {typedChars}
        {!isFinished && isInView && (
          <span className="inline-block w-[3px] h-[0.9em] bg-[#B8643E] ml-[2px] align-baseline opacity-70 animate-pulse" />
        )}
      </span>
    </blockquote>
  );
};

const ReviewsSection = () => {
  const t = useTranslations('Reviews');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Original indices [0, 1, 2]
  const reviewsCount = 3;
  const originalIndices = [0, 1, 2];
  
  // Triple the indices to create infinite buffers: [0,1,2, 0,1,2, 0,1,2]
  const tripledIndices = [...originalIndices, ...originalIndices, ...originalIndices];
  
  // Track the current virtual index (0 to 8)
  const [virtualIndex, setVirtualIndex] = useState(reviewsCount); // Start at the middle set
  const [isReady, setIsReady] = useState(false);

  // Initialize scroll position to the middle set
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Use a more precise multiplier that matches our CSS (w-[92%] -> 0.92)
    const cardWidth = el.offsetWidth * 0.92;
    const startPos = reviewsCount * cardWidth;
    
    el.scrollLeft = isRTL ? -startPos : startPos;
    setIsReady(true);
  }, [isRTL, reviewsCount]);

  const handleInfiniteScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !isReady) return;

    const scrollLeft = Math.abs(el.scrollLeft);
    const cardWidth = el.offsetWidth * 0.92; // Matches w-[92%]
    
    const totalSetWidth = reviewsCount * cardWidth;
    
    if (scrollLeft < cardWidth * 0.5) {
      el.scrollTo({
        left: isRTL ? -(totalSetWidth + scrollLeft) : (totalSetWidth + scrollLeft),
        behavior: 'instant'
      });
    } 
    else if (scrollLeft > totalSetWidth * 2 - cardWidth * 0.5) {
      el.scrollTo({
        left: isRTL ? -(scrollLeft - totalSetWidth) : (scrollLeft - totalSetWidth),
        behavior: 'instant'
      });
    }

    const currentVirtual = Math.round(scrollLeft / cardWidth);
    setVirtualIndex(currentVirtual);
  }, [isRTL, reviewsCount, isReady]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleInfiniteScroll);
  }, [handleInfiniteScroll]);

  const scrollToVirtualIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.92;
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

  const activeReviewIndex = virtualIndex % reviewsCount;

  return (
    <section className="w-full bg-[#F7F1E8] py-24 overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto flex flex-col gap-16 px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            {/* Rating Badge */}
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-full w-fit border border-[#E7DDD3] shadow-sm">
              <div className="flex gap-1 text-[#B8643E]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-[#0E1A2B]">4.9 / 5.0</span>
                <span className="w-px h-4 bg-[#E7DDD3]" />
                <span className="text-[12px] font-bold text-[#B8643E] uppercase tracking-[0.1em]">Google Reviews</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[42px] md:text-[60px] font-bold text-[#0E1A2B] leading-[1.05] tracking-tight">
                {t('title')}
              </h2>
              <p className="text-[18px] md:text-[20px] text-[#72665D] max-w-xl leading-relaxed">
                {t('subtitle')}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-[#B8643E] text-[#B8643E] hover:bg-[#B8643E] hover:text-white group"
              aria-label="Previous review"
            >
              <svg className={`w-6 h-6 transition-transform group-active:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-[#B8643E] text-[#B8643E] hover:bg-[#B8643E] hover:text-white group"
              aria-label="Next review"
            >
              <svg className={`w-6 h-6 transition-transform group-active:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container with Gradients */}
      <div className="relative mt-16 w-full">
        {/* Gradients: reduced width for better visibility of neighbor peak */}
        <div className="absolute left-0 top-0 bottom-0 w-[10%] z-20 pointer-events-none bg-gradient-to-r from-[#F7F1E8] via-[#F7F1E8]/60 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-[10%] z-20 pointer-events-none bg-gradient-to-l from-[#F7F1E8] via-[#F7F1E8]/60 to-transparent" />

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-[4%]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tripledIndices.map((idx, i) => (
            <div 
              key={`${idx}-${i}`} 
              className="flex-shrink-0 w-[92%] snap-center px-3 flex"
            >
              <div className="bg-white rounded-[40px] md:rounded-[56px] p-8 md:p-16 border border-[#E7DDD3] shadow-2xl shadow-[#0E1A2B08] flex flex-col gap-10 relative overflow-hidden group w-full min-h-[460px]">
                {/* Large Background Quote Symbol */}
                <div className="absolute -top-6 -right-6 text-[#B8643E] opacity-[0.03] select-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                  <svg className="w-64 h-64 fill-current" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                </div>

                <div className="flex-1 flex flex-col gap-8 relative z-10">
                  <div className="text-[#B8643E]">
                    <svg className="w-12 h-12 fill-current opacity-20" viewBox="0 0 32 32">
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                    </svg>
                  </div>
                  <TypewriterQuote 
                    content={t(`items.${idx}.content`)} 
                    shouldAnimate={idx === 0} 
                  />
                </div>

                <div className="flex items-center gap-5 relative z-10 mt-auto">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#B8643E] to-[#D47A4E] flex items-center justify-center text-[24px] font-bold text-white shadow-xl shadow-[#B8643E30] transition-transform duration-500 group-hover:rotate-6">
                    {t(`items.${idx}.name`).charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[20px] font-bold text-[#0E1A2B] tracking-tight">{t(`items.${idx}.name`)}</span>
                    <span className="text-[13px] text-[#B8643E] font-bold uppercase tracking-[0.15em] mt-0.5">{t(`items.${idx}.role`)}</span>
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
