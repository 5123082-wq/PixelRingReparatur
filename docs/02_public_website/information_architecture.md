# Документ 2
## Information Architecture & Page-by-Page Specification
### AI-first service company / one-stop service for signs, repairs, installation and branding

---

## 1. Назначение документа
Этот документ описывает:
- карту сайта;
- иерархию страниц;
- роль каждой страницы;
- цели страниц;
- обязательные блоки;
- CTA-логику;
- мультиязычные требования;
- mobile-first требования;
- требования к страницам для дизайна в Stitch;
- требования к страницам для реализации в Antigravity.

Это **первый прикладной документ после master brief**.
Он должен стать прямой основой для:
1. проектирования экранов в Stitch;
2. сборки компонентной структуры;
3. планирования routes и page templates;
4. постановки задач в Antigravity.

---

## 2. Архитектурный принцип сайта

### 2.1. Модель сайта
Сайт строится не как:
- каталог мастеров;
- маркетплейс;
- витрина подрядчиков;
- биржа заявок.

Сайт строится как:
- официальный сайт сервисной компании;
- one-stop service;
- единый центр приема и сопровождения задач;
- AI-assisted intake interface;
- multilingual trust-first service platform.

### 2.2. Главный архитектурный принцип
Пользователь не должен блуждать по сайту.
У сайта одна доминирующая цель:
**превратить входящий интерес в начатую заявку**.

Вторичные цели:
- объяснить модель сервиса;
- снять страхи;
- помочь выбрать сценарий;
- дать trust proof;
- дать путь для партнеров;
- подготовить SEO-структуру.

---

## 3. Карта сайта (MVP)

### 3.1. Верхний уровень
1. Главная
2. Услуги
3. Решения
4. Для бизнеса / сетевых клиентов
5. Примеры работ
6. Как это работает
7. О нас
8. Подать заявку / AI intake
9. Клиентский кабинет и статус заявки
10. Юридические страницы

Page briefs for the approved header-linked pages:

- `Услуги` -> `docs/02_public_website/page_brief_services.md`
- `Решения` -> `docs/02_public_website/page_brief_solutions.md`
- `Для бизнеса` -> `docs/02_public_website/page_brief_for_business.md`
- `Примеры работ` -> `docs/02_public_website/page_brief_references.md`
- `О нас` -> `docs/02_public_website/page_brief_about.md`

### 3.2. Услуги — второй уровень
1. Ремонт вывесок
2. Монтаж и демонтаж
3. Световая реклама
4. Новые вывески / изготовление
5. Брендирование и оклейка
6. Печать и сопутствующие рекламные материалы
7. Обслуживание нескольких точек / сетевых объектов

### 3.3. Юридические страницы
1. Impressum / Legal notice
2. Datenschutzerklärung / Privacy policy
3. AGB / Terms
4. Cookie policy
5. Политика обработки заявок
6. Политика взаимодействия с партнерами (internal/public split)

### 3.4. Специальные функциональные страницы
1. Быстрая заявка
2. Спасибо / подтверждение заявки
3. Продолжить в WhatsApp
4. Продолжить в Telegram
5. Голосовой сценарий / phone intake explainer
6. 404

---

## 4. Карта сайта (этап 2 / expansion)

После MVP можно добавить:
- гео-страницы по районам Берлина;
- страницы по типам объектов;
- SEO-страницы по типовым проблемам;
- страница обслуживания сетевых клиентов с отдельным funnel;
- tracking page заявки;
- Troubleshooting Hub / Knowledge Base (GEO-optimized);
- multilingual local landing pages.

---

## 5. Навигация сайта

### 5.1. Основное меню (desktop)
- Услуги
- Решения
- Для бизнеса
- Примеры работ
- Как это работает
- О нас

### 5.2. Secondary nav / utility layer
- Переключатель языка
- Кабинет и статус
- Подать заявку

### 5.3. Меню mobile
Mobile menu должно быть коротким.
Главный акцент — на CTA, а не на глубоком меню.

Рекомендуемый состав:
- Услуги
- Решения
- Для бизнеса
- Примеры работ
- Как это работает
- О нас
- Кабинет и статус
- Подать заявку

Отдельно sticky actions:
- Кабинет и статус
- Подать заявку

