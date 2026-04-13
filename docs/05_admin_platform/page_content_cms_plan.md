# 07 Phase 3 Page Content CMS Plan

## Goal

Phase 3 makes fixed public website page content editable from `/ring-master-config` without turning the site into a free-form page builder.

The CMS stores safe structured data. The frontend continues to render known components and falls back to the current i18n messages when CMS content is missing, draft-only, invalid, or unavailable.

## Agreed V1 Scope

Phase 3 v1 covers a narrow starter set:

- `home`;
- `support`;
- `status`;
- `global`, for footer/global CTA/contact-adjacent copy.

This phase does not attempt to CMS-edit every public page or every visual detail.

## Data Model Direction

Use a low-churn JSON-block model first:

- `CmsPage`;
- one row per `pageKey + locale`;
- `blocks Json`;
- `status`;
- SEO metadata fields if needed for fixed pages;
- publish and review metadata;
- soft delete support if the table needs destructive admin actions.

Do not add a separate `CmsBlock` table in v1. A separate block table can be introduced later if block-level permissions, reusable blocks, version history, granular ordering, or cross-page dependencies become necessary.

Suggested fields:

- `id`;
- `pageKey`;
- `locale`;
- `status`: `DRAFT` or `PUBLISHED` for v1;
- `title`;
- `blocks`;
- `seoTitle`;
- `seoDescription`;
- `canonicalUrl`;
- `publishedAt`;
- `lastReviewedAt`;
- `deletedAt`;
- `createdAt`;
- `updatedAt`.

Suggested constraints:

- unique `pageKey + locale`;
- index `locale + status`;
- index `deletedAt`.

## Global Settings Direction

Do not introduce `SiteSettings` in Phase 3 v1.

Use `pageKey: "global"` for shared footer, global CTA, and global contact-adjacent content. This keeps the first migration and API small while preserving a path to split a dedicated `SiteSettings` model later.

Future trigger for `SiteSettings`:

- settings become non-page-like;
- settings need different permissions or audit policy;
- settings need strongly typed columns instead of page blocks;
- multiple consumers need stable global keys independent of page publishing.

## Block Contract

Only structured JSON blocks are allowed. The CMS must not store JSX or arbitrary HTML.

Starter block types:

- `hero`;
- `cta`;
- `textSection`;
- `cardList`;
- `faqList`;
- `reviewList`;
- `footerCta`.

Each block should have:

- `type`;
- `key`;
- typed content fields;
- optional `enabled`;
- optional `sortOrder`.

Example:

```json
[
  {
    "type": "hero",
    "key": "supportHero",
    "enabled": true,
    "title": "Support",
    "subtitle": "Choose the closest issue and start a request.",
    "ctaLabel": "Start request",
    "ctaHref": "/support"
  }
]
```

The frontend should validate or normalize block content before rendering. Unknown block types must be ignored, not rendered unsafely.

## Fallback Rule

Fallback is mandatory.

Public pages must continue to render from current `messages/*.json` values when:

- no `CmsPage` row exists;
- the row is `DRAFT`;
- `blocks` is empty;
- a block is unknown or invalid;
- database access fails in a recoverable context.

CMS content overrides i18n only when a published page and valid block data are available.

## API Surface

Add OWNER-only CMS endpoints:

- `GET /api/cms/pages`;
- `POST /api/cms/pages`;
- `GET /api/cms/pages/[id]`;
- `PATCH /api/cms/pages/[id]`;
- `DELETE /api/cms/pages/[id]`.

Security requirements:

- use `CMS_SESSION_COOKIE_NAME`;
- require `OWNER`;
- use `validateAdminCsrf` on `POST`, `PATCH`, and `DELETE`;
- return generic `404 Not found` for unauthorized admin responses where consistent with the current hidden endpoint strategy;
- validate UUID-shaped object IDs before Prisma lookup;
- audit create, update, publish, unpublish, and delete actions;
- soft delete rather than hard delete.

## Admin UI Starter

