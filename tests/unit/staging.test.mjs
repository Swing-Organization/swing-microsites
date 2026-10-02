import test from 'node:test';
import assert from 'node:assert/strict';
import {selectPullRequest, selectDeployment, reconcileStaging, createApi, config} from '../../scripts/deployment/staging.mjs';
const pr=(number,extra={})=>({number,state:'open',created_at:`2026-10-${String(number).padStart(2,'0')}T00:00:00Z`,base:{ref:'main'},head:{sha:`sha-${number}`,ref:`codex/pr-${number}`,repo:{id:1383780309}},...extra});
const deployment=(number,extra={})=>({uid:`dpl_${number}`,projectId:config.projectId,state:'READY',target:null,created:100+number,meta:{githubCommitSha:`sha-${number}`,githubCommitRef:`codex/pr-${number}`,githubCommitRepoId:'1383780309'},...extra});

test('newest created open internal PR wins, not most recently updated; drafts count',()=>{
 const older=pr(1,{updated_at:'2026-12-01',draft:false});
 const newer=pr(2,{updated_at:'2026-10-02',draft:true});
 assert.equal(selectPullRequest([older,newer],1383780309).number,2);
 assert.equal(selectPullRequest([newer,older],1383780309).number,2);
});
test('closed, fork, wrong-base, and reserved-branch PRs cannot own staging',()=>{
 const invalid=[pr(4,{state:'closed'}),pr(5,{head:{...pr(5).head,repo:{id:99}}}),pr(6,{base:{ref:'other'}}),pr(7,{head:{...pr(7).head,ref:config.holdingBranch}})];
 assert.equal(selectPullRequest([pr(1),...invalid],1383780309).number,1);
 assert.equal(selectPullRequest(invalid,1383780309),null);
});
test('only a ready preview of the selected PR exact head in this project can be assigned',()=>{
 const good=deployment(2);
 const invalid=[deployment(1),deployment(2,{state:'BUILDING'}),deployment(2,{target:'production'}),deployment(2,{projectId:'other'}),deployment(2,{meta:{...good.meta,githubCommitRepoId:'99'}}),deployment(2,{meta:{...good.meta,githubCommitRef:'other'}})];
 assert.equal(selectDeployment(invalid,pr(2),1383780309),null);
 assert.equal(selectDeployment([...invalid,good],pr(2),1383780309).uid,'dpl_2');
});
function harness({pulls=[pr(1),pr(2)],deployments=[deployment(1),deployment(2)],sequences,alias='dpl_old',domainBranch=config.holdingBranch}={}){
 let reads=0;const writes=[];let current=alias;
 const api={
  async listPullRequests(){return sequences?.[Math.min(reads++,sequences.length-1)]??pulls;},
  async listDeployments(){return deployments;},
  async getDomain(){return {name:config.domain,projectId:config.projectId,gitBranch:domainBranch,verified:true};},
  async updateDomain(body){writes.push(['domain',body]);domainBranch=body.gitBranch;},
  async getAlias(){return {deploymentId:current,projectId:config.projectId};},
  async assignAlias(id){writes.push(['alias',id]);current=id;}
 };
 return {api,writes};
}
test('reconciliation pins exact ready deployment and repeating is idempotent',async()=>{
 const h=harness();
 assert.equal((await reconcileStaging(h.api,1383780309)).deployment,'dpl_2');
 await reconcileStaging(h.api,1383780309);
 assert.deepEqual(h.writes,[['alias','dpl_2']]);
});
test('old-PR completion cannot take staging while newest PR is still building',async()=>{
 const h=harness({deployments:[deployment(1),deployment(2,{state:'BUILDING'})]});
 assert.equal((await reconcileStaging(h.api,1383780309)).status,'waiting');
 assert.deepEqual(h.writes,[]);
});
test('closing newest PR selects next open PR; with no open PRs alias is retained',async()=>{
 const h=harness({pulls:[pr(1),pr(2,{state:'closed'})]});
 await reconcileStaging(h.api,1383780309);
 assert.deepEqual(h.writes,[['alias','dpl_1']]);
 const empty=harness({pulls:[]});
 assert.equal((await reconcileStaging(empty.api,1383780309)).status,'retained');
 assert.deepEqual(empty.writes,[]);
});
test('first run detaches automatic branch tracking even when no PRs are open',async()=>{
 const h=harness({pulls:[],domainBranch:'codex/sunday-edit'});
 await reconcileStaging(h.api,1383780309);
 assert.deepEqual(h.writes,[['domain',{gitBranch:config.holdingBranch}]]);
});
test('a newer PR opening or head changing before assignment prevents a stale write',async()=>{
 for(const changed of [[pr(2)],[{...pr(1),head:{...pr(1).head,sha:'new-sha'}}]]){
  const h=harness({sequences:[[pr(1)],changed],deployments:[deployment(1)]});
  await reconcileStaging(h.api,1383780309);
  assert.deepEqual(h.writes,[]);
 }
});
test('a PR closing during assignment is reconciled again before returning',async()=>{
 const h=harness({sequences:[[pr(2)],[pr(2)],[pr(1)],[pr(1)],[pr(1)]]});
 await reconcileStaging(h.api,1383780309);
 assert.deepEqual(h.writes,[['alias','dpl_2'],['alias','dpl_1']]);
});
test('wrong project domain and failed alias verification fail closed',async()=>{
 const h=harness();h.api.getDomain=async()=>({projectId:'other',name:config.domain});
 await assert.rejects(reconcileStaging(h.api,1383780309),/domain/);
 assert.deepEqual(h.writes,[]);
 const bad=harness();bad.api.assignAlias=async()=>{};
 await assert.rejects(reconcileStaging(bad.api,1383780309),/verify/);
});

