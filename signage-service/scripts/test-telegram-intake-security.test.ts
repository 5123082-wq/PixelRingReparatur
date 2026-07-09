import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { parseOptionalContactDetails } from '../src/lib/contact-policy.ts';
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

test('telegram contact policy allows Telegram return channel without email or phone', () => {
  assert.deepEqual(parseOptionalContactDetails({}), {
    customerEmail: null,
    customerPhone: null,
    primaryContactMethod: null,
    primaryContactValue: null,
  });
});

test('telegram contact policy records optional email when provided', () => {
  assert.deepEqual(parseOptionalContactDetails({ email: ' Owner@Example.COM ' }), {
    customerEmail: 'owner@example.com',
    customerPhone: null,
    primaryContactMethod: 'EMAIL',
    primaryContactValue: 'owner@example.com',
  });
});

test('telegram intake does not sync unverified form contacts into customer profiles', () => {
  const source = readFileSync(
    resolve(__dirname, '../src/lib/telegram-intake.ts'),
    'utf8'
  );

  assert.equal(source.includes('syncCaseCustomerProfile'), false);
});

test('telegram secure intake accepts optional contact before file storage', () => {
  const routeSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/intake/submit/route.ts'),
    'utf8'
  );
  const intakeSource = readFileSync(
    resolve(__dirname, '../src/lib/telegram-intake.ts'),
    'utf8'
  );
  const requiredFieldsIndex = routeSource.indexOf('if (!token || !message) {');
  const oldRequiredContactIndex = routeSource.indexOf('if (!token || !contact || !message) {');
  const contactPolicyIndex = routeSource.indexOf('const submittedContact = parseOptionalContactDetails({ contact, email, phone });');
  const storeAttachmentIndex = routeSource.indexOf('storeAttachment(file)');
  const submitIndex = routeSource.indexOf('const result = await submitTelegramIntake(prisma, {');

  assert.notEqual(requiredFieldsIndex, -1);
  assert.equal(oldRequiredContactIndex, -1);
  assert.notEqual(contactPolicyIndex, -1);
  assert.notEqual(storeAttachmentIndex, -1);
  assert.notEqual(submitIndex, -1);
  assert.ok(contactPolicyIndex < storeAttachmentIndex);
  assert.ok(contactPolicyIndex < submitIndex);
  assert.ok(routeSource.includes('email,'));
  assert.ok(routeSource.includes('phone,'));
  assert.ok(intakeSource.includes('const parsedContact = parseOptionalContactDetails(input);'));
  assert.ok(intakeSource.includes('customerEmail: parsedContact.customerEmail'));
  assert.ok(intakeSource.includes('customerPhone: parsedContact.customerPhone'));
  assert.ok(intakeSource.includes('primaryContactMethod: parsedContact.primaryContactMethod'));
  assert.ok(intakeSource.includes('primaryContactValue: parsedContact.primaryContactValue'));
});

test('telegram secure intake returns portal claim link without requiring email', () => {
  const routeSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/intake/submit/route.ts'),
    'utf8'
  );
  const intakeSource = readFileSync(
    resolve(__dirname, '../src/lib/telegram-intake.ts'),
    'utf8'
  );
  const claimLinkIndex = intakeSource.indexOf('const portalClaimLink = await createPortalClaimLink(tx, {');
  const claimLinkBlock = intakeSource.slice(claimLinkIndex, intakeSource.indexOf('});', claimLinkIndex) + 3);

  assert.ok(intakeSource.includes("import { createPortalClaimLink } from './portal/claim';"));
  assert.notEqual(claimLinkIndex, -1);
  assert.equal(claimLinkBlock.includes('origin'), false);
  assert.ok(intakeSource.includes('portalClaimUrl: portalClaimLink.url'));
  assert.ok(intakeSource.includes('portalClaimExpiresAt: portalClaimLink.expiresAt.toISOString()'));
  assert.equal(routeSource.includes('if (!token || !email || !message) {'), false);
});

test('telegram secure intake sends activation invite only when optional email exists', () => {
  const routeSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/intake/submit/route.ts'),
    'utf8'
  );
  const submitIndex = routeSource.indexOf('const result = await submitTelegramIntake(prisma, {');
  const emailGateIndex = routeSource.indexOf(
    'if (submittedContact.customerEmail && result.portalClaimUrl && result.portalClaimExpiresAt) {'
  );
  const inviteIndex = routeSource.indexOf('sendPortalActivationInviteEmail({');
  const keyboardIndex = routeSource.indexOf('const keyboard = [');

  assert.notEqual(submitIndex, -1);
  assert.notEqual(emailGateIndex, -1);
  assert.notEqual(inviteIndex, -1);
  assert.notEqual(keyboardIndex, -1);
  assert.ok(submitIndex < emailGateIndex);
  assert.ok(emailGateIndex < inviteIndex);
  assert.ok(inviteIndex < keyboardIndex);
  assert.ok(routeSource.includes('to: submittedContact.customerEmail'));
  assert.ok(routeSource.includes('claimUrl: result.portalClaimUrl'));
  assert.equal(routeSource.includes('to: submittedContact.customerPhone'), false);
});

