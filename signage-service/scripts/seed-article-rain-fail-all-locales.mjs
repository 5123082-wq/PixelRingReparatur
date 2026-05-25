/**
 * Seed: multilingual article for "Werbeanlage schaltet nach Regen ab" (rain-fail).
 *
 * Reads the owner-review markdown drafts from docs/07_content_ai_seo and publishes
 * the public full article section into cms_articles for all MVP locales.
 *
 * Run: node scripts/seed-article-rain-fail-all-locales.mjs
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
  'вывеска отключается после дождя – 05'
);

const SHARED = {
  slug: 'rain-fail',
  publicSlug: 'werbeanlage-schaltet-nach-regen-ab',
  relatedSlugs: ['no-light', 'flicking', 'letter-out', 'uneven-light'],
  sortOrder: 4,
};

const LOCALE_CONFIG = {
  de: {
    file: 'problem_article_werbeanlage-schaltet-nach-regen-ab_de.md',
    title: 'Werbeanlage schaltet nach Regen ab',
    symptomLabel: 'Werbeanlage schaltet nach Regen ab',
    shortAnswer:
      'Wenn eine Werbeanlage nach Regen dunkel bleibt, flackert, kurz startet oder Sicherung/FI auslöst, liegt der Verdacht auf Feuchtigkeit, Fehlerstrom, Kurzschluss, Kabel, Netzteil oder Steuerung nahe.',
    seoTitle: 'Werbeanlage schaltet nach Regen ab | PixelRing Berlin',
    seoDescription:
      'Werbeanlage nach Regen dunkel oder Sicherung/FI löst aus? PixelRing prüft Feuchtigkeit, Kabel, Netzteil und Steuerung in Berlin und deutschlandweit.',
    causes: [
      'Feuchtigkeit in Gehäuse, Kabeldurchführung, Anschlussdose oder Verbindung',
      'Kurzschluss oder Fehlerstrom nach Regen',
      'Beschädigte oder überhitzte Leitung',
      'Defektes oder feucht gewordenes Netzteil',
      'Korrodierte Klemmen, Verbinder oder Steuerungselemente',
    ],
    safeChecks: [
      'Nur äußere Punkte prüfen: normaler Schalter, externe Zeitschaltuhr und sicher erreichbare Sicherung',
      'Fotos der ganzen Anlage und sichtbarer Wasser-, Rost- oder Kabelspuren machen',
      'Ein kurzes Video beim Einschalten aufnehmen, wenn dies sicher möglich ist',
      'Wetterbezug, Alter der Anlage, Montagehöhe und Sicherung/FI-Verhalten notieren',
    ],
    urgentWarnings: [
      'Dringend bei Brandgeruch, Knacken, Funken, starker Wärme, sichtbarem Wasser im Gehäuse, beschädigter Leitung oder wiederholtem Auslösen von Sicherung/FI.',
    ],
    serviceProcess: [
      'PixelRing prüft Strompfad, Sicherung/FI, Netzteil, Ausgangsspannung, Last, Klemmen, Kabeldurchführungen, Feuchtigkeitsspuren, Steuerung, LED-Bereiche und sicheren Zugang.',
    ],
    workScopeFactors: [
      'Größe und Bauart der Werbeanlage',
      'Montagehöhe, Zugang und Bedarf an Leiter oder Steiger',
      'Lage von Netzteil, Controller und Anschlussdosen',
      'Zustand von Kabeln, Klemmen, Dichtungen und Gehäuse',
      'Feuchtigkeit, Korrosion, Schäden und mögliche Teildemontage',
    ],
    ctaLabel: 'Problem übergeben',
  },
  en: {
    file: 'problem_article_werbeanlage-schaltet-nach-regen-ab_en.md',
    title: 'Sign switches off after rain',
    symptomLabel: 'Sign switches off after rain',
    shortAnswer:
      'If an illuminated sign stays dark after rain, flickers, starts briefly or trips the breaker/RCD, the likely direction is moisture, residual current, short circuit, cable, power supply or controls.',
    seoTitle: 'Sign goes out after rain | PixelRing Berlin',
    seoDescription:
      'Sign went dark after rain or trips the breaker/RCD? PixelRing checks moisture, cables, power supply and controls for illuminated signs in Berlin and across Germany.',
    causes: [
      'Moisture inside enclosure, cable gland, junction box or connector',
      'Short circuit or residual current after rain',
      'Damaged or overheated cable',
      'Failed or moisture-damaged power supply',
      'Corroded terminals, connectors or control components',
    ],
    safeChecks: [
      'Check only external items: normal switch, external timer and safely reachable breaker',
      'Take photos of the full sign and visible water, rust or cable damage',
      'Record a short switch-on video if this is safe',
      'Note weather context, sign age, installation height and breaker/RCD behavior',
    ],
    urgentWarnings: [
      'Urgent if there is a burning smell, crackling, sparks, strong heat, visible water inside the enclosure, damaged cable or repeated breaker/RCD trips.',
    ],
    serviceProcess: [
      'PixelRing checks the power path, breaker/RCD, power supply, output voltage, load, terminals, cable glands, moisture traces, controls, LED sections and safe access.',
    ],
    workScopeFactors: [
      'Size and construction type of the sign',
      'Installation height, access and need for ladder or lift',
      'Location of power supply, controller and junction boxes',
      'Condition of cables, terminals, seals and enclosure',
      'Moisture, corrosion, damage and possible partial dismantling',
    ],
    ctaLabel: 'Send the issue',
  },
  ru: {
    file: 'problem_article_werbeanlage-schaltet-nach-regen-ab_ru.md',
    title: 'Вывеска перестала светиться после дождя',
    symptomLabel: 'Вывеска отключается после дождя',
    shortAnswer:
      'Если после дождя вывеска гаснет, отключается, мерцает, включается на короткое время или выбивает автомат/FI-Schalter, вероятны влага, утечка, короткое замыкание, кабель, блок питания или управление.',
    seoTitle: 'Вывеска перестала светиться после дождя | PixelRing',
    seoDescription:
      'После дождя вывеска погасла, отключается или выбивает автомат / FI-Schalter (УЗО)? Возможны влага, окисление, повреждение кабеля, блок питания или короткое замыкание.',
    causes: [
      'Влага в корпусе, кабельном вводе, соединении или распределительной коробке',
      'Короткое замыкание или утечка после дождя',
      'Повреждённый или перегретый кабель питания',
      'Блок питания вышел из строя из-за влаги, нагрузки или старения',
      'Окисление клемм, соединений, контроллера, таймера или датчика',
    ],
    safeChecks: [
      'Проверять только внешние вещи: обычный выключатель, внешний таймер и безопасно доступный автомат',
      'Сделать фото вывески целиком и видимых следов воды, ржавчины или повреждённого кабеля',
      'Записать короткое видео при включении, если это безопасно',
      'Отметить погоду, возраст вывески, высоту установки и срабатывает ли автомат/FI-Schalter',
    ],
    urgentWarnings: [
      'Срочно при запахе гари, треске, искрах, сильном нагреве, воде внутри корпуса, повреждённом кабеле или повторном срабатывании автомата/FI-Schalter.',
    ],
    serviceProcess: [
      'PixelRing проверяет путь питания, автомат/FI-Schalter, блок питания, выходное напряжение, нагрузку, клеммы, кабельные вводы, следы влаги, управление, LED-участки и безопасный доступ.',
    ],
    workScopeFactors: [
      'Размер и тип конструкции вывески',
      'Высота монтажа, доступ и необходимость лестницы или подъёмника',
      'Расположение блока питания, контроллера и соединительных коробок',
      'Состояние кабелей, клемм, герметизации и корпуса',
      'Влага, коррозия, повреждения и возможный частичный демонтаж',
    ],
    ctaLabel: 'Передать задачу',
  },
  tr: {
    file: 'problem_article_werbeanlage-schaltet-nach-regen-ab_tr.md',
    title: 'Tabela yağmurdan sonra kapanıyor',
    symptomLabel: 'Tabela yağmurdan sonra kapanıyor',
    shortAnswer:
      'Tabela yağmurdan sonra sönüyor, kısa çalışıyor, titriyor veya sigorta/FI şalter attırıyorsa muhtemel yön nem, kaçak akım, kısa devre, kablo, güç kaynağı veya kontrol elemanlarıdır.',
    seoTitle: 'Tabela yağmurdan sonra kapanıyor | PixelRing',
    seoDescription:
      'Tabelanız yağmurdan sonra söndü, kapanıyor veya sigorta/FI şalter atıyor mu? Nem, oksitlenme, kablo hasarı, güç kaynağı veya kısa devre olabilir.',
    causes: [
      'Kasa, kablo girişi, bağlantı kutusu veya bağlantıda nem',
      'Yağmur sonrası kısa devre veya kaçak akım',
      'Hasarlı veya aşırı ısınmış besleme kablosu',
      'Nem, yük veya yaşlanma nedeniyle arızalı güç kaynağı',
      'Oksitlenmiş klemens, bağlantı, kontrol cihazı, zamanlayıcı veya sensör',
    ],
    safeChecks: [
      'Sadece dışarıdan kontrol edin: normal anahtar, dış zamanlayıcı ve güvenli erişilebilen sigorta',
      'Tabelanın genel fotoğrafını ve görünen su, pas veya kablo hasarı izlerini çekin',
      'Güvenliyse açma sırasında kısa video çekin',
      'Hava durumunu, tabelanın yaşını, montaj yüksekliğini ve sigorta/FI davranışını not edin',
    ],
    urgentWarnings: [
      'Yanık kokusu, çıtırtı, kıvılcım, güçlü ısınma, kasa içinde su, hasarlı kablo veya tekrar eden sigorta/FI atması varsa durum acildir.',
    ],
    serviceProcess: [
      'PixelRing enerji hattını, sigorta/FI şalteri, güç kaynağını, çıkış voltajını, yükü, klemensleri, kablo girişlerini, nem izlerini, kontrol elemanlarını, LED bölümlerini ve güvenli erişimi kontrol eder.',
    ],
    workScopeFactors: [
      'Tabelanın boyutu ve yapı tipi',
      'Montaj yüksekliği, erişim ve merdiven/platform ihtiyacı',
      'Güç kaynağı, kontrol cihazı ve bağlantı kutularının yeri',
      'Kablo, klemens, sızdırmazlık ve kasa durumu',
      'Nem, korozyon, hasar ve kısmi söküm ihtiyacı',
    ],
    ctaLabel: 'Sorunu ilet',
  },
  pl: {
    file: 'problem_article_werbeanlage-schaltet-nach-regen-ab_pl.md',
    title: 'Reklama świetlna wyłącza się po deszczu',
    symptomLabel: 'Reklama świetlna wyłącza się po deszczu',
    shortAnswer:
      'Jeśli reklama po deszczu gaśnie, miga, startuje tylko na chwilę albo wybija bezpiecznik/FI, prawdopodobne są wilgoć, prąd upływu, zwarcie, kabel, zasilacz albo sterowanie.',
    seoTitle: 'Reklama świetlna wyłącza się po deszczu | PixelRing',
    seoDescription:
      'Reklama świetlna zgasła po deszczu, wyłącza się albo wybija bezpiecznik/FI? Przyczyną może być wilgoć, korozja, uszkodzony przewód, zasilacz albo zwarcie.',
    causes: [
      'Wilgoć w obudowie, przepuście kablowym, puszce lub połączeniu',
      'Zwarcie albo prąd upływu po deszczu',
      'Uszkodzony lub przegrzany przewód zasilający',
      'Uszkodzony zasilacz przez wilgoć, obciążenie lub starzenie',
      'Skorodowane zaciski, złącza, sterownik, timer lub czujnik',
    ],
    safeChecks: [
      'Sprawdzić tylko zewnętrzne elementy: zwykły włącznik, zewnętrzny timer i bezpiecznie dostępne zabezpieczenie',
      'Zrobić zdjęcie całej reklamy i widocznych śladów wody, rdzy lub uszkodzonego kabla',
      'Nagrać krótkie wideo przy włączaniu, jeśli jest to bezpieczne',
      'Zanotować pogodę, wiek reklamy, wysokość montażu i zachowanie bezpiecznika/FI',
    ],
    urgentWarnings: [
      'Pilnie przy zapachu spalenizny, trzaskach, iskrach, mocnym nagrzaniu, wodzie w obudowie, uszkodzonym kablu albo ponownym wybijaniu bezpiecznika/FI.',
    ],
    serviceProcess: [
      'PixelRing sprawdza tor zasilania, bezpiecznik/FI, zasilacz, napięcie wyjściowe, obciążenie, zaciski, przepusty kablowe, ślady wilgoci, sterowanie, sekcje LED i bezpieczny dostęp.',
    ],
    workScopeFactors: [
      'Rozmiar i typ konstrukcji reklamy',
      'Wysokość montażu, dostęp i potrzeba drabiny albo podnośnika',
      'Położenie zasilacza, sterownika i puszek połączeniowych',
      'Stan kabli, zacisków, uszczelnień i obudowy',
      'Wilgoć, korozja, uszkodzenia i możliwy częściowy demontaż',
    ],
    ctaLabel: 'Przekaż zgłoszenie',
  },
  ar: {
    file: 'problem_article_werbeanlage-schaltet-nach-regen-ab_ar.md',
    title: 'اللافتة المضيئة تنطفئ بعد المطر',
    symptomLabel: 'اللافتة المضيئة تنطفئ بعد المطر',
    shortAnswer:
      'إذا انطفأت اللافتة بعد المطر أو ومضت أو عملت لثوان أو فصل القاطع/FI، فالاتجاه المحتمل هو الرطوبة أو تسرب التيار أو قصر كهربائي أو كابل أو مزود طاقة أو عناصر التحكم.',
    seoTitle: 'اللافتة المضيئة تنطفئ بعد المطر | PixelRing',
    seoDescription:
      'هل انطفأت اللافتة المضيئة بعد المطر أو تفصل عند التشغيل أو تسبب فصل القاطع أو قاطع التسرب FI/RCD؟ قد تكون المشكلة رطوبة أو تآكل توصيلات أو كابل تالف أو مزود طاقة أو قصر كهربائي.',
    causes: [
      'رطوبة في الهيكل أو مدخل الكابل أو علبة التوصيل أو الوصلة',
      'قصر كهربائي أو تسرب تيار بعد المطر',
      'كابل تغذية تالف أو ساخن',
      'مزود طاقة معطل بسبب الرطوبة أو الحمل أو التقادم',
      'أطراف أو وصلات أو وحدة تحكم أو مؤقت أو حساس متآكلة',
    ],
    safeChecks: [
      'افحص فقط العناصر الخارجية: المفتاح العادي، المؤقت الخارجي والقاطع الذي يمكن الوصول إليه بأمان',
      'التقط صورة للافتة كاملة وآثار الماء أو الصدأ أو تلف الكابل الظاهرة',
      'سجل فيديو قصيرا عند التشغيل إذا كان ذلك آمنا',
      'سجل حالة الطقس، عمر اللافتة، ارتفاع التركيب وسلوك القاطع/FI',
    ],
    urgentWarnings: [
      'الحالة عاجلة عند وجود رائحة احتراق، طقطقة، شرر، سخونة قوية، ماء داخل الهيكل، كابل تالف أو فصل متكرر للقاطع/FI.',
    ],
    serviceProcess: [
      'تفحص PixelRing مسار التغذية، القاطع/FI، مزود الطاقة، جهد الخرج، الحمل، الأطراف، مداخل الكابلات، آثار الرطوبة، عناصر التحكم، أقسام LED والوصول الآمن.',
    ],
    workScopeFactors: [
      'حجم اللافتة ونوع التركيب',
      'ارتفاع التركيب والوصول والحاجة إلى سلم أو رافعة',
      'مكان مزود الطاقة ووحدة التحكم وعلب التوصيل',
      'حالة الكابلات والأطراف والعزل والهيكل',
      'الرطوبة والتآكل والأضرار والحاجة المحتملة إلى تفكيك جزئي',
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
    selfRepairTips: ARTICLE_SELF_REPAIR_TIPS[SHARED.slug][locale] ?? null,
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
          seed: 'article-rain-fail-all-locales',
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
