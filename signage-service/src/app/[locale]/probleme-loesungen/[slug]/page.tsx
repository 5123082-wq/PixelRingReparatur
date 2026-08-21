import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProblemArticleBody from '@/components/probleme-loesungen/ProblemArticleBody';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import {
  getAllPublishedSymptomArticleNavItems,
  getProblemArticlePublicSlug,
  getPublishedSymptomArticles,
  getPublishedSymptomArticleByPublicSlug,
  getPublishedSymptomArticleTitlesByPublicSlugs,
} from '@/lib/cms/articles';
import type { PublicProblemArticle } from '@/lib/cms/articles';
import {
  DEFAULT_SITE_LOCALE,
  SITE_BASE_URL,
  SITE_LOCALES,
  buildLanguageAlternatesForLocales,
} from '@/lib/seo';
import type { SiteLocale } from '@/lib/seo';
import type { ProblemIntent } from '@/lib/content/problem-knowledge';

const INTENT_BY_PUBLIC_SLUG: Record<string, ProblemIntent> = {
  'werbeanlage-leuchtet-nicht': 'sign-not-lighting',
  'werbeanlage-flackert': 'flickering-light',
  'led-leuchtet-ungleichmaessig': 'uneven-led-light',
  'buchstabe-leuchtet-nicht': 'letter-not-lighting',
  'werbeanlage-schaltet-nach-regen-ab': 'rain-failure',
  'folie-loest-sich': 'peeling-film',
  'folie-ist-ausgeblichen': 'faded-film',
  'werbeanlage-wackelt': 'loose-sign',
  'dringende-reparatur-werbeanlage': 'urgent-safety-risk',
};

const FALLBACK_ARTICLE_LOCALE: SiteLocale = 'en';

export const revalidate = 3600;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  try {
    const articles = await getPublishedSymptomArticles(params.locale);

    return articles.flatMap((article) => {
      const publicSlug = getProblemArticlePublicSlug(article.slug);
      return publicSlug ? [{ slug: publicSlug }] : [];
    });
  } catch (error) {
    console.warn(
      `Unable to prerender problem articles for ${params.locale}; routes will be generated on demand.`,
      error
    );
    return [];
  }
}

type ArticleResolution = {
  article: PublicProblemArticle | null;
  contentLocale: SiteLocale;
  isFallback: boolean;
};

/** Fallback related-article map when CmsArticle.relatedSlugs is empty */
const RELATED_MAP: Record<string, string[]> = {
  'werbeanlage-leuchtet-nicht': ['werbeanlage-flackert', 'werbeanlage-schaltet-nach-regen-ab'],
  'werbeanlage-flackert': ['werbeanlage-leuchtet-nicht', 'led-leuchtet-ungleichmaessig'],
  'led-leuchtet-ungleichmaessig': ['werbeanlage-flackert', 'buchstabe-leuchtet-nicht'],
  'buchstabe-leuchtet-nicht': ['werbeanlage-leuchtet-nicht', 'led-leuchtet-ungleichmaessig'],
  'werbeanlage-schaltet-nach-regen-ab': ['werbeanlage-leuchtet-nicht', 'werbeanlage-flackert'],
  'folie-loest-sich': ['folie-ist-ausgeblichen'],
  'folie-ist-ausgeblichen': ['folie-loest-sich'],
  'werbeanlage-wackelt': ['dringende-reparatur-werbeanlage'],
  'dringende-reparatur-werbeanlage': ['werbeanlage-wackelt', 'werbeanlage-leuchtet-nicht'],
};

function buildGermanFallbackDescription(title: string): string {
  return `Erfahren Sie, warum ${title} auftreten kann, was Sie sicher prüfen können und wie PixelRing die nächsten Schritte koordiniert.`;
}

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

const getPublishedArticleLocales = cache(async (publicSlug: string): Promise<SiteLocale[]> => {
  const checks = await Promise.all(
    SITE_LOCALES.map(async (locale) => {
      const localizedArticle = await getPublishedSymptomArticleByPublicSlug(locale, publicSlug);
      return localizedArticle ? locale : null;
    })
  );

  return checks.filter((locale): locale is SiteLocale => Boolean(locale));
});

