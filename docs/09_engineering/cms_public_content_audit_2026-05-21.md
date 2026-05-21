# CMS Public Content Audit - 2026-05-21

## Purpose

This document records the first structured audit pass for public website content after recent page, article, and copy moves.

The audit checks whether public routes, CMS page records, CMS article records, fallback content, media references, and runtime rendering are aligned.

## Scope

Checked application:

- `signage-service`
- Next.js public routes
- CMS page records
- CMS symptom article records used by `/probleme-loesungen`
- CMS media references found inside page blocks
- local production build and local runtime crawl

Checked locales:

- `de`
- `en`
- `ru`
- `tr`
- `pl`
- `ar`

Checked page keys:

- `global`
- `home`
- `status`
- `impressum`
- `privacy`
- `leistungen`
- `business`
- `probleme-loesungen`
- `about`
- `referenzen`

## Audit Tool

Added read-only command:

```bash
npm run audit:cms-public
```

The command reads CMS data through Prisma and writes:

- JSON report: `signage-service/tmp/cms-public-content-audit.json`
- Markdown report: `signage-service/tmp/cms-public-content-audit.md`

Optional runtime crawl:

```bash
npm run audit:cms-public -- --base-url=http://localhost:3010
```

The script does not write CMS pages, CMS articles, media records, request data, or migrations.

## Result Summary

Latest run result:

- Overall status: `WARN`
- Errors: `0`
- Warnings: `27`
- Info notes: `13`
- Runtime crawl: `71` routes checked, `0` failures

## Main Findings

### 1. Public CMS pages are structurally aligned

The audit found published CMS page records and expected block structures for the main CMS-backed public pages:

- `home`
- `global`
- `status`
- `leistungen`
- `business`
- `probleme-loesungen`
- `referenzen`
- German legal pages: `impressum`, `privacy`

No missing required page blocks were found for these current public route mappings.

### 2. Problem articles are incomplete for TR, PL, and AR - accepted for now

All expected problem article slugs are published for:

- `de`
- `en`
- `ru`

The same expected problem article records are missing for:

- `tr`
- `pl`
- `ar`

Affected CMS slugs:

- `no-light`
- `flicking`
- `uneven-light`
- `letter-out`
- `rain-fail`
- `peeling-film`
- `faded-film`
- `shaky-sign`
- `urgent-repair`

Impact:

- `/tr/probleme-loesungen`, `/pl/probleme-loesungen`, and `/ar/probleme-loesungen` still render.
- Individual article routes for missing locales are not backed by localized CMS article records.
- Current route behavior can fall back to English article content with `noindex`, or 404 where no fallback exists.
- This is not a site-breaker, but it is a content-source mismatch.

Owner decision after audit:

- This risk is accepted for now and is not part of the current remediation pass.

### 3. `/ueber-uns` is now CMS-backed

Follow-up implementation completed:

- The route `/[locale]/ueber-uns` now calls `getAboutPageCmsContent`.
- Current visible `/ueber-uns` copy was loaded into CMS page records with `pageKey = about`.
- The page keeps a code-owned fallback in `src/lib/content/about-page.ts`.
- CMS records exist for all six locales: `de`, `en`, `ru`, `tr`, `pl`, `ar`.

CMS block structure:

- `hero`
- `audience`
- `process`
- `materials`
- `quality`
- `testimonials`
- `final`

Verification:

- `about` records are `PUBLISHED` for all six locales.
- The audit reports no missing `about` blocks or fields.
- Local runtime crawl returns HTTP `200` for every `/ueber-uns` locale.
- Browser check confirmed `/de/ueber-uns` and `/ar/ueber-uns` render the expected CMS-backed headings, and Arabic remains RTL.

### 4. Historical `support` CMS pages still exist

The database contains CMS page records for `support` in all six locales, but current public audit mapping no longer treats `/support` as the active public content route.

Impact:

- These records may be historical or admin-only leftovers.
- They should not be used as current roadmap instructions unless the owner decides to reactivate a support route.

### 5. SEO notes are non-blocking

The audit reports incomplete SEO fields for:

- `global` pages, which are layout content and do not need standalone SEO metadata.
- `privacy/de`, which is not currently blocking page rendering.

## Runtime Verification

The local production server was started with:

```bash
npm run start -- -p 3010
```

Runtime crawl command:

```bash
npm run audit:cms-public -- --base-url=http://localhost:3010
```

Result:

- `71` routes returned HTTP `200`
- No route returned `404`, `500`, or a very small response
- Checked main public routes across all locales
- Checked published problem article routes for `de`, `en`, and `ru`

## Verification Commands

Passed:

```bash
node scripts/verify-messages.mjs
npm run audit:cms-public
npm run db:seed:cms-about
npm run audit:cms-public -- --base-url=http://localhost:3010
npm run test:cms-article-workflow
npm run test:admin-security
npm run test:admin-runtime
npm run build
```

Blocked by pre-existing lint issues:

```bash
npm run lint
```

Observed lint blockers:

- `scratch_format.js`: forbidden `require()` style import
- `src/components/sections/BusinessShowcase.tsx`: `react-hooks/set-state-in-effect`

The lint failure is not introduced by the CMS public content audit script.

## Recommended Next Actions

1. Keep TR, PL, and AR problem article fallback/noindex behavior as an accepted short-term risk unless the owner reopens localization.
2. Decide whether historical `support` CMS pages should be archived, remapped, or left as inactive records.
3. After any CMS/content fixes, rerun:

```bash
npm run audit:cms-public -- --base-url=http://localhost:3010
```

## Progress Log

### 2026-05-21

- Current sprint/block: CMS public content consistency audit and `/ueber-uns` CMS source-of-truth remediation.
- Done: Added read-only audit script, ran DB audit, loaded `/ueber-uns` into CMS as `about`, connected `/ueber-uns` to CMS, ran runtime crawl, verified production build, and completed a browser check for DE/AR.
- In progress: Owner decision on inactive historical `support` CMS pages.
- Next action: Decide whether to archive/remap inactive `support` CMS pages or leave them as historical records.
- Blockers/risks: Existing lint blockers remain outside this audit scope; localized problem articles for TR/PL/AR are intentionally accepted as a short-term risk.
- Updated documents: `docs/09_engineering/cms_public_content_audit_2026-05-21.md`, `docs/09_engineering/README.md`, `PROGRESS.md`.
