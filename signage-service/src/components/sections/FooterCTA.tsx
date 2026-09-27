'use client';

import { useLocale, useTranslations } from 'next-intl';
import ContactForm from '../common/ContactForm';
import { SITE_CONFIG } from '@/lib/site-config';

type FooterCtaContent = {
  title?: string | null;
  subtitle?: string | null;
  connectLabel?: string | null;
  formTitle?: string | null;
  formSubtitle?: string | null;
};

const CHAT_LABELS: Record<string, string> = {
  de: 'KI-Chat', en: 'AI chat', ru: 'Чат с ИИ',
  tr: 'Yapay zekâ sohbeti', pl: 'Czat z AI', ar: 'دردشة الذكاء الاصطناعي',
};

export default function FooterCTA({ content }: { content?: FooterCtaContent | null }) {
  const t = useTranslations('FooterCTA');
  const locale = useLocale();
  const formSubtitle = content?.formSubtitle?.trim();
  const customFormSubtitle = formSubtitle && formSubtitle !== t('form_subtitle') ? formSubtitle : null;
  const contactClass = 'inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]';

  return (
    <section id="kontakt" aria-labelledby="home-contact-title" className="scroll-mt-24 bg-[#0E1A2B] py-12 sm:py-16">
      <div className="pr-site-container grid items-start gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-14">
        <div className="text-start">
          <h2 id="home-contact-title" className="text-[32px] font-extrabold leading-[1.1] text-white md:text-[42px]">
            {content?.title ?? t('title')}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-[17px]">
            {content?.subtitle ?? t('subtitle')}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => window.dispatchEvent(new Event('openChat'))} className={contactClass}>
              <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              {CHAT_LABELS[locale] ?? CHAT_LABELS.de}
            </button>
            <a href={SITE_CONFIG.messengers.whatsapp} target="_blank" rel="noopener noreferrer" className={contactClass}>
              <svg aria-hidden="true" className="size-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>WhatsApp
            </a>
            <a href={SITE_CONFIG.messengers.telegram} target="_blank" rel="noopener noreferrer" className={contactClass}>
              <svg aria-hidden="true" className="size-4 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>Telegram
            </a>
          </div>
          <a href={`mailto:${SITE_CONFIG.company.email}`} className="mt-3 inline-flex min-h-11 items-center text-sm text-white/75 underline underline-offset-4 hover:text-white">{SITE_CONFIG.company.email}</a>
        </div>
        <div className="min-w-0 rounded-[24px] border border-white/15 bg-white/5 p-5 sm:p-8 [&_button[type=submit]]:bg-[#B8643E] [&_button[type=submit]]:text-[#FFFDF9] [&_button[type=submit]:hover]:bg-[#A65835]">
          <h3 className="text-2xl font-bold leading-tight text-white">{content?.formTitle ?? t('form_title')}</h3>
          {customFormSubtitle && <p className="mt-3 text-sm leading-relaxed text-white/75">{customFormSubtitle}</p>}
          <div className="mt-6">
          <ContactForm variant="dark" layout="two-column" />
          </div>
        </div>
      </div>
    </section>
  );
}
