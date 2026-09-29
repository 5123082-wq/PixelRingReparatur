/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { before, beforeEach, after, test } from 'node:test';
import { createHash, randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import sharp from 'sharp';
import { assertDbTestAllowed, getDbTestConnectionString } from './db-test-guard.ts';
import { hashAdminPassword } from '../src/lib/admin-password.ts';
import { nextCaseStatus } from '../src/lib/case-status-machine.ts';

assertDbTestAllowed({ scriptName: 'test-work-results-e2e' });
const base = process.env.WORK_RESULT_TEST_URL || 'http://127.0.0.1:3250';
const mailBase = process.env.WORK_RESULT_TEST_MAIL_URL || 'http://127.0.0.1:3251';
for (const url of [base, mailBase]) assert(['127.0.0.1', 'localhost'].includes(new URL(url).hostname), 'Only local test services are allowed');
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: getDbTestConnectionString()!.value }) });
const runId = randomUUID().slice(0, 8);
const password = 'WorkResultTest-Password-123!';
let owner: any, manager: any, other: any, customer: any;
let ownerCookie = '', managerCookie = '', otherCookie = '', portalCookie = '';
let photo: Buffer;
let sample: any;
const fixtureIds: string[] = [];
const mutationTimes = new Map<string, number[]>();
const csrf = { 'x-pixelring-admin-csrf': '1', origin: base, 'x-forwarded-for': `192.0.2.${1 + Math.floor(Math.random() * 250)}` };
const draft = (attachmentId?: string) => ({
  completedOn: '2026-09-28', note: '', items: [], noPhotoReason: '', correctionReason: '',
  photos: attachmentId ? [{ attachmentId, category: 'RESULT', caption: '' }] : [],
});

async function request(path: string, cookie = '', method = 'GET', body?: unknown, headers: Record<string, string> = {}) {
  if (cookie && method !== 'GET' && path.startsWith('/api/admin/cases/')) {
    const times = mutationTimes.get(cookie) ?? [];
    times.push(Date.now()); mutationTimes.set(cookie, times);
  }
  const response = await fetch(base + path, { method, headers: { ...csrf, cookie, ...(body && !(body instanceof FormData) ? { 'content-type': 'application/json' } : {}), ...headers },
    body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text();
  let json: any = null; try { json = JSON.parse(text); } catch { /* HTML/image response */ }
  return { status: response.status, json, text, headers: response.headers };
}
const route = (record: any) => '/api/admin/cases/' + record.id + '/work-result';
const publicRoute = (record: any) => '/api/portal/requests/' + record.publicRequestNumber + '/work-result';
async function login(user: any) {
  const response = await request('/api/admin/auth', '', 'POST', { email: user.email, password });
  assert.equal(response.status, 200, response.text);
  return response.headers.get('set-cookie')!.split(';')[0];
}
async function makeCase(status: any = 'IN_PROGRESS', assignee: string | null = manager.id) {
  const code = randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase();
  const record = await db.case.create({ data: {
    publicRequestNumber: 'PR-' + code.slice(0, 4) + '-' + code.slice(4),
    originChannel: 'MANUAL', status, assignedOperator: assignee, locale: 'ru',
    customerName: 'Тестовый клиент', customerEmail: customer.primaryEmail,
    statusUpdatedAt: new Date(), description: 'Fixture repair',
  } });
  fixtureIds.push(record.id);
  await db.portalCaseAccess.create({ data: { caseId: record.id, portalUserId: customer.id, source: 'ADMIN' } });
  return record;
}
async function uploadPhoto(record: any, cookie = managerCookie, buffer = photo, mimeType = 'image/png') {
  const prepared = await request(route(record) + '/uploads', cookie, 'POST', { action: 'prepare', filename: 'repair.png', size: buffer.length, mimeType });
  assert.equal(prepared.status, 200, prepared.text);
  assert.equal(prepared.json.provider, 'local', 'Test uploads must not use a cloud store');
  const form = new FormData(); form.set('uploadId', prepared.json.uploadId); form.set('file', new Blob([new Uint8Array(buffer)], { type: mimeType }), 'repair.png');
  return request(route(record) + '/uploads', cookie, 'POST', form);
}
async function save(record: any, data: any, cookie = managerCookie, version?: number) {
  const current = version === undefined ? await request(route(record), cookie) : null;
  return request(route(record), cookie, 'PATCH', { version: version ?? current!.json.version, draft: data });
}
async function publish(record: any, version: number, cookie = managerCookie) {
  return request(route(record), cookie, 'POST', { action: 'publish', version });
}
async function emails() { return (await fetch(mailBase)).json(); }
async function attentionMail(record: any, state?: string) {
  const deadline = Date.now() + 10_000;
  while (true) {
    const row = await db.portalAttentionEmail.findFirst({ where: { attention: { caseId: record.id, kind: 'REPORT' } }, orderBy: { createdAt: 'desc' } });
    if (row && (!state || row.state === state)) return row;
    if (Date.now() > deadline) assert.fail(`Report email expected ${state ?? 'row'}, got ${row?.state ?? 'absent'}`);
    await new Promise(resolve => setTimeout(resolve, 75));
  }
}
async function retryAttentionMail(record: any) {
  const row = await attentionMail(record);
  return request('/api/admin/cases/' + record.id + '/attention', managerCookie, 'POST', { action: 'retry-email', id: row.attentionId });
}


beforeEach(async () => {
  // Leave room for a whole scenario within the real 60/minute actor limit.
  // Pace only between scenarios: simultaneous requests inside a test stay concurrent.
  const now = Date.now();
  let waitMs = 0;
  for (const [cookie, times] of mutationTimes) {
    const recent = times.filter((time) => time > now - 60_000);
    mutationTimes.set(cookie, recent);
    if (recent.length > 20) waitMs = Math.max(waitMs, recent[recent.length - 21] + 60_100 - now);
  }
  if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
});

before(async () => {
  const passwordHash = await hashAdminPassword(password);
  owner = await db.adminUser.create({ data: { email: 'work-owner-' + runId + '@pixelring.test', passwordHash, role: 'OWNER' } });
  manager = await db.adminUser.create({ data: { email: 'work-manager-' + runId + '@pixelring.test', passwordHash, role: 'MANAGER' } });
  other = await db.adminUser.create({ data: { email: 'work-other-' + runId + '@pixelring.test', passwordHash, role: 'MANAGER' } });
  const email = 'work-customer-' + runId + '@pixelring.test';
  customer = await db.portalUser.create({ data: {
    primaryEmail: email, primaryEmailNormalized: email, passwordHash, passwordSetAt: new Date(),
    emails: { create: { email, emailNormalized: email, verifiedAt: new Date() } },
  } });
  const token = randomUUID();
  await db.session.create({ data: { tokenHash: createHash('sha256').update(token).digest('hex'), scope: 'PORTAL_AUTH',
    portalUserId: customer.id, contactMethod: 'EMAIL', contactValue: email, verifiedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600_000) } });
  portalCookie = 'pixelring_portal_session=' + token;
  ownerCookie = await login(owner); managerCookie = await login(manager); otherCookie = await login(other);
  photo = await sharp({ create: { width: 96, height: 64, channels: 3, background: '#285c8c' } }).png().toBuffer();
});
after(async () => { await db.$disconnect(); });

async function transitionInput(record: any, targetStatus: string) {
  const detail = await request('/api/admin/cases/' + record.id, managerCookie);
  assert.equal(detail.status, 200, detail.text);
  return { targetStatus, expected: detail.json.case.statusState, stepId: randomUUID() };
}
async function step(record: any, input: any, cookie = managerCookie) {
  return request('/api/admin/cases/' + record.id + '/status-transition', cookie, 'POST', input);
}
async function events(record: any) {
  return db.caseStatusEvent.findMany({ where: { caseId: record.id }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] });
}

