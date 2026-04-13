# Final Build Prompt Pack for Antigravity
## Implementation prompt package
### AI-first multilingual one-stop service company for signs, repairs, installation and branding

---

## 1. Как использовать этот документ
Этот документ — production-oriented prompt pack для Antigravity.

Он нужен, чтобы агент строил продукт:
- не теряя стратегию;
- не превращая сайт в marketplace;
- соблюдая multilingual architecture;
- соблюдая intake / AI / handoff logic;
- соблюдая security и privacy guardrails.

Использование:
1. Сначала дать master build prompt.
2. Потом поэтапно запускать prompts по epics.
3. После каждой сборки делать review against trust / UX / security criteria.

---

## 2. Главный build-принцип

Собираемый продукт должен быть:
- section-based;
- multilingual-first;
- mobile-first;
- trust-first;
- one-stop service oriented;
- AI-assisted but human-accountable;
- security-aware;
- privacy-aware.

Он не должен:
- выглядеть или функционировать как contractor marketplace;
- включать contractor directory patterns;
- раскрывать внутреннюю партнерскую модель наружу;
- использовать unsafe shortcuts.

---

## 3. MASTER BUILD PROMPT FOR ANTIGRAVITY

Build a production-ready multilingual web application for an AI-first one-stop service company that handles sign repair, installation, dismantling, light advertising, new signs, branding and related service requests.

Critical business rule: the product must not look like or function as a contractor marketplace. It must behave like a real service company with one intake layer, one lead model, one service process and one accountable brand facade.

The application must support 6 languages from the start: German, English, Russian, Turkish, Polish and Arabic. German is the primary canonical language. Arabic requires RTL-aware support.

The product must include:
- public website pages;
- multilingual routing;
- trust-first homepage;
- service pages;
- how-it-works page;
- business page;
- cases page;
- contact page;
- intake flow;
- AI-assisted lead intake;
- photo upload;
- WhatsApp / Telegram continuation paths;
- voice / phone entry path placeholder or integrated flow;
- thank-you state;
- CRM-like lead storage;
- admin view;
- status model;
- human handoff logic;
- assignment-ready lead model;
- analytics instrumentation basics.

### Mandatory implementation constraints
- use reusable sections and page templates;
- preserve trust-first language and UX;
- do not expose partner marketplace mechanics in public UI;
- use secure defaults;
- do not hardcode secrets;
- enforce access control in admin and internal areas;
- keep multilingual content architecture maintainable;
- make mobile a first-class experience;
- keep intake fast and simple;
- preserve the idea: AI helps intake, then a human specialist continues.

### Required product behaviors
- users can start from form, photo, messenger or voice path;
- lead data is normalized into a unified lead model;
- preferred language is stored;
- handoff state is explicit;
- admin sees leads, statuses, language and attachments;
- assignment-ready structure exists even if partner portal is not public.

### Required architecture style
- modular
- section-based
- maintainable
- locale-aware
- security-aware
- privacy-aware

---

## 4. Prompt to build the application shell

Build the multilingual application shell.

Requirements:
- locale-aware routing for 6 languages;
- shared layout system;
- header with language switcher;
- footer with legal links;
- reusable page section renderer;
- mobile-first navigation;
- sticky CTA support for mobile;
- safe handling of RTL for Arabic.

The app shell must be easy to extend with new pages and localized content.

---

## 5. Prompt to build homepage and public pages

Build the public-facing trust-first pages based on a service-company model, not a marketplace model.

Pages required:
- homepage
- how-it-works
- services hub
- service page template
- business page
- cases page
- contact page
- legal pages

Requirements:
- use reusable components;
- preserve CTA hierarchy;
- support multilingual content;
- ensure public pages feel like one service company;
- avoid contractor directory UI patterns.

---

## 6. Prompt to build intake engine

Build a fast service intake engine.

Requirements:
- support scenario-first intake;
- support quick path;
- support photo-first path;
- support progressive steps;
- support preferred language selection or inheritance;
- support preferred contact method;
- support explicit thank-you / handoff state.

The intake must not feel like a long form. It must feel like guided service intake.

---

## 7. Prompt to build AI intake orchestration

Build the AI-assisted intake layer.

Requirements:
- support intent detection;
- support multilingual intake;
- ask one useful question at a time;
- extract structured lead data;
- produce a concise lead summary;
- trigger handoff when minimum data is available or user asks for a human;
- never use marketplace language;
- never claim exact pricing without sufficient data;
- never act as if AI fully replaces the human specialist.

Store:
- transcript
- extracted fields
- language
- scenario
- handoff state

---

## 8. Prompt to build photo upload flow

Build a secure photo-first intake path.

Requirements:
- upload should be easy from mobile;
- file handling must be secure;
- files must not be publicly exposed;
- upload path must connect to the lead model;
- user can continue after upload with minimal extra steps.

Security constraints:
- allowlist file types;
- size limits;
- no public storage exposure;
- access-controlled retrieval.

---

## 9. Prompt to build messaging continuation paths

Build continuation paths for WhatsApp and Telegram.

