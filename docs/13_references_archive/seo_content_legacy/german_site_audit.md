# German Site Audit

Status: decision log and correction plan.
Date: 2026-05-04

This document records the agreed audit findings and implementation direction for the German public website. It is intentionally scoped to planning and QA decisions. Do not change application code from this document without explicit project-owner confirmation.

## Confirmed Decisions

- German GEO content must be visible, addressable, and useful to users. It must not rely on hidden DOM text for indexing.
- The `Probleme & Lösungen` overview page should remain compact and must not become an endless page with all article text visible at once.
- Each problem article should have its own public URL under `/de/probleme-loesungen/[slug]`.
- From the overview page, opening an article should use a modal overlay so the user stays in context.
- Direct entry to an article URL should render a full article page, not a dead-end modal.
- German user-facing text should use `ä/ö/ü/ß`. ASCII forms such as `ae/oe/ue/ss` are allowed for slugs, IDs, technical keys, file names, and URLs.
- German copy editing should include spelling plus careful editorial cleanup of unnatural phrasing. Do not perform a full marketing rewrite during this pass.
- German metadata and search snippets are part of the cleanup scope.
- `docs/01_strategy/master_brief.md` remains the canonical strategy/company brief, but it requires a separate update before final semantic rewrites of company/product promises.

## Finding 1: Hidden SEO / GEO Content

Current issue:

- `signage-service/src/components/probleme-loesungen/ProblemKnowledgeGrid.tsx` renders CMS knowledge content into SSR HTML even when cards are visually collapsed.
- The current code uses `sr-only` for collapsed knowledge content and explicitly documents that crawlers should index those bullets while users do not see them.
- This creates a mismatch between visible frontend content and machine-readable content.

Decision:

- Replace hidden full knowledge blocks in the overview with visible previews plus links to full article URLs.
- Move full GEO value into public, visible, addressable problem articles.
- Remove the hidden-text SEO/GEO implementation pattern from the overview.

Recommended UX:

- Closed card shows title, symptom, short solution, and a visible preview.
- CTA opens the article in a modal overlay from the overview.
- The same article URL renders as a full page on direct navigation.

Do not do:

- Do not keep long full knowledge text only in `sr-only` blocks for indexing.
- Do not render all problem article bodies visibly on the overview page.

## Finding 2: Problem Article URL Architecture

Route pattern:

```text
/de/probleme-loesungen/[slug]
```

Example URLs:

```text
/de/probleme-loesungen/werbeanlage-leuchtet-nicht
/de/probleme-loesungen/werbeanlage-flackert
/de/probleme-loesungen/led-leuchtet-ungleichmaessig
/de/probleme-loesungen/buchstabe-leuchtet-nicht
/de/probleme-loesungen/werbeanlage-schaltet-nach-regen-ab
/de/probleme-loesungen/folie-loest-sich
/de/probleme-loesungen/folie-ist-ausgeblichen
/de/probleme-loesungen/werbeanlage-wackelt
/de/probleme-loesungen/dringende-reparatur-werbeanlage
```

Slug rule:

- Use German human-readable slugs.
- Use ASCII in URLs: `ae/oe/ue/ss`, not `ä/ö/ü/ß`.
- Do not use internal IDs such as `flicker` as public German slugs unless there is a deliberate redirect/alias strategy.

Canonical rule:

- Article canonical points to its own article URL.
- Overview canonical points to `/de/probleme-loesungen`.
- Do not canonicalize articles back to the overview.

Recommended article structure:

- `H1`: problem-specific title.
- `Kurze Antwort`: direct answer in 2-4 sentences.
- `Häufige Ursachen`: likely causes.
- `Was Sie sicher prüfen können`: safe checks only; no unsafe electrical advice.
- `Wann es dringend ist`: fire smell, sparks, exposed cables, loose parts, pedestrian risk.
- `Wie PixelRing vorgeht`: intake, review, coordination, repair/service next step.
- `Was den Umfang beeinflusst`: access, height, moisture, parts, age, location.
- CTA: start request / send photo.

## Finding 3: German Orthography And Editorial Style

Current issue:

- German public copy mixes correct German characters with ASCII transliterations.
- Examples found during audit include `Waehlen`, `faellt`, `klaeren`, `moeglich`, `Schaufensterflaeche`, `Servicevertraegen`, `Ausgewaehlte`, `Aehnliche`, `Schliessen`.

Decision:

- Use correct German orthography in all user-facing German text: `Wählen`, `fällt`, `klären`, `möglich`, `Schaufensterfläche`, `Serviceverträgen`, `Ausgewählte`, `Ähnliche`, `Schließen`.
- Apply changes contextually. Do not run a blind global replace because strings like `neue`, `Dauer`, `Service`, and technical slugs may be valid as-is.
- Improve German phrasing where it sounds unnatural, but do not add new product facts or promises.

Editorial examples to review:

- `Komplexer Service` may be better as `Umfassender Service`.
- `auf allen Etappen` may be better as `in jedem Schritt` or `vom Eingang bis zur Fertigstellung`.
- `Sicherheitszeichen` may be better as `Warnsignal` or `Sicherheitssignal`.
- `Branding-Stand` needs a clearer German term depending on intended meaning.

## Finding 4: Company Source Of Truth Dependency

Decision:

- Do not delete `docs/01_strategy/master_brief.md`.
- Keep it as the canonical strategy/company brief after it is updated.
- Record that it is outdated and needs a separate revision before final semantic copy rewrites.

Reason:

- Current public copy may contain product or company promises that cannot be fully validated until the master brief is current.
- Areas needing source-of-truth confirmation include geography, confirmed vs planned portal functionality, B2B audits, reports, guarantees, SLA, own production vs partner execution, service region, response time, and exact service scope.

Instruction for next agent:

- Do not rewrite German product promises from assumptions.
- First update or request confirmation for `docs/01_strategy/master_brief.md`, then align public website copy to it.
- During the current German cleanup, fix language quality and mark semantic uncertainty instead of inventing facts.

## Finding 5: Metadata Standard

Current issue:

- `signage-service/src/app/[locale]/layout.tsx` has an English fallback description: `AI-first, multilingual sign repair service`.
- Main pages may override metadata, but all public German routes should be checked.

Decision:

- Every public German route should have a German `title` and `description`.
- Future problem articles must have unique metadata.
- German snippets should not fall back to English.

Recommended article title pattern:

```text
[Problem]: Ursachen, sichere Prüfung und Reparatur | PixelRing
```

Recommended article description pattern:

```text
Erfahren Sie, warum [Problem] auftreten kann, was Sie sicher prüfen können und wie PixelRing die nächsten Schritte koordiniert.
```

Example:

```text
Title:
Werbeanlage flackert: Ursachen, sichere Prüfung und Reparatur | PixelRing

Description:
Wenn eine Werbeanlage flackert, können LED-Module, Netzteile, Kontakte, Feuchtigkeit oder Steuerung beteiligt sein. PixelRing prüft den Fall und koordiniert die nächsten Schritte.
```

## Correction Plan

1. Update `docs/01_strategy/master_brief.md` in a separate strategy pass before final semantic rewriting of company/product promises.
2. Implement problem article URLs under `/de/probleme-loesungen/[slug]`.
3. Add modal-overlay behavior from the overview while preserving full direct article pages.
4. Replace hidden full knowledge content in `ProblemKnowledgeGrid` with visible previews and article CTAs.
5. Add self-canonical and German metadata for each problem article.
6. Clean German orthography and unnatural phrasing in public fallback copy and CMS content.
7. Check all public German routes for German metadata and canonical behavior.
8. Re-run German content QA after implementation.

## Progress Log

### 2026-05-04

- Current sprint/block: German public website GEO article architecture implementation.
- Done: Added public Problems & Solutions article route direction in code; overview hidden full-knowledge pattern replaced with visible previews and article CTAs; direct article rendering and German self-canonical metadata added.
- In progress: URL-backed intercepted modal behavior was not added because the app has no existing parallel/intercepted route modal pattern.
- Next action: Review implementation in browser and decide whether a true intercepted App Router modal is worth a separate architecture pass.
- Blockers/risks: Article visibility depends on published CMS symptom articles and the existing CMS internal slug mapping.
- Updated documents: `docs/02_public_website/german_site_audit.md`, `PROGRESS.md`, `signage-service/src/app/[locale]/probleme-loesungen/[slug]/page.tsx`, `signage-service/src/components/probleme-loesungen/ProblemKnowledgeGrid.tsx`.

### 2026-05-04

- Current sprint/block: German public website audit and correction planning.
- Done: Hidden SEO/GEO content risk identified; article URL + modal architecture agreed; German orthography rule agreed; metadata standard agreed; `master_brief.md` dependency identified.
- In progress: No implementation yet. Awaiting confirmed correction plan execution.
- Next action: Update `master_brief.md` or start implementation from the correction plan with explicit owner confirmation.
- Blockers/risks: Current company source of truth is outdated; semantic copy promises should not be finalized until it is revised.
- Updated documents: `docs/02_public_website/german_site_audit.md`.
