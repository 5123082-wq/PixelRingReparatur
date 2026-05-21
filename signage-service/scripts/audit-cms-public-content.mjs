import fs from 'node:fs/promises';
import path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const DEFAULT_JSON_OUTPUT = 'tmp/cms-public-content-audit.json';
const DEFAULT_MARKDOWN_OUTPUT = 'tmp/cms-public-content-audit.md';

const PAGE_DEFINITIONS = {
  global: {
    route: 'layout/header-footer',
    routeUsesCms: true,
    fallback: 'messages/global footer/header fallbacks',
    blocks: [
      block('cta', ['globalNavigation', 'navigation', 'nav'], ['links']),
      block('cardList', ['footerServices'], ['items']),
      block('cardList', ['footerSupport'], ['items']),
      block('cardList', ['footerSocial'], ['items'], { optional: true }),
      block('textSection', ['footerCompany'], ['title']),
      block('cardList', ['footerLegal'], ['items']),
      block('footerCta', ['globalFooterCta', 'footerCta'], ['title'], { optional: true }),
    ],
  },
  home: {
    route: '/[locale]',
    routeUsesCms: true,
    fallback: 'static page content in code/messages',
    blocks: [
      block('hero', ['hero'], ['title', 'intro']),
      block('textSection', ['intakeSection'], ['title'], { optional: true }),
      block('cardList', ['bentoSection'], ['steps'], { optional: true }),
      block('cardList', ['trustSection'], ['titleStart'], { optional: true }),
      block('cardList', ['coverageSection'], ['title'], { optional: true }),
      block('cardList', ['excellenceSection'], ['items'], { optional: true }),
      block('reviewList', ['reviewsSection'], ['items'], { optional: true }),
      block('faqList', ['faqSection'], ['items'], { optional: true }),
    ],
  },
  status: {
    route: '/[locale]/status',
    routeUsesCms: true,
    fallback: 'StatusLookup defaults',
    blocks: [block('hero', ['statusHero', 'hero'], ['title', 'intro'])],
  },
  impressum: {
    route: '/[locale]/impressum',
    routeUsesCms: true,
    fallback: 'code-owned legal content',
    canonicalLocaleOnly: 'de',
    blocks: [block('textSection', ['legal', 'impressum', 'content'], ['title', 'description'], { matchAnyTextSection: true })],
  },
  privacy: {
    route: '/[locale]/privacy',
    routeUsesCms: true,
    fallback: 'code-owned legal content',
    canonicalLocaleOnly: 'de',
    blocks: [block('textSection', ['legal', 'privacy', 'content'], ['title', 'description'], { matchAnyTextSection: true })],
  },
  leistungen: {
    route: '/[locale]/leistungen',
    routeUsesCms: true,
    fallback: 'large static CONTENT object in page.tsx',
    blocks: [
      block('cardList', ['leistungenHero', 'heroSlides'], ['items']),
      block('cardList', ['repair'], ['title', 'items']),
      block('cardList', ['branding'], ['title', 'items']),
      block('cardList', ['maintenance'], ['title', 'items']),
      block('cardList', ['trust'], ['title', 'items']),
      block('cardList', ['process'], ['items'], { optional: true }),
    ],
  },
  business: {
    route: '/[locale]/business',
    routeUsesCms: true,
    fallback: 'large static CONTENT object in page.tsx',
    blocks: [
      block('hero', ['businessHero', 'hero'], ['title', 'description']),
      block('cardList', ['target'], ['title', 'items']),
      block('cardList', ['audit'], ['title', 'items']),
      block('cardList', ['platform'], ['title', 'items']),
      block('textSection', ['trust'], ['title'], { optional: true }),
      block('cta', ['final'], ['title', 'primaryLabel']),
    ],
  },
  'probleme-loesungen': {
    route: '/[locale]/probleme-loesungen',
    routeUsesCms: true,
    fallback: 'large static CONTENT object in page.tsx',
    blocks: [
      block('hero', ['problemeLoesungenHero', 'hero'], ['title', 'description']),
      block('cardList', ['problems'], ['title', 'items']),
      block('cardList', ['impact'], ['title', 'items']),
      block('textSection', ['urgent'], ['title']),
      block('faqList', ['faq'], ['title', 'items']),
      block('cta', ['final'], ['title', 'primaryLabel']),
    ],
  },
  about: {
    route: '/[locale]/ueber-uns',
    routeUsesCms: true,
    fallback: 'static ABOUT_CONTENT fallback from src/lib/content/about-page.ts',
    blocks: [
      block('hero', ['hero'], ['titlePrefix', 'intro', 'benefits']),
      block('cardList', ['audience'], ['title', 'serviceCardCta', 'items']),
      block('faqList', ['process'], ['title', 'items']),
      block('cardList', ['materials'], ['title', 'items']),
      block('textSection', ['quality'], ['title', 'description', 'features']),
      block('reviewList', ['testimonials'], ['title', 'items']),
      block('cta', ['final'], ['title', 'button']),
    ],
  },
  referenzen: {
    route: '/[locale]/referenzen',
    routeUsesCms: true,
    fallback: 'large static CONTENT object in page.tsx',
    blocks: [
      block('hero', ['heroBlock', 'hero'], ['title', 'intro']),
      block('textSection', ['recentIntroBlock'], ['title'], { optional: true }),
      block('cardList', ['casesBlock', 'cases'], ['items']),
      block('textSection', ['reportIntroBlock'], ['title'], { optional: true }),
      block('cardList', ['reportsBlock'], ['items'], { optional: true }),
      block('textSection', ['galleryIntroBlock'], ['title'], { optional: true }),
      block('cardList', ['galleryItemsBlock'], ['items']),
      block('cta', ['promoBlock'], ['title'], { optional: true }),
      block('textSection', ['categoriesIntroBlock'], ['title'], { optional: true }),
      block('cardList', ['productCategoriesBlock'], ['items']),
      block('cardList', ['typeBandLinesBlock'], ['items'], { optional: true }),
      block('cta', ['finalCtaBlock'], ['title', 'primaryLabel']),
      block('labels', ['labelsBlock'], [], { optional: true }),
    ],
  },
};

