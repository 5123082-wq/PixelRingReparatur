'use client';

import { useState } from 'react';

import SectionEyebrow from '@/components/common/SectionEyebrow';
import LeistungenProblemDrawer from './LeistungenProblemDrawer';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

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
  estimateBasisText: string;
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
      label: 'Befestigung / Gehaeuse',
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
      label: 'Крепление / корпус',
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
  en: [
    {
      id: 'no-light',
      label: 'Sign does not light up',
      title: 'The whole sign stays dark',
      symptom: 'No illumination or the sign starts unreliably.',
      repair: 'Likely path depends on access and material: on-site diagnosis, power supply, wiring or control unit.',
      scopeLabel: 'Failure scope',
      scopes: [
        { id: 'single', label: 'one section', modifier: { min: 0, max: 80 }, impact: 'one section' },
        { id: 'multiple', label: 'several sections', modifier: { min: 80, max: 180 }, impact: 'several sections' },
        { id: 'full', label: 'whole sign', modifier: { min: 140, max: 260 }, impact: 'whole sign' },
      ],
      baseRange: { min: 240, max: 620 },
      photos: [],
    },
    {
      id: 'flicker',
      label: 'Flickering / unstable light',
      title: 'The light flickers or cuts out temporarily',
      symptom: 'The sign pulses, lights unevenly or switches off for short periods.',
      repair: 'Possible work includes stabilizing power, contact repair or driver replacement after inspection.',
      scopeLabel: 'Flicker scope',
      scopes: [
        { id: 'single', label: 'one zone', modifier: { min: 0, max: 70 }, impact: 'one zone' },
        { id: 'multiple', label: 'several zones', modifier: { min: 70, max: 160 }, impact: 'several zones' },
        { id: 'full', label: 'almost everywhere', modifier: { min: 130, max: 240 }, impact: 'wide failure' },
      ],
      baseRange: { min: 240, max: 560 },
      photos: ['Short video of the flicker'],
    },
    {
      id: 'rain-fail',
      label: 'After rain / breaker trips',
      title: 'The fault appears with rain or moisture',
      symptom: 'Breaker or RCD trips, or the sign only starts after drying.',
      repair: 'First clarify exterior condition and access; the repair depends on moisture source and material state.',
      scopeLabel: 'Moisture behavior',
      scopes: [
        { id: 'sometimes', label: 'only sometimes', modifier: { min: 0, max: 100 }, impact: 'sporadic' },
        { id: 'breaker', label: 'breaker trips', modifier: { min: 120, max: 260 }, impact: 'protection trips' },
        { id: 'visible-water', label: 'visible water', modifier: { min: 180, max: 360 }, impact: 'visible moisture' },
      ],
      baseRange: { min: 320, max: 880 },
      photos: ['Housing, joints and cable entry from outside'],
    },
    {
      id: 'film',
      label: 'Film / surface damage',
      title: 'Film or visible surface is damaged',
      symptom: 'Film lifts, fades, bubbles or adhesive residue is visible.',
      repair: 'Possible work includes local correction, partial replacement or new wrapping after material check.',
      scopeLabel: 'Affected surface',
      scopes: [
        { id: 'edge', label: 'edge / corner', modifier: { min: 0, max: 60 }, impact: 'edge' },
        { id: 'section', label: 'one section', modifier: { min: 70, max: 170 }, impact: 'section' },
        { id: 'large', label: 'large area', modifier: { min: 160, max: 360 }, impact: 'large area' },
      ],
      baseRange: { min: 180, max: 620 },
      photos: ['Close-up of edge, bubbles or fading'],
    },
    {
      id: 'mounting',
      label: 'Mounting / housing',
      title: 'Housing or mounting is damaged',
      symptom: 'The sign is loose, brackets are weakened or housing parts are damaged.',
      repair: 'First clarify condition and access; the repair plan follows inspection and material check.',
      scopeLabel: 'Mechanical condition',
      scopes: [
        { id: 'loose', label: 'slightly loose', modifier: { min: 0, max: 90 }, impact: 'slight looseness' },
        { id: 'damaged', label: 'damaged', modifier: { min: 120, max: 260 }, impact: 'visible damage' },
        { id: 'fall-risk', label: 'fall risk', modifier: { min: 220, max: 460 }, impact: 'high securing need' },
      ],
      baseRange: { min: 360, max: 980 },
      photos: ['Photo from a safe distance'],
    },
    {
      id: 'led-zone',
      label: 'Letter / LED zone dark',
      title: 'One letter or LED area does not light',
      symptom: 'Individual letters, LED zones or modules stay dark.',
      repair: 'Targeted repair is possible; scope depends on module type and access.',
      scopeLabel: 'Affected LED zones',
      scopes: [
        { id: 'single', label: 'one zone / letter', modifier: { min: 0, max: 70 }, impact: 'one zone' },
        { id: 'multiple', label: 'several zones', modifier: { min: 80, max: 180 }, impact: 'several zones' },
        { id: 'large', label: 'large part', modifier: { min: 150, max: 320 }, impact: 'large scope' },
      ],
      baseRange: { min: 220, max: 540 },
      photos: ['Full view plus affected letter or area'],
    },
  ],
  tr: [
    {
      id: 'no-light',
      label: 'Tabela yanmıyor',
      title: 'Tabelanın tamamı karanlık kalıyor',
      symptom: 'Aydınlatma yok veya tabela kararsız çalışıyor.',
      repair: 'Olası yol erişime ve malzemeye bağlıdır: yerinde teşhis, güç kaynağı, hat veya kontrol ünitesi.',
      scopeLabel: 'Arıza kapsamı',
      scopes: [
        { id: 'single', label: 'tek bölüm', modifier: { min: 0, max: 80 }, impact: 'tek bölüm' },
        { id: 'multiple', label: 'birkaç bölüm', modifier: { min: 80, max: 180 }, impact: 'birkaç bölüm' },
        { id: 'full', label: 'tüm tabela', modifier: { min: 140, max: 260 }, impact: 'tüm tabela' },
      ],
      baseRange: { min: 240, max: 620 },
      photos: [],
    },
    {
      id: 'flicker',
      label: 'Titreme / dengesiz ışık',
      title: 'Işık titriyor veya ara sıra kesiliyor',
      symptom: 'Tabela dalgalanıyor, eşit yanmıyor veya kısa süreli kapanıyor.',
      repair: 'Kontrolden sonra güç stabilizasyonu, kontak onarımı veya sürücü değişimi gerekebilir.',
      scopeLabel: 'Titreme kapsamı',
      scopes: [
        { id: 'single', label: 'tek bölge', modifier: { min: 0, max: 70 }, impact: 'tek bölge' },
        { id: 'multiple', label: 'birkaç bölge', modifier: { min: 70, max: 160 }, impact: 'birkaç bölge' },
        { id: 'full', label: 'neredeyse her yerde', modifier: { min: 130, max: 240 }, impact: 'geniş arıza' },
      ],
      baseRange: { min: 240, max: 560 },
      photos: ['Titremenin kısa videosu'],
    },
    {
      id: 'rain-fail',
      label: 'Yağmurdan sonra sigorta atıyor',
      title: 'Sorun yağmur veya nemle ortaya çıkıyor',
      symptom: 'Sigorta/RCD atıyor veya tabela ancak kuruduktan sonra çalışıyor.',
      repair: 'Önce dış durum ve erişim netleştirilir; onarım nem kaynağına ve malzeme durumuna bağlıdır.',
      scopeLabel: 'Nem davranışı',
      scopes: [
        { id: 'sometimes', label: 'ara sıra', modifier: { min: 0, max: 100 }, impact: 'seyrek' },
        { id: 'breaker', label: 'sigorta atıyor', modifier: { min: 120, max: 260 }, impact: 'koruma devreye giriyor' },
        { id: 'visible-water', label: 'su görünüyor', modifier: { min: 180, max: 360 }, impact: 'görünür nem' },
      ],
      baseRange: { min: 320, max: 880 },
      photos: ['Dıştan gövde, birleşim yerleri ve kablo girişi'],
    },
    {
      id: 'film',
      label: 'Folyo / yüzey hasarı',
      title: 'Folyo veya görünen yüzey hasarlı',
      symptom: 'Folyo kalkıyor, solmuş, kabarcık yapmış veya yapıştırıcı izi görünüyor.',
      repair: 'Malzeme kontrolünden sonra lokal düzeltme, kısmi değişim veya yeni kaplama gerekebilir.',
      scopeLabel: 'Etkilenen yüzey',
      scopes: [
        { id: 'edge', label: 'kenar / köşe', modifier: { min: 0, max: 60 }, impact: 'kenar' },
        { id: 'section', label: 'bir bölüm', modifier: { min: 70, max: 170 }, impact: 'bölüm' },
        { id: 'large', label: 'geniş alan', modifier: { min: 160, max: 360 }, impact: 'geniş alan' },
      ],
      baseRange: { min: 180, max: 620 },
      photos: ['Kenar, kabarcık veya solmanın yakın planı'],
    },
    {
      id: 'mounting',
      label: 'Bağlantı / gövde',
      title: 'Gövde veya bağlantı hasarlı',
      symptom: 'Tabela sallanıyor, bağlantılar gevşemiş veya gövde parçaları hasarlı.',
      repair: 'Önce durum ve erişim netleştirilir; onarım planı inceleme ve malzeme kontrolünden sonra yapılır.',
      scopeLabel: 'Mekanik durum',
      scopes: [
        { id: 'loose', label: 'hafif gevşek', modifier: { min: 0, max: 90 }, impact: 'hafif gevşeklik' },
        { id: 'damaged', label: 'hasarlı', modifier: { min: 120, max: 260 }, impact: 'görünür hasar' },
        { id: 'fall-risk', label: 'düşme riski', modifier: { min: 220, max: 460 }, impact: 'yüksek sabitleme ihtiyacı' },
      ],
      baseRange: { min: 360, max: 980 },
      photos: ['Güvenli mesafeden fotoğraf'],
    },
    {
      id: 'led-zone',
      label: 'Harf / LED bölgesi karanlık',
      title: 'Bir harf veya LED alanı yanmıyor',
      symptom: 'Tek harfler, LED bölgeleri veya modüller karanlık kalıyor.',
      repair: 'Noktasal onarım mümkündür; kapsam modül tipine ve erişime bağlıdır.',
      scopeLabel: 'Etkilenen LED bölgeleri',
      scopes: [
        { id: 'single', label: 'tek bölge / harf', modifier: { min: 0, max: 70 }, impact: 'tek bölge' },
        { id: 'multiple', label: 'birkaç bölge', modifier: { min: 80, max: 180 }, impact: 'birkaç bölge' },
        { id: 'large', label: 'büyük bölüm', modifier: { min: 150, max: 320 }, impact: 'geniş kapsam' },
      ],
      baseRange: { min: 220, max: 540 },
      photos: ['Genel görünüm ve etkilenen harf veya alan'],
    },
  ],
  pl: [
    {
      id: 'no-light',
      label: 'Szyld nie świeci',
      title: 'Cały szyld pozostaje ciemny',
      symptom: 'Brak podświetlenia lub szyld uruchamia się niestabilnie.',
      repair: 'Prawdopodobna ścieżka zależy od dostępu i materiału: diagnostyka lokalna, zasilacz, linia lub sterowanie.',
      scopeLabel: 'Zakres awarii',
      scopes: [
        { id: 'single', label: 'jeden obszar', modifier: { min: 0, max: 80 }, impact: 'jeden obszar' },
        { id: 'multiple', label: 'kilka obszarów', modifier: { min: 80, max: 180 }, impact: 'kilka obszarów' },
        { id: 'full', label: 'cały szyld', modifier: { min: 140, max: 260 }, impact: 'cały szyld' },
      ],
      baseRange: { min: 240, max: 620 },
      photos: [],
    },
    {
      id: 'flicker',
      label: 'Migotanie / niestabilne światło',
      title: 'Światło migocze lub okresowo gaśnie',
      symptom: 'Szyld pulsuje, świeci nierówno albo na chwilę się wyłącza.',
      repair: 'Po kontroli możliwa jest stabilizacja zasilania, praca na stykach lub wymiana sterownika.',
      scopeLabel: 'Zakres migotania',
      scopes: [
        { id: 'single', label: 'jedna strefa', modifier: { min: 0, max: 70 }, impact: 'jedna strefa' },
        { id: 'multiple', label: 'kilka stref', modifier: { min: 70, max: 160 }, impact: 'kilka stref' },
        { id: 'full', label: 'prawie wszędzie', modifier: { min: 130, max: 240 }, impact: 'szeroka awaria' },
      ],
      baseRange: { min: 240, max: 560 },
      photos: ['Krótkie wideo migotania'],
    },
    {
      id: 'rain-fail',
      label: 'Po deszczu wybija zabezpieczenie',
      title: 'Problem pojawia się przy deszczu lub wilgoci',
      symptom: 'Wyłącznik lub RCD wybija, albo szyld działa dopiero po wyschnięciu.',
      repair: 'Najpierw sprawdzamy widok zewnętrzny i dostęp; naprawa zależy od źródła wilgoci i stanu materiałów.',
      scopeLabel: 'Zachowanie przy wilgoci',
      scopes: [
        { id: 'sometimes', label: 'tylko czasami', modifier: { min: 0, max: 100 }, impact: 'sporadycznie' },
        { id: 'breaker', label: 'wybija zabezpieczenie', modifier: { min: 120, max: 260 }, impact: 'zabezpieczenie działa' },
        { id: 'visible-water', label: 'widać wodę', modifier: { min: 180, max: 360 }, impact: 'widoczna wilgoć' },
      ],
      baseRange: { min: 320, max: 880 },
      photos: ['Obudowa, łączenia i wejście kabla z zewnątrz'],
    },
    {
      id: 'film',
      label: 'Folia / uszkodzona powierzchnia',
      title: 'Folia lub widoczna powierzchnia jest uszkodzona',
      symptom: 'Folia odkleja się, wyblakła, ma pęcherze albo widać ślady kleju.',
      repair: 'Po sprawdzeniu materiału możliwa jest korekta lokalna, częściowa wymiana lub nowe oklejenie.',
      scopeLabel: 'Dotknięta powierzchnia',
      scopes: [
        { id: 'edge', label: 'krawędź / róg', modifier: { min: 0, max: 60 }, impact: 'krawędź' },
        { id: 'section', label: 'jeden odcinek', modifier: { min: 70, max: 170 }, impact: 'odcinek' },
        { id: 'large', label: 'duża powierzchnia', modifier: { min: 160, max: 360 }, impact: 'duża powierzchnia' },
      ],
      baseRange: { min: 180, max: 620 },
      photos: ['Zbliżenie krawędzi, pęcherzy lub wyblaknięcia'],
    },
    {
      id: 'mounting',
      label: 'Mocowanie / obudowa',
      title: 'Obudowa lub mocowanie jest uszkodzone',
      symptom: 'Szyld się rusza, mocowania są luźne albo elementy obudowy są uszkodzone.',
      repair: 'Najpierw ustalamy stan i dostęp; plan naprawy powstaje po oględzinach i sprawdzeniu materiałów.',
      scopeLabel: 'Stan mechaniczny',
      scopes: [
        { id: 'loose', label: 'lekki luz', modifier: { min: 0, max: 90 }, impact: 'lekki luz' },
        { id: 'damaged', label: 'uszkodzone', modifier: { min: 120, max: 260 }, impact: 'widoczne uszkodzenie' },
        { id: 'fall-risk', label: 'ryzyko upadku', modifier: { min: 220, max: 460 }, impact: 'wysoka potrzeba zabezpieczenia' },
      ],
      baseRange: { min: 360, max: 980 },
      photos: ['Zdjęcie z bezpiecznej odległości'],
    },
    {
      id: 'led-zone',
      label: 'Litera / strefa LED ciemna',
      title: 'Jedna litera lub obszar LED nie świeci',
      symptom: 'Pojedyncze litery, strefy LED lub moduły pozostają ciemne.',
      repair: 'Możliwa jest naprawa punktowa; zakres zależy od typu modułu i dostępu.',
      scopeLabel: 'Dotknięte strefy LED',
      scopes: [
        { id: 'single', label: 'jedna strefa / litera', modifier: { min: 0, max: 70 }, impact: 'jedna strefa' },
        { id: 'multiple', label: 'kilka stref', modifier: { min: 80, max: 180 }, impact: 'kilka stref' },
        { id: 'large', label: 'duża część', modifier: { min: 150, max: 320 }, impact: 'duży zakres' },
      ],
      baseRange: { min: 220, max: 540 },
      photos: ['Widok ogólny oraz dotknięta litera lub obszar'],
    },
  ],
  ar: [
    {
      id: 'no-light',
      label: 'اللافتة لا تضيء',
      title: 'اللافتة بالكامل تبقى مظلمة',
      symptom: 'لا توجد إضاءة أو تعمل اللافتة بشكل غير مستقر.',
      repair: 'المسار المحتمل يعتمد على الوصول والمواد: تشخيص في الموقع أو مزود طاقة أو خط كهرباء أو وحدة تحكم.',
      scopeLabel: 'نطاق العطل',
      scopes: [
        { id: 'single', label: 'جزء واحد', modifier: { min: 0, max: 80 }, impact: 'جزء واحد' },
        { id: 'multiple', label: 'عدة أجزاء', modifier: { min: 80, max: 180 }, impact: 'عدة أجزاء' },
        { id: 'full', label: 'اللافتة كلها', modifier: { min: 140, max: 260 }, impact: 'اللافتة كلها' },
      ],
      baseRange: { min: 240, max: 620 },
      photos: [],
    },
    {
      id: 'flicker',
      label: 'وميض / إضاءة غير مستقرة',
      title: 'الإضاءة تومض أو تنقطع مؤقتا',
      symptom: 'اللافتة تومض، تضيء بشكل غير متساو أو تنطفئ لفترات قصيرة.',
      repair: 'قد يلزم تثبيت التغذية، إصلاح نقاط التلامس أو استبدال الدرايفر بعد الفحص.',
      scopeLabel: 'نطاق الوميض',
      scopes: [
        { id: 'single', label: 'منطقة واحدة', modifier: { min: 0, max: 70 }, impact: 'منطقة واحدة' },
        { id: 'multiple', label: 'عدة مناطق', modifier: { min: 70, max: 160 }, impact: 'عدة مناطق' },
        { id: 'full', label: 'تقريبا في كل اللافتة', modifier: { min: 130, max: 240 }, impact: 'عطل واسع' },
      ],
      baseRange: { min: 240, max: 560 },
      photos: ['فيديو قصير للوميض'],
    },
    {
      id: 'rain-fail',
      label: 'بعد المطر / القاطع يفصل',
      title: 'المشكلة تظهر مع المطر أو الرطوبة',
      symptom: 'القاطع أو RCD يفصل، أو تعمل اللافتة فقط بعد أن تجف.',
      repair: 'نوضح أولا الحالة الخارجية والوصول؛ الإصلاح يعتمد على مصدر الرطوبة وحالة المواد.',
      scopeLabel: 'السلوك مع الرطوبة',
      scopes: [
        { id: 'sometimes', label: 'أحيانا فقط', modifier: { min: 0, max: 100 }, impact: 'متقطع' },
        { id: 'breaker', label: 'القاطع يفصل', modifier: { min: 120, max: 260 }, impact: 'الحماية تفصل' },
        { id: 'visible-water', label: 'ماء ظاهر', modifier: { min: 180, max: 360 }, impact: 'رطوبة ظاهرة' },
      ],
      baseRange: { min: 320, max: 880 },
      photos: ['الهيكل والفواصل ومدخل الكابل من الخارج'],
    },
    {
      id: 'film',
      label: 'تلف الفيلم / السطح',
      title: 'الفيلم أو السطح الظاهر تالف',
      symptom: 'الفيلم يتقشر، باهت، توجد فقاعات أو آثار لاصق ظاهرة.',
      repair: 'قد يكون الحل تصحيحا موضعيا أو استبدالا جزئيا أو تغليفا جديدا بعد فحص المادة.',
      scopeLabel: 'السطح المتضرر',
      scopes: [
        { id: 'edge', label: 'حافة / زاوية', modifier: { min: 0, max: 60 }, impact: 'حافة' },
        { id: 'section', label: 'جزء واحد', modifier: { min: 70, max: 170 }, impact: 'جزء' },
        { id: 'large', label: 'مساحة كبيرة', modifier: { min: 160, max: 360 }, impact: 'مساحة كبيرة' },
      ],
      baseRange: { min: 180, max: 620 },
      photos: ['لقطة قريبة للحافة أو الفقاعات أو البهتان'],
    },
    {
      id: 'mounting',
      label: 'التثبيت / الهيكل',
      title: 'الهيكل أو التثبيت تالف',
      symptom: 'اللافتة تتحرك، الحوامل مرتخية أو أجزاء الهيكل تالفة.',
      repair: 'نوضح أولا الحالة والوصول؛ خطة الإصلاح تأتي بعد المعاينة وفحص المواد.',
      scopeLabel: 'الحالة الميكانيكية',
      scopes: [
        { id: 'loose', label: 'ارتخاء بسيط', modifier: { min: 0, max: 90 }, impact: 'ارتخاء بسيط' },
        { id: 'damaged', label: 'تالف', modifier: { min: 120, max: 260 }, impact: 'ضرر ظاهر' },
        { id: 'fall-risk', label: 'خطر سقوط', modifier: { min: 220, max: 460 }, impact: 'حاجة عالية للتأمين' },
      ],
      baseRange: { min: 360, max: 980 },
      photos: ['صورة من مسافة آمنة'],
    },
    {
      id: 'led-zone',
      label: 'حرف / منطقة LED مظلمة',
      title: 'حرف أو منطقة LED لا تضيء',
      symptom: 'حروف مفردة أو مناطق LED أو وحدات تبقى مظلمة.',
      repair: 'الإصلاح الموضعي ممكن؛ النطاق يعتمد على نوع الوحدة وإمكانية الوصول.',
      scopeLabel: 'مناطق LED المتضررة',
      scopes: [
        { id: 'single', label: 'منطقة / حرف واحد', modifier: { min: 0, max: 70 }, impact: 'منطقة واحدة' },
        { id: 'multiple', label: 'عدة مناطق', modifier: { min: 80, max: 180 }, impact: 'عدة مناطق' },
        { id: 'large', label: 'جزء كبير', modifier: { min: 150, max: 320 }, impact: 'نطاق كبير' },
      ],
      baseRange: { min: 220, max: 540 },
      photos: ['منظر عام مع الحرف أو المنطقة المتضررة'],
    },
  ],
};