### 5.4. Навигационный принцип
Меню должно не “рассказывать всё”, а помогать быстро перейти:
- к пониманию сервиса;
- к типу решения;
- к действию.

### 5.5. Утвержденное решение по header (2026-04-22)
Текущее утвержденное направление для MVP:

- верхнее меню не должно выглядеть как каталог услуг, marketplace menu или набор разрозненных ссылок;
- основная навигация должна объяснять scope сервиса, варианты решения, бизнес-сценарии, proof layer, процесс и саму компанию;
- иконки мессенджеров убираются из header, чтобы не размывать главный CTA и не перегружать utility-слой;
- `Статус` как отдельная utility-ссылка заменяется на объединенную защищенную точку входа `Кабинет и статус`;
- `Заказать ремонт` заменяется на более широкий CTA `Подать заявку`, чтобы navigation не ограничивала продукт только repair-intent сценарием.

Финальная логика header для всех локалей:

- основное меню: `Услуги`, `Решения`, `Для бизнеса`, `Примеры работ`, `Как это работает`, `О нас`;
- правый блок: переключатель языка, `Кабинет и статус`, `Подать заявку`.

Принцип мультиязычности:

- IA, порядок пунктов и смысловые роли header должны оставаться одинаковыми в `DE`, `EN`, `RU`, `TR`, `PL`, `AR`;
- меняются только локализованные labels;
- немецкая версия остается canonical-first для терминологии и дальнейшей CMS-настройки;
- Arabic version обязана сохранять RTL-aware layout без изменения структуры header.

### 5.6. Временный принцип запуска header до готовности новых страниц
До появления полноценных отдельных страниц новый header не должен вести на `404`.

Правило запуска:

- сначала обновляется визуальная и структурная модель header;
- затем новые отдельные страницы запускаются по one-by-one сценарию;
- до их готовности допускаются только безопасные временные маршруты или временные anchors;
- `Кабинет и статус` остается защищенной клиентской точкой входа, а не публичной маркетинговой страницей.

---

## 6. Языковая архитектура

### 6.1. Языки MVP
- DE
- EN
- RU
- TR
- PL
- AR

### 6.2. Языковой приоритет
Немецкая версия — canonical first version.

### 6.3. Правила мультиязычности
- все важные страницы должны существовать на всех 6 языках;
- формы, CTA, FAQ и системные состояния локализуются полностью;
- язык пользователя сохраняется в заявке;
- язык влияет на handoff и дальнейшие шаблоны сообщений;
- SEO-мета и URL-структура должны быть предусмотрены сразу.

### 6.4. UX языкового переключателя
- заметен в хедере;
- доступен на мобильном;
- не скрыт глубоко в меню;
- не ломает funnel;
- при переключении сохраняет текущую страницу и сценарий.

---

## 7. CTA-архитектура

### 7.1. Основной CTA сайта
**Подать заявку**

### 7.2. Вторичные CTA
- Отправить фото
- Написать в WhatsApp
- Написать в Telegram
- Позвонить
- Нужна помощь

### 7.3. CTA-иерархия
1. Начать заявку
2. Отправить фото
3. Продолжить в мессенджере
4. Позвонить

### 7.4. CTA-принцип
На каждой странице должен быть:
- 1 основной CTA;
- 1–2 поддерживающих CTA;
- не более.

---

## 8. Страница 1 — Главная

### 8.1. Цель страницы
- дать ощущение реальной компании;
- показать one-stop service model;
- снять страх “это агрегатор”;
- быстро запустить сценарий заявки;
- помочь понять, что делать дальше.

### 8.2. Conversion goal
Primary: start lead intake

## Progress Log

### 2026-04-23 — Header IA To Delivery Bridge

- Current sprint/block: Public Website navigation update, Step 1
- Done: approved header structure fixed in IA; separate page briefs prepared for `Услуги`, `Решения`, `Для бизнеса`, `Примеры работ`, `О нас`; temporary non-404 launch principle for the new header documented
- In progress: code implementation of the new header and safe interim route mapping before standalone pages are built
- Next action: update the live header component, its CMS/global-navigation contract, and locale fallbacks without touching footer
- Blockers/risks: dedicated public pages for the new menu items do not exist yet in code; current header is still tied to old CMS/global nav fields and existing seeded data
- Updated documents: `docs/02_public_website/README.md`, `docs/02_public_website/information_architecture.md`, `docs/02_public_website/page_brief_services.md`, `docs/02_public_website/page_brief_solutions.md`, `docs/02_public_website/page_brief_for_business.md`, `docs/02_public_website/page_brief_references.md`, `docs/02_public_website/page_brief_about.md`

