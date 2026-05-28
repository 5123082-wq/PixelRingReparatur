'use client';

import { useMemo, useState } from 'react';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenProblemDrawer from './LeistungenProblemDrawer';

type DiagnosisLocale = 'de' | 'ru';

type AccessOption = {
  label: string;
  value: number;
  timeAddon: string;
};

type DiagnosisScenario = {
  id: string;
  label: string;
  title: string;
  symptom: string;
  checks: string[];
  likelyResult: string;
  complexity: string;
  time: string;
  min: number;
  max: number;
  initialMessage: string;
};

type DiagnosisContent = {
  eyebrow: string;
  title: string;
  intro: string;
  pointOneTitle: string;
  pointOneText: string;
  pointTwoTitle: string;
  pointTwoText: string;
  terminalTitle: string;
  terminalBadge: string;
  defectLabel: string;
  accessLabel: string;
  checksLabel: string;
  likelyLabel: string;
  complexityLabel: string;
  timeLabel: string;
  budgetLabel: string;
  ctaLabel: string;
  drawerTitle: string;
  drawerCloseLabel: string;
  drawerFormTitle: string;
  accessOptions: AccessOption[];
  scenarios: DiagnosisScenario[];
};

const CONTENT: Record<DiagnosisLocale, DiagnosisContent> = {
  de: {
    eyebrow: 'Digitale Erstdiagnose',
    title: 'Warum wir erst messen, bevor wir montieren',
    intro:
      'Der Diagnose-Check ordnet sichtbare Symptome ein und zeigt, welche Messungen oder Sicherheitsprüfungen vor der Reparatur sinnvoll sind.',
    pointOneTitle: 'Messung statt Teiletausch',
    pointOneText:
      'Wir prüfen Stromversorgung, Feuchtigkeit, Kabelwege und Befestigung, bevor unnötig Material gewechselt wird.',
    pointTwoTitle: 'Besser vorbereiteter Einsatz',
    pointTwoText:
      'Aus Defektbild und Zugang entsteht ein realistischer Serviceplan für Werkzeug, Material und Terminfenster.',
    terminalTitle: 'Digitaler Diagnose-Simulator',
    terminalBadge: 'SIMULATOR',
    defectLabel: 'Defektbild',
    accessLabel: 'Zugang / Montagehöhe',
    checksLabel: 'Prüfprogramm',
    likelyLabel: 'Wahrscheinlicher Servicepfad',
    complexityLabel: 'Komplexität',
    timeLabel: 'Zeit vor Ort',
    budgetLabel: 'Orientierung',
    ctaLabel: 'Diesen Defekt anfragen',
    drawerTitle: 'Diagnose anfragen',
    drawerCloseLabel: 'Schließen',
    drawerFormTitle: 'Diagnose & Reparatur anfragen',
    accessOptions: [
      { label: 'Niedrig: unter 3 m, Leiter erreichbar', value: 0, timeAddon: '' },
      { label: 'Mittel: 3-6 m, Bühne wahrscheinlich', value: 90, timeAddon: '+ Bühne / Zugang' },
      { label: 'Hoch: über 6 m oder schwer zugänglich', value: 180, timeAddon: '+ erweiterte Zugangsklärung' },
    ],
    scenarios: [
      {
        id: 'led-partial',
        label: 'LED-Module / Teilbereiche dunkel',
        title: 'Teilbereiche leuchten nicht',
        symptom: 'Einzelne LED-Zonen, Module oder Buchstaben bleiben dunkel.',
        checks: ['LED-Ketten und Polarität prüfen', 'Netzteil-Leistung messen', 'Feuchtigkeit in Modulen ausschließen'],
        likelyResult: 'Punktuelle Reparatur mit Modul- oder Netzteiltausch',
        complexity: 'Mittel',
        time: 'ca. 1-2 Stunden',
        min: 220,
        max: 520,
        initialMessage: 'Digitale Erstdiagnose: LED-Module oder Teilbereiche leuchten nicht. Bitte prüfen: LED-Ketten, Netzteil, Feuchtigkeit.',
      },
      {
        id: 'full-outage',
        label: 'Komplette Anlage dunkel',
        title: 'Die gesamte Werbeanlage bleibt aus',
        symptom: 'Keine Beleuchtung, keine sichtbare Reaktion beim Einschalten.',
        checks: ['Einspeisung und Sicherung prüfen', 'Trafo / Netzteil messen', 'Hauptleitung und Schaltzeiten kontrollieren'],
        likelyResult: 'Elektrische Basisdiagnose vor Materialentscheidung',
        complexity: 'Mittel bis hoch',
        time: 'ca. 1-3 Stunden',
        min: 260,
        max: 680,
        initialMessage: 'Digitale Erstdiagnose: Komplette Werbeanlage bleibt dunkel. Bitte prüfen: Einspeisung, Sicherung, Trafo/Netzteil, Hauptleitung.',
      },
      {
        id: 'flicker',
        label: 'Flackern / instabiles Licht',
        title: 'Licht flackert oder läuft unruhig',
        symptom: 'Die Anlage leuchtet ungleichmäßig, pulsiert oder fällt zeitweise aus.',
        checks: ['Spannungsabfall messen', 'Dimmer / Steuerung prüfen', 'Kontaktstellen und Lastreserve kontrollieren'],
        likelyResult: 'Stabilisierung der Stromversorgung und Kontaktprüfung',
        complexity: 'Mittel',
        time: 'ca. 1-2 Stunden',
        min: 240,
        max: 560,
        initialMessage: 'Digitale Erstdiagnose: Flackern oder instabiles Licht. Bitte prüfen: Spannungsabfall, Dimmer/Steuerung, Kontaktstellen.',
      },
      {
        id: 'rain-fail',
        label: 'Ausfall nach Regen / Sicherung fällt',
        title: 'Störung bei Regen oder Feuchtigkeit',
        symptom: 'Die Sicherung fällt, die Anlage schaltet ab oder startet erst nach Trocknung wieder.',
        checks: ['VDE-Isolationsprüfung', 'Kabeldurchführungen prüfen', 'Gehäuse und Dichtungen kontrollieren'],
        likelyResult: 'Feuchtigkeitsdiagnose mit Sicherheitsprüfung',
        complexity: 'Hoch',
        time: 'ca. 2-4 Stunden',
        min: 320,
        max: 880,
        initialMessage: 'Digitale Erstdiagnose: Ausfall nach Regen oder Feuchtigkeit. Bitte prüfen: Isolation, Kabeldurchführungen, Dichtungen, Sicherung.',
      },
      {
        id: 'mounting',
        label: 'Lockerung / mechanischer Schaden',
        title: 'Befestigung oder Gehäuse beschädigt',
        symptom: 'Die Anlage wackelt, Halterungen sind lose oder Teile sind nach Sturm beschädigt.',
        checks: ['Befestigungspunkte prüfen', 'Fassade und Untergrund bewerten', 'Sicherung loser Teile planen'],
        likelyResult: 'Sicherung und mechanische Instandsetzung',
        complexity: 'Hoch',
        time: 'halber Tag möglich',
        min: 360,
        max: 980,
        initialMessage: 'Digitale Erstdiagnose: Lockerung oder mechanischer Schaden. Bitte prüfen: Befestigungspunkte, Untergrund, Sicherung loser Teile.',
      },
      {
        id: 'film',
        label: 'Folie löst sich / Oberfläche beschädigt',
        title: 'Folie oder Oberfläche ist beschädigt',
        symptom: 'Folie löst sich, ist verblasst, wirft Blasen oder Klebereste sind sichtbar.',
        checks: ['Untergrund prüfen', 'UV- und Klebereste bewerten', 'Reinigung und Neuverklebung planen'],
        likelyResult: 'Oberflächenvorbereitung und Teil- oder Neuverklebung',
        complexity: 'Niedrig bis mittel',
        time: 'ca. 1-3 Stunden',
        min: 180,
        max: 620,
        initialMessage: 'Digitale Erstdiagnose: Folie löst sich oder Oberfläche beschädigt. Bitte prüfen: Untergrund, UV-Schäden, Klebereste, Neuverklebung.',
      },
    ],
  },
  ru: {
    eyebrow: 'Цифровая первичная диагностика',
    title: 'Почему мы сначала проверяем, а потом ремонтируем',
    intro:
      'Диагностический модуль помогает понять, какие проверки нужны перед ремонтом: электрика, влага, крепления, доступ и подготовка материалов.',
    pointOneTitle: 'Проверка вместо слепой замены',
    pointOneText:
      'Мы оцениваем питание, влагу, кабельные линии и крепления до того, как менять детали без причины.',
    pointTwoTitle: 'Лучше подготовленный выезд',
    pointTwoText:
      'По типу дефекта и доступу к вывеске формируется понятный план: инструменты, материалы и окно работ.',
    terminalTitle: 'Цифровой диагностический симулятор',
    terminalBadge: 'СИМУЛЯТОР',
    defectLabel: 'Тип дефекта',
    accessLabel: 'Доступ / высота монтажа',
    checksLabel: 'Программа проверки',
    likelyLabel: 'Вероятный сценарий работ',
    complexityLabel: 'Сложность',
    timeLabel: 'Время на месте',
    budgetLabel: 'Ориентир',
    ctaLabel: 'Запросить диагностику',
    drawerTitle: 'Запросить диагностику',
    drawerCloseLabel: 'Закрыть',
    drawerFormTitle: 'Запросить диагностику и ремонт',
    accessOptions: [
      { label: 'Низко: до 3 м, доступно с лестницы', value: 0, timeAddon: '' },
      { label: 'Средне: 3-6 м, вероятна рабочая платформа', value: 90, timeAddon: '+ доступ / платформа' },
      { label: 'Высоко: выше 6 м или сложный доступ', value: 180, timeAddon: '+ отдельная проверка доступа' },
    ],
    scenarios: [
      {
        id: 'led-partial',
        label: 'LED-модули / часть вывески не горит',
        title: 'Часть вывески не светится',
        symptom: 'Отдельные LED-зоны, модули или буквы остаются тёмными.',
        checks: ['Проверить LED-цепи и полярность', 'Измерить блок питания', 'Исключить влагу в модулях'],
        likelyResult: 'Точечный ремонт с заменой модуля или блока питания',
        complexity: 'Средняя',
        time: 'примерно 1-2 часа',
        min: 220,
        max: 520,
        initialMessage: 'Цифровая первичная диагностика: часть LED-модулей или зон не светится. Проверить LED-цепи, блок питания и влагу.',
      },
      {
        id: 'full-outage',
        label: 'Вся вывеска не включается',
        title: 'Вся вывеска остаётся тёмной',
        symptom: 'Нет подсветки и реакции при включении.',
        checks: ['Проверить питание и автомат', 'Измерить трансформатор / блок питания', 'Проверить главную линию и таймеры'],
        likelyResult: 'Электрическая диагностика до решения о замене деталей',
        complexity: 'Средняя или высокая',
        time: 'примерно 1-3 часа',
        min: 260,
        max: 680,
        initialMessage: 'Цифровая первичная диагностика: вся вывеска не включается. Проверить питание, автомат, трансформатор/блок питания и главную линию.',
      },
      {
        id: 'flicker',
        label: 'Мерцание / нестабильный свет',
        title: 'Свет мерцает или работает нестабильно',
        symptom: 'Вывеска светится неравномерно, пульсирует или временами отключается.',
        checks: ['Измерить падение напряжения', 'Проверить диммер / управление', 'Проверить контакты и запас мощности'],
        likelyResult: 'Стабилизация питания и проверка контактов',
        complexity: 'Средняя',
        time: 'примерно 1-2 часа',
        min: 240,
        max: 560,
        initialMessage: 'Цифровая первичная диагностика: мерцание или нестабильный свет. Проверить падение напряжения, управление и контакты.',
      },
      {
        id: 'rain-fail',
        label: 'Сбой после дождя / выбивает автомат',
        title: 'Проблема при дожде или влажности',
        symptom: 'Выбивает автомат, вывеска отключается или включается только после высыхания.',
        checks: ['Проверить изоляцию', 'Проверить кабельные вводы', 'Проверить корпус и уплотнения'],
        likelyResult: 'Диагностика влаги с проверкой безопасности',
        complexity: 'Высокая',
        time: 'примерно 2-4 часа',
        min: 320,
        max: 880,
        initialMessage: 'Цифровая первичная диагностика: сбой после дождя или влажности. Проверить изоляцию, кабельные вводы, уплотнения и автомат.',
      },
      {
        id: 'mounting',
        label: 'Крепление / механическое повреждение',
        title: 'Повреждён корпус или крепление',
        symptom: 'Вывеска шатается, крепления ослабли или есть повреждения после ветра.',
        checks: ['Проверить точки крепления', 'Оценить фасад и основание', 'Запланировать временное крепление опасных частей'],
        likelyResult: 'Безопасное закрепление и механический ремонт',
        complexity: 'Высокая',
        time: 'возможна половина рабочего дня',
        min: 360,
        max: 980,
        initialMessage: 'Цифровая первичная диагностика: крепление или механическое повреждение. Проверить точки крепления, основание и безопасность частей.',
      },
      {
        id: 'film',
        label: 'Плёнка отклеилась / поверхность повреждена',
        title: 'Повреждена плёнка или поверхность',
        symptom: 'Плёнка отклеивается, выцвела, появились пузыри или следы клея.',
        checks: ['Проверить основание', 'Оценить UV-выгорание и клей', 'Запланировать очистку и новую оклейку'],
        likelyResult: 'Подготовка поверхности и частичная или новая оклейка',
        complexity: 'Низкая или средняя',
        time: 'примерно 1-3 часа',
        min: 180,
        max: 620,
        initialMessage: 'Цифровая первичная диагностика: плёнка отклеилась или поверхность повреждена. Проверить основание, UV-повреждения, клей и новую оклейку.',
      },
    ],
  },
};

