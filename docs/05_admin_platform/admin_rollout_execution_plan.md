# 06 Admin Rollout Execution Plan

## Purpose

This document is the execution plan for implementing the approved admin platform blocks without architectural drift.

It translates approved decisions into delivery order, dependencies, and release gates.

## Approved Blocks

1. Foundation: auth, sessions, RBAC baseline, audit, security baseline
2. Content Core: revisions, workflow, preview, scheduling, managed navigation
3. Assets + Forms: media governance/pipeline, configurable form schemas
4. Delivery + Integrations: outbox, adapters, cache revalidation, reliability controls
5. Hardening + Release Readiness: MFA/step-up, distributed rate limiting, backup/restore drills, incident/release gates

## Delivery Principles

- Keep current stack: `Next.js + Prisma + PostgreSQL`.
- Use Tabler as admin UI layer.
- Evolve existing entities (`CmsArticle`, `CmsPage`, `CmsMedia`, `AiConfig`, `CmsSeoConfig`) instead of replacing them.
- No big-bang rewrite; incremental production-safe rollout.

## Dependency Order

1. Foundation is required before all other blocks.
2. Content Core depends on Foundation auth/audit controls.
3. Assets + Forms depends on Content Core publishing model and Foundation controls.
4. Delivery + Integrations depends on stable mutations/events from blocks 2 and 3.
5. Hardening + Release Readiness depends on blocks 1-4 being operational.

## Sprint Sequence

### Sprint 0: Stabilization Baseline

- freeze current docs as source of truth;
- verify current route security coverage;
- define acceptance checklist per block.

### Sprint 1: Foundation Implementation

- named admin users;
- role/permission mappings;
- session controls and forced logout;
- audit taxonomy normalization.

Exit criteria:

- master-key-only flow is no longer the only control path;
- critical admin mutations are role/permission guarded and auditable.

### Sprint 2: Content Core Implementation

- revisions for pages/articles;
- workflow state expansion;
- signed preview;
- scheduled publish;
- managed navigation entities.

Exit criteria:

- content lifecycle is controlled without code-only publishing changes.

### Sprint 3: Assets + Forms Implementation

- media governance metadata/reporting;
- image derivative pipeline;
- configurable form schemas with server-side validation;
- form-change auditing.

Exit criteria:

- media/forms changes are admin-driven, typed, and auditable.

### Sprint 4: Delivery + Integrations Implementation

- outbox and dispatcher baseline;
- adapter boundaries for external channels/systems;
- deterministic cache revalidation;
- retry/idempotency/dead-letter flows.

Exit criteria:

- delivery failures are observable, retryable, and do not corrupt core domain state.

### Sprint 5: Hardening + Release Readiness

- MFA/step-up;
- distributed rate limiting;
- backup/PITR restore drills;
- monitoring/alert ownership;
- incident runbooks;
- staging/UAT/rollback release gates.

Exit criteria:

- security, recovery, and release controls are validated by checklist evidence.

## Release Gates

Before production rollout of each major block:

1. Security checks pass for changed routes.
2. Migration safety and rollback path documented.
3. UAT checklist signed off.
4. Observability and on-call ownership confirmed.

## Documentation Sync Matrix

When this plan changes, sync these files:

1. `docs/05_admin_platform/admin_platform_overview.md`
2. `docs/05_admin_platform/admin_implementation_phases.md`
3. `docs/10_security_privacy/admin_security_and_governance.md`
4. `docs/01_strategy/mvp_roadmap.md`
5. `docs/00_project_overview/project_state_and_roadmap.md`
6. `docs/09_engineering/architecture_and_integrations.md`

## Progress Log

Use this section as a recovery checkpoint after each work session.

Update it every time scope/status changes, so the next agent can resume without rediscovery.

Entries are in **reverse chronological order** — newest entry is always at the top, right below `### Latest Entry`. Append new entries above the previous latest.

### Current Snapshot Template

- Date:
- Current sprint:
- Current block:
- Done:
- In progress:
- Next action:
- Blockers/risks:
- Documents updated in this session:

### Latest Entry

