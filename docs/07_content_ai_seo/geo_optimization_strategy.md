# GEO Strategy for PixelRing Reparatur
## AI-visible content system for troubleshooting, trust, and citation readiness

**Статус:** active (действующая стратегия)

**Дата решения:** 2026-07-18

**Заменяет:** прежнее требование полного перевода каждой статьи на DE/EN/RU/TR/PL/AR; оно имеет статус superseded/deprecated (заменено и устарело).

**Связанные документы:** [доменный README](README.md), [доменный журнал прогресса](content_ai_seo_progress_log.md), [аудит публичного CMS-контента](../09_engineering/cms_public_content_audit_2026-05-21.md).

---

## 1. Назначение документа
Этот документ задает практическую GEO-стратегию для PixelRing:
- как строить контент, который понятен AI-поиску;
- какие сигналы реально повышают шанс цитирования;
- как оформлять symptom-based страницы;
- как связать troubleshooting-контент с service pages и intake;
- на что не стоит делать ложную ставку.

Документ нужен как рабочее ТЗ для:
- content planning;
- CMS-модели;
- page templates;
- SEO / GEO-реализации;
- дальнейшей локализации.

---

## 2. Что такое GEO для этого проекта

### 2.1. Рабочее определение
Для PixelRing GEO означает не "специальную магию для нейросетей", а создание такого контента, который:
- легко индексируется;
- отвечает на конкретный симптом простым языком;
- выглядит как надежный источник от реальной сервисной компании;
- содержит короткие цитируемые фрагменты;
- ведет пользователя от симптома к следующему действию.

### 2.2. Главная цель
Сделать сайт одним из лучших источников по типовым проблемам наружной рекламы, чтобы AI-системы могли:
- извлекать из страниц точные ответы;
- ссылаться на конкретные страницы или секции;
- воспринимать сайт как экспертный источник по ремонту и обслуживанию вывесок.

### 2.3. Важное уточнение
GEO не заменяет SEO.
Для AI search работают те же фундаментальные сигналы:
- crawlability;
- indexability;
- ясная архитектура;
- качественный и оригинальный контент;
- topical authority;
- доверие к источнику;
- локальная и коммерческая достоверность.

---

## 3. Стратегическая ставка

### 3.1. На чем строится шанс цитирования
Наибольший шанс быть использованным в AI-ответах дают страницы, которые:
- отвечают на узкий и реальный вопрос;
- написаны языком симптомов, а не абстрактных услуг;
- быстро дают короткий и понятный ответ;
- далее раскрывают причины, риски и безопасный следующий шаг;
- подтверждают, что за страницей стоит реальная компания с практикой, а не контентная ферма.

### 3.2. Главная формула PixelRing
**Symptom-first content + локальная достоверность + структурированная подача + понятный handoff к сервису.**

### 3.3. Кого мы пытаемся выиграть
Не только Google.
Контент должен быть пригоден для:
- Google AI Overviews / AI Mode;
- Bing / Copilot ecosystem;
- ChatGPT Search и других систем, использующих web retrieval;
- Perplexity и аналогичных answer engines.

---

## 4. Что реально будет работать

### 4.1. Симптомный вход
Страницы должны отвечать на запросы уровня:
- вывеска не светится;
- вывеска моргает;
- одна буква не работает;
- неравномерно светятся диоды;
- после дождя вывеска выключается;
- отклеилась пленка на витрине;
- выцвела оклейка;
- шатается крепление вывески.

Пользователь и AI задают вопросы языком симптомов, а не языком индустриальных услуг.

### 4.2. Разговорные заголовки
Заголовки страниц и секций должны звучать как естественный вопрос:
- Почему моргает световая вывеска?
- Что делать, если вывеска не включается?
- Почему на витрине отклеивается пленка?

### 4.3. Atomic answer
В начале каждой страницы нужен короткий ответ длиной примерно 1-3 предложения.
Он должен:
- прямо отвечать на вопрос;
- помещаться в короткий цитируемый фрагмент;
- не уводить в рекламу;
- не быть слишком общим.

### 4.4. Scoped diagnosis
После короткого ответа страница должна показывать, что причина может быть не одна.
Нужна структура:
1. что это может быть;
2. что можно проверить безопасно;
3. когда нужен срочный выезд;
4. как обычно решается такая проблема.

