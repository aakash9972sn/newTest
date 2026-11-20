import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const hostedSource = await fs.readFile(new URL('hosted-ai.js', root), 'utf8');
const assistantSource = await fs.readFile(new URL('ai-assistant.js', root), 'utf8');
const firebaseSource = await fs.readFile(new URL('firebase-account.js', root), 'utf8');
const html = await fs.readFile(new URL('index.html', root), 'utf8');

function hostedWith(fetcher) {
  const sandbox={window:{},fetch:fetcher,Response,AbortSignal,TextDecoder,URL,URLSearchParams,JSON};
  vm.runInNewContext(hostedSource,sandbox,{filename:'hosted-ai.js'});
  return sandbox.window.HostedAI;
}
function sse(...events) {
  return new Response(events.map(e=> 'data: ' + JSON.stringify(e) + '\n\n').join('') +
     'data: [DONE]\n\n', {status:200,headers:{'Content-Type':'text/event-stream'}});
}

test('Gemini chat streams text progressively and extracts grounded sources in same chat', async()=>{
  const requests=[];
  const client=hostedWith(async(url,options)=>{
    requests.push({url,payload:JSON.parse(options.body)});
    return sse(
      {text:'Latest '},
      {text:'reliable information'},
      {grounding:{groundingChunks:[{web:{title:'Science',uri:'https://example.org/info'}}]}},
      {done:true}
    );
  });
  const updates=[];
  const response=await client.request({action:'google_search',question:'Latest science facts'},undefined,text=>updates.push(text));
  assert.equal(response.answer,'Latest reliable information');
  assert.equal(response.googleGrounded,true);
  assert.equal(response.sources.length,1);
  assert.equal(response.sources[0].url,'https://example.org/info');
  assert.equal(requests[0].payload.grounding,'search');
  assert.ok(requests[0].url.includes('/api/ai/chat/stream'));
  assert.equal(updates.at(-1),'Latest reliable information');
});

test('normal chat uses Gemini balanced mode with grounding disabled by default',async()=>{
  const requests=[];
  const client=hostedWith(async(url,init)=>{
    requests.push(JSON.parse(init.body));
    return sse({text:'Hello!'},{done:true});
  });
  const response=await client.request({action:'assistant',app:'study',question:'Hi',context:{exams:[]},history:[]});
  assert.equal(response.answer,'Hello!');
  assert.equal(requests[0].grounding,'none');
  assert.equal(requests[0].mode,'balanced');
});

test('Gemini design and Firebase diagnostics are present and legacy script cache is replaced',()=>{
  assert.match(html,/ai-assistant\.js\?v=20261120-gemini3/);
  assert.match(html,/firebase-account\.js\?v=20261120-auth4/);
  assert.match(assistantSource,/Ask Gemini/);
  assert.match(assistantSource,/GOOGLE GEMINI/);
  assert.match(assistantSource,/HostedAI\.request/);
  assert.doesNotMatch(assistantSource,/window\.open\("https:\/\/www\.google\.com/);
  assert.match(firebaseSource,/auth\/unauthorized-domain/);
  assert.match(firebaseSource,/aakash9972sn\.github\.io/);
  assert.match(firebaseSource,/account-diagnostics/);
  assert.match(firebaseSource,/Retry Google sign-in setup/);
});
