import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  ensureIdeaToAdvantageCourse,
  IDEA_TO_ADVANTAGE_COURSE_ID,
  IDEA_TO_ADVANTAGE_PROGRAMME
} from './ideaToAdvantageCourse';

function freshDb() {
  return {
    courses: [],
    modules: [],
    lessons: [],
    quizzes: [],
    assets: [],
    contentBlocks: [],
    media: [],
    assignments: [],
    downloads: [],
    courseVersions: [],
    importHistories: [],
    publishingLogs: []
  };
}

const db: any = freshDb();
assert.equal(ensureIdeaToAdvantageCourse(db), true);
assert.equal(ensureIdeaToAdvantageCourse(db), false, 'business course seed must be idempotent');

const course = db.courses.find((c: any) => c.id === IDEA_TO_ADVANTAGE_COURSE_ID);
assert.ok(course);
assert.equal(course.courseVersion, '2.0.0');
assert.equal(course.status, 'Published');
assert.equal(course.pricingType, 'free');
assert.equal(course.price, 0);
assert.equal(course.programme?.kind, 'business_advantage');
assert.equal(course.programme?.version, 2);
assert.equal(course.programme?.framework, 'DEFINE → MODEL → TEST → CONTROL → MEASURE → IMPROVE');
assert.equal(IDEA_TO_ADVANTAGE_PROGRAMME.finalExam.questions.length, 24);
assert.equal(IDEA_TO_ADVANTAGE_PROGRAMME.certificate.finalExamMinimumScore, 70);
assert.equal(IDEA_TO_ADVANTAGE_PROGRAMME.certificate.requireAllAssignments, true);

const modules = db.modules.filter((m: any) => m.courseId === IDEA_TO_ADVANTAGE_COURSE_ID);
const lessons = db.lessons.filter((l: any) => l.courseId === IDEA_TO_ADVANTAGE_COURSE_ID);
const assignments = db.assignments.filter((a: any) => a.courseId === IDEA_TO_ADVANTAGE_COURSE_ID);
const lessonIds = new Set(lessons.map((l: any) => l.id));
const quizzes = db.quizzes.filter((q: any) => lessonIds.has(q.lessonId));

assert.equal(modules.length, 12);
assert.equal(lessons.length, 36);
assert.equal(quizzes.length, 12);
assert.equal(assignments.length, 12);

for (let moduleNumber = 1; moduleNumber <= 12; moduleNumber++) {
  const module = modules.find((m: any) => m.orderNumber === moduleNumber);
  assert.ok(module, `module ${moduleNumber} missing`);
  const moduleLessons = lessons.filter((l: any) => l.moduleId === module.id).sort((a: any,b: any)=>a.orderNumber-b.orderNumber);
  assert.equal(moduleLessons.length, 3);
  assert.deepEqual(moduleLessons.map((l: any) => l.orderNumber), [1,2,3]);
  assert.ok(moduleLessons.every((l: any) => l.lessonContent.length > 2200), `module ${moduleNumber} contains a thin lesson`);

  assert.match(moduleLessons[0].lessonContent, /The management decision/);
  assert.match(moduleLessons[0].lessonContent, /Mental model — how an operator should think/);
  assert.match(moduleLessons[0].lessonContent, /Worked Caribbean example/);
  assert.match(moduleLessons[0].lessonContent, /Red-team the assumption/);
  assert.match(moduleLessons[0].lessonContent, /Decision note/);

  assert.match(moduleLessons[1].lessonContent, /Build the operating system/);
  assert.match(moduleLessons[1].lessonContent, /Implementation method/);
  assert.match(moduleLessons[1].lessonContent, /Implementation drill/);
  assert.match(moduleLessons[1].lessonContent, /Failure-proof the system/);
  assert.match(moduleLessons[1].lessonContent, /Handoff test/);

  assert.match(moduleLessons[2].lessonContent, /Control loop — prove that the system works/);
  assert.match(moduleLessons[2].lessonContent, /Evidence of mastery/);
  assert.match(moduleLessons[2].lessonContent, /Transfer challenge/);
  assert.match(moduleLessons[2].lessonContent, /30-day proof/);
  assert.match(moduleLessons[2].lessonContent, /Management evidence pack/);

  const quiz = quizzes.find((q: any) => q.lessonId === moduleLessons[2].id);
  assert.ok(quiz);
  assert.ok(quiz.questions.length >= 3, `module ${moduleNumber} quiz should contain application questions`);
  assert.ok(quiz.questions.every((q: any) => q.explanation && q.explanation.length > 20));

  const assignment = assignments.find((a: any) => a.moduleId === module.id);
  assert.ok(assignment);
  assert.equal(assignment.required, true);
  assert.equal(assignment.workbookSectionId, `wb-${String(moduleNumber).padStart(2,'0')}`);
}

