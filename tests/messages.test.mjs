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

const helpers = load('src/features/messages/helpers/index.ts');
const sample = (id, sentAt, content = id) => ({id,sentAt,content,sender:{id:'other',displayName:'Other'},attachments:[],status:'sent',messageType:'text'});
test('cursor history is deduplicated, chronological and latest-page updates win', () => {
  const result=helpers.chronologicalMessages([
    {data:[sample('b','2026-09-01T12:00:00Z','edited')],pagination:{}},
    {data:[sample('b','2026-09-01T12:00:00Z','old'),sample('a','2026-09-01T11:00:00Z')],pagination:{}},
  ]);
  assert.deepEqual(result.map(item=>item.id), ['a','b']);
  assert.equal(result[1].content,'edited');
});
test('day grouping uses the local calendar and handles year boundaries', () => {
  const now=new Date(2026,0,1,0,30);
  assert.equal(helpers.localDayLabel(new Date(2026,0,1,0,10).toISOString(),'en','Today','Yesterday',now),'Today');
  assert.equal(helpers.localDayLabel(new Date(2025,11,31,23,30).toISOString(),'en','Today','Yesterday',now),'Yesterday');
});
test('attachment links reject executable schemes and malformed URLs', () => {
  for(const url of ['javascript:alert(1)','data:text/html,test','file:///private/file','//example.com/file']) assert.equal(helpers.safeAttachmentUrl(url),undefined);
  assert.equal(helpers.safeAttachmentUrl('https://cdn.example.com/file.pdf'),'https://cdn.example.com/file.pdf');
});
test('REST requests use participant IDs, cursors and stable client message IDs', async () => {
  const calls=[];
  const api=load('src/features/messages/api/index.ts', {'@/lib/axiosInstance':{axiosInstance:{
    get:async (url,options)=>{calls.push({method:'get',url,options});return {data:{success:true,data:[],pagination:{hasMore:false,nextCursor:null}}};},
    post:async (url,payload)=>{calls.push({method:'post',url,payload});return {data:{success:true,data:url.endsWith('/conversations')?{conversationId:'c',participant:{id:'recipient'}}:sample('m','2026-09-01T12:00:00Z')}};},
    patch:async (url,payload)=>{calls.push({method:'patch',url,payload});return {data:{success:true,data:{}}};},
  }}});
  await api.startConversation('recipient');
  assert.deepEqual(calls[0].payload,{recipientUserId:'recipient'});
  const signal=new AbortController().signal;
  await api.getMessages('c/a','cursor-2',signal);
  assert.equal(calls[1].url,'/messages/conversations/c%2Fa/messages');
  assert.equal(calls[1].options.params.cursor,'cursor-2');
  assert.equal(calls[1].options.signal,signal);
  const payload={clientMessageId:'same-id',content:'Hello 😊',messageType:'text',replyToMessageId:'previous',attachments:[]};
  await api.sendMessage('c',payload); await api.sendMessage('c',payload);
  assert.equal(calls[2].payload.clientMessageId,calls[3].payload.clientMessageId);
  await api.markConversationRead('c','latest');
  assert.deepEqual(calls[4].payload,{lastReadMessageId:'latest'});
});
test('malformed history fails instead of presenting a false empty state', async () => {
  const api=load('src/features/messages/api/index.ts', {'@/lib/axiosInstance':{axiosInstance:{get:async()=>({data:{success:true,data:{},pagination:{}}})}}});
  await assert.rejects(api.getMessages('c'));
  await assert.rejects(api.getConversations({page:1}));
});
test('query keys isolate history and unread counts by account', () => {
  const hooks=load('src/features/messages/hooks/useMessageQueries.ts',{
    '@tanstack/react-query':{},'@/lib/hooks/useFreshQuery':{},'@/store/authStore':{},'../api':{},
  });
  assert.notDeepEqual(hooks.messageKeys.history('a','c'),hooks.messageKeys.history('b','c'));
  assert.notDeepEqual(hooks.messageKeys.unread('a'),hooks.messageKeys.unread('b'));
});


test('conversation requests omit blank search and trim non-empty searches', async () => {
  const calls = [];
  const api = load('src/features/messages/api/index.ts', {
    '@/lib/axiosInstance': { axiosInstance: { get: async (_url, options) => {
      calls.push(options);
      return { data: { success: true, data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } } };
    } } },
  });
  const signal = new AbortController().signal;
  for (const search of [undefined, '', '   ', '\t\n']) {
    await api.getConversations({ search, page: 1, unreadOnly: false }, signal);
    assert.deepEqual(calls.at(-1).params, { limit: 20, page: 1, unreadOnly: false });
    assert.equal(calls.at(-1).signal, signal);
  }
  await api.getConversations({ search: '  Agro Supplies  ', page: 2, limit: 10, unreadOnly: true });
  assert.deepEqual(calls.at(-1).params, { limit: 10, page: 2, unreadOnly: true, search: 'Agro Supplies' });
});