type LeistungenDigitalDiagnosisProps = {
  locale: string;
};

export default function LeistungenDigitalDiagnosis({ locale }: LeistungenDigitalDiagnosisProps) {
  const normalizedLocale: DiagnosisLocale = locale === 'ru' ? 'ru' : 'de';
  const content = CONTENT[normalizedLocale];
  const [scenarioId, setScenarioId] = useState(content.scenarios[0].id);
  const [accessCost, setAccessCost] = useState(content.accessOptions[0].value);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scenario = content.scenarios.find((item) => item.id === scenarioId) ?? content.scenarios[0];
  const access = content.accessOptions.find((item) => item.value === accessCost) ?? content.accessOptions[0];

  const range = useMemo(() => {
    return {
      min: scenario.min + access.value,
      max: scenario.max + access.value,
    };
  }, [access.value, scenario]);

  const numberLocale = normalizedLocale === 'ru' ? 'ru-RU' : 'de-DE';

  return (
    <>
      <section id="diagnose" className="border-t border-[#E7DDD3] bg-[#EEF3FB] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="text-start">
            <SectionEyebrow className="mb-5">{content.eyebrow}</SectionEyebrow>
            <h2 className="max-w-3xl text-[34px] font-extrabold leading-[1.06] tracking-[0] text-[#0E1A2B] sm:text-[48px]">
              {content.title}
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] font-medium leading-[1.7] text-[#334155]">
              {content.intro}
            </p>

            <div className="mt-8 grid gap-4">
              <div className="flex gap-4 rounded-[22px] border border-[#D9C7BA] bg-[#FFFDF9]/74 p-5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B8643E]/10 text-[13px] font-black text-[#B8643E]">
                  1
                </span>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#0E1A2B]">{content.pointOneTitle}</h3>
                  <p className="mt-1 text-[14px] font-medium leading-6 text-[#526174]">{content.pointOneText}</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-[22px] border border-[#D9C7BA] bg-[#FFFDF9]/74 p-5 shadow-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#B8643E]/10 text-[13px] font-black text-[#B8643E]">
                  2
                </span>
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#0E1A2B]">{content.pointTwoTitle}</h3>
                  <p className="mt-1 text-[14px] font-medium leading-6 text-[#526174]">{content.pointTwoText}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#0D1B2A] p-5 text-white shadow-[0_24px_70px_rgba(13,27,42,0.24)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h3 className="text-[24px] font-black leading-tight text-white sm:text-[28px]">{content.terminalTitle}</h3>
                <p className="mt-2 text-[14px] font-medium leading-6 text-white/60">{scenario.symptom}</p>
              </div>
              <span className="rounded-full border border-[#B8643E]/30 bg-[#B8643E]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#D47E55]">
                {content.terminalBadge}
              </span>
            </div>

            <div className="mt-5 grid gap-5">
              <label className="block">
                <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#D47E55]">
                  {content.defectLabel}
                </span>
                <select
                  value={scenarioId}
                  onChange={(event) => setScenarioId(event.target.value)}
                  className="min-h-[52px] w-full rounded-[16px] border border-white/12 bg-white/8 px-4 text-[15px] font-bold text-white outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/15"
                >
                  {content.scenarios.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#0D1B2A] text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#D47E55]">
                  {content.accessLabel}
                </span>
                <select
                  value={accessCost}
                  onChange={(event) => setAccessCost(Number(event.target.value))}
                  className="min-h-[52px] w-full rounded-[16px] border border-white/12 bg-white/8 px-4 text-[15px] font-bold text-white outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/15"
                >
                  {content.accessOptions.map((item) => (
                    <option key={item.label} value={item.value} className="bg-[#0D1B2A] text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-[22px] border border-white/10 bg-white/6 p-5">
                <span className="block text-[12px] font-black uppercase tracking-[0.14em] text-[#D47E55]">
                  {content.checksLabel}
                </span>
                <div className="mt-4 grid gap-3">
                  {scenario.checks.map((check, index) => (
                    <div key={check} className="flex gap-3 text-[14px] font-semibold leading-6 text-white/82">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B8643E] text-[12px] font-black text-white">
                        {index + 1}
                      </span>
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                  <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/50">
                    {content.complexityLabel}
                  </span>
                  <strong className="mt-2 block text-[17px] font-black text-white">{scenario.complexity}</strong>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                  <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/50">
                    {content.timeLabel}
                  </span>
                  <strong className="mt-2 block text-[17px] font-black text-white">
                    {scenario.time} {access.timeAddon}
                  </strong>
                </div>
                <div className="rounded-[18px] border border-[#B8643E]/30 bg-[#B8643E]/10 p-4">
                  <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[#D47E55]">
                    {content.budgetLabel}
                  </span>
                  <strong className="mt-2 block text-[17px] font-black text-white">
                    {range.min.toLocaleString(numberLocale)}-{range.max.toLocaleString(numberLocale)} EUR
                  </strong>
                </div>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-white/6 p-4">
                <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/50">
                  {content.likelyLabel}
                </span>
                <strong className="mt-2 block text-[17px] font-black leading-snug text-white">
                  {scenario.likelyResult}
                </strong>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-[#B8643E] px-7 py-3 text-[15px] font-black text-white shadow-[0_16px_34px_rgba(184,100,62,0.28)] transition-all duration-300 hover:bg-[#A65835] active:scale-[0.98]"
              >
                {content.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

      <LeistungenProblemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={content.drawerTitle}
        reassuringText={`${scenario.likelyResult}. ${content.complexityLabel}: ${scenario.complexity}. ${content.timeLabel}: ${scenario.time}.`}
        initialMessage={`${scenario.initialMessage} ${content.accessLabel}: ${access.label}. ${content.budgetLabel}: ${range.min.toLocaleString(numberLocale)}-${range.max.toLocaleString(numberLocale)} EUR.`}
        initialIssueType="Repair"
        closeLabel={content.drawerCloseLabel}
        formTitle={content.drawerFormTitle}
      />
    </>
  );
}
