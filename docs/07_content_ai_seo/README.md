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
- `service_page_pattern_werbeanlagen_reparatur.md` - reusable service page pattern (повторяемый шаблон страницы услуги) based on `/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций)
- `service_page_neighbor_handoff.md` - next-agent handoff (передача следующему агенту) for applying the pattern to neighboring service pages (соседние страницы услуг) without copying the repair calculator (калькулятор ремонта)
- `service_page_led_modernisierung_plan.md` - active implementation plan (активный план внедрения) for strengthening `/leistungen/lichtwerbung-led-modernisierung` (страница LED-модернизации), with two future `Probleme & Lösungen` (Проблемы и решения) article briefs
- `knowledge_base_strategy.md`
- `troubleshooting_content.md`
- `seo_strategy.md`
- `geo_optimization_strategy.md`
- `ai_visibility_strategy.md`

## Progress Log

* **Date:** 2026-06-05
* **Current sprint/block:** Leuchtstoffröhren vs LED-Retrofit Problem Article Draft
* **Done:**
  - Started the first deferred `LED-Modernisierung` (LED-модернизация) problem article track after owner approval.
  - Created a RU review draft (черновик на русском для проверки владельцем) for `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` (заменить люминесцентные трубки в рекламной установке или перейти на LED).
  - Included the required three forms: small card (маленькая карточка), modal (модальное окно), and full article (полная статья).
  - Added safety-bounded `selfRepairTips` (советы по самостоятельному ремонту), SEO/CMS draft fields (черновые поля для SEO/CMS), related slugs (связанные адреса статей), and an internal AI note (служебная AI-заметка) with source notes (заметки по источникам).
  - Kept the work as markdown only; no CMS/database (CMS/база данных), seed files (скрипты загрузки), sitemap entries (записи карты сайта), public routes (публичные маршруты), or localization changes were made.
* **In progress:** Owner review of the RU markdown draft.
* **Next action:** After owner approval, prepare the German canonical draft (немецкий канонический черновик) and then decide whether to proceed to localization and CMS/database synchronization.
* **Blockers/risks:** Source-backed EU/RoHS/Ecodesign (правила ЕС/RoHS/Ecodesign) wording and electrical safety wording must remain cautious and must not become legal advice or DIY electrical instructions.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/problem_articles/README.md`
  - `docs/07_content_ai_seo/problem_articles/люминесцентные трубки или led – 07/problem_article_leuchtstoffroehren_werbeanlage_ersetzen_led_umruesten_ru.md`

* **Date:** 2026-06-05
* **Current sprint/block:** LED Service Page Visual Alignment (визуальное выравнивание страницы LED-услуги)
* **Done:**
  - Reworked the new decision block (блок выбора) on `/[locale]/leistungen/lichtwerbung-led-modernisierung` (страница LED-модернизации) from a dark standalone section into the warm approved service-page card pattern (утвержденный теплый карточный паттерн) used by `/[locale]/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций).
  - Aligned optional `Passende Problemseiten` (подходящие страницы проблем) and request checklist (чеклист заявки) sections with the repair-page visual language: `#FFFDF9` / `#F7F1E8` surfaces, terracotta labels (терракотовые метки), compact cards, and restrained section rhythm.
  - Preserved the LED page content strategy (стратегия контента): broader `Modernisierung von Lichtwerbung & Außenwerbung` (модернизация световой и наружной рекламы), no visible `Berlin & Brandenburg` (Берлин и Бранденбург), no calculator copy (копирование калькулятора), no CMS records (записи CMS), no seed files (seed-файлы), and no new problem articles (статьи "Проблемы и решения").
  - Verified targeted lint (точечная lint-проверка), production build (production-сборка), local rendered HTML (локальный HTML), warm decision surface presence (наличие теплого блока выбора), old dark surface absence (отсутствие старого темного блока), one H1 (один главный заголовок), no visible `Berlin & Brandenburg` (Берлин и Бранденбург), and mobile width at 390px with no horizontal overflow (без горизонтального переполнения).
