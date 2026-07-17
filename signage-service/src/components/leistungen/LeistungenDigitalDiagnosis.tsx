'use client';

import { useState } from 'react';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenProblemDrawer from './LeistungenProblemDrawer';

type DiagnosisLocale = 'de' | 'ru';

type Modifier = {
  min: number;
  max: number;
};

type AccessOption = {
  id: string;
  label: string;
  modifier: Modifier;
  timeModifier: Modifier;
  impact: string;
};

type ScopeOption = {
  id: string;
  label: string;
  modifier: Modifier;
  timeModifier: Modifier;
  impact: string;
};

type DiagnosisScenario = {
  id: string;
  label: string;
  title: string;
  symptom: string;
  checks: string[];
  likelyResult: string;
  scopeLabel: string;
  scopeOptions: ScopeOption[];
  baseRange: Modifier;
  baseTime: Modifier;
  factors: string[];
  initialMessage: string;
  urgent?: boolean;
  ctaLabel?: string;
};

type AreaAdjustment = {
  label: string;
  note: string;
  modifier: Modifier;
  timeModifier: Modifier;
};

type DiagnosisContent = {
  eyebrow: string;
  title: string;
  intro: string;
  problemListTitle: string;
  problemListIntro: string;
  cardTitle: string;
  cardBadge: string;
  accessLabel: string;
  sizeLabel: string;
  widthLabel: string;
  heightLabel: string;
  areaLabel: string;
  sizeHint: string;
  checksLabel: string;
  likelyLabel: string;
  timeLabel: string;
  budgetLabel: string;
  factorsLabel: string;
  noteLabel: string;
  estimatePrefix: string;
  warningNote: string;
  ctaLabel: string;
  drawerTitle: string;
  drawerCloseLabel: string;
  drawerFormTitle: string;
  drawerInfoLabel: string;
  drawerFormIntro: string;
  unknownSizeNote: string;
  largeAreaNote: string;
  accessOptions: AccessOption[];
  scenarios: DiagnosisScenario[];
};

const DEFAULT_WIDTH = 2;
const DEFAULT_HEIGHT = 0.8;
const MIN_AREA = 0.5;
const MAX_AREA = 30;

