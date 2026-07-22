import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local'), quiet: true });
dotenv.config({ path: path.join(process.cwd(), '.env'), quiet: true });

const PAGE_KEY = 'referenzen';
const LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const REPORT_IMAGE = '/images/references/references-slogan-signage-v1.webp';
const REPORT_IMAGE_ALTS = {
  de: 'Gleichmäßig beleuchtete Profilbuchstaben auf einer hellen Fassade',
  en: 'Evenly illuminated channel letters mounted on a light facade',
  ru: 'Равномерно подсвеченные объёмные буквы на светлом фасаде',
  tr: 'Açık renkli cephede eşit şekilde aydınlatılmış kutu harfler',
  pl: 'Równomiernie podświetlone litery przestrzenne na jasnej elewacji',
  ar: 'حروف بارزة مضاءة بشكل متساوٍ على واجهة فاتحة',
};
const REVISION_REASON =
  'Remove the retired Referenzen product-area intro and product-category card blocks.';
const AUDIT_ACTION = 'CMS_PAGE_REFERENZEN_CONTENT_REPAIRED';
const OBSOLETE_BLOCK_KEYS = new Set([
  'categoriesIntroBlock',
  'productCategoriesBlock',
]);

const STABLE_ID_BLOCKS = {
  galleryItemsBlock: 'gallery',
  reportHooksBlock: 'report-hook',
  reportsBlock: 'report',
};

const LEGACY_RECENT_COPY = {
  de: {
    legacyTitle: 'Vorher sichtbar. Danach wieder betriebsbereit.',
    currentTitle: 'Visuelles Ergebnis und Arbeitsumfang',
    legacyIntro:
      'Die Karten bewegen sich horizontal. Im Fokus oder Hover sehen Sie den problemorientierten Vorher-Zustand; ein Klick oeffnet den kompakten Reparaturbericht.',
    currentIntro:
      'Jede Karte zeigt den Standort vor und nach der Arbeit. Im Bericht stehen Problem, ausgefuehrte Arbeiten und Ergebnis.',
  },
  en: {
    legacyTitle: 'Before it was visible. After it was operational again.',
    currentTitle: 'Visual result and work summary',
    legacyIntro:
      'The cards move horizontally. Hover or focus shows the problem-oriented before state; click opens a compact repair report.',
    currentIntro:
      'Each card shows the site before and after. The report lists the issue, completed work, and result.',
  },
  ru: {
    legacyTitle: 'До было заметно. После снова работает.',
    currentTitle: 'Визуальный результат и список работ',
    legacyIntro:
      'Карточки двигаются горизонтально. При наведении показывается исходное состояние, по клику открывается краткий ремонтный отчет.',
    currentIntro:
      'Каждая карточка показывает объект до и после. Внутри указан краткий отчет: проблема, выполненные работы и результат.',
  },
  tr: {
    legacyTitle: 'Önce sorun görünüyordu. Sonra tekrar çalışır hale geldi.',
    currentTitle: 'Görsel sonuç ve iş özeti',
    legacyIntro:
      'Kartlar yatay hareket eder. Hover veya focus problem odaklı önceki durumu gösterir; tıklama kısa raporu açar.',
    currentIntro:
      'Her kart lokasyonu önce ve sonra gösterir. Raporda sorun, yapılan işler ve sonuç yer alır.',
  },
  pl: {
    legacyTitle: 'Przedtem problem był widoczny. Potem obiekt znów działał.',
    currentTitle: 'Efekt wizualny i zakres prac',
    legacyIntro:
      'Karty przesuwają się poziomo. Hover lub focus pokazuje stan przed naprawą; kliknięcie otwiera krótki raport.',
    currentIntro:
      'Każda karta pokazuje obiekt przed i po pracy. W raporcie są problem, wykonane prace i efekt.',
  },
  ar: {
    legacyTitle: 'كان الخلل واضحاً. ثم عاد العنصر للعمل.',
    currentTitle: 'النتيجة المرئية وملخص العمل',
    legacyIntro:
      'تتحرك البطاقات أفقياً. عند التركيز أو التحويم تظهر حالة ما قبل الإصلاح؛ النقر يفتح تقريراً مختصراً.',
    currentIntro:
      'تعرض كل بطاقة الموقع قبل العمل وبعده. يوضح التقرير المشكلة والعمل المنفذ والنتيجة.',
  },
};

