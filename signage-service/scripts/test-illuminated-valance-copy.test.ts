import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getIlluminatedValanceCopy,
  type IlluminatedValancePageCopy,
} from '../src/app/[locale]/leistungen/beleuchtete-markisenvolants/copy.ts';

const LOCALES = ['de', 'en', 'ru', 'tr', 'pl', 'ar'] as const;

function copyShape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(copyShape);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, copyShape(entry)])
    );
  }

  return typeof value;
}

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
  }

  return [];
}

test('all illuminated-valance locales expose the complete copy contract', () => {
  const canonicalShape = copyShape(getIlluminatedValanceCopy('de'));

  for (const locale of LOCALES) {
    assert.deepEqual(copyShape(getIlluminatedValanceCopy(locale)), canonicalShape, locale);
  }
});

test('each locale has localized metadata, page copy and one price placeholder', () => {
  const expectedOpenGraphLocale: Record<(typeof LOCALES)[number], string> = {
    de: 'de_DE',
    en: 'en_US',
    ru: 'ru_RU',
    tr: 'tr_TR',
    pl: 'pl_PL',
    ar: 'ar_AR',
  };
  const germanTitle = getIlluminatedValanceCopy('de').hero.title;

  for (const locale of LOCALES) {
    const copy = getIlluminatedValanceCopy(locale);
    assert.equal(copy.metadata.openGraphLocale, expectedOpenGraphLocale[locale]);
    assert.ok(copy.metadata.title.trim());
    assert.ok(copy.metadata.description.trim());
    assert.ok(copy.hero.title.trim());
    assert.equal(
      collectStrings(copy).filter((value) => value.includes('{price}')).length,
      1,
      locale
    );

    if (locale !== 'de') {
      assert.notEqual(copy.hero.title, germanTitle, locale);
    }
  }
});

test('unknown locales retain the German fallback', () => {
  const germanCopy: IlluminatedValancePageCopy = getIlluminatedValanceCopy('de');
  assert.equal(getIlluminatedValanceCopy('unknown'), germanCopy);
});
