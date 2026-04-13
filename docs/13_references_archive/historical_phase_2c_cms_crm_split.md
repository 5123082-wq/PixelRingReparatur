# Phase 2C — Manager CRM and Website CMS Split
## Unified Content & AI Management

### Status
**Partially started**. This phase evolves the core [Phase 2](./historical_phase_2_crm_and_external_channels.md) by introducing a professional separation of concerns and a unified content source.

Current state:
- CRM and CMS shells exist at `/ring-manager-crm` and `/ring-master-config`.
- Separate auth keys and cookies are already wired.
- `ai` config UI/API exists.
- `articles` and `seo` screens are still WIP.
- Markdown KB remains the initial AI source of truth until DB-backed context injection lands.

### Goal
Разделить административные функции на две изолированные сущности и создать централизованное управление контентом (CMS) для сайта и AI-ассистента.

### Key Objectives
1.  **Manager CRM (`/ring-manager-crm`)**: Специализированный интерфейс для операторов по управлению заявками (Case Management).
2.  **Website CMS (`/ring-master-config`)**: Инструмент для владельца для управления системными промптами AI, статьями базы знаний и контентом сайта (SEO/GEO).
3.  **Single Source of Truth**: Контент (симптомы, FAQ) хранится в БД и используется одновременно для генерации страниц сайта и обучения AI.

---

### Security Architecture

Безопасность проектирования является приоритетом этой фазы:

- **Secrecy by Obscurity**: Оба пути (`/ring-manager-crm` и `/ring-master-config`) являются секретными и не индексируются. При неверном доступе сервер возвращает `404 Not Found`.
- **Isolation of Keys**: 
    - `ADMIN_MASTER_KEY_CRM`: Доступ только к заявкам.
    - `ADMIN_MASTER_KEY_CMS`: Доступ к настройкам AI и системному контенту.
- **Session Protection**: Раздельные HTTP-only куки (`pixelring_crm_session` и `pixelring_cms_session`) с флагом `Secure` в production. Серверные layout/API повторно проверяют роль сессии в БД.
- **Environment Contract**: Канонический список переменных хранится в `signage-service/.env.example`. Реальные значения для сервера задаются только в hosting environment variables. Локальные `.env` и `.env.local` игнорируются git и не являются источником истины.
- **Audit Logging**: Все изменения в базе знаний и промптах AI записываются с указанием времени и источника.

---

### Implementation Stages

#### Stage 1: Database Migration
Создание моделей в Prisma для централизованного контента:
- `CmsArticle`: (slug, title, content, type: SYMPTOM/FAQ, isPublic: boolean, locale).
- `AiConfig`: (key, value, description).

#### Stage 2: Portal Refactoring
- Переименование путей и обновление Middleware.
- Создание двух независимых Layouts в Next.js для CRM и CMS.

#### Stage 3: CMS Implementation
- Разработка визуального редактора Markdown для статей.
- Интерфейс управления "Симптомами" (Typical Symptoms) для сайта и AI.

#### Stage 4: AI Context Injection
- Обновление `lib/ai/chat-engine.ts` для динамического получения контекста из `CmsArticle` вместо статических файлов.

---

### Deliverables
- [ ] Рабочая CMS по адресу `/ring-master-config`.
- [ ] Переименованная CRM по адресу `/ring-manager-crm`.
- [ ] Динамическое управление симптомами на сайте через CMS.
- [ ] AI-ассистент, обучающийся на данных из БД.

### Related Documents
- [Master Architecture](../04_client_portal/request_tracking_and_customer_portal_architecture.md)
- [Implementation Blueprint](./old_request_tracking_implementation_blueprint.md)
- [Phase 2 (Core)](./historical_phase_2_crm_and_external_channels.md)
- [Phase 2B (AI Chat)](../08_ai_assistant/historical_phase_2b_ai_chat_system.md)