- Date: 2026-04-16
- Current sprint: Sprint 2 Content Core (CMS editor field mapping audit + full block type coverage)
- Current block: Block 2 Content Core
- Done: Discovered and fixed a critical field mapping bug — the CMS unified editor was saving fields with names that did not match what the frontend components read (`title` instead of `titlePrefix/titleAccent/titleSuffix`, `subtitle` instead of `intro`, `ctaText` instead of `ctaPrimary`, `body` instead of `description`, `description` instead of `subtitle`), causing all CMS edits to be silently ignored while the frontend fell back to hardcoded `messages/*.json` translations; corrected `BLOCK_TEXT_FIELDS` mapping and all editor UIs for all 4 original block types (hero, faqList, textSection, reviewList); added structured editor UIs for 3 previously-unsupported block types (`cardList` with three-part colored title for Trust/Bento/Excellence/Roadmap sections, `cta` for Navigation/Urgent Cases, `footerCta` for Footer CTA); hero shared field corrected from `ctaUrl` to `assetUrl`; hero editor now shows all 9 locale-specific text fields (pretitle, titlePrefix, titleAccent, titleSuffix, intro, ctaPrimary, ctaSecondary, trustBadge, responseBadge) with descriptive labels and hints; all 7 CMS block types now have structured editors; verified with `npm run build` — zero TypeScript errors
- In progress: All editor field mappings are correct; complex nested list editing (e.g. Trust stats/features arrays, Excellence items, Roadmap steps, review items) still requires Advanced Mode for sub-item manipulation
- Next action: Phase 5 CRM Operations Hardening (object-level auth, route tests, audit coverage, attachment access review); or optionally expand CMS public page integration coverage
- Blockers/risks: None; editor is stable and build-verified
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Unified Multi-Locale CMS Editor)
- Current block: Block 2 Content Core
- Done: Complete rewrite of `PagesPage.tsx` from locale-isolated workflow to unified multi-locale interface; replaced flat per-locale table with pageKey-grouped rows showing locale availability indicators (🟢 Published / 🟡 Draft / ⚪ Missing); implemented tabbed editor with global locale tabs (DE/EN/RU/TR/PL/AR) for text fields while maintaining shared block structure; added batch Save logic — iterates all locales performing PATCH for existing records and POST for new missing locale records in parallel via `Promise.all()`; implemented `mergeToUnified()` and `splitToLocaleBlocks()` helper functions for client-side state management; added Advanced Mode with per-locale raw JSON editor for emergency overrides; fixed TypeScript `ReactNode` strict-mode errors by converting `condition && JSX` patterns to ternary `condition ? JSX : null`; verified with `npm run build`
- In progress: Field mapping correctness not yet verified (addressed in next session)
- Next action: Audit and fix CMS→frontend field name mappings
- Blockers/risks: None
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Phase 3 stabilization)
- Current block: Block 2 Content Core
- Done: Fixed a critical regression in `TrustSection.tsx` where the `content` prop was used but not defined in the component signature, causing a `ReferenceError: content is not defined` and crashing the home page; verified other home page sections (`HeroSection`, `IntakeSection`, `BentoGridSection`, `CoverageMap`, `ExcellenceCarousel`, `ReviewsSection`, `RoadmapSection`, `FAQSection`) and global layout components (`Header`, `Footer`, `FooterCTA`) to ensure they correctly receive and handle the `content` prop; restored missing `useTranslations` import in `TrustSection.tsx` that was briefly lost during the fix.
- In progress: Remaining Phase 3 public integration work for `support` and high-value sections.
- Next action: Continue with the Phase 3 rollout as planned, ensuring all new prop additions are correctly typed and received by components.
- Blockers/risks: None; site stability restored.
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Phase 3 home intake slice)
- Current block: Block 2 Content Core
- Done: Added the first explicit high-value home section contract beyond hero for `IntakeSection`; extended `src/lib/cms/pages.ts` so `getHomePageCmsContent(locale)` now reads the seeded `home` `textSection` block with key `intakeSection` into a typed normalized `intake` payload (`title`, `description`, `methods[]` with allowlisted ids only); updated `src/app/[locale]/page.tsx` to keep route-level CMS reads and pass only the normalized `homeCms?.intake` prop into `IntakeSection`; updated `IntakeSection` to consume optional normalized CMS content while preserving existing `next-intl` fallback values, icon/layout/modal behavior, and method ordering; verified with `npm run build`, local home-route checks for `de`, `en`, `ru`, `tr`, `pl`, and `ar` returning `200`, and a locale-title smoke check confirming each rendered home page still contains the expected localized `Intake.title`; separately verified Arabic keeps `lang="ar"` and `dir="rtl"`
- In progress: The rest of the `home` high-value sections still render from the current translation/fallback sources; `support` top labels/categories/intro copy and the `hilfe` decision are still open
- Next action: Continue the same pattern with the next narrow `home` slice, starting with `BentoGridSection`, then proceed section by section without moving CMS reads into `layout.tsx` or passing raw blocks into UI components
- Blockers/risks: Seeded CMS content for `IntakeSection` currently mirrors the same localized copy as the fallback messages, so the route checks prove render stability and locale coverage but do not yet distinguish edited CMS copy from unchanged fallback text; keep fallback in place until each next section has the same typed contract and route-level verification
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Phase 3 public integration scope lock)
- Current block: Block 2 Content Core
- Done: Locked the next-agent Phase 3 scope so the current architecture stays intact: keep route-level CMS reads only, keep typed adapters in `src/lib/cms/pages.ts`, keep UI components consuming normalized props instead of raw `CmsPageBlock[]`, and keep fallback to current `messages/*.json` or route copy until each section has a stable explicit contract; confirmed that `layout.tsx` must not be touched in this step and that structured page editor work stays deferred until after the remaining public integration slice is stable
- In progress: Remaining high-value public CMS wiring is still open for `home` and `support`; `hilfe` still needs an explicit decision between fallback-only and alignment to the same typed CMS wiring model
- Next action: Implement the next Phase 3 slice section by section in this order: `home` contracts/wiring for `IntakeSection`, `BentoGridSection`, `TrustSection`, `CoverageMap`, `ExcellenceCarousel`, `ReviewsSection`, `RoadmapSection`, and `FAQSection`; then `support` contracts/wiring for the top badge/hero label, category content, and introductory copy around the symptom cluster; then decide `hilfe`; only after that, consider a structured page editor instead of the raw JSON editor
- Blockers/risks: Scope can sprawl if the next slice moves CMS reads into `layout.tsx`, passes raw block arrays into UI components, or removes fallback early; Phase 3 must not be declared complete until there are at least route/integration checks for public CMS consumption across `de`, `en`, `ru`, `tr`, `pl`, and `ar`, including an explicit Arabic/RTL verification that CMS-managed copy does not break the existing RTL layout
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Page CMS public integration slice 1)
- Current block: Block 2 Content Core
- Done: Added typed public CMS readers in `src/lib/cms/pages.ts` for `global`, `home`, and `support` content blocks; extended `Header`, `Footer`, `FooterCTA`, `HeroSection`, and `UrgentCases` to accept optional CMS-driven content while preserving existing translation/static fallbacks; wired the seeded `CmsPage` content into public routes for `/[locale]`, `/[locale]/support`, `/[locale]/status`, and `/[locale]/support/[slug]` so the global header/footer/footer CTA are now read from CMS where available, the home hero reads from the seeded `home` page, and the support hero/urgent sidebar read from the seeded `support` page; verified the slice with `npm run build`
- In progress: Broader public-page consumption remains partial; most home/support sections still render from the existing translation/fallback sources
- Next action: Start the next Phase 3 slice with explicit block-to-component contracts for the remaining high-value public sections, then wire those sections incrementally without moving `layout.tsx` to direct CMS reads yet
- Blockers/risks: The current public integration is intentionally narrow and safe; the remaining sections still depend on mixed live sources, the admin page editor is still a raw JSON/block editor, and broad integration without explicit section contracts would create drift between CMS block shapes and component props
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_implementation_phases.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Page CMS baseline backfill)
- Current block: Block 2 Content Core
- Done: Implemented `scripts/seed-cms-pages-baseline.mjs` plus `npm run db:seed:cms-pages`; backfilled baseline `CmsPage` records for `home`, `support`, `status`, and `global` across `de`, `en`, `ru`, `tr`, `pl`, and `ar` from the current live content sources (`messages/*.json`, current route/page copy, and current global/footer/nav copy); restored soft-deleted page rows where needed; created revision snapshots for seeded rows; verified the resulting database state has `24` active published pages (`4` page keys x `6` locales) with no soft-deleted leftovers; fixed the script for explicit UUID insertion on tables without DB-side defaults and confirmed stable idempotent reruns with `skipped: 24`
- In progress: Baseline content is in CMS; broader public-page consumption of `home`, `support`, and `global` CMS blocks is still not implemented
- Next action: Decide the next narrow integration slice for reading seeded `home`/`support`/`global` CMS content into public components without removing fallback safety
- Blockers/risks: The current seeded records use a pragmatic block mapping from mixed live sources; before broad frontend consumption, each public section needs an explicit block-to-component contract so the CMS shape does not drift from the rendered section APIs
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_implementation_phases.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (post Slice 1 planning)
- Current block: Block 2 Content Core
- Done: Closed Slice 1 restore/revisions runtime + UAT gate and documented the next required Page CMS slice: create baseline `CmsPage` records for `home`, `support`, `status`, and `global` across `de`, `en`, `ru`, `tr`, `pl`, and `ar`, then backfill them from existing live content sources instead of leaving the CMS empty
- In progress: Planning only; no baseline page-content backfill has been implemented yet
- Next action: Implement Page CMS baseline seeding/backfill for all supported locales and map current public copy/fallback content into the structured block format
- Blockers/risks: Existing public copy lives in mixed sources (`messages/*.json` plus route-level/page-level content), so the backfill needs an explicit source-to-block mapping to avoid drift between fallback text and CMS-managed content
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_implementation_phases.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Slice 1 restore UAT closeout)
- Current block: Block 2 Content Core
- Done: Fixed the CMS dynamic `:id` route guard regression by centralizing UUID-like route param parsing in `src/lib/route-params.ts` and wiring the article/page detail, revisions, and restore routes to the shared helper; updated `scripts/verify-admin-security.mjs` to enforce the shared UUID validation contract instead of stale per-route inline regex assumptions; re-ran `npm run build`, `npm run test:admin-auth`, and `npm run test:admin-security` successfully; executed live restore UAT for both `CmsArticle` and `CmsPage` against the running app and target database, confirming happy-path restore (`200` + `restoredFromRevisionId`), invalid revision hidden `404`, manager permission-deny hidden `404`, new revision trail entries (`CREATE`, `UPDATE`, `RESTORE`), and matching `CMS_ARTICLE_RESTORED` / `CMS_PAGE_RESTORED` audit records; cleaned the UAT records via the same CMS delete APIs after verification
- In progress: Slice 1 is closed; no remaining restore/UAT work is open for this slice
- Next action: Start the next narrow Block 2 content-core slice after restore sign-off, with scope defined explicitly before code changes
- Blockers/risks: No active blocker for Slice 1; the main risk remains keeping future route-level security checks aligned with shared helpers so static verification does not drift from runtime behavior again
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-15
- Current sprint: Sprint 2 Content Core (Slice 1 deployment verification)
- Current block: Block 2 Content Core
- Done: Applied migration `20260414193000_cms_revisions_slice1` to the target database via `npm run db:deploy`; confirmed `npm run db:status` returns no pending migrations and shows the slice migration as `applied`; fixed unrelated type drift in `src/lib/admin-audit.ts` (`AdminRequestActor.expiresAt`) that was blocking TypeScript; resolved strict JSON typing in `src/lib/cms/revisions.ts`; validated full build and checks with `npm run build`, `npm run test:admin-auth`, and `npm run test:admin-security` all passing
- In progress: UAT evidence capture and release-gate sign-off for Slice 1 (manual restore scenarios) are still pending
- Next action: Execute manual UAT for article/page restore flows (happy path, invalid revision, permission deny) and attach evidence to the release checklist
- Blockers/risks: No current technical blocker on migration/build/test; remaining risk is operational until UAT evidence is captured and signed off
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`

- Date: 2026-04-14
- Current sprint: Sprint 1A Foundation closeout
- Current block: Block 1 Foundation
- Done: Verified `npm run db:status` shows `20260414110000_admin_users_foundation` applied with no pending migrations; ran `npm run admin:bootstrap` against the configured Neon database and rotated both bootstrap users (`owner@pixelring.local`, `manager@pixelring.local`); disabled `ADMIN_ENABLE_MASTER_KEY_FALLBACK` in local/dev config; removed the master-key login mode from the CRM/CMS login screens and deleted the remaining server-side fallback path from auth parsing/authentication logic so admin login is now password-only; confirmed live page HTML no longer exposes `Bootstrap Key`; completed live dev-server smoke tests with CMS password login succeeding, CRM password login succeeding, and legacy `masterKey` payloads returning `404`; added `actorAdminUserId` to existing CRM/CMS mutation and attachment-download audit writes wherever `requireAdminActor` already provides the named actor; added shared `requireAdminSession(...)` usage for admin/CMS read-side guards (`verify`, `knowledge-base`, dashboard layouts, request guard composition) so deny-by-default checks now share one auth helper; introduced `src/lib/admin-permissions.ts` with the first explicit permission map under current roles; switched `CMS AI`, `CMS SEO`, `CMS knowledge-base`, `CMS articles/pages`, `CMS media`, CRM verify, CRM case list/create, CRM case detail read/update/conversation flows, and attachment downloads to explicit permission guards; strengthened `verify-admin-security.mjs` so article/page detail mutation segments and CMS media routes are checked for the expected permission gates; formalized the active permission matrix in `docs/10_security_privacy/rbac_permissions.md` and synced current-state/security/admin docs; `npm run test:admin-security`, `npm run test:admin-auth`, and targeted `eslint` passed
- In progress: Separate staging/production environments still need the same password-only rollout if they are not sharing this database/configuration
- Next action: Start Block 2 Content Core with a narrow first slice: revision model and restore path for `CmsArticle`/`CmsPage`, before touching workflow or scheduling
- Blockers/risks: Rotating bootstrap users revokes their active sessions by design; admin auth smoke tests can hit the in-memory 5-attempt/5-minute rate limiter unless requests are spaced or isolated by IP during verification; staging/production parity still needs confirmation if those environments are separate
- Documents updated in this session: `PROGRESS.md`, `docs/00_project_overview/project_state_and_roadmap.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`, `docs/05_admin_platform/admin_implementation_phases.md`, `docs/10_security_privacy/README.md`, `docs/10_security_privacy/admin_security_and_governance.md`, `docs/10_security_privacy/rbac_permissions.md`
