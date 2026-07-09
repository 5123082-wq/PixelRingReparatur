type DbTestGuardEnv = Record<string, string | undefined>;

const DEFAULT_CONNECTION_ENV_VARS = [
  'POSTGRES_PRISMA_URL',
  'DATABASE_URL',
] as const;
const SAFE_DB_MARKERS = [
  'test',
  'testing',
  'ci',
  'e2e',
  'fixture',
  'sandbox',
] as const;
const LOCAL_DB_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export type DbTestGuardOptions = {
  scriptName: string;
  allowEnvVar?: string;
  connectionEnvVars?: readonly string[];
};

export function getDbTestConnectionString(
  env: DbTestGuardEnv = process.env,
  connectionEnvVars: readonly string[] = DEFAULT_CONNECTION_ENV_VARS
): { envVar: string; value: string } | null {
  for (const envVar of connectionEnvVars) {
    const value = env[envVar]?.trim();

    if (value) {
      return { envVar, value };
    }
  }

  return null;
}

function hasSafeDbMarker(value: string): boolean {
  const normalized = value.toLowerCase();

  return SAFE_DB_MARKERS.some((marker) => normalized.includes(marker));
}

export function isSafeDbTestConnectionString(value: string): boolean {
  try {
    const url = new URL(value);
    const databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    const schemaName = url.searchParams.get('schema') ?? '';

    return (
      hasSafeDbMarker(databaseName) ||
      hasSafeDbMarker(schemaName) ||
      (!LOCAL_DB_HOSTS.has(url.hostname.toLowerCase()) && hasSafeDbMarker(url.hostname))
    );
  } catch {
    return hasSafeDbMarker(value);
  }
}

export function describeDbTestConnectionString(value: string): string {
  try {
    const url = new URL(value);
    const databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, '')) || '(no database)';

    return `${url.protocol}//${url.hostname}/${databaseName}`;
  } catch {
    return '(unparseable connection string)';
  }
}

export function assertDbTestAllowed(
  options: DbTestGuardOptions,
  env: DbTestGuardEnv = process.env
): void {
  const allowEnvVar = options.allowEnvVar ?? 'ALLOW_DB_TESTS';

  if (env[allowEnvVar] !== '1') {
    throw new Error(
      [
        `${options.scriptName} refused to run DB-backed tests.`,
        `Set ${allowEnvVar}=1 only after pointing POSTGRES_PRISMA_URL or DATABASE_URL at a disposable test database.`,
      ].join(' ')
    );
  }

  const connection = getDbTestConnectionString(env, options.connectionEnvVars);

  if (!connection) {
    throw new Error(
      `${options.scriptName} refused to run DB-backed tests because POSTGRES_PRISMA_URL or DATABASE_URL is missing.`
    );
  }

  if (!isSafeDbTestConnectionString(connection.value)) {
    throw new Error(
      [
        `${options.scriptName} refused to run DB-backed tests against ${connection.envVar}=`,
        `${describeDbTestConnectionString(connection.value)}.`,
        `Use a disposable database whose host, database name, or schema contains one of: ${SAFE_DB_MARKERS.join(', ')}.`,
      ].join(' ')
    );
  }
}
