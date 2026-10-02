import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {validateProductUrl,validateSite,verifySources,loadSite} from '../../scripts/content-policy.mjs';
test('null remains noninteractive; only exact approved parent URLs link',()=>{
 assert.equal(validateProductUrl(null,[]),null);
 const good='https://wearswing.com/products/fixture';
 assert.equal(validateProductUrl(good,[good]),good);
 for(const url of ['javascript:alert(1)','//evil.example/p','https://wearswing.com.evil.example/p','https://wearswing.com@evil.example/p','https://user@wearswing.com/p','/p',good+'?redirect=x',good+'#x',good+' ']) assert.throws(()=>validateProductUrl(url,[url]));
 assert.throws(()=>validateProductUrl(good,[]));
});
test('approved site renders complete sources; omissions and substitutions fail',async()=>{
 const site=await loadSite(); validateSite(site);
 for(const mutate of [s=>s.layout.spreads[0].splice(1,1),s=>s.products[2].back='P99',s=>s.assets[0].driveId='unknown',s=>s.assets.push(s.assets[0]),s=>s.products[0].description='Invented',s=>s.campaign.headline='Sale now',s=>s.assets[0].approved=false]){
  const changed=structuredClone(site); mutate(changed); assert.throws(()=>validateSite(changed));
 }
});
test('source checksum, missing bytes, traversal, escaping symlinks are rejected',async()=>{
 const root=await mkdtemp(join(tmpdir(),'swing-policy-'));
 try {
  await writeFile(join(root,'image.jpg'),'approved');
  const a={id:'test',sourcePath:'image.jpg',sourceSha256:createHash('sha256').update('approved').digest('hex')};
  await verifySources([a],root);
  await writeFile(join(root,'image.jpg'),'changed'); await assert.rejects(verifySources([a],root),/test/);
  await assert.rejects(verifySources([{...a,sourcePath:'missing.jpg'}],root));
  await assert.rejects(verifySources([{...a,sourcePath:'../outside.jpg'}],root));
  await symlink('/etc/hosts',join(root,'escape.jpg')); await assert.rejects(verifySources([{...a,sourcePath:'escape.jpg'}],root));
 }finally {await rm(root,{recursive:true,force:true});}
});

test('film dimensions must be positive safe integers',async()=>{
 const site=await loadSite();
 for(const key of ['width','height'])for(const value of ['720" onloadedmetadata="alert(1)', '720', 0, -1, 1.5, null, Infinity, Number.MAX_SAFE_INTEGER+1]){
  const changed=structuredClone(site);changed.films[0][key]=value;
  assert.throws(()=>validateSite(changed),/film/);
 }
});
