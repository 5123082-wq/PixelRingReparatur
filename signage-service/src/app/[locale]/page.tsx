import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import TrustSection from '@/components/sections/TrustSection';
import IntakeSection from '@/components/sections/IntakeSection';
import BentoGridSection from '@/components/sections/BentoGridSection';
import ExcellenceCarousel from '@/components/sections/ExcellenceCarousel';
import ReviewsSection from '@/components/sections/ReviewsSection';
import RoadmapSection from '@/components/sections/RoadmapSection';
import FAQSection from '@/components/sections/FAQSection';
import FooterCTA from '@/components/sections/FooterCTA';
import CoverageMap from '@/components/sections/CoverageMap';
import { getGlobalPageCmsContent, getHomePageCmsContent } from '@/lib/cms/pages';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [globalCms, homeCms] = await Promise.all([
    getGlobalPageCmsContent(locale),
    getHomePageCmsContent(locale),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
      <Header content={globalCms?.header} />
      <main className="flex-1">
        <HeroSection content={homeCms?.hero} />
        <IntakeSection content={homeCms?.intake} />
        <BentoGridSection content={homeCms?.bento} />
        <TrustSection content={homeCms?.trust} />
        <CoverageMap content={homeCms?.coverage} />
        <ExcellenceCarousel content={homeCms?.excellence} />
        <ReviewsSection content={homeCms?.reviews} />
        <RoadmapSection content={homeCms?.roadmap} />
        <FAQSection content={homeCms?.faq} />
        <FooterCTA content={globalCms?.footerCta} />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
