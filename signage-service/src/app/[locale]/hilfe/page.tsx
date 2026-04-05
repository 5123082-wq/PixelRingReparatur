import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HelpHero from '@/components/sections/HelpHero';
import ProblemCategories from '@/components/sections/ProblemCategories';
import UrgentCases from '@/components/sections/UrgentCases';
import SymptomCluster from '@/components/sections/SymptomCluster';
import HelpCTA from '@/components/sections/HelpCTA';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hilfe & Fehlerbehebung | PixelRing Reparatur',
  description: 'Navigation durch typische Probleme mit Werbeanlagen. Lösungen für Lichtwerbung, LED, Profilbuchstaben und mehr.',
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF9]">
      <Header />
      
      <HelpHero />
      
      <div className="relative">
        <ProblemCategories />
        
        <UrgentCases />
        
        <SymptomCluster />
        
        <HelpCTA />
      </div>

      <Footer />
    </main>
  );
}
