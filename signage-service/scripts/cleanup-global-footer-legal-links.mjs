import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

const apply = process.argv.includes('--apply');
const activeLegalHrefs = new Set(['/impressum', '/privacy']);
const removedLegalHrefs = new Set(['/terms', '/cancellation', '/cookies']);
const revisionReason = 'Cleanup obsolete global footer legal links';

if (!connectionString) {
  throw new Error(
    'Missing POSTGRES_PRISMA_URL, DATABASE_URL, DIRECT_URL, or POSTGRES_URL_NON_POOLING.'
  );
}

function normalizeTimestamp(value) {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function buildPageRevisionSnapshot(row) {
  return {
    pageKey: row.pageKey,
    locale: row.locale,
    status: row.status,
    title: row.title,
    blocks: row.blocks,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    canonicalUrl: row.canonicalUrl,
    publishedAt: normalizeTimestamp(row.publishedAt),
    lastReviewedAt: normalizeTimestamp(row.lastReviewedAt),
  };
}

function cleanupFooterLegalBlocks(blocks) {
  if (!Array.isArray(blocks)) {
    return { blocks, changed: false, removed: [], kept: [], reason: 'blocks-not-array' };
  }

  let changed = false;
  const removed = [];
  const kept = [];

  const nextBlocks = blocks.map((block) => {
    if (!block || typeof block !== 'object' || block.key !== 'footerLegal') {
      return block;
    }

    if (!Array.isArray(block.items)) {
      return block;
    }

    const nextItems = block.items.filter((item) => {
      const href = typeof item?.href === 'string' ? item.href.trim() : '';

      if (activeLegalHrefs.has(href)) {
        kept.push(href);
        return true;
      }

      if (removedLegalHrefs.has(href)) {
        removed.push(href);
        changed = true;
        return false;
      }

      kept.push(href || '(missing href)');
      return true;
    });

    if (nextItems.length !== block.items.length) {
      return {
        ...block,
        items: nextItems,
      };
    }

    return block;
  });

  return { blocks: nextBlocks, changed, removed, kept, reason: null };
}

async function insertRevision(client, row) {
  await client.query(
    `
      insert into cms_page_revisions (
        id,
        "pageId",
        "sourceAction",
        reason,
        "actorAdminUserId",
        "actorSessionId",
        "actorRole",
        snapshot
      )
      values ($1, $2, 'UPDATE', $3, null, null, null, $4::jsonb)
    `,
    [
      crypto.randomUUID(),
      row.id,
      revisionReason,
      JSON.stringify(buildPageRevisionSnapshot(row)),
    ]
  );
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query(
      `
        select
          id,
          "pageKey" as "pageKey",
          locale,
          status,
          title,
          blocks,
          "seoTitle" as "seoTitle",
          "seoDescription" as "seoDescription",
          "canonicalUrl" as "canonicalUrl",
          "publishedAt" as "publishedAt",
          "lastReviewedAt" as "lastReviewedAt",
          "deletedAt" as "deletedAt"
        from cms_pages
        where "pageKey" = 'global'
        order by locale asc
      `
    );

    console.log(`Mode: ${apply ? 'apply' : 'dry-run'}`);
    console.log(`Global CMS pages found: ${result.rows.length}`);

    let changedCount = 0;

    for (const row of result.rows) {
      const cleanup = cleanupFooterLegalBlocks(row.blocks);

      if (cleanup.reason) {
        console.log(`- ${row.locale}: skipped (${cleanup.reason})`);
        continue;
      }

      if (!cleanup.changed) {
        console.log(`- ${row.locale}: no obsolete legal links found`);
        continue;
      }

      changedCount += 1;
      console.log(
        `- ${row.locale}: remove ${cleanup.removed.join(', ')}; keep ${cleanup.kept.join(', ')}`
      );

      if (!apply) {
        continue;
      }

      await client.query('begin');
      try {
        await insertRevision(client, row);
        await client.query(
          `
            update cms_pages
            set blocks = $2::jsonb, "updatedAt" = now()
            where id = $1
          `,
          [row.id, JSON.stringify(cleanup.blocks)]
        );
        await client.query('commit');
      } catch (error) {
        await client.query('rollback');
        throw error;
      }
    }

    if (!apply) {
      console.log('Dry run only. Re-run with --apply to update CMS pages.');
    }

    console.log(`Pages needing cleanup: ${changedCount}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
