# Page Plan — References / Referenzen

## Status

Approved concept for implementation.

Source prototype:

- `DesignPrototip/references-editorial-v2.html`

Owner decision:

- use the standard production header used on the other public pages;
- use the standard production footer used on the other public pages;
- implement the page body according to the approved standalone concept;
- any required visual or interaction refinements after integration should be handled in code review and implementation follow-up.

## Purpose

The References page is the public proof page for PixelRing Reparatur.

It must show real service credibility without turning PixelRing into a marketplace, contractor directory, or generic portfolio site. The page should communicate one accountable service company, clear repair evidence, and a direct path to request intake.

## Route And Navigation

Target public route:

- preferred German-first route: `/[locale]/referenzen`
- acceptable existing navigation label: `Referenzen` / `References` / localized equivalent

Header and footer:

- do not rebuild the prototype header;
- do not rebuild the prototype footer;
- use the existing production `Header` and `Footer` components/patterns already used by the public website.

## Approved Page Body Structure

Implement the page body based on `DesignPrototip/references-editorial-v2.html`.

### 1. Hero

Large image-led hero in the same spirit as the approved concept.

Required behavior and content intent:

- strong, image-first first viewport;
- concise headline about visible repair outcomes;
- short supporting copy explaining that the page shows what was wrong, what PixelRing repaired, and what changed after service;
- CTA to view work examples;
- CTA to submit or start a similar request;
- small service tags may be used if they support scanning.

### 2. Recent Work Carousel

This is not the full gallery. It is the editorial “latest / selected work” block.

Required behavior:

- horizontal carousel;
- additional cards visible or partially visible to the left/right where viewport allows;
- auto-moving carousel;
- pause movement on hover and focus;
- user horizontal scroll must still work with trackpad/mouse/touch;
- cards remain clickable.

Required card behavior:

- normal state shows the repaired/result image;
- hover/focus state shows a muted or grayscale before image;
- hover/focus also changes supporting text to a `BEFORE` problem-oriented message;
- click opens a case/repair report modal for that specific card.

Case modal content:

- gallery for that specific case;
- case title;
- category;
- problem;
- work done;
- result;
- CTA to submit a similar request.

### 3. Short Repair Report Rows

Use short horizontal rows for a few selected examples.

Intent:

- make the page feel like proof and field reporting, not a decorative image dump;
- show the repair type, issue, and outcome in compact text.

### 4. Full Work Gallery

This is a separate block from the Recent Work Carousel.

Required behavior:

- horizontally scrollable compact gallery;
- bento-style packs inspired by the approved concept;
- cards are smaller than the recent-work cards;
- cards are clickable;
- card click opens a full photo viewer, not the single-case modal.

Full photo viewer behavior:

- opens all gallery photos as one browsing experience;
- click on a gallery card opens the viewer at that selected photo;
- main content area shows one large photo;
- previous/next navigation switches photos;
- keyboard left/right navigation is recommended;
- bottom area contains category filters;
- bottom area contains thumbnails for the active filter;
- the viewer must fit inside the viewport, including filters and thumbnails.

Category examples:

- `Alle` / `All`;
- `LED`;
- `Leuchtkasten`;
- `Neon`;
- `Fassade`;
- `Folien`;
- `Service`;
- `Before` or process categories only if useful.

### 5. Product Categories

Adapt the approved `Our Sector` style to PixelRing product categories.

Category examples:

- LED signs / LED-Buchstaben;
- lightboxes / Leuchtkasten;
- neon and contour lighting;
- facade signs and mounting;
- window films / Folien;
- branch network service / Filialservice.

Click behavior:

- for MVP, category click may scroll or filter within the page;
- later it may navigate to service/category pages if those routes exist.

### 6. Large Type Band

Use the approved large typography band.

Required behavior:

- horizontal movement;
- each row moves independently;
- rows move in opposite directions;
- pause on hover is acceptable;
- respect reduced-motion preferences.

### 7. Final CTA

Use a conversion block that asks the visitor to show a photo of their sign, facade, or advertising element.

CTA should route to the existing public request/intake flow or chat-assisted intake pattern, following current production conventions.

## Content And Safety Rules

Do not expose:

- customer names unless explicitly approved;
- exact addresses;
- request numbers;
- internal CRM statuses;
- internal operator notes;
- private photos or attachments;
- anything that implies the customer can browse other customers’ cases.

Case copy should be disclosure-safe and outcome-focused:

- product type;
- issue;
- work done;
- result;
- optional broad city/sector only if approved.

## CMS / Data Model Guidance

For first implementation, static seed data is acceptable if this keeps scope small.

Recommended future CMS-ready shape:

