'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const ExcellenceCarousel = () => {
  const t = useTranslations('Excellence');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const items = [
    {
      title: t('items.0.title'),
      tag: t('items.0.tag'),
      description: t('items.0.description'),
      image: '/images/ex-mounting.png',
    },
    {
      title: t('items.1.title'),
      tag: t('items.1.tag'),
      description: t('items.1.description'),
      image: '/images/ex-repair.png',
    },
    {
      title: t('items.2.title'),
      tag: t('items.2.tag'),
      description: t('items.2.description'),
      image: '/images/ex-maintenance.png',
    },
    {
      title: t('items.3.title'),
      tag: t('items.3.tag'),
      description: t('items.3.description'),
      image: '/images/ex-design.png',
    },
    {
      title: t('items.4.title'),
      tag: t('items.4.tag'),
      description: t('items.4.description'),
      image: '/images/ex-lightbox.png',
    },
    {
      title: t('items.5.title'),
      tag: t('items.5.tag'),
      description: t('items.5.description'),
      image: '/images/ex-dismantling.png',
    },
  ];

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Calculate active index based on scroll position
    const cardWidth = el.scrollWidth / items.length;
    const newIndex = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(newIndex, items.length - 1));
  }, [items.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardGap = 24;
    const card = el.querySelector('[data-card]') as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + cardGap : 340;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement;
    if (!card) return;
    const cardGap = 24;
    el.scrollTo({
      left: index * (card.offsetWidth + cardGap),
      behavior: 'smooth',
    });
  };

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="w-full bg-[#F4EDE4] py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-[32px] md:text-[44px] font-bold text-[#0E1A2B] leading-tight">
              {t('title')}
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#72665D] max-w-xl">
              {t('subtitle')}
            </p>
          </div>

          {/* Navigation buttons — creative pill design */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous"
              className={`
                relative group w-14 h-14 rounded-full flex items-center justify-center
                transition-all duration-500 ease-out
                ${canScrollLeft
                  ? 'bg-gradient-to-br from-[#0E1A2B] to-[#1A2D45] text-white shadow-lg shadow-[#0E1A2B30] hover:shadow-xl hover:shadow-[#0E1A2B40] hover:scale-110 active:scale-95'
                  : 'bg-[#E7DDD3] text-[#A89B8F] cursor-not-allowed'
                }
              `}
            >
              {/* Animated ripple on hover */}
              <span className={`
                absolute inset-0 rounded-full transition-all duration-500
                ${canScrollLeft ? 'group-hover:ring-4 group-hover:ring-[#B8643E30]' : ''}
              `} />
              <svg
                className={`w-5 h-5 relative z-10 transition-transform duration-300 ${canScrollLeft ? 'group-hover:-translate-x-1' : ''}`}
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
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`
                    rounded-full transition-all duration-400 ease-out
                    ${activeIndex === index
                      ? 'w-8 h-3 bg-[#B8643E]'
                      : 'w-3 h-3 bg-[#C9BAA9] hover:bg-[#A89B8F]'
                    }
                  `}
                />
              ))}
            </div>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next"
              className={`
                relative group w-14 h-14 rounded-full flex items-center justify-center
                transition-all duration-500 ease-out
                ${canScrollRight
                  ? 'bg-gradient-to-br from-[#B8643E] to-[#D47A4E] text-white shadow-lg shadow-[#B8643E30] hover:shadow-xl hover:shadow-[#B8643E40] hover:scale-110 active:scale-95'
                  : 'bg-[#E7DDD3] text-[#A89B8F] cursor-not-allowed'
                }
              `}
            >
              <span className={`
                absolute inset-0 rounded-full transition-all duration-500
                ${canScrollRight ? 'group-hover:ring-4 group-hover:ring-[#B8643E30]' : ''}
              `} />
              <svg
                className={`w-5 h-5 relative z-10 transition-transform duration-300 ${canScrollRight ? 'group-hover:translate-x-1' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards carousel */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`
            flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              data-card
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[calc(33.333%-16px)] min-w-[260px] aspect-[3/4] relative rounded-[28px] overflow-hidden snap-start group shadow-xl shadow-[#0E1A2B08] transition-transform duration-500 hover:shadow-2xl"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2BDD] via-[#0E1A2B30] to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col gap-3 text-white">
                <span className="self-start px-3 py-1 bg-[#B8643E] rounded-full text-[11px] font-bold uppercase tracking-wider">
                  #{item.tag}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[22px] sm:text-[24px] font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-white/80 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
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
