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

const keyHelper=load('src/features/sellerProducts/helpers/variantImageKey.ts');
const mapping=load('src/features/sellerProducts/helpers/mapFormStateToPayload.ts', {'./variantImageKey':keyHelper});
const file=new File(['image'], 'test.png', {type:'image/png'});
const values={productName:' Test ',productDescription:'<p>Details</p>',categoryIds:['cat'],countryOfOrigin:'Nigeria',currency:'NGN',productType:'SIMPLE',price:'1200',discount:'',quantity:'10',barcode:'',supplyCapacity:'100',unitForSupplyCapacity:'kg',minOrdersAllowed:'1',unitForMinOrder:'kg',minDuration:'1',maxDuration:'3',durationUnit:'days',variantOptions:[],variants:[],galleryImages:[file],primaryImageIndex:0,variantImageFiles:{}};
function pipeline(api) {return load('src/features/sellerProducts/helpers/prepareProductPayload.ts', {'../api':api,'./mapFormStateToPayload':mapping,'./variantImageKey':keyHelper});}
test('create and edit send multipart files directly without separate uploads', async () => {
  const calls=[];
  const helper=pipeline({createProduct:async(payload)=>{calls.push(payload);return payload;},updateProduct:async({payload})=>{calls.push(payload);return payload;}});
  const result=await helper.createProductWithImages({...values,categoryIds:['a','b'],galleryImages:[file,new File(['x'],'second.png',{type:'image/png'})],primaryImageIndex:1},'fr');
  await helper.updateProductWithImages('p',values,'en');
  assert.ok(calls.every(payload=>payload instanceof FormData));
  assert.deepEqual(result.getAll('images').map(f=>f.name),['second.png','test.png']);
  assert.deepEqual(result.getAll('categoryIds'),['a','b']);
  assert.equal(result.get('productName'),'Test');
  assert.equal(result.get('sourceLanguage'),'fr');
  assert.equal(result.get('price'),'1200');
  assert.equal(result.has('variants'),false);
});
test('variant files follow submitted rows and existing URLs are retained without ids or SKU', async () => {
  const variantFile=new File(['variant'],'variant.png',{type:'image/png'});
  const rows=[
    {attributes:{color:'none'},price:0,quantity:1},
    {attributes:{color:'saved'},price:20,quantity:1,image:'https://cdn.test/saved.png'},
    {attributes:{color:'empty'},price:20,quantity:1},
    {id:'v',sku:'server-only',attributes:{color:'red'},price:1200,quantity:10,discount:null,image:'https://cdn.test/old.png'},
  ];
  const payload=await pipeline({}).prepareProductPayload({...values,productType:'VARIABLE',variants:rows,variantImageFiles:{[keyHelper.variantImageKey(rows[3].attributes)]:variantFile}},'en');
  const variants=JSON.parse(payload.get('variants'));
  assert.equal(variants.length,3);
  assert.equal(variants[0].image,'https://cdn.test/saved.png');
  assert.equal(variants[1].image,'');
  assert.equal('image' in variants[2],false);
  assert.equal('sku' in variants[2],false);assert.equal('id' in variants[2],false);
  assert.deepEqual(payload.getAll('variantImages').map(f=>f.name),['variant.png']);
  assert.equal(payload.has('price'),false);assert.equal(payload.has('quantity'),false);
});
test('edit omits stored gallery URLs and preserves source language and logistics', async () => {
  const payload=await pipeline({}).prepareProductPayload({...values,sourceLanguage:'es',galleryImages:[],existingImages:[{url:'https://cdn.test/existing.png'}],weight:'2.5',weightUnit:'kg'},'fr');
  assert.equal(payload.has('images'),false);assert.equal(payload.get('sourceLanguage'),'es');
  assert.equal(payload.get('weight'),'2.5');assert.equal(payload.get('weightUnit'),'kg');
});
test('create and update override the JSON content type for browser multipart boundaries', async () => {
  const calls=[];
  const handler=async(...args)=>{calls.push(args);return {data:{data:{id:'p'}}};};
  const api=load('src/features/sellerProducts/api/index.ts', {'../helpers/normalizeSellerProducts':{},'@/lib/axiosInstance':{axiosInstance:{post:handler,patch:handler}}});
  const form=new FormData();form.append('images',file);
  await api.createProduct(form);await api.updateProduct({id:'p',payload:form});
  for(const [,payload,config] of calls){assert.equal(payload,form);assert.equal(config.headers['Content-Type'],undefined);}
});
test('seller detail, update, delete, image deletion, status and inventory use the supplied routes', async () => {
  const calls=[];
  const handler=(method)=>async(url,payload)=>{calls.push({method,url,payload});return {data:{data:{id:'p',productType:'simple'}}};};
  const api=load('src/features/sellerProducts/api/index.ts', {'../helpers/normalizeSellerProducts':{},'@/lib/axiosInstance':{axiosInstance:{get:handler('GET'),patch:handler('PATCH'),delete:handler('DELETE')}}});
  await api.getSellerProduct('p','fr');await api.updateProduct({id:'p',payload:{}});await api.deleteProduct('p');await api.deleteProductImage({productId:'p',imageId:'i'});await api.updateProductStatus({id:'p',status:'pending_approval'});await api.updateProductInventory('p',{quantity:0});
  assert.deepEqual(calls.map(c=>c.url),['/products/mine/p','/products/p','/products/p','/products/p/images/i','/products/p/status','/products/p/inventory']);
  assert.deepEqual(calls[4].payload,{status:'pending_approval'});assert.deepEqual(calls[5].payload,{quantity:0});
});
const queries=load('src/features/products/helpers/publicProductQuery.ts');
test('public filters translate UI aliases to the API contract', () => {
  const query=queries.publicProductQuery(new URLSearchParams('q=avocado&category=c&minPrice=0&maxPrice=5000&rating=4&inStock=1&hasDiscount=false&sort=price-low&sellerId=s&countryOfOrigin=Nigeria&page=2'));
  assert.equal(query.search,'avocado');assert.equal(query.categoryId,'c');assert.equal(query.minPrice,0);assert.equal(query.minRating,4);assert.equal(query.inventoryStatus,'in_stock');assert.equal(query.hasDiscount,false);assert.equal(query.sortBy,'price_low_to_high');assert.equal(query.sellerId,'s');assert.equal(query.page,2);
});
test('public request builder excludes blank and unsupported parameters while retaining zero and false', () => {
  const api=load('src/features/products/api/index.ts', {'@/lib/axiosInstance':{}});
  assert.deepEqual(api.publicProductParams({search:' ',minPrice:0,hasDiscount:false,verified:true,lang:'fr'}),{minPrice:0,hasDiscount:false,lang:'fr'});
});
test('saved flags preserve authenticated values and remain absent for anonymous products', () => {
  const helpers=load('src/features/products/helpers/publicProduct.ts');
  const product={id:'p',productName:{en:'Avocado'},price:5000,currency:'NGN',productType:'simple'};
  assert.equal(helpers.publicProductCard({...product,isSaved:true},'en').isInWishList,true);
  assert.equal('isInWishList' in helpers.publicProductCard(product,'en'),false);
  assert.equal(helpers.publicProductDetail({...product,isSaved:false}).isSaved,false);
});


