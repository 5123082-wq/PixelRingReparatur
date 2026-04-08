import type { Case, CaseStatus, PrismaClient, Session } from '@prisma/client';
import { SessionScope } from '@prisma/client';

import {
  createCaseSessionToken,
  getCaseSessionExpiryDate,
  hashCaseSessionToken,
} from './case-session';
import { isPublicRequestNumberFormat } from './request-number';
import { parseContact } from './request-intake';

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
  sessionToken?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export type StatusLookupSuccess = {
  verified: true;
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

function isActiveSession(session: Session | null): boolean {
  if (!session) {
    return false;
  }

  const now = new Date();

  return (
    session.scope === SessionScope.CASE_ACCESS &&
    session.revokedAt === null &&
    session.expiresAt > now &&
    session.caseId !== null
  );
}

function isSessionTokenPresent(token: string | null | undefined): token is string {
  return typeof token === 'string' && token.trim().length > 0;
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

  if (isSessionTokenPresent(input.sessionToken)) {
    const session = await prisma.session.findUnique({
      where: { tokenHash: hashCaseSessionToken(input.sessionToken) },
      include: {
        case: {
          select: {
            publicRequestNumber: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const isValidSession = isActiveSession(session);
    const sessionCase = session?.case ?? null;
    const sessionMatchesRequest =
      !hasRequestNumber ||
      (sessionCase !== null &&
        sessionCase.publicRequestNumber !== null &&
        sessionCase.publicRequestNumber === requestNumber);

    if (session !== null && isValidSession && sessionCase && sessionMatchesRequest) {
      await prisma.session.update({
        where: { id: session.id },
        data: { lastSeenAt: now },
      });

      return {
        verified: true,
        cookieToken: input.sessionToken ?? undefined,
        case: buildPublicCaseStatus(sessionCase, 'session'),
      };
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

  const sessionToken = createCaseSessionToken();
  const sessionTokenHash = hashCaseSessionToken(sessionToken);
  const parsedContact = parseContact(contact);

  await prisma.session.create({
    data: {
      tokenHash: sessionTokenHash,
      scope: SessionScope.CASE_ACCESS,
      caseId: caseRecord.id,
      contactMethod: parsedContact.method,
      contactValue: parsedContact.value,
      verifiedAt: now,
      lastSeenAt: now,
      expiresAt: getCaseSessionExpiryDate(now),
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
    },
  });

  return {
    verified: true,
    cookieToken: sessionToken,
    case: buildPublicCaseStatus(caseRecord, 'contact'),
  };
}
