/**
 * Seed: RU SYMPTOM articles for /probleme-loesungen page.
 *
 * Each article uses the SAME slugs as the DE seed (locale is separate),
 * so SLUG_TO_PROBLEM_ID in page.tsx maps correctly for all locales.
 *
 * Content is structured for:
 *  - Frontend card expansion (causes, safeChecks, urgentWarnings, serviceProcess)
 *  - GEO / AI training (shortAnswer → AI snippet answers)
 *  - SEO (seoTitle, seoDescription, content markdown with H2/H3 sections)
 *  - FAQPage JSON-LD schema (shortAnswer used as acceptedAnswer.text)
 *
 * Run: node scripts/seed-cms-symptom-articles-ru.mjs
 */

import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error('Missing DB connection string. Set POSTGRES_PRISMA_URL or DATABASE_URL.');
}

const now = new Date();

// Shared service process for all RU articles.
// Used in the "Как мы это решаем" section of each card.
const serviceProcess = [
  'Запрашиваем фото или краткое описание проблемы',
  'Классифицируем симптом и оцениваем уровень срочности',
  'При необходимости организуем выезд специалиста для диагностики',
  'Фиксируем и документируем ремонт или замену',
];

/**
 * Article data for all 9 symptom scenarios.
 * slug MUST match the DE seed (SLUG_TO_PROBLEM_ID in page.tsx uses these slugs).
 * Fields map directly to CmsArticle columns.
 */
