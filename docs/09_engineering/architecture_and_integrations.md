# Документ 5
## Technical Architecture & Integrations
### AI-first multilingual one-stop service for signs, repairs, installation and branding

---

## 1. Назначение документа
Этот документ описывает техническую модель продукта:
- системную архитектуру;
- основные сущности;
- роли;
- мультиязычную логику;
- intake architecture;
- AI layer;
- integrations;
- CRM / lead-routing;
- admin operations;
- analytics events;
- security / consent / logs;
- требования для реализации в Antigravity.

Документ не привязан к одному конкретному стеку, но задает **архитектурные требования и систему компонентов**.

---

## 2. Архитектурный принцип продукта

### 2.1. Что мы строим
Не лендинг и не простую форму заявки.

Мы строим:
- multilingual service website;
- AI-assisted intake system;
- omnichannel communication layer;
- lead orchestration layer;
- human handoff system;
- admin / operations interface;
- partner-facing assignment model.

### 2.2. Главный технический принцип
Система должна работать как **единый intake-and-routing engine** независимо от того, откуда пришел пользователь:
- сайт;
- WhatsApp;
- Telegram;
- телефон / голос;
- повторный заход;
- ручной ввод оператором.

### 2.3. Продуктовая архитектурная формула
**One brand → one intake layer → one lead model → one routing logic → one human handoff system.**

---

## 3. Высокоуровневая архитектура

### 3.1. Основные слои
1. Presentation Layer
2. Intake Layer
3. AI Orchestration Layer
4. Lead / CRM Layer
5. Routing & Assignment Layer
6. Communication Layer
7. Admin / Operations Layer
8. Analytics Layer
9. Security / Consent / Logging Layer

### 3.2. Presentation Layer
Содержит:
- сайт;
- мультиязычные страницы;
- формы;
- UI-компоненты;
- страницы thanks / fallback / contact;
- mobile UI.

### 3.3. Intake Layer
Содержит:
- быстрые формы;
- upload-функцию;
- scenario selector;
- messenger handoff entrypoints;
- voice intake entrypoint;
- lead normalization.

### 3.4. AI Orchestration Layer
Содержит:
- conversational logic;
- branching;
- prompt routing;
- intent classification;
- data extraction;
- handoff triggers;
- multilingual handling.

### 3.5. Lead / CRM Layer
Содержит:
- lead records;
- contact records;
- attachments;
- statuses;
- conversation history;
- preferred language;
- preferred channel;
- business/account info.

### 3.6. Routing & Assignment Layer
Содержит:
- service type routing;
- urgency routing;
- geography routing;
- language routing;
- specialist assignment;
- SLA timers;
- escalation logic.

### 3.7. Communication Layer
Содержит:
- website chat;
- WhatsApp;
- Telegram;
- e-mail notifications;
- phone / voice handling;
- internal notifications.

### 3.8. Admin / Operations Layer
Содержит:
- dashboard;
- lead inbox;
- filters;
- assignment controls;
- language views;
- transcript / attachments view;
- follow-up tools;
- notes / status management.

### 3.9. Analytics Layer
Содержит:
- traffic events;
- intake funnel events;
- channel events;
- step drop-offs;
- operational SLA metrics.

### 3.10. Security / Consent / Logging Layer
Содержит:
- privacy consent;
- cookie consent;
- messaging consent;
- audit logs;
- user action logs;
- admin actions;
- attachment access logging.

---

## 4. Основные роли системы

### 4.1. Website visitor
Анонимный пользователь сайта.

### 4.2. Lead submitter
Пользователь, который начал или завершил intake.

### 4.3. Returning lead
Пользователь, который уже оставил обращение и продолжает коммуникацию.

### 4.4. AI assistant
Не пользователь, а системный conversational actor.

### 4.5. Service operator / coordinator
Внутренний сотрудник, который:
- видит лиды;
- контролирует handoff;
- назначает специалистов;
- управляет статусами;
- дополняет заявку.

### 4.6. Specialist / master
Человек, который получает профильную задачу.

### 4.7. Business account contact
Корпоративный пользователь с multi-location сценарием.

### 4.8. Admin
Пользователь с правами настройки системы.

---

## 5. Core entities

### 5.1. Lead
Главная сущность.

Поля:
- lead_id
- created_at
- updated_at
- source_channel
- intake_channel
- preferred_language
- current_status
- service_category
- urgency
- geo_area
- address_raw
- summary
- detailed_notes
- preferred_followup_channel
- assigned_specialist_id
- assigned_operator_id
- business_account_id (nullable)
- handoff_state
- consent_flags

### 5.2. Contact
Поля:
- contact_id
- full_name
- phone
- whatsapp_number
- telegram_handle
- email
- preferred_language
- preferred_contact_channel
- company_name (nullable)
- role_or_position (nullable)

### 5.3. Attachment
Поля:
- attachment_id
- lead_id
- type (photo/video/audio/document)
- file_path / storage_ref
- uploaded_at
- uploaded_by
- preview_available
- transcript_ref (for audio if available)

### 5.4. Conversation
Поля:
- conversation_id
- lead_id
- channel
- language
- started_at
- ended_at
- ai_handled
- human_handled
- status