const CONTENT: Record<Locale, Content> = {
  de: {
    eyebrow: 'Reparatur-Kostenrechner',
    title: 'Reparaturkosten einschätzen',
    intro:
      'Wählen Sie Bauart, Schadensbild, Servicegebiet, Zugang und Größe. Die Karte berechnet einen unverbindlichen Budgetrahmen für die mögliche Reparatur.',
    panelTitle: 'Parameter',
    panelIntro: 'Geben Sie die wichtigsten Eckdaten ein. Rechts sehen Sie, wie sich Budgetrahmen und Einsatzart verändern.',
    entityLabel: 'Anlagenart',
    reasonLabel: 'Schadensbild / Symptom',
    locationLabel: 'Servicegebiet',
    cardBadge: 'Diagnosekarte',
    cardTitle: 'Diagnosekarte',
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
    disclaimer: 'Unverbindliche Erstorientierung: Diese Diagnosekarte, Zeit- und Budgetangaben sind reine Informationswerte. Sie sind kein Vertrag, kein verbindliches Angebot und keine bindende Kostenzusage. Ein verbindliches Angebot und ein genauer Preis entstehen erst nach Prüfung von Fotos, Adresse, Zugang und Material sowie nach ausdrücklicher Bestätigung durch PixelRing.',
    ctaLabel: 'Diagnose anfragen',
    urgentCtaLabel: 'Dringenden Einsatz anfragen',
    drawerTitle: 'Diagnose anfragen',
    drawerFormTitle: 'Diagnose & Reparatur anfragen',
    drawerInfoLabel: 'Einschaetzung & naechster Schritt',
    drawerFormIntro: 'Geben Sie Ihre Kontaktdaten an, um die Anfrage mit diesen Angaben vorzubereiten.',
    closeLabel: 'Schließen',
    estimatePrefix: 'ca.',
    customLocationPlaceholder: 'Ort oder PLZ, z. B. Berlin',
    estimateBasisText: 'Der Rahmen kombiniert Bauart, Schadensbild, Servicegebiet, Zugang, Groesse und Umfang.',
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
      { id: 'panel', label: 'Panel / Schild ohne Beleuchtung', subtitle: 'Druck, Folie oder Sichtflaeche', modifier: { min: 0, max: 80 }, impact: 'Panel / Schild' },
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
    eyebrow: 'Предварительный калькулятор ремонта',
    title: 'Оцените стоимость ремонта',
    intro:
      'Выберите тип конструкции, неисправность, зону обслуживания, доступ и размер. Карта рассчитает ориентир бюджета для возможного ремонта.',
    panelTitle: 'Параметры',
    panelIntro: 'Укажите основные данные. Справа видно, как меняются бюджетный ориентир и тип выезда.',
    entityLabel: 'Тип конструкции',
    reasonLabel: 'Вид неисправности / симптом',
    locationLabel: 'Зона обслуживания',
    cardBadge: 'Диагностическая карта',
    cardTitle: 'Диагностическая карта',
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
    disclaimer: 'Предварительный ориентир: эта диагностическая карта, сроки и бюджет носят информационный характер. Они не являются договором, офертой или обязательным коммерческим предложением. Юридически обязательное предложение и точная цена возможны только после проверки фото, адреса, доступа и материалов и отдельного подтверждения PixelRing.',
    ctaLabel: 'Запросить диагностику',
    urgentCtaLabel: 'Запросить срочный выезд',
    drawerTitle: 'Запросить диагностику',
    drawerFormTitle: 'Запросить диагностику и ремонт',
    drawerInfoLabel: 'Оценка и следующий шаг',
    drawerFormIntro: 'Укажите контакты, чтобы передать заявку специалистам PixelRing с выбранными параметрами.',
    closeLabel: 'Закрыть',
    estimatePrefix: 'примерно',
    customLocationPlaceholder: 'Город или PLZ, например Berlin',
    estimateBasisText: 'Диапазон рассчитан по типу конструкции, неисправности, зоне обслуживания, доступу, размеру и объему дефекта.',
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
      { id: 'panel', label: 'Панель / табличка без подсветки', subtitle: 'печать, пленка или лицевая панель', modifier: { min: 0, max: 80 }, impact: 'панель / табличка' },
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
  en: {
    eyebrow: 'Repair cost calculator',
    title: 'Estimate repair costs',
    intro:
      'Choose construction type, fault, service area, access and size. The card calculates a non-binding budget range for the possible repair.',
    panelTitle: 'Parameters',
    panelIntro: 'Enter the key details. On the right you see how budget range and visit type change.',
    entityLabel: 'Construction type',
    reasonLabel: 'Fault type / symptom',
    locationLabel: 'Service area',
    cardBadge: 'Diagnostic card',
    cardTitle: 'Diagnostic card',
    accessLabel: 'Access / mounting height',
    sizeLabel: 'Approximate sign size',
    widthLabel: 'Width, m',
    heightLabel: 'Height, m',
    areaLabel: 'Calculated area',
    sizeHint: 'If the size is unknown, enter an approximate value. The estimate remains preliminary.',
    urgencyLabel: 'Visit urgency',
    budgetLabel: 'Budget orientation',
    urgentBudgetLabel: 'Urgent visit orientation',
    repairLabel: 'Possible repair orientation',
    confidenceLabel: 'Workable orientation',
    confidenceLow: 'Very rough orientation',
    confidenceMedium: 'Workable orientation',
    photoLabel: 'Helpful photos',
    noteLabel: 'Important',
    disclaimer: 'Non-binding initial orientation: this diagnostic card, time estimate and budget range are for information only. They are not a contract, not a binding offer and not a binding cost commitment. A binding offer and exact price are possible only after PixelRing has reviewed photos, address, access and materials and confirmed separately.',
    ctaLabel: 'Request diagnosis',
    urgentCtaLabel: 'Request urgent visit',
    drawerTitle: 'Request diagnosis',
    drawerFormTitle: 'Request diagnosis and repair',
    drawerInfoLabel: 'Assessment and next step',
    drawerFormIntro: 'Add contact details so PixelRing specialists can receive the request with these parameters.',
    closeLabel: 'Close',
    estimatePrefix: 'approx.',
    customLocationPlaceholder: 'City or postcode, e.g. Berlin',
    estimateBasisText: 'The range combines construction type, fault, service area, access, size and defect scope.',
    basePhotos: ['Full view of sign and facade', 'Close-up of the problem area', 'Photo showing height and access'],
    accessOptions: [
      { id: 'low', label: 'Up to 3 m, ladder access', subtitle: 'standard access', modifier: { min: 0, max: 0 }, impact: 'standard access' },
      { id: 'mid', label: '3-6 m, platform likely', subtitle: 'access to clarify', modifier: { min: 90, max: 180 }, impact: 'platform likely' },
      { id: 'high', label: 'Above 6 m or difficult access', subtitle: 'separate planning', modifier: { min: 180, max: 360 }, impact: 'difficult access' },
    ],
    constructions: [
      { id: 'facade', label: 'Facade sign', subtitle: 'sign mounted on building facade', modifier: { min: 40, max: 140 }, impact: 'facade sign' },
      { id: 'lightbox', label: 'Lightbox / illuminated panel', subtitle: 'box with illuminated front', modifier: { min: 30, max: 110 }, impact: 'lightbox' },
      { id: 'letters', label: 'Illuminated LED letters', subtitle: 'individual letters or wordmark', modifier: { min: 60, max: 180 }, impact: 'LED letters' },
      { id: 'pylon', label: 'Pylon / projecting sign', subtitle: 'freestanding or projecting construction', modifier: { min: 120, max: 280 }, impact: 'pylon / projecting sign' },
      { id: 'lightpanel', label: 'Acrylic light panel', subtitle: 'flat illuminated panel', modifier: { min: 80, max: 220 }, impact: 'light panel' },
      { id: 'panel', label: 'Panel / non-lit sign', subtitle: 'print, film or visible face', modifier: { min: 0, max: 80 }, impact: 'panel / non-lit sign' },
      { id: 'neon', label: 'Classic neon', subtitle: 'glass tubes and high voltage', modifier: { min: 180, max: 420 }, impact: 'classic neon' },
      { id: 'display', label: 'Digital LED display', subtitle: 'display, ticker or LED screen', modifier: { min: 220, max: 520 }, impact: 'digital LED display' },
      { id: 'unknown', label: 'Not sure', subtitle: 'object type is unclear', modifier: { min: 80, max: 220 }, impact: 'type unclear' },
    ],
    locations: [
      { id: 'berlin', label: 'Berlin - city area', subtitle: 'Berlin', modifier: { min: 0, max: 0 }, impact: 'Berlin city area' },
      { id: 'berlin-umland', label: 'Berlin surrounding area', subtitle: 'edge area around Berlin', modifier: { min: 40, max: 120 }, impact: 'Berlin surrounding area' },
      { id: 'potsdam', label: 'Potsdam', subtitle: 'Brandenburg capital', modifier: { min: 70, max: 160 }, impact: 'Potsdam' },
      { id: 'brandenburg-havel', label: 'Brandenburg an der Havel', subtitle: 'Brandenburg', modifier: { min: 120, max: 280 }, impact: 'Brandenburg an der Havel' },
      { id: 'cottbus', label: 'Cottbus', subtitle: 'Brandenburg', modifier: { min: 180, max: 360 }, impact: 'Cottbus' },
      { id: 'frankfurt-oder', label: 'Frankfurt (Oder)', subtitle: 'Brandenburg', modifier: { min: 160, max: 320 }, impact: 'Frankfurt (Oder)' },
      { id: 'oranienburg', label: 'Oranienburg', subtitle: 'Berlin surrounding area', modifier: { min: 80, max: 190 }, impact: 'Oranienburg' },
      { id: 'bernau', label: 'Bernau bei Berlin', subtitle: 'Berlin surrounding area', modifier: { min: 80, max: 190 }, impact: 'Bernau bei Berlin' },
      { id: 'falkensee', label: 'Falkensee', subtitle: 'Berlin surrounding area', modifier: { min: 80, max: 190 }, impact: 'Falkensee' },
      { id: 'koenigs-wusterhausen', label: 'Königs Wusterhausen', subtitle: 'Berlin surrounding area', modifier: { min: 90, max: 210 }, impact: 'Königs Wusterhausen' },
      { id: 'ludwigsfelde', label: 'Ludwigsfelde', subtitle: 'Berlin surrounding area', modifier: { min: 90, max: 210 }, impact: 'Ludwigsfelde' },
      { id: 'brandenburg', label: 'State of Brandenburg generally', subtitle: 'city entered manually', modifier: { min: 90, max: 240 }, impact: 'State of Brandenburg' },
      { id: 'outside', label: 'Outside core area - on request', subtitle: 'manual clarification', modifier: { min: 180, max: 420 }, impact: 'outside core area' },
    ],
    urgencyOptions: [
      { id: 'planned', label: 'Planned visit', subtitle: 'standard scheduling', modifier: { min: 0, max: 0 }, impact: 'planned visit' },
      { id: 'urgent', label: 'Urgent visit', subtitle: 'fast contact / appointment', modifier: { min: 160, max: 380 }, impact: 'urgent visit' },
    ],
  },
  tr: {
    eyebrow: 'Onarım maliyeti hesaplayıcı',
    title: 'Onarım maliyetini tahmin edin',
    intro:
      'Konstrüksiyon tipini, arızayı, servis bölgesini, erişimi ve boyutu seçin. Kart olası onarım için bağlayıcı olmayan bütçe aralığını hesaplar.',
    panelTitle: 'Parametreler',
    panelIntro: 'Temel bilgileri girin. Sağda bütçe aralığının ve servis türünün nasıl değiştiğini görürsünüz.',
    entityLabel: 'Konstrüksiyon tipi',
    reasonLabel: 'Arıza türü / belirti',
    locationLabel: 'Servis bölgesi',
    cardBadge: 'Teşhis kartı',
    cardTitle: 'Teşhis kartı',
    accessLabel: 'Erişim / montaj yüksekliği',
    sizeLabel: 'Yaklaşık tabela boyutu',
    widthLabel: 'Genişlik, m',
    heightLabel: 'Yükseklik, m',
    areaLabel: 'Hesaplanan alan',
    sizeHint: 'Boyut bilinmiyorsa yaklaşık girin. Değerlendirme ön bilgi olarak kalır.',
    urgencyLabel: 'Servis aciliyeti',
    budgetLabel: 'Bütçe yönlendirmesi',
    urgentBudgetLabel: 'Acil servis yönlendirmesi',
    repairLabel: 'Olası onarım yönlendirmesi',
    confidenceLabel: 'Çalışılabilir yönlendirme',
    confidenceLow: 'Çok kaba yönlendirme',
    confidenceMedium: 'Çalışılabilir yönlendirme',
    photoLabel: 'Yardımcı fotoğraflar',
    noteLabel: 'Önemli',
    disclaimer: 'Bağlayıcı olmayan ilk yönlendirme: bu teşhis kartı, süre ve bütçe bilgileri yalnızca bilgilendirme amaçlıdır. Bunlar sözleşme, bağlayıcı teklif veya bağlayıcı maliyet taahhüdü değildir. Bağlayıcı teklif ve kesin fiyat ancak fotoğraflar, adres, erişim ve malzemeler PixelRing tarafından kontrol edildikten ve ayrıca onaylandıktan sonra mümkündür.',
    ctaLabel: 'Teşhis iste',
    urgentCtaLabel: 'Acil servis iste',
    drawerTitle: 'Teşhis iste',
    drawerFormTitle: 'Teşhis ve onarım iste',
    drawerInfoLabel: 'Değerlendirme ve sonraki adım',
    drawerFormIntro: 'Seçilen bilgilerle talebi PixelRing uzmanlarına iletmek için iletişim bilgilerinizi girin.',
    closeLabel: 'Kapat',
    estimatePrefix: 'yaklaşık',
    customLocationPlaceholder: 'Şehir veya PLZ, örn. Berlin',
    estimateBasisText: 'Aralık konstrüksiyon tipi, arıza, servis bölgesi, erişim, boyut ve hasar kapsamına göre hesaplanır.',
    basePhotos: ['Tabela ve cephenin genel görünümü', 'Sorunlu alanın yakın planı', 'Yükseklik ve erişimi gösteren fotoğraf'],
    accessOptions: [
      { id: 'low', label: '3 m’ye kadar, merdivenle erişim', subtitle: 'standart erişim', modifier: { min: 0, max: 0 }, impact: 'standart erişim' },
      { id: 'mid', label: '3-6 m, platform olası', subtitle: 'erişim netleşmeli', modifier: { min: 90, max: 180 }, impact: 'platform olası' },
      { id: 'high', label: '6 m üstü veya zor erişim', subtitle: 'ayrı planlama gerekir', modifier: { min: 180, max: 360 }, impact: 'zor erişim' },
    ],
    constructions: [
      { id: 'facade', label: 'Cephe tabelası', subtitle: 'bina cephesindeki tabela', modifier: { min: 40, max: 140 }, impact: 'cephe tabelası' },
      { id: 'lightbox', label: 'Işıklı kutu tabela', subtitle: 'aydınlatmalı ön yüzlü kutu', modifier: { min: 30, max: 110 }, impact: 'ışıklı kutu' },
      { id: 'letters', label: 'Işıklı LED harfler', subtitle: 'tek harfler veya yazı', modifier: { min: 60, max: 180 }, impact: 'LED harfler' },
      { id: 'pylon', label: 'Pilon / çıkma tabela', subtitle: 'bağımsız veya dışa taşan konstrüksiyon', modifier: { min: 120, max: 280 }, impact: 'pilon / çıkma tabela' },
      { id: 'lightpanel', label: 'Akrilik ışıklı panel', subtitle: 'ince ışıklı panel', modifier: { min: 80, max: 220 }, impact: 'ışıklı panel' },
      { id: 'panel', label: 'Panel / ışıksız tabela', subtitle: 'baskı, folyo veya görünür yüzey', modifier: { min: 0, max: 80 }, impact: 'panel / ışıksız tabela' },
      { id: 'neon', label: 'Klasik neon', subtitle: 'cam tüpler ve yüksek voltaj', modifier: { min: 180, max: 420 }, impact: 'klasik neon' },
      { id: 'display', label: 'Dijital LED ekran', subtitle: 'ekran, kayan yazı veya LED screen', modifier: { min: 220, max: 520 }, impact: 'dijital LED ekran' },
      { id: 'unknown', label: 'Emin değilim', subtitle: 'obje tipi henüz belirsiz', modifier: { min: 80, max: 220 }, impact: 'tip belirsiz' },
    ],
    locations: [
      { id: 'berlin', label: 'Berlin - şehir alanı', subtitle: 'Berlin', modifier: { min: 0, max: 0 }, impact: 'Berlin şehir alanı' },
      { id: 'berlin-umland', label: 'Berlin çevresi', subtitle: 'Berlin çevre bölgesi', modifier: { min: 40, max: 120 }, impact: 'Berlin çevresi' },
      { id: 'potsdam', label: 'Potsdam', subtitle: 'Brandenburg', modifier: { min: 70, max: 160 }, impact: 'Potsdam' },
      { id: 'brandenburg-havel', label: 'Brandenburg an der Havel', subtitle: 'Brandenburg', modifier: { min: 120, max: 280 }, impact: 'Brandenburg an der Havel' },
      { id: 'cottbus', label: 'Cottbus', subtitle: 'Brandenburg', modifier: { min: 180, max: 360 }, impact: 'Cottbus' },
      { id: 'frankfurt-oder', label: 'Frankfurt (Oder)', subtitle: 'Brandenburg', modifier: { min: 160, max: 320 }, impact: 'Frankfurt (Oder)' },
      { id: 'oranienburg', label: 'Oranienburg', subtitle: 'Berlin çevresi', modifier: { min: 80, max: 190 }, impact: 'Oranienburg' },
      { id: 'bernau', label: 'Bernau bei Berlin', subtitle: 'Berlin çevresi', modifier: { min: 80, max: 190 }, impact: 'Bernau bei Berlin' },
      { id: 'falkensee', label: 'Falkensee', subtitle: 'Berlin çevresi', modifier: { min: 80, max: 190 }, impact: 'Falkensee' },
      { id: 'koenigs-wusterhausen', label: 'Königs Wusterhausen', subtitle: 'Berlin çevresi', modifier: { min: 90, max: 210 }, impact: 'Königs Wusterhausen' },
      { id: 'ludwigsfelde', label: 'Ludwigsfelde', subtitle: 'Berlin çevresi', modifier: { min: 90, max: 210 }, impact: 'Ludwigsfelde' },
      { id: 'brandenburg', label: 'Brandenburg eyaleti genel', subtitle: 'şehir manuel girilir', modifier: { min: 90, max: 240 }, impact: 'Brandenburg eyaleti' },
      { id: 'outside', label: 'Çekirdek alan dışında - talep üzerine', subtitle: 'manuel netleştirme', modifier: { min: 180, max: 420 }, impact: 'çekirdek alan dışında' },
    ],
    urgencyOptions: [
      { id: 'planned', label: 'Planlı servis', subtitle: 'normal planlama', modifier: { min: 0, max: 0 }, impact: 'planlı servis' },
      { id: 'urgent', label: 'Acil servis', subtitle: 'hızlı iletişim / randevu', modifier: { min: 160, max: 380 }, impact: 'acil servis' },
    ],
  },
  pl: {
    eyebrow: 'Kalkulator kosztów naprawy',
    title: 'Oszacuj koszt naprawy',
    intro:
      'Wybierz typ konstrukcji, usterkę, obszar obsługi, dostęp i rozmiar. Karta oblicza niewiążący zakres budżetu dla możliwej naprawy.',
    panelTitle: 'Parametry',
    panelIntro: 'Podaj najważniejsze dane. Po prawej zobaczysz, jak zmieniają się budżet i typ dojazdu.',
    entityLabel: 'Typ konstrukcji',
    reasonLabel: 'Rodzaj usterki / objaw',
    locationLabel: 'Obszar obsługi',
    cardBadge: 'Karta diagnostyczna',
    cardTitle: 'Karta diagnostyczna',
    accessLabel: 'Dostęp / wysokość montażu',
    sizeLabel: 'Przybliżony rozmiar szyldu',
    widthLabel: 'Szerokość, m',
    heightLabel: 'Wysokość, m',
    areaLabel: 'Powierzchnia obliczeniowa',
    sizeHint: 'Jeśli rozmiar nie jest znany, podaj wartość orientacyjną. Ocena pozostaje wstępna.',
    urgencyLabel: 'Pilność dojazdu',
    budgetLabel: 'Orientacyjny budżet',
    urgentBudgetLabel: 'Orientacja dla pilnego dojazdu',
    repairLabel: 'Możliwa orientacja naprawy',
    confidenceLabel: 'Robocza orientacja',
    confidenceLow: 'Bardzo ogólna orientacja',
    confidenceMedium: 'Robocza orientacja',
    photoLabel: 'Jakie zdjęcia pomogą',
    noteLabel: 'Ważne',
    disclaimer: 'Niewiążąca wstępna orientacja: ta karta diagnostyczna, terminy i zakres budżetu mają wyłącznie charakter informacyjny. Nie są umową, wiążącą ofertą ani wiążącym zobowiązaniem kosztowym. Wiążąca oferta i dokładna cena są możliwe dopiero po sprawdzeniu zdjęć, adresu, dostępu i materiałów oraz po osobnym potwierdzeniu przez PixelRing.',
    ctaLabel: 'Poproś o diagnostykę',
    urgentCtaLabel: 'Poproś o pilny dojazd',
    drawerTitle: 'Poproś o diagnostykę',
    drawerFormTitle: 'Poproś o diagnostykę i naprawę',
    drawerInfoLabel: 'Ocena i następny krok',
    drawerFormIntro: 'Podaj dane kontaktowe, aby przekazać zgłoszenie specjalistom PixelRing z wybranymi parametrami.',
    closeLabel: 'Zamknij',
    estimatePrefix: 'ok.',
    customLocationPlaceholder: 'Miasto lub PLZ, np. Berlin',
    estimateBasisText: 'Zakres wynika z typu konstrukcji, usterki, obszaru obsługi, dostępu, rozmiaru i zakresu defektu.',
    basePhotos: ['Widok ogólny szyldu i fasady', 'Zbliżenie problematycznego miejsca', 'Zdjęcie pokazujące wysokość i dostęp'],
    accessOptions: [
      { id: 'low', label: 'Do 3 m, dostęp z drabiny', subtitle: 'standardowy dostęp', modifier: { min: 0, max: 0 }, impact: 'standardowy dostęp' },
      { id: 'mid', label: '3-6 m, prawdopodobna platforma', subtitle: 'dostęp do ustalenia', modifier: { min: 90, max: 180 }, impact: 'platforma prawdopodobna' },
      { id: 'high', label: 'Powyżej 6 m lub trudny dostęp', subtitle: 'osobne planowanie', modifier: { min: 180, max: 360 }, impact: 'trudny dostęp' },
    ],
    constructions: [
      { id: 'facade', label: 'Szyld fasadowy', subtitle: 'szyld na fasadzie budynku', modifier: { min: 40, max: 140 }, impact: 'szyld fasadowy' },
      { id: 'lightbox', label: 'Kaseton świetlny', subtitle: 'kaseton z podświetlanym frontem', modifier: { min: 30, max: 110 }, impact: 'kaseton świetlny' },
      { id: 'letters', label: 'Podświetlane litery LED', subtitle: 'pojedyncze litery lub napis', modifier: { min: 60, max: 180 }, impact: 'litery LED' },
      { id: 'pylon', label: 'Pylon / szyld wysięgnikowy', subtitle: 'wolnostojący lub wystający', modifier: { min: 120, max: 280 }, impact: 'pylon / wysięgnik' },
      { id: 'lightpanel', label: 'Panel świetlny akrylowy', subtitle: 'płaski panel świetlny', modifier: { min: 80, max: 220 }, impact: 'panel świetlny' },
      { id: 'panel', label: 'Panel / tablica bez podświetlenia', subtitle: 'druk, folia lub widoczna powierzchnia', modifier: { min: 0, max: 80 }, impact: 'panel / tablica' },
      { id: 'neon', label: 'Klasyczny neon', subtitle: 'rurki szklane i wysokie napięcie', modifier: { min: 180, max: 420 }, impact: 'klasyczny neon' },
      { id: 'display', label: 'Cyfrowy ekran LED', subtitle: 'ekran, tekst przewijany lub LED screen', modifier: { min: 220, max: 520 }, impact: 'cyfrowy ekran LED' },
      { id: 'unknown', label: 'Nie wiem', subtitle: 'typ obiektu jest niejasny', modifier: { min: 80, max: 220 }, impact: 'typ niejasny' },
    ],
    locations: [
      { id: 'berlin', label: 'Berlin - obszar miasta', subtitle: 'Berlin', modifier: { min: 0, max: 0 }, impact: 'Berlin miasto' },
      { id: 'berlin-umland', label: 'Okolice Berlina', subtitle: 'obszar wokół Berlina', modifier: { min: 40, max: 120 }, impact: 'okolice Berlina' },
      { id: 'potsdam', label: 'Potsdam', subtitle: 'Brandenburgia', modifier: { min: 70, max: 160 }, impact: 'Potsdam' },
      { id: 'brandenburg-havel', label: 'Brandenburg an der Havel', subtitle: 'Brandenburgia', modifier: { min: 120, max: 280 }, impact: 'Brandenburg an der Havel' },
      { id: 'cottbus', label: 'Cottbus', subtitle: 'Brandenburgia', modifier: { min: 180, max: 360 }, impact: 'Cottbus' },
      { id: 'frankfurt-oder', label: 'Frankfurt (Oder)', subtitle: 'Brandenburgia', modifier: { min: 160, max: 320 }, impact: 'Frankfurt (Oder)' },
      { id: 'oranienburg', label: 'Oranienburg', subtitle: 'okolice Berlina', modifier: { min: 80, max: 190 }, impact: 'Oranienburg' },
      { id: 'bernau', label: 'Bernau bei Berlin', subtitle: 'okolice Berlina', modifier: { min: 80, max: 190 }, impact: 'Bernau bei Berlin' },
      { id: 'falkensee', label: 'Falkensee', subtitle: 'okolice Berlina', modifier: { min: 80, max: 190 }, impact: 'Falkensee' },
      { id: 'koenigs-wusterhausen', label: 'Königs Wusterhausen', subtitle: 'okolice Berlina', modifier: { min: 90, max: 210 }, impact: 'Königs Wusterhausen' },
      { id: 'ludwigsfelde', label: 'Ludwigsfelde', subtitle: 'okolice Berlina', modifier: { min: 90, max: 210 }, impact: 'Ludwigsfelde' },
      { id: 'brandenburg', label: 'Land Brandenburg ogólnie', subtitle: 'miasto wpisywane ręcznie', modifier: { min: 90, max: 240 }, impact: 'Land Brandenburg' },
      { id: 'outside', label: 'Poza obszarem głównym - na zapytanie', subtitle: 'ręczne ustalenie', modifier: { min: 180, max: 420 }, impact: 'poza obszarem głównym' },
    ],
    urgencyOptions: [
      { id: 'planned', label: 'Planowany dojazd', subtitle: 'standardowe planowanie', modifier: { min: 0, max: 0 }, impact: 'planowany dojazd' },
      { id: 'urgent', label: 'Pilny dojazd', subtitle: 'szybki kontakt / termin', modifier: { min: 160, max: 380 }, impact: 'pilny dojazd' },
    ],
  },
  ar: {
    eyebrow: 'حاسبة تكلفة الإصلاح',
    title: 'قدّر تكلفة الإصلاح',
    intro:
      'اختر نوع التركيب والعطل ومنطقة الخدمة وإمكانية الوصول والحجم. تحسب البطاقة نطاق ميزانية غير ملزم للإصلاح المحتمل.',
    panelTitle: 'المعطيات',
    panelIntro: 'أدخل أهم البيانات. في الجهة الأخرى ترى كيف يتغير نطاق الميزانية ونوع الزيارة.',
    entityLabel: 'نوع التركيب',
    reasonLabel: 'نوع العطل / العرض',
    locationLabel: 'منطقة الخدمة',
    cardBadge: 'بطاقة التشخيص',
    cardTitle: 'بطاقة التشخيص',
    accessLabel: 'الوصول / ارتفاع التركيب',
    sizeLabel: 'حجم اللافتة التقريبي',
    widthLabel: 'العرض، م',
    heightLabel: 'الارتفاع، م',
    areaLabel: 'المساحة المحسوبة',
    sizeHint: 'إذا كان الحجم غير معروف، أدخل قيمة تقريبية. يبقى التقييم أوليا.',
    urgencyLabel: 'أولوية الزيارة',
    budgetLabel: 'تقدير الميزانية',
    urgentBudgetLabel: 'تقدير الزيارة العاجلة',
    repairLabel: 'توجيه الإصلاح المحتمل',
    confidenceLabel: 'تقدير عملي',
    confidenceLow: 'تقدير تقريبي جدا',
    confidenceMedium: 'تقدير عملي',
    photoLabel: 'الصور المفيدة',
    noteLabel: 'مهم',
    disclaimer: 'تقدير أولي غير ملزم: بطاقة التشخيص هذه وتقدير الوقت ونطاق الميزانية هي معلومات إرشادية فقط. وهي ليست عقدا ولا عرضا ملزما ولا التزاما ملزما بالتكلفة. لا يكون العرض الملزم والسعر الدقيق ممكنين إلا بعد فحص الصور والعنوان وإمكانية الوصول والمواد وبعد تأكيد منفصل من PixelRing.',
    ctaLabel: 'طلب تشخيص',
    urgentCtaLabel: 'طلب زيارة عاجلة',
    drawerTitle: 'طلب تشخيص',
    drawerFormTitle: 'طلب تشخيص وإصلاح',
    drawerInfoLabel: 'التقييم والخطوة التالية',
    drawerFormIntro: 'أدخل بيانات التواصل لإرسال الطلب إلى مختصي PixelRing مع هذه المعطيات.',
    closeLabel: 'إغلاق',
    estimatePrefix: 'تقريبا',
    customLocationPlaceholder: 'المدينة أو الرمز البريدي، مثال Berlin',
    estimateBasisText: 'يعتمد النطاق على نوع التركيب، العطل، منطقة الخدمة، الوصول، الحجم ونطاق الضرر.',
    basePhotos: ['منظر عام للافتة والواجهة', 'لقطة قريبة لمنطقة المشكلة', 'صورة تظهر الارتفاع وإمكانية الوصول'],
    accessOptions: [
      { id: 'low', label: 'حتى 3 م، يمكن الوصول بسلم', subtitle: 'وصول عادي', modifier: { min: 0, max: 0 }, impact: 'وصول عادي' },
      { id: 'mid', label: '3-6 م، منصة محتملة', subtitle: 'يجب توضيح الوصول', modifier: { min: 90, max: 180 }, impact: 'منصة محتملة' },
      { id: 'high', label: 'أعلى من 6 م أو وصول صعب', subtitle: 'تخطيط منفصل', modifier: { min: 180, max: 360 }, impact: 'وصول صعب' },
    ],
    constructions: [
      { id: 'facade', label: 'لافتة واجهة', subtitle: 'لافتة مثبتة على واجهة المبنى', modifier: { min: 40, max: 140 }, impact: 'لافتة واجهة' },
      { id: 'lightbox', label: 'صندوق ضوئي', subtitle: 'صندوق بواجهة مضاءة', modifier: { min: 30, max: 110 }, impact: 'صندوق ضوئي' },
      { id: 'letters', label: 'حروف LED مضيئة', subtitle: 'حروف منفردة أو كلمة مضيئة', modifier: { min: 60, max: 180 }, impact: 'حروف LED' },
      { id: 'pylon', label: 'بايلون / لافتة بارزة', subtitle: 'تركيب قائم بذاته أو بارز', modifier: { min: 120, max: 280 }, impact: 'بايلون / لافتة بارزة' },
      { id: 'lightpanel', label: 'لوحة ضوئية أكريليك', subtitle: 'لوحة ضوئية مسطحة', modifier: { min: 80, max: 220 }, impact: 'لوحة ضوئية' },
      { id: 'panel', label: 'لوحة / لافتة غير مضاءة', subtitle: 'طباعة، فيلم أو سطح ظاهر', modifier: { min: 0, max: 80 }, impact: 'لوحة / لافتة غير مضاءة' },
      { id: 'neon', label: 'نيون كلاسيكي', subtitle: 'أنابيب زجاجية وجهد عال', modifier: { min: 180, max: 420 }, impact: 'نيون كلاسيكي' },
      { id: 'display', label: 'شاشة LED رقمية', subtitle: 'شاشة، نص متحرك أو LED screen', modifier: { min: 220, max: 520 }, impact: 'شاشة LED رقمية' },
      { id: 'unknown', label: 'غير متأكد', subtitle: 'نوع العنصر غير واضح بعد', modifier: { min: 80, max: 220 }, impact: 'النوع غير واضح' },
    ],
    locations: [
      { id: 'berlin', label: 'Berlin - منطقة المدينة', subtitle: 'Berlin', modifier: { min: 0, max: 0 }, impact: 'Berlin city area' },
      { id: 'berlin-umland', label: 'محيط Berlin', subtitle: 'المناطق حول Berlin', modifier: { min: 40, max: 120 }, impact: 'Berlin surrounding area' },
      { id: 'potsdam', label: 'Potsdam', subtitle: 'Brandenburg', modifier: { min: 70, max: 160 }, impact: 'Potsdam' },
      { id: 'brandenburg-havel', label: 'Brandenburg an der Havel', subtitle: 'Brandenburg', modifier: { min: 120, max: 280 }, impact: 'Brandenburg an der Havel' },
      { id: 'cottbus', label: 'Cottbus', subtitle: 'Brandenburg', modifier: { min: 180, max: 360 }, impact: 'Cottbus' },
      { id: 'frankfurt-oder', label: 'Frankfurt (Oder)', subtitle: 'Brandenburg', modifier: { min: 160, max: 320 }, impact: 'Frankfurt (Oder)' },
      { id: 'oranienburg', label: 'Oranienburg', subtitle: 'محيط Berlin', modifier: { min: 80, max: 190 }, impact: 'Oranienburg' },
      { id: 'bernau', label: 'Bernau bei Berlin', subtitle: 'محيط Berlin', modifier: { min: 80, max: 190 }, impact: 'Bernau bei Berlin' },
      { id: 'falkensee', label: 'Falkensee', subtitle: 'محيط Berlin', modifier: { min: 80, max: 190 }, impact: 'Falkensee' },
      { id: 'koenigs-wusterhausen', label: 'Königs Wusterhausen', subtitle: 'محيط Berlin', modifier: { min: 90, max: 210 }, impact: 'Königs Wusterhausen' },
      { id: 'ludwigsfelde', label: 'Ludwigsfelde', subtitle: 'محيط Berlin', modifier: { min: 90, max: 210 }, impact: 'Ludwigsfelde' },
      { id: 'brandenburg', label: 'ولاية Brandenburg عموما', subtitle: 'تتم كتابة المدينة يدويا', modifier: { min: 90, max: 240 }, impact: 'Land Brandenburg' },
      { id: 'outside', label: 'خارج المنطقة الأساسية - حسب الطلب', subtitle: 'توضيح يدوي', modifier: { min: 180, max: 420 }, impact: 'outside core area' },
    ],
    urgencyOptions: [
      { id: 'planned', label: 'زيارة مخططة', subtitle: 'تخطيط عادي', modifier: { min: 0, max: 0 }, impact: 'زيارة مخططة' },
      { id: 'urgent', label: 'زيارة عاجلة', subtitle: 'تواصل / موعد سريع', modifier: { min: 160, max: 380 }, impact: 'زيارة عاجلة' },
    ],
  },
};

const SCENARIOS_BY_CONSTRUCTION: Record<string, string[]> = {
  facade: ['no-light', 'flicker', 'rain-fail', 'mounting', 'film', 'led-zone'],
  lightbox: ['no-light', 'flicker', 'rain-fail', 'film', 'mounting'],
  letters: ['led-zone', 'flicker', 'rain-fail', 'mounting', 'no-light'],
  pylon: ['no-light', 'flicker', 'mounting', 'rain-fail', 'film'],
  lightpanel: ['no-light', 'flicker', 'film', 'rain-fail', 'mounting'],
  panel: ['film', 'mounting'],
  neon: ['no-light', 'flicker', 'mounting'],
  display: ['no-light', 'flicker', 'rain-fail', 'mounting'],
  unknown: ['no-light', 'flicker', 'rain-fail', 'film', 'mounting', 'led-zone'],
};

function normalizeLocale(locale: string): Locale {
  return locale === 'en' || locale === 'ru' || locale === 'tr' || locale === 'pl' || locale === 'ar'
    ? locale
    : 'de';
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
  const localeMap: Record<Locale, string> = {
    de: 'de-DE',
    en: 'en-US',
    ru: 'ru-RU',
    tr: 'tr-TR',
    pl: 'pl-PL',
    ar: 'ar',
  };

  return localeMap[locale];
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

  const priceRangeLabel = `${estimate.min.toLocaleString(numberLocale(normalizedLocale))}-${estimate.max.toLocaleString(numberLocale(normalizedLocale))} EUR`;
  const priceLabel = `${content.estimatePrefix} ${priceRangeLabel}`;
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
            <div className="rounded-[18px] border border-[#D9C7BA] bg-[#FFFDF9]/88 p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
              <h3 className="inline-flex rounded-full border border-[#D9C7BA] bg-[#F7F1E8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                {content.panelTitle}
              </h3>
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
                      className="absolute end-2 top-2 flex h-10 w-10 items-center justify-center rounded-[12px] text-[#B8643E]"
                    >
                      <span className={`block h-2 w-2 border-b-2 border-r-2 border-current transition ${openSelect === 'location' ? 'rotate-[225deg]' : 'rotate-45'}`} />
                    </button>
                  </div>
                  {openSelect === 'location' && (
                    <div className="absolute inset-x-0 top-[calc(100%+8px)] z-20 grid max-h-[310px] gap-1 overflow-y-auto rounded-[14px] border border-[#E7DDD3] bg-[#FFFDF9] p-2 shadow-[0_22px_60px_rgba(13,27,42,0.12)]">
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

            <div className="rounded-[18px] border border-[#D9C7BA] bg-[#FFFDF9] p-4 shadow-[0_20px_55px_rgba(13,27,42,0.12)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E7DDD3] pb-4">
                <div>
                  <span className="inline-flex rounded-full border border-[#D9C7BA] bg-[#F7F1E8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                    {content.cardBadge}
                  </span>
                  <p className="mt-1.5 max-w-2xl text-[13px] font-medium leading-5 text-[#526174]">
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
                    {content.accessOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === access.id}
                        onClick={() => setAccessId(option.id)}
                        className={`min-h-[46px] rounded-[10px] border px-3 py-2 text-start text-[12px] font-extrabold leading-4 transition ${
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
                        className="min-h-[44px] w-full rounded-[10px] border border-[#E7DDD3] bg-[#FFFAF4] px-3 text-[15px] font-bold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
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
                        className="min-h-[44px] w-full rounded-[10px] border border-[#E7DDD3] bg-[#FFFAF4] px-3 text-[15px] font-bold text-[#0D1B2A] outline-none transition focus:border-[#B8643E]/70 focus:ring-4 focus:ring-[#B8643E]/10"
                      />
                    </label>
                    <div className="rounded-[10px] border border-[#E7DDD3] bg-[#F7F1E8] px-3 py-2.5">
                      <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#6F7A8A]">
                        {content.areaLabel}
                      </span>
                      <strong className="mt-0.5 block text-[17px] font-black text-[#0E1A2B]">
                        <bdi dir="ltr">{areaLabel}</bdi>
                      </strong>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#6F7A8A]">{content.sizeHint}</p>
                </div>

                <div>
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                    {scenario.scopeLabel}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {scenario.scopes.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === scope.id}
                        onClick={() => setScopeId(option.id)}
                        className={`min-h-[46px] rounded-[10px] border px-3 py-2 text-start text-[12px] font-extrabold leading-4 transition ${
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
                  <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                    {content.urgencyLabel}
                  </span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {content.urgencyOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={option.id === urgency.id}
                        onClick={() => setUrgencyId(option.id)}
                        className={`min-h-[46px] rounded-[10px] border px-3 py-2 text-start text-[12px] font-extrabold leading-4 transition ${
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
                  <div className={`rounded-[12px] border p-4 text-white ${isUrgent ? 'border-[#0D1B2A] bg-[#17283B]' : 'border-[#E7DDD3] bg-[#0D1B2A]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-[0.13em] text-white/60">
                      {isUrgent ? content.urgentBudgetLabel : content.budgetLabel}
                    </span>
                    <strong className="mt-2 block text-[28px] font-black leading-none sm:text-[34px]">
                      <span>{content.estimatePrefix} </span>
                      <bdi dir="ltr">{priceRangeLabel}</bdi>
                    </strong>
                    <p className="mt-3 text-[13px] font-bold leading-5 text-white/76">
                      {content.estimateBasisText}
                    </p>
                    <div className="mt-3 rounded-[10px] bg-[#F7F1E8] px-3 py-2 text-[12px] font-black text-[#526174]">
                      <span className="me-2 inline-block h-2.5 w-2.5 rounded-full bg-[#2F8C67]" />
                      {construction.id === 'unknown' ? content.confidenceLow : confidenceLabel}
                    </div>
                  </div>

                  <div className="rounded-[12px] border border-[#E7DDD3] bg-white p-4">
                    <span className="block text-[10px] font-black uppercase tracking-[0.13em] text-[#6F7A8A]">
                      {content.repairLabel}
                    </span>
                    <p className="mt-2 text-[14px] font-black leading-6 text-[#0E1A2B]">{scenario.repair}</p>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#E7DDD3] bg-white p-4">
                  <span className="block text-[10px] font-black uppercase tracking-[0.13em] text-[#6F7A8A]">
                    {content.photoLabel}
                  </span>
                  <ul className="mt-2.5 grid gap-1.5">
                    {photoItems.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] font-bold leading-5 text-[#334155]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8643E]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[12px] border border-[#D9C7BA] bg-[#F7F1E8] p-3.5">
                  <span className="block text-[10px] font-black uppercase tracking-[0.13em] text-[#B8643E]">
                    {content.noteLabel}
                  </span>
                  <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#526174]">{content.disclaimer}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className={`inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-7 py-3 text-[14px] font-black text-white shadow-[0_16px_34px_rgba(184,100,62,0.24)] transition-all duration-300 active:scale-[0.98] ${
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
        <span className={`absolute end-5 top-6 h-2 w-2 border-b-2 border-r-2 border-[#B8643E] transition ${isOpen ? 'rotate-[225deg]' : 'rotate-45'}`} />
      </button>

      {isOpen && (
        <div
          id={`${id}-menu`}
          className="absolute inset-x-0 top-[calc(100%+8px)] z-20 grid max-h-[310px] gap-1 overflow-y-auto rounded-[14px] border border-[#E7DDD3] bg-[#FFFDF9] p-2 shadow-[0_22px_60px_rgba(13,27,42,0.12)]"
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
