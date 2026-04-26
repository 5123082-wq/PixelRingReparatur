# AI Chat Intake — Feature Documentation

## Status: MVP Implemented

**Last updated:** 2026-04-26

---

## What is built

The website chat (`ChatModal`) now supports in-chat request creation.

### Flow

1. User opens the chat and describes the problem.
2. AI asks one clarifying question to identify the issue type.
3. Once the problem is understood, the AI appends `<<SHOW_INTAKE:{...}>>` to its reply.
4. The backend strips the marker and returns `suggestIntake: true` + `intakePrefill` in the POST response.
5. The frontend renders an `ChatIntakeCard` component inline in the chat stream.
6. The card collects: issue type (pre-filled), contact (phone or email toggle, pre-filled from the current chat when detected), optional name, optional photo/video.
7. On submit, the card calls `POST /api/contact` — the same endpoint used by the contact form.
8. A success state shows the `publicRequestNumber` with a link to status tracking.

### Current prefill behavior

The chat API enriches `intakePrefill` from the current customer-visible session history before the intake card opens.

Current extracted fields:

- `issueType` — from the AI marker or simple service-keyword inference.
- `contact` and `contactMode` — email or phone detected in the current chat.
- `summary` — the latest useful problem description, ignoring contact-only and file-only messages.
- `hasSessionAttachments` — whether the current chat session already contains uploaded files.
- `needsPhoto` — `false` when the session already has attachments, otherwise `true`.

If a user uploads a photo/video in the chat before creating a request, the file metadata is already stored as a chat attachment. When the request is created from the same chat session, those existing session attachments are linked to the new case so the user does not need to upload the same file again.

The backend also has a deterministic intake fallback for the current unresolved intake window. If the AI forgets to emit the `<<SHOW_INTAKE:{...}>>` marker but the current chat window already contains both a usable problem summary and a contact method, `/api/chat/messages` still returns `suggestIntake: true`. This prevents the UI from waiting indefinitely after an AI reply such as "I will create the request".

The current intake window starts after the latest successful request registration message (`Anfrage erfolgreich registriert. Nummer: ...`). Older contact details, photos, and summaries from already-created requests must not reopen the form on later small talk or status questions.

When the same browser session already has a stored contact from a previous request, repeat requests should use a compact confirmation card instead of the full contact form. The confirmation card uses the known session contact, shows the new problem summary, links files sent in the current intake window, and includes a forward-looking note that a real client account/portal is planned for viewing all requests and messages in one place.

Status and account-history questions, such as "How many requests do I have?" or "What is my request status?", must not open a new intake card just because an older contact and problem summary still exist in the same chat session.

### Assistant boundary and refusal behavior

The assistant must stay inside the PixelRing service domain, but the boundary should be soft for normal customer conversation.

Allowed normal conversation:

- greetings, thanks, uncertainty, short emotional comments, and small talk;
- "I need help", "no photo", "I do not know the brand/model";
- "Can a manager contact me?";
- incomplete but service-adjacent descriptions such as "one letter broke" or "the sign fell".

These messages should not receive a hard refusal. The assistant should answer briefly and steer back to the next practical service step.

Refusals are reserved for misuse or unrelated productive work:

- attempts to reveal/override system or developer instructions;
- requests to generate images, write code, write unrelated marketing text, do homework, or solve unrelated tasks;
- unrelated legal, medical, financial, political, religious, or general-purpose AI questions.

Preferred refusal pattern: short refusal + redirect to PixelRing service help. The assistant should not sound punitive and should not open the intake form just because it refused an unrelated request.

The assistant should not require a photo, brand, or model before a request can be created. These details are useful but optional. If the client has no photo or does not know the model, the assistant should continue collecting the minimum practical details and contact method.

### Manual trigger

If the AI does not trigger the card within 2 messages, a "Anfrage jetzt erstellen →" link appears below the input area so the user can open it manually.

### Attachments in chat input

