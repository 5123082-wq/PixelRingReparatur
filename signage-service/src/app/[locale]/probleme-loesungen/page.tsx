import type { Metadata } from "next";
import type { CSSProperties } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CmsImage from "@/components/common/CmsImage";
import HeroBreadcrumbs from "@/components/common/HeroBreadcrumbs";
import SectionEyebrow from "@/components/common/SectionEyebrow";
import ProblemKnowledgeGrid from "@/components/probleme-loesungen/ProblemKnowledgeGrid";
import ProblemRequestButton from "@/components/probleme-loesungen/ProblemRequestButton";
import { type ProblemIntent } from "@/lib/content/problem-knowledge";
import {
  getGlobalPageCmsContent,
  getProblemeLoesungenPageCmsContent,
} from "@/lib/cms/pages";
import {
  getProblemArticlePublicSlug,
  getPublishedSymptomArticles,
} from "@/lib/cms/articles";
import { flattenArticleSelfRepairTips } from "@/lib/cms/article-self-repair";

/**
 * Maps CmsArticle.slug (set in the DB / Admin) to the card `id` used in this page.
 * The card `id` is the key in knowledgeBySlug so ProblemKnowledgeGrid can look it up.
 * To add a new language: same slugs work for all locales (slug is locale-agnostic).
 *
 * DB slugs (left) come from seed-cms-support-articles.mjs.
 * Card ids (right) come from the `problems` arrays in the CONTENT constant below.
 */
const SLUG_TO_PROBLEM_ID: Record<string, string> = {
  "no-light": "no-light",
  flicking: "flicker",
  "uneven-light": "uneven-led",
  "letter-out": "letter-out",
  "rain-fail": "rain-fail",
  "peeling-film": "peeling-film",
  "faded-film": "faded-film",
  "shaky-sign": "loose-sign",
  "urgent-repair": "urgent",
};

const CARD_CAUSE_TEXT_BY_LOCALE_AND_SLUG: Record<string, string> = {
  "ru:flicking":
    "Чаще всего проблема связана с нестабильным питанием: блоком питания, перегрузкой, слабым контактом, окислением, влагой или падением напряжения на линии. Если вывеска новая, блок питания мог быть подобран без запаса. Если вывеска старая, блок питания или соединения могли потерять стабильность со временем.",
};

type Locale = "de" | "en" | "ru" | "tr" | "pl" | "ar";

const HOME_BREADCRUMB_LABELS: Record<Locale, string> = {
  de: "Home",
  en: "Home",
  ru: "Главная",
  tr: "Ana sayfa",
  pl: "Strona główna",
  ar: "الرئيسية",
};

type ProblemCard = {
  id: string;
  intent: ProblemIntent;
  title: string;
  symptom: string;
  solution: string;
};

type Metric = {
  label: string;
  before: number;
  after: number;
};

type Faq = {
  question: string;
  answer: string;
};

type SolutionsContent = {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  heroTitle: string;
  heroIntro: string;
  heroTrust: string;
  primaryCta: string;
  secondaryCta: string;
  problemTitle: string;
  problemIntro: string;
  problemCta: string;
  problems: ProblemCard[];
  impactTitle: string;
  impactIntro: string;
  impactBefore: string;
  impactAfter: string;
  impactNote: string;
  metrics: Metric[];
  urgentTitle: string;
  urgentText: string;
  urgentPoints: string[];
  urgentCta: string;
  phoneCta: string;
  assessmentTitle: string;
  assessmentIntro: string;
  assessmentPoints: string[];
  seoTitle: string;
  seoParagraphs: string[];
  faqTitle: string;
  supportBridge: string;
  faqs: Faq[];
  finalEyebrow: string;
  finalTitle: string;
  finalText: string;
  heroEnabled?: boolean;
  problemEnabled?: boolean;
  impactEnabled?: boolean;
  urgentEnabled?: boolean;
  assessmentEnabled?: boolean;
  faqEnabled?: boolean;
  finalEnabled?: boolean;
};

