import {escapeHtml as e} from '../../../shared/render/html.mjs';

export function renderPage(s, images, resources) {
 const base=s.route;
 const image=(id,{className='',eager=false,sizes='(max-width: 700px) 92vw, 42vw'}={})=>{
  const a=images[id];
  return `<img data-asset="${id}" class="${className}" src="${base}${a.src}" srcset="${a.variants.map(v=>base+v.src+' '+v.width+'w').join(', ')}" sizes="${sizes}" width="${a.width}" height="${a.height}" alt="${e(a.alt)}" loading="${eager?'eager':'lazy'}" ${eager?'fetchpriority="high"':''} decoding="async">`;
 };
 const photo=(id,caption='',className='')=>`<figure class="photo ${className}">${image(id)}${caption?`<figcaption>${e(caption)}</figcaption>`:''}</figure>`;
 const film=(id,caption)=>{
  const f=resources.films[id];
  return `<figure class="film" data-film><div class="film-frame"><video data-asset="${id}" src="${base}${f.src}" poster="${base}${f.poster}" width="${f.width}" height="${f.height}" controls muted playsinline loop preload="none" aria-label="${e(f.alt)}"></video><img hidden data-film-fallback src="${base}${f.poster}" width="${f.width}" height="${f.height}" alt="${e(f.alt)}"></div><figcaption>${e(caption)}</figcaption><span class="film-status" role="status"></span></figure>`;
 };
 const shop=(label='Shop the collection')=>`<span class="shopping" data-shopping><span class="shop-dot" aria-hidden="true"></span>${e(label)}</span>`;
 const product=(id,number)=>{
  const p=s.products.find(p=>p.id===id);
  return `<article class="product-story" id="${id}" aria-labelledby="${id}-title"><div class="product-copy"><span class="eyebrow">The Sunday wardrobe / ${number}</span><h2 id="${id}-title">${e(p.name)}</h2>${p.caption?`<p class="product-caption">${e(p.caption)}</p>`:''}${p.description?`<p class="product-detail">${e(p.description)}</p>`:''}${shop('Shop '+p.name)}</div><figure class="product-view">${image(p.images[0],{sizes:'(max-width: 700px) 45vw, 34vw'})}<figcaption>Front</figcaption></figure><figure class="product-view">${image(p.images[1],{sizes:'(max-width: 700px) 45vw, 34vw'})}<figcaption>Back</figcaption></figure></article>`;
 };
 return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="The Sunday Set by Swing. A new court, the same swing."><title>The Sunday Set — Swing</title><link rel="stylesheet" href="${base}${resources.style}"><script type="module" src="${base}${resources.script}"></script></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="masthead"><span class="wordmark">swing</span><span class="edition">The Sunday Set</span><span class="masthead-note">A little sport. A lot of style.</span></header>
<main id="main">
<section class="cover" aria-labelledby="cover-title">
 <div class="cover-copy"><p class="eyebrow">Introducing Swing tennis</p><h1 id="cover-title">A new court,<br> <em>the same<br> swing.</em></h1><p class="cover-note">Good friends. Great sets.<br>Meet your new Sunday plans.</p>${shop()}<a class="turn-page" href="#love-all">The afternoon starts here <span aria-hidden="true">↓</span></a></div>
 <div class="cover-art">${image('C5',{eager:true,sizes:'(max-width: 700px) 100vw, 52vw'})}<div class="roundel" aria-hidden="true"><span>Love,</span><em>all.</em></div><p class="cover-caption">THE SUNDAY SET / ON & OFF COURT</p></div>
</section>
<div class="editorial-strip" aria-hidden="true"><span>For the game.</span><span class="star">✳</span><span>For the girlies.</span><span class="star">✳</span><span>For the afternoon.</span></div>
<section class="section opening" id="love-all" aria-labelledby="love-title">
 <div class="folio"><span>01 / The invitation</span><span>Everyone’s invited.</span></div>
 <div class="spread-heading"><h2 id="love-title">Good sport.<br><em>Great company.</em></h2><p>A date with the court.<br>And your favourite people.</p></div>
 <div class="opening-grid">${photo('C4','A little catch-up before the match.','opening-main')}${photo('C8','Meet you at the net.','opening-small')}${film('V1','Your afternoon, in motion.')}</div>
 <div class="spread-bottom"><span class="italic-note">Love means everyone.</span>${shop()}</div>
</section>
<section class="product-chapter" aria-label="The Kin Polo edit">${product('kin','01')}<div class="companion-grid">${photo('C1','The dress code: make it yours.')}${photo('C7','A seat in the sun. A little vintage sport.')}</div></section>
<section class="section doubles" aria-labelledby="doubles-title"><div class="folio"><span>02 / The doubles diary</span><span>Better together.</span></div><div class="doubles-layout"><div class="doubles-copy"><h2 id="doubles-title">You had me<br>at <em>doubles.</em></h2><p>Bring your game.<br>Bring your girlies.</p>${shop()}</div>${film('V3','Same friends. New court.')}${photo('C9','The best kind of plus-one.','doubles-photo')}${photo('C12','A match made on court.','doubles-wide')}</div></section>
<section class="product-chapter clara" aria-label="The Clara Dress edit">${product('clara','02')}<div class="companion-grid">${photo('C13','A little swing in every step.')}${photo('C15','Sunday essentials.')}</div></section>
<section class="section match" aria-labelledby="match-title"><div class="folio"><span>03 / A little friendly competition</span><span>Love the game.</span></div><div class="match-layout">${film('V2','One more serve?')}<div class="match-copy"><h2 id="match-title">A good<br><em>sporting<br>chance.</em></h2><p>A little rally.<br>A lot to talk about.</p>${shop()}${photo('C3','Keep it moving.')}</div></div></section>
<section class="section company" aria-labelledby="company-title"><div class="company-heading"><p class="eyebrow">From the green to the court</p><h2 id="company-title">Same swing.<br><em>New plans.</em></h2></div><div class="company-grid">${photo('C10','The group chat, in real life.')}${photo('C11','Wherever the afternoon takes us.')}</div></section>
<section class="product-chapter luisa" aria-label="The Luisa Jacket edit">${product('luisa','03')}<div class="luisa-motion"><div><p class="eyebrow">A little follow-through</p><h2>Play on.<br><em>Stay out.</em></h2><p>No rush to call it a day.</p>${shop()}</div>${film('V5','There’s always time for another set.')}</div></section>
<section class="section courtside" aria-labelledby="courtside-title"><div class="folio"><span>04 / The changeover</span><span>Time out, well spent.</span></div><div class="courtside-heading"><h2 id="courtside-title">Love a little<br><em>courtside.</em></h2><span class="italic-note">Meet you in the shade.</span></div><div class="courtside-grid">${photo('C2','Hydration, with a side of gossip.')}${photo('C6','Nothing on the clock.')}</div></section>
<section class="section apres" aria-labelledby="apres-title"><div class="folio"><span>05 / The long afternoon</span><span>Stay a little longer.</span></div><div class="apres-grid">${photo('C14','The table’s set. So are we.')}<div class="apres-right"><h2 id="apres-title">Après?<br><em>Always.</em></h2>${film('V4','Off court. Still in good company.')}</div></div></section>
<section class="closing" aria-labelledby="closing-title"><p class="eyebrow">The Sunday Set by Swing</p><h2 id="closing-title">See you<br><em>on Sunday.</em></h2>${shop()}<p class="closing-signature">With love, <span>swing</span></p><a href="#cover-title" class="back-top">Back to the top ↑</a></section>
</main><footer><span>Swing / The Sunday Set</span><span>Good sport. Great company.</span></footer></body></html>`;
}