### 2026-04-24 — Header Responsive Layout Fix

- Current sprint/block: Public Website navigation update, responsive header pass
- Done: live header component changed to a two-row desktop layout: brand and utility actions stay in the first row, text navigation moves to a separate row; long localized labels are kept on one line
- In progress: visual QA across all MVP locales and narrower tablet/mobile widths
- Next action: confirm the same header behavior in EN, RU, TR, PL, and AR after locale content stabilizes
- Blockers/risks: dedicated public pages for the new menu items are still not implemented; interim routes must remain non-404 until page rollout
- Updated documents: `PROGRESS.md`, `docs/02_public_website/information_architecture.md`

### 2026-04-24 — Header Scroll Collapse Interaction

- Current sprint/block: Public Website navigation update, desktop sticky header interaction
- Done: desktop secondary navigation now collapses after the page is scrolled; a centered notch-style control expands horizontally and slightly downward to reveal the same links on hover, focus, or click
- In progress: visual QA for notch expansion across supported desktop locales
- Next action: verify desktop collapsed-menu behavior together with the dedicated page rollout once final routes replace interim links
- Blockers/risks: dedicated public pages for the new menu items are still not implemented; interim routes must remain non-404 until page rollout
- Updated documents: `PROGRESS.md`, `docs/02_public_website/information_architecture.md`, `signage-service/src/components/layout/Header.tsx`

### 2026-04-25 — Leistungen Page Plan Approved

- Current sprint/block: Public Website, first dedicated header-linked page rollout
- Done: external research output for `Leistungen` reviewed against PixelRing product guardrails and current implementation constraints; owner confirmed service area, partner wording, service contracts, 20% benefit condition, warranty wording, Druckprodukte/Branding scope, replacement/new-construction wording, on-site checks, and electric/LED/neon scope
- In progress: documentation handoff before implementation
- Next action: implement `leistungen` CMS/page-key support and public route, then build the visual service landing page from the approved plan
- Blockers/risks: final German microcopy and visual assets still need implementation-level review; service-intent persistence into CRM is planned but should not block first route launch
- Updated documents: `docs/02_public_website/page_plan_leistungen.md`, `docs/02_public_website/page_brief_services.md`, `docs/02_public_website/README.md`, `docs/02_public_website/information_architecture.md`, `PROGRESS.md`

### 2026-04-25 — Probleme & Loesungen Page Plan Approved

- Current sprint/block: Public Website, second dedicated header-linked page rollout
- Done: owner approved the SEO/IA direction for the current `Solutions` slot: German menu label `Probleme & Loesungen`, route `/probleme-loesungen`, SEO title `Probleme mit Werbeanlagen? Typische Schaeden & Loesungen | PixelRing`, H1 `Typische Probleme mit Werbeanlagen erkennen und richtig loesen`, and FAQ as a page section rather than the page identity
- In progress: developer handoff before implementation
- Next action: implement the dedicated multilingual `/[locale]/probleme-loesungen` page and replace temporary `/support#symptoms` navigation links without changing existing support articles
- Blockers/risks: active CMS global navigation records may still contain `/support#symptoms` and may require a data update after code/seed changes
- Updated documents: `docs/02_public_website/page_plan_solutions.md`, `docs/02_public_website/page_brief_solutions.md`, `docs/02_public_website/README.md`, `docs/02_public_website/information_architecture.md`, `PROGRESS.md`

### 2026-04-25 — Probleme & Loesungen MVP Implemented

