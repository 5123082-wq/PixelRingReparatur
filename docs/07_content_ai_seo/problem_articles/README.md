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

Языковой охват определяется [действующей GEO-стратегией](../geo_optimization_strategy.md): полный перевод каждой статьи на DE/EN/RU/TR/PL/AR больше не обязателен. DE остаётся каноническим полным контентом, EN поддерживается как международная версия, RU добавляется при наличии бизнес-смысла, а TR/PL/AR-статьи создаются только после подтверждения спроса. Существующие качественные переводы сохраняются.

## Progress Log

### 2026-07-18 - `shaky-sign` / `urgent-repair` DE publication (публикация немецких версий)

- Current sprint/block: `shaky-sign` (служебный идентификатор статьи о шатающейся вывеске) full rewrite (полная переработка) and `urgent-repair` (служебный идентификатор статьи о срочном ремонте) focused source-backed editorial refresh (точечная редакторская доработка на основе источников).
- Done: verified the former DE CMS records (прежние немецкие записи CMS); created, independently reviewed and owner-approved (создали, независимо проверили и получили утверждение владельца) `вывеска шатается – 09/problem_article_werbeanlage-wackelt_de.md` and `срочный ремонт вывески – 10/problem_article_dringende-reparatur-werbeanlage_de.md`; published both through the dedicated atomic `db:seed:articles-shaky-urgent-de` command (отдельную атомарную команду загрузки); preserved the original record IDs and publication dates (исходные идентификаторы и даты публикации); corrected the `shaky-sign` canonical URL (канонический адрес статьи о шатающейся вывеске); synchronized full public content, SEO/CMS fields (полный публичный текст и поисковые/CMS-поля), arrays and structured `selfRepairTips` (массивы и структурированные советы безопасных действий); and verified exact DB equality, three HTTP 200 routes, metadata, SSR modal payloads, one H1 per article, tables, CTA copy, targeted lint, CMS workflow tests and production build (точное совпадение базы, три страницы HTTP 200, метаданные, серверные данные модальных окон, один H1 в статье, таблицы, призывы к действию, точечную проверку кода, тесты CMS и промышленную сборку).
- In progress: optional owner visual review (необязательная визуальная проверка владельцем) of the two overview modals and full article pages (двух модальных окон обзора и полных страниц статей).
- Next action: address only owner feedback if present; additional language publication (публикация на других языках) requires a separate approved track.
- Blockers/risks: no CMS publication blocker remains (блокеров публикации в CMS нет); automated localhost clicks were blocked by the in-app browser URL policy (автоматические клики по localhost заблокированы политикой URL встроенного браузера), while DB/SSR/HTTP/build verification (проверка базы, серверной разметки, HTTP и сборки) passed. Do not introduce `24/7` promises (обещания круглосуточного сервиса), fixed response times (фиксированное время реакции), photo-based safety confirmation (подтверждение безопасности по фотографиям), or DIY electrical/mechanical instructions (инструкции по самостоятельному электрическому/механическому ремонту).
- Updated documents/files: both published DE article sources (оба опубликованных немецких источника статей), `signage-service/scripts/seed-articles-shaky-urgent-de.mjs` (скрипт загрузки), `signage-service/package.json` (команда пакета), this workspace log (этот журнал рабочей области), `../README.md` (доменный файл-ориентир), `../content_ai_seo_progress_log.md` (доменный журнал прогресса), root `PROGRESS.md` (краткий глобальный журнал).

### 2026-07-03 - RU/EN localized review drafts

- Current sprint/block: `faded-film` / `Folie ist ausgeblichen` (пленка выцвела) RU/EN localized markdown adaptation.
- Done: created `пленка выцвела – 08/problem_article_folie-ist-ausgeblichen_ru.md` and `пленка выцвела – 08/problem_article_folie-ist-ausgeblichen_en.md` as owner-review drafts; adapted SEO/CMS fields (поисковые и CMS-поля), small card, modal, full article, FAQ, safety-bounded `selfRepairTips` (структурированные советы по самостоятельным действиям), and internal AI notes for each locale; after owner feedback, shortened and cleaned the RU draft and applied the same public-readiness pass to the EN draft by separating non-public service blocks, reducing repetition, localizing headings/tone, and strengthening Berlin/Brandenburg B2B context; no CMS/database (CMS/база данных), seed scripts (скрипты загрузки), routes (маршруты), sitemap (карта сайта), slug maps (карты slug), or `signage-service/package.json` changes were made.
- In progress: owner review of the RU/EN markdown drafts.
- Next action: after owner approval, handle the separate CMS publication phase: extend or add seed script(s), load RU/EN records into CMS/database, and verify `/ru/probleme-loesungen/folie-ist-ausgeblichen`, `/en/probleme-loesungen/folie-ist-ausgeblichen`, plus the RU/EN hub modals.
- Blockers/risks: partial replacement must not promise exact colour match; photo-based review must remain an initial assessment, not a fixed price; self-help guidance must remain limited to photos, measurements, surface notes, old references, and safe access information.
- Updated documents/files: `пленка выцвела – 08/problem_article_folie-ist-ausgeblichen_ru.md`, `пленка выцвела – 08/problem_article_folie-ist-ausgeblichen_en.md`, `README.md`, root `PROGRESS.md`.

### 2026-07-03

