# PROGRESS

Short global status only. Detailed session notes belong to folder-level `Progress Log` sections.

## Context Beacon

Purpose: fast global orientation before work. Read this beacon first; read the historical entries below only when continuing an older track or when the current task depends on those details.

Latest checkpoint:

- Date: 2026-05-21
- Current stage: Replaced two blocks on `/business` page (Subscription Model / Audit and Volle Kontrolle / Portal) with the designer's new high-fidelity layouts. Audit block now has glassmorphism benefit cards and a floating Standortübersicht widget + scan panel. Portal block replaced gray skeleton placeholders with a real dashboard mockup (KPI tiles, location rows with status tags, floating Audit-Report card). Added auditCta/portalCta/portalDemoCta fields for all 6 locales. Production build verified.
- Next action: Owner reviews the updated `/de/business` page visually (Audit block and Portal block).


Active tracks:

- B2B Standort-Abo: internal product concept captured in `docs/01_strategy/standort_abo_product_concept.md`; not yet a public offer, tariff model, SLA, or implemented platform feature.
- Public Website: implemented multilingual public site; current SEO/indexing and content QA work continues in `docs/02_public_website/` and `docs/07_content_ai_seo/`.
- Request & Status Flow: implemented intake, session tracking, status lookup, and PR numbers; keep customer privacy boundaries from `docs/00_project_overview/project_state_and_roadmap.md`.
- Manager CRM: starter implemented; operational planning belongs in `docs/06_crm/`.
- Website CMS & Admin Platform: starter implemented; CMS/admin work belongs in `docs/05_admin_platform/`.
- AI Assistant: intake MVP implemented with consent-gated form opening; assistant behavior belongs in `docs/08_ai_assistant/`.
- Security & Audit: starter implemented; security/privacy work belongs in `docs/10_security_privacy/`.
- Client Portal: production identity, password/code auth, portal-created requests, compact dashboard without global chat, modal-like split request detail, request-bound customer messages with AI replies, site-style attachment composer, customer-side editable request details with diff chat logs, safe read model, and dedicated logout implemented in code; portal planning belongs in `docs/04_client_portal/`.
- Engineering/Ops: maintenance and deployment notes belong in `docs/09_engineering/` and `docs/11_operations/`.
- Agent Rules: staged context loading documented in `AGENTS.md` and `docs/12_agent_rules/README.md`.

Read deep when:

- continuing a specific older checkpoint from the log below;
- updating a module's current status;
- checking what changed on a date;
- preparing deployment, migration, or owner-review follow-up from a prior entry.

## Current Modules

- **Public Website**: Implemented (Homepage, Support, Problems & Solutions, B2B, References, About, Legal). CMS integration partial; `/ueber-uns` now has CMS-backed `about` records with code fallback. About RU language pass complete. DE QA cleanup completed; legal pages now preserve CMS as source of truth with page-specific stale validation.
- **Request & Status Flow**: Implemented (Intake, session tracking, customer status lookup, PR-numbers). Photon address autocomplete with optional coordinate persistence added for request creation.
- **Manager CRM**: CRM starter implemented (Case detail, assignment, internal notes, operator takeover). Object-level auth hardened. Future internal operational object map concept documented.
- **Website CMS & Admin Platform**: CMS starter implemented (Pages, Articles, Media Library, SEO, AI config). 3-column MODX-style redesign implemented.
- **AI Assistant**: Intake MVP implemented (session-scoped, consent-gated triggers, repeat-contact confirmation flow).
- **Security & Audit**: Admin login, HTTP-only cookies, role splitting, CSRF/Rate-limit starter implemented.
- **Client Portal**: Prototype approved. Stage 2.5 read-only demo implementation merged (dashboard, requests, objects). Stage 2.6 production identity foundation implemented in code: claim-link email verification, portal users, verified emails, request access grants, and IONOS SMTP support. Stage 2.8 replaces magic-link portal auth with e-mail code plus password registration/login/reset, preserving empty verified dashboard and request-bound claim links.
- **Engineering/Ops**: Open maintenance note recorded for future Postgres SSL connection-string cleanup before the next `pg`/Prisma/migration-tooling dependency upgrade.

## Last Updated

- Date: 2026-05-21
- Updated by: Antigravity
- **Current Stage**: Redesigned the B2B Service & Maintenance section on `/leistungen` to match the high-fidelity compact dark glassmorphic design prototype. Verified next-intl localized translations (DE, EN, RU, TR, PL, AR), RTL rendering adjustments, and Next.js production build compilation.
- **Next Action**: Owner reviews the updated `/de/leistungen` B2B block visually.

