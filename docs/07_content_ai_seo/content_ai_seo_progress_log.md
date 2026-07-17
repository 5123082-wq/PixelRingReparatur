# Content AI SEO Progress Log

Purpose: detailed domain history for Content/AI/SEO work. Do not read this full progress log at startup. Read only when continuing this track, answering a history question, or following a specific date/domain pointer.

## Progress Log

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы с подсветкой для маркиз) — owner-approved Google indexing release (утверждённый выпуск для индексации Google).
* **Done:**
  - Enabled `index, follow` (индексацию и переход по ссылкам) on all DE/EN/RU/TR/PL/AR routes while preserving a self-canonical URL (канонический URL на саму языковую версию) for every locale.
  - Added the identical reciprocal `hreflang` set (взаимный набор языковых альтернатив) to each route: DE, EN, RU, TR, PL, AR, and `x-default` (резервная немецкая версия).
  - Added all six canonical URLs to `sitemap.xml` (карту сайта). Each new entry uses `<lastmod>2026-07-17</lastmod>` (дату последнего существенного обновления), matching the completed localization and release-day content changes rather than the sitemap generation time.
  - Kept unreliable static-page dates omitted and preserved CMS article `updatedAt` timestamps (время обновления статей из базы данных). Removed `changefreq` and `priority` (частоту изменений и приоритет), which Google does not use.
* **In progress:** None for the local release package. Production build, generated XML, and rendered metadata checks (проверки промышленной сборки, XML и отображаемых метаданных) passed for all six locales.
* **Next action:** Deploy the verified result, resubmit `https://www.pixel-ring.com/sitemap.xml` (карту сайта) in Google Search Console (панели Google для владельцев сайта), and request indexing for `/de/leistungen/beleuchtete-markisenvolants` (немецкой страницы воланов для маркиз с подсветкой).
* **Blockers/risks:** Google treats sitemap submission as a hint (сигнал), not a guarantee of indexing. Automatic Arabic motif measurement (автоматическое измерение арабской надписи) remains a separate documented manual-review limitation and does not block page crawling or indexing.
* **Updated documents and code:** Page metadata and sitemap sources (метаданные страницы и исходники карты сайта), implementation plan (план внедрения), domain README (доменный файл-ориентир), this progress log (доменный журнал) and `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы с подсветкой для маркиз) — owner-approved six-language translation and DE/RU copy audit (утверждённый владельцем перевод на шесть языков и аудит немецкого/русского текста).
* **Done:**
  - Implemented complete DE/EN/RU/TR/PL/AR page copy (тексты страницы на немецком, английском, русском, турецком, польском и арабском), localized metadata (локализованные метаданные), calculator/drawer UI (интерфейс калькулятора/выдвижной панели), navigation labels (подписи навигации), homepage and `/leistungen` cards (карточки на главной и странице услуг), and request issue labels (типы обращения).
  - Re-audited DE/RU (немецкий/русский) and independently re-read EN/PL/TR/AR (английский/польский/турецкий/арабский) for natural customer language. Removed literal, repetitive or template-like phrasing, unverified secure-transfer claims (неподтверждённые обещания безопасной передачи), and unconditional installation promises (безусловные обещания монтажа).
  - Preserved one preliminary net price (одну предварительную сумму без НДС), B2B/non-binding wording (оговорку для бизнес-клиентов и об отсутствии обязательной оферты), separate product/installation scope (раздельный запрос изделия/монтажа), physical logo edges (физические края логотипов), versioned language-independent request snapshot (версионируемый снимок обращения, не зависящий от языка), and CRM storage/display boundaries (границы хранения/отображения в системе работы с заявками).
  - Switched calculator millimeter and EUR formatting (форматирование миллиметров и евро) to the active locale. Added a copy-contract regression test (регрессионный тест контракта текстов) for six identical structures, localized OpenGraph locale (локаль превью ссылки), one `{price}` placeholder (одно место под цену), and German fallback (немецкий резервный текст) only for unknown locales.
  - 44/44 focused Node tests (точечных теста Node), targeted ESLint (точечная проверка кода), production build with TypeScript (промышленная сборка с проверкой типов), and `git diff --check` (проверка формата изменений) pass. Browser QA (проверка в браузере) passed all six desktop routes, PL/TR/AR at 390 px (польскую/турецкую/арабскую версии на телефоне), AR RTL (арабское направление справа налево), locale metadata (метаданные языка), zero horizontal overflow (отсутствие горизонтального переполнения), and zero console errors (отсутствие ошибок консоли).
* **In progress:** Owner visual/copy review (визуальная и текстовая проверка владельцем) of the localized routes.
* **Next action:** After approval, separately enable indexability (индексацию), `sitemap.xml` (карту сайта) and `hreflang` (языковые альтернативы). CMS tariff management (управление тарифами через систему управления контентом) remains separate.
* **Blockers/risks:** The current preview-font contract (контракт шрифтов предварительного просмотра) supports Latin/Cyrillic motif text (надписи на латинице/кириллице), not automatic Arabic motif measurement (автоматическое измерение арабской надписи). The Arabic interface is fully localized and provides a direct manual-review explanation. The route remains `noindex` (запрещённым для индексации), outside `sitemap.xml` (карты сайта), and without `hreflang` (языковых альтернатив).
* **Updated documents and code:** Page/copy/calculator/card/navigation/message files (файлы страницы, текстов, калькулятора, карточек, навигации и сообщений), focused tests (точечные тесты), implementation plan (план внедрения), calculator plan (план калькулятора), domain README (доменный файл-ориентир), this progress log (этот журнал), and `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — owner-approved reuse of the existing right service drawer (утверждённое владельцем переиспользование существующей правой панели услуги) for calculator requests.
* **Done:**
  - Replaced the calculator CTA (кнопку действия калькулятора) use of the general `ContactModal` (общего модального окна обращения) and its extra `ChatModal` (окна чата) with the existing `LeistungenProblemDrawer` (выдвижной панелью услуги) already used by repair, cleaning and diagnostic flows. No new drawer, duplicated markup or new design system was created.
  - Extended the shared drawer with one optional `calculationSnapshot` prop (необязательным свойством снимка расчёта) and forwarded it unchanged to the existing `ContactForm` (форму обращения). Existing callers omit the property and retain their previous behavior.
  - Added only the required DE/RU copy (немецкие/русские тексты): drawer title (заголовок панели), service label (служебная подпись), summary label (подпись краткого итога), form title/intro (заголовок/введение формы), close label (подпись закрытия), priced summary (краткий итог с ценой) and review summary (краткий итог индивидуальной проверки). EN/TR/PL/AR retain the existing DE fallback (немецкий временный текст).
  - The priced drawer summary shows the same preliminary net total (предварительный итог без НДС) and clearly says that dimensions, design and price will be checked before a binding offer (обязательного предложения). The `individual-review` (индивидуальный расчёт) summary contains no monetary value and explains that dimensions and light zones require manual review. The full nine-row JSON snapshot (структурированный снимок JSON из девяти строк) remains hidden and is transferred with the form rather than duplicated in the visible card.
  - Browser QA (проверка в браузере) confirmed the CTA in both states, closing by X/backdrop/Escape, localized prefilled issue type/message (локализованное предзаполнение типа/сообщения), one file input (одно поле загрузки файлов), exact FormData snapshot forwarding (передачу снимка через данные формы), one public calculator price before opening, DE/RU desktop and 390×844 full-width drawer behavior, and zero horizontal overflow (отсутствие горизонтального переполнения). Four implementation screenshots (четыре снимка реализации) were retained for independent design QA (проверки дизайна).
  - Added a source regression test (тест регрессии исходного кода) for optional prop plumbing (передачу необязательного свойства), existing drawer reuse and absence of calculator `ContactModal`/`ChatModal` (общего модального окна/чата). All 41 Node tests (41 тест Node), targeted ESLint (точечная проверка кода), production build with TypeScript (промышленная сборка с проверкой типов), and `git diff --check` (проверка формата изменений) pass.