### 5.5. Message
Поля:
- message_id
- conversation_id
- sender_type (user/ai/human/system)
- body
- timestamp
- language
- attachment_refs
- delivery_status

### 5.6. Specialist
Поля:
- specialist_id
- full_name
- service_capabilities
- geography_coverage
- language_capabilities
- availability_state
- partner_type
- quality_score
- SLA_profile
- active_status

### 5.7. Business account
Поля:
- business_account_id
- company_name
- billing_contact
- operational_contact
- locations_count
- preferred_language
- notes

### 5.8. Status history
Поля:
- status_event_id
- lead_id
- previous_status
- next_status
- changed_by
- changed_at
- reason

---

## 6. Status model

### 6.1. Основные статусы лида
- New
- In intake
- Awaiting more data
- Qualified
- Handoff initiated
- Assigned
- Specialist contacted
- In progress
- Completed
- Lost
- Archived

### 6.2. Special states
- Language clarification needed
- Messenger continuation pending
- Voice message received
- Multi-location review needed
- Manual review required

### 6.3. Статусы должны быть
- понятными;
- пригодными для фильтрации;
- пригодными для SLA;
- пригодными для аналитики.

---

## 7. Intake architecture

### 7.1. Supported intake channels
- Website guided intake
- Website quick form
- Website photo-first intake
- WhatsApp
- Telegram
- Phone / voice
- Manual admin intake

### 7.2. Общая intake-логика
Независимо от канала, данные нормализуются в единую Lead Model.

### 7.3. Intake states
- started
- partial
- completed_minimum
- enriched
- handed_off

### 7.4. Минимум данных для completed_minimum
- scenario / issue type
- contact method
- enough identifying info to continue

Желательно:
- address
- photo
- preferred language

---

## 8. AI orchestration layer

### 8.1. Задачи AI-слоя
- intent detection;
- language detection;
- scenario routing;
- question sequencing;
- data extraction;
- fallback suggestion;
- handoff triggering;
- message templating.

### 8.2. AI outputs
AI по итогу должен создавать:
- structured lead summary;
- extracted fields;
- missing data flags;
- handoff recommendation;
- conversation transcript.

### 8.3. AI constraints
AI не должен:
- создавать неподтвержденные обещания;
- выдумывать стоимость;
- менять tone на marketplace-style;
- скрывать, что дальше подключится человек.

### 8.4. Handoff trigger conditions
AI должен инициировать handoff, когда:
- собран минимальный набор данных;
- пользователь просит человека;
- задача сложная;
- AI не уверен;
- пользователь раздражен;
- срочный случай требует ускорения.

---

## 9. Multilingual architecture

### 9.1. Языки MVP
- de
- en
- ru
- tr
- pl
- ar

### 9.2. Что нужно поддерживать на уровне системы
- page localization;
- UI strings;
- intake flows;
- AI prompts / responses;
- email / message templates;
- status-facing user messages;
- language-aware routing.

### 9.3. Language persistence
Язык должен фиксироваться:
- из URL;
- из UI language selection;
- из AI detection;
- из user preference.

Система должна различать:
- interface language;
- communication language;
- lead preferred language.

### 9.4. Arabic support
Нужно предусмотреть:
- RTL-aware layout;
- mirrored UI logic;
- text container tolerance;
- message template support.

---

## 10. Routing logic

### 10.1. Routing inputs
- service_category
- urgency
- geo_area
- language
- business vs single-location
- attachment availability
- manual review flag

### 10.2. Routing outputs
- assigned operator
- assigned specialist
- assignment priority
- response window
- escalation requirement

### 10.3. Priority rules
Высокий приоритет:
- срочные ремонты;
- multi-location business cases;
- leads with enough data;
- repeated customers;
- issues flagged as time-sensitive.

### 10.4. Routing failure handling
Если система не может уверенно назначить исполнителя:
- lead уходит в manual review;
- не остается без owner;
- фиксируется alert.

---

## 11. Specialist / partner assignment model

### 11.1. Внутренняя логика
Даже если специалисты партнерские, внешне это не должно менять клиентскую модель.

### 11.2. Assignment criteria
- geography fit;
- service fit;
- language fit;
- availability;
- SLA compliance;
- quality score.

### 11.3. Assignment outputs
- specialist notified;
- operator notified;
- lead status updated;
- follow-up SLA started.

---

## 12. Communication architecture

### 12.1. Website chat
Нужно:
- conversational widget;
- transcript storage;
- language awareness;
- transition to human-ready state.

### 12.2. WhatsApp / Telegram
Нужно:
- message intake ingestion;
- channel tagging;
- structured field extraction;
- template support;
- continuity with lead record.

### 12.3. Phone / voice
Нужно:
- voice message intake;
- audio storage;
- optional transcription;
- lead association;
- follow-up trigger.

### 12.4. Internal notifications
Нужно:
- new lead alerts;
- urgent lead alerts;
- assignment alerts;
- SLA breach alerts;
- missing data alerts.

---

## 13. CRM / admin operations layer

