export type AttentionKind = 'DOCUMENT' | 'REPORT' | 'REQUEST' | 'MESSAGE' | 'STATUS';
export type AttentionMode = 'ACKNOWLEDGE' | 'REPLY' | 'UPLOAD' | 'NONE';
export type AttentionState = 'OPEN' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';
export type AttentionItem = {
  id: string; publicRequestNumber: string; kind: AttentionKind; sourceId: string;
  title: string; body: string; documentType: string | null; mode: AttentionMode; state: AttentionState;
  readAt: string | null; dueAt: string | null; completedAt: string | null; submittedAt: string | null;
  createdAt: string; href: string;
};
export type AttentionEvidence =
  | { id: string; kind: 'REPLY'; body: string; createdAt: string }
  | { id: string; kind: 'UPLOAD'; filename: string | null; mimeType: string; href: string; createdAt: string };
export const ATTENTION_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
export type AdminAttentionItem = AttentionItem & {
  evidence: AttentionEvidence | null;
  recipient: { id: string; displayName: string | null; email: string };
  email: { state: string; attempts: number; lastError: string | null; sentAt: string | null } | null;
};
export const ATTENTION_MODES: AttentionMode[] = ['ACKNOWLEDGE', 'REPLY', 'UPLOAD', 'NONE'];
export const ATTENTION_LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];