test('telegram secure intake confirmation keyboard includes status portal and return buttons', () => {
  const routeSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/intake/submit/route.ts'),
    'utf8'
  );
  const statusButtonIndex = routeSource.indexOf('[{ text: getStatusButtonLabel(result.locale), url: result.statusUrl }]');
  const portalButtonIndex = routeSource.indexOf('getPortalButtonLabel(result.locale, Boolean(submittedContact.customerEmail))', statusButtonIndex);
  const returnButtonIndex = routeSource.indexOf('result.telegramReturnUrl', portalButtonIndex);

  assert.notEqual(statusButtonIndex, -1);
  assert.notEqual(portalButtonIndex, -1);
  assert.notEqual(returnButtonIndex, -1);
  assert.ok(statusButtonIndex < portalButtonIndex);
  assert.ok(portalButtonIndex < returnButtonIndex);
  assert.ok(routeSource.includes('function getPortalButtonLabel'));
  assert.ok(routeSource.includes('getPortalButtonLabel(result.locale, Boolean(submittedContact.customerEmail))'));
  assert.ok(routeSource.includes('url: result.portalClaimUrl'));
});

test('telegram secure form submits optional split email and phone fields', () => {
  const formSource = readFileSync(
    resolve(__dirname, '../src/components/telegram/TelegramRequestForm.tsx'),
    'utf8'
  );

  assert.ok(formSource.includes("const [email, setEmail] = useState('');"));
  assert.ok(formSource.includes("const [phone, setPhone] = useState('');"));
  assert.ok(formSource.includes("const cleanEmail = email.trim();"));
  assert.ok(formSource.includes("const cleanPhone = phone.trim();"));
  assert.ok(formSource.includes("formData.set('email', cleanEmail);"));
  assert.ok(formSource.includes("formData.set('phone', cleanPhone);"));
  assert.ok(formSource.includes("if (cleanEmail || cleanPhone) {"));
  assert.equal(formSource.includes("const [contact, setContact] = useState('');"), false);
  assert.equal(formSource.includes('placeholder={copy.contact}'), false);
  assert.equal(formSource.includes('required\n          value={email}'), false);
  assert.equal(formSource.includes('required\n          value={phone}'), false);
});

