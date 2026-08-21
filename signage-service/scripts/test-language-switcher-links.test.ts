import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

import React, { type ComponentProps, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const componentPath = resolve(
  import.meta.dirname,
  '../src/components/common/LanguageSwitcher.tsx'
);
const currentPathname = '/leistungen/werbeanlagen-reparatur';

type MockLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  locale: string;
  prefetch?: boolean | null;
};

function MockLink({
  href,
  locale,
  prefetch,
  children,
  ...anchorProps
}: MockLinkProps) {
  const localizedHref = `/${locale}${href === '/' ? '' : href}`;

  return React.createElement(
    'a',
    {
      ...anchorProps,
      href: localizedHref,
      'data-prefetch': String(prefetch),
    },
    children
  );
}

function renderInitialMarkup(
  props: { availableLocales?: readonly ['de', 'en', 'ru'] } = {}
): string {
  const source = readFileSync(componentPath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: componentPath,
  }).outputText;
  const componentModule: { exports: { default?: ComponentType } } = {
    exports: {},
  };
  const mockRequire = (specifier: string): unknown => {
    if (specifier === 'react' || specifier === 'react/jsx-runtime') {
      return require(specifier);
    }

    if (specifier === 'next-intl') {
      return { useLocale: () => 'de' };
    }

    if (specifier === '@/i18n/routing') {
      return {
        Link: MockLink,
        usePathname: () => currentPathname,
      };
    }

    throw new Error(`Unexpected module in LanguageSwitcher test: ${specifier}`);
  };
  const context = createContext({
    console,
    exports: componentModule.exports,
    module: componentModule,
    require: mockRequire,
  });

  new Script(compiled, { filename: componentPath }).runInContext(context);

  const LanguageSwitcher = componentModule.exports.default;
  assert.ok(LanguageSwitcher, 'LanguageSwitcher default export is missing');

  return renderToStaticMarkup(React.createElement(LanguageSwitcher, props));
}

test('closed language switcher renders all six localized hrefs in initial HTML', () => {
  const html = renderInitialMarkup();
  const hrefs = Array.from(html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g), (match) => match[1]);

  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-label="Sprache wechseln\. Aktuell: Deutsch"/);
  assert.match(html, /<nav[^>]*\shidden=""[^>]*>/);
  assert.doesNotMatch(html, /aria-haspopup/);
  assert.deepEqual(hrefs, [
    '/de/leistungen/werbeanlagen-reparatur',
    '/en/leistungen/werbeanlagen-reparatur',
    '/ru/leistungen/werbeanlagen-reparatur',
    '/tr/leistungen/werbeanlagen-reparatur',
    '/pl/leistungen/werbeanlagen-reparatur',
    '/ar/leistungen/werbeanlagen-reparatur',
  ]);
});

test('initial locale links disable automatic prefetch', () => {
  const html = renderInitialMarkup();
  const disabledPrefetchLinks = html.match(/data-prefetch="false"/g) ?? [];

  assert.equal(disabledPrefetchLinks.length, 6);
});

test('article pages can limit crawlable links to published locale variants', () => {
  const html = renderInitialMarkup({ availableLocales: ['de', 'en', 'ru'] });
  const hrefs = Array.from(html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g), (match) => match[1]);

  assert.deepEqual(hrefs, [
    '/de/leistungen/werbeanlagen-reparatur',
    '/en/leistungen/werbeanlagen-reparatur',
    '/ru/leistungen/werbeanlagen-reparatur',
  ]);
  assert.doesNotMatch(html, /\/(tr|pl|ar)\/leistungen\/werbeanlagen-reparatur/);
});
