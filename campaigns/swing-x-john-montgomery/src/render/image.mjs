import {escapeHtml as e} from '../../../../shared/render/html.mjs';
import {BASE,safeLocalPath} from '../../scripts/content-policy.mjs';
export function renderImage(image,{priority=false,className='',sizes='(max-width: 767px) calc(100vw - 40px), 45vw'}={}){
 if(!image)throw Error('Missing prepared image');
 if(!/^[a-z0-9 -]*$/i.test(className))throw Error('Invalid image class');
 const url=v=>BASE+safeLocalPath(v.src);
 const webp=image.variants.filter(v=>v.format==='webp');
 const jpg=image.variants.filter(v=>v.format==='jpeg');
 const variants=jpg.length?jpg:webp;
 const chosen=variants.find(v=>v.width>=640)??variants.at(-1);
 const set=list=>list.map(v=>`${e(url(v))} ${v.width}w`).join(', ');
 return `<picture class="${e(className)}">${webp.length?`<source type="image/webp" srcset="${set(webp)}" sizes="${e(sizes)}">`:''}<img data-asset-id="${e(image.id)}" src="${e(url(chosen))}" srcset="${set(variants)}" sizes="${e(sizes)}" width="${image.width}" height="${image.height}" alt="${e(image.alt)}" loading="${priority?'eager':'lazy'}" decoding="async"${priority?' fetchpriority="high"':''}></picture>`;
}
