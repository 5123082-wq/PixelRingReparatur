export const CALCULATION_SNAPSHOT_FORM_FIELD = 'calculationSnapshot';
export const CALCULATION_SNAPSHOT_SCHEMA_VERSION = 1;
export const CALCULATION_SNAPSHOT_MAX_BYTES = 24 * 1024;
export const CALCULATION_SNAPSHOT_MAX_FIELDS = 40;

export type CalculationSnapshotResultStatus =
  | 'priced'
  | 'individual-review';

export type CalculationSnapshotPrimitiveType =
  | 'string'
  | 'number'
  | 'boolean';

export type CalculationSnapshotField = {
  key: string;
  type: CalculationSnapshotPrimitiveType;
  value: string | number | boolean;
  unit?: string;
};

export type CalculationSnapshot = {
  schemaVersion: 1;
  calculatorId: 'illuminated-valance';
  configVersion: string;
  sourceLocale: string;
  resultStatus: CalculationSnapshotResultStatus;
  fields: CalculationSnapshotField[];
  price?: {
    currency: 'EUR';
    netTotal: number;
  };
  reviewReasons?: string[];
};

const TOP_LEVEL_KEYS = new Set([
  'schemaVersion',
  'calculatorId',
  'configVersion',
  'sourceLocale',
  'resultStatus',
  'fields',
  'price',
  'reviewReasons',
]);
const FIELD_KEYS = new Set(['key', 'type', 'value', 'unit']);
const PRICE_KEYS = new Set(['currency', 'netTotal']);
const FIELD_KEY_PATTERN = /^[a-z][A-Za-z0-9]*(?:[.-][a-z][A-Za-z0-9]*)*$/;
const STABLE_CODE_PATTERN = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/;
const LOCALE_PATTERN = /^[a-z]{2,3}(?:-[A-Z0-9]{2,8})?$/;
const UNIT_PATTERN = /^[A-Za-z0-9%²³./_-]{1,24}$/u;

export class CalculationSnapshotValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculationSnapshotValidationError';
  }
}

