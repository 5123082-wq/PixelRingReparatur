import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';
import pg from 'pg';

// Prisma's schema engine cannot reach this Neon instance in the current environment,
// so migrations are tracked and applied through pg while Prisma still owns the schema.
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const migrationsDir = path.resolve('prisma/migrations');
const migrationTable = '_prisma_migrations';

function getCommandArgs() {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    throw new Error('Missing migration command. Use create, apply, baseline, or status.');
  }

  return { command, args };
}

function getFlag(args, name) {
  const match = args.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.slice(name.length + 3) : undefined;
}

function slugifyMigrationName(input) {
  const value = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!value) {
    throw new Error('Migration name must contain at least one alphanumeric character.');
  }

  return value;
}

function getTimestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');

  return [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate()),
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds()),
  ].join('');
}

async function listMigrationDirectories() {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function readMigrationFile(migrationName) {
  const migrationPath = path.join(migrationsDir, migrationName, 'migration.sql');
  return fs.readFile(migrationPath, 'utf8');
}

function checksumFor(sql) {
  return crypto.createHash('sha256').update(sql).digest('hex');
}

function getDatabaseUrl() {
  const url = process.env.DIRECT_URL ?? process.env.POSTGRES_URL_NON_POOLING;

  if (!url) {
    throw new Error('Missing DIRECT_URL or POSTGRES_URL_NON_POOLING for migrations.');
  }

  return url;
}

async function withClient(run) {
  const client = new pg.Client({
    connectionString: getDatabaseUrl(),
  });

  await client.connect();

  try {
    return await run(client);
  } finally {
    await client.end();
  }
}

async function ensureMigrationTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS "${migrationTable}" (
      id TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      finished_at TIMESTAMPTZ,
      migration_name TEXT NOT NULL,
      logs TEXT,
      rolled_back_at TIMESTAMPTZ,
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      applied_steps_count INTEGER NOT NULL DEFAULT 0
    )
  `);
}

async function getAppliedMigrations(client) {
  await ensureMigrationTable(client);

  const { rows } = await client.query(
    `SELECT id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count
     FROM "${migrationTable}"
     ORDER BY started_at ASC`
  );

  return rows;
}

async function createMigration(args) {
  const providedName = getFlag(args, 'name') ?? args[0];

  if (!providedName) {
    throw new Error('Migration name is required. Use `npm run db:migrate -- --name=your_change`.');
  }

  const migrationName = `${getTimestamp()}_${slugifyMigrationName(providedName)}`;
  const migrationDir = path.join(migrationsDir, migrationName);
  const migrationFile = path.join(migrationDir, 'migration.sql');

  await fs.mkdir(migrationDir, { recursive: true });
  await fs.writeFile(
    migrationFile,
    [
      '-- Write PostgreSQL statements for this schema change here.',
      '-- Keep prisma/schema.prisma in sync with the SQL in this file.',
      '-- Apply with: npm run db:deploy',
      '',
    ].join('\n'),
    { flag: 'wx' }
  );

  console.log(`Created migration ${migrationName}`);
}

function latestRecordByName(records) {
  const map = new Map();

  for (const record of records) {
    map.set(record.migration_name, record);
  }

  return map;
}

async function applyMigration(client, migrationName, sql) {
  const id = crypto.randomUUID();
  const checksum = checksumFor(sql);

  await client.query(
    `INSERT INTO "${migrationTable}" (
      id,
      checksum,
      migration_name,
      started_at,
      applied_steps_count
    ) VALUES ($1, $2, $3, NOW(), 0)`,
    [id, checksum, migrationName]
  );

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    await client.query(
      `UPDATE "${migrationTable}"
       SET finished_at = NOW(),
           applied_steps_count = 1
       WHERE id = $1`,
      [id]
    );

    console.log(`Applied ${migrationName}`);
  } catch (error) {
    await client.query('ROLLBACK');
    await client.query(
      `UPDATE "${migrationTable}"
       SET logs = $2
       WHERE id = $1`,
      [id, error instanceof Error ? error.stack ?? error.message : String(error)]
    );

    throw error;
  }
}

async function applyMigrations() {
  const migrationNames = await listMigrationDirectories();

  await withClient(async (client) => {
    const existing = latestRecordByName(await getAppliedMigrations(client));

    for (const migrationName of migrationNames) {
      const sql = await readMigrationFile(migrationName);
      const checksum = checksumFor(sql);
      const record = existing.get(migrationName);

      if (record?.finished_at && !record.rolled_back_at) {
        if (record.checksum !== checksum) {
          throw new Error(`Checksum mismatch for applied migration ${migrationName}.`);
        }

        continue;
      }

      if (record && !record.finished_at && !record.rolled_back_at) {
        throw new Error(`Migration ${migrationName} is marked as failed. Resolve it before continuing.`);
      }

      await applyMigration(client, migrationName, sql);
    }
  });
}

async function baselineMigration(args) {
  const migrationName = getFlag(args, 'name') ?? args[0];

  if (!migrationName) {
    throw new Error('Migration name is required. Use `npm run db:baseline -- --name=20260405165443_init_request_tracking`.');
  }

  const sql = await readMigrationFile(migrationName);
  const checksum = checksumFor(sql);

  await withClient(async (client) => {
    const records = latestRecordByName(await getAppliedMigrations(client));

    if (records.has(migrationName)) {
      console.log(`Migration ${migrationName} is already recorded.`);
      return;
    }

    await client.query(
      `INSERT INTO "${migrationTable}" (
        id,
        checksum,
        migration_name,
        started_at,
        finished_at,
        applied_steps_count
      ) VALUES ($1, $2, $3, NOW(), NOW(), 1)`,
      [crypto.randomUUID(), checksum, migrationName]
    );
  });

  console.log(`Baselined ${migrationName}`);
}

async function printStatus() {
  const migrationNames = await listMigrationDirectories();

  await withClient(async (client) => {
    const existing = latestRecordByName(await getAppliedMigrations(client));
    let pendingCount = 0;

    for (const migrationName of migrationNames) {
      const sql = await readMigrationFile(migrationName);
      const checksum = checksumFor(sql);
      const record = existing.get(migrationName);

      if (record?.finished_at && !record.rolled_back_at && record.checksum === checksum) {
        console.log(`applied  ${migrationName}`);
        continue;
      }

      if (record && !record.finished_at && !record.rolled_back_at) {
        console.log(`failed   ${migrationName}`);
        pendingCount += 1;
        continue;
      }

      console.log(`pending  ${migrationName}`);
      pendingCount += 1;
    }

    if (pendingCount === 0) {
      console.log('No pending migrations.');
    }
  });
}

async function main() {
  const { command, args } = getCommandArgs();

  if (command === 'create') {
    await createMigration(args);
    return;
  }

  if (command === 'apply') {
    await applyMigrations();
    return;
  }

  if (command === 'baseline') {
    await baselineMigration(args);
    return;
  }

  if (command === 'status') {
    await printStatus();
    return;
  }

  throw new Error(`Unknown migration command: ${command}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
