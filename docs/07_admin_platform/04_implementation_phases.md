# 04 Implementation Phases

## Goal

This document turns the admin platform target into implementable phases.

The plan assumes the current Next.js/Prisma app remains the primary platform.

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

- add `CmsPage` and `CmsBlock` or JSON-block based equivalent;
- add `SiteSettings` for global contact/CTA/footer data;
- add `dashboard/pages` UI;
- support locale-aware content values;
- add frontend helpers to load page content with safe fallback to existing i18n messages.

Definition of done:

- OWNER can edit selected public page sections from admin;
- frontend still renders safe typed components;
- missing CMS content falls back without breaking pages.

Status: NOT STARTED.

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

Status: NOT STARTED.

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
Current coverage: current admin/CMS mutation routes are covered by `validateAdminCsrf`; CRM routes are locked to the CRM session cookie plus `MANAGER`; CMS routes are locked to the CMS session cookie plus `OWNER`; CRM case and CMS article object-id routes now return safe 404s for invalid UUID-shaped IDs before Prisma lookup; attachment download remains CRM-protected and audited for blocked and successful downloads.
Test starter: `npm run test:admin-security` provides a lightweight static verification pass for CSRF coverage, CRM/CMS cookie separation, role requirements, invalid-id guards, CMS soft delete behavior, and attachment download audit hooks. This is intentionally a low-churn harness because the project does not yet have a route-level test runner.
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
3. Phase 4: Media Library.
4. Phase 6 and Phase 7 as production hardening.
