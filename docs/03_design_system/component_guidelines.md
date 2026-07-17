# Component Guidelines And Inventory

Last updated: 2026-07-12.

## Status Legend

- `stable`: matches current product intent and implementation usage.
- `partial`: usable, but has known mismatch or unclear behavior.
- `needs-alignment`: implementation exists but documentation/behavior conflict should be resolved.

## Homepage Component Inventory

| Component | Path | Purpose | Status | Notes |
|---|---|---|---|---|
| Header | `signage-service/src/components/layout/Header.tsx` | Global nav, language switch, quick actions | `needs-alignment` | Contains `#services` and `#warranty` anchors without confirmed section IDs. |
| HeroSection | `signage-service/src/components/sections/HeroSection.tsx` | First-screen value statement and primary CTA | `stable` | Includes anti-marketplace trust line and messenger shortcuts. |
| IntakeSection | `signage-service/src/components/sections/IntakeSection.tsx` | Visual entry methods for request start | `partial` | Methods look distinct, but actions converge into shared modal flow. |
| BentoGridSection | `signage-service/src/components/sections/BentoGridSection.tsx` | Process explanation ("how it works") | `partial` | Copy includes "network" framing that should be controlled. |
| TrustSection | `signage-service/src/components/sections/TrustSection.tsx` | Credibility and capability framing | `stable` | Placement currently lower than intended in old concept docs. |
| CoverageMap | `signage-service/src/components/sections/CoverageMap.tsx` | Service geography and operational coverage | `partial` | Semantically overlaps with "why easier/more efficient" block. |
| ExcellenceCarousel | `signage-service/src/components/sections/ExcellenceCarousel.tsx` | Service/case showcase | `stable` | Works as proof/cases surface when paired with reviews. |
| ReviewsSection | `signage-service/src/components/sections/ReviewsSection.tsx` | Social proof/testimonials | `stable` | Combined with Excellence forms current proof layer. |
| RoadmapSection | `signage-service/src/components/sections/RoadmapSection.tsx` | Post-submission expectation setting | `stable` | Covers "what happens after request". |
| FAQSection | `signage-service/src/components/sections/FAQSection.tsx` | Objection handling and clarifications | `stable` | Standard accordion behavior. |
| FooterCTA | `signage-service/src/components/sections/FooterCTA.tsx` | Final conversion block with form/chat/messengers | `stable` | Strong closing CTA and multi-channel entry. |

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
- Use the minimal text style shown by the homepage `PROCESS` label.
- Use small uppercase text.
- Use accent color `#B8643E`.
- Use strong weight (`font-bold` or `font-black`, depending on local type scale).
- Use increased letter spacing.
- Do not use a pill, rounded badge, or filled container by default.

Usage rules:
- Use `Section Eyebrow` above section headings and major card groups.
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