### 4.5. Локальная достоверность
Контент должен подтверждать, что это не справочник "ни о чем", а сайт реальной сервисной компании.
Для этого нужны:
- упоминание реального региона работы;
- реальные сценарии выезда;
- фото и кейсы, где возможно;
- понятный сервисный следующий шаг;
- отсутствие ощущения marketplace.

### 4.6. Кластерная экспертность
Одиночная статья полезна, но кластер работает сильнее.
Нужен не один текст, а система взаимосвязанных материалов:
- hub page категории;
- problem pages;
- service pages;
- case pages;
- локальные страницы там, где это оправдано.

### 4.7. Обновляемость
AI-выдача лучше работает с контентом, который выглядит живым и поддерживаемым.
Нужны:
- дата последнего обновления;
- периодический review;
- единая терминология;
- устранение дублирующих и тонких страниц.

---

## 5. На что нельзя делать ложную ставку

### 5.1. Schema не решает все
Структурированные данные полезны, но сами по себе не обеспечивают цитирование.
Они помогают машине понять тип страницы, но не заменяют:
- хороший ответ;
- полезную структуру;
- доверие к источнику.

### 5.2. FAQPage не должен быть главной надеждой
`FAQPage` можно использовать как дополнительную семантику, но нельзя строить стратегию вокруг него.
Основной акцент нужно делать на полноценные expert pages, а не на набор вопросов ради rich results.

### 5.3. Нельзя клонировать пустые страницы
Не нужно создавать десятки страниц с одинаковым текстом, где меняется только фраза в заголовке.
Это ослабляет topical authority и создает thin content risk.

### 5.4. Нельзя писать только "про услугу"
Страница "ремонт вывесок" важна, но она не отвечает на конкретный симптом так хорошо, как symptom page.
Поэтому нужен гибрид:
- service page для коммерческого интента;
- troubleshooting page для диагностического интента.

### 5.5. Quality over language count (качество важнее количества языков)

Стартовая и постоянная GEO-ставка идёт через немецкую canonical-first (сначала каноническая немецкая версия) модель. Прежнее требование полного перевода каждой статьи на все шесть языков DE/EN/RU/TR/PL/AR имеет статус superseded/deprecated (заменено и устарело) с 2026-07-18.

Действующая языковая матрица:

- DE — основной язык и полный канонический контент;
- EN — поддерживаемая международная версия; приоритетные экспертные материалы переводятся после стабилизации немецкого оригинала;
- RU — опциональная поддерживаемая версия при подтверждённом бизнес-смысле, аудитории или разумной стоимости поддержки;
- TR/PL/AR — ключевые страницы: главная, услуги, контакты, формы и FAQ (частые вопросы); статьи не требуют обязательного перевода до подтверждённого спроса по трафику, запросам, заявкам или партнёрскому каналу.

Наличие интерфейса и ключевых страниц на шести языках остаётся частью продукта. Это не создаёт обязательства иметь одинаковый каталог статей на каждом языке. Уже опубликованные качественные переводы можно сохранять и поддерживать; удалять их только ради новой матрицы не требуется.

GEO (оптимизация для AI-ответов) оценивается не числом языковых копий, а полезностью и доказательностью источника. Ресурсы в первую очередь направляются на:

- канонические экспертные материалы, которые полно и точно закрывают тему;
- реальные кейсы, фотографии и проверяемые детали работ;
- ссылки на применимые нормы, DIN/VDE (немецкие технические нормы и электротехнические правила), официальные документы и материалы производителей;
- авторство, даты содержательного обновления и единообразную терминологию;
- внешнее доверие: независимые упоминания, релевантные ссылки, отзывы и профессиональные цитирования.

Перевод статьи на TR/PL/AR открывается как отдельная задача только после подтверждения спроса. Само отсутствие такой версии не считается дефектом GEO (оптимизации для AI-ответов) или обязательным CMS-долгом.

---

## 6. Контентная архитектура

### 6.1. Основная модель
Рекомендуемая модель:
- отдельный `Troubleshooting Hub`;
- отдельные category pages;
- отдельные symptom/problem pages;
- сильная перелинковка с service pages.