const resolveArticle = cache(async (
  locale: string,
  slug: string
): Promise<ArticleResolution> => {
  const article = await getPublishedSymptomArticleByPublicSlug(locale, slug);

  if (article) {
    return {
      article,
      contentLocale: locale as SiteLocale,
      isFallback: false,
    };
  }

  if (locale === FALLBACK_ARTICLE_LOCALE) {
    return {
      article: null,
      contentLocale: FALLBACK_ARTICLE_LOCALE,
      isFallback: false,
    };
  }

  const fallbackArticle = await getPublishedSymptomArticleByPublicSlug(
    FALLBACK_ARTICLE_LOCALE,
    slug
  );

  return {
    article: fallbackArticle,
    contentLocale: FALLBACK_ARTICLE_LOCALE,
    isFallback: Boolean(fallbackArticle),
  };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { article, contentLocale, isFallback } = await resolveArticle(locale, slug);

  if (!article) {
    return {
      title: 'Problemartikel nicht gefunden | PixelRing',
    };
  }

  const title =
    locale === 'de'
      ? article.seoTitle ?? `${article.title}: Ursachen, sichere Prüfung und Reparatur | PixelRing`
      : article.seoTitle ?? `${article.title} | PixelRing`;
  const description =
    article.seoDescription ??
    (locale === 'de'
      ? buildGermanFallbackDescription(article.title)
      : article.shortAnswer ?? article.title);
  const articlePath = `/probleme-loesungen/${article.publicSlug}`;

  if (isFallback) {
    return {
      title,
      description,
      robots: {
        index: false,
        follow: true,
      },
      alternates: {
        canonical: `/${contentLocale}${articlePath}`,
      },
    };
  }

  const publishedLocales = await getPublishedArticleLocales(article.publicSlug);
  const defaultLocale = publishedLocales.includes(DEFAULT_SITE_LOCALE)
    ? DEFAULT_SITE_LOCALE
    : publishedLocales[0];

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${articlePath}`,
      ...(defaultLocale
        ? {
            languages: buildLanguageAlternatesForLocales(
              publishedLocales,
              articlePath,
              defaultLocale
            ),
          }
        : {}),
    },
  };
}

export default async function ProblemArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [globalCms, resolved] = await Promise.all([
    getGlobalPageCmsContent(locale),
    resolveArticle(locale, slug),
  ]);
  const { article, contentLocale, isFallback } = resolved;

  if (!article) {
    notFound();
  }

  const [navItems, relatedArticles, publishedLocales] = await Promise.all([
    getAllPublishedSymptomArticleNavItems(contentLocale),
    getPublishedSymptomArticleTitlesByPublicSlugs(
      contentLocale,
      RELATED_MAP[article.publicSlug] ?? []
    ),
    getPublishedArticleLocales(article.publicSlug),
  ]);
  const problemIntent = INTENT_BY_PUBLIC_SLUG[article.publicSlug] ?? 'sign-not-lighting';

  /* --- Article JSON-LD for rich results & AI citation --- */
  const canonicalUrl = `${SITE_BASE_URL}/${contentLocale}/probleme-loesungen/${article.publicSlug}`;
  const overviewUrl = `${SITE_BASE_URL}/${contentLocale}/probleme-loesungen`;
  const datePublished = article.publishedAt ?? article.updatedAt;
  const dateModified = article.updatedAt;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription ?? article.shortAnswer ?? article.title,
    datePublished: datePublished.toISOString(),
    dateModified: dateModified.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'PixelRing',
      url: 'https://www.pixel-ring.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PixelRing',
      url: 'https://www.pixel-ring.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'PixelRing',
        item: `${SITE_BASE_URL}/${contentLocale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Probleme & Lösungen',
        item: overviewUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Header content={globalCms?.header} availableLocales={publishedLocales} />
      <main>
        <ProblemArticleBody
          locale={locale}
          article={article}
          problemIntent={problemIntent}
          relatedArticles={relatedArticles}
          navItems={navItems}
          currentSlug={slug}
          fallbackContentLocale={isFallback ? contentLocale : undefined}
        />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
