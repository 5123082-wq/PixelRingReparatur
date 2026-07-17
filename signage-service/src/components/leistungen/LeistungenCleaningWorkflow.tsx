'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenProblemDrawer from './LeistungenProblemDrawer';

type CleaningCase = {
  id: string;
  tag: string;
  title: string;
  cardText: string;
  reassuringText: string;
  prefillMessage: string;
};

type LeistungenCleaningWorkflowProps = {
  cases: CleaningCase[];
  title: string;
  intro: string;
  locale: string;
  closeLabel?: string;
  formTitle?: string;
};

const WORKFLOW_LABELS: Record<
  string,
  {
    eyebrow: string;
    fallbackCta: string;
    fallbackTitle: string;
    fallbackText: string;
    selectCta: string;
    previous: string;
    next: string;
    drawerServiceInfoLabel: string;
    drawerReassuringLabel: string;
    drawerFormIntro: string;
    closeLabel: string;
  }
> = {
  de: {
    eyebrow: 'Reinigungsfall erkennen',
    fallbackCta: 'Foto oder eigenen Fall senden',
    fallbackTitle: 'Nicht sicher, welcher Reinigungsfall passt?',
    fallbackText:
      'Senden Sie Fotos der Außenwerbung und beschreiben Sie kurz, was sichtbar stört.',
    selectCta: 'Diesen Fall anfragen',
    previous: 'Vorherige Reinigungsfälle',
    next: 'Weitere Reinigungsfälle',
    drawerServiceInfoLabel: 'PixelRing Reinigungs-Check',
    drawerReassuringLabel: 'Einschätzung & nächster Schritt',
    drawerFormIntro:
      'Geben Sie Ihre Kontaktdaten an, damit PixelRing die Reinigungsanfrage mit dem ausgewählten Fall vorbereiten kann.',
    closeLabel: 'Schließen',
  },
  en: {
    eyebrow: 'Recognize the cleaning case',
    fallbackCta: 'Send photos or your own case',
    fallbackTitle: 'Not sure which cleaning case fits?',
    fallbackText:
      'Send photos of the outdoor advertising and briefly describe what is visibly bothering you.',
    selectCta: 'Request this case',
    previous: 'Previous cleaning cases',
    next: 'More cleaning cases',
    drawerServiceInfoLabel: 'PixelRing cleaning check',
    drawerReassuringLabel: 'Assessment & next step',
    drawerFormIntro:
      'Enter your contact details so PixelRing can prepare the cleaning request with the selected case.',
    closeLabel: 'Close',
  },
  ru: {
    eyebrow: 'Выберите случай очистки',
    fallbackCta: 'Отправить фото или свой случай',
    fallbackTitle: 'Не уверены, какой случай очистки подходит?',
    fallbackText:
      'Отправьте фото наружной рекламы и коротко опишите, что визуально мешает.',
    selectCta: 'Запросить этот случай',
    previous: 'Предыдущие случаи очистки',
    next: 'Другие случаи очистки',
    drawerServiceInfoLabel: 'Проверка очистки PixelRing',
    drawerReassuringLabel: 'Оценка и следующий шаг',
    drawerFormIntro:
      'Укажите контактные данные, чтобы команда PixelRing подготовила заявку на очистку с выбранным случаем.',
    closeLabel: 'Закрыть',
  },
  tr: {
    eyebrow: 'Temizlik durumunu belirleyin',
    fallbackCta: 'Fotoğraf veya kendi durumunuzu gönderin',
    fallbackTitle: 'Hangi temizlik durumu uygun emin değil misiniz?',
    fallbackText:
      'Dış reklamın fotoğraflarını gönderin ve görünürde neyin rahatsız ettiğini kısaca açıklayın.',
    selectCta: 'Bu durum için talep oluştur',
    previous: 'Önceki temizlik durumları',
    next: 'Diğer temizlik durumları',
    drawerServiceInfoLabel: 'PixelRing temizlik kontrolü',
    drawerReassuringLabel: 'Değerlendirme ve sonraki adım',
    drawerFormIntro:
      "PixelRing'in seçilen duruma göre temizlik talebini hazırlayabilmesi için iletişim bilgilerinizi girin.",
    closeLabel: 'Kapat',
  },
  pl: {
    eyebrow: 'Rozpoznaj przypadek czyszczenia',
    fallbackCta: 'Wyślij zdjęcie albo własny przypadek',
    fallbackTitle: 'Nie masz pewności, który przypadek czyszczenia pasuje?',
    fallbackText:
      'Wyślij zdjęcia reklamy zewnętrznej i krótko opisz, co wizualnie przeszkadza.',
    selectCta: 'Zapytaj o ten przypadek',
    previous: 'Poprzednie przypadki czyszczenia',
    next: 'Kolejne przypadki czyszczenia',
    drawerServiceInfoLabel: 'Kontrola czyszczenia PixelRing',
    drawerReassuringLabel: 'Ocena i kolejny krok',
    drawerFormIntro:
      'Podaj dane kontaktowe, aby PixelRing mogło przygotować zapytanie o czyszczenie z wybranym przypadkiem.',
    closeLabel: 'Zamknij',
  },
  ar: {
    eyebrow: 'تحديد حالة التنظيف',
    fallbackCta: 'إرسال صور أو حالة خاصة',
    fallbackTitle: 'لست متأكدا أي حالة تنظيف تناسب موقعك؟',
    fallbackText:
      'أرسل صور الإعلان الخارجي واكتب باختصار ما يبدو مزعجا بصريا.',
    selectCta: 'طلب هذه الحالة',
    previous: 'حالات التنظيف السابقة',
    next: 'حالات تنظيف أخرى',
    drawerServiceInfoLabel: 'فحص التنظيف من PixelRing',
    drawerReassuringLabel: 'التقييم والخطوة التالية',
    drawerFormIntro:
      'أدخل بيانات التواصل لكي تجهز PixelRing طلب التنظيف حسب الحالة المختارة.',
    closeLabel: 'إغلاق',
  },
};

