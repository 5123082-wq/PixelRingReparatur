# Page Brief — References

## Purpose

`Примеры работ` is the proof page. It exists to increase trust, not to become a decorative gallery.

## Goal

- prove execution quality and relevance;
- show the range of completed work without drifting into a portfolio-only site;
- support conversion with visible evidence.

## What Must Be On The Page

- short hero that frames references as proof of execution;
- example blocks with concise structure:
  - task type;
  - what was wrong;
  - what was done;
  - reaction or completion timing when safe to disclose;
  - outcome;
  - optional sector or city if allowed;
- before/after or result-focused visual support where available;
- CTA to submit a similar request.

## What Must Be Avoided

- vanity gallery behavior;
- unsafe disclosure of customer or location data;
- inflated case-study language without real proof.

## MVP Role In Navigation

This page answers: `Why should I trust you with my object?`

## Progress Log

### 2026-05-01 — Production Implementation

- Current sprint/block: approved References page implementation in the public website.
- Done: added production route `/[locale]/referenzen` with standard site header/footer and the approved editorial body concept; included disclosure-safe multilingual static content for DE, EN, RU, TR, PL, and AR; implemented case modal, full photo viewer, product category block, moving type band, and request CTA without exposing customer/private/CRM data.
- In progress: ready for owner visual/content review and later replacement with approved real reference photos.
- Next action: review the production page in browser and decide whether future CMS productionization is needed.
- Blockers/risks: current case/photos are safe illustrative project assets, not approved customer case data; CMS model and migrations remain intentionally untouched.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_references.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-04-30

- Current sprint/block: standalone MVP concept prototype for `Примеры работ`.
- Done: created `DesignPrototip/references-mvp.html` as a separate HTML prototype with a cleaner Elfsight-style before/after comparison, repair hotspots, outcome metrics, customer quote proof, case filters, and CTA.
- In progress: owner review of creative direction and interaction model.
- Next action: decide whether to adapt this prototype into the Next.js public route and CMS content model.
- Blockers/risks: prototype uses illustrative case data and SVG scenes; production page needs approved real photos, safe customer disclosure rules, and multilingual DE-first content.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_references.md`.

### 2026-05-01

- Current sprint/block: editorial references direction based on the IBS Group visual reference.
- Done: created `DesignPrototip/references-editorial-v2.html` as a separate HTML prototype with a stronger hero, bento-style recent work cards, hover/focus before-state, clickable case cards, gallery modal, product-category cards, large type band, and CTA. Owner browser comments incorporated: recent-work cards now sit in a horizontally scrollable auto-moving carousel with additional side cards and hover/focus pause; the large type band now animates each line horizontally in opposite directions; a separate compact full work gallery block was added with horizontally scrollable bento packs and clickable photo cards. Full-gallery cards now open a dedicated all-photo viewer with main photo navigation, bottom category filters, and thumbnails instead of opening a single case card. Browser QA follow-up fixed the photo viewer height so the bottom filters and thumbnails fit inside the viewport.
- In progress: approved for developer implementation.
- Next action: implement the public `Referenzen` route using standard production header/footer and the approved page body concept documented in `docs/02_public_website/page_plan_references.md`.
- Blockers/risks: prototype uses existing project images as placeholders; production needs approved before/after photo pairs, disclosure-safe case copy, mobile behavior decisions, and DE-first multilingual content.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_brief_references.md`, `docs/02_public_website/page_plan_references.md`.
