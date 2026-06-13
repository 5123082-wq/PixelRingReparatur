import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  isAcceptingIntakeDecision,
  normalizeIntakeTurnDecision,
} from '../src/lib/ai/intake-intent-core.ts';

test('chat intake intent accepts normalized classifier consent', () => {
  const decision = normalizeIntakeTurnDecision({
    intent: 'accept_intake',
    confidence: 0.87,
  });

  assert.equal(decision.intent, 'accept_intake');
  assert.equal(decision.confidence, 0.87);
  assert.equal(isAcceptingIntakeDecision(decision), true);
});

test('chat intake intent rejects low-confidence consent', () => {
  const decision = normalizeIntakeTurnDecision({
    intent: 'accept_intake',
    confidence: 0.42,
  });

  assert.equal(isAcceptingIntakeDecision(decision), false);
});

test('chat intake intent normalizes invalid classifier output to unclear', () => {
  const decision = normalizeIntakeTurnDecision({
    intent: 'open_the_thing',
    confidence: 1.4,
  });

  assert.equal(decision.intent, 'unclear');
  assert.equal(decision.confidence, 1);
  assert.equal(isAcceptingIntakeDecision(decision), false);
});