- Date: 2026-05-21
- Updated by: Antigravity
- **Current Stage**: Refactored Service Page layout and ServiceCalculator component to match design prototype styling with full 6-locale translation and Arabic RTL support. Verified Next.js build compilation.
- **Next Action**: Owner reviews the updated page at `/de/service?cmsPreview=1`.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Implemented the hidden Service/Standort-Abo page slice in code: `service` Page CMS key, owner-only draft preview route, DE draft seed script, site-style React renderer, calculator, CMS preview link, and noindex/robots guardrails.
- **Next Action**: Run `npm run db:seed:cms-service` against the intended database when the owner wants to create/update the DE draft, then review `/de/service?cmsPreview=1` from an authenticated CMS owner session.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Captured the approved hidden Service/Standort-Abo implementation plan in `docs/02_public_website/page_plan_service.md` and linked it from the Public Website README. The plan keeps tariffs, adds Page CMS editing, and requires draft-only owner preview with no public navigation, sitemap, or indexing.
- **Next Action**: Next agent implements the plan starting with `service` CMS page-key support and the protected draft preview route.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Added a standalone site-style Service/Standort-Abo landing prototype in `DesignPrototip/pixelring-service-page-site-style.html`, keeping the tariff blocks, calculator, report preview, process, FAQ boundaries, and CTA flow from the existing tariff prototype while visually aligning it with the current PixelRing public site.
- **Next Action**: Owner reviews the prototype and decides whether it should guide a future `/de/service` implementation or remain a design reference.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Cleaned legal CMS draft data by clearing stale `publishedAt` from non-DE `privacy`/`impressum` draft rows and excluded intentional German-only legal drafts from the dashboard `In editing` list and `Editing now` count.
- **Next Action**: Owner decides whether historical non-DE legal draft rows should remain as records or be archived/hidden more explicitly in Page CMS.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Reworked the CMS dashboard recent edits area into an audit-backed compact table grouped by resource, showing latest action, editor, role, timestamp, locales, status, edit count, and open action. Added `/api/cms/dashboard/recent` for grouped audit history.
- **Next Action**: Owner reviews whether the compact table needs filters by resource type, locale, editor, or period.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Refined the shared CMS dashboard sidebar: compact expanded width, collapsed icon-only state, inline SVG icons, calmer dark palette, preserved active routing/logout behavior, and verified the Media Library dashboard in browser.
- **Next Action**: Owner reviews expanded/collapsed sidebar rhythm and icon choices across CMS sections.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Loaded current `/ueber-uns` page copy into CMS as `about` for DE/EN/RU/TR/PL/AR, connected the route to `getAboutPageCmsContent`, kept shared code fallback in `src/lib/content/about-page.ts`, and re-ran audit/build/runtime/browser checks. Audit result remains `WARN` only because TR/PL/AR problem articles are intentionally accepted for now and inactive `support` CMS pages still exist.
- **Next Action**: Owner decides whether inactive historical `support` CMS pages should be archived, remapped, or left as historical records.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Reworked the `/leistungen` `Wartung & Serviceverträge` section into a clearer B2B service-contract bridge: three service directions, safer CTA wording, selected-material benefit wording, and an explicit boundary against unlimited repair promises. Production build verified.
- **Next Action**: Owner reviews the updated `/de/leistungen` block visually and decides whether it should become the entry point for a dedicated future `Standort-Abo` landing page.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Captured the owner-provided B2B service-contract/subscription analysis as an internal `PixelRing Standort-Abo` product concept, with guardrails, MVP package candidates, operating process, website direction, dependencies, and a progress log.
- **Next Action**: Owner reviews product naming, first sales MVP, package boundaries, pricing/SLA assumptions, and whether to proceed toward canonical German landing-page copy.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Applied the calmer photo-first hero pattern to `/probleme-loesungen`, `/business`, and `/referenzen`: lower hero height, bottom-left text, softer image gradients, and no in-hero CTA/slider controls. Preserved the `PixelRing Check` before/after block on `/probleme-loesungen` as a separate section below the hero.
- **Next Action**: Owner reviews `/de/probleme-loesungen`, `/de/business`, and `/de/referenzen` for hero crop, first-screen rhythm, and the preserved PixelRing Check block.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Shortened and simplified the `/leistungen` hero into a calmer photo-first section: lower height, bottom-left text, lighter image treatment, and no visible slider controls or in-hero CTA.
- **Next Action**: Owner reviews `/de/leistungen` for hero height, photo crop, and first-screen breathing room.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Simplified the final `/ueber-uns` CTA into one light rounded container with only the headline and service button, avoiding nested visual wrappers.
- **Next Action**: Owner reviews `/de/ueber-uns` for final CTA color, spacing, and page ending rhythm.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Completed a non-Russian `/ueber-uns` copy QA pass for DE, EN, TR, PL, and AR, removing machine-translation phrasing, long-dash patterns, mixed Arabic/Russian text, and unsupported claim wording while leaving RU unchanged.
- **Next Action**: Owner reviews non-RU About pages visually, especially Turkish, Polish, and Arabic.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Removed the generic KPI/statistics strip (`2023`, `100+`, `50+`, `1`) from `/ueber-uns`; the page now flows from the hero directly into the audience section.
- **Next Action**: Owner reviews `/de/ueber-uns` for spacing and flow after the KPI removal.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Updated the Russian `/ueber-uns` final CTA headline from repair/check wording to `Нужен ремонт или диагностика?`.
- **Next Action**: Owner reviews the shortened Russian final CTA headline on `/ru/ueber-uns`.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Reworded the `/ueber-uns` materials-section heading across locales from "materials/systems we work with" to premium materials and supply partners.
- **Next Action**: Owner reviews the updated Russian materials heading on `/ru/ueber-uns`.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Removed the `/ueber-uns` materials-section description line across locales and cleaned the unused material description label from page code.
- **Next Action**: Owner reviews the shortened materials block on `/ru/ueber-uns`.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Removed the `/ueber-uns` final CTA supporting sentence across locales and cleaned the unused final description field from page code.
- **Next Action**: Owner reviews the shortened Russian final CTA on `/ru/ueber-uns`.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Replaced the fake `/ueber-uns` video preview with a generated 7-second workshop MP4, native video controls, and a visible localized play button overlay.
- **Next Action**: Owner reviews the updated `/ru/ueber-uns` video block and decides whether to replace the generated clip with real footage later.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Rewrote the `/ueber-uns` final CTA copy across locales from vague "describe the task" wording to a direct repair/inspection service prompt.
- **Next Action**: Owner reviews the updated Russian CTA wording on `/ru/ueber-uns`.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Removed the temporary testimonials description line from `/ueber-uns` and cleaned the unused localized label fields from the page code.
- **Next Action**: Owner reviews the updated `/ru/ueber-uns` testimonials header without the placeholder description.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Minimized the `/ueber-uns` final CTA from a large dark panel into a compact separator-and-action strip with smaller typography and standard button scale.
- **Next Action**: Owner reviews the updated `/ru/ueber-uns` final CTA for vertical rhythm and whether the closing action is still prominent enough.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Tightened the `/ueber-uns` testimonials block from a tall classic review section into a shorter proof strip with compact header, denser cards, and clearer quote hierarchy.
- **Next Action**: Owner reviews the updated `/ru/ueber-uns` testimonials block for readability and vertical rhythm.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Removed the remaining `/ueber-uns` services routing CTA block headed `Сервисные направления PixelRing` after owner review. The About page now flows from the video-first work section directly into testimonials and the final CTA.
- **Next Action**: Owner reviews the shortened `/ru/ueber-uns` page and decides whether the testimonials block should stay.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Reworked the About page quality section into a video-first block with a large poster, short caption, compact service tags, and a subtle references link instead of a long quality checklist.
- **Next Action**: Owner reviews the `/ru/ueber-uns` video-first block and decides whether to provide a real video asset to replace the poster.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Removed the `So läuft Ihre Anfrage ab` / `Как проходит заявка` process block from the Leistungen page after owner review. The services page now moves from service showcase and maintenance toward the final framework/CTA block without the five-step process section.
- **Next Action**: Owner reviews the shorter `/ru/leistungen` page and decides whether the remaining final framework/CTA block should stay.

