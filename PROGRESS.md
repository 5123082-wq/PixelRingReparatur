# PROGRESS

Short global status only. Detailed session notes belong to folder-level `Progress Log` sections.

## Context Beacon

Purpose: fast global orientation before work. Read this beacon first and do not read the full file by default.

Startup reading rule:

- Read this `Context Beacon` and the latest 2-3 log entries only.
- If the user asks what happened earlier or a task continues an older checkpoint, read older entries in small 2-3 entry batches by date or domain.
- Prefer the linked domain `Progress Log` for detailed history; keep this file as a short global status map.

Latest checkpoint:

- Date: 2026-06-24
- Current stage: Applied approved CorelDRAW SVG logos to the public website header: full `/brand/logo-full-light.svg` for tablet/desktop and compact `/brand/logo-compact-light.svg` for mobile, both cropped to web-ready viewBoxes; logo rendering now uses stable height-based sizing instead of width scaling, and the separate `SERVICE` header badge was removed because the logo includes `TECHNICAL SERVICE`.
- Next action: Owner visually reviews `/de` desktop, tablet, and mobile header sizing after the fixed-height responsive logo swap.

- Date: 2026-06-23
- Current stage: Tightened Google Ads conversion tracking: Ads tag loading now requires explicit public env enablement, website/chat/Telegram request forms report the Google Ads lead conversion only after successful request creation, and the existing `/business` service-audit CTA now routes into the tracked request form instead of a direct mailto link.
- Next action: Set `NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true` in the production build environment, redeploy, then verify `AW-18220277188/NDbWCL3P5LocEMS7jfBD` with Google Tag Assistant and Google Ads diagnostics.

- Date: 2026-06-23
- Current stage: Created a temporary 4-page German PDF and PowerPoint presentation prototype for the `/business` partner-service offer, including a customer-portal control slide, and saved it under `DesignPrototip/pixelring-partner-service-presentation/` for design/content approval.
- Next action: Owner reviews the PDF prototype and decides whether it should replace the current downloadable business presentation on the website.

- Date: 2026-06-23
- Current stage: Added a localized `/business` partner-service block for Facility Management, Ladenbau, Projektmanagement, and Werbetechnik companies that manage customer objects and need technical support for Werbeanlagen/Lichtwerbung diagnostics and repair.
- Next action: Owner visually reviews the new `/de/business` block on desktop/mobile and decides whether the offer should later become a dedicated SEO landing page.

- Date: 2026-06-20
- Current stage: Reduced domain startup context for public website, admin/CMS, content/SEO/GEO, AI assistant, and client portal docs by adding domain `Context Beacon` / `Read Depth` blocks and moving long README or rollout progress history into dedicated progress-log files where useful.
- Next action: Keep future domain README files as routers only; when detailed history grows, append it to the dedicated domain progress log instead of the README.

- Date: 2026-06-20
- Current stage: Optimized agent startup context rules so `PROGRESS.md` is read as a short beacon plus the latest 2-3 entries instead of as a full historical log; older entries now belong behind an explicit detailed-log boundary.
- Next action: Keep future `PROGRESS.md` updates short and move detailed session notes into the relevant domain `Progress Log`.

- Date: 2026-06-20
- Current stage: Restored approved German CMS legal source text for `privacy/de` and `impressum/de` from CMS revisions after the May baseline seed overwrite; legal routes now render dynamically from CMS, reject placeholder/stale legal CMS text, and the CMS baseline seed skips legal pages so it cannot overwrite them again.
- Next action: Deploy/push the fix to `main`, then verify `/ru/privacy`, `/ru/impressum`, `/de/privacy`, and `/de/impressum` no longer show seed placeholders.

- Date: 2026-06-18
- Current stage: Added compact external-entry navigation and localized portal UI copy for DE/EN/RU/TR/PL/AR on active/expired portal claim pages, legacy claim/login verify fallbacks, unauthenticated portal/access-required/demo gates, request detail/chat UI, Telegram request form, and Telegram return page without changing token, verification, or claim-link behavior.
- Next action: Owner visually reviews `/ar/portal`, `/ar/portal/claim?token=expired`, `/ar/portal/claim/verify`, `/ar/portal/requests/PR-DEMO-4821` with demo access, and `/ru/telegram/request?t=expired` on desktop/mobile, then continues the activation-link and Telegram QA after deployment.

Read deeper only when:

- continuing a specific older checkpoint from the detailed log below;
- updating a module's current status;
- checking what changed on a date;
- preparing deployment, migration, or owner-review follow-up from a prior entry.

## Detailed Log

Historical working log. Do not read this section at startup. Read it only in small batches when a task needs older context.

- Date: 2026-06-17
- Current stage: Implemented the post-PR portal activation handoff: website/browser-chat requests now trigger a non-blocking activation invitation email through the existing email infrastructure after claim-link creation, Telegram secure intake creates/returns portal claim links with status/portal/return buttons and optional email invite, and verified status lookup can show a safe portal activation prompt while CRM manual claim-link flow remains token-safe.
- Next action: Manually QA website/chat email invite delivery, Telegram secure intake with email and without email, status-page active/expired activation states, and CRM manual claim-link issuance after deployment.

- Date: 2026-06-17
- Current stage: Restored the approved light repair-symptom request drawer design on `/[locale]/leistungen/werbeanlagen-reparatur` while preserving the current contact-form structure and contact-policy behavior: required email, optional phone, location, issue type, message, attachments, status link, and portal handoff remain intact.
- Next action: Owner visually reviews the drawer on DE/RU desktop and mobile, especially the new contact-policy fields inside the restored light design.

- Date: 2026-06-17
- Current stage: Implemented browser-chat and Telegram secure-form UI/copy alignment for the new contact policy: browser chat now requires email and keeps phone optional/secondary, chat drafts store email and phone separately, Telegram secure form uses optional split email/phone fields, and Telegram confirmation wording points to status by link while keeping Telegram as the dialog channel.
- Next action: Manually QA browser chat with email-only, email+phone, phone-only draft, and Telegram secure form with no contact, phone-only, and email+phone; continue later with activation email/buttons/status-page portal prompts.

- Date: 2026-06-17
- Current stage: Implemented Phase 1 backend contact-policy contracts for portal activation: website form and browser-chat PR creation require valid email before attachments/PR creation, optional phone is stored only as secondary contact, Telegram secure intake can create PRs with optional or absent email/phone, and verified portal request creation continues using the portal email without a new claim link.
- Next action: Manually QA website form, browser chat, Telegram secure intake, and verified portal request creation after deployment; continue later with activation email/buttons/text work.

- Date: 2026-06-17
- Current stage: Documented the Telegram/email/client-portal activation plan: website and browser-chat PR creation should require email, Telegram remains the only email-optional PR path, post-PR Telegram messages should include both status and portal activation links without implying Telegram status tracking, and WhatsApp/email remain manual or secure-link handoff channels.
- Next action: Owner reviews the plan in `docs/04_client_portal/telegram_email_portal_activation_plan.md`; after approval, implement backend channel policy before UI copy changes.

- Date: 2026-06-17
- Current stage: Reworked Telegram assistant routing toward a state-machine controller: explicit conversation states now route active PR status/follow-up/new-request turns before LLM, return commands read the active PR context, active cases keep their original summary instead of being overwritten by short chat replies, and controller tests cover the broken real Telegram phrases.
- Next action: Deploy and retest the real Telegram flow end to end: fresh chat, secure form submit, PR confirmation, return to chat, `Ok`, `Что дальше?`, `Как дела с моей заявкой?`, `У меня нет заявки?`, and an explicit separate new-problem request.

- Date: 2026-06-17
- Current stage: Added a Telegram active-request backend guard: after a PR is issued, AI replies that try to reopen or reprepare the secure form are replaced with a deterministic "request already received, continue here in Telegram" response.
- Next action: Deploy and retest the real Telegram post-submit flow: submit the form, press "continue in chat", send `Ok` / `Что дальше?` / `Есть информация?`, and confirm no secure-form loop appears.

- Date: 2026-06-17
- Current stage: Fixed Telegram unknown-contact AI intake handoff: when the assistant emits the intake action after natural consent, Telegram now creates the one-time secure intake link and attaches the real form button instead of sending only a text promise.
- Next action: Deploy and retest the real Telegram flow from a fresh chat: `/start`, describe broken sign, agree to create the request, confirm the secure form button appears and submits back into the Telegram case.

- Date: 2026-06-16
- Current stage: Hardened AI assistant rules and Telegram active-request handling: the prompt now separates hard rules, reference knowledge, channel modes, and action markers; runtime guards cover prompt injection, PII, status intent, and active Telegram PR chats now continue the current request without reopening the secure form or duplicating the create-request button.
- Next action: Deploy and retest representative website and Telegram conversations: greeting, small talk, new signage problem, natural intake consent, status question, manager callback, prompt-injection attempt, and Telegram post-PR photo/detail follow-up.

