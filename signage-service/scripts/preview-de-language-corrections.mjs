// Read-only preview of the corrections approved after the 2026-10-04 language audit.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const rules = JSON.parse(await readFile(new URL('./de-language-corrections-2026-10-04.json', import.meta.url), 'utf8'));
const output = process.argv.find((arg) => arg.startsWith('--output='))?.slice(9)
  ?? '/tmp/pixelring-de-fixes-2026-10-04/cms-preview.json';
if (process.argv.slice(2).some((arg) => !arg.startsWith('--output='))) {
  throw new Error('This script only supports --output=<path> and never writes to the CMS.');
}

const pageKeys = ['global', 'home', 'leistungen', 'business', 'about', 'referenzen', 'probleme-loesungen', 'status'];
const slugs = ['no-light', 'flicking', 'uneven-light', 'letter-out', 'rain-fail', 'peeling-film', 'faded-film', 'shaky-sign', 'urgent-repair'];
const protectedKeys = /^(?:id|slug|locale|type|status|pageKey|relatedSlugs|canonicalUrl|publishedAt|lastReviewedAt|createdAt|updatedAt|deletedAt)$|(?:Href|Url|Src|Id)$|^(?:href|url|src|image|beforeImage|afterImage)$/i;

function correctText(text) {
  // Preserve URLs, paths and placeholders even inside longer CMS text strings.
  return text.split(/(https?:\/\/[^\s"'<>]+|\([^\s]*\/[^\s)]*\)|\{[^{}]+\})/g).map((part, index) => {
    if (index % 2) return part;
    let next = part.replace(/[A-Za-zÄÖÜäöüß]+/g, (word) => {
      const replacement = rules.words[word.toLowerCase()];
      if (!replacement) return word;
      if (word === word.toUpperCase()) return replacement.toUpperCase();
      return word[0] === word[0].toUpperCase()
        ? replacement[0].toUpperCase() + replacement.slice(1)
        : replacement;
    });
    for (const [before, after] of rules.phrases) next = next.replaceAll(before, after);
    return next;
  }).join('');
}

function previewValue(value, location, changes) {
  if (typeof value === 'string') {
    const after = correctText(value);
    if (after !== value) changes.push({ field: location, before: value, after });
    return after;
  }
  if (Array.isArray(value)) return value.map((item, index) => previewValue(item, `${location}[${index}]`, changes));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
      protectedKeys.test(key) ? item : previewValue(item, location ? `${location}.${key}` : key, changes),
    ]));
  }
  return value;
}

const rawUrl = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;
if (!rawUrl) throw new Error('CMS database configuration is missing.');
const databaseUrl = new URL(rawUrl);
if (['prefer', 'require', 'verify-ca'].includes(databaseUrl.searchParams.get('sslmode'))) {
  databaseUrl.searchParams.set('sslmode', 'verify-full');
}
const client = new pg.Client({ connectionString: databaseUrl.toString(), connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  await client.query('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
  await client.query("SET LOCAL statement_timeout = '20s'");
  const pages = (await client.query(
    'SELECT * FROM cms_pages WHERE locale = $1 AND status = $2 AND "deletedAt" IS NULL AND "pageKey" = ANY($3::text[]) ORDER BY "pageKey"',
    ['de', 'PUBLISHED', pageKeys],
  )).rows;
  const articles = (await client.query(
    'SELECT * FROM cms_articles WHERE locale = $1 AND type = $2 AND status = $3 AND "deletedAt" IS NULL AND slug = ANY($4::text[]) ORDER BY slug',
    ['de', 'SYMPTOM', 'PUBLISHED', slugs],
  )).rows;
  const records = [...pages.map((row) => ({ kind: 'page', key: row.pageKey, row })), ...articles.map((row) => ({ kind: 'article', key: row.slug, row }))].map(({ kind, key, row }) => {
    const changes = [];
    const before = JSON.parse(JSON.stringify(row));
    const after = previewValue(before, '', changes);
    return { kind, key, id: row.id, expectedUpdatedAt: row.updatedAt, before, after, changes };
  });
  await client.query('ROLLBACK');
  await mkdir(path.dirname(path.resolve(output)), { recursive: true });
  await writeFile(output, JSON.stringify({ createdAt: new Date().toISOString(), readOnly: true, locale: 'de', records }, null, 2) + '\n');
  console.log(JSON.stringify({ pages: pages.length, articles: articles.length, recordsWithChanges: records.filter((row) => row.changes.length).length, changedFields: records.reduce((count, row) => count + row.changes.length, 0), output }, null, 2));
} catch (error) {
  // Avoid printing connection strings or private environment values.
  console.error(`CMS preview failed (${error.code ?? error.name}). No database writes were performed.`);
  process.exitCode = 1;
} finally {
  await client.end();
}
