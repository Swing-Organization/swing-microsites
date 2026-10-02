import {escapeHtml as e} from '../../../../shared/render/html.mjs';
import {renderImage} from './image.mjs';
import {validateProductUrl} from '../../scripts/content-policy.mjs';
export function renderProducts(products,images,approvedUrls){
 return `<div class="products-intro"><p class="eyebrow">Swing × John Montgomery</p><h2 id="products-heading">Shop the edit</h2><span class="selection-number" aria-hidden="true">01 — 03</span></div><div class="products-grid">${products.map((p,i)=>{
  const href=validateProductUrl(p.href,approvedUrls);
  const front=renderImage(images[p.front],{sizes:'(max-width:767px) 60vw, 19vw'});
  const back=renderImage(images[p.back],{sizes:'(max-width:767px) 35vw, 12vw'});
  const link=content=>href?`<a href="${e(href)}" aria-label="${e(p.name)} — view product">${content}</a>`:content;
  return `<article class="product-card" data-product-id="${e(p.id)}"><div class="product-views"><figure class="product-front">${link(front)}</figure><figure class="product-back">${back}</figure></div><div class="product-title"><h3>${link(e(p.name))}</h3><span aria-hidden="true">0${i+1}</span></div><p class="product-description">${e(p.description)}</p></article>`;
 }).join('')}</div><div class="campaign-colophon"><span class="wordmark">Swing</span><p>× John Montgomery</p><span class="edition-signature">The Sunday Edit</span></div>`;
}