const LAYOUT_COPY = {
  de: {
    gallerySectionTitle: 'Galerie der Arbeiten',
    galleryEyebrow: 'Projektvideo',
    galleryTitle: 'Arbeit im Projekt',
    galleryIntro:
      'Ein kurzer Clip zeigt Montage, Ausführung und die Wirkung der Lichtwerbung direkt am Standort.',
    galleryPromoEyebrow: 'Fotogalerie',
    galleryPromoTitle: 'Details realisierter Arbeiten',
    galleryPromoText:
      'Fotos zeigen Materialien, Verarbeitung und Ergebnisse aus Reparatur, Montage und Branding.',
    galleryPromoCta: 'Fotos ansehen',
    galleryPromoHref: '#gallery',
    finalEyebrow: 'NEXT STEP',
  },
  en: {
    gallerySectionTitle: 'Work gallery',
    galleryEyebrow: 'Project video',
    galleryTitle: 'Work on site',
    galleryIntro:
      'A short clip shows installation, execution, and the effect of illuminated signage at the location.',
    galleryPromoEyebrow: 'Photo gallery',
    galleryPromoTitle: 'Details from completed work',
    galleryPromoText:
      'Photos show materials, workmanship, and results from repair, installation, and branding.',
    galleryPromoCta: 'View photos',
    galleryPromoHref: '#gallery',
    finalEyebrow: 'NEXT STEP',
  },
  ru: {
    gallerySectionTitle: 'Галерея работ',
    galleryEyebrow: 'Видео проекта',
    galleryTitle: 'Работа на объекте',
    galleryIntro:
      'Короткий ролик показывает монтаж, выполнение работ и результат световой рекламы непосредственно на объекте.',
    galleryPromoEyebrow: 'Фотогалерея',
    galleryPromoTitle: 'Детали выполненных работ',
    galleryPromoText:
      'Фотографии показывают материалы, качество исполнения и результаты ремонта, монтажа и брендинга.',
    galleryPromoCta: 'Смотреть фотографии',
    galleryPromoHref: '#gallery',
    finalEyebrow: 'СЛЕДУЮЩИЙ ШАГ',
  },
  tr: {
    gallerySectionTitle: 'İş galerisi',
    galleryEyebrow: 'Proje videosu',
    galleryTitle: 'Sahada çalışma',
    galleryIntro:
      'Kısa video, montajı, uygulamayı ve ışıklı reklamın lokasyondaki etkisini gösterir.',
    galleryPromoEyebrow: 'Fotoğraf galerisi',
    galleryPromoTitle: 'Tamamlanan işlerden detaylar',
    galleryPromoText:
      'Fotoğraflar onarım, montaj ve markalama çalışmalarındaki malzemeleri, işçiliği ve sonuçları gösterir.',
    galleryPromoCta: 'Fotoğrafları görüntüle',
    galleryPromoHref: '#gallery',
    finalEyebrow: 'SONRAKI ADIM',
  },
  pl: {
    gallerySectionTitle: 'Galeria prac',
    galleryEyebrow: 'Wideo projektu',
    galleryTitle: 'Praca na miejscu',
    galleryIntro:
      'Krótki film pokazuje montaż, wykonanie i efekt reklamy świetlnej bezpośrednio w obiekcie.',
    galleryPromoEyebrow: 'Galeria zdjęć',
    galleryPromoTitle: 'Detale zrealizowanych prac',
    galleryPromoText:
      'Zdjęcia pokazują materiały, jakość wykonania i rezultaty napraw, montażu oraz brandingu.',
    galleryPromoCta: 'Zobacz zdjęcia',
    galleryPromoHref: '#gallery',
    finalEyebrow: 'NASTEPNY KROK',
  },
  ar: {
    gallerySectionTitle: 'معرض الأعمال',
    galleryEyebrow: 'فيديو المشروع',
    galleryTitle: 'العمل في الموقع',
    galleryIntro:
      'يعرض مقطع قصير التركيب والتنفيذ وتأثير الإعلان المضيء مباشرة في الموقع.',
    galleryPromoEyebrow: 'معرض الصور',
    galleryPromoTitle: 'تفاصيل من الأعمال المنفذة',
    galleryPromoText:
      'تعرض الصور المواد وجودة التنفيذ ونتائج الإصلاح والتركيب والهوية البصرية.',
    galleryPromoCta: 'عرض الصور',
    galleryPromoHref: '#gallery',
    finalEyebrow: 'الخطوة التالية',
  },
};

