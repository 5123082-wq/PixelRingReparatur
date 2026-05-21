# Service Page Hidden CMS Implementation Plan

Status: approved implementation plan, not yet implemented  
Date: 2026-05-21  
Owner intent: add the new `Service` page to the site and Page CMS, but keep it hidden from ordinary public visitors until explicitly released.

## Purpose

This document is the handoff plan for implementing a new hidden `Service` / `Standort-Abo` landing page in the Next.js application.

The page must be:

- built from the approved visual/content prototype;
- editable through the existing Page CMS;
- visible to the project owner/admin for review and editing;
- hidden from normal public users until a later release decision;
- excluded from public navigation, sitemap, and indexing while hidden.

Approved prototype source:

- `DesignPrototip/pixelring-service-page-site-style.html`

Related existing concept/prototype sources:

- `DesignPrototip/pixelring-standort-abo.html`
- `DesignPrototip/pixelring-homepage-abo-cta.html`
- `docs/01_strategy/standort_abo_product_concept.md`
- `docs/02_public_website/page_plan_leistungen.md`

## Product Boundary

The page is about PixelRing service packages, recurring Standort-Abo work, audit, maintenance, report, and service coordination.

Keep the tariff content from the approved prototype:

- `PixelRing Check`
- `PixelRing Care`
- `PixelRing Network`
- calculator option `PixelRing Protect`
- example prices `ab 79€ / Standort / Monat`, `ab 199€ / Standort / Monat`, and `Custom / Netzwerk`

Do not remove pricing/tariff blocks just because the product is still being validated. Instead, keep the page hidden and keep copy safely framed as an internal draft/preview until release.

Public claim guardrails:

- Do not sell this as unlimited repair.
- Do not imply a guaranteed SLA unless separately approved.
- Do not imply a full customer portal, invoices, warranty module, or structured photo-report platform exists unless verified in code.
- Do not present PixelRing as a marketplace, contractor directory, listing platform, or “find a master” product.
- Preserve one accountable service company and one entry point for service requests.

## Current Code Reality

Application root:

- `signage-service/`

Relevant files already inspected:

- `signage-service/src/lib/cms/pages.ts`
- `signage-service/src/app/api/cms/pages/route.ts`
- `signage-service/src/app/api/cms/pages/[id]/route.ts`
- `signage-service/src/app/[locale]/ring-master-config/dashboard/pages/page.tsx`
- `signage-service/src/app/[locale]/layout.tsx`
- `signage-service/src/app/sitemap.ts`
- `signage-service/src/app/robots.ts`
- `signage-service/src/lib/seo.ts`
- `signage-service/prisma/schema.prisma`

Existing CMS facts:

- `CmsPage` already exists.
- `CmsPage.status` uses `CmsArticleStatus`.
- Page CMS helper allowlist currently supports keys like `home`, `status`, `global`, `leistungen`, `business`, `probleme-loesungen`, `about`, and `referenzen`.
- Public page helpers currently read only `status: 'PUBLISHED'` via `getPublishedCmsPage(...)`.
- Page CMS UI supports `DRAFT` and `PUBLISHED`.
- Page CMS API already has session auth, CSRF on mutations, permission checks, audit logging, revisions, soft delete, and UUID route-param guards.
- Page CMS editor already has unified multi-locale editing and can add `hero`, `cardList`, `faqList`, `reviewList`, `textSection`, `cta`, and `footerCta` blocks.
- `PUBLIC_SITEMAP_PATHS` does not include `/service`.

Important implication:

Do not add a new Prisma model or a new CMS status for this first slice. The safest implementation is to keep the new page as a `DRAFT` `CmsPage` and add a protected preview path that can read draft content only for authenticated CMS owner/admin sessions.

## Target Behavior

Hidden mode, default:

- `/de/service` returns `404` to ordinary visitors.
- `/de/service?cmsPreview=1` returns the page only when a valid CMS owner/admin session is present.
- The page has `noindex, nofollow` metadata in preview/hidden mode.
- The page is not linked from public header/footer.
- The page is not included in sitemap.
- Page CMS shows `Service` as an editable page key.
- Owner can save the page as `DRAFT` and preview it.

Future public mode, separate release decision:

