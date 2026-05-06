import * as Ably from 'ably';
import type { TokenRequest } from 'ably';

const DEFAULT_ABLY_TOKEN_TTL_MS = 60 * 60 * 1000;

let restClient: Ably.Rest | null = null;

export type CaseRealtimeReason =
  | 'message.created'
  | 'internal_note.created'
  | 'status.changed'
  | 'takeover.changed'
  | 'public_request_number.issued'
  | 'assignment.changed'
  | 'case.updated';

export type CaseRealtimeEvent = {
  caseId: string;
  reason: CaseRealtimeReason;
  emittedAt: string;
};

export function getCaseRealtimeChannelName(caseId: string): string {
  return `private:case:${caseId}`;
}

export function getCrmCasesRealtimeChannelName(): string {
  return 'private:crm:cases';
}

function getAblyApiKey(): string | null {
  return process.env.ABLY_API_KEY?.trim() || null;
}

function getAblyRestClient(): Ably.Rest | null {
  const apiKey = getAblyApiKey();

  if (!apiKey) {
    return null;
  }

  if (!restClient) {
    restClient = new Ably.Rest(apiKey);
  }

  return restClient;
}

export async function createCaseRealtimeTokenRequest(input: {
  caseId: string;
  clientId: string;
}): Promise<TokenRequest> {
  const client = getAblyRestClient();

  if (!client) {
    throw new Error('Missing ABLY_API_KEY.');
  }

  const channelName = getCaseRealtimeChannelName(input.caseId);

  return client.auth.createTokenRequest({
    clientId: input.clientId,
    capability: {
      [channelName]: ['subscribe'],
    },
    ttl: DEFAULT_ABLY_TOKEN_TTL_MS,
  });
}

export async function createCrmCasesRealtimeTokenRequest(input: {
  clientId: string;
}): Promise<TokenRequest> {
  const client = getAblyRestClient();

  if (!client) {
    throw new Error('Missing ABLY_API_KEY.');
  }

  return client.auth.createTokenRequest({
    clientId: input.clientId,
    capability: {
      [getCrmCasesRealtimeChannelName()]: ['subscribe'],
    },
    ttl: DEFAULT_ABLY_TOKEN_TTL_MS,
  });
}

export async function publishCaseRealtimeEvent(input: {
  caseId: string;
  reason: CaseRealtimeReason;
}): Promise<void> {
  const client = getAblyRestClient();

  if (!client) {
    return;
  }

  const event: CaseRealtimeEvent = {
    caseId: input.caseId,
    reason: input.reason,
    emittedAt: new Date().toISOString(),
  };

  await client.channels
    .get(getCaseRealtimeChannelName(input.caseId))
    .publish('case.updated', event);

  await client.channels
    .get(getCrmCasesRealtimeChannelName())
    .publish('case.updated', event);
}