test('completion is blocked without a report and cannot skip straight to pickup or closure', async () => {
  const record = await makeCase();
  for (const status of ['WORK_COMPLETED', 'READY_FOR_PICKUP', 'COMPLETED']) {
    const response = await request('/api/admin/cases/' + record.id, managerCookie, 'PATCH', { status });
    assert([400, 409].includes(response.status), response.text);
  }
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: record.id } })).status, 'IN_PROGRESS');
  const saved = await save(record, { ...draft(), completedOn: '' });
  assert.equal(saved.status, 200, saved.text);
  const response = await publish(record, saved.json.version);
  assert.equal(response.status, 409); assert(response.json.missingFields.includes('photos'));
  assert(response.json.missingFields.includes('completedOn'));
  assert.equal((await request(route(record), managerCookie)).json.hasDraft, true);
});

test('owner can publish a no-photo exception; manager cannot inherit or forge it', async () => {
  const record = await makeCase();
  const data = { ...draft(), noPhotoReason: 'Fixture exception — internal only' };
  assert.equal((await save(record, data)).status, 403);
  const saved = await save(record, data, ownerCookie);
  assert.equal(saved.status, 200, saved.text);
  assert.equal((await publish(record, saved.json.version)).status, 403);
  const result = await publish(record, saved.json.version, ownerCookie);
  assert.equal(result.status, 200, result.text);
  const visible = await request(publicRoute(record), portalCookie);
  assert.equal(visible.status, 200);
  assert.equal(visible.json.photos.length, 0);
  assert(!visible.text.includes(data.noPhotoReason));
});

