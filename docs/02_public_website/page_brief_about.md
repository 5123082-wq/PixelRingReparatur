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