const EXPECTED_PROBLEM_ARTICLES = [
  ['no-light', 'werbeanlage-leuchtet-nicht'],
  ['flicking', 'werbeanlage-flackert'],
  ['uneven-light', 'led-leuchtet-ungleichmaessig'],
  ['letter-out', 'buchstabe-leuchtet-nicht'],
  ['rain-fail', 'werbeanlage-schaltet-nach-regen-ab'],
  ['peeling-film', 'folie-loest-sich'],
  ['faded-film', 'folie-ist-ausgeblichen'],
  ['shaky-sign', 'werbeanlage-wackelt'],
  ['urgent-repair', 'dringende-reparatur-werbeanlage'],
];

function block(type, keys, fields, options = {}) {
  return { type, keys, fields, optional: false, matchAnyTextSection: false, ...options };
}

function normalizeConnectionString(value) {
  try {
    const url = new URL(value);
    const sslmode = url.searchParams.get('sslmode');

    if (
      sslmode &&
      ['prefer', 'require', 'verify-ca'].includes(sslmode) &&
      !url.searchParams.has('uselibpqcompat')
    ) {
      url.searchParams.set('sslmode', 'verify-full');
    }

    return url.toString();
  } catch {
    return value;
  }
}

function getPrisma() {
  const connectionString = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Missing POSTGRES_PRISMA_URL or DATABASE_URL.');
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizeConnectionString(connectionString) }),
    log: ['error'],
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const valueFor = (name, fallback) => {
    const prefix = `--${name}=`;
    return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) ?? fallback;
  };

  return {
    jsonOutput: valueFor('json', DEFAULT_JSON_OUTPUT),
    markdownOutput: valueFor('markdown', DEFAULT_MARKDOWN_OUTPUT),
    baseUrl: valueFor('base-url', process.env.CMS_AUDIT_BASE_URL ?? ''),
    skipCrawl: args.includes('--skip-crawl'),
  };
}

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeBlocks(value) {
  return Array.isArray(value) ? value.filter(isObject) : null;
}

