'use client';

import { useEffect, useState } from 'react';

import CmsImage from '@/components/common/CmsImage';
import HeroBreadcrumbs from '@/components/common/HeroBreadcrumbs';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';

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
  primaryCta?: string;
  secondaryCta?: string;
  secondaryHref?: string;
};

export default function LeistungenRepairHeroSlider({
  title,
  subline,
  slides,
  breadcrumbs = [],
  primaryCta,
  secondaryCta,
  secondaryHref = '#repair-proof',
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
    <section className="relative h-[520px] w-full overflow-hidden bg-[#0E1A2B] sm:h-[440px] lg:h-[480px]">
      {safeSlides.map((slide, index) => (
        <CmsImage
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          loading="eager"
          fetchPriority={index === 0 ? 'high' : undefined}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[1800ms] ease-in-out ${
            index === activeIndex ? 'opacity-80' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/90 via-[#0E1A2B]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A2B]/64 via-[#0E1A2B]/18 to-transparent rtl:bg-gradient-to-l" />

      <HeroBreadcrumbs items={breadcrumbs} />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-12 min-[1328px]:px-0 lg:pb-14">
        <div className="max-w-[760px] ltr:text-left rtl:text-right">
          <div className="mb-4 h-1 w-20 bg-[#B8643E]" />
          <h1 className="animate-in fade-in slide-in-from-bottom-3 max-w-full break-words text-[34px] font-extrabold leading-[1.05] tracking-tight text-white duration-500 [overflow-wrap:anywhere] sm:text-[48px] lg:text-[54px]">
            {title}
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-4 mt-4 max-w-[640px] break-words text-[15px] font-semibold leading-relaxed text-white/85 duration-600 [overflow-wrap:anywhere] sm:text-[17px]">
            {subline}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {primaryCta ? (
                <LeistungenRequestButton
                  label={primaryCta}
                  serviceIntent="repair-hero-photo-request"
                />
              ) : null}
              {secondaryCta ? (
                <a
                  href={secondaryHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/24 bg-white/10 px-5 py-3 text-[15px] font-bold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {secondaryCta}
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
