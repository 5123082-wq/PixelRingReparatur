# Design System Documentation Change Log

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
