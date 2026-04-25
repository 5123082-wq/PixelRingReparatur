# Page Plan — Probleme & Loesungen

Status: approved for developer handoff before implementation.

Canonical route: `/de/probleme-loesungen`

Canonical language: German first. Other MVP locales (`en`, `ru`, `tr`, `pl`, `ar`) must preserve the same page structure and intent after German content is approved.

Existing support articles must not be changed during this implementation step. Article rewrites and deeper knowledge-base optimization are deferred until the end of the page rollout.

## Product Role

`Probleme & Loesungen` is the problem-first public page for visitors who do not know the service category, but know what is wrong with their sign, light advertising, storefront graphic, film, lettering, or site branding.

The page must answer:

`I see a problem at my location. What could it mean, and what should I request from PixelRing?`

It must not read like:

- a generic FAQ page;
- a post-purchase support desk;
- a marketplace diagnosis tool;
- a deep DIY troubleshooting manual;
- a support-center sprawl that distracts from request intake.

The page must position PixelRing as:

- one accountable service company;
- one controlled intake path for unclear, urgent, or symptom-led requests;
- a practical bridge from visible problems to service requests;
- AI-assisted at intake level, with human specialist execution.

## Confirmed Owner Decisions

Confirmed by project owner on 2026-04-25:

- The previous `/support#symptoms` navigation behavior was a temporary route and must be replaced.
- The menu label `Loesungen` alone is not preferred for German.
- The approved German menu label is `Probleme & Loesungen`.
- The approved SEO direction is:
  - menu label: `Probleme & Loesungen`;
  - route: `/probleme-loesungen`;
  - SEO title: `Probleme mit Werbeanlagen? Typische Schaeden & Loesungen | PixelRing`;
  - H1: `Typische Probleme mit Werbeanlagen erkennen und richtig loesen`.
- `Support Center` may remain as a supporting knowledge/help concept, but not as the main header label for this page.
- Existing support articles must remain unchanged until the final content/article optimization step.

## Route And Navigation Rules

Required route:

- `/[locale]/probleme-loesungen`

Header navigation must point to this route, not to `/support#symptoms`.

Update all current temporary navigation sources:

- `signage-service/src/components/layout/Header.tsx`
- `signage-service/scripts/seed-cms-pages-baseline.mjs`
- published CMS global navigation records, if the active environment reads header links from CMS

Recommended localized menu labels:

- DE: `Probleme & Loesungen`
- EN: `Problems & Solutions`
- RU: `Проблемы и решения`
- TR: `Sorunlar ve Cozumler`
- PL: `Problemy i rozwiazania`
- AR: `المشكلات والحلول`

URL should remain ASCII and stable:

- `/probleme-loesungen`

Do not use:

- `/support#symptoms` as the menu destination;
- `FAQ` as the main page label;
- `Support Center` as the main header label for this page.

## SEO And GEO Rules

German canonical SEO:

- SEO title: `Probleme mit Werbeanlagen? Typische Schaeden & Loesungen | PixelRing`
- Meta description: explain typical signage, light advertising, LED, film, lettering, and safety problems and route visitors to a PixelRing request.
- H1: `Typische Probleme mit Werbeanlagen erkennen und richtig loesen`

Recommended H2 structure:

- `Werbeanlage leuchtet nicht`
- `LED-Schild oder Leuchtkasten flackert`
- `Ungleichmaessige Beleuchtung oder einzelne dunkle Bereiche`
- `Buchstaben, Folien oder Beschriftungen sind beschaedigt`
- `Wasserschaden, Wetterfolgen oder Korrosion`
- `Wann ist eine dringende Reparatur noetig?`
- `Welche Angaben helfen bei der Einschaetzung?`
- `Haeufige Fragen zu Schaeden und Reparatur`

SEO pages must still behave as conversion pages:

- visible CTA near the top;
- problem cards must lead into request intake;
- long SEO/GEO copy belongs below the primary problem-and-solution interaction;
- no unsafe DIY repair instructions.

## Page Structure

The approved page has seven main sections:

1. Hero
2. Problem-to-solution cards
3. Animated before/after impact panel
4. Urgent safety guidance
5. What PixelRing needs for assessment
6. SEO/GEO explanatory content
7. FAQ/support-center bridge and final CTA

## Section 1 — Hero

Goal: tell the visitor they can start from a visible problem, not from the technical service term.

H1:

`Typische Probleme mit Werbeanlagen erkennen und richtig loesen`

Subline:

`Nicht sicher, ob es Elektrik, LED, Folie, Befestigung oder Witterungsschaden ist? Beschreiben Sie das sichtbare Problem oder senden Sie ein Foto. PixelRing prueft den naechsten sinnvollen Schritt.`

