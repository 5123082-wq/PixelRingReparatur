import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  PROBLEM_ARTICLE_SERVICE_PATHS,
  buildProblemArticleContextLinks,
  getProblemArticleServicePath,
} from '../src/components/probleme-loesungen/problemArticleContextLinks.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

const EXPECTED_SERVICE_PATHS = {
  'werbeanlage-leuchtet-nicht': '/leistungen/werbeanlagen-reparatur',
  'werbeanlage-flackert': '/leistungen/lichtwerbung-led-modernisierung',
  'led-leuchtet-ungleichmaessig': '/leistungen/lichtwerbung-led-modernisierung',
  'buchstabe-leuchtet-nicht': '/leistungen/werbeanlagen-reparatur',
  'werbeanlage-schaltet-nach-regen-ab': '/leistungen/werbeanlagen-reparatur',
  'folie-loest-sich': '/leistungen/druckprodukte-branding-werbematerialien',
  'folie-ist-ausgeblichen': '/leistungen/druckprodukte-branding-werbematerialien',
  'werbeanlage-wackelt': '/leistungen/montage-demontage-werbeanlagen',
  'dringende-reparatur-werbeanlage': '/leistungen/werbeanlagen-reparatur',
} as const;

test('all nine canonical problem slugs map to an intentional service detail', () => {
  assert.deepEqual(PROBLEM_ARTICLE_SERVICE_PATHS, EXPECTED_SERVICE_PATHS);
  assert.equal(Object.keys(PROBLEM_ARTICLE_SERVICE_PATHS).length, 9);
});

test('unknown future article slugs safely fall back to the services overview', () => {
  assert.equal(getProblemArticleServicePath('future-problem-article'), '/leistungen');
});

test('every supported locale builds crawlable hub, service, and reference hrefs', () => {
  const locales = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];

  for (const locale of locales) {
    const model = buildProblemArticleContextLinks(locale, 'werbeanlage-wackelt');

    assert.equal(model.links.length, 3);
    assert.deepEqual(
      model.links.map((link) => link.kind),
      ['hub', 'service', 'references']
    );
    assert.deepEqual(
      model.links.map((link) => link.href),
      [
        `/${locale}/probleme-loesungen`,
        `/${locale}/leistungen/montage-demontage-werbeanlagen`,
        `/${locale}/referenzen`,
      ]
    );
    assert.ok(model.links.every((link) => link.label.trim().length > 12));
    assert.ok(model.links.every((link) => link.eyebrow.trim().length > 4));
    assert.equal(model.direction, locale === 'ar' ? 'rtl' : 'ltr');
  }
});

test('unsupported locale and slug use the English services overview safely', () => {
  const model = buildProblemArticleContextLinks('unknown', 'future-problem-article');

  assert.deepEqual(
    model.links.map((link) => link.href),
    ['/en/probleme-loesungen', '/en/leistungen', '/en/referenzen']
  );
  assert.equal(model.direction, 'ltr');
});

test('the server-rendered article component emits Link hrefs from the central model', () => {
  const source = readFileSync(
    resolve(__dirname, '../src/components/probleme-loesungen/ProblemArticleBody.tsx'),
    'utf8'
  );

  assert.ok(source.includes("import Link from 'next/link';"));
  assert.ok(source.includes('buildProblemArticleContextLinks(locale, articleSlug)'));
  assert.ok(source.includes('href={link.href}'));
  assert.ok(source.includes('<ArticleContextLinks locale={locale} articleSlug={article.publicSlug} />'));
});

test('fallback article navigation targets the published content locale', () => {
  const source = readFileSync(
    resolve(__dirname, '../src/components/probleme-loesungen/ProblemArticleBody.tsx'),
    'utf8'
  );

  assert.ok(source.includes('const articleLinkLocale = fallbackContentLocale ?? locale;'));
  assert.equal(
    source.match(/href=\{`\/\$\{articleLinkLocale\}\/probleme-loesungen\/\$\{/g)?.length,
    2
  );
  assert.equal(
    source.match(/href=\{`\/\$\{locale\}\/probleme-loesungen\/\$\{/g)?.length ?? 0,
    0
  );
});
