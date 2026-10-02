/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createHash, randomUUID } from 'node:crypto';
import { writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertDbTestAllowed, getDbTestConnectionString } from './db-test-guard.ts';
import { hashAdminPassword } from '../src/lib/admin-password.ts';
assertDbTestAllowed({ scriptName: 'test-portal-performance-http' });
const base = process.env.PORTAL_PERFORMANCE_TEST_URL || 'http://127.0.0.1:3260';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: getDbTestConnectionString()!.value }) });
const run = randomUUID().slice(0, 8); const groups: any[] = []; const caseIds: string[] = [];
const timings: any[] = [];
async function read(path: string, group: any) {
  const start = performance.now(); const response = await fetch(base + path, { headers: { cookie: group.cookie } }); const text = await response.text();
  return { response, text, data: JSON.parse(text), ms: performance.now() - start };
}
before(async () => {
  const passwordHash = await hashAdminPassword('Portal-Performance-Test-123!');
  for (const count of [0, 3, 100]) {
    const email = `performance-${count}-${run}@pixelring.test`;
    const user = await db.portalUser.create({ data: { primaryEmail: email, primaryEmailNormalized: email, passwordHash, passwordSetAt: new Date(), displayName: 'Performance test' } });
    const token = randomUUID(); const session = await db.session.create({ data: { tokenHash: createHash('sha256').update(token).digest('hex'), scope: 'PORTAL_AUTH', portalUserId: user.id,
      contactMethod: 'EMAIL', contactValue: email, verifiedAt: new Date(), lastSeenAt: new Date(), expiresAt: new Date(Date.now() + 3600_000) } });
    const group: any = { user, session, count, cookie: 'pixelring_portal_session=' + token, cases: [] }; groups.push(group);
    for (let index = 0; index < count; index++) {
      const number = `PR-PERF-${count}-${run.toUpperCase()}-${String(index).padStart(4, '0')}`;
      const record = await db.case.create({ data: { publicRequestNumber: number, originChannel: 'WEBSITE_FORM', status: index % 2 ? 'COMPLETED' : 'IN_PROGRESS', aiEnabled: false,
        locale: 'de', summary: 'INTERNAL-CRM-SECRET-' + run,
        portalCaseAccesses: { create: { portalUserId: user.id, source: 'CLAIM_LINK' } } } });
      group.cases.push(record); caseIds.push(record.id);
      const length = count === 100 ? (index === 0 ? 250 : 60) : 3;
      const start = Date.now() - 1000_000;
      await db.message.createMany({ data: Array.from({ length }, (_, i) => ({ id: randomUUID(), caseId: record.id, channel: 'WEBSITE_CHAT', authorRole: i % 2 ? 'OPERATOR' as const : 'CUSTOMER' as const,
        body: i === 0 ? '   ' : i === 2 ? 'Kundenportal-Link: /portal/claim?token=PRIVATE-' + run : i === 4 ? 'Opening request ' + index : 'Customer-safe message ' + i,
        isCustomerVisible: true, createdAt: new Date(start + i * 1000) })) });
      await db.message.create({ data: { caseId: record.id, channel: 'WEBSITE_CHAT', authorRole: 'OPERATOR', body: 'INTERNAL-NOTE-SECRET-' + run, isCustomerVisible: false } });
    }
  }
});
after(async () => {
  await writeFile('/tmp/portal-performance-http-results.json', JSON.stringify(timings, null, 2));
  if (process.env.PORTAL_PERF_KEEP_FIXTURES === '1') await writeFile('/tmp/portal-performance-fixtures.json', JSON.stringify(groups, null, 2));
  else { await db.case.deleteMany({ where: { id: { in: caseIds } } }); await db.portalUser.deleteMany({ where: { id: { in: groups.map(row => row.user.id) } } }); }
  await db.$disconnect();
});
test('0, 3 and 100 requests have bounded summaries, correct totals and no correspondence payload', async () => {
  for (const group of groups) {
    const result = await read('/api/portal/requests', group); assert.equal(result.response.status, 200, result.text);
    const org = result.data.organization; assert.equal(org.requests.length, Math.min(group.count, 20));
    assert.equal(org.pagination.totalRequests, group.count); assert.equal(org.pagination.activeRequests, Math.ceil(group.count / 2));
    assert.equal(org.messages.length, 0); assert.equal(org.customerAttachments.length, 0); assert.equal(org.requestTimeline.length, 0);
    assert(!result.text.includes('INTERNAL-')); assert(!result.text.includes('PRIVATE-'));
    assert.match(result.response.headers.get('cache-control') || '', /no-store/); assert.match(result.response.headers.get('server-timing') || '', /auth;dur=.*data;dur=/);
    timings.push({ count: group.count, bytes: Buffer.byteLength(result.text) });
  }
});
test('all 100 requests remain reachable across pages and active filtering', async () => {
  const group = groups[2], ids = new Set<string>();
  for (let page = 1; page <= 5; page++) { const result = await read('/api/portal/requests?page=' + page, group); result.data.organization.requests.forEach((row: any) => ids.add(row.id)); }
  assert.equal(ids.size, 100);
  const active = await read('/api/portal/requests?active=1', group); assert.equal(active.data.organization.pagination.total, 50);
  assert(active.data.organization.requests.every((row: any) => row.status !== 'COMPLETED'));
  assert.equal((await read('/api/portal/requests?page=-1', group)).response.status, 400);
});
test('one detail loads only its latest 50 messages and keeps the original safe title', async () => {
  const group = groups[2], record = group.cases[0];
  const result = await read('/api/portal/requests/' + record.publicRequestNumber, group); assert.equal(result.response.status, 200, result.text);
  assert.equal(result.data.detail.messages.length, 50); assert.equal(result.data.detail.organization.requests.length, 1);
  assert.equal(result.data.detail.request.title, 'Opening request 0'); assert(!result.text.includes('INTERNAL-')); assert(!result.text.includes('PRIVATE-'));
  const ids = new Set(result.data.detail.messages.map((row: any) => row.id)); let cursor = result.data.detail.messageBefore;
  while (cursor) { const page = await read('/api/portal/requests/' + record.publicRequestNumber + '/messages?before=' + cursor, group); assert.equal(page.response.status, 200); page.data.messages.forEach((row: any) => { assert(!ids.has(row.id)); ids.add(row.id); }); cursor = page.data.before; }
  assert.equal(ids.size, 249); // only the internal claim message is excluded from the 250 visible rows
  const foreignCursor = groups[1].cases[0];
  const foreignMessage = await db.message.findFirstOrThrow({ where: { caseId: foreignCursor.id } });
  assert.equal((await read('/api/portal/requests/' + record.publicRequestNumber + '/messages?before=' + foreignMessage.id, group)).response.status, 404);
});
test('each GET revalidates session and request grants, including after a successful read', async () => {
  const group = groups[2], record = group.cases[1]; const path = '/api/portal/requests/' + record.publicRequestNumber;
  assert.equal((await read(path, groups[1])).response.status, 404);
  await db.portalCaseAccess.update({ where: { portalUserId_caseId: { portalUserId: group.user.id, caseId: record.id } }, data: { revokedAt: new Date() } });
  assert.equal((await read(path, group)).response.status, 404); assert.equal((await read(path + '/messages', group)).response.status, 404);
  await db.portalCaseAccess.update({ where: { portalUserId_caseId: { portalUserId: group.user.id, caseId: record.id } }, data: { revokedAt: null } });
  const before = await db.session.findUniqueOrThrow({ where: { id: group.session.id } });
  await read('/api/portal/requests', group); const recent = await db.session.findUniqueOrThrow({ where: { id: group.session.id } }); assert.equal(recent.lastSeenAt?.getTime(), before.lastSeenAt?.getTime());
  await db.session.update({ where: { id: group.session.id }, data: { revokedAt: new Date() } });
  assert.equal((await read('/api/portal/requests', group)).response.status, 401);
  const token = await fetch(base + '/api/portal/realtime-token', { method: 'POST', headers: { cookie: group.cookie, origin: base } }); assert.equal(token.status, 401);
  await db.session.update({ where: { id: group.session.id }, data: { revokedAt: null } });
});
test('six localized pages render a private request safely, including Arabic direction', async () => {
  for (const locale of ['de', 'en', 'ru', 'tr', 'pl', 'ar']) {
    const group = groups[2], record = group.cases[0];
    const response = await fetch(base + '/' + locale + '/portal/requests/' + record.publicRequestNumber, { headers: { cookie: group.cookie } });
    const html = await response.text(); assert.equal(response.status, 200); assert(html.includes('Opening request 0')); assert(!html.includes('INTERNAL-CRM-SECRET')); assert(!html.includes('INTERNAL-NOTE-SECRET')); assert(!html.includes('PRIVATE-' + run));
    if (locale === 'ar') assert(html.includes('dir="rtl"'));
  }
});
test('saved event is delivered before a deliberately slow AI response; JSON clients still work', async () => {
  const group = groups[1], record = group.cases[0]; await db.case.update({ where: { id: record.id }, data: { aiEnabled: true } });
  const start = performance.now(); const response = await fetch(base + '/api/portal/requests/' + record.publicRequestNumber + '/messages', { method: 'POST', headers: { cookie: group.cookie, origin: base, accept: 'application/x-ndjson', 'content-type': 'application/json' }, body: JSON.stringify({ body: 'Please check the sign condition carefully.' }) });
  assert.equal(response.status, 200); const reader = response.body!.getReader(); const first = await reader.read(); const ackMs = performance.now() - start;
  const firstEvent = JSON.parse(new TextDecoder().decode(first.value).trim().split('\n')[0]); assert.equal(firstEvent.type, 'saved'); assert.equal(firstEvent.result.assistantPending, true); assert(ackMs < 1500, `ack ${ackMs}ms`);
  assert(await db.message.findUnique({ where: { id: firstEvent.result.message.id } }));
  let rest = ''; while (true) { const part = await reader.read(); if (part.done) break; rest += new TextDecoder().decode(part.value); }
  assert(rest.includes('"type":"complete"')); assert(performance.now() - start >= 3000);
  await db.case.update({ where: { id: record.id }, data: { aiEnabled: false } });
  const legacy = await fetch(base + '/api/portal/requests/' + record.publicRequestNumber + '/messages', { method: 'POST', headers: { cookie: group.cookie, origin: base, 'content-type': 'application/json' }, body: JSON.stringify({ body: 'Legacy JSON message delivery.' }) });
  const data = await legacy.json(); assert.equal(data.success, true); assert(data.message.id); assert.equal(data.assistantMessage, null);
  timings.push({ messageSaveAckMs: Math.round(ackMs), aiCompletionMs: Math.round(performance.now() - start) });
});
test('disconnect after acknowledgement preserves the message, file and eventual assistant reply', async () => {
  const group = groups[1], record = group.cases[0];
  await db.case.update({ where: { id: record.id }, data: { aiEnabled: true } });
  const before = await db.message.count({ where: { caseId: record.id, authorRole: 'SYSTEM' } });
  const photo = await sharp({ create: { width: 16, height: 16, channels: 3, background: '#b8643e' } }).png().toBuffer();
  const form = new FormData(); form.set('message', 'Please review this sign photograph.'); form.set('files', new Blob([photo], { type: 'image/png' }), 'disconnect-test.png');
  const response = await fetch(base + '/api/portal/requests/' + record.publicRequestNumber + '/messages', { method: 'POST', headers: { cookie: group.cookie, origin: base, accept: 'application/x-ndjson' }, body: form });
  assert.equal(response.status, 200); const reader = response.body!.getReader(); const first = await reader.read();
  const ack = JSON.parse(new TextDecoder().decode(first.value).trim().split('\n')[0]); assert.equal(ack.type, 'saved'); assert.equal(ack.result.message.attachments.length, 1);
  await reader.cancel(); await new Promise(resolve => setTimeout(resolve, 4500));
  const saved = await db.message.findUniqueOrThrow({ where: { id: ack.result.message.id }, include: { attachments: true } });
  assert.equal(saved.attachments.length, 1); const attachment = saved.attachments[0];
  if (attachment.storageProvider === 'LOCAL') assert((await stat((process.env.ATTACHMENT_STORAGE_DIR || '/tmp/portal-performance-files') + '/' + attachment.storageKey)).size > 0);
  assert.equal(await db.message.count({ where: { caseId: record.id, authorRole: 'SYSTEM' } }), before + 1);
  await db.case.update({ where: { id: record.id }, data: { aiEnabled: false } });
});
test('an uncertain or concurrent retry stores one message and never replays another account', async () => {
  const group = groups[1], record = group.cases[0], messageId = randomUUID();
  const send = (actor: any, body: string, retry = false) => fetch(base + '/api/portal/requests/' + record.publicRequestNumber + '/messages', { method: 'POST', headers: { cookie: actor.cookie, origin: base, 'content-type': 'application/json' }, body: JSON.stringify({ body, messageId, retry }) });
  const priorVersion = (await db.portalOperatorAlertState.findUnique({ where: { caseId: record.id } }))?.latestVersion || 0;
  const responses = await Promise.all([send(group, 'Exactly one durable message.'), send(group, 'Exactly one durable message.')]);
  for (const response of responses) { assert.equal(response.status, 200); assert.equal((await response.json()).message.id, messageId); }
  assert.equal(await db.message.count({ where: { id: messageId } }), 1);
  const replay = await send(group, 'A retry does not replace the stored payload.', true); const data = await replay.json(); assert.equal(data.message.body, 'Exactly one durable message.');
  assert.equal((await db.portalOperatorAlertState.findUniqueOrThrow({ where: { caseId: record.id } })).latestVersion, priorVersion + 1);
  const denied = await send(groups[0], 'Exactly one durable message.', true); assert.equal(denied.status, 404); assert(!(await denied.text()).includes('Exactly one durable message.'));
});
test('twenty warmed reads per scenario produce repeatable p95 and response size measurements', async () => {
  for (const group of groups) {
    const paths = ['/api/portal/requests', ...(group.count ? ['/api/portal/requests/' + group.cases[0].publicRequestNumber] : [])];
    for (const path of paths) { const samples: number[] = []; let bytes = 0; await read(path, group);
      for (let i = 0; i < 20; i++) { const result = await read(path, group); assert.equal(result.response.status, 200); samples.push(result.ms); bytes = Buffer.byteLength(result.text); }
      samples.sort((a,b) => a-b); timings.push({ count: group.count, kind: path === '/api/portal/requests' ? 'summary' : 'detail', samples: 20, p50Ms: Math.round(samples[9]), p95Ms: Math.round(samples[18]), bytes });
    }
  }
});
