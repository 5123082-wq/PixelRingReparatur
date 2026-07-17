export const ILLUMINATED_VALANCE_LOGO_PLACEMENTS = [
  'none',
  'left',
  'right',
  'both',
] as const;

export type IlluminatedValanceLogoPlacement =
  (typeof ILLUMINATED_VALANCE_LOGO_PLACEMENTS)[number];

export type IlluminatedValanceCalculatorInput = {
  valanceLengthMm: number;
  valanceHeightMm: number;
  text: string;
  fontId: string;
  letterHeightMm: number;
  logoPlacement: IlluminatedValanceLogoPlacement;
  quantity: number;
};

/**
 * Geometry produced by a separate, verified font-metrics adapter.
 * The calculator deliberately does not read browser or operating-system fonts.
 */
export type IlluminatedValanceMeasuredText = {
  text: string;
  fontId: string;
  visibleLetterHeightMm: number;
  widthMm: number;
};

export type IlluminatedValanceFontOption = {
  id: string;
  enabled: boolean;
};

export type IlluminatedValanceTariffs = {
  basePricePerSquareMeter: number | null;
  lightPricePerLinearMeter: number | null;
  zonePrice: number | null;
  logoPrice: number | null;
  minimumItemPrice: number | null;
};

export type IlluminatedValanceAreaZoneTariffs = {
  fixedSetupPerItem: number | null;
  basePricePerSquareMeter: number | null;
  illuminatedPricePerSquareMeter: number | null;
  standardAdditionalZonePrice: number | null;
  longAdditionalZonePrice: number | null;
  standardZoneMaxLengthMm: number | null;
  longZoneMaxLengthMm: number | null;
};

export type IlluminatedValanceAreaZonePricingConfig = {
  model: 'area-zones';
  tariffs: IlluminatedValanceAreaZoneTariffs;
};

type ResolvedIlluminatedValanceTariffs = {
  [Key in keyof IlluminatedValanceTariffs]: number;
};

type ResolvedIlluminatedValanceAreaZoneTariffs = {
  [Key in keyof IlluminatedValanceAreaZoneTariffs]: number;
};

export type IlluminatedValanceLayoutRules = {
  topMarginMm: number;
  bottomMarginMm: number;
  leftMarginMm: number;
  rightMarginMm: number;
  logoTextGapMm: number;
  logoWidthToLetterHeightRatio: number;
  logoEdgeCenterRatio: number;
};

export type IlluminatedValanceAutomaticRanges = {
  minLengthMm: number;
  maxLengthMm: number;
  minHeightMm: number;
  maxHeightMm: number;
  maxQuantity: number;
};

export type IlluminatedValanceTaxRule = {
  mode: 'included' | 'added';
  ratePercent: number | null;
};

export type IlluminatedValanceRoundingRule = {
  increment: number | null;
};

export type IlluminatedValanceCalculatorConfig = {
  version: string;
  active: boolean;
  currency: string;
  fonts: IlluminatedValanceFontOption[];
  tariffs: IlluminatedValanceTariffs;
  areaZonePricing?: IlluminatedValanceAreaZonePricingConfig;
  layout: IlluminatedValanceLayoutRules;
  automaticRanges: IlluminatedValanceAutomaticRanges | null;
  tax: IlluminatedValanceTaxRule;
  rounding: IlluminatedValanceRoundingRule;
};

export type IlluminatedValanceLightZoneKind =
  | 'text'
  | 'logo-left'
  | 'logo-right';

export type IlluminatedValanceLightZone = {
  kind: IlluminatedValanceLightZoneKind;
  lengthMm: number;
  heightMm: number;
  areaSquareMeters: number;
};

export type IlluminatedValancePlacedInterval = {
  startMm: number;
  endMm: number;
  centerMm: number;
  widthMm: number;
};

export type IlluminatedValancePlacementGeometry = {
  availableStartMm: number;
  availableEndMm: number;
  availableCenterMm: number;
  text: IlluminatedValancePlacedInterval | null;
  logoLeft: IlluminatedValancePlacedInterval | null;
  logoRight: IlluminatedValancePlacedInterval | null;
};

