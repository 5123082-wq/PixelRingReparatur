'use client';

import { useState } from 'react';

import {
  getProblemKnowledge,
  getProblemKnowledgeLabels,
  type ProblemIntent,
} from '@/lib/content/problem-knowledge';

type ProblemCard = {
  id: string;
  intent: ProblemIntent;
  title: string;
  symptom: string;
  solution: string;
};

type ProblemKnowledgeGridProps = {
  locale: string;
  problems: ProblemCard[];
};

export default function ProblemKnowledgeGrid({
  locale,
  problems,
}: ProblemKnowledgeGridProps) {
  const [openProblemId, setOpenProblemId] = useState<string | null>(null);
  const knowledgeLabels = getProblemKnowledgeLabels(locale);

  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {problems.map((problem, index) => {
        const isOpen = openProblemId === problem.id;
        const knowledge = getProblemKnowledge(locale, problem.intent);

        return (
          <article
            key={problem.id}
            className={`rounded-[22px] border bg-[#FFFDF9] p-5 shadow-sm transition-[border-color,box-shadow] ${
              isOpen
                ? 'border-[#B8643E]/45 shadow-md md:col-span-2 lg:col-span-3'
                : 'min-h-[300px] border-[#E7DDD3]'
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenProblemId((current) => (current === problem.id ? null : problem.id))}
              className="flex w-full cursor-pointer flex-col rounded-[16px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] rtl:text-right"
            >
              <span className="flex items-start justify-between gap-4">
                <span className="text-[13px] font-extrabold text-[#B8643E]/55">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-1 text-2xl font-light leading-none text-[#B8643E] transition-transform ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </span>
              <h3 className="mt-3 text-xl font-extrabold leading-[1.12] text-[#0E1A2B]">
                {problem.title}
              </h3>
              <span className="mt-4 text-[15px] font-bold leading-7 text-[#6B625C]">
                {problem.symptom}
              </span>
              <span className="mt-3 text-[15px] leading-7 text-[#4E5A5A]">
                {problem.solution}
              </span>
            </button>

            {knowledge ? (
              <div
                hidden={!isOpen}
                className="mt-5 border-t border-[#E7DDD3] pt-5 text-[15px] leading-7 text-[#3E4A48]"
              >
                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                  <div>
                    <section>
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.answer}
                      </h4>
                      <p className="mt-2 max-w-3xl">{knowledge.assistantAnswer}</p>
                    </section>

                    <section className="mt-5">
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.causes}
                      </h4>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                        {knowledge.likelyCauses.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8643E]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <section>
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.questions}
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {knowledge.safeQuestions.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7BA190]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                        {knowledgeLabels.checks}
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {knowledge.pixelringChecks.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E1A2B]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>

                <section className="mt-6 rounded-[16px] border border-[#F0D2C2] bg-[#FFF4EC] p-4">
                  <h4 className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#B8643E]">
                    {knowledgeLabels.warnings}
                  </h4>
                  <ul className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {knowledge.urgentWarnings.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="font-extrabold text-[#B8643E]">!</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
