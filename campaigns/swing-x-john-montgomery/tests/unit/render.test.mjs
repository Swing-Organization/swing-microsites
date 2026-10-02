import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,access,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {escapeHtml} from '../../../../shared/render/html.mjs';
import {renderImage} from '../../src/render/image.mjs';
import {build} from '../../scripts/build.mjs';
import {startServer} from '../../../../scripts/serve.mjs';
import {loadSite} from '../../scripts/content-policy.mjs';
test('HTML-like copy becomes inert text and image metadata is escaped',()=>{
 assert.equal(escapeHtml('<script>"x"&</script>'),'&lt;script&gt;&quot;x&quot;&amp;&lt;/script&gt;');
 const markup=renderImage({id:'C01',alt:'" onerror="bad',width:100,height:150,variants:[{src:'assets/fixture.webp',format:'webp',width:100,height:150,bytes:10},{src:'assets/fixture.jpg',format:'jpeg',width:100,height:150,bytes:10}]});
 assert.ok(markup.includes('alt="&quot; onerror=&quot;bad"'));assert.match(markup,/width="100" height="150"/);assert.match(markup,/loading="lazy"/);
});
test('static build writes only campaign output with resolved image references',async()=>{
 const root=await mkdtemp(join(tmpdir(),'swing-build-'));
 try{
  const site=await loadSite();await build({outDir:root,site,sourceRoot:'campaigns/swing-x-john-montgomery/assets-source'});
  const html=await readFile(join(root,'campaign/johnmontgomery/index.html'),'utf8');
  assert.match(html,/Nothing better than/);assert.ok(!html.includes('drive.google.com'));
  await assert.rejects(access(join(root,'index.html')));
  for(const match of html.matchAll(/(?:src|href)="(\/campaign\/johnmontgomery\/assets\/[^" ]+)"/g))await access(join(root,match[1]));
  const changed=structuredClone(site);changed.products[0].href='https://evil.example/p';await assert.rejects(build({outDir:root,site:changed,sourceRoot:'campaigns/swing-x-john-montgomery/assets-source'}));
 }finally{await rm(root,{recursive:true,force:true});}
});
test('server isolates campaign routes and supports media ranges',async()=>{
 const root=await mkdtemp(join(tmpdir(),'swing-server-'));let server;
 try{
  await mkdir(join(root,'campaign/johnmontgomery/assets'),{recursive:true});
  await writeFile(join(root,'campaign/johnmontgomery/index.html'),'campaign');await writeFile(join(root,'campaign/johnmontgomery/assets/clip.mp4'),'0123456789');
  server=startServer({root,port:0});await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}`;
  const redirect=await fetch(base+'/campaign/johnmontgomery',{redirect:'manual'});assert.equal(redirect.status,308);
  assert.equal((await fetch(base+'/products/nope')).status,404);
  const range=await fetch(base+'/campaign/johnmontgomery/assets/clip.mp4',{headers:{range:'bytes=2-5'}});assert.equal(range.status,206);assert.equal(await range.text(),'2345');
  assert.equal((await fetch(base+'/campaign/johnmontgomery/assets/clip.mp4',{headers:{range:'bytes=99-'}})).status,416);
  const html=await fetch(base+'/campaign/johnmontgomery/');assert.match(html.headers.get('content-security-policy'),/connect-src 'none'/);
 }finally{if(server)await new Promise(r=>server.close(r));await rm(root,{recursive:true,force:true});}
});