export type IlluminatedValanceGeometry = {
  availableHeightMm: number;
  availableLengthMm: number;
  textLengthMm: number;
  logoCount: number;
  logoWidthMm: number;
  totalLogoWidthMm: number;
  logoTextGapCount: number;
  compositionWidthMm: number;
  lightLengthMm: number;
  lightZoneCount: number;
  lightZones: IlluminatedValanceLightZone[];
  placement: IlluminatedValancePlacementGeometry;
  illuminatedAreaSquareMeters: number;
  valanceAreaSquareMeters: number;
};

export const ILLUMINATED_VALANCE_INPUT_ERROR_CODES = [
  'INVALID_VALANCE_LENGTH',
  'INVALID_VALANCE_HEIGHT',
  'INVALID_LETTER_HEIGHT',
  'INVALID_QUANTITY',
  'INVALID_FONT_ID',
  'INVALID_LOGO_PLACEMENT',
  'EMPTY_COMPOSITION',
  'LETTERS_TOO_TALL',
  'COMPOSITION_TOO_WIDE',
] as const;

export type IlluminatedValanceInputErrorCode =
  (typeof ILLUMINATED_VALANCE_INPUT_ERROR_CODES)[number];

export type IlluminatedValanceInputError = {
  code: IlluminatedValanceInputErrorCode;
  field:
    | 'valanceLengthMm'
    | 'valanceHeightMm'
    | 'letterHeightMm'
    | 'quantity'
    | 'fontId'
    | 'logoPlacement'
    | 'text'
    | 'composition';
};

export const ILLUMINATED_VALANCE_REVIEW_REASON_CODES = [
  'CALCULATOR_INACTIVE',
  'CONFIGURATION_INCOMPLETE',
  'DIMENSIONS_OUTSIDE_AUTOMATIC_RANGE',
  'QUANTITY_OUTSIDE_AUTOMATIC_RANGE',
  'FONT_NOT_APPROVED',
  'TEXT_MEASUREMENT_UNAVAILABLE',
  'TEXT_MEASUREMENT_MISMATCH',
  'LIGHT_ZONE_TOO_LONG',
] as const;

export type IlluminatedValanceReviewReasonCode =
  (typeof ILLUMINATED_VALANCE_REVIEW_REASON_CODES)[number];

export type IlluminatedValanceReviewReason = {
  code: IlluminatedValanceReviewReasonCode;
  details?: string[];
};

export type IlluminatedValancePricing = {
  model: 'legacy-linear' | 'area-zones';
  currency: string;
  taxMode: IlluminatedValanceTaxRule['mode'];
  setupPricePerItem: number;
  basePricePerItem: number;
  lightPricePerItem: number;
  illuminatedAreaSquareMeters: number;
  illuminatedAreaPricePerItem: number;
  zonePricePerItem: number;
  additionalZonePricePerItem: number;
  standardAdditionalZoneCount: number;
  longAdditionalZoneCount: number;
  logoPricePerItem: number;
  calculatedPricePerItem: number;
  minimumPriceApplied: boolean;
  chargeablePricePerItem: number;
  quantity: number;
  subtotalForQuantity: number;
  netPricePerItem: number;
  netSubtotalForQuantity: number;
  taxAmount: number;
  totalBeforeRounding: number;
  roundingAdjustment: number;
  total: number;
  grossTotal: number;
};

type IlluminatedValanceCalculationBase = {
  input: IlluminatedValanceCalculatorInput;
  configVersion: string;
};

export type IlluminatedValancePricedResult = IlluminatedValanceCalculationBase & {
  status: 'priced';
  errors: [];
  reviewReasons: [];
  measurement: IlluminatedValanceMeasuredText;
  geometry: IlluminatedValanceGeometry;
  pricing: IlluminatedValancePricing;
};

export type IlluminatedValanceInvalidResult = IlluminatedValanceCalculationBase & {
  status: 'invalid';
  errors: IlluminatedValanceInputError[];
  reviewReasons: [];
  measurement?: IlluminatedValanceMeasuredText;
  geometry?: IlluminatedValanceGeometry;
};

