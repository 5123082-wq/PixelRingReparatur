'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@/i18n/routing';

export type WorkMediaItem = {
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

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type ViewerLabels = {
  title: string;
  close: string;
  previous: string;
  next: string;
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  service: string;
  example: string;
};

const LABELS: Record<Locale, ViewerLabels> = {
  de: {
    title: 'Arbeitsbeispiele', close: 'Ansicht schließen', previous: 'Vorheriges Beispiel', next: 'Nächstes Beispiel',
    play: 'Video abspielen', pause: 'Video pausieren', mute: 'Ton ausschalten', unmute: 'Ton einschalten', service: 'Zur Leistung', example: 'Beispiel',
  },
  en: {
    title: 'Work examples', close: 'Close viewer', previous: 'Previous example', next: 'Next example',
    play: 'Play video', pause: 'Pause video', mute: 'Mute sound', unmute: 'Enable sound', service: 'View service', example: 'Example',
  },
  ru: {
    title: 'Примеры работ', close: 'Закрыть просмотр', previous: 'Предыдущий пример', next: 'Следующий пример',
    play: 'Воспроизвести видео', pause: 'Приостановить видео', mute: 'Выключить звук', unmute: 'Включить звук', service: 'Об услуге', example: 'Пример',
  },
  tr: {
    title: 'Çalışma örnekleri', close: 'Görüntüleyiciyi kapat', previous: 'Önceki örnek', next: 'Sonraki örnek',
    play: 'Videoyu oynat', pause: 'Videoyu duraklat', mute: 'Sesi kapat', unmute: 'Sesi aç', service: 'Hizmeti inceleyin', example: 'Örnek',
  },
  pl: {
    title: 'Przykłady prac', close: 'Zamknij podgląd', previous: 'Poprzedni przykład', next: 'Następny przykład',
    play: 'Odtwórz film', pause: 'Wstrzymaj film', mute: 'Wyłącz dźwięk', unmute: 'Włącz dźwięk', service: 'Zobacz usługę', example: 'Przykład',
  },
  ar: {
    title: 'أمثلة الأعمال', close: 'إغلاق العرض', previous: 'المثال السابق', next: 'المثال التالي',
    play: 'تشغيل الفيديو', pause: 'إيقاف الفيديو مؤقتًا', mute: 'كتم الصوت', unmute: 'تشغيل الصوت', service: 'عرض الخدمة', example: 'مثال',
  },
};

const CONTROL_CLASS = 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#0E1A2B] text-white transition-colors hover:bg-white/15 active:scale-95 motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-30';

function ViewerVideo({
  item,
  active,
  muted,
  onToggleMuted,
  labels,
}: {
  item: WorkMediaItem;
  active: boolean;
  muted: boolean;
  onToggleMuted: () => void;
  labels: ViewerLabels;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackAllowedRef = useRef(false);
  const playRequestRef = useRef(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [playing, setPlaying] = useState(false);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || !playbackAllowedRef.current) return;
    const request = ++playRequestRef.current;

    void video.play().then(() => {
      // A delayed play promise must not restart a slide that has already left view.
      if (!playbackAllowedRef.current) video.pause();
    }).catch(() => {
      if (request === playRequestRef.current) setPlaying(false);
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      playbackAllowedRef.current = active && !pausedByUser && !document.hidden;
      if (playbackAllowedRef.current) {
        playVideo();
      } else {
        playRequestRef.current += 1;
        video.pause();
      }
    };

    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      playbackAllowedRef.current = false;
      playRequestRef.current += 1;
      video.pause();
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [active, pausedByUser, playVideo]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setPausedByUser(false);
      playbackAllowedRef.current = active && !document.hidden;
      // Keep this call inside the user gesture if automatic playback was blocked.
      playVideo();
    } else {
      playbackAllowedRef.current = false;
      playRequestRef.current += 1;
      video.pause();
      setPausedByUser(true);
    }
  };

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2">
      <video
        ref={videoRef}
        src={active ? item.video : undefined}
        poster={item.poster || item.image}
        aria-label={item.videoLabel || item.imageAlt || item.title}
        muted={muted}
        loop
        playsInline
        preload={active ? 'auto' : 'none'}
        onPlaying={() => {
          if (playbackAllowedRef.current) setPlaying(true);
          else videoRef.current?.pause();
        }}
        onPause={() => setPlaying(false)}
        onError={() => setPlaying(false)}
        className="h-full min-h-0 w-full object-contain"
      />
      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={togglePlayback} className={CONTROL_CLASS} aria-label={playing ? labels.pause : labels.play} title={playing ? labels.pause : labels.play}>
          {playing ? <PauseIcon className="h-5 w-5" aria-hidden="true" /> : <PlayIcon className="h-5 w-5" aria-hidden="true" />}
        </button>
        <button type="button" onClick={onToggleMuted} className={CONTROL_CLASS} aria-label={muted ? labels.unmute : labels.mute} title={muted ? labels.unmute : labels.mute}>
          {muted ? <SpeakerXMarkIcon className="h-5 w-5" aria-hidden="true" /> : <SpeakerWaveIcon className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

export default function WorkMediaViewer({
  items,
  initialIndex,
  locale,
  onClose,
}: {
  items: WorkMediaItem[];
  initialIndex: number;
  locale: Locale;
  onClose: () => void;
}) {
  const labels = LABELS[locale];
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef(0);
  const startIndex = Math.max(0, Math.min(initialIndex, items.length - 1));
  const startIndexRef = useRef(startIndex);
  const activeIndexRef = useRef(startIndex);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [muted, setMuted] = useState(true);
  const isRTL = locale === 'ar';

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const rail = railRef.current;
    if (!dialog || !rail) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const originalStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      rootOverflow: root.style.overflow,
      rootScrollBehavior: root.style.scrollBehavior,
    };
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const paddingRight = window.getComputedStyle(body).paddingRight;

    body.style.position = 'fixed';
    body.style.top = `${-scrollY}px`;
    body.style.left = `${-scrollX}px`;
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `calc(${paddingRight} + ${scrollbarWidth}px)`;
    root.style.overflow = 'hidden';

    dialog.showModal();
    rail.scrollTop = startIndexRef.current * rail.clientHeight;
    closeRef.current?.focus({ preventScroll: true });

    let previousHeight = rail.clientHeight;
    const observer = new ResizeObserver(() => {
      if (rail.clientHeight !== previousHeight) {
        previousHeight = rail.clientHeight;
        rail.scrollTo({ top: activeIndexRef.current * previousHeight, behavior: 'instant' });
      }
    });
    observer.observe(rail);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(scrollFrameRef.current);
      dialog.close();
      body.style.position = originalStyle.position;
      body.style.top = originalStyle.top;
      body.style.left = originalStyle.left;
      body.style.right = originalStyle.right;
      body.style.width = originalStyle.width;
      body.style.overflow = originalStyle.overflow;
      body.style.paddingRight = originalStyle.paddingRight;
      root.style.overflow = originalStyle.rootOverflow;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(scrollX, scrollY);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      root.style.scrollBehavior = originalStyle.rootScrollBehavior;
    };
  }, []);

  const handleScroll = () => {
    window.cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const rail = railRef.current;
      if (!rail || !rail.clientHeight) return;
      const index = Math.max(0, Math.min(items.length - 1, Math.round(rail.scrollTop / rail.clientHeight)));
      if (index === activeIndexRef.current) return;

      const focusedSlide = document.activeElement instanceof HTMLElement
        ? document.activeElement.closest('[data-work-slide]')
        : null;
      if (focusedSlide) closeRef.current?.focus({ preventScroll: true });
      activeIndexRef.current = index;
      setActiveIndex(index);
    });
  };

  const goTo = (index: number, animate = true) => {
    const rail = railRef.current;
    if (!rail) return;
    const nextIndex = Math.max(0, Math.min(items.length - 1, index));
    rail.scrollTo({
      top: nextIndex * rail.clientHeight,
      behavior: !animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Tab') {
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]'))
        .filter((element) => !element.closest('[inert]') && element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus({ preventScroll: true });
      }
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let destination: number;
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown': destination = activeIndexRef.current + 1; break;
      case 'ArrowUp':
      case 'PageUp': destination = activeIndexRef.current - 1; break;
      case 'ArrowRight': destination = activeIndexRef.current + (isRTL ? -1 : 1); break;
      case 'ArrowLeft': destination = activeIndexRef.current + (isRTL ? 1 : -1); break;
      case 'Home': destination = 0; break;
      case 'End': destination = items.length - 1; break;
      default: return;
    }
    event.preventDefault();
    event.stopPropagation();
    goTo(destination, false);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      dir={isRTL ? 'rtl' : 'ltr'}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden border-0 bg-[#0E1A2B] p-0 text-white backdrop:bg-[#0E1A2B]"
    >
      <header className="absolute inset-x-0 top-0 z-20 flex min-h-[calc(3.5rem+env(safe-area-inset-top))] items-center gap-3 bg-[#0E1A2B] px-4 pb-1 pt-[calc(0.25rem+env(safe-area-inset-top))] sm:px-6">
        <h2 id={titleId} className="min-w-0 flex-1 text-sm font-semibold sm:text-base">{labels.title}</h2>
        <span className="shrink-0 text-sm tabular-nums text-white/70" aria-live="polite" aria-atomic="true">
          <span className="sr-only">{labels.example} </span>
          <bdi dir="ltr">{items.length ? activeIndex + 1 : 0} / {items.length}</bdi>
        </span>
        <button ref={closeRef} type="button" className={CONTROL_CLASS} onClick={onClose} aria-label={labels.close} title={labels.close}>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div
        ref={railRef}
        onScroll={handleScroll}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <article
            key={`${index}-${item.image}`}
            data-work-slide={index}
            aria-hidden={index !== activeIndex}
            inert={index !== activeIndex}
            className="grid h-full snap-start snap-always grid-rows-[minmax(0,1fr)_auto] px-4 pt-[calc(3.5rem+env(safe-area-inset-top))] md:px-24"
          >
            <div className="relative min-h-0">
              {item.video ? (
                <ViewerVideo item={item} active={index === activeIndex} muted={muted} onToggleMuted={() => setMuted((value) => !value)} labels={labels} />
              ) : (
                <Image src={item.image} alt={item.imageAlt || item.title} fill sizes="(min-width: 768px) calc(100vw - 192px), calc(100vw - 32px)" className="object-contain" loading={index === activeIndex ? 'eager' : 'lazy'} />
              )}
            </div>

            <footer className="mx-auto flex w-full max-w-4xl flex-col gap-1 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-end sm:justify-between sm:gap-5 [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:items-center">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/65 [@media(max-height:500px)]:hidden">{item.description}</p>
              </div>
              <Link href={item.serviceHref} onClick={onClose} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-sm text-sm font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {labels.service}<span aria-hidden="true" className="rtl:rotate-180">→</span>
              </Link>
            </footer>
          </article>
        ))}
      </div>

      <nav aria-label={labels.title} className="absolute end-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <button type="button" className={CONTROL_CLASS} disabled={activeIndex === 0} onClick={() => goTo(activeIndex - 1)} aria-label={labels.previous} title={labels.previous}>
          <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" className={CONTROL_CLASS} disabled={activeIndex >= items.length - 1} onClick={() => goTo(activeIndex + 1)} aria-label={labels.next} title={labels.next}>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </dialog>
  );
}
