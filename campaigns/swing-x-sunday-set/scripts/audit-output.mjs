import {readFile,access,readdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {parse} from 'parse5';
export async function auditOutput(root='dist/campaign/sunday-set') {
 const base='/campaign/sunday-set/',html=await readFile(join(root,'index.html'),'utf8');
 const nodes=[];const walk=n=>{nodes.push(n);for(const c of n.childNodes??[])walk(c);};walk(parse(html));
 const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
 const ids=new Set(nodes.map(n=>attrs(n).id).filter(Boolean));
 const check=async url=>{
  if(url.startsWith('#')){if(!ids.has(url.slice(1)))throw Error('Unknown anchor');return;}
  if(!url.startsWith(base+'assets/')||!/^assets\/[A-Za-z0-9-]+\.(webp|mp4|css|mjs)$/.test(url.slice(base.length)))throw Error('Unsafe URL: '+url);
  await access(join(root,url.slice(base.length)));
 };
 let images=0,films=0;const seen=[];
 for(const n of nodes){
  const a=attrs(n);
  for(const key of ['src','href','poster'])if(a[key])await check(a[key]);
  if(a.srcset)for(const candidate of a.srcset.split(',')){const [url,width]=candidate.trim().split(/\s+/);if(!/^\d+w$/.test(width))throw Error('Unsafe srcset');await check(url);}
  if(n.tagName==='img'){images++;if(!a.alt)throw Error('Missing alt');}
  if(n.tagName==='video'){films++;for(const k of ['controls','muted','playsinline','poster'])if(!(k in a))throw Error('Unsafe video');if(a.preload!=='none'||'autoplay' in a)throw Error('Eager video');}
  if('data-asset' in a)seen.push(a['data-asset']);
  if('data-shopping' in a&&(n.tagName!=='span'||'tabindex' in a))throw Error('Interactive shopping');
  if(Object.keys(a).some(k=>k.startsWith('on')||k==='style'))throw Error('Inline code');
  if(n.tagName==='script'&&(!a.src||n.childNodes?.some(c=>c.value?.trim())))throw Error('Inline script');
 }
 const expected=[...Array.from({length:15},(_,i)=>'C'+(i+1)),...Array.from({length:6},(_,i)=>'P'+(i+1)),...Array.from({length:5},(_,i)=>'V'+(i+1))].sort();
 if(JSON.stringify(seen.sort())!==JSON.stringify(expected)||images!==26||films!==5)throw Error('Incomplete campaign media');
 if(/https?:|drive\.google|sourceSha256|assets-source|sourceFileName/.test(html))throw Error('Source leak');
 let bytes=Buffer.byteLength(html);
 for(const name of await readdir(join(root,'assets'))){if(!/^[A-Za-z0-9-]+\.(webp|mp4|css|mjs)$/.test(name))throw Error('Unexpected output');bytes+=(await stat(join(root,'assets',name))).size;}
 if(bytes>40*1024*1024)throw Error('Campaign exceeds 40 MiB media budget');
 return {images:21,fallbackPosters:5,films,bytes,route:base};
}

