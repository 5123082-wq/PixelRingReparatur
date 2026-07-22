import crypto from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { put } from '@vercel/blob';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const PAGE_KEY = 'referenzen';
const PUBLIC_UPLOAD_DIR = path.join(projectRoot, 'public', 'uploads', 'cms-media');
const PUBLIC_UPLOAD_URL_PREFIX = '/uploads/cms-media';

const ASSETS = [
  {
    key: 'lightboxAfter',
    file: 'public/generated/referenzen/local-main/lightbox-after.png',
    title: 'Referenzen generated - repaired lightbox facade',
    altText: 'Evenly repaired illuminated lightbox on a storefront facade',
    usageType: 'HERO',
  },
  {
    key: 'lightboxBefore',
    file: 'public/generated/referenzen/local-main/lightbox-before.png',
    title: 'Referenzen generated - uneven lightbox before repair',
    altText: 'Uneven illuminated lightbox before repair',
    usageType: 'CASE',
  },
  {
    key: 'ledLettersAfter',
    file: 'public/generated/referenzen/local-main/led-letters-after.png',
    title: 'Referenzen generated - repaired LED letters',
    altText: 'Repaired LED channel letters on a retail facade',
    usageType: 'HERO',
  },
  {
    key: 'ledLettersFacadeBefore',
    file: 'public/generated/referenzen/local-main/led-leuchtbuchstaben-fassade-vorher-teilweise-dunkel.webp',
    title: 'Referenzen - LED letters facade before repair',
    altText: 'Shop facade with LED letters where the main lettering is not illuminated',
    usageType: 'CASE',
  },
  {
    key: 'ledLettersFacadeAfter',
    file: 'public/generated/referenzen/local-main/led-leuchtbuchstaben-fassade-nachher-gleichmaessig-beleuchtet.webp',
    title: 'Referenzen - LED letters facade after repair',
    altText: 'Shop facade with restored illumination of LED letters in the evening',
    usageType: 'HERO',
  },
  {
    key: 'ledModuleRepair',
    file: 'public/generated/referenzen/local-main/led-module-repair.png',
    title: 'Referenzen generated - LED module repair detail',
    altText: 'Gloved hands repairing LED modules on a sign workshop bench',
    usageType: 'CASE',
  },
  {
    key: 'neonContourAfter',
    file: 'public/generated/referenzen/local-main/neon-contour-after.png',
    title: 'Referenzen generated - repaired neon contour',
    altText: 'Continuous repaired neon contour line on a facade',
    usageType: 'HERO',
  },
  {
    key: 'neonBenchRepair',
    file: 'public/generated/referenzen/local-main/neon-bench-repair.png',
    title: 'Referenzen generated - neon bench repair detail',
    altText: 'Neon contour repair preparation on a workshop bench',
    usageType: 'CASE',
  },
  {
    key: 'windowFilmAfter',
    file: 'public/generated/referenzen/local-main/window-film-after.png',
    title: 'Referenzen generated - storefront film application',
    altText: 'Fresh storefront window film application on glass',
    usageType: 'CARD',
  },
  {
    key: 'facadeMountingCheck',
    file: 'public/generated/referenzen/local-main/facade-mounting-check.png',
    title: 'Referenzen generated - facade mounting check',
    altText: 'Facade sign mounting inspection from an aerial work platform',
    usageType: 'CARD',
  },
  {
    key: 'branchServiceEvening',
    file: 'public/generated/referenzen/local-main/branch-service-evening.png',
    title: 'Referenzen generated - branch service evening',
    altText: 'Consistent illuminated storefront row after branch service',
    usageType: 'HERO',
  },
  {
    key: 'powerDiagnostics',
    file: 'public/generated/referenzen/local-main/power-diagnostics.png',
    title: 'Referenzen generated - sign power diagnostics',
    altText: 'LED sign power supply diagnostic detail with multimeter probes',
    usageType: 'CASE',
  },
  {
    key: 'lightboxInteriorService',
    file: 'public/generated/referenzen/local-main/lightbox-interior-service.png',
    title: 'Referenzen generated - lightbox interior service',
    altText: 'Opened lightbox interior with LED modules during service',
    usageType: 'CASE',
  },
  {
    key: 'agentFacadeLightboxAfter',
    file: 'public/generated/referenzen/agent-facade/facade-repaired-lightbox-after.png',
    title: 'Referenzen generated - agent facade repaired lightbox',
    altText: 'Repaired illuminated lightbox on a clean storefront facade',
    usageType: 'HERO',
  },
  {
    key: 'agentLedLettersAfter',
    file: 'public/generated/referenzen/agent-facade/led-letters-after-result.png',
    title: 'Referenzen generated - agent LED letters after result',
    altText: 'Clean repaired LED letters on a modern retail facade',
    usageType: 'HERO',
  },
  {
    key: 'agentBranchStorefrontRow',
    file: 'public/generated/referenzen/agent-facade/branch-storefront-row-service.png',
    title: 'Referenzen generated - agent branch storefront row service',
    altText: 'Row of serviced storefront signs with consistent evening lighting',
    usageType: 'HERO',
  },
  {
    key: 'agentFacadeMountingLift',
    file: 'public/generated/referenzen/agent-facade/facade-mounting-lift.png',
    title: 'Referenzen generated - agent facade mounting lift',
    altText: 'Facade sign mounting work from a safe aerial lift',
    usageType: 'CASE',
  },
  {
    key: 'agentWideHeroServiceResult',
    file: 'public/generated/referenzen/agent-facade/wide-hero-service-result.png',
    title: 'Referenzen generated - agent wide hero service result',
    altText: 'Wide storefront service result with illuminated signage',
    usageType: 'HERO',
  },
  {
    key: 'agentLedModuleRepair',
    file: 'public/generated/referenzen/agent-technical/led-module-repair-closeup.png',
    title: 'Referenzen generated - agent LED module repair closeup',
    altText: 'Close-up of LED module repair on a sign component',
    usageType: 'CASE',
  },
  {
    key: 'agentPowerSupplyDiagnostics',
    file: 'public/generated/referenzen/agent-technical/power-supply-diagnostics.png',
    title: 'Referenzen generated - agent power supply diagnostics',
    altText: 'Power supply diagnostics for an LED sign driver',
    usageType: 'CASE',
  },
  {
    key: 'agentOpenedLightboxInterior',
    file: 'public/generated/referenzen/agent-technical/opened-lightbox-interior.png',
    title: 'Referenzen generated - agent opened lightbox interior',
    altText: 'Opened lightbox interior with LED modules during inspection',
    usageType: 'CASE',
  },
  {
    key: 'agentStorefrontFilmApplication',
    file: 'public/generated/referenzen/agent-technical/storefront-film-application.png',
    title: 'Referenzen generated - agent storefront film application',
    altText: 'Storefront film application on glass during branding service',
    usageType: 'CARD',
  },
  {
    key: 'agentNeonBenchRepair',
    file: 'public/generated/referenzen/agent-technical/neon-bench-repair.png',
    title: 'Referenzen generated - agent neon bench repair',
    altText: 'Neon contour repair preparation on a service bench',
    usageType: 'CASE',
  },
  {
    key: 'agentBeforeUnevenSign',
    file: 'public/generated/referenzen/agent-technical/before-state-uneven-sign.png',
    title: 'Referenzen generated - agent before uneven sign',
    altText: 'Uneven illuminated sign before service correction',
    usageType: 'CASE',
  },
];

