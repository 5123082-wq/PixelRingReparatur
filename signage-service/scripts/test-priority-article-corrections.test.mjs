import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildPriorityArticlePlan,
  correctPriorityArticle,
  validatePriorityArticlePlan,
} from './priority-article-corrections.mjs';

const { rules } = JSON.parse(await readFile(new URL('./priority-article-corrections-2026-11-16.json', import.meta.url), 'utf8'));
const untouchedBody = '## Detailed diagnosis\n\n| Symptom | Check |\n|---|---|\n| Patch | Inspect |\n\n## Safe checks\n\nDo not open electrical components.';
const fixtures = () => rules.map((rule, index) => ({
  id: `article-${index}`, locale: rule.locale, slug: rule.slug,
  type: 'SYMPTOM', status: 'PUBLISHED', deletedAt: null,
  shortAnswer: rule.shortAnswer.before,
  content: `# Existing article title\n\n${rule.content.before}${untouchedBody}`,
  canonicalUrl: `/${rule.locale}/existing-path`,
  selfRepairTips: { title: 'Safe external observations', items: ['Observe from the ground'] },
  publishedAt: '2026-05-25T11:57:09.607Z', updatedAt: '2026-10-04T06:10:22.159Z',
}));

test('four-record preview only changes summary and introduction, preserving diagnostic and safety content', () => {
  const plan = buildPriorityArticlePlan(fixtures(), rules);
  validatePriorityArticlePlan(plan, rules);
  for (const record of plan.records) {
    assert.deepEqual(record.changes.map(({ field }) => field), ['shortAnswer', 'content']);
    assert.ok(record.after.content.endsWith(untouchedBody));
    assert.deepEqual(record.after.selfRepairTips, record.before.selfRepairTips);
    for (const field of ['canonicalUrl', 'publishedAt', 'updatedAt', 'status']) {
      assert.equal(record.after[field], record.before[field]);
    }
    assert.ok(!record.after.shortAnswer.includes('culpr2its'));
    assert.ok(!record.after.content.includes('almost never the LEDs'));
    assert.ok(!record.after.content.includes('in den meisten Fällen nicht an den LEDs'));
  }
});

test('already corrected articles are idempotent', () => {
  const once = buildPriorityArticlePlan(fixtures(), rules);
  const twice = buildPriorityArticlePlan(once.records.map(({ after }) => after), rules);
  assert.ok(twice.records.every(({ changes }) => changes.length === 0));
});

test('missing, duplicate, unpublished, and unexpected-language targets fail closed', () => {
  const rows = fixtures();
  assert.throws(() => buildPriorityArticlePlan(rows.slice(1), rules));
  assert.throws(() => buildPriorityArticlePlan([rows[0], rows[0], rows[2], rows[3]], rules));
  assert.throws(() => correctPriorityArticle({ ...rows[0], status: 'DRAFT' }, rules));
  assert.throws(() => correctPriorityArticle({ ...rows[0], locale: 'ru' }, rules));
});

test('newer editorial introductions and unexpected changes to reviewed preview fail closed', () => {
  const rows = fixtures();
  assert.throws(() => correctPriorityArticle({ ...rows[0], shortAnswer: 'A new editorial summary' }, rules));
  assert.throws(() => correctPriorityArticle({ ...rows[0], content: '# A different introduction' }, rules));
  const changedProtectedField = buildPriorityArticlePlan(rows, rules);
  changedProtectedField.records[0].after.canonicalUrl = '/different';
  assert.throws(() => validatePriorityArticlePlan(changedProtectedField, rules));
  const changedCopy = buildPriorityArticlePlan(rows, rules);
  changedCopy.records[0].after.content += '\nUnreviewed copy';
  assert.throws(() => validatePriorityArticlePlan(changedCopy, rules));
});