### 6.2. Почему отдельный hub нужен
Hub усиливает:
- topical authority;
- логичную индексацию по кластерам;
- навигацию для пользователя;
- вероятность, что AI увидит сайт как тематический узел, а не набор разрозненных страниц.

### 6.3. Как hub связан с услугами
Каждая problem page должна вести:
- к соответствующей услуге;
- к related problem pages;
- к кейсам;
- к intake.

И наоборот: service pages должны ссылаться на symptom pages.

### 6.4. Базовые кластеры
1. Световые вывески и LED
2. Объемные буквы и короба
3. Пленки, оклейка и витринная графика
4. Конструкции, крепления и безопасность
5. Диагностика, срочный выезд и обслуживание

---

## 7. Обязательные элементы problem page

Каждая symptom-based страница должна содержать:

### 7.1. Четкий H1
Формат:
- Почему моргает вывеска
- Что делать, если вывеска не светится
- Почему пленка на витрине отклеивается

### 7.2. Короткий ответ в начале
Сразу после H1 должен быть прямой ответ без длинного вступления.

### 7.3. Блок "Что это обычно означает"
Краткая диагностическая рамка:
- вероятная причина 1;
- вероятная причина 2;
- вероятная причина 3.

### 7.4. Блок "Что можно проверить безопасно"
Только безопасные действия без опасных советов.
Никаких инструкций, которые подталкивают пользователя к рискованной работе с электрикой или высотой.

### 7.5. Блок "Когда нужен срочный выезд"
Особенно важен для:
- запаха гари;
- влаги;
- искрения;
- шатающихся креплений;
- риска падения элементов.

### 7.6. Блок "Как мы обычно решаем такую проблему"
Здесь показывается сервисный процесс:
- диагностика;
- выезд;
- ремонт / замена;
- проверка результата.

### 7.7. Блок "Похожие проблемы"
Нужен для кластерной навигации и AI-понимания тематики.

### 7.8. Четкий CTA
Рекомендуемые формулы:
- Отправить фото проблемы
- Начать заявку на ремонт
- Нужна диагностика по объекту

---

## 8. Editorial rules

### 8.1. Писать для владельца бизнеса, а не для мастера
Тон должен быть:
- спокойным;
- понятным;
- не перегруженным терминами;
- сервисным, а не энциклопедическим.

### 8.2. Не обещать точную диагностику без осмотра
Формулировка должна быть вероятностной и ответственной:
- "чаще всего";
- "обычно";
- "одна из частых причин";
- "точную причину можно подтвердить после осмотра или по фото".

### 8.3. Не пугать, но и не сглаживать риск
Если есть безопасность или электричество, это нужно обозначать прямо.

### 8.4. Не писать как AI-генератор
Нельзя:
- раздувать текст без пользы;
- повторять одну мысль в пяти формулировках;
- штамповать одинаковые вступления;
- подменять практический совет общими фразами.

### 8.5. Доказывать реальность сервиса
Полезные сигналы:
- примеры типовых кейсов;
- фото до / после;
- mention of service area;
- нормальные контактные и business signals;
- связь с реальными услугами компании.

---

## 9. Technical implementation requirements

### 9.1. Crawlability and indexing
Нужно обеспечить:
- открытый доступ к важным страницам для поисковых систем;
- корректный `robots.txt`;
- XML sitemap;
- нормальную internal linking graph;
- отсутствие orphan pages.

### 9.2. Structured data baseline
Базовый набор:
- `Article`
- `BreadcrumbList`
- `Organization`
- `LocalBusiness`

Дополнительно по ситуации:
- `FAQPage`
- `HowTo`

Но только если это соответствует реальному содержанию страницы.

### 9.3. Semantic HTML
Нужны:
- `article`;
- `section`;
- корректная иерархия `h1-h3`;
- linkable heading anchors;
- понятные title и meta description.

### 9.4. Linkable fragments
У значимых секций должны быть стабильные id-якоря, чтобы можно было ссылаться на конкретный ответ или блок.

### 9.5. AI crawler policy
Если цель проекта — быть видимым в AI search, нельзя без причины блокировать соответствующих ботов.
Нужно отдельно проверить policy для:
- Googlebot;
- Bingbot;
- OAI-SearchBot и других retrieval crawlers, если бизнес хочет такую видимость.

