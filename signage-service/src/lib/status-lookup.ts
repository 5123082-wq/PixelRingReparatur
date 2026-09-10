import type { Case, CaseStatus, PrismaClient } from '@prisma/client';

import { hashCaseSessionToken } from './case-session.ts';
import { parseContact } from './contact-policy.ts';
import { isPublicRequestNumberFormat } from './request-number.ts';
import {
  isCaseStatusSession,
  isSameDeviceCaseSession,
} from './session-access-policy.ts';

type PublicCaseStatus = {
  publicRequestNumber: string;
  status: CaseStatus;
  statusLabel: string;
  statusDescription: string;
  createdAt: string;
  updatedAt: string;
  verifiedVia: 'session' | 'contact';
};

export type StatusLookupRequest = {
  publicRequestNumber?: string;
  contact?: string;
  accessToken?: string | null;
  sessionToken?: string | null;
};

export type StatusAccessLevel = 'case_access' | 'status_only';

export type StatusLookupSuccess = {
  verified: true;
  caseId: string;
  accessLevel: StatusAccessLevel;
  cookieToken?: string;
  case: PublicCaseStatus;
};

export type StatusLookupFailure = {
  verified: false;
  verificationRequired: true;
  message: string;
};

export type StatusLookupResult = StatusLookupSuccess | StatusLookupFailure;

const GENERIC_VERIFICATION_MESSAGE =
  'Request number alone does not reveal private data. Please verify with the phone or email used on the request, or use the same device that already has access.';

const PUBLIC_STATUS_COPY: Record<
  CaseStatus,
  { label: string; description: string }
> = {
  DRAFT: {
    label: 'Черновик',
    description: 'Заявка создана, ожидает завершения оформления.',
  },
  FORMALIZED: {
    label: 'Оформлена',
    description: 'Контактные данные подтверждены, заявка готова к отслеживанию.',
  },
  NUMBER_ISSUED: {
    label: 'Принято',
    description: 'Номер отслеживания выдан, заявка зарегистрирована в системе.',
  },
  UNDER_REVIEW: {
    label: 'В диагностике',
    description: 'Мастер проводит первичный осмотр устройства.',
  },
  WAITING_FOR_CUSTOMER: {
    label: 'Ожидает клиента',
    description: 'Нам нужен ваш ответ или уточнение для продолжения.',
  },
  IN_PROGRESS: {
    label: 'Ремонт',
    description: 'Идёт активный процесс ремонта.',
  },
  ON_HOLD: {
    label: 'Отложено',
    description: 'Ожидание запчастей или дополнительного согласования с клиентом.',
  },
  READY_FOR_PICKUP: {
    label: 'Готов',
    description: 'Ремонт завершён, устройство ожидает выдачи.',
  },
  COMPLETED: {
    label: 'Выдан / Гарантия',
    description: 'Устройство выдано клиенту, действует гарантийный период.',
  },
  CANCELLED: {
    label: 'Отказ',
    description: 'Клиент отказался от ремонта или ремонт невозможен.',
  },
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizePhoneForCompare(value: string): string {
  return value.replace(/\D/g, '');
}

type VerifiedContactCase = Pick<
  Case,
  | 'customerEmail'
  | 'customerPhone'
  | 'primaryContactMethod'
  | 'primaryContactValue'
>;

function matchesVerifiedContact(
  caseRecord: VerifiedContactCase,
  contact: string
): boolean {
  let parsedContact: ReturnType<typeof parseContact>;

  try {
    parsedContact = parseContact(contact);
  } catch {
    return false;
  }

  if (parsedContact.method === 'EMAIL') {
    const requestedEmail = normalizeEmail(parsedContact.value);

    const matchesCustomerEmail =
      caseRecord.customerEmail !== null &&
      normalizeEmail(caseRecord.customerEmail) === requestedEmail;
    const matchesPrimaryContact =
      caseRecord.primaryContactMethod === 'EMAIL' &&
      caseRecord.primaryContactValue !== null &&
      normalizeEmail(caseRecord.primaryContactValue) === requestedEmail;

    return matchesCustomerEmail || matchesPrimaryContact;
  }

  const requestedPhone = normalizePhoneForCompare(parsedContact.value);
  const matchesCustomerPhone =
    caseRecord.customerPhone !== null &&
    normalizePhoneForCompare(caseRecord.customerPhone) === requestedPhone;
  const matchesPrimaryContact =
    caseRecord.primaryContactMethod === 'PHONE' &&
    caseRecord.primaryContactValue !== null &&
    normalizePhoneForCompare(caseRecord.primaryContactValue) === requestedPhone;

  return matchesCustomerPhone || matchesPrimaryContact;
}

function buildPublicCaseStatus(
  caseRecord: Pick<
    Case,
    'publicRequestNumber' | 'status' | 'createdAt' | 'updatedAt'
  >,
  verifiedVia: 'session' | 'contact'
): PublicCaseStatus {
  const publicStatus = PUBLIC_STATUS_COPY[caseRecord.status];

  return {
    publicRequestNumber: caseRecord.publicRequestNumber ?? '',
    status: caseRecord.status,
    statusLabel: publicStatus.label,
    statusDescription: publicStatus.description,
    createdAt: caseRecord.createdAt.toISOString(),
    updatedAt: caseRecord.updatedAt.toISOString(),
    verifiedVia,
  };
}

function isSessionTokenPresent(token: string | null | undefined): token is string {
  return typeof token === 'string' && token.trim().length > 0;
}

async function lookupBySessionToken(
  prisma: PrismaClient,
  input: {
    token: string;
    publicRequestNumber?: string;
    now: Date;
  }
): Promise<StatusLookupSuccess | null> {
  const requestNumber = input.publicRequestNumber?.trim().toUpperCase() ?? '';
  const hasRequestNumber = requestNumber.length > 0;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashCaseSessionToken(input.token) },
    include: {
      case: {
        select: {
          id: true,
          publicRequestNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const isValidSession = isCaseStatusSession(session, input.now);
  const sessionCase = session?.case ?? null;
  const sessionMatchesRequest =
    !hasRequestNumber ||
    (sessionCase !== null &&
      sessionCase.publicRequestNumber !== null &&
      sessionCase.publicRequestNumber === requestNumber);

  if (session !== null && isValidSession && sessionCase && sessionMatchesRequest) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: input.now },
    });

    return {
      verified: true,
      caseId: sessionCase.id,
      accessLevel: isSameDeviceCaseSession(session, input.now)
        ? 'case_access'
        : 'status_only',
      cookieToken: input.token,
      case: buildPublicCaseStatus(sessionCase, 'session'),
    };
  }

  return null;
}

