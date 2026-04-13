# Request Tracking And Customer Portal
## Approved architecture for lead intake, request number, identity, portal access, admin operations, and EU-safe operation

Implementation status note as of `2026-04-05`:
- `Phase 1` (Website Foundation) is implemented and closed.
- `Phase 2` (Internal Admin Portal) is implemented and closed. Core admin dashboard, secret route protection, status management, and manual PR-number creation are operational.
- CRM integration (originally Phase 2) has been deferred to `Phase 5` as a standalone Bitrix24 integration phase.
- `Phase 2B` is the critical next implementation step: AI chat, system prompt, safety layer, and backend persistence still need to be wired up.
- `Phase 2C` has started partially: the CRM/CMS split shell, admin auth split, and AI config plumbing exist, while article/SEO CRUD and AI context injection remain WIP.
- The markdown knowledge base under `signage-service/knowledge_base/` is the initial source of truth until CMS-backed injection is introduced.
- the current project state now lives in [project_state_and_roadmap.md](../00_project_overview/project_state_and_roadmap.md);
- the old execution blueprint is archived in [old_request_tracking_implementation_blueprint.md](../13_references_archive/old_request_tracking_implementation_blueprint.md);
- section `1. Current baseline in this repository` below is preserved as historical pre-implementation context and must not be treated as the live implementation status.

---

## 1. Current baseline in this repository

At the moment the website does **not** have the backend needed for a real `Status` area:

- `Header.tsx` links `Status` to `#status`, not to a real page.
- `ChatModal.tsx` keeps messages only in client state.
- `ContactForm.tsx` simulates submit success.
- `api/contact/route.ts` forwards data to Telegram, but does not create a database record, request number, account, or message history.
- there is no database, no private file storage, no authentication model, no RBAC, and no customer portal.

Because of this, the `Status` button must be treated as a separate product module, not as a small UI patch.

---

## 2. Approved product decisions

These points are already decided and should be treated as fixed product requirements for the first architecture pass.

### 2.1. Contact and number issuance policy

- **Value Exchange Rule**: a public request number is **not** shown to the user immediately.
- The system generates it internally for tracking, but reveals it only in exchange for a primary contact method (Phone or Email).
- This ensures the client can recover the request and the operator has a reliable way to follow up.
- Email or Phone becomes mandatory at the moment of "formalizing" the request.
- Verified email is still required for the full customer portal.

### 2.2. Messenger policy

- WhatsApp and Telegram remain **external entry channels**;
- they are not treated as fully integrated portal channels in the first version;
- a human operator remains part of the flow for these channels.

### 2.3. External-channel request number policy

- messenger contact starts as a **lead**, not immediately as a fully tracked request;
- when the lead is moved to the next operational stage by a human, a request number is assigned;
- with the Internal Admin Portal (Phase 2), this number is formed directly in the admin dashboard by the operator;
- when Bitrix24 integration is available (Phase 5), the number may also be formed from CRM;
- the operator can then send that request number back to the client manually.

### 2.4. Phone/SMS policy

- SMS-based OTP is out of scope for the initial phase;
- low-cost push-style notifications may be used later for informing the client;
- notification delivery must **not** be treated as a strong authentication factor by itself.

### 2.5. Scope of the current task

- this phase is documentation only;
- implementation phases must be described clearly enough to hand off to another agent or team.

---

## 3. Core domain model

The system must distinguish between three different things.

### 3.1. Lead

A lead is an incoming contact that may still be incomplete or unqualified.

Typical examples:

- first WhatsApp message;
- first Telegram message;
- first phone contact;
- first email;
- incomplete website intake.

A lead may exist **without** a public request number.

### 3.2. Request / case

A request is a qualified operational record that is ready to be tracked.

At this point the system must have:

- internal case ID;
- public request number;
- primary contact method;
- minimum request summary;
- client-facing status;
- audit trail for further updates.

Only at this stage should `Status` tracking become available.

### 3.3. Full customer portal account

A full portal account is a verified customer identity used for long-term access.