* **In progress:** Owner visual review of `/de/leistungen/lichtwerbung-led-modernisierung` (немецкая LED-страница) against the approved `/de/leistungen/werbeanlagen-reparatur` (немецкая страница ремонта) standard.
* **Next action:** If visual rhythm is accepted, continue with a narrower service-scope entity block (блок сущностей услуги) only after approval.
* **Blockers/risks:** None for this alignment pass.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-06-05
* **Current sprint/block:** LED-Modernisierung Decision Block (блок выбора для LED-модернизации)
* **Done:**
  - Added a service-specific decision block (блок выбора) to `/[locale]/leistungen/lichtwerbung-led-modernisierung` (страница услуги LED-модернизации).
  - The block explains when the next step is `Reparatur` (ремонт), `Teilmodernisierung` (частичная модернизация), `LED-Umrüstung` (переход на LED), or `Ersatzlösung` (замена), without creating a calculator (калькулятор), promising fixed savings (фиксированная экономия), promising payback (окупаемость), or giving dangerous DIY guidance (опасные инструкции "сделай сам").
  - Localized the block for DE, EN, RU, TR, PL, and AR (немецкий, английский, русский, турецкий, польский и арабский).
  - Kept the block opt-in inside the shared dynamic service template (общий динамический шаблон страницы услуги) so neighboring service pages (соседние страницы услуг) remain unchanged.
  - Verified targeted lint (точечная lint-проверка), production build (production-сборка), local route rendering for all six locales (локальный рендер шести локалей), one H1 (один главный заголовок), no visible `Berlin & Brandenburg` (Берлин и Бранденбург) on the LED page, and mobile width check at 390px.
* **In progress:** Owner visual review of the revised decision block (визуальная проверка блока выбора) on `/de/leistungen/lichtwerbung-led-modernisierung`.
* **Next action:** If the decision block is approved visually, consider a narrower follow-up for service scope entities (сущности объема услуги), for example `Leuchtkästen` (световые короба), `Profilbuchstaben` (объемные буквы), `Neon` (неон), `LED-Module` (LED-модули), `Stelen/Pylone` (стелы/пилоны), and `Fassadenanlagen` (фасадные конструкции).
* **Blockers/risks:** None for this block. Future problem articles (будущие статьи "Проблемы и решения") remain deferred until explicit owner approval.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-06-05
* **Current sprint/block:** LED-Modernisierung Service Page Implementation (внедрение страницы услуги LED-модернизации)
* **Done:**
  - Modernized `/[locale]/leistungen/lichtwerbung-led-modernisierung` (страница услуги LED-модернизации) inside the existing dynamic service template, without creating CMS records (записи CMS), seed files (seed-файлы), new public problem routes (новые публичные маршруты проблем), or problem articles (статьи "Проблемы и решения").
  - Repositioned the page from narrow `LED-Modernisierung` (LED-модернизация) toward broader `Modernisierung von Lichtwerbung & Außenwerbung` (модернизация световой и наружной рекламы).
  - Removed visible `Berlin & Brandenburg` (Берлин и Бранденбург) regional positioning from the LED page copy, metadata (метаданные), and service `areaServed` (регион обслуживания) schema for this page.
  - Added service-specific task cards (карточки задач), `Passende Problemseiten` (подходящие страницы проблем), request checklist (чеклист заявки), expanded FAQ (частые вопросы), service-specific `NEXT STEP` (следующий шаг), and LED-specific `hasOfferCatalog` (каталог подуслуг).
  - Verified targeted lint (точечная lint-проверка), production build (production-сборка), local route rendering (локальный рендер маршрутов), linked page `200` statuses (успешные статусы ссылок), JSON-LD `hasOfferCatalog` (структурированные данные каталога подуслуг), one H1 (один главный заголовок), no `Berlin & Brandenburg` (Берлин и Бранденбург) rendered on the LED page, and mobile width check at 390px.
