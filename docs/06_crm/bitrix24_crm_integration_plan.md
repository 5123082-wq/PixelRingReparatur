# Phase 5
## Bitrix24 CRM Integration

### Status

Future phase. Deferred from Phase 2 until the internal admin portal system is operationally stable.

### Goal

Connect Bitrix24 (or an equivalent CRM) as the external operational system for lead routing, specialist assignment, and operator workflow — while keeping the portal backend as the client-facing system of record.

### Background

The original Phase 2 planned Bitrix24 integration as the core backend for operator workflows. After evaluation, this was replaced with an Internal Admin Portal to reduce external dependencies and accelerate delivery. Bitrix24 integration is preserved as a separate phase to be implemented when the business requires it.

### Scope

- **CRM Sync Layer**: Bidirectional sync between the portal database and Bitrix24 deals/leads.
- **Lead Mirroring**: External-channel leads created in Bitrix24 mirror into the portal backend with the same public request number.
- **Status Sync**: CRM stage changes push to portal status via webhook or polling.
- **Specialist Assignment**: CRM-side assignment of specialists with limited-access portal view.
- **Operator Routing**: CRM pipelines for request distribution among operators/specialists.
- **Activity Log Sync**: Operator notes and actions sync from CRM to the admin portal audit trail.
- **Notification Triggers**: CRM events trigger client-facing notifications (email, push, messenger).

### Prerequisites

- Phase 2 (Internal Admin Portal) fully operational in production.
- Phase 4 (RBAC and audit logging) at least partially in place.
- Bitrix24 instance configured with relevant pipelines and stages.
- API credentials and webhook URLs provisioned.

### Must preserve

- The portal backend remains the source of truth for all client-facing data.
- Public request number format stays centralized (`PR-XXXX-XXXX`).
- Raw CRM internals are never exposed to the customer.
- The Internal Admin Portal continues to function as a fallback if CRM is unavailable.
- EU privacy and GDPR compliance for all synced data.

### Out of scope

- Replacing the admin portal with CRM UI — the portal remains the operator's primary tool for client-facing operations.
- Billing, invoicing, or accounting modules within CRM.
- Multi-CRM support (only Bitrix24 or one equivalent).

### Main deliverables

- `crm_sync_links` table and sync service.
- Webhook receiver for Bitrix24 stage-change events.
- CRM → Portal status mapping configuration.
- Portal → CRM lead/deal creation on website-origin requests.
- Admin portal indicator showing CRM sync status per case.
- Fallback mode documentation for CRM downtime.

### Acceptance

- A website-origin request automatically creates a corresponding Bitrix24 deal.
- A Bitrix24 stage change updates the portal status within configurable delay.
- An operator-created lead in Bitrix24 appears in the admin portal with the same PR-number.
- CRM sync failures are logged and do not break the client-facing portal.
- The admin portal works independently when CRM is disconnected.
