# 02 Public Website

Purpose: public website structure, user journeys, pages, forms, and multilingual UX.

Planned base documents:
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

* **Date:** 2026-06-14
* **Current sprint/block:** Home Work Carousel Repair Visual Update
* **Done:**
  - Replaced the public home `Sichtbare Qualität` repair/light-advertising card visual with the owner-provided illuminated facade-sign photo.
  - Converted the source JPEG into a vertical card-ready WebP at `signage-service/public/images/ex-repair-libitina-leuchtkasten-fassade.webp`.
  - Connected the new image across DE/EN/RU/TR/PL/AR carousel configs and updated localized alt text, with DE as the canonical wording.
* **In progress:** Rendered review of `/de` and `/ru` home carousel after asset replacement.
* **Next action:** Confirm the crop and text overlay readability in the live carousel.
* **Blockers/risks:** The source image is wider than the carousel card ratio, so the card crop intentionally prioritizes the central illuminated facade sign and entrance.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-14
* **Current sprint/block:** Home Work Carousel Branding Video
* **Done:**
  - Added the owner-provided folienmontage MP4 as a muted looping background video for the home `Sichtbare Qualität` branding/print card.
  - Saved the video under a neutral site filename at `signage-service/public/videos/ex-branding-print-folienmontage.mp4`.
  - Generated a vertical WebP poster fallback at `signage-service/public/images/ex-branding-print-folienmontage-poster.webp`.
  - Extended `ExcellenceCarousel` so video media is supported only where configured, while the other cards continue using `next/image`.
  - Added localized image fallback text and video labels across DE/EN/RU/TR/PL/AR.
* **In progress:** Rendered review of `/de` and `/ru` home carousel after video connection.
* **Next action:** Confirm autoplay, crop, text readability, and card link behavior in the live carousel.
* **Blockers/risks:** The MP4 remains the original H.264 source because the available `avconvert` preset increased size and produced unreliable metadata.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-14
* **Current sprint/block:** Home Work Carousel Visual Update
* **Done:**
  - Replaced the first home `Sichtbare Qualität` montage-card visual with the owner-provided night autohaus advertising-pylon photo.
  - Cropped out the source black bars, lightly adjusted quality, resized to a vertical card-ready WebP, and saved it as `signage-service/public/images/ex-mounting-dietz-autohaus-werbepylon.webp`.
  - Connected the new image across DE/EN/RU/TR/PL/AR carousel configs and updated localized alt text, with DE as the canonical wording.
* **In progress:** Rendered review of `/de` and `/ru` home carousel after asset replacement.
* **Next action:** Confirm the crop and text overlay readability in the live carousel.
* **Blockers/risks:** Existing CMS overrides could still affect custom non-legacy carousel items if a future CMS image is explicitly set.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-12
* **Current sprint/block:** Home Trust, FAQ, and Mobile Overflow Cleanup
* **Done:**
  - Rewrote the home form helper text across DE/EN/RU/TR/PL/AR from repair-template examples to signage examples such as LED flicker, dark lightbox, damaged letters, peeling film, and sign dismantling.
  - Reworked TrustSection copy around concrete customer concerns: photo-first start, assessment before work, one contact, documented result, warranty, and branch/multi-site coordination.
  - Added a real service-result visual and an anti-portal trust block that frames PixelRing as one accountable service process rather than an anonymous intermediary.
  - Reordered and rewrote the home FAQ around speed, photos, signage types, Germany/regions, offer before work, warranty, branches, dismantling, parts, and urgent cases.
  - Cleaned abstract home copy in hero, bento/process, trust, coverage, and final CTA surfaces toward concrete signage-service language.
  - Synchronized the published CMS `home/global` JSON records for DE/EN/RU/TR/PL/AR and created CMS revisions/audit entries.
  - Verified `/de`, `/ru`, and `/ar` at 360/390/430 px with visible cookie banner; all checks kept `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
  - Added mobile-only cookie-banner bottom spacing so the footer can scroll above the fixed consent banner.
* **In progress:** Owner visual review of the revised home page on target locales.
* **Next action:** Review TrustSection, FAQ, and footer/cookie-banner spacing on `/de`, `/ru`, and `/ar`; decide whether any wording needs tone tuning.
* **Blockers/risks:** CMS public audit still reports pre-existing missing problem articles for TR/PL/AR on several problem slugs; this is outside the home cleanup.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-06-11
* **Current sprint/block:** Home Before/After Proof Section
* **Done:**
  - Added a new public home `Vorher / Nachher` section directly after the hero and before the request-method block.
  - Implemented a full-bleed Apple-like horizontal proof rail: one large before/after lightbox card, three columns of smaller service-case cards stacked in two rows, and one large closing card at the end.
  - Used existing local reference assets for lightbox, LED module repair, film, illuminated letters, and mounting/dismantling visuals.
  - Added localized DE/EN/RU/TR/PL/AR copy, then tightened the RU copy so the cases read like service examples instead of machine-translated labels.
  - Neutralized visible card underlay/shadow colors and verified targeted ESLint, production build, Browser DOM placement, desktop screenshot, mobile screenshot, and mobile viewport width behavior.
* **In progress:** Owner visual review of the new home proof section on `/ru` and `/de`.
* **Next action:** Owner reviews the tuned horizontal rail on `/ru` and `/de`; decide whether card proportions, first visible card order, and image choices need another visual pass.
* **Blockers/risks:** Current mobile clipping in the existing hero/header remains a separate pre-existing issue; the new section does not increase document `scrollWidth`, but the cookie banner can cover the lower part of the first proof card on short mobile screenshots.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`

* **Date:** 2026-05-31
* **Current sprint/block:** Home Work Carousel Internal Linking
* **Done:**
  - Reframed the home `Sichtbare Qualität` carousel so every visible work card maps to a real PixelRing service category.
  - Changed hashtag pills into service links: `Montage` and `Demontage` to the installation/dismantling service page, `Reparatur` to the repair landing page, `Wartung` to the services maintenance section, `Branding` to the print/branding page, and `LED-Service` to the LED modernization page.
  - Kept proof behavior by linking card titles to `/[locale]/referenzen#recent-work`.
  - Replaced the old generic design-office image with a new storefront branding/print service image at `signage-service/public/images/ex-branding-print.png`.
  - Updated DE/EN/RU/TR/PL/AR fallback carousel copy to match the service-aligned categories.
  - Verified the updated DE DOM in the browser, clicked the `#Montage` service link successfully, confirmed all target DE routes return `200`, and ran a successful production build.
* **In progress:** Owner visual review of the updated carousel on `/de`.
* **Next action:** Decide whether this hashtag-to-service and title-to-references click model should be reused on `Referenzen` or other proof/gallery surfaces.
* **Blockers/risks:** Existing CMS records may still contain older carousel text, so the component normalizes legacy titles at render time while fallback messages now contain the new canonical wording.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
