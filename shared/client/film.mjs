export function initFilms(root=document){
 const videos=[...root.querySelectorAll('video')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const visible=new Set(),manualPause=new WeakSet(),automaticPause=new WeakSet();
 const stop=video=>{if(!video.paused){automaticPause.add(video);video.pause();}};
 const start=video=>{if(!document.hidden&&!reduced.matches&&!manualPause.has(video)&&!video.hidden){video.muted=true;video.play().catch(()=>{});}};
 for(const wrapper of root.querySelectorAll('[data-film]')){
  const video=wrapper.querySelector('video'),fallback=wrapper.querySelector('[data-film-fallback]'),status=wrapper.querySelector('[role="status"]');
  if(!video||!fallback||!status)continue;
  const failed=()=>{video.hidden=true;fallback.hidden=false;status.textContent='Film unavailable';};
  video.addEventListener('error',failed);if(video.error)failed();
  video.addEventListener('pause',()=>{if(automaticPause.has(video))automaticPause.delete(video);else manualPause.add(video);});
  video.addEventListener('play',()=>manualPause.delete(video));
 }
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(entry.isIntersecting&&entry.intersectionRatio>=.25){visible.add(entry.target);start(entry.target);}
   else{visible.delete(entry.target);stop(entry.target);}
  }
 },{threshold:[0,.25]});
 videos.forEach(video=>observer.observe(video));
 const pause=()=>videos.forEach(stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else visible.forEach(start);});
 reduced.addEventListener('change',()=>{if(reduced.matches)pause();else visible.forEach(start);});
 window.addEventListener('pagehide',pause);
}
initFilms();