* **In progress:** Owner visual review of `/de/leistungen/lichtwerbung-led-modernisierung` (немецкая страница LED-модернизации) on desktop and mobile.
* **Next action:** Review the revised LED page visually; keep deferred problem articles (отложенные статьи "Проблемы и решения") inactive until explicit owner approval.
* **Blockers/risks:** In-app Browser screenshot tool (инструмент скриншотов встроенного браузера) was not exposed in this tool state; verification used local Next server (локальный сервер Next), rendered HTML (отрендеренный HTML), JSON-LD extraction (извлечение структурированных данных), route checks (проверки маршрутов), and headless Chrome CDP (проверка через Chrome DevTools Protocol) for mobile overflow.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-06-02
* **Current sprint/block:** LED-Modernisierung Service Page Planning
* **Done:**
  - Created `service_page_led_modernisierung_plan.md` (план модернизации страницы LED-модернизации) for `/[locale]/leistungen/lichtwerbung-led-modernisierung` (страница услуги LED-модернизации).
  - Fixed the first implementation sequence: modernize the service page before drafting new problem articles (статьи "Проблемы и решения").
  - Defined the page positioning around checking existing illuminated signage (существующая световая реклама) before choosing `Reparatur` (ремонт), `Teilmodernisierung` (частичная модернизация), `LED-Umrüstung` (переход на LED), or `Ersatzlösung` (замена).
  - Recorded two future real-problem article briefs, not SEO-only content, in `problem_articles/входящие новые статьи/led_modernisierung_future_problem_articles.md`: `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` (заменить люминесцентные трубки в рекламной установке или перейти на LED) and `Neonreklame reparieren oder auf LED umrüsten?` (ремонтировать неоновую рекламу или перейти на LED).
  - Added safety and claim boundaries (границы безопасных формулировок) so future work does not promise fixed savings, fixed payback, dangerous DIY, or unconfirmed neon production scope.
* **In progress:** Owner review of the LED page modernization plan before code changes.
* **Next action:** Implement the plan on `/[locale]/leistungen/lichtwerbung-led-modernisierung` first; defer both problem articles until the owner explicitly starts the article track.
* **Blockers/risks:** The future articles require markdown drafts (черновики Markdown) and owner review before CMS/database seeding, per `problem_article_rules.md`.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/service_page_led_modernisierung_plan.md`
  - `docs/07_content_ai_seo/problem_articles/README.md`
  - `docs/07_content_ai_seo/problem_articles/входящие новые статьи/led_modernisierung_future_problem_articles.md`

* **Date:** 2026-06-02
* **Current sprint/block:** Service Page Pattern Handoff
* **Done:**
  - Created `service_page_pattern_werbeanlagen_reparatur.md` (повторяемый шаблон страницы услуги ремонта рекламных конструкций) to preserve the structure of `/[locale]/leistungen/werbeanlagen-reparatur` (страница услуги ремонта рекламных конструкций).
  - Created `service_page_neighbor_handoff.md` (передача следующему агенту по соседним страницам услуг) with adaptation guidance for `LED-Modernisierung` (LED-модернизация), `Audit & Diagnose` (аудит и диагностика), `Montage & Demontage` (монтаж и демонтаж), and `Druck & Branding` (печать и брендинг).
  - Explicitly documented that the repair-cost calculator (калькулятор стоимости ремонта) is not part of the universal service page pattern (универсальный шаблон страницы услуги) and must not be copied blindly.
  - Added the two documents to this folder README (README папки) so future agents know where to start.
* **In progress:** None for the documentation handoff (передача контекста через документацию).
* **Next action:** Next agent can use these documents before strengthening neighboring service pages (соседние страницы услуг).
* **Blockers/risks:** None.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/service_page_pattern_werbeanlagen_reparatur.md`
  - `docs/07_content_ai_seo/service_page_neighbor_handoff.md`

* **Date:** 2026-06-02
* **Current sprint/block:** Repair Page Internal Linking and Next Step
* **Done:**
  - Strengthened `/[locale]/leistungen/werbeanlagen-reparatur` (страница ремонта рекламных конструкций) without changing the hero (первый экран), symptom workflow (интерактивный выбор симптома), or repair-cost calculator (калькулятор стоимости ремонта).
  - Added `Passende Problemseiten` (подходящие страницы проблем) after `Typische Defekte & Symptome` (типовые дефекты и симптомы), linking to `Werbeanlage flackert` (вывеска мерцает), `Buchstabe leuchtet nicht` (буква не светится), `Folie löst sich` (пленка отклеивается), and `Werbeanlage schaltet nach Regen ab` (вывеска отключается после дождя).
  - Replaced the generic final CTA (общий финальный призыв к действию) on this page with a repair-specific `NEXT STEP` (следующий шаг) decision block: request repair scope (уточнить объем ремонта) or move to related services (соседние услуги).
  - Linked the final block to `LED-Modernisierung` (LED-модернизация), `Audit & Diagnose` (аудит и диагностика), `Montage & Demontage` (монтаж и демонтаж), and `Druck & Branding` (печать и брендинг).
  - Shortened localized meta descriptions (SEO-описания) and added `hasOfferCatalog` (каталог подуслуг) to the `Service` JSON-LD (структурированные данные Service).
  - Verified targeted lint (точечная lint-проверка), local HTML (локальный HTML), meta length (длина SEO-описания), JSON-LD (структурированные данные), and `200` status (успешный ответ страницы) for all eight linked DE URLs.
