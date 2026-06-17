import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  resolveWebsiteRequestContact,
  WEBSITE_EMAIL_REQUIRED_MESSAGE,
} from '../src/lib/contact-policy.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readProjectFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf8');
}

test('public website intake only syncs customer profiles for verified portal users', () => {
  const source = readProjectFile('src/lib/request-intake.ts');
  const portalGateIndex = source.indexOf('if (input.portalUser) {');
  const syncIndex = source.indexOf('await syncCaseCustomerProfile(tx, {');

  assert.notEqual(portalGateIndex, -1);
  assert.notEqual(syncIndex, -1);
  assert.ok(portalGateIndex < syncIndex);
});

test('website contact policy requires email and keeps phone secondary', () => {
  assert.throws(
    () => resolveWebsiteRequestContact({ contact: '+49 170 1234567' }),
    (error) =>
      error instanceof Error &&
      error.message === WEBSITE_EMAIL_REQUIRED_MESSAGE
  );

  const parsed = resolveWebsiteRequestContact({
    email: ' Customer@Example.COM ',
    phone: '+49 170 1234567',
  });

  assert.deepEqual(parsed, {
    method: 'EMAIL',
    value: 'customer@example.com',
    customerEmail: 'customer@example.com',
    customerPhone: '+491701234567',
  });
});

test('public contact endpoint blocks repeat case sessions before file storage and PR creation', () => {
  const source = readProjectFile('src/app/api/contact/route.ts');
  const repeatSessionCheckIndex = source.indexOf('if (resolved.session.caseId) {');
  const verificationCodeIndex = source.indexOf("code: 'verification_required'");
  const storeAttachmentIndex = source.indexOf('storeAttachment(file)');
  const createRequestIndex = source.indexOf('const result = await createWebsiteRequest(prisma, {');

  assert.notEqual(repeatSessionCheckIndex, -1);
  assert.notEqual(verificationCodeIndex, -1);
  assert.notEqual(storeAttachmentIndex, -1);
  assert.notEqual(createRequestIndex, -1);
  assert.ok(repeatSessionCheckIndex < verificationCodeIndex);
  assert.ok(verificationCodeIndex < storeAttachmentIndex);
  assert.ok(verificationCodeIndex < createRequestIndex);
});

test('public contact endpoint validates required email before file storage and PR creation', () => {
  const source = readProjectFile('src/app/api/contact/route.ts');
  const resolveContactIndex = source.indexOf(
    'const resolvedContact = resolveWebsiteRequestContact({ contact, email, phone });'
  );
  const storeAttachmentIndex = source.indexOf('storeAttachment(file)');
  const createRequestIndex = source.indexOf('const result = await createWebsiteRequest(prisma, {');

  assert.notEqual(resolveContactIndex, -1);
  assert.notEqual(storeAttachmentIndex, -1);
  assert.notEqual(createRequestIndex, -1);
  assert.ok(resolveContactIndex < storeAttachmentIndex);
  assert.ok(resolveContactIndex < createRequestIndex);
});

test('website chat draft phone does not satisfy PR creation email policy', () => {
  const source = readProjectFile('src/app/api/contact/route.ts');

  assert.ok(source.includes("email = email || draft?.customerEmail || '';"));
  assert.ok(source.includes("phone = phone || draft?.customerPhone || '';"));
  assert.ok(source.includes("contact = contact || draft?.customerEmail || '';"));
  assert.equal(
    source.includes("contact = contact || draft?.customerEmail || draft?.customerPhone || '';"),
    false
  );
});

test('browser chat request cards submit split email and phone with legacy contact=email', () => {
  const fullCardSource = readProjectFile('src/components/common/ChatIntakeCard.tsx');
  const confirmCardSource = readProjectFile('src/components/common/ChatRequestConfirmCard.tsx');

  for (const source of [fullCardSource, confirmCardSource]) {
    assert.ok(source.includes("fd.append('contact', cleanEmail);"));
    assert.ok(source.includes("fd.append('email', cleanEmail);"));
    assert.ok(source.includes("fd.append('phone', cleanPhone);"));
    assert.equal(source.includes("fd.append('contact', cleanPhone);"), false);
    assert.equal(source.includes('setContactMode'), false);
  }
});

