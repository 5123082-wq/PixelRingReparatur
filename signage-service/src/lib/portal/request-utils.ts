import { CaseOriginChannel, MessageAuthorRole, type Prisma, type PrismaClient } from '@prisma/client';
import type { StoredAttachmentInput } from '@/lib/attachments';
import { syncCaseCustomerProfile } from '../customer-profiles.ts';

type PortalRequestsDb = PrismaClient | Prisma.TransactionClient;

const MAX_PORTAL_REQUEST_TEXT_LENGTH = 4000;
const MAX_PORTAL_ISSUE_TYPE_LENGTH = 80;
const MAX_PORTAL_LOCATION_LENGTH = 500;
const MAX_PORTAL_NAME_LENGTH = 160;
const MAX_PORTAL_EMAIL_LENGTH = 254;
const MAX_PORTAL_PHONE_LENGTH = 80;
const MIN_PORTAL_MESSAGE_LENGTH = 5;
const PORTAL_REQUEST_MESSAGE_LABELS = {
  de: { issueType: 'Typ', serviceLocation: 'Standort' },
  en: { issueType: 'Type', serviceLocation: 'Location' },
  ru: { issueType: 'Тип', serviceLocation: 'Адрес' },
  tr: { issueType: 'Tür', serviceLocation: 'Adres' },
  pl: { issueType: 'Typ', serviceLocation: 'Adres' },
  ar: { issueType: 'النوع', serviceLocation: 'العنوان' },
} as const;

export type PortalRequestInput = {
  issueType?: unknown;
  serviceLocation?: unknown;
  serviceLatitude?: unknown;
  serviceLongitude?: unknown;
  serviceLocationSource?: unknown;
  message?: unknown;
};

export type NormalizedPortalRequestInput = {
  issueType: string;
  serviceLocation: string;
  serviceLatitude: number | null;
  serviceLongitude: number | null;
  serviceLocationSource: string | null;
  message: string;
};

export type PortalMessageResult =
  | {
      ok: true;
      message: {
        id: string;
        authorRole: MessageAuthorRole;
        channel: CaseOriginChannel;
        body: string;
        isCustomerVisible: boolean;
        sentAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        attachments: {
          id: string;
          storageKey: string;
          originalFilename: string | null;
          mimeType: string | null;
        }[];
      };
      caseId: string;
      publicRequestNumber: string;
      aiEnabled: boolean;
      locale: string | null;
    }
  | {
      ok: false;
      reason: 'not_found' | 'invalid_body';
    };

export type PortalRequestDetailsInput = {
  customerName?: unknown;
  customerEmail?: unknown;
  customerPhone?: unknown;
  serviceLocation?: unknown;
};

export type NormalizedPortalRequestDetailsInput = {
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  serviceLocation: string | null;
};

export type PortalRequestDetailsUpdateResult =
  | {
      ok: true;
      changed: boolean;
      caseId: string;
      publicRequestNumber: string;
      notificationBody: string | null;
    }
  | {
      ok: false;
      reason: 'not_found' | 'invalid_input' | 'no_fields';
      message?: string;
    };

function normalizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function normalizeCoordinate(value: unknown, min: number, max: number): number | null {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? Number(value)
      : Number.NaN;

  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function normalizeLocationSource(value: unknown): string | null {
  return typeof value === 'string' && value.trim() === 'photon' ? 'photon' : null;
}

function normalizeNullableString(value: unknown, maxLength: number): string | null {
  const normalized = normalizeString(value, maxLength);

  return normalized || null;
}

function normalizePortalEmail(value: unknown): string | null {
  const email = normalizeNullableString(value, MAX_PORTAL_EMAIL_LENGTH)?.toLowerCase() ?? null;

  if (!email) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Bitte geben Sie eine gueltige E-Mail-Adresse ein.');
  }

  return email;
}

function normalizeValueForCompare(value: string | null): string {
  return value?.trim() || '';
}

function formatDiffValue(value: string | null): string {
  const clean = value?.trim();

  return clean ? `"${clean}"` : 'leer';
}

function hasOwnInputField(input: PortalRequestDetailsInput, key: keyof PortalRequestDetailsInput): boolean {
  return Object.prototype.hasOwnProperty.call(input, key);
}

