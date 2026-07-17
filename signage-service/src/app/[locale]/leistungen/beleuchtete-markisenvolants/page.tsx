import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeistungenIlluminatedValanceExchange from '@/components/leistungen/LeistungenIlluminatedValanceExchange';
import LeistungenIlluminatedValanceCalculator from '@/components/leistungen/LeistungenIlluminatedValanceCalculator';
import LeistungenIlluminatedValanceHero from '@/components/leistungen/LeistungenIlluminatedValanceHero';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import FAQSection from '@/components/sections/FAQSection';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import { routing } from '@/i18n/routing';
import { buildLocaleUrl } from '@/lib/seo';

import { getIlluminatedValanceCopy } from './copy';

export const revalidate = 3600;

const VALANCE_PAGE_PATH = '/leistungen/beleuchtete-markisenvolants';
const ISSUE_TYPE = 'IlluminatedValance';

type Locale = (typeof routing.locales)[number];

function isSupportedLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale = requestedLocale === 'ru' ? 'ru' : 'de';
  const copy = getIlluminatedValanceCopy(locale);
  const pageUrl = buildLocaleUrl(locale, VALANCE_PAGE_PATH);

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: copy.metadata.socialTitle,
      description: copy.metadata.socialDescription,
      url: pageUrl,
      siteName: 'PixelRing',
      type: 'website',
      locale: copy.metadata.openGraphLocale,
    },
    twitter: {
      card: 'summary',
      title: copy.metadata.socialTitle,
      description: copy.metadata.socialDescription,
    },
  };
}

