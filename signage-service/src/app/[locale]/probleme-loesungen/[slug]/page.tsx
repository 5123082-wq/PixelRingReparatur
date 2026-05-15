import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProblemArticleBody from '@/components/probleme-loesungen/ProblemArticleBody';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import {
  getAllPublishedSymptomArticleNavItems,
  getPublishedSymptomArticleByPublicSlug,
  getPublishedSymptomArticleTitlesByPublicSlugs,
} from '@/lib/cms/articles';
import { SITE_BASE_URL } from '@/lib/seo';
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getPublishedSymptomArticleByPublicSlug(locale, slug);

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

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/probleme-loesungen/${article.publicSlug}`,
    },
  };
}

export default async function ProblemArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [globalCms, article, navItems] = await Promise.all([
    getGlobalPageCmsContent(locale),
    getPublishedSymptomArticleByPublicSlug(locale, slug),
    getAllPublishedSymptomArticleNavItems(locale),
  ]);

  if (!article) {
    notFound();
  }

  const problemIntent = INTENT_BY_PUBLIC_SLUG[article.publicSlug] ?? 'sign-not-lighting';

  /* --- Article JSON-LD for rich results & AI citation --- */
  const canonicalUrl = `${SITE_BASE_URL}/${locale}/probleme-loesungen/${article.publicSlug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription ?? article.shortAnswer ?? article.title,
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

  /* --- Related articles for cross-linking --- */
  const relatedSlugs = RELATED_MAP[article.publicSlug] ?? [];
  const relatedArticles = relatedSlugs.length > 0
    ? await getPublishedSymptomArticleTitlesByPublicSlugs(locale, relatedSlugs)
    : [];

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header content={globalCms?.header} />
      <main>
        <ProblemArticleBody
          locale={locale}
          article={article}
          problemIntent={problemIntent}
          relatedArticles={relatedArticles}
          navItems={navItems}
          currentSlug={slug}
        />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
