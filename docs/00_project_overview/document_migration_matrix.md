# Document Migration Matrix

## Status

Completed migration map.

All current Markdown documents are assigned to the new folder structure. Use this matrix as a migration log and as a reference before splitting, rewriting, or archiving documents further.

## Action Legend

- `keep` - keep in the current folder.
- `move` - move the document to a new folder later.
- `split` - split the document into multiple new documents later.
- `archive` - move to archive later; do not use as active implementation guidance.
- `review` - inspect for freshness before deciding.

## Matrix

| Current path | Target folder | Action | Status | Notes |
|---|---|---:|---|---|
| `docs/README.md` | `docs/README.md` | keep | Updated | Root documentation index. |
| `docs/00_project_overview/README.md` | `00_project_overview/` | keep | New | Overview folder index. |
| `docs/00_project_overview/documentation_structure_plan.md` | `00_project_overview/` | keep | New | Target folder structure and migration plan. |
| `docs/00_project_overview/document_migration_matrix.md` | `00_project_overview/` | keep | New | Per-file migration decision matrix. |
| `docs/00_project_overview/project_state_and_roadmap.md` | `00_project_overview/` | keep | New draft | Current-state map assembled from existing docs. Needs owner review. |
| `docs/01_strategy/master_brief.md` | `01_strategy/` | keep | Existing | Main strategy and product positioning. |
| `docs/01_strategy/mvp_roadmap.md` | `01_strategy/` | keep | Existing | MVP scope, launch roadmap, and backlog logic. |
| `docs/02_public_website/README.md` | `02_public_website/` | keep | New | Public website folder index. |
| `docs/02_public_website/information_architecture.md` | `02_public_website/` | keep | Done | Moved from `docs/02_ux_ui/information_architecture.md`. Public website IA, page map, CTA logic, multilingual website requirements. |
| `docs/02_public_website/user_journey_flows.md` | `02_public_website/` | keep | Done | Moved from `docs/02_ux_ui/user_journey_flows.md`. Public visitor flows and request journeys. |
| `docs/03_design_system/design_prompts_stitch.md` | `03_design_system/` | keep | Done | Moved from `docs/02_ux_ui/design_prompts_stitch.md`. Design-generation prompts belong with design system. |
| `docs/03_design_system/README.md` | `03_design_system/` | keep | New | Design system folder index. |
| `docs/09_engineering/architecture_and_integrations.md` | `09_engineering/` | keep | Done | Moved from `docs/03_tech_architecture/architecture_and_integrations.md`. Active high-level architecture document; partly implemented, partly target architecture. |
| `docs/13_references_archive/old_consolidated_super_prompts.md` | `13_references_archive/` | keep | Done | Moved from `docs/03_tech_architecture/consolidated_prompts.md`. Historical prompt pack; extract still-valid rules later into `12_agent_rules/`. |
| `docs/13_references_archive/old_antigravity_prompt_pack.md` | `13_references_archive/` | keep | Done | Moved from `docs/03_tech_architecture/prompt_pack_antigravity.md`. Historical prompt pack; extract still-valid implementation rules later into `12_agent_rules/` and `09_engineering/`. |
| `docs/13_references_archive/old_request_tracking_implementation_blueprint.md` | `13_references_archive/` | keep | Done | Moved from `docs/03_tech_architecture/implementation_blueprint.md`. Archived stale orchestrator/status document; extract still-valid rules later into `12_agent_rules/`. |
| `docs/04_client_portal/request_tracking_and_customer_portal_architecture.md` | `04_client_portal/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_and_customer_portal.md`. Mixed active architecture for request tracking and future customer portal; contains stale baseline and should later be split across client portal, CRM, security, and engineering docs. |
| `docs/13_references_archive/historical_phase_1_website_foundation.md` | `13_references_archive/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_phases/phase_1_website_foundation.md`. Historical closed website foundation phase; use as reference only. |
| `docs/13_references_archive/historical_phase_2_crm_and_external_channels.md` | `13_references_archive/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_phases/phase_2_crm_and_external_channels.md`. Historical/partially stale; current CRM docs live in `06_crm/`. |
| `docs/08_ai_assistant/historical_phase_2b_ai_chat_system.md` | `08_ai_assistant/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_phases/phase_2b_ai_chat_system.md`. Historical/partially stale AI chat phase plan; use only as reference. Create updated AI assistant blueprint later. |
| `docs/13_references_archive/historical_phase_2c_cms_crm_split.md` | `13_references_archive/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_phases/phase_2c_cms_and_crm_split.md`. Historical/partially stale CRM/CMS split decision; use as reference only. |
| `docs/04_client_portal/full_customer_portal_plan.md` | `04_client_portal/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_phases/phase_3_full_customer_portal.md`. Future customer portal plan. |
| `docs/10_security_privacy/security_compliance_operations_plan.md` | `10_security_privacy/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_phases/phase_4_security_compliance_and_operations.md`. Active security/compliance hardening plan; operations checklist can be extracted later. |
| `docs/06_crm/bitrix24_crm_integration_plan.md` | `06_crm/` | keep | Done | Moved from `docs/03_tech_architecture/request_tracking_phases/phase_5_bitrix24_crm_integration.md`. Planned/deferred Bitrix24 CRM integration. |
| `docs/04_client_portal/README.md` | `04_client_portal/` | keep | New | Client portal folder index. |
| `docs/07_content_ai_seo/copy_system.md` | `07_content_ai_seo/` | keep | Done | Moved from `docs/04_content_and_ai/copy_system.md`. Copy and content rules. |
| `docs/08_ai_assistant/ai_conversation_design.md` | `08_ai_assistant/` | keep | Done | Moved from `docs/04_content_and_ai/ai_conversation_design.md`. AI assistant conversation behavior. |
| `docs/07_content_ai_seo/geo_optimization_strategy.md` | `07_content_ai_seo/` | keep | Done | Moved from `docs/04_content_and_ai/geo_optimization_strategy.md`. GEO/AI visibility strategy. |
| `docs/07_content_ai_seo/troubleshooting_content_plan.md` | `07_content_ai_seo/` | keep | Done | Moved from `docs/04_content_and_ai/troubleshooting_content_plan.md`. Troubleshooting content strategy. |
| `docs/07_content_ai_seo/troubleshooting_page_template.md` | `07_content_ai_seo/` | keep | Done | Moved from `docs/04_content_and_ai/troubleshooting_page_template.md`. Troubleshooting page template. |
| `docs/05_admin_platform/README.md` | `05_admin_platform/` | keep | New | Admin platform target folder index. |
| `docs/10_security_privacy/privacy_consent.md` | `10_security_privacy/` | keep | Done | Moved from `docs/05_security_and_privacy/privacy_consent.md`. Privacy and consent. |
| `docs/10_security_privacy/security_checklist.md` | `10_security_privacy/` | keep | Done | Moved from `docs/05_security_and_privacy/security_checklist.md`. Security checklist. |
| `docs/10_security_privacy/security_guardrails.md` | `10_security_privacy/` | keep | Done | Moved from `docs/05_security_and_privacy/security_guardrails.md`. Security guardrails. |
| `docs/06_crm/README.md` | `06_crm/` | keep | New | CRM target folder index. |
| `docs/11_operations/marketing_analytics.md` | `11_operations/` | keep | Done | Moved from `docs/06_operations/marketing_analytics.md`. Post-launch analytics, dashboards, attribution, research, and KPI framework. |
| `docs/11_operations/partner_operations.md` | `11_operations/` | keep | Done | Moved from `docs/06_operations/partner_operations.md`. Partner operations and internal service delivery model. |
| `docs/13_references_archive/old_admin_platform_readme.md` | `13_references_archive/` | keep | Done | Moved from `docs/07_admin_platform/README.md`. Archived old admin-platform index; useful baseline but old links are no longer authoritative. |
| `docs/05_admin_platform/cms_site_management.md` | `05_admin_platform/` | keep | Done | Moved from `docs/07_admin_platform/01_cms_site_management.md`. CMS site management. |
| `docs/06_crm/crm_requests_and_clients.md` | `06_crm/` | keep | Done | Moved from `docs/07_admin_platform/02_crm_requests_and_clients.md`. CRM requests and clients. |
| `docs/10_security_privacy/admin_security_and_governance.md` | `10_security_privacy/` | keep | Done | Moved from `docs/07_admin_platform/03_security_and_governance.md`. Admin-specific security and governance; should be referenced from admin/CRM docs later. |
| `docs/05_admin_platform/admin_implementation_phases.md` | `05_admin_platform/` | keep | Done | Moved from `docs/07_admin_platform/04_implementation_phases.md`. Live admin-platform roadmap; later split/sync CRM and security phases with `06_crm/` and `10_security_privacy/`. |
| `docs/13_references_archive/admin_platform_references.md` | `13_references_archive/` | keep | Done | Moved from `docs/07_admin_platform/05_references.md`. Reference list; internal links need future refresh. |
| `docs/13_references_archive/phase2_seo_handoff_for_new_agent.md` | `13_references_archive/` | keep | Done | Moved from `docs/07_admin_platform/06_phase2_seo_handoff_for_new_agent.md`. Historical handoff; docs say Phase 2 SEO is already implemented. |
| `docs/05_admin_platform/page_content_cms_plan.md` | `05_admin_platform/` | keep | Done | Moved from `docs/07_admin_platform/07_phase3_page_content_cms_plan.md`. Page Content CMS plan/current notes. |
| `docs/12_agent_rules/cms_blueprint_protocol_ru.md` | `12_agent_rules/` | keep | Done | Moved from `docs/07_admin_platform/master_document_cms_blueprint_ru.md`. CMS discovery protocol for AI agents. |
| `docs/07_content_ai_seo/README.md` | `07_content_ai_seo/` | keep | New | Content, SEO, GEO, and AI visibility folder index. |
| `docs/08_ai_assistant/README.md` | `08_ai_assistant/` | keep | New | AI assistant folder index. |
| `docs/09_engineering/README.md` | `09_engineering/` | keep | New | Engineering folder index. |
| `docs/10_security_privacy/README.md` | `10_security_privacy/` | keep | New | Security and privacy folder index. |
| `docs/11_operations/README.md` | `11_operations/` | keep | New | Operations folder index. |
| `docs/12_agent_rules/README.md` | `12_agent_rules/` | keep | New | Agent rules folder index. |
| `docs/13_references_archive/README.md` | `13_references_archive/` | keep | New | References and archive folder index. |