export async function lookupPublicCaseStatus(
  prisma: PrismaClient,
  input: StatusLookupRequest
): Promise<StatusLookupResult> {
  const now = new Date();
  const requestNumber = input.publicRequestNumber?.trim().toUpperCase() ?? '';
  const contact = input.contact ?? '';
  const hasRequestNumber = requestNumber.length > 0;
  const hasContact = contact.trim().length > 0;
  let matchingCookieResult: StatusLookupSuccess | null = null;

  if (hasRequestNumber && isSessionTokenPresent(input.sessionToken)) {
    matchingCookieResult = await lookupBySessionToken(prisma, {
      token: input.sessionToken,
      publicRequestNumber: requestNumber,
      now,
    });

    if (matchingCookieResult?.accessLevel === 'case_access') {
      return matchingCookieResult;
    }
  }

  if (isSessionTokenPresent(input.accessToken)) {
    const accessResult = await lookupBySessionToken(prisma, {
      token: input.accessToken,
      publicRequestNumber: requestNumber,
      now,
    });

    if (accessResult) {
      return accessResult;
    }
  }

  if (matchingCookieResult) {
    return matchingCookieResult;
  }

  if (!hasRequestNumber && isSessionTokenPresent(input.sessionToken)) {
    const sessionResult = await lookupBySessionToken(prisma, {
      token: input.sessionToken,
      publicRequestNumber: requestNumber,
      now,
    });

    if (sessionResult) {
      return sessionResult;
    }
  }

  if (!hasRequestNumber || !isPublicRequestNumberFormat(requestNumber)) {
    return {
      verified: false,
      verificationRequired: true,
      message: GENERIC_VERIFICATION_MESSAGE,
    };
  }

  if (!hasContact) {
    return {
      verified: false,
      verificationRequired: true,
      message: GENERIC_VERIFICATION_MESSAGE,
    };
  }

  const caseRecord = await prisma.case.findUnique({
    where: { publicRequestNumber: requestNumber },
    select: {
      id: true,
      publicRequestNumber: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      customerEmail: true,
      customerPhone: true,
      primaryContactMethod: true,
      primaryContactValue: true,
    },
  });

  if (!caseRecord || !caseRecord.publicRequestNumber) {
    return {
      verified: false,
      verificationRequired: true,
      message: GENERIC_VERIFICATION_MESSAGE,
    };
  }

  if (!matchesVerifiedContact(caseRecord, contact)) {
    return {
      verified: false,
      verificationRequired: true,
      message: GENERIC_VERIFICATION_MESSAGE,
    };
  }

  return {
    verified: true,
    caseId: caseRecord.id,
    accessLevel: 'status_only',
    case: buildPublicCaseStatus(caseRecord, 'contact'),
  };
}
