import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  assertDbTestAllowed,
  describeDbTestConnectionString,
  getDbTestConnectionString,
  isSafeDbTestConnectionString,
} from './db-test-guard.ts';

test('db test guard refuses to run without the explicit allow flag', () => {
  assert.throws(
    () =>
      assertDbTestAllowed(
        { scriptName: 'guard-test' },
        { DATABASE_URL: 'postgresql://localhost/pixelring_test' }
      ),
    /ALLOW_DB_TESTS=1/
  );
});

test('db test guard refuses production-like database URLs even with the allow flag', () => {
  assert.throws(
    () =>
      assertDbTestAllowed(
        { scriptName: 'guard-test' },
        {
          ALLOW_DB_TESTS: '1',
          DATABASE_URL: 'postgresql://user:secret@ep-soft-smoke.eu-central-1.aws.neon.tech/neondb?sslmode=require',
        }
      ),
    /refused to run DB-backed tests against DATABASE_URL= postgresql:\/\/ep-soft-smoke\.eu-central-1\.aws\.neon\.tech\/neondb/
  );
});

test('db test guard allows explicitly marked disposable test databases', () => {
  assert.doesNotThrow(() =>
    assertDbTestAllowed(
      { scriptName: 'guard-test' },
      {
        ALLOW_DB_TESTS: '1',
        DATABASE_URL: 'postgresql://localhost/pixelring_test',
      }
    )
  );
  assert.doesNotThrow(() =>
    assertDbTestAllowed(
      { scriptName: 'guard-test' },
      {
        ALLOW_DB_TESTS: '1',
        POSTGRES_PRISMA_URL: 'postgresql://user:secret@db.example.com/pixelring?schema=e2e',
      }
    )
  );
  assert.throws(
    () =>
      assertDbTestAllowed(
        { scriptName: 'guard-test' },
        {
          ALLOW_DB_TESTS: '1',
          DATABASE_URL: 'postgresql://localhost/pixelring_dev',
        }
      ),
    /refused to run DB-backed tests against DATABASE_URL= postgresql:\/\/localhost\/pixelring_dev/
  );
  assert.throws(
    () =>
      assertDbTestAllowed(
        { scriptName: 'guard-test' },
        {
          ALLOW_DB_TESTS: '1',
          DATABASE_URL: 'postgresql://localhost/pixelring_local',
        }
      ),
    /refused to run DB-backed tests against DATABASE_URL= postgresql:\/\/localhost\/pixelring_local/
  );
});

test('db test guard helper functions redact credentials and prefer POSTGRES_PRISMA_URL', () => {
  assert.deepEqual(
    getDbTestConnectionString({
      POSTGRES_PRISMA_URL: 'postgresql://one:secret@localhost/pixelring_test',
      DATABASE_URL: 'postgresql://two:secret@localhost/pixelring_dev',
    }),
    {
      envVar: 'POSTGRES_PRISMA_URL',
      value: 'postgresql://one:secret@localhost/pixelring_test',
    }
  );
  assert.equal(isSafeDbTestConnectionString('postgresql://localhost/pixelring_test'), true);
  assert.equal(isSafeDbTestConnectionString('postgresql://localhost/pixelring_dev'), false);
  assert.equal(isSafeDbTestConnectionString('postgresql://localhost/pixelring_local'), false);
  assert.equal(isSafeDbTestConnectionString('postgresql://localhost/pixelring'), false);
  assert.equal(
    describeDbTestConnectionString('postgresql://user:secret@localhost/pixelring_test'),
    'postgresql://localhost/pixelring_test'
  );
});
