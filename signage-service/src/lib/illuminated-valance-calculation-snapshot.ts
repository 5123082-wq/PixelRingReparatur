import type {
  IlluminatedValanceCalculationResult,
  IlluminatedValanceIndividualReviewResult,
  IlluminatedValancePricedResult,
} from './illuminated-valance-calculator.ts';
import {
  CalculationSnapshotValidationError,
  normalizeCalculationSnapshot,
  type CalculationSnapshot,
  type CalculationSnapshotField,
} from './calculation-snapshot.ts';

type SnapshotEligibleResult =
  | IlluminatedValancePricedResult
  | IlluminatedValanceIndividualReviewResult;

function buildFields(result: SnapshotEligibleResult): CalculationSnapshotField[] {
  const fields: CalculationSnapshotField[] = [
    { key: 'valance.length', type: 'number', value: result.input.valanceLengthMm, unit: 'mm' },
    { key: 'valance.height', type: 'number', value: result.input.valanceHeightMm, unit: 'mm' },
    { key: 'design.text', type: 'string', value: result.input.text },
    { key: 'design.fontId', type: 'string', value: result.input.fontId },
    { key: 'design.letterHeight', type: 'number', value: result.input.letterHeightMm, unit: 'mm' },
  ];

  if (result.measurement) {
    fields.push({
      key: 'design.measuredTextLength',
      type: 'number',
      value: result.measurement.widthMm,
      unit: 'mm',
    });
  }

  fields.push({
    key: 'design.logoPlacement',
    type: 'string',
    value: result.input.logoPlacement,
  });

  if (result.geometry) {
    fields.push({
      key: 'design.lightZoneCount',
      type: 'number',
      value: result.geometry.lightZoneCount,
    });
  }

  fields.push({ key: 'order.quantity', type: 'number', value: result.input.quantity });
  return fields;
}

export function buildIlluminatedValanceCalculationSnapshot(
  result: IlluminatedValanceCalculationResult | null,
  sourceLocale: string
): CalculationSnapshot | null {
  if (!result || result.status === 'invalid') return null;

  const snapshot: CalculationSnapshot = {
    schemaVersion: 1,
    calculatorId: 'illuminated-valance',
    configVersion: result.configVersion,
    sourceLocale,
    resultStatus: result.status,
    fields: buildFields(result),
    ...(result.status === 'priced'
      ? {
          price: {
            currency: 'EUR' as const,
            netTotal: result.pricing.netSubtotalForQuantity,
          },
        }
      : {
          reviewReasons: result.reviewReasons.map((reason) => reason.code),
        }),
  };

  try {
    return normalizeCalculationSnapshot(snapshot);
  } catch (error) {
    if (error instanceof CalculationSnapshotValidationError) return null;
    throw error;
  }
}
