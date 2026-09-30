import { randomUUID } from 'node:crypto';
import type { Prisma, PrismaClient, AdminRole } from '@prisma/client';
import { hasAdminPermissions } from '../admin-permissions.ts';

export type OperatorReason = 'ai_disabled' | 'human_requested' | 'ai_failed';
export type DeliveryResult = 'SENT' | 'FAILED' | 'UNKNOWN' | 'NOT_CONFIGURED';
type Db = PrismaClient;
type Tx = Prisma.TransactionClient;
type Actor = { adminUserId: string; sessionId: string; role: AdminRole; email: string; displayName: string | null };
export const PRESENCE_TTL_MS = 45_000;
const SEND_LEASE_MS = 30_000;

// The same case lock is used for receipt, read acknowledgements, AI publication and
// operator takeover. Never hold it during a provider/network request.
export async function lockCase(tx: Tx, caseId: string) {
  await tx.$queryRaw`SELECT id FROM cases WHERE id = ${caseId}::uuid FOR UPDATE`;
}

export function canAccessAssignedCase(actor: Pick<Actor, 'role' | 'adminUserId' | 'email' | 'displayName'>, assigned: string | null) {
  return actor.role !== 'MANAGER' || assigned === null ||
    assigned === actor.adminUserId || assigned === actor.email ||
    (actor.displayName !== null && assigned === actor.displayName);
}

export async function registerPortalMessage(tx: Tx, caseId: string) {
  return tx.portalOperatorAlertState.upsert({
    where: { caseId },
    create: { caseId, latestVersion: 1 },
    update: { latestVersion: { increment: 1 } },
    select: { latestVersion: true },
  });
}

export async function updatePresence(db: Db, input: {
  caseId: string; actor: Actor; tabId: string; sequence: number; active: boolean;
}) {
  return db.$transaction(async (tx) => {
    await lockCase(tx, input.caseId);
    const record = await tx.case.findUnique({ where: { id: input.caseId }, select: { assignedOperator: true } });
    if (!record || !canAccessAssignedCase(input.actor, record.assignedOperator)) return false;
    const now = new Date();
    await tx.crmCasePresence.deleteMany({ where: { caseId: input.caseId, expiresAt: { lt: new Date(now.getTime() - 86_400_000) } } });
    const key = { caseId: input.caseId, adminSessionId: input.actor.sessionId, tabId: input.tabId };
    const existing = await tx.crmCasePresence.findUnique({ where: { caseId_adminSessionId_tabId: key } });
    if (existing && existing.sequence >= input.sequence) return true;
    const active = input.active && hasAdminPermissions(input.actor.role, ['CRM_CASE_MESSAGE_WRITE']);
    const data = { sequence: input.sequence, expiresAt: new Date(now.getTime() + (active ? PRESENCE_TTL_MS : 0)) };
    await tx.crmCasePresence.upsert({ where: { caseId_adminSessionId_tabId: key }, create: { ...key, ...data }, update: data });
    return true;
  });
}

export async function markCaseRead(db: Db, input: {
  caseId: string; actor: Actor; lastMessageId: string; lastPortalMessageId?: string | null;
}) {
  return db.$transaction(async (tx) => {
    await lockCase(tx, input.caseId);
    const record = await tx.case.findUnique({ where: { id: input.caseId }, select: { assignedOperator: true } });
    if (!record || !canAccessAssignedCase(input.actor, record.assignedOperator)) return null;
    const message = await tx.message.findFirst({ where: { id: input.lastMessageId, caseId: input.caseId, isCustomerVisible: true } });
    if (!message) return null;
    const portal = input.lastPortalMessageId ? await tx.message.findFirst({ where: {
      id: input.lastPortalMessageId, caseId: input.caseId, authorRole: 'CUSTOMER',
      channel: 'WEBSITE_CHAT', portalAttentionVersion: { not: null },
    } }) : null;
    if (input.lastPortalMessageId && (!portal || portal.createdAt > message.createdAt ||
      (portal.createdAt.getTime() === message.createdAt.getTime() && portal.id > message.id))) return null;
    const key = { caseId: input.caseId, adminUserId: input.actor.adminUserId };
    const existing = await tx.caseReadState.findUnique({ where: { caseId_adminUserId: key } });
    const lastReadAt = existing && existing.lastReadAt > message.createdAt ? existing.lastReadAt : message.createdAt;
    const portalReadVersion = Math.max(existing?.portalReadVersion ?? 0, portal?.portalAttentionVersion ?? 0);
    await tx.caseReadState.upsert({ where: { caseId_adminUserId: key }, create: { ...key, lastReadAt, portalReadVersion }, update: { lastReadAt, portalReadVersion } });
    const state = await tx.portalOperatorAlertState.findUnique({ where: { caseId: input.caseId } });
    if (state && hasAdminPermissions(input.actor.role, ['CRM_CASE_MESSAGE_WRITE']) &&
      portal?.portalAttentionVersion && portal.portalAttentionVersion > state.readVersion) {
      const readVersion = portal.portalAttentionVersion;
      const fullyRead = readVersion >= state.latestVersion;
      await tx.portalOperatorAlertState.update({ where: { caseId: input.caseId }, data: {
        readVersion,
        ...(fullyRead ? { generation: { increment: 1 }, pendingVersion: 0, pendingReason: null,
          sentAt: null, attemptId: null, leaseUntil: null, deliveryState: 'IDLE', lastErrorCode: null } : {}),
      } });
    }
    return lastReadAt;
  });
}

