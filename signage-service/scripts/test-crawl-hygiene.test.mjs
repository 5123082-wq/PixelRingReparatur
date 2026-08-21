import assert from 'node:assert/strict';
import fs from 'node:fs';
import Module, { createRequire } from 'node:module';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const loadModule = createRequire(import.meta.url);
const { NextRequest, NextResponse } = loadModule('next/server');
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const originalTsLoader = loadModule.extensions['.ts'];
const originalTsxLoader = loadModule.extensions['.tsx'];
const originalModuleLoad = Module._load;

function transpileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;

  module._compile(output, filename);
}

loadModule.extensions['.ts'] = transpileTypeScript;
loadModule.extensions['.tsx'] = transpileTypeScript;

Module._load = function loadWithProxyFixtures(request, parent, isMain) {
  if (request === 'next-intl/middleware') {
    return () => () => NextResponse.next();
  }

  if (request === './i18n/routing' && parent?.filename.endsWith('/src/proxy.ts')) {
    return {
      routing: {
        defaultLocale: 'de',
        locales: ['de', 'en', 'ru', 'tr', 'pl', 'ar'],
      },
    };
  }

  return originalModuleLoad.call(this, request, parent, isMain);
};

const nextConfig = loadModule(path.join(projectRoot, 'next.config.ts')).default;
const proxyModule = loadModule(path.join(projectRoot, 'src/proxy.ts'));
const proxy = proxyModule.default;

Module._load = originalModuleLoad;

after(() => {
  loadModule.extensions['.ts'] = originalTsLoader;
  loadModule.extensions['.tsx'] = originalTsxLoader;
  Module._load = originalModuleLoad;
});

