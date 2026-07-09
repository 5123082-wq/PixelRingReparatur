/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessByStdio } from 'node:child_process';
import type { Readable } from 'node:stream';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

import { hashAdminPassword } from '../src/lib/admin-password.ts';
import { assertDbTestAllowed } from './db-test-guard.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env.local'), quiet: true });
dotenv.config({ path: path.join(projectRoot, '.env'), quiet: true });
assertDbTestAllowed({ scriptName: 'test-admin-e2e-smoke' });

const PORT = Number(process.env.ADMIN_E2E_SMOKE_PORT ?? 3212);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const CSRF_HEADER_NAME = 'x-pixelring-admin-csrf';
const CSRF_HEADER_VALUE = '1';
const CMS_SESSION_COOKIE = 'pixelring_cms_session';
const OWNER_PASSWORD = 'Stage2E2ESmokePass123!';
const DEFAULT_CMS_MEDIA_MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MIN_CMS_MEDIA_MAX_UPLOAD_BYTES = 1 * 1024 * 1024;
const ABSOLUTE_CMS_MEDIA_MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const ONE_PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+XgncAAAAASUVORK5CYII=',
  'base64'
);

let prisma: any = null;
let ownerUserId: string | null = null;
let ownerEmail: string | null = null;
const createdArticleIds = new Set<string>();
const createdMediaIds = new Set<string>();
let devServer: ChildProcessByStdio<null, Readable, Readable> | null = null;
let devServerLogTail = '';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readCookie(setCookieHeader: string | null, cookieName: string): string | null {
  if (!setCookieHeader) return null;
  const regex = new RegExp(`${cookieName}=([^;]+)`);
  const match = setCookieHeader.match(regex);
  return match?.[1] ?? null;
}

function requestHeaders(options?: {
  includeCsrf?: boolean;
  includeJson?: boolean;
  cookie?: string | null;
}): HeadersInit {
  const headers: Record<string, string> = {};

  if (options?.includeCsrf) {
    headers[CSRF_HEADER_NAME] = CSRF_HEADER_VALUE;
    headers.origin = BASE_URL;
    headers.referer = `${BASE_URL}/`;
    headers['sec-fetch-site'] = 'same-origin';
  }

  if (options?.includeJson) {
    headers['content-type'] = 'application/json';
  }

  if (options?.cookie) {
    headers.cookie = `${CMS_SESSION_COOKIE}=${options.cookie}`;
  }

  return headers;
}

function resolveCmsMediaMaxUploadBytesForTest(): number {
  const configured = Number(process.env.CMS_MEDIA_MAX_UPLOAD_BYTES);

  if (
    Number.isFinite(configured) &&
    Number.isInteger(configured) &&
    configured >= MIN_CMS_MEDIA_MAX_UPLOAD_BYTES &&
    configured <= ABSOLUTE_CMS_MEDIA_MAX_UPLOAD_BYTES
  ) {
    return configured;
  }

  return DEFAULT_CMS_MEDIA_MAX_UPLOAD_BYTES;
}

function createCmsMediaUploadFormData(input: {
  file: File;
  usageType?: string;
  locale?: string;
  checksumSha256?: string;
}): FormData {
  const formData = new FormData();
  formData.set('file', input.file);
  formData.set('usageType', input.usageType ?? 'ARTICLE');
  formData.set('locale', input.locale ?? 'de');

  if (input.checksumSha256) {
    formData.set('checksumSha256', input.checksumSha256);
  }

  return formData;
}

async function readJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
}

function startDevServer(): ChildProcessByStdio<null, Readable, Readable> {
  const child = spawn('npm', ['run', 'dev', '--', '--port', String(PORT)], {
    cwd: projectRoot,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => {
    devServerLogTail = `${devServerLogTail}${String(chunk)}`.slice(-8000);
  });
  child.stderr.on('data', (chunk) => {
    devServerLogTail = `${devServerLogTail}${String(chunk)}`.slice(-8000);
  });

  return child;
}

async function waitForServerReady(timeoutMs = 120_000): Promise<void> {
  const startedAt = Date.now();
  const healthUrl = `${BASE_URL}/api/cms/verify`;

  while (Date.now() - startedAt < timeoutMs) {
    if (devServer && devServer.exitCode !== null) {
      throw new Error(
        `Dev server exited before readiness (code ${devServer.exitCode}). Logs:\n${devServerLogTail}`
      );
    }

    try {
      const response = await fetch(healthUrl);
      if (response.status >= 100 && response.status < 600) {
        return;
      }
    } catch {
      // keep polling
    }

    await sleep(500);
  }

  throw new Error(
    `Dev server did not become ready within ${timeoutMs}ms on ${BASE_URL}. Logs:\n${devServerLogTail}`
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
      if (devServer && devServer.exitCode === null) {
        devServer.kill('SIGKILL');
      }
    }, 7_000);
  });
}

