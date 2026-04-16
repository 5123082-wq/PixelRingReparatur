'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';

type HomeHeroContent = {
  titlePrefix?: string | null;
  titleAccent?: string | null;
  titleSuffix?: string | null;
  intro?: string | null;
  ctaPrimary?: string | null;
  trustBadge?: string | null;
  responseBadge?: string | null;
  assetUrl?: string | null;
};

const HeroSection = ({ content }: { content?: HomeHeroContent | null }) => {
  const t = useTranslations('HomePage');
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/message/27UOBFWB7UYCN1';
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/PixelRing_bot';
  const titlePrefix = content?.titlePrefix ?? t('hero_title_prefix');
  const titleAccent = content?.titleAccent ?? t('hero_title_accent');
  const titleSuffix = content?.titleSuffix ?? t('hero_title_suffix');
  const intro = content?.intro ?? t('description');
  const ctaPrimary = content?.ctaPrimary ?? t('cta_primary');
  const trustBadge = content?.trustBadge ?? t('trust_badge');
  const responseBadge = content?.responseBadge ?? t('badge_label');
  const heroImage =
    content?.assetUrl && content.assetUrl.trim() ? content.assetUrl : '/images/hero-neon.jpg';

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <section className="relative w-full bg-[#EEF3FB] pt-24 pb-20 overflow-hidden">
        {/* Subtle top-right glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-white/60 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center min-h-[540px]">

            {/* ── LEFT COLUMN ─────────────────────────── */}
            <div className="flex flex-col gap-7">

              {/* Headline */}
              <h1 className="text-[40px] md:text-[48px] xl:text-[56px] leading-[1.1] font-extrabold text-[#0D1B2A] tracking-tight">
                {titlePrefix}{' '}
                <span className="text-[#B8643E]">{titleAccent}</span>
                {' '}{titleSuffix}
              </h1>

              {/* Description */}
              <p className="text-[17px] md:text-[18px] leading-[1.65] text-[#4A5568] max-w-[480px]">
                {intro}
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3">

                {/* Primary CTA */}
                <button
                  id="hero-cta-primary"
                  onClick={() => openModal()}
                  className="px-7 py-4 bg-[#B8643E] hover:bg-[#A65835] text-white text-[16px] font-semibold rounded-full shadow-lg shadow-[#B8643E]/30 transition-all duration-200 active:scale-95"
                >
                  {ctaPrimary}
                </button>

                {/* Messenger icon buttons */}
                <div className="flex items-center gap-2">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-[#D1D9E6] bg-white hover:bg-[#25D366]/10 hover:border-[#25D366]/40 shadow-sm transition-all duration-200"
                  >
                    <svg className="w-[20px] h-[20px] text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>

                  {/* Telegram */}
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-[#D1D9E6] bg-white hover:bg-[#0088cc]/10 hover:border-[#0088cc]/40 shadow-sm transition-all duration-200"
                  >
                    <svg className="w-[20px] h-[20px] text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>

                  {/* Contact form button */}
                  <button
                    id="hero-cta-form"
                    onClick={() => openModal()}
                    aria-label="Contact form"
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-[#D1D9E6] bg-white hover:bg-[#B8643E]/10 hover:border-[#B8643E]/40 shadow-sm transition-all duration-200"
                  >
                    <svg className="w-[18px] h-[18px] text-[#4A5568]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Trust micro-label */}
              <p className="text-[13px] text-[#94A3B8] italic">
                {trustBadge}
              </p>
            </div>

            {/* ── RIGHT COLUMN — tilted image card ──────── */}
            <div className="relative flex justify-center md:justify-end items-center py-8">

              {/* Outer wrapper for the tilt + badge positioning */}
              <div className="relative w-full max-w-[500px]">

                {/* Tilted image card */}
                <div
                  className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-[#B8643E]/15"
                  style={{ transform: 'rotate(3deg)' }}
                >
                  <div className="relative aspect-[4/3.2]">
                    <Image
                      src={heroImage}
                      alt="Neon sign repair — PixelRing"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* subtle dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* 24h badge — outside the card, bottom-left, counter-rotated */}
                <div
                  className="absolute -bottom-6 ltr:-left-6 rtl:-right-6 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-black/10 z-10"
                  style={{ transform: 'rotate(-3deg)' }}
                >
                  <p className="text-[24px] font-extrabold text-[#B8643E] leading-none">24h</p>
                  <p className="text-[13px] text-[#64748B] mt-1 leading-snug max-w-[130px]">
                    {responseBadge}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onOpenChat={() => setChatOpen(true)}
      />
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
};

export default HeroSection;
