import 'server-only';
import { getAttentionCopy } from '@/lib/portal-attention/copy';
import { getWorkResultCopy } from '@/lib/work-results/copy';

import type { CaseStatus, MessageAuthorRole, Prisma, PrismaClient } from '@prisma/client';

import type {
  PortalCustomerAttachment,
  PortalDemoOrganization,
  PortalMessageAuthor,
  PortalRequest,
  PortalRequestStatus,
  PortalRequestTimelineItem,
} from './types';
import {
  customerSafePortalCaseSummary,
  customerSafePortalCaseTitle,
  customerSafePortalMessageBody,
  isInternalPortalAccessMessage,
} from './safe-read-model';

type PortalDb = PrismaClient | Prisma.TransactionClient;

type PortalCaseRecord = {
  id: string;
  publicRequestNumber: string | null;
  status: CaseStatus;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  serviceLocation: string | null;
  serviceLatitude: number | null;
  serviceLongitude: number | null;
  serviceLocationSource: string | null;
  locale: string | null;
  numberIssuedAt: Date | null;
  statusUpdatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  messages: {
    id: string;
    authorRole: MessageAuthorRole;
    authorName: string | null;
    body: string;
    sentAt: Date | null;
    createdAt: Date;
    attachments: {
      id: string;
      storageKey: string;
      originalFilename: string | null;
      mimeType: string;
    }[];
  }[];
  attachments: {
    id: string;
    originalFilename: string | null;
    mimeType: string;
    createdAt: Date;
  }[];
  workResult?: { publishedVersion: number; revisions: { id: string; number: number; publishedAt: Date }[] } | null;
  statusEvents: {
    id: string;
    toStatus: CaseStatus;
    reason: string | null;
    createdAt: Date;
  }[];
};

const VIRTUAL_OBJECT_ID = 'service-requests';
function portalLocale(locale?: string | null): string {
  return ({ ru: 'ru-RU', en: 'en-GB', de: 'de-DE', tr: 'tr-TR', pl: 'pl-PL', ar: 'ar' } as Record<string, string>)[locale || 'de'] || 'de-DE';
}

