/**
 * Seed: multilingual article for "Sign does not light up" (no-light).
 *
 * Reads the owner-review markdown drafts from docs/07_content_ai_seo and publishes
 * the public full article section into cms_articles for all MVP locales.
 *
 * Run: node scripts/seed-article-no-light-all-locales.mjs
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

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

const LOCALE_CONFIG = {
  de: {
    file: path.join('problem_articles', 'вывеска не светится – 01', 'problem_article_vyveska_ne_svetitsya_de.md'),
    title: 'Werbeanlage leuchtet nicht',
    symptomLabel:
      'Die Anlage bleibt dunkel, startet nicht zur gewohnten Zeit oder nur einzelne Buchstaben und Segmente leuchten nicht.',
    shortAnswer:
      'Wenn eine Werbeanlage nicht leuchtet, liegt die Ursache meist in der Versorgungskette: Sicherung, 220/230-V-Zuleitung, Netzteil, Steuerung oder Verbindung. Bei einzelnen dunklen Buchstaben wird eher lokal geprüft: Leitung, Klemme, Polarität oder LED-Module. Bei Feuchtigkeit, Geruch, Funken, Wärme oder wiederholt auslösender Sicherung sollte die Anlage ausgeschaltet bleiben und fachlich geprüft werden.',
    causes: [
      'Unterbrochene Stromversorgung, ausgelöste Sicherung oder FI/RCD.',
      'Defektes oder überlastetes Netzteil.',
      'Gelöste, beschädigte oder oxidierte Leitungen und Klemmen.',
      'Feuchtigkeit im Gehäuse, Korrosion oder Kurzschluss auf der Sekundärseite.',
      'Fehler in Zeitschaltuhr, Dämmerungssensor, Relais, Controller oder lokalen LED-Modulen.',
    ],
    safeChecks: [
      'Prüfen, ob der normale Schalter eingeschaltet ist.',
      'Prüfen, ob Sicherung oder FI/RCD ausgelöst haben.',
      'Außenliegende Zeitschaltuhr prüfen, wenn sie ohne Öffnen erreichbar ist.',
      'Beobachten, ob andere Geräte auf derselben Leitung Strom haben.',
      'Fotos der ganzen Anlage und des dunklen Bereichs machen.',
      'Die Beschriftung des Netzteils nur fotografieren, wenn sie ohne Öffnen und ohne Leitungsberührung sichtbar ist.',
    ],
    urgentWarnings: [
      'Sicherung oder FI/RCD lösen wiederholt aus.',
      'Brandgeruch, Funken, Knacken oder starke Erwärmung.',
      'Wasser im Gehäuse, beschädigte Leitungen oder offene Adern.',
      'Ausfall nach Regen, Schnee, Gewitter oder Spannungsspitze.',
      'Prüfung wäre nur durch Öffnen des Gehäuses oder Arbeiten in der Höhe möglich.',
    ],
    serviceProcess: [
      'Wir grenzen ein, ob die ganze Anlage oder nur ein Bereich betroffen ist.',
      'Wir prüfen Versorgung, Sicherung, Netzteil, Steuerung und Ausgangsspannung.',
      'Wir kontrollieren Leitungen, Klemmen, Polarität, Feuchtigkeit und LED-Module.',
      'Wir beheben die Ursache, nicht nur das erste sichtbare Symptom.',
    ],
    workScopeFactors: [
      'Montagehöhe und Zugang zur Anlage.',
      'Position und Erreichbarkeit des Netzteils.',
      'Größe der Anlage, Anzahl der Buchstaben und Sektionen.',
      'Zustand von Leitungen, Gehäuse, Dichtungen und Steuerung.',
      'Notwendigkeit von Teildemontage oder Abdichtung.',
    ],
    ctaLabel: 'Problem übergeben',
    seoTitle: 'Werbeanlage leuchtet nicht: Ursachen, Prüfung und nächste Schritte | PixelRing',
    seoDescription:
      'Warum eine Werbeanlage dunkel bleibt: Sicherung, Netzteil, Zuleitung, Steuerung, Feuchtigkeit oder LED-Module. Was sicher geprüft werden kann.',
  },
  en: {
    file: path.join('problem_articles', 'вывеска не светится – 01', 'problem_article_vyveska_ne_svetitsya_en.md'),
    title: 'Sign does not light up',
    symptomLabel:
      'The sign stays dark, does not switch on as scheduled, or only one letter or section is out.',
    shortAnswer:
      'A sign that does not light usually points to the power path: breaker, 220/230 V feed, power supply, control device or connection. If only one letter or section is dark, the fault is more likely local: cable, terminal, polarity or LED modules. Burning smell, sparks, heat, water or a breaker that trips again are reasons to isolate the sign if safe and call a specialist.',
    causes: [
      'No incoming power, tripped breaker or RCD.',
      'Failed, overloaded or ageing power supply.',
      'Loose, damaged or oxidized cables and terminals.',
      'Moisture inside the enclosure, corrosion or secondary-side short circuit.',
      'Faulty timer, photocell, relay, controller or local LED modules.',
    ],
    safeChecks: [
      'Check the normal switch.',
      'Check whether the breaker or RCD has tripped.',
      'Check an external timer if accessible without opening the sign.',
      'See whether other equipment on the same circuit has power.',
      'Take photos of the full sign and the dark area.',
      'Photograph the power supply label only if it is safely visible without touching wiring.',
    ],
    urgentWarnings: [
      'Breaker or RCD trips repeatedly.',
      'Burning smell, sparks, crackling or strong heat.',
      'Water inside the cabinet, damaged cable or exposed conductors.',
      'Failure after rain, snow, lightning or a voltage surge.',
      'Inspection would require opening the cabinet or working at height.',
    ],
    serviceProcess: [
      'We identify whether the whole sign or only one zone is affected.',
      'We check feed, breaker, power supply, controls and output voltage.',
      'We inspect cables, terminals, polarity, moisture and LED modules.',
      'We repair the cause rather than replacing the first suspicious part.',
    ],
    workScopeFactors: [
      'Mounting height and access.',
      'Power supply position and accessibility.',
      'Sign size, number of letters and sections.',
      'Condition of cables, enclosure, seals and controls.',
      'Need for partial disassembly or sealing work.',
    ],
    ctaLabel: 'Send the issue',
    seoTitle: 'Sign does not light up: causes, diagnosis and next steps | PixelRing',
    seoDescription:
      'Why an illuminated sign stays dark: breaker, power supply, feed line, control device, moisture or LED modules. Safe checks and professional diagnosis.',
  },
  ru: {
    file: path.join('problem_articles', 'вывеска не светится – 01', 'problem_article_vyveska_ne_svetitsya_ru.md'),
    title: 'Вывеска не светится',
    symptomLabel:
      'Вывеска осталась тёмной, не включается по таймеру или не реагирует на обычное включение.',
    shortAnswer:
      'Если вывеска не светится, чаще всего сначала проверяют цепь питания: автомат, вход 220/230 В, блок питания, таймер, датчик света, контроллер и соединения. Если тёмная только одна буква или секция, причина чаще локальная: провод, клемма, полярность или LED-модули. При запахе гари, искрах, нагреве, воде или повторном срабатывании автомата вывеску лучше обесточить, если это безопасно, и не включать до диагностики.',
    causes: [
      'Нет входного питания или сработал автомат.',
      'Вышел из строя, перегружен или состарился блок питания.',
      'Отошёл, повреждён или окислился кабель, клемма или соединение.',
      'Внутрь попала влага, появилась коррозия или короткое замыкание после блока питания.',
      'Неисправен таймер, датчик света, реле, контроллер или локальные LED-модули.',
    ],
    safeChecks: [
      'Проверить обычный выключатель.',
      'Проверить, не выбило ли автомат.',
      'Проверить внешний таймер, если он доступен без вскрытия корпуса.',
      'Посмотреть, есть ли питание у других приборов на этой линии.',
      'Сделать фото вывески целиком и крупно тёмного участка.',
      'Сфотографировать наклейку блока питания только если она видна безопасно и без контакта с проводами.',
    ],
    urgentWarnings: [
      'Автомат выбивает повторно.',
      'Есть запах гари, искры, треск или сильный нагрев.',
      'Внутри видна вода, повреждён кабель или открыты провода.',
      'Проблема появилась после дождя, снега, грозы или скачка напряжения.',
      'Для проверки нужно вскрывать корпус или работать на высоте.',
    ],
    serviceProcess: [
      'Уточняем, не светится вся вывеска или только отдельный участок.',
      'Проверяем входное питание, автомат, блок питания, управление и выходное напряжение.',
      'Проверяем кабели, клеммы, полярность, влагу и LED-модули.',
      'Устраняем причину отказа, а не просто меняем первый подозрительный элемент.',
    ],
    workScopeFactors: [
      'Высота монтажа и доступ к вывеске.',
      'Место расположения и доступность блока питания.',
      'Размер конструкции, количество букв и секций.',
      'Состояние кабелей, корпуса, герметичности и управления.',
      'Нужен ли частичный демонтаж или восстановление герметичности.',
    ],
    ctaLabel: 'Передать задачу',
    seoTitle: 'Вывеска не светится: причины, диагностика и что делать | PixelRing',
    seoDescription:
      'Почему не светится вывеска: автомат, блок питания, кабель, таймер, влага, короткое замыкание или LED-модули. Что можно проверить безопасно.',
  },
  tr: {
    file: path.join('problem_articles', 'вывеска не светится – 01', 'problem_article_vyveska_ne_svetitsya_tr.md'),
    title: 'Tabela yanmıyor',
    symptomLabel:
      'Tabela karanlık kalıyor, zamanında açılmıyor veya sadece bir harf ya da bölüm çalışmıyor.',
    shortAnswer:
      'Yanmayan bir tabelada ilk bakılacak yer genellikle enerji hattıdır: sigorta, 220/230 V besleme, güç kaynağı, zamanlayıcı, fotosel, kontrol ünitesi ve bağlantılar. Sadece bir harf veya bölüm karanlıksa sorun daha çok yereldir: kablo, klemens, polarite veya LED modüller. Yanık kokusu, kıvılcım, ısınma, su veya tekrar atan sigorta varsa tabela güvenliyse kapalı tutulmalı ve uzman kontrolü yapılmalıdır.',
    causes: [
      'Besleme yok, sigorta veya kaçak akım rölesi attı.',
      'Güç kaynağı arızalı, aşırı yüklü veya yaşlanmış.',
      'Kablo, klemens veya bağlantı gevşek, hasarlı ya da oksitli.',
      'Kasa içinde nem, korozyon veya güç kaynağından sonra kısa devre var.',
      'Zamanlayıcı, fotosel, röle, kontrol ünitesi veya yerel LED modüller arızalı.',
    ],
    safeChecks: [
      'Normal anahtarı kontrol edin.',
      'Sigorta veya kaçak akım rölesinin atıp atmadığını kontrol edin.',
      'Dışarıdaki zamanlayıcıya kasa açmadan ulaşılabiliyorsa kontrol edin.',
      'Aynı hatta bağlı başka cihazlarda elektrik olup olmadığını kontrol edin.',
      'Tabelanın genel fotoğrafını ve karanlık bölgenin yakın fotoğrafını çekin.',
      'Güç kaynağı etiketi güvenli şekilde görünüyorsa sadece fotoğrafını çekin.',
    ],
    urgentWarnings: [
      'Sigorta veya kaçak akım rölesi tekrar atıyor.',
      'Yanık kokusu, kıvılcım, çıtırtı veya belirgin ısınma var.',
      'Kasa içinde su, hasarlı kablo veya açık iletken var.',
      'Sorun yağmur, kar, fırtına veya voltaj dalgalanmasından sonra çıktı.',
      'Kontrol için kasa açmak veya yüksekte çalışmak gerekiyor.',
    ],
    serviceProcess: [
      'Bütün tabelanın mı yoksa tek bir bölümün mü etkilendiğini netleştiririz.',
      'Besleme, sigorta, güç kaynağı, kontrol elemanları ve çıkış voltajını kontrol ederiz.',
      'Kabloları, klemensleri, polariteyi, nemi ve LED modülleri inceleriz.',
      'İlk şüpheli parçayı değil, arızanın gerçek nedenini gideririz.',
    ],
    workScopeFactors: [
      'Montaj yüksekliği ve erişim.',
      'Güç kaynağının yeri ve ulaşılabilirliği.',
      'Tabela boyutu, harf ve bölüm sayısı.',
      'Kablo, kasa, conta ve kontrol sistemi durumu.',
      'Kısmi söküm veya sızdırmazlık onarımı gerekip gerekmediği.',
    ],
    ctaLabel: 'Sorunu ilet',
    seoTitle: 'Tabela yanmıyor: nedenleri, teşhis ve sonraki adım | PixelRing',
    seoDescription:
      'Tabela neden yanmaz: sigorta, güç kaynağı, kablo, zamanlayıcı, nem, kısa devre veya LED modüller. Güvenli kontroller ve uzman teşhisi.',
  },
  pl: {
    file: path.join('problem_articles', 'вывеска не светится – 01', 'problem_article_vyveska_ne_svetitsya_pl.md'),
    title: 'Reklama nie świeci',
    symptomLabel:
      'Reklama pozostaje ciemna, nie włącza się o czasie albo nie działa jedna litera lub sekcja.',
    shortAnswer:
      'Gdy reklama nie świeci, najpierw sprawdza się tor zasilania: zabezpieczenie, linię 220/230 V, zasilacz, zegar, czujnik zmierzchu, sterownik i połączenia. Jeśli ciemna jest tylko jedna litera lub sekcja, przyczyna zwykle jest lokalna: przewód, zacisk, polaryzacja albo moduły LED. Zapach spalenizny, iskry, ciepło, woda lub ponownie wybijające zabezpieczenie oznaczają, że reklamę trzeba zostawić wyłączoną i sprawdzić fachowo.',
    causes: [
      'Brak zasilania, zadziałało zabezpieczenie lub różnicówka.',
      'Zasilacz jest uszkodzony, przeciążony albo zużyty.',
      'Przewód, zacisk lub połączenie jest luźne, uszkodzone albo utlenione.',
      'W obudowie jest wilgoć, korozja albo zwarcie po stronie wtórnej.',
      'Uszkodzony jest zegar, czujnik zmierzchu, przekaźnik, sterownik lub lokalne moduły LED.',
    ],
    safeChecks: [
      'Sprawdzić zwykły włącznik.',
      'Sprawdzić, czy zabezpieczenie lub różnicówka się nie wyłączyły.',
      'Sprawdzić zewnętrzny zegar, jeśli jest dostępny bez otwierania obudowy.',
      'Sprawdzić, czy inne urządzenia na tej samej linii mają zasilanie.',
      'Zrobić zdjęcie całej reklamy i zbliżenie ciemnego miejsca.',
      'Sfotografować etykietę zasilacza tylko wtedy, gdy jest widoczna bez dotykania przewodów.',
    ],
    urgentWarnings: [
      'Zabezpieczenie lub różnicówka wyłącza się ponownie.',
      'Jest zapach spalenizny, iskry, trzaski albo wyraźne nagrzewanie.',
      'Widać wodę w obudowie, uszkodzony kabel albo odsłonięte żyły.',
      'Awaria pojawiła się po deszczu, śniegu, burzy lub skoku napięcia.',
      'Sprawdzenie wymaga otwarcia obudowy albo pracy na wysokości.',
    ],
    serviceProcess: [
      'Ustalamy, czy nie działa cała reklama, czy tylko jedna strefa.',
      'Sprawdzamy zasilanie, zabezpieczenie, zasilacz, sterowanie i napięcie wyjściowe.',
      'Kontrolujemy przewody, zaciski, polaryzację, wilgoć i moduły LED.',
      'Usuwamy przyczynę usterki, a nie tylko pierwszy podejrzany element.',
    ],
    workScopeFactors: [
      'Wysokość montażu i dostęp.',
      'Położenie i dostępność zasilacza.',
      'Rozmiar reklamy, liczba liter i sekcji.',
      'Stan przewodów, obudowy, uszczelnień i sterowania.',
      'Czy potrzebny jest częściowy demontaż albo uszczelnienie.',
    ],
    ctaLabel: 'Przekaż zgłoszenie',
    seoTitle: 'Reklama nie świeci: przyczyny, diagnostyka i co dalej | PixelRing',
    seoDescription:
      'Dlaczego reklama nie świeci: zabezpieczenie, zasilacz, przewód, zegar, wilgoć, zwarcie lub moduły LED. Bezpieczne kontrole i fachowa diagnoza.',
  },
  ar: {
    file: path.join('problem_articles', 'вывеска не светится – 01', 'problem_article_vyveska_ne_svetitsya_ar.md'),
    title: 'اللوحة لا تضيء',
    symptomLabel:
      'اللوحة تبقى مظلمة، لا تعمل في الوقت المعتاد، أو أن حرفًا أو جزءًا منها لا يضيء.',
    shortAnswer:
      'عندما لا تضيء اللوحة، يبدأ الفحص عادة من مسار التغذية: القاطع، خط 220/230 فولت، مزود الطاقة، المؤقت، حساس الضوء، وحدة التحكم، ونقاط التوصيل. إذا كان العطل في حرف أو جزء واحد فقط، فالسبب غالبًا محلي: كابل، طرف توصيل، قطبية، أو وحدات LED. رائحة الاحتراق، الشرر، السخونة، الماء، أو القاطع الذي يفصل مرة أخرى تعني أن اللوحة يجب أن تبقى مطفأة إلى أن يتم فحصها.',
    causes: [
      'لا توجد تغذية، أو القاطع / قاطع التسرب فصل.',
      'مزود الطاقة معطل، محمل أكثر من اللازم، أو متقادم.',
      'كابل أو طرف أو وصلة مرتخية، تالفة، أو متآكلة.',
      'رطوبة داخل الصندوق، تآكل، أو قصر كهربائي بعد مزود الطاقة.',
      'عطل في المؤقت، حساس الضوء، الريليه، وحدة التحكم، أو وحدات LED المحلية.',
    ],
    safeChecks: [
      'فحص المفتاح العادي.',
      'فحص القاطع أو قاطع التسرب.',
      'فحص المؤقت الخارجي إذا كان متاحًا من دون فتح الصندوق.',
      'التأكد من أن الأجهزة الأخرى على نفس الخط تعمل.',
      'تصوير اللوحة كاملة والمنطقة المظلمة عن قرب.',
      'تصوير بطاقة مزود الطاقة فقط إذا كانت ظاهرة بأمان ومن دون لمس الأسلاك.',
    ],
    urgentWarnings: [
      'القاطع أو قاطع التسرب يفصل مرة أخرى.',
      'رائحة احتراق، شرر، طقطقة، أو سخونة واضحة.',
      'ماء داخل الصندوق، كابل تالف، أو أسلاك مكشوفة.',
      'العطل ظهر بعد مطر، ثلج، عاصفة، أو تغير مفاجئ في الجهد.',
      'الفحص يتطلب فتح الصندوق أو العمل على ارتفاع.',
    ],
    serviceProcess: [
      'نحدد هل العطل في اللوحة كلها أم في منطقة واحدة فقط.',
      'نفحص التغذية، القاطع، مزود الطاقة، التحكم، وجهد الخرج.',
      'نفحص الكابلات، الأطراف، القطبية، الرطوبة، ووحدات LED.',
      'نعالج سبب العطل، لا أول قطعة تبدو مشكوكًا فيها فقط.',
    ],
    workScopeFactors: [
      'ارتفاع التركيب وسهولة الوصول.',
      'مكان مزود الطاقة وإمكانية الوصول إليه.',
      'حجم اللوحة وعدد الحروف والأقسام.',
      'حالة الكابلات، الصندوق، العزل، ونظام التحكم.',
      'الحاجة إلى فك جزئي أو إصلاح العزل.',
    ],
    ctaLabel: 'أرسل المشكلة',
    seoTitle: 'اللوحة لا تضيء: الأسباب، التشخيص، والخطوة التالية | PixelRing',
    seoDescription:
      'لماذا تبقى اللوحة مظلمة: القاطع، مزود الطاقة، الكابل، المؤقت، الرطوبة، القصر الكهربائي أو وحدات LED. فحوصات آمنة وتشخيص متخصص.',
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

function readArticleContent(config) {
  const filePath = path.join(repoDir, 'docs', '07_content_ai_seo', config.file);
  const markdown = fs.readFileSync(filePath, 'utf8');
  return extractPublicArticle(markdown);
}

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
    "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
    "causes","safeChecks","urgentWarnings","serviceProcess","workScopeFactors",
    "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt",
    "deletedAt","createdAt","updatedAt"
  ) VALUES (
    $1,$2,$3::"CmsArticleType",$4::"CmsArticleStatus",$5,$6,$7,$8,
    $9,$10,$11,$12,$13::text[],$14::text[],$15::text[],$16::text[],
    $17::text[],$18::text[],$19,$20,$21,$22,$23,$24,$25,$26
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
  RETURNING "id", "locale", "slug", char_length("content") AS "contentChars"
`;

async function upsertArticle(client, locale, config) {
  const content = readArticleContent(config);
  const article = {
    locale,
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: 'no-light',
    title: config.title,
    symptomLabel: config.symptomLabel,
    shortAnswer: config.shortAnswer,
    content,
    seoTitle: config.seoTitle,
    seoDescription: config.seoDescription,
    canonicalUrl: `/${locale}/probleme-loesungen/werbeanlage-leuchtet-nicht`,
    relatedSlugs: ['flicking', 'letter-out', 'rain-fail'],
    causes: config.causes,
    safeChecks: config.safeChecks,
    urgentWarnings: config.urgentWarnings,
    serviceProcess: config.serviceProcess,
    workScopeFactors: config.workScopeFactors,
    ctaLabel: config.ctaLabel,
    ctaHref: `/${locale}#contact`,
    sortOrder: 0,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };

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
      results.push(await upsertArticle(client, locale, config));
    }

    console.log(
      JSON.stringify(
        {
          seed: 'article-no-light-all-locales',
          slug: 'no-light',
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
