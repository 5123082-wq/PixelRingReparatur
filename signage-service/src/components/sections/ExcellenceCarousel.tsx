'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ExcellenceCmsContent } from '@/lib/cms/pages';

interface ExcellenceCarouselProps {
  content?: ExcellenceCmsContent;
}

const ExcellenceCarousel = ({ content }: ExcellenceCarouselProps) => {
  const t = useTranslations('Excellence');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  // Default fallback images aligned to static translation order
  const DEFAULT_IMAGES = [
    '/images/ex-mounting.png',
    '/images/ex-repair.png',
    '/images/ex-maintenance.png',
    '/images/ex-design.png',
    '/images/ex-lightbox.png',
    '/images/ex-dismantling.png',
  ];

  const DEFAULT_ITEM_KEYS = [0, 1, 2, 3, 4, 5] as const;

  // If CMS provides items — use them dynamically; otherwise fall back to 6 static defaults
  const items =
    content?.items && content.items.length > 0
      ? content.items.map((cmsItem, idx) => ({
          title: cmsItem.title ?? t(`items.${DEFAULT_ITEM_KEYS[idx % DEFAULT_ITEM_KEYS.length]}.title`),
          tag: cmsItem.tag ?? t(`items.${DEFAULT_ITEM_KEYS[idx % DEFAULT_ITEM_KEYS.length]}.tag`),
          description: cmsItem.description ?? t(`items.${DEFAULT_ITEM_KEYS[idx % DEFAULT_ITEM_KEYS.length]}.description`),
          image: cmsItem.image ?? DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length],
        }))
      : DEFAULT_ITEM_KEYS.map((i) => ({
          title: t(`items.${i}.title`),
          tag: t(`items.${i}.tag`),
          description: t(`items.${i}.description`),
          image: DEFAULT_IMAGES[i],
        }));

  const itemsCount = items.length;
  const tripledItems = [...items, ...items, ...items];
  
  const [virtualIndex, setVirtualIndex] = useState(itemsCount);
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getCardWidth = (el: HTMLDivElement) => {
    const card = el.querySelector('[data-card]') as HTMLElement;
    if (card) return card.offsetWidth;
    // Fallback based on typical viewport behavior
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return el.offsetWidth * (isMobile ? 0.88 : 0.32);
  };

  // Initialize scroll position to the middle set
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Use actual card width for start position
    const cardWidth = getCardWidth(el);
    const startPos = itemsCount * cardWidth;
    
    el.scrollLeft = isRTL ? -startPos : startPos;
    const readyFrame = window.requestAnimationFrame(() => setIsReady(true));

    return () => window.cancelAnimationFrame(readyFrame);
  }, [isRTL, itemsCount]);

  const handleInfiniteScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !isReady) return;

    const scrollPos = Math.abs(el.scrollLeft);
    const cardWidth = getCardWidth(el);
    const totalSetWidth = itemsCount * cardWidth;
    
    // Boundary Jump Logic
    if (scrollPos < cardWidth * 0.5) {
      el.scrollTo({
        left: isRTL ? -(totalSetWidth + scrollPos) : (totalSetWidth + scrollPos),
        behavior: 'instant'
      });
    } 
    else if (scrollPos > totalSetWidth * 2 - cardWidth * 0.5) {
      el.scrollTo({
        left: isRTL ? -(scrollPos - totalSetWidth) : (scrollPos - totalSetWidth),
        behavior: 'instant'
      });
    }

    const currentVirtual = Math.round(scrollPos / cardWidth);
    setVirtualIndex(currentVirtual);
  }, [isRTL, itemsCount, isReady]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    window.addEventListener('resize', handleInfiniteScroll);
    return () => {
      el.removeEventListener('scroll', handleInfiniteScroll);
      window.removeEventListener('resize', handleInfiniteScroll);
    };
  }, [handleInfiniteScroll]);

  const scrollToVirtualIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = getCardWidth(el);
    el.scrollTo({
      left: isRTL ? -(index * cardWidth) : (index * cardWidth),
      behavior: 'smooth',
    });
  };

  const next = () => scrollToVirtualIndex(virtualIndex + 1);
  const prev = () => scrollToVirtualIndex(virtualIndex - 1);

  const activeItemIndex = virtualIndex % itemsCount;

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section className="w-full bg-[#F4EDE4] py-20 md:py-24 overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] md:text-[44px] font-bold text-[#0E1A2B] leading-tight">
              {content?.title ?? t('title')}
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#72665D] max-w-xl">
              {content?.subtitle ?? t('subtitle')}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous"
              className="relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-out bg-gradient-to-br from-[#0E1A2B] to-[#1A2D45] text-white shadow-lg shadow-[#0E1A2B30] hover:shadow-xl hover:shadow-[#0E1A2B40] hover:scale-110 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full transition-all duration-500 group-hover:ring-4 group-hover:ring-[#B8643E30]" />
              <svg
                className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2 mx-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToVirtualIndex(index + itemsCount)}
                  className={`rounded-full transition-all duration-400 ease-out ${activeItemIndex === index ? 'w-8 h-3 bg-[#B8643E]' : 'w-3 h-3 bg-[#C9BAA9] hover:bg-[#A89B8F]'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next"
              className="relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-out bg-gradient-to-br from-[#B8643E] to-[#D47A4E] text-white shadow-lg shadow-[#B8643E30] hover:shadow-xl hover:shadow-[#B8643E40] hover:scale-110 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full transition-all duration-500 group-hover:ring-4 group-hover:ring-[#B8643E30]" />
              <svg
                className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container with Gradients */}
      <div className="relative mt-12 w-full">
        {/* Narrower Edge Gradients to see neighbor cards better */}
        <div className="absolute left-0 top-0 bottom-0 w-[6%] z-20 pointer-events-none bg-gradient-to-r from-[#F4EDE4] via-[#F4EDE4]/60 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-[6%] z-20 pointer-events-none bg-gradient-to-l from-[#F4EDE4] via-[#F4EDE4]/60 to-transparent" />

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`
            flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-[4%] pb-8
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tripledItems.map((item, index) => (
            <div
              key={`${index}-${item.title}`}
              data-card
              className="flex-shrink-0 w-[88%] md:w-[32%] snap-center px-3 flex"
            >
              <div
                className="w-full aspect-[3/4] relative rounded-[32px] md:rounded-[40px] overflow-hidden group shadow-2xl shadow-[#0E1A2B08] transition-all duration-500"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2BDD] via-[#0E1A2B30] to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 flex flex-col gap-4 text-white">
                  <span className="self-start px-4 py-1.5 bg-[#B8643E] rounded-full text-[12px] font-bold uppercase tracking-wider">
                    #{item.tag}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[26px] sm:text-[32px] font-bold leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[14px] sm:text-[16px] text-white/80 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExcellenceCarousel;
