/**
 * Seed: multilingual article for "Uneven LED illumination" (uneven-light).
 *
 * Reads the owner-review markdown drafts from docs/07_content_ai_seo and publishes
 * the public full article section into cms_articles for all MVP locales.
 *
 * Run: node scripts/seed-article-uneven-light-all-locales.mjs
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

dotenv.config({ path: path.join(appDir, '.env.local') });
dotenv.config({ path: path.join(appDir, '.env') });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error('Missing DB connection string.');
}

const now = new Date();

const ARTICLE_FOLDER = path.join(
  repoDir,
  'docs',
  '07_content_ai_seo',
  'problem_articles',
  'led светит неравномерно – 03'
);

const LOCALE_CONFIG = {
  de: {
    file: 'problem_article_led_svetit_neravnomerno_de.md',
    ctaLabel: 'Problem übergeben',
  },
  en: {
    file: 'problem_article_led_svetit_neravnomerno_en.md',
    ctaLabel: 'Send the issue',
  },
  ru: {
    file: 'problem_article_led_svetit_neravnomerno_ru.md',
    ctaLabel: 'Передать задачу',
  },
  tr: {
    file: 'problem_article_led_svetit_neravnomerno_tr.md',
    ctaLabel: 'Sorunu ilet',
  },
  pl: {
    file: 'problem_article_led_svetit_neravnomerno_pl.md',
    ctaLabel: 'Przekaż zgłoszenie',
  },
  ar: {
    file: 'problem_article_led_svetit_neravnomerno_ar.md',
    ctaLabel: 'أرسل المشكلة',
  },
};

function extractPublicArticle(markdown) {
  const match = markdown.match(/## 3\.[^\n]*\n\n([\s\S]*?)\n\n---\n\n## 4\./);
  if (!match) {
    throw new Error('Could not extract public full article section from markdown.');
  }

  const content = match[1].trim();
  if (!content.startsWith('# ')) {
    throw new Error('Extracted article does not start with H1.');
  }
  if (content.length < 5000) {
    throw new Error(`Extracted article is unexpectedly short: ${content.length} characters.`);
  }

  return content;
}

function extractCmsSection(markdown) {
  const match = markdown.match(/## 4\.[^\n]*\n\n([\s\S]*?)\n\n---\n\n## 5\./);
  if (!match) {
    throw new Error('Could not extract CMS fields section from markdown.');
  }

  return match[1].trim();
}

function extractField(section, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = section.match(new RegExp(`### ${escapedHeading}\\n\\n([\\s\\S]*?)(?=\\n\\n### |$)`));

  if (!match) {
    throw new Error(`Missing CMS field: ${heading}`);
  }

  return match[1].trim();
}

function extractTextField(section, heading) {
  const value = extractField(section, heading);
  if (!value) {
    throw new Error(`Empty CMS field: ${heading}`);
  }

  return value;
}

function extractListField(section, heading) {
  const value = extractField(section, heading);
  const items = value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .map((line) => line.replace(/^`|`$/g, '').replace(/\.$/, '').trim())
    .filter(Boolean);

  if (items.length === 0) {
    throw new Error(`Empty list CMS field: ${heading}`);
  }

  return items;
}

function readArticle(locale, config) {
  const filePath = path.join(ARTICLE_FOLDER, config.file);
  const markdown = fs.readFileSync(filePath, 'utf8');
  const cmsSection = extractCmsSection(markdown);

  return {
    locale,
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: 'uneven-light',
    title: extractTextField(cmsSection, 'Title'),
    symptomLabel: extractTextField(cmsSection, 'Symptom label'),
    shortAnswer: extractTextField(cmsSection, 'Short answer'),
    content: extractPublicArticle(markdown),
    seoTitle: extractTextField(cmsSection, 'SEO title'),
    seoDescription: extractTextField(cmsSection, 'SEO description'),
    canonicalUrl: `/${locale}/probleme-loesungen/led-leuchtet-ungleichmaessig`,
    relatedSlugs: extractListField(cmsSection, 'Related slugs'),
    causes: extractListField(cmsSection, 'Causes'),
    safeChecks: extractListField(cmsSection, 'Safe checks'),
    urgentWarnings: [extractTextField(cmsSection, 'Urgent warnings')],
    serviceProcess: [extractTextField(cmsSection, 'Service process')],
    workScopeFactors: extractListField(cmsSection, 'Work scope factors'),
    ctaLabel: config.ctaLabel,
    ctaHref: `/${locale}#contact`,
    sortOrder: 2,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
    "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
    "causes","safeChecks","urgentWarnings","serviceProcess","workScopeFactors",
    "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt",
    "deletedAt","createdAt","updatedAt"
  ) VALUES (
    $1,$2,$3::"CmsArticleType",$4::"CmsArticleStatus",$5,$6,$7,$8,
    $9,$10,$11,$12,$13::text[],$14::text[],$15::text[],$16::text[],
    $17::text[],$18::text[],$19,$20,$21,$22,$23,$24,$25,$26
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
    "urgentWarnings" = EXCLUDED."urgentWarnings",
    "serviceProcess" = EXCLUDED."serviceProcess",
    "workScopeFactors" = EXCLUDED."workScopeFactors",
    "ctaLabel" = EXCLUDED."ctaLabel",
    "ctaHref" = EXCLUDED."ctaHref",
    "sortOrder" = EXCLUDED."sortOrder",
    "publishedAt" = EXCLUDED."publishedAt",
    "lastReviewedAt" = EXCLUDED."lastReviewedAt",
    "deletedAt" = EXCLUDED."deletedAt",
    "updatedAt" = EXCLUDED."updatedAt"
  RETURNING "id", "locale", "slug", "status", char_length("content") AS "contentChars"
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

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const results = [];
    for (const [locale, config] of Object.entries(LOCALE_CONFIG)) {
      const article = readArticle(locale, config);
      results.push(await upsertArticle(client, article));
    }

    console.log(
      JSON.stringify(
        {
          seed: 'article-uneven-light-all-locales',
          slug: 'uneven-light',
          status: 'OK',
          results,
        },
        null,
        2
      )
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