## Completed Migration Batch 1

Completed low-risk first batch:

1. Moved `docs/02_ux_ui/design_prompts_stitch.md` to `docs/03_design_system/design_prompts_stitch.md`.
2. Moved `docs/02_ux_ui/information_architecture.md` to `docs/02_public_website/information_architecture.md`.
3. Moved `docs/02_ux_ui/user_journey_flows.md` to `docs/02_public_website/user_journey_flows.md`.

Reason:

- These documents have clear target folders.
- They are not current code-status documents.
- They are unlikely to conflict with active admin implementation notes.

## Completed Migration Batch 2

Completed content and AI split:

1. Moved `docs/04_content_and_ai/copy_system.md` to `docs/07_content_ai_seo/copy_system.md`.
2. Moved `docs/04_content_and_ai/geo_optimization_strategy.md` to `docs/07_content_ai_seo/geo_optimization_strategy.md`.
3. Moved `docs/04_content_and_ai/troubleshooting_content_plan.md` to `docs/07_content_ai_seo/troubleshooting_content_plan.md`.
4. Moved `docs/04_content_and_ai/troubleshooting_page_template.md` to `docs/07_content_ai_seo/troubleshooting_page_template.md`.
5. Moved `docs/04_content_and_ai/ai_conversation_design.md` to `docs/08_ai_assistant/ai_conversation_design.md`.

