// Explicit one-time operation. Dry-run by default; never sends or queues email.
import 'dotenv/config';
import pg from 'pg';
const apply = process.argv.includes('--apply');
if (apply && process.env.ALLOW_ATTENTION_BACKFILL !== '1') throw new Error('Set ALLOW_ATTENTION_BACKFILL=1 for the explicitly approved database.');
const connectionString = process.env.DIRECT_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error('A database URL is required.');
const client = new pg.Client({ connectionString });
await client.connect();
const candidates = `
WITH materials AS (
 SELECT d."caseId", d.id::text AS "sourceId", 'DOCUMENT'::text AS kind, d.title, d.comment AS body, d.type AS "documentType", d."publishedAt" AS "createdAt"
 FROM case_documents d WHERE d."publishedAt" IS NOT NULL
 UNION ALL
 SELECT w."caseId", r.id::text, 'REPORT', '', '', NULL, r."publishedAt"
 FROM work_results w JOIN work_result_revisions r ON r."workResultId"=w.id AND r.number=w."publishedVersion"
), candidates AS (
 SELECT m.*, a."portalUserId", m.kind || ':' || m."caseId"::text || ':' || m."sourceId" AS "sourceKey"
 FROM materials m JOIN cases c ON c.id=m."caseId" AND c."publicRequestNumber" IS NOT NULL
 JOIN portal_case_accesses a ON a."caseId"=m."caseId" AND a."revokedAt" IS NULL
 JOIN portal_users u ON u.id=a."portalUserId" AND u.status='ACTIVE'
)
`;
try {
  await client.query('BEGIN');
  await client.query("SET LOCAL lock_timeout = '10s'");
  await client.query("SET LOCAL statement_timeout = '60s'");
  const { rows } = await client.query(candidates + `SELECT count(*)::int AS count FROM candidates c WHERE NOT EXISTS (SELECT 1 FROM portal_attention p WHERE p."portalUserId"=c."portalUserId" AND p."sourceKey"=c."sourceKey")`);
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', missingAttentionItems: rows[0].count, emailQueued: 0 }));
  if (apply) {
    const result = await client.query(candidates + `INSERT INTO portal_attention (id,"caseId","portalUserId","sourceKey","sourceId",kind,title,body,"documentType",mode,state,"createdAt","updatedAt") SELECT gen_random_uuid(),"caseId","portalUserId","sourceKey","sourceId",kind,title,COALESCE(body,''),"documentType",'ACKNOWLEDGE','OPEN',"createdAt",NOW() FROM candidates ON CONFLICT ("portalUserId","sourceKey") DO NOTHING`);
    console.log(JSON.stringify({ inserted: result.rowCount }));
  }
  await client.query(apply ? 'COMMIT' : 'ROLLBACK');
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { await client.end(); }
