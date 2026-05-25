export type ArticleSelfRepairTips = {
  intro?: string;
  withoutOpening?: string[];
  technicalSpecialist?: string[];
  doNotDo?: string[];
  qualificationNote?: string;
};

const MAX_TEXT_LENGTH = 1_000;
const MAX_ITEMS = 20;

const SELF_REPAIR_LABELS: Record<
  string,
  {
    withoutOpening: string;
    technicalSpecialist: string;
    doNotDo: string;
    qualificationNote: string;
  }
> = {
  de: {
    withoutOpening: 'Ohne Öffnen',
    technicalSpecialist: 'Technische Fachperson',
    doNotDo: 'Nicht tun',
    qualificationNote: 'Wichtiger Hinweis',
  },
  en: {
    withoutOpening: 'Without opening',
    technicalSpecialist: 'Technical specialist',
    doNotDo: 'Do not do',
    qualificationNote: 'Important note',
  },
  ru: {
    withoutOpening: 'Без вскрытия',
    technicalSpecialist: 'Технический специалист',
    doNotDo: 'Не стоит',
    qualificationNote: 'Важная сноска',
  },
  tr: {
    withoutOpening: 'Kasa açmadan',
    technicalSpecialist: 'Teknik sorumlu',
    doNotDo: 'Yapılmaması gerekenler',
    qualificationNote: 'Önemli not',
  },
  pl: {
    withoutOpening: 'Bez otwierania',
    technicalSpecialist: 'Osoba techniczna',
    doNotDo: 'Nie należy',
    qualificationNote: 'Ważna uwaga',
  },
  ar: {
    withoutOpening: 'من دون فتح',
    technicalSpecialist: 'المختص التقني',
    doNotDo: 'لا تفعل',
    qualificationNote: 'ملاحظة مهمة',
  },
};

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const text = value.trim();
  return text ? text.slice(0, MAX_TEXT_LENGTH) : undefined;
}

function normalizeTextArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value
    .map((item) => normalizeText(item))
    .filter((item): item is string => Boolean(item))
    .slice(0, MAX_ITEMS);

  return items.length > 0 ? items : undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype
  );
}

export function normalizeArticleSelfRepairTips(value: unknown): ArticleSelfRepairTips | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (!isPlainObject(value)) {
    return null;
  }

  const normalized: ArticleSelfRepairTips = {};
  const intro = normalizeText(value.intro);
  const withoutOpening = normalizeTextArray(value.withoutOpening);
  const technicalSpecialist = normalizeTextArray(value.technicalSpecialist);
  const doNotDo = normalizeTextArray(value.doNotDo);
  const qualificationNote = normalizeText(value.qualificationNote);

  if (intro) normalized.intro = intro;
  if (withoutOpening) normalized.withoutOpening = withoutOpening;
  if (technicalSpecialist) normalized.technicalSpecialist = technicalSpecialist;
  if (doNotDo) normalized.doNotDo = doNotDo;
  if (qualificationNote) normalized.qualificationNote = qualificationNote;

  return Object.keys(normalized).length > 0 ? normalized : null;
}

export function flattenArticleSelfRepairTips(
  value: ArticleSelfRepairTips | null,
  locale = 'de'
): string[] {
  if (!value) {
    return [];
  }

  const labels = SELF_REPAIR_LABELS[locale] ?? SELF_REPAIR_LABELS.de;

  return [
    value.intro,
    ...(value.withoutOpening ?? []).map((item) => `${labels.withoutOpening}: ${item}`),
    ...(value.technicalSpecialist ?? []).map((item) => `${labels.technicalSpecialist}: ${item}`),
    ...(value.doNotDo ?? []).map((item) => `${labels.doNotDo}: ${item}`),
    value.qualificationNote ? `${labels.qualificationNote}: ${value.qualificationNote}` : null,
  ].filter((item): item is string => Boolean(item));
}
