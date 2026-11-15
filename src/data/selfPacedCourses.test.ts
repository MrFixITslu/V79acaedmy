import assert from 'node:assert/strict';
import {ensureSelfPacedCourses,foundationCourses,SELF_PACED_IDS} from './selfPacedCourses';
import {reviewErrors} from '../lib/lessonReview';
import {subnetDetails} from '../lib/studyMath';
import {deleteCourseRecords} from '../lib/academyAccess';
const db:any={courses:[{id:'legacy',title:'Keep',price:195}],modules:[],lessons:[],quizzes:[],assignments:[],downloads:[],publishingLogs:[],assets:[],media:[],courseVersions:[],contentBlocks:[]};
assert.equal(ensureSelfPacedCourses(db),true);const original=JSON.stringify(db);assert.equal(ensureSelfPacedCourses(db),false);assert.equal(JSON.stringify(db),original);assert.deepEqual(db.courses[0],{id:'legacy',title:'Keep',price:195});
assert.equal(db.lessons.length,16);assert.equal(db.quizzes.length,16);
for(const lesson of db.lessons){assert.deepEqual(reviewErrors(lesson),[]);assert.ok(lesson.lessonContent.split(/\s+/).length>=350,lesson.id);assert.ok(lesson.studySolution.length>150);assert.ok(lesson.learningObjectives.length>=3);const q=db.quizzes.find((q:any)=>q.lessonId===lesson.id);assert.equal(q.passingScore,100);assert.ok(q.questions.length>=2);for(const question of q.questions){assert.ok(question.options[question.correctAnswer]);assert.ok(question.explanation.length>40);}}
for(const course of foundationCourses){assert.ok(db.assignments.some((a:any)=>a.courseId===course.id&&a.required));assert.ok(db.downloads.some((a:any)=>a.courseId===course.id));}
deleteCourseRecords(db,SELF_PACED_IDS[0]);assert.equal(ensureSelfPacedCourses(db),false);assert.ok(!db.courses.some((c:any)=>c.id===SELF_PACED_IDS[0]));
assert.deepEqual(subnetDetails('192.168.10.70',26),{network:'192.168.10.64',broadcast:'192.168.10.127',first:'192.168.10.65',last:'192.168.10.126',mask:'255.255.255.192',total:64,usable:62});
assert.equal(subnetDetails('192.168.10.70',27)?.broadcast,'192.168.10.95');
for(const prefix of [24,25,26,27,28,29,30])for(const last of [0,1,63,64,70,127,128,254,255]){const d=subnetDetails(`192.168.10.${last}`,prefix)!;assert.equal(d.total,2**(32-prefix));assert.equal(d.usable,d.total-2);const n=Number(d.network.split('.')[3]);assert.ok(last>=n&&last<n+d.total);}
for(const [ip,prefix] of [['1.2.3',26],['1.2.3.256',26],['-1.0.0.1',26],['1.2.3.4',31],['1.2.3.4',24.5]] as const)assert.equal(subnetDetails(ip,prefix),null);
assert.ok(reviewErrors({}).length>0);
console.log('PASS: 16 self-paced lessons, seeded-data preservation, deletion markers, source metadata, 32 quiz items, capstones and 63 subnet boundaries.');
