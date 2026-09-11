/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { CaseOriginChannel, MessageAuthorRole, SessionScope } from '@prisma/client';

import { lookupPublicCaseStatus } from '../src/lib/status-lookup.ts';
import {
  isAnonymousChatSession,
  isCaseStatusSession,
  isChatAccessSession,
  isSameDeviceCaseSession,
  isStatusOnlyCaseSession,
} from '../src/lib/session-access-policy.ts';
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

function buildStatusCaseRecord() {
  return {
    id: 'case-1',
    publicRequestNumber: 'PR-TEST-0001',
    status: 'UNDER_REVIEW',
    createdAt: new Date('2026-05-17T09:00:00.000Z'),
    updatedAt: new Date('2026-05-17T10:00:00.000Z'),
    customerEmail: 'customer@example.com',
    customerPhone: '+49 30 1234567',
    primaryContactMethod: 'EMAIL',
    primaryContactValue: 'customer@example.com',
  };
}

function buildStatusSessionRecord(overrides: Record<string, unknown> = {}) {
  const caseRecord = buildStatusCaseRecord();

  return {
    id: 'case-session-1',
    tokenHash: 'stored-token-hash',
    scope: SessionScope.CASE_ACCESS,
    caseId: caseRecord.id,
    portalUserId: null,
    verifiedAt: null,
    expiresAt: new Date('2099-01-01T00:00:00.000Z'),
    revokedAt: null,
    lastSeenAt: null,
    case: caseRecord,
    ...overrides,
  };
}

function buildFakeStatusLookupDb(input: {
  caseRecord?: ReturnType<typeof buildStatusCaseRecord> | null;
  sessionRecord?: ReturnType<typeof buildStatusSessionRecord> | null;
} = {}) {
  const caseRecord = input.caseRecord === undefined
    ? buildStatusCaseRecord()
    : input.caseRecord;
  const sessionRecord = input.sessionRecord ?? null;
  const calls = {
    caseFindUnique: [] as any[],
    sessionFindUnique: [] as any[],
    sessionUpdate: [] as any[],
    sessionCreate: [] as any[],
  };

  const db: any = {
    case: {
      findUnique: async (args: any) => {
        calls.caseFindUnique.push(args);

        return caseRecord?.publicRequestNumber === args.where.publicRequestNumber
          ? caseRecord
          : null;
      },
    },
    session: {
      findUnique: async (args: any) => {
        calls.sessionFindUnique.push(args);
        return sessionRecord;
      },
      update: async (args: any) => {
        calls.sessionUpdate.push(args);
        return { ...sessionRecord, ...args.data };
      },
      create: async (args: any) => {
        calls.sessionCreate.push(args);
        return { id: 'unexpected-session', ...args.data };
      },
    },
  };

  return { db, calls };
}