- Date: 2026-06-16
- Current stage: Hotfixed Telegram known-contact intent/status handling: broad pre-AI keyword matching for repeat requests was removed, `/request` remains the deterministic command, ordinary known-customer messages now let the shared AI decide whether to show a Telegram confirmation button, and status questions can use the active PR via `<<SHOW_STATUS>>` instead of asking the customer for the number again.
- Next action: Deploy and retest Telegram with: `Привет`, `Что с моей заявкой?`, `/request`, and a clear new-problem request; confirm status questions get a status button and only the clear request path shows the create button.

- Date: 2026-06-16
- Current stage: Changed Telegram repeat-request flow so known Telegram contacts no longer open the secure website form for ordinary new requests: `/request`/new-request intent now sends an inline confirmation button, confirmation creates a new PR from the saved contact without exposing contact data to the assistant, Telegram routing switches to the new case, and CRM replies can still fall back to Telegram chat IDs stored in previous case messages.
- Next action: Deploy and test with a real Telegram account: first create/lock a contact, then send `/request`, confirm the inline button, verify the new PR is created without the form, send a photo/detail afterward, and spot-check manager replies from both the old and new Telegram cases.

- Date: 2026-06-16
- Current stage: Added Telegram secure intake handoff baseline: one-time hashed intake links, dedicated `/[locale]/telegram/request` form page, `/[locale]/telegram/return` fallback page, Telegram submit API that formalizes the existing Telegram case, PR/status confirmation buttons, and `/request`/form-intent webhook handling.
- Next action: Deploy the code, test `/request` in a real Telegram chat, submit the form, and confirm the same CRM case receives the PR number, timeline message, attachments, Telegram confirmation, status button, and return flow.

- Date: 2026-06-16
- Current stage: Tightened Telegram and public website intake safety: Telegram form submissions now reject mismatched contacts for already-linked Telegram cases, unverified Telegram/public form contacts no longer sync into `CustomerProfile`, repeat public case-cookie submissions are blocked with `verification_required` before file storage/PR creation, and verified portal-session request creation still issues PR numbers immediately.
- Next action: QA first public form submit, repeat submit from the same browser cookie, verified portal new-request submit, Telegram locked-contact submit, Telegram mismatched-contact rejection, and chat-intake draft conversion.

- Date: 2026-06-16
- Current stage: Added the seventh before/after visual to the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel: the moisture/short-circuit card now uses owner-provided PixelRing rain-damage/repaired WebP images with the existing hover/focus/touch repaired preview behavior.
- Next action: Owner visually reviews `/ru/leistungen/werbeanlagen-reparatur` and `/de/leistungen/werbeanlagen-reparatur` around the moisture/short-circuit card to confirm crop, overlay readability, and repaired-state hover behavior.

- Date: 2026-06-16
- Current stage: Reordered the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel by likely request demand: complete power-supply outage first, flickering light second, failed letters third, followed by moisture, mechanical damage, mounting, film, neon, and photo fallback.
- Next action: Owner visually reviews the RU/DE symptom carousel opening order and decides whether the same demand-led priority should be mirrored in any diagnostic prototype flows.

- Date: 2026-06-16
- Current stage: Added the sixth before/after visual to the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel: the power-supply card now uses owner-provided split PixelRing lightbox dark/illuminated WebP images with the existing hover/focus/touch repaired preview behavior.
- Next action: Owner visually reviews `/ru/leistungen/werbeanlagen-reparatur` and `/de/leistungen/werbeanlagen-reparatur` around the power-supply symptom card to confirm crop, overlay readability, and repaired-state hover behavior.

- Date: 2026-06-16
- Current stage: Added the fifth before/after visual to the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel: the neon-repair card now uses owner-provided PixelRing neon logo faulty/repaired WebP images with the existing hover/focus/touch repaired preview behavior.
- Next action: Owner visually reviews `/de/leistungen/werbeanlagen-reparatur` and `/ru/leistungen/werbeanlagen-reparatur` around the neon-repair card to confirm crop, overlay readability, and repaired-state hover behavior.

- Date: 2026-06-16
- Current stage: Added the fourth before/after visual to the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel: the film-defect card now uses owner-provided split PixelRing storefront film WebP images with the existing hover/focus/touch repaired preview behavior.
- Next action: Owner visually reviews `/de/leistungen/werbeanlagen-reparatur` and `/ru/leistungen/werbeanlagen-reparatur` around the film-defect card to confirm crop, overlay readability, and repaired-state hover behavior.

- Date: 2026-06-16
- Current stage: Added the third before/after visual to the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel: the mechanical-damage card now uses owner-provided PixelRing lightbox damaged/repaired WebP images with the existing hover/focus/touch repaired preview behavior.
- Next action: Owner visually reviews `/ru/leistungen/werbeanlagen-reparatur` and `/de/leistungen/werbeanlagen-reparatur` around the mechanical-damage symptom card to confirm crop, overlay readability, and repaired-state hover behavior.

- Date: 2026-06-16
- Current stage: Retuned the second before/after visual in the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel: the flickering-light card now uses a smooth animated WebP blended from two owner-selected PixelRing lightbox images and a repaired static WebP for hover/focus/touch preview.
- Next action: Owner visually reviews `/ru/leistungen/werbeanlagen-reparatur` and `/de/leistungen/werbeanlagen-reparatur` around the first two symptom cards to confirm the smoother flicker intensity, overlay readability, and shared PixelRing visual direction before generating the remaining card pairs.

- Date: 2026-06-15
- Current stage: Added the first before/after hover visual pilot to the `/[locale]/leistungen/werbeanlagen-reparatur` symptom carousel: the letter-outage card now uses owner-provided PixelRing channel-letter images, showing the failed letter by default and the repaired illuminated state on hover/focus/touch.
- Next action: Owner visually reviews `/ru/leistungen/werbeanlagen-reparatur` and `/de/leistungen/werbeanlagen-reparatur` around the symptom carousel to confirm the PixelRing before/after direction before generating the remaining card pairs.

- Date: 2026-06-15
- Current stage: Replaced all three `/[locale]/leistungen/werbeanlagen-reparatur` after-restoration proof card visuals with owner-provided photos and redesigned the proof cards into cleaner full-image overlay cards that show only tag and title, removing the separate white text footer and the smaller result line while preserving the pharmacy hover image and localized alt text across DE/EN/RU/TR/PL/AR.
- Next action: Owner visually reviews `/de/leistungen/werbeanlagen-reparatur` and `/ru/leistungen/werbeanlagen-reparatur` around the `Ihre Werbung wird wieder sichtbar` proof strip to confirm the simplified full-image card rhythm, overlay readability, mobile stacking, and the pharmacy hover transition.

- Date: 2026-06-14
- Current stage: Moved the public home `Sichtbare Qualität` branding/print card one position earlier in the carousel render order, placing it before maintenance/audit while preserving its video media, service link, and localized copy across DE/EN/RU/TR/PL/AR.
- Next action: Owner visually reviews `/de` and `/ru` home carousel order: Montage, repair, branding/print, maintenance/audit, LED, dismantling.

- Date: 2026-06-14
- Current stage: Replaced the public home `Sichtbare Qualität` repair/light-advertising card visual across DE/EN/RU/TR/PL/AR with the owner-provided illuminated facade-sign photo, converted to cropped WebP, and updated localized alt text.
- Next action: Owner visually reviews `/de` and `/ru` home around the repair carousel card to confirm the crop and overlay readability.

- Date: 2026-06-14
- Current stage: Connected the public home `Sichtbare Qualität` branding/print card to the owner-provided folienmontage MP4 as a muted looping background video across DE/EN/RU/TR/PL/AR, with a WebP poster fallback and localized video labels.
- Next action: Owner visually reviews `/de` and `/ru` home around the branding/print carousel card to confirm playback, crop, and overlay readability.

- Date: 2026-06-14
- Current stage: Replaced the public home `Sichtbare Qualität` montage card visual across DE/EN/RU/TR/PL/AR with the owner-provided night autohaus advertising-pylon photo, converted to cropped WebP, and updated localized alt text.
- Next action: Owner visually reviews `/de` and `/ru` home around the `Sichtbare Qualität` carousel to confirm the crop and overlay readability.

- Date: 2026-06-14
- Current stage: Retitled the `/[locale]/leistungen/werbeanlagen-reparatur` hero anchor CTA and proof/reference strip across DE/EN/RU/TR/PL/AR so they read as after-restoration examples instead of another symptom or case selector.
- Next action: Owner visually reviews `/de` and `/ru` `/leistungen/werbeanlagen-reparatur` around the proof/reference strip and decides whether the result-focused wording needs further tuning.

- Date: 2026-06-14
- Current stage: Replaced the montage/demontage service visual with the owner-provided sport-center facade image, converted to WebP and connected via a new cache-busting asset path across `/leistungen` hero/card usage and the montage detail hero while leaving existing alt text unchanged.
- Next action: Owner visually reviews `/de/leistungen` and `/de/leistungen/montage-demontage-werbeanlagen` to confirm the new photo crop works in both card and full-width hero contexts.

