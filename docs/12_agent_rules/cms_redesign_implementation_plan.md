# CMS Redesign Implementation Plan: Unified 3-Column Interface

> [!IMPORTANT]
> This document defines the architectural and visual standards for the PixelRing Admin Panel redesign. The goal is to move from monolithic page components to a structured, modular interface inspired by MODX and macOS-style layouts.

## 1. Architectural Vision
The interface MUST follow a **3-column layout** at all times within the dashboard:
1.  **Global Sidebar (Far Left, 240px)**: Primary navigation (Dashboard, Content, Pages, Media, AI).
2.  **Module Sidebar (Center, 260px)**: Secondary navigation specific to the active module (e.g., sections of a page, categories of articles).
3.  **Content Area (Right, Flexible)**: The actual editor fields, tables, or grids.

## 2. Visual Standards (Aesthetics)
- **Theme**: Pure Dark Mode (`#000000`, `#050505`, `#0a0a0c`).
- **Accent**: `linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)`.
- **Glassmorphism**: Use `backdrop-filter: blur(20px)` on sidebars and floating elements.
- **Borders**: Suble `1px solid rgba(255, 255, 255, 0.08)`.
- **Typography**: Inter (UI) and JetBrains Mono (Technical IDs).
- **Strict Alignment**: 
    - Buttons and Inputs must have a height of `40px` (standard) or `32px` (compact).
    - Flex items must use `align-items: center` and `flex-shrink: 0` for icons to prevent stretching.

## 3. Migration Roadmap (Step-by-Step)

### Phase 1: Dashboard Shell Update
- **Target**: `signage-service/src/app/[locale]/ring-master-config/dashboard/DashboardShell.tsx`.
- **Action**: Implement the **Global Sidebar** as a persistent component. It should wrap all child routes.
- **Links**: Ensure icons and labels match the existing project routes (`/ai`, `/articles`, `/media`, `/pages`, `/seo`).

### Phase 2: Page CMS Refactoring
- **Target**: `signage-service/src/app/[locale]/ring-master-config/dashboard/pages/page.tsx`.
- **Action**: 
    - Break the 2000-line file into smaller sub-components.
    - Introduce the **Module Sidebar** to switch between sections (Hero, FAQ, Stats).
    - Implement `activeSection` state to toggle visibility of content blocks.
- **Safety**: DO NOT change the JSON structure being sent to the backend. Only change the UI presentation.

### Phase 3: Content (Wiki/GEO) Refactoring
- **Target**: `signage-service/src/app/[locale]/ring-master-config/dashboard/articles/page.tsx`.
- **Action**:
    - Replace the current list/edit mix with a clean **Module Sidebar** for categories (Symptoms, Help, GEO).
    - Use a table-based list view for discovery.
    - Use the 3-column editor for individual article editing.

### Phase 4: Media Library & AI Brain
- **Target**: `media/page.tsx` and `ai/page.tsx`.
- **Action**: Wrap existing functionality into the 3-column layout. 
- **Preservation**: Keep the AI model settings (`GPT-4o mini`) and Media Library public/private split logic intact.

## 4. UI/UX Rules for the Next Agent
1.  **Locale Tabs**: Always visible at the top left of the Content Area. Switching locales should NOT reset the scroll position.
2.  **Shared vs. Localized Fields**: 
    - Fields like "Block Order" or "Image URL" are **Shared** (global to all languages).
    - Fields like "Title" or "Description" are **Localized**.
    - Highlight Shared fields with a subtle border color or icon to warn the admin.
3.  **Accordion Logic**: For repetitive items (FAQ, Stats), use the accordion pattern to keep the view compact.
4.  **Save/Preview**: Always fixed at the top right of the Content Area.

## 5. Engineering Guardrails
- **No Breakage**: Always read existing `page.tsx` logic to understand how data is fetched and saved before rewriting the UI.
- **TypeScript**: Maintain strict types for the CMS blocks.
- **Performance**: Use React.memo or equivalent for large lists (like GEO pages) to prevent lag in the sidebar.

---
**Reference Prototype**: `/Users/macbookaleks/Documents/GitHub/PixelRingCmsDemo/index.html`
**Design Approved by User**: 2026-04-25
