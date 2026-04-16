# 00 Admin Platform Overview

## Purpose

This document is the target-state blueprint for the internal admin platform.

It keeps one practical rule:

- use proven patterns and standard components;
- avoid over-custom architecture that is hard to maintain.

## Confirmed Technology Decisions (Block 1)

Confirmed with project owner:

- UI layer: Tabler components/theme as the admin interface foundation.
- Core platform: keep current `Next.js + Prisma + PostgreSQL`.
- CMS and CRM remain separate internal zones (`/ring-master-config` and `/ring-manager-crm`).
- Build forward from current codebase; do not replace with external CMS platform.

Important boundary:

- Tabler is a UI layer, not backend auth/workflow/storage architecture.

## Server Model (Block 1)

Primary recommendation:

- managed hosting model for MVP and early production;
- Next.js app on managed runtime;
- PostgreSQL as managed database;
- no mandatory self-hosted VPS for day-one.

Alternative:

- self-hosted VPS is possible, but requires full ops ownership (patching, backups, monitoring, incident response, hardening).

## Foundation Scope (Block 1)

Goal:

- move from key-based admin access to maintainable user-based access control.

Foundation modules:

1. Admin identity and sessions
2. Role and permission model
3. Access policy enforcement for all admin endpoints
4. Audit logging baseline for high-risk actions
5. Baseline security controls for admin mutation routes

## Foundation Target Model

### Auth and Access

- `AdminUser` entity (named users, not only master keys).
- Role model with permission mapping.
- Permission checks on protected server endpoints.
- Deny-by-default policy.

### Sessions

- HTTP-only secure session cookies.
- Idle timeout and absolute timeout.
- Session revocation on logout.
- Forced logout capability for compromised users.

### Audit

Mandatory audit for:

- login/logout attempts and outcomes;
- destructive updates/deletes;
- permission or role changes;
- AI configuration changes;
- sensitive file access.

Minimum audit fields:

- timestamp;
- actor user/session;
- action;
- resource type and ID;
- outcome;
- reason (for destructive actions);
- ip/user-agent.

### Security Baseline

- CSRF protection on all admin mutation routes.
- Rate limiting on auth and high-risk mutation routes.
- 404-style hidden responses for unauthorized internal paths where applicable.
- Separation of public and private file access policies.

## Phase Plan Anchor

For full admin-panel delivery, use this high-level track:

1. Foundation (access and security)
2. Content Core (pages/revisions/publishing/menu/SEO)
3. Assets and forms
4. Delivery and integrations
5. Hardening and release readiness

Approved in current planning sequence:

- Block 1: Foundation (approved and documented).
- Block 2: Content Core (approved and documented).

## Current Implementation Checkpoint

Block 1 Foundation is now implemented in the current starter scope:

- password-only named admin users are active;
- CRM and CMS use separate HTTP-only session cookies;
- master-key fallback path has been removed from active auth flows;
- deny-by-default helper composition is in place for current read-side guards;
- starter permission guards cover current CRM-sensitive routes plus CMS AI, SEO, knowledge-base, article/page, and media routes;
- audit logging baseline is active for current high-risk CRM/CMS actions;
- static admin security verification exists via `npm run test:admin-security`.

Transition point:

- the next delivery block should start from Content Core, not from more open-ended Foundation expansion;
- only bounded security follow-ups should remain in Block 1 unless a concrete regression is discovered.

## Content Core Scope (Block 2)

Goal:

- make content operations maintainable without a custom page-builder platform.

Content Core modules:

1. Page and article revisions with rollback
2. Publishing workflow states
3. Scheduled publish path
4. Managed navigation model (`Menu` / `MenuItem`)
5. Page-level SEO + global SEO defaults
6. Preview mode for authenticated admins

## Content Core Technology Decisions (Block 2)

- keep current server model: `Next.js API + Prisma + PostgreSQL`;
- keep JSON block content model (no drag-and-drop universal builder in this phase);
- use Tabler-based forms and tables for editorial UI;
- use scheduler via managed cron (for managed hosting) or server cron (for self-hosted);
- use short-lived signed preview tokens for draft preview.

## Content Core Acceptance Baseline

- each publishable entity has revision history and restore path;
- workflow status is explicit and server-validated;
- scheduled publishing is deterministic and auditable;
- preview is restricted to authenticated admin sessions;
- menus and SEO metadata are manageable without code edits.

## Current Entity Continuity (Confirmed)

The roadmap extends existing CMS entities instead of replacing them.

