# 07 Content AI SEO

Purpose: content rules, SEO (поисковая оптимизация), GEO (оптимизация для AI-ответов), troubleshooting content (контент для разбора проблем), knowledge strategy (стратегия базы знаний), and AI visibility (видимость в AI-ответах).

This folder covers how PixelRing Reparatur should be understood by search engines and AI answer engines. The AI chat assistant itself belongs in [../08_ai_assistant/](../08_ai_assistant/); technical implementation belongs in [../09_engineering/](../09_engineering/).

## Context Beacon

Purpose: short domain router (маршрутизатор домена) for Content/AI/SEO startup context. Read this beacon and the startup list below first; do not read the full progress log at startup.

Current active tracks:

- `Probleme & Lösungen` (проблемы и решения): modernization of the problem-content cluster, including weak article rewrites, structured sections, CTA safety, and CMS article handling.
- Service pages (страницы услуг): reusable service-page pattern from `Werbeanlagen-Reparatur` (ремонт рекламных конструкций) and follow-up work for neighboring service pages.
- `LED-Modernisierung` (LED-модернизация): service page strengthening is active; future problem articles remain deferred until explicit owner approval.
- `Beleuchtete Markisen-Volants` (воланы с подсветкой для маркиз): the complete page, calculator and request drawer copy (тексты страницы, калькулятора и выдвижной панели обращения) are localized for DE/EN/RU/TR/PL/AR (немецкого, английского, русского, турецкого, польского и арабского языков). DE/RU copy (немецкий/русский текст) was audited and refined; EN/PL/TR/AR copy (английский/польский/турецкий/арабский текст) was translated and independently re-read for natural customer language. The owner-provided day/night hero (первый экран день/ночь), accessible `Tag/Nacht` control (переключатель день/ночь), compact compatibility block (компактный блок проверки совместимости), calculator Blocks 2A/2B (блоки 2A/2B калькулятора), versioned language-independent request snapshot (версионируемый снимок обращения, не зависящий от языка), `Case` storage (хранение в заявке) and internal CRM rendering (отображение во внутренней системе работы с заявками) remain active. Tariffs remain a temporary typed code configuration (временной типизированной конфигурацией в коде), and CMS tariff management (управление тарифами через систему управления контентом) is not connected. Ten local preview fonts support Latin/Cyrillic text (латиницу/кириллицу); the Arabic interface is complete and RTL-aware (учитывает направление справа налево), but Arabic motif text is routed to a clear manual-review explanation because automatic measurement is not supported. The owner-approved release metadata now allows `index, follow` (индексацию и переход по ссылкам), emits reciprocal `hreflang` (взаимные языковые альтернативы) plus `x-default` (резервную немецкую версию), and includes all six canonical URLs in `sitemap.xml` (карте сайта) with the accurate significant-update date `2026-07-17`.
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
- [service_page_beleuchtete_markisenvolants_product_brief.md](service_page_beleuchtete_markisenvolants_product_brief.md) - product brief and page foundation (продуктовый бриф и основа будущей страницы) for `Beleuchtete Markisen-Volants` (световые ламбрекены маркиз).
- [service_page_beleuchtete_markisenvolants_implementation_plan.md](service_page_beleuchtete_markisenvolants_implementation_plan.md) - approved staged implementation plan (утверждённый поэтапный план внедрения) covering the page, day/night hero (первый экран день/ночь), navigation, homepage service grid (сетка услуг на главной), intake, localization, QA (проверка качества), and deferred calculator (отложенный калькулятор).
- [service_page_beleuchtete_markisenvolants_calculator_plan.md](service_page_beleuchtete_markisenvolants_calculator_plan.md) - owner-approved minimal calculator specification (утверждённая владельцем минимальная спецификация калькулятора) covering font-based text measurement (измерение текста по метрикам шрифта), valance geometry (геометрию волана), logo placement (размещение логотипа), PixelRing-owned tariffs (собственные тарифы PixelRing), CMS management (управление через систему управления контентом), request handoff (передачу в обращение), tests, and staged orchestration (поэтапную оркестрацию).
- [service_page_beleuchtete_markisenvolants_de_canonical_copy_draft.md](service_page_beleuchtete_markisenvolants_de_canonical_copy_draft.md) - owner-review German canonical copy draft (черновик канонического немецкого текста для проверки владельцем) for the first page version, including metadata, CTA (призывы к действию), FAQ (частые вопросы), cards, and form prefill (предзаполнение формы).
- [service_page_beleuchtete_markisenvolants_evidence_matrix.md](service_page_beleuchtete_markisenvolants_evidence_matrix.md) - source, claim, legal-risk, and supplier-validation matrix (матрица источников, публичных утверждений, правовых рисков и проверки поставщика) for the same category.
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

