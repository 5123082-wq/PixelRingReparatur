# 04 Implementation Phases

## Goal

This document turns the admin platform target into implementable phases.

The plan assumes the current Next.js/Prisma app remains the primary platform.
UI baseline for admin surfaces: Tabler components/theme.

Use together with:

- `docs/05_admin_platform/admin_platform_overview.md` for target-state architecture decisions;
- this document for implementation sequence against current project status.

## Foundation Block (Approved)

Approved decisions for Block 1:

- keep `Next.js + Prisma + PostgreSQL` as core platform;
- use Tabler as UI layer for admin interfaces;
- migrate from master-key-only access toward user-based access and granular permissions;
- keep separate CMS and CRM internal zones while sharing common security and audit baseline.

Foundation target outcomes:

1. Named admin users and revocable sessions.
2. Role-permission model and deny-by-default endpoint checks.
3. Mandatory audit coverage for high-risk actions.
4. Security baseline enforcement on admin mutation routes.

## Assets + Forms Block (Approved)

Approved decisions for Block 3:

- keep `CmsMedia` as the public CMS asset registry;
- keep private customer attachments in a separate domain and policy boundary;
- use Tabler-based UI for media and form management surfaces;
- use server-side `zod` validation for configurable form schemas and payload guards;
- use `sharp`-based image derivative/optimization pipeline for media hardening track;
- keep current rate-limit starter and move to distributed storage in hardening phase.

Assets + Forms target outcomes:

1. Required metadata and usage visibility for publishable assets.
2. Auditable form configuration changes without code-only updates.
3. Hardened media processing path with clear separation from private attachments.

## Delivery + Integrations Block (Approved)

Approved decisions for Block 4:

- keep API layer in current route handlers with typed contracts;
- implement integration/event reliability with Postgres outbox + dispatcher jobs;
- keep cache invalidation explicit via revalidation strategy tied to publish/update events;
- isolate channel/external integrations as adapters (`whatsapp`, `telegram`, `voice`, `bitrix` as needed);
- add idempotency keys, retry with backoff, and dead-letter visibility for integration failures.

Delivery + Integrations target outcomes:

1. Deterministic publish and notification/event delivery path.
2. Observable integration failures and controlled retry policy.
3. Clear boundary between core domain logic and connector-specific behavior.

## Hardening + Release Readiness Block (Approved)

Approved decisions for Block 5:

- migrate admin auth to named users + granular RBAC mappings;
- add MFA and step-up checks for destructive/sensitive actions;
- move rate limiting to distributed backing storage;
- enforce backup/PITR with restore verification drills;
- establish monitoring/alerting + incident response baseline;
- enforce staging/UAT/release/rollback gates before production rollout.

Hardening + Release target outcomes:

1. Security baseline reaches production-readiness level.
2. Data recovery and incident handling are operationally tested.
3. Releases follow explicit gates with rollback safety.

## Phase 0: Documentation Alignment

Objective:

- align existing docs with current code reality.

Tasks:

- mark Phase 1 and Phase 2 as completed, Phase 5 starter as partial, Phase 6 as partial;
- keep the split between CRM and CMS;
- document current implemented features and gaps;
- use this folder as the admin platform source of truth.

Definition of done:

- product and engineering can tell what exists, what is WIP, and what is next.

Status: DONE.

## Phase 1: CMS Articles And Support Publishing

Objective:

- make `/ring-master-config` useful for public support content.

Tasks:

- extend `CmsArticle` for hybrid structured content;
- add `/api/cms/articles` CRUD;
- replace `dashboard/articles` WIP screen with a working editor;
- seed current 9 German symptom cards into CMS;
- render `/de/support` cards from published CMS articles;
- add `/de/support/[slug]` detail route;
- append published CMS articles to AI prompt context.

Definition of done:

- OWNER can create, edit, publish, unpublish, and delete symptom articles;
- published articles appear on `/de/support`;
- detail pages render safe structured content;
- AI receives published CMS context while markdown KB remains active.

Status: DONE.

## Phase 2: SEO V1

Objective:

- make SEO/GEO management visible and actionable.

Tasks:

- add `CmsSeoConfig` or equivalent key/value config;
- add `/api/cms/seo`;
- replace `dashboard/seo` WIP screen;
- add audit for missing title, description, short answer, canonical, duplicate slug;
- generate `Article` and `BreadcrumbList` JSON-LD for support detail pages;
- document sitemap/hreflang as next step in Phase 2 output.

Definition of done:

- OWNER can see which articles are SEO-ready;
- support pages use CMS SEO fields or defaults;
- missing SEO fields are visible before publishing.

Status: DONE.

## Phase 3: Page Content CMS

Objective:

- allow editing site texts, headings, CTAs, and structured page blocks without editing code.

Tasks:

- add `CmsPage` JSON-block based equivalent;
- use `pageKey: "global"` for global contact/CTA/footer-adjacent starter content instead of adding `SiteSettings` in v1;
- add `dashboard/pages` UI;
- support locale-aware content values;
- add frontend helpers to load page content with safe fallback to existing i18n messages;
- integrate the first low-risk public page while preserving fallback behavior.

Definition of done:

- OWNER can edit selected public page sections from admin;
- frontend still renders safe typed components;
- missing CMS content falls back without breaking pages.