function parseArgs() {
  return {
    apply: process.argv.includes('--apply'),
  };
}

function getBlobToken() {
  return process.env.CMS_BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;
}

function detectPngDimensions(buffer) {
  if (
    buffer.length < 24 ||
    buffer.toString('ascii', 0, 8) !== '\x89PNG\r\n\x1a\n'
  ) {
    return { width: null, height: null };
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function detectWebpDimensions(buffer) {
  if (
    buffer.length < 30 ||
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return { width: null, height: null };
  }

  const chunkType = buffer.toString('ascii', 12, 16);

  if (chunkType === 'VP8 ' && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunkType === 'VP8X' && buffer.length >= 30) {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunkType === 'VP8L' && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    };
  }

  return { width: null, height: null };
}

function detectImageDimensions(buffer, filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.webp') {
    return detectWebpDimensions(buffer);
  }

  return detectPngDimensions(buffer);
}

function getAssetMimeType(filename) {
  return path.extname(filename).toLowerCase() === '.webp' ? 'image/webp' : 'image/png';
}

function getStorageExtension(filename) {
  return path.extname(filename).toLowerCase() === '.webp' ? '.webp' : '.png';
}

function sanitizeBaseName(filename) {
  const ext = path.extname(filename);
  const raw = ext ? filename.slice(0, -ext.length) : filename;
  return raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'media';
}

