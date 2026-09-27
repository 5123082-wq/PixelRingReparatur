# Component Guidelines And Inventory

Last updated: 2026-09-25.

## Status Legend

- `stable`: matches current product intent and implementation usage.
- `partial`: usable, but has known mismatch or unclear behavior.
- `needs-alignment`: implementation exists but documentation/behavior conflict should be resolved.

## Homepage Component Inventory

| Component | Path | Purpose | Status | Notes |
|---|---|---|---|---|
| Header | `signage-service/src/components/layout/Header.tsx` | Global nav, language switch, account and service actions | `stable` | Existing navigation remains; the primary copper button is the homepage color reference. |
| HeroSection | `signage-service/src/components/sections/HeroSection.tsx` | Repair-first statement and request CTA | `stable` | Third iteration removes the secondary services link; primary action, messenger logos, `#B8643E`, tilted CMS image and urgent-response badge remain. Verified locally. |
| HomeServicesSection | `signage-service/src/components/sections/HomeServicesSection.tsx` | Existing localized service grid | `stable` | Moved directly below hero; homepage's only service selector at `#services`; verified locally. |
| HomeProcessSection | `signage-service/src/components/sections/HomeProcessSection.tsx` | Three work stages and three service principles | `stable` | One white surface, plain columns and dividers, six locales in code, no CTA; verified locally. |
| HomeWorkSection | `signage-service/src/components/sections/HomeWorkSection.tsx` | Permanent large before/after block | `stable` | Owner-designated key homepage block: preserve during future simplification. Fixed Pasternak photos/copy in code; carousel complements it; no automatic reference-publishing updates. |
| ExcellenceCarousel | `signage-service/src/components/sections/ExcellenceCarousel.tsx` | Complementary photo/video work carousel | `stable` | Restored after the large before/after block; existing media/links and CMS fields plus static media configuration retained, aligned to light/copper style. Verified locally. |
| CoverageMap | `signage-service/src/components/sections/CoverageMap.tsx` | Service geography map | `stable` | Restored after carousel and before FAQ. Existing cities/animations retained; light/copper palette aligned; title, stage and features separated on mobile. Verified locally. |
| FAQSection | `signage-service/src/components/sections/FAQSection.tsx` | Objection handling and clarifications | `stable` | Existing accordion with homepage appearance; verified locally. |
| FooterCTA | `signage-service/src/components/sections/FooterCTA.tsx` | One final form with compact alternate contacts | `stable` | Dark closing surface; chat, messengers and e-mail remain accessible; verified locally. |

Removed from the homepage composition on 2026-09-25: `HomeTasksSection`, `IntakeSection`,
`BentoGridSection`, `TrustSection` and `ReviewsSection`. `ExcellenceCarousel` and `CoverageMap`
were restored in the third iteration.
The first-iteration task selector and its unused translations were removed; previously existing shared/source files are retained. `HomeBeforeAfterSection` and `RoadmapSection` also
remain outside the current homepage composition. Their existence is not evidence that the
current homepage uses them. The permanent large before/after section is `HomeWorkSection`,
not the older `HomeBeforeAfterSection` gallery.

Content-management boundary: the fixed before/after example remains local code. The carousel
uses existing homepage CMS fields and static media configuration; publishing a reference
does not automatically update either block. Expanded CMS integration is future work, with
no CMS writes or automatic synchronization added in this iteration.

## Shared Interaction Components

| Component | Path | Status | Notes |
|---|---|---|---|
| ContactModal | `signage-service/src/components/common/ContactModal.tsx` | `stable` | Centralized entry UI for multiple channels. |
| ContactForm | `signage-service/src/components/common/ContactForm.tsx` | `stable` | Supports attachment and status-link continuation. |
| LanguageSwitcher | `signage-service/src/components/common/LanguageSwitcher.tsx` | `stable` | Supports 6 locales and RTL route usage. |

## Shared Visual Components

### Shared Layout Primitives

Status: `stable`.

| Primitive | Source | Required use | Exception boundary |
|---|---|---|---|
| `pr-site-container` | `signage-service/src/app/globals.css` | One common outer rail for public header rows, normal public content, footer content, and standalone public-entry shells. | Do not use it to replace a deliberately narrow inner reading/form width or an authenticated application shell. |
| `pr-carousel-rail` | `signage-service/src/app/globals.css` | Shared viewport-spanning rail for the homepage’s horizontal media/case carousels. | Use only for controlled horizontal carousels; full-bleed media and specialized carousel implementations may keep a scoped rail when documented. |

