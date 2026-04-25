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
- Public Website Leistungen Page: MVP implemented; public route `/[locale]/leistungen` renders the approved six-section structure in DE/EN/RU/TR/PL/AR.
- Public Website Business Page: MVP implemented; public route `/[locale]/business` renders B2B focused sections (Target groups, Subscription/Audit, Platform Cabinet, Trust) in DE/EN/RU/TR/PL/AR. Includes a generated hero asset and CMS integration.
- Public Website Probleme & Loesungen Page: MVP implemented; public route `/[locale]/probleme-loesungen` renders multilingual problem-to-solution content with animated before/after impact metrics, header navigation now points to the new route instead of `/support#symptoms`, and CMS/admin page-key support plus baseline seed content are in place. Existing support articles remain unchanged.
- Public Website RU Symptom Knowledge: complete; problem cards now use single-open accordion behavior without per-card request buttons; desktop active card spans the full grid width, and RU structured symptom chunks feed both public HTML and assistant prompt context.
- Next.js Proxy Convention: complete; request interception file migrated from `src/middleware.ts` to `src/proxy.ts` for Next.js 16.
- **Current Stage**: Implemented 'For Business' page structure (`/business`). Unified Header and Footer component implementations to resolve missing CMS data mapping bugs.
- **Status**: ✅ Completed. B2B value propositions, custom B2B CTA, and global layout mappings are now consistent across all responsive breakpoints.
- Agent Rules: root instructions extended with short Karpathy-style execution rules; shared detailed playbook added in root `SKILL.md`
- Admin Agent Prompt Pack: added a full handoff prompt document for staged admin finalization execution with mandatory DUTY.

## Last Updated

- Date: 2026-04-25
- Updated by: Codex
- **Cleanup audit (safe dead-code + repo trash pass)**: Removed empty `src/app/api/cms/debug-seed/` directory (no route.ts, confirmed dead). Removed 5 `.DS_Store` macOS artifacts (already in `.gitignore`). Removed 5 boilerplate Next.js SVG stubs from `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — confirmed zero imports across the codebase. All 5 mandatory checks passed: `npm run lint` ✓, `npx tsc --noEmit` ✓, `npm run build` ✓, `npm run test:admin-security` (21 routes) ✓, `npm run test:admin-auth` (7 tests) ✓. Left intentionally: `HelpCTA`, `HelpHero`, `SupportCTA` (reserved for future `/hilfe` page — Hilfe namespace exists in messages), `MessengerButtons` (planned WhatsApp/Telegram integration). `admin/ui/` components confirmed live (used in CRM/CMS routes). `lib/cms/revisions.ts` confirmed live (used by revisions/restore API routes).
- Fixed: Header notch animation performance (replaced `sticky` with `fixed` + placeholder to prevent reflow jerks), merged Leistungen page and Header overhaul to main. Fixed auto-closing modal bug in LeistungenHero. Migrated Next.js request interception convention from `src/middleware.ts` to `src/proxy.ts`. Removed per-card request buttons from `/probleme-loesungen` problem cards.
- Fixed: repo health audit follow-up completed; `npm run lint`, standalone `npx --no-install tsc --noEmit`, `npm run build`, `npm run test:admin-security`, and `npm run test:admin-auth` pass again. Updated stale client-portal documentation for `/api/contact`, tightened CRM case-detail timeline typing, and removed hardcoded public placeholder phone fallback in favor of configurable `NEXT_PUBLIC_SUPPORT_PHONE_HREF` with mail fallback.
- Added: Business page (`/[locale]/business`) with focus on B2B subscription and audits; implemented `Probleme & Loesungen` page (`/[locale]/probleme-loesungen`) with CMS/admin support and navigation replacement.
- Added: RU structured symptom knowledge chunks for assistant-ready problem answers and public accordion details; desktop problem-card accordion now expands the active card across the full grid width.
- **CMS Bridge (Probleme & Lösungen)**: Connected Admin articles to the public page. `getPublishedSymptomArticles(locale)` added to `lib/cms/articles.ts`. `ProblemKnowledgeGrid` now receives `knowledgeBySlug` Map from the Server Component instead of reading the static `problem-knowledge.ts`. `SLUG_TO_PROBLEM_ID` map in `page.tsx` bridges DB article slugs to card IDs without a schema change. SEO fix: replaced `hidden` attribute with `sr-only` CSS class so expanded card content is present in SSR HTML and indexed by Google/AI bots. FAQPage JSON-LD schema added from CMS `shortAnswer` fields. RU symptom articles seeded to DB via `seed-cms-symptom-articles-ru.mjs` (9 articles, locale=ru, status=PUBLISHED). EN symptom articles seeded via `seed-cms-symptom-articles-en.mjs` (9 articles, locale=en, status=PUBLISHED) — expert-grade content written as a signage engineer with 20 years of field experience. TypeScript clean (tsc --noEmit: 0 errors).

