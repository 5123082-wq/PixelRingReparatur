import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routeRoots = ['src/app/api/admin', 'src/app/api/cms'];
const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const allowedAuditedStateChangingGets = new Map([
  [
    'src/app/api/admin/attachments/[id]/route.ts',
    {
      pattern: /ATTACHMENT_DOWNLOADED/,
      label: 'must only write audit logs for attachment downloads',
    },
  ],
  [
    'src/app/api/cms/articles/[id]/revisions/route.ts',
    {
      pattern: /CMS_ARTICLE_REVISION_VIEWED/,
      label: 'must only write audit logs for article revision reads',
    },
  ],
  [
    'src/app/api/cms/pages/[id]/revisions/route.ts',
    {
      pattern: /CMS_PAGE_REVISION_VIEWED/,
      label: 'must only write audit logs for page revision reads',
    },
  ],
]);
const requiredRouteContracts = [
  {
    relativePath: 'src/app/api/cms/media/route.ts',
    description: 'CMS media collection route',
    checks: [
      {
        pattern: /requireAdminPermissionActor\(/,
        label: '/api/cms/media must use permission-based CMS media guards',
      },
      {
        pattern: /export async function GET[\s\S]*requireMediaReadActor\(/,
        label: 'GET /api/cms/media must require CMS media read permission',
      },
      {
        pattern: /export async function POST[\s\S]*requireMediaWriteActor\(/,
        label: 'POST /api/cms/media must require CMS media write permission',
      },
    ],
  },
  {
    relativePath: 'src/app/api/cms/media/[id]/route.ts',
    description: 'CMS media detail route',
    checks: [
      {
        pattern: /requireAdminPermissionActor\(/,
        label: '/api/cms/media/:id must use permission-based CMS media guards',
      },
      {
        pattern: /export async function GET[\s\S]*requireMediaReadActor\(/,
        label: 'GET /api/cms/media/:id must require CMS media read permission',
      },
      {
        pattern: /export async function PATCH[\s\S]*requireMediaWriteActor\(/,
        label: 'PATCH /api/cms/media/:id must require CMS media write permission',
      },
      {
        pattern: /export async function DELETE[\s\S]*requireMediaWriteActor\(/,
        label: 'DELETE /api/cms/media/:id must require CMS media write permission',
      },
      {
        pattern: /function isUuidLike\(/,
        label: '/api/cms/media/:id must validate UUID-like ids before object lookup',
      },
      {
        pattern: /if \(!isUuidLike\(id\)\) \{\s*return notFoundResponse\(\);\s*\}/,
        label: '/api/cms/media/:id must return a safe response for invalid ids',
      },
      {
        pattern: /where:\s*\{\s*id,[\s\S]*deletedAt:\s*null/,
        label: '/api/cms/media/:id must scope lookups to non-deleted media rows',
      },
      {
        pattern: /data:\s*\{\s*deletedAt:\s*new Date\(\)\s*\}/,
        label: '/api/cms/media/:id DELETE must soft-delete media',
      },
      {
        pattern: /where\s+used|whereUsed|usedBy|referenc(?:e|ed)By|inUse/i,
        label: '/api/cms/media/:id DELETE must gate deletion on where-used checks',
      },
    ],
  },
  {
    relativePath: 'src/app/api/cms/articles/[id]/revisions/route.ts',
    description: 'CMS article revisions route',
    checks: [
      {
        pattern: /requireAdminPermissionActor\([\s\S]*CMS_ARTICLE_REVISIONS_READ/,
        label: 'GET /api/cms/articles/:id/revisions must require article revisions read permission',
      },
      {
        pattern: /CMS_ARTICLE_REVISION_VIEWED/,
        label: 'GET /api/cms/articles/:id/revisions must audit revision reads',
      },
      {
        pattern: /function isUuidLike\(|resolveUuidRouteParam\s*\(/,
        label: '/api/cms/articles/:id/revisions must validate UUID-like ids',
      },
    ],
  },
  {
    relativePath: 'src/app/api/cms/articles/[id]/restore/route.ts',
    description: 'CMS article restore route',
    checks: [
      {
        pattern: /validateAdminCsrf\(/,
        label: 'POST /api/cms/articles/:id/restore must enforce CSRF validation',
      },
      {
        pattern: /requireAdminPermissionActor\([\s\S]*CMS_ARTICLE_RESTORE/,
        label: 'POST /api/cms/articles/:id/restore must require article restore permission',
      },
      {
        pattern: /CMS_ARTICLE_RESTORED/,
        label: 'POST /api/cms/articles/:id/restore must audit restores',
      },
      {
        pattern: /restoredFromRevisionId/,
        label: 'POST /api/cms/articles/:id/restore must return restoredFromRevisionId',
      },
    ],
  },
  {
    relativePath: 'src/app/api/cms/pages/[id]/revisions/route.ts',
    description: 'CMS page revisions route',
    checks: [
      {
        pattern: /requireAdminPermissionActor\([\s\S]*CMS_PAGE_REVISIONS_READ/,
        label: 'GET /api/cms/pages/:id/revisions must require page revisions read permission',
      },
      {
        pattern: /CMS_PAGE_REVISION_VIEWED/,
        label: 'GET /api/cms/pages/:id/revisions must audit revision reads',
      },
      {
        pattern: /function isUuidLike\(|resolveUuidRouteParam\s*\(/,
        label: '/api/cms/pages/:id/revisions must validate UUID-like ids',
      },
    ],
  },
  {
    relativePath: 'src/app/api/cms/pages/[id]/restore/route.ts',
    description: 'CMS page restore route',
    checks: [
      {
        pattern: /validateAdminCsrf\(/,
        label: 'POST /api/cms/pages/:id/restore must enforce CSRF validation',
      },
      {
        pattern: /requireAdminPermissionActor\([\s\S]*CMS_PAGE_RESTORE/,
        label: 'POST /api/cms/pages/:id/restore must require page restore permission',
      },
      {
        pattern: /CMS_PAGE_RESTORED/,
        label: 'POST /api/cms/pages/:id/restore must audit restores',
      },
      {
        pattern: /restoredFromRevisionId/,
        label: 'POST /api/cms/pages/:id/restore must return restoredFromRevisionId',
      },
    ],
  },
];

const cmsMediaSchema = readProjectFile('prisma/schema.prisma');
assertMatches(
  cmsMediaSchema,
  /model CmsMedia \{[\s\S]*usageType\s+CmsMediaUsageType[\s\S]*publicUrl\s+String[\s\S]*checksumSha256\s+String[\s\S]*deletedAt\s+DateTime\?[\s\S]*@@index\(\[deletedAt\]\)/,
  'prisma/schema.prisma must define the CmsMedia model with the public media metadata and soft-delete index'
);
assertMatches(
  cmsMediaSchema,
  /enum AdminUserStatus \{[\s\S]*ACTIVE[\s\S]*DISABLED[\s\S]*\}/,
  'prisma/schema.prisma must define AdminUserStatus'
);
assertMatches(
  cmsMediaSchema,
  /model AdminUser \{[\s\S]*email\s+String\s+@unique[\s\S]*passwordHash\s+String[\s\S]*role\s+AdminRole[\s\S]*status\s+AdminUserStatus[\s\S]*sessions\s+AdminSession\[\]/,
  'prisma/schema.prisma must define AdminUser with unique email, password hash, role, status, and sessions'
);
assertMatches(
  cmsMediaSchema,
  /model AdminSession \{[\s\S]*adminUserId\s+String[\s\S]*lastSeenAt\s+DateTime\?[\s\S]*revokedAt\s+DateTime\?[\s\S]*adminUser\s+AdminUser/,
  'prisma/schema.prisma must link AdminSession to AdminUser and track lastSeenAt/revokedAt'
);
assertMatches(
  cmsMediaSchema,
  /model AdminAuditLog \{[\s\S]*actorAdminUserId\s+String\?[\s\S]*actorAdminUser\s+AdminUser\?/,
  'prisma/schema.prisma must link AdminAuditLog back to the named admin user'
);
assertMatches(
  cmsMediaSchema,
  /enum CmsRevisionSourceAction \{[\s\S]*CREATE[\s\S]*UPDATE[\s\S]*PUBLISH[\s\S]*UNPUBLISH[\s\S]*RESTORE[\s\S]*\}/,
  'prisma/schema.prisma must define CmsRevisionSourceAction enum'
);
assertMatches(
  cmsMediaSchema,
  /model CmsArticleRevision \{[\s\S]*articleId\s+String[\s\S]*sourceAction\s+CmsRevisionSourceAction[\s\S]*snapshot\s+Json[\s\S]*@@index\(\[articleId, createdAt\]\)/,
  'prisma/schema.prisma must define CmsArticleRevision with articleId/sourceAction/snapshot and index'
);
assertMatches(
  cmsMediaSchema,
  /model CmsPageRevision \{[\s\S]*pageId\s+String[\s\S]*sourceAction\s+CmsRevisionSourceAction[\s\S]*snapshot\s+Json[\s\S]*@@index\(\[pageId, createdAt\]\)/,
  'prisma/schema.prisma must define CmsPageRevision with pageId/sourceAction/snapshot and index'
);

const adminPermissionsSource = readProjectFile('src/lib/admin-permissions.ts');
assertMatches(
  adminPermissionsSource,
  /'CMS_ARTICLE_REVISIONS_READ'[\s\S]*'CMS_ARTICLE_RESTORE'[\s\S]*'CMS_PAGE_REVISIONS_READ'[\s\S]*'CMS_PAGE_RESTORE'/,
  'admin permissions must define all CMS revision/restore permission keys'
);
assertMatches(
  adminPermissionsSource,
  /OWNER:\s*\[[\s\S]*'CMS_ARTICLE_REVISIONS_READ'[\s\S]*'CMS_ARTICLE_RESTORE'[\s\S]*'CMS_PAGE_REVISIONS_READ'[\s\S]*'CMS_PAGE_RESTORE'/,
  'OWNER role must include CMS revision/restore permissions'
);
const managerPermissionsSectionMatch = adminPermissionsSource.match(
  /MANAGER:\s*\[([\s\S]*?)\],/
);
assert.ok(
  managerPermissionsSectionMatch,
  'admin permissions must define MANAGER permissions section'
);
const managerPermissionsSection = managerPermissionsSectionMatch[1];
assertDoesNotInclude(
  managerPermissionsSection,
  'CMS_ARTICLE_REVISIONS_READ',
  'MANAGER role must not include CMS article revisions read permission'
);
assertDoesNotInclude(
  managerPermissionsSection,
  'CMS_ARTICLE_RESTORE',
  'MANAGER role must not include CMS article restore permission'
);
assertDoesNotInclude(
  managerPermissionsSection,
  'CMS_PAGE_REVISIONS_READ',
  'MANAGER role must not include CMS page revisions read permission'
);
assertDoesNotInclude(
  managerPermissionsSection,
  'CMS_PAGE_RESTORE',
  'MANAGER role must not include CMS page restore permission'
);

const cmsMediaMigration = readProjectFile(
  'prisma/migrations/20260408183000_phase4_cms_media/migration.sql'
);
assertMatches(
  cmsMediaMigration,
  /CREATE TABLE "cms_media"/,
  'Phase 4 migration must create the cms_media table'
);
assertMatches(
  cmsMediaMigration,
  /CREATE UNIQUE INDEX "cms_media_publicUrl_key"/,
  'Phase 4 migration must enforce unique public media URLs'
);
assertMatches(
  cmsMediaMigration,
  /CREATE INDEX "cms_media_deletedAt_idx"/,
  'Phase 4 migration must index soft-deleted media rows'
);

requireProjectFile(
  'prisma/migrations/20260408194500_phase4_expand_cms_media_usage_enum/migration.sql',
  'Phase 4 enum follow-up migration must exist for SERVICE and CASE usage types'
);
const cmsMediaEnumMigration = readProjectFile(
  'prisma/migrations/20260408194500_phase4_expand_cms_media_usage_enum/migration.sql'
);
assertMatches(
  cmsMediaEnumMigration,
  /ADD VALUE IF NOT EXISTS 'SERVICE'/,
  'Phase 4 enum migration must add SERVICE usage type'
);
assertMatches(
  cmsMediaEnumMigration,
  /ADD VALUE IF NOT EXISTS 'CASE'/,
  'Phase 4 enum migration must add CASE usage type'
);
requireProjectFile(
  'prisma/migrations/20260414193000_cms_revisions_slice1/migration.sql',
  'Block 2 Slice 1 revisions migration must exist'
);
const cmsRevisionsMigration = readProjectFile(
  'prisma/migrations/20260414193000_cms_revisions_slice1/migration.sql'
);
assertMatches(
  cmsRevisionsMigration,
  /CREATE TABLE "cms_article_revisions"/,
  'Revisions migration must create cms_article_revisions table'
);
assertMatches(
  cmsRevisionsMigration,
  /CREATE TABLE "cms_page_revisions"/,
  'Revisions migration must create cms_page_revisions table'
);

const routeParamsSource = readProjectFile('src/lib/route-params.ts');
assertMatches(
  routeParamsSource,
  /export function isUuidLike\([\s\S]*UUID_LIKE_PATTERN\.test\(value\)/,
  'route-params helper must expose shared UUID validation'
);
assertMatches(
  routeParamsSource,
  /UUID_LIKE_PATTERN[\s\S]*\[1-8\]\[0-9a-f\]\{3\}-\[89ab\]\[0-9a-f\]\{3\}-\[0-9a-f\]\{12\}/,
  'route-params helper must use the canonical UUID-like matcher'
);
assertMatches(
  routeParamsSource,
  /export async function resolveUuidRouteParam\([\s\S]*request\.nextUrl\.pathname/,
  'route-params helper must support route param fallback from the request pathname'
);

function readProjectFile(relativePath) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function hasProjectFile(relativePath) {
  try {
    return statSync(path.join(projectRoot, relativePath)).isFile();
  } catch {
    return false;
  }
}

function requireProjectFile(relativePath, label) {
  assert.equal(hasProjectFile(relativePath), true, label);
}

function walkRouteFiles(relativeDirectory) {
  const absoluteDirectory = path.join(projectRoot, relativeDirectory);
  const files = [];

  for (const entry of readdirSync(absoluteDirectory)) {
    const absoluteEntryPath = path.join(absoluteDirectory, entry);
    const relativeEntryPath = path.join(relativeDirectory, entry);
    const stats = statSync(absoluteEntryPath);

    if (stats.isDirectory()) {
      files.push(...walkRouteFiles(relativeEntryPath));
      continue;
    }

    if (entry === 'route.ts') {
      files.push(relativeEntryPath);
    }
  }

  return files;
}

function extractRouteSegment(source, method) {
  const marker = `export async function ${method}`;
  const start = source.indexOf(marker);

  if (start === -1) {
    return null;
  }

  const nextExport = source.indexOf('\nexport async function ', start + marker.length);
  return source.slice(start, nextExport === -1 ? source.length : nextExport);
}

function requireRouteSegment(relativePath, method, label) {
  const segment = extractRouteSegment(readProjectFile(relativePath), method);
  assert.ok(segment, label);
  return segment;
}

function apiPathForRoute(relativePath) {
  return relativePath
    .replace(/^src\/app\/api/, '/api')
    .replace(/\/route\.ts$/, '')
    .replace(/\[([^\]]+)\]/g, ':$1');
}

function assertMatches(source, pattern, label) {
  assert.match(source, pattern, label);
}

function assertDoesNotInclude(source, text, label) {
  assert.equal(source.includes(text), false, label);
}

function assertUsesUuidValidation(source, label) {
  assertMatches(source, /function isUuidLike\(|resolveUuidRouteParam\s*\(/, label);
}

function assertRejectsInvalidUuidWithNotFound(source, label) {
  assertMatches(
    source,
    /if \(!isUuidLike\(id\)\) \{\s*return notFoundResponse\(\);\s*\}|const id = await resolveUuidRouteParam\([\s\S]*?\);\s*if \(!id\) \{\s*return notFoundResponse\(\);\s*\}/,
    label
  );
}

function segmentMutatesState(segment) {
  return (
    /\b(?:prisma|tx)\.[\s\S]*?\.(?:create|createMany|update|updateMany|delete|deleteMany|upsert)\s*\(/.test(segment) ||
    /\bcreateAdminAuditLog\s*\(/.test(segment)
  );
}

const routeFiles = routeRoots.flatMap(walkRouteFiles).sort();
const mutationRoutes = [];

for (const relativePath of routeFiles) {
  const source = readProjectFile(relativePath);
  const apiPath = apiPathForRoute(relativePath);

  for (const method of methods) {
    const segment = extractRouteSegment(source, method);

    if (!segment) {
      continue;
    }

    if (mutatingMethods.has(method)) {
      mutationRoutes.push(`${method} ${apiPath}`);
      assertMatches(
        segment,
        /validateAdminCsrf\s*\(/,
        `${method} ${apiPath} must call validateAdminCsrf`
      );
    } else if (segmentMutatesState(segment)) {
      const allowedAuditedGet = method === 'GET' ? allowedAuditedStateChangingGets.get(relativePath) : null;

      if (allowedAuditedGet) {
        assertMatches(
          segment,
          allowedAuditedGet.pattern,
          `${method} ${apiPath} ${allowedAuditedGet.label}`
        );
      } else {
        assert.fail(`${method} ${apiPath} must remain read-only`);
      }
    }
  }
}

for (const relativePath of routeFiles.filter((file) => file.startsWith('src/app/api/admin/'))) {
  assertDoesNotInclude(
    readProjectFile(relativePath),
    'CMS_SESSION_COOKIE_NAME',
    `${relativePath} must not accept CMS session cookies`
  );
}

for (const relativePath of routeFiles.filter((file) => file.startsWith('src/app/api/cms/'))) {
  assertDoesNotInclude(
    readProjectFile(relativePath),
    'CRM_SESSION_COOKIE_NAME',
    `${relativePath} must not accept CRM session cookies`
  );
}

const adminCases = readProjectFile('src/app/api/admin/cases/route.ts');
assertMatches(
  adminCases,
  /requireAdminPermissionActor\(/,
  '/api/admin/cases must use permission-based CRM guards'
);
assertMatches(
  requireRouteSegment('src/app/api/admin/cases/route.ts', 'GET', 'CRM cases GET route must exist'),
  /requireCaseReadActor\(/,
  'GET /api/admin/cases must require CRM case read permission'
);
assertMatches(
  requireRouteSegment('src/app/api/admin/cases/route.ts', 'POST', 'CRM cases POST route must exist'),
  /requireCaseCreateActor\(/,
  'POST /api/admin/cases must require CRM case create permission'
);

const adminCaseDetail = readProjectFile('src/app/api/admin/cases/[id]/route.ts');
assertMatches(
  adminCaseDetail,
  /requireAdminPermissionActor\(/,
  '/api/admin/cases/:id must use permission-based CRM guards'
);
assertMatches(
  adminCaseDetail,
  /function isUuidLike\(/,
  '/api/admin/cases/:id must validate UUID-like ids before object lookup'
);
assertMatches(
  adminCaseDetail,
  /if \(!isUuidLike\(id\)\) \{\s*return notFoundResponse\(\);\s*\}/,
  '/api/admin/cases/:id must return a safe response for invalid ids'
);
assertMatches(
  requireRouteSegment('src/app/api/admin/cases/[id]/route.ts', 'GET', 'CRM case detail GET route must exist'),
  /requireCaseReadActor\(/,
  'GET /api/admin/cases/:id must require CRM case read permission'
);
assertMatches(
  requireRouteSegment('src/app/api/admin/cases/[id]/route.ts', 'POST', 'CRM case detail POST route must exist'),
  /CRM_CASE_MESSAGE_WRITE[\s\S]*CRM_CASE_TAKEOVER_WRITE|CRM_CASE_TAKEOVER_WRITE[\s\S]*CRM_CASE_MESSAGE_WRITE/,
  'POST /api/admin/cases/:id must gate conversation updates behind CRM message/takeover permissions'
);
assertMatches(
  requireRouteSegment('src/app/api/admin/cases/[id]/route.ts', 'PATCH', 'CRM case detail PATCH route must exist'),
  /requireCaseUpdateActor\(/,
  'PATCH /api/admin/cases/:id must require CRM case update permission'
);

const adminAttachments = readProjectFile('src/app/api/admin/attachments/[id]/route.ts');
assertMatches(
  adminAttachments,
  /requireAdminPermissionActor\([\s\S]*CRM_SESSION_COOKIE_NAME[\s\S]*CRM_ATTACHMENT_READ/,
  '/api/admin/attachments/:id must require CRM attachment read permission'
);
assertMatches(
  adminAttachments,
  /function isUuidLike\(/,
  '/api/admin/attachments/:id must validate attachment ids'
);
assertMatches(
  adminAttachments,
  /auditBlockedAttachmentDownload\(/,
  '/api/admin/attachments/:id must audit blocked downloads'
);
assertMatches(
  adminAttachments,
  /ATTACHMENT_DOWNLOADED/,
  '/api/admin/attachments/:id must audit successful downloads'
);

const adminAuth = readProjectFile('src/app/api/admin/auth/route.ts');
assertMatches(adminAuth, /parseAdminLoginInput\s*\(/, 'CRM auth must parse password login input');
assertMatches(adminAuth, /authenticateAdminLogin\s*\(\s*prisma,\s*'MANAGER'/, 'CRM auth must authenticate named MANAGER users');
assertMatches(adminAuth, /createAdminSession\([\s\S]*adminUserId:\s*authResult\.user\.id[\s\S]*role:\s*authResult\.user\.role/, 'CRM auth must create sessions linked to the named admin user');
assertMatches(adminAuth, /ADMIN_LOGIN_FAILED/, 'CRM auth must audit failed login attempts');
assertMatches(adminAuth, /ADMIN_LOGIN_SUCCEEDED/, 'CRM auth must audit successful logins');
assertMatches(adminAuth, /CRM_SESSION_COOKIE_NAME/, 'CRM auth must use CRM session cookie');
assertDoesNotInclude(adminAuth, 'master-key', 'CRM auth must not keep the bootstrap master-key login path');

const adminVerify = readProjectFile('src/app/api/admin/verify/route.ts');
assertMatches(adminVerify, /CRM_SESSION_COOKIE_NAME/, 'CRM verify must use CRM session cookie');
assertMatches(
  adminVerify,
  /requireAdminPermissionActor\([\s\S]*CRM_CASE_READ/,
  'CRM verify must require CRM case read permission'
);

requireProjectFile('src/app/api/cms/verify/route.ts', 'CMS verify route must exist');
const cmsVerify = readProjectFile('src/app/api/cms/verify/route.ts');
assertMatches(cmsVerify, /CMS_SESSION_COOKIE_NAME/, 'CMS verify must use CMS session cookie');
assertMatches(
  cmsVerify,
  /actor\.role !== 'OWNER'|requireAdminSession\s*\(\s*prisma,\s*token,\s*\[\s*'OWNER'\s*\]\s*\)/,
  'CMS verify must reject non-OWNER roles'
);

for (const relativePath of [
  'src/app/api/cms/articles/route.ts',
  'src/app/api/cms/media/route.ts',
  'src/app/api/cms/media/[id]/route.ts',
  'src/app/api/cms/pages/route.ts',
]) {
  assertMatches(
    readProjectFile(relativePath),
    /requireAdminActor\([\s\S]*CMS_SESSION_COOKIE_NAME[\s\S]*\[\s*'OWNER'\s*\]|requireAdminPermissionActor\(/,
    `${relativePath} must protect CMS access with an admin guard`
  );
}

assertMatches(
  readProjectFile('src/app/api/cms/articles/route.ts'),
  /createArticleRevisionSnapshot\(/,
  'CMS article collection route must create revision snapshots on create'
);
assertMatches(
  readProjectFile('src/app/api/cms/pages/route.ts'),
  /createPageRevisionSnapshot\(/,
  'CMS page collection route must create revision snapshots on create'
);

const cmsArticleDetail = readProjectFile('src/app/api/cms/articles/[id]/route.ts');
assertMatches(cmsArticleDetail, /requireAdminPermissionActor\(/, 'CMS article detail route must use the admin permission guard');
assertMatches(cmsArticleDetail, /CMS_ARTICLE_READ/, 'CMS article detail route must require article read permission');
assertMatches(cmsArticleDetail, /CMS_ARTICLE_WRITE/, 'CMS article detail route must require article write permission');
assertMatches(cmsArticleDetail, /CMS_ARTICLE_PUBLISH/, 'CMS article detail route must gate publish transitions on article publish permission');
assertMatches(cmsArticleDetail, /CMS_ARTICLE_DELETE/, 'CMS article detail route must gate delete on article delete permission');
assertMatches(cmsArticleDetail, /createArticleRevisionSnapshot\(/, 'CMS article detail route must create revision snapshots on updates');

const cmsArticlePatch = requireRouteSegment(
  'src/app/api/cms/articles/[id]/route.ts',
  'PATCH',
  'CMS article detail PATCH route must exist'
);
assertMatches(cmsArticlePatch, /requireArticleWriteActor\(/, 'CMS article detail PATCH must require article write access');
assertMatches(
  cmsArticlePatch,
  /requiresPublishPermission[\s\S]*hasAdminPermissions\(actor\.role,\s*\['CMS_ARTICLE_PUBLISH'\]\)/,
  'CMS article detail PATCH must gate publish transitions on article publish permission'
);

const cmsArticleDelete = requireRouteSegment(
  'src/app/api/cms/articles/[id]/route.ts',
  'DELETE',
  'CMS article detail DELETE route must exist'
);
assertMatches(cmsArticleDelete, /requireArticleDeleteActor\(/, 'CMS article detail DELETE must require article delete access');

const cmsAi = readProjectFile('src/app/api/cms/ai/route.ts');
assertMatches(cmsAi, /requireAdminPermissionActor\(/, 'CMS AI route must use the admin permission guard');
assertMatches(cmsAi, /CMS_AI_CONFIG_READ/, 'CMS AI route must require explicit AI read permission');
assertMatches(cmsAi, /CMS_AI_CONFIG_WRITE/, 'CMS AI route must require explicit AI write permission');

const cmsSeo = readProjectFile('src/app/api/cms/seo/route.ts');
assertMatches(cmsSeo, /requireAdminPermissionActor\(/, 'CMS SEO route must use the admin permission guard');
assertMatches(cmsSeo, /CMS_SEO_READ/, 'CMS SEO route must require explicit SEO read permission');
assertMatches(cmsSeo, /CMS_SEO_WRITE/, 'CMS SEO route must require explicit SEO write permission');

const cmsPageDetail = readProjectFile('src/app/api/cms/pages/[id]/route.ts');
assertMatches(cmsPageDetail, /requireAdminPermissionActor\(/, 'CMS page detail route must use the admin permission guard');
assertMatches(cmsPageDetail, /CMS_PAGE_READ/, 'CMS page detail route must require page read permission');
assertMatches(cmsPageDetail, /CMS_PAGE_WRITE/, 'CMS page detail route must require page write permission');
assertMatches(cmsPageDetail, /CMS_PAGE_PUBLISH/, 'CMS page detail route must gate publish transitions on page publish permission');
assertMatches(cmsPageDetail, /CMS_PAGE_DELETE/, 'CMS page detail route must gate delete on page delete permission');
assertMatches(cmsPageDetail, /createPageRevisionSnapshot\(/, 'CMS page detail route must create revision snapshots on updates');

const cmsPagePatch = requireRouteSegment(
  'src/app/api/cms/pages/[id]/route.ts',
  'PATCH',
  'CMS page detail PATCH route must exist'
);
assertMatches(cmsPagePatch, /requirePageWriteActor\(/, 'CMS page detail PATCH must require page write access');
assertMatches(
  cmsPagePatch,
  /requiresPublishPermission[\s\S]*hasAdminPermissions\(actor\.role,\s*\['CMS_PAGE_PUBLISH'\]\)/,
  'CMS page detail PATCH must gate publish transitions on page publish permission'
);

const cmsPageDelete = requireRouteSegment(
  'src/app/api/cms/pages/[id]/route.ts',
  'DELETE',
  'CMS page detail DELETE route must exist'
);
assertMatches(cmsPageDelete, /requirePageDeleteActor\(/, 'CMS page detail DELETE must require page delete access');

const cmsAuth = readProjectFile('src/app/api/cms/auth/route.ts');
assertMatches(cmsAuth, /parseAdminLoginInput\s*\(/, 'CMS auth must parse password login input');
assertMatches(cmsAuth, /authenticateAdminLogin\s*\(\s*prisma,\s*'OWNER'/, 'CMS auth must authenticate named OWNER users');
assertMatches(cmsAuth, /createAdminSession\([\s\S]*adminUserId:\s*authResult\.user\.id[\s\S]*role:\s*authResult\.user\.role/, 'CMS auth must create sessions linked to the named admin user');
assertMatches(cmsAuth, /ADMIN_LOGIN_FAILED/, 'CMS auth must audit failed login attempts');
assertMatches(cmsAuth, /ADMIN_LOGIN_SUCCEEDED/, 'CMS auth must audit successful logins');
assertMatches(cmsAuth, /CMS_SESSION_COOKIE_NAME/, 'CMS auth must use CMS session cookie');
assertDoesNotInclude(cmsAuth, 'master-key', 'CMS auth must not keep the bootstrap master-key login path');

const cmsKnowledgeBase = readProjectFile('src/app/api/cms/knowledge-base/route.ts');
assertMatches(cmsKnowledgeBase, /CMS_SESSION_COOKIE_NAME/, 'CMS knowledge-base must use CMS session cookie');
assertMatches(
  cmsKnowledgeBase,
  /requireAdminPermissionActor\([\s\S]*CMS_SESSION_COOKIE_NAME[\s\S]*CMS_KNOWLEDGE_BASE_READ/,
  'CMS knowledge-base must require explicit knowledge-base read permission'
);

const cmsArticleDetailSecurity = readProjectFile('src/app/api/cms/articles/[id]/route.ts');
assertUsesUuidValidation(
  cmsArticleDetailSecurity,
  '/api/cms/articles/:id must validate UUID-like ids before object lookup'
);
assertRejectsInvalidUuidWithNotFound(
  cmsArticleDetailSecurity,
  '/api/cms/articles/:id must return a safe response for invalid ids'
);
assertMatches(
  cmsArticleDetailSecurity,
  /where:\s*\{\s*id,[\s\S]*deletedAt:\s*null/,
  '/api/cms/articles/:id must scope lookups to non-deleted articles'
);
assertMatches(
  cmsArticleDetailSecurity,
  /data:\s*\{\s*deletedAt:\s*new Date\(\)\s*\}/,
  '/api/cms/articles/:id DELETE must soft-delete articles'
);

const cmsPageDetailSecurity = readProjectFile('src/app/api/cms/pages/[id]/route.ts');
assertUsesUuidValidation(
  cmsPageDetailSecurity,
  '/api/cms/pages/:id must validate UUID-like ids before object lookup'
);
assertRejectsInvalidUuidWithNotFound(
  cmsPageDetailSecurity,
  '/api/cms/pages/:id must return a safe response for invalid ids'
);
assertMatches(
  cmsPageDetailSecurity,
  /where:\s*\{\s*id,[\s\S]*deletedAt:\s*null/,
  '/api/cms/pages/:id must scope lookups to non-deleted pages'
);
assertMatches(
  cmsPageDetailSecurity,
  /data:\s*\{\s*deletedAt:\s*new Date\(\)\s*\}/,
  '/api/cms/pages/:id DELETE must soft-delete pages'
);

for (const { relativePath, description, checks } of requiredRouteContracts) {
  requireProjectFile(relativePath, `${description} must exist.`);
  const source = readProjectFile(relativePath);

  for (const { pattern, label } of checks) {
    assertMatches(source, pattern, label);
  }

  console.log(`Admin security coverage detected: ${description}.`);
}

console.log(`Admin security verification passed: ${mutationRoutes.length} mutation routes checked.`);
