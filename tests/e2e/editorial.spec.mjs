import {test,expect} from '@playwright/test';
test('editorial cover leads to three ordered sections and complete campaign photography',async({page})=>{
 await page.goto('/campaign/johnmontgomery/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Nothing better than a Sunday tea time.');
 expect(await page.locator('main > section').evaluateAll(nodes=>nodes.map(n=>n.id))).toEqual(['campaign','story','products']);
 await expect(page.getByRole('link',{name:'Explore the collection'})).toHaveAttribute('href','#products');
 await expect(page.locator('img[data-asset-id^="C"]')).toHaveCount(18);
 await page.getByRole('link',{name:'Explore the collection'}).click();await expect(page).toHaveURL(/#products$/);
});
for(const width of [320,390,768,1024,1440])test('no horizontal overflow at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/campaign/johnmontgomery/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('h1')).toBeVisible();
});
test('no JavaScript keeps images, story and collection anchor',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4173/campaign/johnmontgomery/');
 await expect(page.locator('img[data-asset-id^="C"]')).toHaveCount(18);await expect(page.locator('#story h2')).toHaveText('Old school prep, with moden vibes');
 await page.getByRole('link',{name:'Explore the collection'}).click();await expect(page).toHaveURL(/#products$/);await context.close();
});
test('one Sunday Edit section sits between two mixed-media collages',async({page})=>{
 await page.goto('/campaign/johnmontgomery/');
 await expect(page.getByRole('heading',{name:'The Sunday Edit',exact:true})).toHaveCount(1);
 expect(await page.locator('[data-chapter]').evaluateAll(nodes=>nodes.map(n=>n.dataset.chapter))).toEqual(['intro','collage-one','sunday-edit','collage-two','story','products']);
 for(const id of ['collage-one','collage-two']){
  await expect(page.locator('[data-chapter="'+id+'"] video')).toHaveCount(id==='collage-one'?3:1);
  expect(await page.locator('[data-chapter="'+id+'"] img[data-asset-id]').count()).toBeGreaterThan(0);
 }
 await expect(page.locator('.film-copy')).toHaveCount(0);
});

test("second collage retains only the requested rows",async({page})=>{await page.goto("/campaign/johnmontgomery/");expect(await page.locator('[data-chapter="collage-two"] .spread').evaluateAll(ns=>ns.map(n=>n.className))).toEqual(["spread spread-5 motion-spread","spread spread-7"]);});