- Date: 2026-06-14
- Current stage: Unified the public full-bleed photo hero height across `/leistungen`, service detail pages, `/probleme-loesungen`, `/referenzen`, and `/business` to `h-[520px] sm:h-[440px] lg:h-[480px]`, leaving home/about/article heroes unchanged because they use different compositions.
- Next action: Owner visually reviews `/de/probleme-loesungen`, `/de/referenzen`, and `/de/business` at desktop width for crop and text density after the shorter hero height.

- Date: 2026-06-14
- Current stage: Reworked the public `/leistungen` hero carousel into canonical service-area slides that use the same imagery as the service cards: repair, LED modernization, audit/diagnostics, montage/demontage, and print/branding; old CMS hero image overrides no longer replace this service-area hero set.
- Next action: Owner visually reviews the `/de/leistungen` hero rotation and decides whether the slide copy, order, or hero crop should be tuned.

- Date: 2026-06-14
- Current stage: Generated and connected a dedicated montage/demontage signage visual for the public `/leistungen` montage card and `/leistungen/montage-demontage-werbeanlagen` detail hero, replacing the old generic maintenance image for that service.
- Next action: Owner visually reviews `/de/leistungen` and the montage detail page to decide whether the crop, realism, or service-card order needs further tuning.

- Date: 2026-06-14
- Current stage: Added a public header `Leistungen` dropdown with visible chevron, localized service links, desktop click/hover/focus behavior, and mobile accordion links to the service detail pages.
- Next action: Owner visually reviews `/de` desktop full header, scrolled hover header, and mobile menu to decide whether the dropdown width, opacity, or link labels need tuning.

- Date: 2026-06-14
- Current stage: Tightened Google Ads lead conversion tracking so the primary website/chat request conversion still fires only after a successful request is created and now sends the Google-recommended `value: 1.0` and `currency: EUR` parameters.
- Next action: After deployment, verify the conversion with Google Tag Assistant and Google Ads tag diagnostics; keep WhatsApp, Telegram, email, and later CRM-quality/order signals separate from the primary lead conversion unless separate conversion labels are created.

- Date: 2026-06-14
- Current stage: Updated the public home coverage map to show 12 separate German city nodes, adding Bremen, Hannover, Düsseldorf, and Dresden while keeping Köln separate; city nodes are smaller, receive a PixelRing terracotta arrival ring after route completion, routes render as screen-space apex arcs measured from the CSS-rotated Berlin/city positions, and the city/route overlay is rotated 15 degrees clockwise while the Germany dot-matrix underlay keeps its original pose.
- Next action: Owner visually reviews `/de` home coverage map on desktop/mobile and decides whether arc height, route brightness, or city labels need another visual tuning pass.

- Date: 2026-06-13
- Current stage: Reworked public home coverage-map streams from hundreds of animated DOM particles into lightweight static SVG route curves, removing flying dots while preserving city route context.
- Next action: Owner visually reviews `/de` home coverage map and decides whether the route lines should be brighter, subtler, or removed entirely.

- Date: 2026-06-13
- Current stage: Tuned the public home trust section card palette toward glass-style surfaces: benefit cards and the anti-portal block now use translucent white overlays, soft borders, medium blur, and only restrained PixelRing terracotta accents for hierarchy.
- Next action: Owner visually reviews `/de` home trust section and decides whether to further brighten card text, reduce blur, or soften the first-card accent.

- Date: 2026-06-13
- Current stage: Reworked the public home `Vorher / Nachher` proof rail card design so featured and small case cards keep their existing sizes but use dominant imagery with compact blurred text overlays, short bottom gradients, and mobile-safe horizontal rail behavior.
- Next action: Owner visually reviews `/de` home desktop/mobile and decides whether to tune overlay opacity, card crop positions, or add eager loading for the proof image if the LCP warning matters.

- Date: 2026-06-13
- Current stage: Reworked AI chat request-intake opening from phrase-list consent matching toward an intent-based handoff: after a problem is known, the chat API can classify natural customer agreement as `accept_intake` and return `suggestIntake` while preserving existing marker and safety guards.
- Next action: Owner verifies the RU chat flow where the assistant offers to create a request and the customer responds naturally, confirming the inline intake card opens instead of stopping at a text promise.

- Date: 2026-06-13
- Current stage: Refined the customer portal request UX: the portal logout action is now parked at the lower-left sidebar, and request detail links opened from `/[locale]/portal` render as a large centered intercepted modal with blurred backdrop and outside-click close while direct request URLs still render as standalone safe detail pages.
- Next action: Owner visually reviews `/ru/portal` and `/de/portal`: open a request from the dashboard, confirm the modal size/backdrop/close behavior, and spot-check direct refresh on `/[locale]/portal/requests/[PR-number]`.

- Date: 2026-06-13
- Current stage: Completed P1.1 rewrite for `/de/probleme-loesungen/dringende-reparatur-werbeanlage`: updated existing DE/EN/RU `urgent-repair` CMS articles with safety-bounded emergency content, explicit `selfRepairTips`, `Symptom -> Risiko -> Handlung` tables, Berlin/Brandenburg request context, and urgent CTA labels; updated code-backed DE/EN/RU hub cards and made article sidebar CTA labels use existing CMS article CTA fields.
- Next action: Owner reviews the DE article and hub card/modal flow, then continue the P1 weak-article sequence with `werbeanlage-wackelt` or `folie-ist-ausgeblichen`.

- Date: 2026-06-13
- Current stage: Connected the customer portal with the public site navigation: portal dashboard and request detail now expose the same language switcher plus a localized website link, and the public home header shows a localized portal CTA when a real or demo portal session is active.
- Next action: Owner visually reviews the portal/site loop on `/de` and `/ru`: portal language switch, `Zur Website`/`На сайт`, and the authenticated `Zum Portal`/`В кабинет` return CTA from the home page.

- Date: 2026-06-13
- Current stage: Simplified the customer portal MVP surface toward a classic request dashboard: active navigation now shows only overview, requests, photo reports, and new request; future B2B-suite modules are hidden from the visible portal; request detail now prioritizes next step, customer data, photo report, customer files, status history, and chat.
- Next action: Owner visually reviews `/de/portal`, `/ru/portal`, and a representative request detail page; then decide whether to further localize test request content, collapse old chat history, or add real secure photo-report downloads.

- Date: 2026-06-13
- Current stage: Completed P0.1 for `/de/probleme-loesungen`: cleaned dirty German CMS overview copy through the CMS Page API with audit/revision, added Article/BreadcrumbList JSON-LD dates on problem article pages, fixed mobile article overflow at 360/390/430 px, and limited duplicated structured sections on complete markdown articles while keeping fallback sections for weak articles.
- Next action: Continue the modernization plan with either CTA/local trust-block design for the current articles or the first P1 rewrite, preferably `dringende-reparatur-werbeanlage`.

- Date: 2026-06-13
- Current stage: Refreshed the AI assistant baseline Markdown knowledge files under `signage-service/knowledge_base/`, replacing obsolete ring-light/Dusseldorf repair-shop context with compact signage-service scope, request intake, safety, FAQ, and boundary guidance.
- Next action: QA chat prompts where no CMS article is retrieved, then tune the baseline wording or retrieval rules if the assistant still falls back incorrectly.

- Date: 2026-06-13
- Current stage: Added a temporary live CMS knowledge retrieval layer for the AI assistant so public chat ranks published CMS articles by the latest user message and sends compact structured article fragments instead of broad full-article prompt injection.
- Next action: QA representative DE/RU chat prompts against published problem articles, then decide whether to add automatic chunk indexing, embeddings/vector retrieval, OpenAI File Search evaluation, or a draft preview assistant mode.

- Date: 2026-06-13
- Current stage: Saved the independent `/de/probleme-loesungen` content cluster audit as a raw source, created `docs/07_content_ai_seo/probleme_loesungen_cluster_modernization_plan.md` as the active step-by-step plan, deleted superseded problem-article prompt/template docs, and archived legacy SEO/public-website planning docs under `docs/13_references_archive/seo_content_legacy/`.
- Next action: Start with P0 German QA/CTA fixes or the first P1 weak article rewrite from `docs/07_content_ai_seo/probleme_loesungen_cluster_modernization_plan.md`.

- Date: 2026-06-12
- Current stage: Reworked the public home trust, FAQ, form-helper, coverage, bento, and final CTA copy across DE/EN/RU/TR/PL/AR toward concrete signage-service language; synchronized published CMS `home/global` records; added a real service visual and anti-portal trust block; verified `/de`, `/ru`, and `/ar` mobile widths 360/390/430 with visible cookie banner and no document horizontal overflow.
- Next action: Owner visually reviews the updated home page on `/de`, `/ru`, and `/ar`, especially TrustSection, FAQ wording/order, and footer/cookie-banner spacing.