### 2026-07-18 - AI Crawler Visibility And Cacheable Homepage (видимость для AI-роботов и кешируемая главная)

* **Current sprint/block:** Owner-approved AI-readiness remediation (утверждённое владельцем устранение проблем готовности сайта для AI-систем).
* **Done:** Kept `GPTBot` (робот OpenAI для обучения) and the search/answer crawlers of Google, Bing, OpenAI, Anthropic and Perplexity explicitly allowed in `robots.txt` (файле правил для роботов), with the wildcard fallback (общим резервным правилом) still open and only `/api/` (служебные программные адреса) disallowed. Removed the personal portal-session lookup (персональную проверку сессии кабинета) from server rendering of the public homepage. All six localized homepages are now statically generated with five-minute revalidation (статически создаются и обновляются раз в пять минут); the header preserves the localized portal return link by fetching only `{authenticated: boolean}` (логический признак «выполнен вход») after hydration (после загрузки страницы). Focused tests, targeted lint (точечная проверка кода), production build (промышленная сборка), generated `robots.txt` (файл правил для роботов), anonymous/authenticated session checks (проверки без входа и после входа), cache headers (заголовки кеша), six-locale prerendering (предварительная генерация шести языков), Arabic RTL (арабское направление справа налево) and `sitemap.xml` (карта сайта) passed.
* **In progress:** None locally; deployment and an external rescan (повторная внешняя проверка) are intentionally not part of this repository-only step.
* **Next action:** Deploy, confirm `x-vercel-cache: HIT` (ответ из кеша Vercel) for DE/EN/RU/TR/PL/AR homepages, then rerun the Signum AI readiness checker (проверку готовности для AI-систем Signum).
* **Blockers/risks:** An AI-readiness score (оценка готовности для AI-систем) is a vendor heuristic (эвристика поставщика), not a Google or OpenAI ranking factor (фактор ранжирования Google или OpenAI). The read-only CMS audit (аудит CMS без записи) still reports twelve unrelated missing TR/PL/AR problem-article variants (отсутствующие турецкие, польские и арабские версии четырёх статей). The production build succeeded, but the remote database briefly reset several TLS connections (соединения с шифрованием) and static fallbacks (статические резервные тексты) were used for those individual reads.
* **Updated documents/code:** Crawler metadata (правила для роботов), homepage/locale rendering (отрисовка главной и языков), client header/session-state endpoint (клиентская шапка и служебный адрес состояния сессии), portal authentication helper (вспомогательная логика авторизации кабинета), focused tests (точечные тесты), public/portal/domain progress logs (журналы публичного сайта, кабинета и домена) and root `PROGRESS.md` (краткий глобальный журнал).

### 2026-07-17 - Illuminated-Valance Google Indexing Release (выпуск страницы воланов для индексации Google)

* **Current sprint/block:** Owner-approved indexability, `sitemap.xml` and `hreflang` release (утверждённый выпуск индексации, карты сайта и языковых альтернатив).
* **Done:** Enabled `index, follow` (индексацию и переход по ссылкам) for all six locale routes, retained self-canonical URLs (канонические URL на самих языковых версиях), added reciprocal DE/EN/RU/TR/PL/AR `hreflang` plus `x-default` (взаимные языковые альтернативы и резервную немецкую версию), and added all six canonical URLs to `sitemap.xml` (карту сайта). The static page uses `2026-07-17` as its verified `<lastmod>` (дата последнего существенного обновления); other static pages do not receive invented dates, and CMS articles retain database `updatedAt` values (время обновления из базы данных). Google-ignored `changefreq` and `priority` fields (частота изменений и приоритет) were removed from the generated sitemap.
* **In progress:** None for the local release package; production build, generated XML, and six-language metadata verification (проверка промышленной сборки, XML и метаданных шести языков) passed.
* **Next action:** Deploy, resubmit the sitemap in Google Search Console (панели Google для владельцев сайта), and request indexing for the German canonical URL (немецкого канонического URL).
* **Blockers/risks:** Sitemap submission is a discovery hint (сигнал для обнаружения), not an indexing guarantee. Arabic motif auto-measurement (автоматическое измерение арабской надписи) remains on the documented manual-review path and is unrelated to crawlability (доступности для поискового робота).
* **Updated documents:** Application metadata and sitemap source (метаданные приложения и исходник карты сайта), implementation plan (план внедрения), this README (этот файл-ориентир), domain progress log (доменный журнал) and `PROGRESS.md` (краткий глобальный журнал).