export type IlluminatedValanceIndividualReviewResult =
  IlluminatedValanceCalculationBase & {
    status: 'individual-review';
    errors: [];
    reviewReasons: IlluminatedValanceReviewReason[];
    measurement?: IlluminatedValanceMeasuredText;
    geometry?: IlluminatedValanceGeometry;
  };

export type IlluminatedValanceCalculationResult =
  | IlluminatedValancePricedResult
  | IlluminatedValanceInvalidResult
  | IlluminatedValanceIndividualReviewResult;

export type IlluminatedValanceGeometryEvaluation =
  | {
      status: 'valid';
      errors: [];
      reviewReasons: [];
      measurement: IlluminatedValanceMeasuredText;
      geometry: IlluminatedValanceGeometry;
    }
  | {
      status: 'invalid';
      errors: IlluminatedValanceInputError[];
      reviewReasons: [];
      measurement?: IlluminatedValanceMeasuredText;
      geometry?: IlluminatedValanceGeometry;
    }
  | {
      status: 'measurement-unavailable';
      errors: [];
      reviewReasons: IlluminatedValanceReviewReason[];
      measurement?: IlluminatedValanceMeasuredText;
    };

export type VerifiedTextMeasurementScaleInput = {
  widthAtReferenceHeightMm: number;
  referenceVisibleLetterHeightMm: number;
  targetVisibleLetterHeightMm: number;
};

function isFinitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isFiniteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundToIncrement(value: number, increment: number): number {
  return roundMoney(Math.round(value / increment) * increment);
}

function countLogos(placement: IlluminatedValanceLogoPlacement): number {
  if (placement === 'both') {
    return 2;
  }

  return placement === 'none' ? 0 : 1;
}

function getBasicInputErrors(
  input: IlluminatedValanceCalculatorInput
): IlluminatedValanceInputError[] {
  const errors: IlluminatedValanceInputError[] = [];

  if (!isFinitePositive(input.valanceLengthMm)) {
    errors.push({ code: 'INVALID_VALANCE_LENGTH', field: 'valanceLengthMm' });
  }

  if (!isFinitePositive(input.valanceHeightMm)) {
    errors.push({ code: 'INVALID_VALANCE_HEIGHT', field: 'valanceHeightMm' });
  }

  if (!isFinitePositive(input.letterHeightMm)) {
    errors.push({ code: 'INVALID_LETTER_HEIGHT', field: 'letterHeightMm' });
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    errors.push({ code: 'INVALID_QUANTITY', field: 'quantity' });
  }

  if (!input.fontId.trim()) {
    errors.push({ code: 'INVALID_FONT_ID', field: 'fontId' });
  }

  if (!ILLUMINATED_VALANCE_LOGO_PLACEMENTS.includes(input.logoPlacement)) {
    errors.push({ code: 'INVALID_LOGO_PLACEMENT', field: 'logoPlacement' });
  }

  if (!input.text.trim() && input.logoPlacement === 'none') {
    errors.push({ code: 'EMPTY_COMPOSITION', field: 'text' });
  }

  return errors;
}

