'use client';

import { useMemo, useState } from 'react';

import ChatModal from '@/components/common/ChatModal';
import ContactModal from '@/components/common/ContactModal';
import SectionEyebrow from '@/components/common/SectionEyebrow';

type EstimatorLocale = 'de' | 'ru';

type EstimatorOption = {
  label: string;
  value: number;
};

type EstimatorContent = {
  eyebrow: string;
  title: string;
  intro: string;
  problemLabel: string;
  heightLabel: string;
  urgencyLabel: string;
  estimateLabel: string;
  estimatePrefix: string;
  estimateNote: string;
  formTitle: string;
  formIntro: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  problemTextLabel: string;
  problemTextPlaceholder: string;
  ctaLabel: string;
  problemOptions: EstimatorOption[];
  heightOptions: EstimatorOption[];
  urgencyOptions: EstimatorOption[];
};

const ESTIMATOR_CONTENT: Record<EstimatorLocale, EstimatorContent> = {
  de: {
    eyebrow: 'Kostengefühl',
    title: 'Vorab einschätzen, dann sauber anfragen.',
    intro:
      'Der Rechner ist bewusst grob. Die echte Bewertung entsteht erst mit Fotos, Standort, Zugang und Materiallage.',
    problemLabel: 'Problemtyp',
    heightLabel: 'Montagehöhe',
    urgencyLabel: 'Dringlichkeit',
    estimateLabel: 'Orientierung netto',
    estimatePrefix: 'ab',
    estimateNote: 'Kein Angebot. Dient nur als erste Einordnung für die Anfrage.',
    formTitle: 'Reparatur anfragen',
    formIntro:
      'Beschreiben Sie kurz die Anlage. Ein Spezialist prüft die Angaben und meldet sich mit dem nächsten Schritt.',
    nameLabel: 'Name',
    namePlaceholder: 'Max Mustermann',
    phoneLabel: 'Telefon',
    phonePlaceholder: '+49 ...',
    addressLabel: 'Standort der Werbeanlage',
    addressPlaceholder: 'Straße, PLZ, Ort',
    problemTextLabel: 'Problem',
    problemTextPlaceholder: 'Was ist sichtbar defekt? Seit wann? Gibt es Fotos?',
    ctaLabel: 'Anfrage vorbereiten',
    problemOptions: [
      { label: 'LED / Lichtausfall', value: 180 },
      { label: 'Leuchtbuchstabe oder Befestigung', value: 240 },
      { label: 'Folie / Oberfläche', value: 160 },
      { label: 'Sturm- oder Fassadenschaden', value: 320 },
    ],
    heightOptions: [
      { label: 'bis 3 Meter', value: 0 },
      { label: '3 bis 6 Meter', value: 90 },
      { label: 'über 6 Meter', value: 180 },
    ],
    urgencyOptions: [
      { label: 'normal planbar', value: 0 },
      { label: 'dringend', value: 120 },
      { label: 'Express', value: 220 },
    ],
  },
  ru: {
    eyebrow: 'Предварительная оценка',
    title: 'Сначала понять порядок бюджета, затем отправить заявку.',
    intro:
      'Калькулятор даёт только грубую ориентацию. Точная оценка возможна после фото, адреса, доступа к вывеске и проверки материалов.',
    problemLabel: 'Тип неисправности',
    heightLabel: 'Высота монтажа',
    urgencyLabel: 'Срочность',
    estimateLabel: 'Ориентир без НДС',
    estimatePrefix: 'от',
    estimateNote: 'Это не предложение. Расчёт нужен только для первичной ориентации по заявке.',
    formTitle: 'Запросить ремонт',
    formIntro:
      'Кратко опишите вывеску. Специалист проверит данные и свяжется с вами по следующему шагу.',
    nameLabel: 'Имя',
    namePlaceholder: 'Ваше имя',
    phoneLabel: 'Телефон',
    phonePlaceholder: '+49 ...',
    addressLabel: 'Адрес вывески',
    addressPlaceholder: 'Улица, индекс, город',
    problemTextLabel: 'Проблема',
    problemTextPlaceholder: 'Что видно снаружи? Когда началось? Есть ли фото?',
    ctaLabel: 'Подготовить заявку',
    problemOptions: [
      { label: 'LED / пропал свет', value: 180 },
      { label: 'Буква или крепление', value: 240 },
      { label: 'Плёнка / поверхность', value: 160 },
      { label: 'Шторм или повреждение фасада', value: 320 },
    ],
    heightOptions: [
      { label: 'до 3 метров', value: 0 },
      { label: 'от 3 до 6 метров', value: 90 },
      { label: 'выше 6 метров', value: 180 },
    ],
    urgencyOptions: [
      { label: 'можно запланировать', value: 0 },
      { label: 'срочно', value: 120 },
      { label: 'экспресс', value: 220 },
    ],
  },
};

type LeistungenRepairCostEstimatorProps = {
  locale: string;
};

