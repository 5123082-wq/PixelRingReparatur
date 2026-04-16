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
