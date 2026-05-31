# 02 Public Website

Purpose: public website structure, user journeys, pages, forms, and multilingual UX.

Planned base documents:
- `site_map.md`
- `public_page_inventory.md`
- `user_journey_flows.md`
- `request_intake_ux.md`
- `multilingual_routes.md`
- `page_brief_services.md`
- `page_brief_solutions.md`
- `page_brief_for_business.md`
- `page_brief_references.md`
- `page_plan_references.md`
- `page_brief_about.md`
- `page_plan_service.md`
- `page_plan_leistungen.md`
- `page_plan_solutions.md`

## Progress Log

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