Reason:

- SEO, GEO, copy, and troubleshooting content belong together in `07_content_ai_seo/`.
- AI assistant conversation behavior belongs in `08_ai_assistant/`.

## Completed Migration Batch 3

Completed security and privacy move:

1. Moved `docs/05_security_and_privacy/privacy_consent.md` to `docs/10_security_privacy/privacy_consent.md`.
2. Moved `docs/05_security_and_privacy/security_checklist.md` to `docs/10_security_privacy/security_checklist.md`.
3. Moved `docs/05_security_and_privacy/security_guardrails.md` to `docs/10_security_privacy/security_guardrails.md`.

Reason:

- These documents define project-wide security, privacy, consent, and agent guardrails.

## Completed Migration Batch 4

Completed operations move:

1. Moved `docs/06_operations/marketing_analytics.md` to `docs/11_operations/marketing_analytics.md`.
2. Moved `docs/06_operations/partner_operations.md` to `docs/11_operations/partner_operations.md`.

Reason:

- Both documents describe post-launch measurement, operating model, partner coordination, dashboards, and service delivery operations.

## Completed Migration Batch 5

Completed first admin-platform split:

1. Moved `docs/07_admin_platform/02_crm_requests_and_clients.md` to `docs/06_crm/crm_requests_and_clients.md`.

