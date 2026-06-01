# Page Brief — About

## Purpose

`О нас` explains who is responsible for the service and why PixelRing must not be perceived as a marketplace or random lead broker.

## Goal

- remove aggregator suspicion;
- make the one-stop service model explicit;
- show how AI intake and human execution are separated.

## What Must Be On The Page

- short hero about the company model;
- explanation of one accountable service company;
- clear statement that AI speeds up intake, while human specialists execute the work;
- short section on responsibility, communication, and service standards;
- geographic/service coverage only if it is real and supportable;
- CTA to submit a request.

## What Must Be Avoided

- generic agency-style storytelling;
- marketplace wording;
- unsupported claims about structure, scale, locations, or certifications.

## MVP Role In Navigation

This page answers: `Who is actually responsible for the result?`

## Progress Log

### 2026-06-01

- Current sprint/block: Public Website About page who-we-are visual collage.
- Done: Added the new service-team image as `pixelring-service-team-fahrzeug-werbeanlagen-reparatur-berlin.png` and converted the who-we-are image area into a two-image collage: main team-and-vehicle image plus an overlaid service-vehicle repair/diagnostics image. Added separate localized alt text for both images across DE, EN, RU, TR, PL, and AR.
- In progress: Owner visual review of the collage on `/de/ueber-uns` and `/ru/ueber-uns`.
- Next action: Adjust crop, overlap, or image proportions if owner wants a calmer or denser composition.
- Blockers/risks: Source images are medium-size PNGs; production image quality can improve later if higher-resolution originals are available.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`, `signage-service/src/lib/content/about-page.ts`, `signage-service/public/images/about/pixelring-service-team-fahrzeug-werbeanlagen-reparatur-berlin.png`.

### 2026-06-01

- Current sprint/block: Public Website About page who-we-are image replacement.
- Done: Added the new service-vehicle image as `pixelring-servicefahrzeug-werbeanlagen-reparatur-wartung-diagnose.png`, replaced the blueprint image in the `/ueber-uns` who-we-are block, set the image container to 16:9, and localized the alt text across DE, EN, RU, TR, PL, and AR.
- In progress: Owner visual review of the new image on `/de/ueber-uns`.
- Next action: Decide whether the image should be reused on other trust/service surfaces or kept only for the About page.
- Blockers/risks: The uploaded file is 640x360 PNG; future production optimization may benefit from a larger source or WebP/AVIF variant if available.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`, `signage-service/src/lib/content/about-page.ts`, `signage-service/public/images/about/pixelring-servicefahrzeug-werbeanlagen-reparatur-wartung-diagnose.png`.

### 2026-06-01

- Current sprint/block: Public Website About page who-we-are layout adjustment.
- Done: Swapped the desktop column order in the `/ueber-uns` who-we-are block so company text appears on the left and the blueprint image appears on the right, while keeping the mobile order text-first.
- In progress: Owner visual review of the updated block on `/de/ueber-uns`.
- Next action: Continue visual rhythm refinements if the section still feels disconnected from adjacent blocks.
- Blockers/risks: None.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-05-31

- Current sprint/block: Public Website About page who-we-are positioning rewrite.
- Done: Rewrote the `/ueber-uns` who-we-are block across DE, EN, RU, TR, PL, and AR so it starts with PixelRing as a service company for signage, repair, maintenance, and modernization instead of opening with marketplace/platform negation. Also softened older fallback accordion wording that still contained similar negative positioning.
- In progress: Owner review of the revised who-we-are block on `/ru/ueber-uns`.
- Next action: Continue copy cleanup on any remaining About sections that still sound defensive or audit-derived.
- Blockers/risks: None.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/lib/content/about-page.ts`.

### 2026-05-31

- Current sprint/block: Public Website About page premium-materials copy cleanup.
- Done: Rewrote the `/ueber-uns` materials lead and note across DE, EN, RU, TR, PL, and AR so the section explains concrete trust factors: stable light, stable color, weather-resistant surfaces, suitable power supplies, maintainable components, and verified supplier/component context.
- In progress: Owner review of the revised materials block on `/ru/ueber-uns`.
- Next action: Decide whether the materials strip needs one additional visual/detail layer, such as component categories or short proof points under the brand marquee.
- Blockers/risks: The copy intentionally avoids claiming universal official partnerships with listed brands.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/lib/content/about-page.ts`.

