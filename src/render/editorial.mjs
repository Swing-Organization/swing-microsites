import {escapeHtml as e} from './html.mjs';
import {renderImage} from './image.mjs';
import {BASE,safeLocalPath} from '../../scripts/content-policy.mjs';
export function renderEditorial(site,images){
 const c=site.campaign;
 const picture=(id,options={})=>renderImage(images[id],options);
 const film=Object.fromEntries(site.films.map(f=>{
  const url=p=>e(BASE+safeLocalPath(p));
  return [f.sourceAssetId,`<figure class="film-frame" data-film><video data-autoplay controls playsinline muted loop preload="none" width="${e(f.width)}" height="${e(f.height)}" poster="${url(f.posterSrc)}" src="${url(f.src)}" aria-label="The Sunday Edit campaign film">${f.captionSrc?`<track kind="captions" src="${url(f.captionSrc)}" srclang="en" label="English" default>`:''}</video><img data-film-fallback hidden src="${url(f.posterSrc)}" width="${e(f.width)}" height="${e(f.height)}" alt="${e(f.posterAlt)}" loading="lazy"><span class="film-status" role="status" aria-live="polite"></span></figure>`];
 }));
 const spreads=site.layout.spreads.map((ids,row)=>{const i=site.layout.spreadNumbers[row]-1;const clip=film[`V${String(i+1).padStart(2,'0')}`];return `<div class="spread-band band-${i+1}"><div class="spread spread-${i+1}${clip?' motion-spread':''}">${ids.map((id,j)=>`<figure class="editorial-image image-${j+1}">${picture(id,{sizes:j===1?'(max-width:767px) calc(100vw - 40px), 40vw':'(max-width:767px) calc(100vw - 40px), 30vw'})}</figure>`).join('')}${clip??''}</div></div>`;});
 const opening=`<div class="masthead"><span class="wordmark">Swing</span><span class="collab-cross" aria-hidden="true">×</span><span class="partner-name">John Montgomery</span><span class="sr-only">${e(c.collaboration)}</span></div>
 <div class="cover" data-chapter="intro"><div class="cover-copy"><p class="eyebrow">${e(c.collaboration)}</p><h1 id="campaign-heading">Callie's test</h1><p class="cover-intro">${e(c.intro)}</p><a class="text-link" href="#products">Explore the collection <span aria-hidden="true">↗</span></a></div>
 <div class="cover-pictures"><figure class="cover-primary">${picture('C02',{priority:true,sizes:'(max-width:767px) 76vw, 34vw'})}</figure><figure class="cover-secondary">${picture('C19',{sizes:'(max-width:767px) 40vw, 22vw'})}</figure></div></div>
 <div class="editorial">
 <div data-chapter="collage-one">${spreads.slice(0,3).join('')}</div>
 <section class="sunday-feature" data-chapter="sunday-edit" aria-labelledby="sunday-heading"><p class="eyebrow">${e(c.collaboration)}</p><h2 id="sunday-heading">The Sunday Edit</h2><p>${e(c.intro)}</p></section>
 <div data-chapter="collage-two">${spreads.slice(3).join('')}</div></div>`;
 const story=`<div class="story-inner"><figure class="story-image">${picture(site.layout.story,{sizes:'(max-width:767px) calc(100vw - 64px), 40vw'})}</figure><div class="story-copy"><p class="eyebrow">Swing × John Montgomery</p><h2 id="story-heading">${e(c.storyHeading)}</h2><p>${e(c.story)}</p><a class="text-link" href="#products">Shop the edit <span aria-hidden="true">↗</span></a></div></div>`;
 return {opening,story};
}
