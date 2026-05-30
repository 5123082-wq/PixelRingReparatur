'use client';

import { useState } from 'react';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenProblemDrawer from './LeistungenProblemDrawer';

type Locale = 'de' | 'ru';

type Modifier = {
  min: number;
  max: number;
};

type SelectOption = {
  id: string;
  label: string;
  subtitle: string;
  modifier: Modifier;
  impact: string;
};

type ScopeOption = {
  id: string;
  label: string;
  modifier: Modifier;
  impact: string;
};

type Scenario = {
  id: string;
  label: string;
  title: string;
  symptom: string;
  repair: string;
  scopeLabel: string;
  scopes: ScopeOption[];
  baseRange: Modifier;
  photos: string[];
};

type Content = {
  eyebrow: string;
  title: string;
  intro: string;
  panelTitle: string;
  panelIntro: string;
  entityLabel: string;
  reasonLabel: string;
  locationLabel: string;
  cardBadge: string;
  cardTitle: string;
  accessLabel: string;
  sizeLabel: string;
  widthLabel: string;
  heightLabel: string;
  areaLabel: string;
  sizeHint: string;
  urgencyLabel: string;
  budgetLabel: string;
  urgentBudgetLabel: string;
  repairLabel: string;
  confidenceLabel: string;
  confidenceLow: string;
  confidenceMedium: string;
  photoLabel: string;
  noteLabel: string;
  disclaimer: string;
  ctaLabel: string;
  urgentCtaLabel: string;
  drawerTitle: string;
  drawerFormTitle: string;
  drawerInfoLabel: string;
  drawerFormIntro: string;
  closeLabel: string;
  estimatePrefix: string;
  customLocationPlaceholder: string;
  basePhotos: string[];
  accessOptions: SelectOption[];
  constructions: SelectOption[];
  locations: SelectOption[];
  urgencyOptions: SelectOption[];
};

type LeistungenDiagnosticPrototypeProps = {
  locale: string;
};

const DEFAULT_WIDTH = 2;
const DEFAULT_HEIGHT = 0.8;