function parseArgs(argv = process.argv.slice(2)) {
  const supported = new Set(['--apply', '--help']);
  const unknown = argv.filter((argument) => !supported.has(argument));

  if (unknown.length > 0) {
    throw new Error(`Unknown argument(s): ${unknown.join(', ')}`);
  }

  return {
    apply: argv.includes('--apply'),
    help: argv.includes('--help'),
  };
}

function printHelp() {
  console.log(`Usage:
  node scripts/repair-referenzen-cms-content.mjs          # dry-run only
  node scripts/repair-referenzen-cms-content.mjs --apply  # one atomic write transaction

The script never mutates or deletes CmsMedia rows or stored media binaries.`);
}

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function twoDigitIndex(index) {
  return String(index + 1).padStart(2, '0');
}

function getBlock(blocks, key) {
  return blocks.find((block) => isObject(block) && block.key === key) ?? null;
}

function getObjectItems(blocks, key) {
  const block = getBlock(blocks, key);
  if (!block || !Array.isArray(block.items)) return [];
  return block.items.filter(isObject);
}

function collectImageUrls(value, urls = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectImageUrls(item, urls);
    return urls;
  }

  if (!isObject(value)) return urls;

  for (const [key, nested] of Object.entries(value)) {
    if (hasText(nested) && /image/i.test(key)) {
      urls.add(nested.trim());
    } else if (nested && typeof nested === 'object') {
      collectImageUrls(nested, urls);
    }
  }

  return urls;
}

function buildMediaAltMap(mediaRows) {
  const result = new Map();

  for (const media of mediaRows) {
    const alt = hasText(media.altText)
      ? media.altText.trim()
      : hasText(media.title)
        ? media.title.trim()
        : null;

    if (!alt) continue;

    for (const url of [media.publicUrl, media.fallbackUrl]) {
      if (hasText(url) && !result.has(url.trim())) {
        result.set(url.trim(), alt);
      }
    }
  }

  return result;
}

function planningItems(page, blockKey) {
  const items = getObjectItems(Array.isArray(page.blocks) ? page.blocks : [], blockKey);

  if (blockKey !== 'galleryItemsBlock') return items;

  return items.filter(
    (item) =>
      hasText(item.title) &&
      hasText(item.category) &&
      hasText(item.image) &&
      hasText(item.description)
  );
}

function buildStableIdPlan(pages) {
  const pagesByLocale = [...pages].sort(
    (left, right) => LOCALES.indexOf(left.locale) - LOCALES.indexOf(right.locale)
  );
  const plan = new Map();

  for (const [blockKey, prefix] of Object.entries(STABLE_ID_BLOCKS)) {
    const maximumItems = Math.max(
      0,
      ...pagesByLocale.map((page) => planningItems(page, blockKey).length)
    );
    const ids = [];

    for (let index = 0; index < maximumItems; index += 1) {
      const peerId = pagesByLocale
        .map((page) => planningItems(page, blockKey)[index]?.id)
        .find(hasText);
      ids.push(peerId?.trim() ?? `${prefix}-${twoDigitIndex(index)}`);
    }

    plan.set(blockKey, ids);
  }

  return plan;
}