const CONTENT: Record<Locale, SolutionsContent> = {
  de: {
    metaTitle:
      "Probleme mit Werbeanlagen? Typische Schäden & Lösungen | PixelRing",
    metaDescription:
      "Typische Probleme mit Werbeanlagen, LED-Schildern, Leuchtkästen, Folien und Beschriftungen erkennen und direkt an PixelRing übergeben.",
    badge: "Probleme & Lösungen",
    heroTitle: "Typische Probleme mit Werbeanlagen erkennen und richtig lösen",
    heroIntro:
      "Nicht sicher, ob es Elektrik, LED, Folie, Befestigung oder Witterungsschaden ist? Beschreiben Sie das sichtbare Problem oder senden Sie ein Foto. PixelRing prüft den nächsten sinnvollen Schritt.",
    heroTrust:
      "Eine Anfrage. Klare Einschätzung. Fachliche Umsetzung durch Spezialisten.",
    primaryCta: "Problem übergeben",
    secondaryCta: "Service starten",
    problemTitle: "Welche Situation passt zu Ihrem Problem?",
    problemIntro:
      "Wählen Sie den sichtbaren Zustand. Die erste Einordnung hilft, die Anfrage schneller und genauer anzugehen.",
    problemCta: "Problem übergeben",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Werbeanlage leuchtet nicht",
        symptom: "Die Anlage bleibt dunkel oder startet nur unzuverlässig.",
        solution:
          "PixelRing prüft typische Ursachen wie Stromversorgung, Netzteil, Anschluss, Feuchtigkeit und Steuerung.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Werbeanlage flackert",
        symptom:
          "Das Licht ist instabil, flackert, pulsiert oder fällt kurzzeitig aus.",
        solution:
          "PixelRing klärt, ob die Ursache beim Netzteil, Kontakt, Feuchtigkeit, Controller oder den LED-Modulen liegt.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "Ungleichmäßiges Leuchten der LEDs",
        symptom:
          "Einzelne Bereiche sind dunkler, fleckig oder deutlich anders hell.",
        solution:
          "Die Anlage wird auf Module, Zuleitung, Alterung und passende Reparatur- oder Austauschschritte geprüft.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Ein einzelner Buchstabe leuchtet nicht",
        symptom:
          "Nur ein Teil der Beschriftung oder ein Buchstabe ist ausgefallen.",
        solution:
          "PixelRing grenzt lokale Ursachen ein: Modul, Anschluss, Verdrahtung oder Elementzustand.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Werbeanlage schaltet nach Regen ab",
        symptom:
          "Nach Regen oder Feuchtigkeit kommt es zu Ausfall, Flackern oder Abschaltung.",
        solution:
          "Wir behandeln das als Hinweis auf Feuchtigkeit, Abdichtung, Korrosion oder elektrische Schutzabschaltung.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Folie an der Schaufensterfläche hat sich gelöst",
        symptom:
          "Beschriftung oder Folie löst sich, wirft Kanten oder haftet nicht mehr sauber.",
        solution:
          "PixelRing prüft Untergrund, Alterung, Haftung und ob Reinigung, Teilersatz oder Neufolierung sinnvoll ist.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "Folie ist ausgeblichen",
        symptom:
          "Farben wirken blass, ungleichmäßig oder nicht mehr markengerecht.",
        solution:
          "Wir klären, ob Auffrischung, Austausch oder eine neue Beschriftung sinnvoller ist.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "Werbeanlage wackelt",
        symptom:
          "Schild, Kasten oder Elemente wirken locker, schief oder unsicher.",
        solution:
          "Das ist ein Warnsignal. PixelRing klärt Befestigung, Unterkonstruktion und nächste Schritte.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "Dringende Reparatur der Werbeanlage",
        symptom:
          "Brandgeruch, Funken, Wasser, offene Leitungen, lose Teile oder Risiko für Passanten.",
        solution:
          "Abstand halten, Bereich freihalten und nur dann abschalten, wenn Schalter oder Sicherung sicher erreichbar sind.",
      },
    ],
    impactTitle: "Was sich nach der Behebung verbessern kann",
    impactIntro:
      "Die Werte sind keine Garantie, sondern zeigen typische Effekte, wenn sichtbare Defekte fachlich eingegrenzt und behoben werden.",
    impactBefore: "Vorher",
    impactAfter: "Nachher",
    impactNote:
      "Beispielhafte Darstellung, keine Umsatz- oder Ergebnisgarantie.",
    metrics: [
      {
        label: "Sichtbarkeit",
        before: 38,
        after: 86,
      },
      {
        label: "Standortwirkung",
        before: 44,
        after: 82,
      },
      {
        label: "Orientierung für Kunden",
        before: 51,
        after: 79,
      },
      {
        label: "Ausfallrisiko reduziert",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Wann ist eine dringende Reparatur nötig?",
    urgentText:
      "Bei Brandgeruch, Funkenbildung, losen Teilen, offenliegenden Leitungen, Sturmschäden oder Gefahr für Passanten sollte der Fall direkt gemeldet werden.",
    urgentPoints: [
      "Bei Gefahr Strom abschalten und Abstand halten.",
      "Keine elektrischen Teile öffnen oder Befestigungen selbst lösen.",
      "Fotos helfen, aber Sicherheit geht vor Dokumentation.",
    ],
    urgentCta: "Dringenden Fall melden",
    phoneCta: "Techniker anrufen",
    assessmentTitle: "Welche Angaben helfen bei der Einschätzung?",
    assessmentIntro:
      "Wenn Sie den Fachbegriff nicht kennen, reicht ein Foto und eine kurze Beschreibung. Diese Angaben helfen besonders:",
    assessmentPoints: [
      "ein oder mehrere Fotos der betroffenen Stelle",
      "kurz, was sich verändert hat",
      "Adresse, Stadt oder Region",
      "ob die Situation dringend wirkt",
      "Kontaktweg für Rückfragen",
    ],
    seoTitle: "Typische Schäden an Werbeanlagen richtig einordnen",
    seoParagraphs: [
      "Werbeanlagen, LED-Schilder und Leuchtkästen können aus sehr unterschiedlichen Gründen ausfallen. Häufig geht es um Stromversorgung, Netzteile, Controller, LED-Module, Transformatoren, Feuchtigkeit, Korrosion oder gealterte Anschlüsse.",
      "Auch sichtbare Branding-Probleme wie gelöste Folien, ausgeblichene Beschriftungen, beschädigte Buchstaben oder lockere Konstruktionsteile wirken sich direkt auf den Standortauftritt aus. Eine erste Fotoeinschätzung kann helfen, den Umfang einzugrenzen.",
      "PixelRing ist für Berlin und Brandenburg als Kerngebiet ausgerichtet. Weitere Regionen in Deutschland können je nach Aufgabe angefragt werden.",
    ],
    faqTitle: "Häufige Fragen zu Schäden und Reparatur",
    supportBridge: "Weitere Details bleiben im Support Center.",
    faqs: [
      {
        question: "Muss ich wissen, welche Technik verbaut ist?",
        answer:
          "Nein. Ein sichtbares Problem, Fotos und der Standort reichen für die erste Einordnung oft aus.",
      },
      {
        question:
          "Kann PixelRing ohne Prüfung sagen, ob repariert oder ersetzt wird?",
        answer:
          "Eine Empfehlung erfolgt nach Prüfung. Der erste Fokus liegt auf sinnvoller Reparatur und Instandsetzung.",
      },
      {
        question: "Soll ich bei elektrischen Problemen selbst prüfen?",
        answer:
          "Nein. Schalten Sie nur ab, wenn es gefahrlos möglich ist, und melden Sie den Fall direkt.",
      },
    ],
    finalEyebrow: "NEXT STEP",
    finalTitle: "Nicht sicher, welches Problem vorliegt?",
    finalText:
      "Senden Sie uns ein Foto oder beschreiben Sie kurz, was sichtbar ist. PixelRing prüft den Fall und klärt die nächsten sinnvollen Schritte.",
  },
  en: {
    metaTitle: "Signage Problems? Common Damage & Solutions | PixelRing",
    metaDescription:
      "Understand common signage, LED, lightbox, film, lettering and storefront branding problems and start a PixelRing request.",
    badge: "Problems & Solutions",
    heroTitle:
      "Recognize common signage problems and choose the right next step",
    heroIntro:
      "Not sure whether it is electrical, LED, film, mounting or weather damage? Describe the visible issue or send a photo. PixelRing checks the next sensible step.",
    heroTrust: "One request. Clear assessment. Specialist execution.",
    primaryCta: "Send the issue",
    secondaryCta: "Start service",
    problemTitle: "Which situation matches your problem?",
    problemIntro:
      "Start with what you can see. The first classification helps us handle your request faster.",
    problemCta: "Send the issue",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Sign does not light up",
        symptom: "The installation stays dark or starts unreliably.",
        solution:
          "PixelRing checks typical causes such as power supply, transformer, wiring, moisture and control units.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Sign flickers",
        symptom:
          "The light is unstable, flickers, pulses, or cuts out briefly.",
        solution:
          "PixelRing identifies whether the cause is the power supply, connections, moisture, controller or LED modules.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "Uneven LED brightness",
        symptom: "Some areas are darker, patchy or visibly different.",
        solution:
          "The system is checked for modules, supply lines, ageing and suitable repair or replacement steps.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "One letter is not lighting",
        symptom: "Only part of the lettering or one letter has failed.",
        solution:
          "PixelRing narrows down local causes such as module, connection, wiring or element condition.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Sign fails after rain",
        symptom:
          "After rain or moisture, the sign fails, flickers or switches off.",
        solution:
          "We treat this as a possible sign of moisture, sealing, corrosion or electrical protection shutdown.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Window film is peeling",
        symptom:
          "Lettering or film lifts at the edges or no longer adheres cleanly.",
        solution:
          "PixelRing checks substrate, ageing, adhesion and whether cleaning, partial replacement or new film is sensible.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "Film has faded",
        symptom: "Colors look weak, uneven or no longer match the brand.",
        solution:
          "We clarify whether refresh, replacement or a new branding setup makes more sense.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "Sign is loose",
        symptom: "The sign, box or elements look loose, crooked or unsafe.",
        solution:
          "This is a safety signal. PixelRing checks mounting, substructure and next steps.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "Urgent sign repair",
        symptom:
          "Burning smell, sparks, water, exposed wiring, loose parts or pedestrian risk.",
        solution:
          "Keep distance, keep the area clear and switch off only if a known switch or breaker is safely accessible.",
      },
    ],
    impactTitle: "What can improve after the issue is fixed",
    impactIntro:
      "These values are illustrative and show typical effects after visible defects are assessed and resolved.",
    impactBefore: "Before",
    impactAfter: "After",
    impactNote: "Illustrative example, not a revenue or performance guarantee.",
    metrics: [
      {
        label: "Visibility",
        before: 38,
        after: 86,
      },
      {
        label: "Location impression",
        before: 44,
        after: 82,
      },
      {
        label: "Customer orientation",
        before: 51,
        after: 79,
      },
      {
        label: "Reduced outage risk",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "When is an urgent repair needed?",
    urgentText:
      "Burning smell, sparks, loose parts, exposed wiring, storm damage or pedestrian risk should be reported directly.",
    urgentPoints: [
      "If there is danger, switch off the power and keep distance.",
      "Do not open electrical parts or loosen mounting yourself.",
      "Photos help, but safety comes first.",
    ],
    urgentCta: "Report urgent case",
    phoneCta: "Call technician",
    assessmentTitle: "What helps with the first assessment?",
    assessmentIntro:
      "If you do not know the technical term, a photo and short description are enough to start.",
    assessmentPoints: [
      "photos of the affected area",
      "what changed",
      "address, city or region",
      "whether it feels urgent",
      "preferred contact method",
    ],
    seoTitle: "Classifying common signage damage",
    seoParagraphs: [
      "Illuminated signs, LED signs and lightboxes can fail for many reasons: power supplies, controllers, modules, transformers, moisture, corrosion or aged connections.",
      "Visible branding issues such as peeling film, faded lettering, damaged letters or loose structural parts affect how a location is perceived. A first photo assessment can help narrow the scope.",
      "PixelRing focuses on Berlin and Brandenburg as its core area. Other German regions can be requested depending on the task.",
    ],
    faqTitle: "Frequently asked questions about damage and repair",
    supportBridge: "More details stay in the Support Center.",
    faqs: [
      {
        question: "Do I need to know the installed technology?",
        answer:
          "No. A visible issue, photos and the location are often enough for the first assessment.",
      },
      {
        question: "Can PixelRing say immediately whether to repair or replace?",
        answer:
          "A recommendation follows assessment. The first focus is sensible repair and restoration.",
      },
      {
        question: "Should I inspect electrical issues myself?",
        answer: "No. Switch off only if safe and report the case directly.",
      },
    ],
    finalEyebrow: "NEXT STEP",
    finalTitle: "Not sure what the problem is?",
    finalText:
      "Send a photo or briefly describe what is visible. PixelRing checks the case and clarifies the next sensible steps.",
  },
  ru: {
    metaTitle: "Проблемы с вывеской? Типовые повреждения и решения | PixelRing",
    metaDescription:
      "Типовые проблемы вывесок, LED, световых коробов, пленок и брендинга: понятная диагностика и заявка в PixelRing.",
    badge: "Проблемы и решения",
    heroTitle: "Типовые проблемы с вывесками и правильный следующий шаг",
    heroIntro:
      "Не знаете, это электрика, LED, пленка, крепление или повреждение после погоды? Опишите видимую проблему или отправьте фото. PixelRing подскажет следующий разумный шаг.",
    heroTrust:
      "Одна заявка. Понятная оценка. Выполнение профильными специалистами.",
    primaryCta: "Передать задачу",
    secondaryCta: "Запустить сервис",
    problemTitle: "Какая ситуация похожа на вашу?",
    problemIntro:
      "Начните с того, что видно. Такая классификация помогает быстрее обработать заявку.",
    problemCta: "Передать задачу",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Вывеска не светится",
        symptom: "Конструкция остается темной или включается нестабильно.",
        solution:
          "PixelRing проверяет типовые причины: питание, блок, подключение, влагу и управление.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Вывеска мерцает",
        symptom:
          "Свет работает нестабильно: мигает, пульсирует, кратковременно пропадает или меняет яркость. Иногда мерцает вся вывеска, иногда только одна буква, край или отдельный участок подсветки.",
        solution:
          "PixelRing уточняет, связана ли причина с питанием, контактами, влагой, контроллером или LED-модулями.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "LED светит неравномерно",
        symptom:
          "Отдельные зоны темнее, пятнами или заметно отличаются по яркости.",
        solution:
          "Проверяются модули, подводка, старение и целесообразность ремонта или замены.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Не светится отдельная буква",
        symptom: "Выпала часть надписи или один элемент.",
        solution:
          "PixelRing локализует возможную причину: модуль, соединение, проводка или состояние элемента.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Вывеска отключается после дождя",
        symptom: "После дождя появляются отключения, мерцание или сбои.",
        solution:
          "Это может указывать на влагу, герметичность, коррозию или защитное отключение.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Пленка на витрине отклеилась",
        symptom: "Надпись или пленка отходит по краям и выглядит неаккуратно.",
        solution:
          "PixelRing проверяет основание, старение, адгезию и выбирает чистку, частичную замену или новую оклейку.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "Пленка выгорела",
        symptom: "Цвета стали бледными, неровными или не соответствуют бренду.",
        solution:
          "Мы определяем, нужна ли локальная замена, обновление или новый брендированный слой.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "Вывеска шатается",
        symptom: "Световой короб, щит или элементы выглядят нестабильно.",
        solution:
          "Это сигнал безопасности. PixelRing проверяет крепления, основу и дальнейшие действия.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "Срочный ремонт вывески",
        symptom:
          "Запах гари, искры, вода, открытые провода, болтающиеся части или риск для прохожих.",
        solution:
          "Держитесь на расстоянии, освободите зону и отключайте только безопасно доступный выключатель или автомат.",
      },
    ],
    impactTitle: "Что может улучшиться после устранения проблемы",
    impactIntro:
      "Это не гарантия результата, а пример типичных эффектов после профессиональной оценки и ремонта.",
    impactBefore: "До",
    impactAfter: "После",
    impactNote:
      "Иллюстративный пример, без гарантии роста продаж или показателей.",
    metrics: [
      {
        label: "Видимость",
        before: 38,
        after: 86,
      },
      {
        label: "Впечатление от точки",
        before: 44,
        after: 82,
      },
      {
        label: "Ориентация клиентов",
        before: 51,
        after: 79,
      },
      {
        label: "Снижение риска отказа",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Когда ремонт считается срочным?",
    urgentText:
      "Запах гари, искры, открытые провода, болтающиеся элементы, последствия шторма или риск для прохожих нужно сообщать напрямую.",
    urgentPoints: [
      "При опасности отключите питание и держитесь на расстоянии.",
      "Не вскрывайте электрику и не снимайте крепления самостоятельно.",
      "Фото помогают, но безопасность важнее.",
    ],
    urgentCta: "Сообщить срочно",
    phoneCta: "Позвонить технику",
    assessmentTitle: "Какие данные помогут для оценки?",
    assessmentIntro:
      "Если вы не знаете технический термин, достаточно фото и короткого описания.",
    assessmentPoints: [
      "фото проблемного места",
      "что изменилось",
      "адрес, город или район",
      "насколько это срочно",
      "удобный способ связи",
    ],
    seoTitle: "Как понять типовые повреждения вывесок",
    seoParagraphs: [
      "Световые вывески, LED-конструкции и короба могут выходить из строя по разным причинам: питание, контроллеры, модули, трансформаторы, влага, коррозия или старые соединения.",
      "Визуальные проблемы брендинга: отклеившаяся пленка, выгоревшие цвета, поврежденные буквы или нестабильные крепления прямо влияют на восприятие объекта. Фото помогает быстрее оценить объем.",
      "Основной регион PixelRing - Берлин и Бранденбург. Другие регионы Германии можно согласовать по запросу.",
    ],
    faqTitle: "Частые вопросы о повреждениях и ремонте",
    supportBridge: "Подробные материалы остаются в Support Center.",
    faqs: [
      {
        question: "Нужно ли знать технические детали?",
        answer:
          "Нет. Видимая проблема, фото и адрес часто достаточны для первичной оценки.",
      },
      {
        question: "Можно сразу понять, ремонт или замена?",
        answer:
          "Рекомендация дается после проверки. Первый фокус - разумный ремонт и восстановление.",
      },
      {
        question: "Можно ли самому проверить электрику?",
        answer:
          "Нет. Отключайте только если безопасно, и сразу сообщайте о проблеме.",
      },
    ],
    finalEyebrow: "СЛЕДУЮЩИЙ ШАГ",
    finalTitle: "Не уверены, какая именно проблема?",
    finalText:
      "Отправьте фото или коротко опишите, что видно. PixelRing проверит случай и уточнит следующие шаги.",
  },
  tr: {
    metaTitle: "Tabela Sorunları? Tipik Hasarlar ve Çözümler | PixelRing",
    metaDescription:
      "Tabela, LED, ışıklı kutu, folyo ve vitrin markalama sorunlarını anlayın ve PixelRing talebi başlatın.",
    badge: "Sorunlar ve Çözümler",
    heroTitle: "Tabela sorunlarını tanımlayın ve doğru sonraki adımı seçin",
    heroIntro:
      "Sorun elektrik, LED, folyo, montaj veya hava koşulu hasarı mı emin değil misiniz? Görünen sorunu anlatın veya fotoğraf gönderin. PixelRing mantıklı sonraki adımı inceler.",
    heroTrust: "Tek talep. Net değerlendirme. Uzman uygulama.",
    primaryCta: "Sorunu ilet",
    secondaryCta: "Servisi başlat",
    problemTitle: "Hangi durum sorununuzla eşleşiyor?",
    problemIntro:
      "Gördüğünüz belirtiyle başlayın. İlk sınıflandırma talebin daha hızlı ele alınmasına yardım eder.",
    problemCta: "Sorunu ilet",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Tabela yanmıyor",
        symptom: "Sistem karanlık kalıyor veya güvenilir şekilde çalışmıyor.",
        solution:
          "PixelRing güç kaynağı, bağlantı, nem, kontrol ve benzeri tipik nedenleri inceler.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Tabela titriyor",
        symptom: "Işık kararsız, titriyor veya kısa süreli kesiliyor.",
        solution:
          "LED modulleri, güç kaynakları, kontrol üniteleri, temaslar veya nem olasiligi netlestirilir.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "LED ışığı düzensiz",
        symptom: "Bazı alanlar daha koyu, lekeli veya farklı parlaklıkta.",
        solution:
          "Moduller, hatlar, eskime ve uygun onarım ya da değişim adımları kontrol edilir.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Tek harf yanmıyor",
        symptom: "Yazının bir kısmı veya tek bir harf arızalı.",
        solution:
          "PixelRing modul, bağlantı, kablo veya eleman durumunu yerel olarak daraltir.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Yağmurdan sonra kapanıyor",
        symptom:
          "Yağmur veya nemden sonra arıza, titreme ya da kapanma oluyor.",
        solution:
          "Bu nem, sızdırmazlık, korozyon veya elektrik koruma kapanması belirtisi olabilir.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Vitrin folyosu kalktı",
        symptom: "Yazi veya folyo kenarlardan kalkiyor ve temiz durmuyor.",
        solution:
          "Zemin, eskime, yapışma ve temizlik, kısmi değişim veya yeni folyo ihtiyacı incelenir.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "Folyo soldu",
        symptom: "Renkler zayif, düzensiz veya markaya uygun değil.",
        solution:
          "Yenileme, değişim veya yeni markalama katmani daha mantıklı mi netlestirilir.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "Tabela sallaniyor",
        symptom: "Tabela, kutu veya elemanlar gevşek ya da güvensiz görünüyor.",
        solution:
          "Bu bir güvenlik işaretidir. PixelRing montaj, alt konstrüksiyon ve sonraki adımları inceler.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "Acil onarım gerekli",
        symptom:
          "Yanık kokusu, kıvılcım, gevşek parca, açık kablo veya yayalar için risk.",
        solution:
          "Tehlike varsa elektriği kapatın, mesafe bırakın ve doğrudan iletişime geçin. Kendi kendinize onarmaya çalışmayın.",
      },
    ],
    impactTitle: "Sorun giderildikten sonra ne iyileşebilir",
    impactIntro:
      "Bu degerler garanti değil, görünen kusurlar değerlendirilip giderildiğinde tipik etkileri gösterir.",
    impactBefore: "Önce",
    impactAfter: "Sonra",
    impactNote: "Örnek gösterimdir, ciro veya performans garantisi değildir.",
    metrics: [
      {
        label: "Görünürlük",
        before: 38,
        after: 86,
      },
      {
        label: "Konum etkisi",
        before: 44,
        after: 82,
      },
      {
        label: "Müşteri yönlendirme",
        before: 51,
        after: 79,
      },
      {
        label: "Arıza riski azalir",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Ne zaman acil onarım gerekir?",
    urgentText:
      "Yanık kokusu, kıvılcım, açık kablo, gevşek parca, fırtına hasarı veya yayalar için risk doğrudan bildirilmelidir.",
    urgentPoints: [
      "Tehlike varsa elektriği kapatın ve mesafe bırakın.",
      "Elektrik parçaları açmayın veya montajı kendiniz gevşetmeyin.",
      "Fotoğraf yardımcı olur, fakat güvenlik önce gelir.",
    ],
    urgentCta: "Acil durum bildir",
    phoneCta: "Teknisyeni ara",
    assessmentTitle: "İlk değerlendirme için ne yardımcı olur?",
    assessmentIntro:
      "Teknik terimi bilmiyorsanız fotograf ve kısa açıklama başlamak için yeterlidir.",
    assessmentPoints: [
      "sorunlu alan fotoğrafları",
      "ne değişti",
      "adres, şehir veya bölge",
      "aciliyet",
      "iletişim yolu",
    ],
    seoTitle: "Tabela hasarlarını doğru sınıflandırma",
    seoParagraphs: [
      "Işıklı tabelalar, LED tabelalar ve ışıklı kutular güç kaynakları, kontrol üniteleri, moduller, transformatörler, nem, korozyon veya eski bağlantılar nedeniyle arızalanabilir.",
      "Kalkan folyo, solan yazi, hasarli harfler veya gevşek parcalar gibi gorunen markalama sorunlari konum algısını etkiler. İlk fotoğraf değerlendirmesi kapsam belirlemeye yardim eder.",
      "PixelRing icin ana bölge Berlin ve Brandenburg'dur. Almanya icindeki diğer bölgeler göreve göre talep edilebilir.",
    ],
    faqTitle: "Hasar ve onarim hakkında sık sorular",
    supportBridge: "Daha fazla detay Support Center içinde kalır.",
    faqs: [
      {
        question: "Kurulu teknolojiyi bilmem gerekiyor mu?",
        answer:
          "Hayir. Görünen sorun, fotograf ve konum ilk degerlendirme için genellikle yeterlidir.",
      },
      {
        question: "Onarim mi değişim mi hemen belli olur mu?",
        answer:
          "Öneri incelemeden sonra verilir. İlk odak mantıklı onarim ve yenilemedir.",
      },
      {
        question: "Elektrik sorununu kendim kontrol etmeli miyim?",
        answer: "Hayir. Sadece güvenliyse kapatın ve durumu doğrudan bildirin.",
      },
    ],
    finalEyebrow: "SONRAKİ ADIM",
    finalTitle: "Sorunun ne olduğundan emin değil misiniz?",
    finalText:
      "Fotoğraf gönderin veya gorunen durumu kisaca anlatın. PixelRing sonraki mantıklı adımları netleştirir.",
  },
  pl: {
    metaTitle:
      "Problemy z reklamą? Typowe uszkodzenia i rozwiązania | PixelRing",
    metaDescription:
      "Typowe problemy szyldów, LED, kasetonów, folii i brandingu witryn oraz szybka ścieżka zgłoszenia do PixelRing.",
    badge: "Problemy i rozwiązania",
    heroTitle:
      "Rozpoznaj typowe problemy z reklamą i wybierz właściwy kolejny krok",
    heroIntro:
      "Nie wiesz, czy chodzi o elektrykę, LED, folię, mocowanie czy skutki pogody? Opisz widoczny problem albo wyślij zdjęcie. PixelRing sprawdzi następny sensowny krok.",
    heroTrust: "Jedno zgłoszenie. Jasna ocena. Wykonanie przez specjalistów.",
    primaryCta: "Przekaż zgłoszenie",
    secondaryCta: "Rozpocznij serwis",
    problemTitle: "Która sytuacja pasuje do Twojego problemu?",
    problemIntro:
      "Zacznij od tego, co widać. Pierwsza klasyfikacja pomaga szybciej obsłużyć zgłoszenie.",
    problemCta: "Przekaż zgłoszenie",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "Reklama nie świeci",
        symptom: "Instalacja pozostaje ciemna albo uruchamia się niestabilnie.",
        solution:
          "PixelRing sprawdza typowe przyczyny: zasilanie, moduł, połączenia, wilgoć i sterowanie.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "Reklama miga",
        symptom: "Światło jest niestabilne, miga albo chwilowo zanika.",
        solution:
          "Wyjaśniamy, czy rolę grają moduły LED, zasilacze, kontrolery, styki albo wilgoć.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "LED świeci nierówno",
        symptom:
          "Część obszarów jest ciemniejsza, plamista lub ma inną jasność.",
        solution:
          "Sprawdzane są moduły, przewody, starzenie i sensowne kroki naprawy lub wymiany.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "Pojedyncza litera nie świeci",
        symptom: "Nie działa tylko część napisu albo jedna litera.",
        solution:
          "PixelRing zawęża lokalne przyczyny: moduł, połączenie, okablowanie lub stan elementu.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "Reklama wyłącza się po deszczu",
        symptom:
          "Po deszczu lub wilgoci pojawiają się awarie, miganie lub wyłączenia.",
        solution:
          "Może to wskazywać na wilgoć, uszczelnienie, korozję lub zabezpieczenie elektryczne.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "Folia na witrynie odkleja się",
        symptom:
          "Napis lub folia odchodzi na krawędziach i wygląda nieestetycznie.",
        solution:
          "Sprawdzamy podłoże, starzenie, przyczepność i czy lepsze jest czyszczenie, częściowa wymiana czy nowa folia.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "Folia wyblakła",
        symptom: "Kolory są słabe, nierówne albo nie pasują już do marki.",
        solution:
          "Ustalamy, czy sens ma odświeżenie, wymiana lub nowa warstwa brandingu.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "Reklama się rusza",
        symptom:
          "Szyld, kaseton albo elementy wyglądają na luźne lub niebezpieczne.",
        solution:
          "To sygnał bezpieczeństwa. PixelRing sprawdza mocowanie, podkonstrukcję i kolejne kroki.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "Potrzebna pilna naprawa",
        symptom:
          "Zapach spalenizny, iskry, luźne części, odkryte przewody lub ryzyko dla pieszych.",
        solution:
          "W razie zagrożenia odłącz zasilanie, zachowaj odstęp i skontaktuj się bezpośrednio. Nie naprawiaj samodzielnie.",
      },
    ],
    impactTitle: "Co może się poprawić po usunięciu problemu",
    impactIntro:
      "To nie gwarancja, lecz przykład typowych efektów po fachowej ocenie i usunięciu widocznych usterek.",
    impactBefore: "Przed",
    impactAfter: "Po",
    impactNote: "Przykład ilustracyjny, bez gwarancji sprzedaży lub wyników.",
    metrics: [
      {
        label: "Widoczność",
        before: 38,
        after: 86,
      },
      {
        label: "Wrażenie miejsca",
        before: 44,
        after: 82,
      },
      {
        label: "Orientacja klientów",
        before: 51,
        after: 79,
      },
      {
        label: "Mniejsze ryzyko awarii",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "Kiedy naprawa jest pilna?",
    urgentText:
      "Zapach spalenizny, iskry, luźne elementy, odsłonięte przewody, szkody po burzy lub ryzyko dla pieszych należy zgłosić bezpośrednio.",
    urgentPoints: [
      "W razie zagrożenia odłącz zasilanie i zachowaj odstęp.",
      "Nie otwieraj części elektrycznych i nie luzuj mocowań samodzielnie.",
      "Zdjęcia pomagają, ale bezpieczeństwo jest ważniejsze.",
    ],
    urgentCta: "Zgłoś pilną sprawę",
    phoneCta: "Zadzwoń do technika",
    assessmentTitle: "Co pomaga w pierwszej ocenie?",
    assessmentIntro:
      "Jeśli nie znasz terminu technicznego, wystarczy zdjęcie i krótki opis.",
    assessmentPoints: [
      "zdjęcia uszkodzonego miejsca",
      "co się zmieniło",
      "adres, miasto lub region",
      "czy sprawa jest pilna",
      "preferowany kontakt",
    ],
    seoTitle: "Jak rozpoznać typowe uszkodzenia reklam",
    seoParagraphs: [
      "Reklamy świetlne, szyldy LED i kasetony mogą przestać działać z wielu powodów: zasilacze, kontrolery, moduły, transformatory, wilgoć, korozja albo stare połączenia.",
      "Widoczne problemy brandingu, jak odklejona folia, wyblakłe napisy, uszkodzone litery lub luźne części, wpływają na odbiór lokalizacji. Pierwsza ocena ze zdjęcia pomaga określić zakres.",
      "Główny obszar PixelRing to Berlin i Brandenburgia. Inne regiony Niemiec są możliwe po zapytaniu, zależnie od zadania.",
    ],
    faqTitle: "Częste pytania o uszkodzenia i naprawę",
    supportBridge: "Szczegóły pozostają w Support Center.",
    faqs: [
      {
        question: "Czy muszę znać technologię instalacji?",
        answer:
          "Nie. Widoczny problem, zdjęcia i lokalizacja zwykle wystarczają do pierwszej oceny.",
      },
      {
        question: "Czy od razu wiadomo, czy naprawiać czy wymieniać?",
        answer:
          "Rekomendacja jest po sprawdzeniu. Najpierw patrzymy na sensowną naprawę i odtworzenie.",
      },
      {
        question: "Czy samodzielnie sprawdzać elektrykę?",
        answer:
          "Nie. Wyłącz tylko jeśli to bezpieczne i zgłoś przypadek bezpośrednio.",
      },
    ],
    finalEyebrow: "NASTĘPNY KROK",
    finalTitle: "Nie wiesz, jaki to problem?",
    finalText:
      "Wyślij zdjęcie albo krótko opisz, co widać. PixelRing sprawdzi przypadek i wyjaśni kolejne sensowne kroki.",
  },
  ar: {
    metaTitle: "مشكلات اللوحات؟ أضرار شائعة وحلول | PixelRing",
    metaDescription:
      "تعرف على مشكلات اللوحات المضيئة و LED والفويل والكتابات وابدأ طلبا واضحا مع PixelRing.",
    badge: "المشكلات والحلول",
    heroTitle: "تعرّف على مشكلات اللوحات الإعلانية واختر الخطوة الصحيحة",
    heroIntro:
      "لست متأكدا هل المشكلة كهرباء أو LED أو فويل أو تثبيت أو ضرر بسبب الطقس؟ صف المشكلة الظاهرة أو أرسل صورة. PixelRing يراجع الخطوة الأنسب.",
    heroTrust: "طلب واحد. تقييم واضح. تنفيذ بواسطة مختصين.",
    primaryCta: "أرسل المشكلة",
    secondaryCta: "ابدأ الخدمة",
    problemTitle: "أي حالة تشبه مشكلتك؟",
    problemIntro: "ابدأ بما تراه. هذا يساعد على توجيه الطلب بسرعة وبشكل أوضح.",
    problemCta: "أرسل المشكلة",
    problems: [
      {
        id: "no-light",
        intent: "sign-not-lighting",
        title: "اللوحة لا تضيء",
        symptom: "اللوحة تبقى مظلمة أو تعمل بشكل غير مستقر.",
        solution:
          "PixelRing يراجع أسبابا شائعة مثل التغذية، وحدة الطاقة، التوصيل، الرطوبة والتحكم.",
      },
      {
        id: "flicker",
        intent: "flickering-light",
        title: "اللوحة تومض",
        symptom: "الإضاءة غير مستقرة أو تنقطع لفترات قصيرة.",
        solution:
          "نوضح هل السبب قد يكون وحدات LED أو مزودات الطاقة أو المتحكمات أو نقاط التلامس أو الرطوبة.",
      },
      {
        id: "uneven-led",
        intent: "uneven-led-light",
        title: "إضاءة LED غير متساوية",
        symptom: "بعض المناطق أغمق أو مختلفة بوضوح.",
        solution:
          "يتم فحص الوحدات والتغذية والتقادم وخطوات الإصلاح أو الاستبدال المناسبة.",
      },
      {
        id: "letter-out",
        intent: "letter-not-lighting",
        title: "حرف واحد لا يضيء",
        symptom: "جزء من الكتابة أو حرف واحد فقط متوقف.",
        solution:
          "PixelRing يحدد السبب المحلي مثل الوحدة أو التوصيل أو الأسلاك أو حالة العنصر.",
      },
      {
        id: "rain-fail",
        intent: "rain-failure",
        title: "اللوحة تتوقف بعد المطر",
        symptom: "بعد المطر أو الرطوبة تظهر أعطال أو وميض أو توقف.",
        solution: "قد يشير ذلك إلى رطوبة أو عزل أو تآكل أو فصل حماية كهربائية.",
      },
      {
        id: "peeling-film",
        intent: "peeling-film",
        title: "الفويل على الواجهة انفصل",
        symptom: "الفويل أو الكتابة تنفصل من الحواف ولا تبدو نظيفة.",
        solution:
          "نفحص السطح والتقادم والالتصاق وهل الأنسب تنظيف أو استبدال جزئي أو فويل جديد.",
      },
      {
        id: "faded-film",
        intent: "faded-film",
        title: "الفويل باهت",
        symptom: "الألوان ضعيفة أو غير متساوية أو لا تناسب العلامة.",
        solution:
          "نوضح هل التحديث أو الاستبدال أو طبقة براندينغ جديدة هو الخيار الأنسب.",
      },
      {
        id: "loose-sign",
        intent: "loose-sign",
        title: "اللوحة تتحرك",
        symptom: "اللوحة أو الصندوق أو العناصر تبدو غير ثابتة أو غير آمنة.",
        solution:
          "هذه إشارة سلامة. PixelRing يراجع التثبيت والبنية والخطوات التالية.",
      },
      {
        id: "urgent",
        intent: "urgent-safety-risk",
        title: "إصلاح عاجل مطلوب",
        symptom:
          "رائحة احتراق، شرر، أجزاء مفكوكة، أسلاك مكشوفة أو خطر على المارة.",
        solution:
          "عند وجود خطر، افصل التيار وابتعد عن الموقع وتواصل مباشرة. لا تحاول الإصلاح بنفسك.",
      },
    ],
    impactTitle: "ما الذي قد يتحسن بعد حل المشكلة",
    impactIntro:
      "هذه القيم توضيحية وليست ضمانا، وتعرض آثارا شائعة بعد تقييم العطل الظاهر ومعالجته.",
    impactBefore: "قبل",
    impactAfter: "بعد",
    impactNote: "عرض توضيحي وليس ضمانا للمبيعات أو الأداء.",
    metrics: [
      {
        label: "الوضوح البصري",
        before: 38,
        after: 86,
      },
      {
        label: "انطباع الموقع",
        before: 44,
        after: 82,
      },
      {
        label: "توجيه العملاء",
        before: 51,
        after: 79,
      },
      {
        label: "تقليل خطر التعطل",
        before: 32,
        after: 74,
      },
    ],
    urgentTitle: "متى يكون الإصلاح عاجلا؟",
    urgentText:
      "رائحة الاحتراق، الشرر، الأجزاء المفكوكة، الأسلاك المكشوفة، أضرار العاصفة أو خطر المارة يجب الإبلاغ عنها مباشرة.",
    urgentPoints: [
      "عند وجود خطر، افصل التيار وابتعد عن الموقع.",
      "لا تفتح أجزاء كهربائية ولا تفك التثبيت بنفسك.",
      "الصور تساعد، لكن السلامة أولا.",
    ],
    urgentCta: "بلّغ عن حالة عاجلة",
    phoneCta: "الاتصال بالفني",
    assessmentTitle: "ما المعلومات المفيدة للتقييم الأول؟",
    assessmentIntro:
      "إذا كنت لا تعرف المصطلح الفني، تكفي صورة ووصف قصير للبدء.",
    assessmentPoints: [
      "صور للمنطقة المتأثرة",
      "ما الذي تغير",
      "العنوان أو المدينة أو المنطقة",
      "هل الحالة عاجلة",
      "طريقة التواصل المفضلة",
    ],
    seoTitle: "تصنيف الأضرار الشائعة في اللوحات",
    seoParagraphs: [
      "قد تتعطل اللوحات المضيئة و LED وصناديق الإضاءة بسبب مزودات الطاقة، المتحكمات، الوحدات، المحولات، الرطوبة، التآكل أو التوصيلات القديمة.",
      "مشكلات البراندينغ الظاهرة مثل فويل منفصل، ألوان باهتة، حروف متضررة أو أجزاء غير ثابتة تؤثر على صورة الموقع. التقييم الأولي بالصورة يساعد على تحديد النطاق.",
      "المنطقة الأساسية لـ PixelRing هي برلين وبراندنبورغ. يمكن طلب مناطق أخرى في ألمانيا حسب المهمة.",
    ],
    faqTitle: "أسئلة شائعة حول الأضرار والإصلاح",
    supportBridge: "التفاصيل الإضافية تبقى في Support Center.",
    faqs: [
      {
        question: "هل يجب أن أعرف التقنية المستخدمة؟",
        answer: "لا. المشكلة الظاهرة والصور والموقع غالبا تكفي للتقييم الأول.",
      },
      {
        question: "هل يمكن معرفة الإصلاح أو الاستبدال فورا؟",
        answer:
          "التوصية تأتي بعد الفحص. التركيز الأول هو الإصلاح والاستعادة عندما يكون ذلك منطقيا.",
      },
      {
        question: "هل أفحص المشكلة الكهربائية بنفسي؟",
        answer:
          "لا. عند وجود خطر، افصل التيار وابتعد عن الموقع وبلّغ عن الحالة مباشرة.",
      },
    ],
    finalEyebrow: "الخطوة التالية",
    finalTitle: "لست متأكدا ما هي المشكلة؟",
    finalText:
      "أرسل صورة أو صف بإيجاز ما هو ظاهر. PixelRing يراجع الحالة ويوضح الخطوات التالية.",
  },
};