- Date: 2026-05-20
- Updated by: Codex
- **Current Stage**: Restructured the Leistungen page service presentation into five large cards: repair/maintenance, LED modernization, inspection/audit/diagnostics, mounting/dismantling/relocation, and print/branding materials. The About page now uses a short services CTA instead of duplicating the service-card catalogue.
- **Next Action**: Owner reviews the updated services showcase on `/ru/leistungen` and checks `/ru/ueber-uns` no longer reads like the services page.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Redesigned the B2B interactive photo showcase on `/business` page to split diagonally into two panels (Left: Exterior, Right: Interior), deleting the middle staff/menu panel. Restored standard 12-column grid layout (col-span-4 sidebar, col-span-8 right card) and changed desktop collage aspect ratio to a flatter cinematic aspect ratio (`lg:aspect-[21/10]`) to ensure it fits fully on-screen. Verified production build success.
- **Next Action**: Owner reviews the updated two-panel diagonal interactive showcase layout.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Redesigned the B2B sector selector tabs on the `/business` page. Removed house icons from desktop buttons, converted desktop columns to a custom layout (`280px` fixed sidebar, expanding showcase card on the right), and implemented a premium, clickaway-enabled dropdown selector for mobile screens. Verified production build success.
- **Next Action**: Owner reviews the redesigned sector selector and mobile dropdown on B2B page.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Removed the bottom CTA action button from the B2B interactive showcase (`/business` page) and adjusted padding to achieve perfect, symmetrical spacing on all sides (equal top/bottom and left/right margins). Checked Next.js compilation success.
- **Next Action**: Owner reviews the updated visual layout on B2B page.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Compacted the B2B interactive showcase on the `/business` page by hiding the redundant large sector title, reducing card paddings, and tightening vertical gaps and min-heights. The full diagonal photo collage is now fully visible on the screen. Verified production build success.
- **Next Action**: Owner reviews the compacted visual layout on B2B page.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Redesigned the details card in the interactive B2B showcase on `/business` page. Removed the separate Problems and Solutions columns, replaced them with a single "Scope of Work & Audit" description focused on active services, and removed the main sector description paragraph. Localized across 6 locales and verified production build success.
- **Next Action**: Owner reviews the updated single-description card layout on B2B page.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Simplified the 3-panel diagonal showcase on the B2B page (`/business`) by removing all overlay footnotes, connector lines, and pulsing dots. Selection is now driven by direct cursor hover/click on the collage blocks, displaying the active block label inside the details banner at the top. Next.js production build verified.
- **Next Action**: Owner reviews the simplified cursor-based B2B diagonal collage showcase.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Finalized the 3-panel diagonal presentation collage showcase for the Gastronomy & Restaurants sector on B2B page (`/business`). Restored the lost Arabic (AR) translations block, resolved the build-blocking syntax corruption, and verified clean compilation and build.
- **Next Action**: Owner reviews the interactive 3-panel diagonal showcase slide presentation layout.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Implemented Option B (Visual-First) for the Gastronomy & Restaurants sector on the B2B page (`/business`). Added an interactive layout with a custom restaurant photo, pulsing hotspot markers, SVG connecting lines, frosted-glass text tooltips, and localization across all 6 locales (DE, EN, RU, TR, PL, AR). Passed local Next.js production build verification.
- **Next Action**: Owner reviews the interactive photo hotspots layout in the Gastronomy & Restaurants B2B sector.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Upgraded header navigation styling. Fixed active capsule clipping; added a smooth sliding glass bubble with Framer Motion `layoutId`. Implemented Option A for the scrolled notch, rendering it as a sleek, wide 192px and thin 24px glassmorphic tab containing only a styled, centered 16px chevron arrow (removed "Menu" text). Added a subtle downward bounce hover effect and eliminated CSS transition conflicts for lag-free expansion.
- **Next Action**: Owner reviews the refined header navigation and lag-free scroll notch behavior.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Integrated B2B Showcase sectors with the new target audience cards on the About Us page (`ueber-uns`). The cards feature specific industry SVGs, localized copy across 6 locales, and deep-link correctly to `/business?sector=...` query parameters to initialize the matching interactive view.
- **Next Action**: Owner reviews the interactive B2B showcase and About Us page deep-linking integration.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Redesigned the B2B page sectors block using a custom interactive client component (`BusinessShowcase`). The component displays a vertical selection of 7 industries and a dark glassmorphic preview box with glowing CSS/SVG storefronts, problem lists, and request triggers.
- **Next Action**: Owner reviews the interactive sectors showcase on the B2B business page.

