import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { registerHooks, createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import ts from 'typescript';
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

// Entire suite owns an in-memory database. No .env files or configured databases.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true };
    if (specifier === 'next/server') return { url: 'data:text/javascript,' + encodeURIComponent(`export { NextRequest, NextResponse } from '${pathToFileURL(require.resolve('next/server.js')).href}'; export function after(fn) { globalThis.cancellationAfter.push(fn); }`), shortCircuit: true };
    if (specifier.startsWith('@/') || (specifier.startsWith('.') && context.parentURL?.startsWith('file:'))) {
      const base = specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2)) : path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
      for (const candidate of [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts')]) {
        if (/\.(ts|tsx)$/.test(candidate) && existsSync(candidate)) return { url: pathToFileURL(candidate).href, shortCircuit: true };
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith('file:') && /\.(ts|tsx)$/.test(url) && !url.includes('/node_modules/')) {
      return { format: 'module', shortCircuit: true, source: ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      }).outputText };
    }
    return next(url, context);
  },
});

const pg = await PGlite.create();
for (const name of readdirSync(path.join(root, 'prisma/migrations')).sort()) {
  const sql = path.join(root, 'prisma/migrations', name, 'migration.sql');
  if (existsSync(sql)) await pg.exec(readFileSync(sql, 'utf8'));
}
const server = new PGLiteSocketServer({ db: pg, host: '127.0.0.1', port: 55448, maxConnections: 20 });
await server.start();
Object.assign(process.env, { DATABASE_URL: 'postgresql://test:test@127.0.0.1:55448/cancellation_test',
  POSTGRES_PRISMA_URL: 'postgresql://test:test@127.0.0.1:55448/cancellation_test',
  ALLOW_DB_TESTS: '1', ABLY_API_KEY: '', TELEGRAM_BOT_TOKEN: '', TELEGRAM_ADMIN_CHAT_ID: '', OPENAI_API_KEY: '' });
globalThis.cancellationAfter = [];
const { PrismaClient } = await import('@prisma/client');
const { PrismaPg } = await import('@prisma/adapter-pg');
globalThis.prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 }) });
const { prisma: db } = await import('../src/lib/prisma.ts');
const { NextRequest } = await import('next/server.js');
const route = await import('../src/app/api/portal/requests/[publicRequestNumber]/cancellation/route.ts');
const listRoute = await import('../src/app/api/portal/requests/route.ts');
const adminRoute = await import('../src/app/api/admin/cases/[id]/route.ts');
const { requestPortalCancellation } = await import('../src/lib/portal/cancellation.ts');
const { getPortalOrganizationForUser, getPortalRequestDetailForUser } = await import('../src/lib/portal/production-data.ts');
const { advanceCaseStatus } = await import('../src/lib/case-status-transition.ts');
const { dispatchOperatorAlert } = await import('../src/lib/portal-operator/state.ts');
const { getCancellationCopy } = await import('../src/lib/portal/cancellation-copy.ts');
const { assertDbTestAllowed } = await import('./db-test-guard.ts');
assertDbTestAllowed({ scriptName: 'test-portal-cancellation' });
const email = 'cancellation@pixelring.test';
const user = await db.portalUser.create({ data: { primaryEmail: email, primaryEmailNormalized: email } });
const token = randomUUID();
const session = await db.session.create({ data: { portalUserId: user.id, tokenHash: createHash('sha256').update(token).digest('hex'),
  scope: 'PORTAL_AUTH', verifiedAt: new Date(), expiresAt: new Date(Date.now() + 3600000), contactMethod: 'EMAIL', contactValue: email } });
const cookie = 'pixelring_portal_session=' + token;
const manager = await db.adminUser.create({ data: { email: 'manager@pixelring.test', passwordHash: 'unused', role: 'MANAGER' } });
const adminToken = randomUUID();
const adminSession = await db.adminSession.create({ data: { adminUserId: manager.id, role: 'MANAGER',
  tokenHash: createHash('sha256').update(adminToken).digest('hex'), expiresAt: new Date(Date.now() + 3600000) } });
