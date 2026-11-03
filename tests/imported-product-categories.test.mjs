import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createTranslator } from 'next-intl';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
const messages = JSON.parse(fs.readFileSync(path.join(root, 'messages/en.json'), 'utf8'));
// Synthetic data using the category envelope observed on the isolated staging API.
const product = {
  id: 'qa-product', sellerId: 'qa-seller', productType: 'simple',
  productName: { en: 'QA coffee' }, productDescription: { en: 'Coffee description' },
  countryOfOrigin: 'Nigeria', currency: 'NGN', price: 10, discount: null, quantity: null,
  supplyCapacity: 10, unitForSupplyCapacity: 'kg', minOrdersAllowed: 1, unitForMinOrder: 'kg',
  minDuration: 1, maxDuration: 2, durationUnit: 'days', status: 'draft',
  inventoryStatus: 'out_of_stock', totalStock: 0, images: [],
  categoryIds: ['qa-category'],
  categories: [{ id: 'qa-category', name: { en: 'Assigned agriculture', fr: 'Agriculture conservée' }, slug: 'qa-category' }],
};

function context({ locale = 'en', publicCategories = [], queryError = false } = {}) {
  const cache = new Map();
  function load(relative) {
    const filename = path.isAbsolute(relative) ? relative : path.join(root, relative);
    if (cache.has(filename)) return cache.get(filename);
    if ([path.join(root, 'src/features/categories/hooks/useCategories.ts'), path.join(root, 'src/features/sellerProducts/hooks/useCategories.ts')].includes(filename)) {
      return { useCategories: () => ({ data: publicCategories, isLoadingCurrentData: false, isError: queryError, refetch() {} }) };
    }
    if (filename === path.join(root, 'src/lib/hooks/useCurrency/useCurrency.ts')) {
      return { useCurrency: () => ({ formatMoney: (value, currency) => `${currency} ${value}` }) };
    }
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const compiled = { exports: {} };
    cache.set(filename, compiled.exports);
    new Function('require', 'module', 'exports', code)((name) => {
      if (name === 'next-intl') return { useLocale: () => locale, useTranslations: namespace => createTranslator({ locale: 'en', messages, namespace }) };
      if (name === '@/lib/axiosInstance') return { axiosInstance: { get: async () => ({ data: { success: true, data: product } }) } };
      if (name.startsWith('.') || name.startsWith('@/')) {
        const base = name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : path.resolve(path.dirname(filename), name);
        const resolved = [base + '.tsx', base + '.ts', path.join(base, 'index.ts')].find(candidate => fs.existsSync(candidate));
        if (!resolved) throw new Error(`Cannot resolve ${name}`);
        return load(resolved);
      }
      return require(name);
    }, compiled, compiled.exports);
    cache.set(filename, compiled.exports);
    return compiled.exports;
  }
  return { load, render: (file, props) => renderToStaticMarkup(React.createElement(load(file).default, props)) };
}

const sidebar = 'src/features/sellerProducts/components/organisms/ProductDetailSidebar/ProductDetailSidebar.tsx';
const review = 'src/features/sellerProducts/components/organisms/ProductReviewStep/ProductReviewStep.tsx';
const picker = 'src/features/sellerProducts/components/molecules/CategoryMultiSelect/CategoryMultiSelect.tsx';

test('seller detail retains assigned category names when the public category list is empty', async () => {
  const view = context();
  const saved = await view.load('src/features/sellerProducts/api/index.ts').getSellerProduct(product.id);
  const html = view.render(sidebar, { product: saved, formatMoney: (amount, code) => `${code} ${amount}` });
  assert.match(html, /Assigned agriculture/);
  assert.doesNotMatch(html, /No categories assigned/);
});

test('saved draft review carries its assigned categories through the edit form mapping', () => {
  const view = context();
  const values = view.load('src/features/sellerProducts/helpers/mapProductToFormState.ts').mapProductToFormState(product);
  const html = view.render(review, { values, isEditing: true });
  assert.match(html, /Assigned agriculture/);
  assert.deepEqual(values.categoryIds, ['qa-category']);
  assert.equal(values.quantity, ''); // Missing stock must still require an owner decision.
});

test('edit selection names an unavailable assigned category without offering it as a new option', () => {
  const view = context();
  const html = view.render(picker, { selectedIds: product.categoryIds, existingCategories: product.categories, onChange() {} });
  assert.match(html, /Assigned agriculture/);
  assert.doesNotMatch(html, /aria-pressed="false"/);
});

test('assigned labels use the selected locale even if the public category request fails', () => {
  const view = context({ locale: 'fr', queryError: true });
  const html = view.render(sidebar, { product, formatMoney: String });
  assert.match(html, /Agriculture conservée/);
  assert.doesNotMatch(html, /No categories assigned/);
});

test('an unresolved assigned ID is distinguished from a genuinely uncategorized product', () => {
  const view = context();
  const html = view.render(sidebar, { product: { ...product, categories: [] }, formatMoney: String });
  assert.match(html, /Assigned category unavailable/);
  assert.doesNotMatch(html, /No categories assigned/);
  assert.match(view.render(sidebar, { product: { ...product, categoryIds: [], categories: [] }, formatMoney: String }), /No categories assigned/);
});

test('assigned category display metadata never changes the multipart update contract', () => {
  const view = context();
  const values = view.load('src/features/sellerProducts/helpers/mapProductToFormState.ts').mapProductToFormState(product);
  const form = view.load('src/features/sellerProducts/helpers/mapFormStateToPayload.ts').mapFormStateToPayload(values);
  assert.deepEqual(form.getAll('categoryIds'), ['qa-category']);
  assert.equal(form.has('existingCategories'), false);
  assert.equal(form.has('categories'), false);
  assert.equal(form.has('status'), false);
});

test('seller detail distinguishes a missing price from an explicitly entered zero', () => {
  const view = context();
  const html = view.render(sidebar, { product: { ...product, productType: 'SIMPLE', price: null, discount: 10 }, formatMoney: (value, code) => `${code} ${value}` });
  assert.match(html, /Price not set/);
  assert.doesNotMatch(html, /NGN 0/);
  assert.doesNotMatch(html, /Final price/);
  assert.match(view.render(sidebar, { product: { ...product, productType: 'SIMPLE', price: 0 }, formatMoney: (value, code) => `${code} ${value}` }), /NGN 0/);
});

test('draft review leaves a missing price unset instead of displaying a zero quote', () => {
  const view = context();
  const values = view.load('src/features/sellerProducts/helpers/mapProductToFormState.ts').mapProductToFormState({ ...product, price: null });
  const html = view.render(review, { values, isEditing: true });
  assert.match(html, /Price not set/);
  assert.doesNotMatch(html, /NGN 0/);
  assert.equal(values.price, '');
});
