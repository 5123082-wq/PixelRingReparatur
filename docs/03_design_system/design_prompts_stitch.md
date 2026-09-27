# Design System Reference (As-Built)

Legacy filename retained for compatibility with existing links and migration docs.

Last updated: 2026-09-25. Third homepage iteration is complete locally; integrated visual and build verification passed.

## Scope

This document captures factual current-state UI behavior and structure for the public homepage and key global UI patterns.

This document is not a prompt pack.

## Verification Sources

- Homepage composition:
  - `signage-service/src/app/[locale]/page.tsx`
- Homepage sections:
  - `signage-service/src/components/sections/HeroSection.tsx`
  - `signage-service/src/components/sections/HomeServicesSection.tsx`
  - `signage-service/src/components/sections/HomeProcessSection.tsx`
  - `signage-service/src/components/sections/HomeWorkSection.tsx`
  - `signage-service/src/components/sections/ExcellenceCarousel.tsx`
  - `signage-service/src/components/sections/CoverageMap.tsx`
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

Current owner-approved section order (2026-09-25, third iteration; verified locally):
1. `HeroSection`
2. `HomeServicesSection`
3. `HomeProcessSection`
4. `HomeWorkSection`
5. `ExcellenceCarousel`
6. `CoverageMap`
7. `FAQSection`
8. `FooterCTA`

The work area groups sections 4 and 5: the large before/result case followed by the
photo/video carousel. They remain separate components with distinct content sources.

Current page shell:
- Header: sticky top navigation with language switcher, account/status entry and primary service action.
- Main: the sections above; CMS-controlled sections render when enabled content exists.
- Footer: global footer below CTA block.

The hero keeps the repair-first copy and CMS image. Its primary button and accent use the
header's `#B8643E`. The redundant brand overline is removed; the tilted photo and existing
24-hour urgent-response badge are restored. The badge describes response, not repair
completion. Messenger logo actions sit beside the repair request button. The secondary
service link is removed from the hero; the service grid still has `#services` for other
valid anchors. Custom CMS copy remains preserved without database writes.

The service grid is the only homepage service selector. A compact white process section
combines three steps and three principles without another CTA. The work section uses the
verified Pasternak before/result photos and links to more completed work. The existing
photo/video carousel follows it, with the geography map next, before FAQ and one dark
closing contact section with a form and compact chat, messenger and e-mail options.

Owner decision: the large before/after section is a key permanent homepage block. Future
simplification must preserve it unless the owner separately approves its removal. The media
carousel complements it and must not be treated as a substitute.

The page uses `#EEF3FB`, white content surfaces, dark navy text and a single copper accent.
The restored carousel and map use the same `#EEF3FB` background and `#B8643E` accents;
existing media, links, city map and animations are retained, with mobile map layout being
corrected. This supersedes the previous same-day compositions. `IntakeSection`,
`BentoGridSection`, `TrustSection`, `ReviewsSection` and the older `HomeBeforeAfterSection`
are not mounted. The permanent before/after block is implemented by `HomeWorkSection`,
not that older gallery component. The first-iteration `HomeTasksSection` and its unused
translations were removed; previously existing shared/source components remain.

## Implementation Boundaries

- Hero opens the existing request modal with repair preselected; backend intake behavior is unchanged.
- Chat, messengers and e-mail remain alternate contact channels rather than separate large content sections.
- Process and work-example copy are locale dictionaries in code; the old process/trust CMS fields and visibility toggles do not control these replacement sections. The fixed Pasternak example remains local content. Hero, FAQ and closing contact copy retain their CMS sources; custom form subtitles remain visible.
- The restored carousel reads the existing homepage CMS fields together with static media configuration. The restored map retains its existing content source. Publishing references does not automatically update either the fixed before/after example or the carousel.
- Expanded CMS management and a connection to published references are future work, not part of this iteration. No CMS writes or automatic content synchronization are introduced.
- Process copy presents one accountable company and adds no warranty, timing or geographic claims.
- The large before/after block is one verified real case. Restored carousel media retain their existing context and do not become new verified-project claims merely by being shown alongside it.
- Supported locales: `de`, `en`, `ru`, `tr`, `pl`, `ar`.
- Arabic RTL is enabled at layout level (`dir="rtl"`).

## Verification Status

- Third-iteration lint, type checks and production build pass. Browser checks confirm eight sections in order, six carousel cards with two working videos, desktop/mobile scrolling including Arabic RTL, one inline form, and no secondary hero link.
- Both videos load/play while visible and pause offscreen. Map headings and features do not overlap the stage on mobile. All six locales were checked at 390px and German sizing at 360-1512px with no horizontal overflow; browser error logs are empty.
- The second iteration passed its recorded checks; those results do not validate the newly restored sections or mobile map changes.
- The owner's visual acceptance and any production release remain separate next steps.
- CMS-authored custom copy can differ in length from defaults and requires layout review when edited.

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
