'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactForm from './ContactForm';
import Logo from '../common/Logo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

const ContactModal = ({ isOpen, onClose, onOpenChat }: ContactModalProps) => {
  const t = useTranslations('ContactModal');
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let renderTimer: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      renderTimer = setTimeout(() => setIsRendered(true), 0);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = '';
      return () => {
        clearTimeout(timer);
        if (renderTimer) {
          clearTimeout(renderTimer);
        }
      };
    }
    return () => {
      if (renderTimer) {
        clearTimeout(renderTimer);
      }
    };
  }, [isOpen]);

  if (!isRendered && !isOpen) return null;

  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/message/27UOBFWB7UYCN1';
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/PixelRing_bot';

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0E1A2B]/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container: Two-Column Layout */}
      <div 
        className={`relative w-full max-w-4xl h-auto max-h-[96vh] sm:h-[580px] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[32px] sm:rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] overflow-y-auto sm:overflow-hidden transition-all duration-500 ease-out transform flex flex-col sm:flex-row ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
      >
        {/* Left Column: Sidebar */}
        <div className="w-full sm:w-[320px] bg-[#F7F1E8]/30 backdrop-blur-xl border-b sm:border-b-0 sm:border-r border-black/5 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
          {/* Logo & Brand + Service Pill (Hidden on mobile) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Logo className="scale-75 origin-left" />
            </div>
            <p className="hidden sm:block text-[13px] text-[#72665D] leading-relaxed">
              {t('sidebar_desc')}
            </p>
          </div>

          {/* Interaction Stack */}
          <div className="flex flex-col gap-3 sm:gap-2">
            {/* Chat Button - Always primary */}
            <div className="relative flex-1 sm:w-full">
              {/* Badge */}
              <div className="absolute -top-3 right-0 sm:-right-2 px-2 py-0.5 sm:py-1 bg-gradient-to-r from-[#B8643E] to-[#D47E55] text-white text-[9px] sm:text-[10px] font-black tracking-[1px] uppercase rounded-[6px] sm:rounded-[8px] shadow-lg border border-white/20 rotate-3 sm:rotate-6 z-10 whitespace-nowrap flex items-center gap-1 shadow-[#B8643E]/30 pointer-events-none">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                TOP
              </div>
              <button
                onClick={() => {
                  onOpenChat();
                  onClose();
                }}
                className="w-full h-12 sm:h-auto px-5 py-3 sm:py-3.5 bg-[#0E1A2B] hover:bg-[#1a2e47] text-white rounded-2xl font-bold flex items-center justify-center sm:justify-start gap-3 transition-all active:scale-[0.98]"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-[14px]">{t('chat_on_site')}</span>
              </button>
            </div>

            {/* Other Channels: Icons on mobile, Buttons on desktop */}
            <div className="flex flex-row sm:flex-col gap-2">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:w-full h-12 sm:h-auto px-2 sm:px-5 py-3 bg-white/40 hover:bg-white/60 text-[#0E1A2B] border border-black/5 rounded-2xl font-bold flex items-center justify-center sm:justify-start gap-3 transition-all active:scale-[0.98]"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-[#25D366]/10 text-[#25D366] rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="hidden sm:inline text-[14px]">WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:w-full h-12 sm:h-auto px-2 sm:px-5 py-3 bg-white/40 hover:bg-white/60 text-[#0E1A2B] border border-black/5 rounded-2xl font-bold flex items-center justify-center sm:justify-start gap-3 transition-all active:scale-[0.98]"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-[#0088cc]/10 text-[#0088cc] rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className="hidden sm:inline text-[14px]">Telegram</span>
              </a>

              {/* Email */}
              <a
                href="mailto:support@pixelring.de"
                className="flex-1 sm:w-full h-12 sm:h-auto px-2 sm:px-5 py-3 bg-white/40 hover:bg-white/60 text-[#0E1A2B] border border-black/5 rounded-2xl font-bold flex items-center justify-center sm:justify-start gap-3 transition-all active:scale-[0.98]"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-black/5 text-[#72665D] rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="hidden sm:inline text-[14px]">{t('email')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Form Area */}
        <div className="flex-1 p-4 sm:p-8 bg-white/95 flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0E1A2B] tracking-tight leading-none">
              {t('form_title')}
            </h2>
          </div>

          <ContactForm />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-[#0E1A2B] transition-all duration-300 z-50"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
