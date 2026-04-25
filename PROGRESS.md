# PROGRESS

Short global status only. Detailed session notes belong to folder-level `Progress Log` sections.

## Current Modules

- Admin Platform Foundation (Sprint 1A): complete; password-only named-user auth, fallback removed, CMS and CRM permissions enforced and documented
- Foundation (Block 1): implemented/closed
- Content Core (Block 2): complete; unified multi-locale editor with all 7 block types; field mapping for hero/cardList/cta audited and fixed. CMS Editor Stage 1 (Lists & Smart Sync): complete. CMS Content Scaling (Stage 2): complete. CMS Localization Workspace (Stage 3): complete — Split-View (DE/EN) parallel editor with synchronization and AI-assisted field translation.
- Admin Finalization Track (Stages 0-7): implemented to current accepted baseline for MVP use and paused by owner decision (2026-04-19). Completed baseline includes runtime + API smoke coverage (`npm run test:admin-runtime`, `npm run test:admin-e2e-smoke`), article lifecycle (`draft -> publish -> unpublish -> restore -> re-publish`), locale-safe translation save (new locale record create-path, immutable locale on update), and runtime media upload validation checks (`413/415/400`). Signed preview and scheduled publish/unpublish stay cancelled; `CmsPage` and home visual publication workflow remain deferred.
- CRM Hardening (Block 5/Sprint 5): complete; object-level authorization for Managers implemented across cases and attachments; audit logging verified.
- CRM Modernization (Sprint 1B): complete; case-detail chat scrolling restored and case open lands on latest message without forced re-scroll on later updates
- [x] Assets + Forms (Block 3): complete; multi-file photo/video upload, location picker, Vercel Blob integration, and CRM media gallery implemented
- [x] Legal Compliance (Germany/EU): complete; Impressum and Privacy Policy pages implemented with localized disclaimers and mandatory German content fallback; Footer links refined.
- [x] Legal Compliance (Germany/EU): update complete; footer legal links now limited to active pages (`Impressum`, `Datenschutzerklaerung`) with German labels across locales; legal notice banners localized per interface language while showing German legal content; baseline CMS legal texts expanded and structured, including technical-cookies section in Datenschutzerklaerung.
- [x] Redesign TrustSection with premium glassmorphism and dynamic stats.
- [x] Populate multi-lingual baseline content for all 6 locales (DE, EN, RU, TR, PL, AR).
- [x] Standardize CMS data structures (camelCase + Arrays for lists).
- [ ] Final visual QA of the TrustSection with seeded content.
- [ ] Proceed with GA/GTM and Cookie Consent implementation.
- [x] Homepage CoverageMap load smoothness: complete; removed redundant mount re-render and smoothed 3D rotation motion values to prevent initial visual jerk on section load.
- [x] Homepage CoverageMap static angle: complete; removed scroll-driven map rotation and fixed scene to settled isometric pose for stable rendering.
- [x] Homepage CoverageMap pixel layering: complete; removed depth pixel layer to prevent stacked/overlapped dot artifacts.
- Delivery + Integrations (Block 4): documented/approved
- Hardening + Release (Block 5): documented/approved
- [x] CMS Architecture Refinement: complete; 100% CMS-driven rendering implemented; conditional sections in `page.tsx` and total removal of legacy code-fallbacks for content fields. Single source of truth (CMS) established for the homepage. Admin UI enhanced with editable block keys and specific presets.
- [x] CMS Simple Publication Checklist: documented in strategy docs (`draft -> internal admin review -> publish` without preview/scheduling).
- [x] CMS Simple Publication Flow Manual Verification: complete; owner-run full cycle confirmed (`draft -> publish -> unpublish -> restore -> re-publish`) on admin and public surfaces.
- [x] CMS Publication Flow Automation: complete; article smoke test flow now explicitly includes `restore -> re-publish` and required reason on unpublish (`PUBLISHED -> DRAFT`).
- [x] CMS Articles UX Improvements (Today): complete; added explicit post-draft guidance and quick action (`Show drafts`) plus review-queue list view (`IN_REVIEW` + `APPROVED`).
- [x] CMS Media Upload Validation Hardening (Today): complete; strengthened file validation and API error-status mapping; added focused validation test script.
- [x] CMS Locale-Safe Translation Save: complete; when locale is changed from an existing article in editor, system now creates a new locale article instead of overwriting the source locale record; direct locale mutation on update is blocked server-side.
- [x] CMS Locale-Switch Regression Coverage: complete; admin e2e smoke now verifies locale-switch save uses create path (new locale record created), source-locale record remains unchanged, and direct locale mutation via update path is rejected.
- [x] CMS Media Upload Validation Runtime Coverage: complete; admin e2e smoke now verifies media upload validation via real `/api/cms/media` runtime path for oversized payload (`413`), unsupported MIME (`415`), and invalid checksum format (`400`), replacing reliance on standalone `node --test` path that fails on `server-only` resolution.
- [x] Admin Next-Agent Handoff Doc: complete; concise transfer document added at `docs/05_admin_platform/next_agent_handoff.md`.
- Public Website IA (Header): decision updated/documented; approved multilingual header now uses `Services / Solutions / For Business / References / About Us` with utility actions `Account & Status` and `Submit Request`; CMS/global navigation contract follow-up documented.
- Public Website Header Implementation: complete; new top navigation with separate `Account & Status` and `Submit Request` actions; desktop header now collapses the secondary navigation row after scroll into a notch-style menu; optimized scroll behavior by using `fixed` positioning with a static placeholder to prevent severe reflow jerks on complex pages.
- Public Website Leistungen Page: MVP implemented; public route `/[locale]/leistungen` renders the approved six-section structure in DE/EN/RU/TR/PL/AR with service-intent CTA attributes, header Services/Leistungen link target, `leistungen` CMS page-key compatibility, organized hero fallback assets under `public/images/leistungen/`, a regenerated natural LED-service hero asset, a generated fourth branding hero slide, and a narrow CMS overlay for editable hero slides via Pages CMS.
- Agent Rules: root instructions extended with short Karpathy-style execution rules; shared detailed playbook added in root `SKILL.md`
- Admin Agent Prompt Pack: added a full handoff prompt document for staged admin finalization execution with mandatory DUTY (fact-check implemented vs missing before each run), hotfix-in-stage rule, and sub-agent orchestration guidance.

## Last Updated

- Date: 2026-04-25
- Updated by: Codex
- Fixed: Header notch animation performance (replaced `sticky` with `fixed` + placeholder to prevent reflow jerks), merged Leistungen page and Header overhaul to main.
