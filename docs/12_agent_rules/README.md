# 12 Agent Rules

Purpose: global rules and context for AI agents and developers.

Local prompts belong inside the relevant product folder. This folder is for shared rules that apply across the project.

Planned base documents:
- `agent_global_rules.md`
- `coding_rules.md`
- `security_rules_for_agents.md`
- `documentation_workflow.md`
- `code_review_checklist.md`

## Progress Log

### 2026-06-20

- Current sprint/block: domain documentation startup context reduction
- Done: added or coordinated domain `Context Beacon` / `Read Depth` rules for public website, client portal, admin/CMS, content/SEO/GEO, and AI assistant docs; split long progress history out of heavy README/rollout files where useful
- In progress: verifying that domain README files behave as routers rather than default historical logs
- Next action: keep future README updates short and move older detailed entries into the domain progress-log file instead of expanding startup context
- Blockers/risks: large planning/spec documents still exist and remain valid; agents must follow read-depth rules instead of loading them wholesale
- Updated documents: `PROGRESS.md`, `docs/00_project_overview/document_migration_matrix.md`, `docs/02_public_website/README.md`, `docs/02_public_website/information_architecture.md`, `docs/02_public_website/public_website_progress_log.md`, `docs/04_client_portal/README.md`, `docs/04_client_portal/client_portal_implementation_plan.md`, `docs/04_client_portal/telegram_email_portal_activation_plan.md`, `docs/05_admin_platform/README.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`, `docs/05_admin_platform/admin_platform_progress_log.md`, `docs/07_content_ai_seo/README.md`, `docs/07_content_ai_seo/content_ai_seo_progress_log.md`, `docs/08_ai_assistant/README.md`, `docs/08_ai_assistant/ai_assistant_progress_log.md`

### 2026-06-20

- Current sprint/block: startup context token reduction
- Done: tightened the startup reading rule so agents read `PROGRESS.md` as a short `Context Beacon` plus only the latest 2-3 entries, and added a `Detailed Log` boundary for older history
- In progress: keeping `PROGRESS.md` useful as a global status map without letting it become the default detailed session archive
- Next action: monitor future sessions and move long-running details into domain `Progress Log` sections when they start bloating the global file
- Blockers/risks: over-compression could hide active deployment or owner-review follow-ups if future entries become too terse
- Updated documents: `AGENTS.md`, `PROGRESS.md`, `docs/12_agent_rules/README.md`

### 2026-05-16

- Current sprint/block: staged context loading
- Done: added context-beacon workflow to root startup instructions and key overview documents so agents can start shallow and read deeper only when task scope requires it
- In progress: keeping startup context compact while preserving hard product, security, and documentation guardrails
- Next action: monitor future sessions for whether the beacon layer is enough or whether domain README files need matching beacons
- Blockers/risks: over-compression must not hide current-state boundaries, archive boundaries, or confirmation requirements
- Updated documents: `AGENTS.md`, `PROGRESS.md`, `docs/README.md`, `docs/00_project_overview/project_state_and_roadmap.md`, `docs/12_agent_rules/README.md`

### 2026-04-15

- Current sprint/block: agent rules alignment
- Done: moved shared `SKILL.md` to the repository root as the main companion to `AGENTS.md`; aligned root `AGENTS.md` with short Karpathy-style execution rules and a direct root-level reference
- In progress: keeping shared agent guidance compact, non-duplicative, and subordinate to repository-level rules
- Next action: extract more reusable review, security, or documentation checklists into this folder only when they become stable project-wide rules
- Blockers/risks: avoid duplicating repository instructions across multiple files; repository-level constraints must remain the source of truth
- Updated documents: `AGENTS.md`, `SKILL.md`, `docs/12_agent_rules/README.md`