test('real upload is private, decoded, request scoped and unavailable to an unrelated manager', async () => {
  sample = await makeCase();
  assert.equal((await request(route(sample), otherCookie)).status, 404);
  const bad = await uploadPhoto(sample, managerCookie, Buffer.from('<html>not an image</html>'));
  assert.equal(bad.status, 400, bad.text);
  const loaded = await uploadPhoto(sample);
  assert.equal(loaded.status, 200, loaded.text);
  sample.attachmentId = loaded.json.attachmentId;
  for (const [mime, image] of [['image/jpeg', await sharp(photo).jpeg().toBuffer()], ['image/webp', await sharp(photo).webp().toBuffer()]] as const) {
    assert.equal((await uploadPhoto(sample, managerCookie, image, mime)).status, 200);
  }
  const tooLarge = await request(route(sample) + '/uploads', managerCookie, 'POST', { action: 'prepare', filename: 'large.png', size: 1000 * 1024 * 1024, mimeType: 'image/png' });
  assert.equal(tooLarge.status, 400); assert.equal(tooLarge.json.code, 'file_size');
  const row = await db.attachment.findUniqueOrThrow({ where: { id: sample.attachmentId } });
  assert.equal(row.isCustomerVisible, false);
  assert.equal((await request(publicRoute(sample), portalCookie)).status, 404);
  assert.equal((await request('/api/admin/attachments/' + row.id, portalCookie)).status, 404);
  const second = await makeCase();
  assert.equal((await save(second, draft(row.id))).status, 400);
  const noCsrf = await fetch(base + route(sample), { method: 'PATCH', headers: { cookie: managerCookie, origin: 'https://untrusted.test', 'content-type': 'application/json' }, body: JSON.stringify({ version: 0, draft: draft(row.id) }) });
  assert.equal(noCsrf.status, 404); // Existing admin CSRF guard conceals protected routes.
  assert.equal(await db.workResult.count({ where: { caseId: sample.id } }), 0);
});

test('date and a result photo publish without explanation or warranty; request stays open and email sends once', async () => {
  const prior = (await emails()).length;
  const beforeOnly = { ...draft(sample.attachmentId), photos: [{ attachmentId: sample.attachmentId, category: 'BEFORE', caption: '' }] };
  const incomplete = await save(sample, beforeOnly);
  assert.equal((await publish(sample, incomplete.json.version)).status, 409);
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: sample.id } })).status, 'IN_PROGRESS');
  const saved = await save(sample, draft(sample.attachmentId));
  assert.equal(saved.status, 200, saved.text);
  const results = await Promise.all([publish(sample, saved.json.version), publish(sample, saved.json.version)]);
  results.forEach((result) => assert.equal(result.status, 200, result.text));
  assert.equal(await db.workResultRevision.count({ where: { workResult: { caseId: sample.id } } }), 1);
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: sample.id } })).status, 'WORK_COMPLETED');
  assert.equal(await db.caseStatusEvent.count({ where: { caseId: sample.id, toStatus: 'WORK_COMPLETED' } }), 1);
  await attentionMail(sample, 'SENT');
  assert.equal((await emails()).length, prior + 1);
  const report = await request(publicRoute(sample), portalCookie);
  assert.equal(report.status, 200); assert.equal(report.json.note, ''); assert.equal(report.json.photos.length, 1);
  assert(!/storageKey|noPhotoReason|publishedById|warranty/.test(report.text));
  sample.photoUrl = report.json.photos[0].url;
  const image = await request(sample.photoUrl, portalCookie);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.equal(image.headers.get('cache-control'), 'private, no-store');
  assert.equal((await request(sample.photoUrl)).status, 404);
  assert.equal((await request(sample.photoUrl, managerCookie)).status, 404);
  const statusOnlyToken = randomUUID();
  await db.session.create({ data: { tokenHash: createHash('sha256').update(statusOnlyToken).digest('hex'),
    scope: 'CASE_ACCESS', caseId: sample.id, contactValue: customer.primaryEmail, contactMethod: 'EMAIL',
    verifiedAt: new Date(), expiresAt: new Date(Date.now() + 3600_000) } });
  assert.equal((await request(sample.photoUrl, 'pixelring_case_session=' + statusOnlyToken)).status, 404);
});

test('saved corrections remain private, require a reason, preserve old editions and reject stale writes', async () => {
  const current = await request(route(sample), managerCookie);
  const update = { ...draft(sample.attachmentId), note: 'Updated repair explanation', items: [{ title: 'Дополнительный пункт', text: '' }] };
  const saved = await save(sample, update, managerCookie, current.json.version);
  assert.equal(saved.status, 200);
  assert.equal((await save(sample, update, managerCookie, current.json.version)).status, 409);
  assert.equal((await request(publicRoute(sample), portalCookie)).json.note, '');
  assert.equal((await publish(sample, saved.json.version)).status, 409);
  const corrected = await save(sample, { ...update, correctionReason: 'Internal correction explanation' });
  assert.equal((await publish(sample, corrected.json.version)).status, 200);
  const visible = await request(publicRoute(sample), portalCookie);
  assert.equal(visible.json.number, 2); assert.equal(visible.json.note, update.note);
  assert(!visible.text.includes('Internal correction explanation'));
  const versions = await db.workResultRevision.findMany({ where: { workResult: { caseId: sample.id } }, orderBy: { number: 'asc' } });
  assert.equal(versions.length, 2); assert.equal((versions[0].content as any).note, '');
});