### 2026-05-31

- Current sprint/block: Public Website About page request-process copy cleanup.
- Done: Rewrote the `/ueber-uns` process block across DE, EN, RU, TR, PL, and AR so it explains concrete steps from first message to work plan instead of using literal audit wording such as "technically clarify".
- In progress: Owner review of the revised process block on `/ru/ueber-uns`.
- Next action: Continue section-by-section copy refinement if more audit-derived phrasing feels unnatural in public copy.
- Blockers/risks: Non-RU locales are practical localization updates and may still benefit from native-speaker QA later.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/lib/content/about-page.ts`.

### 2026-05-31

- Current sprint/block: Public Website About page who-we-are wording cleanup.
- Done: Replaced the awkward "technical service point" wording in the `/ueber-uns` who-we-are block with accountable service-partner language across DE, EN, RU, TR, PL, and AR.
- In progress: Owner review of the revised who-we-are block on `/ru/ueber-uns`.
- Next action: Continue copy refinement section by section, keeping audit intent but avoiding literal audit jargon in public copy.
- Blockers/risks: None.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/lib/content/about-page.ts`.

### 2026-05-31

- Current sprint/block: Public Website About page hero copy rollback.
- Done: Reverted the `/ueber-uns` hero copy from the audit-style "technical service from Berlin" wording back to the earlier warmer brand-service framing across DE, EN, RU, TR, PL, and AR, then synced the CMS about records.
- In progress: Owner review of the restored `/ru/ueber-uns` and `/de/ueber-uns` hero copy.
- Next action: Keep the improved page structure, but avoid putting audit language directly into the hero unless rewritten in a natural brand voice.
- Blockers/risks: Berlin signal is no longer in the hero headline; it can be handled later in a separate trust/location block with better copy.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/lib/content/about-page.ts`.

### 2026-05-31

- Current sprint/block: Public Website About page hero CTA cleanup.
- Done: Removed the conversion-style hero CTA buttons and supporting microcopy from `/ueber-uns` so the About hero stays informational instead of behaving like a request landing page. The final CTA remains the action point for service requests.
- In progress: Owner review of the cleaner `/ru/ueber-uns` hero.
- Next action: Decide whether the live service terminal belongs in the hero or should move lower as a process/status example.
- Blockers/risks: The audit had recommended above-the-fold CTA for conversion, but owner feedback prioritizes About-page context and trust over immediate request action in the hero.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-05-31

- Current sprint/block: Public Website About page trust narrative restructure.
- Done: Reworked `/ueber-uns` from a set of loosely connected presentation blocks into an audit-backed trust sequence: technical signage service from Berlin in the hero, above-the-fold request CTAs, explicit "who we are" positioning, concrete serviced systems, 4-step request flow, repair-before-replacement rationale, compact audience cards, trust-safe premium materials context, work video, anonymized-feedback explanation, and a more specific final CTA. Updated fallback content and synced CMS about records for DE, EN, RU, TR, PL, and AR.
- In progress: Owner review of `/ru/ueber-uns` and `/de/ueber-uns` after the structural pass.
- Next action: Decide whether the live terminal remains in the hero or moves lower as a status/process example; then refine visual rhythm and mobile density.
- Blockers/risks: New non-DE copy is a practical localization pass from the German/Russian intent, not native-speaker final QA. The page still uses existing demo media and anonymized feedback rather than verified customer case assets.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`, `signage-service/src/lib/content/about-page.ts`.

### 2026-05-31

