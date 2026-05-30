# Page Plan — Leistungen

Status: approved for documentation handoff before implementation.

Canonical route: `/de/leistungen`

Canonical language: German first. Other MVP locales (`en`, `ru`, `tr`, `pl`, `ar`) must preserve the same page structure and intent after German content is approved.

## Product Role

`Leistungen` is the public scope page for what PixelRing Reparatur does as one accountable service company.

The page must answer:

`Does PixelRing handle my problem or type of service request?`

It must not read like:

- a marketplace;
- a contractor directory;
- a giant product taxonomy;
- a manufacturer mega-menu;
- a "find a master" platform.

The page must position PixelRing as:

- one accountable service company;
- one central request entry point;
- a one-stop service for repair, diagnosis, mounting, maintenance, advertising materials, branding, and coordinated execution;
- AI-assisted at intake level, with human specialist execution.

## Confirmed Owner Decisions

Confirmed by project owner on 2026-04-25:

- Service area wording is approved: `Berlin & Brandenburg als Kerngebiet — weitere Regionen in Deutschland auf Anfrage`.
- Public wording `Fachteam und qualifizierte Partner` is approved, but must preserve the one-company positioning and must not imply a marketplace.
- `Wartung & Servicevertraege` are approved for MVP communication.
- Up to 20% benefit is approved only when a maintenance/service contract exists.
- Warranty up to 24 months is approved when tied to service/material/use conditions and manufacturer warranties where applicable.
- `Design & Druckdaten`, `Druckprodukte`, `Folierung`, `Beschriftung`, and `Werbematerialien` are approved service areas.
- Replacement solution or new construction can be mentioned when repair is technically or economically not sensible.
- `Vor-Ort-Pruefung` can be offered.
- Electrical, LED, and neon wording may include wiring, power supplies, controllers, transformers, LED modules, and neon tubes.

## Claim Rules

Use:

- `Berlin & Brandenburg als Kerngebiet — weitere Regionen in Deutschland auf Anfrage.`
- `Fachteam und qualifizierte Partner` only with central PixelRing coordination.
- `Garantie bis zu 24 Monate, abhängig von Leistung, Material und Einsatzbedingungen.`
- `Bis zu 20% Vorteil auf ausgewählte Werbematerialien bei bestehendem Wartungs- oder Servicevertrag.`
- `Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen.`

Avoid:

- `24/7`;
- `garantiert sofort`;
- `alle Schäden`;
- `immer reparierbar`;
- `überall in Deutschland`;
- `20% Rabatt auf alles`;
- `Meisterbetrieb`, unless legally confirmed;
- `zertifizierte Partner`, unless certification definitions are documented;
- `eigene Produktion`, unless the scope is confirmed.

## Page Structure

The current implemented page has four main sections:

1. Hero
2. Servicebereiche for five core service areas
3. Wartung & Servicevertraege
4. Rahmenbedingungen & finaler CTA

AI-assisted intake and step-by-step process explanation are not separate blocks on this page.

## Section 1 — Hero

Goal: explain quickly that PixelRing covers a wide scope around advertising installations and business-site advertising support, while remaining one accountable service company.

H1:

`Leistungen für Reparatur, Wartung und Werbetechnik-Service`

Subline:

`PixelRing ist Ihre zentrale Anlaufstelle für Reparatur, Diagnose, Montage, Wartung, Druckprodukte, Branding und laufenden Service rund um Werbeanlagen und Geschäftsstandorte.`

Trust line:

`Eine Anfrage. Eine Koordination. Fachliche Prüfung und Umsetzung durch Spezialisten.`

Primary CTA: `Anfrage starten`

Secondary CTA: `Foto hochladen`

Visual note:

- Real project imagery is preferred.
- If illustrative before/after imagery is used, label it `Beispielhafte Darstellung`.
- If a real case is used, label it `Projektbeispiel` only when publication rights are confirmed.

## Section 2 — Servicebereiche

Format: five large service cards.

SEO/accessibility requirement:

- H2 for the section;
- H3 for each card;
- visible descriptions and detail rows must exist in the initial HTML;
- CTA buttons must keep the existing request-intent flow;
- responsive layout must avoid text overflow in DE, EN, RU, TR, PL, and AR.

H2:

`Servicebereiche für Werbeanlagen und Standortwerbung`

Intro:

`PixelRing bündelt Reparatur, Modernisierung, Diagnose, Montage und Werbematerialien in einem geführten Serviceprozess.`

Approved cards:

- `Reparatur & Wartung von Außenwerbung`
- `Modernisierung von Lichtwerbung & LED-Systemen`
- `Inspektion, Audit & Diagnose von Werbeanlagen`
- `Montage, Demontage & Versetzung von Werbeanlagen`
- `Druckprodukte, Branding & Werbematerialien`

Key repair-vs-replacement line:

`Unser erster Fokus liegt auf der Reparatur und sinnvollen Instandsetzung bestehender Werbeanlagen. Sollte eine Reparatur technisch oder wirtschaftlich nicht empfehlenswert sein, können wir Ihnen auch eine passende Ersatzlösung oder neue Konstruktion anbieten.`

## Section 3 — Wartung & Servicevertraege

Goal: introduce recurring maintenance/service contracts as a commercial path without building the full future subscription system inside this page.

H2:

`Wartung & Serviceverträge: Werbeanlagen betreuen lassen statt selbst kontrollieren`

Subline:

`Mit einem Servicevertrag übernimmt PixelRing die regelmäßige Prüfung, Wartung und Betreuung Ihrer Werbeanlagen und Werbematerialien — besonders sinnvoll für Unternehmen mit einem oder mehreren Standorten.`

Approved benefits:

- less day-to-day effort;
- planned maintenance instead of only reactive emergency repair;
- suitable for branches and multiple locations;
- up to 20% benefit on selected advertising materials when a maintenance/service contract exists.

Required discount wording:

`Bis zu 20% Vorteil auf ausgewählte Werbematerialien bei bestehendem Wartungs- oder Servicevertrag.`

Do not use:

`20% Rabatt auf alles.`

Implementation note:

The full subscription/service-plan model is a future business and product track. This page may introduce the concept and CTA, but must not design final subscription mechanics.

CTA: `Servicevertrag anfragen`

Secondary CTA: `Audit für Standort anfragen`

## Section 4 — Rahmenbedingungen & Final CTA

H2:

`Klarer Rahmen für Ihre Anfrage`

Trust points:

- no marketplace: direct request to PixelRing, one central coordination point;
- service area: Berlin & Brandenburg as core area, further German regions on request;
- warranty: up to 24 months depending on service, material, and usage conditions;
- execution: specialist team and qualified partners coordinated through PixelRing.

Final CTA headline:

`Nicht sicher, ob Ihre Aufgabe passt?`

Final CTA text:

`Senden Sie uns eine kurze Beschreibung oder ein Foto. PixelRing prüft den Umfang und klärt die nächsten sinnvollen Schritte.`

CTA: `Anfrage starten`

## CTA Service Intent

MVP behavior: all CTA actions route into the general request/intake flow.

Decision note: each service CTA should still carry a `serviceIntent` in the component contract so a later form/CRM enhancement can know which CTA the user clicked.

Initial intent values:

- `diagnose`
- `lichtwerbung-led`
- `konstruktion-befestigung`
- `reinigung-pflege`
- `montage-demontage`
- `druckprodukte-branding`
- `folierung-beschriftung`
- `wartung-servicevertrag`

Purpose:

- prefill or contextualize the request form;
- show a relevant request heading;
- send the selected service intent to `/api/contact`;
- save the source/type of interest in the CRM case;
- support later analytics and routing.

Implementation rule:

- Do not block page launch on deep intake/CRM refactoring.
- If service intent can be added safely with small changes, add it in the first implementation.
- Otherwise, implement CTA buttons with a stable `serviceIntent` prop/data attribute and connect the intake flow in a follow-up.

## CMS And Static Split

Recommended static structure:

- route and section order;
- component layout;
- service-intent keys;
- anti-marketplace page role;
- legal/claim guardrails.

Recommended CMS-managed content:

- hero copy;
- service card titles, visible descriptions, expanded details, and CTA labels;
- Druckprodukte/Branding card copy;
- Servicevertrag benefits;
- final CTA text;
- SEO title and description;
- future translations;
- future imagery/captions.

Implementation note 2026-04-25: `leistungen` has been added to the `CmsPage` page-key allowlist and admin page-key selector for compatibility. The MVP page still renders from static localized content; fully structured CMS editing for every Leistungen block remains a follow-up.

## Route And Navigation

Required MVP route:

- `/[locale]/leistungen`

Header update after route exists:

- `Leistungen` must point to `/leistungen` instead of the temporary non-404 fallback.

Future SEO subpages, not MVP:

- `/de/leistungen/wartung-servicevertraege`
- `/de/leistungen/schilder-reparatur`
- `/de/leistungen/lichtwerbung-led-service`
- `/de/leistungen/montage-demontage`
- `/de/leistungen/druckprodukte-branding`
- `/de/leistungen/filialservice`

## SEO

Meta title:

`Leistungen für Reparatur, Wartung & Werbetechnik | PixelRing`

Meta description:

`PixelRing unterstützt Unternehmen bei Reparatur, Diagnose, Montage, Wartung, Lichtwerbung, Branding, Druckprodukten und Serviceverträgen für Werbeanlagen.`

Internal anchors:

- `#reparatur-diagnose-montage`
- `#druck-branding`
- `#wartung-servicevertraege`
- `#ablauf`
- `#rahmenbedingungen`

## Implementation Work Split

### Visual/frontend agent

Responsibilities:

- design and build the page sections, cards, accordion behavior, animations, responsive layout, and accessibility states;
- reuse existing `Header`, `Footer`, `FooterCTA`, and current visual language where suitable;
- keep page structure dense and service-oriented, not decorative or marketplace-like;
- expose CTA `serviceIntent` values in component props or data attributes.

Recommended model/tool:

- `GPT-5.5` for the visual/frontend agent.

Reason:

- This repo has strict product rules, Next.js 16/App Router constraints, CMS integration constraints, multilingual/RTL requirements, and a strong need to follow existing local patterns. Use the strongest coding/planning model for frontend implementation.

### Backend/CMS agent

Responsibilities:

- extend the `CmsPage` page-key contract for `leistungen`;
- update CMS admin page editor page-key support;
- add typed content extraction for Leistungen or a safe generic renderer contract;
- seed baseline German content only after final copy is approved;
- avoid changing CRM/contact schema unless service-intent storage is explicitly approved for that implementation step.

Recommended model/tool:

- `GPT-5.5` for backend/CMS work.

Reason:

- Backend work touches CMS validation, admin editor assumptions, API contracts, and possibly intake/CRM flow. The safer choice is the most capable codebase-aware model.

### When to use Gemini

Use Gemini only for bounded side tasks where no repository edits are needed:

- `Gemini 3.1 Pro (High)` for external market/content review or alternate copy critique.
- `Gemini 3.1 Pro (Low)` for lower-stakes summarization.
- `Gemini 3 Flash` for quick language variants or lightweight brainstorming.

Do not use Gemini as the primary code-editing agent for this repo unless a human explicitly narrows the task and provides the relevant repository context.

## Implementation Readiness Checklist

Before implementation:

- confirm German canonical copy for each card;
- decide whether the first version stores content in CMS or ships with static fallback plus CMS-ready structure;
- confirm whether service-intent should be persisted in CRM now or only exposed in the frontend contract;
- provide or choose visual assets and confirm whether they are real project images or illustrative examples.

Implementation sequence:

1. Backend/CMS: add `leistungen` page-key support and content shape.
2. Frontend: add route `/[locale]/leistungen` and render the approved section structure.
3. Frontend: update Header link for `Leistungen` to `/leistungen`.
4. Optional intake enhancement: wire service-intent into the request modal/form if low-risk.
5. Verification: build/lint, check `/de/leistungen`, check at least one RTL locale route, verify no 404 header link.

## Progress Log

### 2026-05-29 — Repair Diagnostic Card Phase 1 Prototype