Reason:

- The document is CRM-specific and current code confirms CRM routes, case lifecycle, status flow, messages, attachments, and customer profile foundations.

## Completed Migration Batch 6

Completed historical handoff archive:

1. Moved `docs/07_admin_platform/06_phase2_seo_handoff_for_new_agent.md` to `docs/13_references_archive/phase2_seo_handoff_for_new_agent.md`.

Reason:

- The document is explicitly historical and Phase 2 SEO is already implemented according to current admin documentation.

## Completed Migration Batch 7

Completed admin security move:

1. Moved `docs/07_admin_platform/03_security_and_governance.md` to `docs/10_security_privacy/admin_security_and_governance.md`.

Reason:

- The document is live but security-specific: admin auth, access control, sessions, audit logs, destructive actions, upload security, and route hardening.

## Completed Migration Batch 8

Completed Page Content CMS move:

1. Moved `docs/07_admin_platform/07_phase3_page_content_cms_plan.md` to `docs/05_admin_platform/page_content_cms_plan.md`.

Reason:

- The document is specific to the Website CMS page-content module.

## Completed Migration Batch 9

Completed CMS blueprint protocol move:

1. Moved `docs/07_admin_platform/master_document_cms_blueprint_ru.md` to `docs/12_agent_rules/cms_blueprint_protocol_ru.md`.

Reason:

- The document is an AI-agent discovery and blueprint protocol, not a live state document.

## Completed Migration Batch 10

Completed admin references archive:

1. Moved `docs/07_admin_platform/05_references.md` to `docs/13_references_archive/admin_platform_references.md`.

Reason:

- The document is a reference list, not a live implementation spec. Some internal links are stale after migration and need future refresh.

## Completed Migration Batch 11

Completed CMS site management move:

1. Moved `docs/07_admin_platform/01_cms_site_management.md` to `docs/05_admin_platform/cms_site_management.md`.

Reason:

- The document is specific to the Website CMS and `/ring-master-config`.

## Completed Migration Batch 12

Completed admin implementation phases move:

1. Moved `docs/07_admin_platform/04_implementation_phases.md` to `docs/05_admin_platform/admin_implementation_phases.md`.

Reason:

- The document is a live roadmap for the admin platform. It should later be split or synchronized with CRM and security docs where needed.

## Completed Migration Batch 13

Completed old admin-platform README archive:

1. Moved `docs/07_admin_platform/README.md` to `docs/13_references_archive/old_admin_platform_readme.md`.

Reason:

- The old README is no longer the active folder index after document migration, but it contains useful baseline context.

## Completed Migration Batch 14

Completed historical prompt archive:

1. Moved `docs/03_tech_architecture/consolidated_prompts.md` to `docs/13_references_archive/old_consolidated_super_prompts.md`.
2. Moved `docs/03_tech_architecture/prompt_pack_antigravity.md` to `docs/13_references_archive/old_antigravity_prompt_pack.md`.

Reason:

- Both prompt files are outdated as active build instructions, but contain reusable product guardrails such as anti-marketplace positioning, one-stop service identity, multilingual/mobile-first expectations, AI handoff rules, and security/privacy review criteria.

## Completed Migration Batch 15

Completed future client portal plan move:

1. Moved `docs/03_tech_architecture/request_tracking_phases/phase_3_full_customer_portal.md` to `docs/04_client_portal/full_customer_portal_plan.md`.

Reason:

- The document describes a planned full customer portal with verified email and customer-visible request history.

## Completed Migration Batch 16

Completed Bitrix24 CRM integration plan move:

1. Moved `docs/03_tech_architecture/request_tracking_phases/phase_5_bitrix24_crm_integration.md` to `docs/06_crm/bitrix24_crm_integration_plan.md`.

Reason:

- The document describes a planned/deferred external CRM integration and belongs with CRM documentation.

