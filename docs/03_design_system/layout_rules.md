# Layout Rules

Last updated: 2026-04-13.

## Global Structure

- Locale route shell:
  - Header (sticky)
  - Main content
  - Footer
- Homepage composition is defined in:
  - `signage-service/src/app/[locale]/page.tsx`

## Container Rules

Current recurring container patterns:
- Main content width: `max-w-7xl`
- Horizontal padding: `px-6` (with responsive variants by component)
- Vertical rhythm: section blocks around `py-20` to `py-24`

When creating new sections:
- Keep alignment with existing `max-w-7xl` grid rhythm unless a full-bleed section is intentional.
- Keep visual rhythm consistent with adjacent sections.

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
