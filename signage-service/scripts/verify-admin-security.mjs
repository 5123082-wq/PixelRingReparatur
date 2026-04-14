import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routeRoots = ['src/app/api/admin', 'src/app/api/cms'];
const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const allowedAuditedStateChangingGets = new Set([
  'src/app/api/admin/attachments/[id]/route.ts',
]);
const requiredRouteContracts = [
  {
    relativePath: 'src/app/api/cms/media/route.ts',
    description: 'CMS media collection route',
    checks: [
      {
        pattern: /requireAdminActor\([\s\S]*CMS_SESSION_COOKIE_NAME[\s\S]*\[\s*'OWNER'\s*\]/,
        label: '/api/cms/media must require CMS OWNER sessions',
      },
    ],
  },
  {
    relativePath: 'src/app/api/cms/media/[id]/route.ts',
    description: 'CMS media detail route',
    checks: [
      {
        pattern: /requireAdminActor\([\s\S]*CMS_SESSION_COOKIE_NAME[\s\S]*\[\s*'OWNER'\s*\]/,
        label: '/api/cms/media/:id must require CMS OWNER sessions',
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
      if (method === 'GET' && allowedAuditedStateChangingGets.has(relativePath)) {
        assertMatches(
          segment,
          /ATTACHMENT_DOWNLOADED/,
          `${method} ${apiPath} may only write audit logs for attachment downloads`
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
  /requireAdminActor\([\s\S]*CRM_SESSION_COOKIE_NAME[\s\S]*\[\s*'MANAGER'\s*\]/,
  '/api/admin/cases must require CRM MANAGER sessions'
);

const adminCaseDetail = readProjectFile('src/app/api/admin/cases/[id]/route.ts');
assertMatches(
  adminCaseDetail,
  /requireAdminActor\([\s\S]*CRM_SESSION_COOKIE_NAME[\s\S]*\[\s*'MANAGER'\s*\]/,
  '/api/admin/cases/:id must require CRM MANAGER sessions'
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

const adminAttachments = readProjectFile('src/app/api/admin/attachments/[id]/route.ts');
assertMatches(
  adminAttachments,
  /requireAdminActor\([\s\S]*CRM_SESSION_COOKIE_NAME[\s\S]*\[\s*'MANAGER'\s*\]/,
  '/api/admin/attachments/:id must require CRM MANAGER sessions'
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
assertMatches(adminAuth, /parseAdminLoginInput\s*\(/, 'CRM auth must parse dual-mode login input');
assertMatches(adminAuth, /authenticateAdminLogin\s*\(\s*prisma,\s*'MANAGER'/, 'CRM auth must authenticate named MANAGER users');
assertMatches(adminAuth, /createAdminSession\([\s\S]*adminUserId:\s*authResult\.user\.id[\s\S]*role:\s*authResult\.user\.role/, 'CRM auth must create sessions linked to the named admin user');
assertMatches(adminAuth, /ADMIN_LOGIN_FAILED/, 'CRM auth must audit failed login attempts');
assertMatches(adminAuth, /ADMIN_LOGIN_SUCCEEDED/, 'CRM auth must audit successful logins');
assertMatches(adminAuth, /CRM_SESSION_COOKIE_NAME/, 'CRM auth must use CRM session cookie');

const adminVerify = readProjectFile('src/app/api/admin/verify/route.ts');
assertMatches(adminVerify, /CRM_SESSION_COOKIE_NAME/, 'CRM verify must use CRM session cookie');
assertMatches(
  adminVerify,
  /actor\.role !== 'MANAGER'|requireAdminSession\s*\(\s*prisma,\s*token,\s*\[\s*'MANAGER'\s*\]\s*\)/,
  'CRM verify must reject non-MANAGER roles'
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
  'src/app/api/cms/ai/route.ts',
  'src/app/api/cms/articles/route.ts',
  'src/app/api/cms/articles/[id]/route.ts',
  'src/app/api/cms/media/route.ts',
  'src/app/api/cms/media/[id]/route.ts',
  'src/app/api/cms/pages/route.ts',
  'src/app/api/cms/pages/[id]/route.ts',
  'src/app/api/cms/seo/route.ts',
]) {
  assertMatches(
    readProjectFile(relativePath),
    /requireAdminActor\([\s\S]*CMS_SESSION_COOKIE_NAME[\s\S]*\[\s*'OWNER'\s*\]/,
    `${relativePath} must require CMS OWNER sessions`
  );
}

const cmsAuth = readProjectFile('src/app/api/cms/auth/route.ts');
assertMatches(cmsAuth, /parseAdminLoginInput\s*\(/, 'CMS auth must parse dual-mode login input');
assertMatches(cmsAuth, /authenticateAdminLogin\s*\(\s*prisma,\s*'OWNER'/, 'CMS auth must authenticate named OWNER users');
assertMatches(cmsAuth, /createAdminSession\([\s\S]*adminUserId:\s*authResult\.user\.id[\s\S]*role:\s*authResult\.user\.role/, 'CMS auth must create sessions linked to the named admin user');
assertMatches(cmsAuth, /ADMIN_LOGIN_FAILED/, 'CMS auth must audit failed login attempts');
assertMatches(cmsAuth, /ADMIN_LOGIN_SUCCEEDED/, 'CMS auth must audit successful logins');
assertMatches(cmsAuth, /CMS_SESSION_COOKIE_NAME/, 'CMS auth must use CMS session cookie');

const cmsKnowledgeBase = readProjectFile('src/app/api/cms/knowledge-base/route.ts');
assertMatches(cmsKnowledgeBase, /CMS_SESSION_COOKIE_NAME/, 'CMS knowledge-base must use CMS session cookie');
assertMatches(
  cmsKnowledgeBase,
  /actor\?\.role === 'OWNER'|requireAdminSession\s*\(\s*prisma,\s*token,\s*\[\s*'OWNER'\s*\]\s*\)/,
  'CMS knowledge-base must require OWNER sessions'
);

const cmsArticleDetail = readProjectFile('src/app/api/cms/articles/[id]/route.ts');
assertMatches(
  cmsArticleDetail,
  /function isUuidLike\(/,
  '/api/cms/articles/:id must validate UUID-like ids before object lookup'
);
assertMatches(
  cmsArticleDetail,
  /if \(!isUuidLike\(id\)\) \{\s*return notFoundResponse\(\);\s*\}/,
  '/api/cms/articles/:id must return a safe response for invalid ids'
);
assertMatches(
  cmsArticleDetail,
  /where:\s*\{\s*id,[\s\S]*deletedAt:\s*null/,
  '/api/cms/articles/:id must scope lookups to non-deleted articles'
);
assertMatches(
  cmsArticleDetail,
  /data:\s*\{\s*deletedAt:\s*new Date\(\)\s*\}/,
  '/api/cms/articles/:id DELETE must soft-delete articles'
);

const cmsPageDetail = readProjectFile('src/app/api/cms/pages/[id]/route.ts');
assertMatches(
  cmsPageDetail,
  /function isUuidLike\(/,
  '/api/cms/pages/:id must validate UUID-like ids before object lookup'
);
assertMatches(
  cmsPageDetail,
  /if \(!isUuidLike\(id\)\) \{\s*return notFoundResponse\(\);\s*\}/,
  '/api/cms/pages/:id must return a safe response for invalid ids'
);
assertMatches(
  cmsPageDetail,
  /where:\s*\{\s*id,[\s\S]*deletedAt:\s*null/,
  '/api/cms/pages/:id must scope lookups to non-deleted pages'
);
assertMatches(
  cmsPageDetail,
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
