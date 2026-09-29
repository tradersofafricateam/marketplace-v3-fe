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

const numeric = load('src/lib/helpers/numericInput.ts');
const options = load('src/features/sellerProducts/constants/productOptions.ts');
const steps = load('src/features/sellerProducts/helpers/stepValidation.ts');
const pricing = load('src/features/sellerProducts/helpers/pricing.ts');
const {validateProductForm} = load('src/features/sellerProducts/helpers/validateProductForm.ts', {
  '../constants/productOptions': options,
  './pricing': pricing,
  './variantCombinations': {getMissingColorImages: () => []},
});
const valid = {
  productName:'Coffee',productDescription:'<p>Fresh coffee</p>',countryOfOrigin:'Nigeria',currency:'NGN',categoryIds:['coffee'],productType:'SIMPLE',
  price:'1250.50',discount:'',quantity:'0',supplyCapacity:'1500',unitForSupplyCapacity:'kg',minOrdersAllowed:'1',unitForMinOrder:'kg',
  minDuration:'1',maxDuration:'3',durationUnit:'days',galleryImages:[{}],variantOptions:[],variants:[],variantImagesByColor:{},
};
test('numeric inputs format commas while retaining decimals and reject invalid text', () => {
  assert.equal(numeric.formatNumericInput('1234567.50'), '1,234,567.50');
  assert.equal(numeric.parseNumericInput('1,234.50', true), '1234.50');
  for (const value of ['1e3','-1','+2','abc','12,34','Infinity','1.2.3']) assert.equal(numeric.parseNumericInput(value, true), null);
  assert.equal(numeric.parseNumericInput('1.5', false), null);
  assert.equal(numeric.parseNumericInput('', false), '');
});
test('valid form supports zero stock and rejects fractional stock, infinity and empty rich text', () => {
  assert.deepEqual(validateProductForm(valid), {});
  const errors = validateProductForm({...valid,quantity:'1.5',price:'Infinity',productDescription:'<p>&nbsp;</p>'});
  assert.ok(errors.quantity); assert.ok(errors.price); assert.ok(errors.productDescription);
});
test('each wizard step validates its own fields without requiring later images', () => {
  const errors = validateProductForm({...valid, galleryImages:[],price:''});
  assert.deepEqual(steps.errorsForFields(errors, steps.stepFields.basicInfo), {});
  assert.ok(steps.errorsForFields(errors, steps.stepFields.pricing).price);
  assert.ok(steps.errorsForFields(errors, steps.stepFields.images).galleryImages);
});
test('empty variants and non-finite stock cannot pass validation', () => {
  assert.ok(validateProductForm({...valid,productType:'VARIABLE'}).variants);
  assert.ok(validateProductForm({...valid,productType:'VARIABLE',variants:[{price:10,quantity:NaN,discount:null}]}).variants);
});
test('country and unit choices are comprehensive and existing images satisfy edit validation', () => {
  assert.equal(options.getCountryOptions('en').length, 249);
  assert.ok(options.marketplaceUnits.some((unit) => unit.value === 'm3'));
  assert.ok(validateProductForm({...valid,unitForMinOrder:'invented'}).unitForMinOrder);
  assert.equal(validateProductForm({...valid,galleryImages:[]}, true).galleryImages, undefined);
});
test('create product uses the documented POST /products/ route', async () => {
  const calls=[];
  const api=load('src/features/sellerProducts/api/index.ts', {'../helpers/normalizeSellerProducts': load('src/features/sellerProducts/helpers/normalizeSellerProducts.ts'), '@/lib/axiosInstance':{axiosInstance:{post:async (...args)=>{calls.push(args);return {data:{data:{id:'created'}}};}}}});
  assert.deepEqual(await api.createProduct(valid), {id:'created'});
  assert.equal(calls[0][0], '/products/');
});
