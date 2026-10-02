import {readFile,writeFile,mkdtemp,rm,mkdir,cp,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,relative,isAbsolute} from 'node:path';
import {execFileSync} from 'node:child_process';
const config=JSON.parse(await readFile('deployment/media-lock.json','utf8'));
if(!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(config.repository)||!/^([a-f0-9]{40})$/.test(config.commit))throw Error('Media source must be a pinned GitHub commit');
const campaigns=JSON.parse(await readFile('deployment/campaigns.json','utf8'));
const key=process.env.SOURCE_MEDIA_SSH_KEY??(process.env.SOURCE_MEDIA_SSH_KEY_BASE64?Buffer.from(process.env.SOURCE_MEDIA_SSH_KEY_BASE64,'base64').toString('utf8'):null);
if(!key)throw Error('SOURCE_MEDIA_SSH_KEY is required to restore the private approved media');
const temp=await mkdtemp(join(tmpdir(),'swing-media-'));
try{
 const keyPath=join(temp,'key'),hosts=join(temp,'known_hosts'),checkout=join(temp,'repo');
 await writeFile(keyPath,key.trim()+'\n',{mode:0o600});
 await writeFile(hosts,await readFile('deployment/github-known-hosts'));
 const env={...process.env,GIT_TERMINAL_PROMPT:'0',GIT_SSH_COMMAND:`ssh -i ${keyPath} -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=${hosts}`};
 delete env.SOURCE_MEDIA_SSH_KEY;
 delete env.SOURCE_MEDIA_SSH_KEY_BASE64;
 const git=args=>execFileSync('git',args,{env,stdio:['ignore','pipe','pipe']});
 git(['init','--quiet',checkout]);
 git(['-C',checkout,'remote','add','origin',`git@github.com:${config.repository}.git`]);
 git(['-C',checkout,'fetch','--quiet','--depth=1','origin',config.commit]);
 git(['-C',checkout,'checkout','--quiet','--detach','FETCH_HEAD']);
 const checkoutRoot=await realpath(checkout);
 const actual=git(['-C',checkout,'rev-parse','HEAD']).toString().trim();
 if(actual!==config.commit)throw Error('Media commit mismatch');
 for(const campaign of campaigns){
  const dir=campaign.sourceDirectory;
  if(!/^campaigns\/[a-z0-9-]+\/assets-source$/.test(dir)||!/^assets-source\/[a-z0-9-]+$/.test(campaign.mediaDirectory))throw Error('Unsafe campaign media directory');
  const source=await realpath(join(checkout,campaign.mediaDirectory));const rel=relative(checkoutRoot,source);
  if(rel.startsWith('..')||isAbsolute(rel))throw Error('Media directory escapes checkout');
  await mkdir(resolve(dir),{recursive:true});
  await cp(source,resolve(dir),{recursive:true,dereference:false});
 }
 console.log('Restored approved media commit',config.commit);
}finally{await rm(temp,{recursive:true,force:true});}
