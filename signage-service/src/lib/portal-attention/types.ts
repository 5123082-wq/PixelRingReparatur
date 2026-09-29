export type AttentionKind = 'DOCUMENT' | 'REPORT' | 'REQUEST' | 'MESSAGE' | 'STATUS';
export type AttentionMode = 'ACKNOWLEDGE' | 'REPLY' | 'UPLOAD' | 'NONE';
export type AttentionState = 'OPEN' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';
export type AttentionItem = {
  id: string; publicRequestNumber: string; kind: AttentionKind; sourceId: string;
  title: string; body: string; documentType: string | null; mode: AttentionMode; state: AttentionState;
  readAt: string | null; dueAt: string | null; completedAt: string | null; submittedAt: string | null;
  createdAt: string; href: string;
};
export type AdminAttentionItem = AttentionItem & {
  recipient: { id: string; displayName: string | null; email: string };
  email: { state: string; attempts: number; lastError: string | null; sentAt: string | null } | null;
};
export const ATTENTION_MODES: AttentionMode[] = ['ACKNOWLEDGE', 'REPLY', 'UPLOAD', 'NONE'];
export const ATTENTION_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