```ts
type ReferenceCase = {
  id: string;
  locale: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  workDone: string;
  result: string;
  afterImage: string;
  beforeImage?: string;
  gallery: Array<{
    image: string;
    title: string;
    category: string;
    description: string;
  }>;
  published: boolean;
};
```

Do not introduce database migrations unless the implementation task explicitly includes CMS productionization.

## Multilingual Requirements

German is canonical-first.

MVP locales remain:

- DE;
- EN;
- RU;
- TR;
- PL;
- AR.

Arabic implementation must preserve RTL-aware layout and text handling. Image direction and carousel behavior should be checked in RTL before production release.

## Implementation Notes

Use existing project patterns:

- inspect `signage-service/AGENTS.md`;
- inspect `signage-service/package.json`;
- run application commands from `signage-service/`;
- follow the existing public page structure, i18n messages, header/footer, CTA, and route conventions.

The standalone prototype is a visual and interaction reference, not production code to copy blindly. The implementation should translate it into the existing Next.js/Tailwind/component structure.

## Acceptance Criteria

- Standard production header is used.
- Standard production footer is used.
- Page body matches the approved concept closely.
- Recent-work carousel scrolls horizontally, auto-moves, and pauses on hover/focus.
- Recent-work cards show before-state on hover/focus.
- Recent-work cards open specific case modals.
- Full gallery cards open an all-photo viewer, not a single-case modal.
- Full photo viewer fits in viewport with main photo, categories, and thumbnails visible.
- Product category block is present and adapted to PixelRing categories.
- Large type band moves horizontally with rows in opposite directions.
- Final CTA leads toward request intake.
- No private customer data or CRM internals are exposed.
- Responsive desktop and mobile layouts are verified.
- RTL behavior is checked for Arabic before release.

## Progress Log

### 2026-07-21 — Single-Slogan Proof Card

- Current sprint/block: owner-selected replacement of the long report block with one premium slogan card (премиальная карточка-слоган).
- Done: removed the visible statistics, explanatory copy and four compact report rows while preserving their existing CMS data. The block now renders only `Ein Schild darf nicht müde aussehen.` (вывеска не должна выглядеть уставшей) in the existing Inter typeface (шрифт Inter) on the left and a separately replaceable signage image on the right. `reportIntroBlock.image` (общее поле изображения блока) is managed through the current media library for all languages; `reportIntroBlock.imageAlt` (локализованное альтернативное описание изображения) is editable per DE/EN/RU/TR/PL/AR locale. Decorative arcs and the CSS gradient (плавный переход CSS) remain independent layout layers, so replacing the image cannot remove or bake in the transition.
- In progress: owner visual acceptance on the local route.
- Next action: approve the desktop/mobile visual result, then separately approve commit/deployment.
- Blockers/risks: the CMS still contains the hidden report content by design; no content rows were deleted. The visible contract now requires `title` (заголовок), `image` (изображение) and `imageAlt` (альтернативное описание) before publication.
- Updated documents/code: public Referenzen renderer (публичный компонент страницы), CMS adapter/editor/schema (адаптер, редактор и схема CMS), generated replaceable image and decorative background (созданные заменяемое изображение и декоративный фон), CMS update utility (утилита обновления CMS), `design-qa.md` (визуальная проверка), public/admin progress documents (журналы публичного сайта и админ-платформы) and `PROGRESS.md` (краткий глобальный журнал).

### 2026-07-19 — Referenzen CMS Control And Publication Hardening