async function cleanupCreatedData(): Promise<void> {
  if (!prisma) return;

  for (const articleId of createdArticleIds) {
    await prisma.cmsArticle
      .updateMany({
        where: { id: articleId },
        data: { deletedAt: new Date() },
      })
      .catch(() => {});
  }

  for (const mediaId of createdMediaIds) {
    await prisma.cmsMedia
      .updateMany({
        where: { id: mediaId },
        data: { deletedAt: new Date() },
      })
      .catch(() => {});
  }

  if (ownerUserId) {
    await prisma.adminUser
      .delete({
        where: { id: ownerUserId },
      })
      .catch(() => {});
  }
}

before(async () => {
  const prismaModule = await import('../src/lib/prisma.ts');
  prisma = prismaModule.prisma;

  ownerEmail = `stage2-e2e-owner-${Date.now()}@pixelring.test`;
  const passwordHash = await hashAdminPassword(OWNER_PASSWORD);

  const owner = await prisma.adminUser.create({
    data: {
      email: ownerEmail,
      displayName: 'Stage2 E2E Owner',
      passwordHash,
      role: 'OWNER',
      status: 'ACTIVE',
    },
    select: { id: true },
  });
  ownerUserId = owner.id;
});

after(async () => {
  await stopDevServer();
  await cleanupCreatedData();
  if (prisma) {
    await prisma.$disconnect().catch(() => {});
  }
});

