import type { CalculationSnapshot, CalculationSnapshotField } from './calculation-snapshot.ts';

const FIELD_LABELS: Record<string, string> = {
  'valance.length': 'Volantlänge',
  'valance.height': 'Volanthöhe',
  'design.text': 'Wunschtext',
  'design.fontId': 'Schrift-ID',
  'design.letterHeight': 'Buchstabenhöhe',
  'design.measuredTextLength': 'Gemessene Schriftzuglänge',
  'design.logoPlacement': 'Logo-Platzierung',
  'design.lightZoneCount': 'Anzahl Lichtzonen',
  'order.quantity': 'Anzahl gleicher Volants',
};

const LOGO_PLACEMENT_LABELS: Record<string, string> = {
  none: 'Kein Logo',
  left: 'Links',
  right: 'Rechts',
  both: 'Links und rechts',
};

export type CalculationSnapshotDisplayRow = {
  key: string;
  label: string;
  value: string;
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(value);
}

export function formatCalculationSnapshotFieldValue(
  field: CalculationSnapshotField
): string {
  let formatted: string;

  if (field.key === 'design.logoPlacement' && typeof field.value === 'string') {
    formatted = LOGO_PLACEMENT_LABELS[field.value] ?? field.value;
  } else if (typeof field.value === 'number') {
    formatted = formatNumber(field.value);
  } else if (typeof field.value === 'boolean') {
    formatted = field.value ? 'Ja' : 'Nein';
  } else {
    formatted = field.value;
  }

  return field.unit ? `${formatted} ${field.unit}` : formatted;
}

export function formatCalculationSnapshotRows(
  snapshot: CalculationSnapshot
): CalculationSnapshotDisplayRow[] {
  return snapshot.fields.map((field) => ({
    key: field.key,
    label: FIELD_LABELS[field.key] ?? field.key,
    value: formatCalculationSnapshotFieldValue(field),
  }));
}

export function formatCalculationSnapshotStatus(
  status: CalculationSnapshot['resultStatus']
): string {
  return status === 'priced' ? 'Preis berechnet' : 'Individuelle Prüfung';
}

export function formatCalculationSnapshotNetTotal(snapshot: CalculationSnapshot): string | null {
  if (!snapshot.price) return null;

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: snapshot.price.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(snapshot.price.netTotal);
}
