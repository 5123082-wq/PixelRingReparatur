# Component Guidelines And Inventory

Last updated: 2026-04-13.

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

## Change Control

Before changing any component listed above:
1. Check related copy in `signage-service/messages/*.json`.
2. Update corresponding row status/notes in this file.
3. Add dated entry to `change_log.md`.