* **In progress:** Owner visual review (визуальная проверка владельцем) of the reused drawer presentation; primary-agent design QA (проверка дизайна основным агентом) is complete and recorded as `passed` (пройдена) in `design-qa.md`.
* **Next action:** Accept only owner visual/copy feedback on this drawer reuse, then obtain separate authorization for the controlled real-request/CRM verification (проверку реальной заявки и карточки системы заявок), because it creates actual request data. CMS tariff management (управление тарифами через систему управления контентом) remains a separate future block.
* **Blockers/risks:** On very short mobile viewports the existing drawer intentionally scrolls internally, so controls below the fold require vertical scrolling. This is inherited responsive behavior rather than a new layout. Formula, tariffs, geometry, snapshot contract, server path, CRM (система работы с заявками), the already-applied database migration (уже применённая миграция базы данных), portal model (модель клиентского кабинета), analytics and `noindex` (запрет индексации) were not changed by this UI block.
* **Updated documents and code:** Calculator component/copy (компонент/тексты калькулятора), existing service drawer (существующая панель услуги), snapshot regression tests (регрессионные тесты снимка), calculator plan (план калькулятора), this domain progress log (доменный журнал), `PROGRESS.md` (краткий глобальный журнал), `design-qa.md` (отчёт проверки дизайна), and QA screenshots (снимки для проверки качества).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — owner-approved request handoff (утверждённая владельцем передача расчёта в обращение) and universal internal CRM display (универсальное внутреннее отображение в системе работы с заявками).
* **Done:**
  - Added one versioned, language-independent `calculationSnapshot` JSON contract (структурированный снимок расчёта JSON, не зависящий от языка) with strict server validation for schema/calculator/status versions, byte/row/string limits, finite primitive values, EUR net total (итог без НДС в евро), stable review codes (стабильные коды индивидуальной проверки), and rejection of malformed or unknown structural properties. Arbitrary future field keys remain valid rows and survive normalization with a stable-key fallback (резервной подписью из стабильного ключа).
  - The illuminated-valance builder (сборщик снимка волана с подсветкой) records ordered rows for valance length/height, full text, font ID, letter height, measured text length, logo placement, light-zone count and quantity; the config version (версия конфигурации) and source locale (исходный язык) remain metadata. Priced results contain exactly one `EUR` net total (итог без НДС в евро); `individual-review` (индивидуальный расчёт) contains stable review reasons and no price.
  - Added a DE/RU CTA (немецкую/русскую кнопку действия) below both priced and `individual-review` (индивидуальным расчётом) states. It opens the existing protected `ContactModal` (существующее защищённое модальное окно обращения) with `IlluminatedValance` (типом обращения «волан с подсветкой»), localized prefill (локализованным предварительным текстом), existing attachment support (существующей поддержкой вложений), and one extra JSON form field. The normal form path without a snapshot remains unchanged.
  - `/api/contact` (серверный маршрут формы) validates the snapshot before intake; `createWebsiteRequest` (создание обращения сайта) stores it only on `Case` (заявке). It is not embedded in the customer-visible initial message, Telegram preview (превью Telegram) or portal safe model (безопасную клиентскую модель кабинета).
  - Added a nullable Prisma `Json` field (необязательное JSON-поле Prisma) and migration artifact `20260717113000_add_case_calculation_snapshot` (артефакт миграции добавления снимка расчёта). The migration was applied through the project workflow (миграция применена через штатный процесс проекта) to the configured database on 2026-07-17, and the follow-up status check reports no pending migrations (ожидающих миграций нет).
  - The admin Case GET (внутреннее чтение заявки) selects and normalizes the snapshot. The CRM case detail (внутренняя карточка заявки) renders source/schema/config/status, every field row, the one net total when present, review codes and the fixed warning `Vorläufige Website-Kalkulation – Werte und Preis vor dem Angebot erneut prüfen.` (предварительный расчёт сайта — перепроверить значения и цену перед предложением). Known fields use a fixed German operator dictionary (немецкий словарь оператора); unknown future keys display themselves.
  - Added seven contract/formatter/persistence-boundary tests (семь тестов контракта, форматирования и границы сохранения). Together with all 33 existing calculator tests, 40/40 pass. Targeted ESLint (точечная проверка кода), production build with TypeScript (промышленная сборка с проверкой типов), and `git diff --check` (проверка формата изменений) pass. Browser QA (проверка в браузере) confirms the DE/RU CTA (немецкую/русскую кнопку действия), one public net price (одну публичную сумму без НДС), `IlluminatedValance` prefill (предзаполнение типа обращения), exact nine ordered row keys, priced/review states and zero horizontal overflow (отсутствие горизонтального переполнения) at 390 px.
* **In progress:** Owner review (проверка владельцем) of request handoff (передачи расчёта в обращение) and the internal CRM card (внутренней карточки системы заявок). The migration exists only as a repository artifact (артефакт репозитория), so real database persistence is intentionally not active until a separate reviewed apply step (шаг применения).
* **Next action:** Create one controlled real request and verify the CRM card (карточку системы заявок) end to end (сквозным сценарием). CMS tariff management (управление тарифами через систему управления контентом) remains a separate future block.
* **Blockers/risks:** Until the migration is applied, a real request carrying the new field cannot persist in the current database. The snapshot is preliminary client context (предварительный клиентский контекст), never an authoritative commercial offer (обязательное коммерческое предложение); CRM operators must recheck it. EN/TR/PL/AR retain DE fallback (немецкий временный текст), and the route remains `noindex` (запрещённым для индексации).
* **Updated documents and code:** Calculator plan (план калькулятора), this domain progress log (доменный журнал), `PROGRESS.md` (краткий глобальный журнал), shared snapshot contract/builder/CRM formatter (общий контракт, сборщик и форматтер системы заявок), contact form/API/intake (форма, серверный маршрут и создание обращения), Prisma schema/migration artifact (схема Prisma и артефакт миграции), CRM detail API/UI (серверный маршрут и интерфейс карточки заявки), DE/RU copy (немецкие/русские тексты), and focused tests (точечные тесты).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — owner-approved edge placement correction (утверждённая владельцем коррекция краевого размещения) without starting the next calculator block.
* **Done:**
  - Added typed `logoEdgeCenterRatio = 0.07` (типизированную долю 7 % от края до центра логотипа) to the single active layout config (конфигурацию размещения) with range validation. The pure calculation engine (чистый расчётный модуль) now owns the available interval, centered text interval, and left/right logo intervals/centers; the SVG preview (масштабируемая схема) renders that geometry without duplicating the placement formula.
  - Text remains centered in the available valance length regardless of logos. Logo centers are symmetric at 7 %/93 % of available length, clamped by logo radius so each circle stays inside its corresponding edge. Physical left/right remains fixed under `dir="ltr"` (физическим направлением слева направо) and does not mirror in RTL (направлении справа налево).
  - Replaced aggregate-only fit checking with real interval boundary and collision checks: text against each selected logo, or two logos against each other when text is absent. `logoTextGapMm` (минимальный промежуток между логотипом и текстом) is applied as the exact minimum between neighboring intervals; exact contact is accepted at zero gap and a 0.01 mm overlap is rejected.
  - Preserved physical `lightZones` order (физический порядок световых зон), semantic pricing (семантическое ценообразование), illuminated area/light length (световую площадь/длину), zone counts, thresholds, quantity, internal VAT/gross (внутренний НДС/итог с НДС), v2 tariffs, and one-amount public B2B net price (одну публичную B2B-сумму без НДС). Public metrics now say `Belegt gesamt` (суммарно занято) / `Frei gesamt` (суммарно свободно) and `Суммарно занято` / `Суммарно свободно`; values are summed light widths rather than a continuous central group.
  - Expanded the pure suite from 28 to 33 Node tests (с 28 до 33 тестов Node): config ratio/range, deterministic 7 %/93 % positions, left/right price invariance, collision despite summed widths fitting, logo-only overlap, exact contact/+0.01 mm, the €2718.34 control, and all existing tariff/1200/2400/quantity/individual-review regressions (регрессии тарифов, границ зон, количества и индивидуального расчёта).
  - Targeted ESLint (точечная проверка кода), production build with TypeScript (промышленная сборка с проверкой типов), and `git diff --check` (проверка формата изменений) pass. DE/RU desktop/mobile browser QA (проверка немецкой и русской версии на компьютере и мобильном устройстве) passes with no error overlay (окно ошибки), console errors (ошибки консоли), or horizontal overflow (горизонтальное переполнение) at 390 px.
  - Exact browser control 9500×400 / `TSOMI` / `playfair-display` (Playfair Display) / 300 mm / both logos / quantity one remains €2718.34 net (без НДС). Text center is 4750 mm, logo centers are 665/8835 mm, summed occupied/free widths are 1915/7585 mm, and the public card contains one monetary amount. One logo on the left or right remains identically €2459.14. A 1700 mm collision case shows no price even though summed occupied width is 1615 mm, and a text zone over 2400 mm remains `individual-review` (индивидуальным расчётом) without price.
* **In progress:** Owner review (проверка владельцем) of corrected edge placement; no next functional block has started.
* **Next action:** Address only owner feedback on this geometry correction, then obtain separate confirmation before any further calculator block.
* **Blockers/risks:** Preview remains schematic rather than a production drawing (производственный макет), and production safety margins remain zero. CMS (система управления контентом), CRM (система работы с заявками), forms, database, analytics, tariffs, and `noindex` (запрет индексации) are unchanged. EN/TR/PL/AR retain the DE fallback (немецкий временный текст).
* **Updated documents and code:** Calculator plan (план калькулятора), this domain progress log (доменный журнал), `PROGRESS.md` (краткий глобальный журнал), typed config/calculation engine (типизированная конфигурация/расчётный модуль), calculator component and DE/RU copy (компонент и немецкие/русские тексты), and Node tests (тесты Node).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — owner-approved provisional tariff recalibration (утверждённая владельцем перекалибровка временных тарифов) at approximately 0.79.
* **Done:**
  - Replaced the five final values in the single active typed config (единственной активной типизированной конфигурации): setup (подготовка) €310 → €245, base area (площадь основы) €600/m² → €475/m², illuminated area (световая площадь) €480/m² → €380/m², standard additional zone through 1200 mm (стандартная дополнительная зона до 1200 мм) €284 → €225, and long additional zone through 2400 mm (длинная дополнительная зона до 2400 мм) €709 → €560.
  - Raised the config version from `provisional-area-zones-2026-07-17-v1` to `provisional-area-zones-recalibrated-2026-07-17-v2`. No second tariff set or runtime coefficient (коэффициент во время выполнения) was introduced; the config contains final rates.
  - Preserved the 1200/2400 mm thresholds, formula, geometry, semantic included-zone rule (семантическое правило включённой зоны), internal VAT/gross calculations (внутренние расчёты НДС/итога с НДС), one-amount B2B net presentation (B2B-представление одной суммы без НДС), and all individual-review behavior (поведение индивидуального расчёта).
  - Added an explicit version/five-rate test (явную проверку версии и пяти ставок) and updated deterministic provisional expectations; the suite now contains 28 scenarios while retaining all boundary and left/right regression cases (граничные и регрессионные сценарии слева/справа).
  - Exact deterministic control (точный детерминированный контроль) for 5000×320 mm, measured text 1702.3 mm, 200 mm letters and no logo now returns €1134.37 net (без НДС), €215.53 internal VAT (внутренний НДС), and €1349.91 internal gross (внутренний итог с НДС). Actual Canvas UI geometry (фактическая браузерная геометрия интерфейса) returns one public net amount of €631.08 by default, €1262.16 at quantity two, and equal €1792.03 values for one left/right logo.
  - All 28 Node tests (28 тестов Node), targeted ESLint (точечная проверка кода), production build with TypeScript (промышленная сборка с проверкой типов), `git diff --check` (проверка формата изменений), DE/RU desktop/mobile QA (проверка немецкой и русской версии на компьютере и мобильном устройстве), one-euro-value rendering (одна денежная сумма), individual review without price (индивидуальный расчёт без цены), 390 px overflow, overlay, and browser error checks pass.
  - The former €3433 value is the owner-reported control price before recalibration (контрольная цена владельца до перекалибровки). The preliminary arithmetic estimate 3433×0.79≈€2712 was superseded by an exact browser check (точной браузерной проверкой) of the fully restored DE calculator state (немецкого состояния калькулятора): 9500×400 mm, `TSOMI`, `playfair-display` (Playfair Display), 300 mm letters, both logos, quantity one. Rounded UI geometry (округлённая геометрия интерфейса) is 1315 mm text, 1915 mm occupied, and 7585 mm free. Actual v2 net is €2718.34; the difference from €2712 comes from the final rounded rates and exact Canvas geometry (точной браузерной геометрии). Quantity two is €5436.68, one left/right logo is identically €2459.14, restoring both logos returns €2718.34, individual review hides price (индивидуальный расчёт скрывает цену), RU default (стандартная русская конфигурация) remains one €631.08 net amount, and 390 px has no overflow. The verified €2718.34 result is inside the €2600–2800 goal for the €1300–1400 purchase benchmark at 100% markup (наценке 100 %) and remains a business calibration check rather than a runtime formula input (параметр формулы во время выполнения).
