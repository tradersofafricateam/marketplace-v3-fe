import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createTranslator} from 'next-intl';
import ts from 'typescript';

const requireModule=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..');
const valid={storeName:'Synthetic consent store',companyName:'Synthetic Consent QA',businessType:'QA testing',yearsOfBusiness:'0',companyAddress:'1 Synthetic QA Road',pickupAddress:'2 Synthetic QA Road',country:'Nigeria',registrationNumber:'',companyBio:'',merchantTerms:true};
function loader(mocks={}){
 const cache=new Map();
 function load(relative){
  const file=path.isAbsolute(relative)?relative:path.join(root,relative);
  if(cache.has(file))return cache.get(file);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const compiled={exports:{}};cache.set(file,compiled.exports);
  new Function('require','module','exports',code)((name)=>{
   if(Object.hasOwn(mocks,name))return mocks[name];
   if(name.startsWith('.')||name.startsWith('@/')){
    const base=name.startsWith('@/')?path.join(root,'src',name.slice(2)):path.resolve(path.dirname(file),name);
    const target=[base+'.ts',base+'.tsx',path.join(base,'index.ts'),path.join(base,'index.tsx')].find(fs.existsSync);
    if(!target)throw new Error('Cannot resolve '+name);return load(target);
   }
   return requireModule(name);
  },compiled,compiled.exports);return compiled.exports;
 }
 return load;
}
const helpers=loader()('src/features/dashboard/helpers/index.tsx');
const serializer=loader()('src/features/dashboard/helpers/sellerUpgradePayload.ts');

test('seller validation requires explicit boolean consent, including for otherwise valid zero-year profiles',()=>{
 for(const consent of [false,undefined,'true','false','on'])assert.ok(helpers.validateSellerUpgradeForm({...valid,merchantTerms:consent}).merchantTerms);
 assert.deepEqual(helpers.validateSellerUpgradeForm(valid),{});
});
test('multipart serializer rejects missing, unchecked and coerced consent',()=>{
 for(const consent of [false,undefined,'true','false','on'])assert.throws(()=>serializer.buildSellerUpgradeFormData({...valid,merchantTerms:consent}),/Accept the Merchant Terms/);
});
test('checked consent uses the backend literal true string and preserves optional uploads',()=>{
 const logo=new File(['synthetic'],'qa-logo.png',{type:'image/png'});
 const body=serializer.buildSellerUpgradeFormData({...valid,companyLogo:logo});
 assert.equal(body.get('merchantTerms'),'true');assert.equal(body.get('yearsOfBusiness'),'0');
 assert.equal(body.get('companyLogo').name,'qa-logo.png');assert.equal(body.get('companyLogo').size,9);
 assert.equal(body.has('registrationNumber'),false);assert.equal(body.has('companyBio'),false);
});
test('API client never sends an unchecked submission and forwards checked multipart consent',async()=>{
 const calls=[];const api=loader({'@/lib/axiosInstance':{axiosInstance:{post:async(...args)=>{calls.push(args);return {data:{status:'pending'}};}}}})('src/features/dashboard/api/index.tsx');
 await assert.rejects(api.submitSellerUpgrade({...valid,merchantTerms:false}),/Accept the Merchant Terms/);assert.equal(calls.length,0);
 assert.deepEqual(await api.submitSellerUpgrade(valid),{status:'pending'});
 assert.equal(calls.length,1);assert.equal(calls[0][0],'/users/upgrade-to-seller');assert.equal(calls[0][1].get('merchantTerms'),'true');
 assert.equal(calls[0][2].headers['Content-Type'],undefined);
});

