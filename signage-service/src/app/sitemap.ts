import type { MetadataRoute } from 'next';

import {
  DEFAULT_SITE_LOCALE,
  PUBLIC_SITEMAP_LAST_MODIFIED_BY_PATH,
  PUBLIC_SITEMAP_PATHS,
  PROBLEM_ARTICLE_PUBLIC_SLUGS,
  SITE_LOCALES,
  buildLanguageAlternates,
  buildLanguageAlternatesForLocales,
  buildLocaleUrl,
} from '@/lib/seo';
import type { SiteLocale } from '@/lib/seo';

type SitemapEntry = MetadataRoute.Sitemap[number];

type ProblemArticleSitemapEntry = {
  locale: SiteLocale;
  path: string;
  lastModified: Date;
  alternates: Record<string, string>;
};

async function getPublishedProblemArticleEntries(): Promise<ProblemArticleSitemapEntry[]> {
  if (!process.env.POSTGRES_PRISMA_URL && !process.env.DATABASE_URL) {
    return [];
  }

  try {
    const { getPublishedSymptomArticleByPublicSlug } = await import('@/lib/cms/articles');
    const entries: ProblemArticleSitemapEntry[] = [];

    for (const slug of PROBLEM_ARTICLE_PUBLIC_SLUGS) {
      const localizedArticles = (
        await Promise.all(
          SITE_LOCALES.map(async (locale) => {
            const article = await getPublishedSymptomArticleByPublicSlug(locale, slug);

            return article
              ? {
                  locale,
                  path: `/probleme-loesungen/${article.publicSlug}`,
                  updatedAt: article.updatedAt,
                }
              : null;
          })
        )
      ).filter((entry): entry is { locale: SiteLocale; path: string; updatedAt: Date } =>
        Boolean(entry)
      );

      if (localizedArticles.length === 0) {
        continue;
      }

      const publishedLocales = localizedArticles.map((entry) => entry.locale);
      const defaultLocale = publishedLocales.includes(DEFAULT_SITE_LOCALE)
        ? DEFAULT_SITE_LOCALE
        : publishedLocales[0]!;

      for (const article of localizedArticles) {
        entries.push({
          locale: article.locale,
          path: article.path,
          lastModified: article.updatedAt,
          alternates: buildLanguageAlternatesForLocales(
            publishedLocales,
            article.path,
            defaultLocale
          ),
        });
      }
    }

    return entries;
  } catch (error) {
    console.warn('Unable to load CMS problem articles for sitemap:', error);
    return [];
  }
}

function buildEntry(
  locale: string,
  path: string,
  options: {
    lastModified?: SitemapEntry['lastModified'];
    languages?: Record<string, string>;
  } = {}
): SitemapEntry {
  const canonicalPath = path || '';
  const url = buildLocaleUrl(locale, canonicalPath);

  return {
    url,
    ...(options.lastModified ? { lastModified: options.lastModified } : {}),
    alternates: {
      languages: options.languages ?? buildLanguageAlternates(canonicalPath),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [];

  for (const locale of SITE_LOCALES) {
    for (const path of PUBLIC_SITEMAP_PATHS) {
      entries.push(
        buildEntry(locale, path, {
          lastModified: PUBLIC_SITEMAP_LAST_MODIFIED_BY_PATH[path],
        })
      );
    }
  }

  const articleEntries = await getPublishedProblemArticleEntries();
  for (const article of articleEntries) {
    entries.push({
      ...buildEntry(article.locale, article.path, {
        lastModified: article.lastModified,
        languages: article.alternates,
      }),
    });
  }

  return entries;
}