- Date: 2026-05-20
- Updated by: Antigravity
- **Current Stage**: Redesigned the "About Us" page Hero section, replacing the static split layout with a custom interactive diagnostics and live dispatch terminal widget (`ServiceSimulator`). The widget features interactive scanning simulation of a neon sign and a live dispatch ticker.
- **Next Action**: Owner reviews the interactive terminal widget on the About page.

- Date: 2026-05-19
- Updated by: Codex
- **Current Stage**: Public website header now marks the current main section with a static glass capsule active state. Hover states remain lighter and do not reuse the active border/shadow treatment.
- **Next Action**: Owner reviews the header active navigation style, then continue fixing P1 audit blockers and update the audit finding resolution log after verification.

- Date: 2026-05-18
- Updated by: Codex
- **Current Stage**: Production launch audit handoff document created in `docs/09_engineering/` with open P1/P2/P3 findings across security/privacy, portal/status, AI, database, frontend/i18n, and documentation. No fixes were applied.
- **Next Action**: Fix P1 audit blockers first and update each finding's resolution log in the audit handoff document after verification.

- Date: 2026-05-18
- Updated by: Codex
- **Current Stage**: Client portal request detail can now edit request contact and address/object fields while preserving request number and creation/opening dates; every saved change writes audit data and a customer-visible chat diff. The details card separates request contact from portal account owner, and request-bound portal chat now calls the AI assistant while forbidding in-chat creation of another request.
- **Next Action**: Apply the pending service-location coordinate migration to the target database and verify portal request editing, AI replies, and real persisted request flows after deploy.

