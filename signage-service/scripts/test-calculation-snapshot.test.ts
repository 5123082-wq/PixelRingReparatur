import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

import {
  CALCULATION_SNAPSHOT_MAX_BYTES,
  CalculationSnapshotValidationError,
  normalizeCalculationSnapshot,
  parseCalculationSnapshotFormValue,
  serializeCalculationSnapshot,
} from '../src/lib/calculation-snapshot.ts';
import {
  formatCalculationSnapshotRows,
  formatCalculationSnapshotStatus,
} from '../src/lib/calculation-snapshot-crm.ts';
import { buildIlluminatedValanceCalculationSnapshot } from '../src/lib/illuminated-valance-calculation-snapshot.ts';
import {
  calculateIlluminatedValance,
  type IlluminatedValanceCalculatorInput,
} from '../src/lib/illuminated-valance-calculator.ts';
import { ILLUMINATED_VALANCE_PROVISIONAL_CONFIG } from '../src/lib/illuminated-valance-provisional-config.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const BASE_INPUT: IlluminatedValanceCalculatorInput = {
  valanceLengthMm: 5000,
  valanceHeightMm: 320,
  text: 'PIXELRING',
  fontId: 'montserrat',
  letterHeightMm: 100,
  logoPlacement: 'both',
  quantity: 2,
};

function calculate(widthMm: number) {
  return calculateIlluminatedValance(
    BASE_INPUT,
    {
      text: BASE_INPUT.text,
      fontId: BASE_INPUT.fontId,
      visibleLetterHeightMm: BASE_INPUT.letterHeightMm,
      widthMm,
    },
    ILLUMINATED_VALANCE_PROVISIONAL_CONFIG
  );
}

function buildPricedSnapshot(locale = 'de') {
  const result = calculate(900);
  assert.equal(result.status, 'priced');
  const snapshot = buildIlluminatedValanceCalculationSnapshot(result, locale);
  assert.ok(snapshot);
  return snapshot;
}

test('builder creates an ordered priced snapshot with one net total', () => {
  const snapshot = buildPricedSnapshot();

  assert.equal(snapshot.resultStatus, 'priced');
  assert.equal(snapshot.price?.currency, 'EUR');
  assert.deepEqual(
    snapshot.fields.map((field) => field.key),
    [
      'valance.length',
      'valance.height',
      'design.text',
      'design.fontId',
      'design.letterHeight',
      'design.measuredTextLength',
      'design.logoPlacement',
      'design.lightZoneCount',
      'order.quantity',
    ]
  );
  assert.equal(snapshot.reviewReasons, undefined);
});

test('builder creates an individual-review snapshot without a price', () => {
  const result = calculate(2400.01);
  assert.equal(result.status, 'individual-review');

  const snapshot = buildIlluminatedValanceCalculationSnapshot(result, 'ru');
  assert.ok(snapshot);
  assert.equal(snapshot.resultStatus, 'individual-review');
  assert.equal(snapshot.price, undefined);
  assert.deepEqual(snapshot.reviewReasons, ['LIGHT_ZONE_TOO_LONG']);
});

test('parser rejects malformed, oversized and unknown structural input', () => {
  assert.equal(parseCalculationSnapshotFormValue(null), null);
  assert.throws(
    () => parseCalculationSnapshotFormValue('{not-json'),
    CalculationSnapshotValidationError
  );
  assert.throws(
    () => parseCalculationSnapshotFormValue('x'.repeat(CALCULATION_SNAPSHOT_MAX_BYTES + 1)),
    CalculationSnapshotValidationError
  );

  const snapshot = buildPricedSnapshot();
  assert.throws(
    () => normalizeCalculationSnapshot({ ...snapshot, unexpected: true }),
    CalculationSnapshotValidationError
  );
  assert.throws(
    () =>
      normalizeCalculationSnapshot({
        ...snapshot,
        fields: [{ ...snapshot.fields[0], unexpected: true }],
      }),
    CalculationSnapshotValidationError
  );
});

