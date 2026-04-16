# 03 Security And Governance

## Goal

The admin platform is a high-risk area. It controls customer data, request status, public content, SEO, media, and AI behavior.

Security requirements must apply to both:

- CMS: `/ring-master-config`;
- CRM: `/ring-manager-crm`.

Technology and hosting baseline for this phase:

- admin UI layer can use Tabler components/theme;
- core platform remains `Next.js + Prisma + PostgreSQL`;
- preferred deployment model is managed hosting + managed PostgreSQL for MVP/early production;
- self-hosted VPS is an optional path with explicit ops ownership (hardening, backups, monitoring, patching).

## Current Baseline

Implemented now:

- password-only named admin users;
- separate `MANAGER` and `OWNER` roles;
- starter permission map for CRM case/message/takeover/download actions plus CMS AI, SEO, knowledge-base, article/page, and media actions;
- separate CRM and CMS cookies;
- HTTP-only cookies;
- route-level dashboard guards;
- `/admin` path blocked;
- hidden admin paths return 404 for many unauthorized paths;
- CSRF starter guard for current admin/CMS mutation routes;
- rate limiting exists for selected endpoints;
- noindex metadata exists for admin shells.

Known gaps:

- no MFA;
- persistent audit log exists, with CRM starter coverage and CMS article/page/media/SEO/AI mutation coverage;
- status event history exists for CRM starter flows, but the full operational story is not finished;
- object-level authz/static coverage starter exists for current CRM/CMS route split via `npm run test:admin-security`;
- no database-backed granular RBAC assignment model;
- no step-up reauthentication for destructive actions;
- no distributed rate limit;
- no upload scanning/quarantine;
- CSRF coverage is currently reviewed for existing admin/CMS mutation routes and needs to stay enforced as new admin mutation routes are added;
- no session binding policy for IP/user-agent changes.
- current access has moved to named users with a starter permission layer across the current CRM/CMS sensitive routes, but broader route coverage and role expansion are still incomplete.

## Access Control

Rules:

- deny by default;
- validate authorization on every server request;
- validate object-level access for every `caseId`, `messageId`, `attachmentId`, `articleId`, and media ID;
- validate function-level access for create, update, publish, delete, export, role change, and AI configuration;
- do not rely on frontend hiding controls.

Target roles:

- `OWNER`: CMS, SEO, AI config, all CRM visibility, settings.
- `MANAGER`: CRM case operations and customer communication.
- `OPERATOR`: assigned case handling, messages, limited status updates.
- `AUDITOR`: read-only audit and compliance views.

The current schema only has `OWNER` and `MANAGER`; the additional roles are target-state.
Target-state also requires named admin users and permission-level checks on sensitive actions.

Current implementation note:

- the active starter permission map is documented in `docs/10_security_privacy/rbac_permissions.md`;
- current code source of truth is `signage-service/src/lib/admin-permissions.ts`.

## Sessions

Required:

- `HttpOnly`;
- `Secure` in production;
- `SameSite=Lax` or stricter where possible;
- idle timeout for admin sessions;
- absolute timeout;
- revoke on logout;
- rotate session token on login and later on privilege elevation.

Target:

- MFA for all admin users;
- step-up reauthentication for export, bulk updates, deletion, role changes, and AI prompt changes;
- alert on suspicious session behavior.

## Audit Logs

Audit logging must cover:

- login success/failure;
- logout;
- case status changes;
- operator takeover changes;
- operator messages;
- attachment access/download;
- article create/update/publish/unpublish/delete;
- media upload/delete;
- SEO config changes;
- AI prompt/model/temperature changes;
- role or permission changes;
- exports and bulk operations.

Current implementation status:

- CRM status changes, assignment changes, operator messages, operator takeover, customer profile sync, and attachment downloads are partially covered.
- CMS article/page create/update/publish/unpublish/delete, CMS media upload/update/delete plus blocked-delete audit, SEO config updates, and AI config updates are covered in the current starter scope.

Minimum audit fields:

- timestamp;
- actor session/admin ID;
- role;
- action;
- resource type;
- resource ID;
- outcome;
- reason if destructive;
- IP address;
- user agent;
- correlation ID.

Audit logs should be append-only and not editable from normal admin UI.

## Destructive Actions

Rules:

- no silent hard delete from UI;
- require confirmation;
- require reason for destructive or bulk actions;
- prefer soft delete and retention window;
- use step-up reauth later;
- for bulk destructive actions, use approval flow later.

## PII And Privacy

Rules:

- collect only fields needed for request handling;
- mask PII where full value is not needed;
- do not log secrets or raw private file contents;
- do not mix analytics with private lead data;
- define retention for cases, messages, attachments, sessions, audit logs, and CMS media;
- support deletion/anonymization workflows later.

## Upload Security

Customer attachments and CMS media need separate policies.

Required:

- allowlist extensions and MIME types;
- verify file signatures;
- size limits;
- checksum;
- private storage for customer attachments;
- public storage only for approved CMS media;
- short-lived signed URLs for private files;
- scanning/quarantine workflow before operator download in a later phase.

## Admin Route Hardening

Required:

- no state-changing GET routes;
- CSRF protection on admin mutations;
- strict CORS;
- security headers;
- noindex for admin routes;
- generic 404 responses for hidden admin routes where applicable;
- rate limiting on auth and high-risk endpoints;
- tests for IDOR/BOLA scenarios.

## Security Priority

P0 before production:

- expand object-level authorization beyond the current static test starter into route/integration tests;
- keep CSRF coverage review running for all admin mutation routes as the route surface grows;
- stricter attachment download controls;
- session timeout review;
- soft delete for CMS content and destructive CRM operations.

P1:

- MFA;
- granular RBAC;
- distributed rate limiting;
- upload scanning/quarantine;
- anomaly alerts;
- periodic access review.

## Release Readiness Controls

Before production release, admin/security readiness must include:

- staging environment verification for admin and CMS mutation flows;
- UAT checklist with sign-off for high-risk actions (publish, delete, role changes, AI config updates);
- rollback-ready deployment path for schema and route changes;
- backup and restore drill evidence for the active database;
- incident response runbook ownership and escalation contacts.
