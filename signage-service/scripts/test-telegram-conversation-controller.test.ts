import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyTelegramTurn,
  isCustomerVisibleActiveRequest,
  resolveTelegramConversationState,
} from '../src/lib/telegram-conversation-controller.ts';

test('telegram controller resolves active request state from public PR and non-terminal status', () => {
  assert.equal(
    isCustomerVisibleActiveRequest({
      publicRequestNumber: 'PR-XZWN-6KNS',
      status: 'NUMBER_ISSUED',
    }),
    true
  );
  assert.equal(
    resolveTelegramConversationState({
      hasConversation: true,
      publicRequestNumber: 'PR-XZWN-6KNS',
      status: 'NUMBER_ISSUED',
      hasStoredContact: true,
    }),
    'request_active'
  );
});

test('telegram controller keeps terminal public requests out of active request mode', () => {
  assert.equal(
    isCustomerVisibleActiveRequest({
      publicRequestNumber: 'PR-XZWN-6KNS',
      status: 'COMPLETED',
    }),
    false
  );
  assert.equal(
    resolveTelegramConversationState({
      hasConversation: true,
      publicRequestNumber: 'PR-XZWN-6KNS',
      status: 'CANCELLED',
      hasStoredContact: true,
    }),
    'completed_or_cancelled'
  );
});

test('telegram controller detects a live form link before asking AI again', () => {
  assert.equal(
    resolveTelegramConversationState({
      hasConversation: true,
      status: 'DRAFT',
      hasStoredContact: false,
      latestIntakeLink: {
        submittedAt: null,
        revokedAt: null,
        expiresAt: new Date('2026-06-17T10:00:00.000Z'),
      },
      now: new Date('2026-06-17T09:00:00.000Z'),
    }),
    'form_link_sent'
  );
});

test('telegram controller classifies active request status phrases without relying on AI', () => {
  for (const text of [
    'Как дела с моей заявкой?',
    'У меня нет заявки?',
    'Есть информация?',
    'Что с моей заявкой?',
    'What is happening with my request?',
  ]) {
    assert.equal(
      classifyTelegramTurn({
        state: 'request_active',
        text,
      }),
      'active_request_status',
      text
    );
  }
});

test('telegram controller classifies short active request follow-ups as continuation', () => {
  for (const text of ['Ok', 'Ок', 'Что дальше?', 'Понятно', 'what next?']) {
    assert.equal(
      classifyTelegramTurn({
        state: 'request_active',
        text,
      }),
      'active_request_continue',
      text
    );
  }
});

test('telegram controller allows a clearly separate new request from active request mode', () => {
  for (const text of [
    'Хочу новую заявку по другой вывеске',
    'Это другая проблема с другой вывеской',
    'Create a new request for another sign',
  ]) {
    assert.equal(
      classifyTelegramTurn({
        state: 'request_active',
        text,
      }),
      'separate_new_request',
      text
    );
  }
});

test('telegram controller keeps ordinary details in active request mode available for AI', () => {
  assert.equal(
    classifyTelegramTurn({
      state: 'request_active',
      text: 'Вывеска находится над входом, блок питания внутри короба.',
    }),
    'let_ai_answer'
  );
});

test('telegram controller handles request command and form reminder outside active request mode', () => {
  assert.equal(
    classifyTelegramTurn({
      state: 'new_chat',
      text: '/request',
    }),
    'request_intake_form'
  );
  assert.equal(
    classifyTelegramTurn({
      state: 'form_link_sent',
      text: 'Давай',
    }),
    'intake_form_reminder'
  );
});
