import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LOCALES,
  auditPages,
  collectReferenzenAuditIssues,
  inspectLocalizedRouteMarkup,
  parseArgs,
  selectPageDefinitions,
  shouldAuditProblemArticles,
} from './audit-cms-public-content.mjs';

function buildCase(overrides = {}) {
  return {
    id: 'case-lightbox',
    title: 'Lightbox repair',
    category: 'Lightbox',
    problem: 'Part of the light field was dark.',
    work: 'Power and LED modules were checked.',
    result: 'The light field is even again.',
    defaultText: 'Even illumination after repair.',
    beforeText: 'Before: a dark area was visible.',
    beforeImage: '/before.webp',
    afterImage: '/after.webp',
    beforeAlt: 'Lightbox before repair with a dark area',
    afterAlt: 'Lightbox after repair with even illumination',
    galleryImage1: '/detail.webp',
    galleryAlt1: 'Lightbox repair detail',
    ...overrides,
  };
}

function buildValidBlocks() {
  return [
    {
      type: 'hero',
      key: 'heroBlock',
      enabled: true,
      title: 'Visible results',
      intro: 'Selected repair examples.',
      heroImage1: '/hero.webp',
    },
    {
      type: 'cardList',
      key: 'casesBlock',
      enabled: true,
      items: [buildCase()],
    },
    {
      type: 'cardList',
      key: 'galleryItemsBlock',
      enabled: true,
      items: [
        {
          id: 'gallery-lightbox',
          title: 'Lightbox detail',
          category: 'Lightbox',
          image: '/gallery.webp',
          imageAlt: 'Repaired lightbox detail',
          description: 'Even illumination after repair.',
        },
      ],
    },
    {
      type: 'textSection',
      key: 'reportIntroBlock',
      enabled: true,
      title: 'A sign should not look tired.',
      image: '/images/references/references-slogan-signage-v1.webp',
      imageAlt: 'Evenly illuminated channel letters mounted on a light facade',
    },
    {
      type: 'textSection',
      key: 'galleryIntroBlock',
      enabled: true,
      pretitle: 'Selected work',
      sectionTitle: 'Work gallery',
      title: 'A compact viewer',
      description: 'Open every image in one viewer.',
    },
    {
      type: 'cardList',
      key: 'typeBandLinesBlock',
      enabled: true,
      items: [{ text: 'Repair' }, { text: 'Light' }, { text: 'Result' }],
    },
    {
      type: 'cta',
      key: 'finalCtaBlock',
      enabled: true,
      badge: 'Next step',
      title: 'Show us your sign.',
      description: 'A photo is enough for an initial assessment.',
      primaryLabel: 'Send photo',
    },
    {
      type: 'labels',
      key: 'labelsBlock',
      enabled: true,
      modalProblemLabel: 'Initial state',
      modalWorkLabel: 'Work done',
      modalResultLabel: 'Result',
      modalBeforeLabel: 'View before',
      modalCta: 'Start similar case',
      viewerAllLabel: 'All',
      viewerCloseLabel: 'Close',
    },
  ];
}

test('page filter selects only Referenzen and suppresses unrelated article audit', () => {
  const options = parseArgs([
    '--page=Referenzen',
    '--base-url=http://127.0.0.1:3000',
    '--skip-crawl',
  ]);

  assert.equal(options.pageKey, 'referenzen');
  assert.equal(options.baseUrl, 'http://127.0.0.1:3000');
  assert.equal(options.skipCrawl, true);
  assert.deepEqual(selectPageDefinitions(options.pageKey).map(([pageKey]) => pageKey), [
    'referenzen',
  ]);
  assert.equal(shouldAuditProblemArticles(options.pageKey), false);
  assert.equal(shouldAuditProblemArticles(null), true);
});

test('page filter rejects unknown CMS page keys before database access', () => {
  assert.throws(
    () => selectPageDefinitions('not-a-page'),
    /Unknown CMS page filter \(not-a-page\)/
  );
});

test('Referenzen nested contract accepts valid content for all six MVP locales', () => {
  assert.deepEqual(LOCALES, ['de', 'en', 'ru', 'tr', 'pl', 'ar']);

  for (const locale of LOCALES) {
    assert.deepEqual(
      collectReferenzenAuditIssues(buildValidBlocks(), locale),
      [],
      `Expected valid Referenzen fixture for ${locale}`
    );
  }
});