test('invalid image files block product mutations', async () => {
  let writes=0;
  const helper=pipeline({createProduct:async()=>{writes++;},updateProduct:async()=>{writes++;}});
  const invalid={...values,galleryImages:[new File(['x'],'bad.gif',{type:'image/gif'})]};
  await assert.rejects(helper.createProductWithImages(invalid,'en'));
  await assert.rejects(helper.updateProductWithImages('p',invalid,'en'));
  await assert.rejects(helper.createProductWithImages({...values,galleryImages:[]},'en'));
  assert.equal(writes,0);
});
test('public product caches separate anonymous and authenticated saved state', () => {
  let state={currentUser:null,isAuthInitialized:true};
  const hooks=load('src/features/products/hooks/usePublicProducts.ts',{
    'next-intl':{useLocale:()=> 'en'}, '@/store/authStore':{useStore:(select)=>select(state)},
    '@/lib/hooks/useFreshQuery':{useFreshQuery:options=>options},'../api':{},'../helpers/publicProduct':{},
  });
  const anonymous=hooks.usePublicProducts();
  state={currentUser:{id:'user-a'},isAuthInitialized:true};
  const authenticated=hooks.usePublicProducts();
  assert.notDeepEqual(anonymous.queryKey,authenticated.queryKey);
  assert.equal(authenticated.gcTime,0);
  assert.notDeepEqual(hooks.usePublicProduct('p').queryKey,anonymous.queryKey);
});