test('browser chat draft stores email and phone as separate fields', () => {
  const draftRouteSource = readProjectFile('src/app/api/chat/intake-draft/route.ts');
  const fullCardSource = readProjectFile('src/components/common/ChatIntakeCard.tsx');
  const confirmCardSource = readProjectFile('src/components/common/ChatRequestConfirmCard.tsx');
  const chatMessagesSource = readProjectFile('src/app/api/chat/messages/route.ts');

  assert.ok(draftRouteSource.includes("const email = String(formData.get('email') ?? '').trim();"));
  assert.ok(draftRouteSource.includes("const phone = String(formData.get('phone') ?? '').trim();"));
  assert.ok(draftRouteSource.includes("customerEmail: firstNonEmpty(String(formData.get('customerEmail') ?? ''), email, split.customerEmail)"));
  assert.ok(draftRouteSource.includes("customerPhone: firstNonEmpty(String(formData.get('customerPhone') ?? ''), phone, split.customerPhone)"));

  for (const source of [fullCardSource, confirmCardSource]) {
    assert.ok(source.includes("fd.append('email', email);"));
    assert.ok(source.includes("fd.append('phone', phone);"));
    assert.ok(source.includes("fd.append('customerEmail', email);"));
    assert.ok(source.includes("fd.append('customerPhone', phone);"));
  }

  assert.ok(chatMessagesSource.includes('email:'));
  assert.ok(chatMessagesSource.includes('phone:'));
  assert.ok(chatMessagesSource.includes("draft?.customerEmail ||"));
  assert.ok(chatMessagesSource.includes("draft?.customerPhone ||"));
});

test('website request with email still creates PR and portal claim link', () => {
  const intakeSource = readProjectFile('src/lib/request-intake.ts');
  const contactRouteSource = readProjectFile('src/app/api/contact/route.ts');

  assert.ok(intakeSource.includes('const parsedContact = resolveWebsiteRequestContact(input);'));
  assert.ok(intakeSource.includes('const publicRequestNumber = await ensurePublicRequestNumberForCase('));
  assert.ok(intakeSource.includes('const portalClaimLink = await createPortalClaimLink(tx, {'));
  assert.ok(intakeSource.includes('portalClaimUrl: portalClaimLink.url'));
  assert.ok(contactRouteSource.includes('email: resolvedContact.customerEmail'));
  assert.ok(contactRouteSource.includes('phone: resolvedContact.customerPhone'));
});

test('website request with email triggers activation invite after PR and claim creation', () => {
  const contactRouteSource = readProjectFile('src/app/api/contact/route.ts');
  const createRequestIndex = contactRouteSource.indexOf('const result = await createWebsiteRequest(prisma, {');
  const inviteGateIndex = contactRouteSource.indexOf(
    'if (result.portalClaimUrl && result.portalClaimExpiresAt && resolvedContact.customerEmail) {'
  );
  const inviteIndex = contactRouteSource.indexOf('sendPortalActivationInviteEmail({');
  const responseIndex = contactRouteSource.indexOf('const response = NextResponse.json({');

  assert.ok(contactRouteSource.includes("import { sendPortalActivationInviteEmail } from '@/lib/email/portal-claim-email';"));
  assert.notEqual(createRequestIndex, -1);
  assert.notEqual(inviteGateIndex, -1);
  assert.notEqual(inviteIndex, -1);
  assert.notEqual(responseIndex, -1);
  assert.ok(createRequestIndex < inviteGateIndex);
  assert.ok(inviteGateIndex < inviteIndex);
  assert.ok(inviteIndex < responseIndex);
  assert.ok(contactRouteSource.includes('to: resolvedContact.customerEmail'));
  assert.ok(contactRouteSource.includes('claimUrl: result.portalClaimUrl'));
  assert.ok(contactRouteSource.includes('expiresAt: new Date(result.portalClaimExpiresAt)'));
  assert.ok(contactRouteSource.includes('publicRequestNumber: result.publicRequestNumber'));
  assert.equal(contactRouteSource.includes('to: resolvedContact.customerPhone'), false);
});

test('public activation invite failure logging is token and contact safe', () => {
  const source = readProjectFile('src/app/api/contact/route.ts');
  const catchIndex = source.indexOf("console.error('Portal activation invite email failed:', {");
  const afterCatch = source.slice(catchIndex, source.indexOf('});', catchIndex) + 3);

  assert.notEqual(catchIndex, -1);
  assert.ok(afterCatch.includes('caseId: result.caseId'));
  assert.ok(afterCatch.includes('publicRequestNumber: result.publicRequestNumber'));
  assert.equal(afterCatch.includes('resolvedContact.customerEmail'), false);
  assert.equal(afterCatch.includes('portalClaimUrl'), false);
  assert.equal(afterCatch.includes('claimUrl'), false);
  assert.equal(afterCatch.includes('token'), false);
});

test('contact form surfaces verification-required errors instead of generic errors', () => {
  const source = readProjectFile('src/components/common/ContactForm.tsx');

  assert.ok(source.includes("data.code === 'verification_required'"));
});
