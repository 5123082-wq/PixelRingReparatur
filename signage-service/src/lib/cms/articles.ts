import 'server-only';

import { CmsArticleType } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export type AiCmsArticle = {
  id: string;
  locale: string;
  type: CmsArticleType;
  slug: string;
  title: string;
  shortAnswer: string | null;
  content: string;
  seoTitle: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

/**
 * Structured knowledge for a single symptom card on /probleme-loesungen.
 * All fields map directly to CmsArticle columns in the DB.
 * These are also used as structured data for GEO (AI search snippets) and SEO (FAQPage schema).
 */
export type PublicSymptomArticle = {
  slug: string;
  title: string;
  symptomLabel: string | null;
  /** Short, authoritative answer — rendered as AI snippet / FAQ answer */
  shortAnswer: string | null;
  /** Markdown body — full article text visible to bots at SSR */
  content: string;
  /** Bullet list: likely technical root causes */
  causes: string[];
  /** Bullet list: safe self-checks the customer can do */
  safeChecks: string[];
  /** Bullet list: signals that require urgent professional action */
  urgentWarnings: string[];
  /** Bullet list: PixelRing service process steps */
  serviceProcess: string[];
  /** Bullet list: factors affecting work scope / estimate */
  workScopeFactors: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  sortOrder: number;
};

export type PublicProblemArticle = PublicSymptomArticle & {
  publicSlug: string;
};

export const PROBLEM_ARTICLE_SLUG_BY_CMS_SLUG: Record<string, string> = {
  'no-light': 'werbeanlage-leuchtet-nicht',
  'flicking': 'werbeanlage-flackert',
  'uneven-light': 'led-leuchtet-ungleichmaessig',
  'letter-out': 'buchstabe-leuchtet-nicht',
  'rain-fail': 'werbeanlage-schaltet-nach-regen-ab',
  'peeling-film': 'folie-loest-sich',
  'faded-film': 'folie-ist-ausgeblichen',
  'shaky-sign': 'werbeanlage-wackelt',
  'urgent-repair': 'dringende-reparatur-werbeanlage',
};

const CMS_SLUG_BY_PROBLEM_ARTICLE_SLUG = Object.fromEntries(
  Object.entries(PROBLEM_ARTICLE_SLUG_BY_CMS_SLUG).map(([cmsSlug, publicSlug]) => [
    publicSlug,
    cmsSlug,
  ])
) as Record<string, string>;

export function getProblemArticlePublicSlug(cmsSlug: string): string | null {
  return PROBLEM_ARTICLE_SLUG_BY_CMS_SLUG[cmsSlug] ?? null;
}

const AI_CONTEXT_TYPES: CmsArticleType[] = [
  CmsArticleType.SYMPTOM,
  CmsArticleType.FAQ,
];

export async function getPublishedCmsArticlesForAi(
  locale: string
): Promise<AiCmsArticle[]> {
  return prisma.cmsArticle.findMany({
    where: {
      locale,
      type: {
        in: AI_CONTEXT_TYPES,
      },
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: {
      id: true,
      locale: true,
      type: true,
      slug: true,
      title: true,
      shortAnswer: true,
      content: true,
      seoTitle: true,
      publishedAt: true,
      updatedAt: true,
    },
    orderBy: [
      { sortOrder: 'asc' },
      { publishedAt: 'desc' },
      { updatedAt: 'desc' },
    ],
  });
}

export function buildAiCmsArticleBlock(article: AiCmsArticle): string {
  const headline = article.seoTitle?.trim() || article.title.trim();
  const summary = article.shortAnswer?.trim();
  const body = article.content.trim();

  return [
    `### ${article.type}:${article.slug}`,
    `Title: ${headline}`,
    summary ? `Short answer: ${summary}` : '',
    body ? `Content:\n${body}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Loads all PUBLISHED SYMPTOM articles for a given locale.
 * Used by /probleme-loesungen page to populate expanded card knowledge.
 *
 * Indexed by slug — the caller maps slug → ProblemIntent via SLUG_TO_INTENT.
 */
export async function getPublishedSymptomArticles(
  locale: string
): Promise<PublicSymptomArticle[]> {
  const rows = await prisma.cmsArticle.findMany({
    where: {
      locale,
      type: CmsArticleType.SYMPTOM,
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: {
      slug: true,
      title: true,
      symptomLabel: true,
      shortAnswer: true,
      content: true,
      causes: true,
      safeChecks: true,
      urgentWarnings: true,
      serviceProcess: true,
      workScopeFactors: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      sortOrder: true,
    },
    orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
  });

  return rows;
}

export async function getPublishedSymptomArticleByPublicSlug(
  locale: string,
  publicSlug: string
): Promise<PublicProblemArticle | null> {
  const cmsSlug = CMS_SLUG_BY_PROBLEM_ARTICLE_SLUG[publicSlug];

  if (!cmsSlug) {
    return null;
  }

  const article = await prisma.cmsArticle.findFirst({
    where: {
      locale,
      type: CmsArticleType.SYMPTOM,
      status: 'PUBLISHED',
      deletedAt: null,
      slug: cmsSlug,
    },
    select: {
      slug: true,
      title: true,
      symptomLabel: true,
      shortAnswer: true,
      content: true,
      causes: true,
      safeChecks: true,
      urgentWarnings: true,
      serviceProcess: true,
      workScopeFactors: true,
      seoTitle: true,
      seoDescription: true,
      canonicalUrl: true,
      sortOrder: true,
    },
  });

  if (!article) {
    return null;
  }

  return {
    ...article,
    publicSlug,
  };
}

/**
 * Loads title + publicSlug for a set of public slugs.
 * Used by the cross-linking section on article pages.
 */
export async function getPublishedSymptomArticleTitlesByPublicSlugs(
  locale: string,
  publicSlugs: string[]
): Promise<Array<{ publicSlug: string; title: string }>> {
  const cmsSlugs = publicSlugs
    .map((ps) => ({ publicSlug: ps, cmsSlug: CMS_SLUG_BY_PROBLEM_ARTICLE_SLUG[ps] }))
    .filter((entry): entry is { publicSlug: string; cmsSlug: string } => !!entry.cmsSlug);

  if (cmsSlugs.length === 0) return [];

  const rows = await prisma.cmsArticle.findMany({
    where: {
      locale,
      type: CmsArticleType.SYMPTOM,
      status: 'PUBLISHED',
      deletedAt: null,
      slug: { in: cmsSlugs.map((e) => e.cmsSlug) },
    },
    select: { slug: true, title: true },
  });

  const titleByCmsSlug = new Map(rows.map((r) => [r.slug, r.title]));

  return cmsSlugs
    .filter((e) => titleByCmsSlug.has(e.cmsSlug))
    .map((e) => ({
      publicSlug: e.publicSlug,
      title: titleByCmsSlug.get(e.cmsSlug)!,
    }));
}

/**
 * Loads title + publicSlug for ALL published symptom articles.
 * Used by the article-page navigation sidebar.
 */
export async function getAllPublishedSymptomArticleNavItems(
  locale: string
): Promise<Array<{ publicSlug: string; title: string; sortOrder: number }>> {
  const rows = await prisma.cmsArticle.findMany({
    where: {
      locale,
      type: CmsArticleType.SYMPTOM,
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: { slug: true, title: true, sortOrder: true },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });

  return rows
    .map((r) => {
      const publicSlug = PROBLEM_ARTICLE_SLUG_BY_CMS_SLUG[r.slug];
      if (!publicSlug) return null;
      return { publicSlug, title: r.title, sortOrder: r.sortOrder };
    })
    .filter(Boolean) as Array<{ publicSlug: string; title: string; sortOrder: number }>;
}
