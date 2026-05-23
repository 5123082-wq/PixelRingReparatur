import type { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import { getAboutPageCmsContent, getGlobalPageCmsContent } from '@/lib/cms/pages';
import CmsImage from '@/components/common/CmsImage';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import ServiceSimulator from '@/components/sections/ServiceSimulator';
import AboutVideoPlayer from '@/components/sections/AboutVideoPlayer';

import { ABOUT_CONTENT, ABOUT_PAGE_LABELS, type AboutContent, type Locale } from '@/lib/content/about-page';

type AboutCmsContent = Awaited<ReturnType<typeof getAboutPageCmsContent>>;
type AboutPageLabels = (typeof ABOUT_PAGE_LABELS)[Locale];

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

  return (
    <div className={`flex min-h-screen flex-col bg-[#F7F1E8] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <Header content={globalCms?.header} />

      <main className="flex-grow pt-0">
        {/* HERO SECTION */}
        <section className="px-6 py-12 md:py-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-white/50 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />

          <div className="mx-auto max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Content & Benefits */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div>
                  <SectionEyebrow className="mb-4 md:mb-5">
                    {tContent.hero.badge}
                  </SectionEyebrow>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#0E1A2B]/10">
                  {tContent.hero.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[#0E1A2B] font-bold text-[14px] md:text-[15px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B8643E] shrink-0" />
                        {benefit.title}
                      </div>
                      <p className="text-[#6B7788] text-[13px] leading-snug">
                        {benefit.description}
                      </p>
                    </div>
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

        {/* TARGET AUDIENCE / SECTORS SECTION */}
        <section className="px-6 py-24 bg-white">
           <div className="mx-auto max-w-7xl">
              <div className="mb-16">
                 <SectionEyebrow className="mb-5">FOR WHOM</SectionEyebrow>
                 <h2 className="text-[42px] font-black text-[#0E1A2B] mb-4">{pageLabels.quickServicesTitle}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {tContent.services.map((service) => (
                     <div key={service.id} className="flex flex-col h-full p-8 rounded-[32px] border border-[#E2E8F0] bg-[#F8FAFC] text-[#0E1A2B] transition-all duration-300 hover:shadow-xl hover:border-[#B8643E]/30">
                        <h3 className="text-[20px] font-bold mb-4">{service.title}</h3>
                        <p className="text-[15px] leading-relaxed mb-6 text-[#4A5568]">{service.description}</p>
                        <a href={`${localePath}/business?sector=${service.id}`} className="mt-auto text-[14px] font-bold uppercase tracking-wider underline decoration-2 underline-offset-8 transition-colors hover:text-[#B8643E] inline-block">{pageLabels.serviceCardCta}</a>
                     </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ABOUT SECTION WITH COLLAGE & ACCORDIONS */}
        <section className="px-6 py-24 overflow-hidden">
           <div className="mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-[460px_minmax(0,1fr)] gap-10 lg:gap-12 items-start">
                 {/* Visual */}
                 <div className="relative w-full max-w-[520px] lg:max-w-[460px] mx-auto lg:mx-0">
                    <div className="relative h-[460px] md:h-[560px] lg:h-[640px] w-full rounded-[36px] overflow-hidden shadow-2xl">
                       <CmsImage src="/images/about/about_collage_1.png" alt="Collage 1" fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover object-center" />
                    </div>
                 </div>

                 {/* Text Content */}
                 <div className="min-w-0 w-full">
                    <div className="mb-12">
                       <h2 className="text-[42px] font-black text-[#0E1A2B]">{tContent.about.title}</h2>
                    </div>

                    <div className="space-y-2">
                       {tContent.about.accordions.map((item, i) => (
                         <div key={i} className="border-b border-[#0E1A2B]/10 py-6">
                            <details name="about-process" className="group">
                               <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[20px] font-bold text-[#0E1A2B] group-open:text-[#B8643E]">
                                  <span className="min-w-0">{item.title}</span>
                                  <span className="shrink-0 transition-transform duration-300 group-open:rotate-180">
                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                     </svg>
                                  </span>
                               </summary>
                               <div className="mt-6 text-[#4A5568] leading-relaxed">
                                  {item.content}
                               </div>
                            </details>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* LOGO CLOUD - Support Our Company */}
        <section className="px-6 py-24 bg-white border-b border-[#0E1A2B]/5">
           <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16">
                 <h2 className="text-[32px] font-black text-[#0E1A2B]">{pageLabels.materialTitle}</h2>
              </div>
              <div className="relative overflow-hidden border-y border-[#0E1A2B]/5 py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
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
                       className="text-[24px] font-black uppercase tracking-tight text-[#0E1A2B]/35 grayscale transition-colors hover:text-[#0E1A2B]/60"
                     >
                       {brand}
                     </span>
                   ))}
                 </div>
              </div>
           </div>
        </section>

        {/* VIDEO-FIRST ABOUT SECTION */}
        <section className="px-6 py-24 bg-white">
           <div className="mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-12 lg:gap-16 items-center">
                 <div className="relative">
                    <AboutVideoPlayer
                      mediaLabel={tContent.quality.mediaLabel}
                      playLabel={tContent.quality.playLabel}
                      posterSrc="/images/about/quality_video.png"
                      videoSrc="/videos/about-workshop-service.mp4"
                    />
                 </div>

                 <div className="max-w-xl">
                    <h2 className="text-[40px] font-black text-[#0E1A2B] leading-tight mb-5 md:text-[48px]">
                       {tContent.quality.title}
                    </h2>
                    <p className="text-[19px] text-[#4A5568] leading-relaxed mb-7">
                       {tContent.quality.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
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

        {/* TESTIMONIALS SECTION (Why Say Our Customers) */}
        <section className="px-6 py-14 bg-white">
           <div className="mx-auto max-w-7xl">
              <div className="mb-8 border-b border-[#E2E8F0] pb-6">
                 <h2 className="max-w-3xl text-[30px] font-black leading-[1.08] text-[#0E1A2B] md:text-[38px]">{pageLabels.testimonialsTitle}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                 {pageLabels.testimonials.map((testimonial, i) => (
                   <div key={i} className="flex min-h-[210px] flex-col rounded-lg border border-[#D8E2EE] bg-[#F8FAFC] p-5 shadow-sm">
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
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-white px-6 py-8 sm:py-10">
           <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[28px] border border-[#D8E2EE] bg-[#EAF1F7] px-6 py-7 shadow-[0_16px_45px_rgba(14,26,43,0.07)] md:flex-row md:items-center md:justify-between md:px-9">
              <h2 className="max-w-2xl text-[25px] font-black leading-[1.12] text-[#0E1A2B] md:text-[32px]">
                 {tContent.final.title}
              </h2>

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