- Date: 2026-06-11
- Current stage: Added and tuned a public home `Vorher / Nachher` proof section directly after the hero, now using a full-bleed Apple-like horizontal two-row card rail with one large before/after lightbox card, three columns of smaller service-case cards, one large closing card, neutral card shadows/backgrounds, improved RU copy, localized DE/EN/RU/TR/PL/AR text, and local reference assets.
- Next action: Owner visually reviews `/ru` and `/de` home on desktop/mobile, especially the horizontal rail behavior, proof-card proportions, image choices, and cookie-banner overlap.

- Date: 2026-06-09
- Current stage: Reworked the public home `Sichtbare Qualität` carousel toward an Apple-like visual rhythm: taller/narrower cards, lighter gray section surface, quieter top arrow controls, no dot indicators, top-aligned non-linked hashtag labels/titles, retained existing card descriptions, single arrow service link per card, and corrected image `sizes`.
- Next action: Owner visually reviews `/de` home carousel on desktop/mobile, especially card height, text readability over images, hashtag feel, and bottom arrow link treatment.

- Date: 2026-06-09
- Current stage: Unified the `/[locale]/leistungen/werbeanlagen-reparatur` section typography around the approved symptom-section H2 scale, including the proof strip, problem links, repair calculator, scope/service sections, FAQ, final next-step CTA, and softer card-heading weights.
- Next action: Owner visually reviews the repaired heading rhythm on `/de/leistungen/werbeanlagen-reparatur`, especially long wrapped H2 titles and carousel card-title weight.

- Date: 2026-06-09
- Current stage: Reworked the `/[locale]/leistungen/werbeanlagen-reparatur` visible symptom section from a wrapping card grid/show-more pattern into a single Apple-like horizontal carousel with desktop arrow controls, swipe-friendly mobile behavior, and a separate no-image fallback CTA for cases that do not match the listed symptoms.
- Next action: Owner visually reviews the symptom carousel and fallback CTA on `/de/leistungen/werbeanlagen-reparatur` desktop/mobile before deciding whether to tune card height, visible card count, or arrow placement.

- Date: 2026-06-09
- Current stage: Reworked the final `/[locale]/leistungen/werbeanlagen-reparatur` next-step CTA into a restrained Apple-like image-led section with one large heading, one dark rounded visual card, a single repair request action, and the existing repair hero service photo integrated as the primary visual.
- Next action: Owner visually reviews the final CTA on `/de/leistungen/werbeanlagen-reparatur` desktop and mobile before deciding whether to generate a more bespoke PixelRing CTA image.

- Date: 2026-06-09
- Current stage: Reworked the `/[locale]/leistungen/werbeanlagen-reparatur` visible symptom cards into an Apple-like image-first interactive card rail with generated lightweight WebP defect visuals, short visible preview copy, localized category tags, and the existing request drawer preserved for full SEO/service text; simplified the following proof block into a lighter visual strip with one references link.
- Next action: Owner visually reviews the new symptom card rail on `/de/leistungen/werbeanlagen-reparatur` and mobile before deciding whether to reuse the pattern on other diagnostic/service blocks.

- Date: 2026-06-08
- Current stage: Reworked `/[locale]/leistungen/werbeanlagen-reparatur` into the approved medium UX variant: action-first hero CTAs, shorter visible symptom cards with `show more`, compact proof strip from safe reference assets, lighter problem links, raised repair-orientation calculator, simplified scope/service blocks, and a simpler final photo CTA.
- Next action: Owner visually reviews `/ru/leistungen/werbeanlagen-reparatur` and `/de/leistungen/werbeanlagen-reparatur` on desktop/mobile before applying the pattern to other service pages.

- Date: 2026-06-08
- Current stage: Added the Google Ads lead conversion label `NDbWCL3P5LocEMS7jfBD` for the `Service starten` conversion so successful website/chat requests can report to `AW-18220277188/NDbWCL3P5LocEMS7jfBD`.
- Next action: Merge/deploy the Google Ads tracking PR and verify the conversion with Google Tag Assistant and Google Ads tag diagnostics.

- Date: 2026-06-07
- Current stage: Added minimal Google Ads measurement infrastructure for the public site: consent-default-denied Google tag `AW-18220277188`, localized consent banner, and no-op lead conversion helper until the Google Ads conversion label is available.
- Next action: Add `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_LABEL` after creating/finding the website lead conversion in Google Ads, then verify with Google Tag Assistant before scaling the campaign.

- Date: 2026-06-06
- Current stage: Reworked `/[locale]/leistungen/lichtwerbung-led-modernisierung` closer to the approved `werbeanlagen-reparatur` page rhythm: removed the generic post-hero CTA strip, placed one consolidated LED decision tool directly after the hero, moved problem links before the modernization scope cards, and kept one final page CTA.
- Next action: Owner visually reviews `/de/leistungen/lichtwerbung-led-modernisierung` against the approved repair page structure before any broader reuse or further visual iteration.

- Date: 2026-06-05
- Current stage: Started the first deferred LED-modernization problem article track by creating the RU review draft for `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` in `docs/07_content_ai_seo/problem_articles/люминесцентные трубки или led – 07/`; the draft includes small card, modal, full article, SEO/CMS draft fields, and internal source-backed AI notes, but no CMS/database, seed, sitemap, route, or localization changes.
- Next action: Owner reviews the RU markdown draft; after approval, prepare the German canonical draft and only later consider CMS/database synchronization.

- Date: 2026-06-05
- Current stage: Modernized `/[locale]/leistungen/lichtwerbung-led-modernisierung` as a broader `Modernisierung von Lichtwerbung & Außenwerbung` service page without `Berlin & Brandenburg` as visible regional positioning; added LED/task cards, `Passende Problemseiten`, request checklist, expanded FAQ, service-specific `NEXT STEP`, LED-specific `hasOfferCatalog`, and visually aligned the decision/problem/checklist blocks closer to the approved `werbeanlagen-reparatur` warm card pattern.
- Next action: Owner visually reviews `/de/leistungen/lichtwerbung-led-modernisierung` on desktop/mobile, including the new `Reparatur / Teilmodernisierung / LED-Umrüstung / Ersatzlösung` decision block; future problem articles remain deferred until explicit approval.

- Date: 2026-06-02
- Current stage: Created `docs/07_content_ai_seo/service_page_led_modernisierung_plan.md` as the active plan for strengthening `/[locale]/leistungen/lichtwerbung-led-modernisierung`; future problem articles for old fluorescent tubes to LED and neon repair vs LED conversion are documented as deferred backlog in `docs/07_content_ai_seo/problem_articles/входящие новые статьи/led_modernisierung_future_problem_articles.md`, not current implementation.
- Next action: Modernize the LED service page first, then start article markdown drafts only after explicit owner approval.

- Date: 2026-06-02
- Current stage: Documented the reusable service-page pattern from `/[locale]/leistungen/werbeanlagen-reparatur` in `docs/07_content_ai_seo/service_page_pattern_werbeanlagen_reparatur.md` and added a next-agent handoff in `docs/07_content_ai_seo/service_page_neighbor_handoff.md` for applying the structure to neighboring service pages without copying the repair calculator.
- Next action: Use the handoff documents before strengthening `LED-Modernisierung`, `Audit & Diagnose`, `Montage & Demontage`, or `Druck & Branding` service pages.

- Date: 2026-06-02
- Current stage: Strengthened `/[locale]/leistungen/werbeanlagen-reparatur` with a compact `Passende Problemseiten` block linking to four relevant problem pages, replaced the generic final CTA on that page with a repair-specific `NEXT STEP` decision block linking to four related service pages, shortened localized meta descriptions, and added `hasOfferCatalog` to the Service JSON-LD.
- Next action: Owner visually reviews the revised DE repair page around the new problem-links block and final next-step block before applying the same pattern to other service pages.

- Date: 2026-06-02
- Current stage: Added a compact public home `Leistungen` service navigator after the trust section: six localized service cards now link into repair, LED modernization, audit/diagnostics, installation/dismantling, print/branding, and the general services overview without adding another heavy carousel.
- Next action: Owner visually reviews the new `/de` home services block on desktop/mobile and decides whether the section needs CMS editability or image-backed cards later.

- Date: 2026-06-02
- Current stage: Updated the public home `Typische Servicefälle` carousel into a lighter internal-linking surface: service-case cards are more compact and now show localized linked issue/service pills above the quote, including DE links to repair, LED flicker, film, letter outage, rain failure, and montage pages.
- Next action: Owner visually reviews the revised `/de` service-case carousel on desktop/mobile before deciding whether to apply a stronger sticky-link navigation pattern.

- Date: 2026-06-01
- Current stage: Converted the `/[locale]/ueber-uns` who-we-are visual into a two-image collage with the new PixelRing service team vehicle photo as the main image and the service-vehicle repair photo as a supporting overlay, with localized alt text.
- Next action: Owner visually reviews the new who-we-are collage on `/de/ueber-uns` and `/ru/ueber-uns`.