function getConfigurationProblems(
  config: IlluminatedValanceCalculatorConfig
): string[] {
  const problems: string[] = [];
  const { automaticRanges, layout, tariffs } = config;

  if (!config.version.trim()) problems.push('version');
  if (!config.currency.trim()) problems.push('currency');
  if (!Array.isArray(config.fonts) || config.fonts.length === 0) problems.push('fonts');

  if (config.areaZonePricing) {
    const areaTariffs = config.areaZonePricing.tariffs;
    const priceEntries = [
      ['fixedSetupPerItem', areaTariffs.fixedSetupPerItem],
      ['basePricePerSquareMeter', areaTariffs.basePricePerSquareMeter],
      ['illuminatedPricePerSquareMeter', areaTariffs.illuminatedPricePerSquareMeter],
      ['standardAdditionalZonePrice', areaTariffs.standardAdditionalZonePrice],
      ['longAdditionalZonePrice', areaTariffs.longAdditionalZonePrice],
    ] as const;

    for (const [name, value] of priceEntries) {
      if (value === null || !isFiniteNonNegative(value)) {
        problems.push(`areaZonePricing.tariffs.${name}`);
      }
    }

    if (
      areaTariffs.standardZoneMaxLengthMm === null ||
      !isFinitePositive(areaTariffs.standardZoneMaxLengthMm)
    ) {
      problems.push('areaZonePricing.tariffs.standardZoneMaxLengthMm');
    }

    if (
      areaTariffs.longZoneMaxLengthMm === null ||
      !isFinitePositive(areaTariffs.longZoneMaxLengthMm) ||
      (areaTariffs.standardZoneMaxLengthMm !== null &&
        areaTariffs.longZoneMaxLengthMm <= areaTariffs.standardZoneMaxLengthMm)
    ) {
      problems.push('areaZonePricing.tariffs.longZoneMaxLengthMm');
    }
  } else {
    const tariffEntries = Object.entries(tariffs);
    for (const [name, value] of tariffEntries) {
      if (value === null || !isFiniteNonNegative(value)) {
        problems.push(`tariffs.${name}`);
      }
    }
  }

  const marginEntries = [
    ['topMarginMm', layout.topMarginMm],
    ['bottomMarginMm', layout.bottomMarginMm],
    ['leftMarginMm', layout.leftMarginMm],
    ['rightMarginMm', layout.rightMarginMm],
    ['logoTextGapMm', layout.logoTextGapMm],
  ] as const;
  for (const [name, value] of marginEntries) {
    if (!isFiniteNonNegative(value)) problems.push(`layout.${name}`);
  }

  if (!isFinitePositive(layout.logoWidthToLetterHeightRatio)) {
    problems.push('layout.logoWidthToLetterHeightRatio');
  }

  if (
    !isFinitePositive(layout.logoEdgeCenterRatio) ||
    layout.logoEdgeCenterRatio > 0.5
  ) {
    problems.push('layout.logoEdgeCenterRatio');
  }

  if (automaticRanges) {
    if (
      !isFinitePositive(automaticRanges.minLengthMm) ||
      !isFinitePositive(automaticRanges.maxLengthMm) ||
      automaticRanges.minLengthMm > automaticRanges.maxLengthMm
    ) {
      problems.push('automaticRanges.length');
    }

    if (
      !isFinitePositive(automaticRanges.minHeightMm) ||
      !isFinitePositive(automaticRanges.maxHeightMm) ||
      automaticRanges.minHeightMm > automaticRanges.maxHeightMm
    ) {
      problems.push('automaticRanges.height');
    }

    if (!Number.isInteger(automaticRanges.maxQuantity) || automaticRanges.maxQuantity < 1) {
      problems.push('automaticRanges.maxQuantity');
    }
  }

  if (config.tax.ratePercent === null || !isFiniteNonNegative(config.tax.ratePercent)) {
    problems.push('tax.ratePercent');
  }

  if (config.rounding.increment === null || !isFinitePositive(config.rounding.increment)) {
    problems.push('rounding.increment');
  }

  return problems;
}

function getMeasurementReviewReason(
  input: IlluminatedValanceCalculatorInput,
  measurement: IlluminatedValanceMeasuredText | null
): IlluminatedValanceReviewReason | null {
  if (!measurement) {
    return { code: 'TEXT_MEASUREMENT_UNAVAILABLE' };
  }

  const measurementMatchesInput =
    measurement.text === input.text &&
    measurement.fontId === input.fontId &&
    measurement.visibleLetterHeightMm === input.letterHeightMm;
  const widthIsValid =
    isFiniteNonNegative(measurement.widthMm) &&
    (input.text.trim().length === 0 || measurement.widthMm > 0);

  return measurementMatchesInput && widthIsValid
    ? null
    : { code: 'TEXT_MEASUREMENT_MISMATCH' };
}

