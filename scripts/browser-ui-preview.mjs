import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ico':'image/x-icon'};
const server=createServer(async(req,res)=>{
  const url=new URL(req.url||'/', 'http://localhost');
  const pathname=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const target=resolve(join(root,pathname));
  if(!target.startsWith(root+'/') && target!==root){res.writeHead(403).end();return;}
  try{
    const data=await readFile(target);
    res.writeHead(200,{'Content-Type':types[extname(target)]||'text/plain','Cache-Control':'no-store'}).end(data);
  }catch{res.writeHead(404).end('Not found');}
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
const site='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1200,height:850}});
const scriptErrors=[];
page.on('pageerror',e=>scriptErrors.push(String(e)));
try{
 await page.goto(site,{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('aakash-assistant .launcher').waitFor({timeout:12000});
 const launcher=page.locator('aakash-assistant .launcher');
 assert.match(await launcher.textContent(),/Ask Gemini/);
 assert.equal(await page.locator('aakash-assistant').count(),1);
 await page.evaluate(()=>{
   window.HostedAI.request=async (payload,signal,onText)=>{
     if(payload.action==='google_search'){
       onText?.('Grounded research result');
       return {answer:'Grounded research result',googleGrounded:true,
         sources:[{title:'Example source',url:'https://example.org/science'}]};
     }
     onText?.('Partial Gemini response');
     return {answer:'Mock Gemini response'};
   };
 });
 await launcher.click();
 assert.match(await page.locator('aakash-assistant .eyebrow').textContent(),/GOOGLE GEMINI/);
 assert.match(await page.locator('aakash-assistant #assistant-title').textContent(),/Aakash Gemini/);
 await page.locator('aakash-assistant textarea').fill('Explain Kirchhoff laws');
 await page.locator('aakash-assistant .send').click();
 await page.locator('aakash-assistant .message.assistant').waitFor({timeout:10000});
 const message=await page.locator('aakash-assistant .message.assistant').last().textContent();
 assert.match(message,/Mock Gemini response/);
 await page.locator('aakash-assistant textarea').fill('Recent science discoveries');
 await page.locator('aakash-assistant .google-search').click();
 await page.locator('aakash-assistant .google-citations a').waitFor({timeout:10000});
 assert.equal(await page.locator('aakash-assistant .google-citations a').getAttribute('href'),'https://example.org/science');
 await page.locator('aakash-assistant .close').click();
 await page.locator('.account-launcher').click();
 await page.locator('.account-panel[open]').waitFor({timeout:8000});
 assert.equal(await page.locator('.account-diagnostics').count(),1);
 console.log('PASS new Gemini launcher, streamed chat UI, in-chat Google citations and Firebase account panel rendered.');
 console.log('NOTE AI responses were mocked for the UI-only test; Firebase login cannot succeed without domain authorization.');
 if(scriptErrors.length)console.log('Page runtime errors:',JSON.stringify(scriptErrors));
}finally{
 await page.screenshot({path:'gemini-ui-preview.png',fullPage:true}).catch(()=>{});
 await browser.close();await new Promise(resolve=>server.close(resolve));
}
