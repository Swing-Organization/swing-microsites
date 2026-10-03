import {execFileSync,spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

// Only campaign-owned content/presentation qualifies. Anything uncertain runs all.
export function selectCampaigns(paths,ids){
 const selected=new Set();
 if(!paths.length)return ids;
 for(const path of paths){
  const match=/^campaigns\/([a-z0-9-]+)\/(?:content|src)\/.+/.exec(path);
  if(!match||!ids.includes(match[1]))return ids;
  selected.add(match[1]);
 }
 return ids.filter(id=>selected.has(id));
}

export function changedPaths(base){
 if(!/^[a-f0-9]{40}$/.test(base??''))return [];
 try{
  // Disable rename detection so both the old and new path affect selection.
  return execFileSync('git',['diff','--name-only','--no-renames','-z',base,'HEAD','--'],{encoding:'utf8'}).split('\0').filter(Boolean);
 }catch{
  console.warn('Cannot establish changed files; running every campaign.');
  return [];
 }
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const ids=JSON.parse(readFileSync('deployment/campaigns.json','utf8')).map(c=>c.id);
 const selected=selectCampaigns(changedPaths(process.env.CI_BASE_SHA),ids);
 console.log('Browser coverage (all three engines):',selected.join(', '));
 const result=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','test',
  ...selected.map(id=>`campaigns/${id}/tests/e2e/`),...process.argv.slice(2)],{stdio:'inherit'});
 if(result.error)throw result.error;
 process.exitCode=result.status??1;
}
