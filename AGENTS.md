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
