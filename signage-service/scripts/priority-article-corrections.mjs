// Preview by default. Apply only the exact reviewed preview, with rollback revisions and audit entries.
// node scripts/priority-article-corrections.mjs --output=/tmp/priority-articles.json
// node scripts/priority-article-corrections.mjs --apply --plan=/tmp/priority-articles.json
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

const RULES_FILE = new URL('./priority-article-corrections-2026-11-16.json', import.meta.url);
const TARGETS = ['de/flicking', 'de/uneven-light', 'en/flicking', 'en/uneven-light'];
const CONTENT_FIELDS = ['shortAnswer', 'content'];
const SNAPSHOT_FIELDS = ['locale', 'type', 'status', 'slug', 'title', 'symptomLabel',
  'shortAnswer', 'content', 'seoTitle', 'seoDescription', 'canonicalUrl', 'relatedSlugs',
  'causes', 'safeChecks', 'selfRepairTips', 'urgentWarnings', 'serviceProcess',
  'workScopeFactors', 'ctaLabel', 'ctaHref', 'sortOrder', 'publishedAt', 'lastReviewedAt'];
const REASON = 'Owner-approved DE/EN diagnostic article improvements after the 2026-11-16 indexing review.';
const serialize = (value) => JSON.parse(JSON.stringify(value));

export function correctPriorityArticle(row, rules) {
  const key = `${row.locale}/${row.slug}`;
  if (!TARGETS.includes(key) || row.type !== 'SYMPTOM' || row.status !== 'PUBLISHED' || row.deletedAt !== null) {
    throw new Error('Unexpected article target.');
  }
  const rule = rules.find((candidate) => `${candidate.locale}/${candidate.slug}` === key);
  if (!rule) throw new Error('Missing correction rule.');
  const after = serialize(row);
  for (const field of CONTENT_FIELDS) {
    const correction = rule[field];
    const value = row[field];
    if (typeof value !== 'string' || !correction?.before || !correction?.after) {
      throw new Error(`Invalid correction field: ${key}/${field}`);
    }
    if (field === 'shortAnswer') {
      if (value !== correction.before && value !== correction.after) {
        throw new Error(`Summary changed since the content review: ${key}`);
      }
      after[field] = correction.after;
    } else if (value.includes(correction.before)) {
      if (value.split(correction.before).length !== 2) throw new Error(`Ambiguous body match: ${key}`);
      after[field] = value.replace(correction.before, correction.after);
    } else if (value.split(correction.after).length !== 2) {
      throw new Error(`Article introduction changed since the content review: ${key}`);
    }
  }
  return after;
}

export function buildPriorityArticlePlan(rows, rules) {
  if (rows.length !== TARGETS.length || new Set(rows.map((row) => `${row.locale}/${row.slug}`)).size !== TARGETS.length) {
    throw new Error('All four distinct published article records are required.');
  }
  const records = rows.map((row) => {
    const before = serialize(row);
    const after = correctPriorityArticle(before, rules);
    return {
      key: `${before.locale}/${before.slug}`, id: before.id, before, after,
      changes: CONTENT_FIELDS.filter((field) => before[field] !== after[field])
        .map((field) => ({ field, before: before[field], after: after[field] })),
    };
  });
  return { version: 1, readOnly: true, createdAt: new Date().toISOString(), records };
}

