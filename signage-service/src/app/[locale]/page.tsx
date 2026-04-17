import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import IntakeSection from "@/components/sections/IntakeSection";
import BentoGridSection from "@/components/sections/BentoGridSection";
import TrustSection from "@/components/sections/TrustSection";
import CoverageMap from "@/components/sections/CoverageMap";
import ExcellenceCarousel from "@/components/sections/ExcellenceCarousel";
import ReviewsSection from "@/components/sections/ReviewsSection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import FAQSection from "@/components/sections/FAQSection";
import FooterCTA from "@/components/sections/FooterCTA";
import { getHomePageCmsContent, getGlobalPageCmsContent } from "@/lib/cms/pages";

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
          {homeCms?.roadmap && <RoadmapSection content={homeCms.roadmap} />}
          {homeCms?.faq && <FAQSection content={homeCms.faq} />}
          {globalCms?.footerCta && <FooterCTA content={globalCms.footerCta} />}
        </main>
        <Footer content={globalCms?.footer} />
      </div>
    );
  } catch (error: any) {
    console.error('HomePage Render Error:', error);
    // Absolute fallback if everything crashes
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F1E8] p-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading page</h1>
        <p className="text-gray-600">We are currently experiencing technical difficulties. Please try again later.</p>
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs font-mono">
          {error?.message || 'Unknown Error'}
        </div>
      </div>
    );
  }
}