- An environment flag enables public route access.
- Public route reads only `PUBLISHED` service CMS content.
- Sitemap/navigation can be updated only after owner approval.
- SEO metadata can switch to indexable only after publication is approved.

Recommended environment flag:

```env
SERVICE_PAGE_PUBLIC_ENABLED=false
```

Optional but useful second flag:

```env
SERVICE_PAGE_CMS_PREVIEW_ENABLED=true
```

If only one flag is used, make preview available whenever a valid CMS owner/admin session exists and public flag is false.

## Route Plan

Add route:

- `signage-service/src/app/[locale]/service/page.tsx`

Recommended access logic:

1. Read `params.locale`.
2. Read `searchParams.cmsPreview`.
3. Read `CMS_SESSION_COOKIE_NAME` from `cookies()`.
4. Verify session with the existing admin auth helper.
5. If `SERVICE_PAGE_PUBLIC_ENABLED !== 'true'`:
   - require `cmsPreview=1`;
   - require valid CMS owner/admin session;
   - otherwise `notFound()`.
6. If preview is allowed:
   - load draft-capable CMS content for `service`.
7. If public mode is enabled:
   - load only published CMS content.
8. If content is missing or invalid:
   - for preview, show a clear internal empty-state page or `notFound()` with a CMS hint;
   - for public mode, `notFound()`.

Recommended session requirement for this first slice:

- require `OWNER`, matching `ring-master-config/dashboard` layout behavior.

If the agent wants to use permissions instead of role checks, require at least `CMS_PAGE_READ`. Do not create broader public access.

## CMS Page Key Changes

Update `signage-service/src/lib/cms/pages.ts`:

- add `service` to `CMS_PAGE_KEYS`;
- add typed content types for the Service page;
- add a draft-capable loader;
- add a public loader if public mode later needs it.

Update `signage-service/src/app/[locale]/ring-master-config/dashboard/pages/page.tsx`:

- add `service` to `CmsPageKey` union;
- add `service` to `PAGE_KEYS`;
- add label:
  - default: `Service`
  - ru: `Сервис`
- optionally add a page-specific preset button for Service blocks.

Do not add `service` to public header nav in this slice.

## CMS Content Contract

Use existing block types where possible. Avoid introducing a generic HTML block and do not store arbitrary HTML.

Recommended block structure:

```json
[
  {
    "type": "hero",
    "key": "serviceHero",
    "title": "Ihre sichtbare Marke. Immer im Check.",
    "description": "Regelmäßiger Audit, Wartung und Kontrolle Ihrer Werbeanlagen...",
    "ctaPrimary": "Abo-Pakete ansehen",
    "ctaSecondary": "Abo grob kalkulieren",
    "image": "/uploads/cms-media/...",
    "imageAlt": "..."
  },
  {
    "type": "cardList",
    "key": "serviceMetrics",
    "items": [
      { "value": "01", "label": "Asset-Register für alle Standorte" },
      { "value": "24h", "label": "Priorisierung kritischer Fälle" },
      { "value": "1x", "label": "Zentraler Ansprechpartner" }
    ]
  },
  {
    "type": "cardList",
    "key": "problemCards",
    "title": "Viele Standorte. Viele sichtbare Risiken. Keine zentrale Kontrolle.",
    "items": []
  },
  {
    "type": "textSection",
    "key": "serviceModel",
    "title": "Audit, Wartung und sichtbare Markenpflege als monatlicher Service.",
    "description": "..."
  },
  {
    "type": "cardList",
    "key": "packages",
    "title": "Drei Abo-Stufen. Von Kontrolle bis Full-Service-Betreuung.",
    "items": []
  },
  {
    "type": "cardList",
    "key": "process",
    "title": "So wird aus Einzelreparaturen ein planbarer Serviceprozess.",
    "items": []
  },
  {
    "type": "cardList",
    "key": "calculator",
    "title": "Grobe Monatskalkulation",
    "items": []
  },
  {
    "type": "cardList",
    "key": "portalPreview",
    "title": "Kontrolle statt Bauchgefühl.",
    "items": []
  },
  {
    "type": "cardList",
    "key": "industries",
    "title": "Besonders sinnvoll für Unternehmen mit wiederkehrenden sichtbaren Flächen.",
    "items": []
  },
  {
    "type": "faqList",
    "key": "faq",
    "title": "Klare Grenzen. Klare Zuständigkeit.",
    "items": []
  },
  {
    "type": "cta",
    "key": "finalCta",
    "title": "30 Tage Standort-Transparenz für Ihre sichtbare Marke.",
    "description": "..."
  }
]
```

