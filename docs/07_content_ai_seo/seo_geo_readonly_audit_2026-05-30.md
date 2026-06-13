# SEO / GEO Read-Only Audit — 2026-05-30

Status: current audit note and next-agent backlog.

Scope: PixelRing Reparatur public website SEO (поисковая оптимизация) and GEO (оптимизация для AI-ответов / generative engine optimization).

This document records a read-only (без изменений данных) audit of the current Next.js (фреймворк приложения) implementation, CMS (система управления контентом) state, and active SEO/GEO (поисковая и AI-видимость) strategy documents.

## Sources Checked

- `PROGRESS.md` (короткий журнал состояния проекта)
- `docs/07_content_ai_seo/geo_optimization_strategy.md` (GEO-стратегия)
- `docs/01_strategy/new/Block 7 — SEO & GEO Strategy.md` (стратегический блок SEO/GEO)
- `docs/13_references_archive/seo_content_legacy/german_site_audit.md` (архивный немецкий аудит сайта)
- `signage-service/src/lib/seo.ts` (общие SEO-константы)
- `signage-service/src/app/sitemap.ts` (XML sitemap / карта сайта)
- `signage-service/src/app/robots.ts` (robots.txt / правила обхода)
- `signage-service/src/app/[locale]/probleme-loesungen/[slug]/page.tsx` (problem article pages / страницы статей о проблемах)
- `signage-service/tmp/cms-public-content-audit.*` (последний сохранённый CMS-аудит)
- Read-only SQL SELECT (только чтение из базы) against `cms_articles` (таблица статей CMS)

## Closed In This Pass

1. `/[locale]/leistungen/werbeanlagen-reparatur` (посадочная страница ремонта рекламных конструкций) is now included in `PUBLIC_SITEMAP_PATHS` (список публичных URL для sitemap / карты сайта).

2. Homepage `fallback metadata` (резервные метаданные) were cleaned:
   - DE (немецкий): `für` instead of `fuer`;
   - TR (турецкий): Turkish diacritics restored in title and description;
   - PL (польский): Polish diacritics restored in title and description.

3. `Referenzen` (страница примеров работ) now has non-empty `fallback metadata` (резервные метаданные) from static localized content when CMS SEO fields (SEO-поля CMS) are unavailable.

4. `Referenzen` (страница примеров работ) DE (немецкий) fallback description (резервное описание) now uses `Ausgewählte` instead of `Ausgewaehlte`.

5. `Block 7 — SEO & GEO Strategy` (стратегический блок SEO/GEO) was reconciled with implementation status:
   - `Article JSON-LD` (структурированные данные Article) is marked partially implemented;
   - related problem links (ссылки на похожие проблемы) are marked partially implemented;
   - markdown `h2/h3` rendering (рендеринг заголовков Markdown) is marked implemented;
   - remaining items are kept as explicit next steps, not repeated as unstarted work.

## Verified As Already Implemented

- German-first routing (немецкий как основной вход) is active through `defaultLocale: 'de'` and disabled locale detection (автоопределение языка).
- Public sitemap (карта сайта) includes main localized public pages.
- Problem article sitemap (карта сайта статей о проблемах) includes only published locales when database access is available.
- Missing-locale problem article fallback (временная подстановка статьи на другом языке) uses `noindex` (запрет индексации) and canonical (канонический URL) to the fallback content locale.
- `Probleme & Lösungen` (страница проблем и решений) no longer depends on hidden full SEO text (скрытый SEO-текст); article links (ссылки на статьи) are crawlable (доступны для обхода).
- Problem article pages (страницы статей о проблемах) render visible article content, `shortAnswer` (короткий ответ), causes (причины), safe checks (безопасные проверки), urgent warnings (срочные признаки), service process (процесс сервиса) and scope factors (факторы объёма работ).
- Article pages (страницы статей) include basic `Article JSON-LD` (структурированные данные Article).
- Related problem links (ссылки на похожие проблемы) and all-problem sidebar navigation (боковая навигация по всем проблемам) are present.
- Private/status surfaces (приватные и статусные разделы) use `noindex` (запрет индексации).
- Hidden `/service` (страница Service / Standort-Abo) remains excluded by `robots.txt` (правила обхода) and page metadata (метаданные страницы).

## Current CMS Article State

Read-only SQL SELECT (только чтение из базы), checked on 2026-05-30:

- Expected problem article slots (ожидаемые статьи по языкам): 54
- Published complete slots (опубликованные полные записи): 42
- Incomplete published slots (опубликованные, но неполные записи): 0
- Missing slots (отсутствующие записи): 12

Missing TR/PL/AR (турецкий/польский/арабский) problem articles (статьи о проблемах):

- `flicking` / `werbeanlage-flackert` (мерцает вывеска): TR, PL, AR
- `faded-film` / `folie-ist-ausgeblichen` (выцвела плёнка): TR, PL, AR
- `shaky-sign` / `werbeanlage-wackelt` (шатается вывеска): TR, PL, AR
- `urgent-repair` / `dringende-reparatur-werbeanlage` (срочный ремонт вывески): TR, PL, AR

Current behavior is acceptable for SEO safety (безопасность индексации): missing locale URLs can fall back to EN (английский) content, but they are `noindex` (не индексируются) and should not be treated as localized SEO/GEO (поисковая и AI-видимость) coverage.

## Backlog For Next Agent

1. Localize and publish missing TR/PL/AR problem articles (турецкие/польские/арабские статьи о проблемах) for:
   - `flicking` / `werbeanlage-flackert` (мерцает вывеска);
   - `faded-film` / `folie-ist-ausgeblichen` (выцвела плёнка);
   - `shaky-sign` / `werbeanlage-wackelt` (шатается вывеска);
   - `urgent-repair` / `dringende-reparatur-werbeanlage` (срочный ремонт вывески).

2. Extend article structured data (структурированные данные статей):
   - add `BreadcrumbList` (хлебные крошки);
   - add `datePublished` (дата публикации);
   - add `dateModified` (дата обновления);
   - keep `Article JSON-LD` (структурированные данные Article) aligned with visible article content.

3. Decide and document AI crawler policy (политика AI-краулеров) in `robots.txt` (правила обхода):
   - allow retrieval crawlers (краулеры для поиска и цитирования) if GEO (видимость в AI-ответах) remains a goal;
   - do not add broad blocking rules without an owner decision.

4. Plan Berlin/Brandenburg geo hub (региональная SEO-страница Berlin/Brandenburg):
   - define URL (адрес страницы);
   - define navigation placement (места переходов);
   - link to services (услуги), problem articles (статьи о проблемах), references (примеры работ), and intake (заявка);
   - avoid mass city pages (массовые городские страницы) until there is real operational evidence.

5. Continue internal linking (внутренняя перелинковка):
   - from `Leistungen` (услуги) to relevant problem articles (статьи о проблемах);
   - from problem articles (статьи о проблемах) to relevant service contexts (контексты услуг);
   - from `Referenzen` (примеры работ) to services (услуги) and problem articles (статьи о проблемах);
   - only after local copy supports the link naturally.

## Verification Notes

- No seed scripts (скрипты загрузки данных) were run.
- No CMS write (запись в CMS) was performed.
- Database check was read-only SELECT (только чтение).
- The old saved CMS public audit (CMS-аудит публичного контента) from 2026-05-27 still matches the missing TR/PL/AR article state on 2026-05-30.
