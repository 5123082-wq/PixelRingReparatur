/**
 * Seed structured selfRepairTips JSON for selected problem articles.
 *
 * This intentionally patches existing published article rows only. It does not
 * create missing full articles for locales that do not have approved content yet.
 *
 * Run: node scripts/seed-article-self-repair-tips.mjs
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

import { ARTICLE_SELF_REPAIR_TIPS } from './article-self-repair-tips-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');

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

const updateSql = `
  UPDATE "cms_articles"
  SET
    "selfRepairTips" = $3::jsonb,
    "updatedAt" = $4
  WHERE "slug" = $1
    AND "locale" = $2
    AND "deletedAt" IS NULL
  RETURNING "id", "locale", "slug", "status"
`;

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const now = new Date();
    const results = [];
    const skipped = [];

    for (const [slug, localeTips] of Object.entries(ARTICLE_SELF_REPAIR_TIPS)) {
      for (const [locale, tips] of Object.entries(localeTips)) {
        const result = await client.query(updateSql, [slug, locale, JSON.stringify(tips), now]);
        if (result.rowCount === 0) {
          skipped.push({ slug, locale, reason: 'article row not found' });
          continue;
        }

        results.push(result.rows[0]);
      }
    }

    console.log(
      JSON.stringify(
        {
          seed: 'article-self-repair-tips',
          status: 'OK',
          results,
          skipped,
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
