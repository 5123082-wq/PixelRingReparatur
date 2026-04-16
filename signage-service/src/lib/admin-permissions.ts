import type { AdminRole } from '@prisma/client';

export const ALL_ADMIN_ROLES: AdminRole[] = ['OWNER', 'MANAGER'];

export type AdminPermission =
  | 'CMS_AI_CONFIG_READ'
  | 'CMS_AI_CONFIG_WRITE'
  | 'CMS_SEO_READ'
  | 'CMS_SEO_WRITE'
  | 'CMS_ARTICLE_READ'
  | 'CMS_ARTICLE_WRITE'
  | 'CMS_ARTICLE_REVISIONS_READ'
  | 'CMS_ARTICLE_RESTORE'
  | 'CMS_ARTICLE_PUBLISH'
  | 'CMS_ARTICLE_DELETE'
  | 'CMS_PAGE_READ'
  | 'CMS_PAGE_WRITE'
  | 'CMS_PAGE_REVISIONS_READ'
  | 'CMS_PAGE_RESTORE'
  | 'CMS_PAGE_PUBLISH'
  | 'CMS_PAGE_DELETE'
  | 'CMS_MEDIA_READ'
  | 'CMS_MEDIA_WRITE'
  | 'CMS_KNOWLEDGE_BASE_READ'
  | 'CRM_CASE_READ'
  | 'CRM_CASE_CREATE'
  | 'CRM_CASE_UPDATE'
  | 'CRM_CASE_MESSAGE_WRITE'
  | 'CRM_CASE_TAKEOVER_WRITE'
  | 'CRM_ATTACHMENT_READ';

const ADMIN_ROLE_PERMISSION_MAP: Record<AdminRole, readonly AdminPermission[]> = {
  OWNER: [
    'CMS_AI_CONFIG_READ',
    'CMS_AI_CONFIG_WRITE',
    'CMS_SEO_READ',
    'CMS_SEO_WRITE',
    'CMS_ARTICLE_READ',
    'CMS_ARTICLE_WRITE',
    'CMS_ARTICLE_REVISIONS_READ',
    'CMS_ARTICLE_RESTORE',
    'CMS_ARTICLE_PUBLISH',
    'CMS_ARTICLE_DELETE',
    'CMS_PAGE_READ',
    'CMS_PAGE_WRITE',
    'CMS_PAGE_REVISIONS_READ',
    'CMS_PAGE_RESTORE',
    'CMS_PAGE_PUBLISH',
    'CMS_PAGE_DELETE',
    'CMS_MEDIA_READ',
    'CMS_MEDIA_WRITE',
    'CMS_KNOWLEDGE_BASE_READ',
    'CRM_CASE_READ',
    'CRM_ATTACHMENT_READ',
  ],
  MANAGER: [
    'CRM_CASE_READ',
    'CRM_CASE_CREATE',
    'CRM_CASE_UPDATE',
    'CRM_CASE_MESSAGE_WRITE',
    'CRM_CASE_TAKEOVER_WRITE',
    'CRM_ATTACHMENT_READ',
  ],
};

export function hasAdminPermissions(
  role: AdminRole,
  requiredPermissions: readonly AdminPermission[]
): boolean {
  const granted = ADMIN_ROLE_PERMISSION_MAP[role];

  return requiredPermissions.every((permission) => granted.includes(permission));
}
