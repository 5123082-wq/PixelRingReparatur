# Документ 10
## Marketing Analytics, User Behavior & Research Framework
### Post-launch measurement system for an AI-first multilingual one-stop service platform

---

## 1. Назначение документа
Этот документ описывает, как после запуска сайта:
- отслеживать активность пользователей;
- понимать, как люди пользуются сайтом;
- видеть, какими языками пользуются;
- измерять конверсию и drop-off;
- понимать, какие каналы работают лучше;
- строить пользовательские и маркетинговые исследования;
- принимать решения по продукту, контенту и маркетингу на основе данных.

Документ нужен, чтобы после запуска сайт не стал “черным ящиком”.

---

## 2. Главный принцип маркетинговой аналитики

### 2.1. Что на самом деле нужно бизнесу
Не просто “посмотреть посещаемость”, а понимать:
- кто приходит;
- с какого канала;
- на каком языке;
- на каком шаге уходит;
- какой путь приводит к заявке;
- где сайт теряет доверие;
- какие сценарии реально работают.

### 2.2. Главная аналитическая формула
**Источник → язык → сценарий → поведение → заявка → handoff → результат.**

### 2.3. Важный принцип
Маркетинговая аналитика должна быть связана не только с трафиком, но и с:
- intake;
- AI layer;
- handoff;
- human follow-up;
- final outcome.

---

## 3. Что именно нужно отслеживать

### 3.1. Уровень трафика
- откуда пришел пользователь;
- на какую страницу попал;
- какой язык интерфейса выбрал;
- какое устройство использует;
- новый это пользователь или returning.

### 3.2. Уровень поведения
- что нажал;
- как далеко дошел;
- начал ли заявку;
- загрузил ли фото;
- ушел ли в WhatsApp / Telegram;
- включил ли звонок / voice path;
- где остановился.

### 3.3. Уровень заявки
- какой тип задачи оставил;
- на каком языке;
- через какой канал;
- completed ли intake;
- дошел ли до человека.

### 3.4. Уровень бизнес-результата
- сколько заявок создано;
- сколько квалифицировано;
- сколько дошло до handoff;
- сколько реально обработано;
- какие языки и каналы дают лучшие лиды;
- где выше потери.

---

## 4. Что должно быть в админке, а что не обязательно

### 4.1. Что должно быть в admin / operations dashboard
Это данные, нужные команде каждый день:
- новые лиды;
- лиды по статусам;
- лиды по языкам;
- лиды по каналам;
- срочные обращения;
- handoff status;
- assignment delays;
- conversion from intake to qualified lead.

### 4.2. Что можно держать во внешней аналитике / BI
Это данные для product и marketing анализа:
- traffic sources;
- page performance;
- funnel drop-off;
- CTA click maps;
- language conversion comparison;
- cohort behavior;
- A/B test results;
- campaign performance.

### 4.3. Практический вывод
**Операционные метрики — в админке.**
**Маркетинговая и продуктовая аналитика — во внешнем аналитическом слое или BI-панели.**

---

## 5. Основные аналитические уровни

### 5.1. Layer 1 — Traffic analytics
Что показывает:
- кто приходит;
- с какого канала;
- на какую страницу;
- в каком языке;
- с какого устройства.

### 5.2. Layer 2 — Product / UX analytics
Что показывает:
- как ведет себя пользователь внутри сайта;
- где начинается и ломается funnel;
- что нажимают;
- как идут по сценариям;
- где теряется доверие.

### 5.3. Layer 3 — Lead / ops analytics
Что показывает:
- как сайт превращает трафик в заявки;
- какие лиды реальные, а какие слабые;
- как работает handoff;
- какие языки / каналы дают качественные обращения.

### 5.4. Layer 4 — Research layer
Что показывает:
- почему пользователь так делает;
- чего он боится;
- какие тексты не работают;
- что он не понимает;
- почему уходит.

---

## 6. Главные KPI после запуска

