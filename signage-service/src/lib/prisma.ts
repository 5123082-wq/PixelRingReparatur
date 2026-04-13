import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const connectionString =
  process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'Missing POSTGRES_PRISMA_URL or DATABASE_URL for Prisma Client.'
  );
}

function normalizeConnectionString(value: string): string {
  try {
    const url = new URL(value);
    const sslmode = url.searchParams.get('sslmode');

    if (
      sslmode &&
      ['prefer', 'require', 'verify-ca'].includes(sslmode) &&
      !url.searchParams.has('uselibpqcompat')
    ) {
      url.searchParams.set('sslmode', 'verify-full');
    }

    return url.toString();
  } catch {
    return value;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizeConnectionString(connectionString) }),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
