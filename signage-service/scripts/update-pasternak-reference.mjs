import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { put } from '@vercel/blob';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local'), quiet: true });
dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

const PAGE_KEY = 'referenzen';
const LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const CASE_ID = 'mounting-review';
const BRANCH_SERVICE_CASE_ID = 'branch-service';
const MAINTENANCE_WIDE_GALLERY_ITEM_ID = 'gallery-filial-maintenance-wide';
const MAINTENANCE_WIDE_GALLERY_IMAGE = '/images/leistungen/hero-maintenance.png';
const MAINTENANCE_WIDE_GALLERY_INDEX = 8;
const BEFORE_IMAGE = '/images/references/pasternak-facade-lettering-before.png';
const PROCESS_IMAGE = '/images/references/pasternak-facade-lettering-process.jpg';
const RESULT_IMAGE = '/images/references/pasternak-facade-lettering-result.jpg';
const REVISION_REASON =
  'Update Referenzen case: Restaurant Pasternak facade lettering and restore the maintenance image as a separate wide gallery card.';
const AUDIT_ACTION = 'CMS_PAGE_REFERENZEN_PASTERNAK_UPDATED';
const MEDIA_AUDIT_ACTION = 'CMS_MEDIA_REFERENZEN_PASTERNAK_UPLOADED';
const ASSETS = [
  {
    key: 'before',
    publicFallback: BEFORE_IMAGE,
    file: 'public/images/references/pasternak-facade-lettering-before.png',
    mimeType: 'image/png',
    title: 'Restaurant Pasternak facade lettering - before renewal',
    altText: 'Restaurant Pasternak facade lettering before renewal',
  },
  {
    key: 'process',
    publicFallback: PROCESS_IMAGE,
    file: 'public/images/references/pasternak-facade-lettering-process.jpg',
    mimeType: 'image/jpeg',
    title: 'Restaurant Pasternak facade lettering - stencil painting process',
    altText: 'Stencil painting of Restaurant Pasternak facade lettering during the work',
  },
  {
    key: 'result',
    publicFallback: RESULT_IMAGE,
    file: 'public/images/references/pasternak-facade-lettering-result.jpg',
    mimeType: 'image/jpeg',
    title: 'Restaurant Pasternak facade lettering - finished result',
    altText: 'Finished painted facade lettering at Restaurant Pasternak',
  },
];

