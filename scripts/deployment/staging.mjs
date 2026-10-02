import {pathToFileURL} from 'node:url';

export const config=Object.freeze({
 projectId:'prj_OFCPCvkEYuzaTx6euiLg6iReNAHk',
 teamId:'team_HDbZ1HzOVHGr2pPOMd9mNWc8',
 domain:'staging.wearswing.com',
 // Reserved, nonexistent branch: Vercel must not auto-assign this domain.
 holdingBranch:'codex/staging-managed',
});

export function selectPullRequest(pulls,repositoryId){
 return pulls.filter(p=>p.state==='open'&&p.base.ref==='main'&&
  String(p.head.repo?.id)===String(repositoryId)&&p.head.ref!==config.holdingBranch)
  .sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at)||b.number-a.number)[0]??null;
}

export function selectDeployment(deployments,pull,repositoryId){
 return deployments.filter(d=>d.projectId===config.projectId&&(d.state??d.readyState)==='READY'&&!d.customEnvironment&&!d.customEnvironmentId&&
  (d.target==null||d.target==='preview')&&d.meta?.githubCommitSha===pull.head.sha&&
  d.meta?.githubCommitRef===pull.head.ref&&String(d.meta?.githubCommitRepoId)===String(repositoryId))
  .sort((a,b)=>b.created-a.created)[0]??null;
}

const sameHead=(a,b)=>a?.number===b?.number&&a?.head.sha===b?.head.sha&&a?.head.ref===b?.head.ref;

export async function reconcileStaging(api,repositoryId,{dryRun=false}={}){
 const domain=await api.getDomain();
 if(domain.name!==config.domain||domain.projectId!==config.projectId||domain.redirect||!domain.verified)
  throw Error('Unexpected or unverified staging domain configuration');
 // Stop native branch assignments, including after the final PR closes.
 if(domain.gitBranch!==config.holdingBranch&&!dryRun){
  await api.updateDomain({gitBranch:config.holdingBranch});
  if((await api.getDomain()).gitBranch!==config.holdingBranch)throw Error('Could not verify staging domain tracking');
 }
 const currentPull=async()=>selectPullRequest(await api.listPullRequests(),repositoryId);
 // Re-read GitHub immediately before and after writes. All workflow runs share one lock.
 for(let attempt=0;attempt<5;attempt++){
  const pull=await currentPull();
  if(!pull)return {status:'retained',reason:'No open internal PRs; keeping last successful preview'};
  const deployment=selectDeployment(await api.listDeployments(pull),pull,repositoryId);
  if(!sameHead(pull,await currentPull()))continue;
  if(!deployment)return {status:'waiting',pr:pull.number,sha:pull.head.sha,reason:'Current PR head has no ready preview'};
  const current=await api.getAlias();
  if(current&&current.projectId!==config.projectId)throw Error('Staging alias belongs to another project');
  if(dryRun)return {status:'planned',pr:pull.number,sha:pull.head.sha,deployment:deployment.uid};
  if(current?.deploymentId!==deployment.uid)await api.assignAlias(deployment.uid);
  const verified=await api.getAlias();
  if(verified?.deploymentId!==deployment.uid||verified.projectId!==config.projectId)
   throw Error('Could not verify staging alias assignment');
  if(!sameHead(pull,await currentPull()))continue;
  return {status:'assigned',pr:pull.number,sha:pull.head.sha,deployment:deployment.uid,url:`https://${config.domain}`};
 }
 throw Error('PR selection kept changing; rerun staging reconciliation');
}

export function createApi({repository,githubToken,vercelToken,fetchImpl=fetch}){
 if(!/^[\w.-]+\/[\w.-]+$/.test(repository))throw Error('Invalid repository');
 const request=async(origin,path,token,{method='GET',body,allow404=false}={})=>{
  const url=new URL(path,origin);
  if(origin==='https://api.vercel.com')url.searchParams.set('teamId',config.teamId);
  const response=await fetchImpl(url,{method,redirect:'error',signal:AbortSignal.timeout(30000),headers:{
   Authorization:`Bearer ${token}`,Accept:'application/json','Content-Type':'application/json',
   ...(origin==='https://api.github.com'?{'X-GitHub-Api-Version':'2022-11-28'}:{}),
  },...(body?{body:JSON.stringify(body)}:{})});
  if(allow404&&response.status===404)return null;
  // Do not log provider bodies, headers or credentials on failure.
  if(!response.ok)throw Error(`${url.hostname} ${method} ${url.pathname}: HTTP ${response.status}`);
  return response.json();
 };
 const gh=path=>request('https://api.github.com',path,githubToken);
 const vc=(path,options)=>request('https://api.vercel.com',path,vercelToken,options);
 const domainPath=`/v9/projects/${config.projectId}/domains/${config.domain}`;
 return {
  getRepository:()=>gh(`/repos/${repository}`),
  async assertHoldingBranchAbsent(){
   const branch=await request('https://api.github.com',`/repos/${repository}/branches/${encodeURIComponent(config.holdingBranch)}`,githubToken,{allow404:true});
   if(branch)throw Error(`Reserved branch ${config.holdingBranch} exists; remove its use before enabling staging automation`);
  },
  async listPullRequests(){
   const pulls=[];
   for(let page=1;;page++){
    const batch=await gh(`/repos/${repository}/pulls?state=open&base=main&sort=created&direction=desc&per_page=100&page=${page}`);
    pulls.push(...batch);
    if(batch.length<100)return pulls;
   }
  },
  async listDeployments(pull){
   const deployments=[];let until;
   do{
    const query=new URLSearchParams({projectId:config.projectId,sha:pull.head.sha,branch:pull.head.ref,limit:'100'});
    if(until)query.set('until',String(until));
    const result=await vc(`/v7/deployments?${query}`);
    deployments.push(...result.deployments);
    const next=result.pagination?.next;
    if(next&&String(next)===String(until))throw Error('Deployment pagination did not advance');
    until=next;
   }while(until);
   return deployments;
  },
  getDomain:()=>vc(domainPath),
  updateDomain:body=>vc(domainPath,{method:'PATCH',body}),
  getAlias:()=>vc(`/v4/aliases/${config.domain}`,{allow404:true}),
  assignAlias:id=>vc(`/v2/deployments/${encodeURIComponent(id)}/aliases`,{method:'POST',body:{alias:config.domain}}),
 };
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{
  const {GITHUB_REPOSITORY,GITHUB_TOKEN,VERCEL_STAGING_TOKEN}=process.env;
  if(!GITHUB_TOKEN||!VERCEL_STAGING_TOKEN)throw Error('Configure GitHub Actions secret VERCEL_STAGING_TOKEN before running staging automation');
  const api=createApi({repository:GITHUB_REPOSITORY,githubToken:GITHUB_TOKEN,vercelToken:VERCEL_STAGING_TOKEN});
  await api.assertHoldingBranchAbsent();
  const repository=await api.getRepository();
  const result=await reconcileStaging(api,repository.id,{dryRun:process.env.STAGING_DRY_RUN==='true'});
  console.log(JSON.stringify(result));
 }catch(error){console.error(error.message);process.exitCode=1;}
}
