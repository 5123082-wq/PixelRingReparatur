import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  calculateIlluminatedValance,
  evaluateIlluminatedValanceGeometry,
  scaleVerifiedTextMeasurement,
  type IlluminatedValanceCalculatorConfig,
  type IlluminatedValanceCalculatorInput,
  type IlluminatedValanceMeasuredText,
} from '../src/lib/illuminated-valance-calculator.ts';
import { ILLUMINATED_VALANCE_PROVISIONAL_CONFIG } from '../src/lib/illuminated-valance-provisional-config.ts';

const TEST_CONFIG: IlluminatedValanceCalculatorConfig = {
  version: 'test-only-v1',
  active: true,
  currency: 'EUR',
  fonts: [
    { id: 'test-wide', enabled: true },
    { id: 'test-narrow', enabled: true },
    { id: 'test-disabled', enabled: false },
  ],
  tariffs: {
    basePricePerSquareMeter: 100,
    lightPricePerLinearMeter: 200,
    zonePrice: 25,
    logoPrice: 50,
    minimumItemPrice: 250,
  },
  layout: {
    topMarginMm: 25,
    bottomMarginMm: 25,
    leftMarginMm: 50,
    rightMarginMm: 50,
    logoTextGapMm: 20,
    logoWidthToLetterHeightRatio: 1,
    logoEdgeCenterRatio: 0.07,
  },
  automaticRanges: {
    minLengthMm: 500,
    maxLengthMm: 6000,
    minHeightMm: 100,
    maxHeightMm: 1000,
    maxQuantity: 10,
  },
  tax: {
    mode: 'added',
    ratePercent: 20,
  },
  rounding: {
    increment: 1,
  },
};

const BASE_INPUT: IlluminatedValanceCalculatorInput = {
  valanceLengthMm: 2000,
  valanceHeightMm: 300,
  text: 'PIXEL RING',
  fontId: 'test-wide',
  letterHeightMm: 100,
  logoPlacement: 'none',
  quantity: 1,
};

function testConfig(
  overrides: Partial<IlluminatedValanceCalculatorConfig> = {}
): IlluminatedValanceCalculatorConfig {
  return {
    ...TEST_CONFIG,
    ...overrides,
    tariffs: { ...TEST_CONFIG.tariffs, ...overrides.tariffs },
    layout: { ...TEST_CONFIG.layout, ...overrides.layout },
    automaticRanges: {
      ...TEST_CONFIG.automaticRanges,
      ...overrides.automaticRanges,
    },
    tax: { ...TEST_CONFIG.tax, ...overrides.tax },
    rounding: { ...TEST_CONFIG.rounding, ...overrides.rounding },
  };
}

function measuredText(
  input: IlluminatedValanceCalculatorInput,
  widthMm = 700
): IlluminatedValanceMeasuredText {
  return {
    text: input.text,
    fontId: input.fontId,
    visibleLetterHeightMm: input.letterHeightMm,
    widthMm,
  };
}

test('calculates geometry and price from measured text without a font complexity factor', () => {
  const result = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT),
    TEST_CONFIG
  );

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;

  assert.deepEqual(result.geometry, {
    availableHeightMm: 250,
    availableLengthMm: 1900,
    textLengthMm: 700,
    logoCount: 0,
    logoWidthMm: 100,
    totalLogoWidthMm: 0,
    logoTextGapCount: 0,
    compositionWidthMm: 700,
    lightLengthMm: 700,
    lightZoneCount: 1,
    lightZones: [
      {
        kind: 'text',
        lengthMm: 700,
        heightMm: 100,
        areaSquareMeters: 0.07,
      },
    ],
    placement: {
      availableStartMm: 50,
      availableEndMm: 1950,
      availableCenterMm: 1000,
      text: {
        startMm: 650,
        endMm: 1350,
        centerMm: 1000,
        widthMm: 700,
      },
      logoLeft: null,
      logoRight: null,
    },
    illuminatedAreaSquareMeters: 0.07,
    valanceAreaSquareMeters: 0.6,
  });
  assert.equal(result.pricing.basePricePerItem, 60);
  assert.equal(result.pricing.lightPricePerItem, 140);
  assert.equal(result.pricing.zonePricePerItem, 25);
  assert.equal(result.pricing.logoPricePerItem, 0);
  assert.equal(result.pricing.calculatedPricePerItem, 225);
  assert.equal(result.pricing.minimumPriceApplied, true);
  assert.equal(result.pricing.chargeablePricePerItem, 250);
  assert.equal(result.pricing.taxAmount, 50);
  assert.equal(result.pricing.total, 300);
});

