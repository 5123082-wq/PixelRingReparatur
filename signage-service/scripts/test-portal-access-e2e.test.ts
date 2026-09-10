/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { spawn, type ChildProcessByStdio } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { assertDbTestAllowed } from './db-test-guard.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

assertDbTestAllowed({ scriptName: 'test-portal-access-e2e' });

const PORT = Number(process.env.PORTAL_ACCESS_E2E_PORT ?? 3213);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const CASE_COOKIE = 'pixelring_case_session';
const PORTAL_COOKIE = 'pixelring_portal_session';
const RUN_ID = `${Date.now()}-${randomUUID().slice(0, 8)}`;
const USER_AGENT_PREFIX = `pixelring-portal-access-e2e/${RUN_ID}`;
const PASSWORD = 'PortalAccessE2E-Password-123!';
const ATTACHMENT_STORAGE_DIR = path.join(
  os.tmpdir(),
  `pixelring-portal-access-e2e-${RUN_ID}`
);

const ids = {
  cases: [] as string[],
  portalUsers: [] as string[],
};

const fixture: Record<string, any> = {};
let prisma: any = null;
let devServer: ChildProcessByStdio<null, Readable, Readable> | null = null;
let devServerLogTail = '';
let requestSequence = 10;

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function futureDate(hours = 2): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

function pastDate(hours = 2): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function nextRequestHeaders(input: {
  cookie?: string;
  json?: boolean;
  sameOrigin?: boolean;
  tag: string;
}): HeadersInit {
  requestSequence += 1;
  const headers: Record<string, string> = {
    'user-agent': `${USER_AGENT_PREFIX}/${input.tag}`,
    'x-forwarded-for': `198.51.100.${requestSequence}`,
  };

  if (input.cookie) headers.cookie = input.cookie;
  if (input.json) headers['content-type'] = 'application/json';
  if (input.sameOrigin) {
    headers.origin = BASE_URL;
    headers.referer = `${BASE_URL}/`;
    headers['sec-fetch-site'] = 'same-origin';
  }

  return headers;
}

function readCookie(response: Response, cookieName: string): string | null {
  const value = response.headers.get('set-cookie');
  if (!value) return null;

  return value.match(new RegExp(`${cookieName}=([^;]+)`))?.[1] ?? null;
}

async function readJson(response: Response): Promise<any> {
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

async function postJson(
  pathname: string,
  body: Record<string, unknown>,
  options: { cookie?: string; sameOrigin?: boolean; tag: string }
): Promise<{ response: Response; json: any }> {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    method: 'POST',
    headers: nextRequestHeaders({
      cookie: options.cookie,
      json: true,
      sameOrigin: options.sameOrigin,
      tag: options.tag,
    }),
    body: JSON.stringify(body),
  });

  return { response, json: await readJson(response) };
}

function startDevServer(): ChildProcessByStdio<null, Readable, Readable> {
  const child = spawn('npm', ['run', 'dev', '--', '--port', String(PORT)], {
    cwd: projectRoot,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      PORTAL_EMAIL_PROVIDER: '',
      SMTP_HOST: '',
      SMTP_PORT: '',
      SMTP_USER: '',
      SMTP_PASSWORD: '',
      SMTP_FROM: '',
      RESEND_API_KEY: '',
      OPENAI_API_KEY: '',
      BLOB_READ_WRITE_TOKEN: '',
      ATTACHMENT_STORAGE_DIR,
      ABLY_API_KEY: '',
      ABLY_REST_KEY: '',
      NEXT_PUBLIC_ABLY_KEY: '',
      TELEGRAM_BOT_TOKEN: '',
      TELEGRAM_ADMIN_CHAT_ID: '',
      TELEGRAM_CHAT_ID: '',
      PORTAL_DEMO_ENABLED: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => {
    devServerLogTail = `${devServerLogTail}${String(chunk)}`.slice(-12_000);
  });
  child.stderr.on('data', (chunk) => {
    devServerLogTail = `${devServerLogTail}${String(chunk)}`.slice(-12_000);
  });

  return child;
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServerReady(timeoutMs = 120_000): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (devServer && devServer.exitCode !== null) {
      throw new Error(
        `Dev server exited before readiness (code ${devServer.exitCode}). Logs:\n${devServerLogTail}`
      );
    }

    try {
      const response = await fetch(`${BASE_URL}/api/portal/session-state`, {
        headers: nextRequestHeaders({ tag: 'readiness' }),
      });
      if (response.status >= 100 && response.status < 600) return;
    } catch {
      // Keep polling until Next.js is ready.
    }

    await sleep(500);
  }

  throw new Error(
    `Dev server did not become ready within ${timeoutMs}ms. Logs:\n${devServerLogTail}`
  );
}

async function stopDevServer(): Promise<void> {
  if (!devServer || devServer.exitCode !== null) return;

  await new Promise<void>((resolve) => {
    if (!devServer) {
      resolve();
      return;
    }

    devServer.once('exit', () => resolve());
    devServer.kill('SIGTERM');
    setTimeout(() => {
      if (devServer && devServer.exitCode === null) devServer.kill('SIGKILL');
    }, 7_000);
  });
}

