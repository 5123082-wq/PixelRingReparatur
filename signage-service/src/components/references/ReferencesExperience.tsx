'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

export type ReferenceCase = {
  id: string;
  title: string;
  category: string;
  problem: string;
  work: string;
  result: string;
  beforeImage: string;
  afterImage: string;
  defaultText: string;
  beforeText: string;
  gallery: string[];
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
};

export type CategoryItem = {
  id: string;
  title: string;
  text: string;
  image: string;
  filter: string;
};

export type ReportRow = {
  id: string;
  type: string;
  issue: string;
  outcome: string;
};

export type ReportHook = {
  id?: string;
  title: string;
  text: string;
};

export type ReferencesContent = {
  locale: Locale;
  badge: string;
  heroTitle: string;
  heroIntro: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTags: string[];
  heroNoteTitle: string;
  heroNoteText: string;
  recentEyebrow: string;
  recentTitle: string;
  recentIntro: string;
  reportTitle: string;
  reportIntro: string;
  reportHooks: ReportHook[];
  reports: ReportRow[];
  galleryEyebrow: string;
  galleryTitle: string;
  galleryIntro: string;
  galleryPromoEyebrow: string;
  galleryPromoTitle: string;
  galleryPromoText: string;
  galleryPromoCta: string;
  galleryPromoHref: string;
  categoriesTitle: string;
  categoriesIntro: string;
  typeBandLines: string[];
  finalTitle: string;
  finalText: string;
  finalCta: string;
  modalProblemLabel: string;
  modalWorkLabel: string;
  modalResultLabel: string;
  modalBeforeLabel: string;
  modalCta: string;
  viewerAllLabel: string;
  viewerCloseLabel: string;
  cases: ReferenceCase[];
  galleryItems: GalleryItem[];
  productCategories: CategoryItem[];
  heroSlides?: string[];
};

type ReferencesExperienceProps = {
  content: ReferencesContent;
};

type GalleryCardVariant = 'large' | 'vertical' | 'small' | 'wide';

const SECTION_HEADING_CLASS = 'max-w-4xl text-3xl font-black leading-[1.05] text-[#0E1A2B] sm:text-4xl lg:text-[40px]';
const SECTION_INTRO_CLASS = 'mt-4 max-w-3xl text-[16px] font-semibold leading-7 text-[#5D6662] sm:text-[17px]';

const GALLERY_SECTION_TITLES: Record<Locale, string> = {
  de: 'Galerie der Arbeiten',
  en: 'Work gallery',
  ru: 'Галерея работ',
  tr: 'İş galerisi',
  pl: 'Galeria prac',
  ar: 'معرض الأعمال',
};

