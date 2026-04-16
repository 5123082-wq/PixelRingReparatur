'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ContactForm from '../common/ContactForm';

type FooterCtaContent = {
  title?: string | null;
  subtitle?: string | null;
  connectLabel?: string | null;
  formTitle?: string | null;
  formSubtitle?: string | null;
};

const FooterCTA = ({ content }: { content?: FooterCtaContent | null }) => {
  const t = useTranslations('FooterCTA');

  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/message/27UOBFWB7UYCN1';
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/PixelRing_bot';

  return (
    <section className="w-full bg-[#0D1B2A] py-24 px-6 relative overflow-hidden">
      {/* Technical Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', 
          backgroundSize: '48px 48px' 
        }} 
      />
      
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B8643E]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-stretch">
          
          {/* Left Column: Text & Messengers */}
          <div className="flex flex-col justify-between gap-12 lg:gap-0 lg:py-6">
            <div className="flex flex-col gap-6 ltr:text-left rtl:text-right">
              <h2 className="text-[36px] md:text-[44px] xl:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight">
                {content?.title ?? t('title')}
              </h2>
              <p className="text-[17px] md:text-[19px] text-white/70 max-w-xl leading-relaxed">
                {content?.subtitle ?? t('subtitle')}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:gap-4 w-full">
              <p className="text-[13px] font-bold text-white/40 uppercase tracking-[2px] ltr:text-left rtl:text-right mb-1">
                {content?.connectLabel ?? t('connect_label')}
              </p>
              <div className="flex flex-col gap-4 w-full">
                {/* Live-Chat */}
                <button
                  onClick={() => window.dispatchEvent(new Event('openChat'))}
                  className="w-full relative flex items-center gap-4 px-5 sm:px-6 py-3.5 md:py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-[20px] transition-all duration-300 group"
                >
                  <div className="absolute -top-3 right-3 px-2 py-1 bg-gradient-to-r from-[#B8643E] to-[#D47E55] text-white text-[10px] font-black tracking-[1px] uppercase rounded-[8px] shadow-lg border border-white/20 rotate-6 z-10 whitespace-nowrap flex items-center gap-1 shadow-[#B8643E]/30 pointer-events-none">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    TOP
                  </div>
                  <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10 text-white group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="text-[16px] md:text-[18px] text-white font-bold leading-none truncate">Live-Chat</span>
                </button>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-4 px-5 sm:px-6 py-3.5 md:py-4 bg-white/5 hover:bg-[#25D366]/10 border border-white/10 hover:border-[#25D366]/40 rounded-[20px] transition-all duration-300 group"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="text-[16px] md:text-[18px] text-white font-bold leading-none truncate">WhatsApp</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-4 px-5 sm:px-6 py-3.5 md:py-4 bg-white/5 hover:bg-[#0088cc]/10 border border-white/10 hover:border-[#0088cc]/40 rounded-[20px] transition-all duration-300 group"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-[#0088cc]/10 text-[#0088cc] group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <span className="text-[16px] md:text-[18px] text-white font-bold leading-none truncate">Telegram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group/card">
            {/* Glossy accent decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8643E]/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-500 group-hover/card:bg-[#B8643E]/20" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="flex flex-col gap-8 relative z-10">
              <div className="flex flex-col gap-3 ltr:text-left rtl:text-right">
                <h3 className="text-[28px] md:text-[32px] font-bold text-white tracking-tight leading-tight">
                  {content?.formTitle ?? t('form_title')}
                </h3>
                <p className="text-[16px] text-white/60 leading-relaxed max-w-[340px]">
                  {content?.formSubtitle ?? t('form_subtitle')}
                </p>
              </div>
              
              <ContactForm variant="dark" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