function buildGeometry(
  input: IlluminatedValanceCalculatorInput,
  measurement: IlluminatedValanceMeasuredText,
  layout: IlluminatedValanceLayoutRules
): IlluminatedValanceGeometry {
  const hasText = input.text.trim().length > 0;
  const textLengthMm = hasText ? measurement.widthMm : 0;
  const logoCount = countLogos(input.logoPlacement);
  const logoWidthMm = input.letterHeightMm * layout.logoWidthToLetterHeightRatio;
  const totalLogoWidthMm = logoCount * logoWidthMm;
  const logoTextGapCount = hasText ? logoCount : 0;
  const compositionWidthMm =
    textLengthMm +
    totalLogoWidthMm +
    logoTextGapCount * layout.logoTextGapMm;
  const lightZones: IlluminatedValanceLightZone[] = [];
  const availableStartMm = layout.leftMarginMm;
  const availableEndMm = input.valanceLengthMm - layout.rightMarginMm;
  const availableLengthMm = availableEndMm - availableStartMm;
  const availableCenterMm = (availableStartMm + availableEndMm) / 2;
  const logoRadiusMm = logoWidthMm / 2;
  const logoEdgeCenterOffsetMm = Math.max(
    availableLengthMm * layout.logoEdgeCenterRatio,
    logoRadiusMm
  );

  const makeInterval = (
    centerMm: number,
    widthMm: number
  ): IlluminatedValancePlacedInterval => ({
    startMm: centerMm - widthMm / 2,
    endMm: centerMm + widthMm / 2,
    centerMm,
    widthMm,
  });

  const placement: IlluminatedValancePlacementGeometry = {
    availableStartMm,
    availableEndMm,
    availableCenterMm,
    text: hasText ? makeInterval(availableCenterMm, textLengthMm) : null,
    logoLeft:
      input.logoPlacement === 'left' || input.logoPlacement === 'both'
        ? makeInterval(availableStartMm + logoEdgeCenterOffsetMm, logoWidthMm)
        : null,
    logoRight:
      input.logoPlacement === 'right' || input.logoPlacement === 'both'
        ? makeInterval(availableEndMm - logoEdgeCenterOffsetMm, logoWidthMm)
        : null,
  };

  const addZone = (kind: IlluminatedValanceLightZoneKind, lengthMm: number) => {
    lightZones.push({
      kind,
      lengthMm,
      heightMm: input.letterHeightMm,
      areaSquareMeters: (lengthMm * input.letterHeightMm) / 1_000_000,
    });
  };

  if (input.logoPlacement === 'left' || input.logoPlacement === 'both') {
    addZone('logo-left', logoWidthMm);
  }
  if (hasText) {
    addZone('text', textLengthMm);
  }
  if (input.logoPlacement === 'right' || input.logoPlacement === 'both') {
    addZone('logo-right', logoWidthMm);
  }
  const illuminatedAreaSquareMeters = lightZones.reduce(
    (sum, zone) => sum + zone.areaSquareMeters,
    0
  );

  return {
    availableHeightMm:
      input.valanceHeightMm - layout.topMarginMm - layout.bottomMarginMm,
    availableLengthMm:
      input.valanceLengthMm - layout.leftMarginMm - layout.rightMarginMm,
    textLengthMm,
    logoCount,
    logoWidthMm,
    totalLogoWidthMm,
    logoTextGapCount,
    compositionWidthMm,
    lightLengthMm: textLengthMm + totalLogoWidthMm,
    lightZoneCount: lightZones.length,
    lightZones,
    placement,
    illuminatedAreaSquareMeters,
    valanceAreaSquareMeters:
      (input.valanceLengthMm / 1000) * (input.valanceHeightMm / 1000),
  };
}

function intervalsViolateMinimumGap(
  first: IlluminatedValancePlacedInterval,
  second: IlluminatedValancePlacedInterval,
  minimumGapMm: number
): boolean {
  const [left, right] =
    first.startMm <= second.startMm ? [first, second] : [second, first];

  return left.endMm + minimumGapMm > right.startMm;
}