- Current sprint/block: owner-approved full CMS control and publication correctness for `/[locale]/referenzen` (страница примеров работ).
- Done: replaced the permissive CMS overlay with an authoritative page-specific contract. The fixed public layout now reads every visible section, report row, CTA (кнопку действия), gallery heading, category heading, final heading, photo, Alt text (альтернативное описание), category filter and visibility state from `CmsPage`; disabled blocks and empty lists stay hidden/empty instead of restoring static content. Static fallback (резервный статический контент) is now limited to a genuinely missing row or recoverable database outage; `DRAFT` (черновик), soft-deleted (мягко удалённая) and invalid published records return the not-found page instead of leaking old content. OWNER-only preview (предпросмотр владельца) can show the latest saved draft with `noindex, nofollow` (запрет индексации и перехода по ссылкам).
- Done: made the previously unused reports visible, connected the CMS promo URL, removed the placeholder video modal, made the CMS gallery/category values authoritative, and verified the Russian photo viewer plus category switching and the Arabic RTL layout (арабское направление справа налево) in the local browser.
- Done: repaired all six current CMS records atomically. Removed 18 incomplete gallery cards (three per locale), added 41 stable list IDs (стабильных идентификаторов), filled 191 missing Alt fields (полей альтернативного описания), corrected 18 gallery-category filters and added 18 independently editable layout-label fields. Media rows and binaries were not deleted; every repair pass created a revision and audit record for each changed locale.
- Done: the focused CMS audit (точечный аудит CMS) passes for all six locales with no findings; TypeScript (проверка типов), targeted lint (точечная проверка кода), security verification, focused tests, production build (промышленная сборка), six-locale HTTP crawl (обход шести языковых страниц), Russian interaction check and Arabic RTL check pass.
- In progress: authenticated editor UAT (приёмочная проверка редактора после входа) remains manual because the available browser session was not signed in; no password is required by the agent.
- Next action: the owner signs in normally, then checks one reversible editor scenario: save a draft, open preview (предпросмотр), publish, hide/show a section, add/edit/delete one gallery item, inspect revision history and restore it. Deploy only after this UAT (приёмочная проверка) is accepted.
- Blockers/risks: no known code or data blocker. Commit and deployment were intentionally not performed. Existing media Alt text (альтернативные описания медиатеки) can still be improved editorially per locale even though every published image now has a non-empty Alt value and the editor supports locale-aware Alt management.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/README.md`, `docs/02_public_website/page_plan_references.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`, `docs/05_admin_platform/cms_site_management.md`, `docs/05_admin_platform/page_content_cms_plan.md`, `docs/00_project_overview/project_state_and_roadmap.md`.

### 2026-05-02 — Review Follow-up Scope

- Current sprint/block: References page review follow-up after owner comments.
- Done: kept the accepted proof-hook/report block and category-card behavior unchanged; localized the large type band via `content.typeBandLines`; slowed the type-band animation and removed hover pause; changed the gallery promo tile from a `/leistungen` link into a dedicated video/content modal placeholder; added focus entry, focus return, and keyboard tab containment for the active reference modal without visual redesign.
- In progress: owner visual review on `/ru/referenzen` after the minimal interaction pass.
- Next action: replace the promo modal placeholder with an approved real video/embed target when content is ready.
- Blockers/risks: promo modal currently contains safe placeholder visual content only; reports rows and category filtering remain intentionally deferred by owner decision.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-02 — Semantic Structure Cleanup

- Current sprint/block: References page owner SEO/typography review.
- Done: aligned the selected-work heading to the left, reduced shared section heading scale, restored concise section intro copy, grouped the proof hooks under one section H2 with H3 items, added matching intro rhythm to gallery and category sections, prevented carousel/gallery visual loop clones from producing duplicate heading tags, added scroll margin for the selected-work anchor, and cleaned RU copy in reviewed blocks.
- In progress: owner visual review on `/ru/referenzen`.
- Next action: decide whether the full gallery promo/link block should stay as two visual variants or be reduced to one final content card.
- Blockers/risks: the seamless carousels still keep visual clone content in the DOM for loop mechanics, but cloned card titles no longer create duplicate semantic headings.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-02 — Gallery Bento Pattern Update

- Current sprint/block: References page full-gallery layout refinement.
- Done: rebuilt the gallery pack placement to match the owner-marked pattern, then scaled the card system down for viewport fit. The pack now contains a large square intro tile, one vertical photo/case tile, a stacked small-card column, and a narrower promo tile whose width equals the large square plus vertical tile columns, followed by one small square tile. Added scroll margin to the gallery anchor for fixed header spacing.
- In progress: owner review of exact card proportions on `/ru/referenzen#gallery`.
- Next action: tune the large/vertical/small dimensions if the owner wants a denser or shorter viewport fit.
- Blockers/risks: this pass changes placement only and keeps existing placeholder/project image assets.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-02 — Full Gallery Loop Removal

- Current sprint/block: References page gallery scalability refinement.
- Done: removed the full-gallery three-copy infinite loop and `requestAnimationFrame` autoscroll. The full gallery now renders one horizontal scroll-snap sequence where every pack follows the same two-row pattern: top bento row plus bottom wide tile and small square. Future photos render once instead of three times.
- In progress: owner review of manual horizontal gallery behavior on `/ru/referenzen#gallery`.
- Next action: add approved real photos into `galleryItems` or CMS-backed source when available.
- Blockers/risks: selected-work carousel intentionally still uses its existing seamless loop; this change applies only to the full gallery module.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-02 — Gallery Asset Fill

