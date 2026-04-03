import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import TrustSection from '@/components/sections/TrustSection';
import IntakeSection from '@/components/sections/IntakeSection';
import BentoGridSection from '@/components/sections/BentoGridSection';
import ExcellenceCarousel from '@/components/sections/ExcellenceCarousel';
import RoadmapSection from '@/components/sections/RoadmapSection';
import FAQSection from '@/components/sections/FAQSection';
import FooterCTA from '@/components/sections/FooterCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E9]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <IntakeSection />
        <BentoGridSection />
        <ExcellenceCarousel />
        <RoadmapSection />
        <FAQSection />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