test('form uses checkbox checked state, blocks submission without consent and clears consent on dismiss/reset',()=>{
 const states=[];let cursor=0;const submissions=[];
 const react={...React,useCallback:fn=>fn,useState(initial){const n=cursor++;if(!(n in states))states[n]=initial;return [states[n],next=>{states[n]=typeof next==='function'?next(states[n]):next;}];}};
 const runHook=loader({react})('src/features/dashboard/hooks/useSellerUpgradeForm.ts').useSellerUpgradeForm;
 const render=()=>{cursor=0;return runHook(v=>submissions.push(v));};let form=render();
 assert.equal(form.values.merchantTerms,false);
 for(const [name,value] of Object.entries(valid))if(name!=='merchantTerms')form.handleChange({target:{name,value,type:'text'}});
 form.handleChange({target:{name:'merchantTerms',type:'checkbox',value:'on',checked:false}});form=render();
 form.handleSubmit({preventDefault(){}});assert.equal(submissions.length,0);assert.ok(render().errors.merchantTerms);
 form.handleChange({target:{name:'merchantTerms',type:'checkbox',value:'on',checked:true}});form=render();form.handleSubmit({preventDefault(){}});
 assert.equal(submissions.length,1);assert.equal(submissions[0].merchantTerms,true);
 form.resetMerchantTerms();form=render();assert.equal(form.values.merchantTerms,false);assert.equal(form.values.storeName,valid.storeName);assert.equal(form.errors.merchantTerms,undefined);
 form.handleSubmit({preventDefault(){}});assert.equal(submissions.length,1);
 form.reset();form=render();assert.equal(form.values.merchantTerms,false);assert.equal(form.values.storeName,'');
});

function modalMarkup({checked=false,error=false,locale='en'}={}){
 const messages=JSON.parse(fs.readFileSync(path.join(root,'messages',locale+'.json'),'utf8'));
 const box=({children,className})=>React.createElement('div',{className},children);
 const TextField=({label,error:fieldError,...props})=>React.createElement('label',null,label,React.createElement('input',props),fieldError);
 const load=loader({
  'next-intl':{useTranslations:namespace=>createTranslator({locale,messages,namespace})},
  'next/image':()=>null,'lucide-react':Object.fromEntries(['ArrowUpRight','Building2','MapPin','UploadCloud','X'].map(k=>[k,()=>null])),
  '@base-ui/react/dialog':{Dialog:Object.fromEntries(['Root','Portal','Backdrop','Popup','Title','Description','Close'].map(k=>[k,box]))},
  '@/features/dashboard/components/atoms/DashboardTextField/DashboardTextField':TextField,
  '@/components/molecules/RichTextEditor/RichTextEditor':()=>null,
  '@/features/dashboard/hooks/useSellerVerificationStatus':{useSellerVerificationStatus:()=>({canSubmit:true,status:'not_submitted'})},
  '@/features/dashboard/hooks/useSellerUpgrade':{useSellerUpgrade:()=>({submit(){},isSubmitting:false})},
  '@/features/dashboard/hooks/useSellerUpgradeForm':{useSellerUpgradeForm:()=>({values:{...valid,merchantTerms:checked},errors:error?{merchantTerms:'Required'}:{},touched:{merchantTerms:error},handleChange(){},handleBlur(){},handleSubmit(){},setFieldValue(){},reset(){},resetMerchantTerms(){}})},
 });
 return renderToStaticMarkup(React.createElement(load('src/features/dashboard/components/organisms/BecomeSellerModal/BecomeSellerModal.tsx').default,{open:true,onOpenChange(){}}));
}
test('consent checkbox has required semantics, an associated label and no default check',()=>{
 const html=modalMarkup();const input=html.match(/<input[^>]+id="merchantTerms"[^>]*>/)?.[0];
 assert.ok(input);assert.match(input,/type="checkbox"/);assert.match(input,/name="merchantTerms"/);assert.match(input,/required/);assert.doesNotMatch(input,/checked=/);
 assert.match(html,/for="merchantTerms"/);assert.match(html,/I agree to TOFA/);
});
test('missing-consent error is accessible and disappears when explicitly checked',()=>{
 const html=modalMarkup({error:true});assert.match(html,/aria-invalid="true"/);assert.match(html,/aria-describedby="merchantTerms-error"/);assert.match(html,/id="merchantTerms-error" role="alert"/);
 const checked=modalMarkup({error:true,checked:true});assert.match(checked,/checked=""/);assert.doesNotMatch(checked,/id="merchantTerms-error"/);
});
test('consent label and required message are available in every supported locale',()=>{
 for(const locale of ['en','fr','es','pt','sw']){
  const messages=JSON.parse(fs.readFileSync(path.join(root,'messages',locale+'.json'),'utf8')).Dashboard.becomeSellerModal;
  assert.ok(messages.merchantTerms.length>10);assert.ok(messages.merchantTermsRequired.length>10);assert.doesNotThrow(()=>modalMarkup({locale,error:true}));
 }
});
