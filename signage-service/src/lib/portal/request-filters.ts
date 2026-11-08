import type { CaseStatus } from '@prisma/client';

export const REQUEST_FILTERS = ['active', 'completed', 'cancelled', 'all'] as const;
export type RequestFilter = typeof REQUEST_FILTERS[number];
export function isRequestFilter(value: unknown): value is RequestFilter {
  return REQUEST_FILTERS.some(filter => filter === value);
}
export function isTerminalRequest(status: string) {
  return status === 'COMPLETED' || status === 'CANCELLED';
}
export function requestFilterWhere(filter: RequestFilter) {
  if (filter === 'active') return { status: { notIn: ['COMPLETED', 'CANCELLED'] as CaseStatus[] } };
  if (filter === 'completed') return { status: 'COMPLETED' as CaseStatus };
  if (filter === 'cancelled') return { status: 'CANCELLED' as CaseStatus };
  return {};
}