test('filtered page audit returns exactly six Referenzen rows with invalidItems output', async () => {
  let query = null;
  const prisma = {
    cmsPage: {
      findMany: async (args) => {
        query = args;
        return LOCALES.map((locale) => ({
          pageKey: 'referenzen',
          locale,
          status: 'PUBLISHED',
          title: `References ${locale}`,
          seoTitle: `References ${locale}`,
          seoDescription: `References description ${locale}`,
          blocks: buildValidBlocks(),
        }));
      },
    },
  };
  const findings = [];
  const mediaRefs = [];

  const pages = await auditPages(
    prisma,
    findings,
    mediaRefs,
    'referenzen'
  );

  assert.equal(query.where.pageKey, 'referenzen');
  assert.equal(pages.length, 6);
  assert.deepEqual(pages.map((page) => page.locale), LOCALES);
  assert.ok(pages.every((page) => Array.isArray(page.invalidItems)));
  assert.ok(pages.every((page) => page.invalidItems.length === 0));
  assert.equal(findings.some((finding) => finding.severity === 'ERROR'), false);
});

test('Referenzen nested audit reports fields, alts, duplicate IDs, and item count', () => {
  const blocks = buildValidBlocks();
  const casesBlock = blocks.find((block) => block.key === 'casesBlock');
  const galleryBlock = blocks.find((block) => block.key === 'galleryItemsBlock');
  const reportBlock = blocks.find((block) => block.key === 'reportIntroBlock');
  const typeBandBlock = blocks.find((block) => block.key === 'typeBandLinesBlock');

  casesBlock.items = [
    buildCase({ galleryAlt1: '' }),
    buildCase({ title: 'Second case', galleryImage1: '', galleryAlt1: '' }),
  ];
  galleryBlock.items[0].title = '';
  galleryBlock.items[0].imageAlt = '';
  reportBlock.imageAlt = '';
  typeBandBlock.items = [{ text: 'Repair' }, { text: 'Result' }];

  const issues = collectReferenzenAuditIssues(blocks, 'en', 'PUBLISHED');
  const issuePaths = new Set(issues.map((issue) => issue.fieldPath));

  assert.ok(issuePaths.has('casesBlock.items[0].galleryAlt1'));
  assert.ok(issuePaths.has('casesBlock.items[1].id'));
  assert.ok(issuePaths.has('galleryItemsBlock.items[0].title'));
  assert.ok(issuePaths.has('galleryItemsBlock.items[0].imageAlt'));
  assert.ok(issuePaths.has('reportIntroBlock.imageAlt'));
  assert.ok(issuePaths.has('typeBandLinesBlock.items'));
  assert.ok(issues.every((issue) => issue.severity === 'ERROR'));

  const duplicate = issues.find(
    (issue) => issue.code === 'BLOCK_ITEM_ID_DUPLICATE'
  );
  assert.equal(duplicate?.itemIndex, 1);
  assert.equal(duplicate?.itemId, 'case-lightbox');
});

test('disabled Referenzen blocks are not validated and draft issues stay non-blocking', () => {
  const disabledIssues = collectReferenzenAuditIssues(
    [
      {
        type: 'cardList',
        key: 'galleryItemsBlock',
        enabled: false,
        items: [{ id: '', title: '', image: '' }],
      },
      buildValidBlocks().find((block) => block.key === 'labelsBlock'),
    ],
    'de',
    'PUBLISHED'
  );
  assert.deepEqual(disabledIssues, []);

  const blocks = buildValidBlocks();
  blocks.find((block) => block.key === 'galleryItemsBlock').items[0].title = '';
  const draftIssues = collectReferenzenAuditIssues(blocks, 'de', 'DRAFT');
  assert.ok(draftIssues.length > 0);
  assert.ok(draftIssues.every((issue) => issue.severity === 'WARN'));
});

test('runtime locale markup accepts LTR for five locales and RTL for Arabic', () => {
  for (const locale of LOCALES) {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const result = inspectLocalizedRouteMarkup(
      `/${locale}/referenzen`,
      `<!doctype html><html class="site" dir="${dir}" lang="${locale}"><body></body></html>`
    );

    assert.equal(result.locale, locale);
    assert.equal(result.lang, locale);
    assert.equal(result.dir, dir);
    assert.deepEqual(result.issues, []);
  }
});

test('runtime locale markup reports missing Arabic language and RTL direction', () => {
  const result = inspectLocalizedRouteMarkup(
    '/ar/referenzen',
    '<!doctype html><html lang="de" dir="ltr"><body></body></html>'
  );

  assert.deepEqual(
    result.issues.map((issue) => issue.code),
    ['CRAWL_LOCALE_LANG_INVALID', 'CRAWL_LOCALE_DIR_INVALID']
  );
});
