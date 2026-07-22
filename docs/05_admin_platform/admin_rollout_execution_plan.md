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
- On 2026-07-20 the owner explicitly reopened public-content CMS work as an isolated parallel Payload pilot (параллельный пилот новой CMS), beginning with `Referenzen` (страницей примеров работ).
- The active pilot sequence is `payload_parallel_cms_pilot_plan.md`; the legacy admin sequence remains in `## Sprint Sequence`, and detailed historical progress begins in `admin_platform_progress_log.md`.

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
- Evolve existing entities (`CmsArticle`, `CmsPage`, `CmsMedia`, `AiConfig`, `CmsSeoConfig`) for content and modules that remain in the legacy CMS.
- Allow page-by-page Payload adoption only through the approved parallel pilot plan, without a big-bang replacement or dual-write workflow.
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

- Date: 2026-07-21
- Current sprint: Referenzen CMS-managed slogan media (управляемое через CMS изображение карточки-слогана)
- Current block: shared image replacement with localized Alt text (общее заменяемое изображение с локализованным альтернативным описанием)
- Done: extended the fixed `reportIntroBlock` (блок слогана) contract with required `image` (изображение) and `imageAlt` (альтернативное описание) fields. The image uses the existing shared media picker across all six locales, while Alt text remains editable per locale; selecting localized media can prefill an empty matching Alt field. The approved WebP image was registered in `CmsMedia` (медиатеке CMS), all six `CmsPage` records (записей страниц CMS) were updated, and revisions plus audit logs were written. Legacy records receive non-destructive editor/runtime fallbacks until saved.
- In progress: owner visual acceptance and optional authenticated editor UAT (приёмочная проверка редактора после входа).
- Next action: open `Referenzen` (страницу примеров работ) in the Pages editor, replace the shared image once in a reversible draft (черновике), confirm each localized Alt text, then restore or publish only after visual acceptance.
- Blockers/risks: no data blocker. The in-app browser policy blocked automated localhost capture, and DB-backed admin runtime tests remain intentionally guarded without a disposable test database; focused CMS tests, security verification, production build, CMS dry-run-after-apply and public DE/RU/AR runtime checks pass.
- Documents updated in this session: `PROGRESS.md`, `docs/02_public_website/README.md`, `docs/02_public_website/page_plan_references.md`, this file and `design-qa.md` (журнал визуальной проверки).

- Date: 2026-07-20
- Current sprint: Payload Parallel CMS Pilot (параллельный пилот новой CMS)
- Current block: Step 0 orchestrator infrastructure (инфраструктура оркестратора для Шага 0)
- Done: added [`payload_orchestration/`](payload_orchestration/README.md) with the future orchestrator's binding rules, single operational progress source, bootstrap prompt (стартовый промт), task packet (пакет задания), worker report (отчёт исполнителя) and independent verification report (отчёт независимой проверки). The protocol separates implementers and verifiers, assigns the shared progress file only to a Progress Recorder (агент-регистратор прогресса), records exact file ownership and requires explicit approval gates (ворота подтверждения).
- In progress: nothing; no Payload application, database, media storage, public adapter or deployment exists.
- Next action: launch a separate orchestrator with the bootstrap prompt (стартовым промтом), perform read-only Context Scout (разведку контекста только для чтения), prepare the first Step 1 task packet (пакет задания) and request separate owner approval before implementation.
- Blockers/risks: Step 1 is not approved; production must remain `legacy` (на старой CMS); existing uncommitted Referenzen hardening changes belong to the owner and must be preserved.
- Documents updated in this session: `docs/05_admin_platform/payload_orchestration/`, `docs/05_admin_platform/README.md`, `docs/05_admin_platform/payload_parallel_cms_pilot_plan.md`, this file and root `PROGRESS.md`.

