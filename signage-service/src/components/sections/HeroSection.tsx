'use client';

import { useState } from 'react';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';
import CmsImage from '../common/CmsImage';
import { SITE_CONFIG } from '@/lib/site-config';
import type { HomeHeroCmsContent } from '@/lib/cms/pages';

export default function HeroSection({ content }: { content: HomeHeroCmsContent }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <section aria-labelledby="home-heading" className="overflow-hidden bg-[#EEF3FB] py-10 sm:py-12 lg:py-14">
        <div className="pr-site-container grid items-center gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="min-w-0 text-start">
            <h1 id="home-heading" className="max-w-[650px] text-[36px] font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-[44px] xl:text-[56px] rtl:leading-[1.3]">
              {content.titlePrefix ? <>{content.titlePrefix}{' '}</> : null}
              <span className="text-[#B8643E]">{content.titleAccent}</span>{' '}{content.titleSuffix}
            </h1>
            <p className="mt-5 max-w-[540px] text-base leading-relaxed text-[#4A5568] sm:text-lg">{content.intro}</p>
            <div className="mt-7 flex max-w-full items-center gap-3">
              <button id="hero-cta-primary" type="button" onClick={() => setModalOpen(true)} className="inline-flex min-h-12 min-w-0 items-center justify-center rounded-full bg-[#B8643E] px-5 py-3 text-base font-semibold text-[#FFFDF9] shadow-lg shadow-[#B8643E]/20 transition-colors hover:bg-[#A65835] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] sm:px-6">
                {content.ctaPrimary}
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <a href={SITE_CONFIG.messengers.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex size-12 items-center justify-center rounded-full border border-[#D1D9E6] bg-white transition-colors hover:bg-[#F5F7FA] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]">
                  <svg aria-hidden="true" className="size-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <a href={SITE_CONFIG.messengers.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex size-12 items-center justify-center rounded-full border border-[#D1D9E6] bg-white transition-colors hover:bg-[#F5F7FA] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]">
                  <svg aria-hidden="true" className="size-5 text-[#0088CC]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex min-w-0 justify-center px-3 pb-7 pt-3 lg:justify-end">
            <div className="relative w-full max-w-[500px]">
              <div className="relative aspect-[5/4] rotate-[3deg] overflow-hidden rounded-[28px] bg-[#DCE3EE] shadow-xl shadow-[#0E1A2B]/10">
                <CmsImage src={content.assetUrl || '/images/hero-neon.jpg'} fallbackSrc={content.fallbackSrc || '/images/hero-neon.jpg'} alt={content.imageAlt || ''} fill sizes="(min-width: 1280px) 500px, (min-width: 1024px) 44vw, (min-width: 640px) 500px, 90vw" className="object-cover" priority />
              </div>
              {content.responseBadge ? (
                <div className="absolute -bottom-5 start-0 rounded-2xl bg-white px-5 py-4 text-start shadow-lg shadow-[#0E1A2B]/10 sm:-start-3 sm:rotate-[-3deg]">
                  <p dir="ltr" className="text-[24px] font-extrabold leading-none text-[#B8643E]">24h</p>
                  <p className="mt-1 max-w-[140px] text-[13px] leading-snug text-[#4A5568]">{content.responseBadge}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onOpenChat={() => setChatOpen(true)} />
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
