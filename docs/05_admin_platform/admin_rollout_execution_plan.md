# 06 Admin Rollout Execution Plan

## Current Snapshot / Read Depth

Purpose: fast orientation for Admin Platform rollout work without loading the full historical log.

Startup read for admin rollout work:

1. Read this block, `Purpose`, `Approved Blocks`, `Delivery Principles`, `Dependency Order`, `Sprint Sequence`, `Release Gates`, and `Documentation Sync Matrix`.
2. Read `Progress Log` only through `### Latest Entry`.
3. Do not read `admin_platform_progress_log.md` at startup; open it only when continuing an older checkpoint, checking a specific date, or auditing historical context.

Current snapshot:

- Current admin/CMS route: `/ring-master-config`.
- Exists now: protected CMS/admin starter for dashboard shell, AI config, articles, page content, media library, SEO config, and knowledge-base reads.
- Current admin finalization baseline was accepted for MVP usage and paused on 2026-04-19; further expansion should start only from an explicit reopen request.
- Active sequence remains in `## Sprint Sequence`; detailed historical progress begins in `admin_platform_progress_log.md`.

Guardrails for rollout work:

- Preserve CSRF, rate-limit, and audit patterns on admin/CMS mutations.
- Keep admin/session tokens in HTTP-only cookies.
- Do not hardcode or expose secrets.
- Keep current implementation state separate from planned rollout scope.

## Purpose

This document is the execution plan for implementing the approved admin platform blocks without architectural drift.

It translates approved decisions into delivery order, dependencies, and release gates.

## Approved Blocks

1. Foundation: auth, sessions, RBAC baseline, audit, security baseline
2. Content Core: revisions, workflow, managed navigation
3. Assets + Forms: media governance/pipeline, configurable form schemas
4. Delivery + Integrations: outbox, adapters, cache revalidation, reliability controls
5. Hardening + Release Readiness: MFA/step-up, distributed rate limiting, backup/restore drills, incident/release gates

## Delivery Principles

- Keep current stack: `Next.js + Prisma + PostgreSQL`.
- Use Tabler as admin UI layer.
- Evolve existing entities (`CmsArticle`, `CmsPage`, `CmsMedia`, `AiConfig`, `CmsSeoConfig`) instead of replacing them.
- No big-bang rewrite; incremental production-safe rollout.
- Fix critical vulnerabilities inside the current delivery stage as mandatory hotfix work, then continue the planned stage sequence.

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
- simple publication lifecycle (`draft -> internal admin review -> publish`);
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

- Date: 2026-05-05
- Current sprint: References CMS image replacement
- Current block: Public Website / Page CMS media data repair
- Done: Generated a new role-based image set for `referenzen` with main-agent and delegated image generation passes covering repaired lightboxes, LED letters, neon contour, storefront film, facade mounting, branch service, and technical repair details. Added project-local generated sources under `signage-service/public/generated/referenzen/`, created new `CmsMedia` records in Blob storage with local fallback files, and rewrote published `CmsPage.blocks` image references for `referenzen` across `de`, `en`, `ru`, `tr`, `pl`, and `ar`. Verified the page now uses 16 unique Blob image URLs, with no remaining Unsplash references and all image URLs returning `200 image/png`.
- In progress: CMS editor hardening remains separate; `referenzen` still stores media as URL strings in `CmsPage.blocks`, not as strict relations to `CmsMedia`.
- Next action: When the CMS hardening track reopens, add server/client validation for gallery image fields and fallback-aware rendering for `referenzen` images.
- Blockers/risks: Direct data repair does not solve the underlying editor weakness: invalid image URLs can still be saved/published unless validation is added.
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`


### Detailed Progress Log

Do not read at startup. Older entries were moved to `admin_platform_progress_log.md` to keep this rollout plan light for startup context.

Read the detailed log only when continuing an older admin/CMS checkpoint, checking a specific date, or auditing historical context.