* **In progress:** Owner review (проверка владельцем) of recalibrated tariffs and exact control outputs; no next functional block has started.
* **Next action:** Address only feedback on this tariff pass, then obtain separate confirmation before any further calculator block.
* **Blockers/risks:** The exact 9500×400 / TSOMI control is now verified. Tariffs remain code-managed; CMS (система управления контентом), CRM (система работы с заявками), forms, database, analytics, and `noindex` (запрет индексации) are unchanged.
* **Updated documents and code:** Provisional tariff config and Node tests (временная конфигурация тарифов и тесты Node), calculator plan (план калькулятора), this domain progress log (доменный журнал), and `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — Block 2B B2B-only public price simplification (упрощение публичной цены только для бизнес-клиентов).
* **Done:**
  - Reduced the public price card to exactly one monetary amount: `netSubtotalForQuantity` (полный итог без НДС за выбранное количество). Removed the setup/base/light/additional-zone breakdown (разбивку подготовки/основы/световой площади/дополнительных зон), separate VAT amount (отдельную сумму НДС), gross total (итог с НДС), and quantity line (строку количества) from the card.
  - Added `data-valance-net-total` (стабильный маркер единственной суммы). The live aria announcement (доступное сообщение для вспомогательных технологий) now reports calculation readiness without repeating any monetary value.
  - Set the exact DE (немецкий) public wording: `Vorläufiger Gesamtpreis` (предварительная итоговая стоимость) and `Nur für Unternehmer im Sinne des § 14 BGB. Unverbindliche Kostenschätzung, kein verbindliches Angebot. Alle Preise netto zzgl. 19 % MwSt.` (только для предпринимателей в смысле § 14 Гражданского кодекса Германии; необязательная оценка, не обязательное предложение; все цены без НДС плюс 19 % НДС). The `§ 14 BGB` Unternehmer definition (определение предпринимателя в § 14 Гражданского кодекса Германии) was checked against the official federal legal text.
  - Set the exact RU wording: «Предварительная итоговая стоимость» and «Только для бизнес-клиентов. Предварительный расчёт не является обязательным предложением. Все цены указаны без НДС; НДС 19% начисляется дополнительно.» Existing exclusions for installation, delivery, electrical work, and permits remain in both languages.
  - Left the pure engine, tariffs, provisional config, geometry, semantic zone rule, `individual-review` (индивидуальный расчёт), CMS (систему управления контентом), CRM (систему работы с заявками), forms, database, analytics, and `noindex` (запрет индексации) unchanged. The internal engine still calculates VAT/gross (НДС/итог с НДС) but the public card does not render them.
* **In progress:** Owner review (проверка владельцем) of the one-amount B2B card (B2B-карточки с одной суммой); no next functional block has started.
* **Next action:** Address only feedback on this public presentation, then obtain separate confirmation before any further calculator block.
* **Blockers/risks:** Tariffs remain code-managed and production safety margins remain zero. EN/TR/PL/AR retain the DE fallback (немецкий временный текст), and the route remains `noindex` (запрещённым для индексации). The engine’s VAT/gross values remain internal and must not accidentally reappear in public UI (интерфейсе).
* **Updated documents and code:** Calculator component/copy (компонент и тексты калькулятора), calculator plan (план калькулятора), this domain progress log (доменный журнал), and `PROGRESS.md` (краткий глобальный журнал).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — Calculator Block 2B provisional public pricing (блок 2B предварительной публичной цены).
* **Done:**
  - Connected one temporary typed/versioned pricing configuration (временную типизированную версионируемую конфигурацию цены) to the existing Block 2A calculator without adding CMS (систему управления контентом), CRM (систему работы с заявками), Prisma (слой работы с базой данных), form handoff (передачу в форму), analytics (аналитику), or supplier pricing (цены поставщиков).
  - Implemented the owner-approved net formula (формулу без НДС) per item: €310 setup (подготовка), €600/m² base valance area (площадь основы волана), €480/m² illuminated area (световая площадь), additional zones up to 1200 mm at €284, and additional zones over 1200 through 2400 mm at €709. Quantity multiplies the complete per-item net result; 19% VAT (НДС) is then added and the gross total (итого с НДС) is the visually primary public value.
  - Kept physical zone order left-to-right (физический порядок зон слева направо) for the schematic: left logo, text, right logo when present. Pricing uses semantic inclusion (семантическое правило включения): with text, the text zone is included and every logo zone is additional regardless of its side; without text, one logo zone is included and every remaining logo zone is additional. Font choice changes measured geometry only; a logo has no complexity surcharge.
  - Corrected and regression-tested the discovered left/right pricing defect (дефект зависимости цены от стороны): the same 1500 mm text with one identical left or right logo now produces identical complete pricing, one standard additional zone, and a €284 zone charge.
  - Added the automatic boundary: any individual light zone over 2400 mm switches to `individual-review` (индивидуальный расчёт) and exposes no price.
  - Replaced the previous no-price message with natural DE/RU (немецкой/русской) itemized price output: setup, base area, illuminated area, additional zones, quantity, net subtotal (итого без НДС), VAT (НДС), and a prominent gross total (итого с НДС). Both languages say the result is a non-binding estimate (необязательная предварительная оценка), and that installation, delivery, electrical work, and permits are excluded and checked separately.
  - The pure calculation suite passes 27 Node tests (27 тестов Node), including left/right price invariance (неизменность цены слева/справа), semantic logo-only boundaries at 1200 mm, the 2400 mm review boundary, quantity and VAT (НДС). Targeted ESLint (точечная проверка кода), production build with TypeScript (промышленная сборка с проверкой типов), DE/RU desktop/mobile browser QA (проверка в браузере немецкой и русской версии на компьютере и мобильном устройстве), responsive width at 390 px, and browser error checks pass. Browser QA also confirmed that size, text, font, letter height, logos, and quantity each update the price.
* **In progress:** Owner review (проверка владельцем) of the corrected semantic inclusion rule and breakdown wording; no further calculator block has started.
* **Next action:** Address only owner feedback for Block 2B, then obtain separate confirmation before CMS tariff management (управлением тарифами через систему управления контентом) or request handoff (передачей в заявку).
* **Blockers/risks:** The temporary tariffs are editable only in code and are intentionally not supplier-derived. Preview safety margins remain zero and the preview remains a schematic rather than a production drawing (производственный макет). Standalone repository-wide `tsc --noEmit` (общая проверка типов без сборки) still reports the two pre-existing unrelated `referenzen` (примеры работ) and `status` (статус заявки) route errors; production build and its TypeScript stage pass. EN/TR/PL/AR retain the DE fallback (немецкий временный текст), and the route remains `noindex` (запрещённым для индексации).
* **Updated documents and code:** `PROGRESS.md` (краткий глобальный журнал), domain README (доменный файл-ориентир), calculator plan (план калькулятора), this progress log (этот журнал), calculator/copy component files (файлы компонента и текстов), provisional tariff configuration and calculation module (временная конфигурация тарифов и модуль расчёта), and Node tests (тесты Node).

* **Date:** 2026-07-17
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — Block 2A live geometry calculator (блок 2A живого геометрического калькулятора) without public pricing (без публичной цены).
* **Done:**
  - Replaced only the temporary cost block (временный блок индивидуальной оценки) after `#machbarkeit` (проверки совместимости) with an isolated client calculator component (отдельным клиентским компонентом калькулятора); FAQ (частые вопросы) and all other page sections remain in place.
  - Added the seven approved customer inputs: valance length/height, full desired text, one curated font, visible letter height, physical logo placement (`none/left/right/both` / без логотипа, слева, справа, с обеих сторон), and identical-item quantity.
  - Added a live SVG preview (живую масштабируемую схему) with true valance proportions, exact measured text width, conditional `LOGO` (логотип) circles, occupied/free millimeters, and both visual and inline height/length errors. The preview uses `dir="ltr"` (фиксированное физическое направление слева направо) so physical left/right logo choices do not mirror in RTL (направлении справа налево).
  - Added ten exact self-hosted fonts (десять точных локально размещённых шрифтов): Montserrat, Open Sans, Oswald, PT Sans, Playfair Display, Rubik, Fira Sans, Merriweather, Source Sans 3, and Roboto. Files came from a pinned official Google Fonts commit (зафиксированной версии официального репозитория шрифтов Google); every family has Latin/Cyrillic metadata (метаданные поддержки латиницы/кириллицы) and its original SIL Open Font License 1.1 copy (копию открытой лицензии на шрифт).
  - The browser loads only the selected exact file through `FontFace` (интерфейс загрузки файла шрифта), measures the full string and kerning through Canvas `measureText` (браузерное измерение строки), and normalizes width to the visible cap height of `H` (видимую высоту заглавной буквы). No system font, average glyph coefficient, complexity factor, CDN (внешняя сеть доставки), or runtime Google Fonts request (запрос к сервису шрифтов Google во время работы) participates in a valid result.
  - Exposed and tested a tariff-independent geometry evaluation contract (геометрический контракт без тарифов). The calculation suite now passes 21 Node tests (21 тест Node).
  - Added natural DE/RU copy (естественные немецкие и русские тексты), connected labels, keyboard-operable native controls, inline errors, `aria-live` (доступное объявление результата), and an explicit no-price state (состояние без цены) that says tariffs are not connected. EN/TR/PL/AR still use the existing DE fallback (немецкий временный текст).
  - Browser QA (проверка в браузере) passed on DE/RU desktop/mobile (немецкой и русской версиях на компьютере и мобильном устройстве), including exact font loading, different measured widths, Cyrillic text, height overflow, physical left/right logo positions, no error overlay (окно ошибки), and no horizontal overflow (горизонтальное переполнение) at 390 px. Targeted ESLint (точечная проверка кода), production build with TypeScript (промышленная сборка с проверкой типов), and formatting checks passed.
