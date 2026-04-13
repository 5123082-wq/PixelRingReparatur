# Responsive, Localization, And Accessibility Verification

Last updated: 2026-04-13.

## Localization Baseline

Supported locales:
- `de`
- `en`
- `ru`
- `tr`
- `pl`
- `ar`

Reference:
- `signage-service/src/i18n/routing.ts`

## RTL Baseline

Current behavior:
- Arabic routes render with `dir="rtl"` at layout level.
- Several components use `rtl:` and `ltr:` utility variants for directional alignment.

References:
- `signage-service/src/app/[locale]/layout.tsx`
- `signage-service/src/components/common/LanguageSwitcher.tsx`
- `signage-service/src/components/sections/HeroSection.tsx`

## Responsive Baseline

Current patterns observed:
- Mobile-first utilities with `sm`, `md`, `lg`, `xl` variants.
- Sticky header is primary persistent navigation pattern.
- Mobile menu provides CTA and messenger actions.
- Carousels and dense sections have mobile variants in class rules.

## Accessibility Baseline Checklist

Required checks for UI changes:
1. Interactive elements remain keyboard-focusable.
2. Buttons and links keep explicit accessible names.
3. Color contrast remains acceptable for text and CTA states.
4. Accordion/toggle elements expose `aria-expanded` where relevant.
5. Modal opening/closing remains reachable without pointer-only actions.

## Localization And Layout Stress Checklist

For every major homepage update, verify:
1. DE and RU text expansion does not break section titles, CTA buttons, or cards.
2. Arabic RTL alignment remains coherent for:
   - hero badges
   - directional controls
   - language switcher
3. No horizontal overflow on common mobile widths.
4. Core CTA remains visible in first viewport on mobile.

## Known Verification Gaps

- Manual browser validation for overflow and readability across all locales is not fully documented yet.
- Dedicated sticky mobile CTA requirement from older concept docs is not implemented as a separate bar.