function findExpectedBlock(blocks, expected) {
  if (!blocks) return null;

  if (expected.matchAnyTextSection) {
    return blocks.find((candidate) => candidate.type === expected.type) ?? null;
  }

  return (
    blocks.find(
      (candidate) =>
        candidate.type === expected.type &&
        expected.keys.includes(candidate.key)
    ) ?? null
  );
}

function hasFieldValue(blockValue, field) {
  const value = blockValue?.[field];

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return value !== undefined && value !== null;
}

function addFinding(findings, severity, code, message, context = {}) {
  findings.push({ severity, code, message, ...context });
}

function collectMediaRefs(value, refs, context, keyPath = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectMediaRefs(item, refs, context, [...keyPath, String(index)]));
    return;
  }

  if (!isObject(value)) return;

  for (const [key, nestedValue] of Object.entries(value)) {
    const nextPath = [...keyPath, key];

    if (typeof nestedValue === 'string' && nestedValue.trim() && isMediaUrlField(key)) {
      refs.push({
        ...context,
        fieldPath: nextPath.join('.'),
        value: nestedValue.trim(),
      });
    }

    collectMediaRefs(nestedValue, refs, context, nextPath);
  }
}

function isMediaUrlField(key) {
  if (/(alt|label|title|description|caption|text)$/i.test(key)) {
    return false;
  }

  return (
    /^image$/i.test(key) ||
    /^video$/i.test(key) ||
    /^poster$/i.test(key) ||
    /^assetUrl$/i.test(key) ||
    /^mediaUrl$/i.test(key) ||
    /^publicUrl$/i.test(key) ||
    /^fallback(Src|Url)$/i.test(key) ||
    /^heroImage\d*$/i.test(key) ||
    /^galleryImage\d*$/i.test(key)
  );
}

async function auditPages(prisma, findings, mediaRefs) {
  const rows = await prisma.cmsPage.findMany({
    where: { deletedAt: null },
    orderBy: [{ pageKey: 'asc' }, { locale: 'asc' }],
  });
  const byKeyLocale = new Map(rows.map((row) => [`${row.pageKey}:${row.locale}`, row]));
  const results = [];

  for (const [pageKey, definition] of Object.entries(PAGE_DEFINITIONS)) {
    const localesToCheck = definition.canonicalLocaleOnly ? [definition.canonicalLocaleOnly] : LOCALES;

    if (!definition.routeUsesCms) {
      addFinding(
        findings,
        'INFO',
        'ROUTE_NOT_USING_CMS',
        `${definition.route} has a CMS pageKey (${pageKey}) but the route currently renders static page content.`,
        { pageKey, route: definition.route }
      );
    }

    for (const locale of localesToCheck) {
      const row = byKeyLocale.get(`${pageKey}:${locale}`);
      const result = {
        pageKey,
        locale,
        route: definition.route.replace('[locale]', locale),
        routeUsesCms: definition.routeUsesCms,
        status: row?.status ?? 'MISSING',
        title: row?.title ?? '',
        blocks: [],
        missingBlocks: [],
        missingFields: [],
        fallback: definition.fallback,
      };

      if (!row) {
        addFinding(
          findings,
          definition.routeUsesCms ? 'WARN' : 'INFO',
          'MISSING_CMS_PAGE',
          `${pageKey}/${locale} is missing in CmsPage.`,
          { pageKey, locale, route: result.route, fallback: definition.fallback }
        );
        results.push(result);
        continue;
      }

      if (row.status !== 'PUBLISHED') {
        addFinding(findings, 'WARN', 'CMS_PAGE_NOT_PUBLISHED', `${pageKey}/${locale} is ${row.status}.`, {
          pageKey,
          locale,
          route: result.route,
        });
      }

      if (!row.seoTitle || !row.seoDescription) {
        addFinding(findings, 'INFO', 'CMS_PAGE_SEO_INCOMPLETE', `${pageKey}/${locale} has incomplete SEO fields.`, {
          pageKey,
          locale,
          seoTitle: Boolean(row.seoTitle),
          seoDescription: Boolean(row.seoDescription),
        });
      }

      const blocks = normalizeBlocks(row.blocks);
      if (!blocks) {
        addFinding(findings, 'ERROR', 'INVALID_CMS_BLOCKS', `${pageKey}/${locale} blocks value is not an array.`, {
          pageKey,
          locale,
        });
        results.push(result);
        continue;
      }

      collectMediaRefs(row.blocks, mediaRefs, { sourceType: 'CmsPage', pageKey, locale });

      for (const expected of definition.blocks) {
        const found = findExpectedBlock(blocks, expected);

        if (!found) {
          result.missingBlocks.push(`${expected.type}:${expected.keys.join('|')}`);
          addFinding(
            findings,
            expected.optional ? 'INFO' : 'WARN',
            'MISSING_EXPECTED_BLOCK',
            `${pageKey}/${locale} is missing expected block ${expected.type}:${expected.keys.join('|')}.`,
            { pageKey, locale, expectedType: expected.type, expectedKeys: expected.keys }
          );
          continue;
        }

        result.blocks.push(`${found.type}:${found.key}${found.enabled === false ? ' (disabled)' : ''}`);

        if (found.enabled === false && !expected.optional) {
          addFinding(findings, 'WARN', 'EXPECTED_BLOCK_DISABLED', `${pageKey}/${locale} block ${found.key} is disabled.`, {
            pageKey,
            locale,
            blockKey: found.key,
          });
        }

        for (const field of expected.fields) {
          if (!hasFieldValue(found, field)) {
            result.missingFields.push(`${found.key}.${field}`);
            addFinding(
              findings,
              expected.optional ? 'INFO' : 'WARN',
              'MISSING_EXPECTED_FIELD',
              `${pageKey}/${locale} block ${found.key} is missing field ${field}.`,
              { pageKey, locale, blockKey: found.key, field }
            );
          }
        }
      }

      results.push(result);
    }
  }

  for (const row of rows) {
    if (!PAGE_DEFINITIONS[row.pageKey]) {
      addFinding(findings, 'INFO', 'UNKNOWN_CMS_PAGE_KEY', `CmsPage ${row.pageKey}/${row.locale} is not mapped to the public audit matrix.`, {
        pageKey: row.pageKey,
        locale: row.locale,
      });
    }

    if (!LOCALES.includes(row.locale)) {
      addFinding(findings, 'WARN', 'UNKNOWN_CMS_LOCALE', `CmsPage ${row.pageKey}/${row.locale} uses a non-MVP locale.`, {
        pageKey: row.pageKey,
        locale: row.locale,
      });
    }
  }

  return results;
}