test('api smoke: login -> locale-switch create-path -> publish/unpublish -> restore -> re-publish -> media delete blocked', async () => {
  assert.ok(ownerEmail, 'Missing owner test email');

  devServer = startDevServer();
  await waitForServerReady();

  const loginResponse = await fetch(`${BASE_URL}/api/cms/auth`, {
    method: 'POST',
    headers: requestHeaders({ includeCsrf: true, includeJson: true }),
    body: JSON.stringify({
      email: ownerEmail,
      password: OWNER_PASSWORD,
    }),
  });
  const loginBody = await readJson(loginResponse);
  assert.equal(loginResponse.status, 200, `CMS login failed: ${JSON.stringify(loginBody)}`);

  const cmsCookie = readCookie(loginResponse.headers.get('set-cookie'), CMS_SESSION_COOKIE);
  assert.ok(cmsCookie, 'CMS session cookie missing after login');

  const verifyResponse = await fetch(`${BASE_URL}/api/cms/verify`, {
    headers: requestHeaders({ cookie: cmsCookie }),
  });
  const verifyBody = await readJson(verifyResponse);
  assert.equal(verifyResponse.status, 200, `CMS verify failed: ${JSON.stringify(verifyBody)}`);
  assert.equal(verifyBody?.authenticated, true);

  const slug = `stage2-e2e-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const createResponse = await fetch(`${BASE_URL}/api/cms/articles`, {
    method: 'POST',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({
      locale: 'de',
      type: 'SYMPTOM',
      status: 'DRAFT',
      slug,
      title: 'Stage2 E2E Smoke Article',
      symptomLabel: 'Stage2 E2E Symptom',
      shortAnswer: 'Initial short answer',
      content: 'Initial draft content',
      sortOrder: 0,
    }),
  });
  const createBody = await readJson(createResponse);
  assert.equal(createResponse.status, 201, `Article create failed: ${JSON.stringify(createBody)}`);

  const articleId = createBody?.article?.id as string | undefined;
  assert.ok(articleId, 'Article id missing after create');
  createdArticleIds.add(articleId);

  const editDraftResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}`, {
    method: 'PATCH',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({
      title: 'Stage2 E2E Smoke Article (edited)',
      content: 'Edited draft content',
      status: 'DRAFT',
    }),
  });
  const editDraftBody = await readJson(editDraftResponse);
  assert.equal(
    editDraftResponse.status,
    200,
    `Article draft edit failed: ${JSON.stringify(editDraftBody)}`
  );
  assert.equal(editDraftBody?.article?.status, 'DRAFT');

  const sourceTitleAfterEdit = String(editDraftBody?.article?.title ?? '');
  const sourceContentAfterEdit = String(editDraftBody?.article?.content ?? '');

  const localeSwitchCreateResponse = await fetch(`${BASE_URL}/api/cms/articles`, {
    method: 'POST',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({
      locale: 'en',
      type: 'SYMPTOM',
      status: 'DRAFT',
      slug,
      title: 'Stage2 E2E Smoke Article (EN translation)',
      symptomLabel: 'Stage2 E2E EN Symptom',
      shortAnswer: 'EN translation short answer',
      content: 'EN translation draft content',
      sortOrder: 0,
    }),
  });
  const localeSwitchCreateBody = await readJson(localeSwitchCreateResponse);
  assert.equal(
    localeSwitchCreateResponse.status,
    201,
    `Locale switch create-path failed: ${JSON.stringify(localeSwitchCreateBody)}`
  );

  const translatedArticleId = localeSwitchCreateBody?.article?.id as string | undefined;
  assert.ok(translatedArticleId, 'Translated locale article id missing after create-path');
  assert.notEqual(translatedArticleId, articleId, 'Locale-switch save must create a new article record');
  assert.equal(localeSwitchCreateBody?.article?.locale, 'en');
  createdArticleIds.add(translatedArticleId);

  const localeMutationResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}`, {
    method: 'PATCH',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({
      locale: 'en',
    }),
  });
  const localeMutationBody = await readJson(localeMutationResponse);
  assert.equal(
    localeMutationResponse.status,
    400,
    `Locale mutation on update must be blocked: ${JSON.stringify(localeMutationBody)}`
  );
  assert.match(
    String(localeMutationBody?.error ?? ''),
    /locale is immutable/i,
    'Locale mutation rejection should explain immutable locale behavior'
  );

  const sourceAfterSwitchResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}`, {
    headers: requestHeaders({ cookie: cmsCookie }),
  });
  const sourceAfterSwitchBody = await readJson(sourceAfterSwitchResponse);
  assert.equal(
    sourceAfterSwitchResponse.status,
    200,
    `Source article read after locale-switch failed: ${JSON.stringify(sourceAfterSwitchBody)}`
  );
  assert.equal(sourceAfterSwitchBody?.article?.id, articleId);
  assert.equal(sourceAfterSwitchBody?.article?.locale, 'de');
  assert.equal(
    sourceAfterSwitchBody?.article?.title,
    sourceTitleAfterEdit,
    'Source locale title must remain unchanged after locale-switch save'
  );
  assert.equal(
    sourceAfterSwitchBody?.article?.content,
    sourceContentAfterEdit,
    'Source locale content must remain unchanged after locale-switch save'
  );

  const maxUploadBytes = resolveCmsMediaMaxUploadBytesForTest();
  const oversizedBuffer = Buffer.alloc(maxUploadBytes + 1, 0x00);
  const oversizedUploadResponse = await fetch(`${BASE_URL}/api/cms/media`, {
    method: 'POST',
    headers: requestHeaders({ includeCsrf: true, cookie: cmsCookie }),
    body: createCmsMediaUploadFormData({
      file: new File([oversizedBuffer], 'oversized.png', { type: 'image/png' }),
    }),
  });
  const oversizedUploadBody = await readJson(oversizedUploadResponse);
  assert.equal(
    oversizedUploadResponse.status,
    413,
    `Oversized media upload must be rejected with 413: ${JSON.stringify(oversizedUploadBody)}`
  );

  const unsupportedMimeResponse = await fetch(`${BASE_URL}/api/cms/media`, {
    method: 'POST',
    headers: requestHeaders({ includeCsrf: true, cookie: cmsCookie }),
    body: createCmsMediaUploadFormData({
      file: new File([ONE_PIXEL_PNG], 'not-an-image.txt', { type: 'text/plain' }),
    }),
  });
  const unsupportedMimeBody = await readJson(unsupportedMimeResponse);
  assert.equal(
    unsupportedMimeResponse.status,
    415,
    `Unsupported media MIME must be rejected with 415: ${JSON.stringify(unsupportedMimeBody)}`
  );

  const invalidChecksumResponse = await fetch(`${BASE_URL}/api/cms/media`, {
    method: 'POST',
    headers: requestHeaders({ includeCsrf: true, cookie: cmsCookie }),
    body: createCmsMediaUploadFormData({
      file: new File([ONE_PIXEL_PNG], 'checksum.png', { type: 'image/png' }),
      checksumSha256: 'not-a-checksum',
    }),
  });
  const invalidChecksumBody = await readJson(invalidChecksumResponse);
  assert.equal(
    invalidChecksumResponse.status,
    400,
    `Invalid checksum must be rejected with 400: ${JSON.stringify(invalidChecksumBody)}`
  );
  assert.equal(invalidChecksumBody?.error, 'Invalid checksum format');

  const publishResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}`, {
    method: 'PATCH',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({ status: 'PUBLISHED' }),
  });
  const publishBody = await readJson(publishResponse);
  assert.equal(publishResponse.status, 200, `Publish failed: ${JSON.stringify(publishBody)}`);
  assert.equal(publishBody?.article?.status, 'PUBLISHED');

  const unpublishResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}`, {
    method: 'PATCH',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({
      status: 'DRAFT',
      statusReason: 'Stage2 E2E unpublish verification',
    }),
  });
  const unpublishBody = await readJson(unpublishResponse);
  assert.equal(unpublishResponse.status, 200, `Unpublish failed: ${JSON.stringify(unpublishBody)}`);
  assert.equal(unpublishBody?.article?.status, 'DRAFT');

  const revisionsResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}/revisions`, {
    headers: requestHeaders({ cookie: cmsCookie }),
  });
  const revisionsBody = await readJson(revisionsResponse);
  assert.equal(
    revisionsResponse.status,
    200,
    `Revisions read failed: ${JSON.stringify(revisionsBody)}`
  );
  const revisions = Array.isArray(revisionsBody?.revisions) ? revisionsBody.revisions : [];
  assert.ok(revisions.length > 0, 'Expected article revisions after lifecycle actions');
  const publishRevision = revisions.find((item: any) => item.sourceAction === 'PUBLISH');
  assert.ok(publishRevision?.id, 'Missing publish revision for restore step');

  const restoreResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}/restore`, {
    method: 'POST',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({
      revisionId: publishRevision.id,
      reason: 'Stage2 E2E restore verification',
    }),
  });
  const restoreBody = await readJson(restoreResponse);
  assert.equal(restoreResponse.status, 200, `Restore failed: ${JSON.stringify(restoreBody)}`);
  assert.equal(restoreBody?.article?.status, 'DRAFT');

  const republishResponse = await fetch(`${BASE_URL}/api/cms/articles/${articleId}`, {
    method: 'PATCH',
    headers: requestHeaders({ includeCsrf: true, includeJson: true, cookie: cmsCookie }),
    body: JSON.stringify({ status: 'PUBLISHED' }),
  });
  const republishBody = await readJson(republishResponse);
  assert.equal(republishResponse.status, 200, `Re-publish failed: ${JSON.stringify(republishBody)}`);
  assert.equal(republishBody?.article?.status, 'PUBLISHED');

  const mediaId = randomUUID();
  const mediaStorageKey = `stage2-e2e/${mediaId}.jpg`;
  const mediaUrl = `https://media.pixelring.test/${mediaId}.jpg`;
  const checksumSha256 = randomUUID().replaceAll('-', '') + randomUUID().replaceAll('-', '');

  await prisma.cmsMedia.create({
    data: {
      id: mediaId,
      locale: 'de',
      usageType: 'ARTICLE',
      storageProvider: 'EXTERNAL',
      storageKey: mediaStorageKey,
      publicUrl: mediaUrl,
      originalFilename: 'stage2-e2e-media.jpg',
      title: 'Stage2 E2E Media',
      altText: 'Stage2 E2E Media',
      mimeType: 'image/jpeg',
      byteSize: 1234,
      checksumSha256,
      width: 1200,
      height: 800,
      meta: { stage: 2, e2e: true },
    },
  });
  createdMediaIds.add(mediaId);

  const mediaUsageArticleId = randomUUID();
  await prisma.cmsArticle.create({
    data: {
      id: mediaUsageArticleId,
      locale: 'de',
      type: 'SYMPTOM',
      status: 'DRAFT',
      slug: `stage2-e2e-media-ref-${Date.now()}-${randomUUID().slice(0, 6)}`,
      title: 'Stage2 E2E media reference article',
      content: `Media reference: ${mediaUrl}`,
      sortOrder: 0,
    },
  });
  createdArticleIds.add(mediaUsageArticleId);

  const deleteMediaResponse = await fetch(`${BASE_URL}/api/cms/media/${mediaId}`, {
    method: 'DELETE',
    headers: requestHeaders({ includeCsrf: true, cookie: cmsCookie }),
  });
  const deleteMediaBody = await readJson(deleteMediaResponse);
  assert.equal(
    deleteMediaResponse.status,
    409,
    `Expected media delete block, got ${deleteMediaResponse.status}: ${JSON.stringify(deleteMediaBody)}`
  );
  assert.ok(
    Array.isArray(deleteMediaBody?.whereUsed) && deleteMediaBody.whereUsed.length > 0,
    'Media delete block response must include where-used entries'
  );
});
