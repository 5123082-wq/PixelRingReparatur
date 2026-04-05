'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SupportHero from '@/components/sections/SupportHero';
import ProblemCategories from '@/components/sections/ProblemCategories';
import UrgentCases from '@/components/sections/UrgentCases';
import SymptomCluster from '@/components/sections/SymptomCluster';
import FooterCTA from '@/components/sections/FooterCTA';

export default function SupportPage() {
  const t = useTranslations('Support');

  return (
    <div className="bg-[#F7F1E8] min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-1 relative">
        {/* Background Accents from SupportHero */}
        <SupportHero />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative pb-24 pt-10 md:pt-16 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left side: Hero Text + Categories + Symptoms */}
            <div className="lg:col-span-8 space-y-16">
              {/* Hero Text */}
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B8643E]/10 border border-[#B8643E]/20 rounded-full mb-6">
                  <span className="text-[12px] font-bold text-[#B8643E] tracking-[1.4px] uppercase">
                    Support Center
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] leading-[1.1] mb-6">
                  <span className="text-[#B8643E]">{t('hero_title').split(' ')[0]}</span>{' '}
                  {t('hero_title').split(' ').slice(1).join(' ')}
                </h1>

                <p className="text-lg md:text-xl text-[#72665D] leading-relaxed mb-4 max-w-2xl">
                  {t('hero_description')}
                </p>
              </div>

              {/* Problem Categories */}
              <div id="categories" className="pt-12">
                <ProblemCategories isCompact />
              </div>


              {/* Typical Symptoms */}
              <div id="symptoms">
                <SymptomCluster isCompact />
              </div>
            </div>

            {/* Right side: Urgent cases and quick links */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 mt-8 lg:mt-0">
              <UrgentCases isSidebar />
            </aside>
          </div>
        </div>

        <FooterCTA />
      </main>

      <Footer />
    </div>
  );
}