### 6.1. Traffic KPIs
- sessions
- users
- traffic source mix
- landing page performance
- device split
- language split

### 6.2. Product KPIs
- hero CTA CTR
- intake start rate
- intake completion rate
- photo upload rate
- messenger continuation rate
- voice entry usage rate
- bounce rate on homepage
- drop-off by intake step

### 6.3. Lead KPIs
- qualified lead rate
- handoff rate
- time to handoff
- time to first human contact
- completion-to-operator visibility rate
- language-to-lead conversion

### 6.4. Business KPIs
- leads by language
- leads by source
- qualified leads by source
- qualified leads by language
- business leads vs regular leads
- multi-location inquiry rate
- repeat lead rate

---

## 7. Языковая аналитика

### 7.1. Что обязательно измерять по языкам
- visits by language
- bounce by language
- CTA click rate by language
- intake start by language
- intake completion by language
- handoff by language
- qualified lead rate by language
- top pages by language
- channel preference by language

### 7.2. Зачем это нужно
Чтобы понять:
- какие языки реально востребованы;
- где UX или copy ломаются в локализации;
- где какие каналы лучше работают;
- стоит ли усиливать отдельные языковые версии.

### 7.3. Примеры важных вопросов
- Пользователи на каком языке чаще начинают заявку?
- На каком языке чаще уходят в WhatsApp?
- На каком языке выше bounce?
- На каком языке хуже AI completion?
- Какие языки дают больше качественных лидов?

---

## 8. Канальная аналитика

### 8.1. Каналы, которые нужно сравнивать
- organic search
- paid traffic
- direct
- social
- referrals
- WhatsApp-first users
- Telegram-first users
- phone / voice-first users
- repeat visitors

### 8.2. Важные вопросы
- какой канал приводит самых качественных лидов;
- какой канал дает больше всего заявок;
- какой канал дает слабые или неполные лиды;
- какой канал чаще выбирают пользователи разных языков.

### 8.3. Что считать качеством канала
Не только трафик, но:
- lead completion;
- handoff success;
- qualified lead rate;
- скорость follow-up;
- реальный operational outcome.

---

## 9. Funnel analytics

### 9.1. Базовый funnel
1. Visit
2. Viewed hero
3. Clicked CTA
4. Started intake
5. Reached step 2
6. Uploaded photo / added details
7. Completed intake
8. Handoff created
9. Human follow-up started
10. Qualified lead

### 9.2. Что важно видеть
- где больше всего потерь;
- какие шаги самые тяжелые;
- какие языки / устройства проваливаются;
- какой CTA работает лучше;
- как влияют фото, мессенджеры и голос.

### 9.3. Отдельные funnels
Нужно строить отдельные funnels для:
- homepage → intake;
- service page → intake;
- messenger handoff;
- photo-first path;
- urgent repair path;
- business path;
- each language group.

---

## 10. CTA analytics

### 10.1. Что отслеживать
- какой CTA чаще нажимают;
- в каком месте страницы;
- на каком языке;
- с какого устройства;
- после какого trust блока.

### 10.2. Ключевые CTA
- Начать заявку
- Отправить фото
- WhatsApp
- Telegram
- Позвонить
- Получить помощь

### 10.3. Что это дает
Позволяет понять:
- какой вход кажется пользователю самым безопасным;
- чего люди боятся;
- как лучше менять приоритеты CTA.

---

## 11. User behavior analytics

### 11.1. Что изучать в поведении
- depth of scroll;
- section engagement;
- click paths;
- rage clicks / repeated attempts;
- time to first action;
- hesitation points;
- backtracking between pages.

### 11.2. На что это отвечает
- слишком ли длинная главная;
- слишком ли сложный первый экран;
- понятна ли структура;
- где пользователи сомневаются.

---

## 12. Intake analytics

### 12.1. Что обязательно измерять
- intake start rate;
- completion rate;
- average step count to completion;
- drop-off per step;
- photo upload rate;
- preferred contact method;
- preferred language at intake;
- time to completion.

