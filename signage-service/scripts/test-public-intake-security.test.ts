import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

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

test('contact form surfaces verification-required errors instead of generic errors', () => {
  const source = readProjectFile('src/components/common/ContactForm.tsx');

  assert.ok(source.includes("data.code === 'verification_required'"));
});