async function hasEligiblePresence(tx: Tx, caseId: string, assigned: string | null, now: Date) {
  const presences = await tx.crmCasePresence.findMany({ where: {
    caseId, expiresAt: { gt: now }, adminSession: {
      revokedAt: null, expiresAt: { gt: now }, adminUser: { status: 'ACTIVE' },
    },
  }, include: { adminSession: { include: { adminUser: true } } } });
  return presences.some(({ adminSession: session }) => {
    const user = session.adminUser;
    return session.role === user.role && hasAdminPermissions(user.role, ['CRM_CASE_MESSAGE_WRITE']) &&
      canAccessAssignedCase({ role: user.role, adminUserId: user.id, email: user.email, displayName: user.displayName }, assigned);
  });
}

export async function requireOperatorForMessage(db: Db, caseId: string, messageId: string, reason: OperatorReason) {
  await db.$transaction(async (tx) => {
    await lockCase(tx, caseId);
    const message = await tx.message.findFirst({ where: { id: messageId, caseId, authorRole: 'CUSTOMER', channel: 'WEBSITE_CHAT' } });
    const state = await tx.portalOperatorAlertState.findUnique({ where: { caseId } });
    const version = message?.portalAttentionVersion;
    if (!state || !version || version <= state.readVersion || version < state.pendingVersion) return;
    await tx.portalOperatorAlertState.update({ where: { caseId }, data: { pendingVersion: version, pendingReason: reason } });
  });
}

export async function dispatchOperatorAlert(db: Db, caseId: string,
  send: (input: { caseId: string; publicRequestNumber: string; reason: OperatorReason }) => Promise<DeliveryResult>
) {
  const claim = await db.$transaction(async (tx) => {
    await lockCase(tx, caseId);
    const state = await tx.portalOperatorAlertState.findUnique({ where: { caseId } });
    const record = await tx.case.findUnique({ where: { id: caseId }, select: { publicRequestNumber: true, assignedOperator: true } });
    const now = new Date();
    if (!state || !record?.publicRequestNumber || !state.pendingReason || state.pendingVersion <= state.readVersion ||
      state.sentAt || (state.leaseUntil && state.leaseUntil > now) ||
      await hasEligiblePresence(tx, caseId, record.assignedOperator, now)) return null;
    const attemptId = randomUUID();
    await tx.portalOperatorAlertState.update({ where: { caseId }, data: {
      attemptId, leaseUntil: new Date(now.getTime() + SEND_LEASE_MS), deliveryState: 'SENDING', lastErrorCode: null,
    } });
    return { attemptId, generation: state.generation, publicRequestNumber: record.publicRequestNumber, reason: state.pendingReason as OperatorReason };
  });
  if (!claim) return;
  // Recheck after claiming, before sending. Read/presence may have changed meanwhile.
  const stillNeeded = await db.$transaction(async (tx) => {
    await lockCase(tx, caseId);
    const state = await tx.portalOperatorAlertState.findUnique({ where: { caseId } });
    const record = await tx.case.findUnique({ where: { id: caseId }, select: { assignedOperator: true } });
    if (!state || !record || state.attemptId !== claim.attemptId || state.generation !== claim.generation) return false;
    if (state.pendingVersion <= state.readVersion || await hasEligiblePresence(tx, caseId, record.assignedOperator, new Date())) {
      await tx.portalOperatorAlertState.update({ where: { caseId }, data: { attemptId: null, leaseUntil: null, deliveryState: 'IDLE' } });
      return false;
    }
    return true;
  });
  if (!stillNeeded) return;
  let result: DeliveryResult;
  try { result = await send({ caseId, publicRequestNumber: claim.publicRequestNumber, reason: claim.reason }); }
  catch { result = 'UNKNOWN'; }
  await db.portalOperatorAlertState.updateMany({ where: { caseId, attemptId: claim.attemptId, generation: claim.generation }, data: {
    deliveryState: result, sentAt: result === 'SENT' ? new Date() : null,
    lastErrorCode: result === 'SENT' ? null : result.toLowerCase(),
  } });
}