- Date: 2026-05-17
- Updated by: Codex
- **Current Stage**: Client Portal core request MVP implemented: authenticated portal request creation, compact portal dashboard without global chat, modal-like split request workspace, request-bound customer messages with site-style attachment composer, safe portal read model, dedicated logout endpoint, and focused portal MVP tests.
- **Next Action**: Deploy and verify registration/login, empty dashboard, portal-created request, request detail, customer message, and logout with real e-mail/session data.

- Date: 2026-05-17
- Updated by: Antigravity
- **Current Stage**: Master design system specification file `DESIGN.md` created in the repository root, documenting the exact as-built visual style, color palette tokens, typography, grids, layout rules, and premium visual components of the main website.
- **Next Action**: Utilize the visual specifications in `DESIGN.md` for consistent UI development across all new customer-facing pages and upcoming verified client portal modules.

- Date: 2026-05-16
- Updated by: Codex
- **Current Stage**: AI chat intake now asks what happened first, offers request creation, and opens the form only after explicit user consent; chat intake prefill now includes detected name and address/location where available.
- **Next Action**: Deploy and verify the live Russian flow: "у меня новая проблема" should not open the form until the user describes the issue and agrees to create a request.

- Date: 2026-05-16
- Updated by: Codex
- **Current Stage**: Agent startup context optimized with staged reading and `Context Beacon` sections in `PROGRESS.md`, `docs/README.md`, and `docs/00_project_overview/project_state_and_roadmap.md`; `SKILL.md` is now explicitly on-demand.
- **Next Action**: Monitor future sessions for whether domain README files need matching beacons.

- Date: 2026-05-16
- Updated by: Codex
- **Current Stage**: Google indexing crawlability cleanup implemented: problem article cards now expose crawlable links, article `hreflang`/sitemap alternates are limited to published locales, temporary missing-locale article fallback serves English content as `noindex`, and article `lastmod` now uses CMS update time.
- **Next Action**: Deploy, verify live `/sitemap.xml`, inspect DE/EN/RU article URLs plus PL/TR/AR fallback article URLs in Google Search Console, then request indexing for German canonical pages first.

- Date: 2026-05-16
- Updated by: Codex
- **Current Stage**: Client Portal password/code auth implemented and migration applied: registration uses e-mail code then password, login uses e-mail plus password, reset uses e-mail code, and claim links hand off to the same verified account flow.
- **Next Action**: Configure/verify IONOS SMTP credentials on Vercel, redeploy, then test registration, login, reset, empty dashboard, and claim-link access end to end.

- Date: 2026-05-16
- Updated by: Codex
- **Current Stage**: Client Portal production readiness advanced: IONOS SMTP via `noreply@pixel-ring.com` is supported through env vars, and the portal now creates/uses `PortalUser`, `PortalUserEmail`, and `PortalCaseAccess` instead of opening only the demo/test portal after verification.
- **Next Action**: Owner adds `SMTP_PASSWORD` plus production DB env vars on hosting, then apply pending portal migrations and validate the real claim-link -> e-mail -> portal flow on preview.