async function auditProblemArticles(prisma, findings) {
  const rows = await prisma.cmsArticle.findMany({
    where: { deletedAt: null, type: 'SYMPTOM' },
    orderBy: [{ locale: 'asc' }, { sortOrder: 'asc' }, { slug: 'asc' }],
  });
  const bySlugLocale = new Map(rows.map((row) => [`${row.slug}:${row.locale}`, row]));
  const expectedSlugs = new Set(EXPECTED_PROBLEM_ARTICLES.map(([slug]) => slug));
  const results = [];

  for (const [cmsSlug, publicSlug] of EXPECTED_PROBLEM_ARTICLES) {
    for (const locale of LOCALES) {
      const row = bySlugLocale.get(`${cmsSlug}:${locale}`);
      const result = {
        cmsSlug,
        publicSlug,
        locale,
        route: `/${locale}/probleme-loesungen/${publicSlug}`,
        status: row?.status ?? 'MISSING',
        title: row?.title ?? '',
        content: Boolean(row?.content?.trim()),
        shortAnswer: Boolean(row?.shortAnswer?.trim()),
        seoTitle: Boolean(row?.seoTitle?.trim()),
        seoDescription: Boolean(row?.seoDescription?.trim()),
        structuredLists: {
          causes: row?.causes?.length ?? 0,
          safeChecks: row?.safeChecks?.length ?? 0,
          urgentWarnings: row?.urgentWarnings?.length ?? 0,
          serviceProcess: row?.serviceProcess?.length ?? 0,
          workScopeFactors: row?.workScopeFactors?.length ?? 0,
        },
      };

      if (!row) {
        addFinding(
          findings,
          locale === 'en' ? 'ERROR' : 'WARN',
          'MISSING_PROBLEM_ARTICLE',
          `${cmsSlug}/${locale} is missing; article route may fall back to EN or 404.`,
          { cmsSlug, publicSlug, locale, route: result.route }
        );
        results.push(result);
        continue;
      }

      if (row.status !== 'PUBLISHED') {
        addFinding(findings, 'WARN', 'PROBLEM_ARTICLE_NOT_PUBLISHED', `${cmsSlug}/${locale} is ${row.status}.`, {
          cmsSlug,
          publicSlug,
          locale,
        });
      }

      for (const field of ['title', 'content']) {
        if (!row[field]?.trim()) {
          addFinding(findings, 'ERROR', 'PROBLEM_ARTICLE_CORE_FIELD_EMPTY', `${cmsSlug}/${locale} has empty ${field}.`, {
            cmsSlug,
            locale,
            field,
          });
        }
      }

      for (const field of ['shortAnswer', 'seoTitle', 'seoDescription']) {
        if (!row[field]?.trim()) {
          addFinding(findings, 'INFO', 'PROBLEM_ARTICLE_SEO_OR_SNIPPET_INCOMPLETE', `${cmsSlug}/${locale} has empty ${field}.`, {
            cmsSlug,
            locale,
            field,
          });
        }
      }

      for (const field of ['causes', 'safeChecks', 'urgentWarnings', 'serviceProcess', 'workScopeFactors']) {
        if (!Array.isArray(row[field]) || row[field].length === 0) {
          addFinding(findings, 'INFO', 'PROBLEM_ARTICLE_STRUCTURED_LIST_EMPTY', `${cmsSlug}/${locale} has empty ${field}.`, {
            cmsSlug,
            locale,
            field,
          });
        }
      }

      results.push(result);
    }
  }

  for (const row of rows) {
    if (!expectedSlugs.has(row.slug)) {
      addFinding(
        findings,
        row.status === 'PUBLISHED' ? 'WARN' : 'INFO',
        'UNMAPPED_SYMPTOM_ARTICLE',
        `SYMPTOM article ${row.slug}/${row.locale} is not mapped to a public problem route.`,
        { cmsSlug: row.slug, locale: row.locale, status: row.status }
      );
    }
  }

  return results;
}

