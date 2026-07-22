'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PhotoIcon, PlayIcon } from '@heroicons/react/24/solid';

import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import CmsImage from '@/components/common/CmsImage';
import SectionEyebrow from '@/components/common/SectionEyebrow';

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
  beforeAlt?: string;
  afterAlt?: string;
  defaultText: string;
  beforeText: string;
  gallery: string[];
  galleryAlts?: string[];
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  imageAlt?: string;
  description: string;
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

export type ReferencesBlockVisibility = {
  hero: boolean;
  recentIntro: boolean;
  cases: boolean;
  reportIntro: boolean;
  reportHooks: boolean;
  reports: boolean;
  galleryIntro: boolean;
  galleryItems: boolean;
  promo: boolean;
  typeBand: boolean;
  finalCta: boolean;
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
  reportImage: string;
  reportImageAlt: string;
  reportHooks: ReportHook[];
  reports: ReportRow[];
  galleryEyebrow: string;
  gallerySectionTitle: string;
  galleryTitle: string;
  galleryIntro: string;
  galleryPromoEyebrow: string;
  galleryPromoTitle: string;
  galleryPromoText: string;
  galleryPromoCta: string;
  galleryPromoHref: string;
  typeBandLines: string[];
  finalEyebrow: string;
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
  heroSlides?: string[];
  blockVisibility?: ReferencesBlockVisibility;
};

type ReferencesExperienceProps = {
  content: ReferencesContent;
};

type GalleryCardVariant = 'large' | 'vertical' | 'small' | 'wide';

const FILIAL_MAINTENANCE_WIDE_GALLERY_ITEM_ID = 'gallery-filial-maintenance-wide';
const GALLERY_VIDEO_SRC = '/videos/libitina-bestattungen-projekt.mp4';
const GALLERY_VIDEO_POSTER = '/images/ex-repair-libitina-leuchtkasten-fassade.webp';

const SECTION_HEADING_CLASS =
  'max-w-4xl text-[36px] font-extrabold leading-[42px] tracking-[0] text-[#081827] sm:text-[40px] sm:leading-[46px] lg:text-[44px] lg:leading-[50px]';
const SECTION_INTRO_CLASS = 'mt-6 max-w-[580px] text-[18px] font-normal leading-[1.6] tracking-[0] text-[#526174]';
const SECTION_INTRO_ACCENT_CLASS =
  `${SECTION_INTRO_CLASS} border-l-2 border-[#B8643E] pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4`;

function renderReportTitle(title: string) {
  const normalizedTitle = title.trim();
  return /[.!?؟]$/u.test(normalizedTitle) ? normalizedTitle : `${normalizedTitle}.`;
}

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