test('telegram secure form and confirmation copy avoid in-telegram tracking wording', () => {
  const routeSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/intake/submit/route.ts'),
    'utf8'
  );
  const formSource = readFileSync(
    resolve(__dirname, '../src/components/telegram/TelegramRequestForm.tsx'),
    'utf8'
  );
  const combined = `${routeSource}\n${formSource}`;
  const forbiddenPatterns = [
    /track(?:ing)?\s+(?:in|inside|here)\s+telegram/i,
    /follow\s+(?:the\s+)?status\s+(?:in|inside|here)\s+telegram/i,
    /status\s+in\s+telegram/i,
    /отслеж\w*\s+[^.\n]*telegram/i,
    /след\w*\s+[^.\n]*telegram/i,
  ];

  assert.ok(routeSource.includes('Status can be checked by the link below.'));
  assert.ok(routeSource.includes('The conversation can continue here in Telegram.'));
  assert.ok(routeSource.includes('For long-term access, activate the customer portal with the button below.'));
  assert.ok(routeSource.includes('Для долгосрочного доступа активируйте личный кабинет'));

  for (const pattern of forbiddenPatterns) {
    assert.equal(pattern.test(combined), false);
  }
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

test('unknown telegram contacts receive secure form button from assistant intake action', () => {
  const source = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/webhook/route.ts'),
    'utf8'
  );

  assert.ok(source.includes('function createTelegramIntakeButtonUrl'));
  assert.ok(source.includes('const shouldShowIntakeAction ='));
  assert.ok(source.includes('const shouldShowIntakeFormButton ='));
  assert.ok(source.includes('!result.hasStoredTelegramContact &&'));
  assert.ok(source.includes('const intakeUrl = shouldShowIntakeFormButton'));
  assert.ok(source.includes('text: getIntakeButtonLabel(result.locale)'));
  assert.ok(source.includes('url: intakeUrl'));
  assert.ok(source.includes('!shouldShowIntakeAction &&'));
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

test('known telegram status uses assistant action instead of asking for a request number again', () => {
  const webhookSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/webhook/route.ts'),
    'utf8'
  );
  const promptSource = readFileSync(
    resolve(__dirname, '../src/lib/ai/system-prompt.ts'),
    'utf8'
  );
  const orchestratorSource = readFileSync(
    resolve(__dirname, '../src/lib/ai/assistant-orchestrator.ts'),
    'utf8'
  );
  const chatEngineSource = readFileSync(
    resolve(__dirname, '../src/lib/ai/chat-engine.ts'),
    'utf8'
  );

  assert.ok(promptSource.includes('<<SHOW_STATUS>>'));
  assert.ok(orchestratorSource.includes("{ type: 'show_status' }"));
  assert.ok(chatEngineSource.includes('suggestStatus'));
  assert.ok(webhookSource.includes("action.type === 'show_status'"));
  assert.ok(webhookSource.includes('publicRequestNumber: result.activeTelegramRequest || shouldAttachStatusAction(body)'));
  assert.equal(webhookSource.includes('publicRequestNumber: result.hasStoredTelegramContact'), false);
});

test('active telegram request continues current case instead of creating a duplicate', () => {
  const webhookSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/webhook/route.ts'),
    'utf8'
  );
  const controllerSource = readFileSync(
    resolve(__dirname, '../src/lib/telegram-conversation-controller.ts'),
    'utf8'
  );
  const promptSource = readFileSync(
    resolve(__dirname, '../src/lib/ai/system-prompt.ts'),
    'utf8'
  );
  const orchestratorSource = readFileSync(
    resolve(__dirname, '../src/lib/ai/assistant-orchestrator.ts'),
    'utf8'
  );
  const chatEngineSource = readFileSync(
    resolve(__dirname, '../src/lib/ai/chat-engine.ts'),
    'utf8'
  );

  assert.ok(controllerSource.includes('function isCustomerVisibleActiveRequest'));
  assert.ok(controllerSource.includes('TERMINAL_CASE_STATUSES'));
  assert.ok(controllerSource.includes("'COMPLETED'"));
  assert.ok(controllerSource.includes("'CANCELLED'"));
  assert.ok(webhookSource.includes('activeTelegramRequest'));
  assert.ok(webhookSource.includes('conversationState'));
  assert.ok(webhookSource.includes('classifyTelegramTurn'));
  assert.ok(webhookSource.includes('activeMessengerRequest: result.activeTelegramRequest'));
  assert.ok(webhookSource.includes('!result.activeTelegramRequest &&'));
  assert.ok(webhookSource.includes('buildActiveRequestPhotoReceivedText'));
  assert.ok(webhookSource.includes('function buildTelegramAssistantMessage'));
  assert.ok(webhookSource.includes('hasPhoto: Boolean(telegramPhoto)'));
  assert.ok(webhookSource.includes('It has already been stored on the current active request'));
  assert.ok(promptSource.includes('# Active Messenger Request Mode'));
  assert.ok(promptSource.includes('send them directly in this chat'));
  assert.ok(promptSource.includes('Do not append <<SHOW_INTAKE:...>> while the customer is continuing the current request.'));
  assert.ok(orchestratorSource.includes('activeMessengerRequest?: boolean'));
  assert.ok(chatEngineSource.includes('activeMessengerRequest?: boolean'));
});

test('telegram controller handles active PR turns before the AI fallback', () => {
  const webhookSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/webhook/route.ts'),
    'utf8'
  );
  const controllerSource = readFileSync(
    resolve(__dirname, '../src/lib/telegram-conversation-controller.ts'),
    'utf8'
  );

  assert.ok(controllerSource.includes("'active_request_status'"));
  assert.ok(controllerSource.includes("'active_request_continue'"));
  assert.ok(controllerSource.includes("'separate_new_request'"));
  assert.ok(controllerSource.includes('как\\s+дел[ао]\\s+с\\s+(?:моей\\s+)?заявк'));
  assert.ok(controllerSource.includes('(?:у\\s+меня\\s+)?нет\\s+заявк'));
  assert.ok(webhookSource.includes("turnDecision === 'active_request_status'"));
  assert.ok(webhookSource.includes("turnDecision === 'active_request_continue'"));
  assert.ok(webhookSource.includes("turnDecision === 'separate_new_request'"));
  assert.ok(webhookSource.includes('buildActiveRequestStatusText'));
  assert.ok(webhookSource.includes('buildSeparateNewRequestOfferText'));
});

test('active telegram request blocks assistant form reset text', () => {
  const webhookSource = readFileSync(
    resolve(__dirname, '../src/app/api/telegram/webhook/route.ts'),
    'utf8'
  );

  assert.ok(webhookSource.includes('function isActiveRequestFormResetText'));
  assert.ok(webhookSource.includes('function buildActiveRequestContinuationText'));
  assert.ok(webhookSource.includes('result.activeTelegramRequest &&'));
  assert.ok(webhookSource.includes('isActiveRequestFormResetText(assistantReply.text)'));
  assert.ok(webhookSource.includes('publicRequestNumber: result.publicRequestNumber'));
  assert.ok(webhookSource.includes('assistantReplyText = outgoingAssistantText'));
  assert.ok(webhookSource.includes('text: outgoingAssistantText'));
  assert.ok(webhookSource.includes('Заявка ${requestNumber} уже получена.'));
  assert.ok(webhookSource.includes('Общение продолжается здесь, в Telegram.'));
});
