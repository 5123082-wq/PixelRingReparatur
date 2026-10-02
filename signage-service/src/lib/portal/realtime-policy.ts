import { createHash } from 'node:crypto';
export function portalChannel(portalUserId: string) { return 'private:portal:' + createHash('sha256').update(portalUserId).digest('hex'); }
export function portalTokenOptions(portalUserId: string, sessionId: string) {
  return { clientId: 'portal:' + createHash('sha256').update(sessionId).digest('hex'), ttl: 5 * 60_000, capability: { [portalChannel(portalUserId)]: ['subscribe'] as ['subscribe'] } };
}
