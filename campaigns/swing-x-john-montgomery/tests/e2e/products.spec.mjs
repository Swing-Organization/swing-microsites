import {test,expect} from '@playwright/test';
test('three approved product records show all six views with no premature links',async({page})=>{
 await page.goto('/campaign/johnmontgomery/');const cards=page.locator('#products [data-product-id]');
 await expect(cards).toHaveCount(3);expect(await cards.locator('h3').allTextContents()).toEqual(['Kin Polo','Clara Dress','Luisa Jacket']);
 await expect(page.locator('#products img[data-asset-id]')).toHaveCount(6);await expect(page.locator('#products a')).toHaveCount(0);
 const luisa=page.locator('[data-product-id="luisa-jacket"]');expect(await luisa.locator('img').evaluateAll(ns=>ns.map(n=>n.dataset.assetId))).toEqual(['P06','P05']);
});
test('product fronts and backs remain visible without scripts at 320px',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const page=await context.newPage();await page.goto('http://127.0.0.1:4173/campaign/johnmontgomery/');
 for(const image of await page.locator('#products img').all()){await image.scrollIntoViewIfNeeded();await expect(image).toBeVisible();expect(await image.evaluate(i=>getComputedStyle(i).objectFit)).toBe('contain');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
