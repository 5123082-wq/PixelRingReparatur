import type { CmsArticleStatus } from '@prisma/client';

export const CMS_ARTICLE_WORKFLOW_STATUSES = [
  'DRAFT',
  'IN_REVIEW',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
] as const satisfies readonly CmsArticleStatus[];

export const CMS_ARTICLE_ALLOWED_TRANSITIONS: Record<CmsArticleStatus, CmsArticleStatus[]> = {
  DRAFT: ['IN_REVIEW', 'PUBLISHED', 'ARCHIVED'],
  IN_REVIEW: ['DRAFT', 'APPROVED', 'ARCHIVED'],
  APPROVED: ['IN_REVIEW', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'],
  SCHEDULED: ['APPROVED', 'DRAFT', 'PUBLISHED', 'ARCHIVED'],
  PUBLISHED: ['DRAFT', 'ARCHIVED'],
  ARCHIVED: ['DRAFT', 'IN_REVIEW'],
};

const MAX_TRANSITION_REASON_LENGTH = 500;

export function canTransitionArticleStatus(
  fromStatus: CmsArticleStatus,
  toStatus: CmsArticleStatus
): boolean {
  if (fromStatus === toStatus) {
    return true;
  }

  return CMS_ARTICLE_ALLOWED_TRANSITIONS[fromStatus].includes(toStatus);
}

export function requiresArticleTransitionReason(
  fromStatus: CmsArticleStatus,
  toStatus: CmsArticleStatus
): boolean {
  if (fromStatus === toStatus) {
    return false;
  }

  if (toStatus === 'ARCHIVED') {
    return true;
  }

  return toStatus === 'DRAFT' && fromStatus !== 'DRAFT';
}

export function parseArticleTransitionReason(value: unknown): {
  valid: boolean;
  value: string | null;
} {
  if (value === undefined || value === null) {
    return { valid: true, value: null };
  }

  if (typeof value !== 'string') {
    return { valid: false, value: null };
  }

  const reason = value.trim();
  if (!reason) {
    return { valid: true, value: null };
  }

  if (reason.length > MAX_TRANSITION_REASON_LENGTH) {
    return { valid: false, value: null };
  }

  return { valid: true, value: reason };
}
