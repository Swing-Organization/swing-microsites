import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {parse} from 'parse5';
const site=JSON.parse(await readFile(new URL('../../content/site.json',import.meta.url)));
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
async function render(s=site){
 const {renderPage}=await import('../../src/page.mjs');
 const images=Object.fromEntries(s.assets.filter(a=>a.kind==='image').map(a=>[a.id,{...a,src:`assets/${a.id}.webp`,variants:[{src:`assets/${a.id}.webp`,width:720}]}]));
 const films=Object.fromEntries(s.assets.filter(a=>a.kind==='video').map(a=>[a.id,{...a,src:`assets/${a.id}.mp4`,poster:`assets/${a.id}-poster.webp`}]));
 return renderPage(s,images,{style:'assets/style.css',script:'assets/film.mjs',films});
}
test('every supplied original is presented, with equal two-view product stories and inactive shopping',async()=>{
 const html=await render();const all=walk(parse(html));
 assert.deepEqual(all.filter(n=>attrs(n)['data-asset']).map(n=>attrs(n)['data-asset']).sort(),['C1','C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12','C13','C14','C15','P1','P2','P3','P4','P5','P6','V1','V2','V3','V4','V5'].sort());
 const products=all.filter(n=>n.tagName==='article');assert.equal(products.length,3);
 for(const p of products){assert.equal(walk(p).filter(n=>n.tagName==='img').length,2);assert.equal(walk(p).filter(n=>['a','button'].includes(n.tagName)).length,0);}
 assert.equal(all.filter(n=>n.tagName==='h1').length,1);assert.match(html.replace(/<[^>]*>/g,''),/A new court, the same swing\./);
 for(const n of all.filter(n=>n.tagName==='a'))assert.ok(attrs(n).href.startsWith('#'));
 assert.equal(all.filter(n=>attrs(n)['data-shopping']!==undefined).length>=7,true);
 assert.doesNotMatch(html,/https?:|\$\d|patterned|knit polo dress/i);
});
test('source text is escaped and five films offer native controls and poster fallbacks',async()=>{
 const s=structuredClone(site);s.products[0].name='<script>alert(1)</script>';const html=await render(s);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>alert/);
 const nodes=walk(parse(html));const videos=nodes.filter(n=>n.tagName==='video');assert.equal(videos.length,5);
 for(const v of videos){const a=attrs(v);for(const key of ['controls','muted','playsinline','poster'])assert.ok(key in a);assert.equal(a.preload,'none');assert.ok(!('autoplay' in a));}
 assert.equal(nodes.filter(n=>attrs(n)['data-film-fallback']!==undefined).length,5);
});
test('build refuses unowned output and corrupt originals before creating output',async()=>{
 const {assertOwnedOutput}=await import('../../scripts/build.mjs');const temp=await mkdtemp(join(tmpdir(),'sunday-set-test-'));
 try{await assert.rejects(assertOwnedOutput(temp),/Unowned output/);await writeFile(join(temp,'.swing-generated'),'sunday-set-v1');await assertOwnedOutput(temp);
 const root=join(temp,'campaigns/swing-x-sunday-set');await mkdir(join(root,'content'),{recursive:true});await mkdir(join(root,'assets-source'));await writeFile(join(root,'content/site.json'),JSON.stringify(site));await writeFile(join(root,'assets-source',site.assets[0].sourcePath),'corrupt');
 const result=spawnSync(process.execPath,[new URL('../../scripts/build.mjs',import.meta.url).pathname],{cwd:temp,encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/Source checksum/);
 }finally{await rm(temp,{recursive:true,force:true});}
});
test('output audit rejects external requests and encoded traversal',async()=>{
 const {auditOutput}=await import('../../scripts/audit-output.mjs');const temp=await mkdtemp(join(tmpdir(),'sunday-audit-'));
 try{for(const src of ['https://example.com/tracker.png','/campaign/sunday-set/assets/%2e%2e/secret.webp']){await writeFile(join(temp,'index.html'),`<!doctype html><html><body><img src="${src}" alt="test"></body></html>`);await assert.rejects(auditOutput(temp),/Unsafe URL/);}}finally{await rm(temp,{recursive:true,force:true});}
});
