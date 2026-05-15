import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import IntakeSection from "@/components/sections/IntakeSection";
import BentoGridSection from "@/components/sections/BentoGridSection";
import TrustSection from "@/components/sections/TrustSection";
import CoverageMap from "@/components/sections/CoverageMap";
import ExcellenceCarousel from "@/components/sections/ExcellenceCarousel";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FAQSection from "@/components/sections/FAQSection";
import FooterCTA from "@/components/sections/FooterCTA";
import { getHomePageCmsContent, getGlobalPageCmsContent } from "@/lib/cms/pages";

const HOME_METADATA: Record<string, { title: string; description: string }> = {
  de: {
    title: 'PixelRing Reparatur | Schilder, Lichtwerbung und Branding-Service',
    description:
      'PixelRing koordiniert Reparatur, Montage und Service fuer Schilder, Lichtwerbung, Folien und Branding-Anlagen in Deutschland.',
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
    title: 'PixelRing Reparatur | Tabela, Isikli Reklam ve Marka Servisi',
    description:
      'PixelRing Almanya genelinde tabela, isikli reklam, folyo ve marka uygulamalari icin onarim, montaj ve servis taleplerini koordine eder.',
  },
  pl: {
    title: 'PixelRing Reparatur | Serwis szyldow, reklam swietlnych i brandingu',
    description:
      'PixelRing koordynuje naprawy, montaz i serwis szyldow, reklam swietlnych, folii oraz elementow brandingu w Niemczech.',
  },
  ar: {
    title: 'PixelRing Reparatur | خدمة اللوحات والاعلانات المضيئة',
    description:
      'تنسق PixelRing طلبات اصلاح وتركيب وخدمة اللوحات والاعلانات المضيئة والفويل وعناصر العلامة التجارية في المانيا.',
  },
};

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
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
        <Header content={globalCms?.header} />
        <main className="flex-1">
          {homeCms?.hero && <HeroSection content={homeCms.hero} />}
          {homeCms?.intake && <IntakeSection content={homeCms.intake} />}
          {homeCms?.bento && <BentoGridSection content={homeCms.bento} />}
          {homeCms?.trust && <TrustSection content={homeCms.trust} />}
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