async function auditMedia(prisma, mediaRefs, findings) {
  const publicDir = path.resolve('public');
  const mediaRows = await prisma.cmsMedia.findMany({
    where: { deletedAt: null },
    select: { publicUrl: true, fallbackUrl: true, storageProvider: true, title: true },
  });
  const mediaByPublicUrl = new Map(mediaRows.map((row) => [row.publicUrl, row]));
  const results = [];

  for (const ref of mediaRefs) {
    const value = ref.value;
    const row = mediaByPublicUrl.get(value);
    const result = {
      ...ref,
      cmsMedia: Boolean(row),
      fallbackUrl: row?.fallbackUrl ?? null,
      storageProvider: row?.storageProvider ?? null,
      status: 'UNCHECKED',
    };

    if (value.startsWith('/')) {
      const localPath = path.join(publicDir, value.replace(/^\/+/, ''));
      try {
        await fs.access(localPath);
        result.status = 'LOCAL_FILE_OK';
      } catch {
        result.status = row?.fallbackUrl ? 'CMS_FALLBACK_AVAILABLE' : 'LOCAL_FILE_MISSING';
        addFinding(findings, row?.fallbackUrl ? 'INFO' : 'WARN', 'MEDIA_LOCAL_FILE_MISSING', `${value} does not exist under public/.`, {
          sourceType: ref.sourceType,
          pageKey: ref.pageKey,
          locale: ref.locale,
          fieldPath: ref.fieldPath,
          fallbackUrl: row?.fallbackUrl ?? null,
        });
      }
    } else if (/^https?:\/\//i.test(value)) {
      result.status = row ? 'CMS_MEDIA_URL_REGISTERED' : 'EXTERNAL_URL_NOT_REGISTERED';
      if (!row) {
        addFinding(findings, 'INFO', 'MEDIA_EXTERNAL_URL_NOT_REGISTERED', `${value} is not registered in CmsMedia.`, {
          sourceType: ref.sourceType,
          pageKey: ref.pageKey,
          locale: ref.locale,
          fieldPath: ref.fieldPath,
        });
      }
    } else {
      result.status = 'NON_URL_MEDIA_VALUE';
      addFinding(findings, 'INFO', 'MEDIA_VALUE_NOT_URL', `${value} is a media-looking value but not a URL/path.`, {
        sourceType: ref.sourceType,
        pageKey: ref.pageKey,
        locale: ref.locale,
        fieldPath: ref.fieldPath,
      });
    }

    results.push(result);
  }

  return results;
}

