# Design System Reference (As-Built)

Legacy filename retained for compatibility with existing links and migration docs.

Last verified: 2026-04-13.

## Scope

This document captures factual current-state UI behavior and structure for the public homepage and key global UI patterns.

This document is not a prompt pack.

## Verification Sources

- Homepage composition:
  - `signage-service/src/app/[locale]/page.tsx`
- Homepage sections:
  - `signage-service/src/components/sections/HeroSection.tsx`
  - `signage-service/src/components/sections/IntakeSection.tsx`
  - `signage-service/src/components/sections/BentoGridSection.tsx`
  - `signage-service/src/components/sections/TrustSection.tsx`
  - `signage-service/src/components/sections/CoverageMap.tsx`
  - `signage-service/src/components/sections/ExcellenceCarousel.tsx`
  - `signage-service/src/components/sections/ReviewsSection.tsx`
  - `signage-service/src/components/sections/RoadmapSection.tsx`
  - `signage-service/src/components/sections/FAQSection.tsx`
  - `signage-service/src/components/sections/FooterCTA.tsx`
- Global UI:
  - `signage-service/src/components/layout/Header.tsx`
  - `signage-service/src/components/common/ContactModal.tsx`
  - `signage-service/src/components/common/ContactForm.tsx`
  - `signage-service/src/components/common/LanguageSwitcher.tsx`
- Localization and direction:
  - `signage-service/src/i18n/routing.ts`
  - `signage-service/src/app/[locale]/layout.tsx`
  - `signage-service/messages/*.json`

## Homepage As-Built Snapshot

Current section order:
1. `HeroSection`
2. `IntakeSection`
3. `BentoGridSection`
4. `TrustSection`
5. `CoverageMap`
6. `ExcellenceCarousel`
7. `ReviewsSection`
8. `RoadmapSection`
9. `FAQSection`
10. `FooterCTA`

Current page shell:
- Header: sticky top navigation with language switcher and messenger actions.
- Main: 10 sections listed above.
- Footer: global footer below CTA block.

## What Is Confirmed In Current UI

- Primary CTA is above the fold in hero.
- Entry channels are visible:
  - form
  - photo
  - WhatsApp
  - Telegram
  - voice (as intake option text and icon)
- Anti-marketplace copy is present in hero trust badge.
- FAQ and final CTA are implemented.
- Supported locales: `de`, `en`, `ru`, `tr`, `pl`, `ar`.
- Arabic RTL is enabled at layout level (`dir="rtl"`).

## Known Gaps Against Intended Structure

- Trust block is not placed directly after hero.
- No dedicated standalone section explicitly titled as task scenarios.
- No dedicated standalone section explicitly titled as "why easier / more efficient".
- No dedicated sticky mobile CTA bar; current pattern relies on sticky header and mobile menu CTA.
- Intake method cards currently open a shared modal flow instead of distinct entry flows.
- Header contains `#services` and `#warranty` anchors that are not mapped to explicit homepage section IDs.

## Content Framing Risks To Watch

Current copy includes wording such as:
- "best qualified expert from our network"
- "nationwide network of experts"

This may weaken one-company positioning if not controlled in surrounding copy.

## Usage Rules For Future Design Work

- Start from this as-built document, not from historical prompt packs.
- Before proposing layout changes, verify current code paths listed above.
- If introducing a new section, update:
  - this document;
  - `component_guidelines.md`;
  - `change_log.md`.
- If changing entry flow behavior, explicitly document whether channels are:
  - visual entry options to one flow; or
  - truly distinct flows.