It requires:

- verified email;
- authenticated portal session;
- linkage to one or more requests.

This is the level where diagnosis history, photo report, warranty, and future documents are exposed.

---

## 4. Request number policy

### 4.1. Public number vs internal ID

There must be a strict separation between:

- **internal case ID**: UUIDv7 or similar, never shown publicly;
- **public request number**: human-readable identifier shown to the client.

Do **not** use simple sequential public numbers like `100012`.
That creates obvious enumeration risk.

Recommended public format:

- `PR-26F4-K8M2`
- `PXR-A91C-7D4Q`

### 4.2. Numbering rule

Even if the number is assigned from different systems depending on channel, the format rule must stay centralized.

That means:

- website-origin requests follow the same numbering format;
- Bitrix24-origin requests follow the same numbering format;
- the portal and CRM always refer to the same public number.

### 4.3. Channel-specific issuance moment

#### Website chat / website form

1. The visitor starts a conversation or fills a form.
2. The system collects clarifying details (qualification questions).
3. The system offers to "formalize" the request to obtain a tracking number.
4. The request number is revealed **only after** a valid phone or email is provided.
5. **Optional media enrichment**: after revealing the number, the system invites the user to upload photos, videos, or additional descriptions to help the technician prepare (non-mandatory).

#### External messengers / phone / operator-led intake

The incoming contact first exists as a lead.
The request number appears only when a human moves that lead to the next operational stage in Bitrix24 or an equivalent CRM.

This difference is intentional and should be preserved in the documentation and UI copy.

---

## 5. System ownership and source of truth

The system follows a **portal-first** model. The Internal Admin Portal (implemented in Phase 2) is the primary operational system. CRM integration (Phase 5) is an optional layer on top.

### 5.1. Admin Portal ownership (current)

The Internal Admin Portal (`/ring-manager-crm`, legacy alias `/ring-master-admin`) is the operational system of record for:

- all request statuses and lifecycle management;
- manual qualification and lead-to-request conversion;
- PR-number assignment for all channels;
- operator notes and internal workflow;
- attachment and media management.

### 5.2. CRM ownership (future — Phase 5)

When Bitrix24 integration is enabled, CRM becomes a supplementary operational layer for:

- external-channel lead routing;
- specialist assignment and pipeline management;
- advanced reporting and operator routing.

The portal backend remains the source of truth for all client-facing data even after CRM integration.

### 5.3. Portal backend ownership

The website backend / portal database is the system of record for:

- website chat history;
- portal sessions;
- portal claim and verification state;
- customer-visible website messages;
- portal attachments and media;
- customer-visible timeline rendering;
- full-cabinet authentication state.

### 5.4. Shared identity layer

Each request must be linkable across systems through a stable mapping:

- `portal_case_id`
- `crm_lead_id` (future — Phase 5)
- `crm_case_id` or equivalent (future — Phase 5)
- `public_request_number`
- `primary_contact_method`

### 5.5. Source-of-truth rule for client-facing data

Client-facing status in the portal must be rendered only from data that is explicitly synced and approved for client visibility.

Do not expose raw CRM internals directly.

---

## 6. Canonical communication principle

The customer should be able to start anywhere, but the system must still communicate a clear hierarchy.

### 6.1. Website chat

Website chat is the best continuity channel because:

- it can be fully stored in the portal backend;
- it can later be shown in `Status`;
- it can become part of the full customer cabinet;
- it is under your own data and privacy controls.

That is why the `TOP` label is product-logically correct.

### 6.2. External messengers

WhatsApp and Telegram remain convenience channels for first contact.

Without official integration they should be described honestly as:

- external entry points;
- useful for fast first contact;
- not guaranteed as a complete history source for the future cabinet.

### 6.3. UI wording implication

The site should explicitly say:

- website chat is recommended if the client wants complete history and request tracking;
- external messengers are convenient, but tracking quality depends on later operator handoff.

---

## 7. End-to-end flow by channel

## 7.1. Website-origin flow

