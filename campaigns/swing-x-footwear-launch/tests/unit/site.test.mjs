import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
const site=JSON.parse(await readFile(new URL('../../content/site.json',import.meta.url)));
async function rendered(s=site){const m=await import('../../src/page.mjs');const images=Object.fromEntries(s.assets.filter(a=>a.kind==='image').map(a=>[a.id,{...a,src:`assets/${a.id}.webp`,variants:[{src:`assets/${a.id}.webp`,width:720}]}]));return m.renderPage(s,images,{style:'assets/style.css',script:'assets/film.mjs'});}
function nodes(html){const out=[];function walk(n){out.push(n);for(const c of n.childNodes??[])walk(c);}walk(parse(html));return out;}
test('five-part tennis story has display-only products and working collection targets',async()=>{
 const html=await rendered();const all=nodes(html);const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
 assert.equal(all.filter(n=>n.tagName==='section').length,5);
 const text=html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');assert.match(text,/A New Court\./);assert.match(text,/The Same Swing\./);
 assert.match(text,/Meet Swing Tennis\. Your afternoon starts here\./);
 assert.equal(all.filter(n=>n.tagName==='article').length,3);
 assert.equal(all.filter(n=>n.tagName==='a'&&attrs(n).href==='#collection').length,2);
 for(const n of all.filter(n=>n.tagName==='article'))assert.equal(nodesFrom(n).some(x=>['a','button'].includes(x.tagName)),false);
 assert.doesNotMatch(html,/Shop |\$\d|https?:\/\//);
 for(const n of all.filter(n=>n.tagName==='video'))for(const k of ['controls','muted','playsinline'])assert.ok(k in attrs(n));
});
function nodesFrom(n){return [n,...(n.childNodes??[]).flatMap(nodesFrom)];}
test('product source text is escaped',async()=>{const s=structuredClone(site);s.products[0].name='<script>alert(1)</script>';assert.match(await rendered(s),/&lt;script&gt;/);});
test('build refuses unowned output and corrupted source',async()=>{
 const {mkdtemp,mkdir,writeFile,rm,cp}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {spawnSync}=await import('node:child_process');
 const {assertOwnedOutput}=await import('../../scripts/build.mjs');const temp=await mkdtemp(join(tmpdir(),'footwear-test-'));
 try{await assert.rejects(assertOwnedOutput(temp),/Unowned output/);await writeFile(join(temp,'.swing-generated'),'footwear-v1');await assert.doesNotReject(assertOwnedOutput(temp));
 const root=join(temp,'campaigns/swing-x-footwear-launch');await mkdir(join(root,'content'),{recursive:true});await mkdir(join(root,'assets-source'),{recursive:true});await writeFile(join(root,'content/site.json'),JSON.stringify(site));await writeFile(join(root,'assets-source',site.assets[0].sourcePath),'corrupt');
 const script=new URL('../../scripts/build.mjs',import.meta.url).pathname;const result=spawnSync(process.execPath,[script],{cwd:temp,encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/Source checksum/);
 }finally{await rm(temp,{recursive:true,force:true});}
});