test('accepts letter height exactly equal to available height and rejects one millimeter more', () => {
  const exactInput = { ...BASE_INPUT, letterHeightMm: 250 };
  const exact = calculateIlluminatedValance(
    exactInput,
    measuredText(exactInput, 700),
    TEST_CONFIG
  );
  const tooTallInput = { ...BASE_INPUT, letterHeightMm: 251 };
  const tooTall = calculateIlluminatedValance(
    tooTallInput,
    measuredText(tooTallInput, 700),
    TEST_CONFIG
  );

  assert.equal(exact.status, 'priced');
  assert.equal(tooTall.status, 'invalid');
  if (tooTall.status !== 'invalid') return;
  assert.deepEqual(tooTall.errors, [
    { code: 'LETTERS_TOO_TALL', field: 'letterHeightMm' },
  ]);
});

test('accepts composition exactly at the available length and rejects overflow', () => {
  const exact = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT, 1900),
    TEST_CONFIG
  );
  const overflow = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT, 1900.01),
    TEST_CONFIG
  );

  assert.equal(exact.status, 'priced');
  assert.equal(overflow.status, 'invalid');
  if (overflow.status !== 'invalid') return;
  assert.deepEqual(overflow.errors, [
    { code: 'COMPOSITION_TOO_WIDE', field: 'composition' },
  ]);
});

test('left and right logo placements have the same aggregate geometry and pricing', () => {
  const leftInput = { ...BASE_INPUT, logoPlacement: 'left' as const };
  const rightInput = { ...BASE_INPUT, logoPlacement: 'right' as const };
  const left = calculateIlluminatedValance(
    leftInput,
    measuredText(leftInput),
    TEST_CONFIG
  );
  const right = calculateIlluminatedValance(
    rightInput,
    measuredText(rightInput),
    TEST_CONFIG
  );

  assert.equal(left.status, 'priced');
  assert.equal(right.status, 'priced');
  if (left.status !== 'priced' || right.status !== 'priced') return;
  assert.equal(left.geometry.compositionWidthMm, right.geometry.compositionWidthMm);
  assert.equal(
    left.geometry.illuminatedAreaSquareMeters,
    right.geometry.illuminatedAreaSquareMeters
  );
  assert.deepEqual(
    left.geometry.lightZones.map((zone) => zone.kind),
    ['logo-left', 'text']
  );
  assert.deepEqual(
    right.geometry.lightZones.map((zone) => zone.kind),
    ['text', 'logo-right']
  );
  assert.deepEqual(left.pricing, right.pricing);
  assert.equal(left.geometry.logoCount, 1);
  assert.equal(left.geometry.logoTextGapCount, 1);
  assert.equal(left.geometry.compositionWidthMm, 820);
  assert.equal(left.geometry.lightLengthMm, 800);
  assert.equal(left.geometry.lightZoneCount, 2);
  assert.equal(left.geometry.placement.text?.centerMm, 1000);
  assert.equal(right.geometry.placement.text?.centerMm, 1000);
  assert.equal(left.geometry.placement.logoLeft?.centerMm, 183);
  assert.equal(right.geometry.placement.logoRight?.centerMm, 1817);
});

test('rejects an invalid logo edge-center ratio as incomplete configuration', () => {
  const result = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT),
    testConfig({
      layout: {
        ...TEST_CONFIG.layout,
        logoEdgeCenterRatio: 0,
      },
    })
  );

  assert.equal(result.status, 'individual-review');
  if (result.status !== 'individual-review') return;
  assert.deepEqual(result.reviewReasons, [
    {
      code: 'CONFIGURATION_INCOMPLETE',
      details: ['layout.logoEdgeCenterRatio'],
    },
  ]);
});

test('detects a text-logo collision even when summed light widths fit the available length', () => {
  const input = {
    ...BASE_INPUT,
    valanceLengthMm: 1000,
    logoPlacement: 'left' as const,
  };
  const config = testConfig({
    layout: {
      ...TEST_CONFIG.layout,
      leftMarginMm: 0,
      rightMarginMm: 0,
      logoTextGapMm: 0,
    },
  });
  const result = calculateIlluminatedValance(
    input,
    measuredText(input, 800),
    config
  );

  assert.equal(result.status, 'invalid');
  if (result.status !== 'invalid') return;
  assert.equal(result.geometry?.lightLengthMm, 900);
  assert.equal(result.geometry?.availableLengthMm, 1000);
  assert.deepEqual(result.errors, [
    { code: 'COMPOSITION_TOO_WIDE', field: 'composition' },
  ]);
});

