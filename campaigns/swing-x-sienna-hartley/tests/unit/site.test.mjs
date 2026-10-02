import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const path=new URL('../../content/site.json',import.meta.url);
test('Sienna has three equally presented products and no invented shopping destinations',async()=>{
 const s=JSON.parse(await readFile(path));
 assert.deepEqual(s.products.map(p=>p.name),['Kin Polo','Clara Dress','Luisa Jacket']);
 for(const p of s.products){assert.equal(p.url,null);assert.equal(p.images.length,2);assert.ok(p.description.length>40);}
 assert.equal(s.route,'/campaign/siennahartley/');
 assert.equal(s.films.length,2);
 assert.ok(s.assets.every(a=>a.driveId&&/^[a-f0-9]{64}$/.test(a.sourceSha256)));
});

test('build refuses an existing unmarked output directory',async()=>{
 const {mkdtemp,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const {assertOwnedOutput}=await import('../../scripts/build.mjs');const path=await mkdtemp(join(tmpdir(),'sienna-ownership-'));
 try{await assert.rejects(()=>assertOwnedOutput(path),/Unowned output/);}finally{await rm(path,{recursive:true,force:true});}
});