1. Visitor starts website chat or sends the website form.
2. The system creates an anonymous draft session.
3. The system asks 2-3 clarifying questions (qualification).
4. The system offers to issue a request number for tracking continuity.
5. The visitor provides a contact method (Phone or Email).
6. The system officially creates the request and reveals the **Public Request Number**.
7. The request is synced into CRM as a qualified deal/lead.
8. The client receives:
   - request number in the UI;
   - automatic confirmation message (WhatsApp/SMS/Email) with the number;
   - entry path to `Status`.
9. The browser receives a secure signed cookie for same-device continuity.

This is the fastest and cleanest flow.

## 7.2. Messenger-origin flow

1. Client writes in WhatsApp or Telegram.
2. **Identity Check**: The system/operator checks the message for a  or existing contact history.
3. If no existing request is found, the contact is treated as a new lead in CRM.
4. A human operator reviews and qualifies the lead.
4. When the lead moves to the next stage, CRM assigns a public request number.
5. The operator sends that request number back to the client manually.
6. If a portal record is needed, the CRM request is mirrored or created in the portal backend using the same public number.
7. The client can then use `Status` according to the available verification method.

Important:

- not every messenger conversation becomes a request immediately;
- the request number appears only after human qualification.

## 7.3. Phone / voice flow

1. Incoming phone or voice contact is created as a lead.
2. Operator qualifies it.
3. CRM creates a request number when the lead moves forward.
4. The number is sent back manually by the operator through the available communication channel.

## 7.4. Email-origin flow

1. Email arrives as a lead.
2. Operator qualifies it.
3. CRM creates the request and assigns the public request number.
4. The request number is returned by email.

Email is also the best candidate for later portal-account conversion.

---

## 8. Recovery and access model

## 8.1. Same-device continuity

If the client stays on the same browser and the secure cookie is still present, the system can restore the website-origin request without friction.

Cookie requirements:

- `HttpOnly`
- `Secure`
- `SameSite=Lax`
- signed server-issued token

## 8.2. Request number alone is never enough

Entering the public request number must **not** reveal private data by itself.

The request number is only the first lookup step.

## 8.3. MVP recovery matrix

### Website-origin request with active signed cookie

- access can be restored automatically on the same device.

### Passwordless Verification (Phone or Email)

- If the device changed or cookie is missing, the user provides the request number + their phone or email.
- Alternatively, starting by just entering Phone / Email is also supported.
- The system sends a one-time verification code (OTP) or magic link to that contact method.
- Access is restored after successful verification.

### Messenger-origin request without official integration

- there is no secure automated messenger-based login flow;
- access restoration must be operator-assisted or shifted to verified email/phone later.

## 8.4. Operator-assisted recovery

Because SMS OTP is not part of the first phase, the architecture must explicitly support a fallback path:

1. client enters request number;
2. the system accepts a recovery request without exposing request data;
3. an operator reviews the contact context in CRM;
4. the operator sends a continuation link or instruction through the already known communication channel.

This path is slower, but it is honest and operationally realistic.

## 8.6. Cross-Channel Identity Linking (Omnichannel)

To prevent duplicate requests when a user moves from the Website to a Messenger:

1. **Pre-filled Message Transfer**: When the user clicks "Continue in WhatsApp/Telegram", the system generates a link with a pre-filled message: *"Request: [public_request_number]. Continuing conversation here."*
2. **CRM Check**: Upon receiving an external message, the CRM first checks for a valid  in the text.
3. **Automatic Merging**: If the number exists and is valid, the messenger contact is automatically linked to the existing Request/Deal instead of creating a new lead.
4. **Manual Recovery**: If the user contacts via a messenger without the number, the operator uses the Phone/Email provided at the Website intake to find and merge duplicates manually.

## 8.5. Push notifications rule

Browser push, messenger push, or operator-sent notification may be used for:

- informing the client that the request moved forward;
- informing the client that a request number was assigned;
- prompting the client to continue in the portal.

They must **not** be treated as a standalone authentication factor unless a future dedicated verified device model is introduced.

