import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createTranslator } from 'next-intl';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const root=path.resolve(import.meta.dirname,'..');
const messages=JSON.parse(fs.readFileSync(path.join(root,'messages/en.json'),'utf8'));
function page(state, target = "src/features/cart/components/templates/CartPageTemplate/CartPageTemplate.tsx") {
  const mocks={
    'next-intl':{useLocale:()=> 'en',useTranslations:namespace=>createTranslator({locale:'en',messages,namespace})},
    'next/link':{default:({href,children,...props})=>React.createElement('a',{href,...props},children),__esModule:true},
    'next/image':{default:({fill,unoptimized,...props})=>React.createElement('img',props),__esModule:true},
    '@/store/authStore':{useStore:select=>select(state.auth)},
    '@/store/cartStore':{useCartStore:select=>select(state.cart)},
    '@/lib/hooks/useGetAllRoutes':{useGetAllRoutes:()=>({routes:{products:'/en/products',cart:'/en/cart',checkout:'/en/checkout',login:'/en/login',productInfo:id=>'/en/products/info/'+id}})},
    '@/features/checkout/hooks/useCheckout':{useCheckout:()=>state.checkout},
    '@/features/cart/hooks/useCartActions':{useCartActions:()=>({mutate:()=>{},isPending:false})},
  };
  const cache=new Map();
  function load(filename) {
    if(cache.has(filename))return cache.get(filename);
    const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    const module={exports:{}};cache.set(filename,module.exports);
    new Function('require','module','exports',code)(name=>{
      if(mocks[name])return mocks[name];
      if(name.startsWith('.')||name.startsWith('@/')) {
        let target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):path.resolve(path.dirname(filename),name);
        for(const candidate of [target+'.tsx',target+'.ts',path.join(target,'index.ts')])if(fs.existsSync(candidate)){
          if(candidate.endsWith('/features/checkout/hooks/useCheckout.ts'))return mocks['@/features/checkout/hooks/useCheckout'];
          if(candidate.endsWith('/features/cart/hooks/useCartActions.ts'))return mocks['@/features/cart/hooks/useCartActions'];
          return load(candidate);
        }
      }
      return require(name);
    },module,module.exports);
    cache.set(filename,module.exports);return module.exports;
  }
  const Template=load(path.join(root,target)).default;
  return renderToStaticMarkup(React.createElement(Template));
}
const item={cartItemId:'line',productId:'product',productName:'Avocado',mainImage:null,attributes:{Color:'blue'},unitPrice:1200,finalUnitPrice:1200,quantity:12,subtotal:14400,currency:'NGN',minimumOrder:{quantity:12,unit:'piece'},availableQuantity:20};
const cart={cartId:'cart',sellerGroups:[{sellerId:'seller',storeName:'Rose and Hammond',items:[item],itemsCount:1,productsSubtotal:14400}],productsSubtotal:14400,currency:'NGN',totalCount:1};
const state=cart=>({auth:{currentUser:{id:'buyer'},isAuthInitialized:true},cart:{cart,isLoading:false,isLoaded:true,error:null,fetchCart:()=>{}}});
test('cart page renders seller grouping, authoritative totals and a checkout link',()=>{
  const html=page(state(cart));
  assert.match(html,/Rose and Hammond/);assert.match(html,/Avocado/);assert.match(html,/blue/);
  assert.match(html,/14,400/);assert.match(html,/href="\/en\/checkout"/);
  assert.match(html,/value="12"/);assert.match(html,/min="12"/);assert.match(html,/max="20"/);
});
test('cart page handles anonymous, empty, request-error and invalid-stock states',()=>{
  const anonymous=state(null);anonymous.auth.currentUser=null;
  assert.match(page(anonymous),/Sign in/);
  assert.match(page(state({...cart,sellerGroups:[],totalCount:0,productsSubtotal:0})),/Your cart is waiting/);
  const failure=state(null);failure.cart.error='Offline';
  assert.match(page(failure),/role="alert"/);assert.match(page(failure),/Try again/);
  const invalid=state({...cart,sellerGroups:[{...cart.sellerGroups[0],items:[{...item,availableQuantity:5}]}]});
  const html=page(invalid);assert.match(html,/Stock has changed/);assert.doesNotMatch(html,/href="\/en\/checkout"/);
});

test('checkout renders per-seller delivery and backend totals before confirmation',()=>{
  const view=state(cart);
  const address={id:'address',label:'Office',recipientName:'Buyer',phoneNumber:'123',addressLine1:'32 Street',city:'Lagos',country:'Nigeria',isDefault:true};
  view.checkout={
    addresses:{data:[address]},addressId:'address',stage:'review',selections:[{sellerId:'seller',type:'seller_arranged',quoteId:null}],
    options:{data:{sellerGroups:[{sellerId:'seller',storeName:'Rose and Hammond',integratedOptions:[],sellerArrangedOption:{available:true,type:'seller_arranged'},buyerArrangedOption:{available:true,type:'buyer_arranged'}}]}},
    methods:{data:[{code:'bank',name:'Bank transfer'}]},
    preview:{data:{deliveryAddress:address,sellerGroups:[{sellerId:'seller',storeName:'Rose and Hammond',items:[{...item,unitPrice:1200}],productsSubtotal:14400,sellerTotal:14400,delivery:{type:'seller_arranged',amount:null}}],paymentMethod:{name:'Bank transfer'},summary:{productsTotal:14400,logisticsTotal:0,totalAmount:14400,currency:'NGN'}}},
    busy:false,session:null,notes:'',newAddress:{},saveDelivery:{},provider:{},payment:{},confirm:{},
  };
  const html=page(view,'src/features/checkout/components/templates/CheckoutTemplate/CheckoutTemplate.tsx');
  assert.match(html,/Office/);assert.match(html,/paid separately outside TOFA/);assert.match(html,/Bank transfer/);
  assert.match(html,/Confirm &amp; continue/);assert.match(html,/14,400/);
  view.checkout.session={checkoutId:'checkout-session',totalAmount:14400,currency:'NGN',expiresAt:'2026-12-01T00:00:00Z'};
  const success=page(view,'src/features/checkout/components/templates/CheckoutTemplate/CheckoutTemplate.tsx');
  assert.match(success,/Checkout created successfully/);assert.match(success,/checkout-session/);assert.doesNotMatch(success,/Confirm &amp; continue/);
});
test('cart and checkout translation keys resolve in every supported locale',()=>{
  for(const locale of ['en','fr','es','pt','sw']) {
    const translated=JSON.parse(fs.readFileSync(path.join(root,`messages/${locale}.json`),'utf8'));
    for(const namespace of ['CartPage','Checkout']) {
      assert.deepEqual(Object.keys(translated[namespace]).sort(),Object.keys(messages[namespace]).sort());
      const t=createTranslator({locale,messages:translated,namespace,onError:error=>assert.fail(error.message)});
      for(const key of Object.keys(messages[namespace]))assert.ok(t(key,{count:1,quantity:2,unit:'kg',name:'Provider',min:1,max:3}));
    }
  }
});