- Current sprint/block: Public Website, second dedicated header-linked page rollout
- Done: route `/[locale]/probleme-loesungen` implemented for all MVP locales; header now uses the approved label and route; stale CMS global navigation links to `/support#symptoms` are normalized at read time; CMS/admin page key and baseline seed support added; existing support articles were not changed
- In progress: visual QA and future CMS editor refinement for page-specific blocks
- Next action: inspect the page in browser across desktop/mobile and decide whether to seed/update live CMS global navigation data
- Blockers/risks: current lint command still reports pre-existing unrelated issues in older files; production/staging CMS data may still need a seed/data update for stored records even though runtime navigation is normalized
- Updated documents: `PROGRESS.md`, `docs/02_public_website/page_plan_solutions.md`, `docs/02_public_website/information_architecture.md`
Secondary: go to messaging channel / service page / how it works

### 8.3. Ключевые сообщения страницы
- Вы обращаетесь в одну сервисную компанию
- Мы принимаем и сопровождаем задачу
- AI только ускоряет прием обращения
- Дальше подключается профильный специалист
- Не нужно искать исполнителя самостоятельно

### 8.4. Обязательные секции
1. Hero
2. Почему нам доверяют
3. Как вам удобнее оставить задачу
4. Какие задачи мы берем
5. Как это работает
6. Почему это удобнее и выгоднее
7. Кейсы / proof section
8. Что будет после заявки
9. FAQ
10. Финальный CTA

### 8.5. Компоненты страницы
- language switcher
- sticky mobile CTA
- intake trigger
- photo upload trigger
- messenger trigger
- trust cards
- scenario cards
- FAQ accordion

### 8.6. UX notes for Stitch
- hero должен сразу показывать сервисный бренд, а не список услуг;
- первый экран не должен быть визуально похож на lead marketplace;
- section density умеренная;
- визуальный ритм: hero → trust → action → proof → process → CTA.

### 8.7. Antigravity notes
- hero / trust / scenario / FAQ / CTA должны быть отдельными reusable sections;
- intake trigger должен быть общим компонентом;
- language logic должна быть глобальной;
- sticky CTA должен быть отдельным mobile behavior component.

---

## 9. Страница 2 — Как это работает

### 9.1. Цель страницы
Подробно объяснить сервисную модель и снять недоверие к AI.

### 9.2. Conversion goal
Convince + route into application flow

### 9.3. Ключевые сообщения
- AI не заменяет компанию и не заменяет специалиста;
- AI помогает быстрее принять задачу;
- компания организует дальнейший процесс;
- клиенту не нужно искать мастера самому;
- заявка не теряется и не уходит на открытый рынок.

### 9.4. Обязательные секции
1. Intro hero
2. Схема 3 шагов
3. Что делает AI
4. Что делает профильный специалист
5. Как происходит handoff
6. Что получает клиент
7. FAQ по процессу
8. CTA

### 9.5. UX notes
- использовать диаграммы и flow visuals;
- избегать технического jargon;
- дать прозрачность без перегруза.

---

## 10. Страница 3 — Услуги (hub)

### 10.1. Цель страницы
Дать понятный вход в группы услуг без ощущения перегруженного каталога.

### 10.2. Conversion goal
Route to relevant service page or direct intake

### 10.3. Обязательные секции
1. Hero
2. Группы услуг
3. Типовые задачи
4. Когда обращаться
5. CTA

### 10.4. Формат представления
Лучше карточки service groups, а не длинный текст.

### 10.5. Service groups
- Ремонт вывесок
- Монтаж и демонтаж
- Световая реклама
- Новые вывески
- Брендирование / оклейка
- Печать / сопутствующие работы
- Мульти-локации / обслуживание сети

---

## 11. Страница 4 — Ремонт вывесок

### 11.1. Цель страницы
Собрать высокоинтентный трафик и быстро перевести в заявку.

### 11.2. Conversion goal
Start repair intake

### 11.3. Ключевые сообщения
- не нужно знать технические термины;
- можно начать с фото;
- компания принимает проблему и организует следующий шаг;
- подходит и для срочного, и для планового сценария.

### 11.4. Обязательные секции
1. Hero
2. Какие проблемы мы решаем
3. Типовые поломки
4. Что можно прислать для старта
5. Как проходит процесс
6. FAQ
7. CTA

### 11.5. Recommended CTA
- Отправить фото поломки
- Начать заявку на ремонт

---

## 12. Страница 5 — Монтаж и демонтаж

### 12.1. Цель страницы
Покрыть монтажный сценарий и связанные заявки.