const SCENARIOS: Record<Locale, Scenario[]> = {
  de: [
    {
      id: 'no-light',
      label: 'Werbeanlage leuchtet nicht',
      title: 'Die gesamte Anlage bleibt dunkel',
      symptom: 'Keine Beleuchtung oder nur instabiler Start.',
      repair: 'Moeglicher Pfad haengt von Zugang und Material ab: lokale Diagnose, Netzteil, Leitung oder Steuerung.',
      scopeLabel: 'Umfang des Ausfalls',
      scopes: [
        { id: 'single', label: 'ein Bereich', modifier: { min: 0, max: 80 }, impact: 'ein Bereich' },
        { id: 'multiple', label: 'mehrere Bereiche', modifier: { min: 80, max: 180 }, impact: 'mehrere Bereiche' },
        { id: 'full', label: 'gesamte Anlage', modifier: { min: 140, max: 260 }, impact: 'gesamte Anlage' },
      ],
      baseRange: { min: 240, max: 620 },
      photos: [],
    },
    {
      id: 'flicker',
      label: 'Flackern / instabiles Licht',
      title: 'Das Licht flackert oder faellt zeitweise aus',
      symptom: 'Die Anlage pulsiert, ist ungleich hell oder schaltet kurz ab.',
      repair: 'Moeglich sind Stabilisierung der Versorgung, Kontaktarbeit oder Treibertausch nach Pruefung.',
      scopeLabel: 'Umfang des Flackerns',
      scopes: [
        { id: 'single', label: 'eine Zone', modifier: { min: 0, max: 70 }, impact: 'eine Zone' },
        { id: 'multiple', label: 'mehrere Zonen', modifier: { min: 70, max: 160 }, impact: 'mehrere Zonen' },
        { id: 'full', label: 'fast ueberall', modifier: { min: 130, max: 240 }, impact: 'breiter Ausfall' },
      ],
      baseRange: { min: 240, max: 560 },
      photos: ['Kurzes Video vom Flackern'],
    },
    {
      id: 'rain-fail',
      label: 'Nach Regen / Sicherung faellt',
      title: 'Stoerung bei Regen oder Feuchtigkeit',
      symptom: 'Sicherung oder FI/RCD loest aus, die Anlage startet erst nach Trocknung.',
      repair: 'Zuerst Außenansicht und Zugang klaeren; Reparatur haengt von Feuchteursache und Materialzustand ab.',
      scopeLabel: 'Verhalten bei Feuchtigkeit',
      scopes: [
        { id: 'sometimes', label: 'nur gelegentlich', modifier: { min: 0, max: 100 }, impact: 'sporadisch' },
        { id: 'breaker', label: 'Sicherung faellt', modifier: { min: 120, max: 260 }, impact: 'Schutz schaltet' },
        { id: 'visible-water', label: 'Wasser sichtbar', modifier: { min: 180, max: 360 }, impact: 'sichtbare Feuchte' },
      ],
      baseRange: { min: 320, max: 880 },
      photos: ['Gehaeuse, Fugen und Kabeleinfuehrung von außen'],
    },
    {
      id: 'film',
      label: 'Folie / Oberflaeche',
      title: 'Folie oder Oberflaeche ist beschaedigt',
      symptom: 'Folie loest sich, ist verblasst, wirft Blasen oder Klebereste sind sichtbar.',
      repair: 'Moeglich sind lokale Korrektur, Teilersatz oder Neuverklebung nach Materialpruefung.',
      scopeLabel: 'Betroffene Flaeche',
      scopes: [
        { id: 'edge', label: 'Kante / Ecke', modifier: { min: 0, max: 60 }, impact: 'Kante' },
        { id: 'section', label: 'ein Abschnitt', modifier: { min: 70, max: 170 }, impact: 'Abschnitt' },
        { id: 'large', label: 'große Flaeche', modifier: { min: 160, max: 360 }, impact: 'große Flaeche' },
      ],
      baseRange: { min: 180, max: 620 },
      photos: ['Nahaufnahme von Kante, Blasen oder Verblassung'],
    },
    {
      id: 'mounting',
      label: 'Befestigung / Sturm',
      title: 'Befestigung oder Gehaeuse ist beschaedigt',
      symptom: 'Die Anlage wackelt, Halterungen sind lose oder nach Wind, Sturm oder Anstoß beschaedigt.',
      repair: 'Zuerst Zustand und Zugang klaeren; Reparaturplan erst nach Ansicht und Materialpruefung.',
      scopeLabel: 'Mechanischer Zustand',
      scopes: [
        { id: 'loose', label: 'leichter Spielraum', modifier: { min: 0, max: 90 }, impact: 'leichte Lockerung' },
        { id: 'damaged', label: 'beschaedigt', modifier: { min: 120, max: 260 }, impact: 'sichtbarer Schaden' },
        { id: 'fall-risk', label: 'Absturzrisiko', modifier: { min: 220, max: 460 }, impact: 'hoher Sicherungsbedarf' },
      ],
      baseRange: { min: 360, max: 980 },
      photos: ['Foto aus sicherem Abstand'],
    },
    {
      id: 'led-zone',
      label: 'Buchstabe / LED-Zone dunkel',
      title: 'Ein Buchstabe oder LED-Bereich leuchtet nicht',
      symptom: 'Einzelne Buchstaben, LED-Zonen oder Module bleiben dunkel.',
      repair: 'Punktuelle Reparatur ist moeglich, Umfang haengt von Modultyp und Zugang ab.',
      scopeLabel: 'Betroffene LED-Zonen',
      scopes: [
        { id: 'single', label: 'eine Zone / Buchstabe', modifier: { min: 0, max: 70 }, impact: 'eine Zone' },
        { id: 'multiple', label: 'mehrere Zonen', modifier: { min: 80, max: 180 }, impact: 'mehrere Zonen' },
        { id: 'large', label: 'großer Teil', modifier: { min: 150, max: 320 }, impact: 'großer Umfang' },
      ],
      baseRange: { min: 220, max: 540 },
      photos: ['Gesamtansicht plus betroffener Buchstabe oder Bereich'],
    },
  ],
  ru: [
    {
      id: 'no-light',
      label: 'Вывеска не светится',
      title: 'Вся вывеска остается темной',
      symptom: 'Нет подсветки или вывеска включается нестабильно.',
      repair: 'Вероятный сценарий зависит от доступа и материала: локальная диагностика, замена блока питания, линии или управления.',
      scopeLabel: 'Объем отказа',
      scopes: [
        { id: 'single', label: 'один участок', modifier: { min: 0, max: 80 }, impact: 'один участок' },
        { id: 'multiple', label: 'несколько участков', modifier: { min: 80, max: 180 }, impact: 'несколько участков' },
        { id: 'full', label: 'вся вывеска', modifier: { min: 140, max: 260 }, impact: 'вся вывеска' },
      ],
      baseRange: { min: 240, max: 620 },
      photos: [],
    },
    {
      id: 'flicker',
      label: 'Мерцает / нестабильный свет',
      title: 'Свет мерцает или периодически пропадает',
      symptom: 'Вывеска пульсирует, светит неравномерно или временами отключается.',
      repair: 'Возможна стабилизация питания, контактная работа или замена драйвера после проверки.',
      scopeLabel: 'Объем мерцания',
      scopes: [
        { id: 'single', label: 'одна зона', modifier: { min: 0, max: 70 }, impact: 'одна зона' },
        { id: 'multiple', label: 'несколько зон', modifier: { min: 70, max: 160 }, impact: 'несколько зон' },
        { id: 'full', label: 'почти вся вывеска', modifier: { min: 130, max: 240 }, impact: 'широкий сбой' },
      ],
      baseRange: { min: 240, max: 560 },
      photos: ['Короткое видео мерцания'],
    },
    {
      id: 'rain-fail',
      label: 'После дождя выбивает автомат',
      title: 'Проблема появляется при дожде или влажности',
      symptom: 'Выбивает автомат, вывеска отключается или включается только после высыхания.',
      repair: 'Сначала внешний осмотр и доступ; ремонтный сценарий зависит от причины влаги и состояния материалов.',
      scopeLabel: 'Поведение при влаге',
      scopes: [
        { id: 'sometimes', label: 'иногда после дождя', modifier: { min: 0, max: 100 }, impact: 'периодически' },
        { id: 'breaker', label: 'выбивает автомат', modifier: { min: 120, max: 260 }, impact: 'срабатывает защита' },
        { id: 'visible-water', label: 'видна вода', modifier: { min: 180, max: 360 }, impact: 'видимая влага' },
      ],
      baseRange: { min: 320, max: 880 },
      photos: ['Фото корпуса, стыков и кабельного ввода снаружи'],
    },
    {
      id: 'film',
      label: 'Пленка / поверхность',
      title: 'Повреждена пленка или поверхность',
      symptom: 'Пленка отклеивается, выцвела, появились пузыри или следы клея.',
      repair: 'Возможна локальная корректировка, частичная замена или новая оклейка после оценки материала.',
      scopeLabel: 'Площадь дефекта',
      scopes: [
        { id: 'edge', label: 'край / угол', modifier: { min: 0, max: 60 }, impact: 'край' },
        { id: 'section', label: 'отдельный участок', modifier: { min: 70, max: 170 }, impact: 'участок' },
        { id: 'large', label: 'большая площадь', modifier: { min: 160, max: 360 }, impact: 'большая площадь' },
      ],
      baseRange: { min: 180, max: 620 },
      photos: ['Крупный план края, пузырей или выцветания'],
    },
    {
      id: 'mounting',
      label: 'Крепление / шторм',
      title: 'Поврежден корпус или крепление',
      symptom: 'Вывеска шатается, крепления ослабли или есть повреждения после ветра, шторма или удара.',
      repair: 'Сначала нужно уточнить состояние и доступ; ремонтный план зависит от осмотра и материалов.',
      scopeLabel: 'Механическое состояние',
      scopes: [
        { id: 'loose', label: 'легкий люфт', modifier: { min: 0, max: 90 }, impact: 'легкое ослабление' },
        { id: 'damaged', label: 'повреждение', modifier: { min: 120, max: 260 }, impact: 'видимое повреждение' },
        { id: 'fall-risk', label: 'риск падения', modifier: { min: 220, max: 460 }, impact: 'высокая срочность фиксации' },
      ],
      baseRange: { min: 360, max: 980 },
      photos: ['Фото с безопасного расстояния'],
    },
    {
      id: 'led-zone',
      label: 'Не горит буква / LED-зона',
      title: 'Не светится буква или часть LED',
      symptom: 'Отдельные буквы, LED-зоны или модули остаются темными.',
      repair: 'Возможен точечный ремонт зоны, но объем зависит от типа модулей и доступа.',
      scopeLabel: 'Затронутые LED-зоны',
      scopes: [
        { id: 'single', label: 'одна зона / буква', modifier: { min: 0, max: 70 }, impact: 'одна зона' },
        { id: 'multiple', label: 'несколько зон', modifier: { min: 80, max: 180 }, impact: 'несколько зон' },
        { id: 'large', label: 'большая часть', modifier: { min: 150, max: 320 }, impact: 'большой объем' },
      ],
      baseRange: { min: 220, max: 540 },
      photos: ['Общий вид плюс отдельная буква или зона'],
    },
  ],
};