test('dry run reports the candidate without changing branch tracking or alias',async()=>{
 const h=harness({domainBranch:'codex/sunday-edit'});
 assert.equal((await reconcileStaging(h.api,1383780309,{dryRun:true})).status,'planned');
 assert.deepEqual(h.writes,[]);
});

test('provider requests paginate PRs and deployments and bind alias writes to the configured team',async()=>{
 const requests=[];
 const api=createApi({repository:'Swing-Organization/swing-microsites',githubToken:'github-test',vercelToken:'vercel-test',fetchImpl:async(url,options)=>{
  requests.push({url,options});
  let body;
  if(url.pathname.endsWith('/pulls'))body=url.searchParams.get('page')==='1'?Array.from({length:100},()=>pr(1)):[pr(2)];
  else if(url.pathname==='/v7/deployments')body=url.searchParams.has('until')?{deployments:[deployment(2)],pagination:{next:null}}:{deployments:[deployment(1)],pagination:{next:100}};
  else body={alias:config.domain};
  return new Response(JSON.stringify(body));
 }});
 assert.equal((await api.listPullRequests()).length,101);
 assert.equal((await api.listDeployments(pr(2))).length,2);
 await api.assignAlias('dpl_2');
 const vc=requests.filter(r=>r.url.hostname==='api.vercel.com');
 assert.ok(vc.every(r=>r.url.searchParams.get('teamId')==='team_HDbZ1HzOVHGr2pPOMd9mNWc8'));
 assert.equal(vc[0].url.searchParams.get('sha'),'sha-2');
 assert.equal(vc[0].url.searchParams.get('branch'),'codex/pr-2');
 assert.equal(vc[1].url.searchParams.get('until'),'100');
 assert.equal(vc[2].url.pathname,'/v2/deployments/dpl_2/aliases');
 assert.deepEqual(JSON.parse(vc[2].options.body),{alias:'staging.wearswing.com'});
 assert.equal(vc[2].options.headers.Authorization,'Bearer vercel-test');
 assert.equal(requests[0].options.headers.Authorization,'Bearer github-test');
 assert.ok(requests.every(r=>r.options.redirect==='error'));
});
test('provider error bodies are not logged and existing reserved branch blocks activation',async()=>{
 const options={repository:'Swing-Organization/swing-microsites',githubToken:'github-test',vercelToken:'vercel-test'};
 const api=createApi({...options,fetchImpl:async()=>new Response('sensitive-provider-body',{status:403})});
 await assert.rejects(api.getDomain(),error=>error.message.includes('HTTP 403')&&!error.message.includes('sensitive-provider-body'));
 const reserved=createApi({...options,fetchImpl:async()=>new Response('{"name":"codex/staging-managed"}')});
 await assert.rejects(reserved.assertHoldingBranchAbsent(),/Reserved branch/);
});

test('provider readyState and omitted preview target are supported while custom environments are rejected',()=>{
 const preview=deployment(2,{state:undefined,readyState:'READY',target:undefined});
 assert.equal(selectDeployment([preview],pr(2),1383780309)?.uid,'dpl_2');
 assert.equal(selectDeployment([deployment(2,{customEnvironment:{id:'env_other'}})],pr(2),1383780309),null);
});