const CONTENT: Record<DiagnosisLocale, DiagnosisContent> = {
  de: {
    eyebrow: 'Reparatur-Diagnose',
    title: 'Defekt auswählen, Einschätzung und Budgetrahmen sehen',
    intro:
      'Die Karte verbindet sichtbare Symptome mit Zugang, grober Größe und Umfang. So entsteht eine erste Orientierung, bevor Fotos, Standort und Material geprüft werden.',
    problemListTitle: 'Was ist an der Werbeanlage sichtbar?',
    problemListIntro:
      'Wählen Sie das passendste Schadensbild. Die rechte Karte passt Orientierung, Zeit und Budgetrahmen automatisch an.',
    cardTitle: 'Diagnosekarte',
    cardBadge: 'Orientierung',
    accessLabel: 'Zugang / Montagehöhe',
    sizeLabel: 'Ungefähre Größe der Anlage',
    widthLabel: 'Breite, m',
    heightLabel: 'Höhe, m',
    areaLabel: 'Rechenfläche',
    sizeHint: 'Wenn die Größe unklar ist, reichen grobe Werte. Die finale Bewertung erfolgt nach Fotos und Standort.',
    checksLabel: 'Mögliche Prüfrichtung',
    likelyLabel: 'Wahrscheinlicher Servicepfad',
    timeLabel: 'Diagnose vor Ort',
    budgetLabel: 'Budgetrahmen',
    factorsLabel: 'Was den Rahmen beeinflusst',
    noteLabel: 'Hinweis',
    estimatePrefix: 'ca.',
    warningNote:
      'Unverbindliche Erstorientierung: Diese Diagnosekarte, Zeit- und Budgetangaben sind reine Informationswerte. Sie sind kein Vertrag, kein verbindliches Angebot und keine bindende Kostenzusage. Ein verbindliches Angebot entsteht erst nach Prüfung von Fotos, Adresse, Zugang und Material sowie nach ausdrücklicher Bestätigung durch PixelRing.',
    ctaLabel: 'Diagnose anfragen',
    drawerTitle: 'Diagnose anfragen',
    drawerCloseLabel: 'Schließen',
    drawerFormTitle: 'Diagnose & Reparatur anfragen',
    drawerInfoLabel: 'Einschätzung & Lösung',
    drawerFormIntro: 'Geben Sie Ihre Kontaktdaten an, um das Ticket für diesen Defekt direkt in unser System einzustellen.',
    unknownSizeNote: 'Unbekannte oder leere Werte werden mit 2,0 x 0,8 m eingeordnet.',
    largeAreaNote: 'Bei größeren Anlagen ist eine Prüfung vor Ort besonders wichtig.',
    accessOptions: [
      {
        id: 'low',
        label: 'Bis 3 m, Leiter erreichbar',
        modifier: { min: 0, max: 0 },
        timeModifier: { min: 0, max: 0 },
        impact: 'normaler Zugang mit Leiter',
      },
      {
        id: 'mid',
        label: '3-6 m, Bühne wahrscheinlich',
        modifier: { min: 90, max: 180 },
        timeModifier: { min: 20, max: 45 },
        impact: 'zusätzlicher Zugang oder Arbeitsbühne',
      },
      {
        id: 'high',
        label: 'Über 6 m oder schwer zugänglich',
        modifier: { min: 180, max: 360 },
        timeModifier: { min: 45, max: 90 },
        impact: 'erweiterte Zugangsklärung und Sicherheitsplanung',
      },
    ],
    scenarios: [
      {
        id: 'no-light',
        label: 'Werbeanlage leuchtet nicht',
        title: 'Die gesamte Anlage bleibt dunkel',
        symptom: 'Keine Beleuchtung oder nur unzuverlässiger Start beim Einschalten.',
        checks: ['Einspeisung und Sicherung', 'Netzteil / Trafo', 'Hauptleitung, Timer und Steuerung'],
        likelyResult: 'Elektrische Basisdiagnose vor der Entscheidung über Netzteil, Leitung oder Steuerung',
        scopeLabel: 'Umfang des Ausfalls',
        scopeOptions: [
          { id: 'single', label: 'ein Bereich', modifier: { min: 0, max: 80 }, timeModifier: { min: 0, max: 20 }, impact: 'ein klar abgrenzbarer Bereich' },
          { id: 'multiple', label: 'mehrere Bereiche', modifier: { min: 80, max: 180 }, timeModifier: { min: 20, max: 45 }, impact: 'mehrere Stromkreise oder Gruppen' },
          { id: 'full', label: 'gesamte Anlage', modifier: { min: 140, max: 260 }, timeModifier: { min: 30, max: 60 }, impact: 'komplette Anlage ohne Licht' },
        ],
        baseRange: { min: 240, max: 620 },
        baseTime: { min: 60, max: 150 },
        factors: ['Stromversorgung', 'Netzteil / Trafo', 'Steuerung', 'Feuchtigkeit'],
        initialMessage: 'Diagnose: Werbeanlage leuchtet nicht.',
      },
      {
        id: 'flicker',
        label: 'Flackern / instabiles Licht',
        title: 'Das Licht flackert oder fällt zeitweise aus',
        symptom: 'Die Anlage pulsiert, ist ungleichmäßig hell oder schaltet kurzzeitig ab.',
        checks: ['Spannungsabfall', 'Kontakte und Klemmen', 'Dimmer, Controller und Lastreserve'],
        likelyResult: 'Stabilisierung der Stromversorgung und Prüfung von Kontakten, Controller oder LED-Treibern',
        scopeLabel: 'Umfang des Flackerns',
        scopeOptions: [
          { id: 'single', label: 'eine Zone', modifier: { min: 0, max: 70 }, timeModifier: { min: 0, max: 15 }, impact: 'eine einzelne Zone betroffen' },
          { id: 'multiple', label: 'mehrere Zonen', modifier: { min: 70, max: 160 }, timeModifier: { min: 15, max: 40 }, impact: 'mehrere Zonen oder wechselnder Ausfall' },
          { id: 'full', label: 'fast überall', modifier: { min: 130, max: 240 }, timeModifier: { min: 30, max: 60 }, impact: 'breiter Ausfall im Beleuchtungssystem' },
        ],
        baseRange: { min: 240, max: 560 },
        baseTime: { min: 60, max: 120 },
        factors: ['Netzteilreserve', 'Kontaktstellen', 'Leitungslänge', 'Feuchtigkeit'],
        initialMessage: 'Diagnose: Werbeanlage flackert oder leuchtet instabil.',
      },
      {
        id: 'led-zone',
        label: 'Buchstabe / LED-Zone dunkel',
        title: 'Ein Buchstabe oder LED-Bereich leuchtet nicht',
        symptom: 'Einzelne Buchstaben, LED-Zonen oder Module bleiben dunkel.',
        checks: ['LED-Ketten und Polarität', 'Lokale Leitungen und Verbinder', 'Modul- oder Netzteilreserve'],
        likelyResult: 'Punktuelle Reparatur mit Modul-, Leitungs- oder Netzteiltausch',
        scopeLabel: 'Betroffene LED-Zonen',
        scopeOptions: [
          { id: 'single', label: 'eine Zone / ein Buchstabe', modifier: { min: 0, max: 70 }, timeModifier: { min: 0, max: 15 }, impact: 'ein lokaler LED-Bereich' },
          { id: 'multiple', label: 'mehrere Zonen', modifier: { min: 80, max: 180 }, timeModifier: { min: 20, max: 45 }, impact: 'mehrere LED-Zonen oder Buchstaben' },
          { id: 'large', label: 'großer Teil', modifier: { min: 150, max: 320 }, timeModifier: { min: 40, max: 75 }, impact: 'größerer LED- oder Modulumfang' },
        ],
        baseRange: { min: 220, max: 540 },
        baseTime: { min: 60, max: 120 },
        factors: ['Anzahl der Zonen', 'Modultyp', 'Farb- und Helligkeitsabgleich', 'Zugang zum Element'],
        initialMessage: 'Diagnose: Buchstabe oder LED-Zone leuchtet nicht.',
      },
      {
        id: 'rain-fail',
        label: 'Nach Regen / Sicherung fällt',
        title: 'Störung bei Regen oder Feuchtigkeit',
        symptom: 'Die Sicherung fällt, die Anlage schaltet ab oder startet erst nach Trocknung wieder.',
        checks: ['Isolation und Schutzabschaltung', 'Kabeldurchführungen und Dichtungen', 'Korrosion und Feuchtigkeit im Gehäuse'],
        likelyResult: 'Feuchtigkeitsdiagnose mit Sicherheitsprüfung vor jeder Materialentscheidung',
        scopeLabel: 'Verhalten bei Feuchtigkeit',
        scopeOptions: [
          { id: 'sometimes', label: 'nur gelegentlich', modifier: { min: 0, max: 100 }, timeModifier: { min: 0, max: 25 }, impact: 'sporadische Feuchtigkeitsstörung' },
          { id: 'breaker', label: 'Sicherung fällt', modifier: { min: 120, max: 260 }, timeModifier: { min: 30, max: 70 }, impact: 'Schutzabschaltung oder möglicher Fehlerstrom' },
          { id: 'visible-water', label: 'Wasser sichtbar', modifier: { min: 180, max: 360 }, timeModifier: { min: 45, max: 90 }, impact: 'sichtbare Feuchtigkeit oder Korrosion' },
        ],
        baseRange: { min: 320, max: 880 },
        baseTime: { min: 90, max: 210 },
        factors: ['Dichtungen', 'Kabeldurchführungen', 'Korrosion', 'Sicherheitsprüfung'],
        initialMessage: 'Diagnose: Ausfall nach Regen oder Feuchtigkeit.',
      },
      {
        id: 'film',
        label: 'Folie / Oberfläche',
        title: 'Folie oder Oberfläche ist beschädigt',
        symptom: 'Folie löst sich, ist verblasst, wirft Blasen oder Klebereste sind sichtbar.',
        checks: ['Untergrund und Klebereste', 'UV-Schäden und Materialzustand', 'Reinigung, Teilersatz oder Neuverklebung'],
        likelyResult: 'Oberflächenvorbereitung mit Teilreparatur oder Neuverklebung nach Materialprüfung',
        scopeLabel: 'Betroffene Fläche',
        scopeOptions: [
          { id: 'edge', label: 'Kante / Ecke', modifier: { min: 0, max: 60 }, timeModifier: { min: 0, max: 15 }, impact: 'lokaler Randbereich' },
          { id: 'section', label: 'ein Abschnitt', modifier: { min: 70, max: 170 }, timeModifier: { min: 20, max: 45 }, impact: 'sichtbarer Teilbereich' },
          { id: 'large', label: 'große Fläche', modifier: { min: 160, max: 360 }, timeModifier: { min: 45, max: 90 }, impact: 'größere Fläche oder Neuverklebung' },
        ],
        baseRange: { min: 180, max: 620 },
        baseTime: { min: 60, max: 150 },
        factors: ['Fläche', 'Untergrund', 'Klebereste', 'Material und UV-Belastung'],
        initialMessage: 'Diagnose: Folie oder Oberfläche beschädigt.',
      },
      {
        id: 'mounting',
        label: 'Befestigung / Sturm',
        title: 'Befestigung oder Gehäuse ist beschädigt',
        symptom: 'Die Anlage wackelt, Halterungen sind lose oder es gibt Schäden nach Wind, Sturm oder Anstoß.',
        checks: ['Befestigungspunkte', 'Fassade, Untergrund und Korrosion', 'Sicherung loser Teile'],
        likelyResult: 'Sicherung, mechanische Instandsetzung oder kontrollierter Rückbau vor dem eigentlichen Reparaturplan',
        scopeLabel: 'Mechanischer Zustand',
        scopeOptions: [
          { id: 'loose', label: 'leichter Spielraum', modifier: { min: 0, max: 90 }, timeModifier: { min: 0, max: 20 }, impact: 'leichte Lockerung' },
          { id: 'damaged', label: 'beschädigt', modifier: { min: 120, max: 260 }, timeModifier: { min: 30, max: 70 }, impact: 'sichtbare Beschädigung an Halterung oder Gehäuse' },
          { id: 'fall-risk', label: 'Absturzrisiko', modifier: { min: 220, max: 460 }, timeModifier: { min: 45, max: 120 }, impact: 'Sicherungs- oder Absperrbedarf' },
        ],
        baseRange: { min: 360, max: 980 },
        baseTime: { min: 90, max: 240 },
        factors: ['Befestigung', 'Untergrund', 'Korrosion', 'Sicherungsbedarf'],
        initialMessage: 'Diagnose: Befestigung oder mechanischer Schaden.',
      },
      {
        id: 'urgent',
        label: 'Sofort: Sicherheitsrisiko',
        title: 'Sicherheitsrisiko zuerst klären',
        symptom: 'Brandgeruch, Funken, offene Kabel, lose Teile oder Gefahr für Passanten.',
        checks: ['Gefahrenhinweis aus Abstand', 'Sichere Abschaltung', 'Sicherung, Absperrung oder Terminoptionen'],
        likelyResult: 'Priorität ist sicheres Abschalten, Fixieren oder Absperren; Reparaturumfang folgt erst nach der Gefahrenprüfung',
        scopeLabel: 'Akute Situation',
        scopeOptions: [
          { id: 'electrical', label: 'Geruch / Funken', modifier: { min: 180, max: 360 }, timeModifier: { min: 30, max: 90 }, impact: 'akuter elektrischer Hinweis' },
          { id: 'loose-parts', label: 'lose Teile', modifier: { min: 220, max: 420 }, timeModifier: { min: 45, max: 120 }, impact: 'mechanisches Risiko für Passanten' },
          { id: 'blocked-area', label: 'Eingang betroffen', modifier: { min: 260, max: 520 }, timeModifier: { min: 60, max: 150 }, impact: 'Nutzung oder Eingang betroffen' },
        ],
        baseRange: { min: 420, max: 1100 },
        baseTime: { min: 60, max: 180 },
        factors: ['Gefahrenlage', 'Zugang', 'Absperrung', 'Sofortsicherung'],
        initialMessage: 'Dringende Diagnose: mögliches Sicherheitsrisiko an der Werbeanlage.',
        urgent: true,
        ctaLabel: 'Dringenden Fall melden',
      },
    ],
  },
  ru: {
    eyebrow: 'Предварительная диагностика',
    title: 'Выберите проблему — мы покажем ориентир работ и бюджета',
    intro:
      'Диагностическая карта связывает видимую неисправность с доступом, примерным размером и объёмом дефекта. Это помогает понять порядок работ до точной оценки по фото, адресу и материалам.',
    problemListTitle: 'Что видно снаружи?',
    problemListIntro:
      'Выберите ближайший сценарий. Справа изменятся ориентиры, время диагностики и предварительный бюджет.',
    cardTitle: 'Диагностическая карта',
    cardBadge: 'Ориентир',
    accessLabel: 'Доступ / высота монтажа',
    sizeLabel: 'Примерный размер вывески',
    widthLabel: 'Ширина, м',
    heightLabel: 'Высота, м',
    areaLabel: 'Расчётная площадь',
    sizeHint: 'Если размер неизвестен, укажите примерно. Финальная оценка всё равно делается после фото и адреса.',
    checksLabel: 'Ориентиры оценки',
    likelyLabel: 'Вероятный сценарий работ',
    timeLabel: 'Диагностика на месте',
    budgetLabel: 'Ориентир бюджета',
    factorsLabel: 'Что влияет на цену',
    noteLabel: 'Важно',
    estimatePrefix: 'примерно',
    warningNote:
      'Предварительный ориентир: эта диагностическая карта, сроки и бюджет носят информационный характер. Они не являются договором, офертой или обязательным коммерческим предложением. Обязательное предложение и точная цена возможны только после проверки фото, адреса, доступа и материалов и отдельного подтверждения PixelRing.',
    ctaLabel: 'Запросить диагностику',
    drawerTitle: 'Запросить диагностику',
    drawerCloseLabel: 'Закрыть',
    drawerFormTitle: 'Запросить диагностику и ремонт',
    drawerInfoLabel: 'Оценка и следующий шаг',
    drawerFormIntro: 'Укажите контакты, чтобы передать заявку специалистам PixelRing с выбранными параметрами.',
    unknownSizeNote: 'Пустой или некорректный размер считаем как 2,0 x 0,8 м.',
    largeAreaNote: 'Для больших вывесок особенно важна проверка на месте.',
    accessOptions: [
      {
        id: 'low',
        label: 'До 3 м, доступно с лестницы',
        modifier: { min: 0, max: 0 },
        timeModifier: { min: 0, max: 0 },
        impact: 'обычный доступ с лестницы',
      },
      {
        id: 'mid',
        label: '3-6 м, вероятна рабочая платформа',
        modifier: { min: 90, max: 180 },
        timeModifier: { min: 20, max: 45 },
        impact: 'дополнительный доступ или рабочая платформа',
      },
      {
        id: 'high',
        label: 'Выше 6 м или сложный доступ',
        modifier: { min: 180, max: 360 },
        timeModifier: { min: 45, max: 90 },
        impact: 'отдельная проверка доступа и безопасности',
      },
    ],
    scenarios: [
      {
        id: 'no-light',
        label: 'Вывеска не светится',
        title: 'Вся вывеска остаётся тёмной',
        symptom: 'Нет подсветки или вывеска включается нестабильно.',
        checks: ['Питание и автомат', 'Блок питания / трансформатор', 'Главная линия, таймер и управление'],
        likelyResult: 'Электрическая диагностика до решения о замене блока питания, линии или управления',
        scopeLabel: 'Объём отказа',
        scopeOptions: [
          { id: 'single', label: 'один участок', modifier: { min: 0, max: 80 }, timeModifier: { min: 0, max: 20 }, impact: 'один понятный участок' },
          { id: 'multiple', label: 'несколько участков', modifier: { min: 80, max: 180 }, timeModifier: { min: 20, max: 45 }, impact: 'несколько групп или линий' },
          { id: 'full', label: 'вся вывеска', modifier: { min: 140, max: 260 }, timeModifier: { min: 30, max: 60 }, impact: 'полный отказ подсветки' },
        ],
        baseRange: { min: 240, max: 620 },
        baseTime: { min: 60, max: 150 },
        factors: ['питание', 'блок питания / трансформатор', 'управление', 'влага'],
        initialMessage: 'Диагностика: вывеска не светится.',
      },
      {
        id: 'flicker',
        label: 'Мерцает / нестабильный свет',
        title: 'Свет мерцает или периодически пропадает',
        symptom: 'Вывеска пульсирует, светит неравномерно или временами отключается.',
        checks: ['Падение напряжения', 'Контакты и клеммы', 'Диммер, контроллер и запас мощности'],
        likelyResult: 'Стабилизация питания и проверка контактов, контроллера или LED-драйверов',
        scopeLabel: 'Объём мерцания',
        scopeOptions: [
          { id: 'single', label: 'одна зона', modifier: { min: 0, max: 70 }, timeModifier: { min: 0, max: 15 }, impact: 'одна зона мерцания' },
          { id: 'multiple', label: 'несколько зон', modifier: { min: 70, max: 160 }, timeModifier: { min: 15, max: 40 }, impact: 'несколько зон или переменный отказ' },
          { id: 'full', label: 'почти вся вывеска', modifier: { min: 130, max: 240 }, timeModifier: { min: 30, max: 60 }, impact: 'широкая проблема в системе подсветки' },
        ],
        baseRange: { min: 240, max: 560 },
        baseTime: { min: 60, max: 120 },
        factors: ['запас блока питания', 'контакты', 'длина линии', 'влага'],
        initialMessage: 'Диагностика: вывеска мерцает или работает нестабильно.',
      },
      {
        id: 'led-zone',
        label: 'Не горит буква / LED-зона',
        title: 'Не светится буква или часть LED',
        symptom: 'Отдельные буквы, LED-зоны или модули остаются тёмными.',
        checks: ['LED-цепи и полярность', 'Локальные линии и соединители', 'Совместимость модулей или блока питания'],
        likelyResult: 'Точечный ремонт с заменой LED-модулей, линии или блока питания',
        scopeLabel: 'Затронутые LED-зоны',
        scopeOptions: [
          { id: 'single', label: 'одна зона / буква', modifier: { min: 0, max: 70 }, timeModifier: { min: 0, max: 15 }, impact: 'одна локальная LED-зона' },
          { id: 'multiple', label: 'несколько зон', modifier: { min: 80, max: 180 }, timeModifier: { min: 20, max: 45 }, impact: 'несколько LED-зон или букв' },
          { id: 'large', label: 'большая часть', modifier: { min: 150, max: 320 }, timeModifier: { min: 40, max: 75 }, impact: 'больший объём LED-модулей' },
        ],
        baseRange: { min: 220, max: 540 },
        baseTime: { min: 60, max: 120 },
        factors: ['количество зон', 'тип модулей', 'яркость и цвет', 'доступ к элементу'],
        initialMessage: 'Диагностика: не горит буква или LED-зона.',
      },
      {
        id: 'rain-fail',
        label: 'После дождя выбивает автомат',
        title: 'Проблема появляется при дожде или влажности',
        symptom: 'Выбивает автомат, вывеска отключается или включается только после высыхания.',
        checks: ['Изоляция и защитное отключение', 'Кабельные вводы и уплотнения', 'Коррозия и влага внутри корпуса'],
        likelyResult: 'Диагностика влаги с проверкой безопасности до любого решения о ремонте',
        scopeLabel: 'Поведение при влаге',
        scopeOptions: [
          { id: 'sometimes', label: 'иногда после дождя', modifier: { min: 0, max: 100 }, timeModifier: { min: 0, max: 25 }, impact: 'периодический сбой от влаги' },
          { id: 'breaker', label: 'выбивает автомат', modifier: { min: 120, max: 260 }, timeModifier: { min: 30, max: 70 }, impact: 'срабатывает защита или возможна утечка' },
          { id: 'visible-water', label: 'видна вода', modifier: { min: 180, max: 360 }, timeModifier: { min: 45, max: 90 }, impact: 'видимая влага или коррозия' },
        ],
        baseRange: { min: 320, max: 880 },
        baseTime: { min: 90, max: 210 },
        factors: ['уплотнения', 'кабельные вводы', 'коррозия', 'проверка безопасности'],
        initialMessage: 'Диагностика: сбой после дождя или влажности.',
      },
      {
        id: 'film',
        label: 'Плёнка / поверхность',
        title: 'Повреждена плёнка или поверхность',
        symptom: 'Плёнка отклеивается, выцвела, появились пузыри или следы клея.',
        checks: ['Основание и остатки клея', 'UV-выгорание и состояние материала', 'Чистка, частичная замена или новая оклейка'],
        likelyResult: 'Подготовка поверхности с частичным ремонтом или новой оклейкой после проверки материала',
        scopeLabel: 'Площадь дефекта',
        scopeOptions: [
          { id: 'edge', label: 'край / угол', modifier: { min: 0, max: 60 }, timeModifier: { min: 0, max: 15 }, impact: 'локальный край или угол' },
          { id: 'section', label: 'отдельный участок', modifier: { min: 70, max: 170 }, timeModifier: { min: 20, max: 45 }, impact: 'заметный участок поверхности' },
          { id: 'large', label: 'большая площадь', modifier: { min: 160, max: 360 }, timeModifier: { min: 45, max: 90 }, impact: 'большая площадь или новая оклейка' },
        ],
        baseRange: { min: 180, max: 620 },
        baseTime: { min: 60, max: 150 },
        factors: ['площадь', 'основание', 'остатки клея', 'материал и UV-нагрузка'],
        initialMessage: 'Диагностика: повреждена плёнка или поверхность.',
      },
      {
        id: 'mounting',
        label: 'Крепление / шторм',
        title: 'Повреждён корпус или крепление',
        symptom: 'Вывеска шатается, крепления ослабли или есть повреждения после ветра, шторма или удара.',
        checks: ['Точки крепления', 'Фасад, основание и коррозия', 'Фиксация опасных частей'],
        likelyResult: 'Безопасное закрепление, механический ремонт или контролируемый демонтаж до основного ремонта',
        scopeLabel: 'Механическое состояние',
        scopeOptions: [
          { id: 'loose', label: 'лёгкий люфт', modifier: { min: 0, max: 90 }, timeModifier: { min: 0, max: 20 }, impact: 'лёгкое ослабление крепления' },
          { id: 'damaged', label: 'повреждение', modifier: { min: 120, max: 260 }, timeModifier: { min: 30, max: 70 }, impact: 'видимое повреждение крепления или корпуса' },
          { id: 'fall-risk', label: 'риск падения', modifier: { min: 220, max: 460 }, timeModifier: { min: 45, max: 120 }, impact: 'нужна фиксация или ограничение зоны' },
        ],
        baseRange: { min: 360, max: 980 },
        baseTime: { min: 90, max: 240 },
        factors: ['крепления', 'основание', 'коррозия', 'потребность в фиксации'],
        initialMessage: 'Диагностика: крепление или механическое повреждение.',
      },
      {
        id: 'urgent',
        label: 'Срочно: опасность',
        title: 'Сначала нужно убрать риск безопасности',
        symptom: 'Запах гари, искры, открытые провода, болтающиеся части или опасность для прохожих.',
        checks: ['Признак риска с безопасного расстояния', 'Безопасное отключение питания', 'Фиксация, ограждение или срочный осмотр'],
        likelyResult: 'Приоритет — безопасное отключение, фиксация или ограждение; объём ремонта определяется после проверки риска',
        scopeLabel: 'Актуальная ситуация',
        scopeOptions: [
          { id: 'electrical', label: 'запах / искры', modifier: { min: 180, max: 360 }, timeModifier: { min: 30, max: 90 }, impact: 'признак электрической опасности' },
          { id: 'loose-parts', label: 'болтаются части', modifier: { min: 220, max: 420 }, timeModifier: { min: 45, max: 120 }, impact: 'механический риск для людей' },
          { id: 'blocked-area', label: 'затронут вход', modifier: { min: 260, max: 520 }, timeModifier: { min: 60, max: 150 }, impact: 'затронут вход или зона посетителей' },
        ],
        baseRange: { min: 420, max: 1100 },
        baseTime: { min: 60, max: 180 },
        factors: ['уровень опасности', 'доступ', 'ограждение', 'срочная фиксация'],
        initialMessage: 'Срочная диагностика: возможный риск безопасности у вывески.',
        urgent: true,
        ctaLabel: 'Сообщить срочный случай',
      },
    ],
  },
};

