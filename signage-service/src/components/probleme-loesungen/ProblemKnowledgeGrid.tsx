'use client';

import { useState } from 'react';
import { useEffect } from 'react';

import { getProblemKnowledgeLabels } from '@/lib/content/problem-knowledge';
import type { ProblemIntent } from '@/lib/content/problem-knowledge';

type ProblemCard = {
  id: string;
  intent: ProblemIntent;
  title: string;
  symptom: string;
  solution: string;
};

type CardKnowledge = {
  title: string;
  articleSlug: string;
  shortAnswer: string | null;
  cardCauseText?: string;
  causes: string[];
  safeChecks: string[];
  urgentWarnings: string[];
  serviceProcess: string[];
  workScopeFactors: string[];
  selfRepairTips?: string[];
};

type ProblemKnowledgeGridProps = {
  locale: string;
  problems: ProblemCard[];
  /**
   * Pre-loaded CMS articles indexed by slug.
   * Keyed by slug (e.g. "no-light", "flicking") matching CmsArticle.slug in the DB.
   */
  knowledgeBySlug: Map<string, CardKnowledge>;
};

type ArticleUiLabels = {
  preview: string;
  readArticle: string;
  openPage: string;
  close: string;
  symptoms: string;
  causes: string;
  selfRepair: string;
};

function getArticleUiLabels(locale: string): ArticleUiLabels {
  if (locale === 'de') {
    return {
      preview: 'Kurz erklärt',
      readArticle: 'Details öffnen',
      openPage: 'Artikel als eigene Seite öffnen',
      close: 'Schließen',
      symptoms: 'Symptome',
      causes: 'Ursachen',
      selfRepair: 'Was Sie selbst versuchen können',
    };
  }

  if (locale === 'ru') {
    return {
      preview: 'Детали',
      readArticle: 'Открыть детали',
      openPage: 'Открыть полную статью',
      close: 'Закрыть',
      symptoms: 'Симптомы',
      causes: 'Причины',
      selfRepair: 'Советы по самостоятельному ремонту',
    };
  }

  return {
    preview: 'Preview',
    readArticle: 'Open details',
    openPage: 'Open article page',
    close: 'Close',
    symptoms: 'Symptoms',
    causes: 'Causes',
    selfRepair: 'What you can try yourself',
  };
}

