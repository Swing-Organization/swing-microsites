import test from 'node:test';import assert from 'node:assert/strict';
import {renderProducts} from '../../src/render/products.mjs';
import {loadSite} from '../../scripts/content-policy.mjs';
test('product renderer preserves descriptions and allows only vetted links',async()=>{
 const site=await loadSite();const images={};for(const a of site.assets.filter(a=>a.id.startsWith('P')))images[a.id]={...a,variants:[{src:`assets/${a.id}.webp`,width:a.width,height:a.height,format:'webp',bytes:1}]};
 const noLinks=renderProducts(site.products,images,[]);assert.ok(!noLinks.includes('<a '));assert.ok(noLinks.includes('Lightweight protection with a refined edge.'));
 const url='https://wearswing.com/products/fixture';const products=structuredClone(site.products);products[0].href=url;
 assert.throws(()=>renderProducts(products,images,[]));assert.ok(renderProducts(products,images,[url]).includes(`href="${url}"`));
 products[0].name='<script>alert(1)</script>';const safe=renderProducts(products,images,[url]);assert.ok(!safe.includes('<script>'));assert.ok(safe.includes('&lt;script&gt;'));
});