### 9.6. Faster discovery
Для ускорения доставки новых URL в экосистему Bing / Copilot желательно использовать `IndexNow`, если это удобно на уровне платформы.

---

## 10. Language rollout

### 10.1. Старт
Сначала запускается немецкая версия как canonical-first слой.

### 10.2. Затем
После проверки:
- индексации;
- CTR / engagement;
- видимости symptom pages;
- качества intake-переходов

контент масштабируется на:
- EN
- RU
- TR
- PL
- AR

### 10.3. Важное правило
Локализация должна быть адаптацией, а не механическим переводом.
Симптомные запросы и разговорные формулировки отличаются по языкам.

---

## 11. Measurement

Нужно отслеживать:
- impressions и clicks по symptom-intent запросам;
- страницы, которые получают long-tail entrance traffic;
- переходы с problem pages в intake;
- страницы, которые чаще участвуют во внутренней перелинковке;
- рост тематического кластера по индексации;
- упоминания / referrals из AI-driven sources там, где они видны в аналитике.

---

## 12. Operational decision

### 12.1. Принятое направление
Для PixelRing принимается следующая модель:
- строим отдельный `Troubleshooting Hub`;
- не заменяем им service pages;
- используем symptom-first architecture как GEO-слой;
- делаем первый запуск на немецком языке;
- далее масштабируем на остальные локали.

### 12.2. Почему это правильно
Это дает лучший баланс между:
- поисковым спросом;
- полезностью для пользователя;
- шансом на AI-citation;
- коммерческой конверсией в заявку.

---
---

## 13. Progress Log

### 2026-05-24 | Letter-Out Multilingual CMS Sync

**Done:**
- Published `Не светится отдельная буква или часть вывески` (статья о проблеме, когда не светится буква или часть вывески) / `letter-out` (CMS slug, идентификатор статьи в CMS) into CMS/database (CMS/база данных) for all MVP locales (языки MVP): DE (немецкий), EN (английский), RU (русский), TR (турецкий), PL (польский), and AR (арабский).
- Added repeatable seed script (повторяемый скрипт загрузки) `npm run db:seed:article-letter-out`, which reads Markdown drafts (черновики Markdown) from `docs/07_content_ai_seo/problem_articles/буква или часть вывески не светится – 04/`.
- Populated SEO/GEO fields (поля поисковой и AI-оптимизации): `seoTitle`, `seoDescription`, `canonicalUrl`, `relatedSlugs`, `causes`, `safeChecks`, `urgentWarnings`, `serviceProcess`, and `workScopeFactors`.
- Confirmed via CMS public audit (аудит публичного CMS-контента) that `letter-out` (CMS slug, идентификатор статьи в CMS) is `PUBLISHED` (опубликована) and SEO-ready (готова к поисковой индексации) in all six locales.

**In Progress:**
- Owner visual review (визуальная проверка владельцем) of localized public article pages.

**Next Action:**
- After owner review (проверка владельцем), continue localizing remaining missing TR/PL/AR problem articles (статьи о проблемах), starting from the audit warnings.

**Blockers/Risks:**
- Audit WARN (предупреждения аудита) remains for other problem slugs (идентификаторы других статей о проблемах) with missing TR/PL/AR localized articles; these are unrelated to `letter-out` (CMS slug, идентификатор статьи в CMS).

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/problem_articles/README.md`
- `signage-service/scripts/seed-article-letter-out-all-locales.mjs`
- `signage-service/package.json`
- `signage-service/tmp/cms-public-content-audit.json`
- `signage-service/tmp/cms-public-content-audit.md`

### 2026-05-24 | Uneven LED Multilingual CMS Sync

**Done:**
- Published `LED светит неравномерно или пятнами` (LED светит неравномерно или пятнами) / `uneven-light` into CMS/database (CMS/база данных) for all MVP locales (языки MVP): DE (немецкий), EN (английский), RU (русский), TR (турецкий), PL (польский), and AR (арабский).
- Added repeatable seed script (повторяемый скрипт загрузки) `npm run db:seed:article-uneven-light`, which reads Markdown drafts (черновики Markdown) from `docs/07_content_ai_seo/problem_articles/led светит неравномерно – 03/`.
- Populated SEO/GEO fields (поля поисковой и AI-оптимизации): `seoTitle`, `seoDescription`, `canonicalUrl`, `relatedSlugs`, `causes`, `safeChecks`, `urgentWarnings`, `serviceProcess`, and `workScopeFactors`.
- Confirmed via CMS public audit (аудит публичного CMS-контента) that `uneven-light` is `PUBLISHED` (опубликована) and SEO-ready (готова к поисковой индексации) in all six locales.

**In Progress:**
- Owner visual review (визуальная проверка владельцем) of localized public article pages.

**Next Action:**
- After owner review (проверка владельцем), continue localizing remaining missing TR/PL/AR problem articles (статьи о проблемах), starting from the audit warnings.

**Blockers/Risks:**
- Audit WARN (предупреждения аудита) remains for other problem slugs with missing TR/PL/AR localized articles; these are unrelated to `uneven-light`.

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/problem_articles/README.md`
- `signage-service/scripts/seed-article-uneven-light-all-locales.mjs`
- `signage-service/package.json`
- `signage-service/tmp/cms-public-content-audit.json`
- `signage-service/tmp/cms-public-content-audit.md`