function createRequest(pathname, cookie) {
  return new NextRequest(`https://www.pixel-ring.com${pathname}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

function getLocaleBlock(sourceFile, locale, nextLocale) {
  const startMarker = `  ${locale}: [`;
  const endMarker = `  ${nextLocale}: [`;
  const start = sourceFile.indexOf(startMarker);
  const end = sourceFile.indexOf(endMarker, start + startMarker.length);

  assert.notEqual(start, -1, `Missing ${locale} case-link block`);
  assert.notEqual(end, -1, `Missing ${nextLocale} boundary after ${locale}`);

  return sourceFile.slice(start, end);
}

function getLinkCardByTitle(sourceFile, title) {
  const start = sourceFile.indexOf(`title: '${title}'`);
  const end = sourceFile.indexOf('},', start);

  assert.notEqual(start, -1, `Missing link card: ${title}`);
  assert.notEqual(end, -1, `Missing link card boundary: ${title}`);

  return sourceFile.slice(start, end + 2);
}

test('Next config declares only the verified permanent one-hop redirects', async () => {
  const redirects = await nextConfig.redirects();
  const relevant = redirects.map(({ source, destination, permanent }) => ({
    source,
    destination,
    permanent,
  }));

  assert.deepEqual(relevant, [
    { source: '/', destination: '/de', permanent: true },
    { source: '/leistungen', destination: '/de/leistungen', permanent: true },
    {
      source: '/ring-master-admin/:path*',
      destination: '/de/ring-manager-crm/:path*',
      permanent: true,
    },
    {
      source: '/:locale(de|en|ru|tr|pl|ar)/ring-master-admin/:path*',
      destination: '/:locale/ring-manager-crm/:path*',
      permanent: true,
    },
  ]);
});

test('legacy admin proxy fallback is permanent, localized, one-hop, and query-safe', async () => {
  const response = await proxy(createRequest('/ring-master-admin/dashboard?from=legacy'));

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get('location'),
    'https://www.pixel-ring.com/de/ring-manager-crm/dashboard?from=legacy'
  );
});

test('Apple association probes return direct 404 responses without locale or hreflang redirects', async () => {
  const paths = [
    '/apple-app-site-association',
    '/.well-known/apple-app-site-association',
    '/de/apple-app-site-association',
    '/ar/.well-known/apple-app-site-association',
  ];

  for (const pathname of paths) {
    const response = await proxy(createRequest(pathname));

    assert.equal(response.status, 404, pathname);
    assert.equal(response.headers.get('location'), null, pathname);
    assert.equal(response.headers.get('link'), null, pathname);
  }

  assert.ok(proxyModule.config.matcher.includes('/apple-app-site-association'));
  assert.ok(proxyModule.config.matcher.includes('/.well-known/apple-app-site-association'));
});

test('the conventional favicon URL has a real icon asset instead of a repeated 404', () => {
  const favicon = fs.readFileSync(path.join(projectRoot, 'src/app/favicon.ico'));

  assert.ok(favicon.length > 100);
  assert.deepEqual([...favicon.subarray(0, 4)], [0, 0, 1, 0]);
});

test('retired public paths remain true 404 responses when no safe replacement exists', async () => {
  for (const pathname of ['/contact', '/hilfe', '/support', '/services/unknown-offer']) {
    const response = await proxy(createRequest(pathname));

    assert.equal(response.status, 404, pathname);
    assert.equal(response.headers.get('location'), null, pathname);
  }
});

test('current private route guards keep their temporary session redirects', async () => {
  const unlocalized = await proxy(createRequest('/ring-manager-crm/dashboard'));
  assert.equal(unlocalized.status, 307);
  assert.equal(
    unlocalized.headers.get('location'),
    'https://www.pixel-ring.com/de/ring-manager-crm/dashboard'
  );

  const unauthenticated = await proxy(createRequest('/de/ring-manager-crm/dashboard'));
  assert.equal(unauthenticated.status, 307);
  assert.equal(
    unauthenticated.headers.get('location'),
    'https://www.pixel-ring.com/de/ring-manager-crm'
  );

  const authenticated = await proxy(
    createRequest('/de/ring-manager-crm/dashboard', 'pixelring_crm_session=test-session')
  );
  assert.equal(authenticated.status, 200);
  assert.equal(authenticated.headers.get('x-middleware-next'), '1');
});

test('TR, PL, and AR public surfaces do not link to the unpublished flicker article', () => {
  const source = fs.readFileSync(
    path.join(projectRoot, 'src/components/sections/ReviewsSection.tsx'),
    'utf8'
  );

  const localeBlocks = {
    tr: getLocaleBlock(source, 'tr', 'pl'),
    pl: getLocaleBlock(source, 'pl', 'ar'),
    ar: source.slice(source.indexOf('  ar: ['), source.indexOf('\n};', source.indexOf('  ar: ['))),
  };

  for (const [locale, block] of Object.entries(localeBlocks)) {
    assert.doesNotMatch(block, /\/probleme-loesungen\/werbeanlage-flackert/, locale);
    assert.match(block, /href: '\/probleme-loesungen'/, locale);
  }

  for (const [locale, nextLocale] of [
    ['de', 'en'],
    ['en', 'ru'],
    ['ru', 'tr'],
  ]) {
    assert.match(
      getLocaleBlock(source, locale, nextLocale),
      /href: '\/probleme-loesungen\/werbeanlage-flackert'/,
      locale
    );
  }

  const serviceSurfaces = [
    {
      file: 'src/app/[locale]/leistungen/werbeanlagen-reparatur/page.tsx',
      titles: ['Tabela titriyor', 'Reklama miga', 'اللوحة تومض'],
    },
    {
      file: 'src/app/[locale]/leistungen/werbeanlagen-reinigung/page.tsx',
      titles: ['Tabela titriyor', 'Reklama miga', 'اللوحة تومض'],
    },
    {
      file: 'src/app/[locale]/leistungen/[slug]/page.tsx',
      titles: ['Tabela titriyor', 'Reklama miga', 'الإعلان يومض'],
    },
  ];
  let checkedServiceLinks = 0;

  for (const surface of serviceSurfaces) {
    const surfaceSource = fs.readFileSync(path.join(projectRoot, surface.file), 'utf8');

    for (const title of surface.titles) {
      const card = getLinkCardByTitle(surfaceSource, title);

      assert.doesNotMatch(card, /\/probleme-loesungen\/werbeanlage-flackert/, title);
      assert.match(card, /href: '\/probleme-loesungen'/, title);
      checkedServiceLinks += 1;
    }
  }

  assert.equal(checkedServiceLinks, 9);
});