- Date: 2026-07-20
- Current sprint: Payload Parallel CMS Pilot (параллельный пилот новой CMS)
- Current block: Step 0 / architecture and documentation decision (архитектурное и документационное решение)
- Done: the owner selected Payload after a cost and capability comparison with Strapi; approved a separate local `content-studio/`, local Payload-driven `Referenzen` (страницу примеров работ), continued production use of the legacy CMS until acceptance, read-only export/copy import, reuse of the current PostgreSQL and Vercel Blob services with logical isolation, a protected server preview (предпросмотр), explicit source switching and rollback (откат).
- In progress: synchronizing active admin, roadmap and security documents with the new decision; no Payload application, database, media storage or public adapter exists yet.
- Next action: after documentation review, request separate approval for Step 1 — create the isolated local Payload foundation without changing the public route, production database or server.
- Blockers/risks: existing uncommitted Referenzen hardening changes must be preserved; the two CMS systems must never become concurrent editable sources for the same page; production must remain `legacy` (на старой CMS) until the owner accepts the local and protected server flows.
- Documents updated in this session: `PROGRESS.md`, `docs/00_project_overview/project_state_and_roadmap.md`, `docs/05_admin_platform/README.md`, `docs/05_admin_platform/payload_parallel_cms_pilot_plan.md`, `docs/05_admin_platform/admin_platform_overview.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`, `docs/05_admin_platform/cms_site_management.md`, `docs/05_admin_platform/page_content_cms_plan.md`, `docs/10_security_privacy/admin_security_and_governance.md`

- Date: 2026-07-19
- Current sprint: Referenzen CMS control hardening (усиление управления страницей примеров работ через CMS)
- Current block: Page Content / structured Referenzen editor, atomic multilingual save and public publication contract (структурированный редактор, атомарное сохранение языков и правила публикации)
- Done: added the fixed Referenzen block schema (фиксированную схему блоков Referenzen) with section-specific list templates, stable cross-locale IDs (стабильные идентификаторы между языками), publish-time nested validation (проверку вложенных полей при публикации), protected interface labels, no arbitrary block order/removal, and restoration of known missing sections. The page editor now supports locale-aware media selection, direct upload with required Alt text (альтернативное описание), editing/removing photo items, OWNER preview (предпросмотр владельца), revision listing/restore and soft deletion/recovery of one locale record.
- Done: added `/api/cms/pages/batch` (атомарный пакетный API страниц) with CSRF protection (защита от поддельных запросов), permission gates, server normalization, optimistic concurrency (защита от перезаписи чужих изменений), Serializable transaction (транзакция с сериализуемой изоляцией), audit logging and revision creation. Saving a previously soft-deleted locale restores the unique row instead of failing on the unique key.
- Done: repaired current `referenzen` records for DE/EN/RU/TR/PL/AR in two audited atomic steps: 18 incomplete gallery cards removed, 41 stable IDs added, 191 missing Alt fields filled, 18 filters corrected and 18 independently editable layout-label fields added. No `CmsMedia` row or stored binary was deleted. A subsequent dry run (проверка без записи) reports zero remaining changes and zero validation/cross-locale issues.
- Done: focused page-audit tests, admin security verification, targeted lint (точечная проверка кода), TypeScript (проверка типов), production build (промышленная сборка), database audit, six-locale runtime crawl (обход шести языковых страниц), Russian gallery interaction and Arabic RTL (арабское направление справа налево) pass.
- In progress: authenticated browser UAT (приёмочная проверка после входа) of editor mutations is pending because the available browser had no OWNER session (сессии владельца).
- Next action: owner signs in through the normal CMS login and performs one reversible `DRAFT -> preview -> PUBLISHED` (черновик → предпросмотр → опубликовано) scenario plus hide/show, gallery add/edit/delete and revision restore; deploy only after acceptance.
- Blockers/risks: no known implementation or current-data blocker. Commit and deployment were intentionally not performed. The hardened workflow is page-specific for Referenzen, not a claim that every public page now has the same structured editor or publication semantics.
- Documents updated in this session: `PROGRESS.md`, `docs/00_project_overview/project_state_and_roadmap.md`, `docs/02_public_website/README.md`, `docs/02_public_website/page_plan_references.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`, `docs/05_admin_platform/cms_site_management.md`, `docs/05_admin_platform/page_content_cms_plan.md`

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
