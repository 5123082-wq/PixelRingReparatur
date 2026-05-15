import 'server-only';

import type { CaseStatus, MessageAuthorRole, Prisma, PrismaClient } from '@prisma/client';

import type {
  PortalCustomerAttachment,
  PortalDemoOrganization,
  PortalMessageAuthor,
  PortalRequest,
  PortalRequestStatus,
  PortalRequestTimelineItem,
} from './types';

type PortalDb = PrismaClient | Prisma.TransactionClient;

type PortalCaseRecord = {
  id: string;
  publicRequestNumber: string | null;
  status: CaseStatus;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  summary: string | null;
  description: string | null;
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
  }[];
  attachments: {
    id: string;
    originalFilename: string | null;
    mimeType: string;
    createdAt: Date;
  }[];
  statusEvents: {
    id: string;
    toStatus: CaseStatus;
    reason: string | null;
    createdAt: Date;
  }[];
};

const VIRTUAL_OBJECT_ID = 'service-requests';

function formatDate(value: Date | null | undefined): string {
  if (!value) {
    return 'Noch nicht gesetzt';
  }

  return new Intl.DateTimeFormat('de-DE', {
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
    case 'READY_FOR_PICKUP':
      return 'IN_PROGRESS';
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

function nextStepForStatus(status: CaseStatus): string {
  switch (status) {
    case 'WAITING_FOR_CUSTOMER':
      return 'Wir warten auf eine Rueckmeldung oder zusaetzliche Informationen von Ihnen.';
    case 'IN_PROGRESS':
      return 'Die Anfrage ist in Bearbeitung. PixelRing koordiniert die naechsten Schritte.';
    case 'ON_HOLD':
      return 'Die Anfrage ist voruebergehend pausiert. Ihr Ansprechpartner meldet sich mit dem naechsten Schritt.';
    case 'READY_FOR_PICKUP':
      return 'Die Anfrage ist fuer den naechsten operativen Schritt vorbereitet.';
    case 'COMPLETED':
      return 'Die Anfrage ist abgeschlossen.';
    case 'CANCELLED':
      return 'Die Anfrage wurde geschlossen.';
    case 'DRAFT':
    case 'FORMALIZED':
    case 'NUMBER_ISSUED':
    case 'UNDER_REVIEW':
      return 'PixelRing prueft die Anfrage und bereitet die Bearbeitung vor.';
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
  if (caseRecord.summary?.trim()) {
    return caseRecord.summary.trim();
  }

  return `Anfrage ${caseRecord.publicRequestNumber}`;
}

function summaryForCase(caseRecord: PortalCaseRecord): string {
  if (caseRecord.description?.trim()) {
    return caseRecord.description.trim();
  }

  if (caseRecord.summary?.trim()) {
    return caseRecord.summary.trim();
  }

  return 'Die Anfrage wurde im PixelRing System registriert.';
}

function mapCaseToPortalRequest(caseRecord: PortalCaseRecord): PortalRequest {
  return {
    id: caseRecord.id,
    publicRequestNumber: caseRecord.publicRequestNumber || 'PR-PENDING-0000',
    objectId: VIRTUAL_OBJECT_ID,
    title: titleForCase(caseRecord),
    status: mapStatus(caseRecord.status),
    priority: caseRecord.status === 'WAITING_FOR_CUSTOMER' ? 'high' : 'normal',
    openedAt: formatDate(caseRecord.numberIssuedAt || caseRecord.createdAt),
    updatedAt: formatDate(caseRecord.statusUpdatedAt || caseRecord.updatedAt),
    summary: summaryForCase(caseRecord),
    nextStep: nextStepForStatus(caseRecord.status),
  };
}

function mapTimeline(caseRecord: PortalCaseRecord): PortalRequestTimelineItem[] {
  const events = caseRecord.statusEvents.map((event) => ({
    id: event.id,
    requestId: caseRecord.id,
    state: event.toStatus === caseRecord.status ? 'active' as const : 'done' as const,
    title: nextStepForStatus(event.toStatus),
    description: event.reason || `Status: ${event.toStatus}`,
    occurredAt: formatDate(event.createdAt),
  }));

  if (events.length > 0) {
    return events;
  }

  return [
    {
      id: `${caseRecord.id}-created`,
      requestId: caseRecord.id,
      state: 'active',
      title: 'Anfrage registriert',
      description: 'Die Anfrage wurde im PixelRing System angelegt.',
      occurredAt: formatDate(caseRecord.numberIssuedAt || caseRecord.createdAt),
    },
  ];
}

function mapAttachments(caseRecord: PortalCaseRecord): PortalCustomerAttachment[] {
  return caseRecord.attachments.map((attachment) => ({
    id: attachment.id,
    requestId: caseRecord.id,
    filename: attachment.originalFilename || 'Anhang',
    fileType: attachment.mimeType,
    uploadedAt: formatDate(attachment.createdAt),
    status: 'received',
  }));
}

function buildOrganization(input: {
  portalUserId: string;
  email: string;
  displayName: string | null;
  cases: PortalCaseRecord[];
}): PortalDemoOrganization {
  const contactName = customerNameForPortal(input.email, input.displayName);
  const requests = input.cases.map(mapCaseToPortalRequest);

  return {
    id: input.portalUserId,
    name: contactName,
    plan: 'Start',
    demoEmail: input.email,
    languagePreference: 'de',
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
        name: 'Ihre PixelRing Anfragen',
        city: '',
        address: 'Noch keinem Objekt zugeordnet',
        purpose: 'Service requests and customer communication',
        accessNotes: 'Nur fuer verifizierte Portal-Sitzungen sichtbar.',
        responsibleContactIds: ['primary-contact'],
      },
    ],
    assets: [],
    requests,
    messages: input.cases.flatMap((caseRecord) =>
      caseRecord.messages.map((message) => ({
        id: message.id,
        requestId: caseRecord.id,
        author: mapMessageAuthor(message.authorRole),
        sentAt: formatDate(message.sentAt || message.createdAt),
        body: message.body,
      }))
    ),
    requestTimeline: input.cases.flatMap(mapTimeline),
    customerAttachments: input.cases.flatMap(mapAttachments),
    documents: [],
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
          grantedAt: 'desc',
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
              summary: true,
              description: true,
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
  email: string
): Promise<PortalDemoOrganization | null> {
  const portalUser = await getPortalUserWithCases(db, portalUserId);

  if (!portalUser) {
    return null;
  }

  const cases = portalUser.caseAccesses
    .map((access) => access.case)
    .filter((caseRecord): caseRecord is PortalCaseRecord => Boolean(caseRecord.publicRequestNumber));

  return buildOrganization({
    portalUserId: portalUser.id,
    email: portalUser.primaryEmailNormalized || email,
    displayName: portalUser.displayName,
    cases,
  });
}

export async function getPortalRequestDetailForUser(
  db: PortalDb,
  portalUserId: string,
  email: string,
  publicRequestNumber: string
) {
  const organization = await getPortalOrganizationForUser(db, portalUserId, email);

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
