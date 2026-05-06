# 06 CRM

Purpose: internal request management, customer operations, status flow, and external CRM integrations.

Planned base documents:
- `crm_overview.md`
- `requests_and_cases.md`
- `customers_and_contacts.md`
- `status_flow.md`
- `operator_workflows.md`
- `attachments_and_messages.md`
- `external_crm_integrations.md`

## Progress Log

### 2026-05-06
**CRM Realtime Messaging**
- **Status**: In progress (Ably live update baseline)
- **Done**:
  - Selected Ably Pub/Sub as the managed realtime layer for CRM case updates.
  - Added a protected CRM token endpoint design so browser clients can subscribe only to authorized case channels.
  - Added backend realtime event publication points for Telegram intake and CRM case mutations.
- **In Progress**:
  - Browser subscription validation on production after deploy.
- **Next Action**:
  - Deploy Ably integration and test Telegram inbound messages appearing in open CRM case views without manual refresh.
- **Blockers/Risks**:
  - Ably events are notification signals only; the database remains the source of truth and CRM refreshes case data after events.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-05-06
**Telegram CRM MVP**
- **Status**: In progress (implementation baseline added)
- **Done**:
  - Added Telegram external conversation mapping for CRM cases.
  - Added Telegram webhook intake path for customer messages into the CRM case timeline.
  - Added CRM-to-Telegram reply delivery from the case detail composer.
  - Added manual PR issue action for Telegram draft cases.
- **In Progress**:
  - Validation and deployment setup for Telegram webhook secrets.
- **Next Action**:
  - Rotate the exposed Telegram bot token, set server env vars, deploy, and register the Telegram webhook.
- **Blockers/Risks**:
  - Telegram file download/storage is intentionally deferred; non-text Telegram messages are logged as placeholder timeline messages.
  - The bot token pasted into chat must be revoked before production use.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-04-16
**Sprint 1B: CRM Modernization**
- **Status**: Complete (chat usability hotfix)
- **Done**:
  - Restored vertical scrolling in the CRM case-detail chat by fixing the flex/min-height chain on the right-side conversation panel.
  - Changed case opening behavior so the chat lands on the latest message instead of the first message in the thread.
  - Limited that positioning to the initial open of a case, without forced re-scroll on later data refreshes inside the same case.
  - Moved the reply composer back into the normal layout flow so recent messages are no longer visually trapped behind the floating input block.
- **In Progress**:
  - None.
- **Next Action**:
  - Verify the same conversation behavior with longer real-world threads and future Communication Master integration.
- **Blockers/Risks**:
  - No automated browser verification was run in this patch; behavior was validated structurally in code and will benefit from manual UI confirmation.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-04-15
**Sprint 1B: CRM Modernization**
- **Status**: Complete (UI/UX Layer)
- **Done**:
  - Full structural overhaul of the Case Detail page (Left-Info/Right-Chat layout).
  - Implemented "System-X" premium design system (Carbon/Indigo palette).
  - Added `framer-motion` for fluid page transitions and chat interaction.
  - Implemented Floating Command Bar with glassmorphism backdrop.
  - Restored persistent Author Badges (AI/Human/Client) for full transparency.
  - Implemented auto-scroll to bottom for messenger context.
- **Next Action**:
  - Backend integration for "Communication Master" tab.
  - Operational testing with real-time WebSocket connection for chat.
- **Blockers**: None.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`.
