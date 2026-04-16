import fs from 'node:fs';
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
  throw new Error(
    'Missing POSTGRES_PRISMA_URL, DATABASE_URL, DIRECT_URL, or POSTGRES_URL_NON_POOLING for CMS page baseline seed.'
  );
}

const SUPPORTED_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
const GLOBAL_FOOTER_COMPANY_LINES = [
  'PixelRing Technical Atelier',
  'Berlin, Deutschland',
];
const GLOBAL_FOOTER_HOURS = 'Mo - Fr: 09:00 - 18:00';
const GLOBAL_FOOTER_EMAIL = 'service@pixelring.de';
const GLOBAL_SOCIAL_LINKS = [
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'Telegram', href: 'https://t.me' },
  { label: 'WhatsApp', href: 'https://wa.me' },
];
const SUPPORT_TECHNICIAN_PHONE = 'tel:+491234567890';
const REVISION_REASON = 'Baseline page backfill from existing public content';

function deepClone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function canonicalizeJson(value) {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeJson(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, canonicalizeJson(item)])
    );
  }

  return value;
}

function compactObject(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => compactObject(item))
      .filter((item) => item !== undefined);
  }

  if (!value || typeof value !== 'object') {
    return value === undefined ? undefined : value;
  }

  const entries = Object.entries(value)
    .map(([key, item]) => [key, compactObject(item)])
    .filter(([, item]) => item !== undefined);

  return Object.fromEntries(entries);
}

function createBlock(type, key, sortOrder, payload) {
  return compactObject({
    type,
    key,
    enabled: true,
    sortOrder,
    ...payload,
  });
}

function namespaceBlock(type, key, sortOrder, namespace, sourceNamespace) {
  if (!namespace || typeof namespace !== 'object' || Array.isArray(namespace)) {
    return null;
  }

  return createBlock(type, key, sortOrder, {
    sourceNamespace,
    ...deepClone(namespace),
  });
}

function joinTitleParts(parts) {
  return parts
    .filter((part) => typeof part === 'string' && part.trim())
    .map((part) => part.trim())
    .join(' ')
    .trim();
}

function createCanonicalUrl(locale, pageKey) {
  if (pageKey === 'home') {
    return `/${locale}`;
  }

  if (pageKey === 'global') {
    return null;
  }

  return `/${locale}/${pageKey}`;
}

function statusItemsFromMessages(statusValues) {
  if (!statusValues || typeof statusValues !== 'object' || Array.isArray(statusValues)) {
    return [];
  }

  return Object.entries(statusValues).map(([status, details]) => ({
    id: status,
    status,
    label:
      details && typeof details === 'object' && !Array.isArray(details)
        ? details.label ?? status
        : status,
    description:
      details && typeof details === 'object' && !Array.isArray(details)
        ? details.description ?? ''
        : '',
  }));
}

function supportCategoryItems(categories) {
  if (!categories || typeof categories !== 'object' || Array.isArray(categories)) {
    return [];
  }

  return Object.entries(categories).map(([id, details]) => ({
    id,
    title:
      details && typeof details === 'object' && !Array.isArray(details)
        ? details.title ?? id
        : id,
    description:
      details && typeof details === 'object' && !Array.isArray(details)
        ? details.description ?? ''
        : '',
  }));
}

function localizedFooterLinks(locale, footer) {
  return {
    serviceLinks: [
      { label: footer?.services_sign_repair ?? 'Sign repair', href: '/services/sign-repair' },
      { label: footer?.services_installation ?? 'Installation', href: '/services/installation' },
      { label: footer?.services_lighting ?? 'Lighting', href: '/services/light-advertising' },
      { label: footer?.services_branding ?? 'Branding', href: '/services/branding' },
      { label: footer?.services_maintenance ?? 'Maintenance', href: '/services/maintenance' },
    ],
    supportLinks: [
      { label: footer?.how_it_works ?? 'How it works', href: '/#how-it-works' },
      { label: footer?.status_check ?? 'Status', href: '/status' },
      { label: footer?.help_center ?? 'Support', href: '/support' },
      { label: footer?.contact ?? 'Contact', href: '/contact' },
    ],
    legalLinks: [
      { label: footer?.impressum ?? 'Impressum', href: '/impressum' },
      { label: footer?.privacy ?? 'Privacy', href: '/privacy' },
      { label: footer?.terms ?? 'Terms', href: '/terms' },
      { label: footer?.cancellation ?? 'Cancellation', href: '/cancellation' },
      { label: footer?.cookies ?? 'Cookies', href: '/cookies' },
    ],
    socialLinks: GLOBAL_SOCIAL_LINKS.map((item) => ({
      ...item,
      href: item.href,
    })),
    locale,
  };
}

