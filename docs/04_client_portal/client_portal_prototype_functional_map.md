# Client Portal Prototype Functional Map

Source prototype: `docs/04_client_portal/prototype/index.html`

Date: 2026-04-30
Status: Draft for owner approval before further application implementation.

## Purpose

This document freezes the approved client portal prototype as a functional and UX map before more Next.js implementation work continues.

The current production implementation must not drift into a generic dashboard. The working application should translate the prototype into production code while preserving its information architecture, dense business-app shell, customer-safe data rules, and module relationships.

This document is not a database migration plan. It is the approval checklist for what the portal must feel like and how modules must connect.

## Prototype Frame

The prototype is a customer-safe B2B cabinet for a verified business account.

Persistent shell:

- dark left sidebar with PixelRing brand mark;
- account switcher with verified business identity;
- grouped navigation;
- security note that a PR number alone must not expose private request data;
- main content area with one active view at a time;
- modal work surfaces for request detail and object detail.

Primary interaction primitives:

- `showView(viewId)` switches the active portal view and active sidebar item;
- `openCaseModal()` opens a customer-safe request work surface;
- `openObjectModal()` opens an object/location detail work surface;
- modal background click closes the modal;
- modal internal click does not close the modal.

## Navigation Inventory

### Cabinet

- Overview: `dashboard`
- My requests: `requests`
- New request: `new-request`
- Chat and notifications: `messages`

### Service

- Objects: `objects`
- Equipment and advertising assets: `equipment`
- Maintenance plan: `maintenance`
- Photo reports: `reports`
- Warranties: `warranties`

### Business

- Offers and approvals: `offers`
- Invoices and acts: `billing`
- Documents: `documents`
- Team: `team`
- Settings: `settings`

Implementation rule: the first production pass may disable or preview future sections, but the navigation structure should remain recognizable and stable.

## Module Map

### Overview

Role: operating dashboard for a verified customer.

Header:

- eyebrow: Client Portal / future phase;
- greeting;
- short explanation;
- notifications button linking to Chat and notifications;
- create request button linking to New request.

Cards and blocks:

- PixelAI Concierge with active-action summary;
- KPI cards: active requests, objects, warranties, planned maintenance;
- Requires action list;
- Active requests table;
- Upcoming events timeline;
- Object health block.

Interactions:

- notifications opens `messages`;
- create request opens `new-request`;
- open actions opens `requests`;
- first approval task opens request detail modal;
- active requests table row for `PR-26F4-K8M2` opens request detail modal;
- all requests button opens `requests`.

Implementation status proposal:

- MVP now: dashboard shell, KPI cards from connected fixture data, action list, active requests summary, events, object health.
- Demo-only now: PixelAI Concierge action generation and reminder behavior.
- Future: live AI summaries, real notification counts, real object-health scoring.

### My Requests

Role: customer-visible request tracking without raw CRM internals.

Table columns:

- PR number;
- work;
- object;
- customer-safe status;
- next action;
- action button.

Prototype rows:

- `PR-26F4-K8M2`: estimate approval for Tesla Center Berlin;
- `PR-93A1-L7Q4`: visit window confirmation for Apple Store Cult;
- `PR-B204-M1X8`: photo upload needed for McFit Spandau;
- `PR-C817-Q9A2`: completed work with report available.

Interactions:

- Filter button is a future filter surface;
- New request opens `new-request`;
- Open buttons open request detail modal;
- Report button opens `reports`.

Implementation status proposal:

- MVP now: request list from connected fixture data and links/detail modal or route.
- Demo-only now: approval/change request actions, upload prompts.
- Future: persisted status history, authorized customer files, real filters.

### New Request

Role: quick authenticated entry point for service requests.

Request type cards:

- Repair;
- Warranty;
- Planned maintenance.

Form fields:

- object;
- priority;
- description;
- desired service window;
- confirmation contact.

Actions:

- submit for review;
- add photo.

Process explanation:

- draft;
- contact verification;
- working request.

Implementation status proposal:

- MVP now: visual flow and draft-only demo action, connected to existing public intake only after separate approval.
- Demo-only now: object selector and attachment button.
- Future: portal-authenticated request creation, uploads, request-number creation after verified identity.

### Objects

Role: locations as business cost and service centers.

Filters:

- network/organization;
- city;
- location format;
- financial risk.

Object cards:

- Tesla Center Berlin with cost alert, assets, requests, YTD spend, maintenance date;
- Apple Store Cult with service window and on-track status;
- McFit Spandau with photo/risk state.

Each card includes:

- image;
- status tag;
- address/contact/access summary;
- mini stats;
- asset composition teaser;
- open affordance.

Interactions:

- Add object is future/admin-controlled;
- Apply filters is future;
- object cards open object detail modal.

Implementation status proposal:

- MVP now: object cards from connected fixture data and object detail modal/route.
- Demo-only now: add object and filtering behavior.
- Future: organization-scoped object CRUD, permissions, cost tracking.