### 12.2. Обязательные секции
1. Hero
2. Типы монтажных задач
3. Когда нужен демонтаж
4. Что нужно для старта
5. Как организуется выезд / выполнение
6. CTA

### 12.3. Особый акцент
Показывать организованность и надежность, а не “свободных исполнителей”.

---

## 13. Страница 6 — Световая реклама

### 13.1. Цель страницы
Подать услугу как отдельную специализацию.

### 13.2. Обязательные секции
1. Hero
2. Типы световых решений
3. Типовые неисправности / задачи
4. Обслуживание и замена элементов
5. CTA

---

## 14. Страница 7 — Новые вывески / изготовление

### 14.1. Цель страницы
Закрывать сценарий “нужна новая вывеска” без ухода на сторонние агентства.

### 14.2. Обязательные секции
1. Hero
2. Виды вывесок
3. От идеи до установки
4. Что нужно для расчета
5. CTA

---

## 15. Страница 8 — Брендирование и оклейка

### 15.1. Цель страницы
Объединить витрины, пленки, транспорт, branding-related work.

### 15.2. Обязательные секции
1. Hero
2. Что входит
3. Типовые объекты
4. Что можно прислать
5. CTA

---

## 16. Страница 9 — Печать и сопутствующие работы

### 16.1. Цель страницы
Не делать это главным направлением бренда, но сохранить cross-sell зону.

### 16.2. Обязательные секции
1. Hero
2. Примеры продукции
3. Для кого подходит
4. CTA

---

## 17. Страница 10 — Для бизнеса / сетевых клиентов

### 17.1. Цель страницы
Сделать отдельный high-trust сценарий для multi-location clients.

### 17.2. Conversion goal
Lead capture for business accounts / multi-site service requests

### 17.3. Ключевые сообщения
- одна точка входа для нескольких адресов;
- единый формат обработки заявок;
- сопровождение по сети объектов;
- сервисная модель удобнее хаотического поиска локальных подрядчиков.

### 17.4. Обязательные секции
1. Hero
2. Для кого этот формат
3. Какие задачи можно централизовать
4. Как строится обслуживание нескольких точек
5. CTA

---

## 18. Страница 11 — Кейсы / примеры задач

### 18.1. Цель страницы
Усилить доверие через реальные сценарии и outcomes.

### 18.2. Формат
Короткие, понятные карточки кейсов.

### 18.3. Обязательные секции
1. Intro
2. Filter by scenario
3. Case cards
4. CTA

### 18.4. Рекомендуемые фильтры
- Ремонт
- Монтаж
- Новая вывеска
- Световая реклама
- Брендирование
- Для бизнеса

---

## 19. Страница 12 — Для мастеров / партнеров

### 19.1. Цель страницы
Набирать исполнителей, не разрушая клиентский бренд.

### 19.2. Важное ограничение
Страница не должна быть вынесена в центр клиентской коммуникации.

### 19.3. Обязательные секции
1. Hero
2. Кому подходит
3. Что получает партнер
4. Как происходит подключение
5. Требования
6. Форма заявки

### 19.4. Тон страницы
Профессиональный, фильтрующий, без масс-маркета.

---

## 20. Страница 13 — Контакты

### 20.1. Цель страницы
Усилить ощущение реальной компании и дать fallback-point.

### 20.2. Обязательные секции
1. Hero / short intro
2. Контактные каналы
3. Адрес / service area
4. Время связи
5. CTA на заявку

### 20.3. Особый акцент
Контакты не должны выглядеть как запасной угол сайта. Это часть trust-system.

---

## 21. Страница 14 — Быстрая заявка / intake page

### 21.1. Цель страницы
Максимально быстро конвертировать пользователя в квалифицированную заявку.

### 21.2. Conversion goal
Complete or start lead intake

### 21.3. Структура страницы
1. Short trust intro
2. Выбор сценария
3. Progressive form / AI intake
4. Upload photo
5. Choose channel
6. Confirmation

### 21.4. Поля уровня 1
- тип задачи
- адрес / район
- фото / видео
- имя
- канал связи
- телефон / messenger

### 21.5. Поля уровня 2
- срочность
- размеры
- комментарий
- доступ на объект
- дополнительные материалы

### 21.6. UX требования
- только один вопрос или один небольшой step за раз;
- progress indicator;
- возможность skip;
- mobile-first;
- уменьшение anxiety через microcopy.

