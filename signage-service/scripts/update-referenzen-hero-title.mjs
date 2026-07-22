import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local'), quiet: true });
dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

const PAGE_KEY = 'referenzen';
const LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const HERO_TITLES = {
  de: 'Unsere Arbeiten',
  en: 'Our work',
  ru: 'Наши работы',
  tr: 'Çalışmalarımız',
  pl: 'Nasze realizacje',
  ar: 'أعمالنا',
};
const REVISION_REASON =
  'Shorten the Referenzen hero to one stable localized heading.';
const PAGE_AUDIT_ACTION = 'CMS_PAGE_REFERENZEN_HERO_TITLE_UPDATED';

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
    if (!isObject(block) || block.key !== 'heroBlock') return block;
    found = true;
    return {
      ...block,
      title: HERO_TITLES[locale],
    };
  });

  if (!found) {
    throw new Error(`${locale}: heroBlock is missing`);
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
      if (page.status === 'PUBLISHED' && issues.length > 0) {
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

    console.log(
      `${apply ? 'Applying' : 'Dry run'}: ${changedPages.length}/${plan.length} page records need a hero-title update.`
    );
    if (!apply || changedPages.length === 0) return;

    await prisma.$transaction(
      async (tx) => {
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
                blockKey: 'heroBlock',
                field: 'title',
                value: HERO_TITLES[updatedPage.locale],
              },
            },
          });
        }
      },
      { maxWait: 10_000, timeout: 30_000 }
    );

    console.log(
      `Applied: ${changedPages.length} CMS page records plus revisions and audit logs.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