export default function LeistungenRepairCostEstimator({
  locale,
}: LeistungenRepairCostEstimatorProps) {
  const normalizedLocale: EstimatorLocale = locale === 'ru' ? 'ru' : 'de';
  const content = ESTIMATOR_CONTENT[normalizedLocale];
  const [problemCost, setProblemCost] = useState(content?.problemOptions[0]?.value ?? 180);
  const [heightCost, setHeightCost] = useState(content?.heightOptions[0]?.value ?? 0);
  const [urgencyCost, setUrgencyCost] = useState(content?.urgencyOptions[0]?.value ?? 0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const estimate = useMemo(() => {
    return Math.max(180, problemCost + heightCost + urgencyCost);
  }, [heightCost, problemCost, urgencyCost]);

  const formattedEstimate = estimate.toLocaleString(normalizedLocale === 'ru' ? 'ru-RU' : 'de-DE');

  return (
    <>
      <section id="kosten" className="border-t border-[#E7DDD3] bg-[#F7F1E8] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.38fr)] lg:items-end">
            <div className="text-start">
              <SectionEyebrow className="mb-3">
                {content.eyebrow}
              </SectionEyebrow>
              <h2 className="mt-2 max-w-4xl text-[34px] font-extrabold leading-[1.05] tracking-[0] text-[#0E1A2B] sm:text-[48px] lg:text-[58px]">
                {content.title}
              </h2>
            </div>
            <p className="max-w-xl text-[16px] font-medium leading-[1.65] text-[#526174] lg:text-[18px]">
              {content.intro}
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[0.86fr_1fr] lg:items-stretch">
            <div className="flex h-full flex-col rounded-[30px] border border-[#E7DDD3] bg-[#FFFDF9] p-6 shadow-[0_18px_48px_rgba(13,27,42,0.09)] sm:p-7">
              <div className="grid gap-5">
                <label className="block">
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.problemLabel}
                  </span>
                  <select
                    value={problemCost}
                    onChange={(event) => setProblemCost(Number(event.target.value))}
                    className="min-h-[50px] w-full rounded-[14px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-semibold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                  >
                    {content.problemOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.heightLabel}
                  </span>
                  <select
                    value={heightCost}
                    onChange={(event) => setHeightCost(Number(event.target.value))}
                    className="min-h-[50px] w-full rounded-[14px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-semibold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                  >
                    {content.heightOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.urgencyLabel}
                  </span>
                  <select
                    value={urgencyCost}
                    onChange={(event) => setUrgencyCost(Number(event.target.value))}
                    className="min-h-[50px] w-full rounded-[14px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-semibold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                  >
                    {content.urgencyOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

              </div>

              <div className="mt-6 rounded-[22px] bg-gradient-to-br from-[#0D1B2A] to-[#17283B] p-6 text-white shadow-[0_18px_38px_rgba(13,27,42,0.18)] lg:mt-auto">
                <span className="block text-[12px] font-black uppercase tracking-[0.14em] text-white/70">
                  {content.estimateLabel}
                </span>
                <strong className="mt-2 block text-[38px] font-black leading-none text-white sm:text-[52px]">
                  {content.estimatePrefix} {formattedEstimate} EUR
                </strong>
                <small className="mt-3 block text-[13px] leading-[1.45] text-white/70">
                  {content.estimateNote}
                </small>
              </div>
            </div>

            <form
              className="flex h-full flex-col rounded-[30px] border border-[#E7DDD3] bg-[#FFFDF9] p-6 shadow-[0_18px_48px_rgba(13,27,42,0.09)] sm:p-7"
              onSubmit={(event) => {
                event.preventDefault();
                setIsContactOpen(true);
              }}
            >
              <h3 className="text-[30px] font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-[34px]">
                {content.formTitle}
              </h3>
              <p className="mt-3 text-[16px] leading-[1.6] text-[#526174]">
                {content.formIntro}
              </p>

              <div className="mt-6 grid flex-1 content-start gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.nameLabel}
                  </span>
                  <input
                    autoComplete="name"
                    placeholder={content.namePlaceholder}
                    className="min-h-[50px] w-full rounded-[14px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-semibold text-[#0D1B2A] outline-none transition placeholder:text-[#6F7A8A] focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.phoneLabel}
                  </span>
                  <input
                    autoComplete="tel"
                    placeholder={content.phonePlaceholder}
                    className="min-h-[50px] w-full rounded-[14px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-semibold text-[#0D1B2A] outline-none transition placeholder:text-[#6F7A8A] focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.addressLabel}
                  </span>
                  <input
                    autoComplete="street-address"
                    placeholder={content.addressPlaceholder}
                    className="min-h-[50px] w-full rounded-[14px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-semibold text-[#0D1B2A] outline-none transition placeholder:text-[#6F7A8A] focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.problemTextLabel}
                  </span>
                  <textarea
                    placeholder={content.problemTextPlaceholder}
                    className="min-h-[118px] w-full resize-y rounded-[14px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 py-3 text-[15px] font-semibold text-[#0D1B2A] outline-none transition placeholder:text-[#6F7A8A] focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                  />
                </label>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#B8643E] px-7 py-3 text-[15px] font-black text-white shadow-[0_16px_34px_rgba(184,100,62,0.22)] transition-all duration-300 hover:bg-[#A65835] active:scale-[0.98]"
                  >
                    {content.ctaLabel}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
