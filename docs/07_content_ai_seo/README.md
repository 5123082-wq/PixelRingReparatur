# 07 Content AI SEO

Purpose: content rules, SEO (поисковая оптимизация), GEO (оптимизация для AI-ответов), troubleshooting content (контент для разбора проблем), knowledge strategy (стратегия базы знаний), and AI visibility (видимость в AI-ответах).

This folder covers how PixelRing Reparatur should be understood by search engines and AI answer engines. The AI chat assistant itself belongs in [../08_ai_assistant/](../08_ai_assistant/); technical implementation belongs in [../09_engineering/](../09_engineering/).

## Context Beacon

Purpose: short domain router (маршрутизатор домена) for Content/AI/SEO startup context. Read this beacon and the startup list below first; do not read the full progress log at startup.

Current active tracks:

- `Probleme & Lösungen` (проблемы и решения): modernization of the problem-content cluster, including weak article rewrites, structured sections, CTA safety, and CMS article handling.
- Service pages (страницы услуг): reusable service-page pattern from `Werbeanlagen-Reparatur` (ремонт рекламных конструкций) and follow-up work for neighboring service pages.
- `LED-Modernisierung` (LED-модернизация): service page strengthening is active; future problem articles remain deferred until explicit owner approval.
- SEO/GEO hygiene (поисковая и AI-видимость): structured data, metadata, internal linking, and content quality improvements with current-state vs planned-state separation.

Read-first rules:

- At startup, read this README only as the domain router (маршрутизатор домена).
- For `Probleme & Lösungen` (проблемы и решения), read [probleme_loesungen_cluster_modernization_plan.md](probleme_loesungen_cluster_modernization_plan.md) and then the specific article rule/model document required by the task.
- For service page work, read the relevant service-page pattern or handoff before touching copy or code.
- For historical continuation, read only the latest 1-2 checkpoint entries below, then open `content_ai_seo_progress_log.md` only if the task continues that track.

What NOT to read by default:

- Do not read full progress log at startup.
- Do not read raw audits at startup.
- Do not read all problem article drafts at startup.
- Do not treat archived SEO/content prompt packs as active instructions unless a current document explicitly points to them.

Archive/history rule:

- [content_ai_seo_progress_log.md](content_ai_seo_progress_log.md) is history and checkpoint context, not a startup document.
- [source_audits/](source_audits/) contains raw audit source material. Use it only when validating the source behind an active plan.
- [../13_references_archive/](../13_references_archive/) remains historical reference only unless an active current document names a specific section.

## Startup / Read First

- [README.md](README.md) - this short router (маршрутизатор) and context beacon (быстрый ориентир).
- [probleme_loesungen_cluster_modernization_plan.md](probleme_loesungen_cluster_modernization_plan.md) - active modernization plan (активный план модернизации) for `/probleme-loesungen` (`Probleme & Lösungen` / проблемы и решения).
- [problem_article_rules.md](problem_article_rules.md) - mandatory short standard (обязательный короткий стандарт) for problem articles (статьи о проблемах).
- [problem_article_content_model.md](problem_article_content_model.md) - target content model (контентная модель) for CMS (система управления контентом), cards, modals, full articles, JSON-LD (структурированные данные), and AI/GEO (оптимизация для AI-ответов).

## Task-Specific Docs

