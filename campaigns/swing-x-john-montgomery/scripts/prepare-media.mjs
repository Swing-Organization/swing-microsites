import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {verifiedSourcePath,loadSite} from './content-policy.mjs';
export async function prepareImages(assets,sourceRoot,outputRoot){
 await mkdir(outputRoot,{recursive:true});
 const result={};
 for(const asset of assets.filter(a=>a.kind==='image')){
  const source=await verifiedSourcePath(asset,sourceRoot);
  try{
   const metadata=await sharp(source).rotate().metadata();
   const width=metadata.autoOrient?.width??metadata.width;
   const height=metadata.autoOrient?.height??metadata.height;
   const widths=[...new Set([320,480,640,960,1280,1600].filter(w=>w<=width).concat(Math.min(width,1600)))].sort((a,b)=>a-b);
   const variants=[];
   for(const w of widths){
    for(const format of ['webp','jpeg']){
     const {data,info}=await sharp(source).rotate().resize({width:w,withoutEnlargement:true}).toFormat(format,{quality:format==='webp'?82:85}).toBuffer({resolveWithObject:true});
     const hash=createHash('sha256').update(data).digest('hex').slice(0,12);
     const filename=`${asset.id}-${info.width}-${hash}.${format==='jpeg'?'jpg':'webp'}`;
     await writeFile(join(outputRoot,filename),data);
     variants.push({src:'assets/'+filename,width:info.width,height:info.height,format,bytes:data.length});
    }
   }
   result[asset.id]={id:asset.id,alt:asset.alt,width,height,variants};
  }catch(error){throw new Error(`Cannot prepare image ${asset.id}: ${error.message}`);}
 }
 return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const site=await loadSite();const output='campaigns/swing-x-john-montgomery/assets-source/prepared';
 const images=await prepareImages(site.assets,'campaigns/swing-x-john-montgomery/assets-source',output);
 await writeFile(join(output,'manifest.json'),JSON.stringify(images,null,2));
 console.log(`Prepared ${Object.keys(images).length} approved images`);
}
