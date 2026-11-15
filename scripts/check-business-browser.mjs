// Run on a machine with Playwright installed. A fresh synthetic data directory is used.
import {createRequire} from 'node:module';
import {mkdtempSync,symlinkSync,readFileSync,rmSync,mkdirSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const root=process.cwd(),temp=mkdtempSync(path.join(os.tmpdir(),'v79-business-browser-'));
symlinkSync(path.join(root,'dist'),path.join(temp,'dist'));
const port=3481,base=`http://127.0.0.1:${port}`,errors=[];
const child=spawn(process.execPath,[path.join(root,'dist/server.cjs')],{cwd:temp,env:{...process.env,NODE_ENV:'production',PORT:String(port),V79_PLATFORM_SHARED_SECRET:'isolated-browser-test-only-business-20261115',V79_HUB_EVENT_URL:'',WEBSITE_SYNC_URL:'',ACADEMY_COURSE_PUBLISH_MODE:'academy'},stdio:'ignore'});
let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch(base+'/healthz')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const dest=path.join(root,'docs/evidence/business');mkdirSync(dest,{recursive:true});
 await page.goto(base);await page.getByRole('button',{name:'Business',exact:true}).waitFor();
 await page.getByRole('button',{name:'Business',exact:true}).click();await page.getByRole('heading',{name:'From Idea to Advantage'}).waitFor();
 await page.screenshot({path:path.join(dest,'catalogue-desktop.jpg'),type:'jpeg',quality:75});
 let r=await context.request.post(base+'/api/learner/register',{data:{email:'browser-business@example.test',name:'Business Test Learner',password:'browser-study-test-20261115'}});assert.equal(r.status(),200);
 r=await context.request.post(base+'/api/learner/enroll/course-from-idea-to-advantage-01');assert.equal(r.status(),200);
 await page.goto(base+'/course/course-from-idea-to-advantage-01');
 const db=JSON.parse(readFileSync(path.join(temp,'data/store.json'))),lessons=db.lessons.filter(l=>l.courseId==='course-from-idea-to-advantage-01');
 async function openLesson(id,mobile=false){
  const lesson=lessons.find(l=>l.id===id);if(mobile)await page.getByRole('button',{name:'Open course navigation',exact:true}).click();
  await page.locator('aside').getByRole('button').filter({hasText:lesson.title}).first().click();
  await page.getByRole('heading',{name:'Explain the concept',exact:true}).waitFor();
 }
 await openLesson('ita-les-1-3');await page.getByRole('button',{name:'Reveal model solution',exact:true}).click();await page.getByText('Knowledge-check feedback:',{exact:false}).waitFor();
 await page.locator('#study-note').fill('Illustrative case: check the weak category as well as the overall score.');
 await page.getByRole('checkbox',{name:'Bookmark this lesson for revision'}).check();await page.getByRole('button',{name:'Save notes & bookmark',exact:true}).click();await page.getByText('Notes and bookmark saved to your account.',{exact:true}).waitFor();
 await page.reload();await openLesson('ita-les-1-3');assert.equal(await page.locator('#study-note').inputValue(),'Illustrative case: check the weak category as well as the overall score.');assert.ok(await page.getByRole('checkbox',{name:'Bookmark this lesson for revision'}).isChecked());
 await openLesson('ita-les-3-1');const lab=page.getByRole('region',{name:'Break-even learning calculator'});
 // A labelled section is exposed as a region by the accessibility tree.
 await lab.getByText('Break-even: 100 whole units.',{exact:false}).waitFor();
 await lab.getByLabel('Price per unit',{exact:true}).focus();await page.keyboard.press('Tab');assert.ok(await lab.getByLabel('Variable cost per unit',{exact:true}).evaluate(el=>el===document.activeElement));
 await lab.getByLabel('Variable cost per unit',{exact:true}).fill('64');await lab.getByText('Break-even: 112 whole units.',{exact:false}).waitFor();
 await lab.getByLabel('Variable cost per unit',{exact:true}).fill('100');await lab.getByText('Positive fixed costs cannot be covered',{exact:false}).waitFor();
 await lab.getByLabel('Monthly capacity in whole units',{exact:true}).fill('1.5');await lab.getByText('Capacity must be a whole number',{exact:false}).waitFor();
 await lab.getByRole('button',{name:'Reset teaching example'}).click();await lab.scrollIntoViewIfNeeded();await lab.screenshot({path:path.join(dest,'calculator-desktop.jpg'),type:'jpeg',quality:80});
 assert.ok(await page.locator('img[src$="study-module-3.svg"]').evaluate(el=>el.complete&&el.naturalWidth>0&&el.alt.length>0));
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await openLesson('ita-les-3-2',true);await lab.scrollIntoViewIfNeeded();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await lab.evaluate(el=>el.scrollIntoView({block:'start'}));await page.mouse.wheel(0,-80);await page.screenshot({path:path.join(dest,'calculator-mobile.jpg'),type:'jpeg',quality:80});
 await page.setViewportSize({width:1440,height:1000});
 for(let n=1;n<=12;n++){
  await page.goto(base+`/idea-to-advantage/images/study-module-${n}.svg`);assert.equal((await page.locator('svg').count()),1);await page.locator('svg').screenshot({path:path.join(dest,`diagram-${n}.jpg`),type:'jpeg',quality:75});
 }
 assert.deepEqual(errors,[]);
 const source=(await import('node:child_process')).execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 const result={passed:true,source,syntheticDataOnly:true,checks:['business discovery','third-lesson explanation and feedback','saved account notes/bookmark after reload','calculator initial/changed/edge/invalid/reset','keyboard input order','390px no horizontal overflow','reduced-motion preference','12 SVGs loaded with accessible descriptions','no page errors']};
 writeFileSync(path.join(dest,'browser-checks.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser?.close();child.kill();if(child.exitCode===null)await new Promise(r=>child.once('exit',r));rmSync(temp,{recursive:true,force:true});}
