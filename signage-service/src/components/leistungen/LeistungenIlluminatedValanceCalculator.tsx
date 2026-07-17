'use client';

import { useEffect, useMemo, useState } from 'react';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenProblemDrawer from '@/components/leistungen/LeistungenProblemDrawer';
import {
  calculateIlluminatedValance,
  type IlluminatedValanceCalculatorInput,
  type IlluminatedValanceGeometry,
  type IlluminatedValanceLogoPlacement,
  type IlluminatedValanceMeasuredText,
} from '@/lib/illuminated-valance-calculator';
import {
  ILLUMINATED_VALANCE_FONTS,
  type IlluminatedValanceFont,
} from '@/lib/illuminated-valance-fonts';
import { ILLUMINATED_VALANCE_PROVISIONAL_CONFIG } from '@/lib/illuminated-valance-provisional-config';
import { buildIlluminatedValanceCalculationSnapshot } from '@/lib/illuminated-valance-calculation-snapshot';

type CalculatorContent = {
  eyebrow: string;
  title: string;
  intro: string;
  dimensionsTitle: string;
  designTitle: string;
  valanceLengthLabel: string;
  valanceHeightLabel: string;
  textLabel: string;
  textPlaceholder: string;
  fontLabel: string;
  letterHeightLabel: string;
  logoLabel: string;
  logoOptions: Record<IlluminatedValanceLogoPlacement, string>;
  quantityLabel: string;
  previewTitle: string;
  previewAriaLabel: string;
  logoMark: string;
  totalLengthLabel: string;
  textLengthLabel: string;
  occupiedLengthLabel: string;
  freeLengthLabel: string;
  measuringText: string;
  layoutReadyText: string;
  pricingTitle: string;
  priceDisclaimer: string;
  excludedCostsNote: string;
  individualReviewTitle: string;
  individualReviewText: string;
  requestCta: string;
  requestInitialMessage: string;
  drawerTitle: string;
  drawerServiceInfoLabel: string;
  drawerSummaryLabel: string;
  drawerFormTitle: string;
  drawerFormIntro: string;
  drawerCloseLabel: string;
  drawerPricedSummary: string;
  drawerReviewSummary: string;
  schematicNote: string;
  errors: {
    positiveNumber: string;
    wholeQuantity: string;
    emptyComposition: string;
    unsupportedCharacters: string;
    fontLoad: string;
    lettersTooTall: string;
    compositionTooWide: string;
    zoneTooLong: string;
  };
};

type LeistungenIlluminatedValanceCalculatorProps = {
  locale: string;
  content: CalculatorContent;
};

type TextMeasurementState =
  | { status: 'idle' | 'loading'; measurement: null; svgFontSizeMm: null }
  | { status: 'error'; measurement: null; svgFontSizeMm: null }
  | {
      status: 'ready';
      measurement: IlluminatedValanceMeasuredText;
      svgFontSizeMm: number;
    };

const REFERENCE_FONT_SIZE_PX = 1000;

const SUPPORTED_PREVIEW_TEXT =
  /^[\p{Script=Latin}\p{Script=Cyrillic}\p{Number}\p{Mark}\s.,!?&+/\-–—:'"()@№%€$]*$/u;

const fontLoadCache = new Map<string, Promise<FontFace>>();

function loadExactFont(font: IlluminatedValanceFont): Promise<FontFace> {
  const cached = fontLoadCache.get(font.id);
  if (cached) return cached;

  const fontPromise = new FontFace(
    font.family,
    `url("${font.source}") format("truetype")`,
    { style: 'normal', weight: font.weight }
  )
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
      return loadedFont;
    });

  fontLoadCache.set(font.id, fontPromise);
  return fontPromise;
}