test('detects overlap between two edge logos in a logo-only composition', () => {
  const input = {
    ...BASE_INPUT,
    valanceLengthMm: 500,
    valanceHeightMm: 400,
    letterHeightMm: 300,
    text: '',
    logoPlacement: 'both' as const,
  };
  const config = testConfig({
    layout: {
      ...TEST_CONFIG.layout,
      leftMarginMm: 0,
      rightMarginMm: 0,
      logoTextGapMm: 0,
    },
  });
  const result = calculateIlluminatedValance(
    input,
    measuredText(input, 0),
    config
  );

  assert.equal(result.status, 'invalid');
  if (result.status !== 'invalid') return;
  assert.deepEqual(result.errors, [
    { code: 'COMPOSITION_TOO_WIDE', field: 'composition' },
  ]);
});

test('accepts exact logo-only contact and rejects a 0.01 millimeter overlap', () => {
  const exactInput = {
    ...BASE_INPUT,
    valanceLengthMm: 1000,
    valanceHeightMm: 600,
    letterHeightMm: 500,
    text: '',
    logoPlacement: 'both' as const,
  };
  const overlapInput = { ...exactInput, letterHeightMm: 500.01 };
  const config = testConfig({
    layout: {
      ...TEST_CONFIG.layout,
      leftMarginMm: 0,
      rightMarginMm: 0,
      logoTextGapMm: 0,
    },
  });
  const exact = calculateIlluminatedValance(
    exactInput,
    measuredText(exactInput, 0),
    config
  );
  const overlap = calculateIlluminatedValance(
    overlapInput,
    measuredText(overlapInput, 0),
    config
  );

  assert.equal(exact.status, 'priced');
  assert.equal(overlap.status, 'invalid');
  if (exact.status === 'priced') {
    assert.equal(exact.geometry.placement.logoLeft?.endMm, 500);
    assert.equal(exact.geometry.placement.logoRight?.startMm, 500);
  }
  if (overlap.status === 'invalid') {
    assert.deepEqual(overlap.errors, [
      { code: 'COMPOSITION_TOO_WIDE', field: 'composition' },
    ]);
  }
});

test('logos on both sides add two logos, two gaps and three light zones', () => {
  const input = { ...BASE_INPUT, logoPlacement: 'both' as const };
  const result = calculateIlluminatedValance(input, measuredText(input), TEST_CONFIG);

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.geometry.logoCount, 2);
  assert.equal(result.geometry.logoTextGapCount, 2);
  assert.equal(result.geometry.compositionWidthMm, 940);
  assert.equal(result.geometry.lightLengthMm, 900);
  assert.equal(result.geometry.lightZoneCount, 3);
  assert.equal(result.pricing.logoPricePerItem, 100);
  assert.equal(result.pricing.zonePricePerItem, 75);
});

test('supports a logo-only composition without charging a text gap or text zone', () => {
  const input = {
    ...BASE_INPUT,
    text: '',
    logoPlacement: 'both' as const,
  };
  const result = calculateIlluminatedValance(input, measuredText(input, 0), TEST_CONFIG);

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.geometry.logoTextGapCount, 0);
  assert.equal(result.geometry.compositionWidthMm, 200);
  assert.equal(result.geometry.lightLengthMm, 200);
  assert.equal(result.geometry.lightZoneCount, 2);
});

test('ignores measured whitespace width in a logo-only composition', () => {
  const input = {
    ...BASE_INPUT,
    text: '   ',
    logoPlacement: 'left' as const,
  };
  const result = calculateIlluminatedValance(input, measuredText(input, 80), TEST_CONFIG);

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.geometry.textLengthMm, 0);
  assert.equal(result.geometry.logoTextGapCount, 0);
  assert.equal(result.geometry.compositionWidthMm, 100);
  assert.equal(result.geometry.lightLengthMm, 100);
  assert.equal(result.geometry.lightZoneCount, 1);
  assert.equal(result.pricing.lightPricePerItem, 20);
});

