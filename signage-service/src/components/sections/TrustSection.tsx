'use client';

import { useTranslations } from 'next-intl';
import { TrustCmsContent } from '@/lib/cms/pages';
import React, { useState } from 'react';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';
import SectionEyebrow from '../common/SectionEyebrow';
import CmsImage from '../common/CmsImage';

const TRUST_VISUAL_SRC = '/generated/referenzen/agent-facade/wide-hero-service-result.png';

const TrustSection = ({ content }: { content?: TrustCmsContent }) => {
  const t = useTranslations('Trust');
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Safe translation helper to prevent 500 errors if keys are missing
  const safeT = (key: string, fallback: string) => {
    try {
      return t(key) || fallback;
    } catch {
      console.error(`Translation missing for Trust.${key}`);
      return fallback;
    }
  };

  const rawStats = (() => {
    try {
      return t.raw('stats') as NonNullable<TrustCmsContent['stats']> || [];
    } catch {
      return [];
    }
  })();

  const stats = (content?.stats && content.stats.length > 0) 
    ? content.stats 
    : rawStats.slice(0, 6);

  const antiTitle = content?.antiTitle || safeT('antiTitle', 'Kein anonymes Portal. Ein verantwortlicher Serviceprozess.');
  const antiText = content?.antiText || safeT(
    'antiText',
    'PixelRing verantwortet Aufnahme, Koordination, Qualitaetskontrolle und Ergebnis.'
  );
  const visualEyebrow = content?.visualEyebrow || safeT('visualEyebrow', 'Service am Objekt');
  const visualTitle = content?.visualTitle || safeT('visualTitle', 'Fotos, Zugang und Ergebnis werden zusammengefuehrt');
  const visualText = content?.visualText || safeT(
    'visualText',
    'Leuchtkasten, LED-Module, Folie oder Demontage werden als ein Fall betrachtet.'
  );
  const visualImageAlt = content?.visualImageAlt || safeT(
    'visualImageAlt',
    'PixelRing Serviceeinsatz an einer Geschaeftsfassade mit Lichtwerbung'
  );

  return (
    <section className="relative w-full bg-[#0E1A2B] py-16 md:py-18 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-[min(520px,80vw)] w-[min(520px,80vw)] rounded-full bg-[radial-gradient(circle,rgba(184,100,62,0.12)_0%,rgba(184,100,62,0.055)_42%,transparent_74%)]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[min(460px,72vw)] w-[min(460px,72vw)] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.025)_44%,transparent_76%)]" />
      </div>

      <div className="relative z-10 pr-site-container">
        <div className="flex flex-col gap-9 md:gap-10">
          
          {/* HEADER */}
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-center">
            <div className="flex min-w-0 max-w-4xl flex-col gap-6">
              <SectionEyebrow>{content?.pretitle || safeT('pretitle', 'ADVANTAGE')}</SectionEyebrow>
              <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[0] text-white md:text-[42px]">
                <span>{content?.titleStart || safeT('titleStart', 'Genug')}</span>
                {' '}
                <br />
                <span className="relative inline-block text-[#B8643E]">
                  {content?.titleAccent || safeT('titleAccent', 'komplizierte Portale')}
                </span>
                {(content?.titleEnd || safeT('titleEnd', '')) ? (
                  <>
                    <br />
                    <span>{content?.titleEnd || safeT('titleEnd', '')}</span>
                  </>
                ) : null}
              </h2>
              <p className="text-[16px] md:text-[17px] text-white/70 leading-[1.55] max-w-2xl">
                {content?.description || safeT('description', 'Direkte Ausfuehrung fuer Werbeanlagen.')}
              </p>
            </div>

            <div className="min-w-0 rounded-[24px] border border-white/14 bg-[#253142]/90 p-2.5 shadow-2xl shadow-black/15">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] lg:aspect-[21/9]">
                <CmsImage
                  src={TRUST_VISUAL_SRC}
                  alt={visualImageAlt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/82 via-[#0E1A2B]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white sm:p-5">
                  <p className="w-fit rounded-full bg-white/16 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em]">
                    {visualEyebrow}
                  </p>
                  <h3 className="text-[20px] font-black leading-tight tracking-[0] sm:text-[22px]">
                    {visualTitle}
                  </h3>
                  <p className="text-[13px] font-semibold leading-[1.45] text-white/78">
                    {visualText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BENEFITS GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`group relative min-h-[190px] overflow-hidden rounded-[22px] border p-4 shadow-[0_18px_44px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/22 hover:bg-[#2A3545] hover:shadow-xl
                  ${idx === 0
                    ? 'border-[#B8643E]/34 bg-[#293442] ring-1 ring-[#B8643E]/18'
                    : 'border-white/12 bg-[#222E3E]'}`}
              >
                <div className="relative z-10 flex h-full min-w-0 flex-col justify-between gap-4">
                  <div className="flex min-w-0 flex-col gap-2.5">
                    <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]
                      ${idx === 0
                        ? 'bg-[#B8643E]/18 text-[#F0B197]'
                        : 'bg-white/[0.08] text-[#D8E6F5]/78'}`}
                    >
                      {stat.label}
                    </span>
                    <h3 className="min-w-0 text-[18px] font-black leading-[1.14] tracking-[0] text-white">
                      {stat.value}
                    </h3>
                    <p className="min-w-0 overflow-hidden text-[13px] font-medium leading-[1.45] text-[#D8E6F5]/70 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {stat.description}
                    </p>
                  </div>
                  {stat.highlight ? (
                    <p className="min-w-0 overflow-hidden border-t border-white/12 pt-2.5 text-[13px] font-extrabold leading-snug text-[#EAF3FF]/90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {stat.highlight}
                    </p>
                  ) : null}
                </div>

                <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full border border-white/12 opacity-35 transition-transform duration-500 group-hover:scale-125" />
                {idx === 0 ? (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#B8643E]/0 via-[#B8643E]/70 to-[#B8643E]/0" />
                ) : null}
              </div>
            ))}
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/[0.14] bg-[#222E3E] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.12)] md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-center md:gap-7 md:p-6">
            <h3 className="min-w-0 text-[22px] font-black leading-[1.12] tracking-[0] text-white md:text-[25px]">
              {antiTitle}
            </h3>
            <p className="min-w-0 text-[14px] font-semibold leading-[1.55] text-white/68 md:text-[15px]">
              {antiText}
            </p>
          </div>

          {/* CTA BOTTOM */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-2">
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
