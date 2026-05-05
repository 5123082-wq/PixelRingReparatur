import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProblemArticleBody from '@/components/probleme-loesungen/ProblemArticleBody';
import { getGlobalPageCmsContent } from '@/lib/cms/pages';
import { getPublishedSymptomArticleByPublicSlug } from '@/lib/cms/articles';
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
  const [globalCms, article] = await Promise.all([
    getGlobalPageCmsContent(locale),
    getPublishedSymptomArticleByPublicSlug(locale, slug),
  ]);

  if (!article) {
    notFound();
  }

  const problemIntent = INTENT_BY_PUBLIC_SLUG[article.publicSlug] ?? 'sign-not-lighting';

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      <Header content={globalCms?.header} />
      <main>
        <ProblemArticleBody
          locale={locale}
          article={article}
          problemIntent={problemIntent}
        />
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
