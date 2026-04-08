import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Link } from '@/i18n/routing';
import {
  getSupportArticleDetail,
  getSupportSeoConfig,
  resolveSupportArticleCanonicalPath,
  resolveSupportArticleTitle,
  resolveSupportCanonicalUrl,
  resolveSupportSeoText,
  type SupportArticleDetail,
} from '@/lib/cms/support-content';

function renderParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => (
      <p key={`${index}-${block.slice(0, 20)}`} className="text-[#72665D] leading-relaxed">
        {block}
      </p>
    ));
}

function buildJsonLd(locale: string, article: SupportArticleDetail, canonicalPath: string, description: string) {
  return {
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description,
      inLanguage: article.locale,
      mainEntityOfPage: canonicalPath,
      author: {
        '@type': 'Organization',
        name: 'PixelRing Reparatur',
      },
      publisher: {
        '@type': 'Organization',
        name: 'PixelRing Reparatur',
      },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Support',
          item: `/${locale}/support`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: canonicalPath,
        },
      ],
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const [article, seoConfig] = await Promise.all([
    getSupportArticleDetail(locale, slug),
    getSupportSeoConfig(),
  ]);

  if (!article) {
    return {
      title: 'Support',
    };
  }

  const fallbackCanonical = resolveSupportArticleCanonicalPath(
    seoConfig.articleCanonicalBaseUrl,
    locale,
    slug,
    `/${locale}/support/${slug}`
  );
  const canonical = resolveSupportCanonicalUrl([article.canonicalUrl], fallbackCanonical);
  const title =
    resolveSupportSeoText([article.seoTitle], null) ??
    resolveSupportArticleTitle(seoConfig.articleTitleTemplate, article.title);
  const description =
    resolveSupportSeoText(
      [article.seoDescription, seoConfig.articleDescriptionFallback, article.shortAnswer],
      article.shortAnswer || article.title
    ) ?? article.title;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
  };
}

export default async function SupportArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [article, seoConfig] = await Promise.all([
    getSupportArticleDetail(locale, slug),
    getSupportSeoConfig(),
  ]);

  if (!article) {
    notFound();
  }

  const fallbackCanonical = resolveSupportArticleCanonicalPath(
    seoConfig.articleCanonicalBaseUrl,
    locale,
    slug,
    `/${locale}/support/${slug}`
  );
  const canonicalPath = resolveSupportCanonicalUrl([article.canonicalUrl], fallbackCanonical);
  const description =
    resolveSupportSeoText(
      [article.seoDescription, seoConfig.articleDescriptionFallback, article.shortAnswer],
      article.shortAnswer || article.title
    ) ?? article.title;
  const jsonLd = buildJsonLd(locale, article, canonicalPath, description);
  const related = (
    await Promise.all(
      article.relatedSlugs.map(async (relatedSlug) =>
        getSupportArticleDetail(locale, relatedSlug)
      )
    )
  ).filter((entry): entry is SupportArticleDetail => Boolean(entry));

  const ctaHref = article.ctaHref;
  const isExternalCta =
    typeof ctaHref === 'string' &&
    (ctaHref.startsWith('http://') || ctaHref.startsWith('https://'));

  return (
    <div className="bg-[#F7F1E8] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="mb-8">
            <p className="text-[12px] font-bold text-[#B8643E] tracking-[1.4px] uppercase mb-3">
              Support
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] leading-[1.1]">
              {article.title}
            </h1>
            {article.shortAnswer ? (
              <p className="mt-5 max-w-3xl text-lg text-[#72665D] leading-relaxed">
                {article.shortAnswer}
              </p>
            ) : null}
            {article.lastReviewedAt ? (
              <p className="mt-3 text-sm text-[#8B8B8B]">
                Reviewed {new Date(article.lastReviewedAt).toLocaleDateString('de-DE')}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-[#E7DDD3] bg-white p-6 md:p-8">
            <div className="space-y-4">{renderParagraphs(article.content)}</div>

            <div className="mt-8 space-y-8">
              {article.causes.length > 0 ? (
                <section>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Was das meistens bedeutet
                  </h2>
                  <ul className="space-y-2">
                    {article.causes.map((item) => (
                      <li key={item} className="text-[#72665D] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {article.safeChecks.length > 0 ? (
                <section>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Was Sie sicher prüfen können
                  </h2>
                  <ul className="space-y-2">
                    {article.safeChecks.map((item) => (
                      <li key={item} className="text-[#72665D] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {article.urgentWarnings.length > 0 ? (
                <section>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Wann es dringend ist
                  </h2>
                  <ul className="space-y-2">
                    {article.urgentWarnings.map((item) => (
                      <li key={item} className="text-[#72665D] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {article.serviceProcess.length > 0 ? (
                <section>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Wie wir die Ursache eingrenzen
                  </h2>
                  <ol className="space-y-2 list-decimal list-inside">
                    {article.serviceProcess.map((item) => (
                      <li key={item} className="text-[#72665D] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {article.workScopeFactors.length > 0 ? (
                <section>
                  <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Wovon der Aufwand abhängt
                  </h2>
                  <ul className="space-y-2">
                    {article.workScopeFactors.map((item) => (
                      <li key={item} className="text-[#72665D] leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {article.ctaLabel && ctaHref ? (
              <div className="mt-8">
                {isExternalCta ? (
                  <a
                    href={ctaHref}
                    className="inline-flex items-center justify-center px-5 py-3 bg-[#B8643E] text-white font-bold rounded-2xl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {article.ctaLabel}
                  </a>
                ) : (
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center px-5 py-3 bg-[#B8643E] text-white font-bold rounded-2xl"
                  >
                    {article.ctaLabel}
                  </Link>
                )}
              </div>
            ) : null}
          </div>

          {related.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Ähnliche Themen</h2>
              <div className="flex flex-wrap gap-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/support/${item.slug}`}
                    className="px-4 py-2 bg-white border border-[#E7DDD3] rounded-2xl text-[#72665D] font-medium"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }}
      />
    </div>
  );
}