Requirements:
- user can move from website to messenger naturally;
- the lead record preserves channel information;
- handoff pages explain what happens next;
- language preference is preserved where possible;
- external messaging should not break the unified lead model.

---

## 10. Prompt to build voice / phone path

Build a minimal but structured voice/phone entry path.

Requirements:
- clear explanation of what the user should say;
- ability to store voice entry or a placeholder for voice workflow;
- voice path must connect back to the lead model;
- follow-up state must be visible in admin.

If full voice implementation is too heavy for MVP, create the architecture and placeholder states so it can be enabled safely later.

---

## 11. Prompt to build lead model and CRM layer

Build the internal lead model and admin-ready storage layer.

Requirements:
- unified lead model for all intake channels;
- store source channel;
- store intake channel;
- store preferred language;
- store contact data;
- store attachments;
- store AI summary and transcript;
- store status and history;
- store handoff state;
- support assignment-ready fields.

This must be designed as an operational lead system, not as a public marketplace backend.

---

## 12. Prompt to build status system and handoff model

Build a clear lead status system and human handoff logic.

Requirements:
- statuses must be explicit;
- handoff must be visible;
- no lead should be orphaned;
- admin must see who owns the lead;
- transitions should be logged;
- language and urgency must remain visible during handoff.

---

## 13. Prompt to build admin dashboard

Build a secure admin dashboard for service operations.

Admin must be able to:
- view new leads;
- filter by status, language, channel, urgency and service category;
- open lead detail;
- view attachments;
- view transcript / summary;
- assign owner;
- update status;
- trigger follow-up;
- see handoff state.

Security requirements:
- role-based access;
- no public exposure;
- audit logging for critical actions;
- minimal data exposure by role.

---

## 14. Prompt to build assignment-ready operations layer

Build the internal assignment-ready structure.

Requirements:
- allow storing specialist / partner capabilities;
- allow geography and language matching;
- allow assignment ownership;
- allow quality / active status fields;
- do not expose this as a public specialist directory.

The assignment system can be internal-only in MVP, but data structures must be ready.

---

## 15. Prompt to build analytics instrumentation

Add analytics instrumentation across the site and intake flow.

Track at minimum:
- page_view
- CTA_click
- intake_started
- intake_step_completed
- photo_uploaded
- messenger_handoff_clicked
- intake_completed
- handoff_triggered
- lead_created
- language_selected

Dimensions should include:
- language
- source
- device
- page
- service scenario
- channel

Do not expose sensitive lead content into product analytics.

---

## 16. Prompt to enforce security and privacy baseline

Apply the security and privacy guardrails to the whole implementation.

Requirements:
- no hardcoded secrets;
- role-based access control;
- server-side authorization for internal resources;
- secure file upload handling;
- safe handling of transcripts and attachments;
- consent-aware forms and flows;
- minimal PII exposure;
- audit logging for privileged actions;
- no unsafe debug output in production.

The implementation must follow security-by-design and privacy-by-design principles.

---

## 17. Prompt to review against anti-marketplace criteria

Review the built product and refactor any part that makes it feel like a contractor marketplace.

Look for and remove:
- contractor listing patterns;
- comparison patterns;
- public specialist cards;
- wording that implies “finding a contractor” rather than “submitting a task to the service company”;
- any UI that weakens the one-stop service perception.

Refine the product so it consistently feels like one accountable service company.

---

## 18. Prompt to review multilingual quality

Review the application for multilingual quality.

Check:
- all public pages on all 6 languages;
- CTA consistency;
- text overflow;
- trust-copy integrity;
- AI prompts / messages;
- form labels;
- thank-you states;
- RTL handling for Arabic.

Fix any layout or wording issue that harms trust or clarity.

---

## 19. Prompt to review mobile-first quality

Review the application for mobile-first behavior.

Check:
- CTA visibility above the fold;
- sticky CTA behavior;
- photo upload ease;
- messenger access;
- intake step usability;
- language switcher accessibility;
- readability in all 6 languages.

Refine all key flows so the primary experience works smoothly from mobile.

---

## 20. Prompt to prepare launch-ready build

Prepare the app for MVP launch.

Requirements:
- all P0 features complete;
- core pages live;
- intake flow stable;
- AI handoff stable;
- admin visible and usable;
- analytics active;
- legal pages accessible;
- language switching stable;
- no critical trust-breaking or security issues in core flows.

Return a launch-readiness summary grouped by:
- product
- UX
- multilingual
- operations
- security

---

## 21. Build review checklist for Antigravity agent

After each major build phase, review against:
- Does it still feel like a service company?
- Is the next user action obvious?
- Is multilingual support intact?
- Is the intake too complex?
- Is the handoff clear?
- Are security and privacy guardrails still respected?
- Is any internal partner logic leaking into public UI?

---

## 22. Expected output package from Antigravity

After implementation, the build should include:
- multilingual public site
- reusable page system
- intake flow
- AI-assisted intake orchestration
- photo upload path
- messenger continuation paths
- thank-you state
- lead model
- admin dashboard
- status and handoff logic
- analytics basics
- security/privacy baseline

---

Конец Final Build Prompt Pack for Antigravity.

