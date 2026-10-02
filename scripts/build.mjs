import {readFile} from 'node:fs/promises';
const campaigns=JSON.parse(await readFile(new URL('../deployment/campaigns.json',import.meta.url),'utf8'));
for(const campaign of campaigns){
 const module=await import(new URL('../'+campaign.buildModule,import.meta.url));
 console.log(campaign.id,await module.build());
}