async function persistAsset(asset, prisma, apply) {
  const absoluteFile = path.join(projectRoot, asset.file);
  const buffer = await readFile(absoluteFile);
  const checksumSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  const originalFilename = path.basename(asset.file);
  const existing = await prisma.cmsMedia.findFirst({
    where: {
      checksumSha256,
      deletedAt: null,
    },
    select: {
      id: true,
      publicUrl: true,
      fallbackUrl: true,
      storageProvider: true,
      title: true,
    },
  });

  if (existing) {
    return {
      ...asset,
      id: existing.id,
      publicUrl: existing.publicUrl,
      fallbackUrl: existing.fallbackUrl,
      reused: true,
    };
  }

  if (!apply) {
    return {
      ...asset,
      id: null,
      publicUrl: `DRY_RUN:${asset.key}`,
      fallbackUrl: null,
      reused: false,
    };
  }

  const token = getBlobToken();
  const suffix = crypto.randomBytes(6).toString('hex');
  const mimeType = getAssetMimeType(originalFilename);
  const storageFile = `${Date.now()}-${suffix}-${sanitizeBaseName(originalFilename)}${getStorageExtension(originalFilename)}`;
  const localStorageKey = storageFile;
  const localFile = path.join(PUBLIC_UPLOAD_DIR, localStorageKey);
  await mkdir(PUBLIC_UPLOAD_DIR, { recursive: true });
  await writeFile(localFile, buffer, { flag: 'wx' });

  let storageProvider = 'LOCAL';
  let storageKey = localStorageKey;
  let publicUrl = `${PUBLIC_UPLOAD_URL_PREFIX}/${localStorageKey}`;
  let fallbackStorageKey = null;
  let fallbackUrl = null;

  if (token) {
    const blobKey = `cms-media/${storageFile}`;
    const blob = await put(blobKey, buffer, {
      access: 'public',
      contentType: mimeType,
      token,
    });
    storageProvider = 'VERCEL_BLOB';
    storageKey = blob.pathname || blobKey;
    publicUrl = blob.url;
    fallbackStorageKey = localStorageKey;
    fallbackUrl = `${PUBLIC_UPLOAD_URL_PREFIX}/${localStorageKey}`;
  }

  const dimensions = detectImageDimensions(buffer, originalFilename);
  const created = await prisma.cmsMedia.create({
    data: {
      locale: 'de',
      usageType: asset.usageType,
      storageProvider,
      storageKey,
      publicUrl,
      fallbackUrl,
      fallbackStorageKey,
      originalFilename,
      title: asset.title,
      altText: asset.altText,
      mimeType,
      byteSize: buffer.length,
      checksumSha256,
      width: dimensions.width,
      height: dimensions.height,
      meta: {
        source: 'generated',
        pageKey: PAGE_KEY,
        generatedSet: 'referenzen-2026-05-05',
        role: asset.key,
      },
      deletedAt: null,
    },
    select: {
      id: true,
      publicUrl: true,
      fallbackUrl: true,
    },
  });

  return {
    ...asset,
    id: created.id,
    publicUrl: created.publicUrl,
    fallbackUrl: created.fallbackUrl,
    reused: false,
  };
}

function imageUrlMap(media) {
  return Object.fromEntries(media.map((item) => [item.key, item.publicUrl]));
}

function setCaseImages(cases, urls) {
  const mapping = [
    {
      beforeImage: urls.agentBeforeUnevenSign,
      afterImage: urls.agentFacadeLightboxAfter,
      gallery: [urls.agentBeforeUnevenSign, urls.agentOpenedLightboxInterior, urls.agentFacadeLightboxAfter],
    },
    {
      beforeImage: urls.ledLettersFacadeBefore,
      afterImage: urls.ledLettersFacadeAfter,
      gallery: [urls.ledLettersFacadeBefore, urls.ledLettersFacadeAfter],
    },
    {
      beforeImage: urls.agentNeonBenchRepair,
      afterImage: urls.neonContourAfter,
      gallery: [urls.agentNeonBenchRepair, urls.neonContourAfter, urls.powerDiagnostics],
    },
    {
      beforeImage: urls.lightboxBefore,
      afterImage: urls.agentStorefrontFilmApplication,
      gallery: [urls.lightboxBefore, urls.agentStorefrontFilmApplication, urls.agentFacadeMountingLift],
    },
    {
      beforeImage: urls.agentPowerSupplyDiagnostics,
      afterImage: urls.agentBranchStorefrontRow,
      gallery: [urls.agentPowerSupplyDiagnostics, urls.agentBranchStorefrontRow, urls.agentWideHeroServiceResult],
    },
    {
      beforeImage: urls.agentFacadeMountingLift,
      afterImage: urls.facadeMountingCheck,
      gallery: [urls.agentFacadeMountingLift, urls.facadeMountingCheck, urls.lightboxInteriorService],
    },
  ];

  return cases.map((item, index) => {
    const next = mapping[index % mapping.length];
    return {
      ...item,
      beforeImage: next.beforeImage,
      afterImage: next.afterImage,
      galleryImage1: next.gallery[0],
      galleryImage2: next.gallery[1],
      galleryImage3: next.gallery[2],
    };
  });
}