function getGeometryFitErrors(
  input: IlluminatedValanceCalculatorInput,
  geometry: IlluminatedValanceGeometry,
  layout: IlluminatedValanceLayoutRules
): IlluminatedValanceInputError[] {
  const errors: IlluminatedValanceInputError[] = [];

  if (input.letterHeightMm > geometry.availableHeightMm) {
    errors.push({ code: 'LETTERS_TOO_TALL', field: 'letterHeightMm' });
  }

  const intervals = [
    geometry.placement.text,
    geometry.placement.logoLeft,
    geometry.placement.logoRight,
  ].filter(
    (interval): interval is IlluminatedValancePlacedInterval => Boolean(interval)
  );
  const crossesAvailableBoundary = intervals.some(
    (interval) =>
      interval.startMm < geometry.placement.availableStartMm ||
      interval.endMm > geometry.placement.availableEndMm
  );
  const textInterval = geometry.placement.text;
  const textLogoCollision = textInterval
    ? [geometry.placement.logoLeft, geometry.placement.logoRight]
        .filter(
          (interval): interval is IlluminatedValancePlacedInterval =>
            Boolean(interval)
        )
        .some((logo) =>
          intervalsViolateMinimumGap(
            textInterval,
            logo,
            layout.logoTextGapMm
          )
        )
    : false;
  const logoOnlyCollision =
    !geometry.placement.text &&
    geometry.placement.logoLeft !== null &&
    geometry.placement.logoRight !== null &&
    intervalsViolateMinimumGap(
      geometry.placement.logoLeft,
      geometry.placement.logoRight,
      layout.logoTextGapMm
    );

  if (crossesAvailableBoundary || textLogoCollision || logoOnlyCollision) {
    errors.push({ code: 'COMPOSITION_TOO_WIDE', field: 'composition' });
  }

  return errors;
}

function buildPricing(
  input: IlluminatedValanceCalculatorInput,
  geometry: IlluminatedValanceGeometry,
  config: IlluminatedValanceCalculatorConfig
): IlluminatedValancePricing {
  const taxRate = config.tax.ratePercent as number;
  const roundingIncrement = config.rounding.increment as number;
  let model: IlluminatedValancePricing['model'];
  let setupPricePerItem: number;
  let basePricePerItem: number;
  let lightPricePerItem: number;
  let zonePricePerItem: number;
  let logoPricePerItem: number;
  let standardAdditionalZoneCount: number;
  let longAdditionalZoneCount: number;
  let calculatedPricePerItem: number;
  let chargeablePricePerItem: number;
  let minimumPriceApplied: boolean;

  if (config.areaZonePricing) {
    model = 'area-zones';
    const tariffs = config.areaZonePricing
      .tariffs as ResolvedIlluminatedValanceAreaZoneTariffs;
    const hasTextZone = geometry.lightZones.some((zone) => zone.kind === 'text');
    const additionalZones = hasTextZone
      ? geometry.lightZones.filter((zone) => zone.kind !== 'text')
      : geometry.lightZones.slice(1);
    standardAdditionalZoneCount = additionalZones.filter(
      (zone) => zone.lengthMm <= tariffs.standardZoneMaxLengthMm
    ).length;
    longAdditionalZoneCount = additionalZones.length - standardAdditionalZoneCount;
    setupPricePerItem = tariffs.fixedSetupPerItem;
    basePricePerItem =
      geometry.valanceAreaSquareMeters * tariffs.basePricePerSquareMeter;
    lightPricePerItem =
      geometry.illuminatedAreaSquareMeters * tariffs.illuminatedPricePerSquareMeter;
    zonePricePerItem =
      standardAdditionalZoneCount * tariffs.standardAdditionalZonePrice +
      longAdditionalZoneCount * tariffs.longAdditionalZonePrice;
    logoPricePerItem = 0;
    calculatedPricePerItem =
      setupPricePerItem + basePricePerItem + lightPricePerItem + zonePricePerItem;
    chargeablePricePerItem = calculatedPricePerItem;
    minimumPriceApplied = false;
  } else {
    model = 'legacy-linear';
    const tariffs = config.tariffs as ResolvedIlluminatedValanceTariffs;
    setupPricePerItem = 0;
    basePricePerItem =
      geometry.valanceAreaSquareMeters * tariffs.basePricePerSquareMeter;
    lightPricePerItem =
      (geometry.lightLengthMm / 1000) * tariffs.lightPricePerLinearMeter;
    zonePricePerItem = geometry.lightZoneCount * tariffs.zonePrice;
    logoPricePerItem = geometry.logoCount * tariffs.logoPrice;
    standardAdditionalZoneCount = 0;
    longAdditionalZoneCount = 0;
    calculatedPricePerItem =
      basePricePerItem + lightPricePerItem + zonePricePerItem + logoPricePerItem;
    chargeablePricePerItem = Math.max(
      tariffs.minimumItemPrice,
      calculatedPricePerItem
    );
    minimumPriceApplied = tariffs.minimumItemPrice > calculatedPricePerItem;
  }

  const subtotalForQuantity = chargeablePricePerItem * input.quantity;
  const taxRateFraction = taxRate / 100;
  const taxAmount =
    config.tax.mode === 'added'
      ? subtotalForQuantity * taxRateFraction
      : subtotalForQuantity - subtotalForQuantity / (1 + taxRateFraction);
  const totalBeforeRounding =
    config.tax.mode === 'added'
      ? subtotalForQuantity + taxAmount
      : subtotalForQuantity;
  const total = roundToIncrement(totalBeforeRounding, roundingIncrement);

  return {
    model,
    currency: config.currency,
    taxMode: config.tax.mode,
    setupPricePerItem: roundMoney(setupPricePerItem),
    basePricePerItem: roundMoney(basePricePerItem),
    lightPricePerItem: roundMoney(lightPricePerItem),
    illuminatedAreaSquareMeters: geometry.illuminatedAreaSquareMeters,
    illuminatedAreaPricePerItem: roundMoney(lightPricePerItem),
    zonePricePerItem: roundMoney(zonePricePerItem),
    additionalZonePricePerItem: roundMoney(zonePricePerItem),
    standardAdditionalZoneCount,
    longAdditionalZoneCount,
    logoPricePerItem: roundMoney(logoPricePerItem),
    calculatedPricePerItem: roundMoney(calculatedPricePerItem),
    minimumPriceApplied,
    chargeablePricePerItem: roundMoney(chargeablePricePerItem),
    quantity: input.quantity,
    subtotalForQuantity: roundMoney(subtotalForQuantity),
    netPricePerItem: roundMoney(chargeablePricePerItem),
    netSubtotalForQuantity: roundMoney(subtotalForQuantity),
    taxAmount: roundMoney(taxAmount),
    totalBeforeRounding: roundMoney(totalBeforeRounding),
    roundingAdjustment: roundMoney(total - totalBeforeRounding),
    total,
    grossTotal: total,
  };
}