* **In progress:** Owner review (проверка владельцем) of Block 2A layout, font list, wording, and boundary behavior; no customer price is shown.
* **Next action:** Address only owner feedback for Block 2A, then obtain separate confirmation before public tariffs/CMS (публичными тарифами/системой управления контентом) or request handoff (передачей в обращение).
* **Blockers/risks:** Production margins, tariffs, tax mode, and rounding (рабочие отступы, тарифы, режим налога и округление) remain unspecified. The preview (предварительная схема) therefore checks the physical valance boundary with zero extra safety margins and labels itself as a schematic rather than a production drawing (производственный макет). Exact Merriweather variable font file (точный вариативный файл шрифта Merriweather) is relatively large but loads only when selected. Standalone repository-wide `tsc --noEmit` (общая проверка типов без сборки) still stops on the two pre-existing unrelated `referenzen` (примеры работ) and `status` (статус заявки) route errors; the production build and its TypeScript stage (промышленная сборка и её этап проверки типов) pass. The route remains `noindex` (запрещённым для индексации); CMS (система управления контентом), CRM (система работы с заявками), Prisma (слой работы с базой данных), analytics (аналитика), and the protected request form (защищённая форма обращения) are unchanged.
* **Updated documents and code:** `PROGRESS.md` (краткий глобальный журнал), domain README (доменный файл-ориентир), calculator plan (план калькулятора), this progress log (этот журнал), route/copy/component files (файлы маршрута, текстов и компонента), calculator/font modules (модули расчёта и шрифтов), Node tests (тесты Node), and the local font/license directory (каталог локальных шрифтов и лицензий).

* **Date:** 2026-07-16
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — Block 1 calculation contract and boundary tests (расчётный контракт и граничные тесты блока 1).
* **Done:**
  - Added a pure TypeScript calculation module (чистый типизированный модуль расчёта) with no DOM (структура страницы), public page, CMS (система управления контентом), CRM (система работы с заявками), Prisma (слой работы с базой данных), or database dependency.
  - Defined discriminated results (разделённые по статусу результаты) for `priced` (цена рассчитана), `invalid` (исправимая ошибка ввода или размещения), and `individual-review` (индивидуальный расчёт), while preserving the submitted input and configuration version.
  - Implemented the approved geometry and pricing formula: safe dimensions, conditional logos and gaps, composition fit, light length, automatic light zones, area, base/light/zone/logo charges, per-item minimum, quantity, configurable tax treatment, and configurable rounding.
  - Kept font measurement behind a verified input boundary (границей проверенного входа): no system font, placeholder font file, supplier price, or font-complexity coefficient was added. A pure helper only scales an already verified measurement to another visible letter height.
  - Added 17 Node test scenarios (тестовых сценариев Node) with clearly test-only tariffs, covering height and length boundaries, left/right/both logos, zones, minimum price, quantity, absent tariffs, explicit zero zone tariff, different measured font widths, disabled/custom/mismatched fonts, automatic ranges, unavailable measurement, inactive configuration, tax, and rounding.
  - Verified the targeted Node tests (целевые тесты Node), targeted ESLint (точечную проверку качества кода), isolated TypeScript (изолированную проверку типов) and change formatting. No public calculator, tariff, font, database model, or page change was introduced.
* **In progress:** Owner formula review (проверка формулы владельцем) on manual examples; the page remains unchanged.
* **Next action:** After owner acceptance, separately confirm Block 2 (блок 2) for the schematic preview and user interface (схематичное превью и пользовательский интерфейс).
* **Blockers/risks:** Real licensed font files, public tariffs, layout margins, tax mode, and rounding values remain owner inputs for the next block. Repository-wide TypeScript (общая проверка типов) still stops only on pre-existing unrelated `referenzen` (примеры работ) and `status` (статус заявки) route errors; the new files pass isolated type checking.
* **Updated documents and code:** `PROGRESS.md` (краткий глобальный журнал), calculator plan (план калькулятора), this progress log (этот журнал), `signage-service/src/lib/illuminated-valance-calculator.ts` (расчётный модуль), and `signage-service/scripts/test-illuminated-valance-calculator.test.ts` (граничные тесты).

* **Date:** 2026-07-16
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (воланы для маркиз с подсветкой) — owner-approved minimal calculator plan (утверждённый владельцем минимальный план калькулятора).
* **Done:**
  - Created [service_page_beleuchtete_markisenvolants_calculator_plan.md](service_page_beleuchtete_markisenvolants_calculator_plan.md) as the canonical calculator specification (каноническую спецификацию калькулятора).
  - Removed supplier prices, procurement matrices, font-complexity coefficients, mounting height, electrical work, delivery, and permit logic from the automatic estimate (автоматического расчёта).
  - Fixed the customer inputs to valance length/height, full text, one curated font, letter height, logo placement, and identical-item quantity.
  - Defined real font-metric text measurement (измерение текста по реальным метрикам шрифта), top/bottom/side fit checks (проверки размещения по высоте и длине), a schematic valance preview (схематичное превью волана), the PixelRing-owned pricing formula (формулу по собственным тарифам PixelRing), request snapshot handoff (передачу снимка расчёта в обращение), CMS management (управление через систему управления контентом), tests, and five owner-gated implementation blocks (пять блоков внедрения с контрольными точками владельца).
  - Linked the new specification from the active page implementation plan (активного плана внедрения страницы) and domain router (доменного маршрутизатора).
* **In progress:** Block 1 preparation (подготовка блока 1) for the typed calculation contract and boundary tests (типизированного расчётного контракта и граничных тестов); application code is unchanged.
* **Next action:** Owner separately confirms Block 1 and provides or defers real tariffs, layout margins, tax/rounding behavior, and the initial font files. If values are deferred, implementation may use clearly marked test fixtures (тестовые данные) only in tests and must not publish a price.
* **Blockers/risks:** Exact licensed font files and public rates are not yet available; device system fonts and placeholder prices are prohibited for the public result.
* **Updated documents:** `PROGRESS.md` (краткий глобальный журнал), domain README (доменный файл-ориентир), page implementation plan (план внедрения страницы), this progress log (этот журнал) and the new calculator plan (новый план калькулятора).

* **Date:** 2026-07-14
* **Current sprint/block:** Удаление `Как проходит запрос` / `So läuft die Anfrage ab` (блока процесса запроса) по решению владельца.
* **Done:**
  - Из route page (страницы маршрута) полностью удалена отображаемая секция с заголовком, вводным текстом, четырьмя нумерованными шагами и тремя карточками вариантов заказа.
  - Из localized copy source (источника локализованных текстов) также удалены typed `process` schema (типизированная структура `process`), немецкий текст и русский текст; блок не отключён, а полностью удалён из кода страницы.
  - После компактного блока проверки совместимости теперь сразу начинается индивидуальная оценка стоимости; пустая секция или дополнительный разделитель не остаются.
  - RU and DE DOM checks (проверки структуры русской и немецкой страниц) подтвердили отсутствие удалённых заголовков и правильный следующий H2 (заголовок второго уровня). Mobile check (проверка на мобильном устройстве) 390×844 не выявила horizontal overflow (горизонтального переполнения).
  - Targeted ESLint (точечная проверка кода) и `git diff --check` (проверка формата изменений) прошли.
* **In progress:** Визуальная проверка владельцем сокращённой RU page flow (последовательности русской страницы).
* **Next action:** Продолжать только со следующим отдельно утверждённым изменением страницы.
* **Blockers/risks:** Маршруты остаются `noindex` (запрещёнными для индексации), вне `sitemap.xml` (карты сайта) и `hreflang` (языковых альтернатив). Основные инструкции по первому обращению сохраняются в компактном блоке проверки совместимости и request form (форме обращения).
* **Updated documents:**
  - `PROGRESS.md` (краткий глобальный журнал)
  - `docs/07_content_ai_seo/README.md` (маршрутизатор домена)
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md` (доменный журнал)
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md` (план внедрения)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx` (страница маршрута)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/copy.ts` (локализованные тексты страницы)

