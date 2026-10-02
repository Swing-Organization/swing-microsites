import test from 'node:test';import assert from 'node:assert/strict';
import {validateMarkup} from '../../scripts/audit-output.mjs';
import {loadSite} from '../../scripts/content-policy.mjs';
const images=Array.from({length:24},(_,i)=>`C${String(i+1).padStart(2,'0')}`).filter(id=>!['C07','C12','C08','C17','C18','C23'].includes(id)).concat(['P01','P02','P03','P04','P05','P06']);
const document=()=>`<!doctype html><html lang="en"><head><title>The Sunday Edit | Swing × John Montgomery</title><meta name="robots" content="noindex,nofollow"></head><body><main><section id="campaign"><h1>Nothing better than a Sunday tea time.</h1>${images.map(id=>`<img data-asset-id="${id}" src="/campaign/johnmontgomery/assets/test.jpg" width="10" height="15" alt="Test view">`).join('')}${`<video data-autoplay loop controls muted playsinline preload="none" poster="/campaign/johnmontgomery/assets/test.jpg" src="/campaign/johnmontgomery/assets/test.mp4"></video>`.repeat(4)}</section><section id="story"><h2>Story</h2></section><section id="products"><h2>Products</h2></section></main></body></html>`;
test('audit accepts complete inert content and rejects real markup violations',async()=>{
 const site=await loadSite();assert.ok(validateMarkup(document(),site).resources.size>0);
 for(const transform of [s=>s.replace('data-asset-id="C06"','data-asset-id="C99"'),s=>s.replace('</body>','<script>alert(1)</script></body>'),s=>s.replace('<img ','<img onerror="bad()" '),s=>s.replace('/campaign/johnmontgomery/assets/test.jpg','https://evil.example/image.jpg'),s=>s.replace('</body>','<a href="java&#115;cript:alert(1)">bad</a></body>'),s=>s.replace('preload="none"','autoplay preload="auto"'),s=>s.replace('</body>','<iframe src="/campaign/johnmontgomery/"></iframe></body>')])assert.throws(()=>validateMarkup(transform(document()),site));
 assert.doesNotThrow(()=>validateMarkup(document().replace('alt="Test view"','alt="&quot; onerror=&quot;inert text"'),site));
});