- Date: 2026-06-01
- Current stage: Replaced the `/[locale]/ueber-uns` who-we-are section blueprint image with the new PixelRing service vehicle asset and localized the image alt text across DE/EN/RU/TR/PL/AR.
- Next action: Owner visually reviews the new service-vehicle image in the `/de/ueber-uns` who-we-are section.

- Date: 2026-06-01
- Current stage: Adjusted the `/[locale]/ueber-uns` who-we-are section layout so the text column appears on the left and the image appears on the right at desktop widths.
- Next action: Owner reviews the updated `/de/ueber-uns` who-we-are section composition.

- Date: 2026-05-31
- Current stage: Rewrote the `/[locale]/ueber-uns` who-we-are block across DE/EN/RU/TR/PL/AR to start with PixelRing as a service company for signage, repair, maintenance, and modernization instead of leading with marketplace/platform negation.
- Next action: Owner reviews the revised who-we-are block on `/ru/ueber-uns` and `/de/ueber-uns`.

- Date: 2026-05-31
- Current stage: Rewrote the `/[locale]/ueber-uns` materials lead and note across DE/EN/RU/TR/PL/AR so the premium-materials section explains durability, light/color stability, weather resistance, maintainability, and supplier trust without vague "strengthens the result" wording.
- Next action: Owner reviews the revised materials block on `/ru/ueber-uns` and `/de/ueber-uns`.

- Date: 2026-05-31
- Current stage: Rewrote the `/[locale]/ueber-uns` request-process block across DE/EN/RU/TR/PL/AR to remove literal audit jargon such as "technically clarify" and replace it with plain steps from first message to work plan.
- Next action: Owner reviews the revised process block on `/ru/ueber-uns`, then continues section-by-section copy cleanup if needed.

- Date: 2026-05-31
- Current stage: Replaced the awkward `/[locale]/ueber-uns` "technical service point" wording in the who-we-are block with accountable service-partner language across DE/EN/RU/TR/PL/AR.
- Next action: Owner reviews the revised who-we-are block copy on `/ru/ueber-uns` and `/de/ueber-uns` before further copy refinement.

- Date: 2026-05-31
- Current stage: Reverted the `/[locale]/ueber-uns` hero copy from audit-style technical-service wording back to the earlier warmer brand-service framing across DE/EN/RU/TR/PL/AR and synced CMS records.
- Next action: Owner reviews the restored `/ru/ueber-uns` and `/de/ueber-uns` hero copy before further structural or terminal placement changes.

- Date: 2026-05-31
- Current stage: Removed the conversion-style hero CTA buttons and microcopy from `/[locale]/ueber-uns` after owner review; About now keeps request action in the final CTA while the hero stays informational.
- Next action: Owner visually reviews the cleaner About hero and decides whether the live terminal should remain there or move lower.

- Date: 2026-05-31
- Current stage: Rebuilt the `/[locale]/ueber-uns` page around the audit-backed trust narrative: hero now states technical signage service from Berlin with above-the-fold CTAs, and the page adds explicit who-we-are, serviced systems, 4-step request flow, repair-before-replacement, trust-safe materials, and anonymized-feedback context across MVP locales.
- Next action: Owner reviews `/ru/ueber-uns` and `/de/ueber-uns` for content order, block rhythm, and whether the live terminal should remain in the hero or move lower as a process/status example.

- Date: 2026-05-31
- Current stage: Strengthened the `/[locale]/ueber-uns` materials strip heading across DE/EN/RU/TR/PL/AR so it explicitly emphasizes premium materials and trusted/verified supply partners as a trust signal.
- Next action: Owner visually reviews the updated materials heading on `/ru/ueber-uns` and spot-checks DE/EN wording before deciding whether the strip needs supporting copy under the title.

- Date: 2026-05-31
- Current stage: Made the `/[locale]/ueber-uns` hero service terminal feel live: dispatch rows now cycle through localized real-time statuses/timestamps on the client, with a safer demo-live note that avoids exposing customer/CRM internals.
- Next action: Owner visually reviews the live ticker rhythm on `/ru/ueber-uns`, especially desktop/mobile readability and whether the update speed feels natural.

- Date: 2026-05-31
- Current stage: Reframed the public home `Sichtbare Qualität` carousel as service-aligned internal linking: legacy work cards now normalize to real PixelRing service categories, hashtag pills link to relevant `Leistungen` targets, card titles link to `Referenzen`, and a new branding/print storefront image replaces the generic design-office visual.
- Next action: Owner visually reviews the updated `/de` carousel and decides whether the same click model should be reused in other proof/gallery surfaces.

- Date: 2026-05-31
- Current stage: Reframed the public home FAQ as B2B-only across DE/EN/RU/TR/PL/AR: removed the private-individuals question and added four commercial-service questions covering B2B scope, multi-site requests, third-party-built signage, and initial assessment inputs; synced the published CMS home FAQ records.
- Next action: Owner visually reviews the longer RU home FAQ on desktop/mobile and decides whether the accordion spacing should be tightened for seven questions.

- Date: 2026-05-31
- Current stage: Added four dedicated localized service-detail pages under `/[locale]/leistungen/[slug]` for LED/light modernization, signage audit/diagnostics, installation/dismantling/relocation, and print/branding materials; the pages now use the existing Leistungen/repair photo-hero pattern and locale-aware internal links.
- Next action: Owner visually reviews the new DE service-detail pages and spot-checks RU/AR text direction and wrapping before copy refinement or CMS-editability decisions.

- Date: 2026-05-31
- Current stage: Made hero breadcrumbs surface-aware: `/[locale]/ueber-uns` now uses a warm light breadcrumb backdrop on the beige hero surface, while photo-based hero pages continue using the stable dark media treatment through the shared breadcrumb component.
- Next action: Owner visually reviews `/de/ueber-uns` breadcrumbs on desktop/mobile and spot-checks photo hero pages for the unchanged dark media breadcrumb treatment.

- Date: 2026-05-31
- Current stage: Replaced the `/[locale]/ueber-uns` hero eyebrow text with the standard PixelRing terracotta accent line and lowered the H1/intro stack slightly while preserving the compact breadcrumb and ticker alignment.
- Next action: Owner visually reviews the left hero copy rhythm on `/de/ueber-uns` before further size or spacing changes.

- Date: 2026-05-31
- Current stage: Tightened the `/[locale]/ueber-uns` hero layout so its breadcrumbs use the same 24px top offset as neighboring pages, the post-breadcrumb gap is smaller, and the text column aligns vertically with the ticker terminal.
- Next action: Owner visually reviews the compact `/de/ueber-uns` hero spacing before further typography or terminal-card changes.

- Date: 2026-05-31
- Current stage: Simplified the `/[locale]/ueber-uns` hero terminal by removing the `Diagnose-Scan` tab/scan workflow and keeping `Einsatz-Ticker` as the single visible terminal section.
- Next action: Owner reviews the ticker-only terminal in the `/de/ueber-uns` hero before further copy or layout adjustments.

- Date: 2026-05-31
- Current stage: Refined `/[locale]/ueber-uns` hero structure: kept breadcrumbs, main hero copy, and service simulator in the hero, and moved the three hero benefit items into a separate full-width section directly below.
- Next action: Owner visually comments on the new `/de/ueber-uns` hero and benefit band before further spacing/accent adjustments.

- Date: 2026-05-31
- Current stage: Added localized hero breadcrumbs to `/[locale]/ueber-uns` while preserving its existing light hero layout and service simulator; no accent-line or layout redesign applied yet.
- Next action: Owner comments on the `/de/ueber-uns` hero before any further visual changes such as accent line, spacing, or hero restructuring.

- Date: 2026-05-31
- Current stage: Applied the same secondary-page hero pattern to `/[locale]/probleme-loesungen`, `/[locale]/business`, and `/[locale]/referenzen`: localized hero breadcrumbs and the PixelRing terracotta accent line above H1, with mobile hero height aligned to the `/leistungen` pattern.
- Next action: Owner visually reviews the three DE pages, then decides whether `/ueber-uns` should receive the same hero treatment.

- Date: 2026-05-31
- Current stage: Aligned the `/[locale]/leistungen` hero with the repair landing page visual pattern: added localized hero breadcrumbs and the PixelRing terracotta accent line above the rotating H1.
- Next action: Owner visually reviews `/de/leistungen` on desktop and mobile, then decides whether to apply the same hero pattern to other secondary landing pages.

- Date: 2026-05-31
- Current stage: Updated the DE canonical SEO description and H1 on `/[locale]/leistungen/werbeanlagen-reparatur`: the title stays `Werbeanlagen-Reparatur Berlin & Brandenburg | PixelRing`, while the description now emphasizes defective signage in Berlin/Brandenburg, photo submission, and first assessment; the H1 is shortened to `Werbeanlagen-Reparatur in Berlin & Brandenburg`.
- Next action: Continue the strategic plan with the next agreed repair-page quick win: hero intro/CTA wording or legal-safe Gewährleistung wording.

