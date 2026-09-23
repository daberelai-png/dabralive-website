import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png'};
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');let file=decodeURIComponent(u.pathname);if(file==='/' )file='/index.html';const target=path.resolve(root,'.'+file);if(!target.startsWith(root+path.sep))throw Error();const body=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'0.0.0.0');