async function createSession(input: {
  rawToken: string;
  scope: 'ANONYMOUS_DRAFT' | 'CASE_ACCESS' | 'PORTAL_AUTH';
  caseId?: string | null;
  portalUserId?: string | null;
  verifiedAt?: Date | null;
  expiresAt?: Date;
  revokedAt?: Date | null;
  operatorTakeover?: boolean;
  tag: string;
}): Promise<any> {
  return prisma.session.create({
    data: {
      tokenHash: sha256(input.rawToken),
      scope: input.scope,
      caseId: input.caseId ?? null,
      portalUserId: input.portalUserId ?? null,
      contactMethod: input.portalUserId ? 'EMAIL' : null,
      contactValue: input.portalUserId ? fixture.portalEmail : null,
      verifiedAt: input.verifiedAt ?? null,
      lastSeenAt: pastDate(1),
      expiresAt: input.expiresAt ?? futureDate(),
      revokedAt: input.revokedAt ?? null,
      operatorTakeover: input.operatorTakeover ?? false,
      userAgent: `${USER_AGENT_PREFIX}/seed-${input.tag}`,
      ipAddress: '198.51.100.2',
    },
  });
}

async function seedFixtures(): Promise<void> {
  fixture.email = `customer-a-${RUN_ID}@pixelring.test`;
  fixture.phone = `+49 30 ${RUN_ID.replace(/\D/g, '').slice(-7).padStart(7, '0')}`;
  fixture.portalEmail = `portal-active-${RUN_ID}@pixelring.test`;
  fixture.disabledEmail = `portal-disabled-${RUN_ID}@pixelring.test`;
  fixture.claimEmail = `phone-owner-${RUN_ID}@pixelring.test`;
  fixture.caseAMarker = `PRIVATE-CASE-A-${RUN_ID}`;
  fixture.caseBMarker = `PRIVATE-CASE-B-${RUN_ID}`;
  fixture.draftMarker = `DRAFT-${RUN_ID}`;
  fixture.attachmentMarker = `attachment-${RUN_ID}.pdf`;
  fixture.portalWriteMarker = `PORTAL-WRITE-${RUN_ID}`;
  fixture.caseWriteMarker = 'case write boundary sentinel';
  fixture.replayWriteMarker = 'replay write boundary sentinel';
  fixture.legacyReplayWriteMarker = 'legacy status replay boundary sentinel';
  fixture.issuedRequestMarker = 'issued request original boundary sentinel';
  fixture.issuedWriteMarker = 'issued session write boundary sentinel';

  const numberSuffix = sha256(RUN_ID).slice(0, 8).toUpperCase();
  fixture.caseANumber = `PR-${numberSuffix.slice(0, 4)}-${numberSuffix.slice(4)}`;
  fixture.caseBNumber = `PR-${numberSuffix.slice(4)}-${numberSuffix.slice(0, 4)}`;

  const caseA = await prisma.case.create({
    data: {
      publicRequestNumber: fixture.caseANumber,
      status: 'UNDER_REVIEW',
      originChannel: 'WEBSITE_FORM',
      customerName: 'E2E Customer A',
      customerEmail: fixture.email,
      customerPhone: '+49 30 1000001',
      primaryContactMethod: 'EMAIL',
      primaryContactValue: fixture.email,
      locale: 'de',
      aiEnabled: false,
    },
  });
  const caseB = await prisma.case.create({
    data: {
      publicRequestNumber: fixture.caseBNumber,
      status: 'IN_PROGRESS',
      originChannel: 'TELEGRAM',
      customerName: 'E2E Customer B',
      customerEmail: null,
      customerPhone: fixture.phone,
      primaryContactMethod: 'PHONE',
      primaryContactValue: fixture.phone,
      locale: 'de',
      aiEnabled: false,
    },
  });
  ids.cases.push(caseA.id, caseB.id);
  fixture.caseAId = caseA.id;
  fixture.caseBId = caseB.id;

  fixture.strongAToken = `strong-a-${RUN_ID}`;
  fixture.strongBToken = `strong-b-${RUN_ID}`;
  fixture.legacyToken = `legacy-${RUN_ID}`;
  fixture.expiredToken = `expired-${RUN_ID}`;
  fixture.revokedToken = `revoked-${RUN_ID}`;

  fixture.strongASession = await createSession({
    rawToken: fixture.strongAToken,
    scope: 'CASE_ACCESS',
    caseId: caseA.id,
    operatorTakeover: true,
    tag: 'strong-a',
  });
  fixture.strongBSession = await createSession({
    rawToken: fixture.strongBToken,
    scope: 'CASE_ACCESS',
    caseId: caseB.id,
    operatorTakeover: true,
    tag: 'strong-b',
  });
  fixture.legacySession = await createSession({
    rawToken: fixture.legacyToken,
    scope: 'CASE_ACCESS',
    caseId: caseA.id,
    verifiedAt: pastDate(1),
    tag: 'legacy-status',
  });
  await createSession({
    rawToken: fixture.expiredToken,
    scope: 'CASE_ACCESS',
    caseId: caseA.id,
    expiresAt: pastDate(1),
    tag: 'expired-case',
  });
  await createSession({
    rawToken: fixture.revokedToken,
    scope: 'CASE_ACCESS',
    caseId: caseA.id,
    revokedAt: pastDate(1),
    tag: 'revoked-case',
  });

  const caseAMessage = await prisma.message.create({
    data: {
      caseId: caseA.id,
      sessionId: fixture.strongASession.id,
      channel: 'WEBSITE_CHAT',
      authorRole: 'CUSTOMER',
      body: fixture.caseAMarker,
      isCustomerVisible: true,
      sentAt: pastDate(1),
    },
  });
  await prisma.message.create({
    data: {
      caseId: caseB.id,
      sessionId: fixture.strongASession.id,
      channel: 'WEBSITE_CHAT',
      authorRole: 'CUSTOMER',
      body: fixture.caseBMarker,
      isCustomerVisible: true,
      sentAt: pastDate(1),
    },
  });
  await prisma.attachment.create({
    data: {
      caseId: caseA.id,
      messageId: caseAMessage.id,
      uploadedBySessionId: fixture.strongASession.id,
      kind: 'DOCUMENT',
      storageProvider: 'LOCAL',
      storageKey: `portal-access-e2e/${RUN_ID}`,
      originalFilename: fixture.attachmentMarker,
      mimeType: 'application/pdf',
      byteSize: 123,
      isCustomerVisible: true,
    },
  });
  await prisma.sessionIntakeDraft.create({
    data: {
      sessionId: fixture.strongASession.id,
      customerName: fixture.draftMarker,
      customerEmail: fixture.email,
      summary: fixture.draftMarker,
      locale: 'de',
    },
  });

  const activePortalUser = await prisma.portalUser.create({
    data: {
      primaryEmail: fixture.portalEmail,
      primaryEmailNormalized: fixture.portalEmail,
      status: 'ACTIVE',
    },
  });
  const disabledPortalUser = await prisma.portalUser.create({
    data: {
      primaryEmail: fixture.disabledEmail,
      primaryEmailNormalized: fixture.disabledEmail,
      status: 'DISABLED',
    },
  });
  ids.portalUsers.push(activePortalUser.id, disabledPortalUser.id);
  fixture.activePortalUserId = activePortalUser.id;
  fixture.disabledPortalUserId = disabledPortalUser.id;

  await prisma.portalCaseAccess.createMany({
    data: [
      {
        portalUserId: activePortalUser.id,
        caseId: caseA.id,
        source: 'ADMIN',
      },
      {
        portalUserId: activePortalUser.id,
        caseId: caseB.id,
        source: 'ADMIN',
        revokedAt: pastDate(1),
      },
      {
        portalUserId: disabledPortalUser.id,
        caseId: caseA.id,
        source: 'ADMIN',
      },
    ],
  });

  fixture.portalToken = `portal-${RUN_ID}`;
  fixture.disabledPortalToken = `portal-disabled-${RUN_ID}`;
  fixture.portalSession = await createSession({
    rawToken: fixture.portalToken,
    scope: 'PORTAL_AUTH',
    caseId: caseB.id,
    portalUserId: activePortalUser.id,
    verifiedAt: pastDate(1),
    tag: 'portal-active',
  });
  fixture.disabledPortalSession = await prisma.session.create({
    data: {
      tokenHash: sha256(fixture.disabledPortalToken),
      scope: 'PORTAL_AUTH',
      caseId: caseA.id,
      portalUserId: disabledPortalUser.id,
      contactMethod: 'EMAIL',
      contactValue: fixture.disabledEmail,
      verifiedAt: pastDate(1),
      lastSeenAt: pastDate(1),
      expiresAt: futureDate(),
      userAgent: `${USER_AGENT_PREFIX}/seed-portal-disabled`,
      ipAddress: '198.51.100.3',
    },
  });

  fixture.activeEmailClaimToken = `claim-email-${RUN_ID}`;
  fixture.activePhoneClaimToken = `claim-phone-${RUN_ID}`;
  fixture.portalGrantClaimToken = `claim-portal-grant-${RUN_ID}`;
  fixture.expiredClaimToken = `claim-expired-${RUN_ID}`;
  fixture.consumedClaimToken = `claim-consumed-${RUN_ID}`;
  fixture.revokedClaimToken = `claim-revoked-${RUN_ID}`;

  const claimRows = [
    {
      token: fixture.activeEmailClaimToken,
      caseId: caseA.id,
      prefillEmail: fixture.email,
      expiresAt: futureDate(),
    },
    {
      token: fixture.activePhoneClaimToken,
      caseId: caseB.id,
      prefillEmail: null,
      expiresAt: futureDate(),
    },
    {
      token: fixture.portalGrantClaimToken,
      caseId: caseB.id,
      prefillEmail: null,
      expiresAt: futureDate(),
    },
    {
      token: fixture.expiredClaimToken,
      caseId: caseA.id,
      prefillEmail: fixture.email,
      expiresAt: pastDate(1),
    },
    {
      token: fixture.consumedClaimToken,
      caseId: caseA.id,
      prefillEmail: fixture.email,
      expiresAt: futureDate(),
      consumedAt: pastDate(1),
    },
    {
      token: fixture.revokedClaimToken,
      caseId: caseA.id,
      prefillEmail: fixture.email,
      expiresAt: futureDate(),
      revokedAt: pastDate(1),
    },
  ];

  for (const claim of claimRows) {
    await prisma.portalClaimLink.create({
      data: {
        tokenHash: sha256(claim.token),
        caseId: claim.caseId,
        locale: 'de',
        prefillEmail: claim.prefillEmail,
        expiresAt: claim.expiresAt,
        consumedAt: claim.consumedAt ?? null,
        revokedAt: claim.revokedAt ?? null,
      },
    });
  }

  fixture.activeEmailClaimUrl = `${BASE_URL}/de/portal/claim?token=${encodeURIComponent(fixture.activeEmailClaimToken)}`;
  fixture.activePhoneClaimUrl = `${BASE_URL}/de/portal/claim?token=${encodeURIComponent(fixture.activePhoneClaimToken)}`;

  await prisma.message.createMany({
    data: [
      {
        caseId: caseA.id,
        channel: 'WEBSITE_CHAT',
        authorRole: 'SYSTEM',
        body: `Kundenportal vorbereiten\nAnfrage: ${fixture.caseANumber}\nLink: ${fixture.activeEmailClaimUrl}`,
        isCustomerVisible: true,
        sentAt: new Date(),
      },
      {
        caseId: caseB.id,
        channel: 'TELEGRAM',
        authorRole: 'SYSTEM',
        body: `Kundenportal vorbereiten\nAnfrage: ${fixture.caseBNumber}\nLink: ${fixture.activePhoneClaimUrl}`,
        isCustomerVisible: true,
        sentAt: new Date(),
      },
    ],
  });
}

