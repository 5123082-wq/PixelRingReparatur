# 05 Admin Platform

Purpose: internal admin platform and Website CMS.

## Context Beacon

Purpose: admin/CMS domain router and startup context boundary. Read this beacon first for Admin Platform work; read deeper only for the specific admin/CMS task.

Current admin/CMS starter boundary:

- Current internal route: `/ring-master-config`.
- Exists now: protected CMS/admin starter for dashboard shell, AI config, articles, page content, media library, SEO config, and knowledge-base reads.
- Current admin finalization baseline was accepted for MVP usage and paused on 2026-04-19; reopen expansion work only when explicitly requested.
- Do not present planned modules as complete unless verified in code.

Read first:

1. Root `../../AGENTS.md` rules and the root `../../PROGRESS.md` Context Beacon plus latest 2-3 entries.
2. `../README.md` Context Beacon/router.
3. `../00_project_overview/project_state_and_roadmap.md` Context Beacon for current-state boundaries.
4. This file.
5. For rollout execution, read `admin_rollout_execution_plan.md` through the `Current Snapshot / Read Depth` block and the latest `Progress Log` entry only.

Task-specific docs:

- Rollout sequence, release gates, and active checkpoint: `admin_rollout_execution_plan.md`.
- Target architecture and phased admin/CMS scope: `admin_platform_overview.md`.
- Implementation sequencing against current code reality: `admin_implementation_phases.md`.
- Page CMS content planning: `page_content_cms_plan.md`.
- CMS site-management behavior: `cms_site_management.md`.

Deep/reference docs:

- Detailed historical admin progress: `admin_platform_progress_log.md`.
- Planned expansion docs below are not startup reads; open them only when the task touches that feature area.
- Security/privacy docs under `../10_security_privacy/` are required when changing auth, sessions, CSRF, rate limiting, audit, permissions, uploads, or admin/CMS mutations.

Security/admin guardrails:

- Preserve CSRF, rate-limit, and audit patterns when touching admin or CMS mutations.
- Keep admin/session tokens in HTTP-only cookies, not `localStorage`.
- Do not hardcode or expose secrets.
- Keep current-state and planned-state claims separate.

## Active Base Documents

- `admin_platform_overview.md`
- `cms_site_management.md`
- `admin_implementation_phases.md`
- `page_content_cms_plan.md`
- `admin_rollout_execution_plan.md`

## Planned Expansion Documents

- `cms_content_model.md`
- `media_library.md`
- `seo_geo_admin.md`
- `ai_knowledge_admin.md`
- `admin_workflows.md`

## Current Planning Rule

- `admin_platform_overview.md` is the target-state anchor for architecture and phased rollout.
- `admin_implementation_phases.md` keeps implementation sequencing with current code reality.