const CLEANING_VISUALS: Record<
  string,
  { image: string; repairedImage?: string }
> = {
  awning: {
    image: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-awning-before.png',
    repairedImage: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-awning-after.png',
  },
  lightbox: {
    image: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-lightbox-before-tooth-sign-v2.jpg',
    repairedImage: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-lightbox-after-tooth-sign-v2.jpg',
  },
  letters: {
    image: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-letters-before-dirty-sign-v2.jpg',
    repairedImage: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-letters-after-clean-sign-v2.jpg',
  },
  inside: {
    image: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-inside-menu-box-before-open-dirty-v2.jpg',
    repairedImage: '/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-inside-menu-box-after-clean-v2.jpg',
  },

  custom: {
    image: '/images/leistungen/werbeanlagen-reinigung/werbeanlagen-reinigung-markise-service.webp',
  },
};

const getPreviewText = (text: string) => {
  const [firstSentence] = text.split(/(?<=[.!?])\s+/);
  return firstSentence || text;
};

export default function LeistungenCleaningWorkflow({
  cases,
  title,
  intro,
  locale,
  closeLabel,
  formTitle = 'Reinigung anfragen',
}: LeistungenCleaningWorkflowProps) {
  const [activeCase, setActiveCase] = useState<CleaningCase | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previewedCaseId, setPreviewedCaseId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const labels = WORKFLOW_LABELS[locale] ?? WORKFLOW_LABELS.de;
  const fallbackCase = cases.find((item) => item.id === 'custom');
  const regularCases = cases.filter((item) => item.id !== 'custom');

  if (cases.length === 0) {
    return null;
  }

  const openCase = (item: CleaningCase) => {
    setActiveCase(item);
    setIsDrawerOpen(true);
  };

  const scrollRail = (direction: 'previous' | 'next') => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const scrollDistance = Math.min(rail.clientWidth * 0.86, 760);
    rail.scrollBy({
      left: direction === 'next' ? scrollDistance : -scrollDistance,
      behavior: 'smooth',
    });
  };

  return (
    <section id="cleaning-cases" className="scroll-mt-32 overflow-hidden bg-[#F5F5F7] py-16 sm:py-24">
      <div className="pr-site-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl text-start">
            <SectionEyebrow className="mb-3">{labels.eyebrow}</SectionEyebrow>
            <h2 className="mt-2 max-w-full break-words text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] [overflow-wrap:anywhere] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] font-semibold leading-8 text-[#526174]">
              {intro}
            </p>
          </div>

          <div className="flex gap-3 self-start lg:self-end">
            <button
              type="button"
              onClick={() => scrollRail('previous')}
              aria-label={labels.previous}
              className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#B8643E] text-[#B8643E] transition-all duration-300 hover:bg-[#B8643E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
            >
              <svg
                className="h-6 w-6 transition-transform group-active:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollRail('next')}
              aria-label={labels.next}
              className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#B8643E] text-[#B8643E] transition-all duration-300 hover:bg-[#B8643E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
            >
              <svg
                className="h-6 w-6 transition-transform group-active:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-12 w-screen overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInlineEnd: '1.5rem',
          paddingInlineStart: 'max(1rem, calc((100vw - 80rem) / 2 + 1rem))',
        }}
      >
        <div className="flex w-max snap-x snap-mandatory gap-5 lg:gap-6">
          {regularCases.map((item) => {
            const visual = CLEANING_VISUALS[item.id] ?? CLEANING_VISUALS.custom;
            const showCleanPreview = previewedCaseId === item.id;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => openCase(item)}
                onBlur={() => setPreviewedCaseId(null)}
                onFocus={() => setPreviewedCaseId(item.id)}
                onMouseEnter={() => setPreviewedCaseId(item.id)}
                onMouseLeave={() => setPreviewedCaseId(null)}
                onMouseMove={() => setPreviewedCaseId(item.id)}
                onPointerDown={() => setPreviewedCaseId(item.id)}
                onPointerEnter={() => setPreviewedCaseId(item.id)}
                onPointerLeave={() => setPreviewedCaseId(null)}
                onPointerMove={() => setPreviewedCaseId(item.id)}
                aria-label={`${labels.selectCta}: ${item.title}`}
                className="group relative min-h-[500px] w-[82vw] shrink-0 snap-start cursor-pointer overflow-hidden rounded-[28px] border border-white/35 bg-[#101827] p-0 text-start shadow-[0_10px_26px_rgba(0,0,0,0.055)] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] sm:w-[390px] lg:w-[392px] xl:w-[414px]"
              >
                <div className="absolute inset-x-0 top-0 h-[90%] overflow-hidden">
                  <Image
                    src={visual.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 414px, (min-width: 1024px) 392px, (min-width: 640px) 390px, 82vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  {visual.repairedImage ? (
                    <Image
                      src={visual.repairedImage}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 414px, (min-width: 1024px) 392px, (min-width: 640px) 390px, 82vw"
                      className={`object-cover transition duration-700 ${showCleanPreview ? 'scale-[1.04] opacity-100' : 'opacity-0'}`}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0E1A2B]/12 via-transparent to-[#0E1A2B]/18" />
                </div>

                <div className="absolute left-5 top-5 z-20 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8F4C2F] shadow-sm rtl:left-auto rtl:right-5">
                  {item.tag}
                </div>

                <div className="absolute -inset-x-px -bottom-px z-10 flex min-h-[252px] flex-col justify-end px-6 pb-6 pt-16 sm:px-8 sm:pb-7 sm:pt-20">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/88 via-white/62 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,#000_0%,#000_66%,rgba(0,0,0,0)_100%)]" />
                  <div className="relative z-10">
                    <h3 className="break-words text-[30px] font-extrabold leading-[1.04] tracking-[0] text-[#0E1A2B] [overflow-wrap:anywhere] sm:text-[34px]">
                      {item.title}
                    </h3>
                    <p className="mt-4 line-clamp-2 break-words pe-14 text-[17px] font-semibold leading-7 text-[#4E5A5A] [overflow-wrap:anywhere] sm:pe-16">
                      {getPreviewText(item.cardText)}
                    </p>
                    <p className="sr-only">{item.cardText}</p>
                  </div>
                </div>

                <span
                  className="absolute bottom-5 end-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#B8643E] text-[24px] font-black leading-none text-white shadow-[0_14px_28px_rgba(13,27,42,0.18)] transition duration-300 group-hover:bg-[#A65835]"
                  aria-hidden="true"
                >
                  →
                </span>
                <span className="sr-only">{labels.selectCta}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pr-site-container">
        {fallbackCase ? (
          <div className="mt-8 rounded-[24px] border border-[#D9C7BA] bg-white px-6 py-6 shadow-[0_16px_45px_rgba(13,27,42,0.05)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-3xl text-start">
              <h3 className="text-[22px] font-extrabold leading-tight tracking-[0] text-[#0E1A2B] sm:text-[28px]">
                {labels.fallbackTitle}
              </h3>
              <p className="mt-2 text-[15px] font-semibold leading-7 text-[#526174]">
                {labels.fallbackText}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCase(fallbackCase)}
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#B8643E] px-6 py-3 text-[14px] font-black text-white shadow-[0_16px_34px_rgba(184,100,62,0.22)] transition hover:bg-[#A65835] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] lg:mt-0 lg:shrink-0"
            >
              {labels.fallbackCta}
            </button>
          </div>
        ) : null}
      </div>

      <LeistungenProblemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={activeCase?.title || ''}
        reassuringText={activeCase?.reassuringText || ''}
        initialMessage={activeCase?.prefillMessage || ''}
        initialIssueType="Cleaning"
        closeLabel={closeLabel ?? labels.closeLabel}
        serviceInfoLabel={labels.drawerServiceInfoLabel}
        formTitle={formTitle}
        reassuringLabel={labels.drawerReassuringLabel}
        formIntro={labels.drawerFormIntro}
      />
    </section>
  );
}