function emptySummary() {
  return {
    removedObsoleteBlocks: 0,
    removedGalleryItems: 0,
    assignedIds: {
      galleryItemsBlock: 0,
      reportHooksBlock: 0,
      reportsBlock: 0,
    },
    filledImageAlts: 0,
    filledLayoutFields: 0,
    updatedRecentTitle: 0,
    updatedRecentIntro: 0,
    mediaAltMisses: [],
  };
}

function repairLayoutFields(block, locale, summary) {
  const copy = LAYOUT_COPY[locale];
  if (!copy) return block;

  const fieldsByBlock = {
    galleryIntroBlock: {
      pretitle: copy.galleryEyebrow,
      sectionTitle: copy.gallerySectionTitle,
      title: copy.galleryTitle,
      description: copy.galleryIntro,
    },
    promoBlock: {
      badge: copy.galleryPromoEyebrow,
      title: copy.galleryPromoTitle,
      description: copy.galleryPromoText,
      primaryLabel: copy.galleryPromoCta,
      requestHref: copy.galleryPromoHref,
    },
    finalCtaBlock: { badge: copy.finalEyebrow },
  };
  const desiredFields = fieldsByBlock[block.key];
  if (!desiredFields) return block;

  const changedEntries = Object.entries(desiredFields).filter(
    ([field, value]) => block[field] !== value
  );
  if (changedEntries.length === 0) return block;

  summary.filledLayoutFields += changedEntries.length;
  return { ...block, ...Object.fromEntries(changedEntries) };
}

function fillAltFromMedia(item, altField, imageField, fieldPath, mediaAltByUrl, summary) {
  if (hasText(item[altField]) || !hasText(item[imageField])) return item;

  const alt = mediaAltByUrl.get(item[imageField].trim());
  if (!alt) {
    summary.mediaAltMisses.push(`${fieldPath}.${altField}`);
    return item;
  }

  summary.filledImageAlts += 1;
  return { ...item, [altField]: alt };
}

function assignStableId(item, blockKey, itemIndex, stableIdPlan, summary) {
  if (hasText(item.id)) return item;

  const id =
    stableIdPlan.get(blockKey)?.[itemIndex] ??
    `${STABLE_ID_BLOCKS[blockKey]}-${twoDigitIndex(itemIndex)}`;
  summary.assignedIds[blockKey] += 1;
  return { ...item, id };
}

function repairRecentIntroBlock(block, locale, summary) {
  const copy = LEGACY_RECENT_COPY[locale];
  if (!copy) return block;

  let next = block;
  if (block.title === copy.legacyTitle) {
    next = { ...next, title: copy.currentTitle };
    summary.updatedRecentTitle += 1;
  }
  if (block.description === copy.legacyIntro) {
    next = { ...next, description: copy.currentIntro };
    summary.updatedRecentIntro += 1;
  }
  return next;
}

function repairCaseItems(items, mediaAltByUrl, summary) {
  return items.map((rawItem, index) => {
    if (!isObject(rawItem)) return rawItem;

    const itemPath = `casesBlock.items[${index}]`;
    let item = fillAltFromMedia(
      rawItem,
      'beforeAlt',
      'beforeImage',
      itemPath,
      mediaAltByUrl,
      summary
    );
    item = fillAltFromMedia(
      item,
      'afterAlt',
      'afterImage',
      itemPath,
      mediaAltByUrl,
      summary
    );

    for (const slot of [1, 2, 3]) {
      item = fillAltFromMedia(
        item,
        `galleryAlt${slot}`,
        `galleryImage${slot}`,
        itemPath,
        mediaAltByUrl,
        summary
      );
    }

    return item;
  });
}