const CONTENT: Record<Locale, Content> = {
  de: {
    eyebrow: 'Reparatur-Diagnose',
    title: 'Anlagenart und Einsatzbedingungen klären',
    intro:
      'Klären Sie Anlagenart, typischen Defekt und Servicegebiet in kompakten Auswahlfeldern. So kann PixelRing den nächsten Schritt besser vorbereiten.',
    panelTitle: 'Welche Anlage ist betroffen?',
    panelIntro: 'Waehlen Sie die Objektart, danach den typischen Defekt. Das Servicegebiet kann getippt oder aus Beispielen gewaehlt werden.',
    entityLabel: 'Anlagenart',
    reasonLabel: 'Typischer Defekt / Symptom',
    locationLabel: 'Servicegebiet',
    cardBadge: 'Klärung',
    cardTitle: 'Orientierung zu Einsatz und Reparatur',
    accessLabel: 'Zugang / Montagehoehe',
    sizeLabel: 'Ungefaehre Groesse der Anlage',
    widthLabel: 'Breite, m',
    heightLabel: 'Hoehe, m',
    areaLabel: 'Rechenflaeche',
    sizeHint: 'Wenn die Groesse unklar ist, reichen grobe Werte. Die Einschaetzung bleibt unverbindlich.',
    urgencyLabel: 'Einsatzart',
    budgetLabel: 'Budgetrahmen',
    urgentBudgetLabel: 'Orientierung fuer dringenden Einsatz',
    repairLabel: 'Moegliche Reparaturorientierung',
    confidenceLabel: 'Arbeitsfaehige Orientierung',
    confidenceLow: 'Sehr grobe Orientierung',
    confidenceMedium: 'Arbeitsfaehige Orientierung',
    photoLabel: 'Welche Fotos helfen',
    noteLabel: 'Hinweis',
    disclaimer: 'Kein verbindliches Angebot. Die genaue Einschätzung entsteht erst nach Fotos, Adresse, Zugang und Materialprüfung.',
    ctaLabel: 'Diagnose anfragen',
    urgentCtaLabel: 'Dringenden Einsatz anfragen',
    drawerTitle: 'Diagnose anfragen',
    drawerFormTitle: 'Diagnose & Reparatur anfragen',
    drawerInfoLabel: 'Einschaetzung & naechster Schritt',
    drawerFormIntro: 'Geben Sie Ihre Kontaktdaten an, um die Anfrage mit diesen Angaben vorzubereiten.',
    closeLabel: 'Schließen',
    estimatePrefix: 'ca.',
    customLocationPlaceholder: 'Ort oder PLZ, z. B. Berlin',
    basePhotos: ['Gesamtansicht von Anlage und Fassade', 'Nahaufnahme des betroffenen Bereichs', 'Foto mit Hoehe und Zugang'],
    accessOptions: [
      { id: 'low', label: 'Bis 3 m, Leiter erreichbar', subtitle: 'normaler Zugang', modifier: { min: 0, max: 0 }, impact: 'normaler Zugang' },
      { id: 'mid', label: '3-6 m, Buehne wahrscheinlich', subtitle: 'Zugang klaeren', modifier: { min: 90, max: 180 }, impact: 'Arbeitsbuehne wahrscheinlich' },
      { id: 'high', label: 'Ueber 6 m oder schwer erreichbar', subtitle: 'erweiterte Planung', modifier: { min: 180, max: 360 }, impact: 'schwerer Zugang' },
    ],
    constructions: [
      { id: 'facade', label: 'Fassadenwerbeanlage', subtitle: 'Werbeanlage an der Gebaeudefassade', modifier: { min: 40, max: 140 }, impact: 'Fassadenwerbeanlage' },
      { id: 'lightbox', label: 'Leuchtkasten / Leuchttransparent', subtitle: 'Kasten mit beleuchteter Front', modifier: { min: 30, max: 110 }, impact: 'Leuchtkasten' },
      { id: 'letters', label: 'LED-Leuchtbuchstaben', subtitle: 'Einzelbuchstaben oder Schriftzug', modifier: { min: 60, max: 180 }, impact: 'LED-Leuchtbuchstaben' },
      { id: 'pylon', label: 'Pylon / Ausstecker', subtitle: 'freistehend oder auskragend', modifier: { min: 120, max: 280 }, impact: 'Pylon / Ausstecker' },
      { id: 'lightpanel', label: 'Acrylglas-Leuchtpanel', subtitle: 'flaches Leuchtpanel', modifier: { min: 80, max: 220 }, impact: 'Acrylglas-Leuchtpanel' },
      { id: 'film', label: 'Folie / Oberflaeche', subtitle: 'Folie, Druck oder Sichtflaeche', modifier: { min: 0, max: 80 }, impact: 'Folie / Oberflaeche' },
      { id: 'neon', label: 'Klassisches Neon', subtitle: 'Glasroehren und Hochspannung', modifier: { min: 180, max: 420 }, impact: 'klassisches Neon' },
      { id: 'display', label: 'Digitales LED-Display', subtitle: 'Display, Lauftext oder LED-Screen', modifier: { min: 220, max: 520 }, impact: 'digitales LED-Display' },
      { id: 'unknown', label: 'Nicht sicher', subtitle: 'Objektart noch unklar', modifier: { min: 80, max: 220 }, impact: 'Bauart nicht sicher' },
    ],
    locations: [
      { id: 'berlin', label: 'Berlin - Stadtgebiet', subtitle: 'Berlin', modifier: { min: 0, max: 0 }, impact: 'Berlin Stadtgebiet' },
      { id: 'berlin-umland', label: 'Berliner Umland', subtitle: 'Randgebiet um Berlin', modifier: { min: 40, max: 120 }, impact: 'Berliner Umland' },
      { id: 'potsdam', label: 'Potsdam', subtitle: 'Landeshauptstadt Brandenburg', modifier: { min: 70, max: 160 }, impact: 'Potsdam' },
      { id: 'brandenburg-havel', label: 'Brandenburg an der Havel', subtitle: 'Brandenburg', modifier: { min: 120, max: 280 }, impact: 'Brandenburg an der Havel' },
      { id: 'cottbus', label: 'Cottbus', subtitle: 'Brandenburg', modifier: { min: 180, max: 360 }, impact: 'Cottbus' },
      { id: 'frankfurt-oder', label: 'Frankfurt (Oder)', subtitle: 'Brandenburg', modifier: { min: 160, max: 320 }, impact: 'Frankfurt (Oder)' },
      { id: 'oranienburg', label: 'Oranienburg', subtitle: 'Berliner Umland', modifier: { min: 80, max: 190 }, impact: 'Oranienburg' },
      { id: 'bernau', label: 'Bernau bei Berlin', subtitle: 'Berliner Umland', modifier: { min: 80, max: 190 }, impact: 'Bernau bei Berlin' },
      { id: 'falkensee', label: 'Falkensee', subtitle: 'Berliner Umland', modifier: { min: 80, max: 190 }, impact: 'Falkensee' },
      { id: 'koenigs-wusterhausen', label: 'Königs Wusterhausen', subtitle: 'Berliner Umland', modifier: { min: 90, max: 210 }, impact: 'Königs Wusterhausen' },
      { id: 'ludwigsfelde', label: 'Ludwigsfelde', subtitle: 'Berliner Umland', modifier: { min: 90, max: 210 }, impact: 'Ludwigsfelde' },
      { id: 'brandenburg', label: 'Land Brandenburg allgemein', subtitle: 'Ort wird manuell angegeben', modifier: { min: 90, max: 240 }, impact: 'Land Brandenburg' },
      { id: 'outside', label: 'Außerhalb Kerngebiet - auf Anfrage', subtitle: 'manuelle Klaerung', modifier: { min: 180, max: 420 }, impact: 'außerhalb Kerngebiet' },
    ],
    urgencyOptions: [
      { id: 'planned', label: 'Geplanter Einsatz', subtitle: 'normal einplanen', modifier: { min: 0, max: 0 }, impact: 'geplanter Einsatz' },
      { id: 'urgent', label: 'Dringender Einsatz', subtitle: 'schneller Rueckruf / Termin', modifier: { min: 160, max: 380 }, impact: 'dringender Einsatz' },
    ],
  },
  ru: {
    eyebrow: 'Предварительная диагностика',
    title: 'Уточните тип конструкции и условия выезда',
    intro:
      'Выберите тип конструкции, типовую причину и зону обслуживания. Это помогает PixelRing подготовить следующий шаг перед точной оценкой.',
    panelTitle: 'Какая конструкция затронута?',
    panelIntro: 'Выберите тип объекта, затем типовую причину. Город или индекс можно ввести вручную либо выбрать из примеров.',
    entityLabel: 'Тип конструкции',
    reasonLabel: 'Типовая причина / симптом',
    locationLabel: 'Зона обслуживания',
    cardBadge: 'Уточнение',
    cardTitle: 'Ориентир по выезду и ремонту',
    accessLabel: 'Доступ / высота монтажа',
    sizeLabel: 'Примерный размер вывески',
    widthLabel: 'Ширина, м',
    heightLabel: 'Высота, м',
    areaLabel: 'Расчетная площадь',
    sizeHint: 'Если размер неизвестен, укажите примерно. Оценка остается предварительной.',
    urgencyLabel: 'Срочность выезда',
    budgetLabel: 'Ориентир бюджета',
    urgentBudgetLabel: 'Ориентир срочного выезда',
    repairLabel: 'Возможный ремонтный ориентир',
    confidenceLabel: 'Рабочий ориентир',
    confidenceLow: 'Оценка пока грубая',
    confidenceMedium: 'Рабочий ориентир',
    photoLabel: 'Какие фото помогут',
    noteLabel: 'Важно',
    disclaimer: 'Это не финальное предложение. Точная оценка после фото, адреса, доступа и проверки материалов.',
    ctaLabel: 'Запросить диагностику',
    urgentCtaLabel: 'Запросить срочный выезд',
    drawerTitle: 'Запросить диагностику',
    drawerFormTitle: 'Запросить диагностику и ремонт',
    drawerInfoLabel: 'Оценка и следующий шаг',
    drawerFormIntro: 'Укажите контакты, чтобы передать заявку специалистам PixelRing с выбранными параметрами.',
    closeLabel: 'Закрыть',
    estimatePrefix: 'примерно',
    customLocationPlaceholder: 'Город или PLZ, например Berlin',
    basePhotos: ['Общий вид вывески и фасада', 'Крупный план проблемного места', 'Фото, где видна высота и доступ'],
    accessOptions: [
      { id: 'low', label: 'До 3 м, доступно с лестницы', subtitle: 'обычный доступ', modifier: { min: 0, max: 0 }, impact: 'обычный доступ' },
      { id: 'mid', label: '3-6 м, вероятна платформа', subtitle: 'нужно уточнить доступ', modifier: { min: 90, max: 180 }, impact: 'вероятна платформа' },
      { id: 'high', label: 'Выше 6 м или сложный доступ', subtitle: 'нужна отдельная проверка', modifier: { min: 180, max: 360 }, impact: 'сложный доступ' },
    ],
    constructions: [
      { id: 'facade', label: 'Фасадная вывеска', subtitle: 'вывеска на фасаде здания', modifier: { min: 40, max: 140 }, impact: 'фасадная вывеска' },
      { id: 'lightbox', label: 'Световой короб', subtitle: 'короб с подсветкой и лицевой панелью', modifier: { min: 30, max: 110 }, impact: 'световой короб' },
      { id: 'letters', label: 'Световые LED-буквы', subtitle: 'объемные или плоские световые буквы', modifier: { min: 60, max: 180 }, impact: 'световые LED-буквы' },
      { id: 'pylon', label: 'Пилон / консольная вывеска', subtitle: 'отдельностоящая или выступающая конструкция', modifier: { min: 120, max: 280 }, impact: 'пилон / консоль' },
      { id: 'lightpanel', label: 'Световая панель', subtitle: 'тонкая панель, Acrylglas-Leuchtpanel', modifier: { min: 80, max: 220 }, impact: 'световая панель' },
      { id: 'film', label: 'Пленка / поверхность', subtitle: 'пленка, печать, лицевая поверхность', modifier: { min: 0, max: 80 }, impact: 'пленка / поверхность' },
      { id: 'neon', label: 'Классический неон', subtitle: 'стеклянные трубки и высоковольтный контур', modifier: { min: 180, max: 420 }, impact: 'классический неон' },
      { id: 'display', label: 'Цифровой LED-экран', subtitle: 'экран, бегущая строка или LED-display', modifier: { min: 220, max: 520 }, impact: 'цифровой LED-экран' },
      { id: 'unknown', label: 'Не уверен', subtitle: 'тип объекта пока непонятен', modifier: { min: 80, max: 220 }, impact: 'тип не уточнен' },
    ],
    locations: [
      { id: 'berlin', label: 'Berlin - Stadtgebiet', subtitle: 'город Берлин', modifier: { min: 0, max: 0 }, impact: 'Berlin Stadtgebiet' },
      { id: 'berlin-umland', label: 'Berliner Umland', subtitle: 'ближнее окружение Берлина', modifier: { min: 40, max: 120 }, impact: 'Berliner Umland' },
      { id: 'potsdam', label: 'Potsdam', subtitle: 'земля Бранденбург', modifier: { min: 70, max: 160 }, impact: 'Potsdam' },
      { id: 'brandenburg-havel', label: 'Brandenburg an der Havel', subtitle: 'земля Бранденбург', modifier: { min: 120, max: 280 }, impact: 'Brandenburg an der Havel' },
      { id: 'cottbus', label: 'Cottbus', subtitle: 'земля Бранденбург', modifier: { min: 180, max: 360 }, impact: 'Cottbus' },
      { id: 'frankfurt-oder', label: 'Frankfurt (Oder)', subtitle: 'земля Бранденбург', modifier: { min: 160, max: 320 }, impact: 'Frankfurt (Oder)' },
      { id: 'oranienburg', label: 'Oranienburg', subtitle: 'ближнее окружение Берлина', modifier: { min: 80, max: 190 }, impact: 'Oranienburg' },
      { id: 'bernau', label: 'Bernau bei Berlin', subtitle: 'ближнее окружение Берлина', modifier: { min: 80, max: 190 }, impact: 'Bernau bei Berlin' },
      { id: 'falkensee', label: 'Falkensee', subtitle: 'ближнее окружение Берлина', modifier: { min: 80, max: 190 }, impact: 'Falkensee' },
      { id: 'koenigs-wusterhausen', label: 'Königs Wusterhausen', subtitle: 'ближнее окружение Берлина', modifier: { min: 90, max: 210 }, impact: 'Königs Wusterhausen' },
      { id: 'ludwigsfelde', label: 'Ludwigsfelde', subtitle: 'ближнее окружение Берлина', modifier: { min: 90, max: 210 }, impact: 'Ludwigsfelde' },
      { id: 'brandenburg', label: 'Land Brandenburg allgemein', subtitle: 'город уточняется вручную', modifier: { min: 90, max: 240 }, impact: 'Land Brandenburg' },
      { id: 'outside', label: 'За пределами ядра - по запросу', subtitle: 'ручное уточнение', modifier: { min: 180, max: 420 }, impact: 'за пределами ядра' },
    ],
    urgencyOptions: [
      { id: 'planned', label: 'Плановый выезд', subtitle: 'обычное планирование', modifier: { min: 0, max: 0 }, impact: 'плановый выезд' },
      { id: 'urgent', label: 'Срочный выезд', subtitle: 'быстрый контакт / термин', modifier: { min: 160, max: 380 }, impact: 'срочный выезд' },
    ],
  },
};

