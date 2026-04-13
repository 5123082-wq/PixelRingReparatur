# 03 Design System

Purpose: factual design system reference for current implementation, with clear rules for future design work and verification against code.

This folder is not a prompt pack. It is a verification-first documentation set used as a source of truth for UI/UX decisions.

## Source Of Truth Policy

When docs and code differ, code is the current-state source of truth.

Primary code references for homepage and global UI:
- `signage-service/src/app/[locale]/page.tsx`
- `signage-service/src/components/sections/*`
- `signage-service/src/components/layout/*`
- `signage-service/src/components/common/*`
- `signage-service/messages/*.json`
- `signage-service/src/i18n/routing.ts`
- `signage-service/src/app/[locale]/layout.tsx`

## Documents In This Folder

- `design_prompts_stitch.md`
  - Legacy filename retained for compatibility.
  - Current role: factual as-built design system reference and homepage snapshot.
- `design_principles.md`
  - Product-facing and visual principles.
- `layout_rules.md`
  - Layout, spacing, containers, CTA placement, section order rules.
- `component_guidelines.md`
  - Component inventory, status, and usage constraints.
- `responsive_accessibility.md`
  - Responsive, localization, RTL, and accessibility verification rules.
- `change_log.md`
  - Design-system documentation update log.
