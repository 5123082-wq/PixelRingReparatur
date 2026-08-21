import Link from 'next/link';

import ProblemRequestButton from '@/components/probleme-loesungen/ProblemRequestButton';
import { buildProblemArticleContextLinks } from '@/components/probleme-loesungen/problemArticleContextLinks';
import { getProblemKnowledgeLabels, type ProblemIntent } from '@/lib/content/problem-knowledge';
import type { PublicProblemArticle } from '@/lib/cms/articles';

type ProblemArticleBodyProps = {
  locale: string;
  article: PublicProblemArticle;
  problemIntent: ProblemIntent;
  relatedArticles?: Array<{ publicSlug: string; title: string }>;
  navItems?: Array<{ publicSlug: string; title: string; sortOrder: number }>;
  currentSlug?: string;
  fallbackContentLocale?: string;
};

function getArticleBodyLabels(locale: string) {
  if (locale === 'de') {
    return {
      shortAnswer: 'Kurze Antwort',
      causes: 'Häufige Ursachen',
      safeChecks: 'Was Sie sicher prüfen können',
      urgent: 'Wann es dringend ist',
      process: 'Wie PixelRing vorgeht',
      scope: 'Was den Umfang beeinflusst',
      cta: 'Problem übergeben',
      back: 'Zur Übersicht',
      sidebarTitle: 'Fall mit Foto klären',
      sidebarDescription: 'Senden Sie ein Foto und eine kurze Beschreibung. PixelRing prüft den Fall und koordiniert die nächsten Schritte.',
      relatedTitle: 'Ähnliche Probleme',
      navTitle: 'Alle Probleme & Lösungen',
      hubEyebrow: 'Probleme & Lösungen',
      fallbackNotice: 'Dieser Artikel ist vorübergehend auf Englisch verfügbar. Anfrage und Service bleiben auf Ihrer Sprache möglich.',
    };
  }

  if (locale === 'ru') {
    return {
      shortAnswer: 'Короткий ответ',
      causes: 'Частые причины',
      safeChecks: 'Что можно безопасно проверить',
      urgent: 'Когда это срочно',
      process: 'Как действует PixelRing',
      scope: 'Что влияет на объём работ',
      cta: 'Передать задачу',
      back: 'К обзору',
      sidebarTitle: 'Уточнить по фото',
      sidebarDescription: 'Отправьте фото и короткое описание. PixelRing проверит случай и согласует следующие шаги.',
      relatedTitle: 'Похожие проблемы',
      navTitle: 'Все проблемы и решения',
      hubEyebrow: 'Проблемы и решения',
      fallbackNotice: 'Эта статья временно доступна на английском. Заявку и сервис можно продолжить на выбранном языке.',
    };
  }

  if (locale === 'tr') {
    return {
      shortAnswer: 'Kısa cevap',
      causes: 'Yaygın nedenler',
      safeChecks: 'Güvenli kontroller',
      urgent: 'Ne zaman acil',
      process: 'PixelRing nasıl ilerler',
      scope: 'Kapsamı ne etkiler',
      cta: 'Sorunu ilet',
      back: 'Genel bakışa dön',
      sidebarTitle: 'Fotoğrafla durumu netleştirin',
      sidebarDescription: 'Bir fotoğraf ve kısa bir açıklama gönderin. PixelRing durumu inceler ve sonraki adımları koordine eder.',
      relatedTitle: 'Benzer sorunlar',
      navTitle: 'Tüm sorunlar ve çözümler',
      hubEyebrow: 'Sorunlar ve çözümler',
      fallbackNotice: 'Bu makale geçici olarak İngilizce sunuluyor. Talep ve servis süreci seçtiğiniz dilde devam edebilir.',
    };
  }

  if (locale === 'pl') {
    return {
      shortAnswer: 'Krótka odpowiedź',
      causes: 'Częste przyczyny',
      safeChecks: 'Bezpieczne kontrole',
      urgent: 'Kiedy sprawa jest pilna',
      process: 'Jak działa PixelRing',
      scope: 'Co wpływa na zakres',
      cta: 'Przekaż zgłoszenie',
      back: 'Powrót do przeglądu',
      sidebarTitle: 'Wyjaśnij sprawę zdjęciem',
      sidebarDescription: 'Wyślij zdjęcie i krótki opis. PixelRing sprawdzi sprawę i skoordynuje kolejne kroki.',
      relatedTitle: 'Podobne problemy',
      navTitle: 'Wszystkie problemy i rozwiązania',
      hubEyebrow: 'Problemy i rozwiązania',
      fallbackNotice: 'Ten artykuł jest tymczasowo dostępny po angielsku. Zgłoszenie i obsługa mogą być kontynuowane w wybranym języku.',
    };
  }

  if (locale === 'ar') {
    return {
      shortAnswer: 'إجابة قصيرة',
      causes: 'الأسباب الشائعة',
      safeChecks: 'فحوصات آمنة',
      urgent: 'متى تكون الحالة عاجلة',
      process: 'كيف يتصرف PixelRing',
      scope: 'ما يؤثر على النطاق',
      cta: 'أرسل المشكلة',
      back: 'العودة للنظرة العامة',
      sidebarTitle: 'وضّح المشكلة بصورة',
      sidebarDescription: 'أرسل صورة ووصفًا قصيرًا. PixelRing يراجع الحالة وينسق الخطوات التالية.',
      relatedTitle: 'مشكلات مشابهة',
      navTitle: 'جميع المشكلات والحلول',
      hubEyebrow: 'المشكلات والحلول',
      fallbackNotice: 'هذه المقالة متاحة مؤقتًا باللغة الإنجليزية. يمكن متابعة الطلب والخدمة بلغتك المختارة.',
    };
  }

  return {
    shortAnswer: 'Short answer',
    causes: 'Common causes',
    safeChecks: 'Safe checks',
    urgent: 'When it is urgent',
    process: 'How PixelRing proceeds',
    scope: 'What affects scope',
    cta: 'Send the issue',
    back: 'Back to overview',
    sidebarTitle: 'Clarify the issue with a photo',
    sidebarDescription: 'Send a photo and a short description. PixelRing reviews the case and coordinates the next steps.',
    relatedTitle: 'Related problems',
    navTitle: 'All problems & solutions',
    hubEyebrow: 'Problems & solutions',
    fallbackNotice: 'This article is temporarily available in English. The request and service process can continue in your selected language.',
  };
}

