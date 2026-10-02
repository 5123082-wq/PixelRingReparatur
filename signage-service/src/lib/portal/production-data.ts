import 'server-only';
import { portalDataTiming } from './performance';
import { getAttentionCopy } from '@/lib/portal-attention/copy';
import { getWorkResultCopy } from '@/lib/work-results/copy';

import { Prisma, type CaseStatus, type MessageAuthorRole, type PrismaClient } from '@prisma/client';

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
  titleMessages?: { authorRole: MessageAuthorRole; body: string }[];
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
      return 'PixelRing AI';
  }
}

function titleForCase(caseRecord: PortalCaseRecord): string {
  return customerSafePortalCaseTitle({
    publicRequestNumber: caseRecord.publicRequestNumber,
    messages: caseRecord.titleMessages ?? caseRecord.messages,
  });
}

function summaryForCase(caseRecord: PortalCaseRecord): string {
  return customerSafePortalCaseSummary(caseRecord.titleMessages ?? caseRecord.messages);
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
  includeHistory?: boolean;
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
          sentAt: (message.sentAt || message.createdAt).toISOString(),
          body: customerSafePortalMessageBody(message.body),
          attachments: message.attachments,
        }))
    ),
    requestTimeline: input.includeHistory === false ? [] : input.cases.flatMap((record) => mapTimeline(record, locale)),
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

// Summary reads deliberately omit correspondence, attachment lists and status history.
const caseSummarySelect = {
  id: true, publicRequestNumber: true, status: true, customerName: true,
  customerEmail: true, customerPhone: true, serviceLocation: true,
  serviceLatitude: true, serviceLongitude: true, serviceLocationSource: true,
  locale: true, numberIssuedAt: true, statusUpdatedAt: true, createdAt: true, updatedAt: true,
  workResult: { select: { publishedVersion: true, revisions: {
    orderBy: { number: 'desc' }, take: 1, select: { id: true, number: true, publishedAt: true },
  } } },
} satisfies Prisma.CaseSelect;
const messageSelect = {
  id: true, authorRole: true, authorName: true, body: true, sentAt: true, createdAt: true,
  attachments: { where: { isCustomerVisible: true }, select: {
    id: true, storageKey: true, originalFilename: true, mimeType: true,
  } },
} satisfies Prisma.MessageSelect;
const visibleMessageWhere = {
  isCustomerVisible: true,
  NOT: [{ body: { contains: 'Kundenportal-Link:', mode: 'insensitive' } },
    { body: { contains: '/portal/claim?token=', mode: 'insensitive' } }],
} satisfies Prisma.MessageWhereInput;
export const PORTAL_PAGE_SIZE = 20;
export const PORTAL_MESSAGE_PAGE_SIZE = 50;

