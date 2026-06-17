/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { CaseOriginChannel, MessageAuthorRole } from '@prisma/client';

import {
  customerSafePortalCaseSummary,
  customerSafePortalCaseTitle,
  customerSafePortalMessageBody,
  customerSafeTimelineDescriptionForStatus,
  isInternalPortalAccessMessage,
} from '../src/lib/portal/safe-read-model.ts';
import { isAllowedPortalMutationRequest } from '../src/lib/portal/mutation-origin.ts';
import {
  buildPortalRequestMessage,
  createPortalMessageForRequest,
  normalizePortalRequestDetailsInput,
  normalizePortalRequestInput,
  updatePortalRequestDetailsForUser,
} from '../src/lib/portal/request-utils.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readProjectFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8');
}

function buildFakePortalMessageDb() {
  const messages: any[] = [];
  const cases = new Map([
    [
      'PR-TEST-0001',
      {
        id: 'case-1',
        publicRequestNumber: 'PR-TEST-0001',
      },
    ],
  ]);

  const db: any = {
    portalCaseAccess: {
      findFirst: async ({ where }: any) => {
        const caseRecord = cases.get(where.case.publicRequestNumber);

        if (where.portalUserId !== 'portal-user-1' || where.revokedAt !== null || !caseRecord) {
          return null;
        }

        return { case: caseRecord };
      },
    },
    message: {
      create: async ({ data }: any) => {
        const now = new Date('2026-05-17T10:00:00.000Z');
        const record = {
          id: `message-${messages.length + 1}`,
          ...data,
          createdAt: now,
          updatedAt: now,
        };

        messages.push(record);

        return {
          id: record.id,
          authorRole: record.authorRole,
          channel: record.channel,
          body: record.body,
          isCustomerVisible: record.isCustomerVisible,
          sentAt: record.sentAt,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          attachments: [],
        };
      },
    },
    case: {
      update: async ({ where }: any) => ({ id: where.id }),
    },
  };

  db.$transaction = async (callback: (tx: any) => Promise<void>) => callback(db);

  return { db, messages };
}

function buildFakePortalDetailsDb() {
  const messages: any[] = [];
  const auditLogs: any[] = [];
  const caseRecord: any = {
    id: 'case-1',
    publicRequestNumber: 'PR-TEST-0001',
    customerName: 'Old Name',
    customerEmail: 'old@example.com',
    customerPhone: '+491111',
    serviceLocation: 'Old Street 1',
    locale: 'de',
  };

  const db: any = {
    portalCaseAccess: {
      findFirst: async ({ where }: any) => {
        if (
          where.portalUserId !== 'portal-user-1' ||
          where.revokedAt !== null ||
          where.case.publicRequestNumber !== caseRecord.publicRequestNumber
        ) {
          return null;
        }

        return { case: { ...caseRecord } };
      },
    },
    case: {
      update: async ({ data }: any) => {
        Object.assign(caseRecord, data);
        return { id: caseRecord.id };
      },
    },
    customerProfile: {
      findUnique: async () => null,
      create: async () => ({ id: 'profile-1' }),
      update: async () => ({ id: 'profile-1' }),
    },
    message: {
      create: async ({ data }: any) => {
        messages.push(data);
        return { id: `message-${messages.length}` };
      },
    },
    adminAuditLog: {
      create: async ({ data }: any) => {
        auditLogs.push(data);
      },
    },
  };

  db.$transaction = async (callback: (tx: any) => Promise<void>) => callback(db);

  return { db, caseRecord, messages, auditLogs };
}

function fakePortalMutationRequest(input: {
  method?: string;
  headers?: Record<string, string>;
}) {
  return {
    method: input.method ?? 'POST',
    headers: new Headers(input.headers ?? {}),
    nextUrl: new URL('https://www.pixel-ring.com/de/portal'),
  };
}

test('portal read model hides internal portal claim links', () => {
  assert.equal(
    isInternalPortalAccessMessage('Kundenportal-Link: https://www.pixel-ring.com/de/portal/claim?token=secret'),
    true
  );
  assert.equal(
    isInternalPortalAccessMessage('Der Manager hat eine sichere Rueckfrage zur Anfrage gestellt.'),
    false
  );
});