* **Date:** 2026-07-14
* **Current sprint/block:** Compact `Passt das zu meiner Markise?` (компактный блок «Подойдёт ли это к моей маркизе?») for RU and DE (русской и немецкой версий).
* **Done:**
  - По решению владельца сохранена функция блока: снять главное возражение о совместимости без обещания, что решение подходит любой маркизе.
  - Три нумерованные карточки, длинная повторяющаяся заметка и две нижние карточки заменены одним коротким объяснением, двумя компактными списками по три пункта, одной CTA (кнопкой действия) и одной подсказкой для неполного набора фотографий.
  - Русский заголовок теперь звучит `Для первой проверки достаточно нескольких фотографий.`; клиенту достаточно снять общий вид, волан, крепление и маркизу сбоку, ничего демонтировать не требуется.
  - Для DE route (немецкого маршрута) подготовлена естественная эквивалентная формулировка без изменения границ публичных обещаний. Следующий process block (блок процесса) не менялся.
  - Targeted ESLint (точечная проверка кода) и `git diff --check` (проверка формата изменений) прошли. Browser QA (проверка в браузере) на 1159×863 и 390×844 подтвердила отсутствие horizontal overflow (горизонтального переполнения); высота блока составляет примерно 533 px в RU и 525 px в DE на компьютере.
* **In progress:** Визуальная и текстовая проверка владельцем компактного RU/DE block (русского и немецкого блока).
* **Next action:** Продолжить только со следующим отдельно утверждённым изменением страницы; после полного утверждения RU copy (русского текста) подготовить EN/TR/PL/AR translations (переводы на английский, турецкий, польский и арабский).
* **Blockers/risks:** Все маршруты остаются `noindex` (запрещёнными для индексации), вне `sitemap.xml` (карты сайта) и `hreflang` (языковых альтернатив). Нельзя превращать проверку по фотографиям в обещание универсальной совместимости.
* **Updated documents:**
  - `PROGRESS.md` (краткий глобальный журнал)
  - `docs/07_content_ai_seo/README.md` (маршрутизатор домена)
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md` (доменный журнал)
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md` (план внедрения)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/copy.ts` (локализованные тексты страницы)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx` (страница маршрута)

* **Date:** 2026-07-14
* **Current sprint/block:** Russian localization (русская локализация) of `Beleuchtete Markisen-Volants` (воланов для маркиз с подсветкой).
* **Done:**
  - Внедрён утверждённый естественный русский текст на `/ru/leistungen/beleuchtete-markisenvolants` (русской странице воланов для маркиз с подсветкой) без дословного калькирования немецких конструкций.
  - Зафиксирована нормативная русская терминология `волан/воланы/волана` (правильные формы русского слова): в публичной русской версии продукта не используются варианты `волант`, `воланты` или `ламбрекен`.
  - Локализованы весь видимый текст страницы, metadata (метаданные), breadcrumbs (хлебные крошки), alt descriptions (альтернативные описания изображений), day/night control (переключатель день/ночь), exchange animation (анимация замены), slider state labels (подписи состояний слайдера), CTA (призывы к действию) и request prefills (предзаполнения обращения).
  - Общие RU labels (русские подписи) в меню и форме изменены на `Воланы с подсветкой` и `Воланы для маркиз с подсветкой`. DE route (немецкий маршрут) сохранил исходный утверждённый текст; EN/TR/PL/AR по-прежнему используют временный DE fallback (немецкий текст-заполнитель).
  - Проверены targeted ESLint (точечная проверка кода), валидность `ru.json` (файла русской локали), RU metadata and canonical URL (русские метаданные и канонический адрес), отсутствие кириллицы в DE main content (основном немецком содержимом), а также responsive layout (адаптивная компоновка) на 390×844 и 1440×900 без horizontal overflow (горизонтального переполнения).
* **In progress:** Визуальная и текстовая проверка владельцем RU desktop/mobile page (русской страницы на компьютере и мобильном устройстве).
* **Next action:** После утверждения RU copy (русского текста) последовательно подготовить EN/TR/PL/AR translations (переводы на английский, турецкий, польский и арабский), затем заменить временные визуализации одобренными реальными материалами и отдельно выполнить release/indexability pass (проход публикации и индексации).
* **Blockers/risks:** Маршрут остаётся `noindex` (запрещённым для индексации), вне `sitemap.xml` (карты сайта) и `hreflang` (языковых альтернатив). Общая TypeScript check (проверка TypeScript) останавливается только на существующих несвязанных ошибках в `referenzen` (примеры работ) и `status` (статус заявки). Не добавлять неподтверждённые цены, технические параметры, гарантии или универсальную совместимость.
* **Updated documents:**
  - `PROGRESS.md` (краткий глобальный журнал)
  - `docs/07_content_ai_seo/README.md` (маршрутизатор домена)
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md` (доменный журнал)
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md` (план внедрения)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/copy.ts` (локализованные тексты страницы)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx` (страница маршрута)
  - `signage-service/src/components/leistungen/LeistungenIlluminatedValanceHero.tsx` (компонент первого экрана)
  - `signage-service/src/components/leistungen/LeistungenIlluminatedValanceExchange.tsx` (компонент замены волана)
  - `signage-service/messages/ru.json` (русские строки интерфейса)

* **Date:** 2026-07-13
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (световые ламбрекены маркиз) — visual-impact section and upper-page order (визуальный блок результата и порядок верхних блоков).
* **Done:**
  - Перемещён переработанный блок `Ihre sichtbare Markenfläche` (видимая бренд-зона) на второе место сразу после hero (первого экрана); `Volantwechsel` (замена валана) теперь занимает третье место перед `Machbarkeit` (проверкой реализуемости).
  - Сохранён визуальный язык прежней bento grid (разновесной сетки), но пять смешанных карточек заменены тремя фотокарточками разного веса: `Café & Gastronomie` (кафе и гастрономия), `Ladenlokal & Studio` (магазин и студия) и `Licht & Detail` (свет и деталь).
  - На каждой карточке постоянно видны тип применения и заголовок; пояснение раскрывается на desktop hover/focus (при наведении/фокусе на компьютере) и постоянно показано на mobile (мобильном устройстве). Карточки доступны с клавиатуры и имеют локализованные alt descriptions (альтернативные описания изображений).
  - Созданы три временные photorealistic visualizations (фотореалистичные визуализации), конвертированы в WebP (формат изображения) размером 86–328 KB и явно помечены публичным бейджем `Visualisierung` (визуализация), поэтому они не выдаются за реальные работы PixelRing.
  - Проверены targeted ESLint (точечная проверка кода), `git diff --check` (проверка формата изменений), HTTP 200, порядок секций в DOM (объектной модели документа), desktop layout (компоновка на компьютере) 1159×863, mobile layout (мобильная компоновка) 390×844, загрузка всех трёх изображений, раскрытие по фокусу, отсутствие horizontal overflow (горизонтального переполнения), error overlay (окна ошибки) и browser console errors (ошибок консоли). Repository-wide TypeScript (общая проверка TypeScript) останавливается только на ранее существовавших несвязанных ошибках маршрутов `referenzen` (примеры работ) и `status` (статус заявки).
* **In progress:** Визуальное утверждение владельцем DE desktop/mobile version (немецкой версии на компьютере и мобильном устройстве), включая тексты карточек и распределение 7/5 в сетке.
* **Next action:** После утверждения заменить временные визуализации реальными разрешёнными фотографиями проектов; до этого не называть блок `Unsere Arbeiten` (наши работы) или `Referenzen` (примеры работ).
* **Blockers/risks:** Три изображения являются concept placeholders (концептуальными временными материалами), а не customer references (клиентскими кейсами); сохранить бейдж `Visualisierung` (визуализация) до замены. Не добавлять неподтверждённые цены, технические параметры, гарантии, универсальную совместимость или обещания коммерческого результата.
* **Updated documents:**
  - `PROGRESS.md` (краткий глобальный журнал)
  - `docs/07_content_ai_seo/README.md` (маршрутизатор домена)
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md` (доменный журнал)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx` (маршрут страницы)
  - `signage-service/public/images/leistungen/beleuchtete-markisenvolants/visual-*.webp` (временные визуализации)

* **Date:** 2026-07-12
* **Current sprint/block:** `Beleuchtete Markisen-Volants` (световые ламбрекены маркиз) — bento-пересборка блока ценности продукта.
* **Done:**
  - Переконфигурирован только существующий блок ценности сразу после hero (первого экрана) на `/[locale]/leistungen/beleuchtete-markisenvolants` (локализованной странице световых ламбрекенов маркиз): прежние три равные карточки и нижняя плашка заменены сеткой из пяти карточек разного веса.
  - Сетка сохраняет утверждённую каноническую DE-логику: существующая маркиза как исходная точка, `Gestaltung` (дизайн мотивa), `Machbarkeit` (проверка реализуемости), `Tag & Nacht` (день и ночь) и переход к `Machbarkeitsprüfung` (проверке реализуемости по фото).
  - Использован только согласованный `hero-cafe-night.png` (ночной визуал кафе); отклонённые `hero-front-*.png` (отклонённые фронтальные визуалы) по-прежнему не используются. Блоки `#machbarkeit` (проверка совместимости) и процесса не менялись.
  - Проверены targeted ESLint (точечная проверка ESLint), `git diff --check` (проверка формата изменений), production build (промышленная сборка), desktop/mobile DOM geometry (геометрия DOM на компьютере и мобильном устройстве), отсутствие горизонтального переполнения и якорная ссылка `Zur Machbarkeitsprüfung` (к проверке реализуемости). На 390 px все пять карточек складываются в одну колонку без переполнения; на 1280 px работает сетка 5/3/4 и 5/3/4.