const actor = { sessionId: adminSession.id, adminUserId: manager.id, role: 'MANAGER', email: manager.email, displayName: null, ipAddress: null, userAgent: null };
const adminCookie = 'pixelring_crm_session=' + adminToken;
let serial = 0;
async function makeCase(status = 'UNDER_REVIEW', grant = true) {
  const code = (++serial).toString().padStart(4, '0');
  const row = await db.case.create({ data: { publicRequestNumber: 'PR-TEST-' + code, status, originChannel: 'WEBSITE_FORM', locale: 'ru', assignedOperator: manager.id } });
  if (grant) await db.portalCaseAccess.create({ data: { portalUserId: user.id, caseId: row.id, source: 'ADMIN' } });
  await db.message.create({ data: { caseId: row.id, authorRole: 'CUSTOMER', channel: 'WEBSITE_FORM', body: 'Ремонт вывески', isCustomerVisible: true } });
  return row;
}
function input(row, reason = 'Больше не актуально') { return { portalUserId: user.id, portalSessionId: session.id, publicRequestNumber: row.publicRequestNumber, reason, locale: 'ru' }; }
async function post(row, body = {}, extra = {}) {
  const request = new NextRequest('http://localhost:3000/api/portal/requests/' + row.publicRequestNumber + '/cancellation', {
    method: 'POST', headers: { cookie, origin: 'http://localhost:3000', 'content-type': 'application/json', 'x-forwarded-for': '198.51.100.' + (++serial), ...extra }, body: JSON.stringify(body),
  });
  const response = await route.POST(request, { params: Promise.resolve({ publicRequestNumber: row.publicRequestNumber }) });
  return { status: response.status, body: await response.json() };
}
after(async () => { await db.$disconnect(); await server.stop(); await pg.close(); });

