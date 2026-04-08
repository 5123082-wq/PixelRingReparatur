# 01 CMS Site Management

## Goal

`/ring-master-config` must become the complete control panel for public website content, SEO/GEO, media, and AI knowledge.

It should not expose free-form HTML editing. The CMS should manage structured content that the frontend renders through safe, tested components.

## CMS Areas

### Dashboard

The CMS dashboard should show:

- published and draft content counts;
- missing SEO fields;
- stale content needing review;
- media warnings;
- AI configuration status;
- recent CMS changes;
- quick links to Articles, Pages, Media, SEO, and AI Knowledge.

### Articles And Knowledge Base

This area manages long-form content:

- symptom articles;
- FAQ entries;
- troubleshooting pages;
- service knowledge;
- content that can also be injected into AI prompt context.

Required article fields:

- `locale`;
- `type`: `SYMPTOM`, `FAQ`, `PAGE`, later `SERVICE`, `CASE`;
- `status`: `DRAFT`, `IN_REVIEW`, `PUBLISHED`, later `SCHEDULED`, `ARCHIVED`;
- `slug`;
- `title`;
- `symptomLabel`;
- `shortAnswer`;
- `content` as Markdown or restricted rich text;
- `seoTitle`;
- `seoDescription`;
- `canonicalUrl`;
- `relatedSlugs`;
- `causes`;
- `safeChecks`;
- `urgentWarnings`;
- `serviceProcess`;
- `workScopeFactors`;
- `ctaLabel`;
- `ctaHref`;
- `sortOrder`;
- `publishedAt`;
- `lastReviewedAt`.

First implementation target:

- make the current `/de/support` symptom cards come from CMS;
- add `/de/support/[slug]` detail pages;
- keep static i18n fallback if CMS is empty.

### Page Content

This area manages editable content on fixed website pages.

Required page content model:

- `pageKey`: for example `home`, `support`, `status`, `footer`;
- `locale`;
- `status`;
- structured `blocks`;
- SEO metadata;
- publish metadata.

Block examples:

- hero title;
- hero subtitle;
- CTA label and URL;
- section title;
- section description;
- service cards;
- trust proof cards;
- FAQ items;
- review items;
- footer CTA;
- navigation labels;
- global contact text.

Do not store JSX or arbitrary HTML in CMS. Store safe data for existing frontend components.

### Media Library

The CMS needs a public media library separate from private customer attachments.

Required media fields:

- file URL or storage key;
- original filename;
- MIME type;
- byte size;
- width and height for images;
- alt text;
- title;
- usage type: `HERO`, `ARTICLE`, `SERVICE`, `CASE`, `GENERAL`;
- locale if the asset contains language-specific text;
- created and updated metadata.

Required media behavior:

- upload validation by extension, MIME type, and file signature;
- size limits;
- image optimization or derived responsive sizes;
- "where used" check before deletion;
- no mixing public CMS assets with private request attachments.

### SEO And GEO

SEO/GEO controls should include:

- per-page meta title and description;
- canonical URL;
- robots settings;
- Open Graph fields;
- JSON-LD generation for `Article`, `BreadcrumbList`, `Organization`, and `LocalBusiness`;
- internal link audit;
- missing metadata audit;
- duplicate slug audit;
- stale content audit;
- sitemap readiness checks.

For multilingual content:

- German is canonical-first.
- Other locales should have independent publish status.
- Use locale-aware slugs and later `hreflang` mapping.

### AI Knowledge

AI Knowledge should show:

- active system prompt;
- model and temperature;
- markdown knowledge base preview;
- published CMS articles included in prompt context;
- warnings when AI key or provider config is missing;
- a test prompt/debug panel later.

First implementation target:

- keep `knowledge_base/*.md` as baseline;
- append published CMS articles by locale into system prompt context;
- cap context size to avoid token budget issues.

## Workflow

Minimum workflow:

- Draft;
- Publish;
- Unpublish;
- Delete with confirmation.

Target workflow:

- Draft;
- In Review;
- Approved;
- Scheduled;
- Published;
- Archived.

Production-grade CMS should also support:

- version history;
- diff;
- restore;
- preview mode with signed token;
- scheduled publishing;
- content dependency checks before publishing.

## First CMS Milestone

The first useful milestone is not a full page builder.

It is:

- articles CRUD;
- support page backed by CMS;
- detail article pages;
- SEO V1 audit;
- AI context from published CMS articles;
- basic public media model documented for the next phase.