test('status updates refresh both seller detail and list before completing', async () => {
  let options;
  const keys = [];
  const updateProductStatus = async () => {};
  const hook = load('src/features/sellerProducts/hooks/useUpdateProductStatus.ts', {
    '@tanstack/react-query': {
      useMutation: (config) => { options = config; return { mutate: () => {}, isPending: false }; },
      useQueryClient: () => ({ invalidateQueries: async ({ queryKey }) => { keys.push(queryKey); } }),
    },
    sonner: { toast: { success: () => {} } },
    'next-intl': { useTranslations: () => (key) => key },
    '../api': { updateProductStatus },
    '@/lib/helpers/promiseError': { promiseErrorFunction: () => {} },
  });
  hook.useUpdateProductStatus();
  assert.equal(options.mutationFn, updateProductStatus);
  await options.onSuccess({}, { id: 'draft-id', status: 'pending_approval' });
  assert.deepEqual(keys, [['sellerProduct', 'draft-id'], ['sellerProducts']]);
});

test('multipart option values and attributes are lowercase, including edited values', async () => {
  const attributes={Color:'BLUE',Weight:'KG'};
  const payload=await pipeline({}).prepareProductPayload({...values,productType:'VARIABLE',variantOptions:[{name:'Color',values:['BLUE','Red'],sortOrder:0}],variants:[{attributes,price:10,quantity:0,discount:null}],variantImageFiles:{}},'en');
  assert.deepEqual(JSON.parse(payload.get('variantOptions'))[0].values,['blue','red']);
  assert.deepEqual(JSON.parse(payload.get('variants'))[0].attributes,{Color:'blue',Weight:'kg'});
  assert.equal(payload.has('variantImages'),false);
  assert.equal(keyHelper.variantImageKey(attributes),keyHelper.variantImageKey({Color:'blue',Weight:'kg'}));
});

test('create unwraps the nested success response and returns the product ID for navigation', async () => {
  const product={id:'343d6edf-ac8c-468f-b221-59d973851196',productType:'variable',images:[],variants:[]};
  let response={success:true,message:'Product created successfully.',data:{success:true,data:product}};
  const api=load('src/features/sellerProducts/api/index.ts', {'../helpers/normalizeSellerProducts':{},'@/lib/axiosInstance':{axiosInstance:{post:async()=>({data:response}),get:async()=>({data:response}),patch:async()=>({data:response})}}});
  const created=await api.createProduct(new FormData());
  assert.deepEqual(created,product);
  assert.equal((await api.getSellerProduct(created.id,'en')).id,product.id);
  assert.equal((await api.updateProduct({id:created.id,payload:new FormData()})).id,product.id);
  response={success:true,data:{success:false,data:product}};
  await assert.rejects(api.createProduct(new FormData()),/Product request failed/);
  for(const data of [{},null,{id:''}]) {
    response={success:true,data:{success:true,data}};
    await assert.rejects(api.createProduct(new FormData()),/product ID/);
  }
});