- Date: 2026-05-31
- Current stage: Fixed mobile overflow/hero readability on `/[locale]/leistungen/werbeanlagen-reparatur`: long German hero and symptom headings now wrap safely, the repair page wrapper prevents horizontal bleed, mobile hero height separates breadcrumb from H1, and the current breadcrumb truncates instead of widening the viewport.
- Next action: Continue the strategic plan with the next agreed repair-page quick win: hero/CTA wording or legal-safe Gewährleistung wording.

- Date: 2026-05-31
- Current stage: Unified the `PixelRing` brand spelling inside the `/[locale]/leistungen/werbeanlagen-reparatur` repair landing page metadata, visible copy, JSON-LD, FAQ, and related repair diagnostic components. Portal demo references to `Pixel Ring GmbH` remain unchanged as separate demo/legal strings.
- Next action: Continue the strategic plan with the next agreed repair-page quick win: CTA/hero wording, mobile overflow cleanup, or legal-safe Gewährleistung wording.

- Date: 2026-05-31
- Current stage: Removed the upper `/[locale]/leistungen/werbeanlagen-reparatur#diagnose` diagnostic block from the repair landing page render path, leaving only the lower `/[locale]/leistungen/werbeanlagen-reparatur#diagnose-variante` calculator/card module.
- Next action: Owner visually verifies the shorter diagnostic flow on DE first, then spot-checks other MVP locales.

- Date: 2026-05-31
- Current stage: Reframed and re-synchronized the lower alternative `/[locale]/leistungen/werbeanlagen-reparatur#diagnose-variante` diagnostic module across DE/EN/RU/TR/PL/AR from diagnosis setup to a preliminary repair-cost calculator, with German as the canonical copy and localized non-binding budget language.
- Next action: Owner visually reviews the calculator intro, parameter pill, and diagnostic-card pill across DE/RU first, then the remaining MVP locales.

- Date: 2026-05-31
- Current stage: Strengthened the lower alternative `/[locale]/leistungen/werbeanlagen-reparatur#diagnose-variante` diagnostic-card disclaimer across DE/EN/RU/TR/PL/AR, using German as the canonical legal wording: non-binding information only, no contract, no binding offer, no binding cost commitment, and exact price only after review plus explicit Pixel Ring confirmation.
- Next action: Owner visually reviews the updated disclaimer text on DE/RU repair pages, especially line length in the lower diagnostic card on desktop and mobile.

- Date: 2026-05-31
- Current stage: Cleaned up the alternative `/[locale]/leistungen/werbeanlagen-reparatur#diagnose-variante` diagnostic calculator: separated construction types from fault symptoms, renamed the non-lit panel object so it no longer duplicates the film/surface symptom, localized the calculator across DE/EN/RU/TR/PL/AR, enabled it on all MVP locales, compacted the diagnostic card, and fixed RTL numeric rendering for AR.
- Next action: Owner visually reviews the updated calculator options and diagnostic-card behavior across RU/DE/EN/TR/PL/AR.

- Date: 2026-05-31
- Current stage: Added compact service-scope blocks and localized hero breadcrumb navigation to `/[locale]/leistungen/werbeanlagen-reparatur` across DE/EN/RU/TR/PL/AR; removed the now-duplicative visible primary photo-assessment section while keeping photo/request guidance in checklist and FAQ.
- Next action: Owner visually reviews the shorter repair page flow and hero breadcrumbs on RU/DE/AR; build and targeted page lint already pass, full lint still has unrelated existing backlog.

- Date: 2026-05-31
- Current stage: Localized the redesigned `/[locale]/leistungen/werbeanlagen-reparatur` photo-assessment diagnostic block across DE/EN/RU/TR/PL/AR with human symptom cards, likely-cause copy, safe next steps, and localized photo-assessment CTAs.
- Next action: Owner visually reviews the redesigned diagnostic block across the six repair landing page locales.

- Date: 2026-05-31
- Current stage: Redesigned the `/[locale]/leistungen/werbeanlagen-reparatur` short-answer diagnostic block from a table into a clearer marketing/SEO card section with symptom, likely cause, safe next step, and photo-assessment CTA; RU copy was rewritten for clarity.
- Next action: Owner visually reviews the RU repair landing page diagnostic block and decides whether to localize the improved wording depth across DE/EN/TR/PL/AR.

- Date: 2026-05-31
- Current stage: Applied owner-requested visual/legal cleanup and compact redesign to the `/[locale]/leistungen/werbeanlagen-reparatur` diagnostic module: unified the scenario list and diagnostic card into one equal-height block, removed the secondary assessment/scenario cards, switched the section to a warmer neutral palette, tightened spacing, and strengthened the non-binding estimate disclaimer.
- Next action: Owner visually reviews the RU repair landing page diagnostic module on desktop and mobile, then decides whether to apply further copy or layout refinements.

- Date: 2026-05-30
- Current stage: Implemented the confirmed SEO/GEO improvement pass for `/[locale]/leistungen/werbeanlagen-reparatur`: shortened page metadata, added Open Graph/Twitter metadata, expanded Service/LocalBusiness JSON-LD, added a localized short-answer symptom table for DE/EN/RU/TR/PL/AR, fixed repair workflow labels, improved hero image priority, contrast, footer heading order, TR/PL navigation text, and normalized HTTP `x-default` to the German canonical URL.
- Next action: Owner reviews the six repair landing pages visually, then decide whether to address the remaining global lint backlog before the next SEO release.

- Date: 2026-05-30
- Current stage: Closed urgent SEO/GEO follow-up from the read-only audit: added `/[locale]/leistungen/werbeanlagen-reparatur` to the public sitemap path set, cleaned homepage fallback metadata for DE/TR/PL, fixed `Referenzen` fallback metadata so it no longer emits an empty description, and documented the remaining SEO/GEO backlog in `docs/07_content_ai_seo/seo_geo_readonly_audit_2026-05-30.md`.
- Next action: Publish the missing TR/PL/AR problem articles, then extend problem-article structured data with BreadcrumbList and publish/update dates after owner review of the content backlog.

- Date: 2026-05-29
- Current stage: Added the alternative diagnostic calculator from the HTML prototype into the real `/[locale]/leistungen/werbeanlagen-reparatur` page as a separate comparison block after the existing diagnosis card. The original diagnosis card remains rendered. The new block uses compact selectors for construction type, typical reason/symptom, service area with manual city/PLZ input, planned/urgent visit choice, size/access/scope, budget orientation, photo checklist, and request drawer prefill.
- Next action: Owner compares the existing diagnosis card and the new alternative block on the live repair page, then decides which interaction model should remain.

- Date: 2026-05-28
- Current stage: Updated `/[locale]/leistungen/werbeanlagen-reparatur` diagnosis module from a simulator into a repair diagnostic card: left-side symptom selection, right-side access/size/scope inputs, area-based budget range, time estimate, safety-oriented urgent case handling, and request drawer prefill. Removed the separate cost estimator render from this repair page to keep one pricing-orientation flow.
- Next action: Owner visually reviews the new diagnostic card on RU and DE/fallback locales, especially mobile layout, budget wording, and request drawer prefill.

- Date: 2026-05-27
- Current stage: Created dedicated outdoor advertising repair landing page under `/[locale]/leistungen/werbeanlagen-reparatur` in Next.js. Added site-style interactive modules into the real page: a smooth 4-image optimized hero carousel, digital first-diagnosis simulator after the symptom grid, and cost estimator/request block before the final CTA. RU has dedicated copy; other locales use German fallback copy until translations are added.
- Next action: Owner reviews the updated real repair page, especially the hero carousel, digital diagnosis, and cost estimator/request blocks.

- Date: 2026-05-27
- Current stage: Published `peeling-film` / `folie-loest-sich` into CMS/database for all six MVP locales from the Markdown draft set. Added repeatable seed `db:seed:article-peeling-film`, preserved internal slug `peeling-film` with public route `folie-loest-sich`, populated structured `selfRepairTips`, verified CMS audit for this article, production build, and HTTP route checks for DE/EN/RU/TR/PL/AR.
- Next action: Owner visually reviews the six live article pages and modal self-repair block at `/[locale]/probleme-loesungen/folie-loest-sich`.

- Date: 2026-05-26
- Current stage: `/business` CMS migration i18n fallback fixed, visible language QA completed, and `node scripts/migrate-cms-content.mjs` applied successfully for all six locales (`de`, `en`, `ru`, `tr`, `pl`, `ar`). Visible mockup labels were corrected for German, Turkish, and Polish diacritics/language consistency, and an English `BusinessShowcase` German-word leak was removed.
- Next action: Owner visually verifies `/business` locales in the browser/CMS, especially `tr`, `pl`, and `ar`.

