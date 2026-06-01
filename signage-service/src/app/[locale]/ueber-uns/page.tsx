import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import { getAboutPageCmsContent, getGlobalPageCmsContent } from '@/lib/cms/pages';
import CmsImage from '@/components/common/CmsImage';
import HeroBreadcrumbs from '@/components/common/HeroBreadcrumbs';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import ServiceSimulator from '@/components/sections/ServiceSimulator';
import AboutVideoPlayer from '@/components/sections/AboutVideoPlayer';

import {
  ABOUT_CONTENT,
  ABOUT_PAGE_LABELS,
  ABOUT_STRUCTURE_LABELS,
  type AboutContent,
  type Locale,
} from '@/lib/content/about-page';

type AboutCmsContent = Awaited<ReturnType<typeof getAboutPageCmsContent>>;
type AboutPageLabels = (typeof ABOUT_PAGE_LABELS)[Locale];

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
    quality: {
      ...fallback.quality,
      title: cms.quality?.title ?? fallback.quality.title,
      description: cms.quality?.description ?? fallback.quality.description,
      features: cms.quality?.features?.length ? cms.quality.features : fallback.quality.features,
      mediaLabel: cms.quality?.mediaLabel ?? fallback.quality.mediaLabel,
      playLabel: cms.quality?.playLabel ?? fallback.quality.playLabel,
      cta: cms.quality?.cta ?? fallback.quality.cta,
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
    materialTitle: cms.materials?.title ?? fallback.materialTitle,
    materialBrands: cms.materials?.brands?.length ? cms.materials.brands : fallback.materialBrands,
    testimonialsTitle: cms.testimonials?.title ?? fallback.testimonialsTitle,
    testimonials: cms.testimonials?.items?.length
      ? cms.testimonials.items.map((item, index) => ({
          name: typeof item.name === 'string' ? item.name : fallback.testimonials[index]?.name ?? '',
          role: typeof item.role === 'string' ? item.role : fallback.testimonials[index]?.role ?? '',
          text: typeof item.text === 'string' ? item.text : fallback.testimonials[index]?.text ?? '',
        }))
      : fallback.testimonials,
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
  return {
    title: tContent.metaTitle,
    description: tContent.metaDescription,
    alternates: {
      canonical: `/${locale}/ueber-uns`,
    },
  };
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

  return (
    <div className={`flex min-h-screen flex-col bg-[#F7F1E8] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <Header content={globalCms?.header} />

      <main className="flex-grow pt-0">
        {/* HERO SECTION */}
        <section className="px-6 pb-10 pt-6 md:pb-12 md:pt-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-white/50 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />

          <div className="mx-auto max-w-7xl relative z-10">
            <HeroBreadcrumbs items={getAboutBreadcrumbs(locale)} position="static" surface="light" />

            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Content */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="pt-3">
                  <div className="mb-6 h-1 w-20 bg-[#B8643E]" />
                  <h1 className="text-[34px] sm:text-[40px] md:text-[50px] lg:text-[54px] font-black leading-[1.08] tracking-tight text-[#0E1A2B]">
                    {tContent.hero.titlePrefix}
                  </h1>
                </div>

                <div className="space-y-3 max-w-[640px]">
                  {tContent.hero.intro.map((paragraph, idx) => (
                    <p key={idx} className="text-[16px] md:text-[17px] text-[#4A5568] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

              </div>

              {/* Right Column: Interactive Diagnostic Simulator */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <ServiceSimulator locale={locale} />
              </div>
            </div>
          </div>
        </section>

        {/* HERO BENEFITS */}
        <section className="border-y border-[#E7DDD3] bg-[#FFFDF9] px-6 py-8 sm:py-10">
          <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-3 lg:gap-10">
            {tContent.hero.benefits.map((benefit, idx) => (
              <article key={idx} className="min-w-0">
                <div className="flex items-start gap-3">
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B8643E]" />
                  <div className="min-w-0">
                    <h2 className="text-[18px] font-black leading-snug text-[#0E1A2B] sm:text-[20px]">
                      {benefit.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-7 text-[#6B7788]">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
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

        {/* WHAT WE SERVICE */}
        <section className="border-y border-[#E7DDD3] bg-[#F7F1E8] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div>
                <SectionEyebrow className="mb-5">{structureLabels.scopeEyebrow}</SectionEyebrow>
                <h2 className="text-[32px] font-black leading-tight text-[#0E1A2B] md:text-[42px]">
                  {structureLabels.scopeTitle}
                </h2>
                <p className="mt-5 text-[17px] leading-8 text-[#4A5568]">
                  {structureLabels.scopeIntro}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {structureLabels.scopeItems.map((item) => (
                  <div key={item} className="border-b border-[#DCCFC2] py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B8643E]" />
                      <span className="text-[16px] font-black leading-7 text-[#0E1A2B]">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <SectionEyebrow className="mb-5">{structureLabels.processEyebrow}</SectionEyebrow>
              <h2 className="text-[32px] font-black leading-tight text-[#0E1A2B] md:text-[42px]">
                {structureLabels.processTitle}
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-[#4A5568]">
                {structureLabels.processLead}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {structureLabels.processSteps.map((step, index) => (
                <article key={step.title} className="flex min-h-[240px] flex-col rounded-lg border border-[#D8E2EE] bg-[#F8FAFC] p-5">
                  <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#0E1A2B] text-[13px] font-black text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-[18px] font-black leading-snug text-[#0E1A2B]">{step.title}</h3>
                  <p className="mt-4 text-[14px] leading-7 text-[#4A5568]">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* REPAIR RATIONALE */}
        <section className="bg-[#0E1A2B] px-6 py-20 text-white md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <SectionEyebrow className="mb-5 text-[#F0B38F]">{structureLabels.repairEyebrow}</SectionEyebrow>
              <h2 className="text-[32px] font-black leading-tight md:text-[42px]">
                {structureLabels.repairTitle}
              </h2>
              <p className="mt-6 text-[17px] leading-8 text-slate-300">
                {structureLabels.repairText}
              </p>
            </div>

            <div className="grid gap-4">
              {structureLabels.repairItems.map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F0B38F]" />
                    <p className="text-[16px] font-semibold leading-7 text-slate-100">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TARGET AUDIENCE / SECTORS SECTION */}
        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <SectionEyebrow className="mb-5">{structureLabels.audienceEyebrow}</SectionEyebrow>
              <h2 className="text-[32px] font-black leading-tight text-[#0E1A2B] md:text-[42px]">
                {pageLabels.quickServicesTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {tContent.services.map((service) => (
                <article key={service.id} className="flex h-full flex-col rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-[#0E1A2B]">
                  <h3 className="text-[19px] font-black leading-snug">{service.title}</h3>
                  <p className="mt-4 text-[14px] leading-7 text-[#4A5568]">{service.description}</p>
                  <a href={`${localePath}/business?sector=${service.id}`} className="mt-auto pt-6 text-[13px] font-black uppercase underline decoration-2 underline-offset-8 transition-colors hover:text-[#B8643E]">
                    {pageLabels.serviceCardCta}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MATERIALS AND SYSTEMS */}
        <section className="border-y border-[#E7DDD3] bg-[#FFFDF9] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
              <div>
                <SectionEyebrow className="mb-5">{structureLabels.materialsEyebrow}</SectionEyebrow>
                <h2 className="text-[32px] font-black leading-tight text-[#0E1A2B] md:text-[42px]">
                  {pageLabels.materialTitle}
                </h2>
                <p className="mt-5 text-[17px] leading-8 text-[#4A5568]">
                  {structureLabels.materialsLead}
                </p>
              </div>

              <div className="min-w-0">
                <div className="relative max-w-full overflow-hidden border-y border-[#0E1A2B]/10 py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
                  <style>{`
                    @keyframes about-brand-marquee {
                      from { transform: translateX(0); }
                      to { transform: translateX(-50%); }
                    }
                  `}</style>
                  <div className="flex w-max items-center gap-12 whitespace-nowrap motion-safe:animate-[about-brand-marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
                    {[...pageLabels.materialBrands, ...pageLabels.materialBrands].map((brand, i) => (
                      <span
                        key={`${brand}-${i}`}
                        aria-label={brand}
                        className="text-[23px] font-black uppercase tracking-tight text-[#0E1A2B]/35 grayscale transition-colors hover:text-[#0E1A2B]/60"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-5 text-[13px] font-semibold leading-6 text-[#6B7788]">
                  {structureLabels.materialsNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO-FIRST ABOUT SECTION */}
        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16">
              <div className="relative">
                <AboutVideoPlayer
                  mediaLabel={tContent.quality.mediaLabel}
                  playLabel={tContent.quality.playLabel}
                  posterSrc="/images/about/quality_video.png"
                  videoSrc="/videos/about-workshop-service.mp4"
                />
              </div>

              <div className="max-w-xl">
                <h2 className="text-[32px] font-black leading-tight text-[#0E1A2B] md:text-[42px]">
                  {tContent.quality.title}
                </h2>
                <p className="mt-5 text-[17px] leading-8 text-[#4A5568]">
                  {tContent.quality.description}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {tContent.quality.features.map((feature) => (
                    <span key={feature} className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-[13px] font-black text-[#0E1A2B]">
                      {feature}
                    </span>
                  ))}
                </div>
                <a href={`${localePath}/referenzen`} className="mt-8 inline-flex text-[15px] font-black text-[#B8643E] underline decoration-[#DAB08A] underline-offset-4 hover:text-[#8E4B2F]">
                  {tContent.quality.cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl border-b border-[#E2E8F0] pb-6">
              <SectionEyebrow className="mb-5">{structureLabels.testimonialsEyebrow}</SectionEyebrow>
              <h2 className="text-[30px] font-black leading-tight text-[#0E1A2B] md:text-[38px]">
                {pageLabels.testimonialsTitle}
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[#4A5568]">
                {structureLabels.testimonialsLead}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {pageLabels.testimonials.map((testimonial) => (
                <article key={`${testimonial.name}-${testimonial.role}`} className="flex min-h-[210px] flex-col rounded-lg border border-[#D8E2EE] bg-[#F8FAFC] p-5 shadow-sm">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <div className="flex h-full w-full items-center justify-center bg-[#0E1A2B] text-[12px] font-black uppercase text-white">
                        {testimonial.name.slice(0, 2)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-black leading-snug text-[#0E1A2B]">{testimonial.name}</div>
                      <div className="mt-1 text-[12px] leading-5 text-[#4A5568]">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="mt-auto border-l-2 border-[#C66A3D] pl-4 text-[14px] leading-6 text-[#40516A]">&ldquo;{testimonial.text}&rdquo;</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-white px-6 py-8 sm:py-10">
           <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg border border-[#D8E2EE] bg-[#EAF1F7] px-6 py-7 shadow-[0_16px_45px_rgba(14,26,43,0.07)] md:flex-row md:items-center md:justify-between md:px-9">
              <div className="max-w-2xl">
                <h2 className="text-[25px] font-black leading-[1.12] text-[#0E1A2B] md:text-[32px]">
                   {tContent.final.title}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-[#4A5568]">
                  {structureLabels.finalLead}
                </p>
              </div>

              <LeistungenRequestButton
                label={tContent.final.button}
                serviceIntent="about-page-final"
                className="min-h-12 self-start bg-[#B8643E] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#9E5332] md:self-auto"
              />
           </div>
        </section>
      </main>

      <Footer content={globalCms?.footer} />
    </div>
  );
}
