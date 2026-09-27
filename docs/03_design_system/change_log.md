# Design System Documentation Change Log

## 2026-09-25

### Third iteration — current local implementation

- Removed the hero's secondary services link and restored the existing photo/video carousel
  after the large before/after section, then the geography map before FAQ. The homepage now
  has eight component sections; before/after plus carousel form the combined work area.
- Recorded the owner's permanent decision: the large before/after block is a key homepage
  element and must remain through future simplification unless the owner explicitly changes
  that decision. The carousel complements this block rather than replacing it.
- Preserved the fixed local Pasternak case and existing carousel CMS fields/static media
  configuration. Reference publishing does not automatically update these blocks. Expanded
  CMS integration remains future work; no CMS writes or automatic synchronization are added.
- Returning carousel and map adopt `#EEF3FB` and `#B8643E`; existing cities, animation,
  media and links remain. Mobile title, map and feature rows no longer overlap.
- Targeted lint, types and production build pass. Browser checks confirm media playback and pause, carousel scrolling including RTL, six locales, eight sections in order, one inline form and no overflow from 360-1512px.

### Second iteration — historical checkpoint, extended by third iteration

- Applied the owner's review to the whole homepage composition: hero → existing services →
  compact process/principles → verified Pasternak work example → FAQ → one final contact form.
- Restored the tilted hero photo and existing 24-hour urgent-response badge, removed the
  brand overline, aligned hero accents with the header's `#B8643E` and grouped messenger logos
  with the primary request button. The badge does not promise repair completion within 24 hours.
- Removed duplicate task selection, large channel selection, old process/trust, gallery,
  coverage and review sections from this composition. Removed the first-iteration task selector and its unused translations; retained previously existing source/shared components.
- Standardized the light `#EEF3FB` background, white surfaces and dark final contact section.
  Added six-language process and verified-work copy with RTL support. No backend or CMS writes.
- Integrated lint, types and production build pass. German sizing from 360–1512 px, all six locales at 390 px, Arabic RTL, zero overflow, request/modal, FAQ, chat, anchors and the references link were checked. Owner review and release remain separate.

### First iteration — superseded after owner review

- Reworked the first two homepage blocks with owner approval: repair-first hero and compact
  task selector replacing the before/after carousel. Subsequent sections remain unchanged.
- Kept custom CMS copy and imagery, added six-language entry copy, removed the unqualified
  24-hour badge, and kept direct request and messenger paths.
- Verified desktop/mobile sizing, six locales, Arabic RTL, repair preselection, anchors,
  targeted lint, types and production build. Owner visual acceptance remains pending.

## 2026-07-25

- Replaced the `/[locale]/ueber-uns` hero diagnostic terminal with the owner-selected logo-led
  service-line composition.
- Reused the official PixelRing ring and square as a dedicated transparent visual asset instead
  of introducing a dashboard, photograph, CSS drawing, or inline SVG.
- Kept the headline and body copy as live localized text; added three short localized process
  labels and simplified the following benefit row into a numbered editorial strip.
- Verified the new composition at 1440 × 900 and 390 × 844, including Arabic RTL and zero
  horizontal overflow.

## 2026-07-12

- Replaced the stale `max-w-7xl` / repeated section-gutter guidance with the implemented global
  `pr-site-container` rule: `16px`/`24px` small-screen gutters and a centered `1332px` maximum
  desktop frame from `1280px` upward.
- Documented that the header logo/action row, ordinary public-page content, and footer use the
  same outer rail; narrow inner reading/form widths remain intentional nested constraints.
- Added the `pr-carousel-rail` exception and controlled-overflow requirements for horizontal
  media/case carousels, including RTL and document-overflow checks.
- Expanded responsive verification from homepage-only checks to all public-page layout changes.

## 2026-05-23

- Added the inner-page final CTA standard: secondary public pages should use a consistent compact final CTA with one primary service button only, without messenger/chat/e-mail quick-action icons beside the button. The `/business` final CTA is the accepted reference pattern.
- Added the section intro accent-line standard: large public content blocks may use a `2px` `#B8643E` reading-start border with `16px` inner padding for the main intro paragraph, including RTL-aware right-side placement for Arabic.

## 2026-05-22

- Added `Public Content Typography` as the accepted standard for the same kind of public B2B/feature blocks currently adjusted on `/business`: large section headings `44px / 50px / 800`, section intro `18px / 1.6`, card headings `20px / 25px / 900`, and card body text `15px / 1.55`.
- Added `Section Eyebrow` as the standard section/card overline pattern.
- Standardized the preferred visual treatment on the homepage `PROCESS` label: minimal uppercase text, accent color, strong weight, increased letter spacing, and no pill container by default.
- Documented that pill/badge styling should be reserved for statuses, filters, tariff tags, chips, and operational labels.
- Added the shared `signage-service/src/components/common/SectionEyebrow.tsx` component direction and started applying it on the B2B page.
- Added large-section content-air rules based on the accepted `/business` spacing pass: `105px` top air to the main content grid, `100px` bottom air after the main content grid, with `Section Eyebrow` centered inside the top air.

## 2026-04-13

- Replaced prompt-pack content in `design_prompts_stitch.md` with factual as-built design system reference.
- Introduced explicit source-of-truth policy: code is current-state authority.
- Added `design_principles.md` with product, UX, visual, and governance principles.
- Added `layout_rules.md` with container, section order, CTA, header, mobile, and RTL rules.
- Added `component_guidelines.md` with homepage component inventory and status labels.
- Added `responsive_accessibility.md` with localization, RTL, responsive, and accessibility verification checklists.
- Updated `README.md` in `03_design_system/` to describe verification-first documentation structure.
