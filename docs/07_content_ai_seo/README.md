# 07 Content AI SEO

Purpose: content rules, SEO, GEO, troubleshooting content, knowledge strategy, and AI visibility.

This folder covers how the site should be understood by search engines and AI answer engines. The AI chat assistant itself belongs in `08_ai_assistant/`.

Planned base documents:
- `copy_system.md`
- `cta_labels_master.md`
- `problem_article_rules.md` - обязательный короткий стандарт для problem articles (статей о проблемах)
- `problem_article_rules_master_ru.md` - расширенный master-стандарт (главный справочник) для глубокого редактирования problem articles (статей о проблемах)
- `problem_article_content_model.md` - целевая content model (контентная модель) для CMS (системы управления контентом), карточек, модальных окон, полных статей, JSON-LD (структурированных данных) и AI/GEO (оптимизации для AI-ответов)
- `seo_geo_readonly_audit_2026-05-30.md` - read-only SEO/GEO audit (аудит поисковой и AI-видимости без изменения данных) with closed items and next-agent backlog (список задач для следующего агента)
- `knowledge_base_strategy.md`
- `troubleshooting_content.md`
- `seo_strategy.md`
- `geo_optimization_strategy.md`
- `ai_visibility_strategy.md`

## Progress Log

* **Date:** 2026-05-30
* **Current sprint/block:** Repair Landing Page SEO/GEO Implementation
* **Done:**
  - Improved `/[locale]/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций) after owner approval.
  - Shortened `meta title` (SEO-заголовок) / `meta description` (SEO-описание) where needed and added `Open Graph` (метаданные для соцсетей) plus `Twitter card` (карточка Twitter/X).
  - Expanded `JSON-LD` (структурированные данные) with `Service` (услуга), `LocalBusiness` (локальный бизнес), `BreadcrumbList` (хлебные крошки), and existing `FAQPage` (FAQ-структура).
  - Added localized GEO short-answer content (короткий ответ для AI-ответов) and symptom table for DE/EN/RU/TR/PL/AR (немецкий/английский/русский/турецкий/польский/арабский).
  - Fixed repair workflow labels (подписи интерактивного блока) and TR/PL navigation diacritics (турецкие/польские диакритические знаки) on the repair page.
  - Improved first hero image priority (`fetchPriority`, приоритет загрузки изображения), section-label contrast (контраст служебных заголовков), and footer heading order (порядок заголовков в footer / подвале сайта).
  - Normalized HTTP `Link` header (HTTP-заголовок alternate/hreflang) so `x-default` (резервный язык по умолчанию) points to the German canonical URL `/de/leistungen/werbeanlagen-reparatur`.
* **In progress:** Global lint backlog (общий backlog lint-ошибок) remains outside this page change.
* **Next action:** Owner visually reviews all six repair landing page locales, then decide whether to clean the unrelated lint backlog before release.
* **Blockers/risks:** None for the repair landing page SEO/GEO pass; unrelated global lint errors remain in older files.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-05-30
* **Current sprint/block:** SEO/GEO Read-Only Audit Follow-Up
* **Done:**
  - Added `/[locale]/leistungen/werbeanlagen-reparatur` (посадочная страница ремонта рекламных конструкций) to `PUBLIC_SITEMAP_PATHS` (список публичных URL для sitemap / карты сайта).
  - Cleaned homepage `fallback metadata` (резервные метаданные) for DE/TR/PL (немецкий/турецкий/польский).
  - Fixed `Referenzen` (страница примеров работ) metadata fallback (резервные метаданные), so CMS absence no longer produces an empty description (пустое описание).
  - Reconciled `Block 7 — SEO & GEO Strategy` (стратегический блок SEO/GEO) with implemented article template status.
  - Added `seo_geo_readonly_audit_2026-05-30.md` (read-only SEO/GEO audit / аудит без изменения данных) with verified implemented items, current CMS article gaps, and next-agent backlog.
* **In progress:** Missing TR/PL/AR problem articles (турецкие/польские/арабские статьи о проблемах) remain content backlog.
* **Next action:** Next agent should publish missing TR/PL/AR articles, then extend article structured data (структурированные данные) with `BreadcrumbList` (хлебные крошки), `datePublished` (дата публикации), and `dateModified` (дата обновления).
* **Blockers/risks:** AI crawler policy (политика AI-краулеров) and Berlin/Brandenburg geo hub (региональная SEO-страница Berlin/Brandenburg) still require owner-level planning decisions before implementation.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/seo_geo_readonly_audit_2026-05-30.md`
  - `docs/01_strategy/new/Block 7 — SEO & GEO Strategy.md`

* **Date:** 2026-05-27
* **Current sprint/block:** Google Ads Landing Page Integration
* **Done:**
  - Implemented the dedicated outdoor advertising repair landing page at `/[locale]/leistungen/werbeanlagen-reparatur` in all 6 locales (DE, EN, RU, TR, PL, AR).
  - Modified [ContactForm.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/components/common/ContactForm.tsx) to support pre-filling from props.
  - Designed a premium dark glassmorphic slide-over panel [LeistungenProblemDrawer.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/components/leistungen/LeistungenProblemDrawer.tsx) using brand-specific glows and grid overlays.
  - Developed card workflow grid [LeistungenReparaturWorkflow.tsx](file:///Users/macbookaleks/Documents/GitHub/PixelRingReparature/signage-service/src/components/leistungen/LeistungenReparaturWorkflow.tsx) featuring 8 specific symptom cards with inline SVG icons + 1 fallback dashed card.
  - Verified compilation and build compatibility via Next.js production builder.
* **In progress:** None (successfully completed implementation).
* **Next action:** Owner reviews routes locally, checks interactive slide-over drawer animations and form responses.
* **Blockers/risks:** None.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `task.md` (internal session checklist)
  - `walkthrough.md` (internal session summary)
