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

- Date: 2026-04-14
- Current sprint: Sprint 1A Foundation implementation
- Current block: Block 1 Foundation
- Done: Added `AdminUser` + `AdminUserStatus`; linked `AdminSession` to named admins with `revokedAt` and `lastSeenAt`; added `actorAdminUserId` to `AdminAuditLog`; migrated CMS/CRM auth routes to dual-mode (`email + password` primary, master-key bootstrap fallback gated by env); added logout revocation + login/logout audit events; added CMS verify parity; updated dashboard guards and internal login UIs; added admin bootstrap script; added dedicated auth/session test harness; `npm run db:generate`, `npm run test:admin-security`, `npm run test:admin-auth`, targeted `npm run lint`, and `npm run build` passed locally
- In progress: Environment rollout steps are still pending (`db:deploy` + bootstrap user creation + local/staging credential smoke test)
- Next action: Apply migration in the target environment, run `npm run admin:bootstrap`, set fallback envs if bootstrap master-key access must stay enabled temporarily, then smoke-test CMS and CRM login with named users
- Blockers/risks: Applying the migration intentionally invalidates existing admin sessions; bootstrap emails/passwords and optional fallback envs must be provisioned before operational use
- Documents updated in this session: `PROGRESS.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`