---

## 22. Страница 15 — Спасибо / подтверждение заявки

### 22.1. Цель страницы
Не оставлять пользователя в подвешенном состоянии.

### 22.2. Обязательные секции
1. Подтверждение получения
2. Что будет дальше
3. Как продолжить в WhatsApp / Telegram
4. Что можно еще отправить
5. Контактный fallback

### 22.3. Ключевое сообщение
Заявка принята компанией и будет обработана по понятному процессу.

---

## 23. Страница 16 — Messenger handoff pages

### 23.1. Назначение
Специальные промежуточные страницы для перехода в WhatsApp / Telegram.

### 23.2. Что должно быть
- что произойдет после перехода;
- какой текст стартует разговор;
- что лучше подготовить;
- fallback CTA назад на сайт.

---

## 24. Страница 17 — Юридические страницы

### 24.1. Их роль
Не просто compliance, а часть trust infrastructure.

### 24.2. Что важно
- легкость нахождения;
- качественный layout;
- мультиязычная доступность там, где необходимо;
- отсутствие ощущения "скрытых условий".

---

## 25. Компонентная карта для Stitch

### 25.1. Core sections
- Hero
- Trust cards
- Channel selector
- Scenario cards
- Process flow
- Value explanation block
- Case cards
- FAQ accordion
- Final CTA

### 25.2. Service page components
- Service hero
- Problem grid
- Process block
- What to send block
- Proof strip
- CTA module

### 25.3. Intake components
- Step selector
- Upload module
- Messenger handoff card
- Phone / voice card
- Confirmation panel

### 25.4. Layout rules for Stitch
- section-based modular design;
- consistent CTA placements;
- multilingual text expansion tolerance;
- mobile-first hierarchy;
- strong visual distinction between trust / action / proof / process.

---

## 26. Routing rules for Antigravity

### 26.1. URL structure (conceptual)
- /de/
- /en/
- /ru/
- /tr/
- /pl/
- /ar/

### 26.2. Core page slugs
- /
- /how-it-works
- /services
- /services/sign-repair
- /services/installation
- /services/light-advertising
- /services/new-signs
- /services/branding
- /services/print
- /business
- /cases
- /partners
- /contact
- /start
- /thank-you

### 26.3. Dynamic concerns
- locale-aware routing;
- locale persistence;
- form state persistence;
- handoff state preservation;
- directionality support for Arabic.

---

## 27. Mobile-first requirements

### 27.1. На мобильном главное важнее меню
Нужно проектировать не “responsive desktop”, а мобильный сервисный интерфейс.

### 27.2. Обязательные mobile behaviors
- sticky CTA;
- one-thumb action zones;
- upload photo in 1–2 taps;
- messenger triggers above the fold;
- compressed but visible trust proof;
- short section spacing;
- readable multilingual typography.

### 27.3. Mobile pitfalls
- слишком длинный hero;
- сложные grids;
- слишком мелкий language switcher;
- hidden CTA;
- перегруженные формы.

---

## 28. SEO-архитектура

### 28.1. SEO-priority layers
Layer 1:
- homepage
- services hub
- sign repair
- installation
- light advertising
- branding

Layer 2:
- business page
- cases
- geo pages
- problem pages

### 28.2. SEO-rule
SEO-страницы не должны ломать trust-first UX.

### 28.3. Content rule
Любая SEO-страница должна быстро вести к заявке, а не быть только статьей.

---

## 29. Design-to-build readiness checklist

Документ можно считать готовым к передаче в Stitch, если:
- есть карта сайта;
- описана каждая страница;
- понятны page goals;
- понятны обязательные блоки;
- понятна CTA-архитектура;
- учтены 6 языков;
- учтен mobile-first;
- понятны section patterns.

Документ можно считать готовым к передаче в Antigravity, если:
- страницы можно разложить на reusable sections;
- понятны routing needs;
- понятны intake flows;
- понятны integrations touchpoints;
- понятны locale rules.

---


---

## 31. Troubleshooting Hub (GEO / Knowledge Base)

### 31.1. Цель раздела
Стать основным источником ответов для ИИ-поисковиков и помочь пользователям диагностировать проблему до обращения.

