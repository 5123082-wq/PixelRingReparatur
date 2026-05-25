/**
 * Seed: multilingual article for "One letter or sign section does not light" (letter-out).
 *
 * Reads the owner-review markdown drafts from docs/07_content_ai_seo and publishes
 * the public full article section into cms_articles for all MVP locales.
 *
 * Run: node scripts/seed-article-letter-out-all-locales.mjs
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

import { ARTICLE_SELF_REPAIR_TIPS } from './article-self-repair-tips-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const repoDir = path.resolve(appDir, '..');

dotenv.config({ path: path.join(appDir, '.env.local') });
dotenv.config({ path: path.join(appDir, '.env') });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error('Missing DB connection string.');
}

const now = new Date();

const ARTICLE_FOLDER = path.join(
  repoDir,
  'docs',
  '07_content_ai_seo',
  'problem_articles',
  'буква или часть вывески не светится – 04'
);

const SHARED = {
  slug: 'letter-out',
  publicSlug: 'buchstabe-leuchtet-nicht',
  relatedSlugs: ['no-light', 'flicking', 'uneven-light', 'rain-fail'],
  sortOrder: 3,
};

const LOCALE_CONFIG = {
  de: {
    file: 'problem_article_bukva_ili_chast_vyveski_ne_svetitsya_de.md',
    title: 'Ein Buchstabe oder ein Teil der Werbeanlage leuchtet nicht',
    symptomLabel: 'Buchstabe oder Teil der Werbeanlage leuchtet nicht',
    shortAnswer:
      'Wenn nur ein Buchstabe, ein Leuchtkastenbereich oder eine Zone dunkel bleibt, liegt die Ursache meist lokal: Netzteil, Verbindung, Leitung, LED-Module, LED-Band, Feuchtigkeit oder Steuerung.',
    seoTitle:
      'Ein Buchstabe oder Teil der Werbeanlage leuchtet nicht: Ursachen und Diagnose',
    seoDescription:
      'Ein Buchstabe, ein Bereich des Leuchtkastens oder eine Zone der Werbeanlage bleibt dunkel? Typische Ursachen sind Netzteil, Kontakt, Leitung, LED-Module, Feuchtigkeit oder Steuerung.',
    causes: [
      'Lokales Netzteil oder separate Versorgungsleitung',
      'Lose Leitung, Klemme, Lötstelle oder Verbinder',
      'Beschädigte LED-Module oder LED-Band',
      'Feuchtigkeit, Oxidation oder undichte Gehäusestelle',
      'Controller, Timer, Dämmerungssensor, Relais oder Dimmer',
    ],
    safeChecks: [
      'Nur äußere Punkte prüfen: Schalter, Sicherung und außen zugängliche Zeitschaltuhr',
      'Foto der ganzen Anlage und Nahaufnahme des dunklen Bereichs erstellen',
      'Zeitpunkt, Wetterereignisse, Montagehöhe und sichtbare Schäden notieren',
      'Typenschild nur fotografieren, wenn es ohne Öffnen, Höhe und Leitungsberührung sicher sichtbar ist',
    ],
    urgentWarnings: [
      'Dringend bei Brandgeruch, Knacken, Funken, Wärme, Wasser, beschädigtem Kabel, ausgelöster Sicherung oder Ausfall nach Regen.',
    ],
    serviceProcess: [
      'PixelRing grenzt zuerst die betroffene Zone ein und prüft dann Stromversorgung, Netzteil, Verbindungen, LED-Module, Feuchtigkeit, Steuerung und sicheren Zugang.',
    ],
    workScopeFactors: [
      'Anzahl der dunklen Buchstaben oder Zonen',
      'Bauart der Anlage und Lage des Netzteils',
      'Montagehöhe und sicherer Zugang',
      'Zustand von Leitungen, Klemmen und Dichtungen',
      'Feuchtigkeit, Korrosion oder notwendige Teildemontage',
    ],
    ctaLabel: 'Problem übergeben',
  },
  en: {
    file: 'problem_article_bukva_ili_chast_vyveski_ne_svetitsya_en.md',
    title: 'One letter or part of the sign does not light up',
    symptomLabel: 'One letter or part of the sign does not light up',
    shortAnswer:
      'When one letter, one lightbox area or one sign zone stays dark, the fault is usually local: power supply, connection, wire, LED modules, LED strip, moisture or controls.',
    seoTitle:
      'One letter or part of the sign does not light up: causes and diagnosis',
    seoDescription:
      'One letter, part of a lightbox or a section of the sign stays dark? Common causes include power supply, contact, wiring, LED modules, LED strip, moisture or controls.',
    causes: [
      'Local power supply or separate supply line',
      'Loose wire, terminal, solder joint or connector',
      'Damaged LED module or LED strip section',
      'Moisture, oxidation or failed sealing',
      'Controller, timer, photocell, relay or dimmer',
    ],
    safeChecks: [
      'Only check external items: switch, breaker and external timer',
      'Take a full photo and a close-up of the dark area',
      'Note timing, weather events, installation height and visible damage',
      'Photograph the power-supply label only if it is visible without opening, height work or wire contact',
    ],
    urgentWarnings: [
      'Urgent when there is burning smell, crackling, sparks, heat, water, damaged cable, tripping breaker or failure after rain.',
    ],
    serviceProcess: [
      'PixelRing first identifies the affected zone, then checks power path, power supply, connections, LED modules, moisture, controls and safe access.',
    ],
    workScopeFactors: [
      'Number of dark letters or zones',
      'Sign construction and power-supply location',
      'Installation height and safe access',
      'Condition of wires, terminals and seals',
      'Moisture, corrosion or required partial disassembly',
    ],
    ctaLabel: 'Send the issue',
  },
  ru: {
    file: 'problem_article_bukva_ili_chast_vyveski_ne_svetitsya_ru.md',
    title: 'Не светится отдельная буква или часть вывески',
    symptomLabel: 'Не светится буква или часть вывески',
    shortAnswer:
      'Если не светится одна буква, часть лайтбокса или отдельная зона вывески, причина чаще всего локальная: блок питания, соединение, провод, LED-модули, лента, влага или управление.',
    seoTitle:
      'Не светится буква или часть вывески: причины и диагностика | PixelRing',
    seoDescription:
      'Не светится одна буква, часть лайтбокса или участок вывески? Возможные причины: блок питания, контакт, проводка, LED-модули, лента, влага или контроллер.',
    causes: [
      'Блок питания отдельной зоны или отдельная линия питания',
      'Отошёл провод, клемма, пайка или соединитель',
      'Повреждён участок LED-модулей или светодиодной ленты',
      'Влага, окисление или нарушение герметичности',
      'Контроллер, таймер, датчик света, реле или диммер',
    ],
    safeChecks: [
      'Проверить только внешние вещи: выключатель, автомат и внешний таймер',
      'Сделать фото вывески целиком и крупное фото тёмного участка',
      'Записать, когда появилась проблема, была ли связь с погодой и какая высота установки',
      'Сфотографировать наклейку блока питания только если это безопасно без вскрытия, высоты и контакта с проводами',
    ],
    urgentWarnings: [
      'Срочно при запахе гари, треске, искрах, нагреве, воде, повреждённом кабеле, срабатывании автомата или поломке после дождя.',
    ],
    serviceProcess: [
      'PixelRing сначала определяет затронутую зону, затем проверяет питание, блок питания, соединения, LED-модули, влагу, управление и безопасный доступ.',
    ],
    workScopeFactors: [
      'Количество тёмных букв или зон',
      'Тип конструкции и расположение блока питания',
      'Высота монтажа и безопасный доступ',
      'Состояние проводов, клемм и герметизации',
      'Влага, коррозия или необходимость частичного демонтажа',
    ],
    ctaLabel: 'Передать задачу',
  },
  tr: {
    file: 'problem_article_bukva_ili_chast_vyveski_ne_svetitsya_tr.md',
    title: 'Bir harf veya tabelanın bir bölümü yanmıyor',
    symptomLabel: 'Harf veya tabelanın bir bölümü yanmıyor',
    shortAnswer:
      'Bir harf, ışıklı kutunun bir alanı veya tabelanın bir bölgesi karanlık kalıyorsa neden çoğu zaman yereldir: güç kaynağı, bağlantı, kablo, LED modüller, LED şerit, nem veya kontrol elemanları.',
    seoTitle:
      'Bir harf veya tabelanın bir bölümü yanmıyor: nedenler ve teşhis',
    seoDescription:
      'Tabelada bir harf, ışıklı kutunun bir bölümü veya ayrı bir alan yanmıyor mu? Tipik nedenler: güç kaynağı, temas, kablo, LED modüller, LED şerit, nem veya kontrol elemanları.',
    causes: [
      'Yerel güç kaynağı veya ayrı besleme hattı',
      'Gevşek kablo, klemens, lehim veya konnektör',
      'Hasarlı LED modül veya LED şerit bölümü',
      'Nem, oksitlenme veya sızdırmazlık sorunu',
      'Kontrol ünitesi, zamanlayıcı, fotosel, röle veya dimmer',
    ],
    safeChecks: [
      'Sadece dışarıdan kontrol edin: anahtar, sigorta ve dış zamanlayıcı',
      'Tabelanın genel fotoğrafını ve karanlık alanın yakın fotoğrafını çekin',
      'Zamanı, hava durumunu, montaj yüksekliğini ve görünür hasarı not edin',
      'Güç kaynağı etiketini sadece kasa açmadan, yükseğe çıkmadan ve kabloya dokunmadan görünüyorsa fotoğraflayın',
    ],
    urgentWarnings: [
      'Yanık kokusu, çıtırtı, kıvılcım, ısınma, su, hasarlı kablo, atan sigorta veya yağmur sonrası arıza varsa durum acildir.',
    ],
    serviceProcess: [
      'PixelRing önce etkilenen bölgeyi belirler, sonra enerji hattını, güç kaynağını, bağlantıları, LED modülleri, nemi, kontrol elemanlarını ve güvenli erişimi kontrol eder.',
    ],
    workScopeFactors: [
      'Karanlık harf veya bölge sayısı',
      'Tabela tipi ve güç kaynağının yeri',
      'Montaj yüksekliği ve güvenli erişim',
      'Kablo, klemens ve sızdırmazlık durumu',
      'Nem, korozyon veya kısmi söküm gereği',
    ],
    ctaLabel: 'Sorunu ilet',
  },
  pl: {
    file: 'problem_article_bukva_ili_chast_vyveski_ne_svetitsya_pl.md',
    title: 'Nie świeci jedna litera albo część reklamy',
    symptomLabel: 'Nie świeci litera albo część reklamy',
    shortAnswer:
      'Jeśli ciemna jest jedna litera, fragment kasetonu albo osobna strefa reklamy, przyczyna zwykle jest lokalna: zasilacz, połączenie, przewód, moduły LED, taśma LED, wilgoć albo sterowanie.',
    seoTitle:
      'Nie świeci jedna litera albo część reklamy: przyczyny i diagnostyka',
    seoDescription:
      'Nie świeci jedna litera, część kasetonu albo fragment reklamy? Typowe przyczyny to zasilacz, styk, przewód, moduły LED, taśma LED, wilgoć albo sterowanie.',
    causes: [
      'Lokalny zasilacz albo osobna linia zasilania',
      'Luźny przewód, zacisk, lut albo złącze',
      'Uszkodzony moduł LED albo odcinek taśmy LED',
      'Wilgoć, utlenienie albo nieszczelność',
      'Sterownik, zegar, czujnik zmierzchu, przekaźnik albo dimmer',
    ],
    safeChecks: [
      'Sprawdzić tylko zewnętrzne elementy: włącznik, zabezpieczenie i zewnętrzny zegar',
      'Zrobić zdjęcie całej reklamy i zbliżenie ciemnego fragmentu',
      'Zanotować czas pojawienia się problemu, pogodę, wysokość montażu i widoczne uszkodzenia',
      'Sfotografować etykietę zasilacza tylko jeśli jest widoczna bez otwierania, pracy na wysokości i dotykania przewodów',
    ],
    urgentWarnings: [
      'Pilnie przy zapachu spalenizny, trzaskach, iskrach, nagrzewaniu, wodzie, uszkodzonym kablu, wybijającym zabezpieczeniu albo awarii po deszczu.',
    ],
    serviceProcess: [
      'PixelRing najpierw ustala dotkniętą strefę, potem sprawdza zasilanie, zasilacz, połączenia, moduły LED, wilgoć, sterowanie i bezpieczny dostęp.',
    ],
    workScopeFactors: [
      'Liczba ciemnych liter albo stref',
      'Typ reklamy i położenie zasilacza',
      'Wysokość montażu i bezpieczny dostęp',
      'Stan przewodów, zacisków i uszczelnień',
      'Wilgoć, korozja albo konieczność częściowego demontażu',
    ],
    ctaLabel: 'Przekaż zgłoszenie',
  },
  ar: {
    file: 'problem_article_bukva_ili_chast_vyveski_ne_svetitsya_ar.md',
    title: 'حرف واحد أو جزء من اللوحة لا يضيء',
    symptomLabel: 'حرف أو جزء من اللوحة لا يضيء',
    shortAnswer:
      'إذا بقي حرف واحد، أو جزء من صندوق الإضاءة، أو منطقة من اللوحة مظلمًا، فالسبب غالبًا محلي: مزود الطاقة، اتصال، سلك، وحدات LED، شريط LED، رطوبة أو عناصر التحكم.',
    seoTitle:
      'حرف واحد أو جزء من اللوحة لا يضيء: الأسباب والتشخيص',
    seoDescription:
      'هل لا يضيء حرف واحد، أو جزء من صندوق الإضاءة، أو منطقة من اللوحة؟ الأسباب الشائعة تشمل مزود الطاقة، التلامس، الأسلاك، وحدات LED، شريط LED، الرطوبة أو عناصر التحكم.',
    causes: [
      'مزود طاقة محلي أو خط تغذية منفصل',
      'سلك، طرف، لحام أو وصلة مرتخية',
      'قسم تالف من وحدات LED أو شريط LED',
      'رطوبة، أكسدة أو ضعف في العزل',
      'متحكم، مؤقت، حساس ضوء، ريليه أو ديمر',
    ],
    safeChecks: [
      'فحص العناصر الخارجية فقط: المفتاح، القاطع والمؤقت الخارجي',
      'تصوير اللوحة كاملة وتصوير المنطقة المظلمة عن قرب',
      'تسجيل وقت ظهور المشكلة، الطقس، ارتفاع التركيب والأضرار الظاهرة',
      'تصوير ملصق مزود الطاقة فقط إذا كان مرئيًا بدون فتح، بدون صعود وبدون لمس الأسلاك',
    ],
    urgentWarnings: [
      'الحالة عاجلة عند وجود رائحة احتراق، طقطقة، شرر، حرارة، ماء، كابل تالف، قاطع يفصل أو عطل بعد المطر.',
    ],
    serviceProcess: [
      'تحدد PixelRing أولًا المنطقة المتأثرة، ثم تفحص مسار التغذية، مزود الطاقة، الوصلات، وحدات LED، الرطوبة، عناصر التحكم والوصول الآمن.',
    ],
    workScopeFactors: [
      'عدد الحروف أو المناطق المظلمة',
      'نوع اللوحة ومكان مزود الطاقة',
      'ارتفاع التركيب والوصول الآمن',
      'حالة الأسلاك، الأطراف والعزل',
      'الرطوبة، التآكل أو الحاجة إلى تفكيك جزئي',
    ],
    ctaLabel: 'أرسل المشكلة',
  },
};

function extractPublicArticle(markdown) {
  const match = markdown.match(/## 3\.[^\n]*\n\n([\s\S]*?)\n\n---\n\n## 4\./);
  if (!match) {
    throw new Error('Could not extract public full article section from markdown.');
  }

  const content = match[1].trim();
  if (!content.startsWith('# ')) {
    throw new Error('Extracted article does not start with H1.');
  }
  if (content.length < 5000) {
    throw new Error(`Extracted article is unexpectedly short: ${content.length} characters.`);
  }

  return content;
}

function readArticle(locale, config) {
  const filePath = path.join(ARTICLE_FOLDER, config.file);
  const markdown = fs.readFileSync(filePath, 'utf8');

  return {
    locale,
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: SHARED.slug,
    title: config.title,
    symptomLabel: config.symptomLabel,
    shortAnswer: config.shortAnswer,
    content: extractPublicArticle(markdown),
    seoTitle: config.seoTitle,
    seoDescription: config.seoDescription,
    canonicalUrl: `/${locale}/probleme-loesungen/${SHARED.publicSlug}`,
    relatedSlugs: SHARED.relatedSlugs,
    causes: config.causes,
    safeChecks: config.safeChecks,
    selfRepairTips: ARTICLE_SELF_REPAIR_TIPS['letter-out'][locale] ?? null,
    urgentWarnings: config.urgentWarnings,
    serviceProcess: config.serviceProcess,
    workScopeFactors: config.workScopeFactors,
    ctaLabel: config.ctaLabel,
    ctaHref: `/${locale}#contact`,
    sortOrder: SHARED.sortOrder,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
    "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
    "causes","safeChecks","selfRepairTips","urgentWarnings","serviceProcess","workScopeFactors",
    "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt",
    "deletedAt","createdAt","updatedAt"
  ) VALUES (
    $1,$2,$3::"CmsArticleType",$4::"CmsArticleStatus",$5,$6,$7,$8,
    $9,$10,$11,$12,$13::text[],$14::text[],$15::text[],$16::jsonb,$17::text[],
    $18::text[],$19::text[],$20,$21,$22,$23,$24,$25,$26,$27
  )
  ON CONFLICT ("locale", "slug")
  DO UPDATE SET
    "type" = EXCLUDED."type",
    "status" = EXCLUDED."status",
    "title" = EXCLUDED."title",
    "symptomLabel" = EXCLUDED."symptomLabel",
    "shortAnswer" = EXCLUDED."shortAnswer",
    "content" = EXCLUDED."content",
    "seoTitle" = EXCLUDED."seoTitle",
    "seoDescription" = EXCLUDED."seoDescription",
    "canonicalUrl" = EXCLUDED."canonicalUrl",
    "relatedSlugs" = EXCLUDED."relatedSlugs",
    "causes" = EXCLUDED."causes",
    "safeChecks" = EXCLUDED."safeChecks",
    "selfRepairTips" = EXCLUDED."selfRepairTips",
    "urgentWarnings" = EXCLUDED."urgentWarnings",
    "serviceProcess" = EXCLUDED."serviceProcess",
    "workScopeFactors" = EXCLUDED."workScopeFactors",
    "ctaLabel" = EXCLUDED."ctaLabel",
    "ctaHref" = EXCLUDED."ctaHref",
    "sortOrder" = EXCLUDED."sortOrder",
    "publishedAt" = EXCLUDED."publishedAt",
    "lastReviewedAt" = EXCLUDED."lastReviewedAt",
    "deletedAt" = EXCLUDED."deletedAt",
    "updatedAt" = EXCLUDED."updatedAt"
  RETURNING "id", "locale", "slug", "status", char_length("content") AS "contentChars"
`;

async function upsertArticle(client, article) {
  const values = [
    crypto.randomUUID(),
    article.locale,
    article.type,
    article.status,
    article.slug,
    article.title,
    article.symptomLabel,
    article.shortAnswer,
    article.content,
    article.seoTitle,
    article.seoDescription,
    article.canonicalUrl,
    article.relatedSlugs,
    article.causes,
    article.safeChecks,
    article.selfRepairTips ? JSON.stringify(article.selfRepairTips) : null,
    article.urgentWarnings,
    article.serviceProcess,
    article.workScopeFactors,
    article.ctaLabel,
    article.ctaHref,
    article.sortOrder,
    article.publishedAt,
    article.lastReviewedAt,
    article.deletedAt,
    article.createdAt,
    article.updatedAt,
  ];

  const result = await client.query(upsertSql, values);
  return result.rows[0];
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const results = [];
    for (const [locale, config] of Object.entries(LOCALE_CONFIG)) {
      const article = readArticle(locale, config);
      results.push(await upsertArticle(client, article));
    }

    console.log(
      JSON.stringify(
        {
          seed: 'article-letter-out-all-locales',
          slug: SHARED.slug,
          status: 'OK',
          results,
        },
        null,
        2
      )
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
