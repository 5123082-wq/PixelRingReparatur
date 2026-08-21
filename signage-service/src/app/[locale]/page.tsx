import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import HomeBeforeAfterSection from "@/components/sections/HomeBeforeAfterSection";
import IntakeSection from "@/components/sections/IntakeSection";
import BentoGridSection from "@/components/sections/BentoGridSection";
import TrustSection from "@/components/sections/TrustSection";
import HomeServicesSection from "@/components/sections/HomeServicesSection";
import CoverageMap from "@/components/sections/CoverageMap";
import ExcellenceCarousel from "@/components/sections/ExcellenceCarousel";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FAQSection from "@/components/sections/FAQSection";
import FooterCTA from "@/components/sections/FooterCTA";
import { getHomePageCmsContent, getGlobalPageCmsContent } from "@/lib/cms/pages";
import { buildLanguageAlternates, buildLocaleUrl, buildSiteUrl } from "@/lib/seo";

export const revalidate = 300;

const HOME_METADATA: Record<string, { title: string; description: string }> = {
  de: {
    title: 'PixelRing Reparatur | Schilder, Lichtwerbung und Branding-Service',
    description:
      'PixelRing koordiniert Reparatur, Montage und Service für Schilder, Lichtwerbung, Folien und Branding-Anlagen in Deutschland.',
  },
  en: {
    title: 'PixelRing Repair | Signage, Light Advertising and Branding Service',
    description:
      'PixelRing coordinates sign repair, installation and service for signage, light advertising, films and branding assets in Germany.',
  },
  ru: {
    title: 'PixelRing Reparatur | Ремонт вывесок и световой рекламы',
    description:
      'PixelRing принимает заявки на ремонт, монтаж и обслуживание вывесок, световой рекламы, пленок и брендированных объектов в Германии.',
  },
  tr: {
    title: 'PixelRing Reparatur | Tabela, Işıklı Reklam ve Marka Servisi',
    description:
      'PixelRing Almanya genelinde tabela, ışıklı reklam, folyo ve marka uygulamaları için onarım, montaj ve servis taleplerini koordine eder.',
  },
  pl: {
    title: 'PixelRing Reparatur | Serwis szyldów, reklam świetlnych i brandingu',
    description:
      'PixelRing koordynuje naprawy, montaż i serwis szyldów, reklam świetlnych, folii oraz elementów brandingu w Niemczech.',
  },
  ar: {
    title: 'PixelRing Reparatur | خدمة اللوحات والاعلانات المضيئة',
    description:
      'تنسق PixelRing طلبات اصلاح وتركيب وخدمة اللوحات والاعلانات المضيئة والفويل وعناصر العلامة التجارية في المانيا.',
  },
};

const HOME_OG_IMAGE_PATH = '/images/leistungen/repair-hero/hero-sign-repair-01.jpg';

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  de: 'de_DE',
  en: 'en_US',
  ru: 'ru_RU',
  tr: 'tr_TR',
  pl: 'pl_PL',
  ar: 'ar_AR',
};

function buildHomeJsonLd(locale: string, metadata: { title: string; description: string }) {
  const pageUrl = buildLocaleUrl(locale);
  const organizationId = `${buildSiteUrl('/')}#organization`;
  const websiteId = `${buildSiteUrl('/')}#website`;
  const serviceId = `${pageUrl}#signage-service`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'PixelRing Reparatur',
        url: buildSiteUrl('/'),
        logo: buildSiteUrl('/icon.png'),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'PixelRing Reparatur',
        url: buildSiteUrl('/'),
        publisher: {
          '@id': organizationId,
        },
        inLanguage: ['de', 'en', 'ru', 'tr', 'pl', 'ar'],
      },
      {
        '@type': 'Service',
        '@id': serviceId,
        name: metadata.title,
        description: metadata.description,
        provider: {
          '@id': organizationId,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Germany',
        },
        serviceType: [
          'Schilder-Reparatur',
          'Lichtwerbung-Service',
          'Montage',
          'Branding-Service',
        ],
        url: pageUrl,
        inLanguage: locale,
      },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = HOME_METADATA[locale] ?? HOME_METADATA.de;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: `/${locale}`,
      languages: buildLanguageAlternates(''),
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: buildLocaleUrl(locale),
      siteName: 'PixelRing Reparatur',
      locale: OPEN_GRAPH_LOCALES[locale] ?? OPEN_GRAPH_LOCALES.de,
      type: 'website',
      images: [
        {
          url: buildSiteUrl(HOME_OG_IMAGE_PATH),
          width: 1672,
          height: 941,
          alt: 'PixelRing Reparatur service result for signage and light advertising.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [buildSiteUrl(HOME_OG_IMAGE_PATH)],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const metadata = HOME_METADATA[locale] ?? HOME_METADATA.de;
  const jsonLd = buildHomeJsonLd(locale, metadata);

  try {
    const [globalCms, homeCms] = await Promise.all([
      getGlobalPageCmsContent(locale).catch(err => {
        console.error('Error fetching Global CMS content:', err);
        return null;
      }),
      getHomePageCmsContent(locale).catch(err => {
        console.error('Error fetching Home CMS content:', err);
        return null;
      }),
    ]);

    return (
      <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <Header content={globalCms?.header} />
        <main className="flex-1">
          {homeCms?.hero && <HeroSection content={homeCms.hero} />}
          <HomeBeforeAfterSection locale={locale} />
          {homeCms?.intake && <IntakeSection content={homeCms.intake} />}
          {homeCms?.bento && <BentoGridSection content={homeCms.bento} />}
          {homeCms?.trust && <TrustSection content={homeCms.trust} />}
          <HomeServicesSection locale={locale} />
          {homeCms?.coverage && <CoverageMap content={homeCms.coverage} />}
          {homeCms?.excellence && <ExcellenceCarousel content={homeCms.excellence} />}
          {homeCms?.reviews && <ReviewsSection content={homeCms.reviews} />}
          {homeCms?.faq && <FAQSection content={homeCms.faq} />}
          {globalCms?.footerCta && <FooterCTA content={globalCms.footerCta} />}
        </main>
        <Footer content={globalCms?.footer} />
      </div>
    );
  } catch (error: unknown) {
    console.error('HomePage Render Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    // Absolute fallback if everything crashes
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F1E8] p-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading page</h1>
        <p className="text-gray-600">We are currently experiencing technical difficulties. Please try again later.</p>
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs font-mono">
          {errorMessage}
        </div>
      </div>
    );
  }
}