Primary CTA:

`Problem schildern`

Secondary CTA:

`Foto senden`

Trust line:

`Eine Anfrage. Klare Einschaetzung. Fachliche Umsetzung durch Spezialisten.`

## Section 2 — Problem-To-Solution Cards

Format: visible cards or compact accordion cards.

SEO/accessibility requirement:

- H2 for the section;
- H3 for each problem;
- summary and solution text must exist in initial HTML;
- expanded details must not be fetched only after click;
- controls must be keyboard accessible.

H2:

`Welche Situation passt zu Ihrem Problem?`

Approved initial problems:

- `Werbeanlage leuchtet nicht`
- `Werbeanlage flackert`
- `Ungleichmaessiges Leuchten der LEDs`
- `Ein einzelner Buchstabe leuchtet nicht`
- `Werbeanlage schaltet nach Regen ab`
- `Folie an der Schaufensterflaeche hat sich geloest`
- `Folie ist ausgeblichen`
- `Werbeanlage wackelt`
- `Dringende Reparatur erforderlich`

Each card should include:

- visible symptom;
- likely issue in cautious wording;
- what PixelRing typically checks or coordinates;
- CTA with a problem intent.

Avoid:

- exact remote diagnosis;
- repair guarantees before assessment;
- instructions to open electrical systems, climb, dismantle, or self-repair.

## Section 3 — Animated Before/After Impact Panel

Goal: visually explain why resolving visible signage and branding problems matters for the customer's location.

This is not a financial promise. It must be framed as typical operational/visibility effects after the problem is addressed.

Recommended title:

`Was sich nach der Behebung verbessern kann`

Approved metric examples:

- `Sichtbarkeit`
- `Standortwirkung`
- `Orientierung fuer Kunden`
- `Ausfallrisiko`

Interaction concept:

- show a simple before/after state;
- start with a visible problem such as `flackerndes Licht`, `dunkler Buchstabe`, or `geloeste Folie`;
- animate bars or counters from weak/problem state to improved state;
- use restrained motion and respect `prefers-reduced-motion`;
- do not imply guaranteed revenue growth.

Do not use:

- guaranteed conversion uplift;
- exact percentage claims unless documented;
- fake customer business data.

## Section 4 — Urgent Safety Guidance

Goal: separate urgent safety cases from normal problem classification.

H2:

`Wann ist eine dringende Reparatur noetig?`

Required guidance:

- if there is burning smell, sparks, loose parts, exposed wiring, severe storm damage, or risk to pedestrians, the customer should switch off the system if safely possible and contact PixelRing directly;
- do not give DIY electrical or mounting instructions;
- route to urgent request or phone CTA.

CTA:

`Dringenden Fall melden`

Secondary CTA:

`Techniker anrufen`

## Section 5 — What PixelRing Needs For Assessment

Goal: reduce friction and tell visitors what information helps without making the intake feel heavy.

H2:

`Welche Angaben helfen bei der Einschaetzung?`

Recommended points:

- one or more photos of the affected area;
- short description of what changed;
- address or city/area;
- whether the issue is urgent;
- whether the sign can be switched off safely;
- contact method.

Microcopy:

`Wenn Sie den Fachbegriff nicht kennen, reicht ein Foto und eine kurze Beschreibung.`

## Section 6 — SEO/GEO Explanatory Content

Goal: support search and answer-engine visibility while preserving conversion-first UX.

Content should cover:

- common signage and light advertising failures;
- LED modules, power supplies, controllers, wiring, transformers, and neon tubes in cautious language;
- films, lettering, windows, weathering, water ingress, corrosion, loose mounting, and visual wear;
- Berlin & Brandenburg as core area, with further German regions on request where appropriate;
- why remote photo assessment can help before on-site inspection;
- why some cases need professional handling.

Keep this section below the main cards and urgent CTA.

## Section 7 — FAQ / Support Center Bridge And Final CTA

FAQ is approved as a section, not as the main page identity.

Recommended H2:

`Haeufige Fragen zu Schaeden und Reparatur`

Support Center bridge:

`Weitere Details finden Sie im Support Center. Wenn Sie nicht sicher sind, starten Sie direkt mit Foto oder kurzer Beschreibung.`

Do not rewrite existing support articles in this step.

Final CTA headline:

`Nicht sicher, welches Problem vorliegt?`

Final CTA text:

`Senden Sie uns ein Foto oder beschreiben Sie kurz, was sichtbar ist. PixelRing prueft den Fall und klaert die naechsten sinnvollen Schritte.`

CTA:

`Problem schildern`

## CTA Problem Intent

MVP behavior: all CTA actions route into the general request/intake flow.