test('different verified widths for different fonts change geometry and light price only', () => {
  const config = testConfig({
    tariffs: {
      ...TEST_CONFIG.tariffs,
      minimumItemPrice: 0,
    },
  });
  const wide = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT, 800),
    config
  );
  const narrowInput = { ...BASE_INPUT, fontId: 'test-narrow' };
  const narrow = calculateIlluminatedValance(
    narrowInput,
    measuredText(narrowInput, 600),
    config
  );

  assert.equal(wide.status, 'priced');
  assert.equal(narrow.status, 'priced');
  if (wide.status !== 'priced' || narrow.status !== 'priced') return;
  assert.equal(wide.geometry.textLengthMm, 800);
  assert.equal(narrow.geometry.textLengthMm, 600);
  assert.equal(wide.pricing.basePricePerItem, narrow.pricing.basePricePerItem);
  assert.equal(wide.pricing.lightPricePerItem - narrow.pricing.lightPricePerItem, 40);
  assert.equal(wide.pricing.total, 294);
  assert.equal(narrow.pricing.total, 246);
});

test('scales only verified font metrics and refuses unusable metric inputs', () => {
  assert.equal(
    scaleVerifiedTextMeasurement({
      widthAtReferenceHeightMm: 600,
      referenceVisibleLetterHeightMm: 100,
      targetVisibleLetterHeightMm: 150,
    }),
    900
  );
  assert.equal(
    scaleVerifiedTextMeasurement({
      widthAtReferenceHeightMm: 600,
      referenceVisibleLetterHeightMm: 0,
      targetVisibleLetterHeightMm: 150,
    }),
    null
  );
});

test('evaluates preview geometry without tariffs or a pricing configuration', () => {
  const result = evaluateIlluminatedValanceGeometry(
    BASE_INPUT,
    measuredText(BASE_INPUT, 700),
    TEST_CONFIG.layout
  );

  assert.equal(result.status, 'valid');
  if (result.status !== 'valid') return;
  assert.equal(result.geometry.availableHeightMm, 250);
  assert.equal(result.geometry.availableLengthMm, 1900);
  assert.equal(result.geometry.textLengthMm, 700);
  assert.equal(result.geometry.compositionWidthMm, 700);
});

test('preview geometry reports height and composition overflow without a price', () => {
  const input = {
    ...BASE_INPUT,
    valanceLengthMm: 500,
    valanceHeightMm: 200,
    letterHeightMm: 160,
  };
  const result = evaluateIlluminatedValanceGeometry(
    input,
    measuredText(input, 450),
    TEST_CONFIG.layout
  );

  assert.equal(result.status, 'invalid');
  if (result.status !== 'invalid') return;
  assert.deepEqual(
    result.errors.map((error) => error.code),
    ['LETTERS_TOO_TALL', 'COMPOSITION_TOO_WIDE']
  );
  assert.equal(result.geometry?.compositionWidthMm, 450);
});

test('preview geometry refuses a missing or mismatched verified measurement', () => {
  const missing = evaluateIlluminatedValanceGeometry(
    BASE_INPUT,
    null,
    TEST_CONFIG.layout
  );
  const mismatch = evaluateIlluminatedValanceGeometry(
    BASE_INPUT,
    { ...measuredText(BASE_INPUT), fontId: 'test-narrow' },
    TEST_CONFIG.layout
  );

  assert.equal(missing.status, 'measurement-unavailable');
  assert.deepEqual(missing.reviewReasons, [
    { code: 'TEXT_MEASUREMENT_UNAVAILABLE' },
  ]);
  assert.equal(mismatch.status, 'measurement-unavailable');
  assert.deepEqual(mismatch.reviewReasons, [
    { code: 'TEXT_MEASUREMENT_MISMATCH' },
  ]);
});

test('applies quantity after the per-item minimum price', () => {
  const input = { ...BASE_INPUT, quantity: 3 };
  const result = calculateIlluminatedValance(input, measuredText(input, 100), TEST_CONFIG);

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.pricing.minimumPriceApplied, true);
  assert.equal(result.pricing.chargeablePricePerItem, 250);
  assert.equal(result.pricing.subtotalForQuantity, 750);
  assert.equal(result.pricing.total, 900);
});

