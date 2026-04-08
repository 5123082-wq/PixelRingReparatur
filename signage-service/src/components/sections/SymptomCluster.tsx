'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const FALLBACK_SYMPTOM_SLUGS = [
  'no-light',
  'flicking',
  'uneven-light',
  'letter-out',
  'rain-fail',
  'peeling-film',
  'faded-film',
  'shaky-sign',
  'urgent-repair',
] as const;

interface SymptomClusterProps {
  isCompact?: boolean;
  items?: {
    slug: string;
    title: string;
    shortAnswer: string | null;
    sortOrder: number;
  }[];
}

const SymptomCluster = ({ isCompact = false, items }: SymptomClusterProps) => {
  const t = useTranslations('Support');
  const defaultItems = FALLBACK_SYMPTOM_SLUGS.map((slug, index) => ({
    slug,
    title: t(`symptoms.${index}.title`),
    shortAnswer: null,
    sortOrder: index,
  }));
  const sortedItems = [...(items ?? defaultItems)].sort((a, b) => a.sortOrder - b.sortOrder);

  const Content = (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-3 flex items-center gap-4">
            <span className="w-8 h-1 bg-[#B8643E] rounded-full" />
            {t('symptoms_title')}
          </h2>
          <p className="text-[#8B8B8B] text-base max-w-xl leading-relaxed">
            {t('symptoms_desc')}
          </p>
        </div>
        
        <a
          href="#symptoms"
          className="px-6 py-3 bg-[#EEF3FB] hover:bg-[#E2EAF8] text-[#72665D] text-sm font-bold rounded-2xl border border-[#E7DDD3] transition-all flex items-center gap-3"
        >
          <svg className="w-4 h-4 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {t('all_articles')}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sortedItems.map((item, index) => (
          <Link
            key={item.slug}
            href={`/support/${item.slug}`}
            className="flex items-center justify-between p-5 bg-white border border-[#EEF3FB] rounded-2xl hover:border-[#B8643E]/30 hover:shadow-lg hover:shadow-[#B8643E]/5 transition-all group"
          >
            <div className="flex items-start gap-4 min-w-0">
              <span className="text-[12px] font-bold text-[#B8643E]/40 w-5 shrink-0">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <span className="block text-[15px] font-bold text-[#72665D] group-hover:text-[#B8643E] transition-colors leading-tight">
                  {item.title}
                </span>
                {item.shortAnswer ? (
                  <span className="mt-2 block text-[13px] text-[#8B8B8B] leading-relaxed">
                    {item.shortAnswer}
                  </span>
                ) : null}
              </div>
            </div>
            <svg className="w-4 h-4 text-[#B8643E] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* SEO/GEO Cluster Footer */}
      <div className="mt-12 p-6 md:p-10 bg-[#EEF3FB]/30 border border-[#EEF3FB] rounded-[32px]">
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {t('internal_links_title')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {['LED Reparatur Berlin', 'Leuchtkasten Wartung', 'Schilder-Service', 'Neon Instandsetzung', 'Folierung Erneuern', 'Werbetechnik Sicherheitstand'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-white text-[#72665D] text-[13px] font-medium border border-[#E7DDD3] rounded-full hover:border-[#B8643E] transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (isCompact) {
    return Content;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {Content}
      </div>
    </section>
  );
};

export default SymptomCluster;