function repairGalleryItems(items, mediaAltByUrl, stableIdPlan, summary) {
  const retained = [];

  items.forEach((rawItem, originalIndex) => {
    if (!isObject(rawItem)) {
      summary.removedGalleryItems += 1;
      return;
    }

    if (
      !hasText(rawItem.title) ||
      !hasText(rawItem.category) ||
      !hasText(rawItem.image) ||
      !hasText(rawItem.description)
    ) {
      summary.removedGalleryItems += 1;
      return;
    }

    const itemPath = `galleryItemsBlock.items[${originalIndex}]`;
    let item = fillAltFromMedia(
      rawItem,
      'imageAlt',
      'image',
      itemPath,
      mediaAltByUrl,
      summary
    );

    if (!hasText(item.imageAlt)) {
      summary.removedGalleryItems += 1;
      return;
    }

    item = assignStableId(
      item,
      'galleryItemsBlock',
      retained.length,
      stableIdPlan,
      summary
    );
    retained.push(item);
  });

  return retained;
}

function repairIdList(items, blockKey, stableIdPlan, summary) {
  return items.map((rawItem, index) =>
    isObject(rawItem)
      ? assignStableId(rawItem, blockKey, index, stableIdPlan, summary)
      : rawItem
  );
}

export function repairReferenzenBlocks(
  blocks,
  locale,
  mediaAltByUrl,
  stableIdPlan
) {
  const summary = emptySummary();
  const nextBlocks = blocks
    .filter((rawBlock) => {
      if (!isObject(rawBlock) || !hasText(rawBlock.key)) return true;
      if (!OBSOLETE_BLOCK_KEYS.has(rawBlock.key)) return true;
      summary.removedObsoleteBlocks += 1;
      return false;
    })
    .map((rawBlock) => {
      if (!isObject(rawBlock) || !hasText(rawBlock.key)) return rawBlock;

      const block = repairLayoutFields(rawBlock, locale, summary);

      if (block.key === 'recentIntroBlock') {
        return repairRecentIntroBlock(block, locale, summary);
      }

      if (block.key === 'reportIntroBlock') {
        return {
          ...block,
          image: hasText(block.image) ? block.image : REPORT_IMAGE,
          imageAlt: hasText(block.imageAlt)
            ? block.imageAlt
            : REPORT_IMAGE_ALTS[locale],
        };
      }

      if (!Array.isArray(block.items)) return block;

      if (block.key === 'casesBlock') {
        return {
          ...block,
          items: repairCaseItems(block.items, mediaAltByUrl, summary),
        };
      }

      if (block.key === 'galleryItemsBlock') {
        return {
          ...block,
          items: repairGalleryItems(
            block.items,
            mediaAltByUrl,
            stableIdPlan,
            summary
          ),
        };
      }

      if (block.key === 'reportHooksBlock' || block.key === 'reportsBlock') {
        return {
          ...block,
          items: repairIdList(
            block.items,
            block.key,
            stableIdPlan,
            summary
          ),
        };
      }

      return block;
    });

  return { blocks: nextBlocks, summary };
}

function buildRevisionSnapshot(page) {
  const toIso = (value) => (value instanceof Date ? value.toISOString() : value ?? null);

  return {
    pageKey: page.pageKey,
    locale: page.locale,
    status: page.status,
    title: page.title,
    blocks: page.blocks,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    canonicalUrl: page.canonicalUrl,
    publishedAt: toIso(page.publishedAt),
    lastReviewedAt: toIso(page.lastReviewedAt),
  };
}

function sumResults(results) {
  return results.reduce(
    (total, result) => {
      total.changedPages += result.changed ? 1 : 0;
      total.removedObsoleteBlocks += result.summary.removedObsoleteBlocks;
      total.removedGalleryItems += result.summary.removedGalleryItems;
      total.filledImageAlts += result.summary.filledImageAlts;
      total.filledLayoutFields += result.summary.filledLayoutFields;
      total.assignedIds += Object.values(result.summary.assignedIds).reduce(
        (sum, value) => sum + value,
        0
      );
      total.validationIssues += result.validationIssues.length;
      return total;
    },
    {
      changedPages: 0,
      removedObsoleteBlocks: 0,
      removedGalleryItems: 0,
      filledImageAlts: 0,
      filledLayoutFields: 0,
      assignedIds: 0,
      validationIssues: 0,
    }
  );
}

