# Project State And Roadmap

## Status

This document is the main current-state map for PixelRing Reparatur.

It separates what is implemented now, what is started but incomplete, what is planned next, what belongs to the future platform, and which documents must not be treated as current implementation guidance.

Use this file before starting broad product, documentation, CRM, CMS, AI assistant, client portal, or security work.

## Current Product State

PixelRing Reparatur is an AI-first, multilingual, one-stop service platform for sign repair, installation, light advertising, branding, and related service requests.

The product must not behave like a marketplace, contractor directory, listing platform, or "find a master" product.

The intended product perception is:

- one accountable service company;
- one entry point for customer requests;
- AI-assisted intake to reduce friction;
- human specialist handoff for real service execution;
- internal operational control through CRM, CMS, and admin tools.

Current implementation is best described as:

- public multilingual website with request intake and status lookup;
- internal CRM starter for request/case operations;
- internal CMS/admin platform starter for content, media, SEO, and AI configuration;
- persisted AI chat and knowledge-backed assistant starter;
- security and audit starter;
- not yet a full customer portal or full business operations platform.

## Product Rules

Confirmed rules:

- The public website must not imply a marketplace model.
- The first conversion goal is starting a request.
- The MVP must prioritize trust, intake, human handoff, and request management.
- The MVP supports six languages: DE, EN, RU, TR, PL, AR.
- German is treated as the canonical-first language.
- AI helps collect and structure the request, but service execution is human-led.
- Customer-facing tracking must not expose raw CRM internals.
- Public request numbers must be non-sequential and human-readable.
- Request number alone must never expose private request data.

## Implemented Now

### Public Website

Implemented:

- Next.js App Router project structure under `signage-service/src/app/`.
- Localized public routes.
- Public home route.
- Public support routes:
  - `/support`
  - `/support/[slug]`
- Public status route:
  - `/status`
- Contact/request intake API:
  - `/api/contact`
- Status lookup API:
  - `/api/status`
- Contact form with optional image attachment.
- Public request number generation and lookup.
- Safe fallback content from `messages/*.json`.

Partially integrated with CMS:

- published CMS support articles can power `/support` and `/support/[slug]`;
- published CMS page content can override the `/status` hero starter block;
- broad public page CMS integration is not complete.

### Request And Status Flow

Implemented:

- Prisma request/case model.
- Public request number logic.
- Case sessions.
- Customer messages.
- Attachments.
- Customer profile starter for linking related requests by contact data.
- Status lookup by active session or by request number plus contact proof.
- Internal status history.

Current canonical implementation status model is the Prisma `CaseStatus` enum.

Generic "lead" statuses in older architecture documents are product vocabulary and future intake/routing guidance, not the current code-level status source of truth.

### Manager CRM

Current route:

- `/ring-manager-crm`

Implemented:

- CRM protected route.
- CRM dashboard/list starter.
- CRM case detail view.
- Manual case creation.
- Case status changes.
- Assigned operator starter field.
- Customer-visible operator replies.
- Internal note starter flow.
- Operator takeover for AI/chat handoff.
- Case status history.
- Admin audit log starter.
- Related request lookup through `CustomerProfile`.
- Separate CRM access using `MANAGER` role and CRM key.

Known implementation shape:

- `/ring-manager-crm` is an internal UI over the application database.
- The application database owns public request numbers and customer-facing request/status data.
- Bitrix24 is a future optional integration layer, not the current source of truth.

### Website CMS And Admin Platform

Current route:

- `/ring-master-config`

Implemented:

- CMS protected route.
- CMS dashboard shell.
- CMS AI config screen.
- CMS Articles screen and API.
- CMS Page Content starter screen and API.
- CMS Media Library MVP.
- CMS SEO config API and screen.
- CMS knowledge-base read route.
- Separate CMS access using `OWNER` role and CMS key.
- Persistent admin audit logs for CMS mutations.

Implemented API areas:

- `/api/cms/articles`
- `/api/cms/articles/[id]`
- `/api/cms/pages`
- `/api/cms/pages/[id]`
- `/api/cms/media`
- `/api/cms/media/[id]`
- `/api/cms/seo`
- `/api/cms/ai`
- `/api/cms/knowledge-base`

Current CMS data models:

- `CmsArticle`
- `CmsPage`
- `CmsMedia`
- `CmsSeoConfig`
- `AiConfig`

### AI Assistant And Knowledge Base

Implemented:

- AI chat API:
  - `/api/chat/messages`
- Persisted chat sessions/messages.
- AI chat engine.
- System prompt builder.
- Safety filter.
- Markdown knowledge base under `signage-service/knowledge_base/`.
- Published CMS articles appended to AI prompt context.
- Operator takeover flag so AI can stop autonomous replies when a human takes over.
- Frontend chat modal starter.

Current provider status:

- Code includes OpenAI Chat Completions integration with fallback behavior.
- Older documents mention conflicting provider assumptions. Treat the current code and environment configuration as the source of truth.

### Security, Privacy, And Audit Starter

Implemented:

- Separate CRM and CMS master keys.
- HTTP-only admin cookies.
- Token hashing for admin sessions.
- `AdminRole` starter enum with `MANAGER` and `OWNER`.
- Route-level admin role checks.
- CSRF header/origin starter guard for admin mutations.
- In-memory rate limiting for current single-instance flows.
- Persistent admin audit logs.
- Static admin security verification script.
- Attachment download access checks for CRM/admin paths.

Important constraint:

- This is a starter security baseline, not a full production security/compliance implementation.

## Started / Partial

### Page Content CMS

Started:

- `CmsPage` model.
- JSON block content storage.
- Admin UI starter.
- API for `home`, `support`, `status`, and `global` page keys.
- Fallback rule to static/i18n content.

Still incomplete:

- broad public page integration;
- structured per-block editing forms;
- preview/versioning/publishing workflow;
- content workflow governance;
- full multilingual page governance.

### Media And Attachments

Started:

- CMS media library MVP.
- Request attachments.
- Contact-form image upload.
- CRM/admin attachment access.
- media metadata and soft-delete starter patterns.

Still incomplete:

- upload scanning/quarantine;
- private object storage strategy;
- advanced file access policy;
- image optimization pipeline;
- structured customer-facing photo report module.

### CRM Operations

Started:

- case list/detail;
- status change;
- operator replies;
- internal notes;
- operator takeover;
- audit trail;
- customer profile starter;
- assignment as plain field.

Still incomplete:

- full operational hardening;
- specialist assignment model;
- SLA and escalation workflows;
- object-level authorization test coverage;
- richer customer/contact management;
- structured operations dashboards.

### AI Assistant

Started:

- persisted chat;
- safety filter;
- system prompt;
- markdown knowledge base;
- CMS article context;
- operator takeover.

Still incomplete:

- complete AI assistant product blueprint;
- model/provider decision cleanup in docs;
- full evaluation and regression test strategy;
- robust handoff playbooks;
- production-grade prompt/version governance.

### Security And Privacy

Started:

- role split between CRM manager and CMS owner;
- CSRF starter;
- rate-limit starter;
- audit log starter;
- upload restrictions and admin access checks.

Still incomplete:

- named admin users;
- MFA;
- full RBAC matrix;
- object-level policy model;
- distributed rate limiting;
- retention/deletion/export workflows;
- production incident response process;
- advanced upload scanning and quarantine.

## Planned Next

Recommended near-term priorities:

1. Stabilize CRM/CMS/security before adding large new product areas.
2. Finish CRM hardening:
   - object-level authorization checks;
   - route/integration tests;
   - audit coverage review;
   - attachment access review.
3. Continue Page Content CMS:
   - structured block forms;
   - public page integration;
   - preview/versioning decision.
4. Clean up AI documentation:
   - current implementation snapshot;
   - provider decision;
   - safety and handoff boundaries.
5. Define customer portal identity before implementation:
   - individual vs organization accounts;
   - employees/member roles;
   - recovery model;
   - visible request data rules.
6. Define security baseline before production:
   - admin identity model;
   - RBAC;
   - MFA;
   - retention/export/deletion;
   - distributed rate limiting.

## Future Platform

The following areas are planned or discussed, but are not implemented as complete modules.

### Full Client Portal

Future scope:

- verified customer login;
- multi-request dashboard;
- customer-safe request history;
- customer-visible messages/files;
- diagnosis and service history;
- photo/video reports;
- warranties;
- downloadable customer-visible documents.

Not implemented now:

- portal routes;
- customer account model;
- customer login/signup flow;
- email magic link or OTP flow;
- customer-facing dashboard;
- organization/member access model.

### Organizations And Employees

Future/open scope:

- customer organizations;
- customer employees/members;
- account roles;
- portal RBAC;
- business account management.

Not implemented now:

- `Organization` model;
- membership model;
- employee/member model;
- portal role assignments.

### Billing, Invoices, Payments

Future/open scope:

- quotes;
- invoices;
- payment tracking;
- downloadable accounting documents;
- external accounting/payment integration.

Not implemented now:

- invoice model;
- payment model;
- quote model;
- payment provider integration;
- billing UI.

### Photo Reports And Warranties

Future/open scope:

- structured photo reports;
- customer-visible service reports;
- warranty documents;
- warranty claims;
- warranty file access.

Not implemented now:

- `PhotoReport` model;
- `Warranty` model;
- customer-facing report route;
- structured warranty workflow.

### Bitrix24 CRM Integration

Future/deferred scope:

- Bitrix24 lead/case sync;
- webhook handling;
- sync logs;
- failure visibility;
- fallback mode when Bitrix is unavailable.

Current code status:

- `Case` has `crmLeadId` and `crmCaseId` fields.
- No Bitrix24 API client, routes, jobs, webhooks, or sync logs are implemented.

## Open Decisions

### Product And Launch Scope

- What is the exact launch MVP now: public website only, public website plus CRM/CMS, or public website plus limited status tracking?
- Which public pages must be CMS-managed before launch?
- Should partner/master-facing functionality remain public content only or become an internal/portal feature later?

### Client Portal

- Should the first portal phase support individual customers only, or organizations with employees?
- Should employees have roles from day one?
- Should the first verified login method be email magic link?
- Should phone/SMS verification wait until provider/legal decisions are made?
- Which customer-visible files are allowed in the first portal version?

