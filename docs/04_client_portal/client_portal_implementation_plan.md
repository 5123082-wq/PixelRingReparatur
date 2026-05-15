# Client Portal Implementation Plan

## Purpose

This document turns the approved client-portal prototype into a staged implementation plan for the Next.js application.

The implementation must start with a simple, stable portal shell and only then move into forms, object tools, request tools, documents, reports, and business workflows.

The goal is not to ship every prototype feature in one pass. The goal is to build the correct structure so each later feature has a clear place, data boundary, and interaction path.

## Current Boundary

As of `2026-04-28`, the real application has:

- public request intake;
- public request/status lookup;
- persisted AI chat and request creation;
- internal CRM starter;
- internal CMS/admin starter;
- customer profiles and related request linking at starter level.

The real application does not yet have:

- full customer portal routes;
- customer login/signup UI;
- verified customer account dashboard;
- organization/member portal access;
- object/location inventory;
- customer-visible asset catalog;
- structured photo reports;
- warranty module;
- billing/invoice module.

Therefore, the first implementation must be a controlled portal foundation, not a broad data-model expansion.

## Product Rules To Preserve

- PixelRing remains one accountable service company, not a marketplace.
- The portal is for customers and business clients to manage service continuity.
- AI may assist intake and navigation, but human specialists execute the work.
- Customer-facing data must not expose raw CRM internals.
- Public request number alone must never reveal private data.
- Full portal access requires verified customer identity, with verified email as the default first method.
- German remains canonical-first; MVP languages remain DE, EN, RU, TR, PL, AR.
- Arabic UI must remain RTL-aware when portal routes become localized.

## Market Positioning And Target Segments

The portal should be positioned as a platform for owners and managers of physical locations who need control over visual brand assets, signage health, campaigns, reports, and service requests.

Canonical positioning:

> A platform for owners and managers of location networks that monitors the health of signs, storefronts, visual advertising materials, and service requests for repair, audit, and updates.

The implementation should support this positioning without turning PixelRing into a marketplace or contractor directory.

Primary pilot segments:

- HoReCa chains: restaurants, cafes, bakeries, and food-service networks with menus, windows, POS materials, seasonal campaigns, and staff clothing.
- Retail: fashion, grocery, cosmetics, electronics, and local retail chains with storefronts, signage, window graphics, POS and campaign materials.
- Medical centers and clinics: clinics, dental practices, and medical groups with strict information-board, wayfinding, and regulatory signage needs.

Secondary future segments:

- gas stations, car services, and auto dealers;
- franchise networks;
- shopping centers and business centers;
- other multi-location businesses with recurring visual-brand maintenance needs.

Segment implications:

- asset categories must go beyond signs;
- objects must support recurring campaign/material updates;
- medical/safety segments need versioning and compliance-aware records;
- franchise use cases need brand-compliance workflows;
- shopping/business centers need zones/floors/wayfinding structure later.

## Implementation Strategy

The portal should be implemented as a layered product:

1. Portal shell and navigation.
2. Read-only dashboard using safe mock/adapted data.
3. Request list and request detail.
4. New request flow connected to existing intake logic.
5. Organization/object/asset workspace.
6. Customer-safe messaging and notifications.
7. Reports, warranties, documents, and billing previews.
8. Verified identity, access control, and organization member roles.

Each layer should be useful on its own and should not require the full future platform to exist.

## Route Shape

Recommended initial route structure:

- `/[locale]/portal`
- `/[locale]/portal/requests`
- `/[locale]/portal/requests/[publicRequestNumber]`
- `/[locale]/portal/new-request`
- `/[locale]/portal/objects`
- `/[locale]/portal/objects/[objectId]`
- `/[locale]/portal/assets`
- `/[locale]/portal/suppliers`
- `/[locale]/portal/location-intelligence`
- `/[locale]/portal/messages`
- `/[locale]/portal/reports`
- `/[locale]/portal/warranties`
- `/[locale]/portal/documents`
- `/[locale]/portal/settings`

Billing routes should stay hidden or read-only until the billing/accounting decision is approved:

- `/[locale]/portal/billing`
- `/[locale]/portal/offers`

## Navigation Model

The left navigation from the prototype should be preserved conceptually:

- Overview
- Requests
- New request
- Chat and notifications
- Objects
- Equipment and advertising assets
- Suppliers
- Location intelligence
- Maintenance plan
- Photo reports
- Warranties
- Offers and approvals
- Invoices and acts
- Documents
- Team
- Settings

The first coded version should not enable every section as a full tool. It may show clear disabled/coming-soon states for sections that require backend models.

## Implementation Source Of Truth

When implementation starts, the agent must use three sources together:

1. Product and architecture logic:
   - this document;
   - `request_tracking_and_customer_portal_architecture.md`;
   - `full_customer_portal_plan.md`;
   - `project_state_and_roadmap.md`.
2. Visual and interaction reference:
   - `docs/04_client_portal/prototype/index.html`.
3. Production design code:
   - existing `signage-service` layouts, Tailwind patterns, typography, spacing, colors, components, responsive rules, i18n conventions, and route patterns.

The prototype defines the intended cabinet structure and interaction model. The production app defines how that idea should be implemented in real code.

Important:

- do not copy the prototype's inline CSS directly into production;
- do not copy prototype mock customer names, object names, or request data directly;
- do not invent a new visual system that ignores the public website/admin design code;
- do not reduce the portal to a generic dashboard if the prototype already defines a richer business-cabinet model.

## Design Translation Rules

The implementation should recreate the cabinet as intended, not merely approximate it.

Preserve from the prototype:

- dense business-app shell;
- left navigation model;
- compact dashboard cards;
- active work/action cards;
- request detail as a customer-safe work surface;
- object detail as a business center with responsible people, access, assets, service, costs, and risks;
- supplier map as a future business tool for logistics planning across customer locations;
- asset catalog with object/category/type/status filters;
- expandable asset categories;
- clear links between dashboard, requests, objects, assets, suppliers, documents, reports, and warranties.

Translate into production code:

- use the real app's design tokens and Tailwind/component conventions;
- reuse existing button/card/form patterns where they exist;
- keep typography and spacing aligned with the existing site;
- make RTL behavior possible for Arabic from the start;
- keep responsive behavior consistent with the current public site and admin surfaces;
- prefer real reusable components over large single-file page markup.