const SCENARIOS_BY_CONSTRUCTION: Record<string, string[]> = {
  facade: ['no-light', 'flicker', 'rain-fail', 'mounting', 'led-zone'],
  lightbox: ['no-light', 'flicker', 'rain-fail', 'film'],
  letters: ['led-zone', 'flicker', 'rain-fail', 'mounting'],
  pylon: ['no-light', 'flicker', 'mounting', 'rain-fail'],
  lightpanel: ['no-light', 'flicker', 'film', 'rain-fail'],
  film: ['film', 'mounting'],
  neon: ['no-light', 'flicker', 'mounting'],
  display: ['no-light', 'flicker', 'rain-fail', 'mounting'],
  unknown: ['no-light', 'flicker', 'rain-fail', 'film', 'mounting', 'led-zone'],
};

function normalizeLocale(locale: string): Locale {
  return locale === 'ru' ? 'ru' : 'de';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseDimension(value: string, fallback: number): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function roundToTen(value: number): number {
  return Math.round(value / 10) * 10;
}

function areaModifier(area: number): Modifier {
  if (area <= 2) {
    return { min: 0, max: 0 };
  }

  if (area <= 6) {
    return { min: 60, max: 140 };
  }

  if (area <= 12) {
    return { min: 140, max: 280 };
  }

  return { min: 260, max: 520 };
}

function numberLocale(locale: Locale): string {
  return locale === 'ru' ? 'ru-RU' : 'de-DE';
}

function formatArea(area: number, locale: Locale): string {
  return area.toLocaleString(numberLocale(locale), { maximumFractionDigits: 1 });
}

function optionById<T extends { id: string }>(items: T[], id: string): T {
  return items.find((item) => item.id === id) ?? items[0];
}

export default function LeistungenDiagnosticPrototype({ locale }: LeistungenDiagnosticPrototypeProps) {
  const normalizedLocale = normalizeLocale(locale);
  const content = CONTENT[normalizedLocale];
  const scenarios = SCENARIOS[normalizedLocale];

  const [constructionId, setConstructionId] = useState(content.constructions[0].id);
  const [scenarioId, setScenarioId] = useState(SCENARIOS_BY_CONSTRUCTION[content.constructions[0].id][0]);
  const [locationId, setLocationId] = useState(content.locations[0].id);
  const [locationInput, setLocationInput] = useState(content.locations[0].label);
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [accessId, setAccessId] = useState(content.accessOptions[0].id);
  const [scopeId, setScopeId] = useState(scenarios[0].scopes[0].id);
  const [urgencyId, setUrgencyId] = useState(content.urgencyOptions[0].id);
  const [width, setWidth] = useState(DEFAULT_WIDTH.toFixed(1));
  const [height, setHeight] = useState(DEFAULT_HEIGHT.toFixed(1));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const allowedScenarioIds = SCENARIOS_BY_CONSTRUCTION[constructionId] ?? SCENARIOS_BY_CONSTRUCTION.unknown;
  const allowedScenarios = scenarios.filter((scenario) => allowedScenarioIds.includes(scenario.id));
  const scenario = allowedScenarios.find((item) => item.id === scenarioId) ?? allowedScenarios[0] ?? scenarios[0];
  const construction = optionById(content.constructions, constructionId);
  const access = optionById(content.accessOptions, accessId);
  const scope = optionById(scenario.scopes, scopeId);
  const location = optionById(content.locations, locationId);
  const urgency = optionById(content.urgencyOptions, urgencyId);
  const isUrgent = urgency.id === 'urgent';

  const widthValue = parseDimension(width, DEFAULT_WIDTH);
  const heightValue = parseDimension(height, DEFAULT_HEIGHT);
  const area = clamp(widthValue * heightValue, 0.5, 30);
  const areaRange = areaModifier(area);

  const estimate = {
    min: roundToTen(
      scenario.baseRange.min +
        construction.modifier.min +
        access.modifier.min +
        scope.modifier.min +
        location.modifier.min +
        urgency.modifier.min +
        areaRange.min,
    ),
    max: roundToTen(
      scenario.baseRange.max +
        construction.modifier.max +
        access.modifier.max +
        scope.modifier.max +
        location.modifier.max +
        urgency.modifier.max +
        areaRange.max,
    ),
  };

  const confidenceLabel =
    construction.id === 'unknown' || !locationInput.trim() ? content.confidenceLow : content.confidenceMedium;

  const photoItems = [...content.basePhotos, ...scenario.photos];

  const priceLabel = `${content.estimatePrefix} ${estimate.min.toLocaleString(numberLocale(normalizedLocale))}-${estimate.max.toLocaleString(numberLocale(normalizedLocale))} EUR`;
  const areaLabel = `${formatArea(area, normalizedLocale)} m²`;

  const handleConstructionChange = (nextId: string) => {
    const nextScenarioIds = SCENARIOS_BY_CONSTRUCTION[nextId] ?? SCENARIOS_BY_CONSTRUCTION.unknown;
    const nextScenario = scenarios.find((item) => item.id === nextScenarioIds[0]) ?? scenarios[0];
    setConstructionId(nextId);
    setScenarioId(nextScenario.id);
    setScopeId(nextScenario.scopes[0].id);
    setOpenSelect(null);
  };

  const handleScenarioChange = (nextId: string) => {
    const nextScenario = scenarios.find((item) => item.id === nextId) ?? scenario;
    setScenarioId(nextScenario.id);
    setScopeId(nextScenario.scopes[0].id);
    setOpenSelect(null);
  };

  const handleLocationChange = (nextId: string) => {
    const nextLocation = optionById(content.locations, nextId);
    setLocationId(nextLocation.id);
    setLocationInput(nextLocation.label);
    setOpenSelect(null);
  };

  const drawerMessage = [
    `${content.entityLabel}: ${construction.label}.`,
    `${content.reasonLabel}: ${scenario.label}.`,
    `${content.locationLabel}: ${locationInput || location.label}.`,
    `${content.urgencyLabel}: ${urgency.label}.`,
    `${content.accessLabel}: ${access.label}.`,
    `${content.sizeLabel}: ${formatArea(widthValue, normalizedLocale)} x ${formatArea(heightValue, normalizedLocale)} m (${areaLabel}).`,
    `${scenario.scopeLabel}: ${scope.label}.`,
    `${content.budgetLabel}: ${priceLabel}.`,
    `${content.repairLabel}: ${scenario.repair}`,
    content.disclaimer,
  ].join(' ');

  return (
    <>
      <section id="diagnose-variante" className="border-t border-[#E7DDD3] bg-[#F7F1E8] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.62fr)] lg:items-end">
            <div className="text-start">
              <SectionEyebrow className="mb-3">{content.eyebrow}</SectionEyebrow>
              <h2 className="max-w-4xl text-[34px] font-extrabold leading-[1.06] tracking-[0] text-[#0E1A2B] sm:text-[48px] lg:text-[56px]">
                {content.title}
              </h2>
            </div>
            <p className="max-w-2xl text-[16px] font-medium leading-[1.7] text-[#334155] lg:text-[18px]">
              {content.intro}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="rounded-[18px] border border-[#D9C7BA] bg-[#FFFDF9]/88 p-5 shadow-sm sm:p-6">
              <h3 className="text-[24px] font-black leading-tight text-[#0E1A2B]">{content.panelTitle}</h3>
              <p className="mt-2 text-[14px] font-bold leading-6 text-[#6F7A8A]">{content.panelIntro}</p>

              <div className="mt-5 grid gap-4">
                <PrototypeSelect
                  id="construction"
                  label={content.entityLabel}
                  activeLabel={construction.label}
                  activeSubtitle={construction.subtitle}
                  isOpen={openSelect === 'construction'}
                  onToggle={() => setOpenSelect(openSelect === 'construction' ? null : 'construction')}
                  options={content.constructions}
                  activeId={construction.id}
                  onSelect={handleConstructionChange}
                />

                <PrototypeSelect
                  id="scenario"
                  label={content.reasonLabel}
                  activeLabel={scenario.label}
                  activeSubtitle={scenario.title}
                  isOpen={openSelect === 'scenario'}
                  onToggle={() => setOpenSelect(openSelect === 'scenario' ? null : 'scenario')}
                  options={allowedScenarios.map((item) => ({
                    id: item.id,
                    label: item.label,
                    subtitle: item.title,
                    modifier: { min: 0, max: 0 },
                    impact: item.label,
                  }))}
                  activeId={scenario.id}
                  onSelect={handleScenarioChange}
                />

                <div className="relative">
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.locationLabel}
                  </span>
                  <div className="relative">
                    <input
                      value={locationInput}
                      onChange={(event) => {
                        setLocationInput(event.target.value);
                        setLocationId('outside');
                      }}
                      onFocus={() => setOpenSelect('location')}
                      placeholder={content.customLocationPlaceholder}
                      className="min-h-[58px] w-full rounded-[14px] border border-[#E7DDD3] bg-white px-4 pe-12 text-[14px] font-black text-[#0D1B2A] shadow-[0_8px_18px_rgba(13,27,42,0.04)] outline-none transition focus:border-[#B8643E]/60 focus:ring-4 focus:ring-[#B8643E]/10"
                    />
                    <button
                      type="button"
                      aria-label={content.locationLabel}
                      onClick={() => setOpenSelect(openSelect === 'location' ? null : 'location')}
                      className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-[12px] text-[#B8643E]"
                    >
                      <span className={`block h-2 w-2 border-b-2 border-r-2 border-current transition ${openSelect === 'location' ? 'rotate-[225deg]' : 'rotate-45'}`} />
                    </button>
                  </div>
                  {openSelect === 'location' && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 grid max-h-[310px] gap-1 overflow-y-auto rounded-[14px] border border-[#E7DDD3] bg-[#FFFDF9] p-2 shadow-[0_22px_60px_rgba(13,27,42,0.12)]">
                      {content.locations.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleLocationChange(item.id)}
                          className={`rounded-[10px] px-3 py-2 text-start text-[13px] font-black transition ${
                            item.id === location.id
                              ? 'bg-[#0D1B2A] text-white'
                              : 'bg-transparent text-[#0D1B2A] hover:bg-[#FFFAF4]'
                          }`}
                        >
                          <span className="block">{item.label}</span>
                          <span className={`mt-0.5 block text-[11px] font-bold ${item.id === location.id ? 'text-white/70' : 'text-[#6F7A8A]'}`}>
                            {item.subtitle}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#D9C7BA] bg-[#FFFDF9] p-5 shadow-[0_20px_55px_rgba(13,27,42,0.12)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E7DDD3] pb-5">
                <div>
                  <span className="inline-flex rounded-full border border-[#D9C7BA] bg-[#F7F1E8] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.cardBadge}
                  </span>
                  <h3 className="mt-3 text-[28px] font-black leading-tight text-[#0E1A2B] sm:text-[34px]">
                    {content.cardTitle}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[14px] font-medium leading-6 text-[#526174]">
                    {scenario.symptom}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5">
                <div>
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.accessLabel}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {content.accessOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === access.id}
                        onClick={() => setAccessId(option.id)}
                        className={`min-h-[54px] rounded-[12px] border px-3 py-2 text-start text-[13px] font-extrabold leading-5 transition ${
                          option.id === access.id
                            ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white'
                            : 'border-[#E7DDD3] bg-[#FFFAF4] text-[#0D1B2A] hover:border-[#B8643E]/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
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
                        className="min-h-[50px] w-full rounded-[12px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-bold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
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
                        className="min-h-[50px] w-full rounded-[12px] border border-[#E7DDD3] bg-[#FFFAF4] px-4 text-[15px] font-bold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                      />
                    </label>
                    <div className="rounded-[12px] border border-[#E7DDD3] bg-[#F7F1E8] px-4 py-3">
                      <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-[#6F7A8A]">
                        {content.areaLabel}
                      </span>
                      <strong className="mt-1 block text-[18px] font-black text-[#0E1A2B]">{areaLabel}</strong>
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] font-semibold leading-5 text-[#6F7A8A]">{content.sizeHint}</p>
                </div>

                <div>
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {scenario.scopeLabel}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {scenario.scopes.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === scope.id}
                        onClick={() => setScopeId(option.id)}
                        className={`min-h-[50px] rounded-[12px] border px-3 py-2 text-start text-[13px] font-extrabold leading-5 transition ${
                          option.id === scope.id
                            ? 'border-[#B8643E] bg-[#B8643E] text-white'
                            : 'border-[#E7DDD3] bg-[#FFFAF4] text-[#0D1B2A] hover:border-[#B8643E]/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.urgencyLabel}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {content.urgencyOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === urgency.id}
                        onClick={() => setUrgencyId(option.id)}
                        className={`min-h-[50px] rounded-[12px] border px-3 py-2 text-start text-[13px] font-extrabold leading-5 transition ${
                          option.id === urgency.id
                            ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white'
                            : 'border-[#E7DDD3] bg-[#FFFAF4] text-[#0D1B2A] hover:border-[#B8643E]/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className={`rounded-[14px] border p-5 text-white ${isUrgent ? 'border-[#0D1B2A] bg-[#17283B]' : 'border-[#E7DDD3] bg-[#0D1B2A]'}`}>
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/60">
                      {isUrgent ? content.urgentBudgetLabel : content.budgetLabel}
                    </span>
                    <strong className="mt-2 block text-[30px] font-black leading-none sm:text-[38px]">{priceLabel}</strong>
                    <p className="mt-4 text-[14px] font-bold leading-6 text-white/76">
                      {normalizedLocale === 'ru'
                        ? 'Диапазон рассчитан по конструкции, причине, зоне обслуживания, доступу, размеру и объему дефекта.'
                        : 'Der Rahmen kombiniert Objektart, Defekt, Servicegebiet, Zugang, Groesse und Umfang.'}
                    </p>
                    <div className="mt-4 rounded-[12px] bg-[#F7F1E8] px-3 py-2 text-[13px] font-black text-[#526174]">
                      <span className="me-2 inline-block h-2.5 w-2.5 rounded-full bg-[#2F8C67]" />
                      {construction.id === 'unknown' ? content.confidenceLow : confidenceLabel}
                    </div>
                  </div>

                  <div className="rounded-[14px] border border-[#E7DDD3] bg-white p-5">
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[#6F7A8A]">
                      {content.repairLabel}
                    </span>
                    <p className="mt-3 text-[15px] font-black leading-7 text-[#0E1A2B]">{scenario.repair}</p>
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#E7DDD3] bg-white p-5">
                  <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[#6F7A8A]">
                    {content.photoLabel}
                  </span>
                  <ul className="mt-3 grid gap-2">
                    {photoItems.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] font-bold leading-5 text-[#334155]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8643E]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[14px] border border-[#D9C7BA] bg-[#F7F1E8] p-4">
                  <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                    {content.noteLabel}
                  </span>
                  <p className="mt-2 text-[13px] font-semibold leading-6 text-[#526174]">{content.disclaimer}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className={`inline-flex min-h-[54px] w-full items-center justify-center rounded-full px-7 py-3 text-[15px] font-black text-white shadow-[0_16px_34px_rgba(184,100,62,0.24)] transition-all duration-300 active:scale-[0.98] ${
                    isUrgent ? 'bg-[#0D1B2A] hover:bg-[#17283B]' : 'bg-[#B8643E] hover:bg-[#A65835]'
                  }`}
                >
                  {isUrgent ? content.urgentCtaLabel : content.ctaLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeistungenProblemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={content.drawerTitle}
        reassuringText={`${content.repairLabel}: ${scenario.repair} ${content.budgetLabel}: ${priceLabel}.`}
        initialMessage={drawerMessage}
        initialIssueType="Repair"
        closeLabel={content.closeLabel}
        formTitle={content.drawerFormTitle}
        reassuringLabel={content.drawerInfoLabel}
        formIntro={content.drawerFormIntro}
      />
    </>
  );
}

type PrototypeSelectProps = {
  id: string;
  label: string;
  activeLabel: string;
  activeSubtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  options: SelectOption[];
  activeId: string;
  onSelect: (id: string) => void;
};

function PrototypeSelect({
  id,
  label,
  activeLabel,
  activeSubtitle,
  isOpen,
  onToggle,
  options,
  activeId,
  onSelect,
}: PrototypeSelectProps) {
  const activeIndex = Math.max(0, options.findIndex((item) => item.id === activeId));

  return (
    <div className="relative">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
        {label}
      </span>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={onToggle}
        className="relative flex min-h-[60px] w-full items-start gap-3 rounded-[14px] border border-[#E7DDD3] bg-white px-4 py-3 pe-12 text-start text-[#0D1B2A] shadow-[0_8px_18px_rgba(13,27,42,0.04)] transition hover:border-[#B8643E]/45"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B8643E]/10 text-[12px] font-black text-[#B8643E]">
          {activeIndex + 1}
        </span>
        <span>
          <strong className="block text-[14px] font-black leading-tight">{activeLabel}</strong>
          <span className="mt-1 block text-[12px] font-bold leading-4 text-[#6F7A8A]">{activeSubtitle}</span>
        </span>
        <span className={`absolute right-5 top-6 h-2 w-2 border-b-2 border-r-2 border-[#B8643E] transition ${isOpen ? 'rotate-[225deg]' : 'rotate-45'}`} />
      </button>

      {isOpen && (
        <div
          id={`${id}-menu`}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 grid max-h-[310px] gap-1 overflow-y-auto rounded-[14px] border border-[#E7DDD3] bg-[#FFFDF9] p-2 shadow-[0_22px_60px_rgba(13,27,42,0.12)]"
        >
          {options.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`rounded-[10px] px-3 py-2 text-start text-[13px] font-black transition ${
                item.id === activeId ? 'bg-[#0D1B2A] text-white' : 'bg-transparent text-[#0D1B2A] hover:bg-[#FFFAF4]'
              }`}
            >
              <span className="block">{item.label}</span>
              <span className={`mt-0.5 block text-[11px] font-bold ${item.id === activeId ? 'text-white/70' : 'text-[#6F7A8A]'}`}>
                {item.subtitle}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
