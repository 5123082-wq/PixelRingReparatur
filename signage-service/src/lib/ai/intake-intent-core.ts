export const INTAKE_TURN_INTENTS = [
  'accept_intake',
  'reject_intake',
  'ask_question',
  'status_or_existing_request',
  'unclear',
] as const;

export type IntakeTurnIntent = (typeof INTAKE_TURN_INTENTS)[number];

export type IntakeTurnDecision = {
  intent: IntakeTurnIntent;
  confidence: number;
  provider: 'openai' | 'fallback';
};

const DEFAULT_INTAKE_TURN_DECISION: IntakeTurnDecision = {
  intent: 'unclear',
  confidence: 0,
  provider: 'fallback',
};

export function normalizeIntakeTurnDecision(value: unknown): IntakeTurnDecision {
  if (!value || typeof value !== 'object') {
    return DEFAULT_INTAKE_TURN_DECISION;
  }

  const raw = value as {
    intent?: unknown;
    confidence?: unknown;
  };
  const intent = INTAKE_TURN_INTENTS.includes(raw.intent as IntakeTurnIntent)
    ? raw.intent as IntakeTurnIntent
    : DEFAULT_INTAKE_TURN_DECISION.intent;
  const confidence = typeof raw.confidence === 'number' && Number.isFinite(raw.confidence)
    ? Math.min(1, Math.max(0, raw.confidence))
    : DEFAULT_INTAKE_TURN_DECISION.confidence;

  return {
    intent,
    confidence,
    provider: 'openai',
  };
}

export function isAcceptingIntakeDecision(
  decision: IntakeTurnDecision | null | undefined,
  minimumConfidence = 0.6
): boolean {
  return Boolean(
    decision &&
      decision.intent === 'accept_intake' &&
      decision.confidence >= minimumConfidence
  );
}