test('reports missing mandatory tariffs instead of treating them as zero', () => {
  const config = testConfig({
    tariffs: {
      ...TEST_CONFIG.tariffs,
      lightPricePerLinearMeter: null,
    },
  });
  const result = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT),
    config
  );

  assert.equal(result.status, 'individual-review');
  if (result.status !== 'individual-review') return;
  assert.deepEqual(result.reviewReasons, [
    {
      code: 'CONFIGURATION_INCOMPLETE',
      details: ['tariffs.lightPricePerLinearMeter'],
    },
  ]);
});

test('allows an explicitly configured zero zone tariff', () => {
  const config = testConfig({
    tariffs: {
      ...TEST_CONFIG.tariffs,
      zonePrice: 0,
    },
  });
  const result = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT),
    config
  );

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.pricing.zonePricePerItem, 0);
});

test('requires a verified measurement before automatic pricing', () => {
  const result = calculateIlluminatedValance(BASE_INPUT, null, TEST_CONFIG);

  assert.equal(result.status, 'individual-review');
  if (result.status !== 'individual-review') return;
  assert.deepEqual(result.reviewReasons, [
    { code: 'TEXT_MEASUREMENT_UNAVAILABLE' },
  ]);
});

test('does not calculate a price while the calculator configuration is inactive', () => {
  const result = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT),
    testConfig({ active: false })
  );

  assert.equal(result.status, 'individual-review');
  if (result.status !== 'individual-review') return;
  assert.deepEqual(result.reviewReasons, [{ code: 'CALCULATOR_INACTIVE' }]);
});

test('sends disabled, custom and mismatched fonts to individual review', () => {
  const disabledInput = { ...BASE_INPUT, fontId: 'test-disabled' };
  const customInput = { ...BASE_INPUT, fontId: 'customer-font' };
  const mismatchMeasurement = { ...measuredText(BASE_INPUT), fontId: 'test-narrow' };

  const disabled = calculateIlluminatedValance(
    disabledInput,
    measuredText(disabledInput),
    TEST_CONFIG
  );
  const custom = calculateIlluminatedValance(
    customInput,
    measuredText(customInput),
    TEST_CONFIG
  );
  const mismatch = calculateIlluminatedValance(
    BASE_INPUT,
    mismatchMeasurement,
    TEST_CONFIG
  );

  assert.equal(disabled.status, 'individual-review');
  assert.equal(custom.status, 'individual-review');
  assert.equal(mismatch.status, 'individual-review');
  if (disabled.status === 'individual-review') {
    assert.deepEqual(disabled.reviewReasons, [{ code: 'FONT_NOT_APPROVED' }]);
  }
  if (custom.status === 'individual-review') {
    assert.deepEqual(custom.reviewReasons, [{ code: 'FONT_NOT_APPROVED' }]);
  }
  if (mismatch.status === 'individual-review') {
    assert.deepEqual(mismatch.reviewReasons, [
      { code: 'TEXT_MEASUREMENT_MISMATCH' },
    ]);
  }
});

test('accepts automatic-range boundaries and routes values outside them to review', () => {
  const atMin = {
    ...BASE_INPUT,
    valanceLengthMm: 500,
    valanceHeightMm: 100,
    letterHeightMm: 50,
    quantity: 10,
  };
  const outside = {
    ...BASE_INPUT,
    valanceLengthMm: 6000.01,
    quantity: 11,
  };
  const minResult = calculateIlluminatedValance(
    atMin,
    measuredText(atMin, 400),
    TEST_CONFIG
  );
  const outsideResult = calculateIlluminatedValance(
    outside,
    measuredText(outside, 700),
    TEST_CONFIG
  );

  assert.equal(minResult.status, 'priced');
  assert.equal(outsideResult.status, 'individual-review');
  if (outsideResult.status !== 'individual-review') return;
  assert.deepEqual(outsideResult.reviewReasons, [
    { code: 'DIMENSIONS_OUTSIDE_AUTOMATIC_RANGE' },
    { code: 'QUANTITY_OUTSIDE_AUTOMATIC_RANGE' },
  ]);
});

test('applies included tax and configured rounding without adding tax twice', () => {
  const config = testConfig({
    tariffs: {
      ...TEST_CONFIG.tariffs,
      minimumItemPrice: 0,
    },
    tax: { mode: 'included', ratePercent: 20 },
    rounding: { increment: 5 },
  });
  const result = calculateIlluminatedValance(
    BASE_INPUT,
    measuredText(BASE_INPUT, 723),
    config
  );

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.pricing.calculatedPricePerItem, 229.6);
  assert.equal(result.pricing.taxAmount, 38.27);
  assert.equal(result.pricing.totalBeforeRounding, 229.6);
  assert.equal(result.pricing.total, 230);
  assert.equal(result.pricing.roundingAdjustment, 0.4);
});

