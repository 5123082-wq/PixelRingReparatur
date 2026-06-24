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