const articleMap = [
  {
    slug: 'no-light',
    title: 'Вывеска не светится',
    symptomLabel: 'Вывеска не светится',
    shortAnswer:
      'Чаще всего причина — перебои в питании, проблемы с контактами или попадание влаги. Если конструкция полностью не включается, это требует своевременной проверки.',
    causes: [
      'Перебой в электропитании',
      'Проблема с контактами или кабелем',
      'Попадание влаги в корпус',
      'Выход из строя блока питания или контроллера',
    ],
    safeChecks: [
      'Проверить, не исчезло ли питание у других устройств рядом',
      'Осмотреть кабели снаружи на видимые повреждения — не трогать руками',
      'Сделать фото пострадавшей зоны для диагностики',
      'Отметить, полностью ли темная конструкция или только частично',
    ],
    urgentWarnings: [
      'При запахе гари, искрах или срабатывании автомата — немедленно отключить',
      'При попадании влаги — не пытаться открыть корпус самостоятельно',
    ],
    workScopeFactors: [
      'Доступность конструкции',
      'Тип электропитания',
      'Один участок затронут или вся конструкция',
    ],
    relatedSlugs: ['flicking', 'uneven-light', 'rain-fail'],
  },
  {
    slug: 'flicking',
    title: 'Вывеска мерцает',
    symptomLabel: 'Вывеска мерцает',
    shortAnswer:
      'Мерцание обычно возникает из-за нестабильного блока питания, плохого контакта или влаги. Если проблема появилась после дождя — необходима диагностика.',
    causes: [
      'Нестабильное напряжение питания',
      'Плохой контакт в соединении',
      'Влага или коррозия внутри корпуса',
      'Неисправный LED-драйвер',
    ],
    safeChecks: [
      'Зафиксировать: мерцание постоянное или периодическое',
      'Отметить, усилилось ли после дождя или ветра',
      'Записать короткое видео для диагностики',
    ],
    urgentWarnings: [
      'При искрах, запахе или полном отключении — сразу обесточить',
      'Не трогать открытые элементы при наличии влаги',
    ],
    workScopeFactors: [
      'Площадь поражения',
      'Состояние блока питания и кабелей',
      'Влияние внешних погодных условий',
    ],
    relatedSlugs: ['no-light', 'uneven-light', 'rain-fail'],
  },
  {
    slug: 'uneven-light',
    title: 'LED светит неравномерно',
    symptomLabel: 'LED светит неравномерно',
    shortAnswer:
      'Неравномерная яркость обычно указывает на проблему с модулями, питающей линией или старение. Дефект чаще всего локальный и хорошо поддается диагностике.',
    causes: [
      'Выход из строя отдельных LED-модулей',
      'Частичный обрыв в питающей линии',
      'Загрязнение или попадание влаги',
      'Разброс характеристик светодиодов из-за старения',
    ],
    safeChecks: [
      'Проверить: только отдельные сегменты темнее или всё',
      'Сфотографировать при одинаковом освещении',
      'Описать: эффект постоянный или меняется',
    ],
    urgentWarnings: [
      'При заметном нагреве — отключить конструкцию',
      'При дыме или запахе — не включать повторно',
    ],
    workScopeFactors: [
      'Количество затронутых сегментов',
      'Доступность модулей',
      'Есть ли электрические повреждения или только визуальные',
    ],
    relatedSlugs: ['no-light', 'flicking', 'letter-out'],
  },
  {
    slug: 'letter-out',
    title: 'Не светится одна буква',
    symptomLabel: 'Не светится одна буква',
    shortAnswer:
      'Если не работает только одна буква, проблема чаще всего локальная: модуль, контакт или проводка именно этого элемента. Это хорошо поддается точечной диагностике.',
    causes: [
      'Локальная ошибка соединения',
      'Выход из строя LED-модуля',
      'Повреждение внутри конкретной буквы',
    ],
    safeChecks: [
      'Сравнить: одна буква или несколько',
      'Осмотреть снаружи на видимые повреждения',
      'Сделать фото с отметкой пострадавшей буквы',
    ],
    urgentWarnings: [
      'При люфте деталей или попадании воды — не эксплуатировать дальше',
      'При запахе гари или искрах — немедленно отключить',
    ],
    workScopeFactors: [
      'Конструкция буквы',
      'Доступность к пострадавшему месту',
      'Затронута ли питающая линия или только буква',
    ],
    relatedSlugs: ['uneven-light', 'no-light', 'rain-fail'],
  },
  {
    slug: 'rain-fail',
    title: 'Вывеска отключается после дождя',
    symptomLabel: 'Вывеска отключается после дождя',
    shortAnswer:
      'Отключение после дождя часто указывает на влагу, нарушение герметичности или коррозию. Требует безопасной проверки, прежде чем могут возникнуть дополнительные повреждения.',
    causes: [
      'Вода проникает в корпус или соединение',
      'Коррозия контактов',
      'Защитный автомат срабатывает на ток утечки',
    ],
    safeChecks: [
      'Зафиксировать: отключение мгновенное или с задержкой после дождя',
      'Задокументировать видимые следы влаги только снаружи',
      'Проверить, затронуты ли другие наружные устройства',
    ],
    urgentWarnings: [
      'При влаге и напряжении — не вскрывать самостоятельно',
      'При срабатывании автомата — не включать повторно до проверки',
    ],
    workScopeFactors: [
      'Место проникновения воды',
      'Степень коррозии',
      'Доступность загерметизированных зон',
    ],
    relatedSlugs: ['no-light', 'flicking', 'loose-sign'],
  },
  {
    slug: 'peeling-film',
    title: 'Плёнка на витрине отклеилась',
    symptomLabel: 'Плёнка на витрине отклеилась',
    shortAnswer:
      'Отклеивание плёнки обычно вызвано старением клея, плохим сцеплением или влагой. Чем раньше провести осмотр, тем легче ограничить ущерб.',
    causes: [
      'Клей утратил сцепление',
      'Основание больше не держит',
      'Влага или перепады температуры',
    ],
    safeChecks: [
      'Проверить края и пузыри только визуально',
      'Не тянуть за отслоившиеся края',
      'Сфотографировать крупным планом и общий вид',
    ],
    urgentWarnings: [
      'При больших провисших участках — вызвать специалиста для фиксации',
      'Не пытаться самостоятельно закрепить свисающие куски',
    ],
    workScopeFactors: [
      'Площадь поражения',
      'Состояние основания',
      'Нужна ли частичная или полная переоклейка',
    ],
    relatedSlugs: ['faded-film', 'loose-sign', 'urgent-repair'],
  },
  {
    slug: 'faded-film',
    title: 'Плёнка выгорела',
    symptomLabel: 'Плёнка выгорела',
    shortAnswer:
      'Выгорание — это вопрос материала и UV-нагрузки. Если поверхность выглядит неаккуратно, обновление часто более оправдано, чем ретушь.',
    causes: [
      'Продолжительное UV-воздействие',
      'Материал стареет под влиянием погоды',
      'Разная нагрузка на отдельные участки',
    ],
    safeChecks: [
      'Сравнить: выгорание равномерное или локальное',
      'Сфотографировать при дневном освещении',
      'Проверить наличие трещин или других повреждений',
    ],
    urgentWarnings: [
      'При отслоениях или трещинах — не рассчитывать на самостоятельный ремонт',
      'Если поверхность вздулась — своевременно вызвать специалиста',
    ],
    workScopeFactors: [
      'Площадь',
      'Частичная или полная замена',
      'Нужно ли обновлять основание',
    ],
    relatedSlugs: ['peeling-film', 'loose-sign', 'urgent-repair'],
  },
  {
    slug: 'shaky-sign',
    title: 'Вывеска шатается',
    symptomLabel: 'Вывеска шатается',
    shortAnswer:
      'Шатание — сигнал о проблеме с безопасностью. Причины: крепление, ветровая нагрузка или усталость материала. Откладывать не стоит.',
    causes: [
      'Ослабло крепление',
      'Коррозия или усталость материала',
      'Повышенная ветровая нагрузка',
    ],
    safeChecks: [
      'Наблюдать движение только с безопасного расстояния',
      'Отметить, усиливается ли при ветре',
      'Освободить зону под конструкцией',
    ],
    urgentWarnings: [
      'При сильном люфте или хрусте — немедленно огородить зону',
      'Не пытаться зафиксировать самостоятельно, особенно на высоте',
    ],
    workScopeFactors: [
      'Тип крепления',
      'Состояние несущей конструкции',
      'Необходимость ограждения до ремонта',
    ],
    relatedSlugs: ['urgent-repair', 'peeling-film', 'rain-fail'],
  },
  {
    slug: 'urgent-repair',
    title: 'Нужен срочный ремонт',
    symptomLabel: 'Нужен срочный ремонт',
    shortAnswer:
      'Если конструкция остро неисправна, безопасность — приоритет. Срочные отказы, шатание или видимые повреждения требуют немедленной оценки.',
    causes: [
      'Острый электрический или механический дефект',
      'Повреждение, затрагивающее безопасность',
      'Влага или отказ после нагрузки',
    ],
    safeChecks: [
      'Обезопасить конструкцию и наблюдать только с расстояния',
      'Задокументировать фото или видео',
      'Проверить, нужно ли немедленно прекратить эксплуатацию',
    ],
    urgentWarnings: [
      'При искрах, дыме, воде или люфте — немедленно обесточить',
      'Никаких самодельных ремонтов на критических узлах',
    ],
    workScopeFactors: [
      'Уровень угрозы безопасности',
      'Доступность и срочность',
      'Нужна только диагностика или срочный выезд',
    ],
    relatedSlugs: ['no-light', 'rain-fail', 'shaky-sign'],
  },
];