### 2026-07-17 - Illuminated-Valance Six-Language Translation (перевод страницы воланов с подсветкой на шесть языков)

* **Current sprint/block:** Owner-approved full-page translation and copy audit (утверждённый владельцем перевод всей страницы и аудит текстов).
* **Done:** Added complete EN/PL/TR/AR copy (английский/польский/турецкий/арабский текст), audited and refined DE/RU copy (немецкий/русский текст), localized calculator/drawer labels (подписи калькулятора/выдвижной панели), metadata (метаданные), navigation, homepage and `/leistungen` service cards (карточки на главной и странице услуг), issue labels (типы обращения), and locale-aware number/EUR formatting (форматирование чисел/евро по языку). Removed literal or template-like wording, unverified secure-transfer claims (неподтверждённые обещания безопасной передачи) and unconditional installation promises (безусловные обещания монтажа). Six-language desktop QA (проверка на компьютере), PL/TR/AR mobile QA at 390 px (мобильная проверка польской/турецкой/арабской версий), AR RTL QA (проверка арабского направления справа налево), 44 focused Node tests (44 точечных теста Node), targeted lint (точечная проверка кода), production build and format check pass.
* **In progress:** Owner visual/copy review (визуальная и текстовая проверка владельцем) of the six localized routes (шести локализованных страниц).
* **Next action:** After approval, separately enable indexability (индексацию), `sitemap.xml` (карту сайта) and `hreflang` (языковые альтернативы).
* **Blockers/risks:** Arabic UI copy (арабский текст интерфейса) is complete, but the current local font/measurement contract (контракт локальных шрифтов и измерения) accepts only Latin/Cyrillic motif text (текст надписи на латинице/кириллице); the Arabic validation message explains the manual-review path. The route remains `noindex` (запрещённым для индексации).
* **Updated documents:** implementation plan (план внедрения), calculator plan (план калькулятора), this README (этот файл-ориентир), domain progress log (доменный журнал) and `PROGRESS.md` (краткий глобальный журнал).

### 2026-07-16 - Illuminated-Valance Calculator Plan (план калькулятора волана с подсветкой)

* **Current sprint/block:** Owner-approved minimal calculation and orchestration specification (утверждённая владельцем минимальная спецификация расчёта и оркестрации).
* **Done:** Created a dedicated [calculator plan](service_page_beleuchtete_markisenvolants_calculator_plan.md) (план калькулятора) that removes supplier prices, procurement matrices, font-complexity pricing, mounting, electrical work, and permit logic from the automatic estimate. The approved customer inputs are valance length/height, full text, one curated font, letter height, logo placement, and item quantity. The system measures actual text length from the selected font file, validates fit, renders a schematic preview (схематичное превью), calculates from PixelRing-owned rates, and hands the snapshot to the existing protected request form.
* **In progress:** Preparation for Block 1 (подготовка блока 1): typed calculation contract (типизированный расчётный контракт) and boundary tests (граничные тесты) without a visible page change.
* **Next action:** Obtain separate owner confirmation for Block 1 and owner-provided rates, layout margins, tax/rounding rule, and initial font files; test-only values may be used internally but must not appear as public prices.
* **Blockers/risks:** Real rates and exact licensed font files are not yet provided. Do not expose placeholder prices or rely on device system fonts.
* **Updated documents:** calculator plan (план калькулятора), page implementation plan (план внедрения страницы), this README (этот файл-ориентир), domain progress log (доменный журнал), and `PROGRESS.md` (краткий глобальный журнал).

### 2026-07-14 - Request-Process Section Removed (удалён блок процесса запроса)