test('portal timeline descriptions do not expose raw CRM reasons', () => {
  assert.equal(
    customerSafeTimelineDescriptionForStatus('UNDER_REVIEW').includes('CRM'),
    false
  );
  assert.equal(
    customerSafeTimelineDescriptionForStatus('WAITING_FOR_CUSTOMER'),
    'PixelRing benoetigt eine Rueckmeldung oder zusaetzliche Informationen von Ihnen.'
  );
});

test('portal read model uses customer-visible messages instead of raw CRM case text', () => {
  const messages = [
    {
      authorRole: MessageAuthorRole.CUSTOMER,
      body: 'Typ: Montage\nStandort: 4512\n\nLED Schrift flackert seit gestern am Eingang.',
    },
  ];

  assert.equal(
    customerSafePortalCaseTitle({
      publicRequestNumber: 'PR-2026-0001',
      messages,
    }),
    'LED Schrift flackert seit gestern am Eingang.'
  );
  assert.equal(
    customerSafePortalMessageBody(messages[0].body),
    'LED Schrift flackert seit gestern am Eingang.'
  );
  assert.equal(
    customerSafePortalCaseSummary(messages).includes('supplier margin internal'),
    false
  );
});

test('portal mutations reject cross-origin browser posts', () => {
  assert.equal(
    isAllowedPortalMutationRequest(fakePortalMutationRequest({
      headers: {
        origin: 'https://www.pixel-ring.com',
        'sec-fetch-site': 'same-origin',
      },
    })),
    true
  );
  assert.equal(
    isAllowedPortalMutationRequest(fakePortalMutationRequest({
      headers: {
        origin: 'https://example.com',
      },
    })),
    false
  );
  assert.equal(
    isAllowedPortalMutationRequest(fakePortalMutationRequest({
      headers: {
        'sec-fetch-site': 'cross-site',
      },
    })),
    false
  );
});

test('portal request input is normalized before request creation', () => {
  const normalized = normalizePortalRequestInput({
    issueType: ' Reparatur ',
    serviceLocation: ' Berlin   Mitte ',
    serviceLatitude: '52.520008',
    serviceLongitude: '13.404954',
    serviceLocationSource: 'photon',
    message: '  LED Schrift flackert   seit gestern ',
  });

  assert.deepEqual(normalized, {
    issueType: 'Reparatur',
    serviceLocation: 'Berlin Mitte',
    serviceLatitude: 52.520008,
    serviceLongitude: 13.404954,
    serviceLocationSource: 'photon',
    message: 'LED Schrift flackert seit gestern',
  });
  assert.equal(
    buildPortalRequestMessage(normalized),
    'Typ: Reparatur\nStandort: Berlin Mitte\n\nLED Schrift flackert seit gestern'
  );
  assert.equal(
    buildPortalRequestMessage({ ...normalized, issueType: 'Ремонт' }, 'ru'),
    'Тип: Ремонт\nАдрес: Berlin Mitte\n\nLED Schrift flackert seit gestern'
  );
});

test('portal request creation uses verified portal email without a new claim link', () => {
  const portalRequestSource = readProjectFile('src/lib/portal/requests.ts');
  const intakeSource = readProjectFile('src/lib/request-intake.ts');
  const portalAccessIndex = intakeSource.indexOf('await tx.portalCaseAccess.upsert({');
  const portalReturnIndex = intakeSource.indexOf('return {', portalAccessIndex);
  const claimLinkIndex = intakeSource.indexOf('const portalClaimLink = await createPortalClaimLink(tx, {');

  assert.ok(portalRequestSource.includes('contact: input.email'));
  assert.ok(portalRequestSource.includes('portalUser: {'));
  assert.ok(portalRequestSource.includes('portalUserId: input.portalUserId'));
  assert.ok(portalRequestSource.includes('portalSessionId: input.portalSessionId'));
  assert.notEqual(portalAccessIndex, -1);
  assert.notEqual(portalReturnIndex, -1);
  assert.notEqual(claimLinkIndex, -1);
  assert.ok(portalAccessIndex < portalReturnIndex);
  assert.ok(portalReturnIndex < claimLinkIndex);
  assert.equal(intakeSource.includes('sendPortalActivationInviteEmail'), false);
});

