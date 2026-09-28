import type { CaseStatus } from '@prisma/client';

export type CaseStatusSnapshot = {
  status: CaseStatus;
  statusUpdatedAt: string | null;
  lastEventId: string | null;
};
export type CaseTransitionInput = {
  targetStatus: CaseStatus;
  expected: CaseStatusSnapshot;
  stepId: string;
  confirmation?: { kind: 'reason'; reason: string } | { kind: 'work_result'; version: number };
};
export type CaseTransitionResult = {
  outcome: 'advanced' | 'requires_input' | 'done';
  state: CaseStatusSnapshot;
  targetStatus: CaseStatus;
  requirement?: { kind: 'reason' | 'work_result'; stage: CaseStatus; missingFields: string[] };
};