- Current sprint/block: Public Website About page materials trust signal.
- Done: Updated the `/ueber-uns` materials strip heading across DE, EN, RU, TR, PL, and AR to emphasize premium materials and trusted/verified supply partners instead of a neutral materials/supply-partner label.
- In progress: Owner visual review of the updated heading on `/ru/ueber-uns`.
- Next action: Decide whether this strip should stay title-only or receive one short supporting sentence explaining why premium materials matter for repair durability and brand appearance.
- Blockers/risks: The wording avoids unsupported official-partnership claims; brand names remain a materials/supplier trust signal, not a legal partnership declaration.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/lib/content/about-page.ts`.

### 2026-05-31

- Current sprint/block: Public Website About page live terminal enhancement.
- Done: Changed the `/ueber-uns` hero `ServiceSimulator` from a static dispatch list into a client-side demo live feed with rotating localized statuses, live-style timestamps, highlighted fresh rows, and a safer note that real dispatches remain internal in PixelRing CRM without exposing customer data.
- In progress: Owner visual review of the live terminal rhythm on `/ru/ueber-uns`.
- Next action: Check desktop and mobile readability, then decide whether the cycle speed or status wording should be adjusted.
- Blockers/risks: This is a frontend demo simulation only; it is intentionally not connected to real CRM dispatch data.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/components/sections/ServiceSimulator.tsx`.

### 2026-05-20

- Current sprint/block: Public Website About page non-Russian language QA.
- Done: Rewrote `/ueber-uns` copy for DE, EN, TR, PL, and AR to sound more natural for native readers, removed long-dash style patterns from edited copy, fixed mixed Arabic/Russian text, and softened unsupported claim wording in rendered and dormant page content. Russian copy was intentionally left unchanged.
- In progress: Owner visual review of non-RU `/ueber-uns` pages for tone, wrapping, and RTL behavior.
- Next action: Review `/de/ueber-uns`, `/en/ueber-uns`, `/tr/ueber-uns`, `/pl/ueber-uns`, and `/ar/ueber-uns` in browser after deployment or local preview.
- Blockers/risks: Language QA was done by code review and heuristic copy cleanup, not by native speaker review for each locale.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-05-20

- Current sprint/block: Public Website About page video-first section redesign.
- Done: Reworked the former quality/checklist section into a video-first About block with a large poster, concise caption, three compact tags, and a subtle references link.
- In progress: Owner visual review of the new `/ru/ueber-uns` video-first block.
- Next action: Decide whether to provide a real video asset for this block or keep the current poster until video content is ready.
- Blockers/risks: No real video file is currently available in `public/`; the block uses the existing poster image and does not fake video playback.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-05-20

