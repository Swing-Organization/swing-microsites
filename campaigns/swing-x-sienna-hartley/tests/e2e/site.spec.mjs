import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const route='/campaign/siennahartley/';
test('Sienna: responsive layout, healthy images, equal products and accessible content',async({page})=>{
 await page.goto(route);
 await expect(page.getByRole('heading',{level:1})).toHaveText('A Roundwith Sienna');
 await expect(page.locator('.product')).toHaveCount(3);
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 for(const summary of await page.locator('.product summary').all())await summary.click();
 for(const image of await page.locator('img:not([hidden])').all()) {await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);}
 await expect(page.locator('.collection a')).toHaveCount(0);
 await expect(page.locator('.product details').first()).toHaveAttribute('open','');
 const a=await new AxeBuilder({page}).analyze();expect(a.violations).toEqual([]);
});
test('Sienna: reduced motion, native playback and failed film poster',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);
 const video=page.locator('video').first();await video.scrollIntoViewIfNeeded();expect(await video.evaluate(v=>v.paused)).toBe(true);
 await video.evaluate(v=>v.play());await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(0);
 await video.evaluate(v=>{v.pause();v.dispatchEvent(new Event('error'));});await expect(video).toBeHidden();await expect(page.locator('[data-film-fallback]').first()).toBeVisible();
});
test('Sienna: no JavaScript retains story, products and back views',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4173'+route);
 await expect(page.locator('.product')).toHaveCount(3);await page.locator('summary').last().click();await expect(page.locator('details').last()).toHaveAttribute('open','');await context.close();
});
