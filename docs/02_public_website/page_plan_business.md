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

### 3. Subscription Contract & Regular Audit
- Focus on the Subscription Model (Абонентское обслуживание / Договор).
- Emphasizes the regular audit of POS: checking print materials (menus, posters) and replacing them if torn or dirty.
- **Benefits**: Regular inspection, Brand consistency, Predictable costs.
- **Visuals**: Representation of an audit/storefront being checked.

### 4. Platform & Cabinet
- Highlighting transparency and control for B2B clients.
- **Content**: Full access to a personal cabinet on the platform. Tracking statuses at all stages, audit reports, single source of contact.
- **Benefits**: Real-time tracking, Comprehensive Audit Report, One Central Contact.
- **Visuals**: Abstract representation of a dashboard/cabinet.

### 5. Trust & Responsibility
- Final section reinforcing the message of delegating visual/technical problems to specialists.
- **CTA**: "Request Service Package" (Service Intent: `wartung-servicevertrag`).

## Implementation Status
- [x] CMS Types added to `src/lib/cms/pages.ts` (`BusinessPageCmsContent`, `getBusinessPageCmsContent`).
- [x] Generated Hero Image and saved to `public/images/business/hero.png`.
- [x] Implemented `src/app/[locale]/business/page.tsx` with all content for 6 locales and responsive layout.

## Progress Log
- **2026-04-25 (Current Sprint)**: 
  - **Done**: Created page plan. Generated hero asset. Implemented `page.tsx` with all requested B2B content (Target groups, Subscription/Audit, Platform Cabinet). Added CMS support in `pages.ts`.
  - **In Progress**: Waiting for user review.
  - **Next Action**: Link page in navigation or proceed to next page.
