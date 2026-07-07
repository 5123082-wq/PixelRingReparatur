# Public Website Progress Log

Purpose: detailed public website history. Do not read this file during ordinary startup; open it only when continuing an older checkpoint or checking prior implementation context.

## Context Beacon

- Latest public website status stays in [README.md](README.md).
- This file preserves older public website checkpoints that used to make the folder README heavy.
- Read by date or by affected surface only; avoid loading the full file unless the task explicitly needs history.

## Detailed Log / History

* **Date:** 2026-07-06
* **Current sprint/block:** Cleaning Page Finished Examples Strip
* **Done:**
  - Reworked the `LeistungenCleaningProofStrip` (визуальный блок страницы очистки) on `/[locale]/leistungen/werbeanlagen-reinigung` (страница очистки рекламных конструкций) so it no longer reads as a temporary before/after disclaimer.
  - Replaced the selected badge text with a normal CTA (призыв к действию) to `/referenzen#gallery` (галерея примеров работ).
  - Converted the three visual cards into clickable links to `/referenzen#gallery` (галерея примеров работ) across DE, EN, RU, TR, PL, and AR.
  - Reframed the copy as finished service examples (`Fertige Servicebilder`, готовые сервисные виды) instead of before/after proof.
* **In progress:** Owner visual review on the local `/de/leistungen/werbeanlagen-reinigung` page.
* **Next action:** Decide whether `/referenzen` (страница примеров работ) should later support category filters in the URL, for example a direct link to `Leuchtkasten` (световой короб) examples.
* **Blockers/risks:** Current links intentionally target the gallery anchor only; exact category preselection would require a separate change to the references client state.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/public_website_progress_log.md`
  - `signage-service/src/components/leistungen/LeistungenCleaningProofStrip.tsx`

* **Date:** 2026-07-05
* **Current sprint/block:** Storefront Awning Cleaning Photo Integration & Case Refining
* **Done:**
  - Replaced the placeholder image for the `Werbeanlagen- und Markisenreinigung` (awning and signage cleaning) card with owner-provided photos.
  - Processed the photos using AI image editing to remove parked cars, make the background generic/unrecognizable, and replace the restaurant name with clean 'PixelRing' branding on the green awnings.
  - Generated both 'before' (dirty with green algae/moss) and 'after' (clean green fabric) states to support the interactive hover before/after transition effect.
  - Saved the final WebP/PNG assets at `public/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-awning-before.png` and `public/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-awning-after.png`.
  - Removed the redundant 'sign' and 'facade' cards from the cases arrays across all 6 locales (DE, EN, RU, TR, PL, AR) in [page.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/app/%5Blocale%5D/leistungen/werbeanlagen-reinigung/page.tsx) and updated [LeistungenCleaningWorkflow.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/components/leistungen/LeistungenCleaningWorkflow.tsx).
  - Deleted the physical image assets for the removed cards: `pixelring-cleaning-sign-before.png`, `pixelring-cleaning-sign-after.png`, `pixelring-cleaning-facade-before.png`, `pixelring-cleaning-facade-after.png`.
* **In progress:** None.
* **Next action:** Verify rendering of the interactive before/after transition and the updated cases rail on the local dev server.
* **Blockers/risks:** None.
* **Updated documents:**
  - [page.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/app/%5Blocale%5D/leistungen/werbeanlagen-reinigung/page.tsx)
  - [LeistungenCleaningWorkflow.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/components/leistungen/LeistungenCleaningWorkflow.tsx)
  - `signage-service/public/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-awning-before.png`
  - `signage-service/public/images/leistungen/werbeanlagen-reinigung/pixelring-cleaning-awning-after.png`
  - `docs/02_public_website/public_website_progress_log.md`


* **Date:** 2026-07-04
* **Current sprint/block:** Brand Logo Integration & Asset Optimization
* **Done:**
  - Integrated new design logos from `DesignPrototip/` into `signage-service/public/brand/`.
  - Cropped SVG files to tight bounding boxes (custom viewBox calculated via coordinates parsing) to eliminate excess CorelDRAW export margins.
  - Cleaned SVG code by removing unused offboard groups and setting proper aspect ratios.
  - Successfully verified Next.js app builds with zero errors.
* **In progress:** None.
* **Next action:** Verify rendering in header layout.
* **Blockers/risks:** None.
* **Updated documents:**
  - `signage-service/public/brand/logo-full-light.svg`
  - `signage-service/public/brand/logo-compact-light.svg`
  - `docs/02_public_website/public_website_progress_log.md`

* **Date:** 2026-07-03
* **Current sprint/block:** Header Style, Glassmorphism Blur & Transparency Alignment
* **Done:**
  - Removed separate backgrounds, borders, and rounded corners from the static desktop navigation row when not scrolled in [Header.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/components/layout/Header.tsx), allowing it to blend seamlessly into the main header block.
  - Restored premium glassmorphism transparency and a strong `blur(20px)` backdrop filter on `.pr-nav-glass` and `.pr-nav-glass-accent` in [globals.css](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/app/globals.css).
  - Resolved the scrolled notch stacking context rendering bug in Chrome/Safari by moving entrance/exit animations (`y`, `opacity`) from the parent `motion.div` to the child glass element in [Header.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/components/layout/Header.tsx). This successfully restores the backdrop blur on the scrolled notch (Menu #2).
  - Aligned dropdown and mobile sub-menu styling by updating `.pr-nav-glass-floating` in [globals.css](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/app/globals.css) to use 94% opacity and a soft premium drop shadow. This ensures a clean frosted look that matches the header's color while providing excellent text contrast and readability.
  - Verified codebase linting and TypeScript compilation (all checks successfully completed with 0 errors).
* **In progress:** Owner visual review.
* **Next action:** Owner verifies the look of the header, scrolled notch, and dropdown menus on the live website.
* **Blockers/risks:** None.
* **Updated documents:**
  - `signage-service/src/components/layout/Header.tsx`
  - `signage-service/src/app/globals.css`
  - `docs/02_public_website/public_website_progress_log.md`

* **Date:** 2026-06-14
* **Current sprint/block:** Home Work Carousel Repair Visual Update
* **Done:**
  - Replaced the public home `Sichtbare Qualität` carousel repair/light-advertising card visual with the owner-provided illuminated facade-sign photo.
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