export default function ProblemKnowledgeGrid({
  locale,
  problems,
  knowledgeBySlug,
}: ProblemKnowledgeGridProps) {
  const [modalProblemId, setModalProblemId] = useState<string | null>(null);
  const knowledgeLabels = getProblemKnowledgeLabels(locale);
  const articleLabels = getArticleUiLabels(locale);
  const modalProblem = modalProblemId
    ? problems.find((problem) => problem.id === modalProblemId) ?? null
    : null;
  const modalKnowledge = modalProblem ? knowledgeBySlug.get(modalProblem.id) ?? null : null;

  useEffect(() => {
    if (!modalProblemId) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalProblemId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalProblemId]);

  return (
    <>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem, index) => {
          const knowledge = knowledgeBySlug.get(problem.id) ?? null;

          return (
            <article
              key={problem.id}
              className="flex min-h-[360px] flex-col rounded-[22px] border border-[#E7DDD3] bg-[#FFFDF9] p-5 shadow-sm transition-[border-color,box-shadow] hover:border-[#B8643E]/45 hover:shadow-md"
            >
              <button
                type="button"
                aria-controls={`knowledge-preview-${problem.id}`}
                onClick={() => setModalProblemId(problem.id)}
                className="group flex w-full flex-1 cursor-pointer flex-col rounded-[16px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] rtl:text-right"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="text-[13px] font-extrabold text-[#B8643E]/55">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-0 inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[#E2C4B4] bg-[#FFF4EC] px-3 text-[12px] font-black uppercase tracking-[0.1em] text-[#B8643E] shadow-sm transition-colors group-hover:border-[#B8643E] group-hover:bg-[#B8643E] group-hover:text-white"
                  >
                    {articleLabels.readArticle}
                  </span>
                </span>
                <h3 className="mt-3 text-xl font-extrabold leading-[1.12] text-[#0E1A2B]">
                  {problem.title}
                </h3>
                <span className="mt-4 text-[15px] leading-7 text-[#6B625C]">
                  <span className="block text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                    {articleLabels.symptoms}
                  </span>
                  <span className="mt-1 block font-bold">{problem.symptom}</span>
                </span>
                {!knowledge && (
                  <span className="mt-3 text-[15px] leading-7 text-[#4E5A5A]">
                    {problem.solution}
                  </span>
                )}
              </button>

              {knowledge ? (
                <a
                  id={`knowledge-preview-${problem.id}`}
                  href={`/${locale}/probleme-loesungen/${knowledge.articleSlug}`}
                  className="mt-auto block cursor-pointer border-t border-[#E7DDD3] pt-5 text-[15px] leading-7 text-[#3E4A48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E]"
                  onClick={(event) => {
                    event.preventDefault();
                    setModalProblemId(problem.id);
                  }}
                >
                  <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                    {articleLabels.causes}
                  </h4>
                  <div className="mt-2 overflow-hidden rounded-[18px] bg-[#FFF7F1] px-4 py-3 ring-1 ring-[#F0D2C2] transition-colors hover:bg-[#FFF0E6] hover:text-[#0E1A2B]">
                    <p className="line-clamp-4 text-[#31413F]">
                      {knowledge.cardCauseText ?? knowledge.shortAnswer ?? problem.solution}
                    </p>
                  </div>
                </a>
              ) : null}
            </article>
          );
        })}
      </div>

      {modalProblem && modalKnowledge ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="problem-article-modal-title"
          onClick={() => setModalProblemId(null)}
          className="fixed inset-0 z-50 overflow-hidden bg-[#0E1A2B]/70 px-4 py-6 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="mx-auto flex max-h-[calc(100vh-3rem)] max-w-5xl flex-col overflow-hidden rounded-[28px] bg-[#FFFDF9] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E7DDD3] pb-5">
              <div className="p-5 pb-0 sm:p-8 sm:pb-0">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#B8643E]">
                  {articleLabels.preview}
                </p>
                <h3 id="problem-article-modal-title" className="mt-2 text-3xl font-black leading-[1.1] text-[#0E1A2B]">
                  {modalKnowledge.title || modalProblem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalProblemId(null)}
                className="m-5 rounded-full border border-[#D9C7BA] bg-white px-4 py-2 text-[14px] font-bold text-[#4E5A5A] transition-colors hover:border-[#B8643E] hover:text-[#8F4F34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] sm:m-8"
              >
                {articleLabels.close}
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-5 sm:px-8 sm:pb-8">
              <div className="mt-6 grid gap-6 text-[15px] leading-7 text-[#3E4A48] lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  {modalKnowledge.shortAnswer && (
                    <section>
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.answer}
                      </h4>
                      <p className="mt-2 max-w-3xl">{modalKnowledge.shortAnswer}</p>
                    </section>
                  )}

                  {modalKnowledge.causes.length > 0 && (
                    <section className="mt-5">
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.causes}
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {modalKnowledge.causes.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8643E]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                <div className="grid gap-5">
                  {modalKnowledge.safeChecks.length > 0 && (
                    <section>
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.questions}
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {modalKnowledge.safeChecks.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7BA190]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {modalKnowledge.serviceProcess.length > 0 && (
                    <section>
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.checks}
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {modalKnowledge.serviceProcess.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E1A2B]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>

              {modalKnowledge.urgentWarnings.length > 0 && (
                <section className="mt-6 rounded-[16px] border border-[#F0D2C2] bg-[#FFF4EC] p-4">
                  <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                    {knowledgeLabels.warnings}
                  </h4>
                  <ul className="mt-2 grid gap-2 md:grid-cols-2">
                    {modalKnowledge.urgentWarnings.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="font-extrabold text-[#B8643E]">!</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {modalKnowledge.selfRepairTips && modalKnowledge.selfRepairTips.length > 0 && (
                <section className="mt-6 rounded-[16px] border border-[#CFE7DA] bg-[#F0FAF4] p-4">
                  <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#2E7A55]">
                    {articleLabels.selfRepair}
                  </h4>
                  <ul className="mt-2 grid gap-2 md:grid-cols-2">
                    {modalKnowledge.selfRepairTips.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7A55]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="mt-7">
                <a
                  href={`/${locale}/probleme-loesungen/${modalKnowledge.articleSlug}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#B8643E] px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#A65835] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
                >
                  {articleLabels.openPage}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
