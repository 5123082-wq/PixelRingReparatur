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

### 2026-06-16
**Telegram Secure Intake Handoff**
- **Status**: Implementation baseline added.
- **Done**:
  - Added one-time Telegram intake links so the bot can send a protected website form URL for an existing Telegram CRM case.
  - Added a dedicated Telegram request form page and return page, keeping personal data submission on the PixelRing website while returning the customer to Telegram.
  - Added a Telegram intake submit API that formalizes the existing Telegram case, issues the PR number, stores attachments, sends the customer confirmation, and notifies managers.
  - Added `/request` and explicit form/request intent handling in the Telegram webhook, plus a return-command guard for `return_` deep links.
- **In Progress**:
  - Production validation with a real Telegram mobile client after deploying the migration and webhook code.
- **Next Action**:
  - Deploy, send `/request` in Telegram, submit the form, and confirm the same CRM case receives the PR number, timeline message, attachments, status button, and Telegram return.
- **Blockers/Risks**:
  - Automatic app return from a normal browser can be blocked by mobile OS/browser behavior; the fallback Telegram button remains required.
  - Telegram intent detection is keyword/command based for this MVP; broader AI-triggered form offers can be tuned later.
- **Updated Documents**: `docs/06_crm/README.md`, `docs/10_security_privacy/privacy_consent.md`, `PROGRESS.md`

### 2026-05-11
**CRM Operational Object Map Concept**
- **Status**: Planned / documentation-only.
- **Done**:
  - Added the future internal CRM map concept for repaired, diagnosed-only, installed/serviced, active, and recurring customer objects.
  - Documented manager/admin filters by customer, organization, trading point, work type, case status, date range, region, source channel, and assigned operator/team.
  - Added privacy guardrails separating the internal CRM map from customer-facing portal maps and public status flows.
- **In Progress**:
  - No application code, geocoding, database model, or migration exists for this map yet.
- **Next Action**:
  - Decide whether the first CRM map planning pass should derive locations from existing case service-location data or wait for a dedicated service-object model.
- **Blockers/Risks**:
  - Customer trading-point networks and operational history are sensitive business data and require strict CRM authorization before map access or export.
- **Updated Documents**: `docs/06_crm/README.md`, `docs/06_crm/crm_requests_and_clients.md`, `PROGRESS.md`

### 2026-05-07
**Telegram Photo Attachments MVP**
- **Status**: In progress (implementation baseline added)
- **Done**:
  - Added Telegram photo file metadata typing and a Bot API `getFile` download path.
  - Added buffer-based attachment storage so server-side Telegram downloads can reuse the existing private attachment storage model.
  - Connected inbound Telegram photo messages to CRM `Attachment` records linked to the customer message and case.
  - Reused the existing CRM case media block and protected admin attachment proxy for display/download.
- **In Progress**:
  - Production validation with a real Telegram photo sent by a customer.
- **Next Action**:
  - Deploy and send one Telegram photo to an existing case; verify the timeline message appears and the image renders in the CRM `Media` block.
- **Blockers/Risks**:
  - This first pass supports Telegram `photo` messages only; documents, videos, audio, and voice messages remain placeholders.
  - Telegram files are stored as sensitive CRM attachments and must stay behind admin access controls.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-05-07
**Telegram Status Button Noise Reduction**
- **Status**: In progress (implementation baseline added)
- **Done**:
  - Changed Telegram AI replies so the status button is attached only for status/request-number tracking questions.
  - Changed AI prompt context so existing PR numbers are exposed to the assistant only for status-oriented turns.
  - Added explicit prompt guidance to collect new problem details instead of redirecting new problems to an existing request number.
- **In Progress**:
  - Production validation with a Telegram customer asking about a new problem after an existing PR number was issued.
- **Next Action**:
  - Deploy and verify that "new problem" messages do not receive the old status button, while "what is my request number/status" still does.
- **Blockers/Risks**:
  - Intent detection is keyword-based for this MVP; edge-case phrasing may still need tuning.
- **Updated Documents**: `docs/06_crm/README.md`

### 2026-05-07
**Telegram Admin Alerts MVP**
- **Status**: In progress (implementation baseline added)
- **Done**:
  - Added a shared server-side admin Telegram notification helper.
  - Replaced the website contact route's inline Telegram send path with the shared helper.
  - Added manager-chat alerts for new website requests and inbound Telegram customer messages.
  - Guarded Telegram customer intake so non-private chats, including the manager group, do not create CRM cases.
  - Added a `/chatid` group command so the owner can retrieve the manager group id without disabling the webhook.
  - Added `TELEGRAM_ADMIN_CHAT_ID` to the environment contract, with legacy `TELEGRAM_CHAT_ID` fallback.