const finalLesson = lessons.find((l: any) => l.id === 'ita-les-12-3');
assert.ok(finalLesson);
assert.match(finalLesson.lessonContent, /Business Operator Benchmark — final transfer test/);
assert.match(finalLesson.lessonContent, /DEFINE → MODEL → TEST → CONTROL → MEASURE → IMPROVE/);
assert.ok(finalLesson.downloads.some((d: any) => d.url.endsWith('/decision-evidence-sheet.svg')));
assert.ok(finalLesson.downloads.some((d: any) => d.url.endsWith('/business-operator-benchmark.svg')));
assert.ok(finalLesson.downloads.some((d: any) => d.url.endsWith('/business-operator-graduation-rubric.svg')));
assert.ok(lessons.find((l: any) => l.id === 'ita-les-1-1').imageUrls.includes('/idea-to-advantage/images/business-operator-skills-map.svg'));

const finalAssignment = assignments.find((a: any) => a.moduleId === 'ita-mod-12');
assert.match(finalAssignment.description, /Business Operator Benchmark/);
assert.match(finalAssignment.description, /no category below 3\/4/);

for (const asset of [
  'public/idea-to-advantage/images/business-operator-skills-map.svg',
  'public/idea-to-advantage/resources/decision-evidence-sheet.svg',
  'public/idea-to-advantage/resources/business-operator-benchmark.svg',
  'public/idea-to-advantage/resources/business-operator-graduation-rubric.svg'
]) {
  assert.equal(existsSync(path.join(process.cwd(), asset)), true, `missing business course resource: ${asset}`);
}

const curriculum = lessons.map((l: any) => l.lessonContent.toLowerCase()).join('\n');
for (const required of [
  'evidence',
  'assumption',
  'baseline',
  'decision',
  'owner',
  'measure',
  'control',
  'transfer challenge',
  '30-day proof',
  'red-team'
]) {
  assert.ok(curriculum.includes(required), `business curriculum missing operator capability: ${required}`);
}

// v1 production course upgrades to v2 without losing administrator state.
const legacyDb: any = freshDb();
legacyDb.courses.push({
  ...course,
  courseVersion: '1.0.0',
  status: 'Archived',
  pricingType: 'subscription',
  price: 149,
  websiteAppId: 7788,
  websitePublishedAt: '2026-09-30T10:00:00.000Z',
  createdAt: '2026-09-23T15:00:00.000Z'
});
legacyDb.publishingLogs.push({ id: 'ita-course-seed-log-v1', courseId: IDEA_TO_ADVANTAGE_COURSE_ID });
assert.equal(ensureIdeaToAdvantageCourse(legacyDb), true);
const upgraded = legacyDb.courses.find((c: any) => c.id === IDEA_TO_ADVANTAGE_COURSE_ID);
assert.equal(upgraded.courseVersion, '2.0.0');
assert.equal(upgraded.status, 'Archived');
assert.equal(upgraded.pricingType, 'subscription');
assert.equal(upgraded.price, 149);
assert.equal(upgraded.websiteAppId, 7788);
assert.equal(upgraded.createdAt, '2026-09-23T15:00:00.000Z');
assert.ok(legacyDb.publishingLogs.some((log: any) => log.id === 'ita-course-content-v2'));
assert.equal(ensureIdeaToAdvantageCourse(legacyDb), false, 'v2 migration must be idempotent');

console.log('From Idea to Advantage curriculum v2 integrity and migration tests passed.');