The `pr-site-container` desktop maximum is `83.25rem` (`1332px`) from `1280px` upward, with
`16px`/`24px` mobile and tablet gutters below that breakpoint. Header logo/action alignment is part
of this contract, not a homepage-only treatment.

### Public Content Typography

Status: `stable`.

Homepage exception (2026-09-25): ordinary section headings use a consistent `32px` mobile /
`42px` larger-screen scale with dark navy text; compact card titles use the same restrained
weight family. No new overline is required when it repeats the heading or brand. White
surfaces on `#EEF3FB`, `#0E1A2B` text, `#4A5568` body text and `#B8643E` accents replace the
previous mixture of beige, copper variants and repeated dark panels. Hero and final contact
layout retain their own scale. Restored carousel and map use the same light/copper palette;
third-iteration integrated visual verification passed; owner acceptance remains pending.

Purpose: shared typography scale for large public-site content blocks, especially B2B/feature sections with heading, intro text, cards, and a visual mockup.

Current accepted example:
- `/business` content sections:
  - target groups block;
  - audit and service block;
  - portal and reports block.

Desktop standard:
- Large section heading: `Inter`, `44px`, `font-weight: 800`, `line-height: 50px`, `letter-spacing: 0`.
- Section intro text: `Inter`, `18px`, `font-weight: 400`, `line-height: 1.6`, `letter-spacing: 0`.
- Card heading: `Inter`, `20px`, `font-weight: 900`, `line-height: 25px`, `letter-spacing: 0`.
- Card body text: `Inter`, `15px`, `font-weight: 400`, `line-height: 1.55`, `letter-spacing: 0`.

Section intro accent standard:
- Large public content blocks may use an accent line on the section intro paragraph when the intro should read as a stronger orienting statement.
- Use a `2px` accent border in `#B8643E`.
- Place the accent line on the reading-start side:
  - LTR: left border with `16px` left padding.
  - RTL: right border with `16px` right padding.
- Do not use the accent line on every paragraph inside a section. Reserve it for the main intro directly under the section heading or for a final CTA support line.
- Current accepted example: `/business` intro paragraphs in `SECTORS`, `Service-Abo`, and `Kundenportal & Reports`, plus the support line in the inner-page final CTA.

Responsive baseline:
- Large section heading may step down to `36px / 42px` on mobile and `40px / 46px` on tablet before reaching `44px / 50px` on large desktop.
- Card heading may step down to `18px / 23px` on smaller screens.
- Keep `letter-spacing: 0` for these content headings; avoid negative tracking for multilingual section and card text.

Usage rules:
- Use this standard for large informational sections and their primary cards.
- Do not automatically apply it to hero headings, final CTA panels, legal pages, admin/CRM screens, status widgets, badges, filters, or small UI labels.
- If a section needs a different size for a clear design reason, document that exception in the relevant page or component notes.

Implementation direction:
- Prefer shared constants or tokens near the owning page/component until the pattern is promoted into global design tokens.
- For `/business`, the current implementation uses local constants in `signage-service/src/app/[locale]/business/page.tsx`.

### Section Eyebrow

Status: `stable`.

Purpose: short section or card overline placed above a heading to name the block context.

Canonical naming:
- English: `Section Eyebrow`
- Russian: `надзаголовок секции`
- Acceptable aliases in discussion: `eyebrow`, `kicker`, `section label`

Default visual standard:
- Use the minimal text style of the shared `SectionEyebrow` component; the old homepage `PROCESS` example is historical.
- Use small uppercase text.
- Use accent color `#B8643E`.
- Use strong weight (`font-bold` or `font-black`, depending on local type scale).
- Use increased letter spacing.
- Do not use a pill, rounded badge, or filled container by default.

Usage rules:
- Use `Section Eyebrow` where it adds useful context above section headings or major card groups; omit redundant labels on the current homepage.
- Keep wording short: one to three words where possible.
- Localize visible text through the relevant content source.
- Preserve RTL alignment behavior for Arabic layouts.
- Do not use this component for statuses, filters, tariff tags, chips, or operational labels. Those should remain badges/chips.

Implementation direction:
- Use the shared component at `signage-service/src/components/common/SectionEyebrow.tsx`.
- New or touched sections should prefer the shared component over repeating inline Tailwind classes.
- Existing pill-style labels such as `Service-Abo` should be converted to this text-eyebrow standard when the surrounding section is next edited, unless the label is functioning as a status, tag, or filter.

## Change Control

Before changing any component listed above:
1. Check related copy in `signage-service/messages/*.json`.
2. Update corresponding row status/notes in this file.
3. Add dated entry to `change_log.md`.
