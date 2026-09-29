import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextEmailAttempt, validCronAuthorization, MAX_EMAIL_ATTEMPTS } from '../src/lib/portal-attention/delivery-policy.ts';
import { attentionEmailLocale, getAttentionEmailCopy } from '../src/lib/portal-attention/email-copy.ts';
test('cron never authorizes absent configuration or malformed bearer headers', () => {
  const secret = 'a-long-test-secret-not-production';
  for (const header of [null, '', 'Bearer undefined', 'Bearer ', `bearer ${secret}`, `Bearer ${secret}x`]) assert.equal(validCronAuthorization(header, secret), false);
  assert.equal(validCronAuthorization('Bearer undefined', undefined), false);
  assert.equal(validCronAuthorization('Bearer short', 'short'), false);
  assert.equal(validCronAuthorization(`Bearer ${secret}`, secret), true);
});
test('email retry backoff increases and is bounded with finite automatic attempts', () => {
  const start = new Date('2026-09-29T00:00:00Z');
  assert.equal(MAX_EMAIL_ATTEMPTS, 5);
  const expected = [60_000, 300_000, 1_800_000, 21_600_000, 86_400_000];
  expected.forEach((delay, i) => assert.equal(nextEmailAttempt(i + 1, start).getTime() - start.getTime(), delay));
  assert.equal(nextEmailAttempt(999, start).getTime() - start.getTime(), expected[4]);
});
test('all supported email languages have independent localized copy and German fallback', () => {
  const locales = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
  assert.equal(new Set(locales.map(locale => getAttentionEmailCopy(locale).body)).size, 6);
  for (const locale of locales) { assert.equal(attentionEmailLocale(locale), locale); assert.ok(getAttentionEmailCopy(locale).open); }
  assert.equal(attentionEmailLocale('unsupported'), 'de');
});