function fail(message: string): never {
  throw new CalculationSnapshotValidationError(message);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: Set<string>,
  context: string
) {
  const unknownKey = Object.keys(value).find((key) => !allowedKeys.has(key));
  if (unknownKey) fail(`${context} contains unknown property: ${unknownKey}`);
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function normalizeField(value: unknown, index: number): CalculationSnapshotField {
  if (!isPlainObject(value)) fail(`fields[${index}] must be an object`);
  assertOnlyKeys(value, FIELD_KEYS, `fields[${index}]`);

  const key = value.key;
  const type = value.type;
  const fieldValue = value.value;
  const unit = value.unit;

  if (typeof key !== 'string' || key.length > 80 || !FIELD_KEY_PATTERN.test(key)) {
    fail(`fields[${index}].key is invalid`);
  }
  if (type !== 'string' && type !== 'number' && type !== 'boolean') {
    fail(`fields[${index}].type is invalid`);
  }
  if (typeof fieldValue !== type) {
    fail(`fields[${index}].value does not match its type`);
  }
  if (type === 'string' && (fieldValue as string).length > 1000) {
    fail(`fields[${index}].value is too long`);
  }
  if (type === 'number' && !Number.isFinite(fieldValue as number)) {
    fail(`fields[${index}].value must be finite`);
  }
  if (unit !== undefined && (typeof unit !== 'string' || !UNIT_PATTERN.test(unit))) {
    fail(`fields[${index}].unit is invalid`);
  }

  return unit === undefined
    ? { key, type, value: fieldValue as string | number | boolean }
    : { key, type, value: fieldValue as string | number | boolean, unit };
}

/**
 * Validates and copies a snapshot into the current language-independent shape.
 * Arbitrary field row keys are retained; unknown structural properties are rejected.
 */
export function normalizeCalculationSnapshot(value: unknown): CalculationSnapshot {
  if (!isPlainObject(value)) fail('Calculation snapshot must be an object');
  assertOnlyKeys(value, TOP_LEVEL_KEYS, 'Calculation snapshot');

  if (value.schemaVersion !== CALCULATION_SNAPSHOT_SCHEMA_VERSION) {
    fail('Unsupported calculation snapshot schema version');
  }
  if (value.calculatorId !== 'illuminated-valance') {
    fail('Unsupported calculator id');
  }
  if (
    typeof value.configVersion !== 'string' ||
    value.configVersion.length < 1 ||
    value.configVersion.length > 120
  ) {
    fail('Invalid calculator config version');
  }
  if (
    typeof value.sourceLocale !== 'string' ||
    !LOCALE_PATTERN.test(value.sourceLocale)
  ) {
    fail('Invalid source locale');
  }
  if (value.resultStatus !== 'priced' && value.resultStatus !== 'individual-review') {
    fail('Unsupported calculation result status');
  }
  if (
    !Array.isArray(value.fields) ||
    value.fields.length < 1 ||
    value.fields.length > CALCULATION_SNAPSHOT_MAX_FIELDS
  ) {
    fail('Invalid calculation snapshot field count');
  }

  const fields = value.fields.map(normalizeField);
  const fieldKeys = new Set<string>();
  for (const field of fields) {
    if (fieldKeys.has(field.key)) fail(`Duplicate calculation field: ${field.key}`);
    fieldKeys.add(field.key);
  }

  let price: CalculationSnapshot['price'];
  if (value.price !== undefined) {
    if (!isPlainObject(value.price)) fail('price must be an object');
    assertOnlyKeys(value.price, PRICE_KEYS, 'price');
    if (value.price.currency !== 'EUR') fail('Unsupported calculation currency');
    if (
      typeof value.price.netTotal !== 'number' ||
      !Number.isFinite(value.price.netTotal) ||
      value.price.netTotal < 0 ||
      value.price.netTotal > 1_000_000_000
    ) {
      fail('Invalid calculation net total');
    }
    price = { currency: 'EUR', netTotal: value.price.netTotal };
  }

  let reviewReasons: string[] | undefined;
  if (value.reviewReasons !== undefined) {
    if (
      !Array.isArray(value.reviewReasons) ||
      value.reviewReasons.length > 16 ||
      value.reviewReasons.some(
        (reason) =>
          typeof reason !== 'string' ||
          reason.length > 80 ||
          !STABLE_CODE_PATTERN.test(reason)
      )
    ) {
      fail('Invalid review reason codes');
    }
    reviewReasons = [...value.reviewReasons];
  }

  if (value.resultStatus === 'priced' && !price) {
    fail('A priced snapshot requires a net price');
  }
  if (value.resultStatus === 'priced' && reviewReasons?.length) {
    fail('A priced snapshot cannot contain review reasons');
  }
  if (value.resultStatus === 'individual-review' && price) {
    fail('An individual-review snapshot cannot contain a price');
  }
  if (value.resultStatus === 'individual-review' && !reviewReasons?.length) {
    fail('An individual-review snapshot requires a review reason');
  }

  return {
    schemaVersion: CALCULATION_SNAPSHOT_SCHEMA_VERSION,
    calculatorId: 'illuminated-valance',
    configVersion: value.configVersion,
    sourceLocale: value.sourceLocale,
    resultStatus: value.resultStatus,
    fields,
    ...(price ? { price } : {}),
    ...(reviewReasons ? { reviewReasons } : {}),
  };
}

export function tryNormalizeCalculationSnapshot(value: unknown): CalculationSnapshot | null {
  try {
    return normalizeCalculationSnapshot(value);
  } catch {
    return null;
  }
}

export function serializeCalculationSnapshot(snapshot: CalculationSnapshot): string {
  const serialized = JSON.stringify(normalizeCalculationSnapshot(snapshot));
  if (byteLength(serialized) > CALCULATION_SNAPSHOT_MAX_BYTES) {
    fail('Calculation snapshot is too large');
  }
  return serialized;
}

export function parseCalculationSnapshotFormValue(
  value: FormDataEntryValue | null
): CalculationSnapshot | null {
  if (value === null) return null;
  if (typeof value !== 'string' || value.length === 0) {
    fail('Calculation snapshot must be a non-empty JSON string');
  }
  if (byteLength(value) > CALCULATION_SNAPSHOT_MAX_BYTES) {
    fail('Calculation snapshot is too large');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    fail('Calculation snapshot must be valid JSON');
  }

  return normalizeCalculationSnapshot(parsed);
}