Do not preserve from the prototype:

- inline styles;
- random demo data;
- unrealistic account names;
- hardcoded private request data;
- billing/payment promises that are not approved;
- fake access to documents, reports, or warranties without authorization.

## Portal Feature Boundaries

The customer portal must be implemented as a separate feature area inside the existing `signage-service` Next.js application.

It must not become a separate project outside `signage-service`, and it must not scatter portal-specific code across unrelated public website folders.

Recommended file ownership:

```txt
signage-service/src/app/[locale]/portal/
```

Use for localized portal routes and route-level layouts:

- `layout.tsx`;
- `page.tsx`;
- `requests/`;
- `new-request/`;
- `objects/`;
- `assets/`;
- `messages/`;
- `reports/`;
- `warranties/`;
- `documents/`;
- `settings/`.

```txt
signage-service/src/components/portal/
```

Use for portal-only UI components:

- portal shell;
- sidebar/header;
- dashboard cards;
- request cards and request detail widgets;
- object cards and object detail widgets;
- asset filters and expandable category lists;
- empty states;
- portal-specific form sections.

```txt
signage-service/src/lib/portal/
```

Use for server-side portal logic:

- access checks;
- customer/organization scoping;
- request mappers;
- object/asset mappers;
- customer-safe status/data mapping;
- document/report helpers;
- seed/demo adapters.

```txt
signage-service/src/app/api/portal/
```

Use only when an API route is actually needed for portal mutations or client-side interactions.

Prefer Server Components and server-side helpers for read paths where possible, because the portal is a private customer area and should keep client-exposed API surface small.

```txt
signage-service/scripts/
```

Use for deterministic seed scripts such as a future `seed-portal-demo` script for the connected `Pixel Ring GmbH` scenario.

```txt
signage-service/src/lib/portal/types.ts
```

Use for portal-specific types unless the project already has a stronger local convention for shared type files.

Rules:

- do not place portal UI in `src/components/sections/`;
- do not place portal-only components in broad `common` folders unless they are genuinely reusable outside the portal;
- do not mix portal data helpers into public website content/CMS helpers;
- do not create generic abstractions before at least two real portal use cases need them;
- keep public website, admin/CMS, CRM, and portal ownership boundaries clear;
- if a component becomes genuinely shared later, move it intentionally with a small refactor and update imports.

## Pre-Code Decisions And Stage 1 Constraints

These decisions are fixed for the first real implementation pass.

### Portal Entry And Authentication

Detailed account and verification rules are defined in `accounts_and_identity.md`.

The implementation decision is:

- public request intake may continue to accept either phone or email;
- full portal access requires verified email;
- passwordless magic link is the preferred first production login method;
- phone may support status lookup, recovery, or operator-assisted verification, but is not the default portal identity;
- portal sessions must use HTTP-only cookies;
- no portal auth tokens in `localStorage`;
- request number alone is never a login method.

Security requirements:

- login and verification responses must avoid account, request, or contact enumeration;
- login and verification attempts must be rate-limited;
- verification tokens must be single-use, short-lived, and stored hashed if persisted;
- responses for unknown emails, request numbers, or claim attempts must be generic;
- logout and session expiry are required before production.

### Stage 1 Demo Mode

Before database migrations are introduced, the first portal shell may use a local demo mode.

Environment variables:

```env
PORTAL_DEMO_ENABLED=true
PORTAL_DEMO_EMAIL=pr-portal@pixel-ring.com
```

Rules:

- `.env.local` stores only demo-mode flags and demo email;
- connected demo data must not live in `.env.local`;
- connected demo data should live in typed fixture code under `signage-service/src/lib/portal/demo-data.ts`;
- demo data must use the `Pixel Ring GmbH` scenario;
- demo mode must be impossible to confuse with production customer data;
- demo mode must be easy to disable.

### Stage 1 Data Strategy

Stage 1 should not create database migrations.

Use typed fixture tables in code for the first portal shell:

```txt
signage-service/src/lib/portal/demo-data.ts
```

The fixture must include complete connected records for:

- organization;
- demo account/email;
- two objects;
- object contacts;
- assets;
- requests;
- request messages;
- request statuses;
- reports/documents/warranties where shown in the UI.

Rules:

- no disconnected mock cards;
- no copied prototype names/data;
- every dashboard number must be backed by fixture data;
- every object card must link to object fixture data;
- every request card must link to request fixture data;
- when the UI and scenarios are accepted, these fixtures become the basis for Prisma seed scripts and staged migrations.

### Stage 1 Language Scope

Use German as canonical product language and Russian for design review.

Implementation rules:

- avoid hardcoded copy in components where the existing app uses `messages/*.json`;
- first shell may prioritize DE and RU strings;
- keep the structure compatible with EN/TR/PL/AR expansion;
- do not break RTL readiness for Arabic.

### Stage 1 Scope Choice

The first implementation should be:

- portal shell;
- demo auth gate;
- connected `Pixel Ring GmbH` fixture data;
- dashboard/section placeholders backed by fixtures where possible;
- no migrations;
- no real billing;
- no real private document downloads;
- no broad organization/member CRUD;
- no production deletion workflow execution.

The purpose is to test cards, navigation, data relationships, and visual/UX flow before committing the model into the database.

## Connected Seed Data Scenario

The first real implementation needs one coherent test account instead of disconnected mock cards.

Use the account name:

- `Pixel Ring GmbH`

This account should have two test objects:

1. `Pixel Ring Showroom Berlin`
2. `Pixel Ring Service Hub Potsdam`

The seed scenario must be internally consistent:

- every request belongs to `Pixel Ring GmbH`;
- every request belongs to one of the two objects;
- every object has responsible contacts;
- every object has advertising assets;
- every asset belongs to exactly one object;
- every asset has category, type, status, and service relevance;
- every customer-visible message belongs to a request;
- every report, warranty, offer, invoice, or document belongs to a request, object, asset, or organization;
- no dashboard number should appear without backing seed data;
- no card should refer to a missing object, missing request, missing asset, or missing document.

Suggested seed shape:

### Organization

- Name: `Pixel Ring GmbH`
- Type: business customer
- Primary verified email: `pr-portal@pixel-ring.com`
- Language preference: German first, with RU/EN test copy allowed where needed during design review

### Object 1: Pixel Ring Showroom Berlin