- Date: 2026-05-26
- Current stage: Reverted the `/leistungen` page bottom contact block (`LeistungenFooterCTA`) to match the clean B2B gradient CTA banner from the `/business` page. Rendered text with the terracotta vertical indicator line on the left and a single button (`Anfrage starten`) that triggers the contact modal on the right. Verified clean compilation and build.
- Next action: Owner reviews the reverted B2B contact block on the `leistungen` page at http://localhost:3000/de/leistungen.

- Date: 2026-05-26
- Current stage: Footer CTA and contact form redesigned: 12-column grid, Live-Chat as full-width button, WhatsApp/Telegram as horizontal icon-only buttons, and two-column form inputs. Fixed double scrollbars and LocationPicker dropdown clipping globally by making the form container overflow-visible by default. Refined ContactModal height to be 10% taller (638px), allowing address suggestions to open downwards naturally (best usability) while remaining completely inside the modal boundaries. Fixed border-radius corner clipping/bleeding on sidebar and form panels. Hid LocationPicker suggestions scrollbar for perfect geometry and clean border lines. Production build compiles successfully.
- Next action: Owner visually reviews the updated modal layout and autocomplete dropdown behavior in the browser at http://localhost:3000/de.


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

- Date: 2026-06-01
- Updated by: Codex
- **Current Stage**: Converted the `/[locale]/ueber-uns` who-we-are visual into a two-image collage with the new PixelRing service team vehicle photo as the main image and the service-vehicle repair photo as a supporting overlay, with localized alt text.
- **Next Action**: Owner visually reviews the new who-we-are collage on `/de/ueber-uns` and `/ru/ueber-uns`.

- Date: 2026-06-01
- Updated by: Codex
- **Current Stage**: Replaced the `/[locale]/ueber-uns` who-we-are section blueprint image with the new PixelRing service vehicle asset and localized the image alt text across DE/EN/RU/TR/PL/AR.
- **Next Action**: Owner visually reviews the new service-vehicle image in the `/de/ueber-uns` who-we-are section.

- Date: 2026-06-01
- Updated by: Codex
- **Current Stage**: Adjusted the `/[locale]/ueber-uns` who-we-are section layout so the text column appears on the left and the image appears on the right at desktop widths.
- **Next Action**: Owner reviews the updated `/de/ueber-uns` who-we-are section composition.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Rewrote the `/[locale]/ueber-uns` who-we-are block across DE/EN/RU/TR/PL/AR to start with PixelRing as a service company for signage, repair, maintenance, and modernization instead of leading with marketplace/platform negation.
- **Next Action**: Owner reviews the revised who-we-are block on `/ru/ueber-uns` and `/de/ueber-uns`.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Rewrote the `/[locale]/ueber-uns` materials lead and note across DE/EN/RU/TR/PL/AR so the premium-materials section explains durability, light/color stability, weather resistance, maintainability, and supplier trust without vague "strengthens the result" wording.
- **Next Action**: Owner reviews the revised materials block on `/ru/ueber-uns` and `/de/ueber-uns`.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Rewrote the `/[locale]/ueber-uns` request-process block across DE/EN/RU/TR/PL/AR to remove literal audit jargon such as "technically clarify" and replace it with plain steps from first message to work plan.
- **Next Action**: Owner reviews the revised process block on `/ru/ueber-uns`, then continues section-by-section copy cleanup if needed.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Replaced the awkward `/[locale]/ueber-uns` "technical service point" wording in the who-we-are block with accountable service-partner language across DE/EN/RU/TR/PL/AR.
- **Next Action**: Owner reviews the revised who-we-are block copy on `/ru/ueber-uns` and `/de/ueber-uns` before further copy refinement.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Reverted the `/[locale]/ueber-uns` hero copy from audit-style technical-service wording back to the earlier warmer brand-service framing across DE/EN/RU/TR/PL/AR and synced CMS records.
- **Next Action**: Owner reviews the restored `/ru/ueber-uns` and `/de/ueber-uns` hero copy before further structural or terminal placement changes.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Removed the conversion-style hero CTA buttons and microcopy from `/[locale]/ueber-uns` after owner review; About now keeps request action in the final CTA while the hero stays informational.
- **Next Action**: Owner visually reviews the cleaner About hero and decides whether the live terminal should remain there or move lower.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Rebuilt the `/[locale]/ueber-uns` page around the audit-backed trust narrative: hero now states technical signage service from Berlin with above-the-fold CTAs, and the page adds explicit who-we-are, serviced systems, 4-step request flow, repair-before-replacement, trust-safe materials, and anonymized-feedback context across MVP locales.
- **Next Action**: Owner reviews `/ru/ueber-uns` and `/de/ueber-uns` for content order, block rhythm, and whether the live terminal should remain in the hero or move lower as a process/status example.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Strengthened the `/[locale]/ueber-uns` materials strip heading across DE/EN/RU/TR/PL/AR so it explicitly emphasizes premium materials and trusted/verified supply partners as a trust signal.
- **Next Action**: Owner visually reviews the updated materials heading on `/ru/ueber-uns` and spot-checks DE/EN wording before deciding whether the strip needs supporting copy under the title.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Made the `/[locale]/ueber-uns` hero service terminal feel live: dispatch rows now cycle through localized real-time statuses/timestamps on the client, with a safer demo-live note that avoids exposing customer/CRM internals.
- **Next Action**: Owner visually reviews the live ticker rhythm on `/ru/ueber-uns`, especially desktop/mobile readability and whether the update speed feels natural.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Reframed the public home `Sichtbare Qualität` carousel as service-aligned internal linking: legacy work cards now normalize to real PixelRing service categories, hashtag pills link to relevant `Leistungen` targets, card titles link to `Referenzen`, and a new branding/print storefront image replaces the generic design-office visual.
- **Next Action**: Owner visually reviews the updated `/de` carousel and decides whether the same click model should be reused in other proof/gallery surfaces.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Added compact service-scope blocks and localized hero breadcrumb navigation to `/[locale]/leistungen/werbeanlagen-reparatur` across DE/EN/RU/TR/PL/AR; removed the now-duplicative visible primary photo-assessment section while keeping photo/request guidance in checklist and FAQ.
- **Next Action**: Owner visually reviews the shorter repair page flow and hero breadcrumbs on RU/DE/AR; build and targeted page lint already pass, full lint still has unrelated existing backlog.

- Date: 2026-05-31
- Updated by: Codex
- **Current Stage**: Unified and compacted the repair diagnostic module visual container, removed the lower assessment/scenario cards, changed the dominant blue background to a warmer neutral palette, and made the budget/time disclaimer explicitly non-binding and non-contractual.
- **Next Action**: Owner reviews the RU diagnostic section visually in the browser on desktop and mobile.

- Date: 2026-05-30
- Updated by: Codex
- **Current Stage**: Implemented the confirmed SEO/GEO improvement pass for `/[locale]/leistungen/werbeanlagen-reparatur`: metadata, social previews, JSON-LD, localized GEO answer/table content, workflow labels, first image priority, contrast, footer heading order, repair-page navigation label cleanup, and HTTP `x-default` normalization.
- **Next Action**: Owner visually reviews DE/EN/RU/TR/PL/AR repair landing pages and decides whether to clean the existing global lint backlog before the next release.

- Date: 2026-05-27
- Updated by: Antigravity
- **Current Stage**: Implemented a dedicated landing page for outdoor advertising repair at `/[locale]/leistungen/werbeanlagen-reparatur` in Next.js. Added site-style interactive modules into the real page: a smooth 4-image optimized hero carousel, digital first-diagnosis simulator after the symptom grid, and cost estimator/request block before the final CTA. RU has dedicated copy; other locales use German fallback copy until translations are added.
- **Next Action**: Owner reviews the updated real repair page, especially the hero carousel, digital diagnosis, and cost estimator/request blocks.

- Date: 2026-05-26
- Updated by: Antigravity
- **Current Stage**: Redesigned the footer CTA and contact form on the public homepage: changed to a 12-column responsive layout, set Live-Chat as a full-width button, converted WhatsApp/Telegram to horizontal icon-only buttons (preventing text truncation in narrow layouts), and implemented a responsive two-column field layout for the contact form. Fixed double scrollbars and LocationPicker dropdown clipping globally by setting the form container to overflow-visible by default, removing nested scrollbars and allowing suggestions to float downwards cleanly. Verified build.
- **Next Action**: Owner visually reviews the updated footer CTA, modal layout, and autocomplete dropdown behavior in the browser at http://localhost:3000/de.

- Date: 2026-05-25
- Updated by: Codex
- **Current Stage**: Published `rain-fail` / `werbeanlage-schaltet-nach-regen-ab` into CMS/database for all six MVP locales from Markdown drafts. Added the repeatable `db:seed:article-rain-fail` script, populated structured `selfRepairTips` for DE/EN/RU/TR/PL/AR, verified CMS audit rows are published and SEO-ready, verified production build, and smoke-checked all six article routes over HTTP.
- **Next Action**: Owner visually reviews `/de`, `/en`, `/ru`, `/tr`, `/pl`, and `/ar` article pages for final copy/layout before moving to the next problem article.

