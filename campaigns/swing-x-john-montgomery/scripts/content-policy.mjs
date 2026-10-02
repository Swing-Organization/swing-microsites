import {readFileSync} from 'node:fs';
import {readFile,realpath} from 'node:fs/promises';
import {resolve,relative,isAbsolute,sep} from 'node:path';
import {createHash} from 'node:crypto';
const project=new URL('../',import.meta.url);
const reference=JSON.parse(readFileSync(new URL('docs/superpowers/reference/2026-09-23-asset-inventory.json',project),'utf8'));
const originals=new Map([...reference.campaign,...reference.products].map(a=>[a.reviewKey,a]));
const review=JSON.parse(readFileSync(new URL('content/review.json',project),'utf8'));
export const BASE='/campaign/johnmontgomery/';
export async function loadSite(){
 const read=async name=>JSON.parse(await readFile(new URL(`content/${name}.json`,project),'utf8'));
 const [campaign,products,assets,layout]=await Promise.all(['campaign','products','assets','layout'].map(read));
 return {campaign,products,assets,layout,films:campaign.films??[],approvedProductUrls:review.approvedProductUrls};
}
export function validateProductUrl(value,approved){
 if(value===null)return null;
 if(typeof value!=='string'||value.trim()!==value||!value.startsWith('https://'))throw Error('Invalid product URL');
 const u=new URL(value);
 if(u.origin!=='https://wearswing.com'||u.username||u.password||u.search||u.hash||!approved.includes(value))throw Error('Unapproved product destination');
 return value;
}
export function safeLocalPath(value){
 if(typeof value!=='string'||!value||value.includes('\\')||value.includes('\0')||isAbsolute(value)||value.split('/').some(x=>!x||x==='.'||x==='..')||!/^[-a-zA-Z0-9_./]+$/.test(value))throw Error('Unsafe local asset path');
 return value;
}
export function validateSite(site){
 const {campaign,products,assets,layout,films,approvedProductUrls}=site;
 if(campaign.basePath!==BASE||!['noindex,nofollow','index,follow'].includes(campaign.indexing))throw Error('Invalid campaign configuration');
 for(const key of ['title','collaboration','headline','intro','storyHeading','story'])if(campaign[key]!==review.approvedCampaign[key])throw Error(`Unreviewed campaign copy: ${key}`);
 if(products.length!==3)throw Error('Exactly three featured products required');
 for(const [i,p] of products.entries()){
  for(const key of ['id','name','description','front','back'])if(p[key]!==review.approvedProducts[i][key])throw Error(`Unreviewed product ${p.id}: ${key}`);
  validateProductUrl(p.href,approvedProductUrls);
 }
 const ids=new Set();
 for(const a of assets){
  const source=originals.get(a.id);
  if(ids.has(a.id)||!source||source.id!==a.driveId||source.sha256!==a.sourceSha256||!a.approved)throw Error(`Unapproved or duplicated asset ${a.id}`);
  if(a.kind==='image'&&(!a.alt?.trim()||a.width!==source.width||a.height!==source.height))throw Error(`Invalid image metadata ${a.id}`);
  safeLocalPath(a.sourcePath);ids.add(a.id);
 }
 const used=[...layout.hero,...layout.spreads.flat(),layout.story,...products.flatMap(p=>[p.front,p.back])];
 const expected=[...originals.values()].filter(a=>a.mimeType.startsWith('image/')&&!(review.excludedAssetIds??[]).includes(a.reviewKey)).map(a=>a.reviewKey);
 if(used.length!==expected.length||new Set(used).size!==expected.length||expected.some(id=>!used.includes(id)||!ids.has(id))||used.some(id=>!expected.includes(id)))throw Error('All selected approved photographs must appear exactly once');
 for(const f of films){
  if(!ids.has(f.sourceAssetId)||!originals.get(f.sourceAssetId)?.mimeType.startsWith('video/')||!Number.isSafeInteger(f.width)||!Number.isSafeInteger(f.height)||f.width<=0||f.height<=0)throw Error('Unreviewed film');
  for(const p of [f.src,f.posterSrc,...(f.captionSrc?[f.captionSrc]:[])])safeLocalPath(p);
 }
}
export async function verifiedSourcePath(asset,sourceRoot){
 const root=await realpath(sourceRoot);
 safeLocalPath(asset.sourcePath);
 let file;
 try{file=await realpath(resolve(root,asset.sourcePath));}catch{throw Error(`Missing source ${asset.id}`);}
 const rel=relative(root,file);
 if(rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel))throw Error(`Source path escapes root: ${asset.id}`);
 const bytes=await readFile(file);
 if(createHash('sha256').update(bytes).digest('hex')!==asset.sourceSha256)throw Error(`Source checksum changed: ${asset.id}`);
 return file;
}
export async function verifySources(assets,sourceRoot){await Promise.all(assets.map(a=>verifiedSourcePath(a,sourceRoot)));}
