# RBAC And Permissions

## Purpose

This document records the active permission model for internal admin access.

Use it as the current contract between:

- security planning in `docs/10_security_privacy/`;
- admin rollout work in `docs/05_admin_platform/`;
- the live code in `signage-service/src/lib/admin-permissions.ts`.

Current source-of-truth rule:

- the code-level permission names in `signage-service/src/lib/admin-permissions.ts` are canonical for the current implementation;
- this document explains their intended scope and route coverage;
- future role/permission changes must update both the code and this document together.

## Current State

The current admin auth model is:

- named admin users only;
- password-based login only;
- separate CMS and CRM session cookies;
- coarse roles in the database: `OWNER`, `MANAGER`;
- starter permission map layered under those roles in application code.

This is a starter RBAC layer, not the full target-state authorization system.

It does not yet include:

- `OPERATOR` or `AUDITOR` roles in the schema;
- per-user custom grants;
- persistent permission assignments in the database;
- step-up auth for destructive actions;
- UI-level permission visibility rules for every admin screen.

## Current Roles

### `OWNER`

Current intent:

- full CMS control;
- sensitive config control;
- read visibility into CRM data when needed.

Current code-level grants:

- `CMS_AI_CONFIG_READ`
- `CMS_AI_CONFIG_WRITE`
- `CMS_SEO_READ`
- `CMS_SEO_WRITE`
- `CMS_ARTICLE_READ`
- `CMS_ARTICLE_WRITE`
- `CMS_ARTICLE_PUBLISH`
- `CMS_ARTICLE_DELETE`
- `CMS_PAGE_READ`
- `CMS_PAGE_WRITE`
- `CMS_PAGE_PUBLISH`
- `CMS_PAGE_DELETE`
- `CMS_MEDIA_READ`
- `CMS_MEDIA_WRITE`
- `CMS_KNOWLEDGE_BASE_READ`
- `CRM_CASE_READ`

### `MANAGER`

Current intent:

- CRM case operations and customer communication;
- no CMS configuration authority.

Current code-level grants:

- `CRM_CASE_READ`
- `CRM_CASE_CREATE`
- `CRM_CASE_UPDATE`
- `CRM_CASE_MESSAGE_WRITE`
- `CRM_CASE_TAKEOVER_WRITE`
- `CRM_ATTACHMENT_READ`

## Current Permission Meanings

### CMS Config

- `CMS_AI_CONFIG_READ`: read AI config state from `/api/cms/ai`
- `CMS_AI_CONFIG_WRITE`: update AI config via `POST /api/cms/ai`
- `CMS_SEO_READ`: read SEO config/audit from `/api/cms/seo`
- `CMS_SEO_WRITE`: update SEO config via `POST /api/cms/seo`

### CMS Content

- `CMS_ARTICLE_READ`: read article collection/detail admin routes
- `CMS_ARTICLE_WRITE`: create/update article content in admin routes
- `CMS_ARTICLE_PUBLISH`: publish or unpublish article status transitions
- `CMS_ARTICLE_DELETE`: soft-delete articles
- `CMS_PAGE_READ`: read page collection/detail admin routes
- `CMS_PAGE_WRITE`: create/update page content in admin routes
- `CMS_PAGE_PUBLISH`: publish or unpublish page status transitions
- `CMS_PAGE_DELETE`: soft-delete pages
- `CMS_MEDIA_READ`: reserved current public media read scope for CMS admin
- `CMS_MEDIA_WRITE`: current CMS media upload/update/delete scope
- `CMS_KNOWLEDGE_BASE_READ`: read internal knowledge-base files through `/api/cms/knowledge-base`

### CRM

- `CRM_CASE_READ`: read CRM case data
- `CRM_CASE_CREATE`: create CRM cases manually from the CRM surface
- `CRM_CASE_UPDATE`: update CRM case status, assignment, summary, and customer contact fields
- `CRM_CASE_MESSAGE_WRITE`: send operator messages and internal notes on CRM cases
- `CRM_CASE_TAKEOVER_WRITE`: toggle operator takeover on live CRM sessions when not implied by an operator message
- `CRM_ATTACHMENT_READ`: download private request attachments through the protected admin route

## Current Route Coverage

The following routes already use explicit permission guards instead of only coarse role checks:

- `/api/admin/verify`
- `/api/admin/cases`
- `/api/admin/cases/[id]`
- `/api/admin/attachments/[id]`
- `/api/cms/ai`
- `/api/cms/seo`
- `/api/cms/knowledge-base`
- `/api/cms/media`
- `/api/cms/media/[id]`
- `/api/cms/articles`
- `/api/cms/articles/[id]`
- `/api/cms/pages`
- `/api/cms/pages/[id]`

Important detail:

- CRM case list/detail `GET` routes require read permission;
- CRM case collection `POST` requires create permission;
- CRM case detail `PATCH` requires update permission;
- CRM case detail `POST` requires message permission for operator messages/internal notes and takeover permission for standalone takeover toggles;
- CRM attachment download requires attachment-read permission;
- CMS media collection/detail `GET` routes require media-read permission;
- CMS media upload/update/delete routes require media-write permission;
- article/page detail `PATCH` routes require write permission for normal edits;
- publish or unpublish transitions inside those same `PATCH` routes require separate publish permission;
- article/page `DELETE` routes require separate delete permission.

The following routes are still effectively coarse-role protected today:

- dashboard shells

These remain valid in the current codebase, but they are not yet split into finer permissions.

## Current Enforcement Pattern

The current implementation uses two guard layers:

- role/session guard: `requireAdminSession(...)`
- permission guard: `requireAdminPermissionActor(...)`

The current permission map is static in code.

This means:

- authorization is deny-by-default once a route opts into explicit permission checks;
- current role membership still determines the effective permission set;
- changing permission grants currently requires a code change, not an admin UI change.

## Current Boundaries

Preserve these rules while extending RBAC:

- do not reintroduce master-key login paths;
- do not rely on frontend-only hiding for sensitive CMS actions;
- keep generic 404-style denial behavior on hidden internal routes where already used;
- keep audit logging on sensitive config, publish, delete, and attachment access actions;
- keep CRM and CMS session scopes separate.

## Next Expansion Path

Recommended next steps for this permission system:

1. Decide whether CRM status, assignment, and customer-profile edits need to be split further beyond the current `CRM_CASE_UPDATE` scope.
2. Split CMS media operations into separate read/write/delete permissions if needed.
3. Introduce persistent role/permission storage only after the permission surface is stable enough.
4. Add step-up auth requirements for destructive and high-impact permissions later.

## Sync Rule

When `signage-service/src/lib/admin-permissions.ts` changes, also update:

1. `docs/10_security_privacy/rbac_permissions.md`
2. `docs/10_security_privacy/admin_security_and_governance.md`
3. `docs/05_admin_platform/admin_rollout_execution_plan.md`
