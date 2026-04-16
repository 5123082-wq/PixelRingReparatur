import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import FooterCTA from '@/components/sections/FooterCTA';
import ProblemCategories from '@/components/sections/ProblemCategories';
import SupportHero from '@/components/sections/SupportHero';
import SymptomCluster from '@/components/sections/SymptomCluster';
import UrgentCases from '@/components/sections/UrgentCases';
import {
  getMergedSupportSymptomCards,
  getSupportSeoConfig,
  resolveSupportCanonicalUrl,
  resolveSupportSeoText,
} from '@/lib/cms/support-content';
import { getGlobalPageCmsContent, getSupportPageCmsContent } from '@/lib/cms/pages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, seoConfig] = await Promise.all([
    getTranslations({ locale, namespace: 'Support' }),
    getSupportSeoConfig(),
  ]);

  const canonical = resolveSupportCanonicalUrl(
    [seoConfig.indexCanonicalUrl],
    `/${locale}/support`
  );

  return {
    title: resolveSupportSeoText([seoConfig.indexTitle], t('hero_title')) ?? t('hero_title'),
    description:
      resolveSupportSeoText([seoConfig.indexDescription], t('hero_description')) ??
      t('hero_description'),
    alternates: {
      canonical,
    },
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, symptomCards, globalCms, supportCms] = await Promise.all([
    getTranslations({ locale, namespace: 'Support' }),
    getMergedSupportSymptomCards(locale),
    getGlobalPageCmsContent(locale),
    getSupportPageCmsContent(locale),
  ]);
  const supportHeroTitle = supportCms?.hero?.title ?? t('hero_title');
  const supportHeroTitleParts = supportHeroTitle.split(' ');
  const supportHeroAccent = supportHeroTitleParts[0] ?? supportHeroTitle;
  const supportHeroRest = supportHeroTitleParts.slice(1).join(' ');
  const supportHeroIntro = supportCms?.hero?.intro ?? t('hero_description');

  return (
    <div className="bg-[#F7F1E8] min-h-screen flex flex-col relative">
      <Header content={globalCms?.header} />

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
                  <span className="text-[#B8643E]">{supportHeroAccent}</span>
                  {supportHeroRest ? ` ${supportHeroRest}` : ''}
                </h1>

                <p className="text-lg md:text-xl text-[#72665D] leading-relaxed mb-4 max-w-2xl">
                  {supportHeroIntro}
                </p>
              </div>

              {/* Problem Categories */}
              <div id="categories" className="pt-12">
                <ProblemCategories isCompact content={supportCms?.categories} />
              </div>


              {/* Typical Symptoms */}
              <div id="symptoms">
                <SymptomCluster isCompact items={symptomCards} content={supportCms?.symptoms} />
              </div>
            </div>

            {/* Right side: Urgent cases and quick links */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 mt-8 lg:mt-0">
              <UrgentCases isSidebar content={supportCms?.urgent} />
            </aside>
          </div>
        </div>

        <FooterCTA content={globalCms?.footerCta} />
      </main>

      <Footer content={globalCms?.footer} />
    </div>
  );
}
