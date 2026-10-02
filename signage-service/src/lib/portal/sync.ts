export type ResourceState<T> = { data: T; error: boolean };
type Resource = { value: ResourceState<unknown>; listeners: Set<() => void>; load: () => Promise<unknown>; chat: boolean; last: number; pending?: Promise<void>; again: boolean };
// One registry per mounted, authenticated portal. No cache survives an account change.
export class PortalSync {
  connected = false;
  private generation = 0;
  private resources = new Map<string, Resource>();
  private now: () => number;
  private active = true;
  constructor(now = () => Date.now()) { this.now = now; }
  resource<T>(key: string, seed: T, load: () => Promise<T>, chat = false) {
    let row = this.resources.get(key);
    if (!row) { row = { value: { data: seed, error: false }, listeners: new Set(), load, chat, last: this.now(), again: false }; this.resources.set(key, row); }
    row.load = load;
    return row;
  }
  subscribe(key: string, listener: () => void) { const row = this.resources.get(key)!; row.listeners.add(listener); return () => { row.listeners.delete(listener); }; }
  snapshot<T>(key: string) { return this.resources.get(key)!.value as ResourceState<T>; }
  async refresh(key: string): Promise<void> {
    const row = this.resources.get(key); if (!row || !this.active) return;
    if (row.pending) return row.pending;
    const generation = this.generation;
    row.pending = (async () => {
      try { const data = await row.load(); if (generation === this.generation) row.value = { data, error: false }; }
      catch { if (generation === this.generation) row.value = { ...row.value, error: true }; }
      finally { row.last = this.now(); row.pending = undefined; if (generation === this.generation) row.listeners.forEach(listener => listener()); }
    })();
    return row.pending;
  }
  async refreshActive(force = false) {
    const jobs: Promise<void>[] = [];
    for (const [key, row] of this.resources) {
      const interval = this.connected ? 120_000 : row.chat ? 10_000 : 30_000;
      if (row.listeners.size && (force || this.now() - row.last >= interval)) {
        // An invalidation arriving during a read must be followed by one fresh read.
        if (force && row.pending) { if (!row.again) { row.again = true; jobs.push(row.pending.then(() => { row.again = false; return this.refresh(key); })); } }
        else jobs.push(this.refresh(key));
      }
    }
    await Promise.all(jobs);
  }
  clear() {
    this.active = false;
    this.generation++;
    this.resources.forEach(row => { row.value = { data: null, error: true }; row.listeners.forEach(listener => listener()); });
    this.connected = false;
  }
}
