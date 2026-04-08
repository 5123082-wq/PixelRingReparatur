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
