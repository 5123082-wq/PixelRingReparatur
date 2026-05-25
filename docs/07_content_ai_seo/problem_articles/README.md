# Problem Articles Workspace

Папки для рабочих markdown-статей о проблемах вывесок.

Формат папки:

```text
[название проблемы] – [номер]
```

Примеры:

- `вывеска не светится – 01`
- `вывеска мерцает – 02`
- `новая статья – 03`

Новые исходники можно класть в `входящие новые статьи` или сразу создавать следующую номерную папку.

Перед загрузкой в CMS статья сначала редактируется и проверяется здесь.

## Progress Log

### 2026-05-25

- Current sprint/block: `rain-fail` / `werbeanlage-schaltet-nach-regen-ab` CMS/database synchronization.
- Done: created `вывеска отключается после дождя – 05/`; corrected the RU draft path metadata; expanded the RU modal and full-article `Советы по самостоятельному ремонту` sections into practical, safety-bounded `selfRepairTips`-ready guidance; clarified `FI-Schalter` / `УЗО`; added living review drafts for DE, EN, TR, PL, and AR with localized wording, the same diagnostic boundaries, and no unsafe DIY electrical repair instructions; replaced the initial DE/EN drafts with owner-provided `improved` versions and promoted them to the canonical `de.md` and `en.md` filenames; added repeatable `db:seed:article-rain-fail`; populated `selfRepairTips` JSON for DE, EN, RU, TR, PL, and AR; published `rain-fail` in CMS/database for all MVP locales; CMS audit reports `rain-fail` as published and SEO-ready in all locales; production build and HTTP route checks passed.
- In progress: owner visual review of the six live article pages and modal self-repair block.
- Next action: after review, continue with the next remaining problem article (`peeling-film`, `faded-film`, `shaky-sign`, or `urgent-repair`) using the same markdown-to-CMS flow.
- Blockers/risks: overall CMS audit still has unrelated WARN items for other missing/problem content; `rain-fail` itself is complete and SEO-ready.
- Updated documents/files: `вывеска отключается после дождя – 05/problem_article_werbeanlage-schaltet-nach-regen-ab_ru.md`, `problem_article_werbeanlage-schaltet-nach-regen-ab_de.md`, `problem_article_werbeanlage-schaltet-nach-regen-ab_en.md`, `problem_article_werbeanlage-schaltet-nach-regen-ab_tr.md`, `problem_article_werbeanlage-schaltet-nach-regen-ab_pl.md`, `problem_article_werbeanlage-schaltet-nach-regen-ab_ar.md`, `signage-service/scripts/article-self-repair-tips-data.mjs`, `signage-service/scripts/seed-article-rain-fail-all-locales.mjs`, `signage-service/package.json`, CMS public audit outputs, root `PROGRESS.md`.

### 2026-05-25

- Current sprint/block: problem article content model for CMS and AI/GEO.
- Done: added `problem_article_content_model.md` to define the target structured blocks for problem articles, including the source map for small cards, modal windows, full articles, JSON-LD, AI/GEO context, request intake, and CRM handoff; added `вывеска не светится – 01/reference_content_model_vyveska_ne_svetitsya_ru.md` as the first reference article mapped to the new model; promoted `no-light` self-repair tips from temporary code mapping into the CMS/database model via `selfRepairTips` JSON, migration `20260525170000_article_self_repair_tips`, API/editor support, and the repeatable `db:seed:article-no-light` script; populated `selfRepairTips` for DE, EN, RU, TR, PL, and AR and localized the public modal section labels per locale; updated `problem_article_rules.md` to v2.1 so `selfRepairTips` JSON is mandatory for future problem-article CMS/database work; added repeatable `db:seed:article-self-repair-tips` for `flicking`, `letter-out`, and `uneven-light`; populated `flicking` self-repair tips for published DE/EN/RU rows; populated `letter-out`, `no-light`, and `uneven-light` self-repair tips for DE/EN/RU/TR/PL/AR; updated `letter-out` and `uneven-light` all-locales seeds to keep `selfRepairTips`; removed stale hardcoded self-repair fallbacks from public rendering.
- In progress: owner visual review of production-mode modals sourced from CMS `selfRepairTips`.
- Next action: future content agent writes/updates `rain-fail`, `peeling-film`, `faded-film`, `shaky-sign`, `urgent-repair`, and missing `flicking` TR/PL/AR content using `problem_article_rules.md` v2.1.
- Blockers/risks: remaining non-migrated slugs have only short/basic DE/EN/RU CMS rows and no approved full multilingual article set; do not create TR/PL/AR or full rows until approved content exists.
- Updated documents: `problem_article_rules.md`, `problem_article_content_model.md`, `вывеска не светится – 01/reference_content_model_vyveska_ne_svetitsya_ru.md`, `../README.md`, root `PROGRESS.md`, `signage-service/scripts/article-self-repair-tips-data.mjs`, `signage-service/scripts/seed-article-self-repair-tips.mjs`, `signage-service/scripts/seed-article-letter-out-all-locales.mjs`, `signage-service/scripts/seed-article-uneven-light-all-locales.mjs`.

