import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local'), quiet: true });
dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

const PAGE_KEY = 'referenzen';
const LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const IMAGE_FILE = 'public/images/references/references-slogan-signage-v1.webp';
const IMAGE_URL = '/images/references/references-slogan-signage-v1.webp';
const IMAGE_STORAGE_KEY = 'images/references/references-slogan-signage-v1.webp';
const REVISION_REASON =
  'Add the replaceable media field for the light Referenzen slogan card.';
const PAGE_AUDIT_ACTION = 'CMS_PAGE_REFERENZEN_SLOGAN_CARD_UPDATED';
const MEDIA_AUDIT_ACTION = 'CMS_MEDIA_REFERENZEN_SLOGAN_IMAGE_REGISTERED';
const ALT_TEXT = {
  de: 'Gleichmäßig beleuchtete Profilbuchstaben auf einer hellen Fassade',
  en: 'Evenly illuminated channel letters mounted on a light facade',
  ru: 'Равномерно подсвеченные объёмные буквы на светлом фасаде',
  tr: 'Açık renkli cephede eşit şekilde aydınlatılmış kutu harfler',
  pl: 'Równomiernie podświetlone litery przestrzenne na jasnej elewacji',
  ar: 'حروف بارزة مضاءة بشكل متساوٍ على واجهة فاتحة',
};

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function buildRevisionSnapshot(page) {
  const toIso = (value) => (value instanceof Date ? value.toISOString() : value ?? null);

  return {
    pageKey: page.pageKey,
    locale: page.locale,
    status: page.status,
    title: page.title,
    blocks: page.blocks,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    publishedAt: toIso(page.publishedAt),
    lastReviewedAt: toIso(page.lastReviewedAt),
  };
}

function updateBlocks(blocks, locale) {
  if (!Array.isArray(blocks)) {
    throw new Error(`${locale}: blocks must be an array`);
  }

  let found = false;
  const nextBlocks = blocks.map((block) => {
    if (!isObject(block) || block.key !== 'reportIntroBlock') return block;
    found = true;
    return {
      ...block,
      image: IMAGE_URL,
      imageAlt: ALT_TEXT[locale],
    };
  });

  if (!found) {
    throw new Error(`${locale}: reportIntroBlock is missing`);
  }

  return nextBlocks;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const [{ prisma }, { getReferenzenPublishIssues }] = await Promise.all([
    import('../src/lib/prisma.ts'),
    import('../src/lib/cms/referenzen-schema.ts'),
  ]);

  try {
    const buffer = await readFile(path.join(process.cwd(), IMAGE_FILE));
    const checksumSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const pages = await prisma.cmsPage.findMany({
      where: { pageKey: PAGE_KEY, locale: { in: LOCALES }, deletedAt: null },
      orderBy: { locale: 'asc' },
    });
    const pageByLocale = new Map(pages.map((page) => [page.locale, page]));
    const missingLocales = LOCALES.filter((locale) => !pageByLocale.has(locale));
    if (missingLocales.length > 0) {
      throw new Error(`Missing CMS records: ${missingLocales.join(', ')}`);
    }

    const plan = LOCALES.map((locale) => {
      const page = pageByLocale.get(locale);
      const blocks = updateBlocks(page.blocks, locale);
      const issues = getReferenzenPublishIssues(blocks.filter(isObject), locale);
      if (issues.length > 0) {
        throw new Error(
          `${locale}: strict Referenzen validation failed: ${issues
            .map((issue) => issue.fieldPath)
            .join(', ')}`
        );
      }
      return {
        page,
        blocks,
        changed: JSON.stringify(page.blocks) !== JSON.stringify(blocks),
      };
    });
    const changedPages = plan.filter((entry) => entry.changed);
    const existingMedia = await prisma.cmsMedia.findFirst({
      where: {
        OR: [
          { publicUrl: IMAGE_URL },
          { storageKey: IMAGE_STORAGE_KEY },
          { checksumSha256 },
        ],
      },
    });

    console.log(
      `${apply ? 'Applying' : 'Dry run'}: ${changedPages.length}/${plan.length} page records need an update; media ${existingMedia ? 'already exists' : 'will be registered'}.`
    );
    if (!apply) return;

    await prisma.$transaction(
      async (tx) => {
        const mediaData = {
          locale: 'de',
          usageType: 'PAGE',
          storageProvider: 'LOCAL',
          storageKey: IMAGE_STORAGE_KEY,
          publicUrl: IMAGE_URL,
          fallbackUrl: null,
          fallbackStorageKey: null,
          originalFilename: path.basename(IMAGE_FILE),
          title: 'Referenzen slogan card - illuminated channel letters',
          altText: ALT_TEXT.de,
          mimeType: 'image/webp',
          byteSize: buffer.byteLength,
          checksumSha256,
          width: 1536,
          height: 1024,
          deletedAt: null,
          meta: {
            source: 'owner-approved generated preview',
            pageKey: PAGE_KEY,
            blockKey: 'reportIntroBlock',
            role: 'slogan-card-image',
          },
        };
        const media = existingMedia
          ? await tx.cmsMedia.update({ where: { id: existingMedia.id }, data: mediaData })
          : await tx.cmsMedia.create({ data: mediaData });

        if (!existingMedia) {
          await tx.adminAuditLog.create({
            data: {
              actorSessionId: null,
              actorAdminUserId: null,
              actorRole: null,
              action: MEDIA_AUDIT_ACTION,
              resourceType: 'CMS_MEDIA',
              resourceId: media.id,
              outcome: 'SUCCESS',
              reason: REVISION_REASON,
              details: {
                pageKey: PAGE_KEY,
                blockKey: 'reportIntroBlock',
                publicUrl: IMAGE_URL,
                storageProvider: 'LOCAL',
              },
            },
          });
        }

        for (const { page, blocks } of changedPages) {
          const updatedPage = await tx.cmsPage.update({
            where: { id: page.id },
            data: { blocks },
          });
          await tx.cmsPageRevision.create({
            data: {
              pageId: updatedPage.id,
              sourceAction: 'UPDATE',
              reason: REVISION_REASON,
              actorAdminUserId: null,
              actorSessionId: null,
              actorRole: null,
              snapshot: buildRevisionSnapshot(updatedPage),
            },
          });
          await tx.adminAuditLog.create({
            data: {
              actorSessionId: null,
              actorAdminUserId: null,
              actorRole: null,
              action: PAGE_AUDIT_ACTION,
              resourceType: 'CMS_PAGE',
              resourceId: updatedPage.id,
              outcome: 'SUCCESS',
              reason: REVISION_REASON,
              details: {
                pageKey: PAGE_KEY,
                locale: updatedPage.locale,
                blockKey: 'reportIntroBlock',
                mediaId: media.id,
                mediaBinariesChanged: false,
              },
            },
          });
        }
      },
      { maxWait: 10_000, timeout: 30_000 }
    );

    console.log(
      `Applied: ${changedPages.length} CMS page records plus media registration, revisions, and audit logs.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
