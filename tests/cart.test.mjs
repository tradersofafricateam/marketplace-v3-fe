import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { create } from 'zustand';
function load(file, mocks) {
  const code=ts.transpileModule(fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const module={exports:{}};
  new Function('require','module','exports',code)((name)=>{if(!(name in mocks))throw new Error(name);return mocks[name];},module,module.exports);
  return module.exports;
}
test('cart posts product ID and quantity and only includes a provided variant ID', async () => {
  const calls=[];
  let response={success:true,data:{}};
  const api=load('src/features/cart/api/index.ts',{'@/lib/axiosInstance':{axiosInstance:{post:async(...args)=>{calls.push(args);return {data:response};}}}});
  await api.addCartItem({productId:'product',quantity:2});
  assert.deepEqual(calls[0],['/cart/items',{productId:'product',quantity:2}]);
  await api.addCartItem({productId:'product',variantId:'variant',quantity:3});
  assert.deepEqual(calls[1],['/cart/items',{productId:'product',variantId:'variant',quantity:3}]);
  await api.addCartItem({productId:'product',variantId:'',quantity:1});
  assert.equal('variantId' in calls[2][1],false);
  for (const quantity of [0,-1,1.5,Infinity,NaN]) await assert.rejects(api.addCartItem({productId:'product',quantity}));
  assert.equal(calls.length,3);
  response={success:false};
  await assert.rejects(api.addCartItem({productId:'product',quantity:1}));
});
test('cart requires login, prevents pending writes and refreshes the global cart on success', () => {
  let userId;
  let pending=false;
  let config;
  const writes=[],redirects=[],refreshes=[],successes=[];
  const hook=load('src/features/cart/hooks/useAddToCart.ts',{
    '@tanstack/react-query':{useMutation:(options)=>{config=options;return {mutate:(payload)=>writes.push(payload),isPending:pending};},useQueryClient:()=>({invalidateQueries:(options)=>{invalidations.push(options.queryKey);}})},
    'next-intl':{useTranslations:()=>key=>key},
    'next/navigation':{useRouter:()=>({push:path=>redirects.push(path)}),usePathname:()=>'/en/products/info/product'},
    sonner:{toast:{success:message=>successes.push(message)}},
    '@/store/authStore':{useStore:Object.assign(select=>select({currentUser:userId?{id:userId}:null}),{getState:()=>({currentUser:userId?{id:userId}:null})})},
    '@/store/cartStore':{useCartStore:{getState:()=>({setAccount:()=>{},fetchCart:options=>refreshes.push(options)})}},
    '@/lib/hooks/useGetAllRoutes':{useGetAllRoutes:()=>({routes:{login:'/en/login'}})},
    '@/lib/helpers/promiseError':{promiseErrorFunction:()=>{}},
    '../api':{addCartItem:()=>{}},
  });
  const payload={productId:'product',quantity:1};
  hook.useAddToCart().addToCart(payload);
  assert.equal(writes.length,0);
  assert.ok(redirects[0].startsWith('/en/login?returnUrl='));
  userId='buyer';pending=true;
  hook.useAddToCart().addToCart(payload);
  assert.equal(writes.length,0);
  pending=false;
  hook.useAddToCart().addToCart(payload);
  assert.deepEqual(writes,[payload]);
  config.onSuccess();
  assert.deepEqual(refreshes,[{force:true}]);
  assert.deepEqual(successes,['added']);
  assert.equal(config.retry,false);
});

test('GET cart preserves seller groups and rejects failed or invalid responses', async () => {
  let response={success:true,data:{cartId:'cart',sellerGroups:[{sellerId:'seller',storeName:'Store',items:[{cartItemId:'item',productId:'product',productName:'Avocado',currency:'NGN',quantity:12,finalUnitPrice:1200,unitPrice:1200,subtotal:14400,availableQuantity:20,minimumOrder:{quantity:12,unit:'piece'}}],itemsCount:1,productsSubtotal:14400}],productsSubtotal:14400,currency:'NGN',totalCount:1}};
  const calls=[];
  const api=load('src/features/cart/api/index.ts',{'@/lib/axiosInstance':{axiosInstance:{get:async(...args)=>{calls.push(args);return {data:response};}}}});
  const signal=new AbortController().signal;
  assert.deepEqual(await api.getCart(signal),response.data);
  assert.equal(calls[0][0],'/cart/');assert.equal(calls[0][1].signal,signal);
  assert.equal((await api.getCart()).totalCount,1);
  response={success:true,data:{cartId:null,sellerGroups:[],productsSubtotal:0,currency:'NGN',totalCount:0}};assert.deepEqual(await api.getCart(),response.data);
  for (const data of [{success:false},{success:true,data:null},{success:true,data:'bad'},{success:true,data:[]},{success:true,data:{sellerGroups:[],totalCount:-1}}]) {
    response=data;await assert.rejects(api.getCart());
  }
});
function cartStore() {
  const requests=[];
  const {useCartStore}=load('src/store/cartStore.ts',{
    zustand:{create},'@/features/cart/api':{getCart:(signal)=>new Promise((resolve,reject)=>requests.push({signal,resolve,reject}))},
  });
  return {store:useCartStore,requests};
}
test('global cart skips anonymous requests, deduplicates fetches and refreshes after writes', async () => {
  const {store,requests}=cartStore();
  await store.getState().fetchCart();assert.equal(requests.length,0);
  store.getState().setAccount('buyer');
  const first=store.getState().fetchCart();
  assert.equal(store.getState().fetchCart(),first);
  assert.equal(requests.length,1);
  assert.equal(store.getState().isLoading,true);
  const refresh=store.getState().fetchCart({force:true});
  assert.equal(requests[0].signal.aborted,true);
  requests[1].resolve({sellers:['fresh']});await refresh;
  requests[0].resolve({sellers:['stale']});await first;
  assert.deepEqual(store.getState().cart,{sellers:['fresh']});
  assert.equal(store.getState().isLoaded,true);assert.equal(store.getState().isLoading,false);
});
test('logout and account changes discard old requests and fetch errors remain retryable', async () => {
  const {store,requests}=cartStore();
  store.getState().setAccount('a');const old=store.getState().fetchCart();
  store.getState().setAccount(null);
  assert.equal(requests[0].signal.aborted,true);assert.equal(store.getState().cart,null);
  store.getState().setAccount('b');const current=store.getState().fetchCart();
  requests[0].resolve({sellers:['a']});await old;assert.equal(store.getState().cart,null);
  requests[1].reject(new Error('Offline'));await current;
  assert.equal(store.getState().error,'Offline');assert.equal(store.getState().isLoading,false);
  const retry=store.getState().fetchCart();requests[2].resolve([]);await retry;
  assert.deepEqual(store.getState().cart,[]);assert.equal(store.getState().error,null);
  store.getState().setAccount(null);assert.equal(store.getState().cart,null);
});

test('card adds products without navigation and selects variants inline', () => {
  let config;
  let adding=false;
  const adds=[],routes=[],errors=[];
  const state=[];let cursor=0;
  const {useProductCardCart}=load('src/features/cart/hooks/useProductCardCart.ts',{
    react:{useState:initial=>{const index=cursor++;if(!(index in state))state[index]=initial;return [state[index],value=>{state[index]=value;}];}},
    '@tanstack/react-query':{useMutation:options=>{config=options;return {isPending:false,mutate:()=>{}};}},
    'next-intl':{useLocale:()=> 'en',useTranslations:()=> key=>key},
    'next/navigation':{useRouter:()=>({push:path=>routes.push(path)})},
    sonner:{toast:{error:message=>errors.push(message)}},
    '@/features/products/api':{getPublicProduct:()=>{}},
    '@/lib/hooks/useGetAllRoutes':{useGetAllRoutes:()=>({routes:{productInfo:id=>'/products/'+id}})},
    '@/lib/helpers/promiseError':{promiseErrorFunction:()=>{}},
    './useAddToCart':{useAddToCart:()=>({addToCart:payload=>adds.push(payload),isAdding:adding})},
  });
  const render=()=>{cursor=0;return useProductCardCart('product');};
  render();
  config.onSuccess({productType:'simple',minOrdersAllowed:5,quantity:10});
  assert.deepEqual(adds,[{productId:'product',quantity:5}]);
  assert.deepEqual(routes,[]);
  config.onSuccess({productType:'variable',minOrdersAllowed:2,variants:[
    {id:'red',attributes:{color:'red'},quantity:5},
    {id:'blue',attributes:{color:'blue'},quantity:5},
    {id:'empty',attributes:{color:'green'},quantity:0},
  ]});
  assert.deepEqual(routes,[]);assert.equal(adds.length,1);
  let picker=render();assert.equal(picker.choices.length,2);
  picker.setSelectedId('blue');picker=render();picker.addSelected();
  assert.deepEqual(adds[1],{productId:'product',variantId:'blue',quantity:2});
  assert.equal(render().choices.length,0);
  config.onSuccess({productType:'variable',variants:[{id:'only',quantity:10,attributes:{color:'red'}}]});
  assert.deepEqual(adds[2],{productId:'product',variantId:'only',quantity:1});
  for(const quantity of [0,2,null,undefined,'invalid']) config.onSuccess({productType:'simple',minOrdersAllowed:5,quantity});
  assert.equal(adds.length,3);assert.equal(errors.length,5);
  adding=true;assert.equal(render().isPending,true);
});
