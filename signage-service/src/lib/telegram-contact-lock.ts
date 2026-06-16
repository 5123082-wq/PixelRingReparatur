export type TelegramContactLockState = {
  customerEmail?: string | null;
  customerPhone?: string | null;
  primaryContactMethod?: string | null;
  primaryContactValue?: string | null;
  customerProfile?: {
    emailNormalized?: string | null;
    phoneNormalized?: string | null;
  } | null;
};

export type TelegramSubmittedContact = {
  customerEmail: string | null;
  customerPhone: string | null;
};

function normalizeStoredEmail(value?: string | null): string | null {
  const email = value?.trim().toLowerCase();

  return email && email.includes('@') ? email : null;
}

function normalizeStoredPhone(value?: string | null): string | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const digits = trimmed.replace(/\D/g, '');

  if (!digits) {
    return null;
  }

  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

export function isTelegramContactAllowed(
  existing: TelegramContactLockState,
  nextContact: TelegramSubmittedContact
): boolean {
  const lockedEmail =
    normalizeStoredEmail(existing.customerEmail) ??
    normalizeStoredEmail(existing.customerProfile?.emailNormalized);
  const lockedPhone =
    normalizeStoredPhone(existing.customerPhone) ??
    normalizeStoredPhone(existing.customerProfile?.phoneNormalized);
  const primaryEmail = existing.primaryContactMethod === 'EMAIL'
    ? normalizeStoredEmail(existing.primaryContactValue)
    : null;
  const primaryPhone = existing.primaryContactMethod === 'PHONE'
    ? normalizeStoredPhone(existing.primaryContactValue)
    : null;
  const expectedEmail = lockedEmail ?? primaryEmail;
  const expectedPhone = lockedPhone ?? primaryPhone;

  if (!expectedEmail && !expectedPhone) {
    return true;
  }

  const isAllowedEmail = Boolean(
    nextContact.customerEmail &&
    expectedEmail &&
    nextContact.customerEmail === expectedEmail
  );
  const isAllowedPhone = Boolean(
    nextContact.customerPhone &&
    expectedPhone &&
    nextContact.customerPhone === expectedPhone
  );

  return isAllowedEmail || isAllowedPhone;
}
