import {readFile,access,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {parse} from 'parse5';
export async function auditOutput(){
 const root='dist/campaign/siennahartley',base='/campaign/siennahartley/';const html=await readFile(join(root,'index.html'),'utf8');
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes??[])walk(c);}walk(parse(html));
 let images=0,films=0;
 for(const n of nodes){const a=Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));if(n.tagName==='img'){images++;if(!a.alt)throw Error('Missing alt');}if(n.tagName==='video'){films++;for(const k of ['controls','muted','playsinline'])if(!(k in a))throw Error('Unsafe video');}
 for(const key of ['src','href','poster'])if(a[key]&&!a[key].startsWith('#')){if(!a[key].startsWith(base)||a[key].includes('..'))throw Error('External/unsafe URL');await access(join(root,a[key].slice(base.length)));}
 }
 if(images!==19||films!==2)throw Error('Incomplete campaign media');
 if(/https?:|drive\.google|sourceSha256|assets-source/.test(html))throw Error('Source leak or external URL');
 for(const f of await readdir(join(root,'assets')))if(!/^[A-Za-z0-9-]+\.(webp|jpg|mp4|css|mjs)$/.test(f))throw Error('Unexpected file');
 return {images,films,route:base};
}
