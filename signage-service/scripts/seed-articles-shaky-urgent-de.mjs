/**
 * Seed: approved German refreshes for shaky-sign and urgent-repair.
 *
 * The approved Markdown drafts remain the source of truth. This script reads
 * their public article and CMS mapping sections, validates both records, and
 * updates only the two German cms_articles rows in one transaction.
 *
 * Run: npm run db:seed:articles-shaky-urgent-de
 * Dry run: npm run db:seed:articles-shaky-urgent-de -- --dry-run
 * Verify DB: npm run db:seed:articles-shaky-urgent-de -- --verify
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const repoDir = path.resolve(appDir, '..');
const isDryRun = process.argv.includes('--dry-run');
const isVerify = process.argv.includes('--verify');

assert(!(isDryRun && isVerify), 'Choose either --dry-run or --verify.');

dotenv.config({ path: path.join(appDir, '.env.local'), quiet: true });
dotenv.config({ path: path.join(appDir, '.env'), quiet: true });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!isDryRun && !connectionString) {
  throw new Error('Missing DB connection string.');
}

const now = new Date();

const ARTICLE_SOURCES = [
  {
    folder: 'вывеска шатается – 09',
    file: 'problem_article_werbeanlage-wackelt_de.md',
    cmsSlug: 'shaky-sign',
    publicSlug: 'werbeanlage-wackelt',
    sortOrder: 7,
  },
  {
    folder: 'срочный ремонт вывески – 10',
    file: 'problem_article_dringende-reparatur-werbeanlage_de.md',
    cmsSlug: 'urgent-repair',
    publicSlug: 'dringende-reparatur-werbeanlage',
    sortOrder: 8,
  },
];

const REQUIRED_MAPPING_FIELDS = [
  'title',
  'symptomLabel',
  'shortAnswer',
  'causes',
  'safeChecks',
  'selfRepairTips',
  'urgentWarnings',
  'serviceProcess',
  'workScopeFactors',
  'relatedSlugs',
  'ctaLabel',
  'ctaHref',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return JSON.parse(trimmed);
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function unwrapInlineCode(value) {
  const trimmed = value.trim();
  return trimmed.startsWith('`') && trimmed.endsWith('`')
    ? trimmed.slice(1, -1).trim()
    : trimmed;
}

function extractFrontmatter(markdown, sourceLabel) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert(match, `${sourceLabel}: missing frontmatter.`);

  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const fieldMatch = line.match(/^([a-z_]+):\s*(.*)$/);
    if (fieldMatch) {
      values[fieldMatch[1]] = unquote(fieldMatch[2]);
    }
  }

  return values;
}

function extractPublicArticle(markdown, sourceLabel) {
  const matches = [
    ...markdown.matchAll(/## 3\.[^\n]*\n\n([\s\S]*?)\n\n---\n\n## 4\./g),
  ];
  assert(matches.length === 1, `${sourceLabel}: expected one public article boundary.`);

  const content = matches[0][1].trim();
  const h1Matches = [...content.matchAll(/^# (.+)$/gm)];
  assert(h1Matches.length === 1, `${sourceLabel}: public article must contain exactly one H1.`);
  assert(
    !/Interne Notiz|AI-Basis|Source Notes/i.test(content),
    `${sourceLabel}: public content contains an internal-note marker.`
  );
  assert(content.length >= 5_000, `${sourceLabel}: public article is unexpectedly short.`);
  assert(
    (content.match(/^##\s+/gm)?.length ?? 0) >= 4,
    `${sourceLabel}: public article has too few H2 sections.`
  );

  return { content, h1: h1Matches[0][1].trim() };
}

function extractCmsMapping(markdown, sourceLabel) {
  const marker = markdown.match(/^## 5\.[^\n]*$/m);
  assert(marker && marker.index !== undefined, `${sourceLabel}: missing CMS mapping section.`);

  const mappingText = markdown.slice(marker.index + marker[0].length).trim();
  const headings = [...mappingText.matchAll(/^### ([^\n]+)$/gm)];
  assert(headings.length > 0, `${sourceLabel}: CMS mapping has no fields.`);

  const sections = new Map();
  for (const [index, heading] of headings.entries()) {
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? mappingText.length;
    sections.set(heading[1].trim(), mappingText.slice(start, end).trim());
  }

  for (const field of REQUIRED_MAPPING_FIELDS) {
    assert(sections.has(field), `${sourceLabel}: CMS mapping is missing ${field}.`);
  }

  return sections;
}

function parseScalar(sections, field, sourceLabel) {
  const raw = sections.get(field);
  assert(raw, `${sourceLabel}: ${field} is empty.`);
  const value = unwrapInlineCode(
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
  );
  assert(value, `${sourceLabel}: ${field} is empty.`);
  return value;
}

function parseList(sections, field, sourceLabel) {
  const raw = sections.get(field);
  assert(raw, `${sourceLabel}: ${field} is empty.`);
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  assert(
    lines.every((line) => line.startsWith('- ')),
    `${sourceLabel}: ${field} must be a Markdown bullet list.`
  );
  const values = lines.map((line) => unwrapInlineCode(line.slice(2)));
  assert(values.length > 0, `${sourceLabel}: ${field} must not be empty.`);
  assert(new Set(values).size === values.length, `${sourceLabel}: ${field} has duplicates.`);
  return values;
}

function parseSelfRepairTips(sections, sourceLabel) {
  const raw = sections.get('selfRepairTips');
  const match = raw?.match(/^```json\r?\n([\s\S]*?)\r?\n```$/);
  assert(match, `${sourceLabel}: selfRepairTips must be one JSON code block.`);

  const value = JSON.parse(match[1]);
  assert(
    value && typeof value === 'object' && !Array.isArray(value),
    `${sourceLabel}: selfRepairTips must be an object.`
  );
  assert(typeof value.intro === 'string' && value.intro.trim(), `${sourceLabel}: missing selfRepairTips.intro.`);
  for (const field of ['withoutOpening', 'technicalSpecialist', 'doNotDo']) {
    assert(
      Array.isArray(value[field]) &&
        value[field].length > 0 &&
        value[field].every((item) => typeof item === 'string' && item.trim()),
      `${sourceLabel}: selfRepairTips.${field} must be a non-empty string array.`
    );
  }
  assert(
    typeof value.qualificationNote === 'string' && value.qualificationNote.trim(),
    `${sourceLabel}: missing selfRepairTips.qualificationNote.`
  );
  return value;
}

function validateArticle(article, source, sourceLabel) {
  assert(article.locale === 'de', `${sourceLabel}: only the approved DE article may be seeded.`);
  assert(article.slug === source.cmsSlug, `${sourceLabel}: unexpected CMS slug.`);
  assert(article.publicSlug === source.publicSlug, `${sourceLabel}: unexpected public slug.`);
  assert(article.title === article.h1, `${sourceLabel}: CMS title must match the public H1.`);
  assert(
    article.canonicalUrl === `/de/probleme-loesungen/${source.publicSlug}`,
    `${sourceLabel}: canonical URL does not match the public slug.`
  );
  assert(article.ctaHref === '/de#contact', `${sourceLabel}: unexpected CTA href.`);
  assert(article.seoTitle.length >= 30 && article.seoTitle.length <= 65, `${sourceLabel}: SEO title length is outside 30-65 characters.`);
  assert(article.seoDescription.length >= 120 && article.seoDescription.length <= 160, `${sourceLabel}: SEO description length is outside 120-160 characters.`);
  for (const field of [
    'causes',
    'safeChecks',
    'urgentWarnings',
    'serviceProcess',
    'workScopeFactors',
    'relatedSlugs',
  ]) {
    assert(Array.isArray(article[field]) && article[field].length > 0, `${sourceLabel}: ${field} must not be empty.`);
  }
  assert(
    article.relatedSlugs.every((slug) => /^[a-z0-9-]+$/.test(slug) && slug !== article.slug),
    `${sourceLabel}: relatedSlugs contains an invalid or self-referencing slug.`
  );
}

function normalizeJson(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeJson);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalizeJson(value[key])])
    );
  }
  return value;
}

function assertEquivalent(actual, expected, field, sourceLabel) {
  const actualJson = JSON.stringify(normalizeJson(actual));
  const expectedJson = JSON.stringify(normalizeJson(expected));
  assert(actualJson === expectedJson, `${sourceLabel}: stored ${field} does not match the approved Markdown.`);
}

function readArticle(source) {
  const filePath = path.join(
    repoDir,
    'docs',
    '07_content_ai_seo',
    'problem_articles',
    source.folder,
    source.file
  );
  const sourceLabel = path.relative(repoDir, filePath);
  assert(fs.existsSync(filePath), `${sourceLabel}: source file does not exist.`);

  const markdown = fs.readFileSync(filePath, 'utf8');
  const frontmatter = extractFrontmatter(markdown, sourceLabel);
  const publicArticle = extractPublicArticle(markdown, sourceLabel);
  const mapping = extractCmsMapping(markdown, sourceLabel);

  assert(frontmatter.cms_slug === source.cmsSlug, `${sourceLabel}: frontmatter cms_slug mismatch.`);
  assert(frontmatter.slug === source.publicSlug, `${sourceLabel}: frontmatter slug mismatch.`);
  assert(frontmatter.locale === 'de', `${sourceLabel}: frontmatter locale must be de.`);
  assert(frontmatter.status === 'published_in_cms', `${sourceLabel}: unexpected editorial status.`);

  const article = {
    sourceFile: sourceLabel,
    sourceStatus: frontmatter.status,
    locale: 'de',
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: source.cmsSlug,
    publicSlug: source.publicSlug,
    title: parseScalar(mapping, 'title', sourceLabel),
    h1: publicArticle.h1,
    symptomLabel: parseScalar(mapping, 'symptomLabel', sourceLabel),
    shortAnswer: parseScalar(mapping, 'shortAnswer', sourceLabel),
    content: publicArticle.content,
    seoTitle: frontmatter.title,
    seoDescription: frontmatter.meta_description,
    canonicalUrl: `/de/probleme-loesungen/${source.publicSlug}`,
    relatedSlugs: parseList(mapping, 'relatedSlugs', sourceLabel),
    causes: parseList(mapping, 'causes', sourceLabel),
    safeChecks: parseList(mapping, 'safeChecks', sourceLabel),
    selfRepairTips: parseSelfRepairTips(mapping, sourceLabel),
    urgentWarnings: parseList(mapping, 'urgentWarnings', sourceLabel),
    serviceProcess: parseList(mapping, 'serviceProcess', sourceLabel),
    workScopeFactors: parseList(mapping, 'workScopeFactors', sourceLabel),
    ctaLabel: parseScalar(mapping, 'ctaLabel', sourceLabel),
    ctaHref: parseScalar(mapping, 'ctaHref', sourceLabel),
    sortOrder: source.sortOrder,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  validateArticle(article, source, sourceLabel);
  return article;
}

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
    "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
    "causes","safeChecks","selfRepairTips","urgentWarnings","serviceProcess","workScopeFactors",
    "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt",
    "deletedAt","createdAt","updatedAt"
  ) VALUES (
    $1,$2,$3::"CmsArticleType",$4::"CmsArticleStatus",$5,$6,$7,$8,
    $9,$10,$11,$12,$13::text[],$14::text[],$15::text[],$16::jsonb,$17::text[],
    $18::text[],$19::text[],$20,$21,$22,$23,$24,$25,$26,$27
  )
  ON CONFLICT ("locale", "slug")
  DO UPDATE SET
    "type" = EXCLUDED."type",
    "status" = EXCLUDED."status",
    "title" = EXCLUDED."title",
    "symptomLabel" = EXCLUDED."symptomLabel",
    "shortAnswer" = EXCLUDED."shortAnswer",
    "content" = EXCLUDED."content",
    "seoTitle" = EXCLUDED."seoTitle",
    "seoDescription" = EXCLUDED."seoDescription",
    "canonicalUrl" = EXCLUDED."canonicalUrl",
    "relatedSlugs" = EXCLUDED."relatedSlugs",
    "causes" = EXCLUDED."causes",
    "safeChecks" = EXCLUDED."safeChecks",
    "selfRepairTips" = EXCLUDED."selfRepairTips",
    "urgentWarnings" = EXCLUDED."urgentWarnings",
    "serviceProcess" = EXCLUDED."serviceProcess",
    "workScopeFactors" = EXCLUDED."workScopeFactors",
    "ctaLabel" = EXCLUDED."ctaLabel",
    "ctaHref" = EXCLUDED."ctaHref",
    "sortOrder" = EXCLUDED."sortOrder",
    "publishedAt" = COALESCE("cms_articles"."publishedAt", EXCLUDED."publishedAt"),
    "lastReviewedAt" = EXCLUDED."lastReviewedAt",
    "deletedAt" = EXCLUDED."deletedAt",
    "updatedAt" = EXCLUDED."updatedAt"
  RETURNING
    "id","locale","slug","status","canonicalUrl","sortOrder","publishedAt","lastReviewedAt","updatedAt",
    char_length("content") AS "contentChars",
    cardinality("causes") AS "causesCount",
    cardinality("safeChecks") AS "safeChecksCount",
    jsonb_typeof("selfRepairTips") AS "selfRepairTipsType"
`;

async function upsertArticle(client, article) {
  const values = [
    crypto.randomUUID(),
    article.locale,
    article.type,
    article.status,
    article.slug,
    article.title,
    article.symptomLabel,
    article.shortAnswer,
    article.content,
    article.seoTitle,
    article.seoDescription,
    article.canonicalUrl,
    article.relatedSlugs,
    article.causes,
    article.safeChecks,
    JSON.stringify(article.selfRepairTips),
    article.urgentWarnings,
    article.serviceProcess,
    article.workScopeFactors,
    article.ctaLabel,
    article.ctaHref,
    article.sortOrder,
    article.publishedAt,
    article.lastReviewedAt,
    article.deletedAt,
    article.createdAt,
    article.updatedAt,
  ];

  const result = await client.query(upsertSql, values);
  return result.rows[0];
}

async function verifyStoredArticle(client, article) {
  const result = await client.query(
    `
      SELECT
        "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
        "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
        "causes","safeChecks","selfRepairTips","urgentWarnings","serviceProcess","workScopeFactors",
        "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt","deletedAt","updatedAt"
      FROM "cms_articles"
      WHERE "locale" = $1 AND "slug" = $2
    `,
    [article.locale, article.slug]
  );

  assert(result.rowCount === 1, `${article.sourceFile}: expected one stored CMS row.`);
  const stored = result.rows[0];
  const expectedFields = [
    'locale',
    'type',
    'status',
    'slug',
    'title',
    'symptomLabel',
    'shortAnswer',
    'content',
    'seoTitle',
    'seoDescription',
    'canonicalUrl',
    'relatedSlugs',
    'causes',
    'safeChecks',
    'selfRepairTips',
    'urgentWarnings',
    'serviceProcess',
    'workScopeFactors',
    'ctaLabel',
    'ctaHref',
    'sortOrder',
    'deletedAt',
  ];

  for (const field of expectedFields) {
    assertEquivalent(stored[field], article[field], field, article.sourceFile);
  }
  assert(stored.publishedAt instanceof Date, `${article.sourceFile}: publishedAt is missing.`);
  assert(stored.lastReviewedAt instanceof Date, `${article.sourceFile}: lastReviewedAt is missing.`);

  return {
    id: stored.id,
    locale: stored.locale,
    slug: stored.slug,
    status: stored.status,
    canonicalUrl: stored.canonicalUrl,
    sortOrder: stored.sortOrder,
    publishedAt: stored.publishedAt,
    lastReviewedAt: stored.lastReviewedAt,
    updatedAt: stored.updatedAt,
    contentChars: stored.content.length,
    contentHash: crypto.createHash('sha256').update(stored.content).digest('hex'),
    selfRepairTipsType:
      stored.selfRepairTips && typeof stored.selfRepairTips === 'object' ? 'object' : null,
  };
}

function summarizeArticle(article) {
  return {
    sourceFile: article.sourceFile,
    sourceStatus: article.sourceStatus,
    locale: article.locale,
    cmsSlug: article.slug,
    publicSlug: article.publicSlug,
    status: article.status,
    title: article.title,
    canonicalUrl: article.canonicalUrl,
    contentChars: article.content.length,
    contentHash: crypto.createHash('sha256').update(article.content).digest('hex'),
    h2Count: article.content.match(/^##\s+/gm)?.length ?? 0,
    relatedSlugs: article.relatedSlugs,
    causesCount: article.causes.length,
    safeChecksCount: article.safeChecks.length,
    urgentWarningsCount: article.urgentWarnings.length,
    serviceProcessCount: article.serviceProcess.length,
    workScopeFactorsCount: article.workScopeFactors.length,
    selfRepairTips: {
      withoutOpening: article.selfRepairTips.withoutOpening.length,
      technicalSpecialist: article.selfRepairTips.technicalSpecialist.length,
      doNotDo: article.selfRepairTips.doNotDo.length,
      hasIntro: Boolean(article.selfRepairTips.intro),
      hasQualificationNote: Boolean(article.selfRepairTips.qualificationNote),
    },
  };
}

async function main() {
  const articles = ARTICLE_SOURCES.map(readArticle);

  if (isDryRun) {
    console.log(
      JSON.stringify(
        {
          seed: 'articles-shaky-urgent-de',
          dryRun: true,
          status: 'OK',
          articles: articles.map(summarizeArticle),
        },
        null,
        2
      )
    );
    return;
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    if (isVerify) {
      const results = [];
      for (const article of articles) {
        results.push(await verifyStoredArticle(client, article));
      }
      console.log(
        JSON.stringify(
          {
            seed: 'articles-shaky-urgent-de',
            verify: true,
            status: 'OK',
            results,
          },
          null,
          2
        )
      );
      return;
    }

    await client.query('BEGIN');
    const results = [];
    for (const article of articles) {
      results.push(await upsertArticle(client, article));
    }
    await client.query('COMMIT');

    console.log(
      JSON.stringify(
        {
          seed: 'articles-shaky-urgent-de',
          status: 'OK',
          results,
        },
        null,
        2
      )
    );
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