### 12.2. Что особенно важно
Сравнивать:
- website intake vs messenger entry;
- text-first vs photo-first;
- language groups;
- mobile vs desktop.

---

## 13. AI analytics

### 13.1. Что измерять по AI-layer
- сколько пользователей вошло в AI flow;
- где AI flow прерывается;
- сколько handoff initiated;
- сколько users ask for human quickly;
- completion rate by scenario;
- completion rate by language;
- fallback usage rate;
- confusion triggers.

### 13.2. Что это дает
Показывает:
- реально ли AI помогает;
- не создает ли он friction;
- где его нужно упрощать.

---

## 14. Handoff analytics

### 14.1. Что важно измерять
- сколько completed intake дошло до human handoff;
- time to handoff;
- time to first human contact;
- handoff loss rate;
- language mismatch rate;
- qualified-after-handoff rate.

### 14.2. Почему это критично
Сайт может быть красивым, но если handoff ломается — продукт проваливается.

---

## 15. Research framework

### 15.1. Что такое research в этом проекте
Не только цифры, а понимание:
- почему пользователь доверяет или не доверяет;
- почему он ушел;
- почему он выбрал WhatsApp, а не форму;
- почему он не закончил intake;
- почему он не понял AI.

### 15.2. Форматы исследований
- короткие post-lead surveys;
- user interviews;
- operator interviews;
- support note review;
- language-specific research;
- session review / replay analysis;
- copy comprehension testing.

---

## 16. Post-lead survey model

### 16.1. Что можно спрашивать
После завершения заявки или после контакта можно задавать короткие вопросы:
- Было ли легко оставить задачу?
- Поняли ли вы, что будет дальше?
- Был ли удобен язык?
- Что было самым неудобным?
- Почему вы выбрали именно этот канал?

### 16.2. Правило опроса
Опрос должен быть:
- коротким;
- необязательным;
- без давления;
- лучше 1–3 вопроса, чем длинная анкета.

---

## 17. User interview framework

### 17.1. С кем говорить
- пользователи, завершившие intake;
- пользователи, ушедшие в мессенджер;
- пользователи, не завершившие форму;
- B2B leads;
- пользователи разных языков.

### 17.2. Что выяснять
- что они подумали о сайте в первые секунды;
- поняли ли они, что это сервисная компания;
- почувствовали ли страх “маркетплейса”;
- удобно ли было с AI;
- что мешало закончить заявку;
- что показалось подозрительным или непонятным.

---

## 18. Marketing research questions

### 18.1. Ключевые вопросы после запуска
- Какие языки реально дают трафик?
- Какие языки дают качественные лиды?
- Какие страницы работают лучше всего?
- Какой путь самый конверсионный?
- Где выше всего отвал?
- Что люди используют чаще: форму, фото, WhatsApp, Telegram или голос?
- Где пользователи теряют доверие?
- Какие источники приводят сильных клиентов, а какие — шум?

### 18.2. Вопросы для product-market fit signal
- Люди понимают ценность one-stop service?
- Люди верят в AI-first intake?
- Люди не воспринимают сайт как marketplace?
- Людям удобно с 6 языками?

---

## 19. Segmentation model

### 19.1. Как сегментировать данные
По:
- языку;
- источнику;
- сценарию задачи;
- устройству;
- новому / returning пользователю;
- типу клиента (обычный / бизнес);
- каналу входа (form / photo / messenger / voice).

### 19.2. Почему это важно
Без сегментации аналитика будет слишком общей и бесполезной.

---

## 20. Cohort analysis

### 20.1. Что стоит смотреть когортно
- first-week users after launch;
- paid traffic cohorts;
- language cohorts;
- mobile cohorts;
- repeat users.

### 20.2. Зачем
Чтобы понять:
- продукт улучшается или нет;
- copy и UX изменения помогают или нет;
- какие языки требуют отдельной оптимизации.

---

## 21. Dashboard system