export function validatePriorityArticlePlan(plan, rules) {
  if (plan.version !== 1 || plan.readOnly !== true || !Array.isArray(plan.records)) {
    throw new Error('Invalid article preview.');
  }
  const rebuilt = buildPriorityArticlePlan(plan.records.map((record) => record.before), rules);
  if (!isDeepStrictEqual(rebuilt.records, plan.records)) {
    throw new Error('Preview differs from the reviewed correction rules.');
  }
  if (new Set(plan.records.map((record) => record.id)).size !== TARGETS.length) {
    throw new Error('Duplicate article ID.');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const planFile = args.find((arg) => arg.startsWith('--plan='))?.slice(7);
  const output = args.find((arg) => arg.startsWith('--output='))?.slice(9)
    ?? '/tmp/pixelring-seo-2026-11-16/diagnostic_articles/article-preview.json';
  if (args.some((arg) => arg !== '--apply' && !arg.startsWith('--plan=') && !arg.startsWith('--output='))
    || (apply && (!planFile || args.some((arg) => arg.startsWith('--output='))))
    || (!apply && planFile)) {
    throw new Error('Use --output=<path> for a read-only preview, or --apply --plan=<reviewed-preview.json>.');
  }
  const { rules } = JSON.parse(await readFile(RULES_FILE, 'utf8'));
  const plan = apply ? JSON.parse(await readFile(planFile, 'utf8')) : null;
  if (plan) validatePriorityArticlePlan(plan, rules);
  dotenv.config({ path: '.env.local', quiet: true });
  dotenv.config({ quiet: true });
  const rawUrl = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;
  if (!rawUrl) throw new Error('CMS database configuration is missing.');
  const databaseUrl = new URL(rawUrl);
  if (['prefer', 'require', 'verify-ca'].includes(databaseUrl.searchParams.get('sslmode'))) {
    databaseUrl.searchParams.set('sslmode', 'verify-full');
  }
  const client = new pg.Client({ connectionString: databaseUrl.toString(), connectionTimeoutMillis: 15000 });
  let committed = false;
  try {
    await client.connect();
    await client.query(apply ? 'BEGIN' : 'BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
    await client.query("SET LOCAL statement_timeout = '20s'");
    if (!apply) {
      const rows = (await client.query(
        'SELECT * FROM cms_articles WHERE locale = ANY($1::text[]) AND slug = ANY($2::text[]) AND type = $3 AND status = $4 AND "deletedAt" IS NULL ORDER BY locale, slug',
        [['de', 'en'], ['flicking', 'uneven-light'], 'SYMPTOM', 'PUBLISHED'],
      )).rows;
      const preview = buildPriorityArticlePlan(rows, rules);
      await client.query('ROLLBACK');
      await mkdir(path.dirname(path.resolve(output)), { recursive: true });
      await writeFile(output, JSON.stringify(preview, null, 2) + '\n', { mode: 0o600 });
      console.log(JSON.stringify({ readOnly: true, output, records: preview.records.map(({ key, changes }) => ({ key, changedFields: changes.map(({ field }) => field) })) }, null, 2));
      return;
    }
    const results = [];
    for (const record of plan.records) {
      const current = (await client.query('SELECT * FROM cms_articles WHERE id = $1 FOR UPDATE', [record.id])).rows[0];
      if (!current || !isDeepStrictEqual(serialize(current), record.before)) {
        throw new Error('CMS content changed since the preview. Regenerate and review it first.');
      }
      const fields = record.changes.map(({ field }) => field);
      if (!fields.length) continue;
      const snapshot = (row) => Object.fromEntries(SNAPSHOT_FIELDS.map((field) => [field, row[field]]));
      await client.query('INSERT INTO cms_article_revisions (id, "articleId", "sourceAction", reason, snapshot, "createdAt") VALUES ($1, $2, \'UPDATE\', $3, $4::jsonb, NOW())',
        [randomUUID(), record.id, `Before: ${REASON}`, JSON.stringify(snapshot(record.before))]);
      const values = fields.map((field) => record.after[field]);
      const assignments = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
      const updated = (await client.query(`UPDATE cms_articles SET ${assignments}, "updatedAt" = NOW() WHERE id = $${values.length + 1} RETURNING *`, [...values, record.id])).rows[0];
      await client.query('INSERT INTO cms_article_revisions (id, "articleId", "sourceAction", reason, snapshot, "createdAt") VALUES ($1, $2, \'UPDATE\', $3, $4::jsonb, clock_timestamp())',
        [randomUUID(), record.id, REASON, JSON.stringify(snapshot(serialize(updated)))]);
      const details = {
        source: 'codex-priority-articles-2026-11-16',
        authorization: 'Project owner approved both DE/EN improvement packages in the current chat.',
        locale: current.locale, key: current.slug, changedFields: fields,
        previousStatus: current.status, nextStatus: updated.status,
        revisionSnapshot: { schemaVersion: 1, entity: 'CMS_ARTICLE', data: serialize(updated) },
      };
      await client.query('INSERT INTO admin_audit_logs (id, action, "resourceType", "resourceId", outcome, reason, details, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())',
        [randomUUID(), 'CMS_ARTICLE_UPDATED', 'CMS_ARTICLE', record.id, 'SUCCESS', REASON, JSON.stringify(details)]);
      results.push({ key: record.key, changedFields: fields, updatedAt: updated.updatedAt });
    }
    await client.query('COMMIT');
    committed = true;
    await writeFile(`${planFile}.applied.json`, JSON.stringify({ appliedAt: new Date().toISOString(), records: results }, null, 2) + '\n', { mode: 0o600 });
    console.log(JSON.stringify({ applied: results.length, revisions: results.length * 2, auditEntries: results.length }, null, 2));
  } catch (error) {
    if (!committed) await client.query('ROLLBACK').catch(() => undefined);
    console.error(committed
      ? 'CMS changes committed, but the receipt could not be written. Inspect the CMS before retrying.'
      : `Article correction ${apply ? 'rolled back' : 'preview failed'} (${error.code ?? error.name}).`);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Article correction stopped (${error.code ?? error.name}). No apply transaction was started.`);
    process.exitCode = 1;
  });
}
