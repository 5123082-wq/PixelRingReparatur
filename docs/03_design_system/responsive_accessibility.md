# Responsive, Localization, And Accessibility Verification

Last updated: 2026-07-12.

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

For every public-page layout update, verify:
1. At `360px`, `390px`, and `430px`, no page-level horizontal overflow appears and the core CTA
   remains visible in the first viewport where the page has a hero.
2. At `1280px` and `1512px`, the outer edges of the header logo/action row, the first ordinary
   content block, and the footer content follow the same `pr-site-container` rail.
3. DE and RU text expansion does not break section titles, CTA buttons, forms, or cards; spot-check
   long-label TR and PL states when they are touched.
4. Arabic RTL alignment remains coherent for hero badges, directional controls, language switcher,
   reading-start borders, and carousel direction.
5. A horizontal carousel may overflow only inside its dedicated rail. Its initial item inset and
   scroll padding must be intentional, and the document root must still have no horizontal overflow.

## Known Verification Gaps

- Manual browser validation for overflow and readability across all locales is not fully documented yet.
- Dedicated sticky mobile CTA requirement from older concept docs is not implemented as a separate bar.