const REPORT_HOOKS: Record<Locale, ReportHook[]> = {
  de: [
    { title: 'Passanten entscheiden in Sekunden.', text: 'Laut FedEx Office betraten 76% der Befragten ein unbekanntes Geschäft wegen seiner Beschilderung; 68% kauften etwas, weil ein Schild ihre Aufmerksamkeit gewann. Wenn das Licht ausfällt, verliert der Standort diesen ersten Moment.' },
    { title: 'Schlechtes Licht kostet Vertrauen.', text: '52% der Menschen gehen weniger gern in ein Geschäft mit schlecht gemachten Schildern. Die Sign Research Foundation nennt Fälle, in denen gezielte Updates der Außenbeschilderung bis zu 16% mehr Wochenumsatz brachten.' },
  ],
  en: [
    { title: 'People decide in seconds.', text: 'FedEx Office found that 76% of consumers entered a store they had never visited because of its signs, and 68% bought a product or service because a sign caught their eye. If the light fails, the business loses that first chance.' },
    { title: 'Bad light weakens trust.', text: '52% of people are less willing to enter a store with poorly made signage. Sign Research Foundation cites cases where targeted exterior sign updates produced up to 16% higher weekly sales.' },
  ],
  ru: [
    { title: 'Прохожий решает за секунды.', text: 'В исследовании FedEx Office 76% людей заходили в незнакомый магазин из-за вывески, а 68% покупали товар или услугу, потому что знак привлек внимание. Если свет не работает, бизнес теряет этот первый шанс.' },
    { title: 'Плохой свет бьет по доверию.', text: '52% людей менее охотно заходят в место с плохо сделанной вывеской. По данным Sign Research Foundation, обновление наружной вывески в отдельных кейсах давало до 16% роста недельных продаж.' },
  ],
  tr: [
    { title: 'İnsanlar saniyeler içinde karar verir.', text: 'FedEx Office araştırmasına göre tüketicilerin %76’sı tabelası sayesinde daha önce gitmediği bir mağazaya girdi; %68’i de dikkatini çeken bir tabela nedeniyle ürün veya hizmet satın aldı. Işık çalışmıyorsa işletme bu ilk şansı kaybeder.' },
    { title: 'Kötü ışık güveni zayıflatır.', text: 'İnsanların %52’si kötü yapılmış tabelası olan bir yere girmeye daha az isteklidir. Sign Research Foundation, dış tabela güncellemelerinin bazı örneklerde haftalık satışları %16’ya kadar artırdığını bildirir.' },
  ],
  pl: [
    { title: 'Ludzie decydują w kilka sekund.', text: 'Według FedEx Office 76% konsumentów weszło do nieznanego sklepu dzięki jego oznakowaniu, a 68% kupiło produkt lub usługę, bo szyld przyciągnął uwagę. Jeśli światło nie działa, firma traci tę pierwszą szansę.' },
    { title: 'Złe światło osłabia zaufanie.', text: '52% osób mniej chętnie wchodzi do miejsca ze źle wykonaną reklamą. Sign Research Foundation podaje przypadki, w których celowa aktualizacja zewnętrznego szyldu dawała do 16% wzrostu tygodniowej sprzedaży.' },
  ],
  ar: [
    { title: 'الناس يقررون خلال ثوانٍ.', text: 'وجدت دراسة FedEx Office أن 76% من المستهلكين دخلوا متجراً لم يزوروه من قبل بسبب لافتته، وأن 68% اشتروا منتجاً أو خدمة لأن اللافتة جذبت انتباههم. إذا تعطل الضوء، يخسر الموقع هذه الفرصة الأولى.' },
    { title: 'الإضاءة السيئة تضعف الثقة.', text: '52% من الناس أقل استعداداً لدخول مكان ذي لافتة رديئة التنفيذ. وتشير Sign Research Foundation إلى حالات رفعت فيها تحديثات الواجهة الخارجية المبيعات الأسبوعية حتى 16%.' },
  ],
};

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}