- Current sprint/block: References page full-gallery photo fill.
- Done: generated one safe illustrative 8-photo contact sheet for sign repair/service references, sliced it into separate WebP assets, stored them under `signage-service/public/images/references/`, and expanded `galleryItems` from 8 to 16 entries so gallery bento packs continue with filled cards instead of empty space.
- In progress: owner visual review of the generated illustrative assets.
- Next action: replace generated illustrative assets with approved real reference photos when available.
- Blockers/risks: generated images are disclosure-safe placeholders, not real customer case photos.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-01 — Prototype Parity Cleanup

- Current sprint/block: References page owner browser-comment cleanup.
- Done: removed the selected-work eyebrow and explanatory paragraph; kept the selected-work headline on one line; replaced the oversized decorative report/card grid with a shorter two-hook attention block; increased selected-work horizontal motion; verified in the in-app browser that clicking a photo card opens the gallery modal.
- In progress: owner visual review on `/ru/referenzen#gallery`.
- Next action: tune exact spacing/card speed only if the owner marks another mismatch against the approved prototype.
- Blockers/risks: browser review markers can visually cover parts of the page during QA, so final spacing should be judged without comment overlays if possible.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-01 — Full Gallery Promo Block

- Current sprint/block: References page approved prototype parity for the full work gallery.
- Done: added the lower wide marketing/link block under the full-gallery photo row in the production `ReferencesExperience` implementation; preserved existing gallery card heights; added localized DE/EN/RU/TR/PL/AR copy plus a link target; added a compact animated video-preview area inside the block as a prototype for future video content.
- In progress: owner visual review of the restored lower promo block on `/de/referenzen`.
- Next action: replace the temporary `/leistungen` link with the final video URL or target page when the content is approved.
- Blockers/risks: block currently uses static localized copy and a prototype animation, not real hosted video content.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-01 — Full Gallery Bento Refinement

- Current sprint/block: References page visual review follow-up for the full work gallery.
- Done: refined the `#gallery` block from a single horizontal row into a two-row bento carousel matching the approved concept more closely; added a leading PixelRing gallery tile, separate large square/small square/smartphone-ratio vertical card containers, a seamless auto-scroll loop slowed by 30%, and hover/focus/pointer pause. Replaced span-based grid placement with explicit flex groups to remove card overlap and keep future CMS image slots size-addressable. Reworked the loop from hover-state-driven duplicated scroll to a ref-driven stable animation over a three-copy center-start track, so hover no longer resets the carousel and manual scrolling works in both directions before wrapping invisibly. Removed side gradient/blur overlays by owner request. Rebuilt the hero as a full-bleed responsive image slider with existing reference photos, automatic crossfade/scale motion, viewport-based height, and more readable text sizing.
- Done: rebuilt the selected-work carousel from ping-pong scrolling to a slower seamless three-copy center-start loop with ref-based hover pause, no reset on hover, and an alternating reels/square card pattern.
- In progress: owner visual review of the refined gallery behavior on `/de/referenzen`.
- Next action: confirm final visual acceptance or tune card sizing/speed after review.
- Blockers/risks: gallery still uses disclosure-safe placeholder/project assets until final approved real work photos are available.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`.

### 2026-05-01 — Production Implementation

- Current sprint/block: References page production route implementation.
- Done: implemented `/[locale]/referenzen` in the Next.js app with the standard production header and footer; translated the approved editorial V2 body into project Tailwind/React patterns; added DE/EN/RU/TR/PL/AR static disclosure-safe content; connected `Referenzen` navigation to `/referenzen`; implemented recent-work auto carousel, hover/focus before-state, case modal, repair report rows, compact gallery, full photo viewer with filters/thumbnails, product categories, moving type band with reduced-motion handling, and final request CTA.
- In progress: production can now be reviewed on the dev server for final visual/content approval and real photo replacement decisions.
- Next action: owner visual review of `/de/referenzen` and `/ar/referenzen`; decide whether references should later become CMS-managed with approved real before/after assets.
- Blockers/risks: images remain approved-safe project placeholder assets rather than final customer-specific photos; full automated mobile viewport testing was limited by available browser tooling, though responsive CSS and in-app desktop/RTL checks were completed.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_references.md`, `docs/02_public_website/page_brief_references.md`.

### 2026-05-01

- Current sprint/block: approved References page implementation handoff.
- Done: owner approved `DesignPrototip/references-editorial-v2.html` as the implementation concept; this handoff plan documents required structure, interactions, content boundaries, and acceptance criteria.
- In progress: ready for developer implementation in the Next.js app.
- Next action: implement the route using standard production header/footer and approved page body concept.
- Blockers/risks: production needs approved real before/after photo pairs or safe placeholder content; CMS data model should not be expanded without a separate implementation decision.
- Updated documents: `docs/02_public_website/page_plan_references.md`, `docs/02_public_website/page_brief_references.md`, `PROGRESS.md`.