export function normalizePortalPublicRequestNumber(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizePortalRequestInput(input: PortalRequestInput): NormalizedPortalRequestInput {
  const message = normalizeString(input.message, MAX_PORTAL_REQUEST_TEXT_LENGTH);

  if (message.length < MIN_PORTAL_MESSAGE_LENGTH) {
    throw new Error('Bitte beschreiben Sie kurz, was gemacht werden soll.');
  }

  return {
    issueType: normalizeString(input.issueType, MAX_PORTAL_ISSUE_TYPE_LENGTH) || 'Serviceanfrage',
    serviceLocation: normalizeString(input.serviceLocation, MAX_PORTAL_LOCATION_LENGTH),
    serviceLatitude: normalizeCoordinate(input.serviceLatitude, -90, 90),
    serviceLongitude: normalizeCoordinate(input.serviceLongitude, -180, 180),
    serviceLocationSource: normalizeLocationSource(input.serviceLocationSource),
    message,
  };
}

export function normalizePortalRequestDetailsInput(
  input: PortalRequestDetailsInput
): NormalizedPortalRequestDetailsInput {
  return {
    customerName: normalizeNullableString(input.customerName, MAX_PORTAL_NAME_LENGTH),
    customerEmail: normalizePortalEmail(input.customerEmail),
    customerPhone: normalizeNullableString(input.customerPhone, MAX_PORTAL_PHONE_LENGTH),
    serviceLocation: normalizeNullableString(input.serviceLocation, MAX_PORTAL_LOCATION_LENGTH),
  };
}

export function normalizePortalMessageBody(value: unknown): string | null {
  const body = normalizeString(value, MAX_PORTAL_REQUEST_TEXT_LENGTH);

  return body.length >= 1 ? body : null;
}

function portalRequestMessageLabels(locale?: string | null) {
  if (locale && Object.prototype.hasOwnProperty.call(PORTAL_REQUEST_MESSAGE_LABELS, locale)) {
    return PORTAL_REQUEST_MESSAGE_LABELS[locale as keyof typeof PORTAL_REQUEST_MESSAGE_LABELS];
  }

  return PORTAL_REQUEST_MESSAGE_LABELS.de;
}

export function buildPortalRequestMessage(
  input: NormalizedPortalRequestInput,
  locale?: string | null
): string {
  const labels = portalRequestMessageLabels(locale);

  return [
    `${labels.issueType}: ${input.issueType}`,
    input.serviceLocation ? `${labels.serviceLocation}: ${input.serviceLocation}` : null,
    '',
    input.message,
  ].filter((line): line is string => line !== null).join('\n');
}

async function findPortalGrantedCase(
  db: PortalRequestsDb,
  input: {
    portalUserId: string;
    publicRequestNumber: string;
  }
) {
  const publicRequestNumber = normalizePortalPublicRequestNumber(input.publicRequestNumber);

  return db.portalCaseAccess.findFirst({
    where: {
      portalUserId: input.portalUserId,
      revokedAt: null,
      case: {
        publicRequestNumber,
      },
    },
    select: {
      case: {
        select: {
          id: true,
          publicRequestNumber: true,
          aiEnabled: true,
          locale: true,
        },
      },
    },
  });
}

function buildPortalDetailsChangeSummary(
  changes: { label: string; from: string | null; to: string | null }[],
  isInternal: boolean
): string {
  if (isInternal) {
    return [
      '[INTERNAL NOTE] Daten der Anfrage wurden aktualisiert:',
      ...changes.map((change) =>
        `- ${change.label}: ${formatDiffValue(change.from)} -> ${formatDiffValue(change.to)}`
      ),
    ].join('\n');
  }

  return [
    'Daten der Anfrage wurden aktualisiert:',
    ...changes.map((change) => `- ${change.label} wurde geaendert.`),
  ].join('\n');
}

export async function updatePortalRequestDetailsForUser(
  db: PrismaClient,
  input: {
    portalUserId: string;
    portalSessionId: string;
    publicRequestNumber: string;
    details: PortalRequestDetailsInput;
    ipAddress?: string | null;
    userAgent?: string | null;
  }
): Promise<PortalRequestDetailsUpdateResult> {
  let normalized: NormalizedPortalRequestDetailsInput;

  try {
    normalized = normalizePortalRequestDetailsInput(input.details);
  } catch (error) {
    return {
      ok: false,
      reason: 'invalid_input',
      message: error instanceof Error ? error.message : 'Die Eingaben sind ungueltig.',
    };
  }

  const hasSubmittedField = [
    'customerName',
    'customerEmail',
    'customerPhone',
    'serviceLocation',
  ].some((key) => hasOwnInputField(input.details, key as keyof PortalRequestDetailsInput));

  if (!hasSubmittedField) {
    return { ok: false, reason: 'no_fields' };
  }

  let result: PortalRequestDetailsUpdateResult = { ok: false, reason: 'not_found' };

  await db.$transaction(async (tx) => {
    const access = await tx.portalCaseAccess.findFirst({
      where: {
        portalUserId: input.portalUserId,
        revokedAt: null,
        case: {
          publicRequestNumber: normalizePortalPublicRequestNumber(input.publicRequestNumber),
        },
      },
      select: {
        case: {
          select: {
            id: true,
            publicRequestNumber: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            serviceLocation: true,
            locale: true,
          },
        },
      },
    });
    const caseRecord = access?.case;

    if (!caseRecord?.publicRequestNumber) {
      return;
    }

    const nextCustomerName = hasOwnInputField(input.details, 'customerName')
      ? normalized.customerName
      : caseRecord.customerName;
    const nextCustomerEmail = hasOwnInputField(input.details, 'customerEmail')
      ? normalized.customerEmail
      : caseRecord.customerEmail;
    const nextCustomerPhone = hasOwnInputField(input.details, 'customerPhone')
      ? normalized.customerPhone
      : caseRecord.customerPhone;
    const nextServiceLocation = hasOwnInputField(input.details, 'serviceLocation')
      ? normalized.serviceLocation
      : caseRecord.serviceLocation;

    const changes = [
      {
        field: 'customerName' as const,
        label: 'Name',
        from: caseRecord.customerName,
        to: nextCustomerName,
      },
      {
        field: 'customerEmail' as const,
        label: 'E-Mail',
        from: caseRecord.customerEmail,
        to: nextCustomerEmail,
      },
      {
        field: 'customerPhone' as const,
        label: 'Telefon',
        from: caseRecord.customerPhone,
        to: nextCustomerPhone,
      },
      {
        field: 'serviceLocation' as const,
        label: 'Adresse / Objekt',
        from: caseRecord.serviceLocation,
        to: nextServiceLocation,
      },
    ].filter((change) =>
      normalizeValueForCompare(change.from) !== normalizeValueForCompare(change.to)
    );

    if (changes.length === 0) {
      result = {
        ok: true,
        changed: false,
        caseId: caseRecord.id,
        publicRequestNumber: caseRecord.publicRequestNumber,
        notificationBody: null,
      };
      return;
    }

    const now = new Date();
    const primaryContactMethod = nextCustomerEmail
      ? 'EMAIL'
      : nextCustomerPhone
        ? 'PHONE'
        : null;
    const notificationBody = buildPortalDetailsChangeSummary(changes, false);
    const internalNotificationBody = buildPortalDetailsChangeSummary(changes, true);
    const serviceLocationChanged =
      normalizeValueForCompare(caseRecord.serviceLocation) !== normalizeValueForCompare(nextServiceLocation);

    await tx.case.update({
      where: { id: caseRecord.id },
      data: {
        customerName: nextCustomerName,
        customerEmail: nextCustomerEmail,
        customerPhone: nextCustomerPhone,
        primaryContactMethod,
        primaryContactValue: nextCustomerEmail || nextCustomerPhone,
        serviceLocation: nextServiceLocation,
        serviceLatitude: serviceLocationChanged ? null : undefined,
        serviceLongitude: serviceLocationChanged ? null : undefined,
        serviceLocationSource: serviceLocationChanged ? null : undefined,
        updatedAt: now,
      },
      select: { id: true },
    });

    await syncCaseCustomerProfile(tx, {
      caseId: caseRecord.id,
      customerName: nextCustomerName,
      customerEmail: nextCustomerEmail,
      customerPhone: nextCustomerPhone,
      serviceAddress: nextServiceLocation,
      preferredLanguage: caseRecord.locale || null,
      preferredContactMethod: primaryContactMethod,
    });

    await tx.message.create({
      data: {
        caseId: caseRecord.id,
        sessionId: input.portalSessionId,
        channel: CaseOriginChannel.WEBSITE_CHAT,
        authorRole: MessageAuthorRole.SYSTEM,
        authorName: 'Kundenportal',
        body: notificationBody,
        isCustomerVisible: true,
        sentAt: now,
      },
      select: { id: true },
    });

    await tx.message.create({
      data: {
        caseId: caseRecord.id,
        sessionId: input.portalSessionId,
        channel: CaseOriginChannel.WEBSITE_CHAT,
        authorRole: MessageAuthorRole.SYSTEM,
        authorName: 'System (Internal)',
        body: internalNotificationBody,
        isCustomerVisible: false,
        sentAt: now,
      },
      select: { id: true },
    });

    await tx.adminAuditLog.create({
      data: {
        action: 'PORTAL_CASE_DETAILS_UPDATED',
        resourceType: 'CASE',
        resourceId: caseRecord.id,
        caseId: caseRecord.id,
        details: {
          portalUserId: input.portalUserId,
          portalSessionId: input.portalSessionId,
          changes: changes.map((change) => ({
            field: change.field,
            from: change.from ? '[REDACTED]' : null,
            to: change.to ? '[REDACTED]' : null,
          })),
        },
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });

    result = {
      ok: true,
      changed: true,
      caseId: caseRecord.id,
      publicRequestNumber: caseRecord.publicRequestNumber,
      notificationBody,
    };
  });

  return result;
}

export async function createPortalMessageForRequest(
  db: PrismaClient,
  input: {
    portalUserId: string;
    portalSessionId: string;
    publicRequestNumber: string;
    body: unknown;
    attachments?: StoredAttachmentInput[];
  }
): Promise<PortalMessageResult> {
  const body = normalizePortalMessageBody(input.body);
  const attachments = input.attachments ?? [];

  if (!body && attachments.length === 0) {
    return { ok: false, reason: 'invalid_body' };
  }

  let result: PortalMessageResult = { ok: false, reason: 'not_found' };

  await db.$transaction(async (tx) => {
    const access = await findPortalGrantedCase(tx, {
      portalUserId: input.portalUserId,
      publicRequestNumber: input.publicRequestNumber,
    });
    const caseRecord = access?.case;

    if (!caseRecord?.publicRequestNumber) {
      return;
    }

    const now = new Date();
    const message = await tx.message.create({
      data: {
        caseId: caseRecord.id,
        sessionId: input.portalSessionId,
        channel: CaseOriginChannel.WEBSITE_CHAT,
        authorRole: MessageAuthorRole.CUSTOMER,
        authorName: 'Kundenportal',
        body: body || 'Foto',
        isCustomerVisible: true,
        sentAt: now,
        attachments: attachments.length > 0
          ? {
              createMany: {
                data: attachments.map((attachment) => ({
                  ...attachment,
                  caseId: caseRecord.id,
                  uploadedBySessionId: input.portalSessionId,
                  isCustomerVisible: true,
                })),
              },
            }
          : undefined,
      },
      select: {
        id: true,
        authorRole: true,
        channel: true,
        body: true,
        isCustomerVisible: true,
        sentAt: true,
        createdAt: true,
        updatedAt: true,
        attachments: {
          select: {
            id: true,
            storageKey: true,
            originalFilename: true,
            mimeType: true,
          },
        },
      },
    });

    await tx.case.update({
      where: { id: caseRecord.id },
      data: {
        updatedAt: now,
      },
      select: { id: true },
    });

    result = {
      ok: true,
      message,
      caseId: caseRecord.id,
      publicRequestNumber: caseRecord.publicRequestNumber,
      aiEnabled: caseRecord.aiEnabled,
      locale: caseRecord.locale,
    };
  });

  return result;
}