test('rejects invalid numeric input and an empty composition without producing a price', () => {
  const input = {
    ...BASE_INPUT,
    valanceLengthMm: Number.NaN,
    valanceHeightMm: 0,
    letterHeightMm: -1,
    quantity: 1.5,
    text: '   ',
    logoPlacement: 'none' as const,
  };
  const result = calculateIlluminatedValance(input, null, TEST_CONFIG);

  assert.equal(result.status, 'invalid');
  if (result.status !== 'invalid') return;
  assert.deepEqual(
    result.errors.map((error) => error.code),
    [
      'INVALID_VALANCE_LENGTH',
      'INVALID_VALANCE_HEIGHT',
      'INVALID_LETTER_HEIGHT',
      'INVALID_QUANTITY',
      'EMPTY_COMPOSITION',
    ]
  );
});

test('provisional config exposes only the approved recalibrated v2 tariffs', () => {
  assert.equal(
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG.version,
    'provisional-area-zones-recalibrated-2026-07-17-v2'
  );
  assert.deepEqual(ILLUMINATED_VALANCE_PROVISIONAL_CONFIG.areaZonePricing?.tariffs, {
    fixedSetupPerItem: 245,
    basePricePerSquareMeter: 475,
    illuminatedPricePerSquareMeter: 380,
    standardAdditionalZonePrice: 225,
    longAdditionalZonePrice: 560,
    standardZoneMaxLengthMm: 1200,
    longZoneMaxLengthMm: 2400,
  });
  assert.equal(
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG.layout.logoEdgeCenterRatio,
    0.07
  );
});

test('control geometry keeps centered text, edge logos and the approved net price', () => {
  const input: IlluminatedValanceCalculatorInput = {
    valanceLengthMm: 9500,
    valanceHeightMm: 400,
    text: 'TSOMI',
    fontId: 'playfair-display',
    letterHeightMm: 300,
    logoPlacement: 'both',
    quantity: 1,
  };
  const result = calculateIlluminatedValance(
    input,
    measuredText(input, 1315.2631578947367),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.geometry.placement.text?.centerMm, 4750);
  assert.ok(
    Math.abs((result.geometry.placement.logoLeft?.centerMm ?? 0) - 665) <
      Number.EPSILON * 1000
  );
  assert.ok(
    Math.abs((result.geometry.placement.logoRight?.centerMm ?? 0) - 8835) <
      Number.EPSILON * 10000
  );
  assert.equal(result.pricing.netSubtotalForQuantity, 2718.34);
});

test('provisional area pricing calculates the approved setup, areas, VAT and gross total', () => {
  const input: IlluminatedValanceCalculatorInput = {
    valanceLengthMm: 5000,
    valanceHeightMm: 320,
    text: 'PIXELRING',
    fontId: 'montserrat',
    letterHeightMm: 200,
    logoPlacement: 'none',
    quantity: 1,
  };
  const result = calculateIlluminatedValance(
    input,
    measuredText(input, 1702.3),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.pricing.model, 'area-zones');
  assert.equal(result.geometry.valanceAreaSquareMeters, 1.6);
  assert.equal(result.geometry.illuminatedAreaSquareMeters, 0.34046);
  assert.equal(result.pricing.setupPricePerItem, 245);
  assert.equal(result.pricing.basePricePerItem, 760);
  assert.equal(result.pricing.illuminatedAreaPricePerItem, 129.37);
  assert.equal(result.pricing.additionalZonePricePerItem, 0);
  assert.equal(result.pricing.netPricePerItem, 1134.37);
  assert.equal(result.pricing.netSubtotalForQuantity, 1134.37);
  assert.equal(result.pricing.taxAmount, 215.53);
  assert.equal(result.pricing.grossTotal, 1349.91);
});

