import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
function load(file,mocks={}) {
  const code=ts.transpileModule(fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const module={exports:{}};
  new Function('require','module','exports',code)((name)=>{if(!(name in mocks))throw new Error(`Unexpected import ${name}`);return mocks[name];},module,module.exports);
  return module.exports;
}
const rules=load('src/features/cart/helpers/cartRules.ts');
const deliveryRules=load('src/features/checkout/helpers/checkoutRules.ts');
const item={cartItemId:'item',productId:'product',quantity:12,minimumOrder:{quantity:12,unit:'piece'},availableQuantity:20,currency:'NGN',subtotal:14400};
const cart={cartId:'cart',sellerGroups:[{sellerId:'seller',storeName:'Store',items:[item],itemsCount:1,productsSubtotal:14400}],currency:'NGN',totalCount:1,productsSubtotal:14400};
const quote={quoteId:'quote',providerId:'provider',providerName:'Provider',amount:10,currency:'NGN',estimatedDelivery:{min:2,max:3,unit:'business_days'},expiresAt:new Date(Date.now()+3600000).toISOString()};
const options={sellerGroups:[{sellerId:'seller',integratedOptions:[quote],sellerArrangedOption:{available:true},buyerArrangedOption:{available:true}}]};
test('cart eligibility enforces stock, MOQ and one currency and supports decimal quantities',()=>{
  assert.equal(rules.canCheckout(cart),true);
  assert.equal(rules.validCartQuantity(1.5,{minimumOrder:{quantity:0.5},availableQuantity:2}),true);
  for(const quantity of [0,11,21,NaN,Infinity]) assert.equal(rules.validCartQuantity(quantity,item),false);
  assert.equal(rules.canCheckout({...cart,totalCount:0}),false);
  assert.equal(rules.canCheckout({...cart,sellerGroups:[{...cart.sellerGroups[0],items:[{...item,currency:'USD'}]}]}),false);
  assert.notEqual(rules.cartRevision(cart),rules.cartRevision({...cart,sellerGroups:[{...cart.sellerGroups[0],items:[{...item,quantity:13}]}]}));
});
test('delivery requires every seller and rejects expired quotes and invalid external quote IDs',()=>{
  const selection={sellerId:'seller',type:'integrated_logistics',quoteId:'quote'};
  assert.equal(deliveryRules.deliveryIsComplete(options,[selection],['seller']),true);
  assert.equal(deliveryRules.deliveryIsComplete(options,[selection],['seller','missing']),false);
  assert.equal(deliveryRules.deliveryIsComplete(options,[selection],['seller'],Date.now()+7200000),false);
  assert.equal(deliveryRules.deliveryIsComplete(options,[{sellerId:'seller',type:'seller_arranged',quoteId:null}],['seller']),true);
  assert.equal(deliveryRules.deliveryIsComplete(options,[{sellerId:'seller',type:'buyer_arranged',quoteId:'bad'}],['seller']),false);
});
test('cart quantity, removal and clearing use item IDs and send no client prices',async()=>{
  const calls=[];
  const api=load('src/features/cart/api/index.ts',{'@/lib/axiosInstance':{axiosInstance:{patch:async(...args)=>{calls.push(['patch',...args]);return {data:{success:true}};},delete:async(...args)=>{calls.push(['delete',...args]);return {data:{success:true}};}}}});
  await api.updateCartItem('item/id',15);await api.removeCartItem('item/id');await api.clearCart();
  assert.deepEqual(calls,[['patch','/cart/items/item%2Fid',{quantity:15}],['delete','/cart/items/item%2Fid'],['delete','/cart']]);
  await assert.rejects(api.updateCartItem('item',0));
});
test('checkout API uses documented endpoints and never submits totals or logistics amounts',async()=>{
  const calls=[];
  let response={success:true,data:{}};
  const handler=method=>async(url,payload,config)=>{calls.push({method,url,payload,config});return {data:response};};
  const api=load('src/features/checkout/api/index.ts',{'@/lib/axiosInstance':{axiosInstance:{get:handler('GET'),post:handler('POST'),patch:handler('PATCH')}}});
  response={success:true,data:[]};await api.getAddresses();await api.getPaymentMethods();
  response={success:true,data:{id:'address'}};await api.addAddress({recipientName:'Buyer'});
  response={success:true,data:options};await api.getDeliveryOptions('address');
  await api.selectDelivery([{sellerId:'seller',type:'buyer_arranged',quoteId:null}]);
  response={success:true,data:{appliedSellerGroups:['seller'],unavailableSellerGroups:[]}};await api.applyProvider('provider');
  await api.selectPayment('bank');
  response={success:true,data:{sellerGroups:[],summary:{productsTotal:100,logisticsTotal:0,totalAmount:100,currency:'NGN'},deliveryAddress:{id:'address'},paymentMethod:{code:'bank'}}};await api.getCheckoutPreview();
  response={success:true,data:{checkoutId:'session',totalAmount:100,currency:'NGN',expiresAt:quote.expiresAt}};await api.createCheckout('Office hours');
  assert.deepEqual(calls.map(call=>call.url),['/users/addresses','/checkout/payment-methods','/users/addresses','/checkout/address','/checkout/delivery-options','/checkout/delivery-options/select','/checkout/delivery-options/apply-provider','/checkout/payment-method','/checkout/preview','/checkout']);
  assert.deepEqual(calls[3].payload,{deliveryAddressId:'address'});
  assert.deepEqual(calls[6].payload,{providerId:'provider',applyTo:'eligible_seller_groups'});
  assert.deepEqual(calls.at(-1).payload,{notes:'Office hours'});
  response={success:false};await assert.rejects(api.createCheckout(''));
  response={success:true,data:{}};await assert.rejects(api.createCheckout(''));await assert.rejects(api.getDeliveryOptions('address'));
});
test('checkout auto-selects default address, gates stages, and creates only a session without clearing cart',async()=>{
  let cursor=0;let refs=0;let userId='buyer';let creations=0;let refreshes=0;
  const state=[],references=[],queries=[],mutations=[],saved=[];
  const addresses=[{id:'office',isDefault:true},{id:'warehouse',isDefault:false}];
  const preview={summary:{productsTotal:14400,logisticsTotal:0,totalAmount:14400,currency:'NGN'},sellerGroups:[],paymentMethod:{code:'bank'}};
  const api={getAddresses:async()=>addresses,getDeliveryOptions:async()=>options,getPaymentMethods:async()=>[{code:'bank'}],getCheckoutPreview:async()=>preview,
    selectDelivery:async(value)=>saved.push(value),selectPayment:async(code)=>saved.push(code),createCheckout:async()=>{creations++;return {checkoutId:'session',expiresAt:quote.expiresAt};},addAddress:async()=>({id:'new'}),applyProvider:async()=>({appliedSellerGroups:['seller'],unavailableSellerGroups:[]})};
  const hook=load('src/features/checkout/hooks/useCheckout.ts',{
    react:{useState:initial=>{const index=cursor++;if(!(index in state))state[index]=typeof initial==='function'?initial():initial;return [state[index],value=>{state[index]=typeof value==='function'?value(state[index]):value;}];},useRef:initial=>{const index=refs++;return references[index]??(references[index]={current:initial});}},
    '@tanstack/react-query':{useQueryClient:()=>({invalidateQueries:async()=>{}}),useMutation:config=>{mutations.push(config);return {isPending:false};},useQuery:config=>{
      queries.push(config);const key=config.queryKey[3];return {data:key==='addresses'?addresses:key==='options'?options:key==='methods'?[{code:'bank'}]:preview,isFetching:false};
    }},
    'next-intl':{useLocale:()=> 'en',useTranslations:()=>key=>key},sonner:{toast:{success:()=>{}}},
    '@/store/authStore':{useStore:Object.assign(select=>select({currentUser:{id:userId}}),{getState:()=>({currentUser:{id:userId}})})},
    '@/store/cartStore':{useCartStore:{getState:()=>({fetchCart:async()=>{refreshes++;}})}},
    '@/lib/helpers/promiseError':{promiseErrorFunction:()=>{}},
    '@/features/cart/helpers/cartRules':rules,'../helpers/checkoutRules':deliveryRules,'../api':api,
  });
  const render=()=>{cursor=0;refs=0;queries.length=0;mutations.length=0;return hook.useCheckout(cart);};
  let flow=render();assert.equal(flow.addressId,'office');assert.equal(flow.stage,'delivery');
  assert.equal(queries.find(query=>query.queryKey[3]==='methods').enabled,false);
  await assert.rejects(mutations[1].mutationFn());
  flow.chooseDelivery({sellerId:'seller',type:'buyer_arranged',quoteId:null});flow=render();
  const result=await mutations[1].mutationFn();mutations[1].onSuccess(result);
  flow=render();assert.equal(flow.stage,'payment');
  assert.equal(queries.find(query=>query.queryKey[3]==='methods').enabled,true);
  await assert.rejects(mutations[3].mutationFn('invented-method'));
  await mutations[3].mutationFn('bank');mutations[3].onSuccess({},'bank');
  flow=render();assert.equal(flow.stage,'review');
  assert.equal(queries.find(query=>query.queryKey[3]==='preview').enabled,true);
  const session=await mutations[4].mutationFn();mutations[4].onSuccess(session);
  flow=render();assert.equal(flow.session.checkoutId,'session');assert.equal(creations,1);assert.equal(refreshes,0);
  await assert.rejects(mutations[4].mutationFn());assert.equal(creations,1);
  flow.chooseAddress('warehouse');flow=render();assert.equal(flow.stage,'delivery');assert.deepEqual(flow.selections,[]);
  userId='other';await assert.rejects(mutations[1].mutationFn());
});
