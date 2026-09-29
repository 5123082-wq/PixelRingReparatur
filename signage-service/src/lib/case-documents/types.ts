export const DOCUMENT_TYPES = ['INVOICE', 'CONTRACT', 'ACT', 'OTHER'] as const;
export type DocumentType = typeof DOCUMENT_TYPES[number];
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
export const DOCUMENT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type CustomerDocument = {
  id: string; type: DocumentType; title: string; comment: string;
  filename: string; byteSize: number; createdAt: string; publishedAt: string | null;
};
export class DocumentError extends Error {
  code: string;
  status: number;
  constructor(code: string, status = 400) { super(code); this.code = code; this.status = status; }
}
export function documentMetadata(input: unknown) {
  if (!input || typeof input !== 'object') throw new DocumentError('invalid_input');
  const value = input as Record<string, unknown>;
  if (!DOCUMENT_TYPES.includes(value.type as DocumentType) || typeof value.title !== 'string' ||
      !value.title.trim() || value.title.trim().length > 160 || typeof value.comment !== 'string' || value.comment.length > 2000) {
    throw new DocumentError('invalid_input');
  }
  return { type: value.type as DocumentType, title: value.title.trim(), comment: value.comment.trim() };
}
export function validatePdf(buffer: Uint8Array) {
  if (!buffer.length || buffer.length > MAX_DOCUMENT_BYTES) throw new DocumentError('file_size');
  const start = new TextDecoder('latin1').decode(buffer.subarray(0, 8));
  const end = new TextDecoder('latin1').decode(buffer.subarray(Math.max(0, buffer.length - 1024)));
  if (!/^%PDF-(1\.[0-7]|2\.0)/.test(start) || !/%%EOF\s*$/.test(end)) throw new DocumentError('file_type');
}
