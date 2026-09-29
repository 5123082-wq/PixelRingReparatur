import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { createServer, type Socket } from 'node:net';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertDbTestAllowed, getDbTestConnectionString } from './db-test-guard.ts';
assertDbTestAllowed({ scriptName: 'test-attention-email-e2e' });
const connection = getDbTestConnectionString()!.value;
assert(['127.0.0.1', 'localhost'].includes(new URL(connection).hostname), 'This email test requires a local disposable database');
const base = process.env.ATTENTION_TEST_URL || 'http://127.0.0.1:3260';
assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const secret = process.env.CRON_SECRET || 'isolated-attention-cron-test-secret';
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: connection }) });
const received: string[] = [];
const sockets = new Set<Socket>();
let rejectMail = false;
const server = createServer(socket => {
  sockets.add(socket); socket.on('close', () => sockets.delete(socket));
  socket.write('220 localhost test SMTP\r\n');
  let buffer = '', data = false, message = '';
  socket.on('data', chunk => {
    buffer += chunk.toString();
    while (buffer.includes('\r\n')) {
      const index = buffer.indexOf('\r\n'); const line = buffer.slice(0, index); buffer = buffer.slice(index + 2);
      if (data) {
        if (line === '.') { received.push(message); data = false; message = ''; socket.write('250 queued locally\r\n'); }
        else message += line + '\r\n';
      } else if (/^EHLO|^HELO/.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
      else if (/^AUTH/.test(line)) socket.write('235 authenticated\r\n');
      else if (/^MAIL FROM/.test(line)) socket.write(rejectMail ? '451 temporary test failure\r\n' : '250 OK\r\n');
      else if (/^RCPT TO|^RSET/.test(line)) socket.write('250 OK\r\n');
      else if (line === 'DATA') { data = true; socket.write('354 end with dot\r\n'); }
      else if (line === 'QUIT') { socket.end('221 bye\r\n'); }
      else socket.write('250 OK\r\n');
    }
  });
});
let caseId = '', userId = '';
before(async () => {
  await new Promise<void>(resolve => server.listen(25260, '127.0.0.1', resolve));
  const run = randomUUID().slice(0, 8), email = `mail-${run}@pixelring.test`;
  const user = await db.portalUser.create({ data: { primaryEmail: email, primaryEmailNormalized: email, preferredLocale: 'ru', emails: { create: { email, emailNormalized: email, verifiedAt: new Date() } } } });
  userId = user.id;
  const record = await db.case.create({ data: { publicRequestNumber: `PR-MAIL-${run.toUpperCase()}`, originChannel: 'MANUAL', locale: 'de' } });
  caseId = record.id;
  await db.portalCaseAccess.create({ data: { caseId, portalUserId: userId, source: 'ADMIN' } });
});
after(async () => { if (caseId) await db.case.delete({ where: { id: caseId } }); if (userId) await db.portalUser.delete({ where: { id: userId } }); await db.$disconnect(); for (const socket of sockets) socket.destroy(); await new Promise<void>(resolve => server.close(() => resolve())); });
async function enqueue() {
  const user = await db.portalUser.findUniqueOrThrow({ where: { id: userId } });
  const attention = await db.portalAttention.create({ data: { caseId, portalUserId: userId, sourceKey: randomUUID(), sourceId: randomUUID(), kind: 'DOCUMENT', documentType: 'INVOICE', title: 'Тестовый счёт', mode: 'ACKNOWLEDGE' } });
  return db.portalAttentionEmail.create({ data: { attentionId: attention.id, email: user.primaryEmailNormalized, locale: 'de' } });
}
async function dispatch(authorization = `Bearer ${secret}`) { return fetch(base + '/api/cron/portal-attention', { headers: { authorization } }); }
test('cron refuses missing credentials before dispatch', async () => { assert.equal((await dispatch('')).status, 401); });
test('concurrent worker invocations send once, use preferred locale and protected request link', async () => {
  const row = await enqueue();
  const responses = await Promise.all([dispatch(), dispatch()]); for (const response of responses) assert.equal(response.status, 200, await response.text());
  const saved = await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: row.id } });
  assert.equal(saved.state, 'SENT'); assert.equal(saved.attempts, 1); assert.ok(saved.providerId);
  const matching = received.filter(message => message.includes(`portal-attention-${row.id}@pixel-ring.com`));
  assert.equal(matching.length, 1);
  assert.match(matching[0], /lang=3D"ru"|lang="ru"/); assert.match(matching[0], /attention/); assert.doesNotMatch(matching[0], /Content-Disposition: attachment/i);
  await dispatch(); assert.equal(received.filter(message => message.includes(`portal-attention-${row.id}@pixel-ring.com`)).length, 1);
});
test('temporary transport failure persists retry and does not close client action', async () => {
  const row = await enqueue(); rejectMail = true; await dispatch(); rejectMail = false;
  const saved = await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: row.id }, include: { attention: true } });
  assert.equal(saved.state, 'FAILED'); assert.equal(saved.attention.state, 'OPEN'); assert.ok(saved.nextAttemptAt > new Date());
  await dispatch(); assert.equal((await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: row.id } })).attempts, 1);
  await db.portalAttentionEmail.update({ where: { id: row.id }, data: { nextAttemptAt: new Date(0) } }); await dispatch();
  assert.equal((await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: row.id } })).state, 'SENT');
});
test('revoked grants and disabled or no-longer-verified accounts are skipped without email', async () => {
  const beforeCount = received.length;
  const revoked = await enqueue(); await db.portalCaseAccess.updateMany({ where: { caseId }, data: { revokedAt: new Date() } }); await dispatch();
  assert.equal((await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: revoked.id } })).state, 'SKIPPED');
  await db.portalCaseAccess.updateMany({ where: { caseId }, data: { revokedAt: null } });
  const disabled = await enqueue(); await db.portalUser.update({ where: { id: userId }, data: { status: 'DISABLED' } }); await dispatch();
  assert.equal((await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: disabled.id } })).state, 'SKIPPED');
  await db.portalUser.update({ where: { id: userId }, data: { status: 'ACTIVE' } });
  const unverified = await enqueue(); await db.portalUserEmail.updateMany({ where: { portalUserId: userId }, data: { verifiedAt: new Date(Date.now() + 3600_000) } }); await dispatch();
  assert.equal((await db.portalAttentionEmail.findUniqueOrThrow({ where: { id: unverified.id } })).state, 'SKIPPED');
  assert.equal(received.length, beforeCount);
});
