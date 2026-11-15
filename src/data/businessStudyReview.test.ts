import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ensureIdeaToAdvantageCourse,businessLessonRevisionInputs} from './ideaToAdvantageCourse';
import {applyBusinessStudyReview} from './businessStudyReview';
import {BUSINESS_PRACTICE,BUSINESS_CHECKS} from './businessStudyContent';
import {reviewErrors} from '../lib/lessonReview';

function seed(){const db:any={courses:[],modules:[],lessons:[],quizzes:[],assignments:[],publishingLogs:[],courseVersions:[],contentBlocks:[],downloads:[],assets:[],media:[]};ensureIdeaToAdvantageCourse(db);return db;}
const db=seed(),before=structuredClone(db);
db.learners=[{id:'synthetic-preservation-check',progress:{'ita-les-1-1':true},unknown:{legacy:true}}];
const learners=structuredClone(db.learners);
assert.equal(applyBusinessStudyReview(db),true);
assert.equal(applyBusinessStudyReview(db),false);
assert.equal(db.courses[0].courseVersion,'2.1.0');assert.equal(db.courses[0].selfPaced,true);
assert.equal(db.courses[0].reviewPolicy,'source-checked-v1');
assert.deepEqual(db.learners,learners);
for(const key of ['modules','quizzes','assignments','downloads','contentBlocks','assets','media'])assert.deepEqual(db[key],before[key],key+' must be preserved');
assert.deepEqual(db.courseVersions[0].snapshot.lessons,before.lessons);
assert.deepEqual(db.courseVersions[0].snapshot.course,before.courses[0]);
assert.deepEqual(db.lessons.map((l:any)=>l.id),before.lessons.map((l:any)=>l.id));
for(const input of businessLessonRevisionInputs()){
 const lesson=db.lessons.find((l:any)=>l.id===input.id),p=BUSINESS_PRACTICE[input.moduleNumber][input.lessonIndex];
 const check=BUSINESS_CHECKS[`${input.moduleNumber}-${input.lessonIndex+1}`]||input.check;
 assert.deepEqual(reviewErrors(lesson),[],input.id);
 for(const section of ['Explain the concept','Worked business example','Guided practice','Independent practice case','Knowledge check','Common mistake and troubleshooting','Summary','Sources and review boundaries'])assert.ok(lesson.lessonContent.includes('## '+section),input.id+' missing '+section);
 assert.ok(lesson.lessonContent.includes(input.scenario),input.id+' must include its own scenario');
 assert.equal(check.options.length,3);assert.equal(new Set(check.options).size,3);assert.ok(check.options.includes(check.correct));
 assert.equal(p.wrong.length,2);assert.ok(p.wrong.every(s=>s.length>25));
 assert.ok(lesson.studySolution.includes(p.answer));
 for(const option of check.options)assert.ok(lesson.studySolution.includes(option),input.id+' feedback for every option');
 assert.doesNotMatch(lesson.studySolution,/undefined|NaN/);
 assert.ok(lesson.imageUrls.length);const asset=lesson.imageUrls.at(-1);
 assert.ok(fs.existsSync('public'+asset));assert.ok(lesson.imageAltTexts[asset]);
 const original=before.lessons.find((l:any)=>l.id===lesson.id);
 for(const key of ['estimatedTime','videoUrl','audioUrl','downloads','orderNumber','moduleId','courseId'])assert.deepEqual(lesson[key],original[key],key);
}
const body=db.lessons.map((l:any)=>l.lessonContent).join('\n');
assert.doesNotMatch(body,/weighted overall score prevents|starts at 55%|increases assessment confidence/);
assert.match(body,/A weighted overall score can still hide/);
assert.ok(db.lessons.filter((l:any)=>l.studyVisual==='business-finance').length===3);
assert.match(db.lessons.find((l:any)=>l.id==='ita-les-12-3').lessonContent,/two-week payment delay/);

const edited=seed();edited.courses[0].status='Archived';edited.courses[0].price=149;edited.courses[0].pricingType='subscription';
edited.lessons[0].lessonContent+='\nAn administrator addition';edited.lessons[1].title='Administrator title';
const editedRows=structuredClone(edited.lessons.slice(0,2));applyBusinessStudyReview(edited);
assert.deepEqual(edited.lessons.slice(0,2),editedRows);
assert.equal(edited.courses[0].status,'Archived');assert.equal(edited.courses[0].price,149);
assert.equal(edited.courses[0].pricingType,'subscription');assert.equal(edited.courses[0].selfPaced,undefined);
assert.equal(edited.courses[0].reviewPolicy,undefined);
assert.match(edited.publishingLogs.at(-1).details,/Preserved edited\/missing lessons: ita-les-1-1, ita-les-1-2/);
const deleted=seed();deleted.lessons.shift();applyBusinessStudyReview(deleted);assert.equal(deleted.lessons.length,35);
const removed=seed();removed.courses=[];assert.equal(applyBusinessStudyReview(removed),false);
console.log('Business review: 36 complete lessons, per-option feedback, sources, visual assets, history, learner preservation, edit guards and deletion preservation passed.');