Purpose:

- public showroom and customer consultation space.

Suggested assets:

- exterior illuminated PixelRing sign;
- window graphics set;
- entrance opening-hours sticker;
- indoor wayfinding signs;
- brochure and price-card print set;
- branded staff shirts.

Suggested requests:

- active repair request for exterior sign power supply;
- completed window graphics replacement;
- planned preventive inspection.

### Object 2: Pixel Ring Service Hub Potsdam

Purpose:

- operational/service location for workshop, storage, and dispatch.

Suggested assets:

- workshop exterior sign;
- warehouse bay labels;
- vehicle magnet/signage set;
- safety and wayfinding stickers;
- banner set for local campaigns;
- technician workwear set.

Suggested requests:

- active request for damaged bay label replacement;
- completed banner reorder;
- warranty-linked repair for exterior light module.

The exact final data should be refined during implementation, but the principle is fixed: seed data must be connected, realistic, and complete enough for the portal to demonstrate real workflows.

## Database And Migration Strategy

The portal needs database support, but schema work must be staged.

Do not start by creating the final broad schema for every future module. Start with the minimum needed for the next working stage and expand only when the UI/workflow demands it.

Recommended migration phases:

1. Portal identity/session bridge:
   - verified customer identity;
   - portal session;
   - request-to-customer access claims.
2. Organization and member foundation:
   - organization;
   - member/contact;
   - organization-level customer access.
3. Object/location foundation:
   - customer object/location;
   - object responsible contacts;
   - access/service-window notes.
4. Asset catalog foundation:
   - asset;
   - asset category/type;
   - asset-object relation;
   - asset status and service metadata.
5. Customer-visible operational records:
   - report;
   - warranty;
   - customer-visible document;
   - offer/invoice read-model if approved.

Migration rules:

- every migration must have a clear product use in the current or next stage;
- do not create billing/payment tables until billing scope is approved;
- do not create broad RBAC tables before portal roles and enforcement rules are documented;
- seed scripts must be deterministic and idempotent where possible;
- seed data must not contain real personal data;
- files/documents must not be stored as public paths;
- object/document access must be scoped server-side to the current organization/customer.

## Portal Security Baseline

The portal is a customer account area, so security quality is part of the feature, not a later cleanup.

Mandatory baseline:

- server-side authorization for every portal data read and mutation;
- portal session in HTTP-only secure cookies;
- no portal tokens, access claims, or private customer data in `localStorage`;
- public request number is never treated as authorization;
- all request detail, object detail, document, report, warranty, and asset views must be scoped by verified customer/organization access;
- generic error responses for failed access or lookup to reduce enumeration risk;
- rate limiting for login/magic link, lookup, message send, request creation, upload, and document download;
- server-side validation for every portal form;
- upload MIME/size validation and safe storage keys;
- customer-visible documents and media served only through authorized routes or short-lived signed URLs;
- no raw CRM status, internal note, internal UUID, admin audit data, or operator-only metadata in customer responses;
- audit logging for sensitive future actions such as document download, member invitation, role changes, approval actions, and deletion/export requests;
- privacy/export/delete workflows must be planned before exposing broad customer history.

Implementation should prefer failing closed. If the system cannot prove the current user is allowed to see an object/request/document, it should not render it.

## Portal Administration Model

The customer portal will need administration inside the existing internal admin platform.

This should be reserved during design even if not implemented in the first portal shell.

Admin ownership should be split clearly:

- CRM owns operational request work: statuses, operator replies, case handling, attachments, service execution, and customer-visible operational updates.
- Portal admin owns customer account access, organization setup, subscriptions/limits, feature flags, data requests, and portal visibility controls.
- CMS owns public/content surfaces and should not become the owner of private customer account data.

The portal must not become a separate unmanaged system. Internal staff need one controlled place to manage which organizations can use the portal and which features they can access.

## Subscription And Plan Control

The portal is expected to support paid enhanced functionality later.

The first commercial control should be designed around subscription plans and limits, but online billing/payment implementation should remain deferred until explicitly approved.

Potential plan dimensions:

- number of customer objects/locations;
- number of organization members;
- number of tracked advertising assets;
- request history retention period visible in the portal;
- photo/video report availability;
- warranty archive availability;
- document archive availability;
- offer/quote approval workflow;
- invoice/act visibility;
- planned maintenance/SLA features;
- AI Concierge and spend insights;
- export/reporting features.

The first simple commercial limiter can be:

- maximum number of active customer objects.

Draft plan packaging:

- `Start`: up to 5 objects; basic object/asset registry; simple repair/update requests; limited report/document archive.
- `Growth`: up to 20-30 objects; object health map; warranty notifications; campaign updates across groups of objects; expanded archive and reporting.
- `Enterprise`: 50+ objects; SLA/service agreement options; dedicated manager; advanced roles; integrations; possible portal branding/white-label-style presentation after separate approval.

Planning concepts:

- `PortalPlan`
- `PortalPlanFeature`
- `PortalSubscription`
- `PortalUsageLimit`
- `PortalFeatureFlag`

These are planning names, not required final Prisma model names.

Rules:

- do not hardcode plan behavior into UI components;
- plan/feature checks must happen server-side;
- UI may hide or disable unavailable features, but server authorization must still enforce limits;
- exceeding object/member/asset limits should produce clear customer-safe messaging;
- subscription/payment provider integration is out of scope until a billing decision is approved.

Pricing logic should prefer object and asset scale over internal operator count. User/member limits can exist, but the main value unit is controlled physical presence: objects and assets.

## Campaign And Brand Compliance Workflows

The strategy introduces workflows that are not simple repairs.

These should be reserved in the product model after the first request/object/asset layers are stable.

### Campaign Updates

Campaign workflows cover recurring or seasonal changes across multiple locations:

- menu updates;
- window graphics replacement;
- seasonal banners;
- POS material swaps;
- price-card updates;
- promotional print production;
- staff clothing reorder.

Future portal behavior:

- select multiple objects;
- select affected asset categories;
- upload/choose approved artwork or material template;
- create one campaign request that generates object-level tasks;
- track completion per object;
- attach photo proof and documents per object.

### Brand And Franchise Compliance

Brand-compliance workflows cover consistency across owned or franchise locations:

- approved asset templates;
- required asset checklist per object type;
- photo-control checkpoints;
- non-compliance history;
- approval before local signage/material changes;
- exception records.

Guardrail:

- franchise/partner workflows must not turn the product into a marketplace. PixelRing remains the accountable service company or controlled service coordinator.

These workflows are future layers and should not block the first portal shell.

## Admin Modules To Reserve

Reserve future admin navigation/modules under the existing admin platform.

Suggested route shape:

```txt
/ring-master-config/dashboard/portal
/ring-master-config/dashboard/portal/customers
/ring-master-config/dashboard/portal/accounts
/ring-master-config/dashboard/portal/plans
/ring-master-config/dashboard/portal/features
/ring-master-config/dashboard/portal/usage
/ring-master-config/dashboard/portal/data-requests
/ring-master-config/dashboard/portal/demo-data
/ring-master-config/dashboard/portal/audit
```

Suggested module responsibilities:

- `Portal Overview`: metrics, active organizations, plan usage, pending data requests.
- `Customers / Organizations`: create, inspect, suspend, or link customer organizations.
- `Portal Accounts`: verified emails, active sessions, recovery status, member invitations.
- `Plans`: plan definitions, object/member/asset limits, enabled feature sets.
- `Features`: feature flags by organization, beta access, disabled modules.
- `Usage`: object count, asset count, member count, storage/report usage.
- `Data Requests`: export, correction, deletion, restriction requests.
- `Demo Data`: create/reset `Pixel Ring GmbH` demo account and connected seed scenario.
- `Portal Audit`: sensitive portal admin actions and customer data access events.

Do not implement these admin routes as empty production clutter until the portal shell needs them. But reserve the architecture and naming now so implementation does not grow in the wrong place.

## Customer Data Deletion Workflow

Customer deletion must be a workflow, not a blind delete button.

GDPR/DSGVO deletion rights must be supported, but deletion is not always absolute because some records may need retention for legal, tax, contractual, security, or legal-claims reasons.

The workflow should support:

1. Customer or admin creates a data deletion request.
2. Admin reviews identity, organization scope, and affected data.
3. System classifies data:
   - delete now;
   - anonymize/pseudonymize;
   - retain with reason;
   - manual review required.
4. Admin confirms execution.
5. System deletes/anonymizes eligible records.
6. System removes active portal access and sessions if appropriate.
7. System records an audit event with what was deleted, retained, and why.
8. Customer receives a customer-safe confirmation.

Data classes:

- portal account/session data;
- organization/member records;
- requests/cases;
- customer-visible messages;
- uploads/attachments;
- reports;
- warranties;
- documents;
- invoices/acts/offers;
- audit/security records;
- CRM/internal operational records.

Deletion rules:

- do not delete data outside the scoped customer/organization;
- do not leave orphan documents, attachments, messages, assets, or object records;
- do not delete invoices/tax/legal records if retention is legally required;
- do not delete internal audit records in a way that removes security accountability;
- where retention is required, detach from active portal access and minimize/pseudonymize where legally appropriate;
- deletion/export operations must be audited.

Future implementation should include a dry-run/preview step showing affected records before destructive execution.

## Data Retention And Export Boundaries

The portal should eventually support:

- customer data export;
- correction requests;
- deletion requests;
- restriction of processing requests.

Retention periods must be confirmed legally for Germany/EU before production release.

Working assumptions until legal confirmation:

- unqualified leads should not be retained indefinitely;
- completed service requests may need longer operational retention;
- invoices/tax documents may require statutory retention;
- audit/security records may require separate retention;
- uploaded photos/videos should have their own retention policy;
- warranty records must remain available for the warranty period unless legal deletion overrides apply.

Do not promise exact retention periods in the UI until they are approved.

## Pilot And Demo Readiness

The first real implementation should be useful for demos and pilot sales, not only internal engineering validation.

Stage 0-1 should prepare a credible demonstration path using the connected `Pixel Ring GmbH` seed scenario.

Demo scenario requirements:

- two objects with complete asset composition;
- at least one active request requiring customer action;
- at least one completed request with report/warranty/document trail;
- one planned maintenance or campaign-style action;
- object-level cost/service summary;
- dashboard numbers backed by the seed records;
- no copied prototype names or disconnected mock records.

Pilot focus:

- start with 1-2 segments, preferably HoReCa and local retail;
- optimize the first demo around the "object health + asset registry + request creation" aha moment;
- avoid promising billing, white-label, external contractor marketplace, or full integrations during pilot demos unless actually implemented.

The portal shell should therefore be demo-ready, but it must clearly separate implemented functionality from planned/disabled modules.

## Portal Success Metrics

The portal should be instrumented later around business outcomes, not only page views.

Product metrics:

- number of organizations with portal access;
- number of objects created per organization;
- percentage of objects with completed asset composition;
- number of tracked assets by category;
- number of requests created through the portal versus legacy channels;
- planned requests versus emergency requests;
- report/document/warranty views;
- quote/approval response time if offers are implemented;
- object health/risk status over time.

Customer value metrics:

- avoided emergency incidents;
- warranty-covered repairs versus paid repairs;
- average repair cycle time;
- reduction of repeated manual coordination;
- campaign completion rate across objects;
- cost per object over time.

Commercial metrics:

- demo to pilot conversion;
- pilot to paid conversion;
- retained customers after first year;
- growth in number of objects/assets per customer;
- plan upgrade rate;
- customer acquisition cost versus lifetime value.

Do not add analytics/tracking before privacy and consent requirements are defined for the portal context.

## Future Platform Risks And Guardrails

Some marketing strategy ideas are valid but must remain future-only until explicitly approved.

### External Service Partners

Partner contractor workflows can be useful later, but they must not make the product look like:

- a marketplace;
- a contractor directory;
- a "find a master" platform.

If implemented, external partners must appear as controlled service capacity coordinated by PixelRing, with PixelRing remaining accountable to the customer.

### White-Label Platform Direction

White-label or platform-for-contractors positioning is strategic future scope.

It must not influence the current MVP architecture unless the owner explicitly reopens the business model. The current product remains PixelRing customer portal first.

### Separate Platform Brand

Separating the portal brand from the service brand is a future marketing/brand decision.

Do not introduce a separate product brand in code, routing, copy, or database naming during the current portal implementation unless approved.

## Data Ownership Model

### Request Data

Source:

- existing `Case` / request flow;
- status events;
- customer-visible messages;
- attachments that are safe for customer display.

Portal rendering rule:

- use public request number;
- map internal status to customer-facing labels;
- never show internal case ID, raw CRM fields, internal notes, admin audit logs, or assignment internals.

### Customer Identity

Initial phase:

- same-device session and public status lookup can point users toward the portal;
- full dashboard requires verified identity.

Target phase:

- verified email magic-link login;
- authenticated portal session in HTTP-only cookie;
- request-to-customer linkage via server-side checks.

### Objects And Assets

The prototype introduces a business asset model, but implementation should not start by creating every final database table.

Initial implementation options:

- start with read-only mock data inside portal UI while route and layout are established;
- then add a small internal adapter that maps known request locations to displayable object cards;
- only after UX stabilizes, introduce persistent object/asset models.

Target concepts:

- `CustomerOrganization`
- `CustomerOrganizationMember`
- `CustomerLocation`
- `CustomerLocationContact`
- `CustomerAsset`
- `CustomerAssetCategory`
- `CustomerAssetServiceRecord`
- `CustomerVisibleDocument`

These names are planning names, not required final Prisma model names.

### Location Intelligence And New Object Search

Location intelligence is a future business-portal module for customers that want to open new locations.

The goal is to help a verified business account compare candidate locations before committing to rent, buildout, or launch.

Planned location tools:

- interactive map mode for evaluating new object candidates;
- manual candidate location entry by address, coordinates, or area;
- saved favorite/candidate locations with notes, status, source, and decision stage;
- competitor layer showing nearby competitor locations, density, and distance/radius around the candidate point;
- optional delivery coverage layer for planned delivery radius, drive time, or service area assumptions;
- supplier/logistics overlay showing how well the candidate location fits current and backup suppliers;
- comparison view for multiple candidate locations.

Potential rental listing inputs:

- manual links and notes from commercial rental listings;
- future API integrations with real-estate or commercial-rent listing providers, if legally and technically approved;
- imported candidate objects from approved external datasets.

Guardrail:

- competitor and rental data must come from public, licensed, customer-provided, or approved external sources;
- this module must not scrape or store third-party listing data without an approved data-rights model;
- competitor analysis is a decision-support layer, not a guarantee of market success;
- saved candidate locations are private customer planning records and must be scoped to the verified organization;
- this feature must not expose PixelRing CRM data, customer request data, or private supplier files across organizations.

Target concepts:

- `CustomerCandidateLocation`
- `CustomerCandidateLocationSource`
- `CustomerCompetitorLocation`
- `CustomerCompetitorCategory`
- `CustomerDeliveryCoverageScenario`
- `CustomerLocationComparison`
- `CustomerRentalListingReference`

These names are planning names, not required final Prisma model names.

### Suppliers And Logistics Map

Suppliers are a future business-portal module for customers that operate multiple physical locations.

The goal is to let a verified business account understand its logistics network:

- where each object/location is;
- which current suppliers serve which locations;
- which suppliers are primary, backup, candidate, or inactive;
- whether distance, delivery windows, coverage zones, or commercial terms create operational risk;
- where a new or backup supplier would improve coverage.

Planned supplier tools:

- interactive map that overlays customer objects and suppliers;
- supplier card file with contact, category, service area, delivery logic, terms, notes, and status;
- ability to attach one supplier to many objects, or manage suppliers per object;
- search bar for discovering and comparing potential suppliers by geography, category, coverage, delivery capability, and commercial conditions;
- ability to mark searched suppliers on the map and save them as backup or candidate suppliers.

Guardrail:

- this must remain a customer-side logistics and supplier-management tool, not a public marketplace, contractor directory, or "find a master" product;
- PixelRing's own service execution and partner operations remain separate from the customer's private supplier file;
- supplier search results must not expose private customer, CRM, or internal partner data.

Target concepts:

- `CustomerSupplier`
- `CustomerSupplierLocation`
- `CustomerSupplierCategory`
- `CustomerSupplierCoverageArea`
- `CustomerObjectSupplierLink`
- `CustomerSupplierEvaluation`

These names are planning names, not required final Prisma model names.

## Block Interaction Logic

The portal should behave as one connected workspace, not independent screens.

### Dashboard

Dashboard aggregates:

- active requests;
- actions requiring customer decision;
- next visits;
- object health/risk;
- warranty risks;
- unread customer-visible messages;
- documents awaiting approval.

Dashboard actions should route to the specific source:

- quote approval -> request detail or offers;
- visit confirmation -> request detail;
- upload photos -> request detail or new request;
- warranty risk -> warranties or object detail;
- object risk -> object detail.

### Requests

Requests connect to:

- messages;
- object/location;
- attachments;
- photo reports;
- offers;
- warranty;
- documents.

Request detail is the primary customer-safe work view.

### New Request

New request should reuse existing intake concepts:

- selected object if known;
- request type;
- problem description;
- contact method;
- photos/videos;
- optional preferred service window.

It should not bypass existing request-number policy:

- formal request number appears only after required contact verification path;
- internal IDs never appear.

### Objects

Objects are business centers:

- responsible people;
- access instructions;
- service windows;
- asset composition;
- active requests;
- service history;
- invoices/costs;
- warranty risks.

Object detail should link back to:

- requests filtered by object;
- assets filtered by object;
- suppliers serving this object;
- documents filtered by object;
- reports filtered by object.

### Equipment And Advertising Assets

This section must not be limited to signs.

Supported category families:

- outdoor signage;
- light boxes and illuminated letters;
- power supplies and LED modules;
- mounting and construction elements;
- indoor advertising;
- wayfinding and interior signs;
- stickers and window graphics;
- banners and promotion materials;
- menus and printed HoReCa materials;
- POS displays;
- staff clothing and branded accessories.

Asset list must filter by:

- object/location;
- category;
- type;
- status;
- warranty;
- service need;
- search term.

### Reports, Warranties, Documents, Billing

These are downstream of requests and objects:

- reports attach to completed work;
- warranties attach to completed work or asset;
- documents attach to request, object, customer, or organization;
- invoices/acts attach to request and object, but billing must remain read-only/deferred until approved.

## Stage Plan

### Stage 0: Confirm Current App Integration Points

Goal:

- inspect existing route structure, layouts, i18n, auth/session helpers, request APIs, status rendering, production design patterns, and the portal prototype.

Deliverables:

- implementation notes in this document or a short handoff note;
- list of existing helpers that portal shell should reuse.
- list of production design primitives/components that should be used for the portal shell.
- notes on how the HTML prototype maps into production components.

Do not edit application code in this stage unless explicitly approved.

Acceptance:

- exact files/routes to touch for Stage 1 are known;
- no assumptions about package manager, framework version, or auth helpers remain.
- the agent has explicitly checked `docs/04_client_portal/prototype/index.html`;
- the agent has explicitly checked relevant existing `signage-service` layout/component/design code.

### Stage 1: Portal Shell

Goal:

- create the real portal route shell with layout, sidebar, header, and empty/placeholder sections.

Scope:

- route group under localized app routes;
- portal layout component;
- sidebar navigation;
- responsive mobile shell;
- consistent visual language from the prototype;
- consistent implementation style from the existing app design code;
- safe "not connected yet" empty states.

Out of scope:

- database migrations;
- new auth model;
- object/asset persistence;
- billing logic;
- real organization/member roles.

Acceptance:

- `/[locale]/portal` loads;
- navigation works across placeholder sections;
- no private data is exposed;
- placeholder data is either clearly non-private or comes from the connected `Pixel Ring GmbH` seed scenario;
- build/type/lint checks pass.

### Stage 2: Read-Only Dashboard And Request Summary

Goal:

- connect the shell to safe existing request/status data where possible.

Scope:

- active request cards;
- customer-facing status labels;
- next action cards;
- same-device/session-aware state if existing helpers support it;
- fallback empty state inviting user to track by PR-number or create request.

Acceptance:

- dashboard can render with no linked requests;
- dashboard can render linked request summaries when server-side access permits;
- internal CRM-only fields remain hidden.

### Stage 3: Request List And Request Detail

Goal:

- make requests the first real working tool.

Scope:

- request list;
- request detail;
- customer-safe timeline;
- customer-visible messages;
- customer-visible attachments;
- next action block.

Acceptance:

- request detail uses public request number;
- direct access requires server-side permission/session check;
- request number alone does not expose details.

### Stage 4: New Request Flow

Goal:

- let authenticated portal users create a new service request from inside the cabinet.

Scope:

- object selector if known;
- request category;
- description;
- preferred contact;
- photo/video upload using existing upload constraints where possible;
- handoff to existing `/api/contact` or a portal-specific wrapper that preserves current request-number policy.

Acceptance:

- request creation does not duplicate unsafe intake logic;
- attachments follow existing validation/access rules;
- public request number policy is preserved.

### Stage 5: Objects Read Model

Goal:

- introduce object/location pages without committing to the full future asset system too early.

Scope:

- object list;
- object detail shell;
- responsible contacts;
- service windows/access notes;
- linked requests;
- linked documents/reports if available;
- placeholder asset composition.

Acceptance:

- object pages are useful as navigation and context;
- object detail can deep-link to filtered requests;
- no unsupported organization/member claims are made.

### Stage 6: Asset Catalog Prototype In App

Goal:

- implement the asset catalog UI as a working interface with filters.

Scope:

- filter by object;
- filter by category/type/status;
- expandable category lists;
- asset detail placeholder;
- "create request for this asset" action.

Data approach:

- start with static or adapter-backed seed data only if it follows the connected `Pixel Ring GmbH` scenario;
- only introduce persistence after product fields are stable.

Acceptance:

- the asset model supports more than signs;
- restaurant/HORECA materials, print, banners, stickers, and clothing are represented;
- asset actions route back into request creation.

### Stage 6b: Supplier Map Planning Prototype

Goal:

- reserve the customer-side supplier and logistics map as a future portal module after objects and assets are understandable.

Scope:

- supplier navigation item and preview surface;
- object/supplier map concept;
- supplier file card concept;
- primary, backup, candidate, inactive supplier statuses;
- search concept for potential suppliers by geography, category, delivery capability, coverage, and commercial terms;
- save searched suppliers into the customer's supplier file as candidate or backup suppliers.

Data approach:

- start as product documentation and UI prototype only;
- do not create database migrations until object persistence, asset persistence, and portal organization access are stable;
- any demo data must be clearly customer-owned supplier data, not PixelRing internal partner data.

Acceptance:

- the module helps a business plan logistics across its own locations;
- supplier search does not present PixelRing as a marketplace or directory;
- private supplier files are scoped to the verified organization;
- backup supplier marking is separated from operational CRM assignment and PixelRing partner operations.

### Stage 6c: Location Intelligence Planning Prototype

Goal:

- reserve the new-location search and competitor map as a future portal module for business expansion decisions.

Scope:

- map mode for candidate locations;
- manual candidate/favorite location saving;
- competitor layer around a selected location;
- delivery coverage layer for radius, travel time, or service-area assumptions;
- supplier/logistics overlay for candidate location feasibility;
- rental listing reference concept, including future API integration only after approval;
- comparison view for multiple candidate locations.

Data approach:

- start as product documentation and UI prototype only;
- candidate locations may be customer-entered demo data;
- competitor and rental listing data require approved public/licensed/external data sources before production use;
- do not create database migrations until portal organization access and object/location persistence are stable.

Acceptance:

- the module helps a business evaluate where to open a new object;
- competitor visibility is the primary decision layer;
- rental-listing integrations are documented as future optional integrations, not current functionality;
- saved candidate locations are private to the verified organization;
- no third-party data is scraped, stored, or displayed without an approved data-rights model.

### Stage 7: Reports, Warranties, Documents

Goal:

- expose customer-safe documents and service outcomes.

Scope:

- photo report list and detail;
- warranty list and detail;
- document archive;
- download actions through signed/authorized routes only.

Acceptance:

- no private storage path is exposed;
- files require server-side authorization;
- warranty/report data is explicitly marked as customer-visible.

### Stage 8: Organization And Team Access

Goal:

- add B2B account structure after object/request flows are stable.

Scope:

- organization account view;
- members;
- roles;
- object-level access;
- approval limits.

Acceptance:

- role names and permissions are documented before implementation;
- finance users can be separated from facility users;
- no full RBAC claim is made before enforcement exists.

### Stage 9: Billing/Offers As Read-Only Customer Documents

Goal:

- expose commercial documents only after legal/accounting boundaries are decided.

Scope:

- offers/quotes;
- invoices;
- acts;
- approval status;
- PDF downloads.

Out of scope until approved:

- online payments;
- accounting integration;
- tax workflow automation.

Acceptance:

- financial documents are read-only unless approval workflow is explicitly implemented;
- access is verified server-side.

## First Coding Task Recommendation

The next coding task should be Stage 0 plus Stage 1 only:

1. Read `signage-service/AGENTS.md`.
2. Inspect `signage-service/package.json`.
3. Inspect existing localized route/layout patterns.
4. Inspect existing status page and request/status helpers.
5. Inspect existing production design code: layout, Tailwind usage, cards, buttons, forms, typography, responsive behavior, and i18n patterns.
6. Inspect `docs/04_client_portal/prototype/index.html` as the UX reference for the intended cabinet.
7. Map prototype sections into production components before coding.
8. Create a portal shell route with sidebar and placeholder views.
9. Keep all content static/placeholder or seed-scenario based unless existing safe helpers are clearly reusable.
10. Verify with lint/type/build or the repo's accepted smaller checks.

Suggested first target:

- `/[locale]/portal`

Suggested first user-visible result:

- logged-out/unknown state: "Verify access to open your cabinet";
- linked/placeholder state: portal dashboard shell with disabled sections and no private data;
- optional demo state: connected `Pixel Ring GmbH` seed scenario, clearly scoped and internally consistent.

## Design Requirements For Stage 1

- Keep the prototype's dense business-app structure.
- Use the prototype as the intended UX/interaction reference.
- Use the production app's existing design code as the implementation style reference.
- Use a sidebar/navigation shell, not a marketing page.
- Avoid large hero sections.
- Make dashboard cards operational, compact, and scannable.
- Do not show fake private request data in production routes unless it belongs to the approved seed/demo scenario and is clearly scoped.
- Use customer-safe labels.
- Keep mobile usable with collapsible navigation.

## Security And Privacy Requirements

- Portal sessions must use HTTP-only cookies.
- Request detail access must be checked server-side.
- PR-number alone is not authorization.
- Attachments and documents must use authorized access routes.
- No private object storage keys or paths in frontend markup.
- No portal auth tokens in localStorage.
- Generic errors for failed lookup/access checks.
- Audit strategy must be defined before sensitive customer document access.

## Open Decisions Before Later Stages

- Exact verified email magic-link provider and session model.
- Whether the first production beta needs SMS/voice OTP or starts with operator-assisted phone recovery.
- Exact same-device case-access lifetime for portal claim.
- Organization/member data model.
- Object and asset persistence model.
- Supplier file and logistics-map data model.
- Whether supplier discovery uses manual entry first, curated datasets, or external search/integration later.
- Candidate-location and competitor-map data model.
- Approved source strategy for competitor locations, delivery coverage, and commercial rental listings.
- Which documents are customer-visible in the first portal release.
- Whether quotes can be approved in the portal before billing models exist.
- Retention periods for reports, attachments, and completed request data.
- Whether multilingual portal copy is CMS-managed or `messages/*.json` first.

## Progress Log

### 2026-05-16

- Current sprint/block: Client Portal account-first entry and passwordless login.
- Done: replaced the unauthenticated `/[locale]/portal` dead-end with an entry screen that supports e-mail login/registration, existing request status lookup, and new request start paths; added account-first e-mail magic-link API routes and verification page; allowed portal sessions without a linked case so a verified user can open an empty portal dashboard; added an empty-dashboard state for accounts with no linked requests.
- In progress: existing claim-link verification remains the request-bound access path; connecting an already existing PR-number directly from inside the portal is still a separate follow-up flow.
- Next action: fix/verify IONOS SMTP credentials on Vercel, redeploy, test account-first e-mail login, then add “bestehende Anfrage verbinden” from inside the verified portal.
- Blockers/risks: SMTP currently rejects the configured credentials in local testing; standalone portal accounts have no organization/member model yet and must not expose request data until a request is explicitly verified and linked.
- Updated documents: `docs/04_client_portal/client_portal_implementation_plan.md`, `PROGRESS.md`.

### 2026-05-16

- Current sprint/block: Client Portal production identity and IONOS SMTP readiness.
- Done: added IONOS-compatible SMTP delivery for portal verification emails using `noreply@pixel-ring.com`; added production portal identity models (`PortalUser`, `PortalUserEmail`, `PortalCaseAccess`) and session linkage; updated claim verification so a verified email creates/updates a portal user and grants access to the claimed request; changed `/[locale]/portal` and request detail routes to render real request-scoped portal data for verified portal sessions instead of requiring demo mode.
- In progress: the production portal now has a minimal verified-email/request-access foundation, while object/location/asset persistence, organization membership, standalone login, customer document/report downloads, and portal-created requests remain deferred.
- Next action: owner adds `SMTP_PASSWORD` and production database URLs in hosting env vars; apply both pending portal migrations to the server database; deploy preview and test real e-mail verification through IONOS.
- Blockers/risks: SMTP deliverability depends on IONOS mailbox credentials and domain SPF/DKIM; migrations must be applied only after confirming the target database and backup/snapshot state.
- Updated documents: `docs/04_client_portal/accounts_and_identity.md`, `docs/04_client_portal/client_portal_implementation_plan.md`, `docs/00_project_overview/project_state_and_roadmap.md`, `PROGRESS.md`.

### 2026-05-15

- Current sprint/block: Client Portal claim-link verification bridge.
- Done: implemented the first request-bound portal access bridge in `signage-service`: claim links are created after request intake and from the CRM case page; claim links are valid for 24 hours; customers can confirm or add email; email verification links are valid for 30 minutes; verified users receive an HTTP-only portal session and are redirected into the current test portal.
- In progress: the bridge intentionally opens the existing demo/test portal, not a customer-specific production dashboard. The Prisma migration file exists but has not been applied to the configured database in this pass.
- Next action: confirm applying the database migration, configure a real email sender (`RESEND_API_KEY` and `PORTAL_EMAIL_FROM`), then test the full flow with a real email: public request -> claim link -> email verification -> test portal.
- Blockers/risks: production portal authorization is still narrower than the future product needs; organization/member access, standalone portal login, logout/session management UI, SMS/voice recovery, and customer-specific dashboard data remain separate stages.
- Updated documents: `docs/04_client_portal/accounts_and_identity.md`, `docs/04_client_portal/client_portal_implementation_plan.md`, `docs/00_project_overview/project_state_and_roadmap.md`, `PROGRESS.md`.