function getCrossLocaleIdIssues(results) {
  const issues = [];

  for (const blockKey of Object.keys(STABLE_ID_BLOCKS)) {
    const itemLists = results.map((result) => ({
      locale: result.locale,
      items: getObjectItems(result.blocks, blockKey),
    }));
    const maximumItems = Math.max(0, ...itemLists.map((entry) => entry.items.length));

    for (let index = 0; index < maximumItems; index += 1) {
      const ids = itemLists
        .map((entry) => ({ locale: entry.locale, id: entry.items[index]?.id }))
        .filter((entry) => hasText(entry.id));
      const uniqueIds = new Set(ids.map((entry) => entry.id.trim()));

      if (uniqueIds.size > 1) {
        issues.push({
          blockKey,
          itemIndex: index,
          ids: ids.map((entry) => `${entry.locale}:${entry.id.trim()}`),
        });
      }
    }
  }

  return issues;
}

function printSummary({ apply, missingLocales, mediaRows, results, crossLocaleIdIssues }) {
  const totals = sumResults(results);
  console.log(`Referenzen CMS content repair — ${apply ? 'APPLY' : 'DRY RUN'}`);
  console.log(`Pages found: ${results.length}/${LOCALES.length}`);
  console.log(`Active CmsMedia rows matched: ${mediaRows.length}`);

  for (const result of results) {
    const assignedIds = Object.values(result.summary.assignedIds).reduce(
      (sum, value) => sum + value,
      0
    );
    console.log(
      [
        result.locale,
        result.changed ? 'change' : 'unchanged',
        `obsolete-blocks-removed=${result.summary.removedObsoleteBlocks}`,
        `gallery-removed=${result.summary.removedGalleryItems}`,
        `ids-added=${assignedIds}`,
        `alts-filled=${result.summary.filledImageAlts}`,
        `layout-fields-added=${result.summary.filledLayoutFields}`,
        `validation-issues=${result.validationIssues.length}`,
      ].join(' | ')
    );
  }

  if (missingLocales.length > 0) {
    console.log(`Missing locale records: ${missingLocales.join(', ')}`);
  }

  for (const result of results) {
    for (const issue of result.validationIssues) {
      console.log(`VALIDATION ${result.locale} ${issue.code} ${issue.fieldPath}`);
    }
  }

  for (const issue of crossLocaleIdIssues) {
    console.log(
      `CROSS_LOCALE_ID ${issue.blockKey}.items[${issue.itemIndex}] ${issue.ids.join(', ')}`
    );
  }

  console.log(
    `Totals: changed-pages=${totals.changedPages}, obsolete-blocks-removed=${totals.removedObsoleteBlocks}, gallery-removed=${totals.removedGalleryItems}, ids-added=${totals.assignedIds}, alts-filled=${totals.filledImageAlts}, layout-fields-added=${totals.filledLayoutFields}, validation-issues=${totals.validationIssues}, cross-locale-id-issues=${crossLocaleIdIssues.length}`
  );
  console.log(
    apply
      ? 'Apply plan validated. No data has been written yet; the transaction starts only after this validation summary.'
      : 'Dry run complete. No page, revision, audit, media, or binary data was changed.'
  );
}

