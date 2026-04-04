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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E8]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <IntakeSection />
        <BentoGridSection />
        <TrustSection />
        <CoverageMap />
        <ExcellenceCarousel />
        <ReviewsSection />
        <RoadmapSection />
        <FAQSection />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
