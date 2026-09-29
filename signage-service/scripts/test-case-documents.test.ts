/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertDbTestAllowed, getDbTestConnectionString } from './db-test-guard.ts';
import { hashAdminPassword } from '../src/lib/admin-password.ts';
import { validatePdf, documentMetadata, MAX_DOCUMENT_BYTES } from '../src/lib/case-documents/types.ts';
assertDbTestAllowed({ scriptName: 'test-case-documents' });
const base = process.env.DOCUMENT_TEST_URL || 'http://127.0.0.1:3260';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: getDbTestConnectionString()!.value }) });
const run = randomUUID().slice(0, 8);
let manager: any, other: any, customer: any, record: any, unrelated: any;
let ownerCookie = '', managerCookie = '', otherCookie = '', portalCookie = '';
const csrf = { 'x-pixelring-admin-csrf': '1', origin: base };
const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n');
const route = () => '/api/admin/cases/' + record.id + '/documents';
const publicRoute = () => '/api/portal/requests/' + record.publicRequestNumber + '/documents';
async function request(path: string, cookie = '', method = 'GET', body?: unknown) {
  const response = await fetch(base + path, { method, headers: { ...csrf, cookie, ...(body && !(body instanceof FormData) ? { 'content-type': 'application/json' } : {}) }, body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text(); let json: any; try { json = JSON.parse(text); } catch { /* PDF/HTML */ }
  return { status: response.status, json, text, headers: response.headers };
}
async function upload(cookie = managerCookie, data = pdf, id = randomUUID(), filename = 'Счёт.pdf', type = 'application/pdf') {
  const form = new FormData(); form.set('id', id); form.set('file', new Blob([data], { type }), filename);
  return request(route(), cookie, 'POST', form);
}
async function publish(id: string, type = 'INVOICE', cookie = managerCookie) {
  return request(route(), cookie, 'POST', { action: 'publish', id, type, title: 'Test document', comment: 'Test comment' });
}
before(async () => {
  const password = 'Document-Test-123!'; const passwordHash = await hashAdminPassword(password);
  async function admin(role: 'OWNER' | 'MANAGER', suffix: string) {
    const user = await db.adminUser.create({ data: { email: `document-${suffix}-${run}@pixelring.test`, passwordHash, role } });
    const response = await request('/api/admin/auth', '', 'POST', { email: user.email, password });
    assert.equal(response.status, 200, response.text);
    return { user, cookie: response.headers.get('set-cookie')!.split(';')[0] };
  }
  const a = await admin('OWNER', 'owner'); ownerCookie = a.cookie;
  const b = await admin('MANAGER', 'manager'); manager = b.user; managerCookie = b.cookie;
  const c = await admin('MANAGER', 'other'); other = c.user; otherCookie = c.cookie;
  const email = `document-customer-${run}@pixelring.test`;
  customer = await db.portalUser.create({ data: { primaryEmail: email, primaryEmailNormalized: email, passwordHash, passwordSetAt: new Date(), emails: { create: { email, emailNormalized: email, verifiedAt: new Date() } } } });
  const token = randomUUID();
  await db.session.create({ data: { tokenHash: createHash('sha256').update(token).digest('hex'), scope: 'PORTAL_AUTH', portalUserId: customer.id, contactMethod: 'EMAIL', contactValue: email, verifiedAt: new Date(), expiresAt: new Date(Date.now() + 3600_000) } });
  portalCookie = 'pixelring_portal_session=' + token;
  const code = randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase();
  record = await db.case.create({ data: { publicRequestNumber: 'PR-' + code.slice(0, 4) + '-' + code.slice(4), status: 'UNDER_REVIEW', originChannel: 'MANUAL', assignedOperator: manager.id, locale: 'ru' } });
  unrelated = await db.case.create({ data: { publicRequestNumber: 'PR-' + run.toUpperCase().slice(0, 4) + '-ZZZZ', originChannel: 'MANUAL', assignedOperator: other.id } });
  await db.portalCaseAccess.create({ data: { caseId: record.id, portalUserId: customer.id, source: 'ADMIN' } });
});
after(async () => { await db.$disconnect(); });
let draftId = '';
test('rejects invalid PDF data, metadata and oversize files', async () => {
  assert.throws(() => validatePdf(Buffer.from('<html></html>')));
  assert.throws(() => validatePdf(new Uint8Array(MAX_DOCUMENT_BYTES + 1)));
  assert.throws(() => documentMetadata({ type: 'PAYMENT', title: 'x', comment: '' }));
  assert.throws(() => documentMetadata({ type: 'INVOICE', title: ' ', comment: '' }));
  assert.equal((await upload(managerCookie, Buffer.from('<html>bad</html>'))).status, 400);
  assert.equal((await upload(managerCookie, pdf, randomUUID(), 'fake.txt')).status, 400);
  assert.equal((await upload(managerCookie, pdf, randomUUID(), 'fake.pdf', 'text/html')).status, 400);
  assert.equal((await upload(managerCookie, Buffer.alloc(MAX_DOCUMENT_BYTES + 1))).status, 400);
});
test('upload stays private and permits safe retry without another attachment', async () => {
  const id = randomUUID(); const response = await upload(managerCookie, pdf, id);
  assert.equal(response.status, 200, response.text); draftId = response.json.id;
  assert.equal(response.json.publishedAt, null);
  const row = await db.caseDocument.findUniqueOrThrow({ where: { id }, include: { attachment: true } });
  assert.equal(row.attachment.isCustomerVisible, false); assert.equal(row.attachment.storageProvider, 'LOCAL');
  assert.equal((await upload(managerCookie, pdf, id)).json.id, id);
  assert.equal(await db.caseDocument.count({ where: { id } }), 1);
  assert.equal((await request(publicRoute(), portalCookie)).json.length, 0);
  assert.equal((await request(publicRoute() + '/' + id, portalCookie)).status, 404);
  assert.equal((await request(route() + '/' + id, ownerCookie)).status, 200);
});
test('unrelated managers, unauthenticated users and customers cannot use admin routes', async () => {
  for (const cookie of ['', otherCookie, portalCookie]) {
    assert.equal((await request(route(), cookie)).status, 404);
    assert.equal((await upload(cookie)).status, 404);
    assert.equal((await request(route() + '/' + draftId, cookie)).status, 404);
  }
  const response = await fetch(base + route(), { method: 'POST', headers: { cookie: managerCookie, origin: 'https://untrusted.test', 'content-type': 'application/json' }, body: JSON.stringify({ action: 'publish', id: draftId }) });
  assert.equal(response.status, 404);
});
test('publishes once, exposes metadata and authenticated PDF open/download with a chat link', async () => {
  const response = await publish(draftId); assert.equal(response.status, 200, response.text);
  const again = await publish(draftId); assert.equal(again.status, 200);
  const messages = await db.message.findMany({ where: { caseId: record.id } });
  assert.equal(messages.length, 1); assert(messages[0].body.includes(publicRoute() + '/' + draftId));
  const list = await request(publicRoute(), portalCookie); assert.equal(list.status, 200); assert.equal(list.json.length, 1);
  assert.equal(list.json[0].type, 'INVOICE'); assert(!list.text.includes('storageKey')); assert(!list.text.includes('createdById'));
  const opened = await request(publicRoute() + '/' + draftId, portalCookie);
  assert.equal(opened.status, 200); assert.equal(opened.text, pdf.toString());
  assert.equal(opened.headers.get('cache-control'), 'private, no-store'); assert.match(opened.headers.get('content-disposition')!, /^inline;/);
  const downloaded = await request(publicRoute() + '/' + draftId + '?download=1', portalCookie);
  assert.match(downloaded.headers.get('content-disposition')!, /^attachment;/); assert.equal(downloaded.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(await db.adminAuditLog.count({ where: { resourceId: draftId, action: 'CASE_DOCUMENT_PUBLISHED' } }), 1);
});
test('all four document types are available to the owner without changing case status', async () => {
  for (const type of ['CONTRACT', 'ACT', 'OTHER']) {
    const loaded = await upload(ownerCookie); assert.equal(loaded.status, 200, loaded.text);
    assert.equal((await publish(loaded.json.id, type, ownerCookie)).status, 200);
  }
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: record.id } })).status, 'UNDER_REVIEW');
  assert.equal((await request(publicRoute(), portalCookie)).json.length, 4);
});
test('request number alone, mismatched case, revoked grants and inactive users cannot read PDFs', async () => {
  assert.equal((await request(publicRoute())).status, 404);
  assert.equal((await request(publicRoute() + '/' + draftId)).status, 404);
  assert.equal((await request('/api/portal/requests/' + unrelated.publicRequestNumber + '/documents/' + draftId, portalCookie)).status, 404);
  await db.portalCaseAccess.updateMany({ where: { caseId: record.id }, data: { revokedAt: new Date() } });
  assert.equal((await request(publicRoute(), portalCookie)).status, 404);
  assert.equal((await request(publicRoute() + '/' + draftId, portalCookie)).status, 404);
  const pending = await upload(); assert.equal((await publish(pending.json.id)).status, 409);
  await db.portalCaseAccess.updateMany({ where: { caseId: record.id }, data: { revokedAt: null } });
  await db.portalUser.update({ where: { id: customer.id }, data: { status: 'DISABLED' } });
  assert.equal((await request(publicRoute() + '/' + draftId, portalCookie)).status, 404);
  await db.portalUser.update({ where: { id: customer.id }, data: { status: 'ACTIVE' } });
});
test('reassignment removes previous manager access and preserves owner access', async () => {
  await db.case.update({ where: { id: record.id }, data: { assignedOperator: other.id } });
  assert.equal((await request(route() + '/' + draftId, managerCookie)).status, 404);
  assert.equal((await request(route() + '/' + draftId, ownerCookie)).status, 200);
  assert.equal((await request(route(), otherCookie)).status, 200);
});