function buildSessionPolicyRecord(overrides: Record<string, unknown> = {}) {
  return {
    scope: SessionScope.CASE_ACCESS,
    caseId: 'case-1',
    portalUserId: null,
    verifiedAt: null,
    expiresAt: new Date('2026-09-06T12:00:00.000Z'),
    revokedAt: null,
    ...overrides,
  };
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

test('portal claim and verification URLs ignore request origin', () => {
  const claimSource = readProjectFile('src/lib/portal/claim.ts');
  const claimBuilderIndex = claimSource.indexOf('function buildClaimUrl(input: {');
  const verificationBuilderIndex = claimSource.indexOf('export function buildPortalVerificationUrl(input: {');
  const createClaimIndex = claimSource.indexOf('export async function createPortalClaimLink(');
  const createVerificationIndex = claimSource.indexOf('export async function createPortalEmailVerification(');
  const claimBuilderBlock = claimSource.slice(claimBuilderIndex, claimSource.indexOf('}', claimBuilderIndex) + 1);
  const verificationBuilderBlock = claimSource.slice(
    verificationBuilderIndex,
    claimSource.indexOf('}', verificationBuilderIndex) + 1
  );
  const createClaimInputBlock = claimSource.slice(createClaimIndex, claimSource.indexOf('): Promise<PortalClaimLinkResult>', createClaimIndex));
  const createVerificationInputBlock = claimSource.slice(
    createVerificationIndex,
    claimSource.indexOf('): Promise<{', createVerificationIndex)
  );

  assert.notEqual(claimBuilderIndex, -1);
  assert.notEqual(verificationBuilderIndex, -1);
  assert.notEqual(createClaimIndex, -1);
  assert.notEqual(createVerificationIndex, -1);
  assert.equal(claimBuilderBlock.includes('origin'), false);
  assert.equal(verificationBuilderBlock.includes('origin'), false);
  assert.equal(createClaimInputBlock.includes('origin'), false);
  assert.equal(createVerificationInputBlock.includes('origin'), false);
  assert.ok(claimSource.includes("return buildLocaleUrl(locale, `/portal/claim?token=${encodeURIComponent(input.token)}`);"));
  assert.ok(claimSource.includes("return buildLocaleUrl(locale, `/portal/claim/verify?token=${encodeURIComponent(input.token)}`);"));
});

test('portal claim access is bound to the existing customer email when present', () => {
  const claimSource = readProjectFile('src/lib/portal/claim.ts');
  const loginSource = readProjectFile('src/lib/portal/login.ts');
  const createCodeIndex = loginSource.indexOf('async function createCodeForEligibleEmail(');
  const createCodeEmailCheckIndex = loginSource.indexOf('!isPortalClaimEmailAllowed({', createCodeIndex);
  const emailCodeCreateIndex = loginSource.indexOf('await db.portalEmailCode.create({', createCodeIndex);
  const completeCodeIndex = loginSource.indexOf('export async function completePortalPasswordCode(');
  const completeCodeEmailCheckIndex = loginSource.indexOf('!isPortalClaimEmailAllowed({', completeCodeIndex);
  const upsertUserIndex = loginSource.indexOf('await upsertPortalUserWithVerifiedEmail(tx, {', completeCodeIndex);
  const grantSessionIndex = loginSource.indexOf('export async function grantPortalClaimAccessToSessionUser(');
  const grantSessionEmailCheckIndex = loginSource.indexOf('!isPortalClaimEmailAllowed({', grantSessionIndex);
  const grantSessionConsumeIndex = loginSource.indexOf('await tx.portalClaimLink.update({', grantSessionIndex);

  assert.ok(claimSource.includes('customerEmail: string | null;'));
  assert.ok(claimSource.includes('customerEmail: claim.case.customerEmail'));
  assert.ok(loginSource.includes('function getPortalClaimBoundEmail(input: {'));
  assert.ok(loginSource.includes('function isPortalClaimEmailAllowed(input: {'));
  assert.ok(loginSource.includes('const candidates = [input.prefillEmail, input.customerEmail]'));
  assert.ok(loginSource.includes('const validEmail = candidates.find(isLikelyPortalEmail);'));
  assert.ok(loginSource.includes('hasInvalidEmailBoundary: candidates.length > 0 && !validEmail'));
  assert.ok(loginSource.includes('if (boundEmail.hasInvalidEmailBoundary) {'));
  assert.notEqual(createCodeIndex, -1);
  assert.notEqual(createCodeEmailCheckIndex, -1);
  assert.notEqual(emailCodeCreateIndex, -1);
  assert.ok(createCodeEmailCheckIndex < emailCodeCreateIndex);
  assert.ok(loginSource.includes("return { ok: false, reason: 'not_eligible', email };"));
  assert.notEqual(completeCodeIndex, -1);
  assert.notEqual(completeCodeEmailCheckIndex, -1);
  assert.notEqual(upsertUserIndex, -1);
  assert.ok(completeCodeEmailCheckIndex < upsertUserIndex);
  assert.ok(loginSource.includes('prefillEmail: codeRecord.claimLink.prefillEmail'));
  assert.ok(loginSource.includes('customerEmail: codeRecord.case?.customerEmail'));
  assert.notEqual(grantSessionIndex, -1);
  assert.notEqual(grantSessionEmailCheckIndex, -1);
  assert.notEqual(grantSessionConsumeIndex, -1);
  assert.ok(grantSessionEmailCheckIndex < grantSessionConsumeIndex);
  assert.ok(loginSource.includes('prefillEmail: claim.prefillEmail'));
  assert.ok(loginSource.includes('customerEmail: claim.customerEmail'));
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

test('matching email or phone grants status-only data without creating a session or cookie', async () => {
  for (const contact of ['CUSTOMER@example.com', '+49 (30) 1234567']) {
    const { db, calls } = buildFakeStatusLookupDb();
    const result = await lookupPublicCaseStatus(db, {
      publicRequestNumber: 'PR-TEST-0001',
      contact,
    });

    if (!result.verified) {
      assert.fail(result.message);
    }

    assert.equal(result.accessLevel, 'status_only');
    assert.equal(result.caseId, 'case-1');
    assert.equal(result.case.verifiedVia, 'contact');
    assert.deepEqual(
      Object.keys(result.case).sort(),
      [
        'createdAt',
        'publicRequestNumber',
        'status',
        'statusDescription',
        'statusLabel',
        'updatedAt',
        'verifiedVia',
      ]
    );
    assert.equal(Object.hasOwn(result, 'cookieToken'), false);
    assert.equal(calls.caseFindUnique.length, 1);
    assert.equal(calls.sessionFindUnique.length, 0);
    assert.equal(calls.sessionCreate.length, 0);
    assert.equal(calls.sessionUpdate.length, 0);
  }
});

test('mismatched contact returns the same generic failure as an unknown request and creates no session', async () => {
  const failures = [];

  for (const contact of ['intruder@example.net', '+49 30 9999999']) {
    const { db, calls } = buildFakeStatusLookupDb();
    const result = await lookupPublicCaseStatus(db, {
      publicRequestNumber: 'PR-TEST-0001',
      contact,
    });

    failures.push(result);
    assert.equal(result.verified, false);
    assert.equal(Object.hasOwn(result, 'cookieToken'), false);
    assert.equal(calls.sessionCreate.length, 0);
    assert.equal(calls.sessionUpdate.length, 0);
  }

  const { db: unknownCaseDb, calls: unknownCaseCalls } = buildFakeStatusLookupDb();
  const unknownCaseResult = await lookupPublicCaseStatus(unknownCaseDb, {
    publicRequestNumber: 'PR-MISS-0000',
    contact: 'customer@example.com',
  });

  assert.deepEqual(failures[0], failures[1]);
  assert.deepEqual(failures[0], unknownCaseResult);
  assert.deepEqual(failures[0], {
    verified: false,
    verificationRequired: true,
    message: 'Request number alone does not reveal private data. Please verify with the phone or email used on the request, or use the same device that already has access.',
  });
  assert.equal(unknownCaseCalls.sessionCreate.length, 0);
  assert.equal(unknownCaseCalls.sessionUpdate.length, 0);
});

test('same-device CASE_ACCESS returns case access and touches the existing token only', async () => {
  const rawToken = 'same-device-token';
  const { db, calls } = buildFakeStatusLookupDb({
    sessionRecord: buildStatusSessionRecord(),
  });
  const result = await lookupPublicCaseStatus(db, {
    publicRequestNumber: 'PR-TEST-0001',
    sessionToken: rawToken,
  });

  if (!result.verified) {
    assert.fail(result.message);
  }

  assert.equal(result.accessLevel, 'case_access');
  assert.equal(result.cookieToken, rawToken);
  assert.equal(result.case.verifiedVia, 'session');
  assert.equal(calls.sessionFindUnique.length, 1);
  assert.notEqual(calls.sessionFindUnique[0].where.tokenHash, rawToken);
  assert.equal(calls.sessionUpdate.length, 1);
  assert.deepEqual(calls.sessionUpdate[0].where, { id: 'case-session-1' });
  assert.deepEqual(Object.keys(calls.sessionUpdate[0].data), ['lastSeenAt']);
  assert.ok(calls.sessionUpdate[0].data.lastSeenAt instanceof Date);
  assert.equal(calls.sessionCreate.length, 0);
  assert.equal(calls.caseFindUnique.length, 0);
});

test('verified CASE_ACCESS remains status-only while preserving and touching its token', async () => {
  const rawToken = 'verified-case-token';
  const { db, calls } = buildFakeStatusLookupDb({
    sessionRecord: buildStatusSessionRecord({
      verifiedAt: new Date('2026-09-05T09:00:00.000Z'),
    }),
  });
  const result = await lookupPublicCaseStatus(db, {
    publicRequestNumber: 'PR-TEST-0001',
    sessionToken: rawToken,
  });

  if (!result.verified) {
    assert.fail(result.message);
  }

  assert.equal(result.accessLevel, 'status_only');
  assert.equal(result.cookieToken, rawToken);
  assert.equal(result.case.verifiedVia, 'session');
  assert.equal(calls.sessionUpdate.length, 1);
  assert.deepEqual(Object.keys(calls.sessionUpdate[0].data), ['lastSeenAt']);
  assert.equal(calls.sessionCreate.length, 0);
  assert.equal(calls.caseFindUnique.length, 0);
});

test('session policy accepts legitimate draft and same-device sessions only in their intended channels', () => {
  const now = new Date('2026-09-05T12:00:00.000Z');
  const anonymousDraft = buildSessionPolicyRecord({
    scope: SessionScope.ANONYMOUS_DRAFT,
    caseId: null,
  });
  const sameDeviceCase = buildSessionPolicyRecord();
  const verifiedCase = buildSessionPolicyRecord({
    verifiedAt: new Date('2026-09-05T09:00:00.000Z'),
  });

  assert.equal(isAnonymousChatSession(anonymousDraft, now), true);
  assert.equal(isChatAccessSession(anonymousDraft, now), true);
  assert.equal(isCaseStatusSession(anonymousDraft, now), false);

  assert.equal(isSameDeviceCaseSession(sameDeviceCase, now), true);
  assert.equal(isChatAccessSession(sameDeviceCase, now), true);
  assert.equal(isCaseStatusSession(sameDeviceCase, now), true);

  assert.equal(isStatusOnlyCaseSession(verifiedCase, now), true);
  assert.equal(isChatAccessSession(verifiedCase, now), false);
  assert.equal(isCaseStatusSession(verifiedCase, now), true);
});

test('session policy rejects portal, revoked, expired, and mixed-scope records', () => {
  const now = new Date('2026-09-05T12:00:00.000Z');
  const rejectedSessions = [
    buildSessionPolicyRecord({
      scope: SessionScope.PORTAL_AUTH,
      portalUserId: 'portal-user-1',
      verifiedAt: new Date('2026-09-05T09:00:00.000Z'),
    }),
    buildSessionPolicyRecord({ revokedAt: new Date('2026-09-05T10:00:00.000Z') }),
    buildSessionPolicyRecord({ expiresAt: new Date('2026-09-05T11:59:59.000Z') }),
    buildSessionPolicyRecord({
      scope: SessionScope.ANONYMOUS_DRAFT,
      caseId: 'case-1',
    }),
    buildSessionPolicyRecord({ caseId: null }),
    buildSessionPolicyRecord({ portalUserId: 'portal-user-1' }),
  ];

  for (const session of rejectedSessions) {
    assert.equal(isChatAccessSession(session, now), false);
    assert.equal(isCaseStatusSession(session, now), false);
  }
});

test('status API gates active claim discovery on case access and forwards the lookup access level', () => {
  const source = readProjectFile('src/app/api/status/route.ts');
  const resolverIndex = source.indexOf('async function resolvePortalActivation(');
  const accessLevelGuardIndex = source.indexOf("if (input.accessLevel !== 'case_access') {", resolverIndex);
  const activeClaimLookupIndex = source.indexOf('getActivePortalClaimLinkForCase(prisma, {', resolverIndex);
  const activationCallIndex = source.indexOf('portalActivation: await resolvePortalActivation({');
  const activationCallEnd = source.indexOf('}),', activationCallIndex) + 3;
  const activationCallBlock = source.slice(activationCallIndex, activationCallEnd);
  const cookieGuardIndex = source.indexOf('if (result.cookieToken) {');
  const cookieWriteIndex = source.indexOf('response.cookies.set({', cookieGuardIndex);

  assert.notEqual(resolverIndex, -1);
  assert.notEqual(accessLevelGuardIndex, -1);
  assert.notEqual(activeClaimLookupIndex, -1);
  assert.ok(accessLevelGuardIndex < activeClaimLookupIndex);
  assert.ok(
    source
      .slice(accessLevelGuardIndex, activeClaimLookupIndex)
      .includes("return { state: 'unavailable' }")
  );
  assert.notEqual(activationCallIndex, -1);
  assert.ok(activationCallEnd > activationCallIndex + 3);
  assert.ok(activationCallBlock.includes('accessLevel: result.accessLevel'));
  assert.notEqual(cookieGuardIndex, -1);
  assert.notEqual(cookieWriteIndex, -1);
  assert.ok(cookieGuardIndex < cookieWriteIndex);
  assert.equal(source.includes('createPortalClaimLink'), false);
  assert.ok(source.includes('getActivePortalClaimLinkForCase'));
  assert.ok(source.includes('getPortalSessionContext'));
});

test('chat history loads one exact case or one unbound draft session without transitive discovery', () => {
  const source = readProjectFile('src/app/api/chat/messages/route.ts');
  const loaderIndex = source.indexOf('async function loadSessionMessages(');
  const getRouteIndex = source.indexOf('export async function GET(', loaderIndex);
  const loaderBlock = source.slice(loaderIndex, getRouteIndex);

  assert.notEqual(loaderIndex, -1);
  assert.notEqual(getRouteIndex, -1);
  assert.match(
    loaderBlock,
    /const where = caseId\s*\? \{ isCustomerVisible: true, caseId \}\s*: \{ isCustomerVisible: true, sessionId, caseId: null \};/
  );
  assert.equal((loaderBlock.match(/db\.message\.findMany\(/g) ?? []).length, 1);
  assert.equal(loaderBlock.includes('sessionRelatedCases'), false);
  assert.equal(loaderBlock.includes("distinct: ['caseId']"), false);
  assert.equal(loaderBlock.includes('caseId: { in:'), false);
  assert.equal(loaderBlock.includes('OR:'), false);
});

test('chat session resolver and POST touch activity without rewriting session scope', () => {
  const resolverSource = readProjectFile('src/lib/ai/chat-session.ts');
  const resolverUpdateIndex = resolverSource.indexOf('await prisma.session.update({');
  const resolverCreateIndex = resolverSource.indexOf('const session = await prisma.session.create({');
  const resolverUpdateBlock = resolverSource.slice(resolverUpdateIndex, resolverCreateIndex);
  const routeSource = readProjectFile('src/app/api/chat/messages/route.ts');
  const postIndex = routeSource.indexOf('export async function POST(');
  const postUpdateIndex = routeSource.indexOf('await tx.session.update({', postIndex);
  const postUpdateEnd = routeSource.indexOf('});', postUpdateIndex) + 3;
  const postUpdateBlock = routeSource.slice(postUpdateIndex, postUpdateEnd);

  assert.notEqual(resolverUpdateIndex, -1);
  assert.notEqual(resolverCreateIndex, -1);
  assert.ok(resolverSource.includes('if (isChatAccessSession(existingSession, now))'));
  assert.ok(resolverUpdateBlock.includes('data: { lastSeenAt: now }'));
  assert.equal(resolverUpdateBlock.includes('scope:'), false);
  assert.ok(resolverSource.includes('scope: SessionScope.ANONYMOUS_DRAFT'));
  assert.ok(resolverSource.includes('caseId: null'));

  assert.notEqual(postIndex, -1);
  assert.notEqual(postUpdateIndex, -1);
  assert.ok(postUpdateEnd > postUpdateIndex + 3);
  assert.ok(postUpdateBlock.includes('data: { lastSeenAt: now }'));
  assert.equal(postUpdateBlock.includes('scope:'), false);
});

test('public portal session state exposes only a private boolean response', () => {
  const source = readProjectFile('src/app/api/portal/session-state/route.ts');

  assert.ok(source.includes("{ authenticated }"));
  assert.ok(source.includes('verifyPortalSessionCookie'));
  assert.ok(source.includes('verifyPortalDemoCookie'));
  assert.ok(source.includes("'Cache-Control': 'private, no-store, max-age=0'"));
  assert.ok(source.includes("Vary: 'Cookie'"));
  assert.equal(source.includes('portalUserId'), false);
  assert.equal(source.includes('email:'), false);
  assert.equal(source.includes('contactValue'), false);
});

test('portal session presentation check does not refresh last-seen activity', () => {
  const source = readProjectFile('src/lib/portal/auth.ts');
  const verifierIndex = source.indexOf('export async function verifyPortalSessionCookie(');
  const contextIndex = source.indexOf('export async function getPortalSessionContext(');
  const verifierBlock = source.slice(verifierIndex, contextIndex);

  assert.notEqual(verifierIndex, -1);
  assert.notEqual(contextIndex, -1);
  assert.ok(verifierBlock.includes('{ touchLastSeen: false }'));
  assert.ok(source.includes('options: { touchLastSeen?: boolean } = {}'));
  assert.ok(source.includes('if (options.touchLastSeen !== false) {'));
});

test('public header resolves portal state after hydration without personalizing the homepage', () => {
  const headerSource = readProjectFile('src/components/layout/Header.tsx');
  const homeSource = readProjectFile('src/app/[locale]/page.tsx');

  assert.ok(headerSource.includes("fetch('/api/portal/session-state'"));
  assert.ok(headerSource.includes("cache: 'no-store'"));
  assert.ok(headerSource.includes("credentials: 'same-origin'"));
  assert.ok(headerSource.includes("payload.authenticated === true ? 'authenticated' : 'anonymous'"));
  assert.equal(homeSource.includes('hasPortalAccess'), false);
  assert.equal(homeSource.includes('portalAccess='), false);
  assert.equal(homeSource.includes('next/headers'), false);
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