test('status lookup with request number alone does not query case or expose portal data', () => {
  const source = readProjectFile('src/lib/status-lookup.ts');
  const noContactIndex = source.indexOf('if (!hasContact) {');
  const caseQueryIndex = source.indexOf('const caseRecord = await prisma.case.findUnique({');

  assert.notEqual(noContactIndex, -1);
  assert.notEqual(caseQueryIndex, -1);
  assert.ok(noContactIndex < caseQueryIndex);
  assert.ok(source.includes('Request number alone does not reveal private data.'));
  assert.equal(source.includes('portalClaimUrl'), false);
  assert.equal(source.includes('portalActivation'), false);
});

test('status API resolves portal activation only after verified status access', () => {
  const source = readProjectFile('src/app/api/status/route.ts');
  const unverifiedIndex = source.indexOf('if (!result.verified) {');
  const verifiedResponseIndex = source.indexOf('const response = NextResponse.json({');
  const activationIndex = source.indexOf('portalActivation: await resolvePortalActivation({');

  assert.notEqual(unverifiedIndex, -1);
  assert.notEqual(verifiedResponseIndex, -1);
  assert.notEqual(activationIndex, -1);
  assert.ok(unverifiedIndex < verifiedResponseIndex);
  assert.ok(verifiedResponseIndex < activationIndex);
  assert.equal(source.includes('createPortalClaimLink'), false);
  assert.ok(source.includes('getActivePortalClaimLinkForCase'));
  assert.ok(source.includes('getPortalSessionContext'));
});

test('admin manual portal claim action keeps audit details token-safe', () => {
  const source = readProjectFile('src/app/api/admin/cases/[id]/portal-claim-link/route.ts');
  const auditIndex = source.indexOf("action: 'CASE_PORTAL_CLAIM_LINK_CREATED'");
  const detailsIndex = source.indexOf('details: {', auditIndex);
  const detailsBlock = source.slice(detailsIndex, source.indexOf('},', detailsIndex) + 2);

  assert.notEqual(auditIndex, -1);
  assert.notEqual(detailsIndex, -1);
  assert.ok(detailsBlock.includes('expiresAt: portalClaim.expiresAt.toISOString()'));
  assert.equal(detailsBlock.includes('portalClaim.url'), false);
  assert.equal(detailsBlock.includes('token'), false);
});

test('portal request detail input normalizes editable fields only', () => {
  assert.deepEqual(
    normalizePortalRequestDetailsInput({
      customerName: ' Neuer   Name ',
      customerEmail: ' TEST@EXAMPLE.COM ',
      customerPhone: ' +49 2222 ',
      serviceLocation: ' Neue   Strasse 2 ',
      publicRequestNumber: 'PR-SHOULD-NOT-CHANGE',
      openedAt: '2026-01-01',
    } as any),
    {
      customerName: 'Neuer Name',
      customerEmail: 'test@example.com',
      customerPhone: '+49 2222',
      serviceLocation: 'Neue Strasse 2',
    }
  );
});

test('portal message creation requires granted case access', async () => {
  const { db } = buildFakePortalMessageDb();

  const denied = await createPortalMessageForRequest(db, {
    portalUserId: 'portal-user-2',
    portalSessionId: 'session-2',
    publicRequestNumber: 'PR-TEST-0001',
    body: 'Bitte den Status pruefen.',
  });

  assert.deepEqual(denied, { ok: false, reason: 'not_found' });
});