## Completed Migration Batch 17

Completed historical AI chat phase move:

1. Moved `docs/03_tech_architecture/request_tracking_phases/phase_2b_ai_chat_system.md` to `docs/08_ai_assistant/historical_phase_2b_ai_chat_system.md`.

Reason:

- The document contains useful AI assistant requirements, but its implementation status is stale because the codebase already includes AI prompt, safety, chat engine, chat session, and `/api/chat/messages` files.

## Completed Migration Batch 18

Completed historical Phase 1 archive:

1. Moved `docs/03_tech_architecture/request_tracking_phases/phase_1_website_foundation.md` to `docs/13_references_archive/historical_phase_1_website_foundation.md`.

Reason:

- The document is explicitly closed as MVP-complete on `2026-04-05` and should be kept as reference history, not active implementation guidance.

## Completed Migration Batch 19

Completed historical Phase 2 CRM archive:

1. Moved `docs/03_tech_architecture/request_tracking_phases/phase_2_crm_and_external_channels.md` to `docs/13_references_archive/historical_phase_2_crm_and_external_channels.md`.

Reason:

- The document is closed and partially stale: it references old admin paths and older remaining work. Current CRM documentation lives in `06_crm/`.

## Completed Migration Batch 20

Completed historical Phase 2C CRM/CMS split archive:

1. Moved `docs/03_tech_architecture/request_tracking_phases/phase_2c_cms_and_crm_split.md` to `docs/13_references_archive/historical_phase_2c_cms_crm_split.md`.

Reason:

- The document is partially stale because the CRM/CMS split, auth separation, CMS models, articles, SEO, media, and AI context integration are already partly/mostly implemented.

## Completed Migration Batch 21

Completed Phase 4 security/compliance move:

1. Moved `docs/03_tech_architecture/request_tracking_phases/phase_4_security_compliance_and_operations.md` to `docs/10_security_privacy/security_compliance_operations_plan.md`.

Reason:

- The document is still useful as an active hardening plan. Current code already has basic roles, admin sessions, CSRF checks, and audit logging, but does not yet show completed RBAC matrix, specialist-limited access, MFA, retention automation, deletion/export workflows, or incident/recovery procedures.

## Completed Migration Batch 22

Completed technical architecture move:

1. Moved `docs/03_tech_architecture/architecture_and_integrations.md` to `docs/09_engineering/architecture_and_integrations.md`.

Reason:

- The document is an active high-level architecture map. It matches the current direction of the project, but several areas remain target architecture: routing/assignment engine, real WhatsApp/Telegram ingestion, voice intake, analytics events, SLA metrics, business accounts, and deeper consent/event logging.

## Completed Migration Batch 23

Completed request tracking/customer portal architecture move:

1. Moved `docs/03_tech_architecture/request_tracking_and_customer_portal.md` to `docs/04_client_portal/request_tracking_and_customer_portal_architecture.md`.

Reason:

- The document contains important product decisions for request tracking, public request number access, portal identity, client-facing status, and the future full customer cabinet. It also contains stale baseline notes and CRM/security/engineering material, so it should later be split after the current folder migration is complete.

## Completed Migration Batch 24

Completed old implementation blueprint archive:

1. Moved `docs/03_tech_architecture/implementation_blueprint.md` to `docs/13_references_archive/old_request_tracking_implementation_blueprint.md`.

Reason:

- The document's task statuses and source links are stale. It says Phase 2B is still critical next, but current code already includes the knowledge base, AI system prompt, safety filter, chat engine, `/api/chat/messages`, backend persistence, frontend chat integration, operator messages, and operator takeover. Keep it as historical reference only.

## Decisions Needed

1. Resolved: `implementation_blueprint.md` moved to archive as stale implementation/status history.
2. Resolved: admin security and compliance documents live under global `10_security_privacy/`; admin-specific implementation docs may reference them from `05_admin_platform/`.
3. Resolved: `master_document_cms_blueprint_ru.md` moved to `12_agent_rules/` as `cms_blueprint_protocol_ru.md`.
4. Resolved: old source folders were deleted after their documents were moved or archived.
5. Open: should a separate growth/analytics folder exist later, or is `11_operations/marketing_analytics.md` sufficient?
6. Open: which archived prompt-pack rules should be extracted into `12_agent_rules/` first?