function buildHomePageSeed(locale, messages) {
  const home = messages.HomePage ?? {};
  const blocks = [
    createBlock('hero', 'hero', 0, {
      sourceNamespace: 'HomePage',
      pretitle: messages.Nav?.service_pill ?? null,
      title: joinTitleParts([
        home.hero_title_prefix,
        home.hero_title_accent,
        home.hero_title_suffix,
      ]),
      titlePrefix: home.hero_title_prefix ?? null,
      titleAccent: home.hero_title_accent ?? null,
      titleSuffix: home.hero_title_suffix ?? null,
      intro: home.description ?? null,
      ctaPrimary: home.cta_primary ?? null,
      ctaSecondary: home.cta_secondary ?? null,
      trustBadge: home.trust_badge ?? null,
      responseBadge: home.badge_label ?? null,
      assetUrl: '/images/hero-neon.jpg',
    }),
    namespaceBlock('textSection', 'intakeSection', 10, messages.Intake, 'Intake'),
    namespaceBlock('cardList', 'bentoSection', 20, messages.Bento, 'Bento'),
    namespaceBlock('cardList', 'trustSection', 30, messages.Trust, 'Trust'),
    createBlock('cardList', 'coverageSection', 40, {
      sourceNamespace: 'Coverage',
      title: messages.Coverage?.title ?? null,
      description: messages.Coverage?.description ?? null,
      hqLabel: messages.Coverage?.hq ?? null,
      serviceCityLabel: messages.Coverage?.serviceCity ?? null,
      cities: messages.Coverage?.cities
        ? Object.entries(messages.Coverage.cities).map(([id, label]) => ({ id, label }))
        : [],
      features: messages.Coverage?.features
        ? Object.entries(messages.Coverage.features).map(([id, label]) => ({ id, label }))
        : [],
    }),
    namespaceBlock('cardList', 'excellenceSection', 50, messages.Excellence, 'Excellence'),
    namespaceBlock('reviewList', 'reviewsSection', 60, messages.Reviews, 'Reviews'),
    namespaceBlock('cardList', 'roadmapSection', 70, messages.Roadmap, 'Roadmap'),
    namespaceBlock('faqList', 'faqSection', 80, messages.FAQ, 'FAQ'),
  ].filter(Boolean);

  return {
    pageKey: 'home',
    locale,
    status: 'PUBLISHED',
    title: home.title ?? joinTitleParts([home.hero_title_accent, home.hero_title_suffix]) ?? 'Home',
    blocks,
    seoTitle: home.title ?? null,
    seoDescription: home.description ?? null,
    canonicalUrl: createCanonicalUrl(locale, 'home'),
  };
}

function buildSupportPageSeed(locale, messages) {
  const support = messages.Support ?? {};

  const blocks = [
    createBlock('hero', 'hero', 0, {
      sourceNamespace: 'Support',
      title: support.hero_title ?? null,
      intro: support.hero_description ?? null,
      categoriesTitle: support.categories_title ?? null,
      symptomsTitle: support.symptoms_title ?? null,
      symptomsDescription: support.symptoms_desc ?? null,
      internalLinksTitle: support.internal_links_title ?? null,
    }),
    createBlock('cardList', 'problemCategories', 10, {
      sourceNamespace: 'Support.categories',
      title: support.categories_title ?? null,
      items: supportCategoryItems(support.categories),
    }),
    createBlock('cta', 'urgentCases', 20, {
      sourceNamespace: 'Support.urgent',
      badge: support.urgent_badge ?? null,
      title: support.urgent_cases_title ?? null,
      intro: support.urgent_cases_desc ?? null,
      primaryLabel: support.call_technician ?? null,
      primaryHref: SUPPORT_TECHNICIAN_PHONE,
      secondaryLabel: support.send_request ?? null,
      secondaryAction: 'openContactModal',
    }),
    createBlock('cardList', 'symptomHighlights', 30, {
      sourceNamespace: 'Support.symptoms',
      title: support.symptoms_title ?? null,
      description: support.symptoms_desc ?? null,
      items: Array.isArray(support.symptoms)
        ? support.symptoms.map((item) => ({
            id: item.id ?? item.title ?? '',
            title: item.title ?? '',
          }))
        : [],
      allArticlesLabel: support.all_articles ?? null,
    }),
  ];

  return {
    pageKey: 'support',
    locale,
    status: 'PUBLISHED',
    title: support.hero_title ?? 'Support',
    blocks,
    seoTitle: support.hero_title ?? null,
    seoDescription: support.hero_description ?? null,
    canonicalUrl: createCanonicalUrl(locale, 'support'),
  };
}

