# PROGRESS

Short global status only. Detailed session notes belong to folder-level `Progress Log` sections.

## Context Beacon

Purpose: fast global orientation before work. Read this beacon first; read the historical entries below only when continuing an older track or when the current task depends on those details.

Latest checkpoint:

- Date: 2026-05-16
- Current stage: agent startup context optimized with staged reading and `Context Beacon` sections in the core orientation documents.
- Next action: monitor whether future sessions can start from the beacon layer, then add matching beacons to large domain README files if needed.

Active tracks:

- Public Website: implemented multilingual public site; current SEO/indexing and content QA work continues in `docs/02_public_website/` and `docs/07_content_ai_seo/`.
- Request & Status Flow: implemented intake, session tracking, status lookup, and PR numbers; keep customer privacy boundaries from `docs/00_project_overview/project_state_and_roadmap.md`.
- Manager CRM: starter implemented; operational planning belongs in `docs/06_crm/`.
- Website CMS & Admin Platform: starter implemented; CMS/admin work belongs in `docs/05_admin_platform/`.
- AI Assistant: intake MVP implemented; assistant behavior belongs in `docs/08_ai_assistant/`.
- Security & Audit: starter implemented; security/privacy work belongs in `docs/10_security_privacy/`.
- Client Portal: production identity foundation and password/code auth implemented in code; portal planning belongs in `docs/04_client_portal/`.
- Engineering/Ops: maintenance and deployment notes belong in `docs/09_engineering/` and `docs/11_operations/`.
- Agent Rules: staged context loading documented in `AGENTS.md` and `docs/12_agent_rules/README.md`.

Read deep when:

- continuing a specific older checkpoint from the log below;
- updating a module's current status;
- checking what changed on a date;
- preparing deployment, migration, or owner-review follow-up from a prior entry.

## Current Modules

- **Public Website**: Implemented (Homepage, Support, Problems & Solutions, B2B, References, About, Legal). CMS integration partial. About RU language pass complete. DE QA cleanup completed; legal pages now preserve CMS as source of truth with page-specific stale validation.
- **Request & Status Flow**: Implemented (Intake, session tracking, customer status lookup, PR-numbers). Reimagined Tracking Page MVP designed.
- **Manager CRM**: CRM starter implemented (Case detail, assignment, internal notes, operator takeover). Object-level auth hardened. Future internal operational object map concept documented.
- **Website CMS & Admin Platform**: CMS starter implemented (Pages, Articles, Media Library, SEO, AI config). 3-column MODX-style redesign implemented.
- **AI Assistant**: Intake MVP implemented (session-scoped, deterministic triggers, repeat-contact confirmation flow).
- **Security & Audit**: Admin login, HTTP-only cookies, role splitting, CSRF/Rate-limit starter implemented.
- **Client Portal**: Prototype approved. Stage 2.5 read-only demo implementation merged (dashboard, requests, objects). Stage 2.6 production identity foundation implemented in code: claim-link email verification, portal users, verified emails, request access grants, and IONOS SMTP support. Stage 2.8 replaces magic-link portal auth with e-mail code plus password registration/login/reset, preserving empty verified dashboard and request-bound claim links.
- **Engineering/Ops**: Open maintenance note recorded for future Postgres SSL connection-string cleanup before the next `pg`/Prisma/migration-tooling dependency upgrade.

## Last Updated

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