* **In progress:** Визуальное утверждение владельцем DE-версии (немецкой версии) на desktop/mobile (компьютере и мобильном устройстве) остаётся открытым.
* **Next action:** После визуального утверждения перейти только к отдельно согласованной спецификации calculator (калькулятора стоимости); не добавлять псевдокалькулятор или фиксированную цену.
* **Blockers/risks:** API захвата скриншота (интерфейс снятия скриншота) локального браузера дважды завершился по тайм-ауту, поэтому ручной визуальный review (визуальная проверка) владельца не заменён автоматическим скриншотным сравнением. Не публиковать цену, гарантию, обещание универсальной совместимости или коммерческий результат.
* **Updated documents:**
  - `PROGRESS.md` (краткий глобальный журнал)
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md` (доменный журнал)
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md` (план внедрения)
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx` (маршрут страницы)

* **Date:** 2026-07-12
* **Current sprint/block:** Homepage Eight-Card Services Integration (восьмикарточная интеграция услуг на главной странице).
* **Done:**
  - Rebuilt `HomeServicesSection` (секцию услуг главной страницы) from six to eight cards while preserving the compact image-first pattern (компактный паттерн с главным акцентом на изображении).
  - Moved `Alle Leistungen ansehen` (посмотреть все услуги) from the separate text link into the first visually distinct clickable card linking to `/leistungen` (страницу всех услуг).
  - Added `Leuchtvolants für Markisen` (световые ламбрекены для маркиз) as the seventh standalone service card with the owner-provided daytime image (дневное изображение владельца) and the localized route.
  - Completed the homepage-section localization (локализацию секции главной страницы) for DE/EN/RU/TR/PL/AR, including localized new-card names, updated service summaries, corrected Turkish and Polish diacritics (турецкую и польскую диакритику), and Arabic copy (арабский текст).
  - Verified the 4 × 2 wide-screen grid (сетку 4 × 2 на широком экране), single-column mobile layout (одноколоночную мобильную компоновку), six locale link sets, AR RTL (арабское направление справа налево), both new navigation targets, browser console, targeted lint (точечную проверку кода), TypeScript (проверку типов), `git diff --check` (проверку формата изменений), and production build (промышленную сборку).
* **In progress:** The standalone non-DE service-page copy (текст отдельной страницы услуги на языках кроме немецкого) still uses the approved DE fallback (временный немецкий текст) and remains a separate pre-publication translation task.
* **Next action:** Complete and visually review EN/RU/TR/PL/AR page translations (переводы страницы) before deployment; then separately remove `noindex` (запрет индексации) and enable localized metadata (метаданные), `hreflang` (языковые альтернативы), and `sitemap.xml` (карту сайта).
* **Blockers/risks:** Do not treat the finished homepage-card translations (переводы карточек главной страницы) as completion of the full standalone page translation (перевода отдельной страницы). Preserve the current pre-publication SEO boundary (границу поисковой подготовки).
* **Updated documents:**
  - `PROGRESS.md` (краткий глобальный журнал)
  - `design-qa.md` (отчёт визуальной проверки)
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md` (доменный журнал)
  - `signage-service/src/components/sections/HomeServicesSection.tsx` (секция услуг главной страницы)

* **Date:** 2026-07-12
* **Current sprint/block:** `Beleuchtete Markisen-Volants` Local Pre-Publication Integration (локальная подготовка к публикации световых ламбрекенов маркиз).
* **Done:**
  - Opened `/[locale]/leistungen/beleuchtete-markisenvolants` (локализованный маршрут световых ламбрекенов маркиз) for all six existing locale paths. Until the translation pass (проход переводов), non-DE routes intentionally render the approved DE fallback (временный немецкий текст) only for local/pre-publication review.
  - Added the seventh service entry to the shared desktop/mobile navigation (общая навигация компьютера и мобильного устройства), including localized navigation labels; on desktop (компьютер) the seventh card occupies the left lower grid position and `Alle Leistungen ansehen` (посмотреть все услуги) occupies the remaining right space.
  - Added the standalone seventh `/leistungen` card (карточка страницы услуг) with the owner-provided day image (дневное изображение владельца) rather than any rejected generated media (отклонённые сгенерированные материалы).
  - Retained the staging SEO boundary (граница поисковой подготовки): every route emits `noindex` (запрет индексации), the route is absent from `sitemap.xml` (карта сайта), and the proxy removes its HTTP `hreflang` (языковые альтернативы) header.
  - Verified message JSON (JSON локалей), targeted lint (точечная проверка кода), TypeScript (проверка типов), production build (промышленная сборка), `git diff --check` (проверка формата изменений), six local HTTP 200 responses, no `hreflang` (языковые альтернативы) header, and AR RTL (арабское направление справа налево) markup. Browser automation (автоматизация браузера) was unavailable in the local environment.
* **In progress:** Final EN/RU/TR/PL/AR page-copy translation (перевод текстов страницы) and the owner visual review (визуальная проверка владельцем) remain pending; the separate calculator/rebuild decision (отдельное решение о калькуляторе и переработке структуры) is unaffected.
* **Next action:** Before deployment, complete copy translation (перевод текстов), visual desktop/mobile/RTL (компьютерную, мобильную и RTL-проверку), then separately make the route indexable (доступным для индексации) with localized metadata (метаданные), `hreflang` (языковые альтернативы), and `sitemap.xml` (карта сайта).
* **Blockers/risks:** Do not deploy the current DE-fallback content (временный немецкий текст) as a finished non-DE customer experience. Do not add price, warranty, technical, or universal-compatibility claims (неподтверждённые ценовые, гарантийные, технические или универсальные утверждения о совместимости).
* **Updated documents:**
  - `PROGRESS.md` (краткий глобальный журнал)
  - `docs/07_content_ai_seo/README.md` (маршрутизатор домена)
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md` (доменный журнал)
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md` (план внедрения)

* **Date:** 2026-07-12
* **Current sprint/block:** `Beleuchtete Markisen-Volants` Block-by-Block DE Review (пошаговая DE-проверка блоков страницы).
* **Done:**
  - Aligned the owner-provided day/night hero (первый экран день/ночь) with neighboring service pages: the height, headline scale, text width, placement, and CTA (призывы к действию) rhythm now follow the same visual grid; the subline was shortened to the retrofit decision.
  - Rewrote `Was wird modernisiert?` (что модернизируется?) so the customer understands that the existing awning remains the starting point and only the front valance is assessed as a possible illuminated brand surface (световая бренд-зона).
  - Replaced the `Passt das zu meiner Markise?` (подходит ли это к моей маркизе?) technical checklist with three client-facing steps: send visible photos, PixelRing checks the starting situation, then measurements and a safe electrical connection are clarified together only when needed. The customer is no longer told to remove the valance or solve electrical details before the first request.
  - Verified `git diff --check` (проверка формата изменений), lint (проверка кода), and production build (промышленная сборка). Lint has 26 pre-existing warnings (существующих предупреждений) in unrelated files and no errors.
* **In progress:** Owner DE desktop/mobile review (проверка немецкой версии на компьютере и мобильном устройстве) continues block by block. The latest text/layout changes are code-verified but have not received a final visual approval.
* **Next action:** Discuss, critique, and approve the next page block before editing it. Only after the full DE review route (немецкий маршрут для проверки) is accepted should the separate integration/localization pass (проход интеграции и локализаций) be considered.
* **Blockers/risks:** Keep the route DE-only (только немецкий) and `noindex` (запрещён для индексации), with no `sitemap.xml` (карта сайта), `hreflang` (языковые альтернативы), public navigation, or service cards. Do not make unsupported technical, price, warranty, or universal-compatibility promises.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md`
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx`

* **Date:** 2026-07-12
* **Current sprint/block:** `Beleuchtete Markisen-Volants` Owner-Supplied Day/Night Hero (первый экран день/ночь с визуалами владельца).
* **Done:** Replaced the temporary non-photographic hero (временный нефотографический первый экран) on `/de/leistungen/beleuchtete-markisenvolants` (немецкая страница световых ламбрекенов маркиз) with the owner-provided matched café images (согласованные изображения кафе) for day and night. Added the isolated `LeistungenIlluminatedValanceHero` (компонент первого экрана светового ламбрекена), which crossfades between the states, automatically alternates until interaction, and stops automatic alternation after the visitor uses the native accessible `Tag/Nacht` (день/ночь) button. `prefers-reduced-motion` (настройка уменьшения движения) disables automatic alternation. Existing CTA (призывы к действию), prefill (предзаполнение формы обращения), and protected intake (защищённый приём заявки) remain unchanged.
* **In progress:** Owner DE desktop/mobile review (проверка немецкой версии на компьютере и мобильном устройстве), with attention to hero crop (кадрирование первого экрана) and control placement (расположение переключателя).
* **Next action:** After owner visual approval, decide separately whether to start the navigation, service-card, localization, and public SEO/GEO (поисковая и AI-видимость) integration pass (проход интеграции).
* **Blockers/risks:** The route remains DE-only (только немецкий) and `noindex` (запрещён для индексации), outside `sitemap.xml` (карта сайта), `hreflang` (языковые альтернативы), public navigation, and cards. The rejected `hero-front-*.png` files remain unreferenced.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx`
  - `signage-service/src/components/leistungen/LeistungenIlluminatedValanceHero.tsx`
  - `signage-service/public/images/leistungen/beleuchtete-markisenvolants/hero-cafe-day.png`
  - `signage-service/public/images/leistungen/beleuchtete-markisenvolants/hero-cafe-night.png`

* **Date:** 2026-07-12
* **Current sprint/block:** `Beleuchtete Markisen-Volants` DE Review Route and Intake (немецкий маршрут для проверки световых ламбрекенов маркиз и приём заявки).
* **Done:**
  - Built the dedicated `/de/leistungen/beleuchtete-markisenvolants` (отдельную немецкую страницу световых ламбрекенов маркиз) from the owner-approved canonical DE copy (канонический немецкий текст).
  - Added a non-photographic review hero (нефотографический первый экран для проверки), not a substitute product image, and intentionally omitted the `Tag/Nacht` (день/ночь) control until a real approved pair of media assets exists.
  - Wired each CTA (призыв к действию) to the existing protected contact flow with `IlluminatedValance` (световой ламбрекен) and its approved, distinct prefill (предзаполнение формы).
  - Added the localized `IlluminatedValance` (световой ламбрекен) label to both layouts of `ContactForm` (форма обращения) across the six existing form locales, without a schema migration (миграция схемы) or new upload path (новый путь загрузки).
  - Verified `git diff --check` (проверка формата изменений), message JSON (JSON локалей), lint (проверка кода), production build (промышленная сборка), one H1 (один главный заголовок), no browser error overlay (отсутствие окна ошибки браузера), no desktop horizontal overflow (отсутствие горизонтального переполнения на компьютере), route isolation (изоляция маршрута), and 11/11 public-intake security tests (тестов безопасности публичной заявки).
* **In progress:** Owner DE desktop/mobile review (проверка немецкой версии на компьютере и мобильном устройстве). Final day/night media (визуалы день/ночь) is deferred to the owner and is not present in the route.
* **Next action:** After final media and a new owner decision, add the real day/night interaction (реальное переключение день/ночь) and start the separate navigation, cards, localization, and public SEO/GEO (поисковая и AI-видимость) pass.
* **Blockers/risks:** The generated `hero-front-*.png` files are rejected, unapproved, and must remain unreferenced. Do not add the page to `sitemap.xml` (карта сайта), `hreflang` (языковые альтернативы), or public menu/cards before all six languages are ready.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md`
  - `signage-service/src/app/[locale]/leistungen/beleuchtete-markisenvolants/page.tsx`
  - `signage-service/src/components/common/ContactForm.tsx`
  - `signage-service/messages/{de,en,ru,tr,pl,ar}.json`