async function main() {
  const { apply, help } = parseArgs();
  if (help) {
    printHelp();
    return;
  }

  const [{ prisma }, { getReferenzenPublishIssues }] = await Promise.all([
    import('../src/lib/prisma.ts'),
    import('../src/lib/cms/referenzen-schema.ts'),
  ]);

  try {
    const pages = await prisma.cmsPage.findMany({
      where: {
        pageKey: PAGE_KEY,
        locale: { in: LOCALES },
      },
      orderBy: { locale: 'asc' },
    });
    const pageByLocale = new Map(pages.map((page) => [page.locale, page]));
    const orderedPages = LOCALES.map((locale) => pageByLocale.get(locale)).filter(Boolean);
    const missingLocales = LOCALES.filter((locale) => !pageByLocale.has(locale));
    const imageUrls = [
      ...collectImageUrls(orderedPages.map((page) => page.blocks)),
    ];
    const mediaRows = imageUrls.length
      ? await prisma.cmsMedia.findMany({
          where: {
            deletedAt: null,
            OR: [
              { publicUrl: { in: imageUrls } },
              { fallbackUrl: { in: imageUrls } },
            ],
          },
          select: {
            id: true,
            publicUrl: true,
            fallbackUrl: true,
            altText: true,
            title: true,
          },
        })
      : [];
    const mediaAltByUrl = buildMediaAltMap(mediaRows);
    const stableIdPlan = buildStableIdPlan(orderedPages);
    const results = orderedPages.map((page) => {
      const blocks = Array.isArray(page.blocks) ? page.blocks : [];
      const repaired = repairReferenzenBlocks(
        blocks,
        page.locale,
        mediaAltByUrl,
        stableIdPlan
      );
      const validationIssues = getReferenzenPublishIssues(
        repaired.blocks.filter(isObject),
        page.locale
      );

      return {
        id: page.id,
        locale: page.locale,
        status: page.status,
        deleted: page.deletedAt !== null,
        changed: JSON.stringify(blocks) !== JSON.stringify(repaired.blocks),
        blocks: repaired.blocks,
        summary: repaired.summary,
        validationIssues,
      };
    });
    const crossLocaleIdIssues = getCrossLocaleIdIssues(results);

    printSummary({
      apply,
      missingLocales,
      mediaRows,
      results,
      crossLocaleIdIssues,
    });

    const validationIssueCount = results.reduce(
      (sum, result) => sum + result.validationIssues.length,
      0
    );
    if (
      missingLocales.length > 0 ||
      validationIssueCount > 0 ||
      crossLocaleIdIssues.length > 0
    ) {
      process.exitCode = 1;
      if (apply) {
        throw new Error(
          'Apply aborted because all six records and a clean strict-schema validation are required.'
        );
      }
      return;
    }

    const changedResults = results.filter((result) => result.changed);
    if (!apply || changedResults.length === 0) return;

    await prisma.$transaction(
      async (tx) => {
        for (const result of changedResults) {
          const updatedPage = await tx.cmsPage.update({
            where: { id: result.id },
            data: { blocks: result.blocks },
          });
          const revisionSnapshot = buildRevisionSnapshot(updatedPage);

          await tx.cmsPageRevision.create({
            data: {
              pageId: updatedPage.id,
              sourceAction: 'UPDATE',
              reason: REVISION_REASON,
              actorAdminUserId: null,
              actorSessionId: null,
              actorRole: null,
              snapshot: revisionSnapshot,
            },
          });

          await tx.adminAuditLog.create({
            data: {
              actorSessionId: null,
              actorAdminUserId: null,
              actorRole: null,
              action: AUDIT_ACTION,
              resourceType: 'CMS_PAGE',
              resourceId: updatedPage.id,
              outcome: 'SUCCESS',
              reason: REVISION_REASON,
              details: {
                pageKey: updatedPage.pageKey,
                locale: updatedPage.locale,
                changedFields: ['blocks'],
                repairSummary: result.summary,
                revisionSnapshot,
                mediaBinariesChanged: false,
              },
            },
          });
        }
      },
      { maxWait: 10_000, timeout: 30_000 }
    );
    console.log(
      `Apply complete: ${changedResults.length} page(s), ${changedResults.length} revision(s), and ${changedResults.length} actor-null audit log(s) were written atomically. Media rows and binaries were not changed.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  main().catch((error) => {
    console.error(`Referenzen CMS repair failed: ${error.message}`);
    process.exitCode = 1;
  });
}
