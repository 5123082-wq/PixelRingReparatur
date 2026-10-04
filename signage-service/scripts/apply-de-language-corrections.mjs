// Apply only a reviewed preview from preview-de-language-corrections.mjs.
// Content changes, rollback snapshots and audit entries share one transaction.
import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });
const args = process.argv.slice(2);
const planFile = args.find((arg) => arg.startsWith('--plan='))?.slice(7);
if (!args.includes('--apply') || !planFile || args.some((arg) => arg !== '--apply' && !arg.startsWith('--plan='))) {
  throw new Error('Usage: node scripts/apply-de-language-corrections.mjs --apply --plan=<reviewed-preview.json>');
}
const plan = JSON.parse(await readFile(planFile, 'utf8'));
if (plan.locale !== 'de' || plan.readOnly !== true || !Array.isArray(plan.records)) throw new Error('Invalid correction preview.');
const pageKeys = ['global', 'home', 'leistungen', 'business', 'about', 'referenzen', 'probleme-loesungen', 'status'];
const slugs = ['no-light', 'flicking', 'uneven-light', 'letter-out', 'rain-fail', 'peeling-film', 'faded-film', 'shaky-sign', 'urgent-repair'];
const articleFields = ['title', 'symptomLabel', 'shortAnswer', 'content', 'seoTitle', 'seoDescription', 'causes', 'safeChecks', 'selfRepairTips', 'urgentWarnings', 'serviceProcess', 'workScopeFactors', 'ctaLabel'];
const pageFields = ['title', 'blocks', 'seoTitle', 'seoDescription'];
const snapshotFields = {
  page: ['pageKey', 'locale', 'status', ...pageFields, 'canonicalUrl', 'publishedAt', 'lastReviewedAt'],
  article: ['locale', 'type', 'status', 'slug', ...articleFields, 'canonicalUrl', 'relatedSlugs', 'ctaHref', 'sortOrder', 'publishedAt', 'lastReviewedAt'],
};
const serialize = (value) => JSON.parse(JSON.stringify(value));
const changedRecords = plan.records.filter((record) => record.changes.length);
const seen = new Set();
for (const record of changedRecords) {
  if (seen.has(record.id)) throw new Error('Duplicate correction record.');
  seen.add(record.id);
  const allowed = record.kind === 'page' ? pageFields : record.kind === 'article' ? articleFields : [];
  const validKey = record.kind === 'page' ? pageKeys.includes(record.key) : slugs.includes(record.key);
  if (!validKey || record.before.locale !== 'de' || record.after.locale !== 'de' || record.before.status !== 'PUBLISHED') throw new Error('Unexpected correction target.');
  if (record.kind === 'article' && record.before.type !== 'SYMPTOM') throw new Error('Unexpected article type.');
  for (const key of Object.keys(record.before)) {
    if (!allowed.includes(key) && !isDeepStrictEqual(record.before[key], record.after[key])) throw new Error(`Protected field changed: ${key}`);
  }
  if (!isDeepStrictEqual(Object.keys(record.before).sort(), Object.keys(record.after).sort())) throw new Error('Preview changes record structure.');
}
const databaseUrl = new URL(process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL);
if (['prefer', 'require', 'verify-ca'].includes(databaseUrl.searchParams.get('sslmode'))) databaseUrl.searchParams.set('sslmode', 'verify-full');
const client = new pg.Client({ connectionString: databaseUrl.toString(), connectionTimeoutMillis: 15000 });
const reason = 'Owner-approved German language corrections after the 2026-10-04 page-by-page audit.';
let committed = false;
try {
  await client.connect();
  await client.query('BEGIN');
  await client.query("SET LOCAL statement_timeout = '20s'");
  const results = [];
  for (const record of changedRecords) {
    const table = record.kind === 'page' ? 'cms_pages' : 'cms_articles';
    const revisionTable = record.kind === 'page' ? 'cms_page_revisions' : 'cms_article_revisions';
    const relationColumn = record.kind === 'page' ? 'pageId' : 'articleId';
    const current = (await client.query(`SELECT * FROM ${table} WHERE id = $1 FOR UPDATE`, [record.id])).rows[0];
    if (!current || !isDeepStrictEqual(serialize(current), record.before)) throw new Error('CMS content changed since the preview. Regenerate and review it first.');
    const allowed = record.kind === 'page' ? pageFields : articleFields;
    const fields = allowed.filter((field) => !isDeepStrictEqual(record.before[field], record.after[field]));
    if (!fields.length) continue;
    const snapshot = (row) => Object.fromEntries(snapshotFields[record.kind].map((key) => [key, row[key]]));
    await client.query(`INSERT INTO ${revisionTable} (id, "${relationColumn}", "sourceAction", reason, snapshot, "createdAt") VALUES ($1, $2, 'UPDATE', $3, $4::jsonb, NOW())`, [randomUUID(), record.id, `Before: ${reason}`, JSON.stringify(snapshot(record.before))]);
    const values = fields.map((field) => ['blocks', 'selfRepairTips'].includes(field) ? JSON.stringify(record.after[field]) : record.after[field]);
    const assignments = fields.map((field, index) => `"${field}" = $${index + 1}${['blocks', 'selfRepairTips'].includes(field) ? '::jsonb' : ''}`).join(', ');
    const updated = (await client.query(`UPDATE ${table} SET ${assignments}, "updatedAt" = NOW() WHERE id = $${values.length + 1} RETURNING *`, [...values, record.id])).rows[0];
    const updatedSnapshot = snapshot(serialize(updated));
    await client.query(`INSERT INTO ${revisionTable} (id, "${relationColumn}", "sourceAction", reason, snapshot, "createdAt") VALUES ($1, $2, 'UPDATE', $3, $4::jsonb, clock_timestamp())`, [randomUUID(), record.id, reason, JSON.stringify(updatedSnapshot)]);
    const resourceType = record.kind === 'page' ? 'CMS_PAGE' : 'CMS_ARTICLE';
    const details = {
      source: 'codex-language-corrections-2026-10-04',
      authorization: 'Project owner approved correcting the completed language audit in the current chat.',
      locale: 'de', key: record.key, changedFields: fields,
      previousStatus: current.status, nextStatus: updated.status,
      revisionSnapshot: { schemaVersion: 1, entity: resourceType, data: serialize(updated) },
    };
    await client.query('INSERT INTO admin_audit_logs (id, action, "resourceType", "resourceId", outcome, reason, details, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())', [randomUUID(), `${resourceType}_UPDATED`, resourceType, record.id, 'SUCCESS', reason, JSON.stringify(details)]);
    results.push({ kind: record.kind, key: record.key, id: record.id, changedFields: fields, updatedAt: updated.updatedAt });
  }
  await client.query('COMMIT');
  committed = true;
  await writeFile(`${planFile}.applied.json`, JSON.stringify({ appliedAt: new Date().toISOString(), records: results }, null, 2) + '\n');
  console.log(JSON.stringify({ applied: results.length, revisions: results.length * 2, auditEntries: results.length }, null, 2));
} catch (error) {
  if (!committed) await client.query('ROLLBACK').catch(() => undefined);
  console.error(committed ? 'CMS changes committed, but receipt could not be written. Inspect the CMS before retrying.' : `CMS corrections rolled back (${error.code ?? error.name}).`);
  process.exitCode = 1;
} finally {
  await client.end();
}