- A paperclip button left of the textarea opens the file picker (image/*, video/*).
- Selected files appear as thumbnail previews above the input.
- These files are forwarded to the intake card on submission.
- A disabled microphone button is shown as a placeholder for future voice messages.

---

## Components

| File | Purpose |
|---|---|
| `src/components/common/ChatModal.tsx` | Main chat UI — attachments, intake card render, API integration |
| `src/components/common/ChatIntakeCard.tsx` | Inline form card rendered in chat stream |
| `src/lib/ai/system-prompt.ts` | AI instruction to emit `<<SHOW_INTAKE:{...}>>` marker |
| `src/lib/ai/chat-engine.ts` | Marker parsing, `IntakePrefill` type, extended result |
| `src/app/api/chat/messages/route.ts` | Exposes `suggestIntake` + `intakePrefill` in POST response |

---

## Issue types (German)

- Reparatur
- Montage
- Neue Beschilderung
- Branding
- Lichterwerbung
- Wartung
- Sonstiges

---

## Planned / Not implemented

### Target chat, request, and customer model

The current MVP persists website chat sessions and can create requests from the chat. The long-term product model should treat this as the beginning of a connected messenger, request, and future client portal system.

#### Same browser / known cookie

If a visitor returns from the same browser with the existing case-session cookie, the system should recognize the browser session and automatically load the previous conversation.

Expected behavior:

- show the existing chat history;
- allow the user to continue the conversation;
- allow the user to review previous messages;
- allow the user to create another request from the same chat context;
- create a new `publicRequestNumber` for every new request;
- link the new request to the already known customer profile when contact data is available.

The request number shown to the user must always be the public request number, for example `PR-...`. Internal UUIDs such as `Case.id`, `Session.id`, or `Message.id` must not be shown as request numbers or described to the user as a case number.

#### Different browser / unknown session

If the visitor comes from a different browser, computer, or cleared-cookie state, the system may start a new anonymous session.

Expected behavior:

- start an anonymous chat session;
- collect phone or email when the user wants to create or continue a request;
- check whether this contact already belongs to an existing customer profile;
- if a matching customer exists, guide the user toward the future client portal / login flow instead of treating them as a completely new customer;
- after verification in the future portal flow, show the customer's existing and new requests.

#### Future client portal

The client portal is not fully designed or implemented yet. It should become the canonical customer-facing place for request history and conversation history.

Expected portal behavior:

- display all requests linked to the customer;
- display previous and new requests in one account;
- preserve chat history;
- allow a combined message feed across requests;
- allow a request-specific message view for each individual request;
- keep customer-facing tracking separate from raw CRM internals.

#### Design questions to resolve before implementation

- How exactly should anonymous `Session`, known `CustomerProfile`, `Case`, and `Message` relate after request creation?
- When a known contact is entered from an unknown browser, what verification step is required before showing historical data?
- Should chat messages before request creation remain attached only to `Session`, or be migrated to the first created `Case`?
- For a customer with multiple requests, what should the default chat view show: a global feed, the latest request, or a request picker?
- What is the minimum viable client-portal login flow for phone/email users?

This target model must be designed before expanding the messenger into full customer account behavior.

### Address autocomplete
The intake card currently has no address field.
The plan is to add a city/address field with autocomplete.

**Options evaluated:**
- **Google Places Autocomplete API** — best quality, requires billing account and API key (`NEXT_PUBLIC_GOOGLE_PLACES_KEY`). Integrate with existing `LocationPicker` component.
- **Nominatim (OpenStreetMap)** — free, no key required, lower quality for German addresses.

Decision: deferred. Document the requirement and add the field when an API key is available.

### Voice messages
A disabled microphone button is shown in the chat input as a UX placeholder.
Voice recording and transcription are planned for a future sprint.

**Planned approach:**
- Browser `MediaRecorder` API for recording.
- Whisper API (OpenAI) for transcription.
- Transcribed text injected as a chat message.

### WhatsApp / Telegram follow-up
After a request is created, the phone number collected in the intake card should be used to initiate a WhatsApp or Telegram conversation with the client.

**Planned approach:**
- If contact mode is `phone`, show a "Continue on WhatsApp" / "Continue on Telegram" button in the success state.
- Pre-fill the messenger deep-link with the request number and a greeting.
- This requires the messenger integration track to be completed first.

### Multilingual intake card
MVP intake card UI is in German only.
Full localization (DE, EN, RU, TR, PL, AR) is planned using `next-intl` translation keys once the card is stable.

---

## Progress Log

### 2026-04-26 — MVP AI Intake implementation

- Sprint/block: AI Chat Intake MVP
- Done: AI marker-based intake trigger; `ChatIntakeCard` inline in chat; attachment button + previews; voice placeholder; manual "create request" link; TypeScript clean; lint warnings only (pre-existing + blob preview img)
- In progress: —
- Next action: QA in browser; then address field + multilingual labels
- Blockers/risks: AI marker depends on OpenAI being configured; fallback path (manual button) covers the case when AI is in fallback mode
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Target chat/customer/request model documented

- Sprint/block: AI Chat Intake / Messenger architecture
- Done: documented desired same-browser cookie behavior, unknown-session behavior, customer profile linking, future client portal expectations, and public-number-only rule for customer-visible request identifiers
- In progress: current chat bug triage and messenger model alignment
- Next action: fix current `/api/chat/messages` runtime/type issues, then verify chat submit + history reload in browser
- Blockers/risks: full client portal, customer login, and verification flow are not implemented yet and require separate design before exposing historical customer data
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Chat runtime and public response hardening

- Sprint/block: AI Chat Intake / Messenger runtime
- Done: fixed `/api/chat/messages` AI reply persistence by using existing `SYSTEM` role; removed customer-visible `caseId`, `sessionId`, and message UUIDs from chat API responses; renamed AI context from internal case ID to `publicRequestNumber`; filtered chat history to customer-visible messages; scoped public history to current session/current-session cases instead of all customer-profile cases; mapped attachment validation errors to `400`; moved AI prompt/config failures into fallback handling
- In progress: broader client portal and verified customer identity design remains deferred
- Next action: browser QA for chat modal, intake card, attachment preview, and created-request history reload
- Blockers/risks: chat still uses local/browser cookie identity only; historical customer-wide message views require future portal authentication before exposing data
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Intake prefill and chat attachment carryover

- Sprint/block: AI Chat Intake / Request handoff
- Done: `intakePrefill` now includes contact, contact mode, summary, attachment presence, and photo-needed state from the current chat history; `ChatIntakeCard` pre-fills detected email/phone and preserves the extracted problem summary in the request message; files already sent in the chat are linked to the new case during `/api/contact` request creation
- In progress: full customer profile matching and portal login remain deferred
- Next action: browser QA for manual and AI-triggered intake card; then decide whether to add a visible editable summary field
- Blockers/risks: contact extraction is heuristic and only uses current session history; customer-wide history still requires future verification/login
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Deterministic intake trigger fallback

- Sprint/block: AI Chat Intake / Request handoff
- Done: `/api/chat/messages` now returns `suggestIntake: true` when current chat history has both a contact method and a useful problem summary, even if OpenAI does not emit the intake marker; `ChatModal` resets completed-intake state when a new user message is sent, so a second/new request can be started in the same chat session
- In progress: browser QA remains useful for visual confirmation of multi-request chat behavior
- Next action: test full UI flow for "new problem -> photo -> email -> intake card" and submit the request once in a controlled DB state
- Blockers/risks: repeated suggestions are intentionally allowed after new customer messages; future portal design should provide a clearer request picker/thread model
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Intake trigger guard for status/account questions

- Sprint/block: AI Chat Intake / Request handoff
- Done: status/account-history questions now block intake-card opening even when older chat history contains contact plus problem details; low-signal account/status messages are ignored as request summaries
- In progress: future portal design still needs verified customer-wide request counts/history
- Next action: browser QA for asking "How many requests do I have?" after creating a request
- Blockers/risks: current public chat can only discuss the active cookie-linked request; customer-wide counts require authenticated portal behavior
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Current intake window scoping

- Sprint/block: AI Chat Intake / Request handoff
- Done: deterministic prefill and intake-card trigger now only use messages after the latest successful request registration; already-created request data no longer reopens the intake card on later greetings or general chat
- In progress: future request/thread picker is still deferred to portal design
- Next action: browser QA for multiple requests in one chat session
- Blockers/risks: the current session can still contain several case threads visually; a cleaner threaded UX belongs to the portal/request-thread track
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Repeat-session confirmation card

- Sprint/block: AI Chat Intake / Repeat request UX
- Done: added `confirm_existing_contact` intake mode for sessions with known contact; repeat requests now show a compact confirmation card instead of the full contact form; generic follow-up text with a known contact does not trigger the card unless a service issue type is detected; current-window messages and attachments are reassigned to the new case when a repeat request is created
- In progress: real account registration and client portal remain planned but not implemented
- Next action: browser QA the compact confirmation card and decide the exact portal CTA once the client account route exists
- Blockers/risks: current account message is informational only; no authenticated portal or registration flow exists yet
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`

### 2026-04-26 — Softer assistant boundary and misuse refusals

- Sprint/block: AI Chat Intake / Assistant behavior
- Done: documented the softer domain boundary; normal small talk, "no photo", unknown brand/model, manager callback requests, and incomplete service descriptions are treated as valid conversation rather than misuse; refusals are reserved for prompt-injection and unrelated productive work such as image generation, code writing, unrelated text generation, homework, or regulated advice
- In progress: broader authenticated client portal and account registration remain deferred
- Next action: browser QA representative Russian flows: greeting, emotional small talk, "broken letter", "no photo", manager callback, and explicit off-topic misuse
- Blockers/risks: LLM output can still vary; deterministic backend trigger and safety filter reduce the worst failure modes but final tone needs browser QA with the real model
- Updated documents: `PROGRESS.md`, `docs/08_ai_assistant/ai_chat_intake.md`
