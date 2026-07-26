import type { Metadata } from 'next';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import { getAboutPageCmsContent, getGlobalPageCmsContent } from '@/lib/cms/pages';
import CmsImage from '@/components/common/CmsImage';
import HeroBreadcrumbs from '@/components/common/HeroBreadcrumbs';
import ServiceStamp from '@/components/common/ServiceStamp';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import { buildLocaleUrl, buildPublicPageMetadata, buildSiteUrl } from '@/lib/seo';

import {
  ABOUT_CONTENT,
  ABOUT_PAGE_LABELS,
  ABOUT_STRUCTURE_LABELS,
  type AboutContent,
  type Locale,
} from '@/lib/content/about-page';

type AboutCmsContent = Awaited<ReturnType<typeof getAboutPageCmsContent>>;
type AboutPageLabels = (typeof ABOUT_PAGE_LABELS)[Locale];
type JsonLdObject = Record<string, unknown>;

const ABOUT_PAGE_PATH = '/ueber-uns';
const ABOUT_OG_IMAGE = '/images/about/pixelring-service-team-fahrzeug-werbeanlagen-reparatur-berlin.png';

const ABOUT_BREADCRUMB_LABELS: Record<Locale, { home: string; page: string }> = {
  de: {
    home: 'Home',
    page: 'Über uns',
  },
  en: {
    home: 'Home',
    page: 'About us',
  },
  ru: {
    home: 'Главная',
    page: 'О нас',
  },
  tr: {
    home: 'Ana sayfa',
    page: 'Hakkımızda',
  },
  pl: {
    home: 'Strona główna',
    page: 'O nas',
  },
  ar: {
    home: 'الرئيسية',
    page: 'من نحن',
  },
};

function getAboutBreadcrumbs(locale: Locale) {
  const labels = ABOUT_BREADCRUMB_LABELS[locale] ?? ABOUT_BREADCRUMB_LABELS.de;

  return [
    {
      label: labels.home,
      href: '/',
    },
    {
      label: labels.page,
    },
  ];
}

function mergeAboutContent(fallback: AboutContent, cms: AboutCmsContent): AboutContent {
  if (!cms) {
    return fallback;
  }

  return {
    ...fallback,
    metaTitle: cms.metaTitle ?? fallback.metaTitle,
    metaDescription: cms.metaDescription ?? fallback.metaDescription,
    hero: {
      ...fallback.hero,
      badge: cms.hero?.badge ?? fallback.hero.badge,
      titlePrefix: cms.hero?.titlePrefix ?? fallback.hero.titlePrefix,
      titleAccent: cms.hero?.titleAccent ?? fallback.hero.titleAccent,
      intro: cms.hero?.intro?.length ? cms.hero.intro : fallback.hero.intro,
      benefits: cms.hero?.benefits?.length
        ? cms.hero.benefits.map((item, index) => ({
            title: typeof item.title === 'string' ? item.title : fallback.hero.benefits[index]?.title ?? '',
            description: typeof item.description === 'string' ? item.description : fallback.hero.benefits[index]?.description ?? '',
          }))
        : fallback.hero.benefits,
      ctaPrimary: cms.hero?.ctaPrimary ?? fallback.hero.ctaPrimary,
      ctaSecondary: cms.hero?.ctaSecondary ?? fallback.hero.ctaSecondary,
    },
    services: cms.audience?.items?.length
      ? cms.audience.items.map((item, index) => ({
          id: typeof item.id === 'string' ? item.id : fallback.services[index]?.id ?? `service-${index}`,
          title: typeof item.title === 'string' ? item.title : fallback.services[index]?.title ?? '',
          description: typeof item.description === 'string' ? item.description : fallback.services[index]?.description ?? '',
        }))
      : fallback.services,
    about: {
      ...fallback.about,
      title: cms.process?.title ?? fallback.about.title,
      cta: cms.process?.cta ?? fallback.about.cta,
      accordions: cms.process?.accordions?.length
        ? cms.process.accordions.map((item, index) => ({
            title: typeof item.title === 'string' ? item.title : fallback.about.accordions[index]?.title ?? '',
            content: typeof item.content === 'string' ? item.content : fallback.about.accordions[index]?.content ?? '',
          }))
        : fallback.about.accordions,
    },
    final: {
      title: cms.final?.title ?? fallback.final.title,
      button: cms.final?.button ?? fallback.final.button,
    },
  };
}

