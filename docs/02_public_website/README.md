# 02 Public Website

Purpose: public website structure, user journeys, pages, forms, and multilingual UX.

## Context Beacon

Purpose: public website router for startup orientation. Read this beacon first, then open only the document that matches the task.

Current checkpoint:
- Latest public website status lives in the short `Progress Log` below.
- Older public website history lives in [public_website_progress_log.md](public_website_progress_log.md).
- The heavy IA/spec source is `information_architecture.md`; do not read it fully during ordinary startup.

Use this folder for:
- public website IA (информационная архитектура), navigation, page inventory, and page specs;
- public request-intake UX (пользовательский сценарий подачи заявки);
- multilingual public routes and public-facing CTA (призыв к действию) behavior;
- homepage, services, references, business, legal, and status/public tracking surfaces.

## Read Depth

- Shallow startup: read this `Context Beacon`, the `Planned base documents` list, and the latest 1-2 `Progress Log` checkpoints only.
- IA/navigation/page spec tasks: read the `Context Beacon` and `Read Depth` block in `information_architecture.md`, then the relevant heading range.
- Historical continuation: read [public_website_progress_log.md](public_website_progress_log.md) only when following an older dated checkpoint or checking prior implementation context.
- Avoid during ordinary startup: full `information_architecture.md`, archived references, and old progress entries.

## Planned Base Documents

- `site_map.md`
- `public_page_inventory.md`
- `user_journey_flows.md`
- `request_intake_ux.md`
- `multilingual_routes.md`
- `page_brief_services.md`
- `page_brief_for_business.md`
- `page_brief_references.md`
- `page_plan_references.md`
- `page_brief_about.md`
- `page_plan_service.md`
- `page_plan_leistungen.md`
- `page_plan_solutions.md`

## Progress Log

* **Date:** 2026-07-10
* **Current sprint/block:** Homepage Awning Service Card (карточка услуг по маркизам на главной странице)
* **Done:** Replaced the former dismantling card with `Markisenreinigung & Aufarbeitung` (чистка и восстановление маркиз) across DE/EN/RU/TR/PL/AR, using owner-provided footage of a specialist cleaning a café awning. The card now links directly to `/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций).
* **Performance:** Converted the 19 MB source `.MOV` file to an audio-free 1.1 MB web video and added a 206 KB `poster` (статичный кадр до запуска видео). The existing `IntersectionObserver` (контроль видимости браузером) workflow defers loading until the card approaches the viewport (видимая область экрана), plays only while visible, and pauses it outside the viewport.
* **In progress:** Owner visual review of the crop, title wrapping, and playback on `/ru` (русская главная страница) and `/de` (немецкая главная страница).
* **Next action:** Deploy after visual approval.
* **Blockers/risks:** Browser automation was unavailable in the local environment; targeted ESLint (проверка кода), `git diff --check` (проверка формата изменений), production Next.js build (промышленная сборка Next.js), and an isolated production-server check of the new public media and RU/AR card markup passed.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `signage-service/src/components/sections/ExcellenceCarousel.tsx`

* **Date:** 2026-07-10
* **Current sprint/block:** Unified Safari-Style Header Navigation (единая навигация шапки в стиле Safari)
* **Done:** Replaced the morphing/floating desktop navigation (анимируемая/плавающая десктопная навигация) with one attached two-level header and integrated services grid (встроенная сетка услуг), applied one readable translucent material to all levels, and standardized every active/current navigation element (каждый активный элемент навигации) to a soft fill with the same neutral gray outline as inactive controls (мягкая заливка с такой же нейтральной серой окантовкой, как у неактивных), while the brand-colored outline appears only on hover/focus (фирменная рамка появляется только при наведении/фокусе).
* **In progress:** Owner review in real Safari on iPhone and lower-power Mac hardware.
* **Next action:** Confirm material density, scroll reveal/hide timing, and GPU smoothness (плавность графического процессора), then deploy after visual approval.
* **Blockers/risks:** Local production checks passed; remaining risk is device-specific Safari compositing (сведение графических слоёв), while `prefers-reduced-transparency` (предпочтение уменьшенной прозрачности) and no-blur fallback (резерв без размытия) remain available.
* **Updated documents:**
  - `PROGRESS.md`
  - `design-qa.md`
  - `docs/02_public_website/README.md`
  - `docs/02_public_website/public_website_progress_log.md`

* **Date:** 2026-07-10
* **Current sprint/block:** Homepage Scroll Performance (производительность прокрутки главной страницы)
* **Done:** Removed expensive `backdrop-filter` (размытие фона) from the scrolled header/notch, replaced large decorative blur filters (фильтры размытия) with visually equivalent radial gradients (радиальные градиенты), stopped map animation outside the viewport (видимая область экрана), and made the work-card video load/play only near or inside the viewport (видимая область экрана).
* **In progress:** Owner visual review on Safari/iPhone and lower-power hardware.
* **Next action:** Compare the updated local homepage with production, then deploy after visual approval.
* **Blockers/risks:** Main-thread timing is clean in the local desktop/mobile scroll tests; remaining device-specific risk is GPU compositing (сведение графических слоёв) behavior in Safari.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `docs/02_public_website/public_website_progress_log.md`

* **Date:** 2026-06-28
* **Current sprint/block:** References `LED-Buchstaben` (объемные LED-буквы) card photo replacement
* **Done:**
  - Replaced the `led-letters` before/after imagery on `/[locale]/referenzen` (страница примеров работ) with two owner-provided facade photos stored as WebP files under the existing references asset folder.
  - Rewrote the selected card case copy for DE, EN, RU, TR, PL, and AR without naming the visible brand from the photos.
  - Added localized image alt text fields for the card, modal gallery, full gallery, and product category surfaces.
  - Updated the CMS media replacement script for the new WebP assets and fixed CMS image-field normalization so ASCII file paths such as `gleichmaessig` are not converted into display text.
  - Updated the published local CMS `referenzen` (примеры работ) records for all six MVP locales.
* **In progress:** Owner visual review of the selected card on the local `/ru/referenzen` (страница примеров работ) page.
* **Next action:** Check the card in the carousel, hover/focus before-state, case modal, and gallery thumbnail in the browser.
* **Blockers/risks:** The photo itself contains a visible third-party brand; public copy and alt text intentionally describe the object generically.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-24
* **Current sprint/block:** Google Ads Consent Hardening
* **Done:**
  - Changed Google Ads tracking to a basic consent-mode pattern: the Google tag is rendered only after the visitor chooses `Accept all`.
  - Persisted both acceptance and refusal in a first-party consent cookie with a versioned localStorage fallback and migration from the old localStorage-only key.
  - Added a localized `/[locale]/privacy#cookie-settings` panel for changing the consent choice without adding a cookie control to the footer.
  - Verified mobile `/ru` first-visit, `Only necessary`, reload persistence, privacy-page consent change, consent revocation, lint, TypeScript, and production build.