### 21.1. Нужны минимум 3 dashboard-а
#### Dashboard 1 — Operations dashboard
Для ежедневной работы:
- лиды по статусам;
- языки;
- каналы;
- handoff;
- SLA.

#### Dashboard 2 — Product/UX dashboard
Для product решений:
- funnel;
- drop-off;
- CTA;
- language performance;
- AI flow performance;
- intake performance.

#### Dashboard 3 — Marketing dashboard
Для marketing решений:
- traffic sources;
- campaigns;
- landing pages;
- conversion to qualified lead;
- cost per lead (если появится paid traffic);
- language-source matrix.

---

## 22. What should live in admin panel

### 22.1. Обязательно в админке
- лиды по языкам;
- лиды по каналам;
- текущие статусы;
- handoff status;
- assignment delays;
- operator view;
- specialist view (если будет);
- urgent leads.

### 22.2. Необязательно в админке
Можно держать во внешней аналитике:
- heatmaps;
- deep funnel charts;
- campaign reports;
- cohort reports;
- A/B testing layer;
- product analytics exploration.

### 22.3. Вывод
Да, часть аналитики может быть в админке, но **полноценную маркетинговую и UX-аналитику лучше не запирать только в админ панели**.

---

## 23. A/B testing framework

### 23.1. Что тестировать в первую очередь
- hero headline;
- hero subheadline;
- порядок CTA;
- photo-first vs text-first emphasis;
- trust block placement;
- wording around AI;
- wording around “one service company”;
- first intake question.

### 23.2. Что важно
Тестировать не ради красоты, а ради:
- доверия;
- intake start;
- intake completion;
- language performance.

---

## 24. Attribution model

### 24.1. Что нужно знать
Какой источник реально приводит качественный лид.

### 24.2. Базовые атрибуции, которые нужны
- first touch source;
- last touch source;
- landing page;
- language chosen;
- channel selected;
- qualified lead outcome.

### 24.3. Почему этого достаточно на старте
Потому что сначала важнее простая, рабочая, надежная атрибуция, чем сложная и запутанная.

---

## 25. Privacy-aware analytics

### 25.1. Важное правило
Маркетинговая аналитика не должна ломать privacy principles.

### 25.2. Нельзя
- собирать лишние персональные данные ради аналитики;
- смешивать private lead content с публичной продуктовой аналитикой без необходимости;
- делать аналитику непрозрачной;
- передавать данные в third-party без продуманной политики.

### 25.3. Нужно
- использовать privacy-safe events;
- минимизировать PII в аналитике;
- разделять operational CRM data и product analytics where possible.

---

## 26. First 30 days research plan

### 26.1. Первая неделя
Смотреть:
- языки;
- bounce;
- CTA usage;
- intake starts;
- handoff failures.

### 26.2. Неделя 2
Смотреть:
- drop-off by step;
- AI friction;
- messenger vs on-site behavior;
- mobile vs desktop;
- homepage trust performance.

### 26.3. Неделя 3
Проводить:
- первые короткие user interviews;
- operator debrief;
- copy review;
- localization quality review.

### 26.4. Неделя 4
Решать:
- какие языки усиливать;
- какой CTA менять;
- какие страницы упрощать;
- нужен ли редизайн hero / intake start.

---

## 27. Success criteria for marketing analytics system

Система считается хорошей, если:
- понятно, откуда приходят лиды;
- видно, какие языки реально работают;
- видно, какие каналы выбирают пользователи;
- видно, где люди отваливаются;
- можно сравнивать trust-performance по языкам и сценариям;
- можно принимать продуктовые решения на основе данных, а не догадок.

---

## 28. Рекомендуемый следующий шаг
После этого документа полезно сделать 2 коротких прикладных артефакта:
1. **Analytics Event Dictionary** — список всех событий, параметров и naming rules.
2. **Dashboard Specification** — точный список виджетов и блоков для ops dashboard, product dashboard и marketing dashboard.

---

Конец документа 10.

