'use client';

import Image from 'next/image';

import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';

interface LeistungenFooterCTAProps {
  locale: string;
  finalHeadline: string;
  finalText: string;
  requestTitle?: string;
  requestText?: string;
  requestCta?: string;
  serviceIntent?: string;
  initialIssueType?: string;
  initialMessage?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const DEFAULT_TEXTS: Record<string, { requestTitle: string; ctaLabel: string }> = {
  de: {
    requestTitle: 'Starten Sie mit Foto oder Beschreibung',
    ctaLabel: 'Anfrage starten',
  },
  en: {
    requestTitle: 'Start with a photo or description',
    ctaLabel: 'Start request',
  },
  ru: {
    requestTitle: 'Начните с фото или описания',
    ctaLabel: 'Начать заявку',
  },
  tr: {
    requestTitle: 'Fotoğraf veya açıklama ile başlayın',
    ctaLabel: 'Talebi başlat',
  },
  pl: {
    requestTitle: 'Zacznij od zdjęcia albo opisu',
    ctaLabel: 'Rozpocznij zapytanie',
  },
  ar: {
    requestTitle: 'ابدأ بصورة أو وصف',
    ctaLabel: 'بدء الطلب',
  },
};

export default function LeistungenFooterCTA({
  locale,
  finalHeadline,
  finalText,
  requestTitle,
  requestText,
  requestCta,
  serviceIntent = 'leistungen-footer-request',
  initialIssueType,
  initialMessage,
  imageSrc = '/images/leistungen/repair-hero/hero-sign-repair-01.jpg',
  imageAlt,
}: LeistungenFooterCTAProps) {
  const texts = DEFAULT_TEXTS[locale] || DEFAULT_TEXTS.de;
  const resolvedRequestTitle = requestTitle ?? texts.requestTitle;
  const resolvedRequestText = requestText ?? finalText;
  const resolvedRequestCta = requestCta ?? texts.ctaLabel;

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="pr-site-container">
        <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
          {finalHeadline}
        </h2>

        <div className="mt-8 overflow-hidden rounded-[30px] bg-[#101112] shadow-[0_24px_70px_rgba(8,24,39,0.18)] sm:rounded-[36px]">
          <div className="grid min-h-[476px] lg:grid-cols-[0.45fr_0.55fr]">
            <div className="relative z-10 flex min-w-0 flex-col justify-center px-6 py-8 text-start text-white sm:px-10 lg:px-16 lg:py-12">
              <h3 className="max-w-xl text-[30px] font-extrabold leading-[1.08] tracking-[0] sm:text-[44px]">
                {resolvedRequestTitle}
              </h3>
              <p className="mt-5 max-w-md text-[16px] font-semibold leading-8 text-white/72">
                {resolvedRequestText}
              </p>
              <div className="mt-7">
                <LeistungenRequestButton
                  label={resolvedRequestCta}
                  serviceIntent={serviceIntent}
                  initialIssueType={initialIssueType}
                  initialMessage={initialMessage}
                />
              </div>
            </div>

            <div className="relative min-h-[272px] overflow-hidden lg:min-h-full">
              <Image
                src={imageSrc}
                alt={imageAlt ?? resolvedRequestTitle}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[58%_50%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#101112] lg:via-[#101112]/20 lg:to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