- Current sprint/block: Public Website About page service-catalog deduplication.
- Done: Replaced the large `/ueber-uns` service deep-dive card section with a short CTA block that routes users to `/leistungen`, so About remains focused on trust, responsibility, and the PixelRing service model.
- In progress: Owner visual review of `/ru/ueber-uns` after the services-page restructure.
- Next action: Confirm the About page no longer reads like a services catalogue and decide whether remaining service-specific copy should be softened further.
- Blockers/risks: The localized `deepDive` data remains in the page content object for now, but it is no longer rendered by the About route.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `docs/02_public_website/page_plan_leistungen.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-05-20

- Current sprint/block: Public Website About page accordion layout optimization.
- Done: Replaced the two-image collage in the "How PixelRing works" block with one fixed vertical image, changed the accordion to native grouped `details` behavior so only one item remains open at a time, and constrained the text column to avoid horizontal overflow.
- In progress: Owner review of the updated block on `/ru/ueber-uns`.
- Next action: Decide whether the single vertical image should keep the current blueprint asset or use a more service-process-focused image later.
- Blockers/risks: The native `details name` grouping is intentionally minimal and avoids a client component; if older browser support becomes a requirement, this should be replaced by a small controlled client accordion.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-05-20

- Current sprint/block: Public Website About page "How PixelRing works" accordion completion.
- Done: Rewrote the accordion copy across DE, EN, RU, TR, PL, and AR to use consistent `PixelRing SERVICE` wording, replace `Meister-Standard` with an internal service-standard concept, soften full-accountability and own-team implications, and fix the Arabic mixed-language sentence in the touched block.
- In progress: Owner review of the updated accordion on `/ru/ueber-uns`.
- Next action: Decide whether to soften remaining page-level claim-risk copy outside the accordion, including response-time, own-technician, guarantee, Germany-wide, VDE/DIN, and savings claims.
- Blockers/risks: Adjacent page copy still contains some claim-risk wording from the recommendations document; it was not changed in this focused pass.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-05-20

- Current sprint/block: Public Website About page Hero section redesign.
- Done: Redesigned the Hero section of `/ueber-uns` to incorporate an interactive diagnostics terminal widget (`ServiceSimulator`). Configured the main hero title to use the colon format ("PixelRing: сервис, который...") and colored it entirely in dark slate/black across all 6 languages, removing the two-tone accent color span, long dashes, and ending punctuation.
- In progress: Awaiting user review of the layout.
- Next action: Gather feedback from the owner on the updated typography and color styling.
- Blockers/risks: None.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`, `signage-service/src/components/sections/ServiceSimulator.tsx`.

### 2026-05-03

- Current sprint/block: Public Website About page comment cleanup after owner review.
- Done: removed the mid-page generic "learn more" CTA; replaced the atelier heading with a process-oriented heading; changed quality copy from assembly wording to diagnosis/execution/documentation; changed deep-dive labels to outdoor advertising repair/maintenance, illuminated advertising modernization, and inspection/audit; replaced final CTA headline so it covers broader advertising-system tasks; converted material brands into a readable monochrome marquee concept.
- In progress: visual QA screenshots in the in-app browser were partially blocked by browser screenshot timeout after dev-server restart, but DOM checks confirmed the reviewed RU phrases were replaced.
- Next action: owner visual review in browser, then decide whether to add a separate mounting/service block.
- Blockers/risks: brand marquee uses readable text-style logo names rather than licensed logo image assets; this is safer for SEO/accessibility and avoids unlicensed brand artwork.
- Updated documents: `docs/02_public_website/page_brief_about.md`.

### 2026-05-03

- Current sprint/block: Public Website About page trust-positioning pass.
- Done: reframed `/ueber-uns` hero around one accountable service partner instead of generic innovation/atelier positioning; updated stats to `2023`, `100+`, `50+`, and one responsible contact; changed materials block from partner claim to materials/systems used; added agreed material brands including Mean Well, PLEXIGLAS, and DIBOND; anonymized testimonial framing; replaced fake/no-op CTA surfaces with real request or route links; added temporary generated Service-Team avatar assets for later admin replacement.
- In progress: broader visual QA across all languages and mobile breakpoints remains separate.
- Next action: verify `/ueber-uns` on mobile and non-DE locales, then decide whether to simplify remaining atelier/Meister copy.
- Blockers/risks: avatar portraits are generated placeholders and must be replaced with real team assets when available; some service-card specifics still use static copy rather than CMS-managed content.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`.

### 2026-05-03

- Current sprint/block: Public Website About page RU language consistency pass.
- Done: audited `/ru/ueber-uns` in the in-app browser; replaced mixed English/German visible labels with localized labels; rewrote weak Russian hero, stats, quality, deep-dive, final CTA, and testimonial copy; removed generic construction/landscaping testimonial content from the rendered RU page.
- In progress: broader About page product-positioning and CMS integration review remains separate.
- Next action: continue copy/visual QA for public website pages or decide whether About page needs a deeper product-positioning rewrite beyond language cleanup.
- Blockers/risks: current About route still contains static page copy and demo-style avatar images; broader CMS governance for this page is not part of this pass.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_about.md`.