async function crawlRoutes(baseUrl, pageResults, articleResults, findings) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const routeSet = new Set();

  for (const page of pageResults) {
    if (page.route.startsWith('/')) routeSet.add(page.route);
  }

  for (const article of articleResults) {
    if (article.status === 'PUBLISHED') routeSet.add(article.route);
  }

  const routes = Array.from(routeSet).sort();
  const results = [];

  for (const route of routes) {
    const url = `${cleanBase}${route}`;
    const startedAt = Date.now();

    try {
      const response = await fetch(url, { redirect: 'manual' });
      const text = await response.text().catch(() => '');
      const result = {
        route,
        url,
        status: response.status,
        ok: response.status >= 200 && response.status < 400,
        bytes: text.length,
        durationMs: Date.now() - startedAt,
        hasPixelRing: /PixelRing/i.test(text),
      };

      if (!result.ok) {
        addFinding(findings, 'ERROR', 'CRAWL_ROUTE_NOT_OK', `${route} returned HTTP ${response.status}.`, result);
      } else if (text.length < 1000) {
        addFinding(findings, 'WARN', 'CRAWL_ROUTE_SMALL_RESPONSE', `${route} returned a very small response.`, result);
      }

      results.push(result);
    } catch (error) {
      const result = {
        route,
        url,
        status: 0,
        ok: false,
        bytes: 0,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      };
      addFinding(findings, 'ERROR', 'CRAWL_ROUTE_FAILED', `${route} failed to fetch.`, result);
      results.push(result);
    }
  }

  return results;
}

function summarize(findings) {
  const countBySeverity = findings.reduce((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] ?? 0) + 1;
    return acc;
  }, {});
  const countByCode = findings.reduce((acc, finding) => {
    acc[finding.code] = (acc[finding.code] ?? 0) + 1;
    return acc;
  }, {});

  return {
    result:
      countBySeverity.ERROR > 0
        ? 'FAIL'
        : countBySeverity.WARN > 0
          ? 'WARN'
          : 'PASS',
    countBySeverity,
    countByCode,
  };
}

function markdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => {
    return `| ${columns.map((column) => sanitizeMarkdownCell(column.value(row))).join(' | ')} |`;
  });
  return [header, divider, ...body].join('\n');
}

function sanitizeMarkdownCell(value) {
  return String(value ?? '')
    .replace(/\n/g, '<br>')
    .replace(/\|/g, '\\|');
}

