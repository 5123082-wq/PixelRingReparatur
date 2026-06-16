'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';
import SectionEyebrow from '../common/SectionEyebrow';
import { SITE_CONFIG } from '@/lib/site-config';

type IntakeMethodId = 'text' | 'photo' | 'voice' | 'messenger' | 'email';

type IntakeSectionContent = {
  title?: string | null;
  description?: string | null;
  methods?: Array<{
    id: IntakeMethodId;
    title?: string | null;
    label?: string | null;
  }> | null;
};

const IntakeSection = ({ content }: { content?: IntakeSectionContent | null }) => {
  const t = useTranslations('Intake');
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [discountInfoOpen, setDiscountInfoOpen] = useState(false);
  const cardClassName =
    'group grid min-h-[244px] grid-rows-[48px_minmax(64px,auto)_minmax(72px,1fr)_auto] rounded-[22px] border border-[#E7DDD3] bg-[#FAF7F2] p-5 text-start shadow-sm shadow-[#0E1A2B]/5 transition-all duration-300 hover:border-[#B8643E]/45 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]';
  const cardIconClassName =
    'flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EED8C8] text-[#B8643E] transition-colors group-hover:bg-[#B8643E] group-hover:text-white';
  const staticCardClassName =
    'grid min-h-[244px] grid-rows-[48px_minmax(64px,auto)_minmax(72px,1fr)_auto] rounded-[22px] border border-[#E7DDD3] bg-[#FAF7F2] p-5 text-start shadow-sm shadow-[#0E1A2B]/5 transition-all duration-300';
  const staticCardIconClassName =
    'flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EED8C8] text-[#B8643E]';
  const staticCardTitleClassName =
    'self-start text-[20px] font-black leading-[1.18] tracking-tight text-[#0E1A2B]';
  const cardTitleClassName =
    'self-start text-[20px] font-black leading-[1.18] tracking-tight text-[#0E1A2B] transition-colors group-hover:text-[#B8643E]';
  const cardBodyClassName = 'mt-3 text-[14px] leading-relaxed text-[#72665D]';

  const closeDiscountInfoIfFocusLeaves = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (!nextTarget || !event.currentTarget.contains(nextTarget as Node)) {
      setDiscountInfoOpen(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes intake-discount-badge-pulse {
            0%, 100% { scale: 1; opacity: 1; }
            50% { scale: 1.035; opacity: 0.96; }
          }
        `}
      </style>
      <section className="w-full border-y border-[#E7DDD3] bg-white px-6 py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="flex max-w-2xl flex-col gap-4 text-start">
            <SectionEyebrow>{t('eyebrow')}</SectionEyebrow>
            <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[42px]">
              {content?.title || t('title')}
            </h2>
            <p className="max-w-xl text-[15px] leading-[1.55] text-[#72665D] md:text-[16px]">
              {content?.description || t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))]">
            <div className="relative md:col-span-2 lg:col-span-1">
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="group grid min-h-[244px] w-full grid-rows-[48px_minmax(64px,auto)_minmax(72px,1fr)_auto] rounded-[22px] border border-[#163052]/15 bg-[#0E1A2B] p-5 text-start text-white shadow-lg shadow-[#0E1A2B]/10 transition-all duration-300 hover:border-[#B8643E]/50 hover:shadow-xl hover:shadow-[#0E1A2B]/14 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]"
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent 42%)',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="h-7" aria-hidden="true" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/45">
                    {t('chat_badge')}
                  </span>
                </div>

                <h3 className="flex items-start gap-2 self-start text-[20px] font-black leading-[1.18] tracking-tight text-white">
                    <svg className="h-5 w-5 shrink-0 text-[#F0A47F] md:h-6 md:w-6 lg:h-5 lg:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {t('chat_title')}
                </h3>
                <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/68 lg:text-[13px]">
                  {t('chat_desc')}
                </p>

                <div className="mt-3 flex items-center justify-end gap-3">
                  <span className="inline-flex h-10 min-w-16 shrink-0 items-center justify-center rounded-full bg-[#B8643E] px-5 text-white transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                    <svg className="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </button>

              <div
                className="absolute -bottom-6 left-5 z-20 rtl:left-auto rtl:right-5"
                onMouseEnter={() => setDiscountInfoOpen(true)}
                onMouseLeave={() => setDiscountInfoOpen(false)}
                onFocusCapture={() => setDiscountInfoOpen(true)}
                onBlurCapture={closeDiscountInfoIfFocusLeaves}
              >
                <button
                  type="button"
                  onClick={() => setDiscountInfoOpen((isOpen) => !isOpen)}
                  className="inline-flex min-h-16 rotate-[-4deg] [animation:intake-discount-badge-pulse_2.8s_ease-in-out_infinite] items-center gap-2 rounded-[16px] border border-white/20 bg-[#B8643E] px-4 py-3 text-white shadow-xl shadow-[#B8643E]/30 transition-transform hover:[animation-play-state:paused] hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E] focus-visible:ring-offset-2 focus:[animation-play-state:paused] rtl:rotate-[4deg]"
                  aria-label={`${t('chat_discount')} ${t('chat_discount_context')}`}
                  aria-describedby={discountInfoOpen ? 'chat-discount-tooltip' : undefined}
                >
                  <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.05 3.23a1 1 0 0 0 .95.69h3.4c.97 0 1.37 1.24.59 1.81l-2.75 2a1 1 0 0 0-.36 1.12l1.05 3.23c.3.92-.76 1.69-1.54 1.12l-2.75-2a1 1 0 0 0-1.18 0l-2.75 2c-.78.57-1.84-.2-1.54-1.12l1.05-3.23a1 1 0 0 0-.36-1.12l-2.75-2c-.78-.57-.38-1.81.59-1.81h3.4a1 1 0 0 0 .95-.69l1.05-3.23Z" />
                  </svg>
                  <span className="flex flex-col leading-none">
                    <span className="text-[12px] font-black uppercase tracking-[0.08em]">
                      {t('chat_discount')}
                    </span>
                    <span className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/80">
                      {t('chat_discount_context')}
                    </span>
                  </span>
                </button>

                {discountInfoOpen ? (
                  <div
                    id="chat-discount-tooltip"
                    role="tooltip"
                    className="absolute left-0 top-[calc(100%+10px)] w-[280px] rounded-[18px] border border-[#E7DDD3] bg-white p-4 text-start text-[14px] font-bold leading-6 text-[#0E1A2B] shadow-2xl shadow-[#0E1A2B]/16 sm:left-[calc(100%+14px)] sm:top-1/2 sm:-translate-y-1/2 rtl:left-auto rtl:right-0 sm:rtl:left-auto sm:rtl:right-[calc(100%+14px)]"
                  >
                    {t('chat_discount_info')}
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={cardClassName}
            >
              <div className={cardIconClassName}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className={cardTitleClassName}>
                {t('form_title')}
              </h3>
              <p className={cardBodyClassName}>
                {t('form_desc')}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-[#B8643E]">
                {t('form_title')}
                <svg className="h-3.5 w-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <div className={staticCardClassName}>
              <div className={staticCardIconClassName}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className={staticCardTitleClassName}>
                {t('messenger_title')}
              </h3>
              <p className={cardBodyClassName}>
                {t('messenger_desc')}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={SITE_CONFIG.messengers.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 px-3 py-2 text-[12px] font-black text-[#159F4D] transition-colors hover:bg-[#25D366]/20"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={SITE_CONFIG.messengers.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-[#0088cc]/20 bg-[#0088cc]/10 px-3 py-2 text-[12px] font-black text-[#0088cc] transition-colors hover:bg-[#0088cc]/20"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </a>
              </div>
            </div>

            <a
              href={`mailto:${SITE_CONFIG.company.email}`}
              className={cardClassName}
            >
              <div className={cardIconClassName}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8.5A2.5 2.5 0 005.5 19h13a2.5 2.5 0 002.5-2.5v-9A2.5 2.5 0 0018.5 5h-13A2.5 2.5 0 003 7.5v9z" />
                </svg>
              </div>
              <h3 className={cardTitleClassName}>
                {t('email_title')}
              </h3>
              <p className={cardBodyClassName}>
                {t('email_desc')}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-[#B8643E]">
                {t('email_cta')}
                <svg className="h-3.5 w-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>

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

export default IntakeSection;