- Date: 2026-05-15
- Updated by: Codex
- **Current Stage**: Client Portal claim-link bridge implemented for testing: request intake and CRM can create a 24-hour case-bound portal link; customer verifies or adds email through a 30-minute email link; successful verification opens the existing test portal through HTTP-only cookies.
- **Next Action**: Apply the portal claim-link migration after owner confirmation, configure real email delivery, then test public request -> claim link -> email verification -> test portal with a real email.

- Date: 2026-05-15
- Updated by: Antigravity
- **Current Stage**: Problem card grid on `/[locale]/probleme-loesungen` unified to equal-height cards. CSS `line-clamp-2` on solution text and `line-clamp-3` on shortAnswer (Kurz erklärt) ensure consistent card dimensions regardless of content length. Full text remains in DOM for SEO crawlers; visual truncation with `…` signals clickability. Flex layout with `mt-auto` pins the Kurz erklärt section to the card bottom. Article navigation sidebar previously implemented on every `[slug]` page.
- **Next Action**: Consider automating slug mapping (publicSlug in CMS) so new articles appear in nav without code changes. Enrich remaining 8 articles to full depth.

- Date: 2026-05-14
- Updated by: Antigravity
- **Current Stage**: Article SEO/GEO architecture upgraded across 5 tracks: (1) Article JSON-LD on every `/[slug]` page, (2) sidebar CTA localized for DE/EN/RU/TR/PL/AR, (3) heading hierarchy fixed (`h2`→`h3` sidebar), (4) cross-linking "Related problems" section on article pages, (5) enriched flicker article seeded for DE/EN/RU with full diagnostic table, 10 causes, ~4500 words per locale.
- **Next Action**: Visual QA of enriched article pages in browser. Consider enriching remaining 8 articles to the same depth.

- Date: 2026-05-13
- Updated by: Codex
- **Current Stage**: Public website CTA system unified across fallback messages, key public routes, and published CMS pages for DE/EN/RU/TR/PL/AR. Homepage `Was passiert nach dem Absenden?` / `Что происходит после отправки?` follow-up block was hidden from the public homepage after owner review rejected the concept and copy logic. Header service CTA now has a desktop hover/focus contact rail for WhatsApp, Telegram, and site chat.
- **Next Action**: Rework the post-submit communication concept from scratch before showing this block again; do not restore the current roadmap/follow-up block without owner approval.

- Date: 2026-05-12
- Updated by: Codex
- **Current Stage**: Homepage `Wie es funktioniert` block rewritten and restyled; layout now uses 40/30/30 top-row proportions and 30/70 bottom-row proportions, with the fifth card as the wide accent result card containing a result photo and original PixelRing service stamp anchored to the photo corner. Homepage advantage/trust block rewritten as `ADVANTAGE`/`VORTEIL` concept, localized across DE/EN/RU/TR/PL/AR, and published CMS home pages updated in the database.
- **Next Action**: Owner reviews the updated process and advantage blocks visually on the local site, then approves comments or moves to the next homepage block.

- Date: 2026-05-12
- Updated by: Codex
- **Current Stage**: Homepage hero layout compacted after visual review; desktop spacing, column balance, image sizing, and mobile stack were adjusted and QA-checked locally.
- **Next Action**: Owner reviews the updated first screen on `/de`, then decides whether to continue with the next homepage block.

- Date: 2026-05-12
- Updated by: Codex
- **Current Stage**: Homepage page-by-page content review started; hero copy updated across DE/EN/RU/TR/PL/AR in fallback messages and published CMS home blocks with the approved SEO+B2B formula, preserving the existing `24h` badge text.
- **Next Action**: Owner reviews the updated hero visually on the local site, then approves comments or moves to the next homepage block.

- Date: 2026-05-12
- Updated by: Codex
- **Current Stage**: Strategy handoff updated; `docs/01_strategy/new/pixelring_master_brief_context_prompt.md` now points agents to Block 1-9 as current source of truth, marks old `master_brief.md` as legacy summary, and defines the next page-by-page content review workflow.
- **Next Action**: Use the new context prompt to begin website copy rewrite planning or start a page-by-page review with a selected public page.

- Date: 2026-05-12
- Updated by: Codex
- **Current Stage**: Strategy Block 9 created as a strategic messaging and conversion block covering core messaging, hierarchy, hero logic, CTA strategy, trust messaging, small/large business messaging, German copywriting direction, and page-level messaging roles.
- **Next Action**: Owner review of Block 9, then decide whether master brief needs Block 10 or whether to create a separate website copy rewrite execution plan.