function getContent(locale: string): SolutionsContent {
  return CONTENT[(locale as Locale) in CONTENT ? (locale as Locale) : "de"];
}

function getLocale(locale: string): Locale {
  return (locale in CONTENT ? locale : "de") as Locale;
}

function getPageBreadcrumbs(locale: Locale, label: string) {
  return [
    {
      label: HOME_BREADCRUMB_LABELS[locale],
      href: "/",
    },
    {
      label,
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(locale);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `/${locale}/probleme-loesungen`,
    },
  };
}

export default async function ProblemeLoesungenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = getLocale(locale);
  const baseContent = getContent(locale);
  const [globalCms, cmsContent, symptomArticles] = await Promise.all([
    getGlobalPageCmsContent(locale),
    getProblemeLoesungenPageCmsContent(locale),
    getPublishedSymptomArticles(locale),
  ]);
  const content: SolutionsContent = {
    ...baseContent,
    heroTitle: cmsContent?.hero?.title ?? baseContent.heroTitle,
    heroIntro: cmsContent?.hero?.description ?? baseContent.heroIntro,
    heroTrust: cmsContent?.hero?.trust ?? baseContent.heroTrust,
    badge: cmsContent?.hero?.badge ?? baseContent.badge,
    primaryCta: cmsContent?.hero?.cta ?? baseContent.primaryCta,
    secondaryCta: cmsContent?.hero?.secondaryCta ?? baseContent.secondaryCta,

    problemTitle: cmsContent?.problems?.title ?? baseContent.problemTitle,
    problemIntro: cmsContent?.problems?.description ?? baseContent.problemIntro,
    problemCta: cmsContent?.problems?.cta ?? baseContent.problemCta,

    impactTitle: cmsContent?.impact?.title ?? baseContent.impactTitle,
    impactIntro: cmsContent?.impact?.description ?? baseContent.impactIntro,

    urgentTitle: cmsContent?.urgent?.title ?? baseContent.urgentTitle,
    urgentText: cmsContent?.urgent?.description ?? baseContent.urgentText,
    urgentPoints:
      (cmsContent?.urgent?.items as string[]) ?? baseContent.urgentPoints,
    urgentCta: cmsContent?.urgent?.cta ?? baseContent.urgentCta,

    faqTitle: cmsContent?.faq?.title ?? baseContent.faqTitle,
    faqs: cmsContent?.faq?.items?.length
      ? cmsContent.faq.items.map((item) => ({
          question: item.question ?? item.title ?? "",
          answer: item.answer ?? item.description ?? "",
        }))
      : baseContent.faqs,

    finalTitle: cmsContent?.final?.title ?? baseContent.finalTitle,
    finalText: cmsContent?.final?.description ?? baseContent.finalText,
    heroEnabled: cmsContent?.hero?.enabled,
    problemEnabled: cmsContent?.problems?.enabled,
    impactEnabled: cmsContent?.impact?.enabled,
    urgentEnabled: cmsContent?.urgent?.enabled,
    assessmentEnabled: baseContent.assessmentEnabled,
    faqEnabled: cmsContent?.faq?.enabled,
    finalEnabled: cmsContent?.final?.enabled,
  };

  // Build a Map<cardId, knowledge> from CMS articles.
  // Keyed by card id (not DB slug) so ProblemKnowledgeGrid can look up by problem.id.
  const knowledgeBySlug = new Map(
    symptomArticles
      .map((article) => {
        const cardId = SLUG_TO_PROBLEM_ID[article.slug];
        if (!cardId) return null;
        const cmsSelfRepairTips = flattenArticleSelfRepairTips(
          article.selfRepairTips,
          locale,
        );
        return [
          cardId,
          {
            title: article.title,
            articleSlug:
              getProblemArticlePublicSlug(article.slug) ?? article.slug,
            shortAnswer: article.shortAnswer,
            cardCauseText:
              CARD_CAUSE_TEXT_BY_LOCALE_AND_SLUG[`${locale}:${article.slug}`],
            causes: article.causes,
            safeChecks: article.safeChecks,
            urgentWarnings: article.urgentWarnings,
            serviceProcess: article.serviceProcess,
            workScopeFactors: article.workScopeFactors,
            selfRepairTips:
              cmsSelfRepairTips.length > 0
                ? cmsSelfRepairTips
                : article.safeChecks,
          },
        ] as const;
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
  );

  // JSON-LD FAQPage schema — enables Google AI Overviews, Featured Snippets,
  // and structured GEO signals. Sourced from CMS shortAnswer fields.
  const faqSchemaItems = symptomArticles
    .filter((a) => a.shortAnswer)
    .map((a) => ({
      "@type": "Question",
      name: a.symptomLabel ?? a.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: a.shortAnswer,
      },
    }));

  const faqSchema =
    faqSchemaItems.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqSchemaItems,
        })
      : null;

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#15202A]">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      )}
      <Header content={globalCms?.header} />
      <main>
        {content.heroEnabled !== false && (
          <>
            <section className="relative h-[520px] overflow-hidden bg-[#0E1A2B] text-white sm:h-[440px] lg:h-[480px]">
              <CmsImage
                src="/images/references/circuit-repair.webp"
                alt={content.heroTitle}
                fill
                priority
                className="object-cover opacity-85"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/82 via-[#0E1A2B]/28 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A2B]/48 via-[#0E1A2B]/12 to-transparent rtl:bg-gradient-to-l" />
              <HeroBreadcrumbs items={getPageBreadcrumbs(safeLocale, content.badge)} />

              <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-12 sm:px-6 sm:pb-14 lg:pb-16">
                <div className="mb-4 h-1 w-20 bg-[#B8643E]" />
                <h1 className="max-w-[860px] text-[36px] font-black leading-[1.05] text-white sm:text-[52px] lg:text-[60px]">
                  {content.heroTitle}
                </h1>
                <p className="mt-5 max-w-[720px] text-[16px] font-semibold leading-relaxed text-white/88 sm:text-[18px]">
                  {content.heroIntro}
                </p>
              </div>
            </section>
          </>
        )}

        {content.problemEnabled !== false && (
          <section id="probleme" className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="max-w-4xl">
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                  {content.problemTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#4A5568]">
                  {content.problemIntro}
                </p>
              </div>
              <ProblemKnowledgeGrid
                locale={locale}
                problems={content.problems}
                knowledgeBySlug={knowledgeBySlug}
              />
            </div>
          </section>
        )}

        {content.impactEnabled !== false && (
          <section id="wirkung" className="bg-[#EEF3FB] py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                  {content.impactTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#4A5568]">
                  {content.impactIntro}
                </p>
                <p className="mt-5 rounded-[18px] border border-[#D9C7BA] bg-white/70 px-5 py-4 text-[14px] font-bold leading-7 text-[#6B625C]">
                  {content.impactNote}
                </p>
              </div>
              <div className="rounded-[28px] border border-white bg-white p-6 shadow-xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-[20px] border border-[#E7DDD3] bg-[#FFFDF9] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-extrabold text-[#0E1A2B]">
                          {metric.label}
                        </h3>
                      </div>
                      <div className="mt-5 space-y-3">
                        <div>
                          <div className="mb-1 flex justify-between text-[12px] font-bold text-[#6B625C]">
                            <span>{content.impactBefore}</span>
                            <span>{metric.before}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#E7DDD3]">
                            <div
                              className="h-2 rounded-full bg-[#DAB08A]"
                              style={{ width: `${metric.before}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-[12px] font-bold text-[#24594D]">
                            <span>{content.impactAfter}</span>
                            <span>{metric.after}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-[#E6F0EC]">
                            <div
                              className="metric-fill h-3 rounded-full bg-[#7BA190]"
                              style={
                                {
                                  "--metric-target": `${metric.after}%`,
                                } as CSSProperties
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {content.urgentEnabled !== false && (
          <section
            id="dringend"
            className="bg-[#0E1A2B] py-14 text-white sm:py-20"
          >
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-[1.1] sm:text-5xl">
                  {content.urgentTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/78">
                  {content.urgentText}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ProblemRequestButton
                    label={content.urgentCta}
                    problemIntent="urgent-safety-risk"
                  />
                </div>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/[0.08] p-6">
                <ul className="space-y-4">
                  {content.urgentPoints.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-[16px] leading-7 text-white/[0.88]"
                    >
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B8643E] text-sm font-extrabold text-white">
                        !
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {content.assessmentEnabled !== false && (
          <section id="einschaetzung" className="bg-white py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                  {content.assessmentTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#4A5568]">
                  {content.assessmentIntro}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.assessmentPoints.map((point, index) => (
                  <p
                    key={point}
                    className="rounded-[18px] border border-[#E7DDD3] bg-[#FFFDF9] px-5 py-4 text-[16px] font-bold leading-7 text-[#3E4A48]"
                  >
                    <span className="mr-3 text-[#B8643E] rtl:ml-3 rtl:mr-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="seo-geo" className="bg-[#F7F1E8] py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr]">
            <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
              {content.seoTitle}
            </h2>
            <div className="space-y-5 text-[17px] leading-8 text-[#4A5568]">
              {content.seoParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {content.faqEnabled !== false && (
          <section id="faq" className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <h2 className="text-3xl font-extrabold leading-[1.1] text-[#0E1A2B] sm:text-5xl">
                    {content.faqTitle}
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-[#4A5568]">
                    {content.supportBridge}
                  </p>
                </div>
                <div className="space-y-4">
                  {content.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-[20px] border border-[#E7DDD3] bg-[#FFFDF9] p-5"
                    >
                      <summary className="flex cursor-pointer list-none justify-between gap-4 text-lg font-extrabold text-[#0E1A2B] [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <span className="text-[#B8643E] transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 border-t border-[#E7DDD3] pt-4 text-[15px] leading-7 text-[#4A5568]">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        {content.finalEnabled !== false && (
          <section className="bg-white px-6 py-14 sm:py-18">
            <div className="mx-auto max-w-7xl">
              <div
                className="grid gap-8 overflow-hidden rounded-[28px] border border-[#d3b2a2]/50 px-6 py-7 shadow-[0_18px_50px_rgba(8,24,39,0.08)] sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12"
                style={{
                  background:
                    "radial-gradient(circle at 88% 18%, rgba(184,100,62,0.16) 0%, transparent 30%), linear-gradient(135deg, #F3E7DE 0%, #EEF3F8 100%)",
                }}
              >
                <div className="min-w-0">
                  <SectionEyebrow className="mb-5">
                    {content.finalEyebrow}
                  </SectionEyebrow>
                  <h2 className="max-w-3xl text-[28px] font-extrabold leading-[1.12] tracking-[0] text-[#081827] sm:text-[34px] lg:text-[38px]">
                    {content.finalTitle}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[16px] leading-[1.65] text-[#526174] sm:text-[17px]">
                    {content.finalText}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  <ProblemRequestButton
                    label={content.primaryCta}
                    problemIntent="sign-not-lighting"
                    className="min-h-[52px] px-7 text-[15px] font-black shadow-[0_16px_34px_rgba(184,100,62,0.22)]"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer content={globalCms?.footer} />
    </div>
  );
}
