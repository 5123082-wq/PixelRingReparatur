// One owner per mounted account. SDK retries handle temporary disconnections;
// terminal failures discard the client and use a bounded retry of token signing.
export class PortalRealtimeLifecycle<T extends { close(): void }> {
  client: T | undefined;
  private stopped = false;
  private pending = false;
  private nextAttempt = 0;
  private failures = 0;
  private transport = false;
  private attached = false;
  private ready: (value: boolean) => void;
  private now: () => number;
  constructor(ready: (value: boolean) => void, now = () => Date.now()) { this.ready = ready; this.now = now; }
  begin() {
    if (this.stopped || this.pending || this.client || this.now() < this.nextAttempt) return false;
    this.pending = true; return true;
  }
  install(client: T) {
    if (this.stopped) { client.close(); return false; }
    this.client = client; this.transport = false; this.attached = false; return true;
  }
  current(client: T) { return !this.stopped && this.client === client; }
  private retry() { this.nextAttempt = this.now() + Math.min(120_000, 10_000 * 2 ** Math.min(this.failures++, 4)); }
  finish() { this.pending = false; if (!this.stopped && !this.client && this.nextAttempt <= this.now()) this.retry(); }
  transportState(client: T, connected: boolean) { if (this.current(client)) { this.transport = connected; this.update(); } }
  channelState(client: T, attached: boolean) { if (this.current(client)) { this.attached = attached; this.update(); } }
  private update() {
    const usable = this.transport && this.attached;
    if (usable) this.failures = 0;
    this.ready(usable);
  }
  retire(client: T) {
    if (!this.current(client)) return;
    this.client = undefined; this.transport = false; this.attached = false;
    this.ready(false); this.retry(); client.close();
  }
  stop() {
    this.stopped = true; const client = this.client; this.client = undefined;
    this.ready(false); client?.close();
  }
}