test('portal message creation stores a customer-visible message for granted request', async () => {
  const { db, messages } = buildFakePortalMessageDb();

  const result = await createPortalMessageForRequest(db, {
    portalUserId: 'portal-user-1',
    portalSessionId: 'session-1',
    publicRequestNumber: 'pr-test-0001',
    body: 'Bitte den Status pruefen.',
  });

  assert.equal(result.ok, true);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].caseId, 'case-1');
  assert.equal(messages[0].sessionId, 'session-1');
  assert.equal(messages[0].channel, CaseOriginChannel.WEBSITE_CHAT);
  assert.equal(messages[0].authorRole, MessageAuthorRole.CUSTOMER);
  assert.equal(messages[0].isCustomerVisible, true);
});

test('portal message creation can store a file-only customer-visible message', async () => {
  const { db, messages } = buildFakePortalMessageDb();

  const result = await createPortalMessageForRequest(db, {
    portalUserId: 'portal-user-1',
    portalSessionId: 'session-1',
    publicRequestNumber: 'PR-TEST-0001',
    body: '',
    attachments: [
      {
        kind: 'IMAGE',
        storageProvider: 'LOCAL',
        storageKey: 'attachments/test-image.jpg',
        originalFilename: 'test-image.jpg',
        mimeType: 'image/jpeg',
        byteSize: 128,
      },
    ],
  });

  assert.equal(result.ok, true);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].body, 'Foto');
  assert.equal(messages[0].attachments.createMany.data.length, 1);
  assert.equal(messages[0].attachments.createMany.data[0].caseId, 'case-1');
});

test('portal request detail update requires granted case access', async () => {
  const { db } = buildFakePortalDetailsDb();

  const denied = await updatePortalRequestDetailsForUser(db, {
    portalUserId: 'portal-user-2',
    portalSessionId: 'session-2',
    publicRequestNumber: 'PR-TEST-0001',
    details: {
      customerName: 'New Name',
      customerEmail: 'new@example.com',
      customerPhone: '+492222',
      serviceLocation: 'New Street 2',
    },
  });

  assert.deepEqual(denied, { ok: false, reason: 'not_found' });
});

test('portal request detail update stores audit log and customer-visible diff message', async () => {
  const { db, caseRecord, messages, auditLogs } = buildFakePortalDetailsDb();

  const result = await updatePortalRequestDetailsForUser(db, {
    portalUserId: 'portal-user-1',
    portalSessionId: 'session-1',
    publicRequestNumber: 'pr-test-0001',
    details: {
      customerName: 'New Name',
      customerEmail: 'new@example.com',
      customerPhone: '+492222',
      serviceLocation: 'New Street 2',
      publicRequestNumber: 'PR-SHOULD-NOT-CHANGE',
      createdAt: '2026-01-01',
    } as any,
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
  });

  assert.equal(result.ok, true);
  assert.equal(caseRecord.publicRequestNumber, 'PR-TEST-0001');
  assert.equal(caseRecord.customerName, 'New Name');
  assert.equal(caseRecord.customerEmail, 'new@example.com');
  assert.equal(caseRecord.customerPhone, '+492222');
  assert.equal(caseRecord.serviceLocation, 'New Street 2');
  assert.equal(caseRecord.serviceLatitude, null);
  assert.equal(caseRecord.serviceLongitude, null);
  assert.equal(caseRecord.serviceLocationSource, null);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].authorRole, MessageAuthorRole.SYSTEM);
  assert.equal(messages[0].isCustomerVisible, true);
  assert.match(messages[0].body, /Name wurde geaendert\./);
  assert.match(messages[0].body, /Adresse \/ Objekt wurde geaendert\./);

  assert.equal(messages[1].authorRole, MessageAuthorRole.SYSTEM);
  assert.equal(messages[1].isCustomerVisible, false);
  assert.match(messages[1].body, /Name: "Old Name" -> "New Name"/);
  assert.match(messages[1].body, /Adresse \/ Objekt: "Old Street 1" -> "New Street 2"/);

  assert.equal(auditLogs.length, 1);
  assert.equal(auditLogs[0].action, 'PORTAL_CASE_DETAILS_UPDATED');
  assert.equal(auditLogs[0].details.changes.length, 4);
  assert.equal(auditLogs[0].details.changes[0].to, '[REDACTED]');
});
