'use client';

import Image from 'next/image';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

import HeroBreadcrumbs from '@/components/common/HeroBreadcrumbs';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type LeistungenIlluminatedValanceHeroProps = {
  title: string;
  subline: string;
  breadcrumbs: BreadcrumbItem[];
  primaryCta: string;
  primaryServiceIntent: string;
  primaryInitialIssueType: string;
  primaryInitialMessage: string;
  secondaryCta: string;
  secondaryServiceIntent: string;
  secondaryInitialIssueType: string;
  secondaryInitialMessage: string;
  dayViewLabel: string;
  nightViewLabel: string;
};

export default function LeistungenIlluminatedValanceHero({
  title,
  subline,
  breadcrumbs,
  primaryCta,
  primaryServiceIntent,
  primaryInitialIssueType,
  primaryInitialMessage,
  secondaryCta,
  secondaryServiceIntent,
  secondaryInitialIssueType,
  secondaryInitialMessage,
  dayViewLabel,
  nightViewLabel,
}: LeistungenIlluminatedValanceHeroProps) {
  const [isNight, setIsNight] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (hasInteracted || prefersReducedMotion !== false) {
      return;
    }

    const timer = window.setInterval(() => {
      setIsNight((current) => !current);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [hasInteracted, prefersReducedMotion]);

  const handleToggle = () => {
    setHasInteracted(true);
    setIsNight((current) => !current);
  };

  return (
    <section className="relative isolate h-[650px] w-full overflow-hidden bg-[#0B1520] sm:h-[500px] lg:h-[480px]">
      <Image
        src="/images/leistungen/beleuchtete-markisenvolants/hero-cafe-day.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none"
      />
      <Image
        src="/images/leistungen/beleuchtete-markisenvolants/hero-cafe-night.png"
        alt=""
        fill
        loading="eager"
        sizes="100vw"
        className={`object-cover object-center transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none ${
          isNight ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#08111C]/92 via-[#08111C]/36 to-[#08111C]/8" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#08111C]/62 via-[#08111C]/16 to-transparent rtl:bg-gradient-to-l" />

      <HeroBreadcrumbs items={breadcrumbs} />

      <div className="pr-site-container relative flex h-full flex-col justify-end pb-10 sm:pb-12 lg:pb-14">
        <div className="max-w-[960px] ltr:text-left rtl:text-right">
          <h1 className="max-w-full break-words text-[34px] font-extrabold leading-[1.05] tracking-tight text-white [overflow-wrap:anywhere] sm:text-[48px] lg:text-[54px]">
            {title}
          </h1>
          <p className="mt-4 max-w-[640px] break-words text-[15px] font-semibold leading-relaxed text-white/85 [overflow-wrap:anywhere] sm:text-[17px]">
            {subline}
          </p>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3 sm:flex-nowrap">
          <div className="flex flex-wrap gap-3">
            <LeistungenRequestButton
              label={primaryCta}
              serviceIntent={primaryServiceIntent}
              initialIssueType={primaryInitialIssueType}
              initialMessage={primaryInitialMessage}
            />
            <LeistungenRequestButton
              label={secondaryCta}
              serviceIntent={secondaryServiceIntent}
              variant="dark-ghost"
              initialIssueType={secondaryInitialIssueType}
              initialMessage={secondaryInitialMessage}
            />
          </div>
          <button
            type="button"
            onClick={handleToggle}
            aria-pressed={isNight}
            aria-label={isNight ? nightViewLabel : dayViewLabel}
            className="ms-auto inline-flex h-12 items-center gap-1 rounded-full border border-white/24 bg-[#0E1A2B]/82 p-1 text-white shadow-[0_12px_30px_rgba(0,0,0,0.26)] backdrop-blur-sm transition-colors hover:border-white/48 hover:bg-[#0E1A2B]/94 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isNight ? 'text-white/52' : 'bg-[#E2A07C] text-[#172235]'}`}>
              <SunIcon aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isNight ? 'bg-[#E2A07C] text-[#172235]' : 'text-white/52'}`}>
              <MoonIcon aria-hidden="true" className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
