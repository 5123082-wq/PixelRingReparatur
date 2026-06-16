import 'server-only';

export type ExtractedPii = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceLocation?: string;
};

export type RedactionResult = {
  redactedText: string;
  extracted: ExtractedPii;
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /(?:\+?\d[\d\s().-]{6,}\d)/g;
const NAME_RE =
  /\b(меня зовут|имя|my name is|name|ich hei(?:ss|ß)e|mein name ist)\s*[:\-]?\s*([^\n,.;]{2,80})/i;
const LOCATION_RE =
  /\b(адрес|объект|локация|место|standort|adresse|address|location)\s*[:\-]?\s*([^\n.;]{4,160})/i;
const PROBLEM_AFTER_LOCATION_RE =
  /(вывес|таблич|реклам|свет|букв|мига|слом|упал|schild|sign|led|licht|leucht|flack|kaputt|broken|fallen)/i;
const SERVICE_CONTEXT_AFTER_NAME_RE =
  /\s+(und|and|и)\s+(?=(?:das|die|der|the|мой|моя|это|эта)?\s*(вывес|таблич|реклам|свет|букв|мига|слом|упал|schild|sign|led|licht|leucht|flack|kaputt|broken|fallen))/i;

function cleanValue(value: string | undefined): string | undefined {
  const clean = value?.trim().replace(/\s+/g, ' ');

  return clean || undefined;
}

function normalizeEmail(value: string | undefined): string | undefined {
  return cleanValue(value)?.toLowerCase();
}

function normalizePhone(value: string | undefined): string | undefined {
  const clean = cleanValue(value);
  if (!clean) return undefined;

  const hasLeadingPlus = clean.startsWith('+');
  const digits = clean.replace(/\D/g, '');

  if (digits.length < 7) return undefined;

  return hasLeadingPlus ? `+${digits}` : digits;
}

function splitLocationValue(value: string): {
  location: string;
  remainder: string;
} {
  const commaIndex = value.indexOf(',');

  if (commaIndex < 0) {
    return { location: value, remainder: '' };
  }

  const beforeComma = value.slice(0, commaIndex).trim();
  const afterComma = value.slice(commaIndex + 1).trim();
  const problemMatch = afterComma.match(PROBLEM_AFTER_LOCATION_RE);

  if (problemMatch?.index !== undefined) {
    const commaBeforeProblem = afterComma.lastIndexOf(',', problemMatch.index);
    const splitIndex = commaBeforeProblem >= 0 ? commaBeforeProblem : problemMatch.index;
    const locationTail = afterComma.slice(0, splitIndex).replace(/,\s*$/, '').trim();
    const remainder = afterComma.slice(splitIndex).replace(/^,\s*/, '').trim();

    return {
      location: [beforeComma, locationTail].filter(Boolean).join(', '),
      remainder: remainder ? `, ${remainder}` : '',
    };
  }

  return { location: value, remainder: '' };
}

function splitNameValue(value: string): {
  name: string;
  remainder: string;
} {
  const serviceContextMatch = value.match(SERVICE_CONTEXT_AFTER_NAME_RE);

  if (serviceContextMatch?.index !== undefined) {
    return {
      name: value.slice(0, serviceContextMatch.index).trim(),
      remainder: value.slice(serviceContextMatch.index),
    };
  }

  return { name: value, remainder: '' };
}

export function redactPiiFromText(value: string): RedactionResult {
  let redactedText = value;
  const extracted: ExtractedPii = {};
  const email = normalizeEmail(value.match(EMAIL_RE)?.[0]);
  const phone = normalizePhone(value.match(PHONE_RE)?.[0]);
  const nameMatch = value.match(NAME_RE);
  const locationMatch = value.match(LOCATION_RE);

  if (email) extracted.customerEmail = email;
  if (phone) extracted.customerPhone = phone;
  const nameParts = nameMatch?.[2] ? splitNameValue(nameMatch[2]) : null;
  if (nameParts?.name) extracted.customerName = cleanValue(nameParts.name);
  const locationParts = locationMatch?.[2]
    ? splitLocationValue(locationMatch[2])
    : null;

  if (locationParts?.location) {
    extracted.serviceLocation = cleanValue(locationParts.location);
  }

  redactedText = redactedText.replace(EMAIL_RE, '[EMAIL_PROVIDED]');
  redactedText = redactedText.replace(PHONE_RE, '[PHONE_PROVIDED]');

  if (nameMatch?.[0]) {
    redactedText = redactedText.replace(
      nameMatch[0],
      `${nameMatch[1]} [NAME_PROVIDED]${nameParts?.remainder ?? ''}`
    );
  }

  if (locationMatch?.[0]) {
    redactedText = redactedText.replace(
      locationMatch[0],
      `${locationMatch[1]} [LOCATION_PROVIDED]${locationParts?.remainder ?? ''}`
    );
  }

  return {
    redactedText: redactedText.trim(),
    extracted,
  };
}

export function redactPiiForAi(value: string): string {
  return redactPiiFromText(value).redactedText;
}

export function buildPiiPresenceContext(input: ExtractedPii): string {
  const flags = [
    input.customerEmail ? 'emailKnown=true' : 'emailKnown=false',
    input.customerPhone ? 'phoneKnown=true' : 'phoneKnown=false',
    input.customerName ? 'nameKnown=true' : 'nameKnown=false',
    input.serviceLocation ? 'locationKnown=true' : 'locationKnown=false',
  ];

  return `Known customer data flags: ${flags.join(', ')}. Never ask the user to type these values into chat and never repeat them in your reply.`;
}

export function redactAssistantVisiblePii(value: string): string {
  return redactPiiForAi(value);
}