function buildStatusPageSeed(locale, messages) {
  const status = messages.StatusPage ?? {};

  const blocks = [
    createBlock('hero', 'statusHero', 0, {
      sourceNamespace: 'StatusPage',
      badge: status.badge ?? null,
      title: status.title ?? null,
      intro: status.intro ?? null,
      safeHints: [
        status.safe_hint_1,
        status.safe_hint_2,
        status.safe_hint_3,
      ].filter(Boolean),
      restoreHint: status.restore_hint ?? null,
    }),
    createBlock('textSection', 'statusLookupForm', 10, {
      sourceNamespace: 'StatusPage.form',
      title: status.form_title ?? null,
      description: status.form_description ?? null,
      requestNumberLabel: status.request_number_field ?? null,
      requestNumberPlaceholder: status.request_placeholder ?? null,
      contactLabel: status.contact_field ?? null,
      contactPlaceholder: status.contact_placeholder ?? null,
      cookieRestoreHint: status.cookie_restore_hint ?? null,
      submitLabel: status.submit ?? null,
      submitLoadingLabel: status.submit_loading ?? null,
      useRequestNumberLabel: status.use_request_number ?? null,
      privacyNotice: status.privacy_notice ?? null,
      lookupError: status.lookup_error ?? null,
      lookupAnother: status.lookup_another ?? null,
      verifiedViaLabel: status.verified_via ?? null,
      verifiedViaSession: status.verified_via_session ?? null,
      verifiedViaContact: status.verified_via_contact ?? null,
      accessRestored: status.access_restored ?? null,
      contactVerified: status.contact_verified ?? null,
    }),
    createBlock('cardList', 'publicStatusValues', 20, {
      sourceNamespace: 'StatusPage.status_values',
      title: status.current_stage_label ?? null,
      items: statusItemsFromMessages(status.status_values),
    }),
  ];

  return {
    pageKey: 'status',
    locale,
    status: 'PUBLISHED',
    title: status.title ?? 'Status',
    blocks,
    seoTitle: status.title ?? null,
    seoDescription: status.intro ?? null,
    canonicalUrl: createCanonicalUrl(locale, 'status'),
  };
}

function buildGlobalPageSeed(locale, messages) {
  const footer = messages.Footer ?? {};
  const nav = messages.Nav ?? {};

  const footerLinks = localizedFooterLinks(locale, footer);

  const blocks = [
    createBlock('cta', 'globalNavigation', 0, {
      sourceNamespace: 'Nav',
      servicePill: nav.service_pill ?? null,
      bookLabel: nav.book ?? null,
      links: [
        { label: nav.services ?? 'Services', href: '#services' },
        { label: nav.support ?? 'Support', href: '/support' },
        { label: nav.warranty ?? 'Warranty', href: '#warranty' },
        { label: nav.status ?? 'Status', href: '/status' },
      ],
    }),
    createBlock('footerCta', 'globalFooterCta', 10, {
      sourceNamespace: 'FooterCTA',
      ...deepClone(messages.FooterCTA ?? {}),
    }),
    createBlock('textSection', 'contactModal', 20, {
      sourceNamespace: 'ContactModal',
      ...deepClone(messages.ContactModal ?? {}),
    }),
    createBlock('cardList', 'footerServices', 30, {
      sourceNamespace: 'Footer',
      title: footer.services ?? null,
      items: footerLinks.serviceLinks,
    }),
    createBlock('cardList', 'footerSupport', 40, {
      sourceNamespace: 'Footer',
      title: footer.support_title ?? null,
      items: footerLinks.supportLinks,
    }),
    createBlock('cardList', 'footerSocial', 50, {
      sourceNamespace: 'Footer',
      title: footer.social ?? null,
      items: footerLinks.socialLinks,
    }),
    createBlock('textSection', 'footerCompany', 60, {
      sourceNamespace: 'Footer',
      title: footer.company ?? null,
      lines: GLOBAL_FOOTER_COMPANY_LINES,
      hours: GLOBAL_FOOTER_HOURS,
      email: GLOBAL_FOOTER_EMAIL,
    }),
    createBlock('cardList', 'footerLegal', 70, {
      sourceNamespace: 'Footer',
      title: footer.copyright ?? null,
      items: footerLinks.legalLinks,
      copyright: footer.copyright ?? null,
    }),
  ];

  return {
    pageKey: 'global',
    locale,
    status: 'PUBLISHED',
    title: footer.company ?? 'Global site copy',
    blocks,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
  };
}