function mergeAboutPageLabels(fallback: AboutPageLabels, cms: AboutCmsContent): AboutPageLabels {
  if (!cms) {
    return fallback;
  }

  return {
    ...fallback,
    quickServicesTitle: cms.audience?.title ?? fallback.quickServicesTitle,
    serviceCardCta: cms.audience?.serviceCardCta ?? fallback.serviceCardCta,
    materialBrands: cms.materials?.brands?.length ? cms.materials.brands : fallback.materialBrands,
  };
}

function buildAboutPageJsonLd(locale: Locale, content: AboutContent): JsonLdObject {
  const canonicalUrl = buildLocaleUrl(locale, ABOUT_PAGE_PATH);

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    inLanguage: locale,
    name: content.metaTitle,
    description: content.metaDescription,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${buildSiteUrl('/')}#website`,
      name: 'PixelRing Reparatur',
      url: buildSiteUrl('/'),
    },
    about: {
      '@type': 'Organization',
      '@id': `${buildSiteUrl('/')}#organization`,
      name: 'PixelRing Reparatur',
      url: buildSiteUrl('/'),
      logo: buildSiteUrl('/icon.png'),
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: buildSiteUrl(ABOUT_OG_IMAGE),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'de') as Locale;
  const fallbackContent = ABOUT_CONTENT[locale] || ABOUT_CONTENT.de;
  const cmsContent = await getAboutPageCmsContent(locale);
  const tContent = mergeAboutContent(fallbackContent, cmsContent);

  return buildPublicPageMetadata({
    locale,
    path: ABOUT_PAGE_PATH,
    title: tContent.metaTitle,
    description: tContent.metaDescription,
    image: ABOUT_OG_IMAGE,
    imageAlt: tContent.hero.titlePrefix,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'de') as Locale;
  const fallbackContent = ABOUT_CONTENT[locale] || ABOUT_CONTENT.de;
  const fallbackLabels = ABOUT_PAGE_LABELS[locale] || ABOUT_PAGE_LABELS.de;
  const isRtl = locale === 'ar';
  const localePath = `/${locale}`;

  const [globalCms, aboutCms] = await Promise.all([
    getGlobalPageCmsContent(locale),
    getAboutPageCmsContent(locale),
  ]);
  const tContent = mergeAboutContent(fallbackContent, aboutCms);
  const pageLabels = mergeAboutPageLabels(fallbackLabels, aboutCms);
  const structureLabels = ABOUT_STRUCTURE_LABELS[locale] ?? ABOUT_STRUCTURE_LABELS.de;
  const jsonLd = buildAboutPageJsonLd(locale, tContent);
  const heroStepPositions = isRtl
    ? ['right-[16.667%] top-[55%]', 'right-1/2 top-[43%]', 'right-[83.333%] top-[29%]']
    : ['left-[16.667%] top-[55%]', 'left-1/2 top-[43%]', 'left-[83.333%] top-[29%]'];

  return (
    <div className={`flex min-h-screen flex-col bg-[#EEF3F8] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Header content={globalCms?.header} />

      <main className="flex-grow pt-0">
        {/* HERO + BENEFITS */}
        <section className="bg-[#EEF3F8] py-10 sm:py-14 md:py-16">
          <div className="pr-site-container">
            <div className="overflow-hidden rounded-[24px] border border-[#0E1A2B]/[0.08] bg-white shadow-[0_34px_90px_rgba(14,26,43,0.08)] sm:rounded-[34px]">
              <div className="px-6 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9 lg:px-16 lg:pb-12 lg:pt-11 xl:px-20 xl:pb-14">
                <div className="[&_nav]:mb-0 [&_ol]:border-0 [&_ol]:bg-transparent [&_ol]:px-0 [&_ol]:py-0 [&_ol]:shadow-none [&_ol]:backdrop-blur-none">
                  <HeroBreadcrumbs items={getAboutBreadcrumbs(locale)} position="static" surface="light" />
                </div>

                <div className="mt-12 sm:mt-14">
                  <div className="h-[3px] w-10 bg-[#B8643E]" />
                  <h1 className="mt-7 max-w-[820px] text-[34px] font-bold leading-[1.06] tracking-[-0.038em] text-[#111A2B] sm:text-[40px] md:text-[48px] lg:text-[54px]">
                    {tContent.hero.titlePrefix}
                  </h1>

                  <div className="mt-12 max-w-[640px] space-y-4 lg:mt-14">
                    {tContent.hero.intro.map((paragraph, idx) => (
                      <p key={idx} className="text-[16px] leading-[1.7] text-[#5F6877] md:text-[17px]">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="relative mt-8 sm:mt-10">
                    <ServiceStamp
                      idPrefix="about-hero-process-stamp"
                      className="pointer-events-none absolute end-[1%] top-[2%] z-0 h-28 w-28 opacity-[0.18] sm:h-36 sm:w-36 lg:h-44 lg:w-44"
                    />
                    <div className="relative z-10 aspect-[3/1] w-full">
                      <Image
                        src="/images/about/pixelring-service-line.webp"
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 1024px) 1100px, 100vw"
                        className={`object-contain ${isRtl ? '-scale-x-100' : ''}`}
                      />
                    </div>

                    <ol className="relative z-20 mt-4 grid grid-cols-3 gap-2 lg:absolute lg:inset-0 lg:mt-0">
                      {structureLabels.heroProcessSteps.map((step, index) => (
                        <li
                          key={step}
                          className={`text-center lg:absolute ${
                            isRtl ? 'lg:translate-x-1/2' : 'lg:-translate-x-1/2'
                          } ${heroStepPositions[index] ?? heroStepPositions[heroStepPositions.length - 1]}`}
                        >
                          <span className="block text-[11px] font-semibold tracking-[0.1em] text-[#B8643E] lg:text-[12px]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="mt-1 block text-[14px] font-semibold leading-tight text-[#111A2B] sm:text-[15px] lg:mt-2 lg:text-[17px]">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 border-t border-[#E5E7EB] px-6 py-10 sm:grid-cols-3 sm:px-10 sm:py-12 lg:gap-12 lg:px-16 xl:px-20">
                {structureLabels.heroProcessDetails.map((detail, idx) => (
                  <article key={idx} className="min-w-0">
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-[#B8643E]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-4 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#111A2B] sm:text-[19px]">
                      {detail.title}
                    </h2>
                    <p className="mt-3 max-w-[330px] text-[14px] leading-7 text-[#5F6877] sm:text-[15px]">
                      {detail.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="py-20 md:py-24">
          <div className="pr-site-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <SectionEyebrow className="mb-5">{structureLabels.whoEyebrow}</SectionEyebrow>
              <h2 className="text-[32px] font-black leading-tight text-[#0E1A2B] md:text-[44px]">
                {structureLabels.whoTitle}
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-8 text-[#4A5568] md:text-[17px]">
                {structureLabels.whoParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative min-h-[390px] overflow-visible sm:min-h-[460px] lg:min-h-[420px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
                <CmsImage
                  src="/images/about/pixelring-service-team-fahrzeug-werbeanlagen-reparatur-berlin.png"
                  alt={pageLabels.expertAlt}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute -bottom-6 left-5 w-[58%] min-w-[220px] max-w-[360px] overflow-hidden rounded-lg border-[6px] border-white bg-white shadow-2xl sm:left-auto sm:right-0 lg:-bottom-8">
                <div className="relative aspect-[16/9]">
                  <CmsImage
                    src="/images/about/pixelring-servicefahrzeug-werbeanlagen-reparatur-wartung-diagnose.png"
                    alt={pageLabels.serviceVehicleAlt}
                    fill
                    sizes="(min-width: 1024px) 360px, 58vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UNIFIED SERVICE CHAPTERS */}
        <div id="about-service-chapters" className="bg-[#EEF3F8] py-16 sm:py-20 md:py-24">
          <div className="pr-site-container">
            <div className="overflow-hidden rounded-[24px] border border-[#0E1A2B]/[0.08] bg-white shadow-[0_34px_90px_rgba(14,26,43,0.08)] sm:rounded-[34px]">
              {/* WHAT WE SERVICE */}
              <section className="grid gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-16 lg:py-20 xl:gap-24 xl:px-24 xl:py-24">
                <div>
                  <SectionEyebrow className="mb-5 text-[#B8643E]">
                    {structureLabels.scopeEyebrow}
                  </SectionEyebrow>
                  <h2 className="text-[34px] font-bold leading-[1.06] tracking-[-0.038em] text-[#111A2B] sm:text-[40px] lg:text-[46px] xl:text-[48px]">
                    {structureLabels.scopeTitle}
                  </h2>
                  <p className="mt-6 max-w-xl text-[17px] leading-[1.65] text-[#5F6877] lg:text-[18px]">
                    {structureLabels.scopeIntro}
                  </p>
                </div>

                <ul className="grid sm:grid-cols-2 sm:gap-x-10">
                  {structureLabels.scopeItems.map((item, index) => (
                    <li
                      key={item}
                      className={`border-t border-[#E5E7EB] py-5 text-[17px] font-semibold leading-[1.45] tracking-[-0.02em] text-[#111A2B] ${
                        index === 0 ? 'border-t-0 pt-0' : ''
                      } ${index === 1 ? 'sm:border-t-0 sm:pt-0' : ''}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* REPAIR RATIONALE */}
              <section className="grid gap-10 border-t border-[#E5E7EB] px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-16 lg:py-20 xl:gap-24 xl:px-24 xl:py-24">
                <div>
                  <SectionEyebrow className="mb-5 text-[#8A919C]">
                    {structureLabels.repairEyebrow}
                  </SectionEyebrow>
                  <h2 className="text-[34px] font-bold leading-[1.06] tracking-[-0.038em] text-[#111A2B] sm:text-[40px] lg:text-[46px] xl:text-[48px]">
                    {structureLabels.repairTitle}
                  </h2>
                </div>

                <div>
                  <p className="max-w-2xl text-[17px] leading-[1.65] text-[#5F6877] lg:text-[18px]">
                    {structureLabels.repairText}
                  </p>
                  <ul className="mt-8 border-t border-[#E5E7EB]">
                    {structureLabels.repairItems.map((item) => (
                      <li
                        key={item}
                        className="border-b border-[#E5E7EB] py-5 text-[16px] font-semibold leading-[1.55] tracking-[-0.015em] text-[#111A2B] sm:text-[17px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* TARGET AUDIENCE / SECTORS */}
              <section className="grid gap-10 border-t border-[#E5E7EB] px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-16 lg:py-20 xl:gap-24 xl:px-24 xl:py-24">
                <div>
                  <SectionEyebrow className="mb-5 text-[#8A919C]">
                    {structureLabels.audienceEyebrow}
                  </SectionEyebrow>
                  <h2 className="text-[34px] font-bold leading-[1.06] tracking-[-0.038em] text-[#111A2B] sm:text-[40px] lg:text-[46px] xl:text-[48px]">
                    {pageLabels.quickServicesTitle}
                  </h2>
                </div>

                <ul className="border-t border-[#E5E7EB]">
                  {tContent.services.map((service) => (
                    <li key={service.id} className="border-b border-[#E5E7EB]">
                      <a
                        href={`${localePath}/business?sector=${service.id}`}
                        className="group grid gap-3 py-6 outline-none transition-colors hover:text-[#B8643E] focus-visible:ring-2 focus-visible:ring-[#B8643E] focus-visible:ring-offset-4 md:grid-cols-[minmax(150px,0.75fr)_minmax(0,1.25fr)] md:gap-8"
                      >
                        <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#111A2B] transition-colors group-hover:text-[#B8643E]">
                          {service.title}
                        </h3>
                        <span>
                          <span className="block text-[15px] leading-7 text-[#5F6877]">
                            {service.description}
                          </span>
                          <span className="mt-3 inline-block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#8A919C] underline decoration-[#CDD2D9] underline-offset-4 transition-colors group-hover:text-[#B8643E]">
                            {pageLabels.serviceCardCta}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              {/* PROCESS */}
              <section className="border-t border-[#E5E7EB] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-24 xl:py-24">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-24">
                  <div>
                    <SectionEyebrow className="mb-5 text-[#8A919C]">
                      {structureLabels.processEyebrow}
                    </SectionEyebrow>
                    <h2 className="text-[34px] font-bold leading-[1.06] tracking-[-0.038em] text-[#111A2B] sm:text-[40px] lg:text-[46px] xl:text-[48px]">
                      {structureLabels.processTitle}
                    </h2>
                  </div>
                  <p className="max-w-2xl text-[17px] leading-[1.65] text-[#5F6877] lg:pt-10 lg:text-[18px]">
                    {structureLabels.processLead}
                  </p>
                </div>

                <ol className="mt-12 grid gap-7 border-t border-[#E5E7EB] pt-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12">
                  {structureLabels.processSteps.map((step, index) => (
                    <li
                      key={step.title}
                      className="border-b border-[#E5E7EB] pb-7 last:border-b-0 md:border-b-0 md:pb-0"
                    >
                      <span className="text-[12px] font-semibold tracking-[0.08em] text-[#B8643E]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-4 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#111A2B]">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-7 text-[#5F6877]">
                        {step.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </div>

        {/* MATERIALS AND SYSTEMS */}
        <section className="overflow-hidden border-y border-[#E7DDD3] bg-[#EEF3F8] py-12 md:py-14">
          <div className="pr-site-container text-center">
            <SectionEyebrow className="mb-4 justify-center">{structureLabels.materialsEyebrow}</SectionEyebrow>
            <h2 className="text-[28px] font-black leading-tight text-[#0E1A2B] md:text-[38px]">
              {pageLabels.materialTitle}
            </h2>
          </div>

          <div
            role="group"
            aria-label={pageLabels.materialBrands.join(', ')}
            className="relative mt-8 w-full overflow-hidden border-y border-[#0E1A2B]/10 bg-white/55 py-5 [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)] md:mt-10 md:py-6"
            dir="ltr"
          >
            <style>{`
              @keyframes about-brand-marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
            `}</style>
            <div
              aria-hidden="true"
              className="flex w-max whitespace-nowrap motion-safe:animate-[about-brand-marquee_28s_linear_infinite] hover:[animation-play-state:paused]"
            >
              {[0, 1].map((copyIndex) => (
                <div key={copyIndex} className="flex shrink-0 items-center gap-8 pe-8 sm:gap-12 sm:pe-12 md:gap-16 md:pe-16">
                  {pageLabels.materialBrands.map((brand) => (
                    <div key={`${copyIndex}-${brand}`} className="flex items-center gap-8 sm:gap-12 md:gap-16">
                      <span className="text-[22px] font-black uppercase tracking-[-0.02em] text-[#0E1A2B]/55 sm:text-[25px] md:text-[29px]">
                        {brand}
                      </span>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C66A3D]" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#EEF3F8] py-14 sm:py-18">
          <div className="pr-site-container">
            <div
              className="grid gap-8 overflow-hidden rounded-[28px] border border-[#d3b2a2]/50 px-6 py-7 shadow-[0_18px_50px_rgba(8,24,39,0.08)] sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12"
              style={{
                background:
                  'radial-gradient(circle at 88% 18%, rgba(184,100,62,0.16) 0%, transparent 30%), linear-gradient(135deg, #F3E7DE 0%, #EEF3F8 100%)',
              }}
            >
              <div className="min-w-0">
                <SectionEyebrow className="mb-5">{structureLabels.finalEyebrow}</SectionEyebrow>
                <h2 className="max-w-3xl text-[28px] font-extrabold leading-[1.12] tracking-[0] text-[#081827] sm:text-[34px] lg:text-[38px]">
                  {tContent.final.title}
                </h2>
                <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-[#526174] sm:text-[17px]">
                  {structureLabels.finalLead}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <LeistungenRequestButton
                  label={tContent.final.button}
                  serviceIntent="about-page-final"
                  className="min-h-[52px] px-7 text-[15px] font-black shadow-[0_16px_34px_rgba(184,100,62,0.22)]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer content={globalCms?.footer} />
    </div>
  );
}