async function cleanupFixtures(): Promise<void> {
  if (!prisma) return;

  const sessions = await prisma.session.findMany({
    where: { userAgent: { startsWith: USER_AGENT_PREFIX } },
    select: { id: true },
  });
  const sessionIds = sessions.map((session: { id: string }) => session.id);

  if (sessionIds.length > 0) {
    await prisma.attachment.deleteMany({
      where: { uploadedBySessionId: { in: sessionIds } },
    });
    await prisma.message.deleteMany({
      where: { sessionId: { in: sessionIds } },
    });
    await prisma.session.deleteMany({
      where: { id: { in: sessionIds } },
    });
  }

  await prisma.portalUser.deleteMany({
    where: {
      OR: [
        ...(ids.portalUsers.length > 0 ? [{ id: { in: ids.portalUsers } }] : []),
        { primaryEmailNormalized: { contains: RUN_ID } },
      ],
    },
  });

  if (ids.cases.length > 0) {
    await prisma.case.deleteMany({
      where: { id: { in: ids.cases } },
    });
  }

  await fs.rm(ATTACHMENT_STORAGE_DIR, { recursive: true, force: true });
}

before(async () => {
  const prismaModule = await import('../src/lib/prisma.ts');
  prisma = prismaModule.prisma;
  await seedFixtures();
  devServer = startDevServer();
  await waitForServerReady();
});

