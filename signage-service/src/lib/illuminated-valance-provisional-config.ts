import type { IlluminatedValanceCalculatorConfig } from './illuminated-valance-calculator.ts';
import { ILLUMINATED_VALANCE_FONTS } from './illuminated-valance-fonts.ts';

/**
 * Owner-approved provisional public pricing. Kept as one typed, versioned
 * configuration so it can later move behind the CMS without tariff values
 * leaking into UI components.
 */
export const ILLUMINATED_VALANCE_PROVISIONAL_CONFIG: IlluminatedValanceCalculatorConfig = {
  version: 'provisional-area-zones-recalibrated-2026-07-17-v2',
  active: true,
  currency: 'EUR',
  fonts: ILLUMINATED_VALANCE_FONTS.map((font) => ({
    id: font.id,
    enabled: true,
  })),
  // Retained for compatibility with the original linear model. The active
  // area-zone model below is the only pricing path used by this configuration.
  tariffs: {
    basePricePerSquareMeter: null,
    lightPricePerLinearMeter: null,
    zonePrice: null,
    logoPrice: null,
    minimumItemPrice: null,
  },
  areaZonePricing: {
    model: 'area-zones',
    tariffs: {
      fixedSetupPerItem: 245,
      basePricePerSquareMeter: 475,
      illuminatedPricePerSquareMeter: 380,
      standardAdditionalZonePrice: 225,
      longAdditionalZonePrice: 560,
      standardZoneMaxLengthMm: 1200,
      longZoneMaxLengthMm: 2400,
    },
  },
  layout: {
    topMarginMm: 0,
    bottomMarginMm: 0,
    leftMarginMm: 0,
    rightMarginMm: 0,
    logoTextGapMm: 0,
    logoWidthToLetterHeightRatio: 1,
    logoEdgeCenterRatio: 0.07,
  },
  automaticRanges: null,
  tax: {
    mode: 'added',
    ratePercent: 19,
  },
  rounding: {
    increment: 0.01,
  },
};