* **Current sprint/block:** Owner-directed removal of `Как проходит запрос` / `So läuft die Anfrage ab` (блока процесса запроса) from the localized illuminated-valance page (локализованной страницы воланов с подсветкой).
* **Done:** Removed the entire section, not only its rendering: route markup (разметку маршрута), typed copy schema (типизированную структуру текстов), German/Russian copy (немецкие и русские тексты), heading, introduction, four numbered steps, and three order-option cards. The compact compatibility block (компактный блок проверки совместимости) now connects directly to the individual cost assessment (индивидуальной оценке стоимости). Source search (поиск по исходному коду), RU and DE DOM checks (проверки структуры русской и немецкой страниц), mobile rendering (мобильный рендер), targeted ESLint (точечная проверка кода), `git diff --check` (проверка формата изменений), and horizontal-overflow checks (проверки горизонтального переполнения) passed.
* **In progress:** Owner visual review (визуальная проверка владельцем) of the shortened RU page flow (сокращённой последовательности русской страницы).
* **Next action:** Continue only with the next separately approved page change.
* **Blockers/risks:** The routes remain `noindex` (запрещёнными для индексации), outside `sitemap.xml` (карты сайта) and `hreflang` (языковых альтернатив). Essential request guidance must remain available through the compact compatibility block and request form (форму обращения).
* **Updated documents:** this README (этот файл-ориентир), domain progress log (доменный журнал), implementation plan (план внедрения), `PROGRESS.md` (краткий глобальный журнал), and route page (страница маршрута).

### 2026-07-14 - Compact Compatibility Block (компактный блок проверки совместимости)

* **Current sprint/block:** Owner-approved reduction of `Passt das zu meiner Markise?` (подойдёт ли это к моей маркизе?) in RU and DE (русской и немецкой версиях).
* **Done:** Replaced three numbered step cards and two repeated lower cards with a shorter heading, one direct photo instruction, two three-item cards (`Что прислать` and `Что пока не нужно`), one CTA (призыв к действию), and one short note for incomplete photo sets. The next process section (следующий блок процесса) is unchanged. RU and DE desktop/mobile rendering (русский и немецкий рендер на компьютере и мобильном устройстве), targeted ESLint (точечная проверка кода), `git diff --check` (проверка формата изменений), and horizontal overflow checks (проверки горизонтального переполнения) passed.
* **In progress:** Owner visual/copy review (визуальная и текстовая проверка владельцем) of the compact block.
* **Next action:** Continue only with the next separately approved page change; after complete RU approval, prepare EN/TR/PL/AR translations (переводы на английский, турецкий, польский и арабский).
* **Blockers/risks:** The routes remain `noindex` (запрещёнными для индексации), outside `sitemap.xml` (карты сайта) and `hreflang` (языковых альтернатив). Do not turn the compatibility wording into a universal compatibility promise (обещание универсальной совместимости).
* **Updated documents:** this README (этот файл-ориентир), domain progress log (доменный журнал), implementation plan (план внедрения), `PROGRESS.md` (краткий глобальный журнал), localized copy (локализованные тексты), and route page (страница маршрута).

### 2026-07-14 - Russian `Beleuchtete Markisen-Volants` Localization (русская локализация страницы воланов для маркиз с подсветкой)

* **Current sprint/block:** Owner-approved RU page-copy implementation (внедрение утверждённого русского текста страницы).
* **Done:** `/ru/leistungen/beleuchtete-markisenvolants` (русская страница воланов для маркиз с подсветкой) now renders the approved natural Russian adaptation across the full page, localized metadata (метаданные), image alt text (альтернативные описания изображений), day/night control (переключатель день/ночь), exchange animation and slider labels (подписи анимации и слайдера замены), and request prefills (предзаполнения обращения). Shared RU navigation/form labels (русские подписи навигации и формы) now consistently use the normative forms `волан/воланы/волана` (нормативные русские формы); the previous public terms `волант` and `ламбрекен` are no longer used for this product in the implemented Russian interface. DE (немецкая версия) is unchanged; targeted ESLint (точечная проверка кода), JSON validation (проверка JSON), metadata/DOM checks (проверки метаданных и структуры страницы), and 390/1440 px responsive rendering (адаптивный рендер) passed without page-level horizontal overflow (горизонтального переполнения страницы).
* **In progress:** Owner local visual/copy review (локальная визуальная и текстовая проверка владельцем) of the RU desktop/mobile page (русской страницы на компьютере и мобильном устройстве).
* **Next action:** After RU approval (утверждения русской версии), translate EN/TR/PL/AR in separate language passes (отдельными языковыми проходами), replace temporary visualizations (временные визуализации) with approved real project media, and then run the separate indexability/release pass (проход индексации и публикации).
* **Blockers/risks:** All route variants remain `noindex` (запрещёнными для индексации), outside `sitemap.xml` (карты сайта) and `hreflang` (языковых альтернатив). EN/TR/PL/AR still use the temporary DE fallback (немецкий текст-заполнитель). Repository-wide TypeScript (общая проверка TypeScript) is still blocked only by pre-existing unrelated errors in `referenzen` (примеры работ) and `status` (статус заявки).
* **Updated documents:** this README (этот файл-ориентир), domain progress log (доменный журнал), implementation plan (план внедрения), and `PROGRESS.md` (краткий глобальный журнал); changed application files are the localized route copy (тексты локализованного маршрута), route page (страница маршрута), hero/exchange components (компоненты первого экрана и замены), and RU messages (русские строки интерфейса).