* **Date:** 2026-07-11
* **Current sprint/block:** Beleuchtete Markisen-Volants Front-Facing Day/Night Hero (фронтальный первый экран день/ночь световых ламбрекенов маркиз)
* **Done:**
  - Replaced the rejected oblique visual direction (отклонённое перспективное визуальное направление) with a near-front-on storefront composition where the front valance is the dominant, fully visible product surface.
  - Generated matched day/night base scenes (согласованные базовые сцены день/ночь) and composited the exact official PixelRing wordmark and two PixelRing marks (точную официальную надпись PixelRing и два знака PixelRing) from repository SVG assets, avoiding generated brand text or invented symbols.
  - Saved the review-only concepts (концепты только для проверки) as signage-service/public/images/leistungen/beleuchtete-markisenvolants/hero-front-day-v1.png and signage-service/public/images/leistungen/beleuchtete-markisenvolants/hero-front-night-v1.png.
* **In progress:** Owner visual review (визуальная проверка владельцем); no application route, navigation, homepage card, form change, or calculator has been implemented.
* **Next action:** After approval, implement the accessible day/night control (доступный элемент управления день/ночь) and the new German route.
* **Blockers/risks:** The images are concept visuals (концептуальные визуалы), not a real PixelRing project or public reference; do not publish them before explicit visual approval.
* **Updated documents:**
  - PROGRESS.md
  - docs/07_content_ai_seo/README.md
  - docs/07_content_ai_seo/content_ai_seo_progress_log.md
  - docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_product_brief.md
  - docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md
  - signage-service/public/images/leistungen/beleuchtete-markisenvolants/hero-front-day-v1.png
  - signage-service/public/images/leistungen/beleuchtete-markisenvolants/hero-front-night-v1.png

* **Date:** 2026-07-11
* **Current sprint/block:** Beleuchtete Markisen-Volants DE Copy Approval (утверждение DE-текста световых ламбрекенов маркиз)
* **Done:** Owner approved the complete German canonical copy (владелец утвердил полный канонический немецкий текст), including page blocks, metadata (метаданные), CTA (призывы к действию), FAQ (частые вопросы), navigation, service cards, homepage card, and contact-form prefill (предзаполнение формы обращения).
* **In progress:** Day/night visual direction (визуальное направление день/ночь); no generated asset, application code, form change, or calculator has been implemented.
* **Next action:** Obtain owner references, prepare the paired hero (парный первый экран) day/night concept, and obtain approval before code.
* **Blockers/risks:** No page code may start before the hero (первый экран) is approved; numeric technical claims, price, warranty, and final electrical-execution model remain unavailable for public copy.
* **Updated documents:**
  - PROGRESS.md
  - docs/07_content_ai_seo/README.md
  - docs/07_content_ai_seo/content_ai_seo_progress_log.md
  - docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_product_brief.md
  - docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md

* **Date:** 2026-07-11
* **Current sprint/block:** `Beleuchtete Markisen-Volants` Product-Brief Reconciliation and DE Copy Prototype (синхронизация продуктового брифа и DE-текстовый прототип световых ламбрекенов маркиз)
* **Done:**
  - Reconciled the product brief with the newer approved owner decisions in the staged implementation plan (утверждённые решения владельца в поэтапном плане внедрения).
  - Split the former supplier-first launch gate (прежний барьер запуска после выбора поставщика) into a safe public-page gate (безопасный барьер первой публичной страницы) and a stricter execution gate (строгий барьер исполнения продукта и системно-специфичных обещаний).
  - Prepared a complete German canonical copy draft (полный черновик канонического немецкого текста) with page copy, metadata, CTA (призывами к действию), FAQ (частыми вопросами), navigation and service-card labels (подписями навигации и карточек услуг), homepage card (карточкой главной страницы), and contact-form prefill (предзаполнением формы обращения).
  - Preserved the claim-safety boundary (границу безопасности публичных обещаний): no public numeric specifications, price, delivery time, warranty, universal compatibility, permit promise, or confirmed electrical-execution claim has been introduced.
* **In progress:** Owner review (проверка владельцем) of the German canonical copy; no visual asset, application code, form change, or calculator has been implemented.
* **Next action:** After owner approval, request or use the owner’s visual references and produce the day/night visual direction (визуальное направление день/ночь) before coding.
* **Blockers/risks:** The exact product system, supplier, conformity role, warranty terms, and electrical-execution model remain internal prerequisites before binding product execution or technical claims.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_product_brief.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_de_canonical_copy_draft.md`

* **Date:** 2026-07-11
* **Current sprint/block:** `Beleuchtete Markisen-Volants` Implementation Planning (планирование внедрения световых ламбрекенов маркиз)
* **Done:**
  - Converted the owner's decisions into a separate staged implementation plan (поэтапный план внедрения) without splitting or replacing the product brief.
  - Fixed the public name, route, PixelRing-owned product/service framing, product-only and full-service paths, electrical-installation boundary, geography, photo-first intake, no-minimum-demand-learning model, and no-price first release.
  - Defined the full-width day/night hero (первый экран день/ночь), interactive control, PixelRing-branded Berlin café scene, seven-link service navigation, seventh `/leistungen` card (карточка страницы услуг), and eight-card homepage services grid (сетка услуг на главной).
  - Defined DE-first copy approval, EN/RU/TR/PL/AR localization, RTL QA (проверку направления справа налево), form type `IlluminatedValance` (световой ламбрекен), FAQ (частые вопросы), SEO/structured data (поисковую оптимизацию и структурированные данные), analytics (аналитику), verification, and post-release checks.
  - Separated the useful first-release cost-factors block (блок факторов стоимости) from a future functional calculator specification (спецификация работающего калькулятора).
  - Added an execution contract for future agents (рабочую инструкцию для будущих агентов): fixed product decisions are not to be reopened without a real conflict, while composition, component boundaries, micro-interactions, visual rhythm, and one supporting creative idea remain within the agent's professional freedom.
* **In progress:** No public copy, visual asset, application code, form change, or calculator has been implemented.
* **Next action:** Reconcile the older product brief with the newer owner decisions, then draft the German canonical page copy (канонический немецкий текст страницы) for owner approval before code.
* **Blockers/risks:** Visual reference links are pending from the owner; numeric technical claims remain blocked until internal product validation.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_implementation_plan.md`

* **Date:** 2026-07-11
* **Current sprint/block:** `Beleuchtete Markisen-Volants` Product and Page Foundation (продуктовая и страничная основа световых ламбрекенов маркиз)
* **Done:**
  - Reviewed the existing `Werbeanlagen-Reparatur` (ремонт рекламных конструкций), `Werbeanlagen-Reinigung` (очистка рекламных конструкций), and `LED-Modernisierung` (LED-модернизация) page patterns and documented which elements can be reused without turning the new category into a template clone.
  - Defined the product as `Nachrüstung einer bestehenden Markise` (модернизация существующей маркизы) with a replacement illuminated advertising valance (сменным световым рекламным ламбрекеном); full new awnings, separate facade rails, parasols, and dynamic media products (новые маркизы целиком, отдельные фасадные направляющие, зонты и динамические медиапродукты) are deferred.
  - Built a modular offer around `Machbarkeits-Check` (проверку реализуемости), site measurement, technical clarification, design approval, the illuminated-valance system, power and control, installation, electrical coordination, permit documentation, and aftercare (замер, техническое уточнение, утверждение дизайна, систему светового ламбрекена, питание и управление, монтаж, координацию электроподключения, разрешительную документацию и последующий сервис).
  - Documented the mandatory compatibility gate (обязательную проверку совместимости) for the awning mechanism, front rail, keder, dimensions, motif, cable path, power supply, access, owner consent, public-space use, operation, and serviceability.
  - Defined a dedicated future route, page flow, German canonical terminology (немецкую каноническую терминологию), photo-based intake (приём заявки по фотографиям), safe price framing (безопасную подачу цены), visual proof hierarchy (иерархию визуальных доказательств), internal links, localization, metrics, and code integration map (карту интеграции в код).
  - Verified direct supplier and competitor sources from Germany and France and official German/EU sources for advertising installations, street use, monuments, light impact, product roles, CE marking (маркировку соответствия), electrical work, warranties, prices, intellectual property, and photo uploads.
  - Created a separate evidence and supplier-validation matrix (матрицу доказательств и проверки поставщика), including conflicting supplier warranties and the rule that supplier-specific voltage, thickness, IP class, lifetime, price, and warranty cannot be generalized.
