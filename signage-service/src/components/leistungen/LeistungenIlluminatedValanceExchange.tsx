'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';

const OLD_AWNING_IMAGE = '/images/leistungen/beleuchtete-markisenvolants/volant-exchange-old.png';
const NEW_AWNING_IMAGE = '/images/leistungen/beleuchtete-markisenvolants/volant-exchange-blue.png';
const WORDMARK_IMAGE = '/images/leistungen/beleuchtete-markisenvolants/pixelring-wordmark-cutout.png';
const PHASE_GRADIENT =
  'linear-gradient(90deg, #9B8E82 0%, #66778B 28%, #234972 50%, #244B74 78%, #C66C42 100%)';
const FIRST_PLAY_DELAY_MS = 2250;
const PLAYBACK_DURATION_MS = 4400;
const TRANSFER_DURATION_MS = 2200;
const REPLAY_HOLD_MS = 7500;
const RESET_HALF_DURATION_MS = 175;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

type LeistungenIlluminatedValanceExchangeProps = {
  content: {
    eyebrow: string;
    titleLines: [string, string];
    intro: string;
    steps: Array<{ number: string; title: string; text: string }>;
    animationLabel: string;
    awningAlt: string;
    sliderLabel: string;
    stateLabels: [string, string, string];
    stateText: [string, string, string];
  };
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function getStateIndex(value: number) {
  return value < 24 ? 0 : value < 96 ? 1 : 2;
}

function cancelAnimations(animations: Animation[]) {
  animations.forEach((animation) => animation.cancel());
}

export default function LeistungenIlluminatedValanceExchange({
  content,
}: LeistungenIlluminatedValanceExchangeProps) {
  const valueRef = useRef(0);
  const thumbStartRef = useRef(0);
  const thumbTravelRef = useRef(0);
  const completedRunsRef = useRef(0);
  const isVisibleRef = useRef(false);
  const isPlayingRef = useRef(false);
  const userInteractedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const playRef = useRef<() => void>(() => undefined);

  const animationCardRef = useRef<HTMLDivElement>(null);
  const animationStageRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const oldValanceRef = useRef<HTMLDivElement>(null);
  const newValanceRef = useRef<HTMLDivElement>(null);
  const nightOverlayRef = useRef<HTMLDivElement>(null);
  const wordmarkTrackRef = useRef<HTMLDivElement>(null);
  const wordmarkGlowRef = useRef<HTMLImageElement>(null);
  const wordmarkLitRef = useRef<HTMLImageElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const thumbBlueRef = useRef<HTMLSpanElement>(null);
  const thumbOrangeRef = useRef<HTMLSpanElement>(null);
  const stateLabelRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const playbackAnimationsRef = useRef<Animation[]>([]);
  const resetAnimationsRef = useRef<Animation[]>([]);
  const startDelayRef = useRef<number | null>(null);
  const replayDelayRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const updateSemanticValue = useCallback((nextValue: number) => {
    const safeValue = clamp(nextValue);
    const stateIndex = getStateIndex(safeValue);
    valueRef.current = safeValue;

    sliderRef.current?.setAttribute('aria-valuenow', String(Math.round(safeValue)));
    sliderRef.current?.setAttribute('aria-valuetext', content.stateText[stateIndex]);
    stateLabelRefs.current.forEach((label, index) => {
      if (label) label.style.opacity = index === stateIndex ? '1' : '0.5';
    });
  }, [content.stateText]);

  const updateVisualValue = useCallback((nextValue: number) => {
    const safeValue = clamp(nextValue);
    const exchange = clamp(safeValue / 50, 0, 1);
    const entryProgress = clamp(exchange / 0.08, 0, 1);
    const transferProgress = clamp((exchange - 0.08) / 0.84, 0, 1);
    const exitProgress = clamp((exchange - 0.92) / 0.08, 0, 1);
    const oldValanceTranslate = -100 * transferProgress - 8 * exitProgress;
    const newValanceTranslate = 100 * (1 - transferProgress) + 8 * (1 - entryProgress);
    const nightAmount = clamp((safeValue - 50) / 47, 0, 1);
    const lightAmount = clamp((safeValue - 86) / 14, 0, 1);
    const thumbX = thumbStartRef.current + thumbTravelRef.current * (safeValue / 100);

    if (oldValanceRef.current) {
      oldValanceRef.current.style.transform = `translate3d(${oldValanceTranslate}%, 0, 0)`;
    }
    if (newValanceRef.current) {
      newValanceRef.current.style.transform = `translate3d(${newValanceTranslate}%, 0, 0)`;
    }
    if (wordmarkTrackRef.current) {
      wordmarkTrackRef.current.style.transform = `translate3d(${newValanceTranslate}%, 0, 0)`;
    }
    if (nightOverlayRef.current) {
      nightOverlayRef.current.style.opacity = String(nightAmount * 0.28);
    }
    if (wordmarkGlowRef.current) {
      wordmarkGlowRef.current.style.opacity = String(lightAmount * 0.78);
    }
    if (wordmarkLitRef.current) {
      wordmarkLitRef.current.style.opacity = String(lightAmount * 0.58);
    }
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translate3d(${thumbX}px, -50%, 0)`;
    }
    if (thumbBlueRef.current) {
      thumbBlueRef.current.style.opacity = String(clamp(safeValue / 50, 0, 1));
    }
    if (thumbOrangeRef.current) {
      thumbOrangeRef.current.style.opacity = String(clamp((safeValue - 50) / 50, 0, 1));
    }
  }, []);

  const applyValue = useCallback((nextValue: number) => {
    updateVisualValue(nextValue);
    updateSemanticValue(nextValue);
  }, [updateSemanticValue, updateVisualValue]);

  const clearPlaybackWork = useCallback(() => {
    if (startDelayRef.current !== null) window.clearTimeout(startDelayRef.current);
    if (replayDelayRef.current !== null) window.clearTimeout(replayDelayRef.current);
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    if (progressIntervalRef.current !== null) window.clearInterval(progressIntervalRef.current);

    startDelayRef.current = null;
    replayDelayRef.current = null;
    completionTimerRef.current = null;
    progressIntervalRef.current = null;
    isPlayingRef.current = false;

    cancelAnimations(playbackAnimationsRef.current);
    cancelAnimations(resetAnimationsRef.current);
    playbackAnimationsRef.current = [];
    resetAnimationsRef.current = [];
    if (animationStageRef.current) animationStageRef.current.style.opacity = '1';
  }, []);

  const resetForReplay = useCallback(() => {
    const stage = animationStageRef.current;
    if (!stage || !isVisibleRef.current || userInteractedRef.current || reducedMotionRef.current) return;

    const fadeOut = stage.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: RESET_HALF_DURATION_MS, easing: EASE_OUT, fill: 'forwards' }
    );
    resetAnimationsRef.current = [fadeOut];

    fadeOut.onfinish = () => {
      if (!isVisibleRef.current || userInteractedRef.current || reducedMotionRef.current) return;

      stage.style.opacity = '0';
      fadeOut.cancel();
      applyValue(0);

      const fadeIn = stage.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: RESET_HALF_DURATION_MS, easing: EASE_OUT, fill: 'forwards' }
      );
      resetAnimationsRef.current = [fadeIn];
      fadeIn.onfinish = () => {
        stage.style.opacity = '1';
        fadeIn.cancel();
        resetAnimationsRef.current = [];
        playRef.current();
      };
    };
  }, [applyValue]);

  const play = useCallback(() => {
    if (
      !isVisibleRef.current ||
      userInteractedRef.current ||
      reducedMotionRef.current ||
      completedRunsRef.current >= 2
    ) {
      return;
    }

    const oldValance = oldValanceRef.current;
    const newValance = newValanceRef.current;
    const nightOverlay = nightOverlayRef.current;
    const wordmarkTrack = wordmarkTrackRef.current;
    const wordmarkGlow = wordmarkGlowRef.current;
    const wordmarkLit = wordmarkLitRef.current;
    const thumb = thumbRef.current;
    const thumbBlue = thumbBlueRef.current;
    const thumbOrange = thumbOrangeRef.current;

    if (
      !oldValance ||
      !newValance ||
      !nightOverlay ||
      !wordmarkTrack ||
      !wordmarkGlow ||
      !wordmarkLit ||
      !thumb ||
      !thumbBlue ||
      !thumbOrange
    ) {
      return;
    }

    clearPlaybackWork();
    applyValue(0);
    isPlayingRef.current = true;

    const oldValanceKeyframes = [
      { transform: 'translate3d(0%, 0, 0)', offset: 0, easing: 'linear' },
      { transform: 'translate3d(0%, 0, 0)', offset: 0.08, easing: EASE_IN_OUT },
      { transform: 'translate3d(-100%, 0, 0)', offset: 0.92, easing: EASE_OUT },
      { transform: 'translate3d(-108%, 0, 0)', offset: 1 },
    ];
    const newValanceKeyframes = [
      { transform: 'translate3d(108%, 0, 0)', offset: 0, easing: EASE_OUT },
      { transform: 'translate3d(100%, 0, 0)', offset: 0.08, easing: EASE_IN_OUT },
      { transform: 'translate3d(0%, 0, 0)', offset: 0.92, easing: 'linear' },
      { transform: 'translate3d(0%, 0, 0)', offset: 1 },
    ];
    const thumbStartTransform = `translate3d(${thumbStartRef.current}px, -50%, 0)`;
    const thumbEndTransform = `translate3d(${thumbStartRef.current + thumbTravelRef.current}px, -50%, 0)`;

    playbackAnimationsRef.current = [
      oldValance.animate(oldValanceKeyframes, {
        duration: TRANSFER_DURATION_MS,
        fill: 'forwards',
      }),
      newValance.animate(newValanceKeyframes, {
        duration: TRANSFER_DURATION_MS,
        fill: 'forwards',
      }),
      wordmarkTrack.animate(newValanceKeyframes, {
        duration: TRANSFER_DURATION_MS,
        fill: 'forwards',
      }),
      nightOverlay.animate([{ opacity: 0 }, { opacity: 0.28 }], {
        delay: TRANSFER_DURATION_MS,
        duration: 1800,
        easing: EASE_OUT,
        fill: 'forwards',
      }),
      wordmarkGlow.animate([{ opacity: 0 }, { opacity: 0.78 }], {
        delay: 3400,
        duration: 1000,
        easing: EASE_OUT,
        fill: 'forwards',
      }),
      wordmarkLit.animate([{ opacity: 0 }, { opacity: 0.58 }], {
        delay: 3400,
        duration: 1000,
        easing: EASE_OUT,
        fill: 'forwards',
      }),
      thumb.animate(
        [{ transform: thumbStartTransform }, { transform: thumbEndTransform }],
        { duration: PLAYBACK_DURATION_MS, easing: 'linear', fill: 'forwards' }
      ),
      thumbBlue.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: TRANSFER_DURATION_MS,
        easing: 'linear',
        fill: 'forwards',
      }),
      thumbOrange.animate([{ opacity: 0 }, { opacity: 1 }], {
        delay: TRANSFER_DURATION_MS,
        duration: TRANSFER_DURATION_MS,
        easing: 'linear',
        fill: 'forwards',
      }),
    ];

    const startedAt = window.performance.now();
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = window.performance.now() - startedAt;
      updateSemanticValue((elapsed / PLAYBACK_DURATION_MS) * 100);
    }, 100);

    completionTimerRef.current = window.setTimeout(() => {
      completionTimerRef.current = null;
      if (progressIntervalRef.current !== null) window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;

      updateVisualValue(100);
      updateSemanticValue(100);
      cancelAnimations(playbackAnimationsRef.current);
      playbackAnimationsRef.current = [];
      isPlayingRef.current = false;
      completedRunsRef.current += 1;

      if (
        completedRunsRef.current === 1 &&
        isVisibleRef.current &&
        !userInteractedRef.current &&
        !reducedMotionRef.current
      ) {
        replayDelayRef.current = window.setTimeout(resetForReplay, REPLAY_HOLD_MS);
      }
    }, PLAYBACK_DURATION_MS);
  }, [applyValue, clearPlaybackWork, resetForReplay, updateSemanticValue, updateVisualValue]);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(() => {
    const animationCard = animationCardRef.current;
    const slider = sliderRef.current;
    if (!animationCard || !slider) return;

    const updateThumbTravel = () => {
      const inset = Number.parseFloat(window.getComputedStyle(slider).getPropertyValue('--thumb-edge-inset')) || 0;
      thumbStartRef.current = inset - (thumbRef.current?.offsetWidth ?? 0) / 2;
      thumbTravelRef.current = Math.max(0, slider.clientWidth - inset * 2);
      updateVisualValue(valueRef.current);
    };
    updateThumbTravel();

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateThumbTravel);
    resizeObserver?.observe(slider);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = reduceMotion.matches;
    if (reduceMotion.matches) {
      applyValue(100);
      return () => resizeObserver?.disconnect();
    }

    const scheduleVisiblePlayback = () => {
      if (
        startDelayRef.current !== null ||
        replayDelayRef.current !== null ||
        resetAnimationsRef.current.length > 0 ||
        isPlayingRef.current ||
        completedRunsRef.current >= 2 ||
        userInteractedRef.current
      ) {
        return;
      }

      startDelayRef.current = window.setTimeout(() => {
        startDelayRef.current = null;
        playRef.current();
      }, FIRST_PLAY_DELAY_MS);
    };

    if (typeof IntersectionObserver === 'undefined') {
      isVisibleRef.current = true;
      scheduleVisiblePlayback();
      return () => {
        resizeObserver?.disconnect();
        clearPlaybackWork();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          isVisibleRef.current = true;
          scheduleVisiblePlayback();
          return;
        }

        if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          const interruptedRepeat = isPlayingRef.current && completedRunsRef.current === 1;
          isVisibleRef.current = false;
          clearPlaybackWork();
          if (interruptedRepeat) completedRunsRef.current = 2;
          applyValue(completedRunsRef.current >= 1 ? 100 : 0);
        }
      },
      { threshold: [0, 0.2, 0.6] }
    );
    observer.observe(animationCard);

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      clearPlaybackWork();
    };
  }, [applyValue, clearPlaybackWork, updateVisualValue]);

  const updateFromPointer = (clientX: number, element: HTMLDivElement) => {
    const bounds = element.getBoundingClientRect();
    applyValue(((clientX - bounds.left) / Math.max(1, bounds.width)) * 100);
  };

  const beginManualInteraction = () => {
    userInteractedRef.current = true;
    clearPlaybackWork();
  };

  return (
    <section className="bg-[#0E1A2B] pt-14 pb-0 sm:pt-20 sm:pb-0">
      <div className="pr-site-container">
        <div className="grid overflow-hidden rounded-[28px] bg-[#F4F7FB] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8 min-[1100px]:grid-cols-[minmax(0,500px)_minmax(0,1fr)] min-[1100px]:gap-10 xl:gap-16 xl:p-[60px]">
          <div className="flex flex-col items-start">
            <h2 className="max-w-[500px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#0E1A2B] sm:text-[42px] lg:text-[48px] lg:leading-[52px]">
              {content.titleLines[0]}
              <br />
              {content.titleLines[1]}
            </h2>
            <p className="mt-6 max-w-[440px] text-[16px] leading-7 text-[#526174] lg:text-[17px]">
              {content.intro}
            </p>

            <ol className="mt-7 grid w-full max-w-[440px] gap-3">
              {content.steps.map((step) => (
                <li key={step.number} className="flex min-h-14 items-center gap-3.5 py-2">
                  <span className="rounded-[10px] bg-[#9F5131] px-2.5 py-1.5 text-[12px] font-semibold text-white">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0E1A2B]">{step.title}</h3>
                    <p className="mt-0.5 text-[13px] text-[#526174]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div
            ref={animationCardRef}
            className="mt-10 self-center rounded-[24px] border border-[#0E1A2B]/8 bg-[#FAF8F4] p-2.5 shadow-[0_22px_54px_rgba(14,26,43,0.13)] sm:p-4 min-[1100px]:mt-0 min-[1100px]:translate-y-6"
          >
            <div ref={animationStageRef} style={{ opacity: 1 }}>
              <div
                className="relative aspect-[16/10] overflow-hidden rounded-[17px] bg-[#DCE5F0] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] sm:rounded-[20px] min-[1100px]:aspect-[4/3]"
                aria-label={content.animationLabel}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={OLD_AWNING_IMAGE}
                    alt={content.awningAlt}
                    fill
                    sizes="(min-width: 1100px) 44vw, 100vw"
                    className="select-none object-cover"
                    draggable={false}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute left-[6.5%] top-[52.65%] h-[11.74%] w-[86.76%] overflow-visible min-[1100px]:top-[52.25%] min-[1100px]:h-[9.78%]"
                  >
                    <div
                      ref={oldValanceRef}
                      className="absolute inset-0 overflow-hidden"
                      style={{ transform: 'translate3d(0%, 0, 0)' }}
                    >
                      <Image
                        src={OLD_AWNING_IMAGE}
                        alt=""
                        width={1254}
                        height={1254}
                        sizes="(min-width: 1100px) 48vw, 90vw"
                        className="pointer-events-none absolute left-[-7.49%] top-[-704%] h-auto max-w-none select-none"
                        style={{ width: '115.26%' }}
                        draggable={false}
                      />
                    </div>

                    <div
                      ref={newValanceRef}
                      className="absolute inset-0 overflow-hidden"
                      style={{ transform: 'translate3d(108%, 0, 0)' }}
                    >
                      <Image
                        src={NEW_AWNING_IMAGE}
                        alt=""
                        width={1254}
                        height={1254}
                        sizes="(min-width: 1100px) 48vw, 90vw"
                        className="pointer-events-none absolute left-[-7.49%] top-[-704%] h-auto max-w-none select-none"
                        style={{ width: '115.26%' }}
                        draggable={false}
                      />
                    </div>
                  </div>

                <div
                  ref={nightOverlayRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[#071322]"
                  style={{ opacity: 0 }}
                />

                <div className="pointer-events-none absolute left-[6.5%] top-[52.65%] z-10 h-[11.74%] w-[86.76%] overflow-visible min-[1100px]:top-[52.25%] min-[1100px]:h-[9.78%]">
                  <div
                    ref={wordmarkTrackRef}
                    className="absolute inset-0 grid place-items-center overflow-hidden"
                    style={{ transform: 'translate3d(108%, 0, 0)' }}
                  >
                    <span className="relative h-[74.8%] w-[37.4%]">
                      <Image
                        ref={wordmarkGlowRef}
                        src={WORDMARK_IMAGE}
                        alt=""
                        fill
                        sizes="280px"
                        className="object-contain opacity-0 mix-blend-screen"
                        style={{
                          filter: 'invert(1) blur(8px)',
                          opacity: 0,
                          transform: 'scale(1.015)',
                        }}
                        draggable={false}
                      />
                      <Image
                        src={WORDMARK_IMAGE}
                        alt="PixelRing"
                        fill
                        sizes="280px"
                        className="object-contain mix-blend-screen"
                        style={{
                          filter: 'invert(1) brightness(0.5)',
                          opacity: 0.42,
                        }}
                        draggable={false}
                      />
                      <Image
                        ref={wordmarkLitRef}
                        src={WORDMARK_IMAGE}
                        alt=""
                        fill
                        sizes="280px"
                        className="object-contain mix-blend-screen"
                        style={{
                          filter: 'invert(1) brightness(1.3)',
                          opacity: 0,
                        }}
                        draggable={false}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div
                ref={sliderRef}
                role="slider"
                tabIndex={0}
                aria-label={content.sliderLabel}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
                aria-valuetext={content.stateText[0]}
                aria-orientation="horizontal"
                className="relative h-14 touch-none select-none overflow-hidden rounded-full border border-[#0E1A2B]/12 shadow-[inset_0_2px_6px_rgba(14,26,43,0.12)] outline-none [--thumb-edge-inset:28px] focus-visible:ring-4 focus-visible:ring-[#B8643E]/25 sm:h-[62px] sm:[--thumb-edge-inset:31px]"
                onPointerDown={(event) => {
                  beginManualInteraction();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  updateFromPointer(event.clientX, event.currentTarget);
                }}
                onPointerMove={(event) => {
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                  updateFromPointer(event.clientX, event.currentTarget);
                }}
                onKeyDown={(event) => {
                  let nextValue = valueRef.current;
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextValue -= 2;
                  else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextValue += 2;
                  else if (event.key === 'PageDown') nextValue -= 10;
                  else if (event.key === 'PageUp') nextValue += 10;
                  else if (event.key === 'Home') nextValue = 0;
                  else if (event.key === 'End') nextValue = 100;
                  else return;

                  event.preventDefault();
                  beginManualInteraction();
                  applyValue(nextValue);
                }}
              >
                <div className="absolute inset-0 opacity-50" style={{ background: PHASE_GRADIENT }} />
                <div aria-hidden="true" className="absolute inset-0 z-10 grid grid-cols-3 items-center px-[60px] text-[9px] font-bold uppercase tracking-[0.035em] text-white sm:px-[65px] sm:text-[10px]">
                  {content.stateLabels.map((label, index) => (
                    <span
                      ref={(element) => {
                        stateLabelRefs.current[index] = element;
                      }}
                      key={label}
                      className={index === 0 ? 'text-left' : index === 2 ? 'text-right' : 'text-center'}
                      style={{ opacity: index === 0 ? 1 : 0.5 }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <span
                  ref={thumbRef}
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 z-20 grid h-12 w-12 place-items-center overflow-hidden rounded-full border-[3px] border-white/95 text-[18px] font-bold tracking-[-0.22em] text-white shadow-[0_5px_14px_rgba(14,26,43,0.32),inset_0_1px_0_rgba(255,255,255,0.28)] sm:h-[52px] sm:w-[52px] sm:text-[20px]"
                  style={{
                    transform: 'translate3d(0px, -50%, 0)',
                  }}
                >
                  <span className="absolute inset-0 bg-[#8C8176]" />
                  <span ref={thumbBlueRef} className="absolute inset-0 bg-[#17365B]" style={{ opacity: 0 }} />
                  <span ref={thumbOrangeRef} className="absolute inset-0 bg-[#D36C37]" style={{ opacity: 0 }} />
                  <span className="relative z-10 -translate-x-0.5">››</span>
                </span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
