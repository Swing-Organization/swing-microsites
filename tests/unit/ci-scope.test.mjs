import test from 'node:test';
import assert from 'node:assert/strict';
import {selectCampaigns,changedPaths} from '../../scripts/ci-browser-tests.mjs';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,renameSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const ids=['swing-x-john-montgomery','swing-x-sienna-hartley'];
test('isolated content and presentation edits select the affected campaigns',()=>{
 assert.deepEqual(selectCampaigns([
  'campaigns/swing-x-sienna-hartley/content/site.json',
  'campaigns/swing-x-sienna-hartley/src/style.css'
 ],ids),['swing-x-sienna-hartley']);
 assert.deepEqual(selectCampaigns([
  'campaigns/swing-x-john-montgomery/src/render/page.mjs',
  'campaigns/swing-x-sienna-hartley/content/site.json'
 ],ids),ids);
});
test('git comparison counts both sides of a campaign move and fails safe without history',()=>{
 const previous=process.cwd(),dir=mkdtempSync(join(tmpdir(),'swing-ci-scope-'));
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
 try{
  process.chdir(dir);
  git('init','--quiet');git('config','user.email','test@example.invalid');git('config','user.name','Test');
  for(const id of ids)mkdirSync(`campaigns/${id}/src`,{recursive:true});
  const oldPath='campaigns/swing-x-john-montgomery/src/page.mjs';
  const newPath='campaigns/swing-x-sienna-hartley/src/page.mjs';
  writeFileSync(oldPath,'export const page="fixture";');git('add','.');git('commit','--quiet','-m','base');
  const base=git('rev-parse','HEAD');
  renameSync(oldPath,newPath);git('add','-A');git('commit','--quiet','-m','move');
  assert.deepEqual(changedPaths(base),[oldPath,newPath]);
  assert.deepEqual(selectCampaigns(changedPaths(base),ids),ids);
  assert.deepEqual(selectCampaigns(changedPaths(undefined),ids),ids);
  assert.deepEqual(selectCampaigns(changedPaths('0'.repeat(40)),ids),ids);
 }finally{process.chdir(previous);rmSync(dir,{recursive:true,force:true});}
});
test('shared, build, test, unknown and empty changes retain full browser coverage',()=>{
 for(const path of ['shared/client/film.mjs','package-lock.json','.github/workflows/verify.yml',
  'deployment/campaigns.json','scripts/serve.mjs','README.md',
  'campaigns/unknown/src/page.mjs','campaigns/swing-x-sienna-hartley/scripts/build.mjs',
  'campaigns/swing-x-sienna-hartley/tests/e2e/site.spec.mjs']){
  assert.deepEqual(selectCampaigns(['campaigns/swing-x-sienna-hartley/content/site.json',path],ids),ids,path);
 }
 assert.deepEqual(selectCampaigns([],ids),ids);
});
