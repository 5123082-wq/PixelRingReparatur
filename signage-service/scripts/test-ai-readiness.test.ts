import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readProjectFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8');
}

test('localized homepage is eligible for static generation and timed revalidation', () => {
  const pageSource = readProjectFile('src/app/[locale]/page.tsx');

  assert.ok(pageSource.includes('export const revalidate = 300'));
  assert.ok(pageSource.includes('export function generateStaticParams()'));
  assert.ok(pageSource.includes('routing.locales.map((locale) => ({ locale }))'));
  assert.ok(pageSource.includes('setRequestLocale(locale)'));
  assert.equal(pageSource.includes('next/headers'), false);
  assert.equal(pageSource.includes('@/lib/prisma'), false);
  assert.equal(pageSource.includes('@/lib/portal/auth'), false);
});

test('locale layout fixes the request locale before loading messages', () => {
  const layoutSource = readProjectFile('src/app/[locale]/layout.tsx');
  const localeIndex = layoutSource.indexOf('setRequestLocale(locale)');
  const messagesIndex = layoutSource.indexOf('await getMessages()');

  assert.notEqual(localeIndex, -1);
  assert.notEqual(messagesIndex, -1);
  assert.ok(localeIndex < messagesIndex);
});

test('routing does not vary public pages by automatic locale cookie', () => {
  const source = readProjectFile('src/i18n/routing.ts');

  assert.ok(source.includes('localeDetection: false'));
  assert.ok(source.includes('localeCookie: false'));
});

test('robots policy explicitly keeps search and answer-engine crawlers open', () => {
  const source = readProjectFile('src/app/robots.ts');
  const expectedAgents = [
    'Googlebot',
    'Bingbot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'GPTBot',
    'Claude-SearchBot',
    'Claude-User',
    'ClaudeBot',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
  ];

  for (const agent of expectedAgents) {
    assert.ok(source.includes(`'${agent}'`), `Missing crawler rule for ${agent}`);
  }

  assert.ok(source.includes("userAgent: '*'"));
  assert.ok(source.includes("const CRAWLER_DISALLOWED_PATHS = ['/api/']"));
});
