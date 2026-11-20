import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const appSource=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const coreSource=fs.readFileSync(new URL('../test-core.js',import.meta.url),'utf8');
function harness() {
  let now=1000, tick=null;
  const storage=new Map(), nodes=new Map();
  const node=key=>{
    if(!nodes.has(key)) nodes.set(key,{hidden:true,innerHTML:'',textContent:'',style:{},dataset:{},isConnected:true,events:{},
      classList:{add(){},remove(){},toggle(){},contains(){return false;}},
      setAttribute(){},removeAttribute(){},focus(){},querySelectorAll(){return [];},
      addEventListener(event,fn){this.events[event]=fn;}});
    return nodes.get(key);
  };
  const entry={exam:{id:'fixture',name:'Fixture',subjects:[]},subject:{id:'subject',name:'Subject'},test:{id:'fixture',title:'Fixture',duration:1,marking:{correct:4,wrong:1},questions:[{q:'Scored',o:['a','b'],a:0},{q:'Disputed',o:['a','b'],a:1,unscored:true}]}};
  entry.subject.tests=[entry.test]; entry.exam.subjects=[entry.subject];
  const ctx={window:{EXAM_DATA:[entry.exam],QUESTION_BANKS:{},scrollTo(){},matchMedia(){return {matches:false};}},document:{querySelector:node,querySelectorAll(){return [];},body:{classList:{remove(){}}},activeElement:node('active')},location:{hash:'#/t/fixture'},
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    Date:{now:()=>now},setInterval:fn=>{tick=fn;return 1;},clearInterval:()=>{tick=null;}};
  vm.createContext(ctx); vm.runInContext(coreSource,ctx);
  const exposed=appSource.replace('  wire();\n  route();','  window.hooks = {openTest, askSubmit, exitTest, selectOption};');
  assert.notEqual(exposed,appSource,'test harness must replace boot only');
  vm.runInContext(exposed,ctx);
  return {ctx,entry,node,storage,advance(ms){now+=ms;},tick(){tick?.();}};
}
test('expiry closes an open dialog, submits once and includes excluded count',()=>{
  const h=harness(); h.ctx.window.hooks.openTest(h.entry);
  h.ctx.window.hooks.selectOption(0); h.ctx.window.hooks.askSubmit();
  assert.equal(h.node('#modal').hidden,false);
  const staleConfirm=h.node('#modal-confirm').events.click;
  h.advance(61000); h.tick();
  assert.equal(h.node('#modal').hidden,true);
  const raw=h.storage.get('tclab.result.fixture'),r=JSON.parse(raw);
  assert.equal(r.auto,true); assert.equal(r.score,4); assert.equal(r.total,4); assert.equal(r.excluded,1);
  assert.equal(r.timeUsed,60); assert.equal(h.ctx.location.hash,'#/r/fixture');
  staleConfirm();
  assert.equal(h.storage.get('tclab.result.fixture'),raw);
});
test('save & exit serializes paused time and reopening resumes it',()=>{
  const h=harness(); h.ctx.window.hooks.openTest(h.entry); h.advance(20000);
  h.ctx.window.hooks.exitTest(); h.node('#modal-confirm').events.click();
  const p=JSON.parse(h.storage.get('tclab.progress.fixture'));
  assert.equal(p.timeLeft,40); assert.equal(p.deadline,null);
  h.advance(120000); h.ctx.window.hooks.openTest(h.entry);
  assert.equal(h.node('#timer-text').textContent,'00:40');
});
test('reopening an expired active attempt submits immediately',()=>{
  const h=harness(); h.storage.set('tclab.progress.fixture',JSON.stringify({responses:[0,null],timeLeft:40,deadline:500}));
  h.ctx.window.hooks.openTest(h.entry);
  assert.equal(JSON.parse(h.storage.get('tclab.result.fixture')).auto,true);
  assert.equal(h.node('#modal').hidden,true);
});
