import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat,realpath} from 'node:fs/promises';
import {resolve,join,extname,relative,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
const routes=JSON.parse(readFileSync(new URL('../deployment/campaigns.json',import.meta.url),'utf8')).map(c=>c.route);
export const HEADERS={
 'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; media-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
 'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'
};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.vtt':'text/vtt','.woff2':'font/woff2'};
export function startServer({root='dist',port=4173}={}){
 return createServer(async(req,res)=>{
  const finish=(status,message='')=>{res.writeHead(status,HEADERS);res.end(message);};
  if(!['GET','HEAD'].includes(req.method)){finish(405);return;}
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{finish(400);return;}
  const BASE=routes.find(route=>pathname===route.slice(0,-1)||pathname.startsWith(route));
  if(!BASE){finish(404);return;}
  if(pathname===BASE.slice(0,-1)){res.writeHead(308,{...HEADERS,Location:BASE});res.end();return;}
  if(!pathname.startsWith(BASE)||pathname.includes('\\')||pathname.split('/').some(s=>s==='..'||s.startsWith('.'))){finish(404);return;}
  try{
   const base=await realpath(root);const file=await realpath(join(base,pathname===BASE?pathname+'index.html':pathname));
   const rel=relative(base,file);if(rel.startsWith('..'+sep)||rel==='..'){finish(404);return;}
   const info=await stat(file);if(!info.isFile()||!mime[extname(file)]){finish(404);return;}
   const headers={...HEADERS,'Content-Type':mime[extname(file)],'Accept-Ranges':'bytes','Cache-Control':extname(file)==='.html'?'no-cache':'public, max-age=31536000, immutable'};
   let start=0,end=info.size-1,status=200;
   if(req.headers.range){
    const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if(!m||(!m[1]&&!m[2])){res.writeHead(416,{...headers,'Content-Range':`bytes */${info.size}`});res.end();return;}
    if(m[1]){start=Number(m[1]);end=m[2]?Math.min(Number(m[2]),end):end;}else start=Math.max(0,info.size-Number(m[2]));
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start> end||start>=info.size){res.writeHead(416,{...headers,'Content-Range':`bytes */${info.size}`});res.end();return;}
    status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
   }
   res.writeHead(status,{...headers,'Content-Length':end-start+1});
   if(req.method==='HEAD'){res.end();return;}
   const stream=createReadStream(file,{start,end});stream.on('error',()=>res.destroy());stream.pipe(res);
  }catch{finish(404);}
 }).listen(port,'127.0.0.1');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){startServer();console.log(`Preview: http://127.0.0.1:4173${routes.join(', ')}`);}
