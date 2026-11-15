// Read-only checker; references are an explicit source-controlled list, never request URLs.
import {createRequire} from 'node:module';import fs from 'node:fs';
const text=fs.readFileSync('src/data/selfPacedCurriculum.ts','utf8');
const urls=[...new Set([...text.matchAll(/https:\/\/[^'\s]+/g)].map(m=>m[0]).filter(x=>!x.includes('${')) .concat([...text.matchAll(/RFC\((\d+)\)/g)].map(m=>`https://www.rfc-editor.org/rfc/rfc${m[1]}.html`)))];
const results=[];for(let i=0;i<urls.length;i+=4){results.push(...await Promise.all(urls.slice(i,i+4).map(async url=>{try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});await r.body?.cancel();return {url,status:r.status,result:r.ok?'reachable':r.status===403?'automated access blocked; verify in official source browser':'needs review'};}catch(e){return {url,result:'network check unavailable',error:e.message};}})));}
console.log(JSON.stringify(results,null,2));
if(results.some(r=>r.status===404||r.status===410))process.exitCode=1;
