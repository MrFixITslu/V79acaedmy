import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import os from 'node:os';import path from 'node:path';import {spawn} from 'node:child_process';import net from 'node:net';import {createHash,createHmac} from 'node:crypto';
const root=process.cwd(),dir=mkdtempSync(path.join(os.tmpdir(),'academy-study-'));const socket=net.createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
const secret='study-api-isolated-hub-secret-20261115';const child=spawn(process.execPath,[path.join(root,'dist/server.cjs')],{cwd:dir,env:{...process.env,NODE_ENV:'production',PORT:String(port),V79_PLATFORM_SHARED_SECRET:secret,ACADEMY_COURSE_PUBLISH_MODE:'academy',V79_HUB_EVENT_URL:'',WEBSITE_SYNC_URL:''},stdio:'ignore'});const base=`http://127.0.0.1:${port}`;
function signed(route,method,body){const stamp=String(Date.now());return {'x-v79-service-id':'v79-hub','x-v79-timestamp':stamp,'x-v79-signature':createHmac('sha256',secret).update([method,route,stamp,createHash('sha256').update(body?JSON.stringify(body):'').digest('hex')].join('\n')).digest('hex')};}
async function api(route,{method='GET',cookie='',body,status=200,admin=false}={}){const r=await fetch(base+route,{method,headers:{...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{}),...(admin?signed(route,method,body):{})},body:body?JSON.stringify(body):undefined});const d=await r.json();assert.equal(r.status,status,`${method} ${route}: ${JSON.stringify(d)}`);return {data:d,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 for(let i=0;i<100;i++){try{if((await fetch(base+'/healthz')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 for(const route of ['/server.cjs','/server.cjs.map','/data/learners.json']) {const r=await fetch(base+route);assert.equal(r.status,404,route);}
 await api('/study/ai-workbook.html',{status:403});
 const catalog=(await api('/api/public/courses')).data;const course=catalog.find(c=>c.selfPaced);assert.ok(course);assert.equal(course.lessonCount,8);
 const source=JSON.parse(readFileSync(path.join(dir,'data/store.json')));const lessons=source.lessons.filter(l=>l.courseId===course.id);const first=lessons[0];
 const a=await api('/api/learner/register',{method:'POST',body:{email:'one@example.test',name:'Learner One',password:'study-password-12345'}});const b=await api('/api/learner/register',{method:'POST',body:{email:'two@example.test',name:'Learner Two',password:'study-password-12345'}});
 await api(`/api/learner/study/${first.id}`,{cookie:a.cookie,status:403});
 await api(`/api/learners/${a.data.user.id}/membership`,{method:'PUT',admin:true,body:{status:'active',expiresAt:new Date(Date.now()+86400000).toISOString()}});
 await api(`/api/learners/${b.data.user.id}/membership`,{method:'PUT',admin:true,body:{status:'active',expiresAt:new Date(Date.now()+86400000).toISOString()}});
 await api(`/api/learner/visits/${first.id}`,{method:'POST',cookie:a.cookie});
 await api(`/api/learner/study/${first.id}`,{method:'PUT',cookie:a.cookie,body:{note:'My private study explanation',bookmarked:true}});
 assert.equal((await api(`/api/learner/study/${first.id}`,{cookie:b.cookie})).data.note,'');
 await api(`/api/learner/study/${first.id}`,{method:'PUT',cookie:a.cookie,body:{note:'x'.repeat(10001),bookmarked:true},status:400});
 await api('/api/learner/study/foreign-lesson',{cookie:a.cookie,status:403});
 await api('/api/learners/insights',{cookie:a.cookie,status:401});
 const quiz=(await api(`/api/public/lessons/${first.id}/quiz`,{cookie:a.cookie})).data;assert.equal(quiz.questions[0].correctAnswer,undefined);assert.equal(quiz.questions[0].explanation,undefined);
 const firstQ=source.quizzes.find(q=>q.lessonId===first.id);const wrong=Object.fromEntries(firstQ.questions.map(q=>[q.id,q.options[(q.correctAnswer+1)%q.options.length]]));
 const failed=(await api(`/api/public/lessons/${first.id}/quiz/submit`,{method:'POST',cookie:a.cookie,body:{answers:wrong}})).data;assert.equal(failed.score,0);assert.ok(failed.feedback.every(f=>f.explanation));
 await api(`/api/learner/lessons/${first.id}/complete`,{method:'POST',cookie:a.cookie,status:409});
 await api(`/api/learner/certificate/${course.id}`,{method:'POST',cookie:a.cookie,status:409});
 for(const lesson of lessons){const q=source.quizzes.find(q=>q.lessonId===lesson.id);const answers=Object.fromEntries(q.questions.map(q=>[q.id,q.options[q.correctAnswer]]));const result=(await api(`/api/public/lessons/${lesson.id}/quiz/submit`,{method:'POST',cookie:a.cookie,body:{answers}})).data;assert.equal(result.score,100);assert.equal(result.completionRecorded,true);}
 await api(`/api/learner/certificate/${course.id}`,{method:'POST',cookie:a.cookie,status:409});
 const assignment=source.assignments.find(a=>a.courseId===course.id);await api(`/api/learner/assignments/${assignment.id}/submit`,{method:'POST',cookie:a.cookie,body:{text:'My fictional capstone includes the prompt, output, independent fact checks, limitations and workflow approval boundary.'}});
 const certificate=(await api(`/api/learner/certificate/${course.id}`,{method:'POST',cookie:a.cookie})).data;assert.equal(certificate.name,'Learner One');
 // A second independent learner completes the networking course without an instructor.
 const network=source.courses.find(c=>c.id==='course-small-business-networking-01');

 const networkLessons=source.lessons.filter(l=>l.courseId===network.id);
 assert.equal(networkLessons.length,8);
 for(const lesson of networkLessons){
  const q=source.quizzes.find(q=>q.lessonId===lesson.id);
  const answers=Object.fromEntries(q.questions.map(q=>[q.id,q.options[q.correctAnswer]]));
  const result=(await api(`/api/public/lessons/${lesson.id}/quiz/submit`,{method:'POST',cookie:b.cookie,body:{answers}})).data;
  assert.equal(result.score,100);assert.equal(result.completionRecorded,true);
 }
 await api(`/api/learner/certificate/${network.id}`,{method:'POST',cookie:b.cookie,status:409});
 const networkAssignment=source.assignments.find(a=>a.courseId===network.id);
 await api(`/api/learner/assignments/${networkAssignment.id}/submit`,{method:'POST',cookie:b.cookie,body:{text:'My simulated small-business network plan includes a labelled topology, subnet range, gateway, separate guest access, performance evidence and a reversible troubleshooting sequence.'}});
 assert.equal((await api(`/api/learner/certificate/${network.id}`,{method:'POST',cookie:b.cookie})).data.name,'Learner Two');
 await api(`/api/learners/${b.data.user.id}/membership`,{method:'PUT',admin:true,body:{status:'active',expiresAt:new Date(Date.now()-1000).toISOString()},status:400});
 await api(`/api/learners/${b.data.user.id}/membership`,{method:'PUT',admin:true,body:{status:'inactive'}});
 await api(`/api/learner/study/${networkLessons[0].id}`,{cookie:b.cookie,status:403});
 assert.equal((await api(`/api/learner/study/${first.id}`,{cookie:a.cookie})).data.note,'My private study explanation');
 const learning=(await api('/api/learner/learning',{cookie:a.cookie})).data;assert.equal(learning[0].percent,100);assert.equal(learning[0].bookmarks.length,1);
 const opted=(await api('/api/learner/membership/non-renewal',{method:'POST',cookie:a.cookie})).data;assert.equal(opted.user.membershipStatus,'active');assert.ok(opted.user.nonRenewalRequestedAt);
 const insights=(await api('/api/learners/insights',{admin:true})).data.courses.find(c=>c.id===course.id);assert.equal(insights.quizAttempts,9);assert.equal(insights.quizPasses,8);assert.equal(insights.certificates,1);
 const edit=(await api(`/api/lessons/${first.id}`,{method:'PUT',admin:true,body:{lessonContent:first.lessonContent+'\nReviewed change.'}})).data;assert.equal(edit.review.status,'review-required');
 await api(`/api/courses/${course.id}`,{method:'PUT',admin:true,body:{status:'Published'},status:400});
 await api(`/api/lessons/${first.id}/review`,{method:'POST',admin:true,body:{version:'1.0.1',prerequisites:['Basic computer skills'],sources:first.review.sources}});
 await api(`/api/courses/${course.id}/publish`,{method:'POST',admin:true,body:{userRole:'Admin'}});
 assert.equal((await api(`/api/learner/study/${first.id}`,{cookie:a.cookie})).data.note,'My private study explanation');
 console.log('PASS: paid access denial, isolated notes, validation, resume/bookmarks, withheld answers, failed/pass feedback, completion/capstone/certificate gates, real analytics, non-renewal preserves expiry, edit invalidation and explicit source-reviewed publication.');
}finally{child.kill();await new Promise(r=>child.once('exit',r));rmSync(dir,{recursive:true,force:true});}