### 2026-07-13 - `Beleuchtete Markisen-Volants` Visual-Impact Section (визуальный блок результата световых ламбрекенов маркиз)

* **Current sprint/block:** Owner-led upper-page sequence and product-value refinement (доработка порядка верхних блоков и ценности продукта с владельцем).
* **Done:** Moved the reworked `Ihre sichtbare Markenfläche` (видимая бренд-зона) section directly after the hero (первого экрана), placed `Volantwechsel` (замена валана) third, and replaced the five-card bento grid (разновесная сетка) with three image-led cards (три карточки с главным акцентом на фотографии). Each card is explicitly marked `Visualisierung` (визуализация), keeps its title visible, reveals supporting copy on desktop hover/focus (при наведении/фокусе на компьютере), and shows the full copy by default on mobile (на мобильном устройстве). Three generated WebP placeholders (три временных сгенерированных изображения WebP) are stored locally for review and are not presented as completed PixelRing projects (выполненные проекты PixelRing).
* **In progress:** Owner visual review (визуальная проверка владельцем) of the DE desktop/mobile block (немецкого блока на компьютере и мобильном устройстве) and final copy hierarchy (иерархии текста).
* **Next action:** Replace the temporary visualizations (временные визуализации) with approved real project photos before release; keep the current `noindex` (запрет индексации) and localization boundary (границу локализации) until the separate release pass (проход публикации).
* **Blockers/risks:** The generated media are concept placeholders (концептуальные временные материалы), not customer references (клиентские кейсы). Targeted ESLint (точечная проверка кода), desktop/mobile browser rendering (рендер на компьютере и мобильном устройстве), image loading (загрузка изображений), focus disclosure (раскрытие по фокусу), horizontal overflow (горизонтальное переполнение), console errors (ошибки консоли), and error overlay (окно ошибки) passed; the repository-wide TypeScript check (общая проверка TypeScript) remains blocked by pre-existing errors in unrelated `referenzen` (примеры работ) and `status` (статус заявки) routes.
* **Updated documents:** this README (этот файл-ориентир), domain progress log (доменный журнал), `PROGRESS.md` (краткий глобальный журнал), the service-page route (маршрут страницы услуги), and three temporary WebP assets (три временных изображения WebP).

### 2026-07-12 - `Beleuchtete Markisen-Volants` Block-by-Block DE Review (пошаговая DE-проверка блоков страницы)

* **Current sprint/block:** Owner-led refinement (доработка с владельцем) of the isolated DE review route (изолированный немецкий маршрут для проверки).
* **Done:** The owner-provided day/night hero (первый экран день/ночь) with the accessible `Tag/Nacht` (день/ночь) control remains active. The hero height, headline scale, text width, and text placement now match neighboring service pages; its subline was shortened. The first explanatory block now states that only the front valance is being considered. The compatibility block now follows a customer-friendly sequence: visible photos first, PixelRing technical review second, and measurements/electrical details only when they become necessary.
* **In progress:** Owner DE desktop/mobile review (проверка немецкой версии на компьютере и мобильном устройстве) continues one page block at a time. The latest copy/layout refinements passed code checks, but are not yet a completed visual approval.
* **Next action:** Review and decide on the next page block before changing it; defer the integration/localization pass (проход интеграции и локализаций) until the owner accepts the page content.
* **Blockers/risks:** The route remains DE-only (только немецкий) and `noindex` (запрещён для индексации), outside `sitemap.xml` (карта сайта), `hreflang` (языковые альтернативы), public navigation, and cards. Do not add unsupported technical, price, warranty, or universal-compatibility claims.
* **Updated documents:** implementation plan (план внедрения), this README, domain progress log (доменный журнал), and `PROGRESS.md` (краткий журнал состояния проекта).