- Current sprint/block: Public Website, dedicated Werbeanlagen-Reparatur diagnostic card prototyping
- Done: Added a standalone HTML prototype at `DesignPrototip/pixelring-diagnostic-card-phase1.html` for the compact Phase 1 calculator direction, then implemented the selected interaction model in code as a separate comparison block on `/[locale]/leistungen/werbeanlagen-reparatur`. The existing diagnosis card remains unchanged and still renders before the new block. The new block uses compact dropdown selectors for construction type and typical reason/symptom. The service selector is a hybrid combobox: users can immediately type a city/PLZ, while the right-side dropdown offers primary cities/zones (`Berlin - Stadtgebiet`, `Berliner Umland`, Potsdam, Brandenburg an der Havel, Cottbus, Frankfurt (Oder), Oranienburg, Bernau bei Berlin, Falkensee, Königs Wusterhausen, Ludwigsfelde, `Land Brandenburg allgemein`, and outside core area on request). The right card covers access/height, size, affected scope, planned/urgent visit selection, repair orientation, confidence message, photo checklist, CTA, and drawer prefill. Safety flags were removed from the new UX.
- In progress: Owner compares the existing diagnosis card and the new alternative block in the real page.
- Next action: Decide which interaction model should remain, then remove or consolidate the other block.
- Blockers/risks: The new block is frontend-only and intentionally does not add CRM/database/API changes, analytics, messaging integrations, or exact material calculations.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_leistungen.md`, `DesignPrototip/pixelring-diagnostic-card-phase1.html`, `signage-service/src/components/leistungen/LeistungenDiagnosticPrototype.tsx`, `signage-service/src/app/[locale]/leistungen/werbeanlagen-reparatur/page.tsx`.

### 2026-05-26 — Leistungen Footer CTA Redesign

- Current sprint/block: Public Website, Leistungen page final CTA refinement
- Done: Reverted the `/leistungen` page bottom contact block (`LeistungenFooterCTA`) to match the clean B2B gradient CTA banner from the `/business` page. Rendered text with the terracotta vertical indicator line on the left and a single button (`Anfrage starten`) that triggers the contact modal on the right. Verified clean compilation and build.
- In progress: Owner visual review of the matched contact block.
- Next action: None, task completed.
- Blockers/risks: None.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_leistungen.md`, `signage-service/src/components/sections/LeistungenFooterCTA.tsx`.

### 2026-05-21 — Wartung & Serviceverträge B2B Bridge

- Current sprint/block: Public Website, Leistungen maintenance/service-contract section refinement
- Done: Reworked the `Wartung & Serviceverträge` section from a generic benefit list into a B2B service-contract bridge with `Standort-Check`, `Laufende Betreuung`, and `Für mehrere Standorte` cards; updated CTA wording to `Standort-Audit anfragen` and `Servicevertrag besprechen`; preserved the selected-material benefit wording; added an explicit boundary that the service contract is not unlimited repair and that larger repairs, spare parts, height work, and special cases are checked separately. The section now uses the static localized fallback copy for this structured layout; the old CMS maintenance text can still control section enabled state but does not override the new copy until a structured CMS preset is designed.
- In progress: Owner visual review of `/de/leistungen` for density, CTA order, and whether the section should become the entry point to the future `Standort-Abo` landing page.
- Next action: If approved, decide whether to draft canonical German copy for a dedicated `Standort-Abo` page or keep this as the compact public introduction.
- Blockers/risks: The full `Standort-Abo` offer remains an internal product concept; pricing, SLA, portal/reporting claims, safety-check wording, and included/excluded repair scope are not approved for public tariff communication. A future CMS preset is needed if editors should manage the three-card maintenance layout without reintroducing stale generic copy.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_leistungen.md`, `docs/01_strategy/standort_abo_product_concept.md`, `signage-service/src/app/[locale]/leistungen/page.tsx`.

### 2026-05-20 — Leistungen Process Block Removed

- Current sprint/block: Public Website, Leistungen page content reduction
- Done: Removed the `So läuft Ihre Anfrage ab` / `Как проходит заявка` process section from the rendered Leistungen page after owner review.
- In progress: Owner visual review of the shorter `/ru/leistungen` page.
- Next action: Confirm whether the remaining final framework/CTA block should stay after the service and maintenance sections.
- Blockers/risks: None for the removed section; the deleted process block is no longer rendered or carried in the static page content.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_leistungen.md`, `signage-service/src/app/[locale]/leistungen/page.tsx`.

