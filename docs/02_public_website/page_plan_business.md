# Page Plan: For Business (Для бизнеса)

## Overview
This document outlines the structure and implementation details for the "For Business" page (`/[locale]/business`).
The page targets B2B clients: single-location businesses, chains, agencies, and facility management companies.

## Route & CMS
- **Route**: `/[locale]/business`
- **CMS Key**: `business`
- **Component**: `src/app/[locale]/business/page.tsx`
- **Locales**: `de`, `en`, `ru`, `tr`, `pl`, `ar`

## Section Structure

### 1. Hero Section
- **Visuals**: Premium B2B aesthetic, dark mode facade with glowing sign. Generated asset: `/images/business/hero.png`.
- **Content**: Focus on complex service, solving problems before customers notice.
- **CTA**: "Business Inquiry" (Service Intent: `wartung-servicevertrag`)

### 2. Target Groups (Для бизнеса любого масштаба)
- Grid of 4 cards outlining specific B2B personas and how we solve their pain points:
  1. **Restaurants & Cafes**: Neon repair, dirty/torn menus, posters.
  2. **Beauty Salons**: Window lettering, illuminated logos.
  3. **Car Dealerships**: Pylons, facade signs, site signage.
  4. **Chains & Retail**: SLAs, consistent brand image.

### 3. Partner Service For Managed Customer Sites
- Focus on `Facility Management` (управление обслуживанием объектов), `Ladenbau` (строительство и оснащение магазинов), `Projektmanagement` (управление проектами), and `Werbetechnik` (рекламно-технические компании) partners.
- Explains that PixelRing can act as a technical service partner for managed customer objects without implying a marketplace, contractor directory, or uncontrolled white-label operation.
- Covers typical partner needs:
  - fault report at a customer site;
  - on-site diagnostics for supply line, transformer, LED system, mounting, moisture, and access points;
  - repair or clear technical recommendation;
  - concise documentation for the partner's project management or end customer.
- Visual direction: static premium business section matching the current `/business` page rhythm, alternating the composition by placing the visual case scene on the left and text on the right before the following audit section switches back to text-left/visual-right.
- Visual content: real on-site diagnostics photo with glassmorphic service-desk/report overlays, not a flat text-only card stack.
- CTA: partner-service request by email plus existing presentation download.

### 4. Subscription Contract & Regular Audit
- Focus on the Subscription Model (Абонентское обслуживание / Договор).
- Emphasizes the regular audit of POS: checking print materials (menus, posters) and replacing them if torn or dirty.
- **Benefits**: Regular inspection, Brand consistency, Predictable costs.
- **Visuals**: Representation of an audit/storefront being checked.

### 5. Platform & Cabinet
- Highlighting transparency and control for B2B clients.
- **Content**: Full access to a personal cabinet on the platform. Tracking statuses at all stages, audit reports, single source of contact.
- **Benefits**: Real-time tracking, Comprehensive Audit Report, One Central Contact.
- **Visuals**: Abstract representation of a dashboard/cabinet.

### 6. Trust & Responsibility
- Final section reinforcing the message of delegating visual/technical problems to specialists.
- **CTA**: "Request Service Package" (Service Intent: `wartung-servicevertrag`).

## Implementation Status
- [x] CMS Types added to `src/lib/cms/pages.ts` (`BusinessPageCmsContent`, `getBusinessPageCmsContent`).
- [x] Generated Hero Image and saved to `public/images/business/hero.png`.
- [x] Implemented `src/app/[locale]/business/page.tsx` with all content for 6 locales and responsive layout.

