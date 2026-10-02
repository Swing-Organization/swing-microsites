import {mkdir,readFile,writeFile,copyFile,access,mkdtemp,rename,rm,lstat} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {loadSite,validateSite,verifySources,BASE,safeLocalPath} from './content-policy.mjs';
import {prepareImages} from './prepare-media.mjs';
import {renderPage} from '../src/render/page.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function build({outDir='dist',site,sourceRoot='campaigns/swing-x-john-montgomery/assets-source'}={}){
 site??=await loadSite();validateSite(site);await verifySources(site.assets,sourceRoot);
 const output=resolve(outDir);if(output===resolve('.')||output===dirname(output))throw Error('Unsafe build output');
 await mkdir(output,{recursive:true});if((await lstat(output)).isSymbolicLink())throw Error('Unsafe output symlink');
 const stage=await mkdtemp(join(output,'.sunday-build-'));
 try{
  const assetsDir=join(stage,'assets');
  const images=await prepareImages(site.assets,sourceRoot,assetsDir);
  for(const f of site.films)for(const key of ['src','posterSrc',...(f.captionSrc?['captionSrc']:[])]){
   const path=safeLocalPath(f[key]);const bytes=await readFile(join(sourceRoot,'film',path.replace(/^assets\//,'')));
   if(hash(bytes)!==f[key+'Sha256'])throw Error('Film derivative checksum changed');
   await writeFile(join(stage,path),bytes);
  }
  const resources={};
  for(const [name,file,ext] of [['style','campaigns/swing-x-john-montgomery/src/styles/campaign.css','css'],['script','shared/client/film.mjs','mjs']]){
   try{await access(file);}catch{continue;}
   const bytes=await readFile(file);const filename=`${name}-${hash(bytes).slice(0,12)}.${ext}`;
   await writeFile(join(assetsDir,filename),bytes);resources[name]=BASE+'assets/'+filename;
  }
  await writeFile(join(stage,'index.html'),renderPage(site,images,resources));
  await writeFile(join(stage,'.swing-generated'),'sunday-edit-v1');
  const parent=join(output,'campaign');await mkdir(parent,{recursive:true});
  if((await lstat(parent)).isSymbolicLink())throw Error('Unsafe campaign symlink');
  const target=join(parent,'johnmontgomery');
  let exists=false;try{await lstat(target);exists=true;}catch{}
  if(exists){
   if((await lstat(target)).isSymbolicLink()||await readFile(join(target,'.swing-generated'),'utf8')!=='sunday-edit-v1')throw Error('Refusing to replace unowned output');
   const backup=join(stage,'..',`.previous-${Date.now()}`);await rename(target,backup);
   try{await rename(stage,target);}catch(error){await rename(backup,target);throw error;}
   await rm(backup,{recursive:true,force:true});
  }else await rename(stage,target);
  return {images,output:target};
 }catch(error){await rm(stage,{recursive:true,force:true});throw error;}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const r=await build();console.log(`Built ${r.output} (${Object.keys(r.images).length} approved photographs)`);}
