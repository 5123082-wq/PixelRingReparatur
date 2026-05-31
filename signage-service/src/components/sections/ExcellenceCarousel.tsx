'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
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

  const itemsCount = items.length;
  const carouselItems = items;
  
  const [virtualIndex, setVirtualIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
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

  // Initialize scroll position to the middle set
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollLeft = 0;
    const readyFrame = window.requestAnimationFrame(() => setIsReady(true));

    return () => window.cancelAnimationFrame(readyFrame);
  }, [isRTL]);

  const handleInfiniteScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !isReady) return;

    const scrollPos = Math.abs(el.scrollLeft);
    const cardWidth = getCardWidth(el);
    const currentVirtual = Math.min(itemsCount - 1, Math.max(0, Math.round(scrollPos / cardWidth)));
    setVirtualIndex(currentVirtual);
  }, [itemsCount, isReady]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    window.addEventListener('resize', handleInfiniteScroll);
    return () => {
      el.removeEventListener('scroll', handleInfiniteScroll);
      window.removeEventListener('resize', handleInfiniteScroll);
    };
  }, [handleInfiniteScroll]);

  const scrollToVirtualIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = getCardWidth(el);
    el.scrollTo({
      left: isRTL ? -(index * cardWidth) : (index * cardWidth),
      behavior: 'smooth',
    });
  };

  const next = () => scrollToVirtualIndex(virtualIndex + 1);
  const prev = () => scrollToVirtualIndex(virtualIndex - 1);

  const activeItemIndex = itemsCount > 0 ? virtualIndex % itemsCount : 0;

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
    <section className="w-full bg-[#F4EDE4] py-24 overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
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
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous"
              className="relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-out bg-gradient-to-br from-[#0E1A2B] to-[#1A2D45] text-white shadow-lg shadow-[#0E1A2B30] hover:shadow-xl hover:shadow-[#0E1A2B40] hover:scale-110 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full transition-all duration-500 group-hover:ring-4 group-hover:ring-[#B8643E30]" />
              <svg
                className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2 mx-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToVirtualIndex(index + itemsCount)}
                  className={`rounded-full transition-all duration-400 ease-out ${activeItemIndex === index ? 'w-8 h-3 bg-[#B8643E]' : 'w-3 h-3 bg-[#C9BAA9] hover:bg-[#A89B8F]'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next"
              className="relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-out bg-gradient-to-br from-[#B8643E] to-[#D47A4E] text-white shadow-lg shadow-[#B8643E30] hover:shadow-xl hover:shadow-[#B8643E40] hover:scale-110 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full transition-all duration-500 group-hover:ring-4 group-hover:ring-[#B8643E30]" />
              <svg
                className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
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
        <div className="absolute left-0 top-0 bottom-0 w-[6%] z-20 pointer-events-none bg-gradient-to-r from-[#F4EDE4] via-[#F4EDE4]/60 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-[6%] z-20 pointer-events-none bg-gradient-to-l from-[#F4EDE4] via-[#F4EDE4]/60 to-transparent" />

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`
            flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-[4%] pb-8
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {carouselItems.map((item, index) => (
            <div
              key={`${index}-${item.title}`}
              data-card
              className="flex-shrink-0 w-[88%] md:w-[32%] snap-center px-3 flex"
            >
              <div
                className="w-full aspect-[3/4] relative rounded-[32px] md:rounded-[40px] overflow-hidden group shadow-2xl shadow-[#0E1A2B08] transition-all duration-500"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2BDD] via-[#0E1A2B30] to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 flex flex-col gap-4 text-white">
                  <Link
                    href={item.serviceHref}
                    aria-label={`${item.tag}: ${item.title}`}
                    className="self-start px-4 py-1.5 bg-[#B8643E] rounded-full text-[12px] font-bold uppercase tracking-wider transition-colors duration-200 hover:bg-[#9F5131] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    #{item.tag}
                  </Link>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[22px] sm:text-[26px] font-bold leading-tight tracking-[0]">
                      <Link
                        href="/referenzen#recent-work"
                        className="transition-colors duration-200 hover:text-white/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-[14px] sm:text-[16px] text-white/80 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
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
