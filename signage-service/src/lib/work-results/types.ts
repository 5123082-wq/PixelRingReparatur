export const PHOTO_CATEGORIES = ['BEFORE', 'PROCESS', 'RESULT'] as const;
export type WorkPhotoCategory = typeof PHOTO_CATEGORIES[number];
export type WorkResultPhotoInput = { attachmentId: string; category: WorkPhotoCategory; caption: string };
export type WorkResultDraft = {
  completedOn: string;
  note: string;
  items: { title: string; text: string }[];
  photos: WorkResultPhotoInput[];
  noPhotoReason: string;
  correctionReason: string;
};
export type PublicWorkResult = {
  id: string;
  number: number;
  completedOn: string;
  publishedAt: string;
  note: string;
  items: WorkResultDraft['items'];
  photos: { id: string; url: string; category: WorkPhotoCategory; caption: string }[];
};

export function newWorkResultDraft(): WorkResultDraft {
  return {
    completedOn: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date()),
    note: '', items: [], photos: [], noPhotoReason: '', correctionReason: '',
  };
}

export class WorkResultError extends Error {
  code: string;
  status: number;
  fields: string[];
  constructor(code: string, status = 400, fields: string[] = []) {
    super(code); this.code = code; this.status = status; this.fields = fields;
  }
}

export function normalizeWorkResultDraft(value: unknown): WorkResultDraft {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new WorkResultError('invalid_input');
  const input = value as Record<string, unknown>;
  const string = (value: unknown, max: number): string => {
    if (value == null) return '';
    if (typeof value !== 'string' || value.length > max) throw new WorkResultError('invalid_input');
    return value.trim();
  };
  const completedOn = string(input.completedOn, 10);
  if (completedOn && (!/^\d{4}-\d{2}-\d{2}$/.test(completedOn) ||
      !Number.isFinite(Date.parse(completedOn)) ||
      new Date(completedOn).toISOString().slice(0, 10) !== completedOn)) {
    throw new WorkResultError('invalid_input', 400, ['completedOn']);
  }
  if (!Array.isArray(input.items) || input.items.length > 20 ||
      !Array.isArray(input.photos) || input.photos.length > 40) throw new WorkResultError('invalid_input');
  const items = input.items.map((item) => {
    if (!item || typeof item !== 'object') throw new WorkResultError('invalid_input');
    return { title: string(item.title, 160), text: string(item.text, 4000) };
  }).filter((item) => item.title || item.text);
  const photos = input.photos.map((photo): WorkResultPhotoInput => {
    if (!photo || typeof photo !== 'object' ||
        typeof photo.attachmentId !== 'string' ||
        !/^[0-9a-f-]{36}$/i.test(photo.attachmentId) ||
        !PHOTO_CATEGORIES.includes(photo.category)) throw new WorkResultError('invalid_input');
    return { attachmentId: photo.attachmentId, category: photo.category, caption: string(photo.caption, 1000) };
  });
  if (new Set(photos.map((photo) => photo.attachmentId)).size !== photos.length) throw new WorkResultError('invalid_input');
  return {
    completedOn, items, photos,
    note: string(input.note, 12000),
    noPhotoReason: string(input.noPhotoReason, 1000),
    correctionReason: string(input.correctionReason, 1000),
  };
}

export function workResultMissingFields(draft: WorkResultDraft, role: string, isCorrection: boolean): string[] {
  const fields: string[] = [];
  if (!draft.completedOn) fields.push('completedOn');
  if (!draft.photos.some((photo) => photo.category === 'RESULT') && !(role === 'OWNER' && draft.noPhotoReason)) fields.push('photos');
  if (isCorrection && !draft.correctionReason) fields.push('correctionReason');
  return fields;
}