function PageHeading({
  eyebrow,
  title,
  intro,
  light = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-4xl text-start">
      <SectionEyebrow className={light ? 'mb-3 text-[#F2C6A3]' : 'mb-3'}>{eyebrow}</SectionEyebrow>
      <h2
        className={`text-3xl font-extrabold leading-[1.08] tracking-[0] sm:text-5xl ${
          light ? 'text-white' : 'text-[#0E1A2B]'
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-5 max-w-3xl text-[16px] font-semibold leading-8 ${light ? 'text-white/74' : 'text-[#526174]'}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}

export default async function BeleuchteteMarkisenVolantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const copy = getIlluminatedValanceCopy(locale);
  const globalCms = await getGlobalPageCmsContent(locale);
  const headerContent = globalCms?.header ? { ...globalCms.header, links: undefined } : null;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#FFFDF9] text-[#15202A]">
      <Header content={headerContent} />
      <main>
        <LeistungenIlluminatedValanceHero
          title={copy.hero.title}
          subline={copy.hero.subline}
          breadcrumbs={copy.hero.breadcrumbs}
          primaryCta={copy.hero.primaryCta}
          primaryServiceIntent="illuminated-valance-feasibility"
          primaryInitialIssueType={ISSUE_TYPE}
          primaryInitialMessage={copy.hero.primaryPrefill}
          secondaryCta={copy.hero.secondaryCta}
          secondaryServiceIntent="illuminated-valance-product-montage"
          secondaryInitialIssueType={ISSUE_TYPE}
          secondaryInitialMessage={copy.hero.secondaryPrefill}
          dayViewLabel={copy.hero.dayViewLabel}
          nightViewLabel={copy.hero.nightViewLabel}
        />

        <section className="bg-[#F4F7FB] py-14 sm:py-20">
          <div className="pr-site-container">
            <PageHeading
              eyebrow={copy.brand.eyebrow}
              title={copy.brand.title}
              intro={copy.brand.intro}
            />

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[252px_252px]">
              {copy.brand.visuals.map((visual) => (
                <article
                  key={visual.label}
                  tabIndex={0}
                  className={`group relative min-h-[320px] overflow-hidden rounded-[28px] border border-[#0E1A2B]/20 bg-[#0E1A2B] text-start text-white shadow-[0_24px_60px_rgba(14,26,43,0.18)] outline-none focus-visible:ring-4 focus-visible:ring-[#B8643E]/30 sm:min-h-[340px] lg:min-h-0 ${visual.layout}`}
                >
                  <Image
                    src={visual.image}
                    alt={visual.alt}
                    fill
                    sizes={visual.sizes}
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#07101B]/95 via-[#07101B]/48 to-[#07101B]/8 transition-colors duration-500 lg:via-[#07101B]/30 lg:group-hover:via-[#07101B]/58 lg:group-focus-within:via-[#07101B]/58"
                  />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-7">
                    <h3 className="max-w-xl text-[25px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[29px]">
                      {visual.title}
                    </h3>
                    <div className="grid transition-[grid-template-rows,opacity,transform] duration-500 ease-out lg:grid-rows-[0fr] lg:translate-y-3 lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
                      <p className="mt-3 max-w-xl overflow-hidden text-[14px] font-semibold leading-6 text-white/82 sm:text-[15px] sm:leading-7">
                        {visual.text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <LeistungenIlluminatedValanceExchange content={copy.exchange} />

        <section id="machbarkeit" className="bg-[#0E1A2B] py-12 text-white sm:py-16">
          <div className="pr-site-container grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center">
            <PageHeading
              eyebrow={copy.compatibility.eyebrow}
              title={copy.compatibility.title}
              intro={copy.compatibility.intro}
              light
            />
            <div className="rounded-[28px] border border-white/12 bg-white/[0.06] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[22px] border border-white/12 bg-white/[0.06] p-5 text-start">
                  <h3 className="text-[16px] font-extrabold text-white">{copy.compatibility.helpfulTitle}</h3>
                  <ul className="mt-4 space-y-2 text-[14px] font-semibold leading-6 text-white/76">
                    {copy.compatibility.helpfulItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2A07C]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
                <aside className="rounded-[22px] border border-[#E2A07C]/30 bg-[#B8643E]/14 p-5 text-start">
                  <h3 className="text-[16px] font-extrabold text-white">{copy.compatibility.notRequiredTitle}</h3>
                  <ul className="mt-4 space-y-2 text-[14px] font-semibold leading-6 text-white/76">
                    {copy.compatibility.notRequiredItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2A07C]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
              <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-[14px] leading-6 text-white/70">
                  {copy.compatibility.microcopy}
                </p>
                <div className="shrink-0">
                  <LeistungenRequestButton
                    label={copy.compatibility.cta}
                    serviceIntent="illuminated-valance-compatibility-request"
                    initialIssueType={ISSUE_TYPE}
                    initialMessage={copy.hero.primaryPrefill}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <LeistungenIlluminatedValanceCalculator
          locale={locale}
          content={copy.calculator}
        />

        <FAQSection
          content={{
            title: copy.faq.title,
            items: copy.faq.items,
          }}
          titleClassName="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl"
        />

        <section className="bg-[#0E1A2B] py-14 text-white sm:py-20">
          <div className="pr-site-container">
            <div className="grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.06] p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.76fr)] lg:items-end">
              <div className="text-start">
                <SectionEyebrow className="mb-3 text-[#F2C6A3]">{copy.finalCta.eyebrow}</SectionEyebrow>
                <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-[0] sm:text-5xl">
                  {copy.finalCta.title}
                </h2>
                <p className="mt-5 max-w-3xl text-[16px] leading-8 text-white/75">
                  {copy.finalCta.intro}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-[#0B1520]/70 p-5 text-start sm:p-6">
                <h3 className="text-[18px] font-black leading-tight">{copy.finalCta.cardTitle}</h3>
                <p className="mt-4 text-[15px] font-semibold leading-7 text-white/78">
                  {copy.finalCta.cardText}
                </p>
                <div className="mt-7">
                  <LeistungenRequestButton
                    label={copy.finalCta.button}
                    serviceIntent="illuminated-valance-final-request"
                    initialIssueType={ISSUE_TYPE}
                    initialMessage={copy.hero.primaryPrefill}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
