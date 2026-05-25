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
