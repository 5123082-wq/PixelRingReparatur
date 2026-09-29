/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertDbTestAllowed, getDbTestConnectionString } from './db-test-guard.ts';
import { hashAdminPassword } from '../src/lib/admin-password.ts';
assertDbTestAllowed({ scriptName: 'test-portal-attention' });
const base = process.env.DOCUMENT_TEST_URL || 'http://127.0.0.1:3260';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: getDbTestConnectionString()!.value }) });
const run = randomUUID().slice(0, 8);
let manager: any, other: any, customer: any, record: any, unrelated: any;
let sessionId = '';
let ownerCookie = '', managerCookie = '', otherCookie = '', portalCookie = '';
const csrf = { 'x-pixelring-admin-csrf': '1', origin: base, 'x-forwarded-for': `127.${parseInt(run.slice(0,2),16)}.${parseInt(run.slice(2,4),16)}.${parseInt(run.slice(4,6),16)}` };
const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n');
const route = () => '/api/admin/cases/' + record.id + '/documents';
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
  const session = await db.session.create({ data: { tokenHash: createHash('sha256').update(token).digest('hex'), scope: 'PORTAL_AUTH', portalUserId: customer.id, contactMethod: 'EMAIL', contactValue: email, verifiedAt: new Date(), expiresAt: new Date(Date.now() + 3600_000) } });
  sessionId = session.id;
  portalCookie = 'pixelring_portal_session=' + token;
  const code = randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase();
  record = await db.case.create({ data: { publicRequestNumber: 'PR-' + code.slice(0, 4) + '-' + code.slice(4), status: 'UNDER_REVIEW', originChannel: 'MANUAL', assignedOperator: manager.id, locale: 'ru' } });
  unrelated = await db.case.create({ data: { publicRequestNumber: 'PR-' + run.toUpperCase().slice(0, 4) + '-ZZZZ', originChannel: 'MANUAL', assignedOperator: other.id } });
  await db.portalCaseAccess.create({ data: { caseId: record.id, portalUserId: customer.id, source: 'ADMIN' } });
});
after(async () => { await db.$disconnect(); });

