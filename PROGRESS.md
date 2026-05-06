# PROGRESS

Short global status only. Detailed session notes belong to folder-level `Progress Log` sections.

## Current Modules

- **Public Website**: Implemented (Homepage, Support, Problems & Solutions, B2B, References, About, Legal). CMS integration partial. About RU language pass complete. DE QA cleanup completed; legal pages now preserve CMS as source of truth with page-specific stale validation.
- **Request & Status Flow**: Implemented (Intake, session tracking, customer status lookup, PR-numbers). Reimagined Tracking Page MVP designed.
- **Manager CRM**: CRM starter implemented (Case detail, assignment, internal notes, operator takeover). Object-level auth hardened.
- **Website CMS & Admin Platform**: CMS starter implemented (Pages, Articles, Media Library, SEO, AI config). 3-column MODX-style redesign implemented.
- **AI Assistant**: Intake MVP implemented (session-scoped, deterministic triggers, repeat-contact confirmation flow).
- **Security & Audit**: Admin login, HTTP-only cookies, role splitting, CSRF/Rate-limit starter implemented.
- **Client Portal**: Prototype approved. Stage 2.5 read-only demo implementation merged (dashboard, requests, objects).

## Last Updated

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