test('text with two logos creates two correctly charged additional zones', () => {
  const input: IlluminatedValanceCalculatorInput = {
    valanceLengthMm: 5000,
    valanceHeightMm: 320,
    text: 'PIXELRING',
    fontId: 'montserrat',
    letterHeightMm: 200,
    logoPlacement: 'both',
    quantity: 1,
  };
  const result = calculateIlluminatedValance(
    input,
    measuredText(input, 1000),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.deepEqual(
    result.geometry.lightZones.map((zone) => [zone.kind, zone.lengthMm]),
    [
      ['logo-left', 200],
      ['text', 1000],
      ['logo-right', 200],
    ]
  );
  assert.equal(result.geometry.illuminatedAreaSquareMeters, 0.28);
  assert.equal(result.pricing.standardAdditionalZoneCount, 2);
  assert.equal(result.pricing.longAdditionalZoneCount, 0);
  assert.equal(result.pricing.additionalZonePricePerItem, 450);
  assert.equal(result.pricing.logoPricePerItem, 0);
});

test('one logo has identical area-zone pricing on the left and right of long text', () => {
  const baseInput: IlluminatedValanceCalculatorInput = {
    valanceLengthMm: 5000,
    valanceHeightMm: 500,
    text: 'PIXELRING',
    fontId: 'montserrat',
    letterHeightMm: 200,
    logoPlacement: 'left',
    quantity: 1,
  };
  const leftInput = { ...baseInput, logoPlacement: 'left' as const };
  const rightInput = { ...baseInput, logoPlacement: 'right' as const };
  const left = calculateIlluminatedValance(
    leftInput,
    measuredText(leftInput, 1500),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );
  const right = calculateIlluminatedValance(
    rightInput,
    measuredText(rightInput, 1500),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );

  assert.equal(left.status, 'priced');
  assert.equal(right.status, 'priced');
  if (left.status !== 'priced' || right.status !== 'priced') return;
  assert.deepEqual(left.pricing, right.pricing);
  assert.equal(left.pricing.standardAdditionalZoneCount, 1);
  assert.equal(left.pricing.longAdditionalZoneCount, 0);
  assert.equal(left.pricing.additionalZonePricePerItem, 225);
});

test('additional zone pricing changes at the 1200 millimeter boundary', () => {
  const standardInput: IlluminatedValanceCalculatorInput = {
    valanceLengthMm: 4000,
    valanceHeightMm: 1500,
    text: '',
    fontId: 'montserrat',
    letterHeightMm: 1200,
    logoPlacement: 'both',
    quantity: 1,
  };
  const longInput = { ...standardInput, letterHeightMm: 1200.01 };
  const standard = calculateIlluminatedValance(
    standardInput,
    measuredText(standardInput, 0),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );
  const long = calculateIlluminatedValance(
    longInput,
    measuredText(longInput, 0),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );

  assert.equal(standard.status, 'priced');
  assert.equal(long.status, 'priced');
  if (standard.status !== 'priced' || long.status !== 'priced') return;
  assert.equal(standard.pricing.standardAdditionalZoneCount, 1);
  assert.equal(standard.pricing.additionalZonePricePerItem, 225);
  assert.equal(long.pricing.longAdditionalZoneCount, 1);
  assert.equal(long.pricing.additionalZonePricePerItem, 560);
});

test('a light zone longer than 2400 millimeters requires individual review without pricing', () => {
  const input: IlluminatedValanceCalculatorInput = {
    valanceLengthMm: 5000,
    valanceHeightMm: 320,
    text: 'OVERSIZED',
    fontId: 'montserrat',
    letterHeightMm: 100,
    logoPlacement: 'none',
    quantity: 1,
  };
  const result = calculateIlluminatedValance(
    input,
    measuredText(input, 2400.01),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );

  assert.equal(result.status, 'individual-review');
  if (result.status !== 'individual-review') return;
  assert.deepEqual(result.reviewReasons, [
    { code: 'LIGHT_ZONE_TOO_LONG', details: ['text:2400.01'] },
  ]);
  assert.equal('pricing' in result, false);
});

test('provisional pricing multiplies the complete per-item net before VAT', () => {
  const input: IlluminatedValanceCalculatorInput = {
    valanceLengthMm: 5000,
    valanceHeightMm: 320,
    text: 'PIXELRING',
    fontId: 'montserrat',
    letterHeightMm: 200,
    logoPlacement: 'none',
    quantity: 3,
  };
  const result = calculateIlluminatedValance(
    input,
    measuredText(input, 1702.3),
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );

  assert.equal(result.status, 'priced');
  if (result.status !== 'priced') return;
  assert.equal(result.pricing.netPricePerItem, 1134.37);
  assert.equal(result.pricing.netSubtotalForQuantity, 3403.12);
  assert.equal(result.pricing.taxAmount, 646.59);
  assert.equal(result.pricing.grossTotal, 4049.72);
});
