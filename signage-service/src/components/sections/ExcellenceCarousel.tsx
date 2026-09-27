'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ExcellenceCmsContent } from '@/lib/cms/pages';
import WorkMediaViewer from './WorkMediaViewer';

interface ExcellenceCarouselProps {
  content?: ExcellenceCmsContent;
}

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

const CAROUSEL_LABELS: Record<Locale, { navigation: string; previous: string; next: string; open: string }> = {
  de: { navigation: 'Arbeitsbeispiele durchblättern', previous: 'Vorheriges Beispiel', next: 'Nächstes Beispiel', open: 'In Großansicht öffnen' },
  en: { navigation: 'Browse work examples', previous: 'Previous example', next: 'Next example', open: 'Open full-screen view' },
  ru: { navigation: 'Просмотр примеров работ', previous: 'Предыдущий пример', next: 'Следующий пример', open: 'Открыть на весь экран' },
  tr: { navigation: 'Çalışma örneklerine göz atın', previous: 'Önceki örnek', next: 'Sonraki örnek', open: 'Tam ekran aç' },
  pl: { navigation: 'Przeglądaj przykłady prac', previous: 'Poprzedni przykład', next: 'Następny przykład', open: 'Otwórz na pełnym ekranie' },
  ar: { navigation: 'تصفح أمثلة الأعمال', previous: 'المثال السابق', next: 'المثال التالي', open: 'افتح بملء الشاشة' },
};

type WorkCardConfig = {
  title: string;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  video?: string;
  poster?: string;
  videoLabel?: string;
  serviceHref: string;
};

function ViewportVideo({
  src,
  poster,
  label,
  className,
  disabled,
}: {
  src: string;
  poster: string;
  label: string;
  className: string;
  disabled: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof IntersectionObserver === 'undefined') {
      const fallbackTimer = window.setTimeout(() => {
        setShouldLoad(true);
        setShouldPlay(true);
      }, 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: '400px 0px', threshold: 0 }
    );
    const playbackObserver = new IntersectionObserver(
      ([entry]) => setShouldPlay(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.2)),
      { threshold: [0, 0.2, 0.6] }
    );

    loadObserver.observe(video);
    playbackObserver.observe(video);

    return () => {
      loadObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (shouldLoad) {
      videoRef.current?.load();
    }
  }, [shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (shouldPlay && !disabled) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
    return () => video.pause();
  }, [shouldLoad, shouldPlay, disabled]);

  return (
    <video
      ref={videoRef}
      aria-label={label}
      loop
      muted
      playsInline
      poster={poster}
      preload={shouldLoad ? 'metadata' : 'none'}
      className={className}
    >
      <source src={shouldLoad ? src : undefined} type="video/mp4" />
    </video>
  );
}