test('parallel submissions create one request, one message and one audit; stage stays active', async () => {
  const row = await makeCase();
  const results = await Promise.all([requestPortalCancellation(db, input(row)), requestPortalCancellation(db, input(row))]);
  assert.equal(results.filter(result => result.changed).length, 1);
  const saved = await db.case.findUniqueOrThrow({ where: { id: row.id } });
  assert.equal(saved.status, 'UNDER_REVIEW'); assert.equal(saved.statusUpdatedAt, null);
  assert(saved.cancellationRequestedAt); assert.equal(saved.cancellationReason, 'Больше не актуально');
  assert.equal(await db.adminAuditLog.count({ where: { caseId: row.id, action: 'PORTAL_CASE_CANCELLATION_REQUESTED' } }), 1);
  assert.equal(await db.message.count({ where: { caseId: row.id, channel: 'WEBSITE_CHAT' } }), 1);
  const state = await db.portalOperatorAlertState.findUniqueOrThrow({ where: { caseId: row.id } });
  assert.equal(state.pendingReason, 'human_requested'); assert.equal(state.latestVersion, 1);
  let alerts = 0;
  await dispatchOperatorAlert(db, row.id, async () => { alerts++; return 'SENT'; });
  await dispatchOperatorAlert(db, row.id, async () => { alerts++; return 'SENT'; });
  assert.equal(alerts, 1);
  const detail = await getPortalRequestDetailForUser(db, user.id, email, row.publicRequestNumber, 'ru');
  assert(detail.detail.request.cancellationRequestedAt);
  assert.equal(detail.detail.request.status, 'UNDER_REVIEW');
  assert.equal(detail.detail.request.title, 'Ремонт вывески');
  assert(!JSON.stringify(detail).includes('portalSessionId'));
});
test('HTTP validation, authentication, CSRF and revoked/foreign access', async () => {
  const row = await makeCase();
  assert.equal((await post(row, {}, { cookie: '' })).status, 401);
  assert.equal((await post(row, {}, { origin: 'https://attacker.test' })).status, 403);
  for (const reason of [123, {}, 'x'.repeat(1001)]) assert.equal((await post(row, { reason })).status, 400);
  const foreign = await makeCase('UNDER_REVIEW', false);
  assert.equal((await post(foreign)).status, 404);
  await db.portalCaseAccess.updateMany({ where: { caseId: row.id }, data: { revokedAt: new Date() } });
  assert.equal((await post(row)).status, 404);
  assert.equal(await db.message.count({ where: { caseId: row.id, channel: 'WEBSITE_CHAT' } }), 0);
});
test('optional reason and all six locales; committed request survives a repeat', async () => {
  for (const locale of ['de', 'en', 'ru', 'tr', 'pl', 'ar']) {
    const row = await makeCase();
    assert.equal((await post(row, { locale })).status, 200);
    const message = await db.message.findFirstOrThrow({ where: { caseId: row.id, channel: 'WEBSITE_CHAT' } });
    assert.equal(message.body, getCancellationCopy(locale).message);
    assert.equal((await post(row, { reason: 'replacement', locale })).status, 200);
    assert.equal((await db.case.findUniqueOrThrow({ where: { id: row.id } })).cancellationReason, null);
  }
});
test('operator sees reason, unrelated manager cannot cancel, assigned manager confirms with audit and customer notification', async () => {
  const row = await makeCase(); await requestPortalCancellation(db, input(row));
  const response = await adminRoute.GET(new NextRequest('http://localhost:3000/api/admin/cases/' + row.id, { headers: { cookie: adminCookie } }), { params: Promise.resolve({ id: row.id }) });
  assert.equal(response.status, 200); const detail = (await response.json()).case;
  assert(detail.cancellationRequestedAt); assert.equal(detail.cancellationReason, 'Больше не актуально');
  const expected = { status: row.status, statusUpdatedAt: null, lastEventId: null };
  const stepId = randomUUID();
  await assert.rejects(advanceCaseStatus(row.id, { ...actor, adminUserId: randomUUID(), email: 'another@pixelring.test' }, { targetStatus: 'CANCELLED', expected, stepId }));
  const requires = await advanceCaseStatus(row.id, actor, { targetStatus: 'CANCELLED', expected, stepId });
  assert.equal(requires.outcome, 'requires_input');
  const confirmed = await advanceCaseStatus(row.id, actor, { targetStatus: 'CANCELLED', expected, stepId, confirmation: { kind: 'reason', reason: 'По запросу клиента' } });
  assert.equal(confirmed.outcome, 'done');
  const result = await getPortalRequestDetailForUser(db, user.id, email, row.publicRequestNumber, 'ru');
  assert.equal(result.detail.request.status, 'CANCELLED'); assert.equal(result.detail.request.cancellationRequestedAt, null);
  assert.equal(result.detail.request.nextStep, 'Эта заявка отменена.');
  assert.equal(await db.portalAttention.count({ where: { caseId: row.id, kind: 'STATUS' } }), 1);
  assert.equal((await post(row)).status, 409);
});
test('closed requests reject cancellation; paginated filters include all matching records and exclude foreign cases', async () => {
  const completed = await makeCase('COMPLETED'), cancelled = await makeCase('CANCELLED');
  assert.equal((await post(completed)).status, 409); assert.equal((await post(cancelled)).status, 409);
  for (let i = 0; i < 23; i++) await makeCase('CANCELLED');
  const foreign = await makeCase('CANCELLED', false);
  const pending = await makeCase('IN_PROGRESS'); await requestPortalCancellation(db, input(pending));
  for (const filter of ['active', 'completed', 'cancelled', 'all']) {
    const first = await getPortalOrganizationForUser(db, user.id, email, 'ru', { filter, page: 1 });
    const second = await getPortalOrganizationForUser(db, user.id, email, 'ru', { filter, page: 2 });
    const records = [...first.requests, ...second.requests];
    assert(!records.some(record => record.id === foreign.id));
    if (filter === 'cancelled') { assert(first.pagination.total > 20); assert(records.every(record => record.status === 'CANCELLED')); assert.equal(records.length, first.pagination.total); }
    if (filter === 'completed') assert.deepEqual(records.map(record => record.id), [completed.id]);
    if (filter === 'active') { assert(records.every(record => !['CANCELLED', 'COMPLETED'].includes(record.status))); assert(records.some(record => record.id === pending.id)); }
    assert.equal(first.pagination.activeRequests, await db.case.count({ where: { status: { notIn: ['COMPLETED', 'CANCELLED'] }, portalCaseAccesses: { some: { portalUserId: user.id, revokedAt: null } } } }));
  }
  const invalid = await listRoute.GET(new NextRequest('http://localhost:3000/api/portal/requests?filter=hidden', { headers: { cookie } }));
  assert.equal(invalid.status, 400);
});