Add `/ring-master-config/dashboard/pages`.

V1 editor can be an internal-only JSON textarea with validation and previews of parsed block summaries. This is acceptable for the starter because the goal is to establish the data path and fallback behavior first.

Minimum UI:

- list page records by `pageKey`, `locale`, `status`, and `updatedAt`;
- create a page record for allowed page keys;
- edit JSON blocks;
- switch `DRAFT` / `PUBLISHED`;
- save with visible validation errors;
- soft delete with confirmation.

Later iterations can replace the JSON textarea with structured forms per block type.

## Frontend Integration

Add a helper that loads page content by `pageKey + locale` and returns a typed normalized shape.

Integration order:

1. `status`;
2. `global` footer/global CTA;
3. `support`;
4. `home`.

Each integration must keep existing i18n fallback in place and should avoid broad UI refactors.

Implemented starter integration:

- `/[locale]/status` can read a published `status` page `hero` block via `getStatusPageCmsContent()`;
- if the CMS row is missing, draft, invalid, empty, or the DB is unavailable in that recoverable helper path, `StatusLookup` uses the existing `StatusPage` translations from `messages/*.json`;
- no broad home/support/footer render refactor has been done.

## Out Of Scope

Do not include in Phase 3 v1:

- Media Library;
- image uploads;
- arbitrary HTML editing;
- visual drag-and-drop page builder;
- preview mode;
- scheduled publishing;
- version history;
- granular RBAC;
- `SiteSettings` table;
- full workflow states beyond `DRAFT` and `PUBLISHED`.

## Implementation Sequence

1. Add Prisma model and migration for `CmsPage`.
2. Add page block normalization helpers.
3. Add OWNER-only `/api/cms/pages` route handlers with CSRF, audit logging, safe object-id handling, and soft delete.
4. Add `dashboard/pages` JSON editor starter.
5. Integrate frontend helper into `global`, then one public page at a time.
6. Update `docs/05_admin_platform/admin_implementation_phases.md` when the starter is implemented.
7. Run `npm run lint`, `npm run build`, and extend `npm run test:admin-security` or add a similarly lightweight check for the new routes.

## Implementation Notes

Implemented in the Phase 3 starter slice:

- Prisma `CmsPage` model using the existing `CmsArticleStatus` enum for `DRAFT` / `PUBLISHED`;
- migration `20260408120000_phase3_cms_pages`;
- `src/lib/cms/pages.ts` normalization helpers for allowed page keys, locales, status values, links, safe JSON blocks, and public fallback helpers;
- starter API validation currently allowlists the agreed starter block types and rejects unsafe/unknown block payloads instead of storing arbitrary JSON for public rendering;
- OWNER-only `/api/cms/pages` and `/api/cms/pages/[id]` route handlers;
- CSRF protection on `POST`, `PATCH`, and `DELETE`;
- generic 404 responses for unauthorized CMS page endpoint access;
- UUID-shaped id precheck before detail lookups;
- audit logging for page create, update, publish, unpublish, and delete;
- soft delete only;
- `/ring-master-config/dashboard/pages` JSON textarea starter UI;
- dashboard entry points for Page CMS;
- `npm run test:admin-security` coverage for CMS page mutation routes, CMS OWNER role checks, invalid id guards, and soft delete.

Verification run for this starter slice:

- `npm run db:generate`;
- `npm run test:admin-security`;
- `npm run lint`;
- `npm run build`.

## Remaining Gaps

- Map `global` blocks to footer/global CTA/contact-adjacent copy and integrate them safely.
- Integrate `support` and `home` only after block contracts are clear for those existing layouts.
- Replace the internal JSON textarea with structured forms per block type.
- Decide later whether page SEO fields should stay page-local or share more logic with `/api/cms/seo`.
- Add full route/integration tests beyond the current static security starter.
- Keep Media Library, uploads, upload scanning/quarantine, preview mode, version history, scheduled publishing, granular RBAC/MFA, and distributed rate limiting out of this starter slice.
