'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ProblemCategoriesProps {
  isCompact?: boolean;
}

const ProblemCategories = ({ isCompact = false }: ProblemCategoriesProps) => {
  const t = useTranslations('Support');

  const categories = [
    { 
      id: 'light', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ), 
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      title: t('categories.light.title'),
      desc: t('categories.light.description')
    },
    { 
      id: 'letters', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ), 
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      title: t('categories.letters.title'),
      desc: t('categories.letters.description')
    },
    { 
      id: 'film', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ), 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: t('categories.film.title'),
      desc: t('categories.film.description')
    },
    { 
      id: 'safety', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ), 
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      title: t('categories.safety.title'),
      desc: t('categories.safety.description')
    },
    { 
      id: 'urgent', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ), 
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      title: t('categories.urgent.title'),
      desc: t('categories.urgent.description')
    }
  ];

  const Content = (
    <>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8 flex items-center gap-4">
        <span className="w-8 h-1 bg-[#B8643E] rounded-full" />
        {t('categories_title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className="bg-white p-6 rounded-3xl border border-[#EEF3FB] shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
          >
            <div className={`inline-flex p-3 rounded-2xl mb-4 border ${cat.color}`}>
              {cat.icon}
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{cat.title}</h3>
            <p className="text-[#8B8B8B] text-sm leading-relaxed mb-4">{cat.desc}</p>
            
            <button className="text-[12px] font-bold text-[#B8643E] uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all">
              Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );

  if (isCompact) {
    return Content;
  }

  return (
    <section className="py-16 md:py-24 bg-[#EEF3FB]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {Content}
      </div>
    </section>
  );
};

export default ProblemCategories;

