# 04 Client Portal

Purpose: request-bound customer access and future customer account area for requests, employees, photo reports, warranties, and billing documents.

## Context Beacon

Purpose: fast orientation for client-portal work without loading every long planning file.

Current implemented boundary:

- The application has a first production portal identity foundation for request-bound access: claim links, verified e-mail, HTTP-only portal sessions, request-scoped access, portal registration/login/password reset, portal request detail/chat, and portal-created request flow.
- This is not the full future client portal. Do not assume organizations, customer employees, full RBAC, billing, invoices, structured photo-report downloads, warranties, broad document archive, Bitrix24 sync, or deletion/export workflows exist unless code proves it.
- Public request number alone must never expose private request data or work as a login method.
- Customer-facing tracking must use customer-safe status/read models and must not expose raw CRM internals, internal notes, internal IDs, audit logs, assignment data, or operator-only metadata.
- German remains canonical-first. MVP languages are DE, EN, RU, TR, PL, and AR; Arabic requires RTL-aware UI/content handling.

Read first:

1. This `Context Beacon`.
2. `client_portal_implementation_plan.md` top `Read Depth / Current Checkpoint` block.
3. `telegram_email_portal_activation_plan.md` top `Current Status / Read Depth` block when the task touches Telegram, e-mail activation, status-page activation, claim links, or external-entry navigation.

Task-specific docs:

- Portal identity, verification, claim links, sessions, login, registration, password reset: `accounts_and_identity.md`.
- Current MVP portal shell, request dashboard/detail, request chat, customer-safe read model, future-vs-current boundaries: `client_portal_implementation_plan.md`.
- Telegram, browser chat, e-mail activation after `PR`, status-page activation CTA, external-entry navigation: `telegram_email_portal_activation_plan.md`.
- Request tracking and customer-safe architecture: `request_tracking_and_customer_portal_architecture.md`.
- Prototype structure or visual mapping only when designing portal UI: `client_portal_prototype_functional_map.md` and `prototype/index.html`.

Future/deep docs:

- `full_customer_portal_plan.md`, supplier/location-intelligence sections, asset/object platform sections, billing/warranty/report sections, and the Russian marketing strategy are future/deep references. Do not load them at startup unless the task explicitly touches those future modules.
- Progress logs inside long plans are history. Read only the latest entry when continuing from a checkpoint; read older entries by date/domain only when needed.

What not to assume:

- The portal identity foundation is not a full portal/accounts/orgs/billing platform.
- Request-bound access is not organization-wide access.
- A status page, Telegram chat, or public `PR` number is not proof of identity.
- Future platform ideas must not change current MVP scope unless the owner explicitly reopens that direction.

Current migrated documents:
- `request_tracking_and_customer_portal_architecture.md`
- `full_customer_portal_plan.md`
- `client_portal_implementation_plan.md`
- `client_portal_prototype_functional_map.md`
- `accounts_and_identity.md`
- `telegram_email_portal_activation_plan.md`
- `Маркетинговая стратегия и план развития платформы контроля объектов и рекламных активов.md`

Planned base documents:
- `client_portal_blueprint.md`
- `organizations_and_members.md`
- `portal_rbac.md`
- `request_tracking.md`
- `photo_reports.md`
- `billing_documents.md`