- **2026-06-23 (Current Sprint)**:
  - **Done**:
    - Added a static localized partner-service block to `/[locale]/business` for all six MVP locales (`de`, `en`, `ru`, `tr`, `pl`, `ar`).
    - Positioned the block between the target-groups showcase and the audit/service section.
    - Framed the offer for `Facility Management` (управление обслуживанием объектов), `Ladenbau` (строительство и оснащение магазинов), `Projektmanagement` (управление проектами), and `Werbetechnik` (рекламно-технические компании) companies that manage customer objects and need specialized sign/light-advertising repair support.
    - Kept the wording inside the one-company PixelRing positioning: technical service partner, not marketplace, contractor directory, or "find a master" product.
    - Used the existing `/business` visual language: section eyebrow, terracotta accent, compact business cards, dark service-desk panel, and existing presentation download CTA.
    - Created a temporary 4-page German `Partner-Service Präsentation` (презентация партнерского сервиса) PDF and PowerPoint prototype in `DesignPrototip/pixelring-partner-service-presentation/` for design/content approval, aligned the logo mark with the website header logo geometry, and added a customer-portal control slide for requests, new service cases, reports, and released documents.
  - **In Progress**: Owner visual review of the new block and PDF prototype on desktop/mobile and across locales.
  - **Next Action**: Decide whether this partner-service offer should later become a dedicated SEO landing page under `/business` and whether the approved PDF should replace the current downloadable business presentation.
  - **Blockers/Risks**: The block is static fallback content and is not CMS-editable yet; the PDF prototype is German-only and still needs owner approval before active sales outreach or website download replacement.
  - **Updated Documents**: `docs/02_public_website/page_plan_business.md`, `PROGRESS.md`, `signage-service/src/app/[locale]/business/page.tsx`, `DesignPrototip/pixelring-partner-service-presentation/`.

- **2026-05-26 (Current Sprint)**:
  - **Done**:
    - Audited the hybrid static/CMS localization flow for `/[locale]/business`.
    - Fixed `BUSINESS_CONTENT` in `signage-service/scripts/migrate-cms-content.mjs` so the CMS migration now carries all 6 locales (`de`, `en`, `ru`, `tr`, `pl`, `ar`) instead of falling back to German for Turkish, Polish, and Arabic rows.
    - Synchronized migration copy with the current static fallback content from `src/app/[locale]/business/page.tsx`, including CTA and diacritic-safe TR/PL text.
    - Completed the missing visible-language pass for the Business page mockup and showcase labels: corrected German English leakage (`SECTORS`, `NEXT STEP`, `Brand Health`), fixed Turkish/Polish uppercase diacritics (`SONRAKİ ADIM`, `NASTĘPNY KROK`), and removed a German word leak (`Instandhaltung`) from the English `BusinessShowcase` copy.
  - **In Progress**: None.
  - **Next Action**: Owner visually verifies `/business` locales in the browser/CMS, especially `tr`, `pl`, and `ar`.
  - **Blockers/Risks**: The migration updated the currently configured database; other environments still need the same migration command if they use separate CMS databases.
  - **Updated Documents**: `docs/02_public_website/page_plan_business.md`, `PROGRESS.md`, `signage-service/scripts/migrate-cms-content.mjs`.

- **2026-05-20 (Current Sprint)**: 
  - **Done**: 
    - Redesigned target groups section with a custom interactive `BusinessShowcase` client component. Supported 7 sectors, 6 locales (DE, EN, RU, TR, PL, AR).
    - Compacted layout: hid B2B sector title, removed bottom CTA button, adjusted padding for symmetrical spacing.
    - Layout & Scale Refinements: Restored the original 12-column desktop grid (4 columns for selector tabs, 8 columns for showcase card) and implemented a cinematic, flatter image aspect ratio (`lg:aspect-[21/10]`) on desktop to prevent vertical overflow/scrolling.
    - Two-Panel Diagonal Showcase: Redesigned the photo container to split diagonally into two panels (Left: Exterior, Right: Interior) with cursor pointer and hover/brightness transitions. Removed the third middle panel (staff/menu) to make the interactive audit experience concise and aligned with owner feedback. Updated all 6 locales' hotspot definitions to match the two-panel layout.
    - Drag & Swipe Interaction: Implemented full mouse and touch-based drag/swipe handlers with transition duration toggling (instant during drag, 500ms ease-out on release). Added a glowing dual-layer SVG divider line, a glassmorphic circular handle, and localized drag hints (tooltips) for all 6 locales. Fully restored the Arabic translation block and resolved compilation blockers. Verified production build success.
  - **In Progress**: None.
  - **Next Action**: Owner reviews the completed interactive diagonal photo showcase on `/de/business`.
  - **Blockers/Risks**: None.
  - **Updated Documents**: `docs/02_public_website/page_plan_business.md`, `PROGRESS.md`, `signage-service/src/components/sections/BusinessShowcase.tsx`.

- **2026-04-25**: 
  - **Done**: Created page plan. Generated hero asset. Implemented `page.tsx` with all requested B2B content (Target groups, Subscription/Audit, Platform Cabinet). Added CMS support in `pages.ts`.
  - **In Progress**: Completed baseline implementation.
  - **Next Action**: Wait for owner design feedback.
