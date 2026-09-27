'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { getHomeWorkContent } from '@/lib/content/home-work';
import type { ReferenceCase, ReferencesContent } from './ReferencesExperience';

const CONTROLS = {
  de: { label: 'Arbeiten', previous: 'Vorherige Arbeit', next: 'Nächste Arbeit' },
  en: { label: 'Projects', previous: 'Previous project', next: 'Next project' },
  ru: { label: 'Работы', previous: 'Предыдущий объект', next: 'Следующий объект' },
  tr: { label: 'Çalışmalar', previous: 'Önceki çalışma', next: 'Sonraki çalışma' },
  pl: { label: 'Realizacje', previous: 'Poprzednia realizacja', next: 'Następna realizacja' },
  ar: { label: 'الأعمال', previous: 'العمل السابق', next: 'العمل التالي' },
};

export default function ReferencesWorkShowcase({ cases, locale }: {
  cases: ReferenceCase[];
  locale: ReferencesContent['locale'];
}) {
  const [selectedId, setSelectedId] = useState('mounting-review');
  const railRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLButtonElement>(null);
  const labels = getHomeWorkContent(locale);
  const controls = CONTROLS[locale];
  const isRtl = locale === 'ar';
  const selected = cases.find((item) => item.id === selectedId) ?? cases[0];

  useEffect(() => {
    const rail = railRef.current;
    const card = selectedCardRef.current;
    if (!rail || !card) return;

    // Keep the selected thumbnail visible without moving the page vertically.
    const railBounds = rail.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    const style = getComputedStyle(rail);
    const leftEdge = railBounds.left + parseFloat(style.paddingLeft);
    const rightEdge = railBounds.right - parseFloat(style.paddingRight);
    const offset = cardBounds.left < leftEdge
      ? cardBounds.left - leftEdge
      : cardBounds.right > rightEdge
        ? cardBounds.right - rightEdge
        : 0;
    if (offset) rail.scrollBy({ left: offset, behavior: 'instant' });
  }, [selected?.id]);

  if (!selected) return null;

  const moveSelection = (direction: number) => {
    const currentIndex = cases.findIndex((item) => item.id === selected.id);
    const nextIndex = (currentIndex + direction + cases.length) % cases.length;
    setSelectedId(cases[nextIndex].id);
  };

  return (
    <div className="mt-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="pr-site-container">
        <article id="selected-reference" aria-labelledby="selected-reference-title" className="relative scroll-mt-32 overflow-hidden rounded-[28px] bg-white text-start">
          {cases.length > 1 ? (
            <div className="absolute end-4 top-4 z-10 flex gap-2 sm:end-6 sm:top-6">
              <button type="button" onClick={() => moveSelection(-1)} aria-label={controls.previous} aria-controls="selected-reference" className="flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#0E1A2B] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]">
                <ArrowLeftIcon className="size-4 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => moveSelection(1)} aria-label={controls.next} aria-controls="selected-reference" className="flex size-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#0E1A2B] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]">
                <ArrowRightIcon className="size-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          ) : null}
          <div className="grid gap-1 md:grid-cols-2">
            {[
              { src: selected.beforeImage, alt: selected.beforeAlt || selected.beforeText || selected.title, label: labels.beforeLabel },
              { src: selected.afterImage, alt: selected.afterAlt || selected.title, label: labels.resultLabel },
            ].map((photo) => (
              <figure key={photo.label} className="min-w-0">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E1E7EF]">
                  <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(min-width: 1440px) 664px, (min-width: 768px) 48vw, 100vw" className="object-cover object-[center_45%]" />
                </div>
                <figcaption className="px-6 pb-2 pt-4 text-sm font-medium text-[#4A5568] sm:px-8 lg:px-10">{photo.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="px-6 pb-8 pt-5 sm:px-8 sm:pb-10 lg:px-10" aria-live="polite" aria-atomic="true">
            <h2 id="selected-reference-title" className="text-xl font-semibold leading-snug text-[#0E1A2B] sm:text-2xl">{selected.title}</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#4A5568]">{[selected.problem, selected.work, selected.result].filter(Boolean).join(' ') || selected.defaultText}</p>
          </div>
        </article>
      </div>

      <div
        ref={railRef}
        role="group"
        aria-label={controls.label}
        className="mt-6 overflow-x-auto overscroll-x-contain px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pb-3 pt-1"
      >
        <div className="flex w-max gap-3">
          {cases.map((item) => (
            <button
              key={item.id}
              type="button"
              ref={selected.id === item.id ? selectedCardRef : undefined}
              aria-pressed={selected.id === item.id}
              aria-controls="selected-reference"
              aria-label={item.title}
              onClick={() => setSelectedId(item.id)}
              className={`flex h-[188px] w-[224px] shrink-0 flex-col overflow-hidden rounded-2xl border-2 bg-white text-start transition-colors motion-reduce:transition-none sm:h-[196px] sm:w-[248px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] ${selected.id === item.id ? 'border-[#B8643E]' : 'border-transparent hover:border-[#AEBBCC]'}`}
            >
              <span className="relative block h-[100px] w-full shrink-0 overflow-hidden bg-[#E1E7EF] sm:h-[108px]" aria-hidden="true">
                <Image src={item.afterImage} alt="" fill sizes="(min-width: 640px) 248px, 224px" className="object-cover" />
              </span>
              <span className="block w-full px-3 py-2.5">
                <span className="block truncate text-[11px] font-medium text-[#667386]">{item.category}</span>
                <span className="mt-1 line-clamp-2 text-[13px] font-semibold leading-[18px] text-[#0E1A2B]">{item.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
