import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => {
    if (!(name in mocks)) throw new Error(`Unexpected import ${name}`);
    return mocks[name];
  }, compiled, compiled.exports);
  return compiled.exports;
}
const helpers = load('src/features/categories/helpers/index.ts');

test('category names use the selected language with English fallback', () => {
  const result = helpers.normalizeCategories([
    { id: 'a', name: { en: 'Agriculture', fr: 'Agriculture FR' } },
    { id: 'b', name: { en: 'Construction' } },
    { id: 'c', name: 'Already translated' },
  ], 'fr');
  assert.deepEqual(result.map((category) => category.name), ['Agriculture FR', 'Construction', 'Already translated']);
});

test('inactive/deleted categories are excluded and hierarchy is preserved', () => {
  const result = helpers.normalizeCategories([
    { id: 'parent', name: 'Parent', children: [{ id: 'child', name: 'Child' }, { id: 'retired', name: 'Retired', status: 'archived' }] },
    { id: 'hidden', name: 'Hidden', status: 'inactive' },
    { id: 'deleted', name: 'Deleted', deletedAt: '2026-01-01' },
  ], 'en');
  assert.deepEqual(helpers.flattenCategories(result).map((item) => item.id), ['parent', 'child']);
  assert.equal(result[0].children[0].parentId, 'parent');
});

test('all paginated categories are fetched and repeated IDs deduplicated', async () => {
  const calls = [];
  const signal = new AbortController().signal;
  const api = load('src/features/categories/api/index.ts', {
    '../helpers': helpers,
    '@/lib/axiosInstance': { axiosInstance: { get: async (url, options) => {
      calls.push({ url, options });
      return { data: { success: true, pagination: { totalPages: 2 }, data: options.params.page === 1
        ? [{ id: 'a', name: 'A' }] : [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }] } };
    } } },
  });
  assert.deepEqual((await api.getCategories('fr', signal)).map((item) => item.id), ['a', 'b']);
  assert.deepEqual(calls.map((call) => call.options.params.page), [1, 2]);
  assert.equal(calls[0].options.headers['Accept-Language'], 'fr');
  assert.equal(calls[0].options.signal, signal);
});

test('malformed category responses fail instead of showing a false empty state', () => {
  assert.throws(() => helpers.normalizeCategories({}, 'en'));
  assert.throws(() => helpers.normalizeCategories([{ id: 'a' }], 'en'));
  assert.deepEqual(helpers.normalizeCategories([], 'en'), []);
});

test('category cache keys separate locale, account and preferred language', () => {
  let state = { currentUser: null };
  let locale = 'en';
  const hooks = load('src/features/categories/hooks/useCategories.ts', {
    'next-intl': { useLocale: () => locale },
    '@/lib/hooks/useFreshQuery': { useFreshQuery: (options) => options },
    '@/store/authStore': { useStore: (selector) => selector(state) },
    '../api': { getCategories() {}, getCategoryTree() {} },
  });
  const anonymous = hooks.useCategories().queryKey;
  locale = 'fr';
  assert.notDeepEqual(hooks.useCategories().queryKey, anonymous);
  state = { currentUser: { id: 'user-a', selectedLanguage: 'pt' } };
  assert.deepEqual(hooks.useCategories().queryKey, ['categories', 'list', 'fr', 'pt', 'user-a']);
  assert.equal(hooks.useCategoryTree().queryKey[1], 'tree');
});