function formatDate(value: Date | null | undefined, locale?: string | null): string {
  if (!value) {
    return locale === 'ru' ? 'Пока не указано' : 'Noch nicht gesetzt';
  }

  return new Intl.DateTimeFormat(portalLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function customerNameForPortal(email: string, displayName?: string | null): string {
  if (displayName?.trim()) {
    return displayName.trim();
  }

  return email;
}

function mapStatus(status: CaseStatus): PortalRequestStatus {
  switch (status) {
    case 'WAITING_FOR_CUSTOMER':
      return 'WAITING_FOR_CUSTOMER';
    case 'IN_PROGRESS':
    case 'ON_HOLD':
      return 'IN_PROGRESS';
    case 'WORK_COMPLETED':
      return 'WORK_COMPLETED';
    case 'READY_FOR_PICKUP':
      return 'READY_FOR_PICKUP';
    case 'COMPLETED':
    case 'CANCELLED':
      return 'COMPLETED';
    case 'DRAFT':
    case 'FORMALIZED':
    case 'NUMBER_ISSUED':
    case 'UNDER_REVIEW':
      return 'UNDER_REVIEW';
  }
}

function nextStepForStatus(status: CaseStatus, locale?: string | null): string {
  if (status === 'WORK_COMPLETED') return getWorkResultCopy(locale).next;
  if (status === 'READY_FOR_PICKUP') return getWorkResultCopy(locale).ready;
  if (status === 'COMPLETED') return getWorkResultCopy(locale).closed;
  const copy = getAttentionCopy(locale);
  switch (status) {
    case 'WAITING_FOR_CUSTOMER': return copy.waitingStatus;
    case 'IN_PROGRESS': return copy.progressStatus;
    case 'ON_HOLD': return copy.holdStatus;
    case 'CANCELLED': return copy.closedStatus;
    default: return copy.reviewStatus;
  }
}

function mapMessageAuthor(role: MessageAuthorRole): PortalMessageAuthor {
  switch (role) {
    case 'CUSTOMER':
      return 'Customer';
    case 'OPERATOR':
      return 'PixelRing Manager';
    case 'SYSTEM':
      return 'PixelRing Manager';
  }
}

function titleForCase(caseRecord: PortalCaseRecord): string {
  return customerSafePortalCaseTitle({
    publicRequestNumber: caseRecord.publicRequestNumber,
    messages: caseRecord.messages,
  });
}

function summaryForCase(caseRecord: PortalCaseRecord): string {
  return customerSafePortalCaseSummary(caseRecord.messages);
}

function mapCaseToPortalRequest(caseRecord: PortalCaseRecord, locale = 'de'): PortalRequest {
  return {
    id: caseRecord.id,
    publicRequestNumber: caseRecord.publicRequestNumber || 'PR-PENDING-0000',
    objectId: VIRTUAL_OBJECT_ID,
    title: titleForCase(caseRecord),
    status: mapStatus(caseRecord.status),
    priority: caseRecord.status === 'WAITING_FOR_CUSTOMER' ? 'high' : 'normal',
    openedAt: formatDate(caseRecord.numberIssuedAt || caseRecord.createdAt, locale),
    updatedAt: formatDate(new Date(Math.max(caseRecord.updatedAt.getTime(), caseRecord.statusUpdatedAt?.getTime() || 0)), locale),
    summary: summaryForCase(caseRecord),
    nextStep: nextStepForStatus(caseRecord.status, locale),
    customerName: caseRecord.customerName,
    serviceLocation: caseRecord.serviceLocation,
    serviceLatitude: caseRecord.serviceLatitude,
    serviceLongitude: caseRecord.serviceLongitude,
    serviceLocationSource: caseRecord.serviceLocationSource,
    contactEmail: caseRecord.customerEmail,
    contactPhone: caseRecord.customerPhone,
  };
}

function mapTimeline(caseRecord: PortalCaseRecord, locale = 'de'): PortalRequestTimelineItem[] {
  const events = caseRecord.statusEvents.map((event) => ({
    id: event.id,
    requestId: caseRecord.id,
    state: event.toStatus === caseRecord.status ? 'active' as const : 'done' as const,
    title: nextStepForStatus(event.toStatus, locale),
    description: nextStepForStatus(event.toStatus, locale),
    occurredAt: formatDate(event.createdAt, locale),
  }));

  if (events.length > 0) {
    return events;
  }

  return [
    {
      id: `${caseRecord.id}-created`,
      requestId: caseRecord.id,
      state: 'active',
      title: getAttentionCopy(locale).createdStatus,
      description: getAttentionCopy(locale).createdStatus,
      occurredAt: formatDate(caseRecord.numberIssuedAt || caseRecord.createdAt, locale),
    },
  ];
}

function mapAttachments(caseRecord: PortalCaseRecord, locale = 'de'): PortalCustomerAttachment[] {
  return caseRecord.attachments.map((attachment) => ({
    id: attachment.id,
    requestId: caseRecord.id,
    filename: attachment.originalFilename || 'Anhang',
    fileType: attachment.mimeType,
    uploadedAt: formatDate(attachment.createdAt, locale),
    status: 'received',
  }));
}

function buildOrganization(input: {
  portalUserId: string;
  email: string;
  displayName: string | null;
  cases: PortalCaseRecord[];
  locale: string;
}): PortalDemoOrganization {
  const contactName = customerNameForPortal(input.email, input.displayName);
  const locale = input.locale;
  const requests = input.cases.map((record) => mapCaseToPortalRequest(record, locale));
  const copy = getAttentionCopy(locale);

  return {
    id: input.portalUserId,
    name: contactName,
    plan: 'Start',
    demoEmail: input.email,
    languagePreference: locale,
    contacts: [
      {
        id: 'primary-contact',
        name: contactName,
        role: 'Portal account',
        email: input.email,
        phone: '',
      },
    ],
    objects: [
      {
        id: VIRTUAL_OBJECT_ID,
        name: copy.request,
        city: '',
        address: '',
        purpose: copy.request,
        accessNotes: '',
        responsibleContactIds: ['primary-contact'],
      },
    ],
    assets: [],
    requests,
    messages: input.cases.flatMap((caseRecord) =>
      caseRecord.messages
        .filter((message) => !isInternalPortalAccessMessage(message.body))
        .map((message) => ({
          id: message.id,
          requestId: caseRecord.id,
          author: mapMessageAuthor(message.authorRole),
          sentAt: formatDate(message.sentAt || message.createdAt, locale),
          body: customerSafePortalMessageBody(message.body),
          attachments: message.attachments,
        }))
    ),
    requestTimeline: input.cases.flatMap((record) => mapTimeline(record, locale)),
    customerAttachments: input.cases.flatMap((record) => mapAttachments(record, locale)),
    documents: input.cases.flatMap((record) => {
      const revision = record.workResult?.revisions[0];
      if (!revision || revision.number !== record.workResult?.publishedVersion) return [];
      return [{ id: revision.id, type: 'REPORT' as const, title: record.publicRequestNumber || '',
        relatedTo: record.publicRequestNumber || '', requestId: record.id,
        issuedAt: formatDate(revision.publishedAt, locale), status: 'available' as const,
        href: '/portal/requests/' + encodeURIComponent(record.publicRequestNumber || '') + '#repair-report' }];
    }),
    requiredActions: [],
  };
}

async function getPortalUserWithCases(db: PortalDb, portalUserId: string) {
  return db.portalUser.findUnique({
    where: {
      id: portalUserId,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      displayName: true,
      primaryEmailNormalized: true,
      caseAccesses: {
        where: {
          revokedAt: null,
        },
        orderBy: {
          case: { updatedAt: 'desc' },
        },
        select: {
          case: {
            select: {
              id: true,
              publicRequestNumber: true,
              status: true,
              customerName: true,
              customerEmail: true,
              customerPhone: true,
              serviceLocation: true,
              serviceLatitude: true,
              serviceLongitude: true,
              serviceLocationSource: true,
              locale: true,
              numberIssuedAt: true,
              statusUpdatedAt: true,
              createdAt: true,
              updatedAt: true,
              messages: {
                where: {
                  isCustomerVisible: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
                select: {
                  id: true,
                  authorRole: true,
                  authorName: true,
                  body: true,
                  sentAt: true,
                  createdAt: true,
                  attachments: {
                    where: {
                      isCustomerVisible: true,
                    },
                    select: {
                      id: true,
                      storageKey: true,
                      originalFilename: true,
                      mimeType: true,
                    },
                  },
                },
              },
              attachments: {
                where: {
                  isCustomerVisible: true,
                },
                orderBy: {
                  createdAt: 'asc',
                },
                select: {
                  id: true,
                  originalFilename: true,
                  mimeType: true,
                  createdAt: true,
                },
              },
              workResult: { select: { publishedVersion: true, revisions: {
                orderBy: { number: 'desc' }, take: 1,
                select: { id: true, number: true, publishedAt: true },
              } } },
              statusEvents: {
                orderBy: {
                  createdAt: 'asc',
                },
                select: {
                  id: true,
                  toStatus: true,
                  reason: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getPortalOrganizationForUser(
  db: PortalDb,
  portalUserId: string,
  email: string,
  locale = 'de'
): Promise<PortalDemoOrganization | null> {
  const portalUser = await getPortalUserWithCases(db, portalUserId);

  if (!portalUser) {
    return null;
  }

  const cases = portalUser.caseAccesses
    .map((access) => access.case)
    .filter((caseRecord) => Boolean(caseRecord.publicRequestNumber));

  return buildOrganization({
    portalUserId: portalUser.id,
    email: portalUser.primaryEmailNormalized || email,
    displayName: portalUser.displayName,
    cases,
    locale,
  });
}

export async function getPortalRequestDetailForUser(
  db: PortalDb,
  portalUserId: string,
  email: string,
  publicRequestNumber: string,
  locale = 'de'
) {
  const organization = await getPortalOrganizationForUser(db, portalUserId, email, locale);

  if (!organization) {
    return null;
  }

  const normalizedRequestNumber = publicRequestNumber.trim().toUpperCase();
  const request = organization.requests.find((item) => item.publicRequestNumber === normalizedRequestNumber);

  if (!request) {
    return {
      organization,
      detail: null,
    };
  }

  const object = organization.objects.find((item) => item.id === request.objectId) || organization.objects[0];

  return {
    organization,
    detail: {
      organization,
      request,
      object,
      assets: organization.assets.filter((asset) => asset.objectId === request.objectId),
      messages: organization.messages.filter((message) => message.requestId === request.id),
      timeline: organization.requestTimeline.filter((item) => item.requestId === request.id),
      customerAttachments: organization.customerAttachments.filter((attachment) => attachment.requestId === request.id),
      documents: organization.documents.filter((document) => document.requestId === request.id),
      requiredActions: organization.requiredActions.filter((action) => action.requestId === request.id),
    },
  };
}
