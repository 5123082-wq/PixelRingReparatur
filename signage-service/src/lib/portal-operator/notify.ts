import 'server-only';
import { prisma } from '@/lib/prisma';
import { sendPortalOperatorNotification } from '@/lib/admin-telegram-notifications';
import { dispatchOperatorAlert } from './state';

export async function notifyPortalOperator(caseId: string) {
  try {
    await dispatchOperatorAlert(prisma, caseId, sendPortalOperatorNotification);
  } catch {
    // Do not expose provider errors, tokens or customer content in logs.
    console.error('Portal operator notification processing failed', { caseId });
  }
}
