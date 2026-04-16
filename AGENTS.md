# AGENTS.md - PixelRing Reparatur Project Rules

Scope: the whole repository.

Codex loads instruction files from the repository root down to the current working directory at session start. If Codex is launched from the repository root, it will not automatically load nested files below the root.

Nested instructions may add stricter rules for a subdirectory. If you are editing the Next.js application and this session was started from the repository root, manually read `signage-service/AGENTS.md` before editing application code.

The repository is intentionally split:

- `docs/` contains project documentation and planning.
- `signage-service/` contains the Next.js application.

## Start Here

Before broad product, documentation, CRM, CMS, AI assistant, client portal, or security work:

1. Read `docs/README.md`.
2. Read `docs/00_project_overview/project_state_and_roadmap.md`.
3. Read the domain-specific folder README for the area you are touching.
4. Treat `docs/13_references_archive/` as historical reference only unless a current document explicitly marks a specific part as active.

For application code work:

1. Read `signage-service/AGENTS.md`.
2. Inspect `signage-service/package.json` before assuming commands, package manager, framework version, linting, or test scripts.
3. Run application commands from `signage-service/` unless the command explicitly says otherwise.
4. Read existing files before editing them and follow local patterns.

## Collaboration Rule

The project owner wants step-by-step work.

Before a substantial change:

1. Read the relevant document or code.
2. Briefly explain how you understand it.
3. Propose the concrete action.
4. Wait for confirmation.
5. Only then edit.

Do not rewrite documents, change application code, delete files, change `.gitignore`, run migrations, or create commits without explicit confirmation.

## Karpathy-Style Execution

Use concise, high-signal execution rules derived from Andrej Karpathy's guidance as an addition to this repository's rules, not a replacement for them.

- Think before coding: state assumptions, surface ambiguity, and ask instead of silently guessing.
- Simplicity first: prefer the minimum solution that satisfies the request; avoid speculative abstractions and optionality that was not asked for.
- Surgical changes: touch only what is required for the task; do not refactor, rewrite, or clean up unrelated areas.
- Goal-driven execution: define clear success criteria and verify them; prefer checks, tests, or other concrete validation over vague completion claims.

These rules must not override the collaboration rule, product guardrails, security constraints, or documentation process in this repository.

## Skill Reference

For detailed operating guidance, use the shared skill document:

- `SKILL.md`

If the skill guidance conflicts with repository instructions, this `AGENTS.md` file wins.

## Product Guardrails

PixelRing Reparatur is an AI-first, multilingual, one-stop service company for sign repair, installation, light advertising, branding, and related service requests.

The product must not behave like:

- a marketplace;
- a contractor directory;
- a listing platform;
- a "find a master" product.

Preserve these rules:

- one accountable service company;
- one entry point for customer requests;
- AI assists intake, but human specialists execute the service;
- customer-facing tracking must not expose raw CRM internals;
- request number alone must never expose private request data;
- German is canonical-first;
- MVP languages are DE, EN, RU, TR, PL, and AR;
- Arabic requires RTL-aware UI and content handling.

## Current State Boundary

Use `docs/00_project_overview/project_state_and_roadmap.md` as the current-state map.

Do not claim these modules exist unless verified in code:

- full client portal;
- user accounts;
- organizations;
- customer employees or members;
- invoices, payments, or billing;
- structured photo reports;
- warranty module;
- full RBAC;
- Bitrix24 production sync;
- retention, deletion, and export workflows.

## Archive Boundary

Archived prompt packs and historical phase documents may contain useful guardrails, but they are not current roadmap instructions.

Do not start implementation from:

- `docs/13_references_archive/old_consolidated_super_prompts.md`
- `docs/13_references_archive/old_antigravity_prompt_pack.md`
- `docs/13_references_archive/old_request_tracking_implementation_blueprint.md`
- `docs/13_references_archive/phase2_seo_handoff_for_new_agent.md`
- historical phase files under `docs/13_references_archive/`

If a useful rule should become active, propose extracting it into `docs/12_agent_rules/` and wait for confirmation.

## Engineering Safety

- Prefer existing project patterns over generic boilerplate.
- Do not assume package manager, commands, or architecture from old prompt packs.
- Do not hardcode secrets.
- Do not log tokens, passwords, admin keys, or private customer data.
- Validate user input on server-side routes.
- Keep admin/session tokens in HTTP-only cookies, not `localStorage`.
- Preserve audit logging and CSRF/rate-limit patterns when touching admin or CMS mutations.
- Treat file uploads and attachments as sensitive unless code and docs prove they are public.

## Documentation Safety

- Keep current-state docs separate from future plans.
- Mark planned or deferred modules explicitly.
- Do not use phase numbers without context; existing docs contain conflicting phase numbering.
- When moving or splitting docs, update links and the migration matrix.
- After documentation changes, check markdown links.
- Keep a root-level `PROGRESS.md` as the global short development journal.
- Agent must read `PROGRESS.md` before starting work.
- Agent must update `PROGRESS.md` after changes.
- `PROGRESS.md` should stay short: module + current stage/status only.
- Detailed notes must go into the domain-specific `Progress Log` section inside the corresponding documentation folder.
- For every new development track, add or update a `Progress Log` section in the main domain execution document (for example, rollout/plan doc in the touched folder).
- The `Progress Log` must include at least: date, current sprint/block, done, in progress, next action, blockers/risks, and updated documents.
- Before starting after a long pause, read the latest `Progress Log` entry first and continue from that checkpoint.