/**
 * Scales a width already measured from verified font metrics. It does not
 * inspect or approximate a font and therefore remains deterministic.
 */
export function scaleVerifiedTextMeasurement(
  input: VerifiedTextMeasurementScaleInput
): number | null {
  if (
    !isFiniteNonNegative(input.widthAtReferenceHeightMm) ||
    !isFinitePositive(input.referenceVisibleLetterHeightMm) ||
    !isFinitePositive(input.targetVisibleLetterHeightMm)
  ) {
    return null;
  }

  return (
    input.widthAtReferenceHeightMm *
    (input.targetVisibleLetterHeightMm / input.referenceVisibleLetterHeightMm)
  );
}

/**
 * Evaluates only the customer-visible composition geometry. It deliberately
 * has no tariff, tax, range or CMS dependency, so a preview can be validated
 * before PixelRing publishes a pricing configuration.
 */
export function evaluateIlluminatedValanceGeometry(
  input: IlluminatedValanceCalculatorInput,
  measurement: IlluminatedValanceMeasuredText | null,
  layout: IlluminatedValanceLayoutRules
): IlluminatedValanceGeometryEvaluation {
  const basicErrors = getBasicInputErrors(input);

  if (basicErrors.length > 0) {
    return {
      status: 'invalid',
      errors: basicErrors,
      reviewReasons: [],
    };
  }

  const measurementReason = getMeasurementReviewReason(input, measurement);

  if (measurementReason || !measurement) {
    return {
      status: 'measurement-unavailable',
      errors: [],
      reviewReasons: measurementReason ? [measurementReason] : [],
      ...(measurement ? { measurement } : {}),
    };
  }

  const geometry = buildGeometry(input, measurement, layout);
  const fitErrors = getGeometryFitErrors(input, geometry, layout);

  return fitErrors.length > 0
    ? {
        status: 'invalid',
        errors: fitErrors,
        reviewReasons: [],
        measurement,
        geometry,
      }
    : {
        status: 'valid',
        errors: [],
        reviewReasons: [],
        measurement,
        geometry,
      };
}