---

## 9. Full customer portal transition

### 9.1. Trigger moment

The portal transition should happen once the request becomes operationally meaningful, for example:

- `qualified`
- `assigned`
- `in_progress`
- `diagnosis_ready`

### 9.2. Portal identity rule

The full customer portal requires:

- verified email;
- authenticated session;
- request-to-customer linkage in the backend.

### 9.3. Recommended login method

For this project the safest low-friction default is:

- passwordless magic link as the primary method;
- optional passkey later;
- password login only if you intentionally accept the support and security burden.

### 9.4. What becomes visible in the full cabinet

- active requests;
- past requests;
- diagnosis history prepared for the client;
- photo report;
- warranty period and warranty document;
- portal communication history;
- next actions and notifications.

---

## 10. Status model

The status model uses two layers. The internal statuses are implemented as the `CaseStatus` enum in the Prisma schema.

### 10.1. Internal operational statuses (implemented)

| Enum Value | Russian Label | Description |
|---|---|---|
| `DRAFT` | Черновик | Заявка создана, ожидает завершения оформления |
| `FORMALIZED` | Оформлена | Контактные данные подтверждены |
| `NUMBER_ISSUED` | Принято | PR-номер выдан, заявка зарегистрирована |
| `UNDER_REVIEW` | В диагностике | Первичный осмотр устройства |
| `IN_PROGRESS` | Ремонт | Активный процесс ремонта |
| `ON_HOLD` | Отложено | Ожидание запчастей или согласования |
| `WAITING_FOR_CUSTOMER` | Ожидает клиента | Нужен ответ или уточнение от клиента |
| `READY_FOR_PICKUP` | Готов | Ремонт завершён, устройство ждёт выдачи |
| `COMPLETED` | Выдан / Гарантия | Устройство выдано, действует гарантия |
| `CANCELLED` | Отказ | Клиент отказался или ремонт невозможен |

### 10.2. Client-facing status rendering

The `status-lookup.ts` module maps internal statuses to client-facing labels and descriptions. These labels are shown on the public Status page.

Raw internal statuses or CRM statuses must never be exposed directly without normalization.

---

## 11. Data model

Minimum entities:

### 11.1. Identity and access

- `users`
- `user_emails`
- `contact_methods`
- `auth_sessions`
- `request_claims`
- `verification_challenges`

### 11.2. Request domain

- `cases`
- `case_status_events`
- `case_participants`
- `case_assignments`
- `case_consents`
- `crm_sync_links`

### 11.3. Communication

- `threads`
- `messages`
- `message_attachments`
- `external_channel_links`
- `recovery_requests`

### 11.4. Service execution

- `diagnosis_reports`
- `work_reports`
- `warranties`
- `documents`

### 11.5. Security and compliance

- `audit_logs`
- `privacy_events`
- `retention_policies`
- `deletion_requests`

---

## 12. Storage model

Recommended infrastructure shape:

- relational database for structured data;
- private object storage for photos, videos, PDFs, voice files;
- signed short-lived URLs for download;
- no private file stored in a public web directory;
- no attachment path exposed without server-side authorization.

All uploads must have:

- MIME allowlist;
- size limits;
- server-side validation;
- generated safe storage key;
- optional malware scanning path for future office-file support.

---

## 13. Security model

Mandatory rules:

- all authorization checks are server-side;
- public request number alone never grants access;
- rate limiting on lookup, recovery, upload, and message send endpoints;
- generic error responses on failed lookup to prevent enumeration;
- no sensitive tokens in the frontend bundle;
- no portal auth in `localStorage`;
- signed cookies only;
- audit logs for admin, operator, coordinator, and specialist access;
- RBAC for operator, coordinator, specialist, and admin;
- re-auth for future sensitive actions if billing or legal documents are added.

Specialist access must be limited:

- only assigned requests;
- only necessary contact data;
- no access to global customer history unless explicitly required.

---

## 14. Privacy and EU baseline

This module must be built as GDPR/privacy-by-design from the start.

Mandatory baseline:

- clear privacy notice at intake;
- clear note that AI helps only with the first intake and that a human continues later;
- explicit wording when the user leaves the site for WhatsApp or Telegram;
- separate attachment-processing notice;
- only necessary fields in early intake;
- legal pages aligned with actual system behavior;
- processor agreements with every third-party service;
- EU/EEA hosting preference for DB and private file storage where possible;
- documented retention schedule;
- support for access, rectification, deletion, and export requests;
- cookie consent only for non-essential analytics;
- no hidden marketing consent inside request flows.

Important practical rule:

- invoice and tax records may require longer retention;
- operational chat and media retention should be governed separately;
- unqualified leads must not be kept forever.

Exact retention periods still need legal confirmation for Germany/EU operations.

---

## 15. Recommended UI structure

### 15.1. Public pages

- `/[locale]/status`
- `/[locale]/status/verify`
- `/[locale]/case/[publicRequestNumber]`
- `/[locale]/portal`
- `/[locale]/request/thanks`
- messenger handoff explainer pages

### 15.2. `Status` entry logic

The `Status` entry should offer 2 paths:

1. `I have a request number`
2. `I want to track via Phone / Email`

Both paths lead to a **Passwordless Verification Challenge** (OTP/Push):
- Input: Number/Phone/Email.
- Output: "We've sent a code/link to your [Messenger/Email]".
- Result: Authenticated session for tracking current request status and chat history.

### 15.3. Important UX copy rule

If a messenger-origin lead has not yet been converted into a request, the UI must not pretend that a request number already exists.

It should say clearly:

- your contact has been received;
- a coordinator is reviewing it;
- a request number appears after the lead is moved into the next working stage.

---

## 16. Implementation principles for the next agent

The implementation must preserve these boundaries:

- website-origin requests can receive an automatic number;
- external-channel leads receive a number only after human qualification in CRM;
- email is not required for initial request creation;
- full cabinet requires verified email;
- no SMS OTP is assumed in the first version;
- push-style notifications are informational, not identity proof;
- no fake promise that external messenger history will fully appear in the portal.

---

## 17. Remaining open items

These questions are still open and should be fixed before implementation details are finalized:

1. The final multilingual wording for client-facing statuses.
2. The exact retention periods for leads, uploads, completed jobs, and warranty files.
3. Whether browser push will exist later as a notification channel.
4. Which exact CRM object in Bitrix24 becomes the request master after qualification.

---

## 18. Phase documents

Separate phase handoff documents are stored alongside this architecture:

| Phase | File | Status |
|---|---|---|
| Phase 1 | [historical_phase_1_website_foundation.md](../13_references_archive/historical_phase_1_website_foundation.md) | Closed |
| Phase 2 | [historical_phase_2_crm_and_external_channels.md](../13_references_archive/historical_phase_2_crm_and_external_channels.md) | Closed core / historical |
| Phase 2B | [historical_phase_2b_ai_chat_system.md](../08_ai_assistant/historical_phase_2b_ai_chat_system.md) | Historical / partly implemented |
| Phase 2C | [historical_phase_2c_cms_crm_split.md](../13_references_archive/historical_phase_2c_cms_crm_split.md) | Historical / partly implemented |
| Phase 3 | [full_customer_portal_plan.md](./full_customer_portal_plan.md) | Planned |
| Phase 4 | [security_compliance_operations_plan.md](../10_security_privacy/security_compliance_operations_plan.md) | Planned hardening |
| Phase 5 | [bitrix24_crm_integration_plan.md](../06_crm/bitrix24_crm_integration_plan.md) | Planned / deferred |

They should be used as short implementation briefs for the next agent.

### Phase 2 remaining items

- **Rate Limiting**: Anti-enumeration baseline for `/api/status`, `/api/contact`, `/api/admin/auth` endpoints. Ready to implement immediately.
- **Private Attachment Storage**: Deferred until chat and communication flow is validated.
- **Persistent Backend Chat**: Absorbed into Phase 2B (AI-Assisted Chat System).