const titleBySlug = new Map(articleMap.map((a) => [a.slug, a.title]));

function formatList(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function buildContent(article) {
  const relatedTitles = article.relatedSlugs
    .map((slug) => titleBySlug.get(slug))
    .filter(Boolean);

  return [
    `# ${article.title}`,
    '',
    article.shortAnswer,
    '',
    '## Что это обычно означает',
    formatList(article.causes),
    '',
    '## Что можно безопасно проверить самостоятельно',
    formatList(article.safeChecks),
    '',
    '## Когда нужно действовать быстро',
    formatList(article.urgentWarnings),
    '',
    '## Как мы обычно решаем это',
    formatList(serviceProcess),
    '',
    '## От чего зависит объём работ',
    formatList(article.workScopeFactors),
    '',
    '## Похожие ситуации',
    formatList(relatedTitles.length > 0 ? relatedTitles : article.relatedSlugs),
    '',
    '## Следующий шаг',
    'Отправьте нам фото или краткое описание — мы сможем быстрее определить причину и порекомендовать оптимальные действия.',
  ].join('\n');
}

function buildSeedArticle(article, sortOrder) {
  return {
    locale: 'ru',
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: article.slug,
    title: article.title,
    symptomLabel: article.symptomLabel,
    shortAnswer: article.shortAnswer,
    content: buildContent(article),
    seoTitle: `${article.title} | PixelRing Ремонт`,
    seoDescription: article.shortAnswer,
    canonicalUrl: `/ru/probleme-loesungen`,
    relatedSlugs: article.relatedSlugs,
    causes: article.causes,
    safeChecks: article.safeChecks,
    urgentWarnings: article.urgentWarnings,
    serviceProcess,
    workScopeFactors: article.workScopeFactors,
    ctaLabel: 'Отправить фото',
    ctaHref: '/ru#contact',
    sortOrder,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

const seedArticles = articleMap.map((article, index) => buildSeedArticle(article, index));

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id",
    "locale",
    "type",
    "status",
    "slug",
    "title",
    "symptomLabel",
    "shortAnswer",
    "content",
    "seoTitle",
    "seoDescription",
    "canonicalUrl",
    "relatedSlugs",
    "causes",
    "safeChecks",
    "urgentWarnings",
    "serviceProcess",
    "workScopeFactors",
    "ctaLabel",
    "ctaHref",
    "sortOrder",
    "publishedAt",
    "lastReviewedAt",
    "deletedAt",
    "createdAt",
    "updatedAt"
  ) VALUES (
    $1,
    $2,
    $3::"CmsArticleType",
    $4::"CmsArticleStatus",
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13::text[],
    $14::text[],
    $15::text[],
    $16::text[],
    $17::text[],
    $18::text[],
    $19,
    $20,
    $21,
    $22,
    $23,
    $24,
    $25,
    $26
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
`;

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query('begin');

    for (const article of seedArticles) {
      const articleId = crypto.randomUUID();
      const values = [
        articleId,
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

      await client.query(upsertSql, values);
    }

    await client.query('commit');

    console.log(
      JSON.stringify({
        seed: 'cms-symptom-articles-ru',
        locale: 'ru',
        count: seedArticles.length,
        slugs: seedArticles.map((a) => a.slug),
      })
    );
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