### 2026-05-24 | Uneven LED Article Publication

**Done:**
- Created a new RU markdown draft (русский черновик в Markdown) for `LED светит неравномерно или пятнами` in `docs/07_content_ai_seo/problem_articles/led светит неравномерно – 03/`.
- Preserved the owner-provided human technician logic (человеческая техническая логика): old signs often show LED degradation, new signs with spots suggest wrong LED selection/layout, and internal dirt can imitate failed diodes.
- Structured the draft according to `problem_article_rules.md` v2 (правила статей о проблемах): small card (маленькая карточка), modal (модальное окно), full article (полная статья), CMS fields (поля CMS) and internal AI note (служебная заметка для ассистента).
- Added official source notes (официальные источники) from Current / GE Tetra, SloanLED, MEAN WELL, Signify/Philips, DOE, IEA 4E, ams OSRAM, Lumileds, CIE, Springer and UL for technical grounding.
- Published the owner-approved final markdown (утверждённый финальный Markdown) to CMS/database (CMS/база данных) for `cms_articles.locale = ru` and `cms_articles.slug = uneven-light`.
- Verified local browser render (локальная проверка в браузере) at `/ru/probleme-loesungen/led-leuchtet-ungleichmaessig`: page title, short answer, and new content about visible LED points (видимые LED-точки) and `шахматка` render correctly.

**In Progress:**
- Owner can visually review (визуально проверить) the published local page.

**Next Action:**
- If owner approves the rendered page, keep this as the RU canonical version (русская каноническая версия) for future localization.

**Blockers/Risks:**
- Seed files (скрипты загрузки данных) were not updated; this publication was applied directly to CMS/database (CMS/база данных) from the markdown draft (черновик в Markdown).

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/problem_articles/led светит неравномерно – 03/problem_article_led_svetit_neravnomerno_ru.md`

### 2026-05-24 | Problem Article Rules v2

**Done:**
- Reworked `problem_article_rules.md` (правила статей о проблемах) into a short mandatory operational standard for future problem articles (статьи о проблемах).
- Added `problem_article_rules_master_ru.md` (расширенный главный справочник) with deeper editorial, safety, source, SEO/GEO (поисковая и AI-оптимизация), AI note (служебная заметка для ассистента), and CMS mapping (карта переноса в CMS) guidance.
- Replaced the risky section title `Советы по самостоятельному ремонту` (опасная формулировка про самостоятельный ремонт) with the safer operational title `Что можно безопасно проверить самостоятельно` (безопасные проверки без ремонта).
- Added explicit markdown draft (черновик в Markdown) to CMS (система управления контентом) field mapping for `title`, `symptomLabel`, `shortAnswer`, `content`, `causes`, `safeChecks`, `urgentWarnings`, `serviceProcess`, `workScopeFactors`, `relatedSlugs`, `seoTitle`, and `seoDescription`.

**In Progress:**
- Future problem article drafts (черновики статей о проблемах) should now follow the v2 short standard first and use the master standard (главный справочник) when deeper guidance is needed.

**Next Action:**
- Use the updated rules for the next rewrite of `LED светит неравномерно` before any CMS/database (CMS/база данных) update.

**Blockers/Risks:**
- Keep public article content separate from internal AI note (служебная заметка для ассистента); the internal AI note (служебная заметка для ассистента) must not be loaded into public `content`.

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/README.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/problem_article_rules.md`
- `docs/07_content_ai_seo/problem_article_rules_master_ru.md`