Status: PARTIAL / STARTER DONE.
Current coverage: `CmsPage` exists with JSON `blocks`, SEO fields, publish/review metadata, soft delete, unique `pageKey + locale`, and indexes for locale/status plus deleted rows. OWNER-only `/api/cms/pages` CRUD exists with CMS session auth, CSRF on mutations, generic hidden-endpoint 404s for unauthorized access, UUID-shaped id prechecks, audit logs for create/update/publish/unpublish/delete, and soft delete. `/ring-master-config/dashboard/pages` provides an internal JSON textarea editor with parsed block summaries, status switching, create/edit, and soft delete. The server helper in `src/lib/cms/pages.ts` normalizes structured blocks and returns `null` on draft, invalid content, missing rows, or recoverable DB errors so public pages can keep using `messages/*.json`.
Frontend integration: `/[locale]/status` can consume a published `status` page `hero` block while falling back to the existing `StatusPage` translations.
Remaining Phase 3 gaps: global footer/CTA integration, support/home integration, structured per-block forms, preview/versioning/workflow, and broader route/integration tests remain pending.

## Phase 4: Media Library

Objective:

- separate public website media from private customer attachments.

Tasks:

- add public CMS media model;
- implement upload endpoint with validation;
- store alt text, title, usage type, dimensions, and file metadata;
- add media picker to article/page editors;
- add "where used" check before deletion.

Definition of done:

- OWNER can upload/select public media for CMS content;
- private request attachments remain isolated from public CMS media.

Status: MVP DONE.
Current coverage: public CMS media is modeled separately from private attachments, `CmsMedia` exists in Prisma with usage type, public URL, checksum, dimensions/meta, and soft-delete indexes, and Phase 4 migrations (`20260408183000_phase4_cms_media`, `20260408194500_phase4_expand_cms_media_usage_enum`) create the public media table and enum updates. OWNER-only `/api/cms/media` CRUD/upload routes are implemented with CMS session auth, CSRF on mutations, hidden-endpoint 404 behavior for unauthorized access, UUID id guards on detail endpoints, audit logs for upload/update/delete and blocked delete attempts, and soft delete. Delete is blocked by a `where used` check against `CmsArticle` and `CmsPage` content references. `/ring-master-config/dashboard/media` provides upload/edit/delete UI and starter media pickers are wired into article/page editors.
Remaining Phase 4 gaps: scanning/quarantine, responsive derivative generation/image optimization pipeline, richer usage analytics/reporting, and full route/integration tests remain follow-up work.

## Phase 5: CRM Operations Hardening

Objective:

- make CRM reliable for daily request operations.

Tasks:

- add status event history;
- add internal notes;
- add assignment field;
- add audit logging for status changes and operator takeover;
- add stricter attachment download policy;
- add customer profile linking or extraction;
- add state-machine validation for status transitions.

Definition of done:

- every important CRM action has history;
- status transitions are server-validated;
- operators can manage cases without relying on raw case fields.

Status: PARTIAL / STARTER DONE.

## Phase 6: Security And Governance

Objective:

- bring admin closer to production security expectations.

Tasks:

- add persistent audit log;
- maintain CSRF guard coverage for admin mutation routes;
- add session timeout review;
- add soft delete for CMS content;
- add object-level authorization tests;
- prepare MFA and granular RBAC migration plan;
- move rate limiting to distributed storage when deployed across instances.

Definition of done:

- high-risk admin actions are auditable;
- destructive actions are controlled;
- authz and IDOR/BOLA checks are tested.

Status: PARTIAL / CMS AUDIT, CSRF STARTER, AND OBJECT-LEVEL AUTHZ TEST STARTER DONE.
Current coverage: current admin/CMS mutation routes are covered by `validateAdminCsrf`; CRM routes are locked to the CRM session cookie plus `MANAGER`; CMS routes are locked to the CMS session cookie plus `OWNER`; CRM case, CMS article, and CMS page object-id routes now return safe 404s for invalid UUID-shaped IDs before Prisma lookup; attachment download remains CRM-protected and audited for blocked and successful downloads.
Test starter: `npm run test:admin-security` provides a lightweight static verification pass for CSRF coverage, CRM/CMS cookie separation, role requirements, invalid-id guards, CMS soft delete behavior, Phase 4 `CmsMedia` schema/migration and media route coverage, and attachment download audit hooks. This is intentionally a low-churn harness because the project does not yet have a route-level test runner.
Remaining gaps: MFA/RBAC, distributed rate limiting, upload scanning/quarantine, broader governance, and full route/integration tests are still pending.

## Phase 7: Advanced CMS Workflow

Objective:

- reduce editorial risk as content volume grows.

Tasks:

- add version history;
- add preview mode;
- add scheduled publishing;
- add review workflow;
- add locale publish status;
- add `/hilfe/{category}/{slug}` GEO hub if still aligned with product strategy.

Definition of done:

- content publishing can scale beyond one owner editing a few pages manually.

Status: NOT STARTED.

## Recommended Immediate Sequence

1. Phase 6 follow-up: object-level authorization tests and CSRF coverage review.
2. Phase 3: Page Content CMS.
3. Phase 6 and Phase 7 as production hardening.
