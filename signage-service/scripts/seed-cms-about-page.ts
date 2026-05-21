import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import {
  ABOUT_CONTENT,
  ABOUT_PAGE_LABELS,
  type Locale,
} from '../src/lib/content/about-page.ts';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const LOCALES: Locale[] = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const REVISION_REASON = 'About page CMS sync from current /ueber-uns content';

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

function getPrisma() {
  const connectionString = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Missing POSTGRES_PRISMA_URL or DATABASE_URL for about CMS seed.');
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: normalizeConnectionString(connectionString) }),
    log: ['error'],
  });
}

function createBlock(type: string, key: string, sortOrder: number, payload: Record<string, unknown>) {
  return {
    type,
    key,
    enabled: true,
    sortOrder,
    ...payload,
  };
}

function canonicalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeJson(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalizeJson(item)])
    );
  }

  return value;
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(canonicalizeJson(left ?? null)) === JSON.stringify(canonicalizeJson(right ?? null));
}

function buildAboutPage(locale: Locale) {
  const content = ABOUT_CONTENT[locale] ?? ABOUT_CONTENT.de;
  const labels = ABOUT_PAGE_LABELS[locale] ?? ABOUT_PAGE_LABELS.de;

  return {
    pageKey: 'about',
    locale,
    status: 'PUBLISHED',
    title: content.hero.titlePrefix,
    seoTitle: content.metaTitle,
    seoDescription: content.metaDescription,
    canonicalUrl: `/${locale}/ueber-uns`,
    blocks: [
      createBlock('hero', 'hero', 10, {
        badge: content.hero.badge,
        titlePrefix: content.hero.titlePrefix,
        titleAccent: content.hero.titleAccent,
        intro: content.hero.intro,
        benefits: content.hero.benefits,
        ctaPrimary: content.hero.ctaPrimary,
        ctaSecondary: content.hero.ctaSecondary,
      }),
      createBlock('cardList', 'audience', 20, {
        title: labels.quickServicesTitle,
        serviceCardCta: labels.serviceCardCta,
        items: content.services,
      }),
      createBlock('faqList', 'process', 30, {
        title: content.about.title,
        cta: content.about.cta,
        items: content.about.accordions,
      }),
      createBlock('cardList', 'materials', 40, {
        title: labels.materialTitle,
        items: labels.materialBrands.map((label) => ({ label })),
      }),
      createBlock('textSection', 'quality', 50, {
        title: content.quality.title,
        description: content.quality.description,
        features: content.quality.features,
        mediaLabel: content.quality.mediaLabel,
        playLabel: content.quality.playLabel,
        cta: content.quality.cta,
      }),
      createBlock('reviewList', 'testimonials', 60, {
        title: labels.testimonialsTitle,
        items: labels.testimonials,
      }),
      createBlock('cta', 'final', 70, {
        title: content.final.title,
        button: content.final.button,
        primaryLabel: content.final.button,
      }),
    ],
  };
}

function buildRevisionSnapshot(page: {
  pageKey: string;
  locale: string;
  status: string;
  title: string;
  blocks: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: Date | null;
  lastReviewedAt: Date | null;
}) {
  return {
    pageKey: page.pageKey,
    locale: page.locale,
    status: page.status,
    title: page.title,
    blocks: page.blocks,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    publishedAt: page.publishedAt?.toISOString() ?? null,
    lastReviewedAt: page.lastReviewedAt?.toISOString() ?? null,
  };
}

async function syncAboutPage(prisma: PrismaClient, locale: Locale) {
  const desired = buildAboutPage(locale);
  const existing = await prisma.cmsPage.findUnique({
    where: {
      pageKey_locale: {
        pageKey: desired.pageKey,
        locale: desired.locale,
      },
    },
  });

  const needsUpdate =
    !existing ||
    existing.deletedAt !== null ||
    existing.status !== desired.status ||
    existing.title !== desired.title ||
    existing.seoTitle !== desired.seoTitle ||
    existing.seoDescription !== desired.seoDescription ||
    existing.canonicalUrl !== desired.canonicalUrl ||
    !sameJson(existing.blocks, desired.blocks);

  if (!needsUpdate) {
    return { locale, action: 'skipped' };
  }

  const page = await prisma.cmsPage.upsert({
    where: {
      pageKey_locale: {
        pageKey: desired.pageKey,
        locale: desired.locale,
      },
    },
    create: {
      pageKey: desired.pageKey,
      locale: desired.locale,
      status: desired.status,
      title: desired.title,
      blocks: desired.blocks,
      seoTitle: desired.seoTitle,
      seoDescription: desired.seoDescription,
      canonicalUrl: desired.canonicalUrl,
      publishedAt: new Date(),
      lastReviewedAt: new Date(),
      deletedAt: null,
    },
    update: {
      status: desired.status,
      title: desired.title,
      blocks: desired.blocks,
      seoTitle: desired.seoTitle,
      seoDescription: desired.seoDescription,
      canonicalUrl: desired.canonicalUrl,
      publishedAt: existing?.publishedAt ?? new Date(),
      lastReviewedAt: new Date(),
      deletedAt: null,
    },
  });

  await prisma.cmsPageRevision.create({
    data: {
      pageId: page.id,
      sourceAction: existing ? 'UPDATE' : 'CREATE',
      reason: REVISION_REASON,
      snapshot: buildRevisionSnapshot(page),
    },
  });

  return { locale, action: existing?.deletedAt ? 'restored' : existing ? 'updated' : 'created' };
}

async function main() {
  const prisma = getPrisma();

  try {
    const results = [];
    for (const locale of LOCALES) {
      results.push(await syncAboutPage(prisma, locale));
    }

    for (const result of results) {
      console.log(`${result.locale}: ${result.action}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('About CMS seed failed:', error);
  process.exitCode = 1;
});
