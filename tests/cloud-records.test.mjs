import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const schemaSource = await readFile(new URL('cloud-records.js', root), 'utf8');
const authSource = await readFile(new URL('firebase-account.js', root), 'utf8');
const html = await readFile(new URL('index.html', root), 'utf8');
const appSource = await readFile(new URL('app.js', root), 'utf8');
const context = { window: {} };
vm.runInNewContext(schemaSource, context, { filename: 'cloud-records.js' });
const schema = context.window.AakashCloudSchema;
const user = { uid:'firebase-user-1', displayName:'Test Student', email:'test@example.com' };
const stamp = () => 'SERVER_TIMESTAMP';
const keys = obj => Object.keys(obj).sort();

test('exact user create fields and allowed default values', () => {
  const doc = schema.userCreate(user, stamp);
  assert.deepEqual(keys(doc), ['bestGuessScore','createdAt','displayName','targetExam','uid','updatedAt']);
  assert.equal(doc.uid,user.uid);
  assert.equal(doc.displayName,user.displayName);
  assert.equal(doc.targetExam,'Both');
  assert.equal(doc.bestGuessScore,0);
  assert.equal(doc.createdAt,'SERVER_TIMESTAMP');
  assert.equal(doc.updatedAt,'SERVER_TIMESTAMP');
});

test('legacy local NEET result maps to ONLY strict attempt fields', () => {
  const result={
    testId:'neet-bio-repro',title:'Reproduction',exam:'NEET',subject:'Biology',
    score:14,total:18,correct:15,wrong:1,unattempted:2,
    accuracy:94,timeUsed:510,totalTime:1080,
    auto:false,responses:[0],marked:[],topics:{},at:1770000000000
  };
  const payload = schema.testAttempt(user,result,stamp);
  assert.deepEqual(keys(payload), [
    'accuracyPercent','correctCount','createdAt','durationSeconds','exam','maxScore',
    'mode','score','subject','totalQuestions','uid','unattemptedCount','wrongCount'
  ]);
  assert.equal(payload.exam,'NEET UG');
  assert.equal(payload.mode,'curated');
  assert.equal(payload.totalQuestions,18);
  assert.equal(payload.createdAt,'SERVER_TIMESTAMP');
  assert.equal(payload.maxScore,18);
  assert.equal(payload.durationSeconds,510);
  assert.equal(payload.wrongCount,1);
  assert.equal(payload.correctCount,15);
  assert.equal(payload.unattemptedCount,2);
  assert.ok(!Object.hasOwn(payload,'responses'));
  assert.ok(!Object.hasOwn(payload,'updatedAt'));
  assert.ok(!Object.hasOwn(payload,'testId'));
});

test('generated GATE questions have gemini mode and accepted exam name', () => {
  const result={testId:'ai-sample',exam:'GATE',subject:'Network Theory',
    score:-1/3,total:5,correct:0,wrong:1,unattempted:4,
    accuracy:0,timeUsed:57};
  const payload=schema.testAttempt(user,result,stamp);
  assert.equal(payload.mode,'gemini');
  assert.equal(payload.exam,'GATE ECE');
  assert.equal(payload.totalQuestions,5);
  assert.equal(payload.score,-1/3);
});

test('strict question bookmark schema has no page URL/title or updatedAt', () => {
  const q={
    exam:'GATE ECE',subject:'Control Systems',topic:'Root Locus',
    question:'Which location of a closed-loop pole gives a stable response?',
    options:['Left half plane','Right half plane','At infinity','None'],
    answerIndex:0,explanation:'Left half-plane poles decay exponentially.',
    url:'https://example.invalid'
  };
  const doc=schema.bookmark(user,q,stamp);
  assert.deepEqual(keys(doc),['answerIndex','createdAt','exam','explanation',
    'options','question','subject','topic','uid']);
  assert.equal(doc.answerIndex,0);
  assert.equal(doc.createdAt,'SERVER_TIMESTAMP');
  assert.ok(!Object.hasOwn(doc,'url'));
});

test('orders only contain exact confirmed-order keys', () => {
  const doc=schema.order(user,{
    orderCode:'ABC-123',customerName:'Test Student',deliveryArea:'Delhi',
    itemSummary:'Two electronics accessories',itemCount:2,totalInr:950,
    status:'confirmed',address:'should not be written'
  },stamp);
  assert.deepEqual(keys(doc),['createdAt','customerName','deliveryArea',
    'itemCount','itemSummary','orderCode','status','totalInr','uid']);
  assert.equal(doc.status,'confirmed');
  assert.equal(doc.totalInr,950);
  assert.ok(!Object.hasOwn(doc,'address'));
});

test('reject invalid Firestore values before any writes', () => {
  assert.throws(()=>schema.testAttempt(user,{exam:'NEET',subject:'Biology',
    score:0,total:0,correct:0,wrong:0,unattempted:0,
    timeUsed:0,accuracy:0},stamp));
  assert.throws(()=>schema.bookmark(user,{exam:'NEET',subject:'Biology',
    topic:'Cell',question:'What is a nucleus?',options:['a','b'],answerIndex:0,
    explanation:'It contains DNA.'},stamp));
  assert.throws(()=>schema.order(user,{orderCode:'AB',customerName:'A',
    deliveryArea:'Delhi',itemSummary:'One item',itemCount:1,
    totalInr:200,status:'cancelled'},stamp));
});

test('Firebase uses the EXACT named database, Google popup and separate strict writes',()=>{
  assert.match(authSource,/getFirestore\(instance,\s*FIRESTORE_DATABASE_ID\)/);
  assert.match(authSource,/ai-studio-aakasheceembedde-cbb0adda-8b7b-403c-a84c-887e93610453/);
  assert.match(authSource,/gen-lang-client-0580718541\.firebaseapp\.com/);
  assert.match(authSource,/signInWithPopup\(auth,googleProvider\)/);
  assert.match(authSource,/onAuthStateChanged\(auth/);
  assert.match(authSource,/fs\.setDoc\(ref,\s*schema\.userCreate/);
  assert.match(authSource,/fs\.setDoc\(ref,\s*payload\)/);
  assert.doesNotMatch(authSource,/merge:\s*true/);
  assert.match(authSource,/fs\.updateDoc\(ref,\{status:'cancelled'\}\)/);
  assert.match(authSource,/bestGuessScore:score,updatedAt:fs\.serverTimestamp/);
  assert.match(authSource,/user\.photoURL/);
  assert.match(authSource,/account-header-name/);
  assert.match(authSource,/profileReady\s*=\s*ensureUserDocument/);
  assert.match(appSource,/getCurrentBookmark\(\)/);
  assert.ok(html.indexOf('cloud-records.js')<html.indexOf('firebase-account.js'));
  assert.match(html,/firebase-account\.js\?v=20261120-profile1/);
});
