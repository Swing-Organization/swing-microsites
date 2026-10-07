import {readFile,writeFile,mkdir,readdir,rm,lstat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {renderPage} from '../src/page.mjs';
const ROOT='campaigns/swing-x-sunday-set';
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function assertOwnedOutput(target) {
 let st;try{st=await lstat(target);}catch(e){if(e.code==='ENOENT')return;throw e;}
 if(st.isSymbolicLink()||!st.isDirectory())throw Error('Unowned output');
 let marker;try{marker=await readFile(join(target,'.swing-generated'),'utf8');}catch{throw Error('Unowned output');}
 if(marker!=='sunday-set-v1')throw Error('Unowned output');
}
export async function build() {
 const s=JSON.parse(await readFile(ROOT+'/content/site.json','utf8'));
 if(s.route!=='/campaign/sunday-set/')throw Error('Unexpected campaign route');
 const source=ROOT+'/assets-source',target=resolve('dist/campaign/sunday-set');
 const originals=new Map(),posters=new Map();
 for(const a of s.assets) {
  if(!/^[CPV]\d+\.(jpg|webp|mp4)$/.test(a.sourcePath))throw Error('Unsafe source');
  const bytes=await readFile(join(source,a.sourcePath));
  if(hash(bytes)!==a.sourceSha256)throw Error('Source checksum: '+a.id);
  originals.set(a.id,bytes);
 }
 for(const f of s.films) {
  if(!/^V\d+-poster\.webp$/.test(f.posterSource))throw Error('Unsafe poster');
  const bytes=await readFile(join(source,f.posterSource));
  if(hash(bytes)!==f.posterSha256)throw Error('Poster checksum: '+f.id);
  posters.set(f.id,bytes);
 }
 await assertOwnedOutput(target);
 await mkdir(join(target,'assets'),{recursive:true});
 const used=new Set(),images={},films={};
 const put=async(name,ext,bytes)=>{const path='assets/'+name+'-'+hash(bytes).slice(0,12)+'.'+ext;await writeFile(join(target,path),bytes);used.add(path.slice(7));return path;};
 for(const a of s.assets) {
  if(a.kind==='image') {
   const variants=[];
   for(const width of [...new Set([360,720,1200].map(w=>Math.min(w,a.width)))]) {
    const {data,info}=await sharp(originals.get(a.id)).rotate().resize({width,withoutEnlargement:true}).webp({quality:82}).toBuffer({resolveWithObject:true});
    variants.push({src:await put(a.id+'-'+width,'webp',data),width:info.width});
   }
   images[a.id]={...a,src:variants.at(-1).src,variants};
  } else {
   films[a.id]={...a,src:await put(a.id,'mp4',originals.get(a.id)),poster:await put(a.id+'-poster','webp',posters.get(a.id))};
  }
 }
 const resources={films};
 for(const [name,path,ext] of [['style',ROOT+'/src/style.css','css'],['script','shared/client/film.mjs','mjs']])resources[name]=await put(name,ext,await readFile(path));
 await writeFile(join(target,'index.html'),renderPage(s,images,resources));
 await writeFile(join(target,'.swing-generated'),'sunday-set-v1');
 for(const file of await readdir(join(target,'assets')))if(!used.has(file))await rm(join(target,'assets',file));
 return {output:target,images:Object.keys(images).length,films:Object.keys(films).length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(await build());

