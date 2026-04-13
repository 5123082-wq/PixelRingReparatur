# Phase 2
## Internal Admin Portal and external-channel request logic

### Status

Closed (core) as of `2026-04-05`.
This phase also absorbs the unresolved production-hardening and continuity work explicitly deferred from **Phase 1**.

**Completed**: Admin Dashboard, secret route protection, status management (10 statuses), manual PR-number creation, CRUD API.
**Remaining**: Attachment storage, rate limiting, persistent backend chat — tracked in the archived [old_request_tracking_implementation_blueprint.md](./old_request_tracking_implementation_blueprint.md).

### Goal

Connect external entry channels (WhatsApp/Telegram) and provide an internal management interface (Admin Dashboard) WITHOUT external CRM integration.

### Scope

- **Internal Admin Dashboard**: Protected interface for managing all requests.
- **Secret Route Protection**: Access via obfuscated path (configured via `ADMIN_SECRET_PATH`).
- **Status Management**: Manual status updates for requests.
- **Lead-to-Request Conversion**: Feature for operators to create PR-numbers for customers coming from messengers.
- **Identity Linking**: Mechanism to "attach" an external messenger contact to a portal request.
- **Private Attachment Storage**: Handling and viewing photos/videos uploaded by clients.
- **Persistent Backend Chat**: Implementation of a message-bus for real-time operator-to-client communication.
- **Security Baseline**: Rate limiting for request lookup and intake to prevent enumeration.

### Status Definitions

- **Принято**: Request registered in the system.
- **В диагностике**: Initial technical inspection in progress.
- **Ремонт**: Active repair process.
- **Отложено**: Waiting for parts or additional customer approval.
- **Готов**: Repair completed, waiting for pickup.
- **Выдан / Гарантия**: Handed over to client, under warranty period.
- **Отказ**: Customer cancelled or repair is not feasible.

### Security Strategy (Admin Access)

- **Obfuscation**: The admin route is NOT `/admin`. It uses a secret string (e.g., `/ring-master-admin`).
- **Authentication**: Access requires an `ADMIN_MASTER_KEY` check (stored in `.env`).
- **Stealth**: Non-matching paths return 404 to hide the existence of the management portal.

### Must preserve

- WhatsApp and Telegram remain external entry channels.
- A human operator stays in the loop for external-channel qualification.
- Request number for external channels appears only after operator assignment.

### Main deliverables

- Protected Admin UI (`/ring-master-admin`) with request list and filters.
- Status update API and UI controls.
- Operator-tool for generating and sending PR-numbers.
- Secure media viewing for uploaded attachments.
- Rate limiting baseline for public results.
- Backend-backed website chat implementation.

### Acceptance

- Admin can see all requests and change their status.
- A messenger-origin lead can be manually assigned a PR-number by the operator.
- Unauthorized users cannot find or access the administration path.
- All statuses reflect correctly on the public `Status` page for the client.
