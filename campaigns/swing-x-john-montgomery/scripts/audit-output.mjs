import {parse} from 'parse5';
import {readFile,readdir,realpath,stat} from 'node:fs/promises';
import {resolve,join,relative,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {loadSite,validateSite,validateProductUrl,BASE,safeLocalPath} from './content-policy.mjs';
export function validateMarkup(html,site){
 const resources=new Set();const ids=[];const headings=[];const sections=[];let films=0;
 const resource=value=>{if(!value.startsWith(BASE+'assets/'))throw Error(`Noncampaign resource: ${value}`);safeLocalPath(value.slice(BASE.length));resources.add(value);};
 const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
 function walk(node){
  if(node.tagName){
   const a=Object.fromEntries((node.attrs??[]).map(x=>[x.name,x.value]));
   if(['iframe','object','embed','form','base'].includes(node.tagName))throw Error('Forbidden element '+node.tagName);
   for(const name of Object.keys(a))if(name.startsWith('on')||name==='style'||name==='srcdoc')throw Error('Unsafe inline attribute');
   if(node.tagName==='meta'&&a['http-equiv'])throw Error('Unexpected http-equiv');
   if(node.tagName==='script'&&(!a.src||text(node).trim()))throw Error('Inline script');
   for(const name of ['src','poster'])if(a[name])resource(a[name]);
   if(a.srcset)for(const source of a.srcset.split(','))resource(source.trim().split(/\s+/)[0]);
   if(a.href){if(node.tagName==='a'){if(a.href!=='#products')validateProductUrl(a.href,site.approvedProductUrls);}else resource(a.href);}
   if(node.tagName==='img'){
    if(!a.alt||!(Number(a.width)>0)||!(Number(a.height)>0))throw Error('Image lacks accessible dimensions');
    if(a['data-asset-id'])ids.push(a['data-asset-id']);
   }
   if(node.tagName==='h1')headings.push(text(node).replace(/\s+/g,' ').trim());
   if(node.tagName==='section'&&node.parentNode?.tagName==='main')sections.push(a.id);
   if(node.tagName==='video'){
    films++;if(!('controls'in a)||!('muted'in a)||!('playsinline'in a)||!('loop'in a)||!('data-autoplay'in a)||('autoplay'in a)||a.preload!=='none'||!a.poster)throw Error('Unsafe film behavior');
   }
  }
  for(const child of node.childNodes??[])walk(child);
 }
 walk(parse(html));
 const expected=site.assets.filter(a=>a.kind==='image').map(a=>a.id);
 if(ids.length!==expected.length||new Set(ids).size!==expected.length||expected.some(id=>!ids.includes(id))||ids.some(id=>!expected.includes(id)))throw Error('Incomplete approved photography');
 if(headings.length!==1||headings[0]!==site.campaign.headline)throw Error('Wrong campaign heading');
 if(sections.join(',')!=='campaign,story,products')throw Error('Wrong editorial order');
 if(films<1||films!==site.films.length)throw Error('Campaign film missing');
 return {resources,imageCount:ids.length,filmCount:films};
}
export async function auditOutput(outDir='dist'){
 const site=await loadSite();validateSite(site);
 const root=await realpath(outDir);const target=join(root,'campaign/johnmontgomery');
 const html=await readFile(join(target,'index.html'),'utf8');const result=validateMarkup(html,site);
 let scriptBytes=0,styleBytes=0,imageStorageBytes=0;
 for(const resource of result.resources){
  const file=await realpath(join(root,resource));const rel=relative(target,file);
  if(rel.startsWith('..'+sep)||rel==='..')throw Error('Escaping output reference');
  const bytes=await readFile(file);const expectedHash=/[-]([a-f0-9]{12})\.[a-z0-9]+$/.exec(file)?.[1];
  if(!expectedHash||createHash('sha256').update(bytes).digest('hex').slice(0,12)!==expectedHash)throw Error('Output resource hash mismatch: '+resource);
  if(extname(file)==='.mjs'){
   scriptBytes+=gzipSync(bytes).length;
   if(/\b(fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|serviceWorker)\b|document\.cookie/.test(bytes.toString()))throw Error('Unexpected script capability');
  }
  if(extname(file)==='.css'){
   styleBytes+=gzipSync(bytes).length;
   if(/@import\b/i.test(bytes.toString()))throw Error('Imported CSS is not approved');
   for(const m of bytes.toString().matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g))if(!m[1].startsWith(BASE+'assets/'))throw Error('External CSS resource');
  }
  if(['.jpg','.webp'].includes(extname(file)))imageStorageBytes+=bytes.length;
 }
 if(scriptBytes>15*1024||scriptBytes+styleBytes>50*1024)throw Error('Initial code budget exceeded');
 async function inspect(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  if(entry.isSymbolicLink())throw Error('Symlink in output');
  if(entry.isDirectory()){await inspect(join(dir,entry.name));continue;}
  if(!['index.html','.swing-generated'].includes(entry.name)&&!result.resources.has(BASE+relative(target,join(dir,entry.name)).split(sep).join('/')))throw Error('Unreferenced file in artifact: '+entry.name);
 }}
 await inspect(target);
 return {...result,resources:result.resources.size,scriptGzipBytes:scriptBytes,styleGzipBytes:styleBytes,imageVariantStorageBytes:imageStorageBytes};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(JSON.stringify(await auditOutput(),null,2));