- Date: 2026-05-11
- Updated by: Codex
- **Current Stage**: Strategy Block 8 created and expanded; legal/German compliance guardrails now include Datenschutzerklärung coverage, cookies/storage/analytics/third-party tools, forms/uploads/messenger handoff, B2B/B2C quote boundary, accessibility, dispute-resolution, and template-risk checks with Russian explanations.
- **Next Action**: Review Block 8 with the owner, then continue to Block 9 — Messaging & Conversion once legal/compliance guardrails are accepted.

- Date: 2026-05-11
- Updated by: Codex
- **Current Stage**: CRM future operational object map documented as an internal admin/manager concept for repaired, diagnosed-only, serviced, active, and recurring customer locations with filters and privacy guardrails.
- **Next Action**: Decide whether first CRM map planning should derive locations from existing case service-location data or wait for a dedicated service-object model.

- Date: 2026-05-11
- Updated by: Codex
- **Current Stage**: Client Portal future location-intelligence module documented as a planned business-portal concept: candidate locations, competitor map layer, delivery coverage, and rental-listing/API integration guardrails.
- **Next Action**: Decide whether a future portal design pass should combine objects, suppliers, and candidate locations into one map workspace or keep them as separate map modes.

- Date: 2026-05-11
- Updated by: Codex
- **Current Stage**: Client Portal future supplier/logistics module documented as a planned business-portal concept: interactive object/supplier map, supplier file, backup/candidate suppliers, and supplier search guardrails.
- **Next Action**: Decide whether to prototype the supplier map UI next or keep focus on existing portal object/request implementation.

- Date: 2026-05-11
- Updated by: Codex
- **Current Stage**: Strategy Block 7 in progress; SEO/GEO architecture documented around five page roles, Berlin/Brandenburg geo hub direction, current page reviews, Business value model, internal linking model, and editorial prerequisite before link implementation.
- **Next Action**: Continue Block 7 by deciding the next SEO/GEO strategy item after internal linking, likely intake/conversion routing or content rewrite workflow.

- Date: 2026-05-09
- Updated by: Codex
- **Current Stage**: Strategy Block 6 completed; product and operating model documented with customer layer, operational CRM layer, content/growth layer, expansion layer, portal/CRM separation, privacy rules, and subscription kept as internal direction until offer is defined.
- **Next Action**: Continue strategy writing with Block 7 — SEO / GEO Strategy.

- Date: 2026-05-08
- Updated by: Antigravity
- **Current Stage**: Strategy documentation maintenance; converted core company blocks to Markdown to ensure consistency with the master brief.
- **Next Action**: Continue aligning public website copy and SEO content with the finalized strategy documentation.

- Date: 2026-05-07
- Updated by: Codex
- **Current Stage**: Status page gateway refined - public status lookup moved into the right-side status/chat area, while the left side now focuses on customer portal entry; chat preview opens a portal-registration CTA across supported locales.
- **Next Action**: Owner visual review of `/ru/status` and other localized `/status` pages, then decide whether real portal registration/auth copy should replace the current demo-gate positioning.

- Date: 2026-05-07
- Updated by: Codex
- **Current Stage**: Telegram photo attachments MVP added — inbound Telegram photo messages now download through Bot API `getFile`, store as CRM attachments, and should render in the existing CRM Media block.
- **Next Action**: Deploy and validate a real Telegram photo on an existing case, confirming both timeline placeholder and CRM Media preview/download.

