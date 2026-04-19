# Admin Finalization Agent Prompt Pack

Use this file as a full handoff prompt for agents working on admin-panel completion.

## Pause Notice (Owner Decision, 2026-04-19)

- Current admin finalization line is accepted at current baseline and **paused**.
- Do not continue staged execution from this pack unless owner explicitly reopens this track.
- For next runs, move to another product block and treat this file as archived-for-resume.

## Operator Note

- Give the target agent this file **as-is**.
- The agent must first verify what is already implemented in code, then continue from the next unfinished step.
- This pack is aligned with the current staged plan: Security P0 -> Tests -> Workflow -> Simple publication flow (no preview/scheduling) -> Media hardening -> Delivery reliability -> Release readiness.
- Before execution, read `docs/05_admin_platform/next_agent_handoff.md` for the current concise checkpoint and immediate next actions.

## Global DUTY (Mandatory For Every Agent Run)

Copy this DUTY block at the top of any stage prompt:

```text
DUTY:
1) Treat code as source of truth. Before changing anything, inspect implementation status in:
   - signage-service/src
   - signage-service/prisma/schema.prisma + migrations
   - docs/05_admin_platform/*
   - docs/10_security_privacy/*
   - PROGRESS.md
2) Produce a short "Implemented / Partial / Missing" snapshot for the stage.
3) Execute only the current stage scope with minimal, surgical changes.
4) If you find a critical vulnerability, hotfix it immediately inside the current stage, add regression coverage, then continue stage work.
5) Do not commit.
6) Run relevant checks from signage-service/ and report results.
7) After changes, update:
   - PROGRESS.md
   - docs/05_admin_platform/admin_rollout_execution_plan.md (Progress Log, newest entry on top)
```

## Shared Constraints

```text
Workspace: /Users/macbookaleks/Documents/GitHub/PixelRingReparature

Mandatory repo rules:
- Read AGENTS.md (root) and signage-service/AGENTS.md.
- Run application commands from signage-service/.
- No broad refactors; preserve existing architecture/patterns.
- Keep security controls intact (CSRF, audit, permission checks, hidden 404 strategy).
- Do not expose secrets or private customer data.
- No commit.
```

## Scope Lock (Owner Decision, 2026-04-19)

```text
Current execution focus for workflow/publication lifecycle:
- Implement and refine publication workflow for CmsArticle only.
- Do not implement signed preview or scheduled publish/unpublish in this track.

Out of scope for this iteration (deferred to scaling phase):
- CmsPage publication workflow expansion;
- home-page visual block publication workflow (including ExcellenceCarousel content path);
- broad "all CMS entities" publication unification.

Rule for agents:
- If a change is not required for CmsArticle publication lifecycle, do not include it now.
```

## Stage 0 Prompt (Documentation Re-baseline)

```text
Execute Stage 0: documentation and status re-baseline.

Apply DUTY first.

Tasks:
1) Reconcile docs with factual implementation for admin/cms/security/workflow.
2) Ensure docs explicitly reflect:
   - revisions/restore already implemented;
   - current permission map;
   - current test contour limitations;
   - staged completion order.
3) Keep docs concise and non-contradictory.

Required updates:
- docs/05_admin_platform/admin_implementation_phases.md
- docs/05_admin_platform/admin_rollout_execution_plan.md
- docs/10_security_privacy/admin_security_and_governance.md
- docs/10_security_privacy/rbac_permissions.md
- docs/00_project_overview/project_state_and_roadmap.md
- PROGRESS.md

Output:
- Files changed
- What contradictions were fixed
- Remaining known gaps
```

## Stage 1 Prompt (Security P0)

```text
Execute Stage 1: Security P0 for admin/cms.

Apply DUTY first.

Tasks:
1) Audit and fix route-level authz/IDOR/BOLA gaps in admin/cms APIs.
2) Verify CSRF protection on all mutation routes in scope.
3) Verify object-id validation and safe not-found behavior.
4) Harden attachment/media sensitive access paths if needed.
5) Add/adjust regression checks in existing security scripts/tests.

Run:
- npm run test:admin-security
- npm run test:admin-auth
- npm run build

Output:
- Vulnerabilities fixed
- Regression protections added
- Residual risks
```

