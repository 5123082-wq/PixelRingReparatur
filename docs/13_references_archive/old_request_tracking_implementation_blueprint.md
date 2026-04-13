# Implementation Blueprint: Request Tracking & Portal

This document serves as the **Master Orchestrator Protocol**. Any agent starting work on this feature MUST read this document first to understand their role and boundaries.

---

## 1. Source of Truth
- **Core Architecture**: [request_tracking_and_customer_portal_architecture.md](../04_client_portal/request_tracking_and_customer_portal_architecture.md)
- **Phase 1 (Closed)**: [historical_phase_1_website_foundation.md](./historical_phase_1_website_foundation.md)
- **Phase 2 (Closed — core)**: [historical_phase_2_crm_and_external_channels.md](./historical_phase_2_crm_and_external_channels.md)
- **Phase 3 (Next)**: [full_customer_portal_plan.md](../04_client_portal/full_customer_portal_plan.md)
- **Phase 4 (Planned)**: [security_compliance_operations_plan.md](../10_security_privacy/security_compliance_operations_plan.md)
- **Phase 2B (Next)**: [historical_phase_2b_ai_chat_system.md](../08_ai_assistant/historical_phase_2b_ai_chat_system.md)
- **Phase 5 (Planned)**: [bitrix24_crm_integration_plan.md](../06_crm/bitrix24_crm_integration_plan.md)
- **Public Request Number Format**: `PR-XXXX-XXXX` (Centralized generation logic in `request-number.ts`).

---

## 2. Active Roles & Delegations

### [ROLE] Backend / API Specialist
**Objective**: Build the engine & admin logic.
- Generate signed session tokens (cookies).
- Implement PR-number generator (Unique, non-sequential).
- Create API routes for Status updates and Admin access.
- Implement Private Path protection for `/ring-manager-crm` and `/ring-master-config`.
- Enforce "Value Exchange Rule" (Number only after Contact provided).

### [ROLE] Frontend / UX Specialist
**Objective**: Build the interface & Admin Dashboard.
- Update `RequestForm` to handle real submits and state.
- Implement the "Success View" with the PR number display.
- Build the initial `Status` search page.
- Build the CRM dashboard (`/ring-manager-crm`) with request list and status controls.
- Add the optional media enrichment (photo/video upload) UI.

### [ROLE] Security / Compliance Specialist
**Objective**: Guard the data.
- Configure cookie headers.
- Implement Rate Limiting to prevent PR-number enumeration.
- Verify GDPR privacy notices at all intake points.

---

## 3. Phase Status

| Phase | Description | Status | Date |
|---|---|---|---|
| Phase 1 | Website Foundation | ✅ Closed | 2026-04-05 |
| Phase 2 | Internal Admin Portal | ✅ Closed (core) | 2026-04-05 |
| Phase 2B | AI-Assisted Chat System | ⚠ Critical next | — |
| Phase 2C | Manager CRM and Website CMS Split | 🟡 Partially started | — |
| Phase 3 | Full Customer Portal | ⏳ Planned | — |
| Phase 4 | Security & Compliance | ⏳ Planned | — |
| Phase 5 | Bitrix24 CRM Integration | ⏳ Planned (deferred) | — |

**Note**: Phase 2 core is closed. Rate Limiting remains as a standalone task. Persistent chat is absorbed into Phase 2B. Attachment storage deferred. Phase 2C has started at the CRM/CMS shell and AI config layer; the markdown KB under `signage-service/knowledge_base/` remains the initial source of truth until CMS injection is implemented.

---

## 4. Global Task Queue (Phase 1) — CLOSED

### [x] Task 1.1: DB Setup & Schema [Assign: Backend]
- [x] Choose and install Database ORM (Prisma).
- [x] Initialize DB connection and environmental variables.
- [x] Define Case and Session models in the schema.
- [x] Create initial migration.

### [x] Task 1.2: PR-Number Service [Assign: Backend]
- [x] Logic for PR-number generation with collision check.

### [x] Task 1.3: Request Intake Refactoring [Assign: Frontend]
- [x] Update labels and field requirements based on architect. doc.
- [x] Connect RequestForm to the new API.

### [x] Task 1.4: Status Search [Assign: Frontend]
- [x] Create search UI for Status.
- [x] Handle "No data shown without verification" rule.

---

## 5. Global Task Queue (Phase 2) — CLOSED (core)

### [x] Task 2.1: Environment & Auth Library [Assign: Backend]
- [x] Add `ADMIN_MASTER_KEY_CRM`, `ADMIN_MASTER_KEY_CMS`, `ADMIN_SESSION_TTL_HOURS` to env.
- [x] Implement `admin-auth.ts` (timing-safe key validation, session management).

