import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const site = 'https://aakash9972sn.github.io/newTest/';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push('PAGEERROR '+String(e).slice(0,500)));
page.on('console', m => { if(m.type()==='error') pageErrors.push('CONSOLE '+m.text().slice(0,500));});
page.on('response',r=>{const url=r.url();if(/firebase|identitytoolkit|run\.app/.test(url)&&r.status()>=400)console.log('NETWORK_STATUS',r.status(),new URL(url).hostname,new URL(url).pathname);});
try {
 await page.goto(site,{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('.account-launcher').waitFor({timeout:20000});
 console.log('PAGE_VERSION',await page.locator('script[src*="ai-assistant"]').getAttribute('src'));
 console.log('AI_MOUNTED',await page.locator('aakash-assistant').count());
 console.log('ACCOUNT_VISIBLE',await page.locator('.account-launcher').isVisible());
 await page.locator('.account-launcher').click();
 await page.locator('.account-panel[open]').waitFor({timeout:10000});
 const login=page.locator('.account-login');
 console.log('INITIAL_LOGIN',await login.textContent());
 await page.waitForTimeout(9000);
 console.log('AFTER_INIT_LOGIN',await login.textContent());
 console.log('AUTH_STATUS',await page.locator('.account-panel [role="status"]').textContent());
 console.log('LOGIN_DISABLED',await login.isDisabled());
 // Test ONLY whether the browser can open a sign-in flow; no personal credentials.
 if(await login.isEnabled() && (await login.textContent()).includes('Continue')){
   await login.click();
   await page.waitForTimeout(5000);
   console.log('AFTER_CLICK_LOGIN',await login.textContent());
   console.log('AFTER_CLICK_STATUS',await page.locator('.account-panel [role="status"]').textContent());
   console.log('OPEN_POPUPS',page.context().pages().length);
   for(const p of page.context().pages().slice(1)){console.log('POPUP_HOST',new URL(p.url()).hostname);await p.close().catch(()=>{});}
 } else console.log('SIGNIN_NOT_CLICKED',await login.textContent());
 console.log('ERRORS',JSON.stringify(pageErrors.slice(0,12)));
} finally {
 await page.screenshot({path:'auth-diagnostic.png',fullPage:true}).catch(()=>{});
 await browser.close();
}
