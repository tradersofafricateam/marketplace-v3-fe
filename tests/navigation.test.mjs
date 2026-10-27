import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => name in mocks ? mocks[name] : name === '@/lib/constants/navigationStyles' ? load('src/lib/constants/navigationStyles.ts') : require(name), compiled, compiled.exports);
  return compiled.exports;
}
const helpers = load('src/features/categories/helpers/index.ts');
test('full-width account navigation keeps guest and authenticated destinations distinct', () => {
  const renderAccount = (user) => {
    const Component = load('src/components/molecules/AccountMegaMenu/AccountMegaMenu.tsx', {
      'next/link': { default: ({ children, ...props }) => React.createElement('a', props, children), __esModule: true },
      'next-intl': { useTranslations: () => (key) => key },
      'next/navigation': { usePathname: () => '/en/dashboard' },
      '@/store/authStore': { useStore: (selector) => selector({ currentUser: user }) },
      '@/lib/hooks/useGetAllRoutes': { useGetAllRoutes: () => ({ routes: { login: '/en/login' } }) },
      '@/lib/hooks/useAccountLinks': { useAccountLinks: () => ({
        authLinks: [{ label: 'Login', href: '/en/login' }, { label: 'Register', href: '/en/register' }],
        dashboardLinks: [{ label: 'Dashboard', href: '/en/dashboard' }, { label: 'Orders', href: '/en/dashboard/orders' }, { label: 'Settings', href: '/en/dashboard/settings' }, { label: 'Logout', onClick() {} }],
      }) },
    }).default;
    return renderToStaticMarkup(React.createElement(Component, { onNavigate() {} }));
  };
  const guest = renderAccount(null);
  assert.match(guest, /href="\/en\/login"/);
  assert.match(guest, /href="\/en\/register"/);
  assert.doesNotMatch(guest, /href="\/en\/dashboard/);
  const signedIn = renderAccount({ firstName: 'Amara' });
  assert.match(signedIn, /Amara/);
  assert.match(signedIn, /href="\/en\/dashboard\/orders"/);
  assert.match(signedIn, /href="\/en\/dashboard\/settings"/);
  assert.match(signedIn, /<button[^>]*>Logout<\/button>/);
  assert.doesNotMatch(signedIn, /href="\/en\/login"/);
});

test('category mega menu handles loading, failure, and selected category routes', () => {
  const renderMega = (query, selected = '') => {
    const Component = load('src/features/categories/components/organisms/CategoryMegaMenu/CategoryMegaMenu.tsx', {
      'next/link': { default: ({ children, ...props }) => React.createElement('a', props, children), __esModule: true },
      'next/navigation': { useSearchParams: () => new URLSearchParams({ category: selected }) },
      'next-intl': { useTranslations: () => (key) => key },
      '@/components/ui/skeleton': { Skeleton: (props) => React.createElement('div', props) },
      '../../atoms/CategoryArtwork/CategoryArtwork': { default: () => null, __esModule: true },
      '@/lib/hooks/useGetAllRoutes': { useGetAllRoutes: () => ({ routes: { categories: '/en/categories', products: '/en/products', categoryInfo: (id) => `/en/products?category=${encodeURIComponent(id)}` } }) },
      '../../../hooks/useCategories': { useCategoryTree: () => query },
      '../../../helpers': helpers,
    }).default;
    return renderToStaticMarkup(React.createElement(Component, { onNavigate() {} }));
  };
  assert.match(renderMega({ isLoadingCurrentData: true }), /role="status"/);
  const failed = renderMega({ isError: true, isFetching: true });
  assert.match(failed, /role="alert"/); assert.match(failed, /disabled=""/);
  const empty = renderMega({ data: [] });
  assert.match(empty, />empty</);
  assert.match(empty, /href="\/en\/products"/);
  const html = renderMega({ data: [
    { id: 'root-a', name: 'Food', children: [{ id: 'rice', name: 'Rice', children: [] }] },
    { id: 'root-b', name: 'Textiles', children: [{ id: 'cotton & linen', name: 'Cotton', children: [] }] },
  ] }, 'cotton & linen');
  assert.match(html, /<h2><a[^>]*>Textiles/);
  assert.match(html, /href="\/en\/products\?category=cotton%20%26%20linen"[^>]*aria-current="page"/);
  const nestedCatalogue = renderMega({ data: [
    ...Array.from({ length: 7 }, (_, index) => ({ id: `leaf-${index}`, name: `Leaf ${index}`, children: [] })),
    { id: 'root', name: 'Textiles', children: [{ id: 'cotton & linen', name: 'Cotton', children: [] }] },
  ] }, 'cotton & linen');
  assert.match(nestedCatalogue, /aria-pressed="true"/);
  assert.match(nestedCatalogue, /href="\/en\/products\?category=cotton%20%26%20linen"[^>]*aria-current="page"/);
  const single = renderMega({ data: [{ id: 'cements', name: 'Cements', children: [] }] });
  assert.match(single, /href="\/en\/products\?category=cements"/);
  assert.doesNotMatch(single, /aria-pressed/);
  const many = renderMega({ data: Array.from({ length: 8 }, (_, index) => ({ id: String(index), name: `Category ${index}`, children: [] })) });
  assert.equal((many.match(/href="\/en\/products\?category=/g) || []).length, 8);

});