Decision note: per-card CTA buttons were removed after visual review. Problem cards remain structured by `problemIntent` so a later form/CRM enhancement can still map symptom cards to request context if a card-level intake trigger is reintroduced.

Initial intent values:

- `sign-not-lighting`
- `flickering-light`
- `uneven-led-light`
- `letter-not-lighting`
- `rain-failure`
- `peeling-film`
- `faded-film`
- `loose-sign`
- `urgent-safety-risk`

Purpose:

- prefill or contextualize the request form;
- show a relevant request heading;
- send the selected problem intent to `/api/contact` later;
- save the source/type of interest in the CRM case later.

For the first page launch, intent may remain content metadata if the current contact flow cannot yet persist it.

## Implementation Notes

- Create a dedicated route under `signage-service/src/app/[locale]/probleme-loesungen/page.tsx`.
- Add `probleme-loesungen` to CMS page keys only if the page is intended to be CMS-overridable in this implementation step.
- If CMS support is added, update the admin page editor key list and seed script consistently.
- Reuse existing global header/footer and request modal patterns.
- Keep current support routes `/support` and `/support/[slug]` intact.
- Do not edit existing support articles yet.
- Verify DE, EN, RU, TR, PL, and AR route rendering.
- Verify Arabic layout remains RTL-aware.
- Replace all header/menu temporary links to `/support#symptoms`.

## Progress Log

### 2026-04-25 — Solutions Page SEO/IA Plan Approved

- Current sprint/block: Public Website, second dedicated header-linked page rollout
- Done: approved `Probleme & Loesungen` as the German page/menu label; approved `/probleme-loesungen` route; approved SEO title, H1, H2 direction, and FAQ-as-section rule; confirmed support articles must not be changed during first implementation
- In progress: developer handoff for route/page implementation
- Next action: implement `/[locale]/probleme-loesungen`, replace temporary `/support#symptoms` navigation links, add multilingual page content, and verify desktop/mobile including Arabic RTL
- Blockers/risks: published CMS global navigation may still contain the temporary `/support#symptoms` link and may need a data update separate from code seed changes
- Updated documents: `docs/02_public_website/page_plan_solutions.md`, `docs/02_public_website/page_brief_solutions.md`, `docs/02_public_website/README.md`, `docs/02_public_website/information_architecture.md`, `PROGRESS.md`

### 2026-04-25 — Probleme & Loesungen MVP Implemented

- Current sprint/block: Public Website, second dedicated header-linked page rollout
- Done: implemented `/[locale]/probleme-loesungen`; replaced public header fallback and CMS-global navigation normalization from `/support#symptoms` to `/probleme-loesungen`; added multilingual route content for DE/EN/RU/TR/PL/AR; added animated before/after impact metrics with reduced-motion handling; added CMS page key, typed hero reader, admin Page Content visibility, and baseline seed page content
- In progress: visual QA and later CMS data update if production/staging database still has old global navigation records
- Next action: review page visually in browser, then decide whether to expand CMS block editing beyond hero override
- Blockers/risks: `npm run lint` still fails because of pre-existing unrelated lint errors outside this work; support articles remain intentionally unchanged until final content optimization
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_solutions.md`

### 2026-04-25 — RU Symptom Knowledge Accordion Added

- Current sprint/block: Public Website + AI assistant knowledge bridge
- Done: removed per-card request buttons from the problem grid; changed problem cards to keyboard-accessible `<details>` accordions; added RU structured symptom knowledge chunks with short assistant answer, possible causes, safe follow-up questions, PixelRing checks, and urgent warnings; connected the RU chunks to the assistant system prompt context
- In progress: canonical DE and remaining locale symptom chunks still need proper localized authoring before they should be exposed as long assistant/SEO text
- Next action: migrate the approved symptom chunks into CMS Articles (`SYMPTOM`) or add a synchronization path so public SEO content and assistant knowledge share the same source of truth
- Blockers/risks: current structured chunks are static code, not vector embeddings; assistant uses prompt-context injection, while real retrieval/embedding chunking remains a later implementation step
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_solutions.md`

### 2026-04-25 — Desktop Full-Width Accordion Behavior

- Current sprint/block: Public Website + AI assistant knowledge bridge
- Done: moved the problem grid interaction into a client component; desktop/tablet open state now allows one active card at a time and expands the active problem card across the full grid width; closed cards stay compact and naturally reflow below the active card; hidden knowledge text remains in initial HTML for SEO/AI parsing
- In progress: visual browser QA by owner in the open local browser
- Next action: confirm desktop reading comfort and decide whether long-card inner content should stay in two columns or become a wider single-column editorial layout
- Blockers/risks: automated click-layout verification could not run because Playwright/Puppeteer are not installed in the local project
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_solutions.md`