function setGalleryImages(items, urls) {
  const gallery = [
    urls.agentFacadeLightboxAfter,
    urls.agentLedLettersAfter,
    urls.neonContourAfter,
    urls.agentStorefrontFilmApplication,
    urls.agentBranchStorefrontRow,
    urls.agentFacadeMountingLift,
    urls.agentBeforeUnevenSign,
    urls.agentOpenedLightboxInterior,
    urls.ledLettersFacadeBefore,
    urls.ledLettersFacadeAfter,
    urls.agentNeonBenchRepair,
    urls.agentPowerSupplyDiagnostics,
    urls.agentWideHeroServiceResult,
    urls.lightboxAfter,
    urls.ledLettersFacadeAfter,
    urls.windowFilmAfter,
    urls.lightboxInteriorService,
  ];

  return items.map((item, index) => ({
    ...item,
    image: gallery[index % gallery.length],
  }));
}

function rewriteBlocks(blocks, urls) {
  let changedRefs = 0;
  const nextBlocks = blocks.map((block) => {
    if (!block || typeof block !== 'object') return block;

    if (block.key === 'heroBlock') {
      const previous = [
        block.heroImage1,
        block.heroImage2,
        block.heroImage3,
        block.heroImage4,
        block.heroImage5,
      ];
      const next = {
        ...block,
        heroImage1: urls.agentFacadeLightboxAfter,
        heroImage2: urls.agentLedLettersAfter,
        heroImage3: urls.neonContourAfter,
        heroImage4: urls.agentStorefrontFilmApplication,
        heroImage5: urls.agentBranchStorefrontRow,
      };
      changedRefs += previous.filter((value, index) => value !== next[`heroImage${index + 1}`]).length;
      return next;
    }

    if (block.key === 'casesBlock' && Array.isArray(block.items)) {
      const nextItems = setCaseImages(block.items, urls);
      changedRefs += block.items.length * 5;
      return { ...block, items: nextItems };
    }

    if (block.key === 'galleryItemsBlock' && Array.isArray(block.items)) {
      const nextItems = setGalleryImages(block.items, urls);
      changedRefs += block.items.length;
      return { ...block, items: nextItems };
    }

    return block;
  });

  return { blocks: nextBlocks, changedRefs };
}

function collectImageUrls(value, urls = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, urls));
    return urls;
  }

  if (!value || typeof value !== 'object') {
    return urls;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (typeof nested === 'string' && nested.trim() && /(image|asset)/i.test(key)) {
      urls.add(nested);
    } else if (nested && typeof nested === 'object') {
      collectImageUrls(nested, urls);
    }
  }

  return urls;
}

async function main() {
  const { apply } = parseArgs();
  const { prisma } = await import('../src/lib/prisma.ts');
  const persistedMedia = [];

  for (const asset of ASSETS) {
    persistedMedia.push(await persistAsset(asset, prisma, apply));
  }

  const urls = imageUrlMap(persistedMedia);
  const pages = await prisma.cmsPage.findMany({
    where: {
      pageKey: PAGE_KEY,
      locale: { in: LOCALES },
      deletedAt: null,
    },
    select: {
      id: true,
      locale: true,
      status: true,
      blocks: true,
      updatedAt: true,
    },
    orderBy: { locale: 'asc' },
  });

  const pageResults = [];

  for (const page of pages) {
    const blocks = Array.isArray(page.blocks) ? page.blocks : [];
    const beforeUrls = collectImageUrls(blocks);
    const { blocks: nextBlocks, changedRefs } = rewriteBlocks(blocks, urls);
    const afterUrls = collectImageUrls(nextBlocks);
    const oldUrlCount = [...afterUrls].filter((url) => url.startsWith('https://images.unsplash.com/')).length;

    pageResults.push({
      locale: page.locale,
      status: page.status,
      changedRefs,
      beforeUniqueImages: beforeUrls.size,
      afterUniqueImages: afterUrls.size,
      remainingUnsplashUrls: oldUrlCount,
    });

    if (apply) {
      await prisma.cmsPage.update({
        where: { id: page.id },
        data: { blocks: nextBlocks },
      });
    }
  }

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    media: persistedMedia.map((item) => ({
      key: item.key,
      id: item.id,
      publicUrl: item.publicUrl,
      fallbackUrl: item.fallbackUrl,
      reused: item.reused,
    })),
    pages: pageResults,
  }, null, 2));

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
