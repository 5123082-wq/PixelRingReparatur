'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import CmsImage from '@/components/common/CmsImage';

type RepairHeroSlide = {
  src: string;
  alt: string;
};

type RepairHeroBreadcrumb = {
  label: string;
  href?: string;
};

type LeistungenRepairHeroSliderProps = {
  title: string;
  subline: string;
  slides: RepairHeroSlide[];
  breadcrumbs?: RepairHeroBreadcrumb[];
};

export default function LeistungenRepairHeroSlider({
  title,
  subline,
  slides,
  breadcrumbs = [],
}: LeistungenRepairHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeSlides = slides.length > 0 ? slides : [{ src: '/images/leistungen/hero-repair.png', alt: title }];

  useEffect(() => {
    if (safeSlides.length <= 1) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length);
    }, 5800);

    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  return (
    <section className="relative h-[380px] w-full overflow-hidden bg-[#0E1A2B] sm:h-[440px] lg:h-[480px]">
      {safeSlides.map((slide, index) => (
        <CmsImage
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          fetchPriority={index === 0 ? 'high' : undefined}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[1800ms] ease-in-out ${
            index === activeIndex ? 'opacity-80' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/90 via-[#0E1A2B]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A2B]/64 via-[#0E1A2B]/18 to-transparent rtl:bg-gradient-to-l" />

      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="absolute inset-x-0 top-6 z-10 px-4 sm:px-6 min-[1328px]:px-0"
        >
          <div className="mx-auto flex max-w-7xl justify-start rtl:justify-end">
            <ol className="flex max-w-full items-center gap-2 overflow-x-auto rounded-[6px] bg-[#0E1A2B]/88 px-4 py-3 text-[14px] font-black text-white shadow-[0_16px_40px_rgba(0,0,0,0.26)] backdrop-blur-md sm:px-5 sm:text-[15px]">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={`${item.label}-${index}`} className="flex shrink-0 items-center gap-2">
                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        className="text-white/88 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E2A07C]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-white">{item.label}</span>
                    )}
                    {!isLast && (
                      <span aria-hidden="true" className="text-white/72 rtl:rotate-180">
                        ›
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>
      )}

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-12 min-[1328px]:px-0 lg:pb-14">
        <div className="max-w-[760px] ltr:text-left rtl:text-right">
          <div className="mb-4 h-1 w-20 bg-[#B8643E]" />
          <h1 className="animate-in fade-in slide-in-from-bottom-3 text-[34px] font-extrabold leading-[1.05] tracking-tight text-white duration-500 sm:text-[48px] lg:text-[54px]">
            {title}
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-4 mt-4 max-w-[640px] text-[15px] font-semibold leading-relaxed text-white/85 duration-600 sm:text-[17px]">
            {subline}
          </p>
        </div>
      </div>
    </section>
  );
}