### [x] Task 2.2: Schema & Migration [Assign: Backend]
- [x] Add `ON_HOLD` to `CaseStatus` enum.
- [x] Create `AdminSession` model.
- [x] Create and apply migration `20260405203256_phase2_admin_portal`.

### [x] Task 2.3: API Routes [Assign: Backend]
- [x] `POST /api/admin/auth` (login with master key, set session cookie).
- [x] `DELETE /api/admin/auth` (logout, revoke session).
- [x] `GET /api/admin/verify` (session validation).
- [x] `GET /api/admin/cases` (list with pagination, filters, search).
- [x] `POST /api/admin/cases` (manual case creation with PR-number).
- [x] `GET /api/admin/cases/[id]` (detail with messages/attachments).
- [x] `PATCH /api/admin/cases/[id]` (status update, field edits).

### [x] Task 2.4: Middleware [Assign: Backend]
- [x] Block `/admin` with 404.
- [x] Guard `/ring-manager-crm/*` and `/ring-master-config/*` with cookie check.
- [x] Guard `/api/admin/*` and `/api/cms/*` with session validation.

### [x] Task 2.5: Admin Frontend [Assign: Frontend]
- [x] CRM login page (`/ring-manager-crm`).
- [x] CRM dashboard layout with sidebar.
- [x] CRM cases table with filters, pagination, search.
- [x] CRM case creation modal with PR-number display.
- [x] CRM case detail page with status management and message history.
- [x] CMS login page (`/ring-master-config`).
- [x] CMS dashboard shell and AI config form.

### [x] Task 2.6: Status Labels [Assign: Frontend]
- [x] Update `status-lookup.ts` with 10 Russian-language status labels.

### Phase 2 — Remaining standalone task

### [x] Task 2.8: Rate Limiting [Assign: Security]
- [x] Rate limiting on `/api/status` (10/min) and `/api/contact` (5/10min) endpoints.
- [x] Rate limiting on `/api/admin/auth` (5/5min, returns 404).
- [x] Anti-enumeration protection for PR-number lookup.
- [x] Generic error responses without hints.
- [x] `src/lib/rate-limit.ts` — in-memory sliding window limiter.

### Deferred

- **Task 2.7: Attachment Storage** — deferred until Phase 2B chat is proven.
- **Task 2.9: Persistent Backend Chat** — absorbed into Phase 2B.

---

## 6. Phase 2B Task Queue — AI-Assisted Chat System

Detailed plan: [historical_phase_2b_ai_chat_system.md](../08_ai_assistant/historical_phase_2b_ai_chat_system.md)

### [x] Task 2B.1: Knowledge Base [Assign: Content / Backend]
- [x] Create `signage-service/knowledge_base/` directory.
- [x] Write `service_info.md`, `intake_flow.md`, `faq.md`, `boundaries.md`.
- [x] Treat markdown KB as the initial source of truth for Phase 2B prompt assembly.

### [ ] Task 2B.2: System Prompt & Safety [Assign: Backend]
- [ ] `src/lib/ai/system-prompt.ts` — system prompt assembly from KB.
- [ ] `src/lib/ai/safety-filter.ts` — response filter and logging.
- [ ] Strict boundaries enforcement (prompt injection protection).

### [ ] Task 2B.3: AI API Integration [Assign: Backend]
- [ ] `src/lib/ai/chat-engine.ts` — API wrapper (Gemini/OpenAI).
- [ ] `POST /api/chat` endpoint.
- [ ] Context history support.

### [ ] Task 2B.4: Backend Chat Persistence [Assign: Backend]
- [ ] `POST /api/chat/messages` — save + AI response.
- [ ] `GET /api/chat/messages` — load history by session.
- [ ] Session binding (anonymous → case linkage).

### [ ] Task 2B.5: Frontend Integration [Assign: Frontend]
- [ ] Refactor `ChatModal.tsx` to call backend API.
- [ ] History loading on open, session cookie management.
- [ ] Localized greeting from KB.

### [ ] Task 2B.6: Admin Chat View [Assign: Frontend]
- [ ] Operator message input in case detail.
- [ ] AI/Customer/Operator role markers.
- [ ] Operator takeover flag (AI stops auto-responding).

---

## 6. Handoff Protocols
- **Consistency**: All PR numbers must be upper-case and hyphenated (`PR-XXXX-XXXX`).
- **Privacy**: No private user data in the frontend bundle.
- **Security**: All admin errors return 404 (never 401/403) to hide admin existence.
- **Feedback**: Every sub-task must update its status in this document before conclusion.
