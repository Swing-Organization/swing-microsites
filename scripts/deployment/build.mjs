import {readFile,rm,access,mkdir,cp} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve('.');
const campaigns=JSON.parse(await readFile('deployment/campaigns.json','utf8'));
const routes=new Set();
for(const c of campaigns){
 if(!/^\/campaign\/[a-z0-9-]+\/$/.test(c.route)||routes.has(c.route))throw Error('Invalid or duplicate campaign route');
 routes.add(c.route);
 for(const key of ['buildModule','auditModule'])if(!/^campaigns\/[a-z0-9-]+\/scripts\/[a-zA-Z0-9_-]+\.mjs$/.test(c[key])||c[key].includes('..'))throw Error('Unsafe build module');
 await access(c.sourceDirectory);
 const {build}=await import(pathToFileURL(resolve(c.buildModule)));
 await build();
 const {auditOutput}=await import(pathToFileURL(resolve(c.auditModule)));
 console.log(c.id,await auditOutput());
 await access(join(root,'dist',c.route,'index.html'));
}
// Publish only registered campaign routes; retain build ownership markers locally.
await rm('publish',{recursive:true,force:true});
await mkdir('publish',{recursive:true});
for(const c of campaigns){
 const destination=join('publish',c.route);
 await mkdir(destination,{recursive:true});
 await cp(join('dist',c.route),destination,{recursive:true,filter:path=>!path.endsWith('/.swing-generated')});
}
console.log('Deployment contains every registered campaign:',[...routes].join(', '));
