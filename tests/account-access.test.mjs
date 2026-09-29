import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { NextRequest, NextResponse } from 'next/server.js';

const requireModule = createRequire(import.meta.url);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function load(relative, mocks = {}) {
  const file = path.resolve(testDirectory, '..', relative);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (name) => Object.hasOwn(mocks, name) ? mocks[name] : requireModule(name), mod, mod.exports,
  );
  return mod.exports;
}
const routes = load('src/features/auth/helpers/routeAccess.ts');
const access = load('src/features/auth/api/checkAccountAccess.ts');
const proxy = load('src/proxy.ts', {
  'next-intl/middleware': () => () => NextResponse.next(),
  '@/i18n/routing': { routing: { locales: ['en', 'fr', 'es', 'pt', 'sw'], defaultLocale: 'en' } },
  '@/features/auth/api/checkAccountAccess': access,
  '@/features/auth/helpers/routeAccess': routes,
}).default;

const request = (url, token = 'test-token') => new NextRequest(`https://tofa.local${url}`, {
  headers: token ? { cookie: `tofaToken=${token}` } : {},
});

async function withResponse(body, status, run) {
  const previousFetch = global.fetch;
  const previousBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.tofa.test';
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify(body), { status });
  };
  try { await run(calls); } finally {
    global.fetch = previousFetch;
    if (previousBase === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
    else process.env.NEXT_PUBLIC_API_BASE_URL = previousBase;
  }
}

test('only local return destinations are accepted', () => {
  assert.equal(routes.safeReturnUrl('/fr/seller/orders?filter=active#latest'), '/fr/seller/orders?filter=active#latest');
  for (const value of ['https://evil.test', '//evil.test', '/\\evil.test', '/\nevil.test', 'javascript:alert(1)']) {
    assert.equal(routes.safeReturnUrl(value), undefined);
  }
});

test('anonymous account access redirects with the exact intended path and query', async () => {
  for (const route of ['/en/dashboard/settings?tab=addresses', '/en/seller/orders', '/fr/become-seller/status']) {
    const response = await proxy(request(route, null));
    const location = new URL(response.headers.get('location'));
    assert.equal(location.pathname, `/${route.split('/')[1]}/login`);
    assert.equal(location.searchParams.get('returnUrl'), route);
  }
});

for (const [status, destination] of [
  ['not_submitted', '/fr/become-seller'],
  ['pending', '/fr/become-seller/status'],
  ['rejected', '/fr/become-seller/status'],
  ['approved', null],
]) {
  test(`seller route access for ${status}`, async () => {
    await withResponse({ data: { verificationStatus: status } }, 200, async (calls) => {
      const response = await proxy(request('/fr/seller/orders'));
      const location = response.headers.get('location');
      assert.equal(location ? new URL(location).pathname : null, destination);
      assert.equal(calls.length, 1);
      assert.equal(calls[0].options.headers.Authorization, 'Bearer test-token');
      assert.equal(calls[0].options.cache, 'no-store');
      if (!destination) assert.equal(response.headers.get('x-middleware-next'), '1');
    });
  });
}

test('authenticated sellers and buyers can both use the buyer dashboard', async () => {
  await withResponse({ data: { id: 'user-1' } }, 200, async (calls) => {
    const response = await proxy(request('/en/dashboard'));
    assert.equal(response.headers.get('x-middleware-next'), '1');
    assert.equal(calls[0].url, 'https://api.tofa.test/users/me');
  });
});

test('expired credentials return to login', async () => {
  await withResponse({}, 401, async () => {
    const response = await proxy(request('/en/seller'));
    assert.equal(new URL(response.headers.get('location')).pathname, '/en/login');
  });
});

test('failed and malformed verification responses deny access', async () => {
  for (const [body, code] of [[{}, 500], [{ data: { verificationStatus: 'unknown' } }, 200]]) {
    await withResponse(body, code, async () => {
      const response = await proxy(request('/en/seller'));
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('x-middleware-next'), null);
    });
  }
});

test('login honors intended pages before choosing the approved seller default', async () => {
  let status = 'approved';
  const { getLoginDestination } = load('src/features/auth/helpers/loginDestination.ts', {
    './routeAccess': routes,
    '@/features/dashboard/api': { getSellerVerificationStatus: async () => ({ verificationStatus: status }) },
  });
  assert.equal(await getLoginDestination('/en/dashboard?tab=orders', '/en/dashboard', '/en/seller'), '/en/dashboard?tab=orders');
  assert.equal(await getLoginDestination(undefined, '/en/dashboard', '/en/seller'), '/en/seller');
  status = 'pending';
  assert.equal(await getLoginDestination(undefined, '/en/dashboard', '/en/seller'), '/en/dashboard');
  assert.equal(await getLoginDestination('//evil.test', '/en/dashboard', '/en/seller'), '/en/dashboard');
});