const inbox = () => '/api/portal/attention?locale=ru&publicRequestNumber=' + record.publicRequestNumber;
const staff = () => '/api/admin/cases/' + record.id + '/attention';
const mutate = (id: string, body: unknown, cookie = portalCookie) => request('/api/portal/attention/' + id, cookie, 'POST', body);
let firstId = '', replyId = '', uploadTaskId = '';
test('two documents and explicit request accumulate even for a closed case', async () => {
  await db.case.update({ where: { id: record.id }, data: { status: 'COMPLETED' } });
  for (let i = 0; i < 2; i++) {
    const uploaded = await upload(); assert.equal(uploaded.status, 200, uploaded.text);
    const sent = await publish(uploaded.json.id); assert.equal(sent.status, 200, sent.text);
    const retry = await publish(uploaded.json.id); assert.equal(retry.status, 200);
  }
  const id = randomUUID();
  const created = await request(staff(), managerCookie, 'POST', { action: 'create', id, title: 'Уточните время доступа', body: 'Сообщите время', mode: 'REPLY' });
  assert.equal(created.status, 200, created.text);
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'create', id, title: 'Уточните время доступа', body: 'Сообщите время', mode: 'REPLY' })).status, 200);
  assert.equal((await request(staff(), ownerCookie)).status, 200);
  const response = await request(inbox(), portalCookie);
  assert.equal(response.status, 200, response.text); assert.equal(response.json.openCount, 3); assert.equal(response.json.unreadCount, 3);
  firstId = response.json.items.find((row: any) => row.kind === 'DOCUMENT').id;
  replyId = response.json.items.find((row: any) => row.kind === 'REQUEST').id;
  assert.equal(await db.portalAttentionEmail.count({ where: { attention: { caseId: record.id } } }), 3);
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: record.id } })).status, 'COMPLETED');
  assert.equal(response.text.includes('storageKey'), false); assert.equal(response.text.includes('primaryEmail'), false);
});
test('read is independent; explicit acknowledgement closes only one task and is repeat safe', async () => {
  assert.equal((await mutate(firstId, { action: 'read' })).status, 200);
  let response = await request(inbox(), portalCookie); assert.equal(response.json.openCount, 3); assert.equal(response.json.unreadCount, 2);
  assert.equal((await mutate(firstId, { action: 'acknowledge' })).status, 200);
  const completed = await db.portalAttention.findUniqueOrThrow({ where: { id: firstId } });
  assert.equal((await mutate(firstId, { action: 'acknowledge' })).status, 200);
  assert.equal((await db.portalAttention.findUniqueOrThrow({ where: { id: firstId } })).completedAt?.toISOString(), completed.completedAt?.toISOString());
  response = await request(inbox(), portalCookie); assert.equal(response.json.openCount, 2);
  assert.equal(response.json.items.some((row: any) => row.id === firstId && row.state === 'COMPLETED'), true);
});
test('a reply requires own real evidence; staff verifies it before completion', async () => {
  assert.equal((await mutate(replyId, { action: 'acknowledge' })).status, 409);
  assert.equal((await mutate(replyId, { action: 'submit', messageId: randomUUID() })).status, 400);
  const old = await db.message.create({ data: { caseId: record.id, sessionId, authorRole: 'CUSTOMER', channel: 'WEBSITE_CHAT', isCustomerVisible: true, body: 'Old answer', createdAt: new Date('2020-01-01') } });
  assert.equal((await mutate(replyId, { action: 'submit', messageId: old.id })).status, 400);
  const wrongCase = await db.message.create({ data: { caseId: unrelated.id, sessionId, authorRole: 'CUSTOMER', channel: 'WEBSITE_CHAT', isCustomerVisible: true, body: 'Other case' } });
  assert.equal((await mutate(replyId, { action: 'submit', messageId: wrongCase.id })).status, 400);
  const response = await request('/api/portal/requests/' + record.publicRequestNumber + '/messages', portalCookie, 'POST', { body: 'В пятницу после 14:00' });
  assert.equal(response.status, 200, response.text);
  assert.equal((await mutate(replyId, { action: 'submit', messageId: response.json.message.id })).status, 200);
  assert.equal((await db.portalAttention.findUniqueOrThrow({ where: { id: replyId } })).state, 'SUBMITTED');
  assert.equal((await request(staff(), otherCookie, 'POST', { action: 'complete', id: replyId })).status, 404);
  const submitted = await db.portalAttention.findUniqueOrThrow({ where: { id: replyId } });
  assert.equal((await mutate(replyId, { action: 'submit', messageId: response.json.message.id })).status, 200);
  const replacement = await db.message.create({ data: { caseId: record.id, sessionId, authorRole: 'CUSTOMER', channel: 'WEBSITE_CHAT', isCustomerVisible: true, body: 'Replacement response' } });
  assert.equal((await mutate(replyId, { action: 'submit', messageId: replacement.id })).status, 409);
  const unchanged = await db.portalAttention.findUniqueOrThrow({ where: { id: replyId } });
  assert.equal(unchanged.evidenceId, response.json.message.id);
  assert.equal(unchanged.submittedAt?.toISOString(), submitted.submittedAt?.toISOString());
  const staffItem = (await request(staff(), managerCookie)).json.items.find((item: any) => item.id === replyId);
  assert.deepEqual(staffItem.evidence, { id: response.json.message.id, kind: 'REPLY', body: 'В пятницу после 14:00', createdAt: response.json.message.createdAt });
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'complete', id: replyId })).status, 409);
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'complete', id: replyId, evidenceId: replacement.id })).status, 409);
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'complete', id: replyId, evidenceId: response.json.message.id })).status, 200);
  assert.equal((await request(inbox(), portalCookie)).json.openCount, 1);
});
test('informational documents do not create required tasks; photo requests require uploads', async () => {
  const uploaded = await upload();
  assert.equal((await request(route(), managerCookie, 'POST', { action: 'publish', id: uploaded.json.id, type: 'OTHER', title: 'Для сведения', comment: '', attentionMode: 'NONE' })).status, 200);
  assert.equal((await request(inbox(), portalCookie)).json.openCount, 1);
  const id = randomUUID();
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'create', id, title: 'Фото вывески', body: '', mode: 'UPLOAD' })).status, 200);
  uploadTaskId = (await request(inbox(), portalCookie)).json.items.find((row: any) => row.sourceId === id).id;
  const message = await db.message.create({ data: { caseId: record.id, sessionId, authorRole: 'CUSTOMER', channel: 'WEBSITE_CHAT', isCustomerVisible: true, body: 'Фото' } });
  assert.equal((await mutate(uploadTaskId, { action: 'submit', messageId: message.id })).status, 400);
  const attachment = await db.attachment.create({ data: { caseId: record.id, messageId: message.id, uploadedBySessionId: sessionId, mimeType: 'image/png', kind: 'IMAGE', storageKey: 'isolated-test-image-' + randomUUID(), storageProvider: 'LOCAL', byteSize: 1, isCustomerVisible: true } });
  for (const [kind, mimeType] of [['VIDEO', 'video/mp4'], ['IMAGE', 'image/svg+xml'], ['VIDEO', 'image/png']]) {
    const invalid = await db.attachment.create({ data: { caseId: record.id, messageId: message.id, uploadedBySessionId: sessionId, mimeType, kind: kind as any, storageKey: 'invalid-photo-' + randomUUID(), storageProvider: 'LOCAL', byteSize: 1, isCustomerVisible: true } });
    assert.equal((await mutate(uploadTaskId, { action: 'submit', attachmentId: invalid.id })).status, 400);
  }
  assert.equal((await mutate(uploadTaskId, { action: 'submit', attachmentId: attachment.id })).status, 200);
  const staffPhoto = (await request(staff(), managerCookie)).json.items.find((item: any) => item.id === uploadTaskId);
  assert.equal(staffPhoto.evidence.id, attachment.id);
  assert.equal(staffPhoto.evidence.href, '/api/admin/attachments/' + attachment.id);
  assert.equal(JSON.stringify(staffPhoto).includes(attachment.storageKey), false);
  await db.attachment.update({ where: { id: attachment.id }, data: { isCustomerVisible: false } });
  assert.equal((await request(staff(), managerCookie)).json.items.find((item: any) => item.id === uploadTaskId).evidence, null);
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'complete', id: uploadTaskId, evidenceId: attachment.id })).status, 409);
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'cancel', id: uploadTaskId })).status, 200);
  assert.equal((await mutate(uploadTaskId, { action: 'submit', attachmentId: attachment.id })).status, 409);
});
test('access checks, CSRF, language preference and recipient isolation', async () => {
  assert.equal((await request(inbox())).status, 401);
  const denied = await fetch(base + '/api/portal/attention/' + firstId, { method: 'POST', headers: { cookie: portalCookie, origin: 'https://untrusted.test', 'content-type': 'application/json' }, body: JSON.stringify({ action: 'read' }) });
  assert.equal(denied.status, 403);
  assert.equal((await request('/api/portal/attention', portalCookie, 'POST', { locale: 'ar' })).status, 200);
  assert.equal((await db.portalUser.findUniqueOrThrow({ where: { id: customer.id } })).preferredLocale, 'ar');
  assert.equal((await request('/api/portal/attention', portalCookie, 'POST', { locale: 'xx' })).status, 400);
  const secondEmail = 'attention-second-' + run + '@pixelring.test';
  const second = await db.portalUser.create({ data: { primaryEmail: secondEmail, primaryEmailNormalized: secondEmail } });
  const token = randomUUID();
  const otherSession = await db.session.create({ data: { tokenHash: createHash('sha256').update(token).digest('hex'), scope: 'PORTAL_AUTH', portalUserId: second.id, contactMethod: 'EMAIL', contactValue: secondEmail, verifiedAt: new Date(), expiresAt: new Date(Date.now() + 3600000) } });
  await db.portalCaseAccess.create({ data: { portalUserId: second.id, caseId: record.id, source: 'ADMIN' } });
  const secondCookie = 'pixelring_portal_session=' + token;
  assert.equal((await mutate(firstId, { action: 'read' }, secondCookie)).status, 404);
  const fakeEvidence = await db.message.create({ data: { caseId: record.id, sessionId: otherSession.id, authorRole: 'CUSTOMER', channel: 'WEBSITE_CHAT', isCustomerVisible: true, body: 'Other client response' } });
  const taskId = randomUUID();
  assert.equal((await request(staff(), managerCookie, 'POST', { action: 'create', id: taskId, title: 'Отдельное подтверждение', body: '', mode: 'REPLY' })).status, 200);
  const own = (await request(inbox(), portalCookie)).json.items.find((row: any) => row.sourceId === taskId);
  assert.equal((await mutate(own.id, { action: 'submit', messageId: fakeEvidence.id })).status, 400);
  const secondInbox = await request(inbox(), secondCookie); assert.equal(secondInbox.json.openCount, 1);
  await db.portalCaseAccess.updateMany({ where: { portalUserId: customer.id, caseId: record.id }, data: { revokedAt: new Date() } });
  assert.equal((await request(inbox(), portalCookie)).json.items.length, 0);
  assert.equal((await mutate(own.id, { action: 'read' })).status, 404);
  await db.portalCaseAccess.updateMany({ where: { portalUserId: customer.id, caseId: record.id }, data: { revokedAt: null } });
  await db.portalUser.update({ where: { id: customer.id }, data: { status: 'DISABLED' } });
  assert.equal((await request(inbox(), portalCookie)).status, 401);
  await db.portalUser.update({ where: { id: customer.id }, data: { status: 'ACTIVE' } });
});

