import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route='/campaign/sunday-set/';
for(const width of [390,1440])test(`all media and equal product views are usable at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);
 await expect(page.locator('h1')).toHaveText('The same swing, a new Sunday set');
 await expect(page.locator('[data-asset]')).toHaveCount(26);await expect(page.locator('article')).toHaveCount(3);
 for(const product of await page.locator('article').all()){await expect(product.locator('img')).toHaveCount(2);await expect(product.locator('a,button')).toHaveCount(0);}
 for(const img of await page.locator('img:not([hidden])').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});
test('small screens have no horizontal overflow',async({page})=>{await page.setViewportSize({width:320,height:700});await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
test('keyboard reaches real editorial anchors and skips inactive shopping',async({page,browserName})=>{const tabKey=process.platform==='darwin'&&browserName==='webkit'?'Alt+Tab':'Tab';
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);await page.keyboard.press(tabKey);await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 await page.keyboard.press(tabKey);await expect(page.getByRole('link',{name:'The afternoon starts here'})).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#love-all$/);
 await expect(page.locator('[data-shopping][tabindex],a[data-shopping],button[data-shopping]')).toHaveCount(0);
});
test('motion respects reduced motion, offscreen pause and manual pause; failed films retain a poster',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);const video=page.locator('video').first();await video.scrollIntoViewIfNeeded();await expect.poll(()=>video.evaluate(v=>v.paused)).toBe(true);
 await page.emulateMedia({reducedMotion:'no-preference'});await expect.poll(()=>video.evaluate(v=>!v.paused&&v.currentTime>0)).toBe(true);
 await page.locator('h1').scrollIntoViewIfNeeded();await expect.poll(()=>video.evaluate(v=>v.paused)).toBe(true);await video.scrollIntoViewIfNeeded();await expect.poll(()=>video.evaluate(v=>!v.paused)).toBe(true);
 await video.evaluate(v=>v.pause());await page.locator('h1').scrollIntoViewIfNeeded();await video.scrollIntoViewIfNeeded();await expect.poll(()=>video.evaluate(v=>v.paused)).toBe(true);
 await page.route(/\.mp4\?failure$/,r=>r.fulfill({status:404,body:'Not found'}));await video.evaluate(v=>{v.src+='?failure';v.preload='auto';v.load();v.play().catch(()=>{});});await expect(video).toBeHidden();await expect(page.locator('[data-film-fallback]').first()).toBeVisible();await expect(page.getByRole('status').first()).toHaveText('Film unavailable');
});
test('every film can play when requested',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);await expect(page.locator('video')).toHaveCount(5);
 for(const v of await page.locator('video').all()){await v.scrollIntoViewIfNeeded();await v.evaluate(v=>{v.muted=true;return v.play();});await expect.poll(()=>v.evaluate(v=>v.currentTime>0)).toBe(true);await v.evaluate(v=>v.pause());}
});
test('all editorial and product content survives without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+route);
 await expect(page.locator('[data-asset]')).toHaveCount(26);for(const name of ['Kin Polo','Clara Dress','Luisa Jacket'])await expect(page.getByRole('heading',{name,exact:true})).toBeAttached();
 await page.getByRole('link',{name:'The afternoon starts here'}).click();await expect(page).toHaveURL(/#love-all$/);await context.close();
});

