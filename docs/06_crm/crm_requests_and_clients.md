# 02 CRM Requests And Clients

## Goal

`/ring-manager-crm` must remain the operational tool for requests, clients, communication, and service handoff.

The CRM is the source of truth for client-facing request lifecycle state until a future external CRM integration is introduced.

## Current CRM Baseline

Implemented now:

- hidden CRM login route;
- manager session cookie;
- case list with filters/search;
- manual case creation;
- case detail page;
- status update;
- status event history starter;
- message history;
- operator reply;
- internal notes starter;
- operator takeover for AI sessions;
- assignment field;
- persistent admin audit log starter for CRM actions;
- basic customer profile extraction/linking starter;
- attachment metadata and admin attachment endpoint;
- status lookup for customers.

Known gaps:

- status event history exists for starter flows, but the full operational timeline is not complete;
- audit logging exists for starter CRM actions, but coverage still needs production review;
- customer profile extraction/linking exists as a starter, but merge/deduplication and privacy workflows are not complete;
- no client merge/deduplication;
- assignment is a free-form operator field, not a full owner/team model;
- no SLA/priority model;
- no internal operational map of repaired, diagnosed, or serviced customer objects;
- no external CRM sync yet;
- no attachment scanning/quarantine workflow;
- no granular RBAC beyond `MANAGER` and `OWNER`.

## Core CRM Areas

### Dashboard

CRM dashboard should show:

- new requests;
- urgent requests;
- waiting for customer;
- in progress;
- overdue status updates;
- operator takeover sessions;
- recent customer replies;
- attachment review queue.

### Request List

Required list capabilities:

- filter by status;
- filter by channel;
- filter by locale;
- search by public request number;
- search by name/email/phone;
- date range filter;
- pagination;
- count of messages and attachments;
- clear visual status labels.

Future list capabilities:

- assigned operator;
- priority;
- SLA breach flag;
- unread customer message flag;
- map/list toggle for cases with known service object coordinates;
- export with permission gate.

### Request Detail

Required detail capabilities:

- public request number;
- current status;
- origin channel;
- customer name/email/phone;
- primary contact method;
- summary and description;
- message timeline;
- attachment list;
- operator reply composer;
- operator takeover toggle;
- status change control.

Future detail capabilities:

- service estimate;
- technician handoff checklist;
- customer-visible vs internal-only message refinements;
- richer related-request and customer timeline views.

### Customers

First customer model can be derived from `Case` fields, but the target CRM needs a separate customer profile.

Target customer fields:

- name;
- email;
- phone;
- preferred language;
- preferred contact method;
- company name;
- address or service location;
- linked cases;
- consent and communication notes.

Required behavior:

- do not expose all PII by default;
- avoid duplicate customers where possible;
- link requests by verified contact data;
- keep customer deletion/anonymization policy separate from case history.

### Operational Object Map

The CRM should include a future internal interactive map for managers and administrators.

Purpose:

- show every customer object/location where PixelRing did operational work;
- distinguish repaired objects, diagnosed-only objects, installation/service objects, and recurring customer locations;
- help managers understand geographic concentration, customer networks, route density, repeated issues, and service history;
- provide a staff-only operational view that is richer than the customer-facing portal map.

Map entities:

- service object/location;
- customer profile or organization;
- linked cases/requests;
- work category;
- visit or diagnostic record;
- service outcome;
- object status from the CRM perspective.

Core map layers:

- repaired objects;
- diagnosed-only objects;
- completed installations or service visits;
- active/open requests;
- recurring or permanent customers;
- customer trading-point networks;
- priority/risk markers for repeated issues or follow-up needs.

Required filters:

- customer or organization;
- trading point/object;
- case status;
- work type;
- repaired vs diagnosed-only;
- date range;
- city/region;
- assigned operator or team;
- source channel;
- recurring/permanent customer flag.

Interactions:

- click a map pin to open a CRM-safe object summary;
- show linked public request numbers and internal case references to authorized managers only;
- jump from object summary to filtered case list or case detail;
- filter one customer's full trading-point network on the map;
- show cluster view for dense city areas;
- export only after explicit permission gate and privacy review.

Guardrails:

- this is an internal CRM operations tool, not a public customer portal feature;
- CRM map pins may include sensitive operational history and must require manager/admin authorization;
- no raw CRM internals should leak into customer-facing maps or status pages;
- object coordinates and customer location history must be treated as sensitive business data;
- request number alone must never authorize access to map data.

Target concepts:

- `CrmServiceObject`
- `CrmServiceObjectVisit`
- `CrmObjectWorkSummary`
- `CrmObjectMapLayer`
- `CrmCustomerNetwork`

These names are planning names, not required final Prisma model names.

### Communication

Message history should be append-only.

Rules:

- customer messages remain immutable;
- operator messages remain immutable after send, except through explicit correction records later;
- AI messages must be labeled as system/AI-generated;
- operator takeover stops automated AI replies for that session/case;
- internal notes must not be customer-visible by default.

### Status Flow

Status transitions should become a server-side state machine.

Current statuses:

- `DRAFT`;
- `FORMALIZED`;
- `NUMBER_ISSUED`;
- `UNDER_REVIEW`;
- `WAITING_FOR_CUSTOMER`;
- `IN_PROGRESS`;
- `ON_HOLD`;
- `READY_FOR_PICKUP`;
- `COMPLETED`;
- `CANCELLED`.

Target behavior:

- allowlist valid transitions server-side;
- require reason for risky transitions;
- write status event history with actor, from, to, reason, timestamp;
- expose only safe status descriptions on the public status page.

### Attachments

Private customer attachments are not CMS media.

Required attachment behavior:

- access through protected endpoints only;
- private storage or signed URLs;
- allowlist MIME and extensions;
- size limits;
- checksum;
- scan/quarantine workflow before operator download in later phase;
- customer-visible flag.

### External CRM

Bitrix24 or another CRM remains a future integration layer.

The internal portal must continue to work without it.

When external CRM sync is introduced:

- portal remains the source of truth for public request number and customer-facing status;
- external IDs are stored as mappings;
- sync failures are visible in admin;
- manual fallback remains possible.

## First CRM Milestone

Starter scope already completed:

- status event history;
- audit log for status and operator takeover;
- assignment field;
- internal notes;
- basic customer profile extraction or linking.

The next CRM milestone should continue operational reliability hardening:

- stricter attachment access review;
- attachment scanning/quarantine workflow;
- customer merge/deduplication;
- internal operational object map for repaired, diagnosed, and recurring customer locations;
- SLA and priority model;
- full owner/team assignment model;
- object-level authorization tests for case, message, attachment, and customer profile access.

## Progress Log

### 2026-05-11

- Current sprint/block: CRM operational object map concept.
- Done: added a future internal CRM map concept for repaired, diagnosed-only, installed/serviced, active, and recurring customer objects; documented map layers, filters, interactions, data concepts, and privacy guardrails.
- In progress: documentation-only; no CRM map UI, geocoding, object model, or migrations exist yet.
- Next action: decide whether CRM object mapping should start from known case service-location data or wait for a dedicated service-object model.
- Blockers/risks: customer locations, trading-point networks, and operational history are sensitive business data; map access needs CRM authorization and must stay separate from customer-facing portal maps.
- Updated documents: `docs/06_crm/crm_requests_and_clients.md`, `docs/06_crm/README.md`, `PROGRESS.md`.
