# Documentation Structure Plan

## Surface Analysis

The current `docs` folder already contains useful material, but the concerns are mixed:

- `01_strategy/` already works as the business/product strategy area.
- `02_ux_ui/` mixed public website UX and design-prompt material. Its documents have been moved to `02_public_website/` and `03_design_system/`, and the empty folder has been removed.
- `03_tech_architecture/` mixed engineering architecture, implementation orchestration, CRM/request tracking, and customer portal planning. Its documents have been moved or archived, and the empty folder has been removed.
- `04_content_and_ai/` was mostly content, AI, troubleshooting, SEO, and GEO. Its documents have been moved to `07_content_ai_seo/` and `08_ai_assistant/`, and the empty folder has been removed.
- `05_security_and_privacy/` was security and privacy. Its documents have been moved to `10_security_privacy/`, and the empty folder has been removed.
- `06_operations/` was operational/business operations. Its documents have been moved to `11_operations/`, and the empty folder has been removed.
- `07_admin_platform/` was admin/CMS/CRM documentation with implementation status and gaps. Its documents have been moved or archived, and the empty folder has been removed.

There is no single current-state document yet that combines:
- product structure;
- implemented modules;
- started but incomplete modules;
- future ideas;
- roadmap across public website, CMS, CRM, and customer portal.

## Target Structure

The target structure is:

- `00_project_overview/`
- `01_strategy/`
- `02_public_website/`
- `03_design_system/`
- `04_client_portal/`
- `05_admin_platform/`
- `06_crm/`
- `07_content_ai_seo/`
- `08_ai_assistant/`
- `09_engineering/`
- `10_security_privacy/`
- `11_operations/`
- `12_agent_rules/`
- `13_references_archive/`

## Completed Migration Map

Source documents were moved only after each migration step was reviewed and confirmed.

Completed moves:

- `docs/01_strategy/master_brief.md` -> keep in `01_strategy/`
- `docs/01_strategy/mvp_roadmap.md` -> keep in `01_strategy/`
- `docs/02_ux_ui/information_architecture.md` -> `02_public_website/` DONE
- `docs/02_ux_ui/user_journey_flows.md` -> `02_public_website/` DONE
- `docs/02_ux_ui/design_prompts_stitch.md` -> `03_design_system/` DONE
- `docs/03_tech_architecture/architecture_and_integrations.md` -> `09_engineering/` DONE.
- `docs/03_tech_architecture/consolidated_prompts.md` -> `13_references_archive/` DONE. Extract useful rules later into `12_agent_rules/`.
- `docs/03_tech_architecture/prompt_pack_antigravity.md` -> `13_references_archive/` DONE. Extract useful rules later into `12_agent_rules/` and `09_engineering/`.
- `docs/03_tech_architecture/implementation_blueprint.md` -> `13_references_archive/` DONE.
- `docs/03_tech_architecture/request_tracking_and_customer_portal.md` -> `04_client_portal/` DONE. Split later between client portal, CRM, security, and engineering docs.
- `docs/03_tech_architecture/request_tracking_phases/phase_2c_cms_and_crm_split.md` -> `13_references_archive/` DONE.
- `docs/03_tech_architecture/request_tracking_phases/phase_3_full_customer_portal.md` -> `04_client_portal/` DONE.
- `docs/03_tech_architecture/request_tracking_phases/phase_4_security_compliance_and_operations.md` -> `10_security_privacy/` DONE.
- `docs/03_tech_architecture/request_tracking_phases/phase_5_bitrix24_crm_integration.md` -> `06_crm/` DONE.
- AI assistant behavior and chat implementation docs from `docs/04_content_and_ai/*` or `docs/03_tech_architecture/*` -> `08_ai_assistant/`. Content docs from `docs/04_content_and_ai/` are DONE. Historical Phase 2B AI chat plan is DONE.
- SEO, GEO, AI visibility, troubleshooting, and copy docs from `docs/04_content_and_ai/*` -> `07_content_ai_seo/`. Content docs from `docs/04_content_and_ai/` are DONE.
- `docs/05_security_and_privacy/*` -> `10_security_privacy/` DONE.
- `docs/06_operations/*` -> `11_operations/` DONE.
- `docs/07_admin_platform/01_cms_site_management.md` -> `05_admin_platform/` DONE.
- `docs/07_admin_platform/02_crm_requests_and_clients.md` -> `06_crm/` DONE.
- `docs/07_admin_platform/03_security_and_governance.md` -> `10_security_privacy/` DONE.
- `docs/07_admin_platform/04_implementation_phases.md` -> `05_admin_platform/` DONE.
- `docs/07_admin_platform/05_references.md` -> `13_references_archive/` DONE.
- `docs/07_admin_platform/06_phase2_seo_handoff_for_new_agent.md` -> `13_references_archive/` DONE.
- `docs/07_admin_platform/07_phase3_page_content_cms_plan.md` -> `05_admin_platform/` DONE.
- `docs/07_admin_platform/master_document_cms_blueprint_ru.md` -> `12_agent_rules/` DONE.

## Folder Boundary Decisions

- `07_content_ai_seo/` includes copy, SEO, GEO, knowledge strategy, troubleshooting content, and AI visibility in answer engines.
- `08_ai_assistant/` includes the AI assistant itself: intake behavior, chat flows, safety boundaries, operator handoff, persistence, and implementation scope.
- Local prompts should live in their relevant domain folders.
- Global rules for agents and developers should live in `12_agent_rules/`.

## Next Documentation Work

The source-folder migration is complete. Next work should focus on:

1. Updating stale internal links inside moved documents.
2. Splitting mixed documents into sharper domain documents where needed.
3. Extracting reusable rules from archived prompt packs into `12_agent_rules/`.
4. Turning `00_project_overview/project_state_and_roadmap.md` into the main current-state document after owner review.
5. Creating the planned base documents listed in each folder README only after their scope is confirmed.
