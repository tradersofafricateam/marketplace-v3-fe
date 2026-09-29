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

const helpers = load('src/features/sellerProducts/helpers/normalizeSellerProducts.ts');
const product = {id:'avocado',productName:{en:'Avocado'},productType:'simple',status:'draft',inventoryStatus:'in_stock',price:5000,finalPrice:4850,currency:'NGN',totalStock:100000,images:[],mainImage:null,updatedAt:'2026-09-19T01:26:05.000Z'};
const response = {success:true,data:[product],pagination:{page:1,limit:20,total:1,totalPages:1}};
test('maps the documented envelope and lowercase product type to the list model', () => {
  const result=helpers.normalizeSellerProducts(response);
  assert.equal(result.items[0].productType,'SIMPLE');
  assert.equal(result.items[0].finalPrice,4850);
  assert.deepEqual(result.items[0].images,[]);
  assert.deepEqual([result.page,result.pageSize,result.total,result.totalPages],[1,20,1,1]);
});
test('preserves variable products and empty catalogue pagination', () => {
  assert.equal(helpers.normalizeSellerProducts({...response,data:[{...product,productType:'variable',price:null,finalPrice:null}]}).items[0].productType,'VARIABLE');
  assert.deepEqual(helpers.normalizeSellerProducts({...response,data:[],pagination:{page:1,limit:20,total:0,totalPages:0}}).items,[]);
});
test('malformed responses fail rather than displaying an empty state or crashing the table', () => {
  for(const value of [{}, {...response,data:{}}, {...response,pagination:null}, {...response,success:false}, {...response,data:[{...product,images:null}]}, {...response,pagination:{...response.pagination,limit:0}}]) assert.throws(()=>helpers.normalizeSellerProducts(value));
});
test('seller list request preserves filters and cancellation and omits empty search', async () => {
  const calls=[];
  const api=load('src/features/sellerProducts/api/index.ts', {
    '../helpers/normalizeSellerProducts':helpers,
    '@/lib/axiosInstance':{axiosInstance:{get:async (url,options)=>{calls.push({url,options});return {data:response};}}},
  });
  const signal=new AbortController().signal;
  const result=await api.getSellerProducts({page:2,limit:20,status:'draft',search:'  '},signal);
  assert.equal(calls[0].url,'/products/mine');
  assert.deepEqual(calls[0].options.params,{page:2,limit:20,status:'draft'});
  assert.equal(calls[0].options.signal,signal);
  assert.equal(result.items[0].id,'avocado');
});