### 2026-07-11 - `Beleuchtete Markisen-Volants` DE Canonical Copy (канонический немецкий текст световых ламбрекенов маркиз)

* **Current sprint/block:** Product-brief reconciliation and DE copy prototype (синхронизация продуктового брифа и DE-текстовый прототип).
* **Done:** Reconciled the older supplier/launch prerequisites with the approved first public version; prepared a separate German canonical copy draft (отдельный черновик канонического немецкого текста) covering all page blocks, metadata, CTA (призывы к действию), FAQ (частые вопросы), navigation, service cards, homepage card, and form prefill (предзаполнение формы).
* **In progress:** The owner approved the German canonical copy (владелец утвердил канонический немецкий текст); a front-facing day/night hero pair (фронтальная пара первого экрана день/ночь) with official PixelRing artwork has been prepared for visual review, while application code, form changes, and the calculator remain unimplemented.
* **Next action:** Owner visually reviews the hero pair (пару первого экрана); after approval, begin the dedicated DE route implementation pass (проход реализации отдельного DE-маршрута).
* **Blockers/risks:** Numeric technical claims, product-specific promises, price, warranty, and final electrical-execution model remain blocked pending internal validation.
* **Updated documents:** product brief (продуктовый бриф), implementation plan (план внедрения), DE canonical copy draft (черновик канонического немецкого текста), this README, domain progress log (доменный журнал), and `PROGRESS.md` (краткий журнал состояния проекта).

### 2026-07-11 - `Beleuchtete Markisen-Volants` Implementation Plan (план внедрения световых ламбрекенов маркиз)

* **Current sprint/block:** Owner-decision closure and staged implementation planning (закрытие решений владельца и поэтапное планирование внедрения).
* **Done:** Approved the product name and route, PixelRing-owned offer framing, Germany-wide product delivery, Berlin/Brandenburg installation with other regions on request, photo-first intake without blocking missing fields, full-width day/night hero (первый экран день/ночь), seventh navigation/service card, eight-card homepage service grid, DE-first localization sequence, deferred calculator block, FAQ (частые вопросы), and seven implementation/verification passes.
* **In progress:** No DE public copy, visuals, application code, or calculator has been implemented.
* **Next action:** Reconcile the older product brief with the newer owner decisions, then prepare the complete German canonical page copy (канонический немецкий текст страницы) for approval before code.
* **Blockers/risks:** Owner reference links are still needed before visual generation; public numeric technical claims remain blocked until internally verified.
* **Updated documents:** implementation plan (план внедрения), this README, the domain progress log (доменный журнал), and `PROGRESS.md` (краткий журнал состояния проекта).

### 2026-07-11 - `Beleuchtete Markisen-Volants` Product Brief (продуктовый бриф световых ламбрекенов маркиз)

* **Current sprint/block:** Product definition and evidence base (определение продукта и доказательная база) for a future dedicated service page (будущая отдельная страница услуги).
* **Done:**
  - Defined `Beleuchtete Markisen-Volants` (световые ламбрекены маркиз) as a separate product-service category (отдельную товарно-сервисную категорию), not a subsection of `LED-Modernisierung` (LED-модернизации).
  - Limited the first product version to `Nachrüstung einer bestehenden Markise` (модернизации существующей маркизы); full new awnings, standalone rails, and dynamic media variants (новые маркизы целиком, отдельные направляющие и динамические медиаварианты) remain deferred.
  - Documented the offer modules, product variants, compatibility gate (проверку совместимости), request inputs, price factors, page structure, SEO/GEO terminology (поисковую и AI-терминологию), visual proof rules, site integration map (карту интеграции в сайт), and staged rollout (поэтапный запуск).
  - Created a primary-source evidence matrix (матрицу первичных источников) covering Germany, France, EU/German product compliance (соответствие продукции требованиям ЕС и Германии), electrical work, permits, supplier conflicts, safe claims (безопасные публичные утверждения), and a supplier request checklist (контрольный список запроса поставщику).
* **In progress:** No supplier, exact system, public price, warranty, or implementation has been approved.
* **Next action:** Send one comparable technical request to at least two suppliers, verify the exact system documents, and then approve the German canonical product copy (канонический немецкий текст продукта).
* **Blockers/risks:** Public technical numbers, universal compatibility, fixed prices, warranties, and permit claims (утверждения о разрешениях) remain blocked until a system, operational roles, and evidence are confirmed.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_product_brief.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_evidence_matrix.md`

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