### 2026-05-24

- Current sprint/block: problem article modal self-repair block standard.
- Done: made `Советы по самостоятельному ремонту` mandatory as a separate modal block in `problem_article_rules.md` and `problem_article_rules_master_ru.md`; added explicit `letter-out` self-repair tips for all MVP locales; added a safe fallback so CMS-backed problem articles with `safeChecks` still render a self-repair block if no explicit mapping exists.
- In progress: owner visual review of `/ru/probleme-loesungen` modal behavior.
- Next action: refresh local browser and confirm the `letter-out` modal shows the green self-repair block.
- Blockers/risks: the block title is owner-required, but content must remain safety-bounded and must not become electrical repair instructions.
- Updated documents: `problem_article_rules.md`, `problem_article_rules_master_ru.md`, `ProblemKnowledgeGrid.tsx`, `/[locale]/probleme-loesungen/page.tsx`, root `PROGRESS.md`.

### 2026-05-24

- Current sprint/block: `Не светится отдельная буква или часть вывески` CMS/database synchronization.
- Done: created `буква или часть вывески не светится – 04/`; moved the RU source draft into the folder; normalized risky self-repair headings to the safe-check wording; added DE, EN, TR, PL, and AR review drafts; published `letter-out` / `buchstabe-leuchtet-nicht` into CMS/database for all MVP locales; added repeatable seed script `npm run db:seed:article-letter-out`; populated SEO title, SEO description, canonical URL, related slugs, causes, safe checks, urgent warnings, service process, and work scope factors.
- In progress: owner visual review of the localized public article pages.
- Next action: after review, decide whether to localize or publish the remaining missing TR/PL/AR problem articles reported by the audit.
- Blockers/risks: CMS public audit still reports unrelated missing TR/PL/AR articles for other problem slugs; `letter-out` itself is published and SEO-ready in all six locales.
- Updated documents: `problem_article_bukva_ili_chast_vyveski_ne_svetitsya_ru.md`, `problem_article_bukva_ili_chast_vyveski_ne_svetitsya_de.md`, `problem_article_bukva_ili_chast_vyveski_ne_svetitsya_en.md`, `problem_article_bukva_ili_chast_vyveski_ne_svetitsya_tr.md`, `problem_article_bukva_ili_chast_vyveski_ne_svetitsya_pl.md`, `problem_article_bukva_ili_chast_vyveski_ne_svetitsya_ar.md`, `signage-service/scripts/seed-article-letter-out-all-locales.mjs`, `signage-service/package.json`, CMS public audit outputs, root `PROGRESS.md`.

### 2026-05-24

- Current sprint/block: `LED светит неравномерно или пятнами` CMS/database synchronization.
- Done: published `uneven-light` for DE, EN, RU, TR, PL, and AR from Markdown drafts into CMS/database; added repeatable seed script `npm run db:seed:article-uneven-light`; populated SEO title, SEO description, canonical URL, related slugs, causes, safe checks, urgent warnings, service process, and work scope factors.
- In progress: owner visual review of the localized public article pages.
- Next action: after review, decide whether to localize the remaining missing TR/PL/AR problem articles reported by the audit.
- Blockers/risks: CMS public audit still reports unrelated missing TR/PL/AR articles for other problem slugs; `uneven-light` itself is published and SEO-ready in all six locales.
- Updated documents: `README.md`, root `PROGRESS.md`, `signage-service/scripts/seed-article-uneven-light-all-locales.mjs`, `signage-service/package.json`, CMS public audit outputs.

### 2026-05-24

- Current sprint/block: `LED светит неравномерно или пятнами` multilingual Markdown review drafts.
- Done: added DE, EN, TR, PL, and AR Markdown drafts in `led светит неравномерно – 03/` based on the RU canonical draft.
- In progress: owner review of localized article tone, terminology, and safety wording.
- Next action: after owner approval, decide whether to synchronize localized drafts into CMS/database and/or seed scripts.
- Blockers/risks: translations are review drafts; CMS/database and seed files are intentionally unchanged.
- Updated documents: `problem_article_led_svetit_neravnomerno_de.md`, `problem_article_led_svetit_neravnomerno_en.md`, `problem_article_led_svetit_neravnomerno_tr.md`, `problem_article_led_svetit_neravnomerno_pl.md`, `problem_article_led_svetit_neravnomerno_ar.md`, `README.md`.
