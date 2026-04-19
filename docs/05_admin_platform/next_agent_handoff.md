# Next Agent Handoff (Admin Track)

## Date
- 2026-04-19

## Current Execution Mode
- Admin finalization track is **paused** by owner decision at current accepted baseline.
- Do not continue Stage 5/6/7 work in this track unless owner explicitly reopens it.
- Next agent should move to another product block.

## Scope Lock (Owner Decision)
- Do **not** implement signed preview.
- Do **not** implement scheduled publish/unpublish.
- Keep publication flow simple: `draft -> internal admin review -> publish` (and unpublish when needed).
- Keep workflow implementation scoped to `CmsArticle` in this iteration.

## What Is Already Done
- Manual end-to-end flow verified by owner:
  - `draft -> publish -> unpublish -> restore -> re-publish`.
- Automation updated for the same lifecycle:
  - `signage-service/scripts/test-admin-e2e-smoke.test.ts` now explicitly checks `restore -> re-publish` and `statusReason` on `PUBLISHED -> DRAFT`.
- Articles dashboard UX improved:
  - explicit post-draft guidance with quick action `Show drafts`;
  - dedicated review-queue view for `IN_REVIEW` + `APPROVED`.
- Multilingual save integrity fixed:
  - when locale is switched while editing an existing article, save now creates a new locale article (create path) instead of mutating source-locale record;
  - server now rejects locale mutation on update path for existing article ids.
- CMS media upload validation hardened:
  - stricter size/signature/checksum/dimension checks;
  - clearer API error status mapping (`400/413/415`);
  - focused validation test script added.

## Immediate Next Actions
1. Treat this track as frozen for now; no new admin finalization feature work.
2. If touching adjacent code for unrelated tasks, keep current admin verification green (`npm run test:admin-runtime`, `npm run test:admin-e2e-smoke`).
3. Shift active execution to the next owner-selected block outside admin finalization.

## What Not To Do Now
- No preview-token implementation.
- No scheduling executor/jobs for publishing.
- No `CmsPage` publication workflow expansion in this slice.
- No broad refactors outside current admin track.
- No continuation of Stage 5/6/7 in this track while pause is active.

## Verification Commands
Run from `signage-service/`:

```bash
npm run test:admin-runtime
npm run test:admin-e2e-smoke
```

Optional lint check for touched files:

```bash
npx eslint src/lib/cms/media.ts src/app/api/cms/media/route.ts "src/app/[locale]/ring-master-config/dashboard/articles/page.tsx" scripts/test-admin-e2e-smoke.test.ts scripts/test-cms-media-upload-validation.test.ts
```

## Source Of Truth For Ongoing Status
- Global short status: `PROGRESS.md`
- Detailed chronological status: `docs/05_admin_platform/admin_rollout_execution_plan.md` (`Progress Log`, newest entry on top)
