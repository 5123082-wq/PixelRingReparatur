import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readProjectFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8');
}

test('localized public routes are eligible for static generation and timed revalidation', () => {
  const pageSource = readProjectFile('src/app/[locale]/page.tsx');
  const layoutSource = readProjectFile('src/app/[locale]/layout.tsx');

  assert.ok(pageSource.includes('export const revalidate = 300'));
  assert.ok(layoutSource.includes('export const revalidate = 3600'));
  assert.ok(layoutSource.includes('export function generateStaticParams()'));
  assert.ok(layoutSource.includes('routing.locales.map((locale) => ({ locale }))'));
  assert.ok(pageSource.includes('setRequestLocale(locale)'));
  assert.equal(pageSource.includes('next/headers'), false);
  assert.equal(pageSource.includes('@/lib/prisma'), false);
  assert.equal(pageSource.includes('@/lib/portal/auth'), false);
  assert.equal(pageSource.includes('/uploads/cms-media/1778015697577-'), false);
  assert.ok(
    pageSource.includes('/images/leistungen/repair-hero/hero-sign-repair-01.jpg')
  );
  assert.ok(pageSource.includes('width: 1672'));
  assert.ok(pageSource.includes('height: 941'));
});

test('published problem articles use timed revalidation and build only known CMS slugs', () => {
  const articleSource = readProjectFile(
    'src/app/[locale]/probleme-loesungen/[slug]/page.tsx'
  );

  assert.ok(articleSource.includes('export const revalidate = 3600'));
  assert.ok(articleSource.includes('export async function generateStaticParams'));
  assert.ok(articleSource.includes('getPublishedSymptomArticles(params.locale)'));
  assert.ok(articleSource.includes('getProblemArticlePublicSlug(article.slug)'));
});

test('sitemap source refreshes CMS inventory and fails closed in production', () => {
  const sitemapSource = readProjectFile('src/app/sitemap.ts');

  assert.ok(sitemapSource.includes('export const revalidate = 300'));
  assert.ok(sitemapSource.includes("process.env.NODE_ENV === 'production'"));
  assert.ok(sitemapSource.includes('CMS database configuration is required'));
  assert.ok(sitemapSource.includes('throw error'));
  assert.equal(
    sitemapSource.includes("console.warn('Unable to load CMS problem articles for sitemap:'"),
    false
  );
});

test('problem article metadata and page rendering share cached CMS resolution', () => {
  const articleSource = readProjectFile(
    'src/app/[locale]/probleme-loesungen/[slug]/page.tsx'
  );

  assert.ok(articleSource.includes('const resolveArticle = cache(async'));
  assert.ok(articleSource.includes('getPublishedArticleLocales = cache(async'));
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