after(async () => {
  await stopDevServer();
  await cleanupFixtures();
  if (prisma) await prisma.$disconnect().catch(() => {});
});

test('S-01/S-02 access boundaries hold through real HTTP routes', { timeout: 180_000 }, async () => {
  const countsBeforeStatus = {
    sessions: await prisma.session.count(),
    users: await prisma.portalUser.count(),
    grants: await prisma.portalCaseAccess.count(),
  };

  for (const [requestNumber, contact, tag] of [
    [fixture.caseANumber, fixture.email.toUpperCase(), 'status-email'],
    [fixture.caseBNumber, fixture.phone.replace(/ /g, '-'), 'status-phone'],
  ] as const) {
    const { response, json } = await postJson(
      '/api/status',
      { requestNumber, contact },
      { tag }
    );
    assert.equal(response.status, 200, JSON.stringify(json));
    assert.equal(json.verified, true);
    assert.equal(json.accessLevel, 'status_only');
    assert.equal(json.portalActivation?.state, 'unavailable');
    assert.equal(readCookie(response, CASE_COOKIE), null);
    assert.deepEqual(
      Object.keys(json.case).sort(),
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
    const serialized = JSON.stringify(json);
    for (const privateMarker of [
      fixture.caseAMarker,
      fixture.caseBMarker,
      fixture.draftMarker,
      fixture.attachmentMarker,
      fixture.activeEmailClaimToken,
      fixture.activePhoneClaimToken,
    ]) {
      assert.equal(serialized.includes(privateMarker), false);
    }
  }

  assert.deepEqual(
    {
      sessions: await prisma.session.count(),
      users: await prisma.portalUser.count(),
      grants: await prisma.portalCaseAccess.count(),
    },
    countsBeforeStatus
  );

  const wrongStatus = await postJson(
    '/api/status',
    { requestNumber: fixture.caseANumber, contact: `wrong-${RUN_ID}@pixelring.test` },
    { tag: 'status-wrong-contact' }
  );
  assert.equal(wrongStatus.response.status, 401);
  assert.equal(wrongStatus.json.verified, false);
  assert.equal(readCookie(wrongStatus.response, CASE_COOKIE), null);

  const legacyStatus = await postJson(
    '/api/status',
    { requestNumber: fixture.caseANumber },
    { cookie: `${CASE_COOKIE}=${fixture.legacyToken}`, tag: 'legacy-status' }
  );
  assert.equal(legacyStatus.response.status, 200, JSON.stringify(legacyStatus.json));
  assert.equal(legacyStatus.json.accessLevel, 'status_only');
  assert.equal(legacyStatus.json.portalActivation?.state, 'unavailable');
  assert.equal(JSON.stringify(legacyStatus.json).includes(fixture.activeEmailClaimToken), false);

  const legacyBeforeReplay = await prisma.session.findUnique({
    where: { id: fixture.legacySession.id },
  });
  const legacyHistoryResponse = await fetch(`${BASE_URL}/api/chat/messages?locale=de`, {
    headers: nextRequestHeaders({
      cookie: `${CASE_COOKIE}=${fixture.legacyToken}`,
      tag: 'legacy-chat-get',
    }),
  });
  const legacyHistory = await readJson(legacyHistoryResponse);
  assert.equal(legacyHistoryResponse.status, 200, JSON.stringify(legacyHistory));
  assert.ok(readCookie(legacyHistoryResponse, CASE_COOKIE));
  const legacyHistoryText = JSON.stringify(legacyHistory);
  assert.equal(legacyHistoryText.includes(fixture.caseAMarker), false);
  assert.equal(legacyHistoryText.includes(fixture.draftMarker), false);
  assert.equal(legacyHistoryText.includes(fixture.attachmentMarker), false);

  const legacyMessagePost = await postJson(
    '/api/chat/messages',
    { message: fixture.legacyReplayWriteMarker, locale: 'de' },
    { cookie: `${CASE_COOKIE}=${fixture.legacyToken}`, tag: 'legacy-chat-post' }
  );
  assert.equal(
    legacyMessagePost.response.status,
    200,
    JSON.stringify(legacyMessagePost.json)
  );
  assert.ok(readCookie(legacyMessagePost.response, CASE_COOKIE));
  const legacyReplayMessage = await prisma.message.findFirst({
    where: { body: fixture.legacyReplayWriteMarker },
    orderBy: { createdAt: 'desc' },
  });
  assert.ok(legacyReplayMessage);
  assert.equal(legacyReplayMessage.caseId, null);
  assert.notEqual(legacyReplayMessage.sessionId, fixture.legacySession.id);
  assert.equal(
    await prisma.message.count({
      where: { caseId: fixture.caseAId, body: fixture.legacyReplayWriteMarker },
    }),
    0
  );

  const legacyDraftForm = new FormData();
  legacyDraftForm.set('name', `Replay ${RUN_ID}`);
  legacyDraftForm.set('summary', fixture.replayWriteMarker);
  legacyDraftForm.set('locale', 'de');
  const legacyDraftResponse = await fetch(`${BASE_URL}/api/chat/intake-draft`, {
    method: 'POST',
    headers: nextRequestHeaders({
      cookie: `${CASE_COOKIE}=${fixture.legacyToken}`,
      tag: 'legacy-draft-post',
    }),
    body: legacyDraftForm,
  });
  assert.equal(legacyDraftResponse.status, 200, await legacyDraftResponse.text());
  const victimDraft = await prisma.sessionIntakeDraft.findUnique({
    where: { sessionId: fixture.strongASession.id },
  });
  assert.equal(victimDraft?.summary, fixture.draftMarker);

  const legacyAfterReplay = await prisma.session.findUnique({
    where: { id: fixture.legacySession.id },
  });
  assert.deepEqual(legacyAfterReplay, legacyBeforeReplay);

  const portalBeforeReplay = await prisma.session.findUnique({
    where: { id: fixture.portalSession.id },
  });
  const portalReplayGetResponse = await fetch(`${BASE_URL}/api/chat/messages?locale=de`, {
    headers: nextRequestHeaders({
      cookie: `${CASE_COOKIE}=${fixture.portalToken}`,
      tag: 'portal-chat-get',
    }),
  });
  const portalReplayGet = await readJson(portalReplayGetResponse);
  assert.equal(portalReplayGetResponse.status, 200, JSON.stringify(portalReplayGet));
  assert.ok(readCookie(portalReplayGetResponse, CASE_COOKIE));
  const portalReplayText = JSON.stringify(portalReplayGet);
  assert.equal(portalReplayText.includes(fixture.caseBMarker), false);
  assert.equal(portalReplayText.includes(fixture.draftMarker), false);
  assert.equal(portalReplayText.includes(fixture.attachmentMarker), false);

  const portalReplayPost = await postJson(
    '/api/chat/messages',
    { message: fixture.replayWriteMarker, locale: 'de' },
    { cookie: `${CASE_COOKIE}=${fixture.portalToken}`, tag: 'portal-chat-post' }
  );
  assert.equal(portalReplayPost.response.status, 200, JSON.stringify(portalReplayPost.json));
  const replayMessage = await prisma.message.findFirst({
    where: { body: fixture.replayWriteMarker },
    orderBy: { createdAt: 'desc' },
  });
  assert.ok(replayMessage);
  assert.equal(replayMessage.caseId, null);
  assert.notEqual(replayMessage.sessionId, fixture.portalSession.id);
  assert.equal(
    await prisma.message.count({
      where: { caseId: fixture.caseBId, body: fixture.replayWriteMarker },
    }),
    0
  );
  const portalAfterReplay = await prisma.session.findUnique({
    where: { id: fixture.portalSession.id },
  });
  assert.deepEqual(portalAfterReplay, portalBeforeReplay);

  const strongStatus = await postJson(
    '/api/status',
    { requestNumber: fixture.caseANumber },
    { cookie: `${CASE_COOKIE}=${fixture.strongAToken}`, tag: 'strong-status' }
  );
  assert.equal(strongStatus.response.status, 200, JSON.stringify(strongStatus.json));
  assert.equal(strongStatus.json.accessLevel, 'case_access');
  assert.equal(strongStatus.json.portalActivation?.state, 'active_claim');
  assert.equal(strongStatus.json.portalActivation?.claimUrl, fixture.activeEmailClaimUrl);

  const mismatchedStrongStatus = await postJson(
    '/api/status',
    { requestNumber: fixture.caseBNumber },
    { cookie: `${CASE_COOKIE}=${fixture.strongAToken}`, tag: 'strong-status-mismatch' }
  );
  assert.equal(mismatchedStrongStatus.response.status, 401);

  const strongHistoryResponse = await fetch(`${BASE_URL}/api/chat/messages?locale=de`, {
    headers: nextRequestHeaders({
      cookie: `${CASE_COOKIE}=${fixture.strongAToken}`,
      tag: 'strong-chat-get',
    }),
  });
  const strongHistory = await readJson(strongHistoryResponse);
  assert.equal(strongHistoryResponse.status, 200, JSON.stringify(strongHistory));
  const strongHistoryText = JSON.stringify(strongHistory);
  assert.equal(strongHistoryText.includes(fixture.caseAMarker), true);
  assert.equal(strongHistoryText.includes(fixture.attachmentMarker), true);
  assert.equal(strongHistoryText.includes(fixture.caseBMarker), false);

  const strongWrite = await postJson(
    '/api/chat/messages',
    { message: fixture.caseWriteMarker, locale: 'de' },
    { cookie: `${CASE_COOKIE}=${fixture.strongAToken}`, tag: 'strong-chat-post' }
  );
  assert.equal(strongWrite.response.status, 200, JSON.stringify(strongWrite.json));
  const strongWrittenMessage = await prisma.message.findFirst({
    where: { body: fixture.caseWriteMarker },
  });
  assert.equal(strongWrittenMessage?.caseId, fixture.caseAId);
  assert.equal(strongWrittenMessage?.sessionId, fixture.strongASession.id);
  const strongAfterWrite = await prisma.session.findUnique({
    where: { id: fixture.strongASession.id },
  });
  assert.equal(strongAfterWrite.scope, 'CASE_ACCESS');
  assert.equal(strongAfterWrite.verifiedAt, null);

  for (const [token, tag] of [
    [fixture.expiredToken, 'expired-case-chat'],
    [fixture.revokedToken, 'revoked-case-chat'],
  ] as const) {
    const response = await fetch(`${BASE_URL}/api/chat/messages?locale=de`, {
      headers: nextRequestHeaders({
        cookie: `${CASE_COOKIE}=${token}`,
        tag,
      }),
    });
    const json = await readJson(response);
    assert.equal(response.status, 200, JSON.stringify(json));
    assert.ok(readCookie(response, CASE_COOKIE));
    assert.equal(JSON.stringify(json).includes(fixture.caseAMarker), false);
  }

  const issuedEmail = `issued-${RUN_ID}@pixelring.test`;
  const issuedRequestForm = new FormData();
  issuedRequestForm.set('name', 'E2E Issued Customer');
  issuedRequestForm.set('contact', issuedEmail);
  issuedRequestForm.set('email', issuedEmail);
  issuedRequestForm.set('message', fixture.issuedRequestMarker);
  const issuedRequestResponse = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: nextRequestHeaders({ tag: 'issued-request' }),
    body: issuedRequestForm,
  });
  const issuedRequest = await readJson(issuedRequestResponse);
  assert.equal(issuedRequestResponse.status, 200, JSON.stringify(issuedRequest));
  assert.equal(issuedRequest.success, true);
  const issuedCaseToken = readCookie(issuedRequestResponse, CASE_COOKIE);
  assert.ok(issuedCaseToken);

  const issuedCase = await prisma.case.findUnique({
    where: { publicRequestNumber: issuedRequest.publicRequestNumber },
  });
  assert.ok(issuedCase);
  ids.cases.push(issuedCase.id);
  const issuedSession = await prisma.session.findUnique({
    where: { tokenHash: sha256(issuedCaseToken) },
  });
  assert.ok(issuedSession);
  assert.equal(issuedSession.scope, 'CASE_ACCESS');
  assert.equal(issuedSession.caseId, issuedCase.id);
  assert.equal(issuedSession.portalUserId, null);
  assert.equal(issuedSession.verifiedAt, null);

  const issuedStatus = await postJson(
    '/api/status',
    { requestNumber: issuedRequest.publicRequestNumber },
    { cookie: `${CASE_COOKIE}=${issuedCaseToken}`, tag: 'issued-status' }
  );
  assert.equal(issuedStatus.response.status, 200, JSON.stringify(issuedStatus.json));
  assert.equal(issuedStatus.json.accessLevel, 'case_access');

  const issuedHistoryResponse = await fetch(`${BASE_URL}/api/chat/messages?locale=de`, {
    headers: nextRequestHeaders({
      cookie: `${CASE_COOKIE}=${issuedCaseToken}`,
      tag: 'issued-chat-get',
    }),
  });
  const issuedHistory = await readJson(issuedHistoryResponse);
  assert.equal(issuedHistoryResponse.status, 200, JSON.stringify(issuedHistory));
  assert.equal(JSON.stringify(issuedHistory).includes(fixture.issuedRequestMarker), true);

  await prisma.session.update({
    where: { id: issuedSession.id },
    data: { operatorTakeover: true },
  });
  const issuedWrite = await postJson(
    '/api/chat/messages',
    { message: fixture.issuedWriteMarker, locale: 'de' },
    { cookie: `${CASE_COOKIE}=${issuedCaseToken}`, tag: 'issued-chat-post' }
  );
  assert.equal(issuedWrite.response.status, 200, JSON.stringify(issuedWrite.json));
  assert.equal(
    await prisma.message.count({
      where: {
        caseId: issuedCase.id,
        sessionId: issuedSession.id,
        body: fixture.issuedWriteMarker,
      },
    }),
    1
  );

  const portalDashboardResponse = await fetch(`${BASE_URL}/de/portal`, {
    headers: nextRequestHeaders({
      cookie: `${PORTAL_COOKIE}=${fixture.portalToken}`,
      tag: 'portal-dashboard-grants',
    }),
  });
  const portalDashboardHtml = await portalDashboardResponse.text();
  assert.equal(portalDashboardResponse.status, 200, portalDashboardHtml.slice(0, 500));
  assert.equal(portalDashboardHtml.includes(fixture.caseANumber), true);
  assert.equal(portalDashboardHtml.includes(fixture.caseBMarker), false);

  const allowedDetailResponse = await fetch(
    `${BASE_URL}/de/portal/requests/${encodeURIComponent(fixture.caseANumber)}`,
    {
      headers: nextRequestHeaders({
        cookie: `${PORTAL_COOKIE}=${fixture.portalToken}`,
        tag: 'portal-allowed-detail',
      }),
    }
  );
  const allowedDetailHtml = await allowedDetailResponse.text();
  assert.equal(allowedDetailResponse.status, 200, allowedDetailHtml.slice(0, 500));
  assert.equal(allowedDetailHtml.includes(fixture.caseAMarker), true);
  assert.equal(allowedDetailHtml.includes(fixture.attachmentMarker), true);
  assert.equal(allowedDetailHtml.includes(fixture.caseBMarker), false);

  const revokedDetailResponse = await fetch(
    `${BASE_URL}/de/portal/requests/${encodeURIComponent(fixture.caseBNumber)}`,
    {
      headers: nextRequestHeaders({
        cookie: `${PORTAL_COOKIE}=${fixture.portalToken}`,
        tag: 'portal-revoked-detail',
      }),
    }
  );
  const revokedDetailHtml = await revokedDetailResponse.text();
  assert.equal(revokedDetailResponse.status, 200, revokedDetailHtml.slice(0, 500));
  assert.equal(revokedDetailHtml.includes(fixture.caseBMarker), false);

  const portalDenied = await postJson(
    `/api/portal/requests/${encodeURIComponent(fixture.caseBNumber)}/messages`,
    { body: `DENIED-${RUN_ID}` },
    {
      cookie: `${PORTAL_COOKIE}=${fixture.portalToken}`,
      sameOrigin: true,
      tag: 'portal-revoked-grant',
    }
  );
  assert.equal(portalDenied.response.status, 404, JSON.stringify(portalDenied.json));
  assert.equal(
    await prisma.message.count({ where: { caseId: fixture.caseBId, body: `DENIED-${RUN_ID}` } }),
    0
  );

  const portalAllowed = await postJson(
    `/api/portal/requests/${encodeURIComponent(fixture.caseANumber)}/messages`,
    { body: fixture.portalWriteMarker },
    {
      cookie: `${PORTAL_COOKIE}=${fixture.portalToken}`,
      sameOrigin: true,
      tag: 'portal-active-grant',
    }
  );
  assert.equal(portalAllowed.response.status, 200, JSON.stringify(portalAllowed.json));
  assert.equal(
    await prisma.message.count({
      where: {
        caseId: fixture.caseAId,
        sessionId: fixture.portalSession.id,
        body: fixture.portalWriteMarker,
      },
    }),
    1
  );

  const portalGrant = await postJson(
    '/api/portal/claim/grant-access',
    { token: fixture.portalGrantClaimToken },
    {
      cookie: `${PORTAL_COOKIE}=${fixture.portalToken}`,
      tag: 'portal-valid-grant-access',
    }
  );
  assert.equal(portalGrant.response.status, 200, JSON.stringify(portalGrant.json));
  assert.equal(portalGrant.json.success, true);
  assert.equal(
    await prisma.portalCaseAccess.count({
      where: {
        portalUserId: fixture.activePortalUserId,
        caseId: fixture.caseBId,
        revokedAt: null,
      },
    }),
    1
  );

  const disabledStateResponse = await fetch(`${BASE_URL}/api/portal/session-state`, {
    headers: nextRequestHeaders({
      cookie: `${PORTAL_COOKIE}=${fixture.disabledPortalToken}`,
      tag: 'disabled-session-state',
    }),
  });
  assert.equal(disabledStateResponse.status, 200);
  assert.deepEqual(await readJson(disabledStateResponse), { authenticated: false });

  const disabledPortalWrite = await postJson(
    `/api/portal/requests/${encodeURIComponent(fixture.caseANumber)}/messages`,
    { body: `DISABLED-${RUN_ID}` },
    {
      cookie: `${PORTAL_COOKIE}=${fixture.disabledPortalToken}`,
      sameOrigin: true,
      tag: 'disabled-portal-write',
    }
  );
  assert.equal(disabledPortalWrite.response.status, 401);
  assert.equal(
    await prisma.message.count({ where: { caseId: fixture.caseAId, body: `DISABLED-${RUN_ID}` } }),
    0
  );

  const disabledSessionBeforeReplay = await prisma.session.findUnique({
    where: { id: fixture.disabledPortalSession.id },
  });
  const disabledReplayResponse = await fetch(`${BASE_URL}/api/chat/messages?locale=de`, {
    headers: nextRequestHeaders({
      cookie: `${CASE_COOKIE}=${fixture.disabledPortalToken}`,
      tag: 'disabled-portal-chat-replay',
    }),
  });
  const disabledReplay = await readJson(disabledReplayResponse);
  assert.equal(disabledReplayResponse.status, 200, JSON.stringify(disabledReplay));
  assert.ok(readCookie(disabledReplayResponse, CASE_COOKIE));
  assert.equal(disabledReplay.operatorTakeover, false);
  assert.equal(JSON.stringify(disabledReplay).includes(fixture.caseAMarker), false);
  assert.deepEqual(
    await prisma.session.findUnique({ where: { id: fixture.disabledPortalSession.id } }),
    disabledSessionBeforeReplay
  );

  const invalidClaimCodeCount = await prisma.portalEmailCode.count();
  for (const [token, email, tag] of [
    [fixture.activeEmailClaimToken, `wrong-${RUN_ID}@pixelring.test`, 'claim-wrong-email'],
    [fixture.expiredClaimToken, fixture.email, 'claim-expired'],
    [fixture.consumedClaimToken, fixture.email, 'claim-consumed'],
    [fixture.revokedClaimToken, fixture.email, 'claim-revoked'],
  ] as const) {
    const attempt = await postJson(
      '/api/portal/claim/start-verification',
      { token, email },
      { tag }
    );
    assert.equal(attempt.response.status, 400, JSON.stringify(attempt.json));
  }
  assert.equal(await prisma.portalEmailCode.count(), invalidClaimCodeCount);

  const phoneStatus = await postJson(
    '/api/status',
    { requestNumber: fixture.caseBNumber },
    { cookie: `${CASE_COOKIE}=${fixture.strongBToken}`, tag: 'phone-strong-status' }
  );
  assert.equal(phoneStatus.response.status, 200, JSON.stringify(phoneStatus.json));
  assert.equal(phoneStatus.json.accessLevel, 'case_access');
  assert.equal(phoneStatus.json.portalActivation?.claimUrl, fixture.activePhoneClaimUrl);

  const claimStart = await postJson(
    '/api/portal/claim/start-verification',
    { token: fixture.activePhoneClaimToken, email: fixture.claimEmail },
    { tag: 'claim-valid-start' }
  );
  assert.equal(claimStart.response.status, 200, JSON.stringify(claimStart.json));
  assert.equal(claimStart.json.success, true);
  assert.equal(claimStart.json.sent, false);
  assert.match(claimStart.json.devCode, /^\d{6}$/);

  const claimVerify = await postJson(
    '/api/portal/claim/verify-code',
    { email: fixture.claimEmail, code: claimStart.json.devCode },
    { tag: 'claim-valid-verify' }
  );
  assert.equal(claimVerify.response.status, 200, JSON.stringify(claimVerify.json));
  assert.equal(claimVerify.json.success, true);
  assert.ok(claimVerify.json.verificationToken);

  const claimComplete = await postJson(
    '/api/portal/claim/set-password',
    {
      verificationToken: claimVerify.json.verificationToken,
      password: PASSWORD,
      passwordRepeat: PASSWORD,
    },
    { tag: 'claim-valid-complete' }
  );
  assert.equal(claimComplete.response.status, 200, JSON.stringify(claimComplete.json));
  assert.equal(claimComplete.json.success, true);
  assert.ok(readCookie(claimComplete.response, PORTAL_COOKIE));

  const claimedUser = await prisma.portalUser.findUnique({
    where: { primaryEmailNormalized: fixture.claimEmail },
  });
  assert.equal(claimedUser?.status, 'ACTIVE');
  if (claimedUser) ids.portalUsers.push(claimedUser.id);
  assert.equal(
    await prisma.portalCaseAccess.count({
      where: {
        portalUserId: claimedUser?.id,
        caseId: fixture.caseBId,
        revokedAt: null,
      },
    }),
    1
  );
  const consumedPhoneClaim = await prisma.portalClaimLink.findUnique({
    where: { tokenHash: sha256(fixture.activePhoneClaimToken) },
  });
  assert.ok(consumedPhoneClaim?.consumedAt);
});
