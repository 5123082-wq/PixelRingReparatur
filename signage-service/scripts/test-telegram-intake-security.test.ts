import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { isTelegramContactAllowed } from '../src/lib/telegram-contact-lock.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('telegram contact lock allows the same locked email only', () => {
  const lockedState = {
    customerEmail: 'OWNER@example.com',
    primaryContactMethod: 'EMAIL',
    primaryContactValue: 'owner@example.com',
  };

  assert.equal(
    isTelegramContactAllowed(lockedState, {
      customerEmail: 'owner@example.com',
      customerPhone: null,
    }),
    true
  );
  assert.equal(
    isTelegramContactAllowed(lockedState, {
      customerEmail: 'other@example.com',
      customerPhone: null,
    }),
    false
  );
  assert.equal(
    isTelegramContactAllowed(lockedState, {
      customerEmail: null,
      customerPhone: '+49123456789',
    }),
    false
  );
});

test('telegram contact lock allows the same locked phone only', () => {
  const lockedState = {
    customerPhone: '+49 123 456789',
    primaryContactMethod: 'PHONE',
    primaryContactValue: '+49123456789',
  };

  assert.equal(
    isTelegramContactAllowed(lockedState, {
      customerEmail: null,
      customerPhone: '+49123456789',
    }),
    true
  );
  assert.equal(
    isTelegramContactAllowed(lockedState, {
      customerEmail: null,
      customerPhone: '+49999999999',
    }),
    false
  );
  assert.equal(
    isTelegramContactAllowed(lockedState, {
      customerEmail: 'owner@example.com',
      customerPhone: null,
    }),
    false
  );
});

test('telegram contact lock allows first contact when no contact is locked yet', () => {
  assert.equal(
    isTelegramContactAllowed({}, {
      customerEmail: 'new@example.com',
      customerPhone: null,
    }),
    true
  );
});

test('telegram intake does not sync unverified form contacts into customer profiles', () => {
  const source = readFileSync(
    resolve(__dirname, '../src/lib/telegram-intake.ts'),
    'utf8'
  );

  assert.equal(source.includes('syncCaseCustomerProfile'), false);
});

test('known telegram contacts are routed to request confirmation before fallback form', () => {
  const source = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/webhook/route.ts'),
    'utf8'
  );

  assert.ok(source.includes('CONFIRM_NEW_REQUEST_CALLBACK'));
  assert.ok(source.includes('result.hasStoredTelegramContact &&'));
  assert.ok(source.includes('!result.hasStoredTelegramContact &&'));
  assert.ok(source.includes("assistantReply.actions.some((action) => action.type === 'show_intake')"));
  assert.ok(source.includes('callback_data: CONFIRM_NEW_REQUEST_CALLBACK'));
  assert.ok(source.includes('createTelegramIntakeLink(prisma'));
  assert.ok(source.includes('KNOWN_REQUEST_CALLBACK_DEDUP_MS'));
  assert.ok(source.includes('isRecentConfirmedRequest'));
  assert.equal(source.includes('function shouldConfirmKnownTelegramRequest'), false);
  assert.equal(source.includes('/заявк/i'), false);
});

test('telegram assistant receives known-contact state without direct contact values', () => {
  const source = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/webhook/route.ts'),
    'utf8'
  );
  const assistantCallIndex = source.indexOf('runAssistantTurn(prisma, {');
  const knownContactFlagIndex = source.indexOf('messengerKnownContact: result.hasStoredTelegramContact');
  const customerEmailAfterAssistantIndex = source.indexOf('customerEmail', assistantCallIndex);
  const customerPhoneAfterAssistantIndex = source.indexOf('customerPhone', assistantCallIndex);

  assert.notEqual(assistantCallIndex, -1);
  assert.notEqual(knownContactFlagIndex, -1);
  assert.ok(assistantCallIndex < knownContactFlagIndex);
  assert.equal(customerEmailAfterAssistantIndex, -1);
  assert.equal(customerPhoneAfterAssistantIndex, -1);
});