function renderMarkdown(report) {
  const topFindings = report.findings
    .filter((finding) => finding.severity === 'ERROR' || finding.severity === 'WARN')
    .slice(0, 80);

  const pageRows = report.pages.map((page) => ({
    pageKey: page.pageKey,
    locale: page.locale,
    route: page.route,
    source: page.routeUsesCms ? 'CMS + fallback' : 'static route',
    status: page.status,
    missingBlocks: page.missingBlocks.join(', '),
    missingFields: page.missingFields.join(', '),
  }));

  const articleRows = report.problemArticles.map((article) => ({
    slug: article.cmsSlug,
    locale: article.locale,
    publicSlug: article.publicSlug,
    status: article.status,
    content: article.content ? 'yes' : 'no',
    shortAnswer: article.shortAnswer ? 'yes' : 'no',
    seo: article.seoTitle && article.seoDescription ? 'yes' : 'partial',
  }));

  return [
    '# CMS Public Content Audit',
    '',
    `Generated: ${report.generatedAt}`,
    `Database: ${report.databaseTarget}`,
    `Result: ${report.summary.result}`,
    '',
    '## Summary',
    '',
    markdownTable(
      Object.entries(report.summary.countBySeverity).map(([severity, count]) => ({ severity, count })),
      [
        { label: 'Severity', value: (row) => row.severity },
        { label: 'Count', value: (row) => row.count },
      ]
    ),
    '',
    '## Blocking And Warning Findings',
    '',
    topFindings.length
      ? markdownTable(topFindings, [
          { label: 'Severity', value: (row) => row.severity },
          { label: 'Code', value: (row) => row.code },
          { label: 'Context', value: (row) => row.pageKey ?? row.cmsSlug ?? row.route ?? '' },
          { label: 'Message', value: (row) => row.message },
        ])
      : 'No ERROR/WARN findings.',
    '',
    '## Source Of Truth Matrix',
    '',
    markdownTable(pageRows, [
      { label: 'Page key', value: (row) => row.pageKey },
      { label: 'Locale', value: (row) => row.locale },
      { label: 'Route', value: (row) => row.route },
      { label: 'Source', value: (row) => row.source },
      { label: 'CMS status', value: (row) => row.status },
      { label: 'Missing blocks', value: (row) => row.missingBlocks },
      { label: 'Missing fields', value: (row) => row.missingFields },
    ]),
    '',
    '## Problem Article Matrix',
    '',
    markdownTable(articleRows, [
      { label: 'CMS slug', value: (row) => row.slug },
      { label: 'Locale', value: (row) => row.locale },
      { label: 'Public slug', value: (row) => row.publicSlug },
      { label: 'Status', value: (row) => row.status },
      { label: 'Content', value: (row) => row.content },
      { label: 'Short answer', value: (row) => row.shortAnswer },
      { label: 'SEO', value: (row) => row.seo },
    ]),
    report.crawl?.length
      ? [
          '',
          '## Runtime Crawl',
          '',
          markdownTable(report.crawl, [
            { label: 'Route', value: (row) => row.route },
            { label: 'HTTP', value: (row) => row.status },
            { label: 'OK', value: (row) => row.ok ? 'yes' : 'no' },
            { label: 'Bytes', value: (row) => row.bytes },
            { label: 'Duration ms', value: (row) => row.durationMs },
          ]),
        ].join('\n')
      : '',
    '',
    '## Notes',
    '',
    '- This audit is read-only: it does not write to CMS, articles, media, or page data.',
    '- Static fallback can keep a route rendering while CMS content is missing or stale; those cases are intentionally reported as risk, not ignored.',
  ].join('\n');
}

function safeDatabaseTarget() {
  const raw = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL ?? '';
  if (!raw) return 'not configured';

  try {
    const url = new URL(raw);
    return `${url.protocol}//${url.hostname}${url.pathname}`;
  } catch {
    return 'configured';
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeText(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value, 'utf8');
}

async function main() {
  const options = parseArgs();
  const prisma = getPrisma();
  const findings = [];
  const mediaRefs = [];

  try {
    const pages = await auditPages(prisma, findings, mediaRefs);
    const problemArticles = await auditProblemArticles(prisma, findings);
    const media = await auditMedia(prisma, mediaRefs, findings);
    const crawl = options.baseUrl && !options.skipCrawl
      ? await crawlRoutes(options.baseUrl, pages, problemArticles, findings)
      : [];
    const report = {
      generatedAt: new Date().toISOString(),
      databaseTarget: safeDatabaseTarget(),
      baseUrl: options.baseUrl || null,
      locales: LOCALES,
      expectedProblemArticles: EXPECTED_PROBLEM_ARTICLES.map(([cmsSlug, publicSlug]) => ({ cmsSlug, publicSlug })),
      pages,
      problemArticles,
      media,
      crawl,
      findings,
      summary: summarize(findings),
    };

    await writeJson(options.jsonOutput, report);
    await writeText(options.markdownOutput, renderMarkdown(report));

    console.log(`CMS public content audit: ${report.summary.result}`);
    console.log(`Findings: ${JSON.stringify(report.summary.countBySeverity)}`);
    console.log(`JSON: ${options.jsonOutput}`);
    console.log(`Markdown: ${options.markdownOutput}`);

    if (report.summary.result === 'FAIL') {
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('CMS public content audit failed:', error);
  process.exitCode = 1;
});