export default function ReferencesExperience({ content }: ReferencesExperienceProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselPausedRef = useRef(false);
  const galleryCarouselRef = useRef<HTMLDivElement | null>(null);
  const activeDialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const caseCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const photoCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const promoCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeCaseImage, setActiveCaseImage] = useState(1);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(content.viewerAllLabel);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const isRtl = content.locale === 'ar';
  const reportHooks = content.reportHooks?.length ? content.reportHooks : REPORT_HOOKS[content.locale];

  const heroSlides = useMemo(
    () =>
      content.heroSlides?.length
        ? content.heroSlides
        : content.cases
            .slice(0, 5)
            .map((item) => item.afterImage)
            .filter(Boolean),
    [content.heroSlides, content.cases]
  );

  const activeCase = useMemo(
    () => content.cases.find((item) => item.id === activeCaseId) ?? null,
    [activeCaseId, content.cases]
  );

  const photoCategories = useMemo(
    () => [
      content.viewerAllLabel,
      ...Array.from(
        new Set(
          content.galleryItems
            .map((item) => item.category?.trim())
            .filter(
              (category): category is string =>
                Boolean(category && category !== content.viewerAllLabel)
            )
        )
      ),
    ],
    [content.galleryItems, content.viewerAllLabel]
  );

  const filteredPhotos = useMemo(() => {
    if (activeFilter === content.viewerAllLabel) {
      return content.galleryItems;
    }

    return content.galleryItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, content.galleryItems, content.viewerAllLabel]);

  const activePhoto = useMemo(
    () =>
      content.galleryItems.find((item) => item.id === activePhotoId) ??
      filteredPhotos[0] ??
      content.galleryItems[0] ??
      null,
    [activePhotoId, content.galleryItems, filteredPhotos]
  );

  const activePhotoPosition = activePhoto
    ? Math.max(0, filteredPhotos.findIndex((item) => item.id === activePhoto.id)) + 1
    : 0;

  const activeDialogType = activeCase ? 'case' : activePhotoId ? 'photo' : isPromoModalOpen ? 'promo' : null;

  const closeActiveDialog = useCallback(() => {
    setActiveCaseId(null);
    setActivePhotoId(null);
    setIsPromoModalOpen(false);
  }, []);

  useLockBodyScroll(Boolean(activeDialogType));

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [heroSlides.length]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) {
      return;
    }

    let frameId = 0;
    let lastFrame = performance.now();
    let initialized = false;

    const tick = (now: number) => {
      const delta = Math.min(now - lastFrame, 34);
      const loopWidth = carousel.scrollWidth / 3;

      if (!initialized && loopWidth > carousel.clientWidth) {
        carousel.scrollLeft = loopWidth;
        initialized = true;
      }

      if (loopWidth > carousel.clientWidth) {
        if (carousel.scrollLeft >= loopWidth * 2) {
          carousel.scrollLeft -= loopWidth;
        }

        if (carousel.scrollLeft <= 0) {
          carousel.scrollLeft += loopWidth;
        }
      }

      if (!carouselPausedRef.current && loopWidth > carousel.clientWidth) {
        carousel.scrollLeft += delta * 0.034;
      }

      lastFrame = now;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [content.cases]);

  const movePhoto = useCallback(
    (direction: number) => {
      if (!activePhoto || filteredPhotos.length === 0) {
        return;
      }

      const currentIndex = filteredPhotos.findIndex((item) => item.id === activePhoto.id);
      const nextIndex = (currentIndex + direction + filteredPhotos.length) % filteredPhotos.length;
      setActivePhotoId(filteredPhotos[nextIndex]?.id ?? activePhoto.id);
    },
    [activePhoto, filteredPhotos]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeActiveDialog();
        return;
      }

      if (event.key === 'Tab' && activeDialogType && activeDialogRef.current?.contains(document.activeElement)) {
        const focusableElements = Array.from(
          activeDialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => element.getClientRects().length > 0);

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
          return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }

        return;
      }

      if (!activePhoto) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        movePhoto(isRtl ? 1 : -1);
      }

      if (event.key === 'ArrowRight') {
        movePhoto(isRtl ? -1 : 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeDialogType, activePhoto, closeActiveDialog, isRtl, movePhoto]);

  useEffect(() => {
    if (!activeDialogType) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusTarget =
      activeDialogType === 'case'
        ? caseCloseButtonRef.current
        : activeDialogType === 'photo'
          ? photoCloseButtonRef.current
          : promoCloseButtonRef.current;

    window.setTimeout(() => focusTarget?.focus(), 0);

    return () => {
      const previousFocus = previousFocusRef.current;
      window.setTimeout(() => previousFocus?.focus(), 0);
    };
  }, [activeDialogType]);

  const openCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setActivePhotoId(null);
    setIsPromoModalOpen(false);
    setActiveCaseImage(1);
  };

  const openPhoto = (photoId: string) => {
    setActiveFilter(content.viewerAllLabel);
    setActiveCaseId(null);
    setIsPromoModalOpen(false);
    setActivePhotoId(photoId);
  };

  const selectFilter = (category: string) => {
    setActiveFilter(category);
    const nextPhoto =
      category === content.viewerAllLabel
        ? content.galleryItems[0]
        : content.galleryItems.find((item) => item.category === category);
    setActivePhotoId(nextPhoto?.id ?? null);
  };

  const getRecentCardClass = (index: number) => {
    return index % 3 === 1
      ? 'h-[390px] w-[390px] sm:h-[420px] sm:w-[420px]'
      : 'h-[390px] w-[268px] sm:h-[420px] sm:w-[290px]';
  };

  const renderRecentWorkCard = (item: ReferenceCase, key: string, index: number, isClone = false) => (
    <button
      key={key}
      type="button"
      aria-hidden={isClone}
      tabIndex={isClone ? -1 : undefined}
      onClick={() => openCase(item.id)}
      className={`${getRecentCardClass(index)} group relative shrink-0 overflow-hidden rounded-[24px] bg-[#101418] text-left shadow-xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]`}
    >
      <Image src={item.afterImage} alt="" fill sizes="(min-width: 1024px) 420px, 78vw" className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0 group-focus-visible:scale-105 group-focus-visible:opacity-0" />
      <Image src={item.beforeImage} alt="" fill sizes="(min-width: 1024px) 420px, 78vw" className="object-cover opacity-0 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-80 group-focus-visible:scale-105 group-focus-visible:opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-white/70">{item.category}</p>
        {isClone ? (
          <div className="mt-2 text-2xl font-black leading-tight">{item.title}</div>
        ) : (
          <h3 className="mt-2 text-2xl font-black leading-tight">{item.title}</h3>
        )}
        <p className="mt-3 min-h-[56px] text-[14px] font-semibold leading-7 text-white/78">
          <span className="group-hover:hidden group-focus-visible:hidden">{item.defaultText}</span>
          <span className="hidden group-hover:inline group-focus-visible:inline">{item.beforeText}</span>
        </p>
      </div>
    </button>
  );

  const getGalleryCardClass = (variant: GalleryCardVariant) => {
    switch (variant) {
      case 'large':
        return 'h-[360px] w-[360px] sm:h-[440px] sm:w-[440px]';
      case 'vertical':
        return 'h-[360px] w-[190px] sm:h-[440px] sm:w-[236px]';
      case 'small':
        return 'h-[172px] w-[172px] sm:h-[212px] sm:w-[212px]';
      case 'wide':
        return 'h-[172px] w-[566px] sm:h-[212px] sm:w-[692px]';
    }
  };

  const renderGalleryCard = (item: GalleryItem, key: string, variant: GalleryCardVariant, isClone = false) => {
    const isSmall = variant === 'small';

    return (
      <button
        key={key}
        type="button"
        tabIndex={isClone ? -1 : undefined}
        onClick={() => openPhoto(item.id)}
        onPointerUp={(event) => {
          if (event.pointerType === 'mouse' && event.button === 0) {
            openPhoto(item.id);
          }
        }}
        onMouseUp={(event) => {
          if (event.button === 0) {
            openPhoto(item.id);
          }
        }}
        className={`${getGalleryCardClass(variant)} group relative shrink-0 overflow-hidden rounded-[22px] bg-[#101418] text-left shadow-lg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]`}
      >
        <Image src={item.image} alt="" fill sizes={variant === 'wide' ? '692px' : isSmall ? '212px' : '440px'} className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-black/10" />
        <div className={`${isSmall ? 'p-4' : 'p-5'} absolute inset-x-0 bottom-0 text-white`}>
          <p className={`${isSmall ? 'text-[10px]' : 'text-[11px]'} font-black uppercase tracking-[0.16em] text-white/70`}>{item.category}</p>
          {isClone ? (
            <div className={`${isSmall ? 'mt-1 text-sm leading-tight' : 'mt-1 text-lg'} font-black`}>{item.title}</div>
          ) : (
            <h3 className={`${isSmall ? 'mt-1 text-sm leading-tight' : 'mt-1 text-lg'} font-black`}>{item.title}</h3>
          )}
        </div>
      </button>
    );
  };

  const renderGalleryIntroPack = (items: GalleryItem[]) => {
    const [verticalItem, topSmallItem, bottomSmallItem, promoSideItem] = items;

    return (
      <div className="flex shrink-0 scroll-ml-[max(1rem,calc((100vw-80rem)/2+1.5rem))] flex-col gap-4 pr-4">
        <div className="flex shrink-0 items-start gap-4">
          <div className="relative h-[360px] w-[360px] shrink-0 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#1098CF,#1DB0C0_54%,#39B58C)] p-6 text-white shadow-lg sm:h-[440px] sm:w-[440px] sm:p-8">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/82">{content.galleryEyebrow}</p>
            <div className="absolute inset-x-6 bottom-24 text-[30px] font-black leading-[1.02] sm:inset-x-8 sm:text-[40px]">
              {content.galleryTitle}
            </div>
            <p className="absolute inset-x-6 bottom-7 line-clamp-3 text-[13px] font-semibold leading-6 text-white/78 sm:inset-x-8 sm:text-[14px]">
              {content.galleryIntro}
            </p>
          </div>
          {verticalItem ? renderGalleryCard(verticalItem, verticalItem.id, 'vertical') : null}
          {topSmallItem || bottomSmallItem ? (
            <div className="flex shrink-0 flex-col gap-4">
              {topSmallItem ? renderGalleryCard(topSmallItem, topSmallItem.id, 'small') : null}
              {bottomSmallItem ? renderGalleryCard(bottomSmallItem, bottomSmallItem.id, 'small') : null}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-start gap-4">
          <button
            type="button"
            onClick={() => {
              setActiveCaseId(null);
              setActivePhotoId(null);
              setIsPromoModalOpen(true);
            }}
            className="group relative grid h-[172px] w-[566px] shrink-0 grid-cols-[0.72fr_1fr] items-center gap-5 overflow-hidden rounded-[22px] border border-[#E3DDD4] bg-[#F7F1E8] px-6 text-left shadow-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] sm:h-[212px] sm:w-[692px]"
          >
            <Image src="/images/hero-neon.jpg" alt="" fill sizes="692px" className="object-cover opacity-20 transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105" />
            <div className="relative z-10 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B8643E]">{content.galleryPromoEyebrow}</p>
              <div className="mt-2 text-[24px] font-black leading-none text-[#0E1A2B] sm:text-[30px]">{content.galleryPromoTitle}</div>
              <p className="mt-2 text-[13px] font-extrabold text-[#24594D]">{content.galleryPromoCta}</p>
            </div>
            <p className="relative z-10 line-clamp-3 text-[13px] font-semibold leading-6 text-[#4A5568]">{content.galleryPromoText}</p>
          </button>
          {promoSideItem ? renderGalleryCard(promoSideItem, promoSideItem.id, 'small') : null}
        </div>
      </div>
    );
  };

  const renderGalleryPhotoPack = (items: GalleryItem[], packIndex: number) => {
    const [largeItem, verticalItem, topSmallItem, bottomSmallItem, wideItem, sideSmallItem] = items;

    if (!largeItem) {
      return null;
    }

    return (
      <div key={`gallery-pack-${packIndex}`} className="flex shrink-0 flex-col gap-4 pr-4">
        <div className="flex shrink-0 items-start gap-4">
          {renderGalleryCard(largeItem, largeItem.id, 'large')}
          {verticalItem ? renderGalleryCard(verticalItem, verticalItem.id, 'vertical') : null}
          {topSmallItem || bottomSmallItem ? (
            <div className="flex shrink-0 flex-col gap-4">
              {topSmallItem ? renderGalleryCard(topSmallItem, topSmallItem.id, 'small') : null}
              {bottomSmallItem ? renderGalleryCard(bottomSmallItem, bottomSmallItem.id, 'small') : null}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-start gap-4">
          {wideItem ? renderGalleryCard(wideItem, wideItem.id, 'wide') : null}
          {sideSmallItem ? renderGalleryCard(sideSmallItem, sideSmallItem.id, 'small') : null}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-grow bg-white text-[#101418]">
      <section className="relative isolate flex h-[440px] overflow-hidden bg-[#08111C] sm:h-[500px] lg:h-[560px]">
        {heroSlides.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
              index === activeHeroSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111C]/82 via-[#08111C]/28 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08111C]/48 via-[#08111C]/12 to-transparent rtl:bg-gradient-to-l" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-14 lg:px-10 lg:pb-16">
          <div className="max-w-[860px]">
            <h1 className="max-w-[860px] text-[36px] font-black leading-[1.05] text-white sm:text-[52px] lg:text-[60px]">
              {content.heroTitle}
            </h1>
            <p className="mt-5 max-w-[720px] text-[16px] font-semibold leading-relaxed text-white/88 sm:text-[18px]">
              {content.heroIntro}
            </p>
          </div>
        </div>
      </section>

      <section id="recent-work" className="scroll-mt-32 overflow-hidden bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className={SECTION_HEADING_CLASS}>
            {content.recentTitle}
          </h2>
          <p className={SECTION_INTRO_CLASS}>{content.recentIntro}</p>
        </div>
        <div
          ref={carouselRef}
          onMouseEnter={() => {
            carouselPausedRef.current = true;
          }}
          onMouseLeave={() => {
            carouselPausedRef.current = false;
          }}
          onFocus={() => {
            carouselPausedRef.current = true;
          }}
          onBlur={() => {
            carouselPausedRef.current = false;
          }}
          onPointerDown={() => {
            carouselPausedRef.current = true;
          }}
          onPointerUp={() => {
            carouselPausedRef.current = false;
          }}
          onPointerCancel={() => {
            carouselPausedRef.current = false;
          }}
          className="no-scrollbar mt-10 overflow-x-auto px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pb-4"
          dir="ltr"
        >
          <div className="flex w-max gap-4">
            {[0, 1, 2].flatMap((cycle) =>
              content.cases.map((item, index) =>
                renderRecentWorkCard(item, `${item.id}-${cycle}`, index + cycle * content.cases.length, cycle !== 1)
              )
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F1E8] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className={SECTION_HEADING_CLASS}>{content.reportTitle}</h2>
          <p className={SECTION_INTRO_CLASS}>{content.reportIntro}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {reportHooks.map((hook) => (
              <article key={hook.id ?? hook.title} className="border-l-2 border-[#B8643E] pl-5">
                <h3 className="text-2xl font-black leading-tight text-[#0E1A2B] sm:text-[28px]">{hook.title}</h3>
                <p className="mt-3 text-[16px] font-semibold leading-7 text-[#5D6662]">{hook.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-32 overflow-hidden bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className={SECTION_HEADING_CLASS}>
            {GALLERY_SECTION_TITLES[content.locale]}
          </h2>
          <p className={SECTION_INTRO_CLASS}>{content.galleryIntro}</p>
        </div>
        <div className="relative mt-7">
          <div
            ref={galleryCarouselRef}
            className="no-scrollbar overflow-x-auto scroll-smooth px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pb-4"
            dir="ltr"
          >
            <div className="flex w-max items-start">
              {renderGalleryIntroPack(content.galleryItems.slice(0, 4))}
              {Array.from({ length: Math.ceil(Math.max(0, content.galleryItems.length - 4) / 6) }).map((_, index) =>
                renderGalleryPhotoPack(content.galleryItems.slice(4 + index * 6, 10 + index * 6), index)
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#EEF3FB] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className={SECTION_HEADING_CLASS}>{content.categoriesTitle}</h2>
          <p className={SECTION_INTRO_CLASS}>{content.categoriesIntro}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.productCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  selectFilter(item.filter);
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group overflow-hidden rounded-[22px] border border-white bg-white text-left shadow-sm outline-none transition-all hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black leading-tight text-[#0E1A2B]">{item.title}</h3>
                  <p className="mt-3 text-[15px] font-medium leading-7 text-[#5D6662]">{item.text}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="references-type-band" aria-hidden="true">
        <div className="references-type-line">
          {content.typeBandLines[0]} - <em>{content.typeBandLines[1]}</em> - {content.typeBandLines[2]} - {content.typeBandLines[0]} - <em>{content.typeBandLines[1]}</em> - {content.typeBandLines[2]}
        </div>
        <div className="references-type-line references-type-line-reverse">
          {content.typeBandLines[2]} - <em>{content.typeBandLines[0]}</em> - {content.typeBandLines[1]} - {content.typeBandLines[2]} - <em>{content.typeBandLines[0]}</em> - {content.typeBandLines[1]}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#24594D] p-8 text-white sm:p-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
          <div>
            <h2 className="max-w-3xl text-3xl font-black leading-[1.08] sm:text-5xl">{content.finalTitle}</h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-8 text-white/78">{content.finalText}</p>
          </div>
          <div className="mt-8 lg:mt-0">
            <LeistungenRequestButton
              label={content.finalCta}
              serviceIntent="diagnose"
              className="!bg-white !text-[#0E1A2B] hover:!bg-[#F7F1E8]"
            />
          </div>
        </div>
      </section>

      {activeCase && (
        <div ref={activeDialogRef} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reference-case-title" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setActiveCaseId(null);
          }
        }}>
          <div className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[320px] bg-[#101418] lg:min-h-[620px]">
              <Image src={activeCase.gallery[activeCaseImage] ?? activeCase.afterImage} alt="" fill sizes="60vw" className="object-cover" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto rounded-2xl bg-black/36 p-2 backdrop-blur">
                {activeCase.gallery.map((src, index) => (
                  <button
                    key={`${activeCase.id}-${src}`}
                    type="button"
                    onClick={() => setActiveCaseImage(index)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${index === activeCaseImage ? 'border-white' : 'border-white/20'}`}
                    aria-label={`Image ${index + 1}`}
                  >
                    <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#B8643E]">{activeCase.category}</p>
                  <h2 id="reference-case-title" className="mt-2 text-3xl font-black leading-tight text-[#0E1A2B]">{activeCase.title}</h2>
                </div>
                <button ref={caseCloseButtonRef} type="button" onClick={() => setActiveCaseId(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D9C7BA] text-2xl leading-none text-[#4A5568]" aria-label={content.viewerCloseLabel}>
                  ×
                </button>
              </div>
              <div className="mt-8 space-y-5">
                {[
                  [content.modalProblemLabel, activeCase.problem],
                  [content.modalWorkLabel, activeCase.work],
                  [content.modalResultLabel, activeCase.result],
                ].map(([label, value]) => (
                  <section key={label} className="rounded-[18px] border border-[#E7DDD3] bg-[#FFFDF9] p-5">
                    <h3 className="text-[13px] font-black uppercase tracking-[0.14em] text-[#B8643E]">{label}</h3>
                    <p className="mt-2 text-[15px] font-medium leading-7 text-[#4A5568]">{value}</p>
                  </section>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={() => setActiveCaseImage(0)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#D9C7BA] bg-white px-5 py-3 text-[15px] font-bold text-[#4E5A5A] hover:border-[#B8643E]">
                  {content.modalBeforeLabel}
                </button>
                <LeistungenRequestButton label={content.modalCta} serviceIntent="diagnose" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activePhoto && activePhotoId && (
        <div ref={activeDialogRef} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/82 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reference-photo-title">
          <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] bg-[#101418] text-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/58">{activePhoto.category} · {activePhotoPosition} / {filteredPhotos.length}</p>
                <h2 id="reference-photo-title" className="mt-1 text-lg font-black sm:text-2xl">{activePhoto.title}</h2>
              </div>
              <button ref={photoCloseButtonRef} type="button" onClick={() => setActivePhotoId(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-2xl leading-none" aria-label={content.viewerCloseLabel}>
                ×
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <div className="relative h-[min(58vh,620px)] bg-black">
                <Image src={activePhoto.image} alt="" fill sizes="100vw" className="object-contain" />
                <button type="button" onClick={() => movePhoto(isRtl ? 1 : -1)} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/14 text-2xl backdrop-blur hover:bg-white/22" aria-label="Previous photo">
                  ‹
                </button>
                <button type="button" onClick={() => movePhoto(isRtl ? -1 : 1)} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/14 text-2xl backdrop-blur hover:bg-white/22" aria-label="Next photo">
                  ›
                </button>
              </div>
              <div className="border-t border-white/10 p-4">
                <p className="max-w-3xl text-[14px] font-medium leading-6 text-white/68">{activePhoto.description}</p>
                <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
                  {photoCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => selectFilter(category)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
                        category === activeFilter ? 'border-white bg-white text-[#101418]' : 'border-white/18 bg-white/8 text-white/72 hover:bg-white/14'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  {filteredPhotos.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActivePhotoId(item.id)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${item.id === activePhoto.id ? 'border-white' : 'border-white/18'}`}
                      aria-label={item.title}
                    >
                      <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPromoModalOpen && (
        <div ref={activeDialogRef} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/78 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reference-video-title" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setIsPromoModalOpen(false);
          }
        }}>
          <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-[#101418] text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/58">{content.galleryPromoEyebrow}</p>
                <h2 id="reference-video-title" className="mt-1 text-2xl font-black leading-tight sm:text-3xl">{content.galleryPromoTitle}</h2>
              </div>
              <button ref={promoCloseButtonRef} type="button" onClick={() => setIsPromoModalOpen(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-2xl leading-none" aria-label={content.viewerCloseLabel}>
                ×
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <div className="relative aspect-video overflow-hidden rounded-[22px] bg-black">
                <Image src="/images/hero-neon.jpg" alt="" fill sizes="896px" className="object-cover opacity-38" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,152,207,0.55),rgba(36,89,77,0.72))]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/16 text-4xl shadow-2xl backdrop-blur">
                    ▶
                  </div>
                </div>
              </div>
              <p className="mt-5 max-w-3xl text-[15px] font-medium leading-7 text-white/70">{content.galleryPromoText}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