### 2026-05-15

- Current sprint/block: Client Portal accounts and identity documentation.
- Done: added `accounts_and_identity.md` as the source document for portal verification paths; confirmed that public request intake may use phone or email, while full portal access requires verified email; defined trust levels, request-first phone/email paths, phone-only recovery boundaries, passwordless magic-link direction, and security baseline.
- In progress: production identity remains documentation-only; no migrations or application code were changed in this pass.
- Next action: decide the first production beta identity scope: email provider, magic-link lifetime, same-device claim lifetime, and whether phone recovery starts with SMS/voice OTP or operator-assisted verification.
- Blockers/risks: phone-only users without same-device access cannot be safely linked to a new portal email without additional proof; open self-registration and organization membership require separate authorization design.
- Updated documents: `docs/04_client_portal/accounts_and_identity.md`, `docs/04_client_portal/client_portal_implementation_plan.md`, `docs/04_client_portal/README.md`, `PROGRESS.md`.

### 2026-05-11

- Current sprint/block: Client Portal future location-intelligence module planning.
- Done: added the planned Location Intelligence module, candidate-location map, competitor layer, delivery coverage layer, rental-listing reference/API concept, planning-stage target concepts, Stage 6c boundaries, and open decisions.
- In progress: new-location search remains documentation-only and not implemented in application code.
- Next action: decide whether a future portal design pass should combine objects, suppliers, and candidate locations into one map workspace or keep them as separate map modes.
- Blockers/risks: competitor and rental listing data require approved public/licensed/customer-provided sources; the module must avoid unapproved scraping, unsupported success claims, and cross-organization data exposure.
- Updated documents: `docs/04_client_portal/client_portal_implementation_plan.md`, `docs/04_client_portal/client_portal_prototype_functional_map.md`, `docs/04_client_portal/Маркетинговая стратегия и план развития платформы контроля объектов и рекламных активов.md`, `PROGRESS.md`.

### 2026-05-11

- Current sprint/block: Client Portal future supplier/logistics module planning.
- Done: added the planned customer-side Suppliers module, supplier/logistics map concept, supplier search and backup-supplier workflow, future route/navigation reservation, planning-stage target concepts, Stage 6b boundaries, and open decisions.
- In progress: supplier map remains documentation-only and not implemented in application code.
- Next action: after owner approval, decide whether the next portal design pass should prototype the supplier map screen or keep focus on existing object/request portal work.
- Blockers/risks: supplier search can blur into marketplace/directory positioning if not constrained; supplier files require organization-scoped privacy, authorization, and clear separation from PixelRing internal partner operations.
- Updated documents: `docs/04_client_portal/client_portal_implementation_plan.md`, `docs/04_client_portal/client_portal_prototype_functional_map.md`, `docs/04_client_portal/Маркетинговая стратегия и план развития платформы контроля объектов и рекламных активов.md`, `PROGRESS.md`.

### 2026-04-28

- Current sprint/block: Client Portal implementation planning.
- Done: expanded standalone HTML prototype into a business-oriented customer portal model; documented staged implementation strategy from shell to working tools; added source-of-truth, design translation, connected seed data, migration, security, feature-boundary, pre-code auth/demo decisions, portal administration, subscription/plan, data deletion/export, market positioning, campaign/compliance workflow, pilot/demo, metric, and future guardrail rules.
- In progress: no application code yet; next step is Stage 0 codebase inspection before creating real portal shell.
- Next action: inspect `signage-service/AGENTS.md`, `package.json`, localized route structure, status page, request/status helpers, production design code, and `docs/04_client_portal/prototype/index.html`; then implement Stage 1 portal shell with email-first demo auth gate and connected fixture data only after approval.
- Blockers/risks: full portal identity, organization/member model, object/asset persistence, customer-visible document authorization, exact billing plans, payment provider, and legally confirmed retention periods remain undecided.
- Updated documents: `docs/04_client_portal/client_portal_implementation_plan.md`, `docs/04_client_portal/README.md`, `docs/04_client_portal/Маркетинговая стратегия и план развития платформы контроля объектов и рекламных активов.md`, `PROGRESS.md`.

### 2026-04-29

- Current sprint/block: Client Portal Stage 1 demo shell.
- Done: implemented localized `/[locale]/portal` route in `signage-service`; added portal-only components, typed connected `Pixel Ring GmbH` fixture data, demo email gate, HTTP-only `pixelring_portal_demo` cookie, `/api/portal/demo-auth` POST/DELETE endpoints, all-locale `Portal` message namespace, and status-page CTA link to `/portal`.
- In progress: no database-backed portal identity or organization model yet; Stage 1 remains fixture/demo-only by design.
- Next action: review the portal UI in browser with owner feedback, then decide Stage 2 boundary for real email verification/session bridge versus richer request/object subroutes.
- Blockers/risks: production portal auth, object/asset persistence, customer-visible document authorization, member roles, deletion/export workflows, and billing remain intentionally deferred.
- Updated documents: `docs/04_client_portal/client_portal_implementation_plan.md`, `PROGRESS.md`.

### 2026-04-30

- Current sprint/block: Client Portal Stage 2 request detail demo.
- Done: added demo-only `/[locale]/portal/requests/[publicRequestNumber]` route behind the existing demo-cookie gate; made portal request cards link to request details; extended typed `Pixel Ring GmbH` fixtures with customer-safe status timeline, correspondence, customer attachments, PixelRing document/report/warranty previews, and required action placeholders.
- In progress: Stage 2 remains read-only and fixture-only; request actions, uploads, approvals, and file previews are visual placeholders only.
- Next action: validate owner review flow on `/ru/portal` -> `PR-DEMO-4821`, then decide whether Stage 3 should deepen request list/detail UX or start the production auth/session bridge.
- Blockers/risks: real portal auth, database migrations, server-side production authorization, authorized document downloads, mutable approval/upload actions, organization/member roles, billing, deletion/export workflows, and production retention policy remain deferred.
- Updated documents: `docs/04_client_portal/client_portal_implementation_plan.md`, `PROGRESS.md`.