* **In progress:** The track remains planning-only; no application route, CMS record, form type, public copy, imagery, supplier, price, or warranty has been implemented or approved.
* **Next action:** Request comparable technical and commercial documentation from at least two suppliers, determine PixelRing's role in the product chain, and close the open specification fields before public copy or code work.
* **Blockers/risks:** Unknown exact system, supplier documentation, final-system conformity responsibility, motorized-awning impact, electrical execution model, purchase price, guarantee terms, replacement parts, permit workflow, and absence of a real PixelRing case.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/02_public_website/README.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/content_ai_seo_progress_log.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_product_brief.md`
  - `docs/07_content_ai_seo/service_page_beleuchtete_markisenvolants_evidence_matrix.md`

* **Date:** 2026-06-13
* **Current sprint/block:** `Probleme & Lösungen` P1.1 `urgent-repair` Rewrite (переписывание P1.1 статьи о срочном ремонте)
* **Done:**
  - Used subagents (субагенты) for read-only content safety (проверка безопасности контента) and rendering surface (поверхность рендера) checks before implementation.
  - Rewrote the existing published DE/EN/RU `CmsArticle` records (существующие опубликованные CMS-статьи) for `urgent-repair` / `dringende-reparatur-werbeanlage` (срочный ремонт рекламной конструкции), without creating new CMS rows (новые записи CMS), seed scripts (seed-скрипты), sitemap entries (записи sitemap), or routes (маршруты).
  - Added safety-bounded `selfRepairTips` (советы по самостоятельному ремонту с границами безопасности) as explicit JSON (структурированный JSON) for DE, EN, and RU, including `intro` (введение), `withoutOpening` (без вскрытия), `technicalSpecialist` (технический специалист), `doNotDo` (чего не делать), and `qualificationNote` (сноска о квалификации).
  - Rebuilt the full articles (полные статьи) around `Erste sichere Schritte` (первые безопасные шаги), `Symptom -> Risiko -> Handlung` (симптом -> риск -> действие) tables, Berlin/Brandenburg (Берлин/Бранденбург) service context, request checklist (чеклист заявки), PixelRing process (процесс PixelRing), scope factors (факторы объема работ), and urgent CTA labels (срочные CTA-метки).
  - Updated code-backed small cards (кодовые маленькие карточки) for DE, EN, and RU so the hub (обзорная страница) still preserves the card/modal/full article (карточка/модальное окно/полная статья) model.
  - Made the full article sidebar CTA (боковая кнопка полной статьи) use the existing `CmsArticle.ctaLabel` (поле CTA статьи CMS) when present, so `Dringenden Fall melden` (сообщить о срочном случае), `Report urgent case` (сообщить о срочном случае), and `Сообщить срочный случай` render on the article pages.
  - Cleaned one adjacent DE published `CmsPage` FAQ question (немецкий опубликованный FAQ-вопрос CMS-страницы) on `/de/probleme-loesungen` (`Probleme & Lösungen` / проблемы и решения) to remove the public-facing `sofort` (немедленно) wording from the hub path.
  - Verified targeted lint (точечная lint-проверка), production build (production-сборка), local rendered HTML (локальный HTML) for `/de/probleme-loesungen` and DE/EN/RU article URLs, one article table (таблица статьи), no duplicated fallback structured sections (дубли fallback-секций), visible urgent CTA (видимый срочный CTA), Article/BreadcrumbList JSON-LD (структурированные данные статьи и хлебных крошек), and no visible `Notdienst` (аварийная служба), `24/7` (круглосуточно), or `sofort` (немедленно) on the checked hub/article surfaces.
* **In progress:** Owner visual and copy review (визуальная и редакторская проверка владельцем) of the rewritten DE article, hub card (карточка обзора), and modal (модальное окно).
* **Next action:** If accepted, continue the weak-article rewrite sequence (цепочка переписывания слабых статей) with `werbeanlage-wackelt` (вывеска шатается) or `folie-ist-ausgeblichen` (пленка выцвела).
* **Blockers/risks:** TR/PL/AR `urgent-repair` articles (турецкая, польская и арабская статьи) are still missing and remain outside this P1.1 scope (объем P1.1); no real emergency availability promise (обещание доступности аварийной службы) has been introduced.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `signage-service/src/app/[locale]/probleme-loesungen/page.tsx`
  - `signage-service/src/components/probleme-loesungen/ProblemArticleBody.tsx`
  - `signage-service/src/lib/cms/articles.ts`
  - Published CMS article records (опубликованные CMS-статьи) for `urgent-repair` in DE/EN/RU
  - Published CMS page record (опубликованная CMS-страница) for `de/probleme-loesungen`

* **Date:** 2026-06-13
* **Current sprint/block:** `Probleme & Lösungen` P0.1 Technical/CMS Foundation (техническая и CMS-основа P0.1 для "Проблемы и решения")
* **Done:**
  - Used subagents (субагенты) for read-only checks of the CMS update path (путь обновления CMS) and article-template risks (риски шаблона статей).
  - Cleaned the published DE `CmsPage` (немецкая CMS-страница) for `/de/probleme-loesungen` (`Probleme & Lösungen` / проблемы и решения) through the CMS Page API (API страницы CMS), preserving validation (валидацию), audit log (журнал аудита), and revision snapshot (снимок версии).
  - Fixed public German copy defects (ошибки немецкого текста) such as `или` (русское "или"), `Waehlen` (нужно `Wählen` / выбрать), `noetig` (нужно `nötig` / необходимо), `oeffnen` (нужно `öffnen` / открыть), `Haeufige` (нужно `Häufige` / частые), and `klaert` (нужно `klärt` / проясняет).
  - Added `datePublished` (дата публикации), `dateModified` (дата изменения), and `BreadcrumbList` (структурированные хлебные крошки) JSON-LD (структурированные данные) to problem article pages (страницы статей о проблемах).
  - Fixed mobile overflow (горизонтальный переполз страницы) on full article pages at 360/390/430 px and kept markdown tables (таблицы markdown) inside their own horizontal scroller.
  - Limited duplicated structured sections (дублированные структурные секции) on complete markdown articles (полные markdown-статьи) while keeping fallback sections (резервные секции) for weak short articles (слабые короткие статьи) until P1 rewrites.
* **In progress:** P0 foundation is technically ready; remaining P0 choices are CTA/local trust block wording (CTA и локальный блок доверия) and article trust block design (блок авторства/проверки статьи).
* **Next action:** Start P1 rewrite (переписывание P1) with `dringende-reparatur-werbeanlage` (срочный ремонт рекламной конструкции) or finish CTA/local trust block design first.
* **Blockers/risks:** Do not rewrite weak articles (слабые статьи), create new CMS article rows (новые записи статей CMS), or publish seed scripts (seed-скрипты) without the next explicit owner confirmation.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/07_content_ai_seo/README.md`
  - `signage-service/src/app/[locale]/probleme-loesungen/[slug]/page.tsx`
  - `signage-service/src/components/probleme-loesungen/ProblemArticleBody.tsx`
  - `signage-service/src/lib/cms/articles.ts`
  - Published CMS page record (опубликованная запись CMS-страницы) for `de/probleme-loesungen`

* **Date:** 2026-06-13
* **Current sprint/block:** `Probleme & Lösungen` Cluster Modernization Planning (план модернизации кластера "Проблемы и решения")
* **Done:**
  - Saved the independent content cluster audit (независимый аудит контентного кластера) for `/de/probleme-loesungen` (`Probleme & Lösungen` / проблемы и решения) as a raw source document under `source_audits/`.
  - Created `probleme_loesungen_cluster_modernization_plan.md` as the active step-by-step modernization plan (пошаговый план модернизации), separating quick QA/CRO fixes (исправления качества и конверсии), weak article rewrites (переписывание слабых статей), winner strengthening (усиление сильных статей), service/money pages (коммерческие страницы услуг), and future research-backed articles (будущие статьи на основе исследования).
  - Added links in the plan to the confirmed future article tracks: `Leuchtstoffröhren in der Werbeanlage ersetzen oder auf LED umrüsten?` (заменить люминесцентные трубки в рекламной установке или перейти на LED) and `Neonreklame reparieren oder auf LED umrüsten?` (ремонтировать неоновую рекламу или перейти на LED).
  - Documented the research-request workflow (процесс запроса дополнительного исследования) for future articles before drafting public copy.
  - Deleted superseded problem-article prompt/template documents (устаревшие документы с промптами и шаблонами) and archived legacy SEO/public-website planning documents (архивные SEO и website planning документы) under `docs/13_references_archive/seo_content_legacy/`.
* **In progress:** Ready to start P0/P1 execution from the modernization plan.
* **Next action:** Start with German QA/CTA fixes or one weak article rewrite from `probleme_loesungen_cluster_modernization_plan.md`.
* **Blockers/risks:** Do not create CMS rows, publish seed scripts, or rewrite article content until the owner confirms the specific execution step.
* **Updated documents:**
  - `PROGRESS.md`
  - `docs/00_project_overview/document_migration_matrix.md`
  - `docs/00_project_overview/project_state_and_roadmap.md`
  - `docs/01_strategy/master_brief.md`
  - `docs/01_strategy/new/pixelring_master_brief_context_prompt.md`
  - `docs/02_public_website/README.md`
  - `docs/02_public_website/information_architecture.md`
  - `docs/07_content_ai_seo/README.md`
  - `docs/07_content_ai_seo/probleme_loesungen_cluster_modernization_plan.md`
  - `docs/07_content_ai_seo/seo_geo_readonly_audit_2026-05-30.md`
  - `docs/07_content_ai_seo/source_audits/pixelring_content_cluster_audit_2026-06-12.md`
  - `docs/13_references_archive/README.md`
  - `docs/13_references_archive/admin_platform_references.md`

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
