---
name: i18n & Localization
description: next-intl routing and localization standards for 6 locales with RTL support.
source: antigravity.codes/agent-skills/nextjs
---

# i18n & Localization Patterns

This skill enforces strict internationalization standards using `next-intl` for the Next.js App Router application.

## Enforced Patterns

1. **Locales & Default Locale:**
   - Supported locales: `de` (German), `en` (English), `ru` (Russian), `tr` (Turkish), `pl` (Polish), `ar` (Arabic).
   - Canonical default locale: `de` (German).

2. **Routing & URLs:**
   - All routes must be prefixed with the locale (e.g., `/de/about`, `/en/about`, `/ru/about`).
   - `next-intl` Middleware is used to enforce these prefixed URLs, handle correct locale negotiation, and manage redirects.

3. **RTL Support:**
   - Specific Right-to-Left (RTL) layout features are enforced for the Arabic (`ar`) locale.
   - The Root Layout must dynamically set the HTML `dir` attribute (`dir="rtl"` for `ar`, and `dir="ltr"` for the other locales) to ensure proper bidirectional styling.

4. **next-intl Implementation:**
   - Messages and dictionaries should be efficiently loaded on the server.
   - Server Components are strictly preferred for injecting and rendering internationalized strings to maximize performance.