## Stage 2 Prompt (Runtime Tests Upgrade)

```text
Execute Stage 2: runtime integration + minimum E2E smoke.

Apply DUTY first.

Tasks:
1) Add integration tests for critical admin/cms API flows:
   - auth verify path,
   - articles publish/unpublish,
   - article revisions/restore,
   - media where-used delete block.
2) Add a minimum E2E smoke for:
   - login -> edit article -> save draft -> publish/unpublish -> restore.
3) Keep tests stable and short.

Output:
- New test files/commands
- Covered scenarios
- Gaps still uncovered
```

## Stage 3 Prompt (Workflow State Expansion)

```text
Execute Stage 3: CMS lifecycle workflow expansion.

Apply DUTY first.

Tasks:
1) Extend workflow states for CmsArticle beyond DRAFT/PUBLISHED:
   - IN_REVIEW, APPROVED, SCHEDULED, ARCHIVED
2) Implement server-side allowed transition rules.
3) Require and audit transition reason where appropriate.
4) Keep backward compatibility where feasible.
5) Do not expand CmsPage lifecycle in this iteration (deferred scope).

Include:
- Prisma schema + migration
- API and validation updates (CmsArticle paths)
- Minimal tests for transition rules

Output:
- Transition matrix implemented
- Migration and API impact
- Compatibility risks
```

## Stage 4 Prompt (Simple Publication Flow)

```text
Execute Stage 4: keep publication flow simple and verify it end-to-end.

Apply DUTY first.

Tasks:
1) Keep CmsArticle lifecycle on draft/internal admin review/publish (and unpublish when needed).
2) Do not add signed preview and do not add scheduled publish/unpublish in this stage.
3) Strengthen route/integration/e2e checks for the existing publish/unpublish/restore path.
4) Keep audit and permission guards intact while improving test confidence.

Output:
- Confirmed simple lifecycle model
- Validation/test coverage added
- Remaining risks after verification
```

## Stage 5 Prompt (Media Hardening)

```text
Execute Stage 5: media security hardening.

Apply DUTY first.

Tasks:
1) Add scanning/quarantine flow for uploaded media.
2) Add derivatives/optimization pipeline for images.
3) Preserve strict separation:
   - public CMS media
   - private customer attachments
4) Keep where-used/delete safety guarantees.

Output:
- Media lifecycle before/after
- Security controls added
- Operational limitations
```

## Stage 6 Prompt (Delivery + Integrations Reliability)

```text
Execute Stage 6: delivery reliability baseline.

Apply DUTY first.

Tasks:
1) Implement outbox pattern for high-impact publish/operations events.
2) Add dispatcher retry/backoff.
3) Add idempotency protection.
4) Add dead-letter visibility for failed processing.
5) Add minimal diagnostics surface/scripts.

Output:
- Event flow architecture
- Reliability guarantees
- Remaining production concerns
```

## Stage 7 Prompt (Release Readiness Closeout)

```text
Execute Stage 7: release-readiness hardening.

Apply DUTY first.

Tasks:
1) MFA baseline for admin users.
2) Step-up auth for destructive/high-impact actions.
3) Distributed rate limiting.
4) Final release checklist alignment:
   - rollback path
   - backup/restore drill evidence
   - incident runbook readiness

Output:
- What is now release-ready
- What still blocks production
- Final risk register
```

## Emergency Hotfix Prompt (Use In Any Stage)

```text
Emergency mode inside current stage.

If critical vulnerability is discovered:
1) Stop feature work.
2) Implement minimal safe hotfix.
3) Add regression coverage.
4) Resume stage plan.

Report:
- vulnerability
- exploit impact
- fix
- regression proof
```

## Sub-Agent Orchestration Prompt (For Main Agent)

```text
You may delegate to sub-agents.

Rules:
1) Keep one owner per write scope to avoid conflicts.
2) Do not duplicate tasks between agents.
3) Main agent integrates and verifies all outputs.
4) Each sub-agent must return:
   - files changed
   - checks run
   - unresolved risks

Suggested parallel split:
- Sub-agent A: security/authz checks and fixes
- Sub-agent B: test coverage additions
- Sub-agent C: docs/progress synchronization
```