### 2026-05-22 | Problem Article Folder Workspace

**Done:**
- Reorganized problem article markdown drafts (черновики статей о проблемах) into numbered folders (номерные папки) under `docs/07_content_ai_seo/problem_articles/`.
- Current folders (текущие папки): `вывеска не светится – 01`, `вывеска мерцает – 02`, `новая статья – 03`, `новая статья – 04`, and `входящие новые статьи`.
- Moved the multilingual no-light drafts (многоязычные черновики `Вывеска не светится`) into `вывеска не светится – 01`.
- Moved the RU flicker draft (русский черновик `Вывеска мерцает`) into `вывеска мерцает – 02`.
- Updated the no-light seed script (скрипт загрузки `no-light`) to read markdown from the new folder path.

**In Progress:**
- Owner uses the numbered folder workflow (номерной процесс папок) for new source articles.

**Next Action:**
- Add new article source files (исходники новых статей) to the next numbered folder or `входящие новые статьи`, then edit and review before CMS/database loading (загрузка в CMS/базу данных).

**Blockers/Risks:**
- Keep seed scripts (скрипты загрузки) aligned with moved markdown paths (пути к Markdown), otherwise future CMS sync (синхронизация CMS) can read stale or missing files.

**Updated Documents / Code:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/problem_article_rules.md`
- `docs/07_content_ai_seo/problem_articles/README.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `signage-service/scripts/seed-article-no-light-all-locales.mjs`

### 2026-05-22 | No-Light Article CMS Publication

**Done:**
- Published (опубликована) full `no-light` article (полная статья о проблеме "вывеска не светится") into CMS/database (CMS/база данных) for all MVP locales (языки MVP): DE, EN, RU, TR, PL, AR.
- Added repeatable seed script (повторяемый скрипт загрузки) `npm run db:seed:article-no-light`, which reads markdown drafts (черновики Markdown), extracts only public full article content (только публичную полную статью), and upserts `cms_articles` (обновляет/создаёт CMS-статьи).
- Removed practical fallback gap (практический пробел fallback) for TR/PL/AR `no-light` article pages by creating published localized CMS records (опубликованные локализованные записи CMS).
- Verified database state (состояние базы данных): all six `no-light` records are `PUBLISHED` and have full article-sized content.
- Verified local HTTP render (локальный HTTP-рендер) for all six public URLs; each returns `200` and contains the expected full-article marker.

**In Progress:**
- Owner visual review (визуальная проверка владельцем) of `/ru/probleme-loesungen/werbeanlage-leuchtet-nicht` and localized article pages.

**Next Action:**
- If copy/layout is approved, use the same seed-script pattern (паттерн скрипта загрузки) for the next full problem articles (полные статьи о проблемах).

**Blockers/Risks:**
- Older bulk symptom seed scripts (старые пакетные скрипты загрузки symptom-статей) still exist; avoid running them as the final content source for `no-light` unless they are aligned with the dedicated full article seed (специальный seed для полной статьи).

**Updated Documents / Code:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `signage-service/package.json`
- `signage-service/scripts/seed-article-no-light-all-locales.mjs`
- `signage-service/scripts/seed-cms-support-articles.mjs`
- `signage-service/scripts/seed-cms-symptom-articles-en.mjs`
- `signage-service/scripts/seed-cms-symptom-articles-ru.mjs`
- CMS/database records (записи CMS/базы данных) for `cms_articles.slug = no-light` in `de`, `en`, `ru`, `tr`, `pl`, `ar`

### 2026-05-21 | Multilingual No-Light Problem Article Drafts

**Done:**
- Обновлена RU-статья `Вывеска не светится` (наружная вывеска не включается) как markdown draft (черновик в Markdown) для owner review (проверка владельцем).
- Созданы локализованные markdown drafts (черновики в Markdown) для DE (немецкий), EN (английский), TR (турецкий), PL (польский) и AR (арабский).
- Все версии сохраняют три уровня content structure (структура контента): small card (маленькая карточка), modal (модальное окно), full article (полная статья), плюс internal AI note (внутренняя заметка для базы знаний ассистента).
- Тексты адаптированы под локальный язык и сервисный тон, без дословного dictionary translation (словарного перевода).
- Сохранены safety boundaries (границы безопасности): не советовать вскрывать корпус, трогать проводку 220/230 В, менять блок питания без квалификации или работать на высоте без подходящего доступа.