The typed adapter should normalize this into a stable shape such as:

```ts
type ServicePageCmsContent = {
  hero?: ServiceHeroContent;
  metrics?: ServiceMetric[];
  problems?: ServiceProblemCard[];
  model?: ServiceModelContent;
  packages?: ServicePackage[];
  process?: ServiceProcessStep[];
  calculator?: ServiceCalculatorContent;
  portalPreview?: ServicePortalPreviewContent;
  industries?: string[];
  faq?: ServiceFaqItem[];
  finalCta?: ServiceFinalCtaContent;
};
```

For package items, support at least:

```ts
type ServicePackage = {
  id?: string;
  title?: string;
  description?: string;
  price?: string;
  priceNote?: string;
  recommended?: boolean;
  badge?: string;
  items?: string[];
  cta?: string;
};
```

The initial DE seed should preserve the approved prototype content exactly enough that the rendered page matches the approved prototype rhythm.

## Seed Plan

Add an idempotent seed script:

- suggested path: `signage-service/scripts/seed-cms-service-page.ts`
- package script: `db:seed:cms-service`

Script behavior:

- create or update `CmsPage` for `pageKey = 'service'`, `locale = 'de'`;
- keep `status = 'DRAFT'`;
- keep `publishedAt = null`;
- create a revision snapshot;
- do not create public navigation links;
- do not publish automatically.

Optional locale strategy:

- First slice: DE only.
- Later: add EN/RU/TR/PL/AR drafts after owner approves the DE structure.

Do not seed non-DE placeholder content as published.

## Rendering Plan

Create component folder:

- `signage-service/src/components/service/`

Suggested files:

- `ServiceLandingPage.tsx`
- `ServiceCalculator.tsx` if the calculator needs client state
- `types.ts` if shared component types become large

Rendering constraints:

- Use the current PixelRing style, not the dark SaaS/neon prototype.
- Reuse site colors and rhythm from current pages:
  - light background `#F7F1E8`;
  - hero background `#EEF3FB`;
  - copper CTA `#B8643E`;
  - navy dark bands where useful `#0D1B2A`;
  - `max-w-7xl`, `px-6`, `py-20` / `py-24` rhythm.
- Use current `Header` and `Footer`.
- Do not use a landing-page marketing style disconnected from the existing site.
- Avoid card-in-card nesting.
- Keep tariffs visible and editable.
- Keep the “not a repair flat-rate” FAQ/boundary.

Client-side calculator:

- Use a small client component if needed.
- Initial state from CMS:
  - default locations: `8`;
  - default package: `PixelRing Care`;
  - package prices: `79`, `199`, `349`.
- The calculator is an orientation tool only, not a binding offer.

## Admin Preview Plan

Add an owner-only preview entry in Page CMS for `service`.

Minimum option:

- In the Page CMS editor, when selected page is `service`, show:
  - `Open hidden preview`
  - href: `/${activeLocale}/service?cmsPreview=1`
  - `target="_blank"`

Do not expose preview link outside CMS.

The route itself must still enforce the CMS session; the button is convenience only, not security.

## SEO And Public Exposure Plan

While hidden:

- Do not add `/service` to `PUBLIC_SITEMAP_PATHS`.
- Do not add `/service` to header fallback navigation.
- Do not seed CMS global navigation with `/service`.
- In route metadata, return `robots: { index: false, follow: false }`.
- Optionally add locale-specific disallow entries to `robots.ts`:
  - `/de/service`
  - `/en/service`
  - `/ru/service`
  - `/tr/service`
  - `/pl/service`
  - `/ar/service`

Public release later:

- Owner must explicitly approve publication.
- Only then consider:
  - publishing CMS rows;
  - adding sitemap path;
  - adding navigation;
  - changing metadata to indexable;
  - adding language alternates.

## Security Requirements

Required:

- Preview access must be server-side gated.
- Do not rely on client-side hiding.
- Do not log CMS session tokens.
- Do not expose draft blocks through public APIs.
- Do not create a public `/api/cms/pages?status=DRAFT` path.
- Keep CMS mutations on existing CSRF-protected Page CMS APIs.
- Keep admin route denial behavior consistent with current hidden endpoint strategy.

Recommended:

- Reuse `CMS_SESSION_COOKIE_NAME`.
- Reuse `requireAdminSession(...)` or permission helpers.
- Keep preview GET read-only.
- No new database migration unless absolutely required.

## Validation Plan

Run from `signage-service/`:

```bash
npm run build
npm run test:admin-security
npm run test:admin-auth
```

Use `npm run lint` if the current branch is not blocked by unrelated lint debt.

Manual/browser checks:

- `/de/service` without CMS session returns `404`.
- `/de/service?cmsPreview=1` without CMS session returns `404`.
- `/de/service?cmsPreview=1` with CMS owner session renders the draft page.
- Page CMS lists `Service`.
- Page CMS can save `service/de` as `DRAFT`.
- Edited tariff text/price appears in preview after save.
- `PixelRing Check`, `PixelRing Care`, `PixelRing Network`, and calculator `PixelRing Protect` remain present.
- Sitemap does not include `/service`.
- Header/footer public navigation does not include `/service`.
- Metadata for preview/hidden route is `noindex, nofollow`.
- Mobile layout has no horizontal overflow.
- Arabic route should remain hidden unless a real AR draft exists; if previewed later, RTL behavior must be checked.

## Suggested Implementation Sequence

1. Add `service` CMS page key in `src/lib/cms/pages.ts` and Page CMS UI.
2. Add typed service CMS content types and draft-capable loader.
3. Add DE draft seed script from the approved prototype.
4. Add `/[locale]/service` route with hidden/preview access guard.
5. Build `ServiceLandingPage` and calculator components from the approved prototype.
6. Add Page CMS preview button for `service`.
7. Run build/security checks.
8. Browser-verify hidden/public behavior and CMS editing loop.
9. Update docs and progress logs.

## Out Of Scope For First Slice

- Public release.
- Navigation menu update.
- Sitemap inclusion.
- Multilingual full copy rollout.
- New CMS workflow statuses.
- New Prisma model.
- Full generic page builder.
- Visual drag-and-drop editing.
- Scheduled publishing.
- Customer-facing portal functionality for service reports.
- Claims about invoices, warranty module, structured photo reports, or full SLA.

## Progress Log

- Date: 2026-05-21
- Current sprint/block: Public Website + Page CMS, hidden Service/Standort-Abo page implementation planning
- Done: Owner approved the site-style Service page prototype and confirmed tariffs should remain. Implementation plan defined for adding the page to Next.js and Page CMS while keeping it hidden from ordinary public visitors.
- In progress: Planning handoff only; no application code has been changed for `/service` yet.
- Next action: Next agent implements the plan starting with `service` CMS page-key support, draft-capable CMS loader, hidden route guard, and DE draft seed content.
- Blockers/risks: `Standort-Abo` remains an internal product concept, not an approved public tariff/SLA. The first implementation must keep the page hidden and avoid public indexing/navigation until owner explicitly approves release.
- Updated documents: `docs/02_public_website/page_plan_service.md`, `docs/02_public_website/README.md`, `PROGRESS.md`.

- Date: 2026-05-21
- Current sprint/block: Public Website + Page CMS, hidden Service/Standort-Abo page implementation
- Done: Added `service` Page CMS key, owner-only hidden `/[locale]/service?cmsPreview=1` route, Service page React renderer, client-side orientation calculator, DE draft seed script, CMS preview link, and noindex/robots hidden-route guardrails.
- In progress: Verification and owner preview. The route is implemented, but the DE CMS draft exists only after running `npm run db:seed:cms-service` against the target database.
- Next action: Run the seed in the intended environment when approved, then review `/de/service?cmsPreview=1` from an authenticated CMS owner session and adjust draft copy/prices in Page CMS.
- Blockers/risks: The page must remain out of public navigation/sitemap and must not be published until owner explicitly approves the Standort-Abo public release and claim language.
- Updated documents: `docs/02_public_website/page_plan_service.md`, `PROGRESS.md`.