function HeroImageCarousel({ slides }: { slides: string[] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const visibleSlide = slides.length > 0 ? activeSlide % slides.length : 0;

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {slides.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
            index === visibleSlide ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <CmsImage
            src={src}
            alt=""
            fill
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            className="object-cover opacity-85"
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}

export default function ReferencesExperience({ content }: ReferencesExperienceProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselPausedRef = useRef(false);
  const galleryCarouselRef = useRef<HTMLDivElement | null>(null);
  const activeDialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const restoreFocusAfterDialogRef = useRef(false);
  const caseCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const photoCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const videoCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeCaseImage, setActiveCaseImage] = useState(0);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(content.viewerAllLabel);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const isRtl = content.locale === 'ar';
  const visibility: ReferencesBlockVisibility = {
    hero: true,
    recentIntro: true,
    cases: true,
    reportIntro: true,
    reportHooks: true,
    reports: true,
    galleryIntro: true,
    galleryItems: true,
    promo: true,
    typeBand: true,
    finalCta: true,
    ...content.blockVisibility,
  };
  const heroSlides = useMemo(
    () =>
      content.heroSlides !== undefined
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
      filteredPhotos.find((item) => item.id === activePhotoId) ??
      filteredPhotos[0] ??
      null,
    [activePhotoId, filteredPhotos]
  );

  const activePhotoPosition = activePhoto
    ? Math.max(0, filteredPhotos.findIndex((item) => item.id === activePhoto.id)) + 1
    : 0;

  const activeDialogType = activeCase
    ? 'case'
    : activePhoto && activePhotoId
      ? 'photo'
      : isVideoModalOpen
        ? 'video'
        : null;

  const closeActiveDialog = useCallback(() => {
    setActiveCaseId(null);
    setActivePhotoId(null);
    setIsVideoModalOpen(false);
  }, []);

  useLockBodyScroll(Boolean(activeDialogType));

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
          : videoCloseButtonRef.current;
    const shouldRestoreFocus = restoreFocusAfterDialogRef.current;

    window.setTimeout(() => focusTarget?.focus(), 0);

    return () => {
      const previousFocus = previousFocusRef.current;
      if (shouldRestoreFocus) {
        window.setTimeout(() => previousFocus?.focus(), 0);
      }
    };
  }, [activeDialogType]);

  const openCase = (caseId: string, shouldRestoreFocus = false) => {
    restoreFocusAfterDialogRef.current = shouldRestoreFocus;
    setActiveCaseId(caseId);
    setActivePhotoId(null);
    setIsVideoModalOpen(false);
    setActiveCaseImage(0);
  };

  const openPhoto = (photoId: string, shouldRestoreFocus = false) => {
    restoreFocusAfterDialogRef.current = shouldRestoreFocus;
    setActiveFilter(content.viewerAllLabel);
    setActiveCaseId(null);
    setIsVideoModalOpen(false);
    setActivePhotoId(photoId);
  };

  const openVideo = (shouldRestoreFocus = false) => {
    restoreFocusAfterDialogRef.current = shouldRestoreFocus;
    setActiveCaseId(null);
    setActivePhotoId(null);
    setIsVideoModalOpen(true);
  };

  const selectFilter = (category: string) => {
    setActiveFilter(category);
    const nextPhoto =
      category === content.viewerAllLabel
        ? content.galleryItems[0]
        : content.galleryItems.find((item) => item.category === category);
    setActivePhotoId(nextPhoto?.id ?? null);
  };

  const openGalleryCategory = (category: string) => {
    restoreFocusAfterDialogRef.current = true;
    selectFilter(category);
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
      onClick={(event) => openCase(item.id, event.detail === 0)}
      className={`${getRecentCardClass(index)} group relative shrink-0 overflow-hidden rounded-[24px] bg-[#101418] text-left shadow-xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]`}
    >
      <Image src={item.afterImage} alt={item.afterAlt ?? item.title} fill sizes="(min-width: 1024px) 420px, 78vw" className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0 group-focus-visible:scale-105 group-focus-visible:opacity-0" />
      <Image src={item.beforeImage} alt={item.beforeAlt ?? item.beforeText} fill sizes="(min-width: 1024px) 420px, 78vw" className="object-cover opacity-0 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-80 group-focus-visible:scale-105 group-focus-visible:opacity-80" />
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
        onClick={(event) => openPhoto(item.id, event.detail === 0)}
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
        <Image src={item.image} alt={item.imageAlt ?? item.title} fill sizes={variant === 'wide' ? '692px' : isSmall ? '212px' : '440px'} className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105" />
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
    const featuredPhoto = content.galleryItems[4] ?? content.galleryItems[0] ?? null;

    return (
      <div className="flex shrink-0 scroll-ml-[max(1rem,calc((100vw-80rem)/2+1.5rem))] flex-col gap-4 pr-4">
        <div className="flex shrink-0 items-start gap-4">
          {visibility.galleryIntro ? (
            <button
              type="button"
              onClick={(event) => openVideo(event.detail === 0)}
              className="group relative h-[360px] w-[360px] shrink-0 overflow-hidden rounded-[22px] bg-[#101418] text-left text-white shadow-lg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] sm:h-[440px] sm:w-[440px]"
              aria-label={`${content.galleryTitle}: ${content.galleryIntro}`}
            >
              <video
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105"
                src={GALLERY_VIDEO_SRC}
                poster={GALLERY_VIDEO_POSTER}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-black/16" />
              <div className="absolute inset-x-6 top-6 sm:inset-x-8 sm:top-8">
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/82">{content.galleryEyebrow}</p>
              </div>
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/28 bg-black/34 text-white shadow-2xl backdrop-blur-sm transition-transform group-hover:scale-105 group-focus-visible:scale-105">
                <PlayIcon className="h-7 w-7 translate-x-0.5" aria-hidden="true" />
              </span>
              <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                <div className="text-[30px] font-black leading-[1.02] sm:text-[40px]">{content.galleryTitle}</div>
                <p className="mt-3 line-clamp-3 text-[13px] font-semibold leading-6 text-white/78 sm:text-[14px]">{content.galleryIntro}</p>
              </div>
            </button>
          ) : null}
          {verticalItem ? renderGalleryCard(verticalItem, verticalItem.id, 'vertical') : null}
          {topSmallItem || bottomSmallItem ? (
            <div className="flex shrink-0 flex-col gap-4">
              {topSmallItem ? renderGalleryCard(topSmallItem, topSmallItem.id, 'small') : null}
              {bottomSmallItem ? renderGalleryCard(bottomSmallItem, bottomSmallItem.id, 'small') : null}
            </div>
          ) : null}
        </div>
        {visibility.promo || promoSideItem ? (
          <div className="flex shrink-0 items-start gap-4">
            {visibility.promo ? (
              <button
                type="button"
                onClick={(event) => featuredPhoto && openPhoto(featuredPhoto.id, event.detail === 0)}
                disabled={!featuredPhoto}
                className="group relative h-[172px] w-[calc(100vw-2rem)] shrink-0 overflow-hidden rounded-[22px] bg-[#101418] text-left text-white shadow-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] disabled:cursor-default sm:h-[212px] sm:w-[692px]"
              >
                {featuredPhoto ? (
                  <Image src={featuredPhoto.image} alt={featuredPhoto.imageAlt ?? featuredPhoto.title} fill sizes="692px" className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-visible:scale-105" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/58 to-black/16 rtl:bg-gradient-to-l" />
                <div className="absolute inset-y-0 left-0 z-10 flex max-w-[540px] flex-col justify-center px-6 rtl:left-auto rtl:right-0 sm:px-8">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/72">
                    <PhotoIcon className="h-4 w-4" aria-hidden="true" />
                    <span>{content.galleryPromoEyebrow}</span>
                  </div>
                  <div className="mt-2 text-[25px] font-black leading-none sm:text-[31px]">{content.galleryPromoTitle}</div>
                  <p className="mt-3 line-clamp-2 text-[13px] font-semibold leading-6 text-white/76">{content.galleryPromoText}</p>
                  <p className="mt-3 text-[13px] font-black text-white">{content.galleryPromoCta}</p>
                </div>
              </button>
            ) : null}
            {promoSideItem ? renderGalleryCard(promoSideItem, promoSideItem.id, 'small') : null}
          </div>
        ) : null}
      </div>
    );
  };

  const renderGalleryPhotoPack = (items: GalleryItem[], packIndex: number) => {
    const maintenanceWideItem = items.find(
      (item) => item.id === FILIAL_MAINTENANCE_WIDE_GALLERY_ITEM_ID
    );
    const standardItems = items.filter(
      (item) => item.id !== FILIAL_MAINTENANCE_WIDE_GALLERY_ITEM_ID
    );
    const [largeItem, verticalItem, topSmallItem, bottomSmallItem, wideItem, sideSmallItem] = standardItems;
    const resolvedWideItem = maintenanceWideItem ?? wideItem;

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
          {resolvedWideItem ? renderGalleryCard(resolvedWideItem, resolvedWideItem.id, 'wide') : null}
          {sideSmallItem ? renderGalleryCard(sideSmallItem, sideSmallItem.id, 'small') : null}
        </div>
      </div>
    );
  };

  const showRecent = visibility.recentIntro || (visibility.cases && content.cases.length > 0);
  const showReport =
    visibility.reportIntro &&
    Boolean(content.reportTitle.trim()) &&
    Boolean(content.reportImage.trim());
  const showGallery =
    visibility.galleryIntro ||
    visibility.promo ||
    (visibility.galleryItems && content.galleryItems.length > 0);
  return (
    <main className="flex-grow bg-white text-[#101418]">
      {visibility.hero ? (
        <section className="relative h-[520px] w-full overflow-hidden bg-[#0E1A2B] sm:h-[440px] lg:h-[480px]">
          <HeroImageCarousel slides={heroSlides} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/88 via-[#0E1A2B]/38 to-[#0E1A2B]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A2B]/55 via-[#0E1A2B]/16 to-transparent rtl:bg-gradient-to-l" />

          <div className="pr-site-container relative flex h-full flex-col justify-end pb-12 pt-28 sm:pb-14 lg:pb-16">
            <div className="max-w-[820px]">
              <div className="mb-4 h-1 w-20 bg-[#B8643E]" />
              <h1 className="text-[32px] font-extrabold leading-[1.05] text-white sm:text-[48px] lg:text-[60px]">
                {content.heroTitle}
              </h1>
            </div>
          </div>
        </section>
      ) : null}

      {showRecent ? (
        <section id="recent-work" className="scroll-mt-32 overflow-hidden bg-white pb-[100px] pt-[44px]">
          {visibility.recentIntro ? (
            <div className="pr-site-container">
              <SectionEyebrow className="mb-[43px]">{content.recentEyebrow}</SectionEyebrow>
              <h2 className={SECTION_HEADING_CLASS}>{content.recentTitle}</h2>
              <p className={SECTION_INTRO_ACCENT_CLASS}>{content.recentIntro}</p>
            </div>
          ) : null}
          {visibility.cases && content.cases.length > 0 ? (
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
              className={`${visibility.recentIntro ? 'mt-12' : ''} no-scrollbar overflow-x-auto px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pb-4`}
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
          ) : null}
        </section>
      ) : null}

      {showReport ? (
        <section className="bg-white py-10 sm:py-14 lg:py-16">
          <div className="pr-site-container">
            <div className="relative min-h-[510px] overflow-hidden rounded-[28px] bg-[#F3F5F6] sm:min-h-[560px] sm:rounded-[34px] lg:min-h-[530px] xl:min-h-[560px]">
              <Image
                src="/images/references/references-slogan-arcs-v1.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="pointer-events-none object-cover object-left rtl:-scale-x-100"
              />

              <div className="absolute inset-x-0 bottom-0 h-[56%] sm:h-[58%] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-[57%] rtl:lg:right-auto rtl:lg:left-0">
                <CmsImage
                  src={content.reportImage}
                  alt={content.reportImageAlt}
                  fill
                  sizes="(min-width: 1280px) 760px, (min-width: 1024px) 57vw, 100vw"
                  className="object-cover object-[64%_center] rtl:lg:object-[36%_center]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#F3F5F6_0%,rgba(243,245,246,0.9)_22%,rgba(243,245,246,0)_62%)] lg:hidden" />
                <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,#F3F5F6_0%,rgba(243,245,246,0.94)_18%,rgba(243,245,246,0.58)_38%,rgba(243,245,246,0)_68%)] lg:block rtl:bg-[linear-gradient(to_left,#F3F5F6_0%,rgba(243,245,246,0.94)_18%,rgba(243,245,246,0.58)_38%,rgba(243,245,246,0)_68%)]" />
              </div>

              <div className="relative z-10 flex min-h-[510px] items-start px-7 pt-10 sm:min-h-[560px] sm:px-12 sm:pt-14 lg:mr-auto lg:min-h-[530px] lg:w-[58%] lg:items-center lg:px-16 lg:py-16 xl:min-h-[560px] xl:px-20 rtl:lg:ml-auto rtl:lg:mr-0">
                <h2
                  className={`max-w-[660px] font-bold text-[#0E1A2B] [text-wrap:balance] ${
                    isRtl
                      ? 'text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.18] tracking-normal'
                      : 'text-[clamp(2.45rem,5.1vw,4.65rem)] leading-[1.02] tracking-[-0.04em]'
                  }`}
                >
                  {renderReportTitle(content.reportTitle)}
                </h2>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showGallery ? (
        <section id="gallery" className="scroll-mt-32 overflow-hidden bg-white pb-[100px] pt-[44px]">
          {visibility.galleryIntro ? (
            <div className="pr-site-container">
              <h2 className={SECTION_HEADING_CLASS}>{content.gallerySectionTitle}</h2>
              {visibility.galleryItems && content.galleryItems.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2" aria-label={content.gallerySectionTitle}>
                  {photoCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => openGalleryCategory(category)}
                      className="rounded-full border border-[#D9C7BA] bg-white px-4 py-2 text-[13px] font-bold text-[#4E5A5A] transition-colors hover:border-[#B8643E] hover:text-[#0E1A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          {visibility.promo || (visibility.galleryItems && content.galleryItems.length > 0) ? (
            <div className={`relative ${visibility.galleryIntro ? 'mt-12' : ''}`}>
              <div
                ref={galleryCarouselRef}
                className="pr-carousel-rail no-scrollbar overflow-x-auto scroll-smooth pb-4"
                dir="ltr"
              >
                <div className="flex w-max items-start">
                  {renderGalleryIntroPack(visibility.galleryItems ? content.galleryItems.slice(0, 4) : [])}
                  {visibility.galleryItems
                    ? Array.from({ length: Math.ceil(Math.max(0, content.galleryItems.length - 4) / 6) }).map((_, index) =>
                        renderGalleryPhotoPack(content.galleryItems.slice(4 + index * 6, 10 + index * 6), index)
                      )
                    : null}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {visibility.typeBand && content.typeBandLines.length >= 3 ? (
        <section className="references-type-band" aria-hidden="true">
          <div className="references-type-line">
            {content.typeBandLines[0]} - <em>{content.typeBandLines[1]}</em> - {content.typeBandLines[2]} - {content.typeBandLines[0]} - <em>{content.typeBandLines[1]}</em> - {content.typeBandLines[2]}
          </div>
          <div className="references-type-line references-type-line-reverse">
            {content.typeBandLines[2]} - <em>{content.typeBandLines[0]}</em> - {content.typeBandLines[1]} - {content.typeBandLines[2]} - <em>{content.typeBandLines[0]}</em> - {content.typeBandLines[1]}
          </div>
        </section>
      ) : null}

      {visibility.finalCta ? (
      <section className="bg-white py-14 sm:py-18">
        <div className="pr-site-container">
          <div
            className="grid gap-8 overflow-hidden rounded-[28px] border border-[#d3b2a2]/50 px-6 py-7 shadow-[0_18px_50px_rgba(8,24,39,0.08)] sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12"
            style={{
              background:
                'radial-gradient(circle at 88% 18%, rgba(184,100,62,0.16) 0%, transparent 30%), linear-gradient(135deg, #F3E7DE 0%, #EEF3F8 100%)',
            }}
          >
            <div className="min-w-0">
              <SectionEyebrow className="mb-5">{content.finalEyebrow}</SectionEyebrow>
              <h2 className="max-w-3xl text-[28px] font-extrabold leading-[1.12] tracking-[0] text-[#081827] sm:text-[34px] lg:text-[38px]">
                {content.finalTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-[#526174] sm:text-[17px]">
                {content.finalText}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <LeistungenRequestButton
                label={content.finalCta}
                serviceIntent="diagnose"
                className="min-h-[52px] px-7 text-[15px] font-black shadow-[0_16px_34px_rgba(184,100,62,0.22)]"
              />
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {activeCase && (
        <div ref={activeDialogRef} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="reference-case-title" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setActiveCaseId(null);
          }
        }}>
          <div className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[320px] bg-[#101418] lg:min-h-[620px]">
              <Image src={activeCase.gallery[activeCaseImage] ?? activeCase.afterImage} alt={activeCase.galleryAlts?.[activeCaseImage] ?? activeCase.afterAlt ?? activeCase.title} fill sizes="60vw" className="object-cover" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto rounded-2xl bg-black/36 p-2 backdrop-blur">
                {activeCase.gallery.map((src, index) => (
                  <button
                    key={`${activeCase.id}-${src}`}
                    type="button"
                    onClick={() => setActiveCaseImage(index)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${index === activeCaseImage ? 'border-white' : 'border-white/20'}`}
                    aria-label={`Image ${index + 1}`}
                  >
                    <Image src={src} alt={activeCase.galleryAlts?.[index] ?? `${activeCase.title} ${index + 1}`} fill sizes="96px" className="object-cover" />
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
                <Image src={activePhoto.image} alt={activePhoto.imageAlt ?? activePhoto.title} fill sizes="100vw" className="object-contain" />
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
                      <Image src={item.image} alt={item.imageAlt ?? item.title} fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isVideoModalOpen && (
        <div
          ref={activeDialogRef}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/82 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reference-video-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsVideoModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-4xl overflow-hidden rounded-[24px] bg-[#101418] text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/58">{content.galleryEyebrow}</p>
                <h2 id="reference-video-title" className="mt-1 text-lg font-black sm:text-2xl">{content.galleryTitle}</h2>
              </div>
              <button
                ref={videoCloseButtonRef}
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-2xl leading-none"
                aria-label={content.viewerCloseLabel}
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <video
                className="mx-auto max-h-[72vh] w-full rounded-[20px] bg-black object-contain"
                src={GALLERY_VIDEO_SRC}
                poster={GALLERY_VIDEO_POSTER}
                controls
                autoPlay
                playsInline
                preload="metadata"
              />
              <p className="mt-4 max-w-3xl text-[14px] font-medium leading-6 text-white/68">{content.galleryIntro}</p>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
