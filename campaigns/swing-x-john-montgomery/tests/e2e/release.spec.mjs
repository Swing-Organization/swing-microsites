import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('full editorial journey is accessible and makes no external resource requests',async({page})=>{
 const foreign=[];const errors=[];page.on('request',r=>{if(new URL(r.url()).origin!=='http://127.0.0.1:4173')foreign.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/campaign/johnmontgomery/');
 for(const image of await page.locator('img[data-asset-id]').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);}
 const video=page.locator('video').first();await video.scrollIntoViewIfNeeded();await video.evaluate(v=>v.play());await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(.1);await video.evaluate(v=>v.pause());
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 expect(results.violations).toEqual([]);expect(foreign).toEqual([]);expect(errors).toEqual([]);
});
test('keyboard shortcut reaches collection and focus remains visible',async({page,browserName})=>{
 await page.goto('/campaign/johnmontgomery/');await page.keyboard.press(browserName==='webkit'?'Alt+Tab':'Tab');await expect(page.getByRole('link',{name:'Skip to the collection'})).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#products$/);
});
test('image request failure preserves geometry and alternative text',async({page})=>{
 await page.route('**/C04-*',r=>r.abort());await page.goto('/campaign/johnmontgomery/');const image=page.locator('img[data-asset-id="C04"]');await image.scrollIntoViewIfNeeded();
 await expect.poll(()=>image.evaluate(i=>i.complete)).toBe(true);const state=await image.evaluate(i=>({natural:i.naturalWidth,alt:i.alt,height:i.getBoundingClientRect().height}));expect(state.natural).toBe(0);expect(state.alt).toContain('Cream');expect(state.height).toBeGreaterThan(100);
});
for(const width of [320,390,640])test('200 percent text and unavailable webfonts preserve readable content at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.route('**/*.woff2',r=>r.abort());await page.goto('/campaign/johnmontgomery/');
 await page.evaluate(()=>{document.body.style.setProperty('--serif','Times New Roman, serif');document.body.style.setProperty('--script','Times New Roman, serif');const elements=[...document.querySelectorAll('h1,h2,h3,p,a,figcaption,.wordmark,.partner-name')];const sizes=elements.map(e=>parseFloat(getComputedStyle(e).fontSize));elements.forEach((e,i)=>e.style.fontSize=(sizes[i]*2)+'px');});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('#products h3')).toHaveCount(3);
});
test('initial and complete image transfer stay within the agreed budgets',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const bytes=[];page.on('response',r=>{const type=r.request().resourceType();if(['image','media'].includes(type))bytes.push(Number(r.headers()['content-length']||0));});
 await page.setViewportSize({width:390,height:844});await page.goto('/campaign/johnmontgomery/');await page.waitForLoadState('networkidle');expect(bytes.reduce((a,b)=>a+b,0)).toBeLessThanOrEqual(1024*1024);expect(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.paused&&v.currentTime===0))).toBe(true);
 for(const image of await page.locator('img[data-asset-id]').all()){await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(i=>i.complete)).toBe(true);}
 await page.waitForLoadState('networkidle');expect(bytes.reduce((a,b)=>a+b,0)).toBeLessThanOrEqual(8*1024*1024);expect(await page.locator('video').evaluateAll(vs=>vs.every(v=>v.paused&&v.currentTime===0))).toBe(true);
});
test('campaign entry redirects, exposes scoped headers, and leaves other routes absent',async({request})=>{
 const redirect=await request.get('/campaign/johnmontgomery',{maxRedirects:0});expect(redirect.status()).toBe(308);expect(redirect.headers().location).toBe('/campaign/johnmontgomery/');
 const page=await request.get('/campaign/johnmontgomery/');expect(page.status()).toBe(200);expect(page.headers()['content-security-policy']).toContain("connect-src 'none'");expect(page.headers()['cache-control']).toBe('no-cache');
 expect((await request.get('/products/not-built')).status()).toBe(404);expect((await request.get('/campaign/johnmontgomery/.swing-generated')).status()).toBe(404);
});
