import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {prepareImages} from '../../scripts/prepare-media.mjs';
test('small sources retain proportions and never upscale',async()=>{
 const root=await mkdtemp(join(tmpdir(),'swing-media-'));
 try{
  await sharp({create:{width:100,height:150,channels:3,background:'#24533E'}}).jpeg().toFile(join(root,'sample.jpg'));
  const sourceSha256=createHash('sha256').update(await readFile(join(root,'sample.jpg'))).digest('hex');
  const asset={id:'fixture',sourcePath:'sample.jpg',sourceSha256,kind:'image',width:100,height:150,alt:'Test image'};
  const result=await prepareImages([asset],root,join(root,'output'));
  assert.ok(result.fixture.variants.length>=2);
  for(const v of result.fixture.variants){assert.ok(v.width<=100);assert.equal(v.height/v.width,1.5);assert.ok(v.bytes>0);assert.match(v.src,/fixture-100-[a-f0-9]+\.(webp|jpg)$/);}
  await writeFile(join(root,'bad.jpg'),'corrupt');
  const bad={...asset,id:'broken',sourcePath:'bad.jpg',sourceSha256:createHash('sha256').update('corrupt').digest('hex')};
  await assert.rejects(prepareImages([bad],root,join(root,'output')),/broken/);
 }finally{await rm(root,{recursive:true,force:true});}
});