- Current sprint/block: `faded-film` / `Folie ist ausgeblichen` (пленка выцвела) DE problem article (немецкая статья о проблеме) markdown-to-CMS publication.
- Done: created `пленка выцвела – 08/` and saved the owner-provided DE draft as `problem_article_folie-ist-ausgeblichen_de.md`; added repeatable `db:seed:article-faded-film` (повторяемый seed-скрипт загрузки CMS-статьи) for DE only; mapped the public full article into `content` (публичное тело статьи), SEO fields (поисковые поля), structured CMS fields (структурированные поля CMS), and `selfRepairTips` (структурированные советы по самостоятельным действиям); added `--dry-run` (проверка без записи в БД) validation; ran `npm run db:seed:article-faded-film` against the local CMS database and verified `/de/probleme-loesungen/folie-ist-ausgeblichen` (страница проблемы) renders the full DE article.
- In progress: owner visual review of the DE article page and the `Folie ist ausgeblichen` (пленка выцвела) modal on `/de/probleme-loesungen` (раздел проблем и решений).
- Next action: decide the RU/EN article quality workflow and whether TR/PL/AR should receive full localized articles in this phase.
- Blockers/risks: this pass updates only DE; existing EN/RU thin records and missing TR/PL/AR records for `faded-film` (служебный slug статьи) remain out of scope until the next approved localization phase.
- Updated documents/files: `пленка выцвела – 08/problem_article_folie-ist-ausgeblichen_de.md`, `signage-service/scripts/seed-article-faded-film-de.mjs`, `signage-service/package.json`, `README.md`, root `PROGRESS.md`.

### 2026-06-05

- Current sprint/block: `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` problem article RU draft.
- Done: created `люминесцентные трубки или led – 07/` and wrote `problem_article_leuchtstoffroehren_werbeanlage_ersetzen_led_umruesten_ru.md` as a RU review draft with small card, modal, full article, SEO/CMS draft fields, related slugs, required safety-bounded `selfRepairTips` (советы по самостоятельному ремонту), and an internal AI note with source-backed technical boundaries.
- In progress: owner review of the markdown draft.
- Next action: after owner approval, prepare the German canonical draft and only then decide whether to continue with localization, CMS/database sync, seed scripts, sitemap entries, or route verification.
- Blockers/risks: do not turn EU RoHS / Ecodesign context into legal advice; do not publish DIY instructions for opening signs, removing fluorescent tubes, replacing `starter`, `ballast / Vorschaltgerät`, wiring, LED modules, or power supplies.
- Updated documents/files: `люминесцентные трубки или led – 07/problem_article_leuchtstoffroehren_werbeanlage_ersetzen_led_umruesten_ru.md`, `README.md`, `../README.md`, root `PROGRESS.md`.

### 2026-06-02

- Current sprint/block: future LED modernization problem-article intake.
- Done: added `входящие новые статьи/led_modernisierung_future_problem_articles.md` as a backlog planning brief for two future real-problem articles derived from the LED modernization research: `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` (заменить люминесцентные трубки в рекламной установке или перейти на LED) and `Neonreklame reparieren oder auf LED umrüsten?` (ремонтировать неоновую рекламу или перейти на LED).
- In progress: no article drafting yet; the service page `/[locale]/leistungen/lichtwerbung-led-modernisierung` must be modernized first.
- Next action: after owner approval, create the next numbered problem-article folder and write the first markdown draft, following `../problem_article_rules.md` and `../problem_article_content_model.md`.
- Blockers/risks: do not create CMS rows, seed files, public routes, sitemap entries, or localized drafts from the brief until the owner explicitly starts the article track.
- Updated documents/files: `входящие новые статьи/led_modernisierung_future_problem_articles.md`, `../service_page_led_modernisierung_plan.md`, `README.md`, root `PROGRESS.md`.

### 2026-05-27

- Current sprint/block: `folie-loest-sich` / film lifting article markdown intake.
- Done: created `пленка на витрине отклеивается – 06/`, saved the owner-provided RU draft as `problem_article_folie-loest-sich_ru.md`, aligned the draft metadata with the actual folder path, completed a light RU editorial pass focused on the modal self-repair block, safe-check guidance, and public article readability, added DE, EN, TR, PL, and AR review drafts with localized SEO/CMS blocks, small card, modal, full article, and internal AI notes, replaced the DE and EN drafts with fuller owner-provided versions adapted to the local `folie-loest-sich` draft format, added repeatable seed `db:seed:article-peeling-film`, and published `peeling-film` into CMS/database for DE, EN, RU, TR, PL, and AR with canonical route `/[locale]/probleme-loesungen/folie-loest-sich` and structured `selfRepairTips`.
- In progress: owner visual review of the six live article pages and modal self-repair block.
- Next action: owner reviews the live article pages; future work can continue with the remaining missing TR/PL/AR problem articles reported by the CMS audit.
- Blockers/risks: CMS audit WARN items remain for unrelated missing TR/PL/AR articles (`flicking`, `faded-film`, `shaky-sign`, `urgent-repair`); `peeling-film` itself is published and SEO-ready in all six locales.
- Updated documents/files: `пленка на витрине отклеивается – 06/problem_article_folie-loest-sich_ru.md`, `problem_article_folie-loest-sich_de.md`, `problem_article_folie-loest-sich_en.md`, `problem_article_folie-loest-sich_tr.md`, `problem_article_folie-loest-sich_pl.md`, `problem_article_folie-loest-sich_ar.md`, `signage-service/scripts/seed-article-peeling-film-all-locales.mjs`, `signage-service/package.json`, CMS public audit outputs, `README.md`, root `PROGRESS.md`; source drafts used for DE/EN adaptation: `/Users/macbookaleks/Downloads/pixelring_folie_article_translations_de_en/problem_article_folie_loest_sich_de.md`, `/Users/macbookaleks/Downloads/pixelring_folie_article_translations_de_en/problem_article_window_film_peeling_en.md`.

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
