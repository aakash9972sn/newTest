import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const site=process.env.TEST_SITE_URL||'https://aakash9972sn.github.io/newTest/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1280,height:900},locale:'en-US'});
const errors=[];
page.on('pageerror',(error)=>errors.push('PAGE ERROR '+String(error)));
page.on('console',(message)=>{if(message.type()==='error')errors.push('CONSOLE '+message.text())});
page.on('requestfailed',(request)=>{if(request.url().includes('.run.app'))errors.push('FAILED '+request.url()+' '+request.failure()?.errorText)});
page.on('response',(response)=>{if(response.url().includes('.run.app'))console.log('Worker HTTP',response.status(),new URL(response.url()).pathname)});
let success=false;
try{
  console.log('Opening the production website:',site);
  await page.goto(site,{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('#ai-gen-form').waitFor({timeout:15000});
  console.log('Homepage generator is mounted.');

  await page.locator('#ai-gen-exam').selectOption('gate');
  await page.locator('#ai-gen-subject').selectOption('gate-nt');
  await page.locator('#ai-gen-topic').fill("Ohm's law, circuit calculations");
  await page.locator('#ai-gen-level').selectOption('Easy');
  await page.locator('#ai-gen-count').selectOption('5');
  await page.locator('#ai-gen-batch').selectOption('1');

  console.log('Running 2-question browser diagnostic on the production website.');
  await page.locator('#ai-gen-diagnostic').click();
  await page.waitForFunction(()=>{
    const status=document.querySelector('#ai-gen-status');
    return status && ['success','error'].includes(status.dataset.state);
  },null,{timeout:70000});
  const diagnosticState=await page.locator('#ai-gen-status').getAttribute('data-state');
  const diagnosticText=await page.locator('#ai-gen-status').textContent();
  console.log('AI diagnostic:',diagnosticState,diagnosticText);
  assert.equal(diagnosticState,'success','Live 2-question browser diagnostic failed');

  console.log('Submitting production Generate AI tests form.');
  await page.locator('#ai-gen-submit').click();
  await page.waitForFunction(()=>{
    const status=document.querySelector('#ai-gen-status');
    return status && ['success','error'].includes(status.dataset.state);
  },null,{timeout:125000});
  const status=await page.locator('#ai-gen-status').textContent();
  const state=await page.locator('#ai-gen-status').getAttribute('data-state');
  console.log('Generator state:',state,'message:',status);
  assert.equal(state,'success','Actual site failed to generate a 5-question test');
  const cards=page.locator('.card[data-id^="ai-"]');
  const cardCount=await cards.count();
  console.log('Saved generated AI test cards on screen:',cardCount);
  assert.ok(cardCount>=1,'Generated test card is missing from homepage');
  await cards.first().locator('a.card-cta').click();
  await page.locator('#screen-test:not([hidden])').waitFor({timeout:10000});
  const countText=await page.locator('#runner-count').textContent();
  console.log('Test runner opened:',countText);
  assert.equal(countText.trim(),'5');
  success=true;
  console.log('PASS: end-to-end website browser generated and opened an actual 5-question AI test.');
}catch(error){
  console.error('BROWSER E2E FAILURE:',error?.message||error);
  const status=await page.locator('#ai-gen-status').textContent().catch(()=>'?');
  const progress=await page.locator('#ai-gen-progress-label').textContent().catch(()=>'?');
  console.error('Last status:',status,'Progress:',progress);
  throw error;
}finally{
  try{await page.screenshot({path:'browser-ai-debug.png',fullPage:true})}catch(_){}
  for(const item of errors)console.error(item);
  await browser.close();
}
