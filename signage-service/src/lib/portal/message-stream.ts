export type SavedMessage = { id: string; authorRole: 'CUSTOMER' | 'OPERATOR' | 'SYSTEM'; body: string; createdAt: string; attachments?: { id: string; storageKey: string; originalFilename: string | null; mimeType?: string | null }[] };
export type MessageResult = { success: true; message: SavedMessage; assistantMessage: SavedMessage | null; assistantPending?: boolean; assistantFailed?: boolean };
export type MessageEvent = { type: 'saved'; result: MessageResult } | { type: 'complete'; result: MessageResult };
// Streaming is optional. Legacy JSON callers retain the existing contract.
export function savedMessageStream(saved: MessageResult, complete: () => Promise<MessageResult>) {
  let disconnected = false;
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: MessageEvent) => { if (!disconnected) { try { controller.enqueue(encoder.encode(JSON.stringify(event) + '\n')); } catch { disconnected = true; } } };
      send({ type: 'saved', result: saved });
      try { send({ type: 'complete', result: await complete() }); }
      catch { send({ type: 'complete', result: { ...saved, assistantPending: false, assistantFailed: true } }); }
      finally { if (!disconnected) { try { controller.close(); } catch { /* The client already closed the stream. */ } } }
    },
    cancel() { disconnected = true; },
  });
}
export async function readMessageEvents(response: Response, accept: (event: MessageEvent) => void | Promise<void>) {
  if (!response.body) throw new Error('missing_stream');
  const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = '', completed = false;
  try {
    while (true) {
      const part = await reader.read(); buffer += decoder.decode(part.value, { stream: !part.done });
      let end: number;
      while ((end = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, end); buffer = buffer.slice(end + 1); if (!line.trim()) continue;
        const event = JSON.parse(line) as MessageEvent;
        if (!['saved', 'complete'].includes(event.type) || !event.result?.success || !event.result.message?.id) throw new Error('invalid_stream');
        await accept(event); completed ||= event.type === 'complete';
      }
      if (part.done) break;
    }
    if (!completed) throw new Error('incomplete_stream');
  } finally { reader.releaseLock(); }
}
export function mergeChatMessages<T extends { id: string; createdAt: string }>(current: T[], incoming: T[]): T[] {
  const rows = new Map(current.map(row => [row.id, row])); incoming.forEach(row => rows.set(row.id, row));
  return [...rows.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

// A foreground resync may skip more than one page while a tab was hidden.
// Keep a cursor into the gap even if older messages are already present locally.
export function historyCursorAfterUpdate(previousWindow: string[], incomingWindow: string[], current: string | null, before: string | null) {
  const previous = new Set(previousWindow);
  return previousWindow.length && incomingWindow.length && !incomingWindow.some(id => previous.has(id)) ? before : current;
}