test('failed email leaves publication intact; retry sends only the failed notification', async () => {
  const record = await makeCase();
  const loaded = await uploadPhoto(record);
  await fetch(mailBase + '/reject?email=' + encodeURIComponent(customer.primaryEmail));
  const saved = await save(record, draft(loaded.json.attachmentId));
  const published = await publish(record, saved.json.version);
  assert.equal(published.status, 200);
  assert.equal((await attentionMail(record, 'FAILED')).state, 'FAILED');
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: record.id } })).status, 'WORK_COMPLETED');
  await fetch(mailBase + '/allow?email=' + encodeURIComponent(customer.primaryEmail));
  const retried = await retryAttentionMail(record);
  assert.equal(retried.status, 200, retried.text);
  assert.equal((await attentionMail(record, 'SENT')).state, 'SENT');
  const count = (await emails()).length;
  await retryAttentionMail(record);
  assert.equal((await emails()).length, count);
  const notificationId = (await attentionMail(record)).id;
  await db.portalAttentionEmail.update({ where: { id: notificationId }, data: { state: 'SENDING', startedAt: new Date(), sentAt: null } });
  assert.equal((await retryAttentionMail(record)).status, 200);
  assert.equal((await attentionMail(record)).state, 'SENDING');
  await db.portalAttentionEmail.update({ where: { id: notificationId }, data: { startedAt: new Date(Date.now() - 6 * 60_000) } });
  assert.equal((await retryAttentionMail(record)).status, 200);
  assert.equal((await attentionMail(record, 'SENT')).state, 'SENT');
  assert.equal((await emails()).length, count + 1);
});

test('simultaneous draft saves cannot overwrite each other or return another editor’s draft', async () => {
  const record = await makeCase();
  const inputs = ['First editor', 'Second editor'].map((note) => ({ ...draft(), note }));
  const results = await Promise.all(inputs.map((input) => save(record, input, managerCookie, 0)));
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]);
  const winner = results.findIndex((result) => result.status === 200);
  assert.equal(results[winner].json.draft.note, inputs[winner].note);
  assert.equal((await request(route(record), managerCookie)).json.draft.note, inputs[winner].note);
});

test('a reopened repair cannot reuse its old report through a plain status change', async () => {
  const record = await makeCase();
  const saved = await save(record, { ...draft(), noPhotoReason: 'Internal test exception' }, ownerCookie);
  assert.equal((await publish(record, saved.json.version, ownerCookie)).status, 200);
  for (const status of ['WAITING_FOR_CUSTOMER', 'IN_PROGRESS']) {
    assert.equal((await request('/api/admin/cases/' + record.id, managerCookie, 'PATCH', { status })).status, 200);
  }
  assert.equal((await request('/api/admin/cases/' + record.id, managerCookie, 'PATCH', { status: 'WORK_COMPLETED' })).status, 409);
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: record.id } })).status, 'IN_PROGRESS');
  const corrected = await save(record, { ...draft(), noPhotoReason: 'Owner reconfirms exception', correctionReason: 'Repeated repair completed' }, ownerCookie);
  assert.equal((await publish(record, corrected.json.version, ownerCookie)).status, 200);
});

test('unconnected portal keeps the report, then grants access without exposing it to other requests', async () => {
  const record = await makeCase();
  await db.portalCaseAccess.delete({ where: { portalUserId_caseId: { portalUserId: customer.id, caseId: record.id } } });
  const saved = await save(record, { ...draft(), noPhotoReason: 'Test exception' }, ownerCookie);
  const published = await publish(record, saved.json.version, ownerCookie);
  assert.equal(published.status, 200);
  assert.equal(await db.portalAttentionEmail.count({ where: { attention: { caseId: record.id } } }), 0);
  assert.equal((await request(publicRoute(record), portalCookie)).status, 404);
  await db.portalCaseAccess.create({ data: { caseId: record.id, portalUserId: customer.id, source: 'ADMIN' } });
  assert.equal((await request(publicRoute(record), portalCookie)).status, 200);
  assert.equal((await request(sample.photoUrl.replace(sample.publicRequestNumber, record.publicRequestNumber), portalCookie)).status, 404);
});