function loadLocaleMessages(locale) {
  const filePath = path.join(rootDir, 'messages', `${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildPageSeeds(locale) {
  const messages = loadLocaleMessages(locale);

  return [
    buildHomePageSeed(locale, messages),
    buildSupportPageSeed(locale, messages),
    buildStatusPageSeed(locale, messages),
    buildGlobalPageSeed(locale, messages),
    buildLegalPageSeed(locale, 'impressum'),
    buildLegalPageSeed(locale, 'privacy'),
  ];
}

function buildLegalPageSeed(locale, pageKey) {
  const isImpressum = pageKey === 'impressum';
  
  const title = isImpressum ? 'Impressum' : 'Datenschutzerklärung';
  
  const description = isImpressum 
    ? `PixelRing Technical Atelier\nInhaber: [Name des Inhabers]\nMusterstraße 123\n12345 Berlin\nDeutschland\n\nKontakt:\nTelefon: +49 (0) 123 456789\nE-Mail: service@pixelring.de\n\nUmsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:\nDE123456789\n\nPlattform der EU-Kommission zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr\nWir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.`
    : `1. Datenschutz auf einen Blick\nDer Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.\n\n2. Datenerfassung auf unserer Website\nDie Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Die Kontaktdaten können Sie dem Impressum dieser Website entnehmen.\n\n3. SSL- bzw. TLS-Verschlüsselung\nDiese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung.\n\n4. Ihre Rechte\nSie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen.`;

  const blocks = [
    createBlock('textSection', 'mainContent', 0, {
      title,
      description,
    }),
  ];

  return {
    pageKey,
    locale,
    // Set to PUBLISHED for 'de', otherwise DRAFT
    status: locale === 'de' ? 'PUBLISHED' : 'DRAFT',
    title,
    blocks,
    seoTitle: title,
    seoDescription: null,
    canonicalUrl: createCanonicalUrl(locale, pageKey),
  };
}

function normalizeTimestamp(value) {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function buildPageRevisionSnapshot(row) {
  return {
    pageKey: row.pageKey,
    locale: row.locale,
    status: row.status,
    title: row.title,
    blocks: row.blocks,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    canonicalUrl: row.canonicalUrl,
    publishedAt: normalizeTimestamp(row.publishedAt),
    lastReviewedAt: normalizeTimestamp(row.lastReviewedAt),
  };
}

function sameJson(left, right) {
  return (
    JSON.stringify(canonicalizeJson(left ?? null)) ===
    JSON.stringify(canonicalizeJson(right ?? null))
  );
}

async function fetchExistingPage(client, pageKey, locale) {
  const result = await client.query(
    `
      select
        id,
        "pageKey" as "pageKey",
        locale,
        status,
        title,
        blocks,
        "seoTitle" as "seoTitle",
        "seoDescription" as "seoDescription",
        "canonicalUrl" as "canonicalUrl",
        "publishedAt" as "publishedAt",
        "lastReviewedAt" as "lastReviewedAt",
        "deletedAt" as "deletedAt"
      from cms_pages
      where "pageKey" = $1 and locale = $2
      limit 1
    `,
    [pageKey, locale]
  );

  return result.rows[0] ?? null;
}

function pageNeedsUpdate(existing, desired) {
  return (
    existing.deletedAt !== null ||
    existing.status !== desired.status ||
    existing.title !== desired.title ||
    existing.seoTitle !== desired.seoTitle ||
    existing.seoDescription !== desired.seoDescription ||
    existing.canonicalUrl !== desired.canonicalUrl ||
    !sameJson(existing.blocks, desired.blocks)
  );
}

async function insertRevision(client, row, sourceAction) {
  await client.query(
    `
      insert into cms_page_revisions (
        id,
        "pageId",
        "sourceAction",
        reason,
        "actorAdminUserId",
        "actorSessionId",
        "actorRole",
        snapshot
      )
      values ($1, $2, $3, $4, null, null, null, $5::jsonb)
    `,
    [
      crypto.randomUUID(),
      row.id,
      sourceAction,
      REVISION_REASON,
      JSON.stringify(buildPageRevisionSnapshot(row)),
    ]
  );
}

async function upsertBaselinePage(client, page) {
  const existing = await fetchExistingPage(client, page.pageKey, page.locale);

  if (!existing) {
    const created = await client.query(
      `
        insert into cms_pages (
          id,
          "pageKey",
          locale,
          status,
          title,
          blocks,
          "seoTitle",
          "seoDescription",
          "canonicalUrl",
          "publishedAt",
          "lastReviewedAt",
          "deletedAt",
          "createdAt",
          "updatedAt"
        )
        values (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6::jsonb,
          $7,
          $8,
          $9,
          now(),
          now(),
          null,
          now(),
          now()
        )
        returning
          id,
          "pageKey" as "pageKey",
          locale,
          status,
          title,
          blocks,
          "seoTitle" as "seoTitle",
          "seoDescription" as "seoDescription",
          "canonicalUrl" as "canonicalUrl",
          "publishedAt" as "publishedAt",
          "lastReviewedAt" as "lastReviewedAt",
          "deletedAt" as "deletedAt"
      `,
      [
        crypto.randomUUID(),
        page.pageKey,
        page.locale,
        page.status,
        page.title,
        JSON.stringify(page.blocks),
        page.seoTitle,
        page.seoDescription,
        page.canonicalUrl,
      ]
    );

    const row = created.rows[0];
    await insertRevision(client, row, 'CREATE');
    return { action: 'created', row };
  }

  if (!pageNeedsUpdate(existing, page)) {
    return { action: 'skipped', row: existing };
  }

  const updated = await client.query(
    `
      update cms_pages
      set
        status = $3,
        title = $4,
        blocks = $5::jsonb,
        "seoTitle" = $6,
        "seoDescription" = $7,
        "canonicalUrl" = $8,
        "publishedAt" = coalesce("publishedAt", now()),
        "lastReviewedAt" = now(),
        "deletedAt" = null,
        "updatedAt" = now()
      where "pageKey" = $1 and locale = $2
      returning
        id,
        "pageKey" as "pageKey",
        locale,
        status,
        title,
        blocks,
        "seoTitle" as "seoTitle",
        "seoDescription" as "seoDescription",
        "canonicalUrl" as "canonicalUrl",
        "publishedAt" as "publishedAt",
        "lastReviewedAt" as "lastReviewedAt",
        "deletedAt" as "deletedAt"
    `,
    [
      page.pageKey,
      page.locale,
      page.status,
      page.title,
      JSON.stringify(page.blocks),
      page.seoTitle,
      page.seoDescription,
      page.canonicalUrl,
    ]
  );

  const row = updated.rows[0];
  await insertRevision(client, row, 'UPDATE');

  return {
    action: existing.deletedAt !== null ? 'restored' : 'updated',
    row,
  };
}

async function main() {
  const client = new Client({ connectionString });
  const counters = {
    created: 0,
    updated: 0,
    restored: 0,
    skipped: 0,
  };

  await client.connect();

  try {
    await client.query('begin');

    for (const locale of SUPPORTED_LOCALES) {
      const pages = buildPageSeeds(locale);

      for (const page of pages) {
        const result = await upsertBaselinePage(client, page);
        counters[result.action] += 1;
        console.log(
          `[cms-pages] ${result.action.toUpperCase()} ${page.pageKey}/${page.locale}`
        );
      }
    }

    await client.query('commit');

    console.log(
      JSON.stringify(
        {
          success: true,
          pagesProcessed: SUPPORTED_LOCALES.length * 6,
          ...counters,
        },
        null,
        2
      )
    );
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    await client.end();
  }
}

await main();
