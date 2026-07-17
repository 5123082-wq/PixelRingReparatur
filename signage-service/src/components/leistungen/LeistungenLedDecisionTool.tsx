'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import { Link } from '@/i18n/routing';
import LeistungenRequestButton from './LeistungenRequestButton';

type DecisionOption = {
  title: string;
  text: string;
  tag: string;
};

type DecisionGuide = {
  eyebrow: string;
  title: string;
  intro: string;
  options: DecisionOption[];
  noteTitle: string;
  noteText: string;
};

type RequestChecklist = {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[];
};

type ServiceLink = {
  title: string;
  text: string;
  href: string;
  tag: string;
};

type NextStep = {
  requestTitle: string;
  requestText: string;
  requestCta: string;
  servicesTitle: string;
  servicesText: string;
  links: ServiceLink[];
};

type LeistungenLedDecisionToolProps = {
  decisionGuide: DecisionGuide;
  requestChecklist: RequestChecklist;
  nextStep: NextStep;
  serviceIntent: string;
};

export default function LeistungenLedDecisionTool({
  decisionGuide,
  requestChecklist,
  nextStep,
  serviceIntent,
}: LeistungenLedDecisionToolProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOption = decisionGuide.options[activeIndex] ?? decisionGuide.options[0];

  const checklistPreview = useMemo(() => requestChecklist.items.slice(0, 5), [requestChecklist.items]);

  return (
    <section className="border-t border-[#E7DDD3] bg-[#FFFDF9] py-14 sm:py-20">
      <div className="pr-site-container">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
          <div className="text-start">
            <SectionEyebrow className="mb-3">{decisionGuide.eyebrow}</SectionEyebrow>
            <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] sm:text-5xl">
              {decisionGuide.title}
            </h2>
          </div>
          <p className="max-w-2xl text-start text-[16px] font-semibold leading-8 text-[#526174]">
            {decisionGuide.intro}
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[28px] border border-[#D9C7BA] bg-[#F7F1E8] shadow-[0_18px_50px_rgba(8,24,39,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
            <div className="border-b border-[#E0D2C4] bg-[#FFFDF9] p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="grid gap-2">
                {decisionGuide.options.map((option, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={option.title}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group flex min-h-[74px] items-center justify-between gap-4 rounded-[18px] border px-4 py-3 text-start transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] ${
                        isActive
                          ? 'border-[#0E1A2B] bg-[#0E1A2B] text-white'
                          : 'border-[#E7DDD3] bg-white text-[#0E1A2B] hover:border-[#B8643E]/55 hover:bg-[#FFFDF9]'
                      }`}
                    >
                      <span className="min-w-0">
                        <span
                          className={`block text-[11px] font-black uppercase tracking-[0.08em] ${
                            isActive ? 'text-[#F2D7C9]' : 'text-[#8F4C2F]'
                          }`}
                        >
                          {option.tag}
                        </span>
                        <span className="mt-1 block break-words text-[16px] font-black leading-tight">
                          {option.title}
                        </span>
                      </span>
                      <motion.span
                        aria-hidden="true"
                        animate={{ scale: isActive ? 1 : 0.72, opacity: isActive ? 1 : 0.45 }}
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                          isActive ? 'bg-[#B8643E]' : 'bg-[#D9C7BA]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeOption?.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="min-w-0"
                  >
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#8F4C2F]">
                      {activeOption?.tag}
                    </span>
                    <h3 className="mt-4 break-words text-[30px] font-black leading-tight text-[#0E1A2B] sm:text-[40px]">
                      {activeOption?.title}
                    </h3>
                    <p className="mt-5 text-[17px] font-semibold leading-8 text-[#526174]">
                      {activeOption?.text}
                    </p>

                    <div className="mt-7 rounded-[22px] border border-[#D9C7BA] bg-white p-5">
                      <h4 className="text-[18px] font-black leading-tight text-[#0E1A2B]">
                        {decisionGuide.noteTitle}
                      </h4>
                      <p className="mt-3 text-[14.5px] font-semibold leading-7 text-[#526174]">
                        {decisionGuide.noteText}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <aside className="rounded-[24px] border border-[#E0D2C4] bg-[#FFFDF9] p-5 shadow-sm">
                  <p className="text-[12px] font-black uppercase tracking-[0.08em] text-[#8F4C2F]">
                    {requestChecklist.eyebrow}
                  </p>
                  <h3 className="mt-3 text-[22px] font-black leading-tight text-[#0E1A2B]">
                    {requestChecklist.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] font-semibold leading-7 text-[#526174]">
                    {requestChecklist.intro}
                  </p>
                  <ul className="mt-5 grid gap-2.5">
                    {checklistPreview.map((item) => (
                      <li key={item} className="flex gap-3 text-[14px] font-bold leading-6 text-[#1F2F3D]">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#B8643E]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>

              <div className="mt-8 flex flex-col gap-5 border-t border-[#E0D2C4] pt-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h3 className="text-[22px] font-black leading-tight text-[#0E1A2B]">
                    {nextStep.requestTitle}
                  </h3>
                  <p className="mt-2 text-[14.5px] font-semibold leading-7 text-[#526174]">
                    {nextStep.requestText}
                  </p>
                </div>
                <LeistungenRequestButton
                  label={nextStep.requestCta}
                  serviceIntent={serviceIntent}
                  className="w-full px-7 sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 rounded-[22px] border border-[#E7DDD3] bg-[#F7F1E8] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[18px] font-black leading-tight text-[#0E1A2B]">
              {nextStep.servicesTitle}
            </h3>
            <p className="mt-2 text-[14px] font-semibold leading-6 text-[#526174]">
              {nextStep.servicesText}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            {nextStep.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-10 items-center rounded-full border border-[#D9C7BA] bg-white px-4 text-[13px] font-black text-[#0E1A2B] transition-colors hover:border-[#B8643E]/50 hover:text-[#8F4C2F]"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
