import assert from 'node:assert/strict';
import test from 'node:test';
import { PortalSync } from '../src/lib/portal/sync.ts';
import { savedMessageStream, readMessageEvents, mergeChatMessages, historyCursorAfterUpdate, type MessageResult } from '../src/lib/portal/message-stream.ts';
import { portalChannel, portalTokenOptions } from '../src/lib/portal/realtime-policy.ts';
const saved: MessageResult = { success: true, message: { id: 'saved-id', authorRole: 'CUSTOMER', body: 'Тест رسالة', createdAt: '2026-10-01T00:00:00Z' }, assistantMessage: null, assistantPending: true };
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }
test('two attention consumers share one read, and an event during it triggers one follow-up', async () => {
  const sync = new PortalSync(); let calls = 0; const gate = deferred<number>();
  sync.resource('attention', 0, async () => { calls++; return calls === 1 ? gate.promise : 2; });
  sync.subscribe('attention', () => {}); sync.subscribe('attention', () => {});
  const first = sync.refresh('attention'); const duplicate = sync.refresh('attention');
  const events = [sync.refreshActive(true), sync.refreshActive(true)]; assert.equal(calls, 1);
  gate.resolve(1); await Promise.all([first, duplicate, ...events]);
  assert.equal(calls, 2); assert.equal(sync.snapshot<number>('attention').data, 2);
});
test('connected idle portal reduces reads at least 70% and skips inactive resources', async () => {
  let now = 0, reads = 0; const sync = new PortalSync(() => now); sync.connected = true;
  for (const key of ['attention', 'requests', 'chat']) { sync.resource(key, 0, async () => ++reads, key === 'chat'); sync.subscribe(key, () => {}); }
  sync.resource('inactive', 0, async () => { throw new Error('must not read'); });
  for (now = 10_000; now <= 120_000; now += 10_000) await sync.refreshActive();
  assert.equal(reads, 3); assert.ok(1 - reads / 16 >= .7);
});
test('fallback refreshes chat every ten seconds and other data every thirty', async () => {
  let now = 0, chat = 0, other = 0; const sync = new PortalSync(() => now);
  sync.resource('chat', 0, async () => ++chat, true); sync.resource('requests', 0, async () => ++other);
  sync.subscribe('chat', () => {}); sync.subscribe('requests', () => {});
  for (now = 10_000; now <= 30_000; now += 10_000) await sync.refreshActive();
  assert.equal(chat, 3); assert.equal(other, 1);
});
test('logout discards in-flight private data and a new account uses a fresh registry', async () => {
  const sync = new PortalSync(); const gate = deferred<string>(); sync.resource('attention', 'private', () => gate.promise);
  const pending = sync.refresh('attention'); sync.clear(); gate.resolve('late private response'); await pending;
  assert.equal(sync.snapshot('attention').data, null);
  const next = new PortalSync(); next.resource('attention', 'new account', async () => 'new'); assert.equal(next.snapshot('attention').data, 'new account');
});
test('save acknowledgement arrives before slow AI completion', async () => {
  const gate = deferred<MessageResult>(); const reader = savedMessageStream(saved, () => gate.promise).getReader();
  const first = await reader.read(); const event = JSON.parse(new TextDecoder().decode(first.value));
  assert.equal(event.type, 'saved'); assert.equal(event.result.message.id, 'saved-id');
  gate.resolve({ ...saved, assistantPending: false }); const last = await reader.read(); assert.equal(JSON.parse(new TextDecoder().decode(last.value)).type, 'complete');
});
test('disconnect after save does not cancel the durable assistant operation', async () => {
  const gate = deferred<MessageResult>(); let completed = false;
  const reader = savedMessageStream(saved, async () => { await gate.promise; completed = true; return saved; }).getReader();
  await reader.read(); await reader.cancel(); gate.resolve(saved); await new Promise(resolve => setTimeout(resolve, 0)); assert.equal(completed, true);
});
test('AI failure preserves the saved acknowledgement and reports failure', async () => {
  const events: string[] = [];
  await readMessageEvents(new Response(savedMessageStream(saved, async () => { throw new Error('AI failed'); })), event => { events.push(event.type); if (event.type === 'complete') { assert.equal(event.result.message.id, saved.message.id); assert.equal(event.result.assistantFailed, true); } });
  assert.deepEqual(events, ['saved', 'complete']);
});
test('UTF-8 split across transport chunks is decoded and truncated streams fail after save', async () => {
  const bytes = new TextEncoder().encode(JSON.stringify({ type: 'saved', result: saved }) + '\n'); let acknowledged = false;
  const body = new ReadableStream({ start(controller) { for (let i = 0; i < bytes.length; i += 3) controller.enqueue(bytes.slice(i, i + 3)); controller.close(); } });
  await assert.rejects(readMessageEvents(new Response(body), event => { acknowledged = true; assert.equal(event.result.message.body, saved.message.body); }), /incomplete_stream/);
  assert.equal(acknowledged, true);
});
test('realtime and pagination merge by id without discarding earlier or optimistic messages', () => {
  const rows = mergeChatMessages([{ id: 'old', createdAt: '1' }, { id: 'same', createdAt: '2' }, { id: 'temp', createdAt: '4' }], [{ id: 'same', createdAt: '2' }, { id: 'new', createdAt: '3' }]);
  assert.deepEqual(rows.map(row => row.id), ['old', 'same', 'new', 'temp']);
});
test('portal credentials can only subscribe to one account channel for five minutes', () => {
  const token = portalTokenOptions('account-a', 'session-a'); assert.equal(token.ttl, 300_000);
  assert.deepEqual(token.capability, { [portalChannel('account-a')]: ['subscribe'] });
  assert.notEqual(portalChannel('account-a'), portalChannel('account-b'));
  assert.ok(!JSON.stringify(token).includes('session-a')); assert.ok(!JSON.stringify(token).includes('private:crm')); assert.ok(!JSON.stringify(token).includes('private:case'));
});

test('foreground resync retains a cursor into a missing history window', () => {
  assert.equal(historyCursorAfterUpdate(['old-1', 'old-2'], ['new-100', 'new-101'], 'older-cursor', 'gap-cursor'), 'gap-cursor');
  assert.equal(historyCursorAfterUpdate(['new-100', 'new-101'], ['new-101', 'new-102'], 'gap-cursor', 'new-101'), 'gap-cursor');
  assert.equal(historyCursorAfterUpdate([], ['first'], null, null), null);
});
