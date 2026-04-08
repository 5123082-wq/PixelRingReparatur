# PixelRing Admin Platform

## Purpose

This folder defines the target admin platform for PixelRing Reparatur.

The platform is split into two protected tools:

- **Website CMS**: `/ring-master-config`
- **Manager CRM**: `/ring-manager-crm`

The goal is not to copy a generic admin template. The goal is to define the complete functional scope that a production-grade admin tool must cover, while respecting what is already implemented in the current Next.js/Prisma codebase.

## Current Repository Baseline

Implemented now:

- Split admin routes exist: `/ring-master-config` and `/ring-manager-crm`.
- Separate admin master keys and HTTP-only cookies exist for CMS and CRM.
- CRM list/detail views exist for cases, status changes, operator replies, and operator takeover.
- CMS dashboard shell exists.
- CMS AI config screen exists.
- CMS Articles and SEO screens exist.
- Prisma models exist for `Case`, `Message`, `Attachment`, `Session`, `AdminSession`, `AdminAuditLog`, `CaseStatusEvent`, `CustomerProfile`, `CmsArticle`, `CmsSeoConfig`, and `AiConfig`.
- `/api/cms/articles` CRUD exists.
- `/api/cms/seo` config API exists.
- Public `/support` and `/support/[slug]` use CMS-backed support content with safe fallbacks.
- AI prompt appends published CMS articles to the knowledge context.
- CMS article, SEO, and AI config mutations write persistent admin audit logs.
- Admin and CMS mutation routes have a CSRF starter guard based on a required custom request header plus same-origin signal checks.
- Current CRM/CMS object-level authz coverage has a lightweight static verification starter via `npm run test:admin-security`.
- Markdown knowledge base exists in `signage-service/knowledge_base`.

Known gaps:

- Phase 5 is only partially done: audit/status history exists for CRM starter scope, but the full operational hardening is not complete.
- CSRF starter exists for current admin mutations, but coverage review still needs to continue as new admin endpoints are added.
- Object-level authorization coverage is still starter-level and needs full route/integration tests later.
- MFA and a full RBAC matrix are not implemented yet.
- Distributed rate limiting is not implemented yet.
- Upload scanning/quarantine is not implemented yet.
- Page Content CMS and Media Library are not started yet.

## Product Principle

Admin must be a **business tool**, not only a database table editor.

For PixelRing this means:

- CMS manages site content, SEO/GEO, media, and AI knowledge.
- CRM manages requests, customers, communication, status flow, and operational handoff.
- Security is part of the product, not a later polish step.

## Documents

- [01 CMS Site Management](./01_cms_site_management.md)
- [02 CRM Requests And Clients](./02_crm_requests_and_clients.md)
- [03 Security And Governance](./03_security_and_governance.md)
- [04 Implementation Phases](./04_implementation_phases.md)
- [05 References](./05_references.md)

## Decision

Keep the admin platform inside the current Next.js application for now.

Reason:

- The project already has Next.js App Router, Prisma, route-level admin auth, and working CRM/CMS shells.
- Laravel Backpack and BlurAdmin would introduce a second legacy stack or framework boundary.
- Refine/react-admin-style patterns can still be used as inspiration for CRUD UX, permissions, and resource modeling without moving the product to a separate platform.
