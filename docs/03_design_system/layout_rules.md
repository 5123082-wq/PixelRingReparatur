# Layout Rules

Last updated: 2026-07-12.

## Global Structure

- Locale route shell:
  - Header (sticky)
  - Main content
  - Footer
- Homepage composition is defined in:
  - `signage-service/src/app/[locale]/page.tsx`

## Container Rules

The canonical outer frame for the public site is `pr-site-container`, defined in
`signage-service/src/app/globals.css`.

- Use it for the header logo/action row, desktop navigation row, ordinary public-page content,
  shared footer content, and standalone public-entry shells.
- At the base breakpoint it is `width: 100%`, `max-width: 80rem`, centered, with `1rem` inline
  gutters. At `640px` and above, the inline gutters are `1.5rem`.
- At `1280px` and above it is `width: calc(100% - 3rem)`, `max-width: 83.25rem` (`1332px`),
  centered, with no additional inner inline padding. This is the homepage-derived canonical
  desktop geometry; at a `1512px` viewport its visible side inset is `90px`.
- Use one outer container per visual surface. Do not repeat outer `px-*`, `max-w-*`, or
  `mx-auto` rules inside a section merely to recreate the page rail.
- Preserve intentionally narrower inner reading columns, forms, cards, and navigation grids.
  Those are content-width constraints, not replacements for the outer page frame.

Full-bleed sections remain allowed for backgrounds, maps, media, and visual stages. Their
content, controls, headings, and overlays must return to `pr-site-container` unless the visual
itself is deliberately edge-to-edge.

### Horizontal Carousel Exception

Use a dedicated rail only when a block is a horizontally scrollable media or case carousel.

- The shared homepage utility is `pr-carousel-rail` in `globals.css`. It spans the viewport while
  its items start at `max(1rem, calc((100vw - 90rem) / 2 + 1rem))`; its scroll padding uses the
  same value.
- Keep `overflow-x-auto`, snap behavior, and any scroll buttons on the rail itself. The document
  must not gain horizontal overflow.
- A section-specific carousel rail is permitted when its interaction or card geometry requires
  it, but it must remain explicitly scoped and preserve the same controlled-overflow principle.
- Do not treat ordinary overflowing grids, tables, dashboards, or authenticated application
  views as carousels.
- Use logical direction-aware styles so Arabic RTL scrolling and controls remain coherent.

## Content Air Rules

For large public-site content blocks, especially B2B/feature sections like `/business`, treat the informational block as the measurement target for vertical air.

Canonical desktop air for large content blocks:
- Top air before the main content grid: `105px`.
- Bottom air after the main content grid: `100px`.

Content block definition:
- The main content grid includes the section heading, body text, cards, CTAs, visual mockup, and meaningful floating UI attached to that block.
- Small section markers such as `Section Eyebrow` are not counted as the start of the main content grid.

Section marker placement:
- When a `Section Eyebrow` is used above a large content grid, place it inside the top air.
- Center the marker vertically within the top air whenever possible.
- With the current `Section Eyebrow` height of about `18px`, the accepted desktop placement is:
  - `44px` from section top to marker;
  - `43px` from marker bottom to the main content grid;
  - `105px` total from section top to main content grid.

Usage rules:
- Neighboring large sections should not have visibly different empty fields above or below their main content without a deliberate reason.
- Visual mockups and floating cards attached to a block count as part of the block for vertical-air judgment.
- Do not create extra top air by placing an eyebrow as a separate mini-section above the grid.
- If exact values must change for responsive layouts, preserve the same visual relationship: the marker sits inside the top air and the main content grid remains the measurement anchor.

## Section Order Rules

Current homepage order is documented in:
- `design_prompts_stitch.md`

If section order changes:
1. Update `signage-service/src/app/[locale]/page.tsx`.
2. Update `design_prompts_stitch.md`.
3. Add entry to `change_log.md`.

## CTA Placement Rules

- Hero must keep a primary CTA above the fold.
- At least one messenger or chat path must remain immediately reachable.
- Final conversion block must remain near page end (`FooterCTA` pattern).

## Inner-Page Final CTA Rules

Use this rule for final conversion blocks on secondary public pages such as `/business`, `/leistungen`, `/referenzen`, `/probleme-loesungen`, and `/ueber-uns`.

- Inner-page final CTA blocks should be visually consistent across secondary pages, but lighter and more compact than the homepage/global `FooterCTA`.
- The standard action area contains one primary service button only.
- Do not place messenger icons, chat icons, e-mail links, or secondary quick-contact buttons directly beside the inner-page final CTA button.
- Messenger and chat entry points remain available through the sticky header, mobile menu, footer, and the global homepage/footer contact surfaces.
- Supporting text may explain the next step, service scope, or trust context, but should not become a second action cluster.
- The `/business` final CTA with only `Запросить сервис` / `Service anfragen` is the current accepted reference pattern.

## Header And Navigation Rules

- Header is sticky and includes:
  - logo
  - nav links
  - messenger buttons
  - language switcher
  - repair CTA
- Anchor links in header must map to real section IDs. If anchors are present without targets, fix either:
  - anchor destination; or
  - section IDs.

## Mobile Rules

- Mobile navigation must preserve direct conversion path.
- Avoid requiring deep scroll before first actionable CTA.
- Sticky header is current baseline; dedicated sticky CTA bar is currently not implemented.

## RTL Rules

- Components must use logical direction classes (`ltr:`/`rtl:`) where directional behavior is visible.
- Do not hardcode left/right-only assumptions for key controls.