function normalizeHeadingText(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLocaleLowerCase();
}

function renderMarkdownLite(content: string, options?: { skipFirstHeadingText?: string }) {
  const blocks: string[] = [];
  const rawLines = content.split('\n');
  let buffer: string[] = [];
  let skippedFirstHeading = false;
  const skippedHeadingText = options?.skipFirstHeadingText
    ? normalizeHeadingText(options.skipFirstHeadingText)
    : null;

  // Group lines into blocks, keeping table rows together
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      if (buffer.length > 0) {
        blocks.push(buffer.join('\n'));
        buffer = [];
      }
    } else {
      // If we're switching between table and non-table lines, split block
      const isTableLine = trimmed.startsWith('|');
      const lastIsTable = buffer.length > 0 && buffer[buffer.length - 1].trim().startsWith('|');
      if (buffer.length > 0 && isTableLine !== lastIsTable) {
        blocks.push(buffer.join('\n'));
        buffer = [];
      }
      buffer.push(trimmed);
    }
  }
  if (buffer.length > 0) blocks.push(buffer.join('\n'));

  return blocks
    .map((block, blockIndex) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

    // --- Horizontal rule ---
    if (lines.length === 1 && /^-{3,}$/.test(lines[0])) {
      return <hr key={blockIndex} className="my-6 border-[#E7DDD3]" />;
    }

    // --- Table ---
    if (lines.length >= 2 && lines.every((l) => l.startsWith('|'))) {
      const parseRow = (row: string) =>
        row.split('|').slice(1, -1).map((cell) => cell.trim());

      const headerCells = parseRow(lines[0]);
      // Skip separator row (|---|---|)
      const dataStartIndex = /^\|[\s-:|]+\|$/.test(lines[1]) ? 2 : 1;
      const dataRows = lines.slice(dataStartIndex).map(parseRow);

      return (
        <div key={blockIndex} className="min-w-0 max-w-full overflow-x-auto rounded-[16px] border border-[#E7DDD3]">
          <table className="min-w-[560px] w-full text-left text-[15px]">
            <thead>
              <tr className="border-b border-[#E7DDD3] bg-[#F7F1E8]">
                {headerCells.map((cell, i) => (
                  <th key={i} className="px-4 py-3 font-bold text-[#0E1A2B]">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri} className="border-b border-[#E7DDD3] last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-[#4E5A5A]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // --- Bullet list ---
    const listItems = lines
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim())
      .filter(Boolean);

    if (listItems.length === lines.length) {
      return (
        <ul key={blockIndex} className="space-y-2">
          {listItems.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-2">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8643E]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    // --- Heading ---
    if (lines.length === 1 && lines[0].startsWith('#')) {
      const match = lines[0].match(/^(#{1,4})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        if (
          !skippedFirstHeading &&
          skippedHeadingText &&
          normalizeHeadingText(text) === skippedHeadingText
        ) {
          skippedFirstHeading = true;
          return null;
        }
        if (level <= 2) return <h2 key={blockIndex} className="text-xl font-bold text-[#0E1A2B] mt-6">{text}</h2>;
        return <h3 key={blockIndex} className="text-lg font-bold text-[#0E1A2B] mt-4">{text}</h3>;
      }
    }

    // --- Paragraph ---
    return <p key={blockIndex}>{block.replace(/^#+\s*/, '')}</p>;
  })
  .filter((block): block is NonNullable<typeof block> => block !== null);
}

function BulletSection({
  title,
  items,
  tone = 'default',
}: {
  title: string;
  items: string[];
  tone?: 'default' | 'safe' | 'urgent';
}) {
  if (items.length === 0) {
    return null;
  }

  const dotClass =
    tone === 'safe'
      ? 'bg-[#7BA190]'
      : tone === 'urgent'
        ? 'bg-[#B8643E]'
        : 'bg-[#0E1A2B]';

  return (
    <section className={tone === 'urgent' ? 'rounded-[20px] border border-[#F0D2C2] bg-[#FFF4EC] p-5' : ''}>
      <h2 className="text-2xl font-black text-[#0E1A2B]">{title}</h2>
      <ul className="mt-4 space-y-3 text-[16px] leading-7 text-[#3E4A48]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-3 h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticleContextLinks({ locale, articleSlug }: { locale: string; articleSlug: string }) {
  const contextLinks = buildProblemArticleContextLinks(locale, articleSlug);
  const isRtl = contextLinks.direction === 'rtl';

  return (
    <section
      dir={contextLinks.direction}
      aria-labelledby="article-context-links-title"
      className="rounded-[22px] border border-[#E7DDD3] bg-[#F7F1E8] p-5 sm:p-6"
    >
      <p
        className={`text-[12px] font-extrabold text-[#B8643E] ${
          isRtl ? '' : 'uppercase tracking-[0.14em]'
        }`}
      >
        {contextLinks.eyebrow}
      </p>
      <h2 id="article-context-links-title" className="mt-3 text-2xl font-black text-[#0E1A2B]">
        {contextLinks.title}
      </h2>
      <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#4E5A5A]">
        {contextLinks.description}
      </p>

      <nav aria-label={contextLinks.navLabel} className="mt-5">
        <ul className="grid gap-3 sm:grid-cols-3">
          {contextLinks.links.map((link) => (
            <li key={link.kind} className="min-w-0">
              <Link
                href={link.href}
                className="group block h-full rounded-[16px] border border-[#E7DDD3] bg-[#FFFDF9] px-4 py-4 text-start transition-colors hover:border-[#B8643E]/45 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
              >
                <span
                  className={`block text-[11px] font-extrabold text-[#8F4F34] ${
                    isRtl ? '' : 'uppercase tracking-[0.12em]'
                  }`}
                >
                  {link.eyebrow}
                </span>
                <span className="mt-2 block text-[15px] font-bold leading-6 text-[#0E1A2B] group-hover:text-[#8F4F34]">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

export default function ProblemArticleBody({
  locale,
  article,
  problemIntent,
  relatedArticles,
  navItems,
  currentSlug,
  fallbackContentLocale,
}: ProblemArticleBodyProps) {
  const labels = getArticleBodyLabels(locale);
  const knowledgeLabels = getProblemKnowledgeLabels(locale);
  const bodySectionCount = article.content.match(/^##\s+/gm)?.length ?? 0;
  const bodyLooksComplete = article.content.length >= 2500 && bodySectionCount >= 4;
  const bodyBlocks = renderMarkdownLite(article.content, {
    skipFirstHeadingText: article.title,
  });
  const renderStructuredSections = !bodyLooksComplete;
  const ctaLabel = article.ctaLabel?.trim() || labels.cta;
  const articleLinkLocale = fallbackContentLocale ?? locale;

  return (
    <article className="bg-[#F7F1E8]">
      <section className="bg-[#0E1A2B] text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <a
            href={`/${locale}/probleme-loesungen`}
            className="inline-flex rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[13px] font-bold text-[#F4C7A9] transition-colors hover:bg-white/14"
          >
            {labels.back}
          </a>
          <p className="mt-8 text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#F4C7A9]">
            {labels.hubEyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-6xl">
            {article.title}
          </h1>
          {fallbackContentLocale && (
            <p className="mt-5 max-w-3xl rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-[15px] font-bold leading-7 text-white/82">
              {labels.fallbackNotice}
            </p>
          )}
          {article.symptomLabel && (
            <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-white/78">
              {article.symptomLabel}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto grid min-w-0 max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 max-w-full space-y-8 rounded-[28px] bg-[#FFFDF9] p-5 shadow-sm sm:p-8">
          {article.shortAnswer && (
            <section>
              <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                {labels.shortAnswer}
              </p>
              <p className="mt-3 text-xl font-bold leading-8 text-[#0E1A2B]">
                {article.shortAnswer}
              </p>
            </section>
          )}

          {bodyBlocks.length > 0 && (
            <section className="min-w-0 max-w-full space-y-4 break-words text-[16px] leading-8 text-[#3E4A48] [overflow-wrap:anywhere]">
              {bodyBlocks}
            </section>
          )}

          {renderStructuredSections && (
            <>
              <BulletSection title={labels.causes || knowledgeLabels.causes} items={article.causes} />
              <BulletSection title={labels.safeChecks || knowledgeLabels.questions} items={article.safeChecks} tone="safe" />
              <BulletSection title={labels.urgent || knowledgeLabels.warnings} items={article.urgentWarnings} tone="urgent" />
              <BulletSection title={labels.process || knowledgeLabels.checks} items={article.serviceProcess} />
              <BulletSection title={labels.scope} items={article.workScopeFactors} />
            </>
          )}

          <ArticleContextLinks locale={locale} articleSlug={article.publicSlug} />
        </div>

        <aside className="h-fit min-w-0 max-w-full rounded-[24px] border border-[#E7DDD3] bg-white p-5 shadow-sm lg:sticky lg:top-8">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#B8643E]">
            PixelRing
          </p>
          <h3 className="mt-3 text-2xl font-black text-[#0E1A2B]">
            {labels.sidebarTitle}
          </h3>
          <p className="mt-3 text-[15px] leading-7 text-[#4E5A5A]">
            {labels.sidebarDescription}
          </p>
          <div className="mt-5">
            <ProblemRequestButton label={ctaLabel} problemIntent={problemIntent} />
          </div>

          {navItems && navItems.length > 0 && (
            <details className="mt-6 border-t border-[#E7DDD3] pt-5 lg:open" open>
              <summary className="cursor-pointer text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#B8643E] lg:pointer-events-none lg:list-none">
                {labels.navTitle}
              </summary>
              <nav aria-label={labels.navTitle}>
                <ul className="mt-3 space-y-1">
                  {navItems.map((item) => {
                    const isCurrent = item.publicSlug === currentSlug;
                    return (
                      <li key={item.publicSlug}>
                        {isCurrent ? (
                          <span className="block rounded-xl bg-[#F7F1E8] px-3 py-2 text-[14px] font-bold text-[#0E1A2B]">
                            {item.title}
                          </span>
                        ) : (
                          <a
                            href={`/${articleLinkLocale}/probleme-loesungen/${item.publicSlug}`}
                            className="block rounded-xl px-3 py-2 text-[14px] text-[#4E5A5A] transition-colors hover:bg-[#F7F1E8] hover:text-[#0E1A2B]"
                          >
                            {item.title}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </details>
          )}
        </aside>
      </div>

      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-black text-[#0E1A2B]">{labels.relatedTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <a
                key={related.publicSlug}
                href={`/${articleLinkLocale}/probleme-loesungen/${related.publicSlug}`}
                className="rounded-[18px] border border-[#E7DDD3] bg-[#FFFDF9] px-5 py-4 text-[16px] font-bold text-[#3E4A48] transition-colors hover:border-[#B8643E]/45 hover:bg-[#FFF7F1]"
              >
                {related.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