export function calculateIlluminatedValance(
  input: IlluminatedValanceCalculatorInput,
  measurement: IlluminatedValanceMeasuredText | null,
  config: IlluminatedValanceCalculatorConfig
): IlluminatedValanceCalculationResult {
  const base = { input, configVersion: config.version };
  const basicErrors = getBasicInputErrors(input);

  if (basicErrors.length > 0) {
    return {
      ...base,
      status: 'invalid',
      errors: basicErrors,
      reviewReasons: [],
    };
  }

  if (!config.active) {
    return {
      ...base,
      status: 'individual-review',
      errors: [],
      reviewReasons: [{ code: 'CALCULATOR_INACTIVE' }],
    };
  }

  const configurationProblems = getConfigurationProblems(config);
  if (configurationProblems.length > 0) {
    return {
      ...base,
      status: 'individual-review',
      errors: [],
      reviewReasons: [
        { code: 'CONFIGURATION_INCOMPLETE', details: configurationProblems },
      ],
    };
  }

  const reviewReasons: IlluminatedValanceReviewReason[] = [];
  const { automaticRanges } = config;

  if (automaticRanges) {
    if (
      input.valanceLengthMm < automaticRanges.minLengthMm ||
      input.valanceLengthMm > automaticRanges.maxLengthMm ||
      input.valanceHeightMm < automaticRanges.minHeightMm ||
      input.valanceHeightMm > automaticRanges.maxHeightMm
    ) {
      reviewReasons.push({ code: 'DIMENSIONS_OUTSIDE_AUTOMATIC_RANGE' });
    }

    if (input.quantity > automaticRanges.maxQuantity) {
      reviewReasons.push({ code: 'QUANTITY_OUTSIDE_AUTOMATIC_RANGE' });
    }
  }

  const font = config.fonts.find((option) => option.id === input.fontId);
  if (!font?.enabled) {
    reviewReasons.push({ code: 'FONT_NOT_APPROVED' });
  }

  const measurementReason = getMeasurementReviewReason(input, measurement);
  if (measurementReason) {
    reviewReasons.push(measurementReason);
  }

  if (reviewReasons.length > 0 || !measurement) {
    return {
      ...base,
      status: 'individual-review',
      errors: [],
      reviewReasons,
      ...(measurement ? { measurement } : {}),
    };
  }

  const geometry = buildGeometry(input, measurement, config.layout);
  const fitErrors = getGeometryFitErrors(input, geometry, config.layout);

  if (fitErrors.length > 0) {
    return {
      ...base,
      status: 'invalid',
      errors: fitErrors,
      reviewReasons: [],
      measurement,
      geometry,
    };
  }

  if (config.areaZonePricing) {
    const maxZoneLengthMm = config.areaZonePricing.tariffs.longZoneMaxLengthMm;
    const oversizedZones =
      maxZoneLengthMm === null
        ? []
        : geometry.lightZones.filter((zone) => zone.lengthMm > maxZoneLengthMm);

    if (oversizedZones.length > 0) {
      return {
        ...base,
        status: 'individual-review',
        errors: [],
        reviewReasons: [
          {
            code: 'LIGHT_ZONE_TOO_LONG',
            details: oversizedZones.map(
              (zone) => `${zone.kind}:${roundMoney(zone.lengthMm)}`
            ),
          },
        ],
        measurement,
        geometry,
      };
    }
  }

  return {
    ...base,
    status: 'priced',
    errors: [],
    reviewReasons: [],
    measurement,
    geometry,
    pricing: buildPricing(input, geometry, config),
  };
}
