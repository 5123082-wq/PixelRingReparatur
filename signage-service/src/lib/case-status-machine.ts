import { CaseStatus } from '@prisma/client';

export const CASE_STATUS_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  [CaseStatus.DRAFT]: [CaseStatus.FORMALIZED, CaseStatus.NUMBER_ISSUED, CaseStatus.CANCELLED],
  [CaseStatus.FORMALIZED]: [CaseStatus.NUMBER_ISSUED, CaseStatus.UNDER_REVIEW, CaseStatus.CANCELLED],
  [CaseStatus.NUMBER_ISSUED]: [
    CaseStatus.UNDER_REVIEW,
    CaseStatus.WAITING_FOR_CUSTOMER,
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
    CaseStatus.WORK_COMPLETED,
    CaseStatus.CANCELLED,
  ],
  [CaseStatus.ON_HOLD]: [
    CaseStatus.UNDER_REVIEW,
    CaseStatus.IN_PROGRESS,
    CaseStatus.WAITING_FOR_CUSTOMER,
    CaseStatus.CANCELLED,
  ],
  [CaseStatus.WORK_COMPLETED]: [CaseStatus.READY_FOR_PICKUP, CaseStatus.COMPLETED, CaseStatus.WAITING_FOR_CUSTOMER, CaseStatus.CANCELLED],
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

const MAIN_STAGES: CaseStatus[] = [
  CaseStatus.NUMBER_ISSUED, CaseStatus.UNDER_REVIEW, CaseStatus.IN_PROGRESS,
  CaseStatus.WORK_COMPLETED, CaseStatus.COMPLETED,
];
const SIDE_STAGES: CaseStatus[] = [CaseStatus.WAITING_FOR_CUSTOMER, CaseStatus.ON_HOLD, CaseStatus.CANCELLED];

/** Choose one real step; optional pickup and pause branches are never inferred. */
export function nextCaseStatus(from: CaseStatus, target: CaseStatus): CaseStatus | null {
  if (from === target) return from;
  if (SIDE_STAGES.includes(target)) return canTransitionCaseStatus(from, target) ? target : null;
  if (from === CaseStatus.WAITING_FOR_CUSTOMER || from === CaseStatus.ON_HOLD) {
    if (target === CaseStatus.UNDER_REVIEW) return target;
    if (MAIN_STAGES.indexOf(target) >= 2 || target === CaseStatus.READY_FOR_PICKUP) return CaseStatus.IN_PROGRESS;
    return null;
  }
  if (from === CaseStatus.READY_FOR_PICKUP) return target === CaseStatus.COMPLETED ? target : null;
  const start = MAIN_STAGES.indexOf(from);
  const end = MAIN_STAGES.indexOf(target === CaseStatus.READY_FOR_PICKUP ? CaseStatus.WORK_COMPLETED : target);
  if (target === CaseStatus.READY_FOR_PICKUP && from === CaseStatus.WORK_COMPLETED) return target;
  if (start >= 0 && end > start) return MAIN_STAGES[start + 1];
  // Registration keeps its existing explicit actions; it is not a forward chain.
  if (from === CaseStatus.DRAFT || from === CaseStatus.FORMALIZED) {
    return canTransitionCaseStatus(from, target) ? target : null;
  }
  return null;
}

export function caseStatusTargets(from: CaseStatus): CaseStatus[] {
  return Object.values(CaseStatus).filter((target) => target !== from && nextCaseStatus(from, target) !== null);
}
