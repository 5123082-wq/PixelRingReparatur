export type IntakeContactMethod = 'EMAIL' | 'PHONE';

export type ParsedContact = {
  method: IntakeContactMethod;
  value: string;
  customerEmail: string | null;
  customerPhone: string | null;
};

export type ContactDetailsInput = {
  contact?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type ParsedContactDetails = {
  customerEmail: string | null;
  customerPhone: string | null;
  primaryContactMethod: IntakeContactMethod | null;
  primaryContactValue: string | null;
};

export const WEBSITE_EMAIL_REQUIRED_MESSAGE =
  'Please provide a valid email address to formalize the request. Phone can be added as a secondary contact.';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_REGEX = /\d/;
const MIN_PHONE_DIGITS = 7;
const GENERIC_CONTACT_ERROR =
  'Please provide a valid email address or phone number to formalize the request.';

function clean(value?: string | null): string {
  return value?.trim() ?? '';
}

function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const digitCount = trimmed.replace(/\D/g, '').length;

  if (digitCount < MIN_PHONE_DIGITS) {
    throw new Error(GENERIC_CONTACT_ERROR);
  }

  const hasLeadingPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  return hasLeadingPlus ? `+${digits}` : digits;
}

function normalizeEmail(value: string): string {
  const trimmed = value.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    throw new Error(GENERIC_CONTACT_ERROR);
  }

  return trimmed;
}

export function parseContact(contact: string): ParsedContact {
  const value = contact.trim();

  if (!value) {
    throw new Error(GENERIC_CONTACT_ERROR);
  }

  if (value.includes('@')) {
    const customerEmail = normalizeEmail(value);

    return {
      method: 'EMAIL',
      value: customerEmail,
      customerEmail,
      customerPhone: null,
    };
  }

  if (!DIGITS_REGEX.test(value)) {
    throw new Error(GENERIC_CONTACT_ERROR);
  }

  const customerPhone = normalizePhone(value);

  return {
    method: 'PHONE',
    value: customerPhone,
    customerEmail: null,
    customerPhone,
  };
}

export function parseOptionalContactDetails(
  input: ContactDetailsInput
): ParsedContactDetails {
  const legacyContact = clean(input.contact);
  let emailSource = clean(input.email);
  let phoneSource = clean(input.phone);

  if (!emailSource && legacyContact.includes('@')) {
    emailSource = legacyContact;
  }

  if (!phoneSource && legacyContact && !legacyContact.includes('@')) {
    phoneSource = legacyContact;
  }

  const customerEmail = emailSource ? normalizeEmail(emailSource) : null;
  const customerPhone = phoneSource ? normalizePhone(phoneSource) : null;
  const primaryContactMethod = customerEmail ? 'EMAIL' : customerPhone ? 'PHONE' : null;
  const primaryContactValue =
    primaryContactMethod === 'EMAIL'
      ? customerEmail
      : primaryContactMethod === 'PHONE'
        ? customerPhone
        : null;

  return {
    customerEmail,
    customerPhone,
    primaryContactMethod,
    primaryContactValue,
  };
}

export function resolveWebsiteRequestContact(
  input: ContactDetailsInput
): ParsedContact {
  const parsed = parseOptionalContactDetails(input);

  if (!parsed.customerEmail) {
    throw new Error(WEBSITE_EMAIL_REQUIRED_MESSAGE);
  }

  return {
    method: 'EMAIL',
    value: parsed.customerEmail,
    customerEmail: parsed.customerEmail,
    customerPhone: parsed.customerPhone,
  };
}
