import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const projectRoot = process.cwd();
const PUBLIC_ROOT = path.join(projectRoot, 'public');
const SCAN_ROOTS = [path.join(PUBLIC_ROOT, 'images'), path.join(PUBLIC_ROOT, 'uploads', 'cms-media')];
const PAGE_KEYS = ['home', 'leistungen', 'business'];
const IMAGE_EXTENSIONS = new Set(['.gif', '.jpg', '.jpeg', '.png', '.webp']);

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const apply = args.has('--apply');
const rewritePages = args.has('--rewrite-pages');

function getCmsBlobReadWriteToken() {
  return process.env.CMS_BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;
}

if (dryRun === apply) {
  throw new Error('Choose exactly one mode: --dry-run or --apply.');
}

function getDatabaseUrl() {
  const value =
    process.env.DIRECT_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.DATABASE_URL;

  if (!value) {
    throw new Error(
      'Missing DIRECT_URL, POSTGRES_URL_NON_POOLING, POSTGRES_PRISMA_URL, or DATABASE_URL for CMS media backfill.'
    );
  }

  return value;
}

function normalizeConnectionString(value) {
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

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizeConnectionString(getDatabaseUrl()) }),
    log: ['error'],
  });
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkImages(root) {
  if (!(await pathExists(root))) {
    return [];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walkImages(fullPath));
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function publicUrlForFile(filePath) {
  return `/${path.relative(PUBLIC_ROOT, filePath).split(path.sep).join('/')}`;
}

function contentTypeForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

function replaceJsonStrings(value, replacements, changes = []) {
  if (typeof value === 'string') {
    const replacement = replacements.get(value);

    if (replacement) {
      changes.push({ from: value, to: replacement });
      return replacement;
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceJsonStrings(item, replacements, changes));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replaceJsonStrings(item, replacements, changes),
      ])
    );
  }

  return value;
}

const prisma = createPrismaClient();

try {
  const files = (await Promise.all(SCAN_ROOTS.map(walkImages))).flat().sort();
  const blobToken = getCmsBlobReadWriteToken();
  const hasBlobToken = Boolean(blobToken);

  console.log(JSON.stringify({
    mode: dryRun ? 'dry-run' : 'apply',
    rewritePages,
    hasBlobToken,
    discoveredFiles: files.length,
  }, null, 2));

  if (apply && !hasBlobToken) {
    throw new Error('CMS_BLOB_READ_WRITE_TOKEN or BLOB_READ_WRITE_TOKEN is required in --apply mode.');
  }

  const replacements = new Map();

  for (const filePath of files) {
    const fallbackUrl = publicUrlForFile(filePath);
    const buffer = await fs.readFile(filePath);
    const checksumSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const existing = await prisma.cmsMedia.findFirst({
      where: {
        deletedAt: null,
        OR: [{ publicUrl: fallbackUrl }, { fallbackUrl }],
      },
      select: {
        id: true,
        publicUrl: true,
        fallbackUrl: true,
        storageProvider: true,
      },
    });

    if (dryRun) {
      console.log(`${existing ? 'update' : 'create'} ${fallbackUrl}`);
      continue;
    }

    const blobKey = `cms-media/backfill${fallbackUrl}`;
    let blob;

    try {
      blob = await put(blobKey, buffer, {
        access: 'public',
        contentType: contentTypeForFile(filePath),
        token: blobToken,
      });
    } catch (error) {
      throw new Error(
        `Failed to upload ${fallbackUrl} to Vercel Blob with public access. ` +
          'Check that BLOB_READ_WRITE_TOKEN points to a Blob store that allows public objects. ' +
          `Provider error: ${error instanceof Error ? error.message : 'Unknown Blob error'}`
      );
    }

    const data = {
      locale: 'de',
      usageType: 'PAGE',
      storageProvider: 'VERCEL_BLOB',
      storageKey: blob.pathname || blobKey,
      publicUrl: blob.url,
      fallbackUrl,
      fallbackStorageKey: path.basename(filePath),
      originalFilename: path.basename(filePath),
      title: path.basename(filePath),
      mimeType: contentTypeForFile(filePath),
      byteSize: buffer.byteLength,
      checksumSha256,
      deletedAt: null,
    };

    if (existing) {
      await prisma.cmsMedia.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.cmsMedia.create({ data });
    }

    replacements.set(fallbackUrl, blob.url);
    console.log(`${existing ? 'updated' : 'created'} ${fallbackUrl} -> ${blob.url}`);
  }

  if (rewritePages) {
    if (dryRun) {
      const media = await prisma.cmsMedia.findMany({
        where: {
          deletedAt: null,
          storageProvider: 'VERCEL_BLOB',
          fallbackUrl: { not: null },
        },
        select: { publicUrl: true, fallbackUrl: true },
      });

      for (const record of media) {
        if (record.fallbackUrl) replacements.set(record.fallbackUrl, record.publicUrl);
      }
    }

    const pages = await prisma.cmsPage.findMany({
      where: {
        pageKey: { in: PAGE_KEYS },
        deletedAt: null,
      },
      select: {
        id: true,
        pageKey: true,
        locale: true,
        blocks: true,
      },
    });

    for (const page of pages) {
      const changes = [];
      const nextBlocks = replaceJsonStrings(page.blocks, replacements, changes);

      if (changes.length === 0) {
        continue;
      }

      console.log(`${dryRun ? 'would update' : 'updating'} ${page.pageKey}/${page.locale}`, changes);

      if (apply) {
        await prisma.cmsPage.update({
          where: { id: page.id },
          data: { blocks: nextBlocks },
        });
      }
    }
  }
} finally {
  await prisma.$disconnect();
}
