import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canTransitionArticleStatus,
  parseArticleTransitionReason,
  requiresArticleTransitionReason,
} from '../src/lib/cms/article-workflow.ts';

test('article workflow: allows declared transitions and blocks invalid jumps', () => {
  assert.equal(canTransitionArticleStatus('DRAFT', 'IN_REVIEW'), true);
  assert.equal(canTransitionArticleStatus('IN_REVIEW', 'APPROVED'), true);
  assert.equal(canTransitionArticleStatus('APPROVED', 'SCHEDULED'), true);
  assert.equal(canTransitionArticleStatus('SCHEDULED', 'PUBLISHED'), true);
  assert.equal(canTransitionArticleStatus('PUBLISHED', 'ARCHIVED'), true);

  assert.equal(canTransitionArticleStatus('DRAFT', 'SCHEDULED'), false);
  assert.equal(canTransitionArticleStatus('IN_REVIEW', 'PUBLISHED'), false);
  assert.equal(canTransitionArticleStatus('PUBLISHED', 'APPROVED'), false);
});

test('article workflow: checks transitions that require a reason', () => {
  assert.equal(requiresArticleTransitionReason('PUBLISHED', 'DRAFT'), true);
  assert.equal(requiresArticleTransitionReason('APPROVED', 'DRAFT'), true);
  assert.equal(requiresArticleTransitionReason('DRAFT', 'ARCHIVED'), true);

  assert.equal(requiresArticleTransitionReason('DRAFT', 'IN_REVIEW'), false);
  assert.equal(requiresArticleTransitionReason('APPROVED', 'SCHEDULED'), false);
});

test('article workflow: validates transition reason input', () => {
  assert.deepEqual(parseArticleTransitionReason(undefined), { valid: true, value: null });
  assert.deepEqual(parseArticleTransitionReason('   '), { valid: true, value: null });
  assert.deepEqual(parseArticleTransitionReason('Needs legal review'), {
    valid: true,
    value: 'Needs legal review',
  });

  assert.deepEqual(parseArticleTransitionReason(42), { valid: false, value: null });
  assert.deepEqual(parseArticleTransitionReason('x'.repeat(501)), { valid: false, value: null });
});