const COPY = {
  de: {
    title: 'Fassadenbeschriftung für Restaurant Pasternak',
    category: 'Fassadenbeschriftung',
    problem: 'Die bestehende Beschriftung der Restaurantfassade sollte im vorhandenen Erscheinungsbild erneuert werden.',
    work: 'Die neue Beschriftung wurde mit einer passgenauen Schablone vorbereitet und anschließend direkt auf die Fassade lackiert.',
    result: 'Das Schriftbild wirkt wieder sauber und einheitlich.',
    defaultText: 'Präzise Schablonenlackierung für ein klares, einheitliches Schriftbild.',
    beforeText: 'Vorher: bestehende Fassadenbeschriftung vor der Erneuerung.',
    beforeAlt: 'Fassadenbeschriftung von Restaurant Pasternak vor der Erneuerung',
    processAlt: 'Schablonenlackierung der Fassadenbeschriftung von Restaurant Pasternak während der Ausführung',
    afterAlt: 'Fertig lackierte Fassadenbeschriftung von Restaurant Pasternak',
  },
  en: {
    title: 'Facade lettering for Restaurant Pasternak',
    category: 'Facade lettering',
    problem: 'The existing lettering on the restaurant facade needed renewal within the established visual design.',
    work: 'The new lettering was prepared with a precise stencil and then painted directly onto the facade.',
    result: 'The lettering now looks clean and visually consistent again.',
    defaultText: 'Precise stencil painting for clear, consistent facade lettering.',
    beforeText: 'Before: existing facade lettering before renewal.',
    beforeAlt: 'Restaurant Pasternak facade lettering before renewal',
    processAlt: 'Stencil painting of Restaurant Pasternak facade lettering during the work',
    afterAlt: 'Finished painted facade lettering at Restaurant Pasternak',
  },
  ru: {
    title: 'Фасадная надпись для ресторана Pasternak',
    category: 'Фасадная надпись',
    problem: 'Существующую надпись на фасаде ресторана нужно было обновить, сохранив её привычный визуальный образ.',
    work: 'Новую надпись подготовили с точным трафаретом, а затем нанесли краской непосредственно на фасад.',
    result: 'Надпись снова выглядит чисто и цельно.',
    defaultText: 'Точная окраска по трафарету для чёткой и единой фасадной надписи.',
    beforeText: 'До: исходная фасадная надпись перед обновлением.',
    beforeAlt: 'Фасадная надпись ресторана Pasternak до обновления',
    processAlt: 'Окраска по трафарету фасадной надписи ресторана Pasternak во время работ',
    afterAlt: 'Готовая окрашенная фасадная надпись ресторана Pasternak',
  },
  tr: {
    title: 'Restaurant Pasternak için cephe yazısı',
    category: 'Cephe yazısı',
    problem: 'Restoran cephesindeki mevcut yazının, yerleşik görsel kimlik korunarak yenilenmesi gerekiyordu.',
    work: 'Yeni yazı hassas bir şablonla hazırlandı ve ardından doğrudan cepheye boyandı.',
    result: 'Yazı yeniden temiz ve bütünlüklü görünüyor.',
    defaultText: 'Net ve tutarlı cephe yazısı için hassas şablon boyaması.',
    beforeText: 'Önce: yenileme öncesi mevcut cephe yazısı.',
    beforeAlt: 'Restaurant Pasternak cephe yazısı yenileme öncesinde',
    processAlt: 'Restaurant Pasternak cephe yazısının çalışma sırasında şablonla boyanması',
    afterAlt: 'Restaurant Pasternak için tamamlanmış boyalı cephe yazısı',
  },
  pl: {
    title: 'Napis na fasadzie restauracji Pasternak',
    category: 'Napis na fasadzie',
    problem: 'Istniejący napis na fasadzie restauracji wymagał odnowienia z zachowaniem dotychczasowego wyglądu.',
    work: 'Nowy napis przygotowano przy użyciu precyzyjnego szablonu, a następnie pomalowano bezpośrednio na fasadzie.',
    result: 'Napis ponownie wygląda czysto i spójnie.',
    defaultText: 'Precyzyjne malowanie szablonowe dla czytelnego, spójnego napisu na fasadzie.',
    beforeText: 'Przed: istniejący napis na fasadzie przed odnowieniem.',
    beforeAlt: 'Napis na fasadzie restauracji Pasternak przed odnowieniem',
    processAlt: 'Malowanie szablonowe napisu na fasadzie restauracji Pasternak podczas prac',
    afterAlt: 'Gotowy malowany napis na fasadzie restauracji Pasternak',
  },
  ar: {
    title: 'كتابة الواجهة لمطعم Pasternak',
    category: 'كتابة الواجهة',
    problem: 'احتاجت الكتابة القائمة على واجهة المطعم إلى تجديد مع الحفاظ على طابعها البصري المعتاد.',
    work: 'جُهزت الكتابة الجديدة بقالب دقيق ثم طُليت مباشرة على الواجهة.',
    result: 'أصبحت الكتابة تبدو نظيفة ومتناسقة من جديد.',
    defaultText: 'طلاء دقيق بالقالب لكتابة واجهة واضحة ومتناسقة.',
    beforeText: 'قبل: كتابة الواجهة القائمة قبل التجديد.',
    beforeAlt: 'كتابة واجهة مطعم Pasternak قبل التجديد',
    processAlt: 'طلاء كتابة واجهة مطعم Pasternak بالقالب أثناء التنفيذ',
    afterAlt: 'كتابة واجهة مطعم Pasternak النهائية بعد الطلاء',
  },
};

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function getBlock(blocks, key) {
  return blocks.find((block) => isObject(block) && block.key === key) ?? null;
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

function getBlobToken() {
  return process.env.CMS_BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;
}

async function resolveMediaUrls(prisma, apply) {
  const token = getBlobToken();
  const urls = {};

  for (const asset of ASSETS) {
    const buffer = await readFile(path.join(process.cwd(), asset.file));
    const checksumSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const existing = await prisma.cmsMedia.findFirst({
      where: { checksumSha256, deletedAt: null },
      select: { id: true, publicUrl: true },
    });

    if (existing) {
      urls[asset.key] = existing.publicUrl;
      continue;
    }

    if (!apply) {
      urls[asset.key] = asset.publicFallback;
      continue;
    }

    if (!token) {
      throw new Error('A Vercel Blob token is required to publish the new reference photos safely.');
    }

    const filename = path.basename(asset.file);
    const blob = await put(`cms-media/referenzen/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      contentType: asset.mimeType,
      token,
    });
    const media = await prisma.cmsMedia.create({
      data: {
        locale: 'de',
        usageType: 'CASE',
        storageProvider: 'VERCEL_BLOB',
        storageKey: blob.pathname,
        publicUrl: blob.url,
        fallbackUrl: asset.publicFallback,
        fallbackStorageKey: filename,
        originalFilename: filename,
        title: asset.title,
        altText: asset.altText,
        mimeType: asset.mimeType,
        byteSize: buffer.byteLength,
        checksumSha256,
        meta: { source: 'owner-provided', pageKey: PAGE_KEY, caseId: CASE_ID, role: asset.key },
      },
    });
    await prisma.adminAuditLog.create({
      data: {
        actorSessionId: null,
        actorAdminUserId: null,
        actorRole: null,
        action: MEDIA_AUDIT_ACTION,
        resourceType: 'CMS_MEDIA',
        resourceId: media.id,
        outcome: 'SUCCESS',
        reason: REVISION_REASON,
        details: { pageKey: PAGE_KEY, caseId: CASE_ID, filename, storageProvider: 'VERCEL_BLOB' },
      },
    });
    urls[asset.key] = media.publicUrl;
  }

  return urls;
}

function updateBlocks(blocks, locale, mediaUrls) {
  if (!Array.isArray(blocks)) throw new Error(`${locale}: blocks must be an array`);

  const casesBlock = getBlock(blocks, 'casesBlock');
  if (!casesBlock || !Array.isArray(casesBlock.items)) {
    throw new Error(`${locale}: casesBlock is missing or invalid`);
  }

  const caseIndex = casesBlock.items.findIndex(
    (item) => isObject(item) && item.id === CASE_ID
  );
  if (caseIndex < 0) throw new Error(`${locale}: ${CASE_ID} is missing from casesBlock`);

  const branchServiceCaseIndex = casesBlock.items.findIndex(
    (item) => isObject(item) && item.id === BRANCH_SERVICE_CASE_ID
  );
  if (branchServiceCaseIndex < 0) {
    throw new Error(`${locale}: ${BRANCH_SERVICE_CASE_ID} is missing from casesBlock`);
  }

  const copy = COPY[locale];
  const nextCase = {
    ...casesBlock.items[caseIndex],
    ...copy,
    beforeImage: mediaUrls.before,
    afterImage: mediaUrls.result,
    galleryImage1: mediaUrls.before,
    galleryAlt1: copy.beforeAlt,
    galleryImage2: mediaUrls.process,
    galleryAlt2: copy.processAlt,
    galleryImage3: mediaUrls.result,
    galleryAlt3: copy.afterAlt,
  };

  const galleryBlock = getBlock(blocks, 'galleryItemsBlock');
  if (!galleryBlock || !Array.isArray(galleryBlock.items) || !isObject(galleryBlock.items[caseIndex])) {
    throw new Error(`${locale}: matching gallery item is missing`);
  }

  const nextGalleryItem = {
    ...galleryBlock.items[caseIndex],
    title: copy.title,
    category: copy.category,
    image: mediaUrls.result,
    imageAlt: copy.afterAlt,
    description: copy.result,
  };

  const branchServiceGalleryItem = galleryBlock.items[branchServiceCaseIndex];
  if (!isObject(branchServiceGalleryItem)) {
    throw new Error(`${locale}: matching branch-service gallery item is missing`);
  }

  const maintenanceWideGalleryItem = {
    ...branchServiceGalleryItem,
    id: MAINTENANCE_WIDE_GALLERY_ITEM_ID,
    image: MAINTENANCE_WIDE_GALLERY_IMAGE,
  };
  const galleryItemsWithoutMaintenanceWideCard = galleryBlock.items
    .map((item, index) => (index === caseIndex ? nextGalleryItem : item))
    .filter((item) => !isObject(item) || item.id !== MAINTENANCE_WIDE_GALLERY_ITEM_ID);
  galleryItemsWithoutMaintenanceWideCard.splice(
    Math.min(MAINTENANCE_WIDE_GALLERY_INDEX, galleryItemsWithoutMaintenanceWideCard.length),
    0,
    maintenanceWideGalleryItem
  );

  return blocks.map((block) => {
    if (!isObject(block)) return block;
    if (block.key === 'casesBlock') {
      return {
        ...block,
        items: block.items.map((item, index) => (index === caseIndex ? nextCase : item)),
      };
    }
    if (block.key === 'galleryItemsBlock') {
      return {
        ...block,
        items: galleryItemsWithoutMaintenanceWideCard,
      };
    }
    return block;
  });
}

async function main() {
  const apply = process.argv.includes('--apply');
  const [{ prisma }, { getReferenzenPublishIssues }] = await Promise.all([
    import('../src/lib/prisma.ts'),
    import('../src/lib/cms/referenzen-schema.ts'),
  ]);

  try {
    const pages = await prisma.cmsPage.findMany({
      where: { pageKey: PAGE_KEY, locale: { in: LOCALES } },
      orderBy: { locale: 'asc' },
    });
    const pageByLocale = new Map(pages.map((page) => [page.locale, page]));
    const missingLocales = LOCALES.filter((locale) => !pageByLocale.has(locale));
    if (missingLocales.length > 0) {
      throw new Error(`Missing CMS records: ${missingLocales.join(', ')}`);
    }

    const mediaUrls = await resolveMediaUrls(prisma, apply);
    const plan = LOCALES.map((locale) => {
      const page = pageByLocale.get(locale);
      const blocks = updateBlocks(page.blocks, locale, mediaUrls);
      const validationIssues = getReferenzenPublishIssues(
        blocks.filter(isObject),
        locale
      );
      if (validationIssues.length > 0) {
        throw new Error(
          `${locale}: strict Referenzen validation failed: ${validationIssues
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
    const changedPlan = plan.filter((entry) => entry.changed);

    console.log(
      `${apply ? 'Applying' : 'Dry run'}: ${changedPlan.length}/${plan.length} localized CMS records need an update.`
    );
    if (!apply || changedPlan.length === 0) return;

    await prisma.$transaction(
      async (tx) => {
        for (const { page, blocks } of changedPlan) {
          const updatedPage = await tx.cmsPage.update({
            where: { id: page.id },
            data: { blocks },
          });
          const snapshot = buildRevisionSnapshot(updatedPage);

          await tx.cmsPageRevision.create({
            data: {
              pageId: updatedPage.id,
              sourceAction: 'UPDATE',
              reason: REVISION_REASON,
              actorAdminUserId: null,
              actorSessionId: null,
              actorRole: null,
              snapshot,
            },
          });
          await tx.adminAuditLog.create({
            data: {
              actorSessionId: null,
              actorAdminUserId: null,
              actorRole: null,
              action: AUDIT_ACTION,
              resourceType: 'CMS_PAGE',
              resourceId: updatedPage.id,
              outcome: 'SUCCESS',
              reason: REVISION_REASON,
              details: {
                pageKey: PAGE_KEY,
                locale: updatedPage.locale,
                caseId: CASE_ID,
                changedFields: ['casesBlock', 'galleryItemsBlock'],
                mediaBinariesChanged: false,
              },
            },
          });
        }
      },
      { maxWait: 10_000, timeout: 30_000 }
    );
    console.log(`Applied: ${changedPlan.length} CMS records, revisions, and audit-log entries.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