- Date: 2026-05-07
- Updated by: Codex
- **Current Stage**: Telegram admin alerts MVP added — website requests and inbound Telegram customer messages now send manager notifications to `TELEGRAM_ADMIN_CHAT_ID` through a shared helper; group intake is ignored and `/chatid` returns the setup id.
- **Next Action**: Deploy, create the closed manager Telegram group, add the bot, run `/chatid`, set `TELEGRAM_ADMIN_CHAT_ID`, and verify one website request plus one Telegram inbound message.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: Telegram status links changed to URL buttons — PR issue and post-PR AI replies now attach Telegram inline keyboard status buttons.
- **Next Action**: Deploy and verify Telegram shows the status button under both PR issue and AI status replies.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: Telegram AI pause policy adjusted — Issue PR no longer disables AI; customer-visible manager replies pause AI for two hours, with manual re-enable still available.
- **Next Action**: Deploy and test post-PR Telegram questions plus manager-reply pause/resume behavior.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: Telegram PR status link added — manual Issue PR now sends a clickable status-tracking link backed by a case-access session token.
- **Next Action**: Deploy and validate that tapping the Telegram PR number opens `/status` with safe public status, then continues via HTTP-only case session.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: Shared AI assistant connected to Telegram CRM cases — case-level AI control, Telegram webhook assistant replies, CRM AI toggle, and operator/PR pause behavior are implemented.
- **Next Action**: Deploy migration and validate a live Telegram conversation with AI ON, operator reply pause, AI re-enable, and manual PR issue.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: CRM live inbox baseline added — per-manager read state, unread customer-message counts, last-message previews, and Ably live refresh are wired into the CRM dashboard.
- **Next Action**: Deploy and test Telegram inbound messages on the open CRM dashboard, then open the case and confirm unread indicators clear.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: CRM realtime messaging in progress — Ably Pub/Sub selected and implementation started so open CRM case conversations can refresh live after Telegram or CRM message events.
- **Next Action**: Deploy Ably realtime integration and validate inbound Telegram messages appearing in open CRM case views without manual browser refresh.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: Telegram CRM MVP implementation baseline added — Telegram conversations now map to CRM cases, inbound webhook messages enter the case timeline, CRM replies can deliver through Telegram, and managers can manually issue PR numbers for Telegram draft cases.
- **Next Action**: Revoke the exposed Telegram bot token, set fresh server env vars, deploy, register the Telegram webhook, and validate a real Telegram-to-CRM-to-Telegram conversation.

- Date: 2026-05-06
- Updated by: Codex
- **Current Stage**: Google indexing readiness in progress — canonical domain selected as `https://www.pixel-ring.com`; Next.js robots/sitemap/metadata baseline added for public localized pages while excluding CRM/CMS/status/portal surfaces.
- **Next Action**: Deploy and submit `https://www.pixel-ring.com/sitemap.xml` in Google Search Console, then request indexing for `/de` and priority German content pages.

- Date: 2026-05-05
- Updated by: Codex
- **Current Stage**: References CMS image replacement completed — generated a new role-based image set, created new `CmsMedia` Blob records with local fallbacks, and rewrote published `referenzen` page image refs across DE/EN/RU/TR/PL/AR so the page no longer depends on Unsplash.
- **Next Action**: Address CMS audit findings for `referenzen` image validation/fallback behavior when the CMS editor hardening track reopens.

- Date: 2026-05-05
- Updated by: Antigravity
- **Current Stage**: CMS admin gallery UX improved — added visual layout preview grid and shape badges (Large/Vertical/Small/Wide) to `galleryItemsBlock` items editor so admins can see which shape each item will render as based on its position.
- **Next Action**: Continue CMS content management or public website QA.

- Date: 2026-05-04
- Updated by: Codex
- **Current Stage**: Strategy master brief re-baselined as current PixelRing company/source-of-truth document; unsupported marketplace, geography, SLA, portal, warranty, production, and integration claims are now guarded as unverified/planned.
- **Next Action**: Align German public website semantic copy and problem-article implementation to `docs/01_strategy/master_brief.md` and `docs/02_public_website/german_site_audit.md`.

- Date: 2026-05-04
- Updated by: Codex
- **Current Stage**: German Problems & Solutions GEO article architecture implementation in progress; hidden overview knowledge pattern is being replaced by visible previews plus public article pages.
- **Next Action**: Review article route/modal behavior and decide whether to add a full URL-backed intercepted modal route later.

- Date: 2026-05-04
- Updated by: Codex
- **Current Stage**: German public website audit decisions documented; GEO article architecture, hidden-text cleanup direction, German copy rules, and metadata standards are pending implementation.
- **Next Action**: Confirm whether to update `docs/01_strategy/master_brief.md` first or implement the German audit correction plan.

- Date: 2026-05-04
- Updated by: Codex
- **Current Stage**: DE legal CMS source-of-truth fix completed; `privacy/de` keeps the DOCX-aligned CMS text, and `impressum/de` production CMS content was updated to DDG.
- **Next Action**: Re-deploy and re-run external QA against `https://www.pixel-ring.com/de`.

- Date: 2026-05-03
- Updated by: Antigravity
- **Current Stage**: `/ueber-uns` trust-positioning pass completed; hero reframed around one accountable service partner, stats/materials/testimonials/CTA cleaned up, and temporary Service-Team avatars added.
- **Next Action**: Continue public website visual QA across mobile/languages or proceed with Security P0 and Release Readiness.
