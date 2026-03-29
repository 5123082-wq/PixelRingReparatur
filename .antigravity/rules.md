## TypeScript
- Always use TypeScript; never create .js or .jsx files
- Strict mode only; never use `any` — use `unknown` and narrow with type guards
- Prefer named exports over default exports
- Use const arrow functions for all React components

## React / Next.js
- React Server Components by default; add 'use client' only when needed for interactivity or browser APIs
- No class components; functional components with hooks only
- Co-locate component types and tests in the same folder as the component
- Avoid prop drilling deeper than 2 levels — use Context or Zustand

## i18n
- Every user-facing string must go through next-intl (useTranslations / getTranslations)
- Never hardcode UI text in components
- Arabic (ar) locale requires dir="rtl" — apply at the layout level
- Language switcher must preserve current pathname on switch

## Code Quality
- Remove all console.log before marking any task done
- No TODO comments in committed code
- Keep functions under 40 lines; split if longer
- Every exported component must have a one-line JSDoc comment

## Agent Permissions
- Allowed without asking: read files, run linter, run tests, format code
- Ask before: installing packages, deleting files, modifying .env, git push
- Never: hardcode secrets, push to main branch, modify files outside project root

## Business Rules (CTA Architecture)
- Every page must have exactly 1 primary CTA + max 2 supporting CTAs
- Primary CTA is always the intake trigger ("Начать заявку") localized per locale
- MobileStickyCTA is a single global component — never duplicate its logic per page
- Channel priority: Web intake → WhatsApp → Telegram → Phone