### 2026-05-20 — Leistungen Service Showcase Restructure

- Current sprint/block: Public Website, Leistungen service presentation refinement
- Done: Replaced the separate repair accordion and print/branding card block with one five-card service showcase covering repair/maintenance, LED modernization, inspection/audit/diagnostics, mounting/dismantling/relocation, and print/branding materials. Kept the repair-first/replacement-only-if-needed principle as a shared focus note instead of a separate card.
- In progress: Owner visual review of `/ru/leistungen` and `/ar/leistungen`.
- Next action: Confirm service-card order, image fit, and text wrapping on desktop/mobile, then decide whether this block should later become CMS-editable.
- Blockers/risks: The new showcase remains static fallback content; current CMS merge logic is intentionally not expanded in this pass.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_leistungen.md`, `docs/02_public_website/page_brief_about.md`, `signage-service/src/app/[locale]/leistungen/page.tsx`, `signage-service/src/app/[locale]/ueber-uns/page.tsx`.

### 2026-04-25 — Leistungen Final Plan

- Current sprint/block: Public Website, Leistungen page planning
- Done: external research output reviewed against project constraints; owner confirmed geography, partner wording, service contracts, discount condition, warranty wording, Druckprodukte/Branding scope, replacement/new construction wording, on-site checks, and electric/LED/neon scope
- In progress: documentation handoff before implementation
- Next action: implement CMS/page-key support and public route, then build visual section experience from this approved structure
- Blockers/risks: final German microcopy and visual assets are not yet separately approved; service-intent persistence into CRM is planned but should not block first page launch
- Updated documents: `docs/02_public_website/page_plan_leistungen.md`, `docs/02_public_website/page_brief_services.md`, `docs/02_public_website/README.md`, `docs/02_public_website/information_architecture.md`, `PROGRESS.md`

### 2026-04-25 — Leistungen MVP Implementation

- Current sprint/block: Public Website, Leistungen page implementation
- Done: public route `/[locale]/leistungen` implemented with the six approved sections, localized static content for DE/EN/RU/TR/PL/AR, initial-HTML accordion content, service-intent CTA attributes, illustrative hero image label, header Services/Leistungen link target, and `leistungen` CMS page-key compatibility
- In progress: visual QA beyond HTTP/build checks
- Next action: owner review of page copy/visuals, then decide whether to connect service intent into intake/CRM or build structured CMS fields for this page
- Blockers/risks: browser screenshot automation was unavailable in the current tool environment; service-intent is exposed in frontend attributes but not persisted in CRM
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_leistungen.md`, `docs/05_admin_platform/page_content_cms_plan.md`

### 2026-04-25 — Leistungen Hero CMS Asset Slice

- Current sprint/block: Public Website, Leistungen page CMS asset integration
- Done: moved Leistungen hero fallback assets under `public/images/leistungen/`; added a typed `leistungen` CMS reader for a `cardList` block keyed `leistungenHero` / `heroSlides`; public route now merges published CMS hero-slide fields over static localized fallback content
- In progress: only the hero slider image/title/description/CTA fields are CMS-editable; the rest of the Leistungen page remains static localized content. A fourth generated branding/print hero slide is now included as fallback content and in the CMS preset.
- Next action: owner can create/publish a `leistungen` page block from Pages CMS using the `Leistungen Hero` preset, then replace fallback image paths with Media Library URLs where desired
- Blockers/risks: no baseline `CmsPage` rows were seeded in this slice; CMS values only affect the public page after a published `leistungen` row exists for the active locale
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_leistungen.md`, `docs/05_admin_platform/page_content_cms_plan.md`, `docs/05_admin_platform/admin_rollout_execution_plan.md`
