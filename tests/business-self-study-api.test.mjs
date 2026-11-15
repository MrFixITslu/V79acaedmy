import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import os from 'node:os';import path from 'node:path';import net from 'node:net';import {spawn} from 'node:child_process';import {createHash,createHmac} from 'node:crypto';
const root=process.cwd(),dir=mkdtempSync(path.join(os.tmpdir(),'v79-business-study-'));
const listener=net.createServer();await new Promise(r=>listener.listen(0,'127.0.0.1',r));const port=listener.address().port;await new Promise(r=>listener.close(r));
const secret='isolated-business-study-hub-secret-20261115',base=`http://127.0.0.1:${port}`;
let child;
async function start(){
 child=spawn(process.execPath,[path.join(root,'dist/server.cjs')],{cwd:dir,env:{...process.env,NODE_ENV:'production',PORT:String(port),V79_PLATFORM_SHARED_SECRET:secret,ACADEMY_COURSE_PUBLISH_MODE:'academy',V79_HUB_EVENT_URL:'',WEBSITE_SYNC_URL:''},stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch(base+'/healthz')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}
 throw Error('Isolated business API server did not become ready');
}
function signature(route,method,body){const t=String(Date.now());return {'x-v79-service-id':'v79-hub','x-v79-timestamp':t,'x-v79-signature':createHmac('sha256',secret).update([method,route,t,createHash('sha256').update(body?JSON.stringify(body):'').digest('hex')].join('\n')).digest('hex')};}
async function api(route,{method='GET',body,cookie='',admin=false,status=200}={}){
 const r=await fetch(base+route,{method,headers:{...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{}),...(admin?signature(route,method,body):{})},body:body?JSON.stringify(body):undefined});
 const data=await r.json();assert.equal(r.status,status,`${method} ${route}: ${JSON.stringify(data)}`);return {data,cookie:r.headers.get('set-cookie')?.split(';')[0]};
}
try{
 await start();
 const courseId='course-from-idea-to-advantage-01';
 const catalog=(await api('/api/public/courses')).data,course=catalog.find(c=>c.id===courseId);
 assert.equal(course.courseVersion,'2.1.0');assert.equal(course.selfPaced,true);assert.equal(course.topic,'Business');assert.equal(course.lessonCount,36);
 assert.equal(catalog.filter(c=>c.selfPaced).length,3);
 const db=JSON.parse(readFileSync(path.join(dir,'data/store.json')));
 const lessons=db.lessons.filter(l=>l.courseId===courseId),assignments=db.assignments.filter(a=>a.courseId===courseId);
 const user=await api('/api/learner/register',{method:'POST',body:{email:'independent-business@example.test',name:'Independent Business Learner',password:'business-study-test-12345'}});const cookie=user.cookie;
 await api(`/api/learner/certificate/${courseId}`,{method:'POST',cookie,status:409});
 await api(`/api/learner/study/${lessons[0].id}`,{method:'PUT',cookie,body:{note:'A weighted total can hide a weak finance category.',bookmarked:true}});
 for(const lesson of lessons){
  assert.equal(lesson.review.status,'source-checked');assert.ok(lesson.studySolution);
  const q=db.quizzes.find(q=>q.lessonId===lesson.id);
  if(q){const r=(await api(`/api/public/lessons/${lesson.id}/quiz/submit`,{method:'POST',cookie,body:{answers:Object.fromEntries(q.questions.map(q=>[q.id,q.correctAnswer]))}})).data;assert.equal(r.score,100);assert.equal(r.completionRecorded,true);}
  else await api(`/api/learner/lessons/${lesson.id}/complete`,{method:'POST',cookie});
 }
 await api(`/api/learner/exam/${courseId}`,{method:'POST',cookie,body:{answers:{}},status:409});
 for(const assignment of assignments)await api(`/api/learner/assignments/${assignment.id}/submit`,{method:'POST',cookie,body:{text:'Simulated business plan: assumptions, calculations, owner, evidence requirements, review date and stop/change rules. This submission does not claim real client results.'}});
 await api(`/api/learner/certificate/${courseId}`,{method:'POST',cookie,status:409});
 const programme=db.courses.find(c=>c.id===courseId).programme;
 await api(`/api/learner/exam/${courseId}`,{method:'POST',cookie,body:{answers:{}},status:400});
 const answers=Object.fromEntries(programme.finalExam.questions.map(q=>[q.id,q.correctAnswer]));
 const result=(await api(`/api/learner/exam/${courseId}`,{method:'POST',cookie,body:{answers}})).data;assert.equal(result.attempt.passed,true);
 const certificate=(await api(`/api/learner/certificate/${courseId}`,{method:'POST',cookie})).data;assert.equal(certificate.name,'Independent Business Learner');
 assert.equal((await api(`/api/learner/study/${lessons[0].id}`,{cookie})).data.note,'A weighted total can hide a weak finance category.');
 // An assessment edit is a teaching change even when the lesson prose did not change.
 const quiz=db.quizzes.find(q=>q.lessonId===lessons[2].id);quiz.questions[0].explanation+=' Additional reviewed-example wording.';
 await api(`/api/lessons/${lessons[2].id}/quiz`,{method:'POST',admin:true,body:quiz});
 assert.equal((await api(`/api/lessons/${lessons[2].id}`,{admin:true})).data.review.status,'review-required');
 await api(`/api/courses/${courseId}`,{method:'PUT',admin:true,body:{status:'Published'},status:400});
 await api(`/api/lessons/${lessons[2].id}/review`,{method:'POST',admin:true,body:{version:'2.1.1',prerequisites:lessons[2].review.prerequisites,sources:lessons[2].review.sources}});
 await api(`/api/courses/${courseId}/publish`,{method:'POST',admin:true,body:{userRole:'Admin'}});
 child.kill();await new Promise(r=>child.once('exit',r));await start();
 assert.equal((await api(`/api/learner/study/${lessons[0].id}`,{cookie})).data.note,'A weighted total can hide a weak finance category.');
 assert.equal((await api(`/api/learner/certificate/${courseId}`,{method:'POST',cookie})).data.id,certificate.id);
 const stored=JSON.parse(readFileSync(path.join(dir,'data/store.json')));assert.equal(stored.courseVersions.filter(v=>v.id==='ita-before-self-study-v2-1').length,1);
 console.log('PASS: independent 36-lesson business journey, 12 assignments, final-exam/certificate gates, saved notes/progress across restart, version history and assessment-edit source-review invalidation. Synthetic test data only; no instructor, payment or customer messaging used.');
}finally{child?.kill();if(child?.exitCode===null)await new Promise(r=>child.once('exit',r));rmSync(dir,{recursive:true,force:true});}