- **In Progress**:
  - Owner creates the closed Telegram manager group and provides the group chat id.
- **Next Action**:
  - Deploy, add the bot to the closed manager group, run `/chatid`, configure `TELEGRAM_ADMIN_CHAT_ID`, redeploy if required by the host, and submit one website request plus one Telegram message to verify alerts.
- **Blockers/Risks**:
  - Alerts include customer contact/message previews, so the Telegram group must stay private and manager-only.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`, `signage-service/.env.example`
- **Later Improvements**:
  - Reduce noise by avoiding Telegram admin alerts for every message when a manager is already actively viewing the CRM case.
  - Make the alert type more visually explicit: new request vs. new customer message.
  - Keep the current `Open in CRM` action as the only button until a real manager workflow justifies actions such as `Later` or `In progress`.
  - Add a delayed alert for cases or customer messages that remain unanswered after a configured time window.

### 2026-05-06
**Telegram Status URL Buttons**
- **Status**: In progress (implementation baseline added)
- **Done**:
  - Added Telegram inline keyboard URL buttons to manual PR issue messages.
  - Added Telegram inline keyboard URL buttons to post-PR AI replies when a public request number exists.
  - Reused the existing case-access status-link session flow for each button URL.
- **In Progress**:
  - Production validation on Telegram mobile clients.
- **Next Action**:
  - Deploy and confirm the status button appears below PR issue and AI status replies.
- **Blockers/Risks**:
  - Telegram inline text links can be client-dependent visually; URL buttons are the primary UX.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-05-06
**Telegram AI Pause Policy**
- **Status**: In progress (behavior adjustment implemented)
- **Done**:
  - Changed manual Issue PR so it no longer disables case AI.
  - Kept customer-visible manager replies as the AI pause trigger.
  - Added automatic AI resume after a two-hour operator-message pause when the next Telegram text arrives.
  - Kept manual CRM AI toggle for immediate re-enable or disable.
- **In Progress**:
  - Production validation of post-PR assistant answers and manager handoff pause behavior.
- **Next Action**:
  - Deploy and test a post-PR customer question, then send a manager reply and confirm AI pauses until manual re-enable or timeout.
- **Blockers/Risks**:
  - Auto-resume is evaluated on the next Telegram text message, not by a background scheduler.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-05-06
**Telegram PR Status Link**
- **Status**: In progress (implementation baseline added)
- **Done**:
  - Added a case-access status link to manual Telegram PR issue messages.
  - Made the Telegram PR number clickable through Telegram HTML formatting.
  - Extended public status lookup to exchange a one-time URL access token into the existing HTTP-only case session flow.
- **In Progress**:
  - Production validation of tapping the Telegram PR number and seeing safe public status.
- **Next Action**:
  - Deploy and test a newly issued Telegram PR link on mobile Telegram.
- **Blockers/Risks**:
  - The status page still exposes only safe public status; portal registration remains the path for future customer actions.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

### 2026-05-06
**Telegram CRM Shared AI Assistant**
- **Status**: In progress (implementation baseline added)
- **Done**:
  - Added case-level AI control fields for external-channel CRM cases.
  - Connected Telegram webhook intake to the shared AI assistant engine instead of a Telegram-specific assistant.
  - Persisted AI replies into the same CRM case timeline as customer/operator messages.
  - Updated CRM case detail AI toggle so Telegram cases use case-level AI control.
  - Automatically pauses case AI when a manager sends a customer-visible reply or manually issues a PR number.
- **In Progress**:
  - Production validation with a real Telegram conversation and manager handoff.
- **Next Action**:
  - Deploy migration and validate AI ON, operator reply pause, manual re-enable, and manual PR issue behavior.
- **Blockers/Risks**:
  - Telegram file download/storage is still deferred; photo messages remain timeline placeholders.
- **Updated Documents**: `docs/06_crm/README.md`, `docs/08_ai_assistant/README.md`, `PROGRESS.md`

### 2026-05-06
**CRM Live Inbox**
- **Status**: In progress (live inbox baseline)
- **Done**:
  - Added per-manager case read state for unread customer-message tracking.
  - Added last-message metadata and unread counts to the CRM case list API.
  - Added a protected mark-as-read endpoint for case detail views.
  - Extended Ably publication to a shared CRM inbox channel.
  - Updated the CRM dashboard to live-refresh and highlight rows with unread customer messages.
- **In Progress**:
  - Production validation of unread badge clearing and live list ordering after deployment.
- **Next Action**:
  - Test from Telegram while the CRM dashboard is open, then open the case and confirm the unread badge clears.
- **Blockers/Risks**:
  - This tracks read state per admin user, not per team/role queue; team-level inbox rules can be added later.
- **Updated Documents**: `docs/06_crm/README.md`, `PROGRESS.md`

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
