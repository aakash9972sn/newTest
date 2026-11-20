import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const core = require('../test-core.js');
const ctx = { window: { EXAM_DATA: [], QUESTION_BANKS: {} } };
vm.runInNewContext(fs.readFileSync(new URL('../pyp-data.js',import.meta.url),'utf8'),ctx);
const banks = Object.values(ctx.window.QUESTION_BANKS);
test('all three complete papers retain numbering and valid option indices', () => {
  assert.deepEqual(banks.map(b=>b.length), [75,100,100]);
  for (const bank of banks) bank.forEach((q,i) => {
    assert.equal(q.sourceNumber,i+1);
    assert.equal(q.o.length,4);
    assert.ok(q.o.every(o=>typeof o==='string' && o.length));
    assert.equal(q.a,Number(q.sourceAnswer.match(/^(?:\(([1-4])\)|([1-4])\.)/).slice(1).find(Boolean))-1);
  });
});
test('only the three source-flagged questions are excluded',()=>{
  assert.deepEqual(banks.map(b=>Array.from(b.filter(q=>q.unscored),q=>q.sourceNumber)),[[38],[78],[62]]);
  banks.forEach(b=>{
    const r=core.score(b,b.map(q=>q.a),{correct:4,wrong:1});
    assert.equal(r.correct,b.length-1); assert.equal(r.excluded,1);
    assert.equal(r.total,(b.length-1)*4); assert.equal(r.score,r.total);
    assert.equal(r.accuracy,100);
  });
});
test('scoring separates wrong, skipped and disputed responses',()=>{
  const qs=[{a:0,t:'A'},{a:1,t:'A'},{a:2,t:'B'},{a:3,t:'B',unscored:true}];
  const r=core.score(qs,[0,0,null,3],{correct:4,wrong:1});
  assert.deepEqual([r.correct,r.wrong,r.unattempted,r.excluded,r.score,r.total,r.accuracy],[1,1,1,1,3,12,50]);
  assert.equal(r.topics.B.total,1);
  assert.equal(core.score(qs,[1,0,0,null],{correct:4,wrong:1}).score,-3);
});
test('deadline timer catches up after suspended tabs and clamps at zero',()=>{
  assert.equal(core.remaining(10000,1000),9);
  assert.equal(core.remaining(10000,9501),1);
  assert.equal(core.remaining(10000,15000),0);
});
test('progress validation survives malformed storage and invalid answers',()=>{
  const qs=[{o:['a','b']},{o:['a','b']}];
  assert.equal(core.progress({responses:'broken'},qs,60),null);
  const r=core.progress({responses:[9,1],marked:'broken',visited:{},current:Infinity,timeLeft:NaN},qs,60);
  assert.deepEqual(r,{responses:[null,1],marked:[false,false],visited:[false,false],current:0,timeLeft:60});
});
test('active reload consumes elapsed time; explicit paused progress does not',()=>{
  const qs=[{o:['a','b']}];
  const raw={responses:[1],timeLeft:60,deadline:61000};
  assert.equal(core.progress(raw,qs,60,31000).timeLeft,30);
  assert.equal(core.progress(raw,qs,60,62000).timeLeft,0);
  assert.equal(core.progress({...raw,deadline:null},qs,60,62000).timeLeft,60);
});
test('PYP registration cannot offer unsupported CUET generation',()=>{
  assert.ok(ctx.window.EXAM_DATA.every(e=>e.aiSupported===false));
  const tests=ctx.window.EXAM_DATA.flatMap(e=>e.subjects.flatMap(s=>s.tests));
  assert.deepEqual(tests.map(t=>t.duration),[90,120,120]);
  assert.ok(tests.every(t=>t.marking.correct===4&&t.marking.wrong===1));
});
