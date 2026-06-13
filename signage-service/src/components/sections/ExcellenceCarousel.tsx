'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ExcellenceCmsContent } from '@/lib/cms/pages';
import SectionEyebrow from '../common/SectionEyebrow';

interface ExcellenceCarouselProps {
  content?: ExcellenceCmsContent;
}

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type WorkCardConfig = {
  title: string;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  serviceHref: string;
};

const WORK_CARD_CONFIG: Record<Locale, WorkCardConfig[]> = {
  de: [
    {
      title: 'Werbeanlagen-Montage',
      tag: 'Montage',
      description: 'Fachgerechte Montage großer Werbeanlagen, Fassadenschilder und Standortwerbung.',
      image: '/images/ex-mounting.png',
      imageAlt: 'Montage einer beleuchteten Werbeanlage an einer Glasfassade',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Lichtwerbung-Reparatur',
      tag: 'Reparatur',
      description: 'Instandsetzung von Neon, LED-Technik, Leuchtkästen und sichtbaren Defekten.',
      image: '/images/ex-repair.png',
      imageAlt: 'Reparatur einer klassischen Neon- und Lichtwerbung in der Werkstatt',
      serviceHref: '/leistungen/werbeanlagen-reparatur',
    },
    {
      title: 'Wartung & Audit',
      tag: 'Wartung',
      description: 'Regelmäßige Prüfung, Wartung und Zustandsaufnahme für Werbeanlagen an Geschäftsstandorten.',
      image: '/images/ex-maintenance.png',
      imageAlt: 'Wartung einer großen Fassadenwerbung mit Höhenzugang',
      serviceHref: '/leistungen#wartung-servicevertraege',
    },
    {
      title: 'Branding & Druck',
      tag: 'Branding',
      description: 'Folien, Druckdaten, Beschriftungen und Werbematerialien für einen klaren Standortauftritt.',
      image: '/images/ex-branding-print.png',
      imageAlt: 'Montage von Schaufensterfolie und gedruckten Branding-Elementen an einem Geschäftsstandort',
      serviceHref: '/leistungen/druckprodukte-branding-werbematerialien',
    },
    {
      title: 'LED-Modernisierung',
      tag: 'LED-Service',
      description: 'Modernisierung von Leuchtkästen, LED-Modulen und Lichtwerbung für gleichmäßige Sichtbarkeit.',
      image: '/images/ex-lightbox.png',
      imageAlt: 'Moderner beleuchteter Leuchtkasten an einer Geschäftsfassade',
      serviceHref: '/leistungen/lichtwerbung-led-modernisierung',
    },
    {
      title: 'Demontage & Rückbau',
      tag: 'Demontage',
      description: 'Koordinierter Rückbau, Entfernung und Vorbereitung alter Werbeanlagen.',
      image: '/images/ex-dismantling.png',
      imageAlt: 'Sicherer Rückbau einer alten Fassadenwerbung mit Kran und Arbeitsbühne',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
  ],
  en: [
    {
      title: 'Signage Installation',
      tag: 'Installation',
      description: 'Professional installation of large signage, facade signs, and site advertising.',
      image: '/images/ex-mounting.png',
      imageAlt: 'Installation of an illuminated sign on a glass facade',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Light Advertising Repair',
      tag: 'Repair',
      description: 'Repair of neon, LED systems, lightboxes, and visible signage defects.',
      image: '/images/ex-repair.png',
      imageAlt: 'Repair of classic neon and light advertising in a workshop',
      serviceHref: '/leistungen/werbeanlagen-reparatur',
    },
    {
      title: 'Maintenance & Audit',
      tag: 'Maintenance',
      description: 'Regular checks, maintenance, and condition reviews for business signage.',
      image: '/images/ex-maintenance.png',
      imageAlt: 'Maintenance of a large facade sign with height access',
      serviceHref: '/leistungen#wartung-servicevertraege',
    },
    {
      title: 'Branding & Print',
      tag: 'Branding',
      description: 'Films, print files, lettering, and advertising materials for a clear site presence.',
      image: '/images/ex-branding-print.png',
      imageAlt: 'Installation of window film and printed branding elements on a storefront',
      serviceHref: '/leistungen/druckprodukte-branding-werbematerialien',
    },
    {
      title: 'LED Modernization',
      tag: 'LED Service',
      description: 'Modernization of lightboxes, LED modules, and light advertising for even visibility.',
      image: '/images/ex-lightbox.png',
      imageAlt: 'Modern illuminated lightbox on a business facade',
      serviceHref: '/leistungen/lichtwerbung-led-modernisierung',
    },
    {
      title: 'Dismantling & Removal',
      tag: 'Dismantling',
      description: 'Coordinated removal, dismantling, and preparation of old signage structures.',
      image: '/images/ex-dismantling.png',
      imageAlt: 'Safe removal of an old facade sign with crane and work platform',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
  ],
  ru: [
    {
      title: 'Монтаж рекламных конструкций',
      tag: 'Монтаж',
      description: 'Профессиональный монтаж крупных вывесок, фасадных конструкций и рекламы на объекте.',
      image: '/images/ex-mounting.png',
      imageAlt: 'Монтаж световой рекламной конструкции на стеклянном фасаде',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Ремонт световой рекламы',
      tag: 'Ремонт',
      description: 'Ремонт неона, LED-систем, световых коробов и видимых дефектов вывесок.',
      image: '/images/ex-repair.png',
      imageAlt: 'Ремонт классической неоновой и световой рекламы в мастерской',
      serviceHref: '/leistungen/werbeanlagen-reparatur',
    },
    {
      title: 'Обслуживание и аудит',
      tag: 'Обслуживание',
      description: 'Регулярная проверка, обслуживание и оценка состояния рекламных конструкций.',
      image: '/images/ex-maintenance.png',
      imageAlt: 'Обслуживание крупной фасадной рекламы с высотным доступом',
      serviceHref: '/leistungen#wartung-servicevertraege',
    },
    {
      title: 'Брендинг и печать',
      tag: 'Брендинг',
      description: 'Пленки, печатные материалы, надписи и брендирование для коммерческого объекта.',
      image: '/images/ex-branding-print.png',
      imageAlt: 'Монтаж витринной пленки и печатных бренд-элементов на фасаде магазина',
      serviceHref: '/leistungen/druckprodukte-branding-werbematerialien',
    },
    {
      title: 'LED-модернизация',
      tag: 'LED-сервис',
      description: 'Модернизация световых коробов, LED-модулей и световой рекламы для ровной видимости.',
      image: '/images/ex-lightbox.png',
      imageAlt: 'Современный световой короб на фасаде коммерческого здания',
      serviceHref: '/leistungen/lichtwerbung-led-modernisierung',
    },
    {
      title: 'Демонтаж и вывоз',
      tag: 'Демонтаж',
      description: 'Организованный демонтаж, удаление и подготовка места после старых вывесок.',
      image: '/images/ex-dismantling.png',
      imageAlt: 'Безопасный демонтаж старой фасадной вывески с краном и рабочей платформой',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
  ],
  tr: [
    {
      title: 'Tabela Montajı',
      tag: 'Montaj',
      description: 'Büyük tabelalar, cephe reklamları ve işletme reklam alanları için profesyonel montaj.',
      image: '/images/ex-mounting.png',
      imageAlt: 'Cam cephede ışıklı tabela montajı',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Işıklı Reklam Onarımı',
      tag: 'Onarım',
      description: 'Neon, LED sistemleri, ışıklı kutular ve görünür tabela arızalarının onarımı.',
      image: '/images/ex-repair.png',
      imageAlt: 'Atölyede klasik neon ve ışıklı reklam onarımı',
      serviceHref: '/leistungen/werbeanlagen-reparatur',
    },
    {
      title: 'Bakım ve Denetim',
      tag: 'Bakım',
      description: 'İşletme tabelaları için düzenli kontrol, bakım ve durum değerlendirmesi.',
      image: '/images/ex-maintenance.png',
      imageAlt: 'Yüksekte erişimle büyük cephe tabelası bakımı',
      serviceHref: '/leistungen#wartung-servicevertraege',
    },
    {
      title: 'Markalama ve Baskı',
      tag: 'Markalama',
      description: 'İşyeri görünümü için folyolar, baskı dosyaları, yazılar ve reklam malzemeleri.',
      image: '/images/ex-branding-print.png',
      imageAlt: 'Mağaza cephesine vitrin filmi ve baskılı marka öğeleri uygulanması',
      serviceHref: '/leistungen/druckprodukte-branding-werbematerialien',
    },
    {
      title: 'LED Modernizasyonu',
      tag: 'LED Servisi',
      description: 'Işıklı kutular, LED modüller ve ışıklı reklamların dengeli görünürlük için yenilenmesi.',
      image: '/images/ex-lightbox.png',
      imageAlt: 'İşletme cephesinde modern ışıklı kutu',
      serviceHref: '/leistungen/lichtwerbung-led-modernisierung',
    },
    {
      title: 'Söküm ve Kaldırma',
      tag: 'Söküm',
      description: 'Eski tabela yapılarının koordineli sökümü, kaldırılması ve alanın hazırlanması.',
      image: '/images/ex-dismantling.png',
      imageAlt: 'Vinç ve çalışma platformuyla eski cephe tabelasının güvenli sökümü',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
  ],
  pl: [
    {
      title: 'Montaż reklam zewnętrznych',
      tag: 'Montaż',
      description: 'Profesjonalny montaż dużych szyldów, oznakowania fasad i reklamy przy lokalizacji.',
      image: '/images/ex-mounting.png',
      imageAlt: 'Montaż podświetlanego szyldu na szklanej fasadzie',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Naprawa reklamy świetlnej',
      tag: 'Naprawa',
      description: 'Naprawa neonów, systemów LED, kasetonów i widocznych usterek szyldów.',
      image: '/images/ex-repair.png',
      imageAlt: 'Naprawa klasycznej reklamy neonowej i świetlnej w warsztacie',
      serviceHref: '/leistungen/werbeanlagen-reparatur',
    },
    {
      title: 'Konserwacja i audyt',
      tag: 'Konserwacja',
      description: 'Regularne kontrole, konserwacja i ocena stanu reklam w lokalach firmowych.',
      image: '/images/ex-maintenance.png',
      imageAlt: 'Konserwacja dużego szyldu fasadowego z dostępem wysokościowym',
      serviceHref: '/leistungen#wartung-servicevertraege',
    },
    {
      title: 'Branding i druk',
      tag: 'Branding',
      description: 'Folie, pliki do druku, napisy i materiały reklamowe dla spójnego wyglądu lokalu.',
      image: '/images/ex-branding-print.png',
      imageAlt: 'Montaż folii okiennej i drukowanych elementów brandingu na witrynie',
      serviceHref: '/leistungen/druckprodukte-branding-werbematerialien',
    },
    {
      title: 'Modernizacja LED',
      tag: 'Serwis LED',
      description: 'Modernizacja kasetonów, modułów LED i reklamy świetlnej dla równomiernej widoczności.',
      image: '/images/ex-lightbox.png',
      imageAlt: 'Nowoczesny podświetlany kaseton na fasadzie firmy',
      serviceHref: '/leistungen/lichtwerbung-led-modernisierung',
    },
    {
      title: 'Demontaż i usunięcie',
      tag: 'Demontaż',
      description: 'Koordynowany demontaż, usunięcie i przygotowanie miejsca po starych szyldach.',
      image: '/images/ex-dismantling.png',
      imageAlt: 'Bezpieczny demontaż starego szyldu fasadowego przy użyciu dźwigu i platformy',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
  ],
  ar: [
    {
      title: 'تركيب اللوحات الإعلانية',
      tag: 'تركيب',
      description: 'تركيب احترافي للوحات الكبيرة ولافتات الواجهات وإعلانات مواقع الأعمال.',
      image: '/images/ex-mounting.png',
      imageAlt: 'تركيب لوحة إعلانية مضيئة على واجهة زجاجية',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'إصلاح الإعلانات المضيئة',
      tag: 'إصلاح',
      description: 'إصلاح النيون وأنظمة LED والصناديق المضيئة والأعطال الظاهرة في اللافتات.',
      image: '/images/ex-repair.png',
      imageAlt: 'إصلاح إعلان نيون وإعلان مضيء كلاسيكي داخل ورشة',
      serviceHref: '/leistungen/werbeanlagen-reparatur',
    },
    {
      title: 'الصيانة والتدقيق',
      tag: 'صيانة',
      description: 'فحص وصيانة وتقييم حالة اللوحات الإعلانية في مواقع الأعمال بشكل منتظم.',
      image: '/images/ex-maintenance.png',
      imageAlt: 'صيانة لوحة واجهة كبيرة مع وصول على ارتفاع',
      serviceHref: '/leistungen#wartung-servicevertraege',
    },
    {
      title: 'الهوية والطباعة',
      tag: 'هوية بصرية',
      description: 'أفلام ونماذج طباعة وكتابات ومواد إعلانية لظهور واضح لموقع العمل.',
      image: '/images/ex-branding-print.png',
      imageAlt: 'تركيب فيلم واجهة وعناصر هوية مطبوعة على متجر',
      serviceHref: '/leistungen/druckprodukte-branding-werbematerialien',
    },
    {
      title: 'تحديث LED',
      tag: 'خدمة LED',
      description: 'تحديث الصناديق المضيئة ووحدات LED والإعلانات المضيئة لرؤية متوازنة.',
      image: '/images/ex-lightbox.png',
      imageAlt: 'صندوق مضيء حديث على واجهة تجارية',
      serviceHref: '/leistungen/lichtwerbung-led-modernisierung',
    },
    {
      title: 'التفكيك والإزالة',
      tag: 'تفكيك',
      description: 'تنسيق تفكيك وإزالة وتجهيز الموقع بعد اللوحات الإعلانية القديمة.',
      image: '/images/ex-dismantling.png',
      imageAlt: 'تفكيك آمن للوحة واجهة قديمة باستخدام رافعة ومنصة عمل',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
  ],
};

const LEGACY_WORK_TITLES = new Set([
  'LED-Montage',
  'Neon-Reparatur',
  'Hochhaus-Wartung',
  'Schilder-Design',
  'Leuchtkasten-Montage',
  'Sicherer Rückbau',
  'LED Mounting',
  'Neon Repair',
  'High-Rise Maintenance',
  'Signage Design',
  'Lightbox Installation',
  'Safe Dismantling',
  'Монтаж LED',
  'Ремонт неона',
  'Высотный сервис',
  'Дизайн вывесок',
  'Световые короба',
  'Безопасный демонтаж',
  'LED Montajı',
  'Neon Onarımı',
  'Yüksek Bakım',
  'Tabela Tasarımı',
  'Işıklı Kutu Montajı',
  'Güvenli Söküm',
  'Montaż LED',
  'Naprawa neonów',
  'Konserwacja wysokościowa',
  'Projektowanie szyldów',
  'Montaż kasetonu',
  'Bezpieczny demontaż',
  'Bezpieчный demontaż',
  'تركيب LED',
  'إصلاح النيون',
  'صيانة المرتفعات',
  'تصميم اللافتات',
  'تركيب صناديق مضيئة',
  'تفكيك آمن',
]);

function isLocale(value: string): value is Locale {
  return value === 'de' || value === 'en' || value === 'ru' || value === 'tr' || value === 'pl' || value === 'ar';
}

const ExcellenceCarousel = ({ content }: ExcellenceCarouselProps) => {
  const localeValue = useLocale();
  const locale = isLocale(localeValue) ? localeValue : 'de';
  const isRTL = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  // Default fallback images aligned to static translation order
  const DEFAULT_IMAGES = [
    '/images/ex-mounting.png',
    '/images/ex-repair.png',
    '/images/ex-maintenance.png',
    '/images/ex-design.png',
    '/images/ex-lightbox.png',
    '/images/ex-dismantling.png',
  ];

  const items = (content?.items || []).map((cmsItem, idx) => {
    const config = WORK_CARD_CONFIG[locale]?.[idx] ?? WORK_CARD_CONFIG.de[idx % WORK_CARD_CONFIG.de.length];
    const isLegacyItem = LEGACY_WORK_TITLES.has(cmsItem.title || '');

    return {
      title: isLegacyItem ? config.title : cmsItem.title || config.title,
      tag: isLegacyItem ? config.tag : cmsItem.tag || config.tag,
      description: isLegacyItem ? config.description : cmsItem.description || config.description,
      image: isLegacyItem ? config.image : cmsItem.image || config.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length],
      imageAlt: isLegacyItem ? config.imageAlt : cmsItem.imageAlt || config.imageAlt || cmsItem.title || '',
      serviceHref: config.serviceHref,
    };
  });

  const carouselItems = items;
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getCardWidth = (el: HTMLDivElement) => {
    const card = el.querySelector('[data-card]') as HTMLElement;
    if (card) return card.offsetWidth;
    // Fallback based on typical viewport behavior
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return el.offsetWidth * (isMobile ? 0.88 : 0.32);
  };

  const scrollRail = (direction: 'previous' | 'next') => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = getCardWidth(el);
    const scrollDistance = Math.max(1, Math.min(cardWidth + 24, el.scrollWidth - el.clientWidth));
    const offset = direction === 'next' ? scrollDistance : -scrollDistance;

    el.scrollTo({
      left: el.scrollLeft + (isRTL ? -offset : offset),
      behavior: 'smooth',
    });
  };

  const next = () => scrollRail('next');
  const prev = () => scrollRail('previous');

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section className="w-full bg-[#F5F5F7] py-20 sm:py-24 overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <SectionEyebrow>WORK</SectionEyebrow>
            <h2 className="text-[32px] md:text-[42px] font-bold text-[#0E1A2B] leading-[1.1] tracking-[0]">
              {content?.title || ''}
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#72665D] max-w-xl">
              {content?.subtitle || ''}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 md:pb-1">
            <button
              onClick={prev}
              aria-label="Previous"
              className="group flex h-11 w-11 items-center justify-center rounded-full bg-[#E4E4E8] text-[#3B3B3F] transition-colors duration-200 hover:bg-[#D8D8DE] active:bg-[#CBCBD2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1A2B]/30"
            >
              <svg
                className={`h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={next}
              aria-label="Next"
              className="group flex h-11 w-11 items-center justify-center rounded-full bg-[#E4E4E8] text-[#3B3B3F] transition-colors duration-200 hover:bg-[#D8D8DE] active:bg-[#CBCBD2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1A2B]/30"
            >
              <svg
                className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container with Gradients */}
      <div className="relative mt-12 w-full">
        {/* Narrower Edge Gradients to see neighbor cards better */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-[5%] bg-gradient-to-r from-[#F5F5F7] via-[#F5F5F7]/50 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-[5%] bg-gradient-to-l from-[#F5F5F7] via-[#F5F5F7]/50 to-transparent" />

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`
            no-scrollbar flex snap-x snap-mandatory scroll-px-[max(1rem,calc((100vw-1180px)/2+1.5rem))] gap-5 overflow-x-auto scroll-smooth px-[max(1rem,calc((100vw-1180px)/2+1.5rem))] pb-8 sm:gap-6
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {carouselItems.map((item, index) => (
            <div
              key={`${index}-${item.title}`}
              data-card
              className="flex w-[84vw] max-w-[360px] flex-shrink-0 snap-start sm:w-[340px] lg:w-[350px]"
            >
              <div
                className="group relative h-[520px] w-full overflow-hidden rounded-[28px] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(15,23,42,0.12)] sm:h-[560px] lg:h-[590px]"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 350px, (min-width: 640px) 340px, 84vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/58 via-black/10 to-black/42" />

                <div className="absolute inset-x-0 top-0 flex flex-col gap-3 p-7 text-white sm:p-8">
                  <span className="self-start text-[13px] font-bold leading-none text-white/90">
                    #{item.tag}
                  </span>
                  <h3 className="max-w-[14rem] text-[27px] font-bold leading-[1.06] tracking-[0] sm:text-[30px]">
                    {item.title}
                  </h3>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-7 text-white sm:p-8">
                  <p className="max-w-[15.5rem] text-[14px] font-medium leading-6 text-white/84 sm:text-[15px]">
                    {item.description}
                  </p>
                  <Link
                    href={item.serviceHref}
                    aria-label={`${item.tag}: ${item.title}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/88 text-[#1D1D1F] shadow-[0_10px_26px_rgba(0,0,0,0.16)] transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <svg
                      className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExcellenceCarousel;