test('a future field key survives parsing and uses a stable CRM fallback label', () => {
  const snapshot = buildPricedSnapshot();
  const withFutureField = {
    ...snapshot,
    fields: [
      ...snapshot.fields,
      { key: 'awning.color', type: 'string' as const, value: 'navy' },
    ],
  };
  const parsed = parseCalculationSnapshotFormValue(
    serializeCalculationSnapshot(withFutureField)
  );

  assert.ok(parsed);
  assert.deepEqual(parsed.fields.at(-1), {
    key: 'awning.color',
    type: 'string',
    value: 'navy',
  });
  assert.deepEqual(formatCalculationSnapshotRows(parsed).at(-1), {
    key: 'awning.color',
    label: 'awning.color',
    value: 'navy',
  });
});

test('DE and RU snapshots keep identical structural keys and stable codes', () => {
  const result = calculate(2400.01);
  const de = buildIlluminatedValanceCalculationSnapshot(result, 'de');
  const ru = buildIlluminatedValanceCalculationSnapshot(result, 'ru');
  assert.ok(de && ru);

  assert.deepEqual(
    de.fields.map(({ key, type, unit }) => ({ key, type, unit })),
    ru.fields.map(({ key, type, unit }) => ({ key, type, unit }))
  );
  assert.deepEqual(de.reviewReasons, ru.reviewReasons);
  assert.equal(de.resultStatus, ru.resultStatus);
});

test('CRM formatter translates known values and preserves unknown values', () => {
  const snapshot = buildPricedSnapshot();
  const rows = formatCalculationSnapshotRows(snapshot);

  assert.equal(rows.find((row) => row.key === 'valance.length')?.label, 'Volantlänge');
  assert.equal(rows.find((row) => row.key === 'design.logoPlacement')?.value, 'Links und rechts');
  assert.equal(formatCalculationSnapshotStatus('individual-review'), 'Individuelle Prüfung');
});

test('request intake stores the snapshot only on Case and the portal safe model stays snapshot-free', () => {
  const intakeSource = fs.readFileSync(path.join(ROOT, 'src/lib/request-intake.ts'), 'utf8');
  const contactRouteSource = fs.readFileSync(path.join(ROOT, 'src/app/api/contact/route.ts'), 'utf8');
  const portalReadModelSource = fs.readFileSync(path.join(ROOT, 'src/lib/portal/safe-read-model.ts'), 'utf8');
  const portalDataSource = fs.readFileSync(path.join(ROOT, 'src/lib/portal/production-data.ts'), 'utf8');

  assert.match(intakeSource, /calculationSnapshot: input\.calculationSnapshot \?\? undefined/);
  assert.match(contactRouteSource, /parseCalculationSnapshotFormValue/);
  assert.match(contactRouteSource, /calculationSnapshot,/);
  assert.doesNotMatch(portalReadModelSource, /calculationSnapshot/);
  assert.doesNotMatch(portalDataSource, /calculationSnapshot/);
});

test('calculator reuses the existing service drawer and forwards the snapshot to ContactForm', () => {
  const drawerSource = fs.readFileSync(
    path.join(ROOT, 'src/components/leistungen/LeistungenProblemDrawer.tsx'),
    'utf8'
  );
  const calculatorSource = fs.readFileSync(
    path.join(ROOT, 'src/components/leistungen/LeistungenIlluminatedValanceCalculator.tsx'),
    'utf8'
  );

  assert.match(drawerSource, /calculationSnapshot\?: CalculationSnapshot \| null/);
  assert.match(drawerSource, /calculationSnapshot=\{calculationSnapshot\}/);
  assert.match(calculatorSource, /<LeistungenProblemDrawer/);
  assert.match(calculatorSource, /initialIssueType="IlluminatedValance"/);
  assert.match(calculatorSource, /calculationSnapshot=\{calculationSnapshot\}/);
  assert.doesNotMatch(calculatorSource, /ContactModal|ChatModal/);
});
