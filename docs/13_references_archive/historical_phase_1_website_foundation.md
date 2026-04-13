# Phase 1
## Website foundation and first real `Status` flow

### Status

Closed as MVP-complete on `2026-04-05`.
The core website-native request flow, public request number issuance, same-device restore, and the first real `Status` lookup are implemented.
The remaining continuity and production-hardening items discovered during implementation are deferred to **Phase 2** to keep the phase boundary explicit.

### Goal

Build the website-native request flow that works without relying on external messengers.

### Scope

- persistent website chat;
- persistent website request form;
- draft session before request creation;
- automatic request-number creation for website-origin requests;
- optional diagnostic media upload (photos/videos) immediately after request issuance;
- portal database and private file storage foundation;
- initial `Status` page;
- same-device restore through secure signed cookie;
- basic CRM sync stub or integration contract.

### Must preserve

- email is not mandatory at request creation;
- request number alone never reveals private data;
- website chat remains the preferred `TOP` channel;
- no `localStorage` auth;
- no public private-file exposure.

### Out of scope

- full customer account;
- SMS OTP;
- secure messenger login;
- full Bitrix24 operator workflow;
- diagnosis, warranty, and full cabinet sections.

### Main deliverables

- request and message persistence model;
- attachment upload path with private storage;
- request-number generation for website-origin flows;
- client-visible confirmation with request number;
- basic `Status` lookup screen;
- server-side authorization and rate limiting baseline.

### MVP Exit Acceptance

The bullets below reflect the actual exit criteria used to close Phase 1 after deferring the remaining continuity work to **Phase 2**.

- a website-origin request survives reload and browser close if the signed session is still valid;
- the client sees a real request number after minimum intake is completed;
- the request can be found in the backend and prepared for CRM mapping;
- no fake in-memory behavior remains in the production path for the website form and initial `Status` lookup.

### Deferred To Phase 2

- private attachment upload path and storage foundation for `Attachment`;
- server-side rate limiting / anti-enumeration baseline for intake and `Status`;
- persistent backend-backed website chat replacing the current client-only chat flow;
- draft session before request creation for website-origin flows;
- CRM sync stub / integration contract for website-origin requests.
