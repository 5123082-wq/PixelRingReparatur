import { CaseStatus } from '@prisma/client';

export const CASE_STATUS_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  [CaseStatus.DRAFT]: [CaseStatus.FORMALIZED, CaseStatus.NUMBER_ISSUED, CaseStatus.CANCELLED],
  [CaseStatus.FORMALIZED]: [CaseStatus.NUMBER_ISSUED, CaseStatus.UNDER_REVIEW, CaseStatus.CANCELLED],
  [CaseStatus.NUMBER_ISSUED]: [
    CaseStatus.UNDER_REVIEW,
    CaseStatus.WAITING_FOR_CUSTOMER,
    CaseStatus.IN_PROGRESS,
    CaseStatus.CANCELLED,
  ],
  [CaseStatus.UNDER_REVIEW]: [
    CaseStatus.WAITING_FOR_CUSTOMER,
    CaseStatus.IN_PROGRESS,
    CaseStatus.ON_HOLD,
    CaseStatus.CANCELLED,
  ],
  [CaseStatus.WAITING_FOR_CUSTOMER]: [
    CaseStatus.UNDER_REVIEW,
    CaseStatus.IN_PROGRESS,
    CaseStatus.ON_HOLD,
    CaseStatus.CANCELLED,
  ],
  [CaseStatus.IN_PROGRESS]: [
    CaseStatus.ON_HOLD,
    CaseStatus.WAITING_FOR_CUSTOMER,
    CaseStatus.READY_FOR_PICKUP,
    CaseStatus.CANCELLED,
  ],
  [CaseStatus.ON_HOLD]: [
    CaseStatus.UNDER_REVIEW,
    CaseStatus.IN_PROGRESS,
    CaseStatus.WAITING_FOR_CUSTOMER,
    CaseStatus.CANCELLED,
  ],
  [CaseStatus.READY_FOR_PICKUP]: [CaseStatus.WAITING_FOR_CUSTOMER, CaseStatus.COMPLETED, CaseStatus.CANCELLED],
  [CaseStatus.COMPLETED]: [],
  [CaseStatus.CANCELLED]: [],
};

const REASON_REQUIRED_TARGETS = new Set<CaseStatus>([
  CaseStatus.ON_HOLD,
  CaseStatus.CANCELLED,
]);

const MAX_REASON_LENGTH = 500;

export function normalizeTransitionReason(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const reason = value.trim();

  if (!reason || reason.length > MAX_REASON_LENGTH) {
    return null;
  }

  return reason;
}

export function canTransitionCaseStatus(fromStatus: CaseStatus, toStatus: CaseStatus): boolean {
  if (fromStatus === toStatus) {
    return true;
  }

  return CASE_STATUS_TRANSITIONS[fromStatus].includes(toStatus);
}

export function requiresTransitionReason(toStatus: CaseStatus): boolean {
  return REASON_REQUIRED_TARGETS.has(toStatus);
}