async function identity(db: PortalDb, id: string) {
  return db.portalUser.findUnique({ where: { id, status: 'ACTIVE' },
    select: { id: true, displayName: true, primaryEmailNormalized: true } });
}
function accessibleCases(portalUserId: string): Prisma.CaseWhereInput {
  return { publicRequestNumber: { not: null }, portalCaseAccesses: { some: {
    portalUserId, revokedAt: null, portalUser: { status: 'ACTIVE' },
  } } };
}
// A lateral lookup uses the existing (caseId, createdAt) index. It returns exactly
// one safe opening message per selected case, including when recent chat is paged.
async function openingMessages(db: PortalDb, caseIds: string[]) {
  if (!caseIds.length) return new Map<string, { authorRole: MessageAuthorRole; body: string }[]>();
  const rows = await db.$queryRaw<{ caseId: string; body: string }[]>(Prisma.sql`
    SELECT c.id AS "caseId", m.body FROM cases c
    JOIN LATERAL (
      SELECT body FROM messages WHERE "caseId" = c.id AND "isCustomerVisible" = true
      AND "authorRole" = 'CUSTOMER' AND body ~ '[^[:space:]]'
      AND body NOT ILIKE '%Kundenportal-Link:%' AND body NOT ILIKE '%/portal/claim?token=%'
      ORDER BY "createdAt" ASC, id ASC LIMIT 1
    ) m ON true WHERE c.id IN (${Prisma.join(caseIds.map(id => Prisma.sql`${id}::uuid`))})`);
  return new Map(rows.map(row => [row.caseId, [{ authorRole: 'CUSTOMER' as const, body: row.body }]]));
}
export async function getPortalOrganizationForUser(
  db: PortalDb, portalUserId: string, email: string, locale = 'de',
  options: { page?: number; activeOnly?: boolean; reportsOnly?: boolean } = {}
): Promise<PortalDemoOrganization | null> {
  const timing = portalDataTiming('summary');
  const page = Math.max(1, Math.min(10_000, Math.floor(options.page || 1)));
  const access = accessibleCases(portalUserId);
  const active = { status: { notIn: ['COMPLETED', 'CANCELLED'] } } satisfies Prisma.CaseWhereInput;
  const where: Prisma.CaseWhereInput = { ...access, ...(options.activeOnly ? active : {}),
    ...(options.reportsOnly ? { workResult: { publishedVersion: { gt: 0 } } } : {}) };
  const [user, rows, total, activeCount, filteredTotal] = await Promise.all([
    identity(db, portalUserId),
    db.case.findMany({ where, orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * PORTAL_PAGE_SIZE, take: PORTAL_PAGE_SIZE, select: caseSummarySelect }),
    db.case.count({ where: access }), db.case.count({ where: { ...access, ...active } }),
    options.activeOnly || options.reportsOnly ? db.case.count({ where }) : Promise.resolve(null),
  ]);
  if (!user) return null;
  const titles = await openingMessages(db, rows.map(row => row.id));
  timing.queried();
  const organization = buildOrganization({ portalUserId: user.id,
    email: user.primaryEmailNormalized || email, displayName: user.displayName, locale, includeHistory: false,
    cases: rows.map(row => ({ ...row, messages: [], attachments: [], statusEvents: [], titleMessages: titles.get(row.id) || [] })),
  });
  organization.pagination = { page, pageSize: PORTAL_PAGE_SIZE, total: filteredTotal ?? total, totalRequests: total, activeRequests: activeCount };
  timing.complete();
  return organization;
}
export async function getPortalMessagesForUser(db: PortalDb, portalUserId: string, publicRequestNumber: string, before?: string | null) {
  const timing = portalDataTiming('messages');
  const record = await db.case.findFirst({ where: { ...accessibleCases(portalUserId), publicRequestNumber: publicRequestNumber.trim().toUpperCase() }, select: { id: true } });
  if (!record) return null;
  // Resolve the cursor inside the authorized case; never accept arbitrary timestamps or another case's id.
  const cursor = before ? await db.message.findFirst({ where: { id: before, caseId: record.id, ...visibleMessageWhere }, select: { id: true, createdAt: true } }) : null;
  if (before && !cursor) return null;
  const rows = await db.message.findMany({ where: { caseId: record.id, ...visibleMessageWhere,
    ...(cursor ? { OR: [{ createdAt: { lt: cursor.createdAt } }, { createdAt: cursor.createdAt, id: { lt: cursor.id } }] } : {}) },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: PORTAL_MESSAGE_PAGE_SIZE + 1, select: messageSelect });
  const selected = rows.slice(0, PORTAL_MESSAGE_PAGE_SIZE).reverse();
  timing.queried();
  const result = { messages: selected.map(message => ({ id: message.id, authorRole: message.authorRole,
    body: customerSafePortalMessageBody(message.body), createdAt: (message.sentAt || message.createdAt).toISOString(), attachments: message.attachments })),
    before: rows.length > PORTAL_MESSAGE_PAGE_SIZE ? selected[0]?.id ?? null : null };
  timing.complete();
  return result;
}
export async function getPortalRequestDetailForUser(
  db: PortalDb, portalUserId: string, email: string, publicRequestNumber: string, locale = 'de'
) {
  const timing = portalDataTiming('detail');
  const [user, record] = await Promise.all([
    identity(db, portalUserId),
    db.case.findFirst({ where: { ...accessibleCases(portalUserId), publicRequestNumber: publicRequestNumber.trim().toUpperCase() }, select: {
      ...caseSummarySelect,
      messages: { where: visibleMessageWhere, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: PORTAL_MESSAGE_PAGE_SIZE + 1, select: messageSelect },
      attachments: { where: { isCustomerVisible: true }, orderBy: { createdAt: 'asc' }, select: { id: true, originalFilename: true, mimeType: true, createdAt: true } },
      statusEvents: { orderBy: { createdAt: 'asc' }, select: { id: true, toStatus: true, reason: true, createdAt: true } },
    } }),
  ]);
  if (!user) return null;
  const titles = record ? await openingMessages(db, [record.id]) : new Map();
  timing.queried();
  const selected = record?.messages.slice(0, PORTAL_MESSAGE_PAGE_SIZE).reverse() || [];
  const organization = buildOrganization({ portalUserId: user.id, email: user.primaryEmailNormalized || email,
    displayName: user.displayName, locale, cases: record ? [{ ...record, messages: selected, titleMessages: titles.get(record.id) || [] }] : [] });
  timing.complete();
  if (!record) return { organization, detail: null };
  return { organization, detail: { organization, request: organization.requests[0], object: organization.objects[0],
    assets: [], messages: organization.messages, timeline: organization.requestTimeline,
    customerAttachments: organization.customerAttachments, documents: organization.documents, requiredActions: [],
    messageBefore: record.messages.length > PORTAL_MESSAGE_PAGE_SIZE ? selected[0]?.id ?? null : null,
  } };
}
