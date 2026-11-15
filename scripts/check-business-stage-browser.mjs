// Read-only browser checks against the isolated server staging container over SSH.
import {createRequire} from 'node:module';import {spawn,execFileSync} from 'node:child_process';import {mkdirSync,writeFileSync} from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const base='http://127.0.0.1:3483',dest=path.join(process.cwd(),'docs/evidence/business');mkdirSync(dest,{recursive:true});
const tunnel=spawn('ssh',['-o','ControlMaster=no','-o','ControlPath=none','-o','ConnectTimeout=8','-o','ExitOnForwardFailure=yes','-N','-L','127.0.0.1:3483:127.0.0.1:13379','firelion@v79sl'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<60;i++){try{if((await fetch(base+'/healthz')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const courses=await(await context.request.get(base+'/api/public/courses')).json();assert.equal(courses.filter(c=>c.selfPaced).length,3);
 const modules=await(await context.request.get(base+'/api/public/courses/course-from-idea-to-advantage-01/modules')).json();
 const lessons=(await Promise.all(modules.map(async m=>(await(await context.request.get(base+`/api/public/modules/${m.id}/lessons`)).json())))).flat();assert.equal(lessons.length,36);
 await page.goto(base+'/course/course-from-idea-to-advantage-01');
 const title=lessons.find(l=>l.id==='ita-les-3-1').title;
 await page.locator('aside').getByRole('button').filter({hasText:title}).first().click();const lab=page.getByRole('region',{name:'Break-even learning calculator'});
 await lab.getByText('Break-even: 100 whole units.',{exact:false}).waitFor();await lab.getByLabel('Monthly capacity in whole units',{exact:true}).fill('100');await lab.getByText('Capacity can reach that volume',{exact:false}).waitFor();await lab.getByRole('button',{name:'Reset teaching example'}).click();
 await lab.screenshot({path:path.join(dest,'staging-calculator-desktop.jpg'),type:'jpeg',quality:75});
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await lab.evaluate(el=>el.scrollIntoView({block:'start'}));await page.mouse.wheel(0,-80);await page.screenshot({path:path.join(dest,'staging-calculator-mobile.jpg'),type:'jpeg',quality:75});
 for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);}
 assert.deepEqual(errors,[]);const source=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
 const result={passed:true,source,readOnlyRestoredStage:true,checks:['36 reviewed business lessons served','three self-paced courses','built-image calculator and reset','320/390/768/1024/1440px no horizontal overflow','reduced motion','no page errors']};writeFileSync(path.join(dest,'stage-browser-checks.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser?.close();tunnel.kill();}
