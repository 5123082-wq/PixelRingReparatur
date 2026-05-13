import ProblemRequestButton from '@/components/probleme-loesungen/ProblemRequestButton';
import { getProblemKnowledgeLabels, type ProblemIntent } from '@/lib/content/problem-knowledge';
import type { PublicProblemArticle } from '@/lib/cms/articles';

type ProblemArticleBodyProps = {
  locale: string;
  article: PublicProblemArticle;
  problemIntent: ProblemIntent;
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
  };
}

function renderMarkdownLite(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      const listItems = lines
        .filter((line) => line.startsWith('- '))
        .map((line) => line.slice(2).trim())
        .filter(Boolean);

      if (listItems.length === lines.length) {
        return (
          <ul key={block} className="space-y-2">
            {listItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8643E]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      return <p key={block}>{block.replace(/^#+\s*/, '')}</p>;
    });
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

export default function ProblemArticleBody({
  locale,
  article,
  problemIntent,
}: ProblemArticleBodyProps) {
  const labels = getArticleBodyLabels(locale);
  const knowledgeLabels = getProblemKnowledgeLabels(locale);
  const bodyBlocks = renderMarkdownLite(article.content);

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
            Probleme & Lösungen
          </p>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-6xl">
            {article.title}
          </h1>
          {article.symptomLabel && (
            <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-white/78">
              {article.symptomLabel}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8 rounded-[28px] bg-[#FFFDF9] p-5 shadow-sm sm:p-8">
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
            <section className="space-y-4 text-[16px] leading-8 text-[#3E4A48]">
              {bodyBlocks}
            </section>
          )}

          <BulletSection title={labels.causes || knowledgeLabels.causes} items={article.causes} />
          <BulletSection title={labels.safeChecks || knowledgeLabels.questions} items={article.safeChecks} tone="safe" />
          <BulletSection title={labels.urgent || knowledgeLabels.warnings} items={article.urgentWarnings} tone="urgent" />
          <BulletSection title={labels.process || knowledgeLabels.checks} items={article.serviceProcess} />
          <BulletSection title={labels.scope} items={article.workScopeFactors} />
        </div>

        <aside className="h-fit rounded-[24px] border border-[#E7DDD3] bg-white p-5 shadow-sm lg:sticky lg:top-8">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#B8643E]">
            PixelRing
          </p>
          <h2 className="mt-3 text-2xl font-black text-[#0E1A2B]">
            Fall mit Foto klären
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#4E5A5A]">
            Senden Sie ein Foto und eine kurze Beschreibung. PixelRing prüft den Fall und koordiniert die nächsten Schritte.
          </p>
          <div className="mt-5">
            <ProblemRequestButton label={labels.cta} problemIntent={problemIntent} />
          </div>
        </aside>
      </div>
    </article>
  );
}