test('revoked grants and disabled accounts lose report and photo access immediately', async () => {
  await db.portalCaseAccess.update({ where: { portalUserId_caseId: { portalUserId: customer.id, caseId: sample.id } }, data: { revokedAt: new Date() } });
  assert.equal((await request(publicRoute(sample), portalCookie)).status, 404);
  assert.equal((await request(sample.photoUrl, portalCookie)).status, 404);
  for (const suffix of ['', '/report/print']) {
    const denied = await request('/ru/portal/requests/' + sample.publicRequestNumber + suffix, portalCookie);
    assert(!denied.text.includes('Updated repair explanation'));
  }
  await db.portalCaseAccess.update({ where: { portalUserId_caseId: { portalUserId: customer.id, caseId: sample.id } }, data: { revokedAt: null } });
  await db.portalUser.update({ where: { id: customer.id }, data: { status: 'DISABLED' } });
  assert.equal((await request(publicRoute(sample), portalCookie)).status, 404);
  await db.portalUser.update({ where: { id: customer.id }, data: { status: 'ACTIVE' } });
});

test('owner CRM login works without general manager mutation powers; legacy requests still close', async () => {
  const denied = await request('/api/admin/cases/' + sample.id, ownerCookie, 'PATCH', { assignedOperator: owner.id });
  assert.equal(denied.status, 404);
  assert.equal((await request('/ru/ring-manager-crm/dashboard/' + sample.id, ownerCookie)).status, 200);
  const legacy = await makeCase('READY_FOR_PICKUP');
  assert.equal((await request('/api/admin/cases/' + legacy.id, managerCookie, 'PATCH', { status: 'COMPLETED' })).status, 200);
  const closedBefore = (await db.case.findUniqueOrThrow({ where: { id: legacy.id } })).statusUpdatedAt;
  const loaded = await uploadPhoto(legacy); const saved = await save(legacy, draft(loaded.json.attachmentId));
  assert.equal((await publish(legacy, saved.json.version)).status, 200);
  const after = await db.case.findUniqueOrThrow({ where: { id: legacy.id } });
  assert.equal(after.status, 'COMPLETED'); assert.deepEqual(after.statusUpdatedAt, closedBefore);
  assert.equal((await request('/api/admin/cases/' + sample.id, managerCookie, 'PATCH', { status: 'READY_FOR_PICKUP' })).status, 200);
});

test('request links, legacy report links, protected print and dashboard work on all six locales', async () => {
  for (const locale of ['de', 'en', 'ru', 'tr', 'pl', 'ar']) {
    const path = '/' + locale + '/portal/requests/' + sample.publicRequestNumber;
    const detail = await request(path, portalCookie);
    assert.equal(detail.status, 200, locale);
    assert(detail.text.includes('Updated repair explanation'), locale);
    assert(detail.text.includes('href="#repair-report"'), locale);
    assert(detail.text.includes(path + '/report/print'), locale);
    assert(!detail.text.includes('Internal correction explanation'), locale);
    const legacy = await fetch(base + path + '/report', { headers: { cookie: portalCookie }, redirect: 'manual' });
    assert.equal(legacy.status, 307, locale);
    assert.equal(new URL(legacy.headers.get('location')!, base).pathname, path, locale);
    const page = await request(path + '/report/print', portalCookie);
    assert.equal(page.status, 200, locale);
    assert(page.text.includes('Updated repair explanation'), locale);
    assert(!page.text.includes('Internal correction explanation'), locale);
    if (locale === 'ar') assert(page.text.includes('dir="rtl"'));
    const dashboard = await request('/' + locale + '/portal', portalCookie);
    assert.equal(dashboard.status, 200);
    assert(dashboard.text.includes(sample.publicRequestNumber));
    assert(dashboard.text.includes('/portal/requests/' + sample.publicRequestNumber + '#repair-report'), locale);
  }
  for (const suffix of ['', '/report', '/report/print']) {
    const unauthenticated = await request('/ru/portal/requests/' + sample.publicRequestNumber + suffix);
    assert.equal(unauthenticated.status, 200);
    assert(unauthenticated.text.includes('portal-login-password'));
    assert(!unauthenticated.text.includes('Updated repair explanation'));
  }
  if (process.env.WORK_RESULT_FIXTURE_FILE) await writeFile(process.env.WORK_RESULT_FIXTURE_FILE, JSON.stringify({
    caseId: sample.id, publicRequestNumber: sample.publicRequestNumber,
    uiCase: await makeCase(),
    ownerEmail: owner.email, managerEmail: manager.email, customerEmail: customer.primaryEmail,
    password, portalCookie, ownerCookie, managerCookie,
  }));
});

