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

* **Date:** 2026-05-31
* **Current sprint/block:** Repair Landing Page DE SEO Copy Update
* **Done:**
  - Updated the German canonical `meta description` (SEO-описание) on `/[locale]/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций) to mention defective signage in Berlin/Brandenburg (Берлин/Бранденбург), PixelRing (бренд PixelRing), `Fotos senden` (отправить фото), and first assessment (первая оценка).
  - Shortened the German H1 (главный заголовок) to `Werbeanlagen-Reparatur in Berlin & Brandenburg` (ремонт рекламных конструкций в Берлине и Бранденбурге).
  - Kept the existing `meta title` (SEO-заголовок) unchanged: `Werbeanlagen-Reparatur Berlin & Brandenburg | PixelRing` (ремонт рекламных конструкций Берлин и Бранденбург | PixelRing).
  - Verified local DOM (структура страницы в браузере): one H1 (один главный заголовок), updated `meta description` (SEO-описание), updated Open Graph description (описание для соцсетей), and updated Twitter description (описание Twitter/X).
  - Ran targeted lint (точечная lint-проверка) for the touched page file successfully.
* **In progress:** Strategic plan quick wins remain: hero intro/CTA wording (текст первого экрана и призыв к действию), legal-safe Gewährleistung wording (осторожная формулировка гарантии/законной ответственности), and later content blocks.
* **Next action:** Choose the next approved repair-page quick win, preferably hero intro/CTA wording (текст первого экрана и призыв к действию) or legal-safe Gewährleistung wording (осторожная формулировка гарантии/законной ответственности).
* **Blockers/risks:** None for this approved SEO copy update. Wider legal wording still needs a separate owner-approved plan before editing.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-05-31
* **Current sprint/block:** Repair Landing Page Mobile UX Cleanup
* **Done:**
  - Fixed mobile overflow/readability (мобильное обрезание и читаемость) on `/[locale]/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций).
  - Added safe wrapping for long German hero/symptom headings (перенос длинных немецких заголовков) and card copy.
  - Prevented horizontal bleed (горизонтальный выход за экран) on the repair page wrapper.
  - Increased mobile hero height (высота первого экрана на мобильном) so the breadcrumb (хлебные крошки) no longer overlaps the H1 (главный заголовок).
  - Truncated the current breadcrumb label (обрезка текущего пункта хлебных крошек) instead of allowing it to widen the viewport.
  - Verified mobile emulation at `390x1200`: `scrollWidth` equals `390`, H1 and breadcrumb do not overlap, and no framework overlay (ошибка Next.js поверх страницы) appears.
* **In progress:** Wider strategic plan quick wins remain: hero/CTA wording (текст первого экрана и призыв к действию), legal-safe Gewährleistung wording (осторожная формулировка гарантии/законной ответственности), and later content blocks.
* **Next action:** Continue with the next small approved repair-page quick win, preferably hero/CTA wording or legal-safe Gewährleistung wording before adding larger content blocks.
* **Blockers/risks:** Browser plugin viewport resizing was unavailable in this session, so mobile viewport proof used headless Chrome CDP emulation after in-app Browser desktop/interaction checks.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-05-31
* **Current sprint/block:** Repair Landing Page Strategic Plan - Brand Entity Cleanup
* **Done:**
  - Completed the read-only baseline (стартовый снимок без изменений) for `/[locale]/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций): status `200 OK`, `title` (SEO-заголовок), `meta description` (SEO-описание), `canonical` (канонический URL), `hreflang` (языковые alternate-ссылки), `sitemap` (карта сайта), `robots` (правила индексации), headings (заголовки), and JSON-LD (структурированные данные).
  - Unified `PixelRing` brand spelling (единое написание бренда) inside the repair landing page metadata, visible page copy, FAQ (частые вопросы), JSON-LD (структурированные данные), and related repair diagnostic components.
  - Left portal demo/legal references to `Pixel Ring GmbH` (demo/legal строка тестового аккаунта) unchanged because they are outside the repair landing page scope.
  - Verified the DE repair page locally after the change: metadata and JSON-LD now emit `PixelRing`.
* **In progress:** The wider strategic plan still has pending quick wins: hero/CTA wording (текст первого экрана и призыв к действию), mobile overflow cleanup (исправление обрезания на мобильном), and legal-safe Gewährleistung wording (осторожная формулировка гарантии/законной ответственности).
* **Next action:** Choose and implement the next small approved quick win for the repair landing page, preferably CTA/hero wording or mobile overflow cleanup before adding more content blocks.
* **Blockers/risks:** Full global brand replacement is not done and should not be done blindly because some `Pixel Ring GmbH` strings belong to demo/legal portal contexts.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

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