### 13.1. Главный dashboard
Должен показывать:
- новые лиды;
- лиды в работе;
- срочные лиды;
- multi-location leads;
- language-specific queues;
- SLA risk items.

### 13.2. Lead detail view
Должна содержать:
- краткое summary;
- статус;
- контакт;
- preferred language;
- attachments;
- conversation history;
- AI transcript / extracted fields;
- internal notes;
- assignment controls;
- history.

### 13.3. Admin actions
- change status
- assign operator
- assign specialist
- merge duplicates
- request more info
- send follow-up
- flag for review
- archive

### 13.4. Queue filters
Фильтры:
- by status
- by language
- by urgency
- by service
- by source
- by assigned owner
- by business account

---

## 14. Page / frontend architecture

### 14.1. Core reusable sections
- HeroSection
- TrustCardsSection
- ScenarioGridSection
- ProcessSection
- ValueSection
- CaseGridSection
- FAQSection
- CTASection
- ContactStrip
- LanguageSwitcher

### 14.2. Intake components
- ScenarioSelector
- QuickForm
- ProgressiveIntakeFlow
- PhotoUploadModule
- MessengerHandoffModule
- VoiceEntryModule
- ConfirmationState

### 14.3. Shared app concerns
- locale-aware routing
- form state persistence
- progressive step tracking
- attachment handling
- mobile sticky CTA state

---

## 15. CMS / content architecture

### 15.1. Content entities
- page
- section
- faq item
- service page
- case study
- trust message
- CTA copy
- multilingual string
- legal page

### 15.2. CMS requirements
- multilingual support;
- per-page SEO fields;
- flexible section-based page building;
- draft/publish workflow;
- non-technical editability for content team.

### 15.3. Content model principle
Контент должен быть разделен так, чтобы:
- текст легко локализовался;
- секции переиспользовались;
- страницы не приходилось вручную переписывать в коде целиком.

---

## 16. Analytics architecture

### 16.1. Business events
- page_view
- CTA_click
- intake_started
- intake_step_completed
- photo_uploaded
- messenger_handoff_clicked
- messenger_conversation_started
- voice_intake_started
- voice_message_received
- intake_completed
- handoff_triggered
- specialist_assigned
- followup_sent
- lead_completed
- lead_lost

### 16.2. Required dimensions
- language
- device
- source
- page
- service_type
- urgency
- channel
- returning vs new

### 16.3. Operational metrics
- time_to_minimum_data
- time_to_handoff
- time_to_assignment
- time_to_first_human_contact
- SLA breaches
- drop-off by step

---

## 17. Security / privacy / consent architecture

### 17.1. Consent categories
- site cookies
- data processing consent
- messenger communication consent
- attachment processing consent
- phone/voice processing notice

### 17.2. Security requirements
- secure file storage
- access control for admin views
- audit logs for lead changes
- role-based access
- limited attachment exposure
- retention rules

### 17.3. Logging requirements
Логироваться должно:
- статусные изменения;
- назначения;
- admin actions;
- critical communication events;
- consent events;
- file uploads.

---

## 18. Reliability / fallback architecture

### 18.1. Если AI не работает
Должны существовать fallback paths:
- quick form
- direct messenger
- phone
- manual operator flow

### 18.2. Если attachment upload fails
Пользователь должен получить:
- retry option;
- alternative messenger path;
- phone fallback.

### 18.3. Если specialist assignment fails
Lead не должен “повисать” без owner.
Нужно:
- manual review queue;
- alert;
- SLA timer.

---

## 19. Antigravity implementation planning layer

### 19.1. Что должно стать epics
1. Multilingual website shell
2. Section-based page system
3. Intake engine
4. AI conversation orchestration
5. Attachment management
6. Messaging integrations
7. Voice intake handling
8. Lead CRM
9. Routing & assignment
10. Admin dashboard
11. Analytics instrumentation
12. Security / consent / logs

### 19.2. Что должно стать reusable modules
- language system
- CTA system
- page section renderer
- intake flow controller
- conversation state manager
- lead normalizer
- assignment engine
- notification engine

### 19.3. MVP build order
1. Website shell + localization
2. Homepage + service pages
3. Quick intake + photo upload
4. Lead model + CRM storage
5. Handoff logic
6. Messenger integration
7. Admin dashboard
8. Analytics
9. Voice intake
10. routing refinement

---

## 20. Acceptance criteria for technical readiness

Система считается архитектурно готовой, если:
- любой входящий запрос сводится к единой lead model;
- язык сохраняется и учитывается;
- AI может собрать минимально достаточные данные;
- handoff к человеку фиксируется и не теряется;
- admin видит полную картину по заявке;
- specialist assignment прозрачен;
- analytics покрывает funnel и operations;
- сайт не зависит от одного канала входа.

---

## 21. Что делать следующим документом
Следующий документ:
**Content & Copy System**

Почему:
- уже есть стратегия;
- уже есть IA;
- уже есть UX;
- уже есть AI behavior;
- уже есть technical model;
- теперь нужно собрать единую систему текстов, CTA, hero-формул, trust-messaging и multilingual copy framework.

---

Конец документа 5.

