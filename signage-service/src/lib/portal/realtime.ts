import 'server-only';
import { portalChannel, portalTokenOptions } from './realtime-policy';
import * as Ably from 'ably';
import { prisma } from '@/lib/prisma';
let client: Ably.Rest | undefined;
function rest() { const key = process.env.ABLY_API_KEY?.trim(); return key ? (client ??= new Ably.Rest(key)) : null; }
export async function portalToken(portalUserId: string, sessionId: string) {
  const api = rest(); if (!api) return null;
  const channel = portalChannel(portalUserId);
  const tokenRequest = await api.auth.createTokenRequest(portalTokenOptions(portalUserId, sessionId));
  return { tokenRequest, channel, portalUserId };
}
export async function publishPortalInvalidation(caseId: string) {
  const api = rest(); if (!api) return;
  const grants = await prisma.portalCaseAccess.findMany({ where: { caseId, revokedAt: null, portalUser: { status: 'ACTIVE' } }, select: { portalUserId: true } });
  await Promise.all(grants.map(grant => api.channels.get(portalChannel(grant.portalUserId)).publish('invalidate', {})));
}

export async function publishPortalUserInvalidation(portalUserId: string) {
  await rest()?.channels.get(portalChannel(portalUserId)).publish('invalidate', {});
}