**In Progress:**
- Owner review (проверка владельцем) шести markdown drafts (черновиков в Markdown).

**Next Action:**
- После owner approval (утверждение владельцем) синхронизировать approved content (утверждённый контент) с CMS/database (CMS/база данных) или seed scripts (скрипты загрузки), не раньше.

**Blockers/Risks:**
- TR/PL/AR (турецкий, польский, арабский) public article records (публичные записи статей) пока отсутствуют в CMS/database (CMS/база данных); эти markdown drafts (черновики в Markdown) не меняют runtime behavior (поведение сайта во время работы) до отдельной загрузки.
- AR (арабский) требует RTL-aware UI/content handling (учёт направления письма справа налево) при будущей загрузке в приложение.

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/problem_articles/вывеска не светится – 01/problem_article_vyveska_ne_svetitsya_ru.md`
- `docs/07_content_ai_seo/problem_articles/вывеска не светится – 01/problem_article_vyveska_ne_svetitsya_de.md`
- `docs/07_content_ai_seo/problem_articles/вывеска не светится – 01/problem_article_vyveska_ne_svetitsya_en.md`
- `docs/07_content_ai_seo/problem_articles/вывеска не светится – 01/problem_article_vyveska_ne_svetitsya_tr.md`
- `docs/07_content_ai_seo/problem_articles/вывеска не светится – 01/problem_article_vyveska_ne_svetitsya_pl.md`
- `docs/07_content_ai_seo/problem_articles/вывеска не светится – 01/problem_article_vyveska_ne_svetitsya_ar.md`

### 2026-05-21 | RU Flicker Article Knowledge Unit

**Done:**
- Обновлена RU-статья `Вывеска мерцает` для `/ru/probleme-loesungen/werbeanlage-flackert` (публичная страница проблемы) на основе текста техника и текущей SEO/GEO (поисковая и AI-видимость) структуры.
- Маленькая карточка на `/ru/probleme-loesungen` (страница `Проблемы и решения`) получила отдельные поля `Симптомы` (как клиент видит проблему) и `Причины` (вероятные причины), без повторяющегося текста о том, что делает PixelRing.
- Средняя карточка в modal (модальное окно) получила выделенный блок `Советы по самостоятельному ремонту` (безопасные самостоятельные действия) с предупреждением против работ без квалификации.
- CMS seed (скрипт загрузки CMS-данных) для `flicking/ru` обновляет полную статью, shortAnswer (короткий ответ), causes (причины), safeChecks (уточняющие данные), urgentWarnings (срочные признаки), serviceProcess (процесс диагностики) и workScopeFactors (факторы объёма работ).
- Сохранён markdown draft (черновик в Markdown) текущей статьи для чтения перед будущими загрузками в CMS/database (база данных).
- Создан active rules file (активный файл правил) для problem articles (статьи о проблемах): три слоя контента, owner review (проверка владельцем) до загрузки, safe self-repair (безопасные самостоятельные действия) и запрет AI-looking writing patterns (паттерны текста, похожего на искусственный интеллект).

**In Progress:**
- Owner review (проверка владельцем) трёх представлений: маленькая карточка, modal (модальное окно), full article (полная статья).

**Next Action:**
- Для следующих problem knowledge units (единицы знаний о проблемах) сначала писать markdown draft (черновик в Markdown) по `problem_article_rules.md` (правила структуры статьи), затем давать owner review (проверка владельцем), и только после подтверждения переносить в CMS/database (CMS/база данных).

**Blockers/Risks:**
- Self-repair advice (советы по самостоятельному ремонту) должен оставаться безопасным: нельзя рекомендовать вскрытие корпуса, работу с проводкой, замену блока питания или работу на высоте без квалификации.

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `docs/07_content_ai_seo/README.md`
- `docs/07_content_ai_seo/problem_article_rules.md`
- `docs/07_content_ai_seo/problem_articles/вывеска мерцает – 02/problem_article_vyveska_mercaet_ru.md`
- `signage-service/src/app/[locale]/probleme-loesungen/page.tsx`
- `signage-service/src/components/probleme-loesungen/ProblemKnowledgeGrid.tsx`
- `signage-service/scripts/seed-article-flicker-ru.mjs`

### 2026-05-16 | Google Indexing Crawlability Cleanup

**Done:**
- Added crawlable article links from the `Probleme & Lösungen` (проблемы и решения) overview cards so Googlebot (краулер Google) can discover symptom articles through normal internal links.
- Limited article `hreflang` (языковые alternate-ссылки) and `sitemap` (карта сайта) alternates to locales where the symptom article is actually published.
- Suppressed the automatic article HTTP `Link` (HTTP-заголовок со ссылками) header from `next-intl` (библиотека интернационализации Next.js) because it listed unpublished PL/TR/AR article URLs.
- Added temporary missing-locale article fallback: PL/TR/AR article URLs can show the English article for users, but metadata uses `noindex` (запрет индексации) and `canonical` (канонический URL) to the English article until real localized content exists.
- Article `lastmod` (дата последнего изменения в sitemap) now uses CMS article `updatedAt` (дата обновления записи CMS) instead of generating a fresh timestamp for every sitemap render.

**In Progress:**
- Live deployment and Google Search Console (панель Google для проверки индексации) validation are still pending.

**Next Action:**
- Deploy the app, verify live `/sitemap.xml` (карта сайта), inspect DE/EN/RU canonical article URLs and PL/TR/AR fallback article URLs in Google Search Console (панель Google для проверки индексации), then request indexing for German canonical pages first.

**Blockers/Risks:**
- PL/TR/AR article pages should remain temporary fallback pages until real localized content is published; they should not be added back to `hreflang` (языковые alternate-ссылки) or `sitemap` (карта сайта) as indexable articles before that.

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`
- `signage-service/src/app/sitemap.ts`
- `signage-service/src/lib/seo.ts`
- `signage-service/src/proxy.ts`
- `signage-service/src/app/[locale]/probleme-loesungen/[slug]/page.tsx`
- `signage-service/src/components/probleme-loesungen/ProblemKnowledgeGrid.tsx`
- `signage-service/src/components/probleme-loesungen/ProblemArticleBody.tsx`
- `signage-service/src/lib/cms/articles.ts`