test('forward routes keep pickup optional and pause/cancellation branches explicit', () => {
  assert.equal(nextCaseStatus('NUMBER_ISSUED', 'COMPLETED'), 'UNDER_REVIEW');
  assert.equal(nextCaseStatus('UNDER_REVIEW', 'READY_FOR_PICKUP'), 'IN_PROGRESS');
  assert.equal(nextCaseStatus('IN_PROGRESS', 'COMPLETED'), 'WORK_COMPLETED');
  assert.equal(nextCaseStatus('WORK_COMPLETED', 'COMPLETED'), 'COMPLETED');
  assert.equal(nextCaseStatus('WORK_COMPLETED', 'READY_FOR_PICKUP'), 'READY_FOR_PICKUP');
  for (const paused of ['WAITING_FOR_CUSTOMER', 'ON_HOLD'] as const) {
    assert.equal(nextCaseStatus(paused, 'COMPLETED'), 'IN_PROGRESS');
    assert.equal(nextCaseStatus(paused, 'UNDER_REVIEW'), 'UNDER_REVIEW');
  }
  assert.equal(nextCaseStatus('IN_PROGRESS', 'UNDER_REVIEW'), null);
  assert.equal(nextCaseStatus('COMPLETED', 'IN_PROGRESS'), null);
  assert.equal(nextCaseStatus('CANCELLED', 'COMPLETED'), null);
});

test('a distant target commits each stage and stops before the required report', async () => {
  const record = await makeCase('NUMBER_ISSUED');
  const detail = await request('/api/admin/cases/' + record.id, managerCookie);
  assert(detail.json.case.allowedTargetStatuses.includes('COMPLETED'));
  assert.equal((await request('/api/admin/cases/' + record.id, managerCookie, 'PATCH', { status: 'IN_PROGRESS' })).status, 400);
  let input = await transitionInput(record, 'COMPLETED');
  for (const status of ['UNDER_REVIEW', 'IN_PROGRESS']) {
    const result = await step(record, input);
    assert.equal(result.status, 200, result.text);
    assert.equal(result.json.outcome, 'advanced'); assert.equal(result.json.state.status, status);
    input = { ...input, expected: result.json.state, stepId: randomUUID() };
  }
  const result = await step(record, input);
  assert.equal(result.json.outcome, 'requires_input');
  assert.equal(result.json.requirement.kind, 'work_result');
  assert(result.json.requirement.missingFields.includes('photos'));
  assert.deepEqual((await events(record)).map((event) => event.toStatus), ['UNDER_REVIEW', 'IN_PROGRESS']);
  // Cancelling the client loop requires no rollback or further server operation.
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: record.id } })).status, 'IN_PROGRESS');
});

test('a complete draft still requires confirmation; repeated publish and close are idempotent', async () => {
  const priorEmails = (await emails()).length;
  const record = await makeCase();
  const uploaded = await uploadPhoto(record);
  const saved = await save(record, draft(uploaded.json.attachmentId));
  const input = await transitionInput(record, 'COMPLETED');
  const blocked = await step(record, input);
  assert.equal(blocked.json.outcome, 'requires_input');
  assert.deepEqual(blocked.json.requirement.missingFields, []);
  assert.equal(await db.workResultRevision.count({ where: { workResult: { caseId: record.id } } }), 0);
  const confirmed = { ...input, confirmation: { kind: 'work_result', version: saved.json.version } };
  const published = await Promise.all([step(record, confirmed), step(record, confirmed)]);
  published.forEach((result) => assert.equal(result.status, 200, result.text));
  assert.deepEqual(published[0].json, published[1].json);
  assert.equal(published[0].json.state.status, 'WORK_COMPLETED');
  assert.equal((await step(record, confirmed)).status, 200); // lost-response retry
  assert.equal(await db.workResultRevision.count({ where: { workResult: { caseId: record.id } } }), 1);
  await attentionMail(record, 'SENT');
  assert.equal((await emails()).length, priorEmails + 1);
  assert.equal((await attentionMail(record, 'SENT')).state, 'SENT');
  const closing = { targetStatus: 'COMPLETED', expected: published[0].json.state, stepId: randomUUID() };
  const closed = await Promise.all([step(record, closing), step(record, closing)]);
  closed.forEach((result) => { assert.equal(result.status, 200, result.text); assert.equal(result.json.outcome, 'done'); });
  assert.deepEqual((await events(record)).map((event) => event.toStatus), ['WORK_COMPLETED', 'COMPLETED']);
  assert.equal((await step(record, confirmed)).status, 409); // old replay cannot restart the chain
  assert.equal((await step(record, { ...closing, targetStatus: 'CANCELLED' })).status, 409);
});

test('missing report data cannot be bypassed using a forged confirmation', async () => {
  const record = await makeCase();
  const saved = await save(record, { ...draft(), completedOn: '' });
  const input = await transitionInput(record, 'READY_FOR_PICKUP');
  const result = await step(record, { ...input, confirmation: { kind: 'work_result', version: saved.json.version } });
  assert.equal(result.status, 409); assert.equal(result.json.code, 'work_result_required');
  assert.deepEqual(result.json.missingFields.sort(), ['completedOn', 'photos']);
  assert.equal((await events(record)).length, 0);
  assert.equal((await request(route(record), managerCookie)).json.hasDraft, true);
  assert.equal((await step(record, { ...input, confirmation: { kind: 'reason', reason: 'skip report' } })).status, 400);
});