test('explicit task responses skip intake AI and reject invalid task context before storing', async () => {
  await db.case.update({ where: { id: record.id }, data: { aiEnabled: true } });
  const task = await db.portalAttention.create({ data: { caseId: record.id, portalUserId: customer.id, sourceKey: randomUUID(), sourceId: randomUUID(), kind: 'REQUEST', title: 'Confirm access', mode: 'REPLY' } });
  const path = '/api/portal/requests/' + record.publicRequestNumber + '/messages';
  const before = await db.message.count({ where: { caseId: record.id } });
  const beforeAttachments = await db.attachment.count({ where: { caseId: record.id } });
  const reply = await request(path, portalCookie, 'POST', { body: 'Access confirmed for tomorrow', attentionId: task.id });
  assert.equal(reply.status, 200, reply.text); assert.equal(reply.json.assistantMessage, null);
  assert.equal(await db.message.count({ where: { caseId: record.id } }), before + 1);
  assert.equal((await db.portalAttention.findUniqueOrThrow({ where: { id: task.id } })).state, 'OPEN');
  assert.equal((await db.case.findUniqueOrThrow({ where: { id: record.id } })).aiEnabled, true);
  const form = new FormData(); form.set('message', 'Another task answer'); form.set('attentionId', task.id);
  const multipart = await request(path, portalCookie, 'POST', form);
  assert.equal(multipart.status, 200, multipart.text); assert.equal(multipart.json.assistantMessage, null);
  const foreignTask = await db.portalAttention.create({ data: { caseId: unrelated.id, portalUserId: customer.id, sourceKey: randomUUID(), sourceId: randomUUID(), kind: 'REQUEST', title: 'Other case', mode: 'REPLY' } });
  for (const attentionId of ['invalid', randomUUID(), foreignTask.id]) {
    const invalid = new FormData(); invalid.set('attentionId', attentionId); invalid.set('message', 'Should not persist'); invalid.set('files', new Blob(['not an image'], { type: 'image/png' }), 'invalid.png');
    assert.equal((await request(path, portalCookie, 'POST', invalid)).status, 409);
  }
  await db.portalAttention.update({ where: { id: task.id }, data: { state: 'CANCELLED' } });
  assert.equal((await request(path, portalCookie, 'POST', { body: 'Stale answer', attentionId: task.id })).status, 409);
  assert.equal(await db.message.count({ where: { caseId: record.id } }), before + 2);
  assert.equal(await db.attachment.count({ where: { caseId: record.id } }), beforeAttachments);
  await db.case.update({ where: { id: record.id }, data: { aiEnabled: false } });
  assert.equal((await request(path, portalCookie, 'POST', { body: 'Normal unbound message' })).status, 200);
});
