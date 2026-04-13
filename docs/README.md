# PixelRing Reparatur Documentation

This directory is the main documentation hub for the PixelRing Reparatur project.

The goal of this documentation is to keep product strategy, public website UX, customer portal, admin platform, CRM, engineering, security, operations, and AI/content decisions separated enough that future work can grow without mixing unrelated concerns.

## Repository Layout

- `docs/` contains project documentation, planning, product rules, and domain specs.
- `signage-service/` contains the Next.js application, Prisma schema, scripts, and application package manifest.
- `AGENTS.md` at the repository root contains project-wide agent instructions.
- `signage-service/AGENTS.md` contains application-specific Next.js instructions.

Run application commands from `signage-service/` unless a command explicitly says otherwise.

## How To Start

1. Read this file first.
2. Read `00_project_overview/` for the current product map and documentation structure.
3. Read the domain-specific folder for the task you are working on.
4. For application code work, also read `../signage-service/AGENTS.md` and inspect `../signage-service/package.json`.
5. Treat archived documents as reference material only unless a current folder document explicitly points to them.

## Target Folder Structure

### `00_project_overview/`

Project-wide map and status.

Use for:
- current project state;
- high-level roadmap;
- glossary;
- decision log;
- documentation structure and migration notes.

### `01_strategy/`

Business strategy and product positioning.

Use for:
- master brief;
- MVP roadmap;
- business model;
- target audience;
- positioning rules.

### `02_public_website/`

Public-facing website structure and user experience.

Use for:
- site map;
- public page inventory;
- public user journeys;
- forms and request intake UX;
- multilingual routing and content surfaces.

### `03_design_system/`

Design, visual language, UI rules, and design prompts.

Use for:
- design principles;
- layout rules;
- component behavior;
- Stitch/v0/design-generation prompts;
- accessibility and responsive UI rules.

### `04_client_portal/`

Future customer account area.

Use for:
- customer login and identity;
- organizations and employees;
- customer-facing request tracking;
- photo reports;
- warranties;
- billing/accounting documents visible to customers.

### `05_admin_platform/`

Internal admin platform and CMS.

Use for:
- Website CMS;
- admin dashboard;
- CMS content models;
- media library;
- SEO/GEO admin tools;
- AI knowledge configuration;
- admin governance.

### `06_crm/`

CRM and operational request management.

Use for:
- cases and request lifecycle;
- customers and contacts;
- operator workflow;
- statuses;
- internal comments/messages;
- attachments;
- external CRM integration.

### `07_content_ai_seo/`

Content, SEO, GEO, and AI visibility rules.

Use for:
- copy system;
- troubleshooting content;
- SEO/GEO strategy.
- AI visibility in assistants and answer engines.

Technical AI chat/assistant implementation belongs in `08_ai_assistant/` and `09_engineering/`.

### `08_ai_assistant/`

AI assistant product behavior and implementation scope.

Use for:
- AI intake;
- chat behavior;
- safety boundaries;
- handoff to operator;
- knowledge context usage;
- chat persistence.

### `09_engineering/`

Technical architecture and implementation standards.

Use for:
- stack decisions;
- database and Prisma;
- API architecture;
- coding standards;
- service/module structure;
- migrations;
- test strategy.

### `10_security_privacy/`

Security, privacy, compliance, and risk controls.

Use for:
- auth;
- RBAC/permissions;
- CSRF;
- rate limiting;
- audit logs;
- GDPR/privacy;
- upload security.

### `11_operations/`

Operations, deployment, analytics, maintenance, and business operations.

Use for:
- deployment;
- monitoring;
- backups;
- analytics;
- partner operations;
- incident handling.

### `12_agent_rules/`

Global rules and context for AI agents and developers.

Use for:
- agent global rules;
- coding rules;
- security rules for agents;
- documentation workflow;
- review checklists.

Local prompts should stay inside the relevant product folder. This folder is for shared rules across the project.

### `13_references_archive/`

References, historical handoffs, and documents that should not be used as live implementation instructions.

Use for:
- official references;
- historical handoff files;
- deprecated plans;
- archived prompt packs.

## Current Migration Status

The current document migration into the new folder structure is complete.

Migrated source folders:

- `02_ux_ui/` -> `02_public_website/` and `03_design_system/`
- `03_tech_architecture/` -> `04_client_portal/`, `06_crm/`, `08_ai_assistant/`, `09_engineering/`, `10_security_privacy/`, and `13_references_archive/`
- `04_content_and_ai/` -> `07_content_ai_seo/` and `08_ai_assistant/`
- `05_security_and_privacy/` -> `10_security_privacy/`
- `06_operations/` -> `11_operations/`
- `07_admin_platform/` -> `05_admin_platform/`, `06_crm/`, `10_security_privacy/`, `12_agent_rules/`, and `13_references_archive/`

The old source folders have been removed after their documents were moved or archived.

Next documentation work should focus on refining documents inside the new folders, updating internal links, and extracting reusable rules from archived prompt packs into `12_agent_rules/`.

## Product Anchor

PixelRing Reparatur is an AI-first, multilingual, one-stop service platform for sign repair, installation, light advertising, branding, and related services.

It is not a marketplace, contractor directory, or "find a master" platform. The product must communicate one accountable service company with AI-assisted intake and human-led execution.
