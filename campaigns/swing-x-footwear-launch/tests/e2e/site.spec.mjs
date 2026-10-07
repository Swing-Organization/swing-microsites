import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route='/campaign/footwear-launch/';
for(const width of [390,1440])test(`editorial layout and collection navigation at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto(route);
 await expect(page.locator('h1')).toHaveText('This is a test');
 await expect(page.locator('main section')).toHaveCount(5);
 await page.getByRole('link',{name:'Explore the Collection'}).click();await expect(page).toHaveURL(/#collection$/);
 await expect(page.locator('article')).toHaveCount(3);await expect(page.locator('article a,article button')).toHaveCount(0);
 for(const img of await page.locator('img:not([hidden])').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);
});
test('reduced motion, manual pause and failed film preserve visitor control',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);const video=page.locator('video').first();await video.scrollIntoViewIfNeeded();await expect.poll(()=>video.evaluate(v=>v.paused)).toBe(true);
 await page.emulateMedia({reducedMotion:'no-preference'});await expect.poll(()=>video.evaluate(v=>!v.paused)).toBe(true);
 await video.evaluate(v=>v.pause());await page.locator('h1').scrollIntoViewIfNeeded();await video.scrollIntoViewIfNeeded();await expect.poll(()=>video.evaluate(v=>v.paused)).toBe(true);
 await page.route(/\.mp4(?:\?|$)/,route=>route.fulfill({status:404,body:'Not found'}));await video.evaluate(v=>{v.src=v.src+'?failure-test';v.preload='auto';v.load();v.play().catch(()=>{});});await expect(video).toBeHidden();await expect(page.locator('[data-film-fallback]').first()).toBeVisible();await expect(page.getByRole('status').first()).toHaveText('Film unavailable');
});
test('content and anchors work with JavaScript disabled',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+route);await expect(page.getByRole('heading',{name:'Kin Polo'})).toBeVisible();await page.getByRole('link',{name:'Explore Swing Tennis'}).click();await expect(page).toHaveURL(/#collection$/);await context.close();
});
test('keyboard can reach collection without a trap',async({page,browserName})=>{const tabKey=process.platform==='darwin'&&browserName==='webkit'?'Alt+Tab':'Tab';await page.goto(route);await page.keyboard.press(tabKey);await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();await page.keyboard.press(tabKey);await expect(page.getByRole('link',{name:'Explore the Collection'})).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#collection$/);});
test('mobile editorial media uses one column',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto(route);for(const selector of ['.chapter-media','.apres-media'])expect(await page.locator(selector).evaluate(e=>getComputedStyle(e).gridTemplateColumns.trim().split(/\s+/).length)).toBe(1);});