const WORK_CARD_CONFIG: Record<Locale, WorkCardConfig[]> = {
  de: [
    {
      title: 'Werbeanlagen-Montage',
      tag: 'Montage',
      description: 'Fachgerechte Montage großer Werbeanlagen, Fassadenschilder und Standortwerbung.',
      image: '/images/ex-mounting-dietz-autohaus-werbepylon.webp',
      imageAlt: 'Beleuchteter Werbepylon und Fassadenwerbung eines Autohauses bei Nacht',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Lichtwerbung-Reparatur',
      tag: 'Reparatur',
      description: 'Instandsetzung von Neon, LED-Technik, Leuchtkästen und sichtbaren Defekten.',
      image: '/images/ex-repair-libitina-leuchtkasten-fassade.webp',
      imageAlt: 'Beleuchtete Fassadenwerbung eines Geschäftsstandorts bei Nacht',
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
      image: '/images/ex-branding-print-folienmontage-poster.webp',
      imageAlt: 'Montage von Schaufensterfolie und Branding-Elementen an einem Geschäftsstandort',
      video: '/videos/ex-branding-print-folienmontage.mp4',
      poster: '/images/ex-branding-print-folienmontage-poster.webp',
      videoLabel: 'Video einer Folienmontage und Branding-Arbeit an einer Geschäftsfassade',
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
      title: 'Markisenreinigung & Aufarbeitung',
      tag: 'Sichtbarer Werbeauftritt',
      description: 'Reinigung, Pflege und Aufarbeitung von Markisen an Cafés, Restaurants und Geschäftsfassaden – für einen gepflegten, sichtbaren Auftritt.',
      image: '/images/ex-awning-cleaning-poster.jpg',
      imageAlt: 'Fachkraft reinigt eine Markise vor einem Café an einer Geschäftsstraße',
      video: '/videos/ex-awning-cleaning.mp4',
      poster: '/images/ex-awning-cleaning-poster.jpg',
      videoLabel: 'Video einer fachgerechten Markisenreinigung vor einem Café',
      serviceHref: '/leistungen/werbeanlagen-reinigung',
    },
  ],
  en: [
    {
      title: 'Signage Installation',
      tag: 'Installation',
      description: 'Professional installation of large signage, facade signs, and site advertising.',
      image: '/images/ex-mounting-dietz-autohaus-werbepylon.webp',
      imageAlt: 'Illuminated advertising pylon and car dealership facade sign at night',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Light Advertising Repair',
      tag: 'Repair',
      description: 'Repair of neon, LED systems, lightboxes, and visible signage defects.',
      image: '/images/ex-repair-libitina-leuchtkasten-fassade.webp',
      imageAlt: 'Illuminated facade sign at a business location at night',
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
      image: '/images/ex-branding-print-folienmontage-poster.webp',
      imageAlt: 'Installation of window film and branding elements on a storefront',
      video: '/videos/ex-branding-print-folienmontage.mp4',
      poster: '/images/ex-branding-print-folienmontage-poster.webp',
      videoLabel: 'Video of window film installation and branding work on a storefront facade',
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
      title: 'Awning Cleaning & Restoration',
      tag: 'Visible Brand Presence',
      description: 'Cleaning, care, and restoration of awnings at cafés, restaurants, and business facades—for a well-kept, visible presence.',
      image: '/images/ex-awning-cleaning-poster.jpg',
      imageAlt: 'Specialist cleaning an awning in front of a café on a business street',
      video: '/videos/ex-awning-cleaning.mp4',
      poster: '/images/ex-awning-cleaning-poster.jpg',
      videoLabel: 'Video of professional awning cleaning in front of a café',
      serviceHref: '/leistungen/werbeanlagen-reinigung',
    },
  ],
  ru: [
    {
      title: 'Монтаж рекламных конструкций',
      tag: 'Монтаж',
      description: 'Профессиональный монтаж крупных вывесок, фасадных конструкций и рекламы на объекте.',
      image: '/images/ex-mounting-dietz-autohaus-werbepylon.webp',
      imageAlt: 'Освещенный рекламный пилон и фасадная вывеска автоцентра ночью',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Ремонт световой рекламы',
      tag: 'Ремонт',
      description: 'Ремонт неона, LED-систем, световых коробов и видимых дефектов вывесок.',
      image: '/images/ex-repair-libitina-leuchtkasten-fassade.webp',
      imageAlt: 'Световая фасадная вывеска коммерческого объекта ночью',
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
      image: '/images/ex-branding-print-folienmontage-poster.webp',
      imageAlt: 'Монтаж витринной пленки и бренд-элементов на фасаде коммерческого объекта',
      video: '/videos/ex-branding-print-folienmontage.mp4',
      poster: '/images/ex-branding-print-folienmontage-poster.webp',
      videoLabel: 'Видео монтажа витринной пленки и брендирования фасада коммерческого объекта',
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
      title: 'Чистка и восстановление маркиз',
      tag: 'Видимый рекламный облик',
      description: 'Чистка, уход и восстановление маркиз для кафе, ресторанов и коммерческих фасадов — чтобы объект выглядел ухоженно и заметно.',
      image: '/images/ex-awning-cleaning-poster.jpg',
      imageAlt: 'Специалист очищает маркизу перед кафе на городской улице',
      video: '/videos/ex-awning-cleaning.mp4',
      poster: '/images/ex-awning-cleaning-poster.jpg',
      videoLabel: 'Видео профессиональной чистки маркизы перед кафе',
      serviceHref: '/leistungen/werbeanlagen-reinigung',
    },
  ],
  tr: [
    {
      title: 'Tabela Montajı',
      tag: 'Montaj',
      description: 'Büyük tabelalar, cephe reklamları ve işletme reklam alanları için profesyonel montaj.',
      image: '/images/ex-mounting-dietz-autohaus-werbepylon.webp',
      imageAlt: 'Gece aydınlatılan oto galerisi reklam pilonu ve cephe tabelası',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Işıklı Reklam Onarımı',
      tag: 'Onarım',
      description: 'Neon, LED sistemleri, ışıklı kutular ve görünür tabela arızalarının onarımı.',
      image: '/images/ex-repair-libitina-leuchtkasten-fassade.webp',
      imageAlt: 'Gece bir işletme cephesinde aydınlatmalı tabela',
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
      image: '/images/ex-branding-print-folienmontage-poster.webp',
      imageAlt: 'Bir mağaza cephesine vitrin filmi ve marka öğeleri uygulanması',
      video: '/videos/ex-branding-print-folienmontage.mp4',
      poster: '/images/ex-branding-print-folienmontage-poster.webp',
      videoLabel: 'Bir mağaza cephesinde vitrin filmi montajı ve markalama çalışması videosu',
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
      title: 'Tente Temizliği ve Yenileme',
      tag: 'Görünür Marka İmajı',
      description: 'Kafe, restoran ve iş yeri cephelerindeki tentelerin temizliği, bakımı ve yenilenmesi — bakımlı ve görünür bir marka imajı için.',
      image: '/images/ex-awning-cleaning-poster.jpg',
      imageAlt: 'Uzman, şehir caddesindeki bir kafenin önünde tente temizliği yapıyor',
      video: '/videos/ex-awning-cleaning.mp4',
      poster: '/images/ex-awning-cleaning-poster.jpg',
      videoLabel: 'Bir kafenin önünde profesyonel tente temizliği videosu',
      serviceHref: '/leistungen/werbeanlagen-reinigung',
    },
  ],
  pl: [
    {
      title: 'Montaż reklam zewnętrznych',
      tag: 'Montaż',
      description: 'Profesjonalny montaż dużych szyldów, oznakowania fasad i reklamy przy lokalizacji.',
      image: '/images/ex-mounting-dietz-autohaus-werbepylon.webp',
      imageAlt: 'Podświetlony pylon reklamowy i szyld fasadowy salonu samochodowego nocą',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'Naprawa reklamy świetlnej',
      tag: 'Naprawa',
      description: 'Naprawa neonów, systemów LED, kasetonów i widocznych usterek szyldów.',
      image: '/images/ex-repair-libitina-leuchtkasten-fassade.webp',
      imageAlt: 'Podświetlany szyld fasadowy lokalu firmowego nocą',
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
      image: '/images/ex-branding-print-folienmontage-poster.webp',
      imageAlt: 'Montaż folii okiennej i elementów brandingu na witrynie firmowej',
      video: '/videos/ex-branding-print-folienmontage.mp4',
      poster: '/images/ex-branding-print-folienmontage-poster.webp',
      videoLabel: 'Film z montażu folii okiennej i brandingu na fasadzie firmowej',
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
      title: 'Czyszczenie i renowacja markiz',
      tag: 'Widoczny wizerunek marki',
      description: 'Czyszczenie, pielęgnacja i renowacja markiz przy kawiarniach, restauracjach i fasadach firmowych — dla zadbanego, widocznego wizerunku.',
      image: '/images/ex-awning-cleaning-poster.jpg',
      imageAlt: 'Specjalista czyści markizę przed kawiarnią przy miejskiej ulicy',
      video: '/videos/ex-awning-cleaning.mp4',
      poster: '/images/ex-awning-cleaning-poster.jpg',
      videoLabel: 'Film z profesjonalnego czyszczenia markizy przed kawiarnią',
      serviceHref: '/leistungen/werbeanlagen-reinigung',
    },
  ],
  ar: [
    {
      title: 'تركيب اللوحات الإعلانية',
      tag: 'تركيب',
      description: 'تركيب احترافي للوحات الكبيرة ولافتات الواجهات وإعلانات مواقع الأعمال.',
      image: '/images/ex-mounting-dietz-autohaus-werbepylon.webp',
      imageAlt: 'عمود إعلاني مضيء ولافتة واجهة لمعرض سيارات ليلاً',
      serviceHref: '/leistungen/montage-demontage-werbeanlagen',
    },
    {
      title: 'إصلاح الإعلانات المضيئة',
      tag: 'إصلاح',
      description: 'إصلاح النيون وأنظمة LED والصناديق المضيئة والأعطال الظاهرة في اللافتات.',
      image: '/images/ex-repair-libitina-leuchtkasten-fassade.webp',
      imageAlt: 'لافتة واجهة مضيئة لموقع تجاري ليلاً',
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
      image: '/images/ex-branding-print-folienmontage-poster.webp',
      imageAlt: 'تركيب فيلم واجهة وعناصر هوية بصرية على واجهة متجر',
      video: '/videos/ex-branding-print-folienmontage.mp4',
      poster: '/images/ex-branding-print-folienmontage-poster.webp',
      videoLabel: 'فيديو لتركيب فيلم واجهة وعمل هوية بصرية على واجهة متجر',
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
      title: 'تنظيف وتجديد المظلات',
      tag: 'حضور بصري واضح للعلامة التجارية',
      description: 'تنظيف وصيانة وتجديد المظلات للمقاهي والمطاعم وواجهات الأعمال — لمظهر مهني واضح وجذاب.',
      image: '/images/ex-awning-cleaning-poster.jpg',
      imageAlt: 'مختص ينظف مظلة أمام مقهى في شارع تجاري',
      video: '/videos/ex-awning-cleaning.mp4',
      poster: '/images/ex-awning-cleaning-poster.jpg',
      videoLabel: 'فيديو لتنظيف احترافي لمظلة أمام مقهى',
      serviceHref: '/leistungen/werbeanlagen-reinigung',
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
  'Demontage & Rückbau',
  'Dismantling & Removal',
  'Монтаж LED',
  'Ремонт неона',
  'Высотный сервис',
  'Дизайн вывесок',
  'Световые короба',
  'Безопасный демонтаж',
  'Демонтаж и вывоз',
  'LED Montajı',
  'Neon Onarımı',
  'Yüksek Bakım',
  'Tabela Tasarımı',
  'Işıklı Kutu Montajı',
  'Güvenli Söküm',
  'Söküm ve Kaldırma',
  'Montaż LED',
  'Naprawa neonów',
  'Konserwacja wysokościowa',
  'Projektowanie szyldów',
  'Montaż kasetonu',
  'Bezpieczny demontaż',
  'Demontaż i usunięcie',
  'Bezpieчный demontaż',
  'تركيب LED',
  'إصلاح النيون',
  'صيانة المرتفعات',
  'تصميم اللافتات',
  'تركيب صناديق مضيئة',
  'تفكيك آمن',
  'التفكيك والإزالة',
]);

function isLocale(value: string): value is Locale {
  return value === 'de' || value === 'en' || value === 'ru' || value === 'tr' || value === 'pl' || value === 'ar';
}

function getWorkCardOrder(item: WorkCardConfig) {
  const label = `${item.title} ${item.tag}`.toLowerCase();

  if (label.includes('demontage') || label.includes('dismantling') || label.includes('демонтаж') || label.includes('söküm') || label.includes('demontaż') || label.includes('تفكيك')) {
    return 5;
  }

  if (item.serviceHref.includes('montage-demontage')) return 0;
  if (item.serviceHref.includes('werbeanlagen-reparatur')) return 1;
  if (item.serviceHref.includes('druckprodukte-branding')) return 2;
  if (item.serviceHref.includes('wartung-servicevertraege')) return 3;
  if (item.serviceHref.includes('lichtwerbung-led-modernisierung')) return 4;

  return 10;
}

const ExcellenceCarousel = ({ content }: ExcellenceCarouselProps) => {
  const localeValue = useLocale();
  const locale = isLocale(localeValue) ? localeValue : 'de';
  const labels = CAROUSEL_LABELS[locale];
  const isRTL = locale === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const dragRef = useRef({ active: false, moved: false, x: 0, y: 0, scrollLeft: 0 });

  // Default fallback images aligned to static translation order
  const DEFAULT_IMAGES = [
    '/images/ex-mounting-dietz-autohaus-werbepylon.webp',
    '/images/ex-repair-libitina-leuchtkasten-fassade.webp',
    '/images/ex-maintenance.png',
    '/images/ex-branding-print-folienmontage-poster.webp',
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
      video: config.video,
      poster: config.poster,
      videoLabel: config.videoLabel,
      serviceHref: config.serviceHref,
    };
  });

  const carouselItems = [...items].sort((a, b) => getWorkCardOrder(a) - getWorkCardOrder(b));
  
  const [isDragging, setIsDragging] = useState(false);

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
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  const next = () => scrollRail('next');
  const prev = () => scrollRail('previous');

  // Touch keeps native scrolling; both touch and mouse drags suppress card clicks.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    dragRef.current = {
      active: true, moved: false, x: event.clientX, y: event.clientY,
      scrollLeft: event.currentTarget.scrollLeft,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    if (event.pointerType === 'mouse' && !(event.buttons & 1)) {
      drag.active = false;
      setIsDragging(false);
      return;
    }
    const dx = event.clientX - drag.x;
    if (Math.hypot(dx, event.clientY - drag.y) > 8) drag.moved = true;
    if (event.pointerType === 'mouse' && drag.moved) {
      event.preventDefault();
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.scrollLeft = drag.scrollLeft - dx;
    }
  };

  const endDrag = () => {
    dragRef.current.active = false;
    setIsDragging(false);
  };

  return (
    <section id="home-work-carousel" aria-labelledby="home-work-carousel-title" className="relative w-full overflow-hidden bg-[#EEF3FB] py-8 sm:py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="pr-site-container flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 id="home-work-carousel-title" className="text-[32px] font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[42px]">
              {content?.title || ''}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[#4A5568] md:text-[17px]">
              {content?.subtitle || ''}
            </p>
          </div>

          {/* Navigation Controls */}
          <div role="group" className="hidden items-center gap-2 md:flex md:pb-1" aria-label={labels.navigation}>
            <button
              type="button"
              onClick={prev}
              aria-label={labels.previous}
              title={labels.previous}
              className="group inline-flex size-14 items-center justify-center rounded-full border border-[#B8643E] bg-white/92 text-[#B8643E] shadow-[0_12px_30px_rgba(184,100,62,0.14)] transition-all duration-300 hover:scale-105 hover:bg-[#B8643E] hover:text-white hover:shadow-[0_16px_36px_rgba(184,100,62,0.28)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
            >
              <svg
                className={`size-6 transition-transform duration-300 group-hover:-translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:translate-x-0.5' : ''}`}
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
              onClick={next}
              aria-label={labels.next}
              title={labels.next}
              className="group inline-flex size-14 items-center justify-center rounded-full border border-[#B8643E] bg-white/92 text-[#B8643E] shadow-[0_12px_30px_rgba(184,100,62,0.14)] transition-all duration-300 hover:scale-105 hover:bg-[#B8643E] hover:text-white hover:shadow-[0_16px_36px_rgba(184,100,62,0.28)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
            >
              <svg
                className={`size-6 transition-transform duration-300 group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`}
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

      {/* Carousel Container with Gradients */}
      <div className="relative mt-8 w-full">
        {/* Narrower Edge Gradients to see neighbor cards better */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 hidden w-[5%] bg-gradient-to-r from-[#EEF3FB] via-[#EEF3FB]/50 to-transparent md:block" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 hidden w-[5%] bg-gradient-to-l from-[#EEF3FB] via-[#EEF3FB]/50 to-transparent md:block" />

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={() => {
            dragRef.current.moved = true;
            endDrag();
          }}
          onLostPointerCapture={endDrag}
          onClickCapture={(event) => {
            if (event.detail !== 0 && dragRef.current.moved) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          onDragStart={(event) => event.preventDefault()}
          className={`
            pr-carousel-rail no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-8 sm:gap-6
            motion-reduce:scroll-auto ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: isDragging ? 'none' : undefined, scrollBehavior: isDragging ? 'auto' : undefined }}
        >
          {carouselItems.map((item, index) => (
            <div
              key={`${index}-${item.title}`}
              data-card
              className="flex w-[80vw] max-w-[340px] flex-shrink-0 snap-start sm:w-[340px] lg:w-[350px]"
            >
              <div
                className="group relative h-[520px] w-full overflow-hidden rounded-[28px] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(15,23,42,0.12)] sm:h-[560px] lg:h-[590px]"
              >
                {item.video ? (
                  <ViewportVideo
                    disabled={viewerIndex !== null}
                    src={item.video}
                    label={item.videoLabel || item.imageAlt}
                    poster={item.poster || item.image}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 350px, (min-width: 640px) 340px, 84vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
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
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/88 text-[#1D1D1F] shadow-[0_10px_26px_rgba(0,0,0,0.16)]"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" />
                    </svg>
                  </span>
                </div>
                <button
                  type="button"
                  data-viewer-trigger
                  aria-label={`${labels.open}: ${item.title}`}
                  aria-haspopup="dialog"
                  onClick={(event) => {
                    event.currentTarget.focus({ preventScroll: true });
                    setViewerIndex(index);
                  }}
                  className={`absolute inset-0 z-10 rounded-[28px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#B8643E] ${isDragging ? 'cursor-grabbing' : 'cursor-pointer'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {viewerIndex !== null && (
        <WorkMediaViewer
          items={carouselItems}
          initialIndex={viewerIndex}
          locale={locale}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </section>
  );
};

export default ExcellenceCarousel;