* **In progress:** Owner visual review of the new problem-link block and final next-step block on `/de/leistungen/werbeanlagen-reparatur`.
* **Next action:** If the owner approves the pattern, consider applying the same pair of blocks to other high-priority service pages: `LED-Modernisierung` (LED-модернизация), `Audit & Diagnose` (аудит и диагностика), and `Montage & Demontage` (монтаж и демонтаж).
* **Blockers/risks:** Browser screenshot verification (проверка скриншотом в браузере) was not available in this tool state; verification used rendered HTML (отрендеренный HTML), lint (проверка lint), JSON-LD extraction (извлечение структурированных данных), and route status checks (проверка статуса URL).
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-06-02
* **Current sprint/block:** Home Services Navigator Internal Linking
* **Done:**
  - Added a compact public home `Leistungen` (услуги) navigator after the trust block.
  - Added six localized service cards (локализованные карточки услуг) for `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), `LED-Modernisierung` (LED-модернизация), `Audit & Diagnose` (аудит и диагностика), `Montage & Demontage` (монтаж и демонтаж), `Druck & Branding` (печать и брендинг), and `Wartung & Standort-Service` (обслуживание локаций).
  - Connected the cards to existing service URLs (страницы услуг), including `/leistungen/werbeanlagen-reparatur` (ремонт рекламных конструкций), `/leistungen/lichtwerbung-led-modernisierung` (LED-модернизация), `/leistungen/werbeanlagen-audit-diagnose` (аудит и диагностика), `/leistungen/montage-demontage-werbeanlagen` (монтаж и демонтаж), `/leistungen/druckprodukte-branding-werbematerialien` (печатная продукция и брендинг), and `/leistungen` (обзор услуг).
  - Kept the block visually light: no second large carousel (карусель), no long promotional cards (промо-карточки), and no duplicate problem-case content (дублирование блока типовых проблем).
  - Verified targeted lint (точечная lint-проверка), local DOM (структура страницы в браузере), mobile width metrics (мобильные метрики ширины), and HTTP `200` (успешный ответ страницы) for all linked DE service URLs.
* **In progress:** Owner visual review of the new `/de` home `Leistungen` (услуги) navigator before any CMS editability (редактирование через CMS) or visual-asset expansion.
* **Next action:** Review the section on `/de` desktop and mobile, then decide whether it should stay as a code-backed internal-linking block (кодовый блок внутренней перелинковки) or become CMS-managed (управляемый через CMS).
* **Blockers/risks:** None. The screenshot capture API (API снятия скриншота) timed out during desktop capture, but DOM (структура страницы), mobile overflow metrics (метрики мобильного переполнения), lint (проверка lint), and route status checks (проверка статуса URL) passed.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

* **Date:** 2026-06-02
* **Current sprint/block:** Home Service Cases Internal Linking
* **Done:**
  - Updated the public home `Typische Servicefälle` (типовые сервисные случаи) carousel into a lighter internal-linking surface.
  - Added localized linked issue/service pills (ссылки-хэштеги на проблемы и услуги) above each service-case quote, including DE links to `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), `LED flackert` (мерцает LED), `Folie löst sich` (отклеивается пленка), `Buchstabe defekt` (неисправная буква), `Regenausfall` (отказ после дождя), and `Montage` (монтаж).
  - Made the case cards more compact while preserving the existing carousel and CMS-driven copy.
  - Verified targeted lint (точечная lint-проверка) for the edited component and checked desktop/mobile rendering locally.
* **In progress:** Owner visual review of the revised `/de` home carousel before deciding whether to add a heavier sticky-link navigation pattern.
* **Next action:** Review the updated `Typische Servicefälle` block on `/de` desktop and mobile, then decide whether the lighter pill-link model is enough for the first SEO/internal-linking pass.
* **Blockers/risks:** None. Sticky side navigation remains intentionally deferred because it adds interaction complexity and responsive/RTL risk.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`

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