- Date: 2026-05-25
- Updated by: Codex
- **Current Stage**: Added the `rain-fail` / `werbeanlage-schaltet-nach-regen-ab` problem-article Markdown set for RU, DE, EN, TR, PL, and AR. The RU source was corrected and expanded with safer practical self-check/self-repair guidance; localized drafts keep the same safety boundaries and article structure. No CMS/database or application code changes were made for this article.
- **Next Action**: Owner reviews the Markdown drafts before any CMS/database synchronization or seed-script work.

- Date: 2026-05-25
- Updated by: Codex
- **Current Stage**: Closed the technical `selfRepairTips` rollout for existing full problem articles: added shared self-repair seed data, repeatable patch seed, updated `letter-out` and `uneven-light` all-locales seeds to preserve JSON, migrated `letter-out` off hardcoded public fallback, removed old hardcoded self-repair mappings, and verified DB/ESLint/build.
- **Next Action**: Future content work should add full articles and `selfRepairTips` JSON for the remaining short/basic problem slugs; no further CMS plumbing is required unless the modal UI is redesigned into visual subgroups.

- Date: 2026-05-25
- Updated by: Antigravity
- **Current Stage**: Replaced the 404 fallback on the `/service` page with a beautiful, localized preview/teaser card explaining that the Standort-Abo tariffs are currently in development. Enabled for all six supported locales (DE, EN, RU, TR, PL, AR). Preserved the full CMS preview page for owners with `cmsPreview=1` parameter.
- **Next Action**: Owner reviews the `/service` preview page across locales and verifies the draft preview still renders the full landing page properly.

- Date: 2026-05-25
- Updated by: Codex
- **Current Stage**: Cleaned the main English localization leak on public pages. Localized shared chat/request UI away from German hardcoded text for EN, refreshed baseline CMS pages across locales, and corrected mixed EN/DE CMS fields on `/en/leistungen` so English home/service routes no longer emit the audited German strings in local render checks.
- **Next Action**: Owner verifies production `/en` and `/en/leistungen` visually, especially chat/contact entrypoints and final CTA copy.

- Date: 2026-05-25
- Updated by: Codex
- **Current Stage**: Disabled automatic locale detection in the public-site i18n routing so the root entry no longer prefers browser-language redirects over the German default locale. This aligns the canonical-first SEO entrypoint with the project rule that German is primary.
- **Next Action**: Owner or agent verifies that `/` now resolves to the German entry flow after deployment and that direct locale URLs like `/en` still work as expected.

- Date: 2026-05-24
- Updated by: Codex
- **Current Stage**: Made the modal `Советы по самостоятельному ремонту` block mandatory for problem articles. Updated problem-article rules and public problem modal mapping so `letter-out` shows a separate green self-repair block; future CMS-backed articles fall back to safe-check content if no explicit self-repair block is mapped.
- **Next Action**: Owner refreshes `/ru/probleme-loesungen` and visually confirms the `letter-out` modal block.

- Date: 2026-05-24
- Updated by: Codex
- **Current Stage**: Published `Не светится отдельная буква или часть вывески` / `letter-out` into CMS/database for all six MVP locales (DE, EN, RU, TR, PL, AR) from Markdown drafts. Added repeatable seed script `db:seed:article-letter-out`; audit confirms `letter-out` is published and SEO-ready in all six locales. Remaining audit WARN items are unrelated missing TR/PL/AR articles for other problem slugs.
- **Next Action**: Owner visually reviews localized public article pages before broader rollout or more article localizations.

- Date: 2026-05-24
- Updated by: Codex
- **Current Stage**: Synchronized `LED светит неравномерно или пятнами` / `uneven-light` into CMS/database for all six locales (DE, EN, RU, TR, PL, AR) from the Markdown drafts. Added repeatable seed script `db:seed:article-uneven-light`; SEO/GEO fields, canonical URLs, related slugs, and structured article arrays are populated. CMS public audit confirms `uneven-light` is published and SEO-ready in all six locales; remaining audit WARN items are unrelated missing TR/PL/AR articles for other problem slugs.
- **Next Action**: Owner visually reviews localized public article pages before broader rollout or more article localizations.

- Date: 2026-05-24
- Updated by: Codex
- **Current Stage**: Added Markdown review drafts for `LED светит неравномерно или пятнами` / `uneven-light` in DE, EN, TR, PL, and AR under `docs/07_content_ai_seo/problem_articles/led светит неравномерно – 03/`, using the RU canonical draft as the basis. CMS/database and seed files were not changed.
- **Next Action**: Owner reviews the localized Markdown drafts before any CMS/database synchronization.

- Date: 2026-05-24
- Updated by: Codex
- **Current Stage**: Published the owner-approved RU `LED светит неравномерно или пятнами` article into CMS/database for `ru / uneven-light` from the final markdown in `docs/07_content_ai_seo/problem_articles/led светит неравномерно – 03/`. Local browser render verified on `/ru/probleme-loesungen/led-leuchtet-ungleichmaessig`.
- **Next Action**: Owner visually reviews the rendered RU page; if approved, this becomes the RU canonical version for future localization.

- Date: 2026-05-24
- Updated by: Codex
- **Current Stage**: Upgraded problem-article writing rules to v2: `problem_article_rules.md` is now the short mandatory operational standard, and `problem_article_rules_master_ru.md` is the expanded master reference with safety, sources, SEO/GEO (search and AI visibility), internal AI note, and markdown-to-CMS field mapping. The risky self-repair wording is replaced by safer "Что можно безопасно проверить самостоятельно" guidance.
- **Next Action**: Use the v2 rules for the next `LED светит неравномерно` rewrite before any CMS/database update.

- Date: 2026-05-23
- Updated by: Codex
- **Current Stage**: Recorded accepted public-site design standards for inner-page final CTAs and large-section intro accent lines. Secondary public pages should use a compact final CTA with one primary service button only; large content-block intros may use the `#B8643E` reading-start accent line with RTL-aware placement. The `/business` page is the current reference.
- **Next Action**: Apply these patterns gradually to other secondary public pages after owner review.

- Date: 2026-05-22
- Updated by: Codex
- **Current Stage**: Added the design-system standard and shared component for `Section Eyebrow` / section overline labels, accepted the `/business` large-section content-air standard, and recorded the public content typography standard for B2B/feature blocks: `44px / 50px / 800` section headings, `18px / 1.6` intros, `20px / 25px / 900` card headings, and `15px / 1.55` card body text.
- **Next Action**: When public-site sections are next edited, gradually replace remaining inline or pill-style section labels and align large feature sections to the accepted content-air and typography rules where appropriate.

- Date: 2026-05-22
- Updated by: Codex
- **Current Stage**: Reorganized problem-article markdown drafts into numbered folders under `docs/07_content_ai_seo/problem_articles/`: `вывеска не светится – 01`, `вывеска мерцает – 02`, plus empty intake/next-article folders. Updated the no-light seed to read from the new folder path.
- **Next Action**: Put new source articles into the next numbered folder or `входящие новые статьи`, then edit there before CMS/database loading.

- Date: 2026-05-22
- Updated by: Codex
- **Current Stage**: Published the full `no-light` problem article into CMS/database for all six locales (DE, EN, RU, TR, PL, AR) from the markdown drafts. Added a repeatable seed script `db:seed:article-no-light`; local HTTP render verified on all six article URLs.
- **Next Action**: Owner reviews `/ru/probleme-loesungen/werbeanlage-leuchtet-nicht` and other localized article pages in the browser for final copy/layout tone.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Updated the `Вывеска не светится` problem-article markdown draft and added localized DE, EN, TR, PL, and AR review drafts. CMS/database loading is intentionally deferred until owner review.
- **Next Action**: Owner reviews the six markdown drafts in `docs/07_content_ai_seo/` before any CMS or seed-script synchronization.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Added the approved RU `Вывеска мерцает` article as a markdown review draft and created active problem-article rules for the three-layer structure: small card, modal, full article, owner review before CMS/database loading, safe self-repair boundaries, and anti-AI-writing style requirements.
- **Next Action**: Use `docs/07_content_ai_seo/problem_article_rules.md` for all new problem articles and create markdown drafts for owner review before loading content into CMS.

- Date: 2026-05-21
- Updated by: Codex
- **Current Stage**: Updated RU `/probleme-loesungen/werbeanlage-flackert` content from a human technician draft: small card now supports `Симптомы`/`Причины`, the modal includes a highlighted self-repair advice block, and the full article was reseeded in CMS. Production build verified; lint still has pre-existing unrelated errors.
- **Next Action**: Owner reviews `/ru/probleme-loesungen` card/modal and `/ru/probleme-loesungen/werbeanlage-flackert` full article for tone, safety wording, and layout.

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
- **Next Action**: Align German public website semantic copy and problem-article implementation to `docs/01_strategy/master_brief.md`, the current public website plans, and the archived audit decision log at `docs/13_references_archive/seo_content_legacy/german_site_audit.md`.

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
