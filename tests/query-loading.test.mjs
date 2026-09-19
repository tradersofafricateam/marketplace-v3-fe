import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { QueryClient, QueryObserver } from '@tanstack/react-query';

function load(file, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => {
    if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`);
    return mocks[name];
  }, compiled, compiled.exports);
  return compiled.exports;
}
const state = load('src/lib/query/currentQueryState.ts');

function harness(client) {
  let observer;
  const { useFreshQuery } = load('src/lib/hooks/useFreshQuery.ts', {
    '@/lib/query/currentQueryState': state,
    '@tanstack/react-query': {
      useQuery(options) {
        const optimistic = { ...options, _optimisticResults: 'optimistic' };
        observer ??= new QueryObserver(client, optimistic);
        return observer.getOptimisticResult(optimistic);
      },
    },
  });
  return { read: useFreshQuery, observer: () => observer };
}

for (const outcome of ['empty', 'error']) {
  test(`cached products stay hidden until the current request resolves to ${outcome}`, async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
    const key = ['sellerProducts', 'seller-a', {}];
    client.setQueryData(key, { items: [{ id: 'old-product' }] });
    let resolve, reject;
    const pending = new Promise((res, rej) => { resolve = res; reject = rej; });
    const hook = harness(client);
    const first = hook.read({ queryKey: key, queryFn: () => pending, staleTime: Infinity });
    assert.equal(first.isLoadingCurrentData, true);
    assert.equal(first.data, undefined);
    const observer = hook.observer();
    const settled = new Promise((done) => {
      observer.subscribe((result) => { if (!result.isFetching) done(result); });
    });
    if (outcome === 'empty') resolve({ items: [] });
    else reject(new Error('Service unavailable'));
    const result = await settled;
    const view = state.currentQueryState(result);
    assert.equal(view.isLoadingCurrentData, false);
    if (outcome === 'empty') assert.deepEqual(view.data, { items: [] });
    else { assert.equal(result.isError, true); assert.equal(view.data, undefined); }
    observer.destroy();
    client.clear();
  });
}

test('another user or filter cannot display cached products from a different key', () => {
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  client.setQueryData(['sellerProducts', 'seller-a', {}], { items: [{ id: 'private' }] });
  for (const key of [['sellerProducts', 'seller-b', {}], ['sellerProducts', 'seller-a', { status: 'draft' }]]) {
    const hook = harness(client);
    const result = hook.read({ queryKey: key, queryFn: async () => ({ items: [] }) });
    assert.equal(result.data, undefined);
    assert.equal(result.isLoadingCurrentData, true);
    hook.observer().destroy();
  }
  client.clear();
});

test('placeholder results never become visible data', () => {
  const result = state.currentQueryState({ data: { items: ['old'] }, isPending: false, isFetching: false, isError: false, isPlaceholderData: true });
  assert.equal(result.data, undefined);
  assert.equal(result.isLoadingCurrentData, true);
});