type LeistungenDigitalDiagnosisProps = {
  locale: string;
};

function parseDimension(value: string, fallback: number): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isValidDimension(value: string): boolean {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundToTen(value: number): number {
  return Math.round(value / 10) * 10;
}

function getAreaAdjustment(area: number, content: DiagnosisContent): AreaAdjustment {
  if (area <= 2) {
    return {
      label: '0.5-2 m²',
      note: content.sizeHint,
      modifier: { min: 0, max: 0 },
      timeModifier: { min: 0, max: 0 },
    };
  }

  if (area <= 6) {
    return {
      label: '2-6 m²',
      note: content.sizeHint,
      modifier: { min: 60, max: 140 },
      timeModifier: { min: 15, max: 35 },
    };
  }

  if (area <= 12) {
    return {
      label: '6-12 m²',
      note: content.largeAreaNote,
      modifier: { min: 140, max: 280 },
      timeModifier: { min: 35, max: 70 },
    };
  }

  return {
    label: '12-30 m²',
    note: content.largeAreaNote,
    modifier: { min: 260, max: 520 },
    timeModifier: { min: 60, max: 120 },
  };
}

function formatNumber(value: number, locale: DiagnosisLocale): string {
  return value.toLocaleString(locale === 'ru' ? 'ru-RU' : 'de-DE', {
    maximumFractionDigits: 1,
  });
}

function formatMinutes(value: number, locale: DiagnosisLocale): string {
  if (value < 60) {
    return locale === 'ru' ? `${value} мин` : `${value} Min.`;
  }

  const hours = value / 60;
  const formatted = hours.toLocaleString(locale === 'ru' ? 'ru-RU' : 'de-DE', {
    maximumFractionDigits: 1,
  });

  return locale === 'ru' ? `${formatted} ч` : `${formatted} Std.`;
}

function formatTimeRange(range: Modifier, locale: DiagnosisLocale): string {
  return locale === 'ru'
    ? `примерно ${formatMinutes(range.min, locale)}-${formatMinutes(range.max, locale)}`
    : `ca. ${formatMinutes(range.min, locale)}-${formatMinutes(range.max, locale)}`;
}

export default function LeistungenDigitalDiagnosis({ locale }: LeistungenDigitalDiagnosisProps) {
  const normalizedLocale: DiagnosisLocale = locale === 'ru' ? 'ru' : 'de';
  const content = CONTENT[normalizedLocale];
  const [scenarioId, setScenarioId] = useState(content.scenarios[0].id);
  const [accessId, setAccessId] = useState(content.accessOptions[0].id);
  const [scopeId, setScopeId] = useState(content.scenarios[0].scopeOptions[0].id);
  const [width, setWidth] = useState(DEFAULT_WIDTH.toFixed(1));
  const [height, setHeight] = useState(DEFAULT_HEIGHT.toFixed(1));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scenario = content.scenarios.find((item) => item.id === scenarioId) ?? content.scenarios[0];
  const access = content.accessOptions.find((item) => item.id === accessId) ?? content.accessOptions[0];
  const scope = scenario.scopeOptions.find((item) => item.id === scopeId) ?? scenario.scopeOptions[0];

  const widthValue = parseDimension(width, DEFAULT_WIDTH);
  const heightValue = parseDimension(height, DEFAULT_HEIGHT);
  const hasFallbackDimension = !isValidDimension(width) || !isValidDimension(height);
  const rawArea = widthValue * heightValue;
  const area = clamp(rawArea, MIN_AREA, MAX_AREA);
  const areaAdjustment = getAreaAdjustment(area, content);

  const estimate = {
    min: roundToTen(scenario.baseRange.min + access.modifier.min + scope.modifier.min + areaAdjustment.modifier.min),
    max: roundToTen(scenario.baseRange.max + access.modifier.max + scope.modifier.max + areaAdjustment.modifier.max),
  };

  const timeRange = {
    min: scenario.baseTime.min + access.timeModifier.min + scope.timeModifier.min + areaAdjustment.timeModifier.min,
    max: scenario.baseTime.max + access.timeModifier.max + scope.timeModifier.max + areaAdjustment.timeModifier.max,
  };

  const areaLabel = `${formatNumber(area, normalizedLocale)} m²`;
  const estimateLabel = `${content.estimatePrefix} ${estimate.min.toLocaleString(normalizedLocale === 'ru' ? 'ru-RU' : 'de-DE')}-${estimate.max.toLocaleString(normalizedLocale === 'ru' ? 'ru-RU' : 'de-DE')} EUR`;
  const timeLabel = formatTimeRange(timeRange, normalizedLocale);
  const hasClampedArea = rawArea > MAX_AREA || rawArea < MIN_AREA;
  const sizeNote = hasClampedArea
    ? content.largeAreaNote
    : hasFallbackDimension
      ? content.unknownSizeNote
      : content.sizeHint;

  const handleScenarioChange = (nextScenarioId: string) => {
    const nextScenario = content.scenarios.find((item) => item.id === nextScenarioId) ?? content.scenarios[0];
    setScenarioId(nextScenario.id);
    setScopeId(nextScenario.scopeOptions[0].id);
  };

  const drawerMessage = [
    scenario.initialMessage,
    `${content.accessLabel}: ${access.label}.`,
    `${content.sizeLabel}: ${formatNumber(widthValue, normalizedLocale)} x ${formatNumber(heightValue, normalizedLocale)} m (${areaLabel}).`,
    `${scenario.scopeLabel}: ${scope.label}.`,
    `${content.timeLabel}: ${timeLabel}.`,
    `${content.budgetLabel}: ${estimateLabel}.`,
    sizeNote,
    content.warningNote,
  ].join(' ');

  return (
    <>
      <section id="diagnose" className="border-t border-[#E7DDD3] bg-[#F8F5EF] py-12 sm:py-16">
        <div className="pr-site-container">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(320px,0.58fr)] lg:items-end">
            <div className="text-start">
              <SectionEyebrow className="mb-2">{content.eyebrow}</SectionEyebrow>
              <h2 className="max-w-3xl text-[30px] font-extrabold leading-[1.08] tracking-[0] text-[#0E1A2B] sm:text-[42px] lg:text-[48px]">
                {content.title}
              </h2>
            </div>
            <p className="max-w-xl text-[15px] font-medium leading-[1.6] text-[#334155] lg:text-[16px]">
              {content.intro}
            </p>
          </div>

          <div className="mt-7 overflow-hidden rounded-[16px] border border-[#DED0C4] bg-white shadow-[0_18px_45px_rgba(13,27,42,0.08)]">
            <div className="grid lg:grid-cols-[0.74fr_1.26fr] lg:items-stretch">
              <div className="border-b border-[#E5D8CC] bg-[#FBF8F3] p-4 sm:p-5 lg:border-b-0 lg:border-e">
                <h3 className="text-[19px] font-extrabold leading-tight text-[#0E1A2B]">
                  {content.problemListTitle}
                </h3>
                <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#5B6878]">
                  {content.problemListIntro}
                </p>

                <div className="mt-4 grid gap-2">
                  {content.scenarios.map((item) => {
                    const isActive = item.id === scenario.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => handleScenarioChange(item.id)}
                        className={`group flex min-h-[52px] items-start gap-2.5 rounded-[12px] border px-3 py-2 text-start transition ${
                          isActive
                            ? 'border-[#A65F45] bg-[#A65F45] text-white shadow-[0_10px_22px_rgba(166,95,69,0.18)]'
                            : 'border-[#E8DED3] bg-white text-[#0D1B2A] hover:border-[#B8643E]/45 hover:bg-[#FFF8F1]'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                            isActive ? 'bg-white/18 text-white' : 'bg-[#B8643E]/10 text-[#B8643E]'
                          }`}
                        >
                          {content.scenarios.indexOf(item) + 1}
                        </span>
                        <span>
                          <span className="block text-[14px] font-black leading-snug">{item.label}</span>
                          <span className={`mt-0.5 block text-[12px] font-semibold leading-4 ${isActive ? 'text-white/76' : 'text-[#5B6878]'}`}>
                            {item.title}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E9DED4] pb-4">
                  <div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] ${
                      scenario.urgent
                        ? 'border-[#B8643E]/30 bg-[#B8643E]/10 text-[#B8643E]'
                        : 'border-[#D9C7BA] bg-[#FBF8F3] text-[#B8643E]'
                    }`}>
                      {content.cardBadge}
                    </span>
                    <h3 className="mt-2 text-[25px] font-black leading-tight text-[#0E1A2B] sm:text-[29px]">
                      {content.cardTitle}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-[13px] font-medium leading-5 text-[#5B6878]">
                      {scenario.symptom}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  <div>
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                      {content.accessLabel}
                    </span>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {content.accessOptions.map((option) => {
                        const isActive = option.id === access.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setAccessId(option.id)}
                            className={`min-h-[46px] rounded-[10px] border px-3 py-2 text-start text-[12px] font-extrabold leading-4 transition ${
                              isActive
                                ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white'
                                : 'border-[#E8DED3] bg-[#FFFDF9] text-[#0D1B2A] hover:border-[#B8643E]/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                <div>
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                    {content.sizeLabel}
                  </span>
                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr_minmax(150px,0.75fr)]">
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-bold text-[#526174]">{content.widthLabel}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.1"
                        value={width}
                        onChange={(event) => setWidth(event.target.value)}
                        className="min-h-[44px] w-full rounded-[10px] border border-[#E8DED3] bg-[#FFFDF9] px-3 text-[15px] font-bold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-bold text-[#526174]">{content.heightLabel}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.1"
                        value={height}
                        onChange={(event) => setHeight(event.target.value)}
                        className="min-h-[44px] w-full rounded-[10px] border border-[#E8DED3] bg-[#FFFDF9] px-3 text-[15px] font-bold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                      />
                    </label>
                    <div className="rounded-[10px] border border-[#E8DED3] bg-[#FBF8F3] px-3 py-2.5">
                      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#6F7A8A]">
                        {content.areaLabel}
                      </span>
                      <strong className="mt-0.5 block text-[17px] font-black text-[#0E1A2B]">{areaLabel}</strong>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#6F7A8A]">
                    {sizeNote}
                  </p>
                </div>

                <div>
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                    {scenario.scopeLabel}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {scenario.scopeOptions.map((option) => {
                      const isActive = option.id === scope.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setScopeId(option.id)}
                          className={`min-h-[46px] rounded-[10px] border px-3 py-2 text-start text-[12px] font-extrabold leading-4 transition ${
                            isActive
                              ? 'border-[#A65F45] bg-[#A65F45] text-white'
                              : 'border-[#E8DED3] bg-[#FFFDF9] text-[#0D1B2A] hover:border-[#B8643E]/50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[12px] border border-[#0D1B2A] bg-[#0D1B2A] p-4 text-white">
                    <span className="block text-[10px] font-black uppercase tracking-[0.13em] text-white/60">
                      {content.budgetLabel}
                    </span>
                    <strong className="mt-2 block text-[25px] font-black leading-none sm:text-[30px]">
                      {estimateLabel}
                    </strong>
                  </div>
                  <div className="rounded-[12px] border border-[#E8DED3] bg-[#FBF8F3] p-4">
                    <span className="block text-[10px] font-black uppercase tracking-[0.13em] text-[#6F7A8A]">
                      {content.timeLabel}
                    </span>
                    <strong className="mt-2 block text-[20px] font-black leading-tight text-[#0E1A2B]">
                      {timeLabel}
                    </strong>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#E0D1C4] bg-[#FBF8F3] p-3.5">
                  <span className="block text-[10px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                    {content.noteLabel}
                  </span>
                  <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#5B6878]">
                    {content.warningNote}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 py-3 text-[14px] font-black text-white shadow-[0_12px_26px_rgba(184,100,62,0.22)] transition-all duration-300 active:scale-[0.98] ${
                    scenario.urgent ? 'bg-[#0D1B2A] hover:bg-[#17283B]' : 'bg-[#B8643E] hover:bg-[#A65835]'
                  }`}
                >
                  {scenario.ctaLabel ?? content.ctaLabel}
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeistungenProblemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={content.drawerTitle}
        reassuringText={`${scenario.likelyResult}. ${content.timeLabel}: ${timeLabel}. ${content.budgetLabel}: ${estimateLabel}.`}
        initialMessage={drawerMessage}
        initialIssueType="Repair"
        closeLabel={content.drawerCloseLabel}
        formTitle={content.drawerFormTitle}
        reassuringLabel={content.drawerInfoLabel}
        formIntro={content.drawerFormIntro}
      />
    </>
  );
}
