# 07 Content AI SEO

Purpose: content rules, SEO, GEO, troubleshooting content, knowledge strategy, and AI visibility.

This folder covers how the site should be understood by search engines and AI answer engines. The AI chat assistant itself belongs in `08_ai_assistant/`.

Planned base documents:
- `copy_system.md`
- `cta_labels_master.md`
- `problem_article_rules.md` - обязательный короткий стандарт для problem articles (статей о проблемах)
- `problem_article_rules_master_ru.md` - расширенный master-стандарт (главный справочник) для глубокого редактирования problem articles (статей о проблемах)
- `problem_article_content_model.md` - целевая content model (контентная модель) для CMS (системы управления контентом), карточек, модальных окон, полных статей, JSON-LD (структурированных данных) и AI/GEO (оптимизации для AI-ответов)
- `knowledge_base_strategy.md`
- `troubleshooting_content.md`
- `seo_strategy.md`
- `geo_optimization_strategy.md`
- `ai_visibility_strategy.md`

## Progress Log

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