* **In progress:** Production deployment and Safari/iPhone verification.
* **Next action:** After deployment, test `https://www.pixel-ring.com/ru` in iPhone Safari: accept/refuse, reload, and change consent from `/ru/privacy#cookie-settings`.
* **Blockers/risks:** Safari's own privacy warning may still appear after a user explicitly accepts Google Ads cookies because Google tag loading is then intentional.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-24
* **Current sprint/block:** Leistungen Final CTA Standardization
* **Done:**
  - Converted the shared `LeistungenFooterCTA` component to the approved compact dark image CTA format from `/de/leistungen/werbeanlagen-reparatur`.
  - Reused the shared component on `/[locale]/leistungen`, `/[locale]/leistungen/werbeanlagen-reparatur`, and all shared `/[locale]/leistungen/[slug]` service detail pages.
  - Kept page-specific final headlines, CTA labels, request intent values, and service imagery for the overview and detail pages.
  - Verified the six DE `leistungen` routes render the new CTA at the expected desktop height without horizontal overflow.
* **In progress:** Owner visual review of the standardized final CTA across the Leistungen section.
* **Next action:** Review `/de/leistungen`, `/de/leistungen/werbeanlagen-reparatur`, `/de/leistungen/lichtwerbung-led-modernisierung`, `/de/leistungen/werbeanlagen-audit-diagnose`, `/de/leistungen/montage-demontage-werbeanlagen`, and `/de/leistungen/druckprodukte-branding-werbematerialien`.
* **Blockers/risks:** Browser console still shows existing Next image LCP warnings on some hero images; no runtime errors were observed for the new CTA component.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-20
* **Current sprint/block:** Legal CMS Restoration
* **Done:**
  - Restored the approved German `privacy/de` CMS text from revision `a86d4fe0-2eef-40a0-b0d2-0dfdd15d159b`.
  - Restored the approved German `impressum/de` CMS text from revision `e4165d3d-9299-47d8-b399-781b15707f39`.
  - Added new `RESTORE` revisions for both legal pages after the 2026-05-25 baseline seed overwrite.
  - Made `/[locale]/privacy` and `/[locale]/impressum` render dynamically so they read the current German legal CMS source instead of stale build output.
  - Extended legal stale-content validation to reject placeholder seed text and changed the CMS baseline seed to skip legal pages.
* **In progress:** Push/deploy and external verification of public legal pages.
* **Next action:** Verify `/ru/privacy`, `/ru/impressum`, `/de/privacy`, and `/de/impressum` after deployment.
* **Blockers/risks:** Legal text still needs owner/legal review whenever business identity, processors, tracking, messenger usage, uploads, or analytics change.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-14
* **Current sprint/block:** Home Work Carousel Card Order
* **Done:**
  - Moved the branding/print card one position earlier in the rendered `Sichtbare Qualität` carousel.
  - Preserved the branding card video media, localized text, video label, and service link while placing it before maintenance/audit.
  - Kept the order consistent across DE/EN/RU/TR/PL/AR through render-order logic so CMS/fallback item order cannot separate the card text from its media/link configuration.
* **In progress:** Rendered review of `/de` and `/ru` home carousel order.
* **Next action:** Confirm the visible order: montage, repair, branding/print, maintenance/audit, LED, dismantling.
* **Blockers/risks:** If future CMS editors add new carousel items outside the known service set, they will fall after the canonical service cards unless order logic is expanded.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

Older checkpoints: [public_website_progress_log.md](public_website_progress_log.md).
