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
const helpers = load('src/features/currencies/helpers/index.ts');

test('API currencies exclude inactive entries and deduplicate codes', () => {
  const result = helpers.normalizeCurrencies([
    {code:'KES',name:'Kenyan Shilling',symbol:'KSh',decimalPlaces:2},
    {code:'USD',name:'Dollar',status:'inactive'},
    {code:'KES',name:'Kenyan Shilling',symbol:'KSh',decimalPlaces:2},
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].code, 'KES');
  assert.equal(helpers.resolveCurrency('USD', result), 'KES');
  assert.equal(helpers.resolveCurrency('USD', []), '');
});

test('invalid responses fail instead of becoming empty currency lists', () => {
  assert.throws(() => helpers.normalizeCurrencies({}));
  assert.throws(() => helpers.normalizeCurrencies([{code:'USD',name:'Dollar',decimalPlaces:-1}]));
  assert.deepEqual(helpers.normalizeCurrencies([]), []);
});

test('formatting preserves amounts and historical currencies with API precision', () => {
  assert.equal(helpers.formatCurrencyAmount(1234.5, 'KES', 'en-US', {code:'KES',name:'Shilling',symbol:'KSh',decimalPlaces:3}), 'KSh\u00a01,234.500');
  assert.equal(helpers.formatCurrencyAmount(42, 'USD', 'en-US'), '$42.00');
  assert.equal(helpers.formatCurrencyAmount(42, 'JPY', 'en-US'), '¥42');
});

test('currency requests forward locale and cancellation and reject API failures', async () => {
  const calls = [];
  let success = true;
  const signal = new AbortController().signal;
  const api = load('src/features/currencies/api/index.ts', {
    '../helpers': helpers,
    '@/lib/axiosInstance': {axiosInstance:{get:async (url, options) => {
      calls.push({url, options});
      return {data:{success,data:[{code:'EUR',name:'Euro'}]}};
    }}},
  });
  assert.equal((await api.getCurrencies('fr', signal))[0].code, 'EUR');
  assert.equal(calls[0].url, '/currencies');
  assert.equal(calls[0].options.headers['Accept-Language'], 'fr');
  assert.equal(calls[0].options.signal, signal);
  success = false;
  await assert.rejects(api.getCurrencies('fr'));
});