### 31.2. Структура каждой страницы "Проблема-Решение"
1. **Заголовок (Вопрос)**: "Почему вывеска моргает?"
2. **Atomic Answer**: Короткий ответ в блоке blockquote для ИИ.
3. **Описание симптомов**: Как пользователь видит проблему.
4. **Причины**: Список возможных технических неисправностей.
5. **Решение (наш сервис)**: Как мы это исправляем и почему это нельзя делать самостоятельно.
6. **CTA**: "Записаться на диагностику" или "Отправить фото поломки".

### 31.3. Технические требования (GEO)
- Обязательная разметка HowTo или FAQPage.
- Уникальные ID для каждого подзаголовка.
- Плотность LSI-ключей (технические термины + разговорные описания).

---

## 32. Что делать следующим документом

Следующий документ после этого:
**UX / Customer Journey / Conversion Flows**

Почему:
- IA уже даст структуру страниц;
- теперь нужно описать поведение пользователя внутри этих страниц;
- затем уже можно детализировать AI-сценарии.

---

## Progress Log

### 2026-05-12 — Homepage Process Block Content Updated

- Current sprint/block: Public Website, homepage page-by-page content review, `Wie es funktioniert` block
- Done: owner approved the human-readable process direction; updated fallback message files and published CMS `home/bentoSection` blocks across DE, EN, RU, TR, PL, and AR; separated the final line of each step into a highlighted `highlight` field; changed the layout to 40/30/30 for the first row and 30/70 for the second row; changed the wide accent card from step 4 to step 5; added a result photo and reused PixelRing service stamp on the fifth card; removed marketplace-style expert matching and absolute guarantee wording from this block; updated Block 9 CTA guidance from `Anfrage starten` to `Anfrage stellen`
- In progress: owner visual/content review of the updated process block before moving to the next homepage section
- Next action: collect owner comments on `Wie es funktioniert`, then continue with the next visible homepage block after approval
- Blockers/risks: remaining homepage sections still contain older claims around speed, guarantee, network, and geography and must be reviewed block by block
- Updated documents: `PROGRESS.md`, `docs/02_public_website/information_architecture.md`, `docs/01_strategy/new/Block 9 — Messaging & Conversion.md`

### 2026-05-12 — Homepage Hero Content Review Started

- Current sprint/block: Public Website, homepage page-by-page content review, hero block
- Done: approved new SEO+B2B hero wording for DE, EN, RU, TR, PL, and AR; updated fallback message files and published CMS `home` hero blocks; preserved the existing `24h / Reaktionszeit für dringende Fälle` badge
- In progress: owner visual/content review of the updated hero before moving to the next homepage block
- Next action: collect owner comments on the hero, then continue with the next homepage section only after approval
- Blockers/risks: remaining homepage sections still contain older claims around speed, guarantee, network, and geography and must be reviewed block by block
- Updated documents: `PROGRESS.md`, `docs/02_public_website/information_architecture.md`

### 2026-05-04 — DE Production QA Cleanup

- Current sprint/block: external DE audit follow-up for broken links, demo exposure, mixed-language copy, duplicate public content, and crawler-visible defects.
- Done: added legacy redirects for `/[locale]/services/[slug]` to `/[locale]/leistungen` and `/[locale]/contact` to `/#kontakt`; blocked portal demo in `NODE_ENV=production`; cleaned DE fallback/CMS seed copy for mixed RU/DE and EN strings; normalized CMS text output for common DE transliteration, missing spaces after periods, test alt text, and known dirty production snippets; removed tripled DOM rendering from homepage excellence/reviews carousels; localized hardcoded DE business audit labels; revised legal rendering so `privacy/de` keeps the DOCX-aligned published CMS text, while `impressum/de` rejects old TMG content separately; updated the production `impressum/de` CMS row to DDG with a revision snapshot.
- In progress: ready for deploy and external production re-audit.
- Next action: deploy the application and run the same QA links against `https://www.pixel-ring.com/de`, especially `/de/privacy` and `/de/impressum` via both browser and raw HTML fetch.
- Blockers/risks: legal CMS validation is page-specific now; future legal edits still need owner-approved source text before publication.
- Updated documents: `PROGRESS.md`, `docs/02_public_website/information_architecture.md`.

---

Конец документа 2.
