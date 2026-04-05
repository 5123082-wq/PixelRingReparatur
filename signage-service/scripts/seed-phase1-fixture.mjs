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
  process.env.DIRECT_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'Missing DIRECT_URL, POSTGRES_PRISMA_URL, or DATABASE_URL for Phase 1 seed.'
  );
}

const FIXTURE = {
  customerName: 'Phase 1 Test Customer',
  customerEmail: 'phase1.fixture@pixelring.example',
  customerPhone: '+491550001140',
  publicRequestNumber: 'PR-PH11-T3ST',
  locale: 'ru',
  summary: 'LED sign flickers after rain on the storefront.',
  description:
    'The front LED sign started flickering after heavy rain. The customer asked for diagnostics and a repair estimate.',
  status: 'IN_PROGRESS',
  originChannel: 'WEBSITE_FORM',
  primaryContactMethod: 'EMAIL',
};

function createToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function subtractHours(date, hours) {
  return new Date(date.getTime() - hours * 60 * 60 * 1000);
}

const now = new Date();
const createdAt = subtractHours(now, 72);
const formalizedAt = subtractHours(now, 71);
const numberIssuedAt = subtractHours(now, 70);
const statusUpdatedAt = subtractHours(now, 18);
const expiresAt = addDays(now, 180);
const sessionToken = createToken();
const sessionTokenHash = hashToken(sessionToken);

const caseId = crypto.randomUUID();
const sessionId = crypto.randomUUID();
const customerMessageId = crypto.randomUUID();
const operatorMessageId = crypto.randomUUID();
const systemMessageId = crypto.randomUUID();

const client = new Client({ connectionString });

async function cleanupExistingFixture() {
  const existingCases = await client.query(
    `select id from cases where "customerEmail" = $1 or "publicRequestNumber" = $2`,
    [FIXTURE.customerEmail, FIXTURE.publicRequestNumber]
  );

  for (const row of existingCases.rows) {
    await client.query(`delete from attachments where "caseId" = $1`, [row.id]);
    await client.query(`delete from messages where "caseId" = $1`, [row.id]);
    await client.query(`delete from sessions where "caseId" = $1`, [row.id]);
    await client.query(`delete from cases where id = $1`, [row.id]);
  }
}

async function seedFixture() {
  await client.connect();

  try {
    await client.query('begin');
    await cleanupExistingFixture();

    await client.query(
      `insert into cases (
        id,
        "publicRequestNumber",
        status,
        "originChannel",
        "customerName",
        "customerEmail",
        "customerPhone",
        "primaryContactMethod",
        "primaryContactValue",
        summary,
        description,
        locale,
        "numberIssuedAt",
        "formalizedAt",
        "statusUpdatedAt",
        "createdAt",
        "updatedAt"
      ) values (
        $1, $2, $3::"CaseStatus", $4::"CaseOriginChannel", $5, $6, $7,
        $8::"PrimaryContactMethod", $9, $10, $11, $12, $13, $14, $15, $16, $17
      )`,
      [
        caseId,
        FIXTURE.publicRequestNumber,
        FIXTURE.status,
        FIXTURE.originChannel,
        FIXTURE.customerName,
        FIXTURE.customerEmail,
        FIXTURE.customerPhone,
        FIXTURE.primaryContactMethod,
        FIXTURE.customerEmail,
        FIXTURE.summary,
        FIXTURE.description,
        FIXTURE.locale,
        numberIssuedAt,
        formalizedAt,
        statusUpdatedAt,
        createdAt,
        now,
      ]
    );

    await client.query(
      `insert into sessions (
        id,
        "tokenHash",
        scope,
        "caseId",
        "contactMethod",
        "contactValue",
        "verifiedAt",
        "lastSeenAt",
        "expiresAt",
        "createdAt",
        "updatedAt"
      ) values (
        $1, $2, 'CASE_ACCESS'::"SessionScope", $3,
        $4::"PrimaryContactMethod", $5, $6, $7, $8, $9, $10
      )`,
      [
        sessionId,
        sessionTokenHash,
        caseId,
        FIXTURE.primaryContactMethod,
        FIXTURE.customerEmail,
        numberIssuedAt,
        subtractHours(now, 2),
        expiresAt,
        numberIssuedAt,
        now,
      ]
    );

    await client.query(
      `insert into messages (
        id,
        "caseId",
        "sessionId",
        channel,
        "authorRole",
        "authorName",
        body,
        "isCustomerVisible",
        "sentAt",
        "createdAt",
        "updatedAt"
      ) values
      ($1, $2, $3, $4::"CaseOriginChannel", 'CUSTOMER'::"MessageAuthorRole", $5, $6, true, $7, $8, $9),
      ($10, $11, null, $12::"CaseOriginChannel", 'OPERATOR'::"MessageAuthorRole", $13, $14, true, $15, $16, $17),
      ($18, $19, null, $20::"CaseOriginChannel", 'SYSTEM'::"MessageAuthorRole", $21, $22, false, $23, $24, $25)`,
      [
        customerMessageId,
        caseId,
        sessionId,
        FIXTURE.originChannel,
        FIXTURE.customerName,
        'Hello. The storefront LED sign starts flickering after rain. Please check if diagnostics can be scheduled this week.',
        subtractHours(now, 72),
        subtractHours(now, 72),
        subtractHours(now, 72),
        operatorMessageId,
        caseId,
        'MANUAL',
        'PixelRing Support',
        'We reviewed the request and opened diagnostics. The case is now in progress, and a technician will prepare the next step.',
        subtractHours(now, 28),
        subtractHours(now, 28),
        subtractHours(now, 28),
        systemMessageId,
        caseId,
        'CRM',
        'PixelRing System',
        'Internal note: client-facing status normalized to IN_PROGRESS for portal/status surfaces.',
        statusUpdatedAt,
        statusUpdatedAt,
        statusUpdatedAt,
      ]
    );

    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }

  console.log(
    JSON.stringify(
      {
        fixture: 'phase1',
        customerName: FIXTURE.customerName,
        customerEmail: FIXTURE.customerEmail,
        customerPhone: FIXTURE.customerPhone,
        publicRequestNumber: FIXTURE.publicRequestNumber,
        status: FIXTURE.status,
        locale: FIXTURE.locale,
        statusUrl: `/ru/status?request=${FIXTURE.publicRequestNumber}`,
        verifyWith: FIXTURE.customerEmail,
        sessionCookieName: 'pixelring_case_session',
        sessionCookieValue: sessionToken,
        seededMessages: 3,
        note: 'Phase 1 has no full portal account/cabinet UI yet. This fixture seeds the request, status data, customer-visible messages, and a case-access session.',
      },
      null,
      2
    )
  );
}

seedFixture().catch((error) => {
  console.error(error);
  process.exit(1);
});