1. `CmsArticle` (`Content & Wiki`) -> add revision/workflow depth and moderation controls.
2. `CmsPage` (`Page Content CMS`) -> keep JSON blocks, add revision/workflow/preview/scheduling.
3. `CmsMedia` (`Media Library`) -> keep separate public media model, add governance and pipeline hardening.
4. `AiConfig` (`AI Brain Config`) -> keep config source, add versioned prompt/change controls.
5. `CmsSeoConfig` (`SEO & Keywords`) -> keep SEO config source, add stronger page-level and audit workflows.

Rule:

- future design and implementation decisions must map back to one or more existing entities above.

## Assets And Forms Scope (Block 3)

Goal:

- standardize public CMS assets and configurable intake-form behavior without introducing a custom platform.

Assets and forms modules:

1. Public asset governance on top of `CmsMedia`
2. Form definition/config model for public request/contact flows
3. Server-side validation and anti-spam/rate-limit controls
4. Usage reporting and audit for content-impacting changes
5. Media processing pipeline and security hardening track

## Assets And Forms Technology Decisions (Block 3)

- keep `CmsMedia` as the primary public asset registry;
- keep customer/private attachments as a separate domain and policy;
- use managed object storage as growth path while current starter storage remains supported;
- use `sharp`-based image derivative/optimization pipeline;
- use `zod` schema validation for configurable form payloads on server routes;
- keep Tabler-based admin UI for media/forms management;
- keep rate-limit starter, then move to distributed rate-limit storage in hardening phase.

## Assets And Forms Acceptance Baseline

- public CMS media is governed with required metadata and usage visibility;
- form configuration is auditable and server-validated;
- high-risk form and media mutations are protected and logged;
- media and attachment boundaries stay enforced;
- no public workflow depends on code-only copy or code-only form field changes.

## Delivery And Integrations Scope (Block 4)

Goal:

- make content and operations delivery deterministic across website, channels, and admin workflows.

Delivery and integrations modules:

1. Versioned API contracts for CMS/CRM delivery paths
2. Event/webhook pipeline for publish and operations triggers
3. Cache invalidation and revalidation strategy
4. Integration adapter layer for external channels/systems
5. Reliability controls for retries, idempotency, and failure visibility

## Delivery And Integrations Technology Decisions (Block 4)

- keep current route-handler model for API surfaces, with typed DTO/contracts;
- use Postgres outbox pattern for event dispatch and webhook reliability;
- use background dispatcher via managed cron/worker loops;
- use tag/path revalidation strategy for public content cache invalidation;
- isolate external connectors behind adapter modules (`whatsapp`, `telegram`, `voice`, `bitrix` as needed);
- add idempotency keys, retry with backoff, and dead-letter/error logging tables for unstable integrations.

## Delivery And Integrations Acceptance Baseline

- publish and high-impact admin operations can emit auditable events;
- integration failures are observable and recoverable;
- cache invalidation is explicit and tied to content lifecycle events;
- external adapters do not own core CMS/CRM domain state;
- delivery behavior remains maintainable without ad-hoc endpoint logic.

## Hardening And Release Readiness Scope (Block 5)

Goal:

- make admin operations production-safe, auditable, and recoverable.

Hardening and release modules:

1. Identity security hardening (named users, MFA, step-up)
2. Granular RBAC and policy enforcement
3. Distributed rate limiting and session risk controls
4. Backup/restore and data retention operations
5. Monitoring, alerting, and incident response readiness
6. Staging/UAT/release/rollback governance

## Hardening And Release Technology Decisions (Block 5)

- move from role-key-centric access to named admin users + granular RBAC mappings;
- add TOTP-style MFA and step-up checks for destructive/high-risk actions;
- move rate limiting to Redis/Upstash-style distributed storage;
- use managed Postgres backup/PITR with scheduled restore verification drills;
- keep structured logs + error tracking + uptime checks as baseline observability;
- enforce release gates: staging verification, UAT checklist, rollback-ready deployment path.

## Hardening And Release Acceptance Baseline

- production-critical admin actions require hardened identity controls;
- auditability and recovery paths are tested, not only documented;
- release process includes explicit go/no-go and rollback criteria;
- incident response ownership and runbooks are defined;
- no production deployment depends on unverified manual assumptions.

## Non-Goals of Block 1

- No visual redesign of all admin pages.
- No full content workflow rollout.
- No migration of all modules at once.

## Acceptance Criteria for Block 1 (Documentation)

- technology stack decision is explicitly documented;
- server model and ops boundary are explicit;
- Foundation requirements are documented as target-state;
- related security document is synchronized with this baseline.
