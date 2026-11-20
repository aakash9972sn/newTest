/* Exact client-side payloads for the deployed, strictly validated Firestore rules.
   Firebase config and secrets are deliberately NOT stored in this module. */
(() => {
  'use strict';

  const validString=(value,min,max,field)=>{
    if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)
      throw new Error('Invalid '+field+' for cloud saving.');
    return value.trim();
  };
  const number=(value,min,max,field,integer=false)=>{
    if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||
       (integer&&!Number.isInteger(value)))throw new Error('Invalid '+field+' for cloud saving.');
    return value;
  };
  const exam=(value)=>{
    if(value==='NEET'||value==='NEET UG')return 'NEET UG';
    if(value==='GATE'||value==='GATE ECE')return 'GATE ECE';
    throw new Error('Unrecognized exam for cloud saving.');
  };
  function uid(user) {
    if(!user||typeof user.uid!=='string'||!user.uid.trim())
      throw new Error('Google sign-in is required for cloud saving.');
    return user.uid;
  }
  function displayName(user) {
    const name=typeof user?.displayName==='string'&&user.displayName.trim()?
      user.displayName.trim():typeof user?.email==='string'&&user.email.includes('@')?
        user.email.split('@')[0]:'Student';
    return validString(name.slice(0,100),1,100,'display name');
  }
  function userCreate(user,timestamp) {
    return {
      uid:uid(user),
      displayName:displayName(user),
      targetExam:'Both',
      bestGuessScore:0,
      createdAt:timestamp(),
      updatedAt:timestamp()
    };
  }
  function testAttempt(user,result,timestamp) {
    if(!result||typeof result!=='object')throw new Error('No test result to save.');
    const correctCount=number(result.correct,0,200,'correctCount',true);
    const wrongCount=number(result.wrong,0,200,'wrongCount',true);
    const unattemptedCount=number(result.unattempted,0,200,'unattemptedCount',true);
    const totalQuestions=correctCount+wrongCount+unattemptedCount;
    number(totalQuestions,1,200,'totalQuestions',true);
    const selectedMode=['curated','gemini','bookmarks'].includes(result.mode)?
      result.mode:(String(result.testId||'').startsWith('ai-')?'gemini':'curated');
    return {
      uid:uid(user),
      exam:exam(result.exam),
      subject:validString(result.subject,1,80,'subject'),
      mode:selectedMode,
      score:number(result.score,-100,1000,'score'),
      maxScore:number(result.total,1,1000,'maxScore'),
      correctCount,
      wrongCount,
      unattemptedCount,
      totalQuestions,
      durationSeconds:number(result.timeUsed,0,86400,'durationSeconds',true),
      accuracyPercent:number(result.accuracy,0,100,'accuracyPercent'),
      createdAt:timestamp()
    };
  }
  function bookmark(user,q,timestamp){
    if(!q||typeof q!=='object')throw new Error('Select a question to bookmark.');
    const options=q.options??q.o;
    if(!Array.isArray(options)||options.length!==4||
       options.some(x=>typeof x!=='string'||!x.trim()||x.length>300))
      throw new Error('Question must contain four valid options.');
    return {
      uid:uid(user),
      exam:exam(q.exam),
      subject:validString(q.subject,1,80,'subject'),
      topic:validString(q.topic??q.t,1,120,'topic'),
      question:validString(q.question??q.q,5,1000,'question'),
      options:options.map(x=>x.trim()),
      answerIndex:number(q.answerIndex??q.a,0,3,'answerIndex',true),
      explanation:validString(q.explanation??q.e,1,1500,'explanation'),
      createdAt:timestamp()
    };
  }
  function order(user,src,timestamp) {
    if(!src||typeof src!=='object')throw new Error('No confirmed order to save.');
    if(src.status!==undefined&&src.status!=='confirmed')
      throw new Error('Only confirmed orders can be created.');
    return {
      uid:uid(user),
      orderCode:validString(src.orderCode,3,32,'orderCode'),
      customerName:validString(src.customerName,1,100,'customerName'),
      deliveryArea:validString(src.deliveryArea,1,200,'deliveryArea'),
      itemSummary:validString(src.itemSummary,1,500,'itemSummary'),
      itemCount:number(src.itemCount,1,100,'itemCount',true),
      totalInr:number(src.totalInr,1,50000,'totalInr'),
      status:'confirmed',
      createdAt:timestamp()
    };
  }
  window.AakashCloudSchema=Object.freeze({
    userCreate,testAttempt,bookmark,order,exam,displayName
  });
})();
