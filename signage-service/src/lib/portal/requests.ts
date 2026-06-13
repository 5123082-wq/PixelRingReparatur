import type { PrismaClient } from '@prisma/client';

import { createWebsiteRequest } from '@/lib/request-intake';
import {
  buildPortalRequestMessage,
  normalizePortalRequestInput,
  type PortalRequestInput,
} from './request-utils';

export {
  buildPortalRequestMessage,
  createPortalMessageForRequest,
  normalizePortalMessageBody,
  normalizePortalPublicRequestNumber,
  normalizePortalRequestDetailsInput,
  normalizePortalRequestInput,
  updatePortalRequestDetailsForUser,
} from './request-utils';
export type {
  NormalizedPortalRequestInput,
  NormalizedPortalRequestDetailsInput,
  PortalMessageResult,
  PortalRequestDetailsInput,
  PortalRequestDetailsUpdateResult,
  PortalRequestInput,
} from './request-utils';

export async function createPortalRequestForUser(
  db: PrismaClient,
  input: {
    portalUserId: string;
    portalSessionId: string;
    email: string;
    requestInput: PortalRequestInput;
    locale?: string | null;
    origin?: string | null;
    userAgent?: string | null;
    ipAddress?: string | null;
  }
) {
  const normalized = normalizePortalRequestInput(input.requestInput);

  return createWebsiteRequest(db, {
    name: input.email,
    contact: input.email,
    serviceLocation: normalized.serviceLocation,
    serviceLatitude: normalized.serviceLatitude,
    serviceLongitude: normalized.serviceLongitude,
    serviceLocationSource: normalized.serviceLocationSource,
    message: buildPortalRequestMessage(normalized, input.locale),
    locale: input.locale,
    origin: input.origin,
    userAgent: input.userAgent,
    ipAddress: input.ipAddress,
    portalUser: {
      portalUserId: input.portalUserId,
      portalSessionId: input.portalSessionId,
    },
  });
}
