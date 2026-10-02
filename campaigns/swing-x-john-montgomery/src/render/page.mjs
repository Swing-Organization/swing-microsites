import {escapeHtml as e} from '../../../../shared/render/html.mjs';
import {renderEditorial} from './editorial.mjs';
import {renderProducts} from './products.mjs';
export function renderPage(site,images,resources={}){
 const c=site.campaign;
 const editorial=renderEditorial(site,images);
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${e(c.indexing)}"><meta name="description" content="${e(c.intro)}"><meta name="theme-color" content="#14263D"><title>${e(c.title)} | ${e(c.collaboration)}</title>${resources.style?`<link rel="stylesheet" href="${e(resources.style)}">`:''}${resources.script?`<script type="module" src="${e(resources.script)}"></script>`:''}</head><body class="swing-campaign"><a class="skip-link" href="#products">Skip to the collection</a><main><section id="campaign" aria-labelledby="campaign-heading">${editorial.opening}</section><section data-chapter="story" id="story" aria-labelledby="story-heading">${editorial.story}</section><section data-chapter="products" id="products" aria-labelledby="products-heading">${renderProducts(site.products,images,site.approvedProductUrls)}</section></main></body></html>`;
}