- [problem_article_rules_master_ru.md](problem_article_rules_master_ru.md) - expanded master standard (главный справочник) for deep editing of problem articles (статьи о проблемах).
- [problem_articles/README.md](problem_articles/README.md) - routing for article drafts (черновики статей) and incoming article work.
- [service_page_pattern_werbeanlagen_reparatur.md](service_page_pattern_werbeanlagen_reparatur.md) - reusable service page pattern (повторяемый шаблон страницы услуги) based on `/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций).
- [service_page_neighbor_handoff.md](service_page_neighbor_handoff.md) - next-agent handoff (передача следующему агенту) for neighboring service pages (соседние страницы услуг).
- [service_page_led_modernisierung_plan.md](service_page_led_modernisierung_plan.md) - active implementation plan (активный план внедрения) for `/leistungen/lichtwerbung-led-modernisierung` (страница LED-модернизации).
- [copy_system.md](copy_system.md) - copy system (система текстов) for public content.
- [cta_labels_master.md](cta_labels_master.md) - CTA label library (библиотека призывов к действию).

## Deep / Reference Docs

- [seo_geo_readonly_audit_2026-05-30.md](seo_geo_readonly_audit_2026-05-30.md) - read-only SEO/GEO audit (аудит поисковой и AI-видимости без изменения данных) with closed items and next-agent backlog (список задач для следующего агента).
- [geo_optimization_strategy.md](geo_optimization_strategy.md) - GEO strategy (стратегия оптимизации для AI-ответов).
- [baselines/werbeanlagen_reparatur_baseline_2026-05-31.md](baselines/werbeanlagen_reparatur_baseline_2026-05-31.md) - baseline snapshot (стартовый снимок) for the repair landing page.
- [content_ai_seo_progress_log.md](content_ai_seo_progress_log.md) - full Progress Log (полный журнал прогресса). Do not read full progress log at startup. Read only when continuing this track.

## Raw Audits

- [source_audits/pixelring_content_cluster_audit_2026-06-12.md](source_audits/pixelring_content_cluster_audit_2026-06-12.md) - raw independent source audit (сырой независимый аудит-источник) for `/de/probleme-loesungen` (`Probleme & Lösungen` / проблемы и решения). Read only when validating or revising the active cluster modernization plan (активный план модернизации кластера).

## Latest Checkpoints

Do not read full progress log at startup. Read only when continuing this track.

### 2026-07-09 - Public SEO Metadata Merge

* **Current sprint/block:** Technical SEO metadata (технические SEO-метаданные) and structured data (структурированные данные) merge from developer patch.
* **Done:**
  - Merged the developer-provided `hreflang` (языковые альтернативы), absolute `canonical` (канонический URL), OpenGraph (превью ссылки), Twitter Card (карточка ссылки), and `LanguageSwitcher` (переключатель языка) link changes without overwriting the existing `sitemap.xml` (карта сайта) state.
  - Added a shared public-page metadata helper (общий хелпер метаданных) and OpenGraph locale map (карта локалей OpenGraph) for DE/EN/RU/TR/PL/AR.
  - Extended the stronger metadata pattern to `/ueber-uns` (страница «О нас»), `/referenzen` (страница примеров работ), `/leistungen` (страница услуг), `/business` (страница для бизнеса), and `/probleme-loesungen` (страница проблем и решений).
  - Added safe `AboutPage` and `CollectionPage` JSON-LD (структурированные данные) without LocalBusiness claims (заявления локального бизнеса), addresses, ratings, prices, exact customer locations, or CRM data.
  - Preserved `/impressum` (обязательные сведения о компании) and `/privacy` (политика конфиденциальности) in `PUBLIC_SITEMAP_PATHS` (публичные URL карты сайта); legal pages now use absolute self-canonical URLs (абсолютные канонические URL на себя).
* **In progress:** Production deployment and Google Search Console (Google Search Console) verification are still pending.
* **Next action:** After deployment, inspect rendered HTML (сгенерированный HTML) and Search Console URL Inspection (проверка URL в Search Console) for `/de/ueber-uns`, `/ru/referenzen`, `/de/leistungen`, `/de/business`, and `/de/probleme-loesungen`.
* **Blockers/risks:** Legal pages intentionally did not receive `hreflang` (языковые альтернативы) in page metadata because their body content still uses German legal source-of-truth (немецкий источник юридического текста); the sitemap still lists localized legal URLs.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

### 2026-06-28 - `Reinigung & Pflege` Service Strategy

Done: created and expanded [service_page_reinigung_werbeanlagen_markisen_plan.md](service_page_reinigung_werbeanlagen_markisen_plan.md) as the planning source for `Reinigung & Pflege von Werbeanlagen, Markisen und Außenwerbung` (очистка и уход за рекламными конструкциями, маркизами и наружной рекламой), including competitor/context research, owner decisions, positioning, page shape, `/leistungen` (страница услуг) module, keyword clusters, calculator specification, generated-image prompts, safety boundaries, internal links, and staged development.

Next action: in the next implementation chat, start with Stage A (этап A) from the plan: confirm final route, H1 (главный заголовок), overview module format, and image direction before any application code, CMS records, or public copy implementation.

### 2026-06-13 - `Probleme & Lösungen` P1.1 `urgent-repair` Rewrite

Done: rewrote the published DE/EN/RU `CmsArticle` records (CMS-статьи) for `urgent-repair` / `dringende-reparatur-werbeanlage` (срочный ремонт рекламной конструкции), added safety-bounded `selfRepairTips` (советы по самостоятельному ремонту с границами безопасности), updated code-backed cards, and verified lint, production build, rendered HTML, JSON-LD (структурированные данные), urgent CTA (срочный призыв к действию), and absence of unsafe emergency wording.

Next action: owner visual/copy review, then continue the weak-article rewrite sequence with `werbeanlage-wackelt` (вывеска шатается) or `folie-ist-ausgeblichen` (пленка выцвела) if accepted.

### 2026-06-13 - `Probleme & Lösungen` P0.1 Technical/CMS Foundation

Done: cleaned the published DE `CmsPage` (CMS-страница) for `/de/probleme-loesungen` (`Probleme & Lösungen` / проблемы и решения), added article `BreadcrumbList` (структурированные хлебные крошки), `datePublished` (дата публикации), `dateModified` (дата изменения), fixed mobile overflow, and limited duplicated structured sections while preserving fallback sections for weak articles.

Next action: start P1 rewrite (переписывание P1) or finish CTA/local trust block design (блок доверия и призыва к действию) after owner confirmation.