### 2026-05-06 | Google Indexing Readiness
**Done:**
- Selected `https://www.pixel-ring.com` as the canonical public search domain for generated metadata, robots, and sitemap URLs.
- Added a Next.js metadata-file baseline for `robots.txt` and `sitemap.xml`.
- Scoped the sitemap to public localized marketing/content pages and kept CRM, CMS, status lookup, and portal surfaces out of the index path.

**In Progress:**
- Live deployment and Google Search Console submission are still pending.

**Next Action:**
- Deploy the app, verify `/robots.txt` and `/sitemap.xml` return `200`, submit the sitemap in Search Console, and request indexing for the German canonical pages first.

**Blockers/Risks:**
- Published CMS symptom article URLs are included only when the production CMS database is reachable during sitemap generation.

**Updated Documents:**
- `PROGRESS.md`
- `docs/07_content_ai_seo/geo_optimization_strategy.md`

### 2026-04-16 | CMS Localization Workspace (Stage 3)
**Done:**
- Refactored CMS Article Editor into a **Dual-Canonical Workspace**.
- Implemented **Split-View UI** allowing side-by-side editing of target content vs Reference Master (DE/EN).
- Added **Reference Tabs** to switch between German Master and English AI Master for source material.
- Integrated **Sync Tools**: One-click "Copy from Master" for technical fields (slugs, links, order).
- Launched **AI Translation API**: Field-level translation endpoint with technical context for PixelRing brand voice.
- Updated `EditorField` to show "Copy" and "AI" helpers only in split-view mode.

**Tech Details:**
- UI: `display: grid` with dynamic width adjustment (1440px max).
- Backend: `/api/cms/articles/translate-field` with OpenAI (gpt-4o-mini).
- Consistency: Form joins/splits arrays automatically for synchronized multi-line field editing.

**Next Action:**
- Monitor GPT-4o translation quality for Arabic (RTL) and Polish technical terms.
- Proceed with bulk content population using the new efficiency tools.
