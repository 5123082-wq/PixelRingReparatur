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

function readProjectFile(relativePath) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
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
assertMatches(adminAuth, /validateAdminMasterKey\([\s\S]*'MANAGER'\)/, 'CRM auth must validate MANAGER keys');
assertMatches(adminAuth, /role:\s*'MANAGER'/, 'CRM auth must create MANAGER sessions');
assertMatches(adminAuth, /CRM_SESSION_COOKIE_NAME/, 'CRM auth must use CRM session cookie');

const adminVerify = readProjectFile('src/app/api/admin/verify/route.ts');
assertMatches(adminVerify, /CRM_SESSION_COOKIE_NAME/, 'CRM verify must use CRM session cookie');
assertMatches(adminVerify, /role !== 'MANAGER'/, 'CRM verify must reject non-MANAGER roles');

for (const relativePath of [
  'src/app/api/cms/ai/route.ts',
  'src/app/api/cms/articles/route.ts',
  'src/app/api/cms/articles/[id]/route.ts',
  'src/app/api/cms/seo/route.ts',
]) {
  assertMatches(
    readProjectFile(relativePath),
    /requireAdminActor\([\s\S]*CMS_SESSION_COOKIE_NAME[\s\S]*\[\s*'OWNER'\s*\]/,
    `${relativePath} must require CMS OWNER sessions`
  );
}

const cmsAuth = readProjectFile('src/app/api/cms/auth/route.ts');
assertMatches(cmsAuth, /validateAdminMasterKey\([\s\S]*'OWNER'\)/, 'CMS auth must validate OWNER keys');
assertMatches(cmsAuth, /role:\s*'OWNER'/, 'CMS auth must create OWNER sessions');
assertMatches(cmsAuth, /CMS_SESSION_COOKIE_NAME/, 'CMS auth must use CMS session cookie');

const cmsKnowledgeBase = readProjectFile('src/app/api/cms/knowledge-base/route.ts');
assertMatches(cmsKnowledgeBase, /CMS_SESSION_COOKIE_NAME/, 'CMS knowledge-base must use CMS session cookie');
assertMatches(cmsKnowledgeBase, /role === 'OWNER'/, 'CMS knowledge-base must require OWNER sessions');

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

console.log(`Admin security verification passed: ${mutationRoutes.length} mutation routes checked.`);
