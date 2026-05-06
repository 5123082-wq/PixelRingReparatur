import type { MetadataRoute } from 'next';

import {
  PUBLIC_SITEMAP_PATHS,
  PROBLEM_ARTICLE_PUBLIC_SLUGS,
  SITE_LOCALES,
  buildLanguageAlternates,
  buildLocaleUrl,
} from '@/lib/seo';

type SitemapEntry = MetadataRoute.Sitemap[number];

const now = new Date();

async function getPublishedProblemArticlePaths(locale: string): Promise<string[]> {
  if (!process.env.POSTGRES_PRISMA_URL && !process.env.DATABASE_URL) {
    return [];
  }

  try {
    const { getPublishedSymptomArticleByPublicSlug } = await import('@/lib/cms/articles');
    const checks = await Promise.all(
      PROBLEM_ARTICLE_PUBLIC_SLUGS.map(async (slug) => {
        const article = await getPublishedSymptomArticleByPublicSlug(locale, slug);
        return article ? `/probleme-loesungen/${article.publicSlug}` : null;
      })
    );

    return checks.filter((path): path is string => Boolean(path));
  } catch (error) {
    console.warn('Unable to load CMS problem articles for sitemap:', error);
    return [];
  }
}

function buildEntry(locale: string, path: string): SitemapEntry {
  const canonicalPath = path || '';
  const url = buildLocaleUrl(locale, canonicalPath);

  return {
    url,
    lastModified: now,
    changeFrequency: canonicalPath === '' ? 'weekly' : 'monthly',
    priority: canonicalPath === '' ? 1 : canonicalPath === '/probleme-loesungen' ? 0.9 : 0.7,
    alternates: {
      languages: buildLanguageAlternates(canonicalPath),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];

  for (const locale of SITE_LOCALES) {
    for (const path of PUBLIC_SITEMAP_PATHS) {
      entries.push(buildEntry(locale, path));
    }

    const articlePaths = await getPublishedProblemArticlePaths(locale);
    for (const path of articlePaths) {
      entries.push({
        ...buildEntry(locale, path),
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    }
  }

  return entries;
}
