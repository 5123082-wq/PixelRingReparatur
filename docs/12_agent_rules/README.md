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
