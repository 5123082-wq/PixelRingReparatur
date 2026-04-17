'use client';

import { useTranslations } from 'next-intl';
import { TrustCmsContent } from '@/lib/cms/pages';
import React, { useState } from 'react';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';

const TrustSection = ({ content }: { content?: TrustCmsContent }) => {
  const t = useTranslations('Trust');
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Safe translation helper to prevent 500 errors if keys are missing
  const safeT = (key: string, fallback: string) => {
    try {
      return t(key) || fallback;
    } catch (e) {
      console.error(`Translation missing for Trust.${key}`);
      return fallback;
    }
  };

  const rawStats = (() => {
    try {
      return t.raw('stats') as any[] || [];
    } catch (e) {
      return [];
    }
  })();

  const stats = (content?.stats && content.stats.length > 0) 
    ? content.stats 
    : rawStats.slice(0, 5);

  return (
    <section className="relative w-full bg-[#0E1A2B] py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#B8643E]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-16">
          
          {/* HEADER */}
          <div className="flex flex-col gap-6 max-w-4xl">
            <h2 className="text-[40px] md:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight">
              <span>{content?.titleStart || safeT('titleStart', 'Genug')}</span>
              <br />
              <span className="text-[#B8643E] relative inline-block">
                {content?.titleAccent || safeT('titleAccent', 'komplizierte Portale')}
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#B8643E]/30 rounded-full" />
              </span>
              <br />
              <span>{content?.titleEnd || safeT('titleEnd', 'Wir reparieren einfach.')}</span>
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#B8643E] to-transparent rounded-full" />
            <p className="text-[18px] md:text-[22px] text-white/70 leading-relaxed font-medium max-w-2xl">
              {content?.description || safeT('description', 'Direkte Ausführung in нашем техническом ателье.')}
            </p>
          </div>

          {/* BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, idx) => {
              const isLarge = idx === 0;
              return (
                <div 
                  key={idx}
                  className={`group relative p-8 rounded-[32px] border transition-all duration-500 overflow-hidden
                    ${isLarge 
                      ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#B8643E] to-[#8E4B2E] border-white/10 shadow-2xl shadow-[#B8643E]/20' 
                      : 'bg-white/5 border-white/10 backdrop-blur-md'}
                    hover:shadow-2xl hover:-translate-y-1`}
                >
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest
                          ${isLarge ? 'bg-white/20 text-white' : 'bg-[#B8643E]/10 text-[#B8643E]'}`}>
                          {stat.label}
                        </span>
                      </div>
                      <h3 className={`text-[32px] md:text-[40px] font-black leading-tight mb-4 tracking-tighter text-white`}>
                        {stat.value}
                      </h3>
                      <p className={`text-[17px] md:text-[18px] leading-relaxed max-w-md ${isLarge ? 'text-white/90' : 'text-white/50'}`}>
                        {stat.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative circle */}
                  <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full border opacity-10 group-hover:scale-150 transition-transform duration-700
                    ${isLarge ? 'border-white' : 'border-[#B8643E]'}`} />
                </div>
              );
            })}
          </div>

          {/* CTA BOTTOM */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-6">
            <button 
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-10 py-5 bg-[#B8643E] text-white rounded-full font-bold text-[18px] text-center hover:bg-[#9E5332] transition-all hover:scale-105 shadow-xl shadow-[#B8643E]/20 active:scale-95 cursor-pointer"
            >
              {content?.cta_label || safeT('cta_label', 'Beratung anfragen')}
            </button>
            <div className="flex items-center gap-4 text-white/40 text-[14px] font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{content?.cta_subtext || safeT('cta_subtext', 'Antwort in 15 Min.')}</span>
            </div>
          </div>

          <ContactModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onOpenChat={() => setChatOpen(true)}
          />
          <ChatModal
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
          />

        </div>
      </div>
    </section>
  );
};

export default TrustSection;