### Equipment And Advertising Assets

Role: asset inventory broader than signage.

Filters:

- location;
- category;
- equipment type;
- condition.

Asset category cards:

- outdoor advertising;
- indoor advertising;
- stickers and banners;
- menus and print;
- staff clothing.

Asset table columns:

- asset;
- object;
- category/type;
- service logic;
- condition;
- owner.

Prototype asset rows:

- facade sign TESLA;
- seasonal window graphics;
- digital menu board frames;
- outdoor promo banner set;
- staff apron batch;
- interior wayfinding kit.

Implementation status proposal:

- MVP now: read-only asset inventory from fixture data.
- Demo-only now: add asset, filters, search.
- Future: asset lifecycle, reorder thresholds, campaign materials, service intervals.

### Maintenance Plan

Role: planned maintenance visits and recurring service commitments.

Cards:

- Tesla Center Berlin on `03.05`;
- BMW Hamburg on `18.05`;
- Retail network quarterly package.

Actions:

- schedule maintenance.

Implementation status proposal:

- MVP now: read-only planned maintenance cards connected to objects/requests.
- Demo-only now: schedule action.
- Future: recurring agreements, technician windows, reminders.

### Photo Reports

Role: customer-facing before/after and diagnostic reports.

Cards:

- before image;
- after image;
- diagnostic image;
- report card for `PR-C817-Q9A2` with PDF download.

Implementation status proposal:

- MVP now: read-only report previews for fixture requests.
- Demo-only now: PDF download button.
- Future: authorized file downloads and structured report records.

### Warranties

Role: warranty records for completed work.

Table columns:

- object;
- work;
- valid until;
- status;
- action.

Prototype rows:

- Tesla Center power supply ending soon;
- Apple Store LED modules and soldering active;
- BMW Hamburg contour lighting active.

Implementation status proposal:

- MVP now: read-only warranty table from fixture data.
- Demo-only now: open/document actions.
- Future: warranty documents, warranty claims, expiry reminders.

### Chat And Notifications

Role: unified customer-visible communication history, excluding internal operator notes.

Incoming cards:

- technician/customer coordination message for `PR-93A1-L7Q4`;
- estimate-ready notification for `PR-26F4-K8M2`.

Notification timeline:

- estimate awaiting response;
- warranty ending.

Interactions:

- first incoming message opens request detail modal;
- notifications should link back to the relevant request, warranty, document, or object.

Implementation status proposal:

- MVP now: read-only customer-safe message previews.
- Demo-only now: live messaging and notification count.
- Future: persisted portal messaging, unread counts, notification preferences.

### Offers And Approvals

Role: customer-visible estimates and approval decisions.

Table columns:

- document;
- request;
- amount;
- status;
- action.

Prototype rows:

- `KP-2026-0418` for `PR-26F4-K8M2`, awaiting response, approve action;
- `KP-2026-0331` for `PR-C817-Q9A2`, approved, PDF action.

Implementation status proposal:

- MVP now: read-only approval preview linked to requests.
- Demo-only now: approve button.
- Future: persisted approval workflow, change requests, signed audit trail.

### Invoices And Acts

Role: billing preview for customer-visible financial documents.

Cards:

- paid invoice `INV-1048`;
- service report/act `SR-921`;
- future online payment note.

Implementation status proposal:

- MVP now: disabled/preview only.
- Demo-only now: PDF buttons.
- Future: requires separate billing/legal approval; no online payment until approved.

### Documents

Role: archive aggregating customer-visible files.

Table columns:

- name;
- type;
- related entity;
- date;
- action.

Prototype rows:

- BMW Hamburg photo report;
- Apple Store warranty;
- Tesla Center estimate.

Implementation status proposal:

- MVP now: read-only document index from fixture data.
- Demo-only now: PDF action.
- Future: authorized downloads, retention/deletion/export workflows.

### Team

Role: organization access for B2B accounts.

Table columns:

- user;
- role;
- access;
- status.

Prototype roles:

- Owner;
- Facility manager;
- Finance.

Implementation status proposal:

- MVP now: disabled/preview only.
- Demo-only now: invite button.
- Future: organization members, role assignments, portal RBAC.

### Settings

Role: identity, privacy, language, and data requests.

Cards:

- Account: email, login method, language;
- Privacy: export request, contact correction, deletion request.

Implementation status proposal:

- MVP now: read-only settings preview and demo logout/auth state.
- Demo-only now: privacy request buttons.
- Future: verified identity settings, notification settings, data export/deletion workflows.

## Request Detail Modal

Role: customer-safe request work surface.

Header:

- back/close button;
- PR number and object;
- work summary and customer status;
- approve button;
- request changes button.

Left column:

- next action card;
- progress timeline;
- customer files.

Main column:

- request summary;
- estimate and visit window;
- included work list;
- request chat;
- message input with attachment icon and send button.

Interactions:

- opened from dashboard, request list, and messages;
- approve/change actions belong to Offers and Approvals;
- chat belongs to Chat and Notifications;
- files belong to Documents/Photo Reports;
- progress belongs to Request Tracking.

Implementation status proposal:

- MVP now: customer-safe fixture detail, linked from request cards/table.
- Demo-only now: approve/change request, message send, attachment upload, file download.
- Future: real mutations with CSRF, rate limits, audit trail, authorization.

## Object Detail Modal

Role: object/location business passport and asset workspace.

Header:

- back/close button;
- object name and address;
- description;
- create request for object;
- export.

Left object passport:

- budget/YTD card;
- responsible people;
- access and restrictions;
- management summary;
- repairs and service;
- invoices and costs.

Main workspace:

- object composition;
- search and filters;
- expandable asset categories;
- asset rows with status and open action;
- business-owner summary cards: downtime risk, seasonal readiness, next savings.

Interactions:

- opened from object cards;
- create request should prefill object in New Request;
- asset rows should eventually open asset detail;
- costs and invoices connect to Billing/Documents;
- repairs connect to Requests/Maintenance/Warranties.

Implementation status proposal:

- MVP now: object detail view/modal from fixture data with expandable category lists.
- Demo-only now: create request, export, filters, asset open.
- Future: asset detail pages, cost accounting, object-specific permissions.

## Cross-Module Data Relationships

The portal must use connected data, not isolated mock cards.

Core entities:

- organization/account;
- portal user/contact;
- object/location;
- asset;
- request;
- request status/timeline;
- message/notification;
- offer/approval;
- document/file;
- photo report;
- warranty;
- invoice/act;
- maintenance event.

Required relationships:

- every request belongs to one organization and one object;
- every object belongs to one organization;
- every asset belongs to one object;
- every message belongs to a request or object context;
- every offer belongs to a request;
- every document belongs to a request, object, asset, warranty, invoice, or organization;
- every warranty belongs to completed work/request and optionally an asset;
- every invoice/act belongs to a request/object/organization;
- dashboard counts must be derived from these records;
- notifications must link to the relevant entity.

## Implementation Approval Matrix

| Area | First implementation target | Must stay preview/disabled until approved |
| --- | --- | --- |
| Shell/sidebar | Implement visually close to prototype | None |
| Dashboard | Implement with connected fixture data | Live AI/reminders |
| Requests | Implement list and detail | Real approval mutations |
| New request | Implement UI and draft behavior | Production portal request creation |
| Objects | Implement cards and detail | Object CRUD |
| Assets | Implement read-only inventory | Asset CRUD/reorder |
| Maintenance | Implement read-only cards | Scheduling |
| Reports | Implement previews | Authorized downloads |
| Warranties | Implement read-only list | Claims/document downloads |
| Messages | Implement previews | Live chat/send |
| Offers | Implement read-only/preview | Approval/change mutations |
| Billing | Preview only | Payments/accounting workflow |
| Documents | Read-only index | Downloads/export/retention |
| Team | Preview only | Invites/RBAC |
| Settings | Read-only/demo state | Privacy workflows |

## Acceptance Criteria Before Code Continues

- Owner approves this functional map.
- Owner confirms which modules are MVP now versus preview.
- Implementation work uses the prototype layout as the UX reference.
- Production code may adapt tokens and components, but must preserve the dense cabinet structure.
- Any deviation from the prototype must be named before implementation.
- No private data should be exposed from PR number alone.
- No billing, team access, or privacy workflow should become real without separate approval.

## Progress Log

### 2026-04-30

- Current sprint/block: Client Portal prototype alignment before further implementation.
- Done: inventoried prototype navigation, views, cards, modals, interactions, and cross-module relationships.
- In progress: owner review and approval of this functional map.
- Next action: after approval, create a staged implementation checklist that maps each approved prototype block to existing Next.js files and missing components.
- Blockers/risks: current coded portal has drifted from the agreed prototype; continuing code work before approval risks compounding that drift.
- Updated documents: `docs/04_client_portal/client_portal_prototype_functional_map.md`.

### 2026-04-30

- Current sprint/block: Stage 2.5 Prototype Alignment implementation pass.
- Done: restored prototype-style portal navigation and added read-only/demo surfaces for overview actions, request table, new request, messages, objects, asset inventory, maintenance, reports, warranties, offers, billing, documents, team, and settings in `PortalDashboard.tsx`.
- In progress: visual owner review against the standalone prototype.
- Next action: compare the running `/ru/portal` screen by screen with `docs/04_client_portal/prototype/index.html`, then tighten spacing/labels/interactions before adding real backend functionality.
- Blockers/risks: this is still a demo/read-only alignment layer; real approvals, downloads, team invites, billing, privacy workflows, object CRUD, and portal request creation remain disabled until separately approved.
- Updated documents: `PROGRESS.md`, `docs/04_client_portal/client_portal_prototype_functional_map.md`.