### Billing And Warranty

- Which billing features are required first: quotes, invoices, payments, PDFs, or external accounting integration?
- Should warranties be public copy only, customer-visible documents, or a structured warranty claim workflow?
- Should photo reports be manually uploaded by admins/operators first, or generated from an operational workflow?

### Admin, CRM, And Security

- Should CMS and CRM share one future RBAC system or remain separated by tool?
- Should admin auth move from master keys to named admin users?
- Which admin actions require approval, audit, soft delete, or recovery?
- What is the required object-level authorization policy?

### Engineering And Operations

- What is the intended production hosting model?
- Which database environment is production source of truth?
- Which test level is required before release: static checks, route tests, integration tests, browser E2E?
- What is the backup, monitoring, and incident response baseline?
- What analytics events and dashboards are required before launch?

### Documentation

- Should each domain folder get a short current-state overview document?
- Should phase numbers be replaced by domain-specific roadmap IDs to avoid conflicts?
- Should docs remain bilingual, or should each folder have one language policy?

## Source Documents

### Current / Active Sources

Use these as current or active planning sources:

- `docs/README.md`
- `docs/00_project_overview/documentation_structure_plan.md`
- `docs/00_project_overview/document_migration_matrix.md`
- `docs/01_strategy/master_brief.md`
- `docs/01_strategy/mvp_roadmap.md`
- `docs/02_public_website/information_architecture.md`
- `docs/02_public_website/user_journey_flows.md`
- `docs/05_admin_platform/admin_implementation_phases.md`
- `docs/05_admin_platform/cms_site_management.md`
- `docs/05_admin_platform/page_content_cms_plan.md`
- `docs/06_crm/crm_requests_and_clients.md`
- `docs/07_content_ai_seo/copy_system.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/troubleshooting_content_plan.md`
- `docs/08_ai_assistant/ai_conversation_design.md`
- `docs/10_security_privacy/admin_security_and_governance.md`
- `docs/10_security_privacy/privacy_consent.md`
- `docs/10_security_privacy/security_checklist.md`
- `docs/10_security_privacy/security_guardrails.md`
- `docs/11_operations/marketing_analytics.md`
- `docs/11_operations/partner_operations.md`
- `docs/12_agent_rules/cms_blueprint_protocol_ru.md`

### Active Future Sources

Use these as future planning sources, not as proof that the features exist now:

- `docs/04_client_portal/full_customer_portal_plan.md`
- `docs/04_client_portal/request_tracking_and_customer_portal_architecture.md`
- `docs/06_crm/bitrix24_crm_integration_plan.md`
- `docs/09_engineering/architecture_and_integrations.md`
- `docs/10_security_privacy/security_compliance_operations_plan.md`

Important:

- `request_tracking_and_customer_portal_architecture.md` is useful architecture guidance, but some current-baseline statements are stale.
- `architecture_and_integrations.md` is useful high-level vision, not implementation truth.
- `security_compliance_operations_plan.md` is useful hardening scope, but its phase numbering conflicts with admin implementation phases.

## Do Not Treat As Current

Documents in `docs/13_references_archive/` are reference material only unless a current document explicitly marks a specific part as active.

Do not use these as current roadmap or implementation instructions:

- `docs/13_references_archive/old_consolidated_super_prompts.md`
- `docs/13_references_archive/old_antigravity_prompt_pack.md`
- `docs/13_references_archive/old_request_tracking_implementation_blueprint.md`
- `docs/13_references_archive/old_admin_platform_readme.md`
- `docs/13_references_archive/historical_phase_1_website_foundation.md`
- `docs/13_references_archive/historical_phase_2_crm_and_external_channels.md`
- `docs/13_references_archive/historical_phase_2c_cms_crm_split.md`
- `docs/13_references_archive/phase2_seo_handoff_for_new_agent.md`
- `docs/13_references_archive/admin_platform_references.md`

Useful rules may later be extracted from archived prompt packs into `docs/12_agent_rules/`, especially:

- anti-marketplace positioning;
- one-stop service identity;
- AI handoff rules;
- multilingual/mobile-first expectations;
- privacy and security guardrails;
- upload/media safety rules;
- analytics privacy rules.

Extraction should happen in a separate reviewed step, not silently through this roadmap.

## Documentation Ownership

Suggested ownership model:

- `00_project_overview/`: project owner + technical lead.
- `01_strategy/`: project owner.
- `02_public_website/`: product + UX.
- `03_design_system/`: design + frontend.
- `04_client_portal/`: product + architecture.
- `05_admin_platform/`: product + backend/frontend.
- `06_crm/`: operations + backend/frontend.
- `07_content_ai_seo/`: content + SEO + GEO + AI visibility.
- `08_ai_assistant/`: product + AI + backend/frontend.
- `09_engineering/`: technical lead.
- `10_security_privacy/`: technical lead + compliance owner.
- `11_operations/`: operations + technical lead.
- `12_agent_rules/`: technical lead + AI workflow owner.
- `13_references_archive/`: documentation maintainer.