function measureExactText(
  text: string,
  font: IlluminatedValanceFont,
  visibleLetterHeightMm: number
): { measurement: IlluminatedValanceMeasuredText; svgFontSizeMm: number } | null {
  if (!text.trim()) {
    return {
      measurement: {
        text,
        fontId: font.id,
        visibleLetterHeightMm,
        widthMm: 0,
      },
      svgFontSizeMm: visibleLetterHeightMm,
    };
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.font = `${font.weight} ${REFERENCE_FONT_SIZE_PX}px "${font.family}"`;
  context.textBaseline = 'alphabetic';
  const capMetrics = context.measureText('H');
  const capHeightPx =
    capMetrics.actualBoundingBoxAscent + capMetrics.actualBoundingBoxDescent;
  const textWidthPx = context.measureText(text).width;

  if (
    !Number.isFinite(capHeightPx) ||
    capHeightPx <= 0 ||
    !Number.isFinite(textWidthPx) ||
    textWidthPx <= 0
  ) {
    return null;
  }

  const millimetersPerPixel = visibleLetterHeightMm / capHeightPx;

  return {
    measurement: {
      text,
      fontId: font.id,
      visibleLetterHeightMm,
      widthMm: textWidthPx * millimetersPerPixel,
    },
    svgFontSizeMm: REFERENCE_FONT_SIZE_PX * millimetersPerPixel,
  };
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function NumberField({
  id,
  label,
  value,
  onChange,
  error,
  integer = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  integer?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-[13px] font-extrabold text-[#263445]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode={integer ? 'numeric' : 'decimal'}
          min="1"
          step={integer ? '1' : '0.1'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`min-h-12 w-full rounded-[14px] border bg-white px-4 pe-14 text-[16px] font-bold text-[#0E1A2B] outline-none transition focus:ring-4 ${
            error
              ? 'border-[#B84D3E] focus:border-[#B84D3E] focus:ring-[#B84D3E]/12'
              : 'border-[#D8C9BC] focus:border-[#B8643E] focus:ring-[#B8643E]/12'
          }`}
        />
        <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-[12px] font-black uppercase tracking-[0.08em] text-[#7A6658]">
          {integer ? '×' : 'mm'}
        </span>
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-[13px] font-semibold leading-5 text-[#A53D32]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[14px] border border-white/10 bg-white/[0.06] px-3 py-3">
      <dt className="text-[11px] font-black uppercase tracking-[0.1em] text-white/55">
        {label}
      </dt>
      <dd className="mt-1 truncate text-[15px] font-extrabold text-white">{value}</dd>
    </div>
  );
}

export default function LeistungenIlluminatedValanceCalculator({
  locale,
  content,
}: LeistungenIlluminatedValanceCalculatorProps) {
  const [valanceLength, setValanceLength] = useState('3000');
  const [valanceHeight, setValanceHeight] = useState('250');
  const [text, setText] = useState('PIXELRING');
  const [fontId, setFontId] = useState(ILLUMINATED_VALANCE_FONTS[0]?.id ?? '');
  const [letterHeight, setLetterHeight] = useState('100');
  const [logoPlacement, setLogoPlacement] =
    useState<IlluminatedValanceLogoPlacement>('none');
  const [quantity, setQuantity] = useState('1');
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [measurementState, setMeasurementState] = useState<TextMeasurementState>({
    status: 'idle',
    measurement: null,
    svgFontSizeMm: null,
  });

  const selectedFont =
    ILLUMINATED_VALANCE_FONTS.find((font) => font.id === fontId) ??
    ILLUMINATED_VALANCE_FONTS[0];
  const parsedLength = parsePositiveNumber(valanceLength);
  const parsedHeight = parsePositiveNumber(valanceHeight);
  const parsedLetterHeight = parsePositiveNumber(letterHeight);
  const parsedQuantity = parsePositiveNumber(quantity);
  const quantityIsValid = parsedQuantity !== null && Number.isInteger(parsedQuantity);
  const textIsSupported = SUPPORTED_PREVIEW_TEXT.test(text);
  const compositionIsEmpty = !text.trim() && logoPlacement === 'none';

  useEffect(() => {
    let cancelled = false;

    if (!selectedFont || !parsedLetterHeight || !textIsSupported) {
      queueMicrotask(() => {
        if (!cancelled) {
          setMeasurementState({ status: 'idle', measurement: null, svgFontSizeMm: null });
        }
      });
      return () => {
        cancelled = true;
      };
    }

    queueMicrotask(() => {
      if (!cancelled) {
        setMeasurementState({ status: 'loading', measurement: null, svgFontSizeMm: null });
      }
    });

    loadExactFont(selectedFont)
      .then(() => document.fonts.ready)
      .then(() => {
        if (cancelled) return;
        const measured = measureExactText(
          text,
          selectedFont,
          parsedLetterHeight
        );

        setMeasurementState(
          measured
            ? { status: 'ready', ...measured }
            : { status: 'error', measurement: null, svgFontSizeMm: null }
        );
      })
      .catch(() => {
        if (!cancelled) {
          fontLoadCache.delete(selectedFont.id);
          setMeasurementState({ status: 'error', measurement: null, svgFontSizeMm: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [parsedLetterHeight, selectedFont, text, textIsSupported]);

  const calculatorInput = useMemo<IlluminatedValanceCalculatorInput | null>(() => {
    if (
      !parsedLength ||
      !parsedHeight ||
      !parsedLetterHeight ||
      !parsedQuantity ||
      !quantityIsValid ||
      !selectedFont
    ) {
      return null;
    }

    return {
      valanceLengthMm: parsedLength,
      valanceHeightMm: parsedHeight,
      text,
      fontId: selectedFont.id,
      letterHeightMm: parsedLetterHeight,
      logoPlacement,
      quantity: parsedQuantity,
    };
  }, [
    logoPlacement,
    parsedHeight,
    parsedLength,
    parsedLetterHeight,
    parsedQuantity,
    quantityIsValid,
    selectedFont,
    text,
  ]);

  const calculationResult = useMemo(() => {
    if (!calculatorInput || measurementState.status !== 'ready' || compositionIsEmpty) {
      return null;
    }

    return calculateIlluminatedValance(
      calculatorInput,
      measurementState.measurement,
      ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
    );
  }, [calculatorInput, compositionIsEmpty, measurementState]);

  const geometry: IlluminatedValanceGeometry | null =
    calculationResult && 'geometry' in calculationResult
      ? (calculationResult.geometry ?? null)
      : null;
  const lettersTooTall =
    calculationResult?.status === 'invalid' &&
    calculationResult.errors.some((error) => error.code === 'LETTERS_TOO_TALL');
  const compositionTooWide =
    calculationResult?.status === 'invalid' &&
    calculationResult.errors.some((error) => error.code === 'COMPOSITION_TOO_WIDE');
  const zoneTooLong =
    calculationResult?.status === 'individual-review' &&
    calculationResult.reviewReasons.some(
      (reason) => reason.code === 'LIGHT_ZONE_TOO_LONG'
    );
  const hasLayoutError = lettersTooTall || compositionTooWide;

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
      }),
    [locale]
  );
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [locale]
  );
  const formatMillimeters = (value: number) => `${numberFormatter.format(value)} mm`;
  const formatMoney = (value: number) => moneyFormatter.format(value);

  const logoRadius = geometry ? geometry.logoWidthMm / 2 : 0;
  const hasLeftLogo = logoPlacement === 'left' || logoPlacement === 'both';
  const hasRightLogo = logoPlacement === 'right' || logoPlacement === 'both';
  const textBaselineY =
    parsedHeight && parsedLetterHeight
      ? parsedHeight / 2 + parsedLetterHeight / 2
      : 0;
  const pricing =
    calculationResult?.status === 'priced' ? calculationResult.pricing : null;
  const calculationSnapshot = useMemo(
    () => buildIlluminatedValanceCalculationSnapshot(calculationResult, locale),
    [calculationResult, locale]
  );
  const drawerSummary = pricing
    ? content.drawerPricedSummary.replace(
        '{price}',
        formatMoney(pricing.netSubtotalForQuantity)
      )
    : content.drawerReviewSummary;

  const liveMessage = (() => {
    if (!parsedLength || !parsedHeight || !parsedLetterHeight) {
      return content.errors.positiveNumber;
    }
    if (!quantityIsValid) return content.errors.wholeQuantity;
    if (compositionIsEmpty) return content.errors.emptyComposition;
    if (!textIsSupported) return content.errors.unsupportedCharacters;
    if (measurementState.status === 'loading') return content.measuringText;
    if (measurementState.status === 'error') return content.errors.fontLoad;
    if (lettersTooTall) return content.errors.lettersTooTall;
    if (compositionTooWide) return content.errors.compositionTooWide;
    if (zoneTooLong) return content.errors.zoneTooLong;
    if (calculationResult?.status === 'individual-review') {
      return content.individualReviewText;
    }
    return '';
  })();

  return (
    <section id="kostenrechner" className="bg-[#F7F1E8] py-14 sm:py-20">
      <div className="pr-site-container">
        <div className="max-w-4xl text-start">
          <SectionEyebrow className="mb-3">{content.eyebrow}</SectionEyebrow>
          <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-3xl text-[16px] font-semibold leading-8 text-[#526174]">
            {content.intro}
          </p>
        </div>

        <div className="mt-10 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <div className="min-w-0 rounded-[28px] border border-[#DDCDBF] bg-[#FFFDF9] p-5 shadow-[0_20px_52px_rgba(14,26,43,0.08)] sm:p-7">
            <fieldset>
              <legend className="text-[18px] font-black text-[#0E1A2B]">
                {content.dimensionsTitle}
              </legend>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <NumberField
                  id="valance-length"
                  label={content.valanceLengthLabel}
                  value={valanceLength}
                  onChange={setValanceLength}
                  error={parsedLength ? undefined : content.errors.positiveNumber}
                />
                <NumberField
                  id="valance-height"
                  label={content.valanceHeightLabel}
                  value={valanceHeight}
                  onChange={setValanceHeight}
                  error={parsedHeight ? undefined : content.errors.positiveNumber}
                />
              </div>
            </fieldset>

            <fieldset className="mt-7 border-t border-[#E7DDD3] pt-7">
              <legend className="text-[18px] font-black text-[#0E1A2B]">
                {content.designTitle}
              </legend>
              <div className="mt-5 grid gap-5">
                <div>
                  <label htmlFor="valance-text" className="mb-2 block text-[13px] font-extrabold text-[#263445]">
                    {content.textLabel}
                  </label>
                  <input
                    id="valance-text"
                    type="text"
                    dir="auto"
                    maxLength={1000}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder={content.textPlaceholder}
                    aria-invalid={compositionIsEmpty || !textIsSupported}
                    aria-describedby={
                      compositionIsEmpty || !textIsSupported ? 'valance-text-error' : undefined
                    }
                    className={`min-h-12 w-full rounded-[14px] border bg-white px-4 text-[16px] font-bold text-[#0E1A2B] outline-none transition placeholder:text-[#8A96A4] focus:ring-4 ${
                      compositionIsEmpty || !textIsSupported
                        ? 'border-[#B84D3E] focus:border-[#B84D3E] focus:ring-[#B84D3E]/12'
                        : 'border-[#D8C9BC] focus:border-[#B8643E] focus:ring-[#B8643E]/12'
                    }`}
                  />
                  {compositionIsEmpty || !textIsSupported ? (
                    <p id="valance-text-error" className="mt-2 text-[13px] font-semibold leading-5 text-[#A53D32]">
                      {compositionIsEmpty
                        ? content.errors.emptyComposition
                        : content.errors.unsupportedCharacters}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label htmlFor="valance-font" className="mb-2 block text-[13px] font-extrabold text-[#263445]">
                      {content.fontLabel}
                    </label>
                    <select
                      id="valance-font"
                      value={fontId}
                      onChange={(event) => setFontId(event.target.value)}
                      aria-invalid={measurementState.status === 'error'}
                      aria-describedby={measurementState.status === 'error' ? 'valance-font-error' : undefined}
                      className="min-h-12 w-full rounded-[14px] border border-[#D8C9BC] bg-white px-4 text-[15px] font-bold text-[#0E1A2B] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/12"
                    >
                      {ILLUMINATED_VALANCE_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                    {measurementState.status === 'error' ? (
                      <p id="valance-font-error" className="mt-2 text-[13px] font-semibold leading-5 text-[#A53D32]">
                        {content.errors.fontLoad}
                      </p>
                    ) : null}
                  </div>
                  <NumberField
                    id="letter-height"
                    label={content.letterHeightLabel}
                    value={letterHeight}
                    onChange={setLetterHeight}
                    error={
                      !parsedLetterHeight
                        ? content.errors.positiveNumber
                        : lettersTooTall
                          ? content.errors.lettersTooTall
                          : undefined
                    }
                  />
                </div>

                <fieldset>
                  <legend className="mb-2 block text-[13px] font-extrabold text-[#263445]">
                    {content.logoLabel}
                  </legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(['none', 'left', 'right', 'both'] as const).map((placement) => (
                      <label key={placement} className="min-w-0">
                        <input
                          type="radio"
                          name="logo-placement"
                          value={placement}
                          checked={logoPlacement === placement}
                          onChange={() => setLogoPlacement(placement)}
                          className="peer sr-only"
                        />
                        <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-[12px] border border-[#D8C9BC] bg-white px-2 text-center text-[13px] font-extrabold leading-4 text-[#526174] transition peer-checked:border-[#B8643E] peer-checked:bg-[#F4E4DA] peer-checked:text-[#8B432B] peer-focus-visible:ring-4 peer-focus-visible:ring-[#B8643E]/20">
                          {content.logoOptions[placement]}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <NumberField
                  id="valance-quantity"
                  label={content.quantityLabel}
                  value={quantity}
                  onChange={setQuantity}
                  integer
                  error={quantityIsValid ? undefined : content.errors.wholeQuantity}
                />
              </div>
            </fieldset>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#0E1A2B] p-5 text-white shadow-[0_24px_64px_rgba(14,26,43,0.2)] sm:p-7">
            <div className="flex flex-col gap-2 text-start sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-[20px] font-black">{content.previewTitle}</h3>
              </div>
              {measurementState.status === 'loading' ? (
                <span className="text-[12px] font-bold text-[#F2C6A3]">{content.measuringText}</span>
              ) : null}
            </div>

            <div
              dir="ltr"
              className={`mt-6 min-w-0 overflow-hidden rounded-[20px] border bg-[#07101B] p-3 transition-colors sm:p-5 ${
                hasLayoutError ? 'border-[#E88472]' : 'border-white/12'
              }`}
            >
              {parsedLength && parsedHeight && geometry && selectedFont ? (
                <svg
                  role="img"
                  aria-label={content.previewAriaLabel}
                  viewBox={`0 0 ${parsedLength} ${parsedHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="block h-auto max-h-[360px] min-h-[48px] w-full"
                >
                  <rect
                    x="1"
                    y="1"
                    width={Math.max(0, parsedLength - 2)}
                    height={Math.max(0, parsedHeight - 2)}
                    rx={Math.min(18, parsedHeight / 8)}
                    fill="#173653"
                    stroke={hasLayoutError ? '#F08B76' : '#7BA7C7'}
                    strokeWidth={Math.max(2, Math.min(parsedLength, parsedHeight) / 70)}
                  />

                  {hasLeftLogo ? (
                    <g>
                      <circle
                        cx={geometry.placement.logoLeft?.centerMm}
                        cy={parsedHeight / 2}
                        r={logoRadius}
                        fill="#F4E4DA"
                        stroke="#E2A07C"
                        strokeWidth={Math.max(1, parsedHeight / 120)}
                      />
                      <text
                        x={geometry.placement.logoLeft?.centerMm}
                        y={parsedHeight / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={Math.max(6, parsedLetterHeight ? parsedLetterHeight * 0.23 : 6)}
                        fontWeight="800"
                        fill="#6E3524"
                      >
                        {content.logoMark}
                      </text>
                    </g>
                  ) : null}

                  {text.trim() && measurementState.status === 'ready' ? (
                    <text
                      x={geometry.placement.text?.startMm}
                      y={textBaselineY}
                      fontFamily={`"${selectedFont.family}"`}
                      fontWeight={selectedFont.weight}
                      fontSize={measurementState.svgFontSizeMm}
                      fill="#FFFFFF"
                    >
                      {text}
                    </text>
                  ) : null}

                  {hasRightLogo ? (
                    <g>
                      <circle
                        cx={geometry.placement.logoRight?.centerMm}
                        cy={parsedHeight / 2}
                        r={logoRadius}
                        fill="#F4E4DA"
                        stroke="#E2A07C"
                        strokeWidth={Math.max(1, parsedHeight / 120)}
                      />
                      <text
                        x={geometry.placement.logoRight?.centerMm}
                        y={parsedHeight / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={Math.max(6, parsedLetterHeight ? parsedLetterHeight * 0.23 : 6)}
                        fontWeight="800"
                        fill="#6E3524"
                      >
                        {content.logoMark}
                      </text>
                    </g>
                  ) : null}
                </svg>
              ) : (
                <div className="flex min-h-28 items-center justify-center px-4 text-center text-[14px] font-semibold leading-6 text-white/58">
                  {measurementState.status === 'error'
                    ? content.errors.fontLoad
                    : content.measuringText}
                </div>
              )}
            </div>

            {geometry ? (
              <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric label={content.totalLengthLabel} value={formatMillimeters(parsedLength ?? 0)} />
                <Metric label={content.textLengthLabel} value={formatMillimeters(geometry.textLengthMm)} />
                <Metric label={content.occupiedLengthLabel} value={formatMillimeters(geometry.lightLengthMm)} />
                <Metric
                  label={content.freeLengthLabel}
                  value={formatMillimeters(Math.max(0, geometry.availableLengthMm - geometry.lightLengthMm))}
                />
              </dl>
            ) : null}

            {liveMessage ? (
              <div aria-live="polite" aria-atomic="true" className="mt-4 text-start">
                <p className={`text-[14px] font-bold leading-6 ${hasLayoutError || measurementState.status === 'error' ? 'text-[#FFAA98]' : 'text-[#BBD8CB]'}`}>
                  {liveMessage}
                </p>
              </div>
            ) : null}

            {pricing ? (
              <div
                className="mt-5 rounded-[20px] border border-[#E2A07C]/32 bg-[#13263A] p-4 text-start sm:p-5"
                data-valance-pricing
              >
                <h4 className="text-[17px] font-black text-white">
                  {content.pricingTitle}
                </h4>
                <p
                  className="mt-3 text-[32px] font-black leading-none tracking-[-0.02em] text-white sm:text-[38px]"
                  data-valance-net-total
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {formatMoney(pricing.netSubtotalForQuantity)}
                </p>

                <p className="mt-4 text-[12px] font-semibold leading-5 text-white/64">
                  {content.priceDisclaimer}
                </p>
                <p className="mt-2 text-[12px] font-semibold leading-5 text-[#F2C6A3]/78">
                  {content.excludedCostsNote}
                </p>
              </div>
            ) : calculationResult?.status === 'individual-review' ? (
              <div
                className="mt-5 rounded-[18px] border border-[#E88472]/35 bg-[#8C3F33]/18 p-4 text-start sm:p-5"
                data-valance-individual-review
              >
                <p className="text-[15px] font-black text-white">
                  {content.individualReviewTitle}
                </p>
                <p className="mt-2 text-[14px] font-semibold leading-6 text-white/70">
                  {zoneTooLong ? content.errors.zoneTooLong : content.individualReviewText}
                </p>
              </div>
            ) : null}

            {calculationSnapshot ? (
              <button
                type="button"
                data-service-intent="illuminated-valance-calculation-request"
                data-valance-request-cta
                onClick={() => setIsRequestDrawerOpen(true)}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#B8643E] px-5 py-3 text-[15px] font-black text-white shadow-lg shadow-[#B8643E33] transition-colors hover:bg-[#A65835] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2C6A3]"
              >
                {content.requestCta}
              </button>
            ) : null}

            <p className="mt-4 text-start text-[12px] font-semibold leading-5 text-white/48">
              {content.schematicNote}
            </p>
          </div>
        </div>
      </div>
      <LeistungenProblemDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
        title={content.drawerTitle}
        serviceInfoLabel={content.drawerServiceInfoLabel}
        reassuringLabel={content.drawerSummaryLabel}
        reassuringText={drawerSummary}
        formTitle={content.drawerFormTitle}
        formIntro={content.drawerFormIntro}
        closeLabel={content.drawerCloseLabel}
        initialIssueType="IlluminatedValance"
        initialMessage={content.requestInitialMessage}
        calculationSnapshot={calculationSnapshot}
      />
    </section>
  );
}
