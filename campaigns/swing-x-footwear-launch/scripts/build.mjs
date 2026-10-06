import {readFile,writeFile,mkdir,copyFile,rm,lstat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {renderPage} from '../src/page.mjs';
const ROOT='campaigns/swing-x-footwear-launch';
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function assertOwnedOutput(target){
 let st;try{st=await lstat(target);}catch(e){if(e.code==='ENOENT')return;throw e;}
 if(st.isSymbolicLink()||!st.isDirectory())throw Error('Unowned output');
 let marker;try{marker=await readFile(join(target,'.swing-generated'),'utf8');}catch{throw Error('Unowned output');}
 if(marker!=='footwear-v1')throw Error('Unowned output');
}
export async function build(){
 const s=JSON.parse(await readFile(`${ROOT}/content/site.json`,'utf8'));
 const source=`${ROOT}/assets-source`,target=resolve('dist/campaign/footwear-launch');
 for(const a of s.assets){if(!/^[CPV]\d+\.(jpg|webp|mp4)$/.test(a.sourcePath))throw Error('Unsafe source');if(hash(await readFile(join(source,a.sourcePath)))!==a.sourceSha256)throw Error(`Source checksum: ${a.id}`);}
 await assertOwnedOutput(target);
 await mkdir(join(target,'assets'),{recursive:true});
 const images={};
 for(const a of s.assets.filter(a=>a.kind==='image')){
  const variants=[];
  for(const width of [...new Set([360,720,1200].map(w=>Math.min(w,a.width)))]){
   const {data,info}=await sharp(join(source,a.sourcePath)).rotate().resize({width,withoutEnlargement:true}).webp({quality:82}).toBuffer({resolveWithObject:true});
   const src=`assets/${a.id}-${width}-${hash(data).slice(0,12)}.webp`;await writeFile(join(target,src),data);variants.push({src,width:info.width});
  }
  images[a.id]={...a,src:variants.at(-1).src,variants};
 }
 for(const f of s.films)for(const key of ['src','posterSrc']){
  if(!/^assets\/[A-Za-z0-9.-]+$/.test(f[key]))throw Error('Unsafe derivative');
  const bytes=await readFile(join(source,'film',f[key].slice(7)));if(hash(bytes)!==f[key+'Sha256'])throw Error('Film checksum');await writeFile(join(target,f[key]),bytes);
 }
 const resources={};
 for(const [name,path,ext] of [['style',`${ROOT}/src/style.css`,'css'],['script','shared/client/film.mjs','mjs']]){const bytes=await readFile(path);resources[name]=`assets/${name}-${hash(bytes).slice(0,12)}.${ext}`;await writeFile(join(target,resources[name]),bytes);}
 await writeFile(join(target,'index.html'),renderPage(s,images,resources));await writeFile(join(target,'.swing-generated'),'footwear-v1');
 // Remove obsolete generated assets only from this owned campaign output.
 const {readdir}=await import('node:fs/promises');const used=new Set([...Object.values(images).flatMap(i=>i.variants.map(v=>v.src.slice(7))),...s.films.flatMap(f=>[f.src.slice(7),f.posterSrc.slice(7)]),...Object.values(resources).map(v=>v.slice(7))]);
 for(const file of await readdir(join(target,'assets')))if(!used.has(file))await rm(join(target,'assets',file));
 return {output:target,images:Object.keys(images).length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(await build());