test('reason stages have their own gate; return from hold goes through repair', async () => {
  const record = await makeCase();
  const input = await transitionInput(record, 'ON_HOLD');
  const gate = await step(record, input);
  assert.equal(gate.json.requirement.kind, 'reason'); assert.equal(gate.json.state.status, 'IN_PROGRESS');
  assert.equal((await step(record, { ...input, confirmation: { kind: 'reason', reason: '  ' } })).status, 400);
  const confirmed = { ...input, confirmation: { kind: 'reason', reason: 'Waiting for fixture part' } };
  assert.equal((await step(record, confirmed)).json.outcome, 'done');
  assert.equal((await step(record, confirmed)).status, 200);
  assert.equal((await events(record))[0].reason, 'Waiting for fixture part');
  const resumed = await step(record, await transitionInput(record, 'COMPLETED'));
  assert.equal(resumed.json.state.status, 'IN_PROGRESS');
  const gateAgain = await step(record, await transitionInput(record, 'COMPLETED'));
  assert.equal(gateAgain.json.requirement.kind, 'work_result');
  const cancelledInput = await transitionInput(record, 'CANCELLED');
  assert.equal((await step(record, cancelledInput)).json.requirement.kind, 'reason');
  assert.equal((await step(record, { ...cancelledInput, confirmation: { kind: 'reason', reason: 'Fixture cancellation' } })).json.outcome, 'done');
  assert.equal((await step(record, await transitionInput(record, 'COMPLETED'))).status, 409);
});

test('concurrent editors and stale state after returning to the same status stop the chain', async () => {
  const record = await makeCase('NUMBER_ISSUED');
  const first = await transitionInput(record, 'COMPLETED');
  const second = { ...first, stepId: randomUUID() };
  const attempts = await Promise.all([step(record, first), step(record, second)]);
  assert.deepEqual(attempts.map((result) => result.status).sort(), [200, 409]);
  assert.equal((await events(record)).length, 1);
  await step(record, await transitionInput(record, 'IN_PROGRESS'));
  const stale = await transitionInput(record, 'COMPLETED');
  await step(record, await transitionInput(record, 'WAITING_FOR_CUSTOMER'));
  await step(record, await transitionInput(record, 'IN_PROGRESS'));
  const failure = await step(record, stale);
  assert.equal(failure.status, 409); assert.equal(failure.json.code, 'status_conflict');
});

test('manager cannot use an owner exception; owner publication does not grant closing rights', async () => {
  const record = await makeCase();
  const saved = await save(record, { ...draft(), noPhotoReason: 'Fixture owner exception' }, ownerCookie);
  const input = await transitionInput(record, 'COMPLETED');
  const confirmed = { ...input, confirmation: { kind: 'work_result', version: saved.json.version } };
  assert.equal((await step(record, confirmed)).status, 403);
  assert.equal((await step(record, confirmed, ownerCookie)).status, 404);
  assert.equal((await publish(record, saved.json.version, ownerCookie)).status, 200);
  assert.equal((await step(record, input)).status, 409);
  assert.equal((await step(record, await transitionInput(record, 'COMPLETED'))).json.outcome, 'done');
});

test('pickup is explicit; legacy pickup can close without a report', async () => {
  const legacy = await makeCase('READY_FOR_PICKUP');
  assert.equal((await step(legacy, await transitionInput(legacy, 'COMPLETED'))).json.outcome, 'done');
  assert.equal(await db.workResult.count({ where: { caseId: legacy.id } }), 0);
  const record = await makeCase();
  const saved = await save(record, draft((await uploadPhoto(record)).json.attachmentId));
  const input = await transitionInput(record, 'READY_FOR_PICKUP');
  assert.equal((await step(record, input)).json.requirement.kind, 'work_result');
  const published = await step(record, { ...input, confirmation: { kind: 'work_result', version: saved.json.version } });
  assert.equal(published.json.state.status, 'WORK_COMPLETED');
  const ready = await step(record, await transitionInput(record, 'READY_FOR_PICKUP'));
  assert.equal(ready.json.state.status, 'READY_FOR_PICKUP'); assert.equal(ready.json.outcome, 'done');
});

test('transition endpoint enforces scope, CSRF, input validation and registration', async () => {
  const record = await makeCase();
  const input = await transitionInput(record, 'COMPLETED');
  assert.equal((await step(record, input, otherCookie)).status, 404);
  assert.equal((await step(record, input, '')).status, 404);
  assert.equal((await request('/api/admin/cases/' + record.id + '/status-transition', managerCookie, 'POST', input, { 'x-pixelring-admin-csrf': '' })).status, 404);
  assert.equal((await step(record, { ...input, expected: {} })).status, 400);
  assert.equal((await step(record, { ...input, stepId: 'bad' })).status, 400);
  await db.case.update({ where: { id: record.id }, data: { publicRequestNumber: null } });
  const blocked = await step(record, input);
  assert.equal(blocked.status, 409); assert.equal(blocked.json.code, 'request_number_required');
});

test('notification failure does not block the final step', async () => {
  const record = await makeCase();
  const saved = await save(record, draft((await uploadPhoto(record)).json.attachmentId));
  const input = await transitionInput(record, 'COMPLETED');
  const verifiedEmails = await db.portalUserEmail.findMany({ where: { portalUserId: customer.id } });
  await fetch(mailBase + '/reject?email=' + encodeURIComponent(customer.primaryEmail));
  try {
    const published = await step(record, { ...input, confirmation: { kind: 'work_result', version: saved.json.version } });
    assert.equal(published.status, 200, published.text);
    assert.equal(published.json.state.status, 'WORK_COMPLETED');
    const closed = await step(record, await transitionInput(record, 'COMPLETED'));
    assert.equal(closed.json.outcome, 'done');
    assert.equal((await attentionMail(record, 'FAILED')).state, 'FAILED');
    const beforeRetry = (await emails()).length;
    await db.portalUserEmail.deleteMany({ where: { portalUserId: customer.id } });
    const retry = await retryAttentionMail(record);
    assert.equal(retry.status, 200, retry.text);
    assert.equal((await attentionMail(record, 'SKIPPED')).state, 'SKIPPED');
    assert.equal((await emails()).length, beforeRetry);
  } finally {
    await db.portalUserEmail.createMany({ data: verifiedEmails, skipDuplicates: true });
    await fetch(mailBase + '/allow?email=' + encodeURIComponent(customer.primaryEmail));
  }
});


test('report publication creates one acknowledged action and one unified email without legacy duplication', async () => {
  const record = await makeCase();
  const beforeMail = (await emails()).length;
  const saved = await save(record, { ...draft(), noPhotoReason: 'Explicit owner test exception' }, ownerCookie);
  const first = await publish(record, saved.json.version, ownerCookie);
  assert.equal(first.status, 200, first.text);
  // Delivery runs after the response. Observe the local mail capture before database assertions.
  const deadline = Date.now() + 10_000;
  while ((await emails()).length === beforeMail && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 100));
  const mail = await attentionMail(record, 'SENT');
  const attention = await db.portalAttention.findUniqueOrThrow({ where: { id: mail.attentionId } });
  assert.equal(attention.kind, 'REPORT'); assert.equal(attention.mode, 'ACKNOWLEDGE'); assert.equal(attention.state, 'OPEN');
  assert.equal(attention.readAt, null); assert.equal(attention.portalUserId, customer.id);
  assert.equal(await db.workResultNotification.count({ where: { revision: { workResult: { caseId: record.id } } } }), 0);
  assert.equal(await db.portalAttentionEmail.count({ where: { attention: { caseId: record.id } } }), 1);
  assert.equal((await emails()).length, beforeMail + 1);
  const retry = await publish(record, saved.json.version, ownerCookie);
  assert.equal(retry.status, 200, retry.text);
  assert.equal(await db.portalAttention.count({ where: { caseId: record.id, kind: 'REPORT' } }), 1);
  assert.equal((await emails()).length, beforeMail + 1);
});


test('new report revision cancels obsolete pending actions and emails but preserves completed history', async () => {
  const record = await makeCase();
  await fetch(mailBase + '/reject?email=' + encodeURIComponent(customer.primaryEmail));
  try {
    const first = await save(record, { ...draft(), noPhotoReason: 'Owner test exception' }, ownerCookie);
    assert.equal((await publish(record, first.json.version, ownerCookie)).status, 200);
    const oldMail = await attentionMail(record, 'FAILED');
    const completed = await db.portalAttention.create({ data: { caseId: record.id, portalUserId: customer.id, sourceKey: 'historical-' + randomUUID(), sourceId: randomUUID(), kind: 'REPORT', title: '', mode: 'ACKNOWLEDGE', state: 'COMPLETED', completedAt: new Date() } });
    const second = await save(record, { ...draft(), noPhotoReason: 'Owner test exception', correctionReason: 'Correct the published report' }, ownerCookie);
    assert.equal((await publish(record, second.json.version, ownerCookie)).status, 200);
    const newMail = await attentionMail(record, 'FAILED');
    assert.notEqual(newMail.attentionId, oldMail.attentionId);
    assert.equal((await db.portalAttention.findUniqueOrThrow({ where: { id: oldMail.attentionId } })).state, 'CANCELLED');
    assert.equal((await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: oldMail.id } })).state, 'SKIPPED');
    assert.equal((await db.portalAttention.findUniqueOrThrow({ where: { id: completed.id } })).state, 'COMPLETED');
    assert.equal(await db.portalAttention.count({ where: { caseId: record.id, kind: 'REPORT', state: 'OPEN' } }), 1);
  } finally { await fetch(mailBase + '/allow?email=' + encodeURIComponent(customer.primaryEmail)); }
});
