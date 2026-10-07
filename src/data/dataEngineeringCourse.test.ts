import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { ensureDataEngineeringCourse, DATA_ENGINEERING_COURSE_ID } from './dataEngineeringCourse';

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
assert.equal(ensureDataEngineeringCourse(db), true, 'fresh database should receive DP-700 v1.1');
assert.equal(ensureDataEngineeringCourse(db), false, 'DP-700 v1.1 migration must be idempotent');

const course = db.courses.find((c: any) => c.id === DATA_ENGINEERING_COURSE_ID);
assert.ok(course, 'DP-700 course must exist');
assert.equal(course.courseVersion, '1.1.0');
assert.equal(course.status, 'Published');
assert.equal(course.category, 'Data & AI');
assert.equal(course.difficultyLevel, 'Beginner to Intermediate');
assert.match(course.fullDescription, /October 19, 2026/);
assert.ok(course.learningObjectives.some((x: string) => /query acceleration/i.test(x)));
assert.ok(course.learningObjectives.some((x: string) => /troubleshoot/i.test(x)));

const modules = db.modules
  .filter((m: any) => m.courseId === DATA_ENGINEERING_COURSE_ID)
  .sort((a: any, b: any) => a.orderNumber - b.orderNumber);
const lessons = db.lessons.filter((l: any) => l.courseId === DATA_ENGINEERING_COURSE_ID);
const lessonIds = new Set(lessons.map((l: any) => l.id));
const quizzes = db.quizzes.filter((q: any) => lessonIds.has(q.lessonId));
const assignments = db.assignments.filter((a: any) => a.courseId === DATA_ENGINEERING_COURSE_ID);
const downloads = db.downloads.filter((d: any) => d.courseId === DATA_ENGINEERING_COURSE_ID);

assert.equal(modules.length, 12, 'course must keep the 12-module structure');
assert.equal(lessons.length, 36, 'each module must have three lessons');
assert.equal(quizzes.length, 12, 'each module must have an applied assessment');
assert.equal(assignments.length, 12, 'each module must have a required assignment');
assert.equal(downloads.length, 5, 'lab data pack must be linked into the course');

for (let moduleNumber = 1; moduleNumber <= 12; moduleNumber++) {
  const module = modules.find((m: any) => m.orderNumber === moduleNumber);
  assert.ok(module, `module ${moduleNumber} missing`);
  const moduleLessons = lessons
    .filter((l: any) => l.moduleId === module.id)
    .sort((a: any, b: any) => a.orderNumber - b.orderNumber);
  assert.equal(moduleLessons.length, 3, `module ${moduleNumber} must have three lessons`);
  assert.deepEqual(moduleLessons.map((l: any) => l.orderNumber), [1, 2, 3]);

  const labLesson = moduleLessons[2];
  assert.match(labLesson.lessonContent, /Required module lab/);
  assert.match(labLesson.lessonContent, /Evidence to keep/);
  assert.match(labLesson.lessonContent, /DP-700 exam focus/);
  assert.match(labLesson.lessonContent, /Official study guide:/);

  const quiz = quizzes.find((q: any) => q.lessonId === labLesson.id);
  assert.ok(quiz, `module ${moduleNumber} quiz missing`);
  assert.equal(quiz.passingScore, 80, `module ${moduleNumber} must require 80% mastery`);
  assert.equal(quiz.questions.length, 10, `module ${moduleNumber} should contain 10 applied questions`);
  assert.ok(quiz.questions.every((q: any) => q.explanation?.length >= 25), `module ${moduleNumber} questions need teaching explanations`);

  const assignment = assignments.find((a: any) => a.moduleId === module.id);
  assert.ok(assignment, `module ${moduleNumber} assignment missing`);
  assert.equal(assignment.required, true);
  assert.match(assignment.description, /required module lab/i);
}

const sqlLesson = lessons.find((l: any) => l.title === 'SELECT, Filter, Aggregate and Group');
assert.match(sqlLesson.lessonContent, /Runnable example/);
assert.match(sqlLesson.lessonContent, /SELECT DATEFROMPARTS/);
assert.match(sqlLesson.lessonContent, /```sql/);

const pysparkLesson = lessons.find((l: any) => l.title === 'PySpark Transformations, Joins and Aggregations');
assert.match(pysparkLesson.lessonContent, /from pyspark\.sql import functions as F/);
assert.match(pysparkLesson.lessonContent, /```python/);

const kqlLesson = lessons.find((l: any) => l.title === 'Eventstream, Eventhouse and KQL');
assert.match(kqlLesson.lessonContent, /WebsiteEvents/);
assert.match(kqlLesson.lessonContent, /bin\(event_time, 5m\)/);
assert.match(kqlLesson.lessonContent, /```kusto/);

const curriculum = lessons.map((l: any) => `${l.title}\n${l.description}\n${l.lessonContent}`).join('\n').toLowerCase();
for (const required of [
  'dynamic expressions',
  'query acceleration',
  'native eventhouse',
  'onelake security',
  'apache airflow',
  'database project',
  'denormalization',
  'semantic model refresh',
  'eventstream',
  'eventhouse',
  'structured streaming',
  'windowing',
  'mirroring'
]) {
  assert.ok(curriculum.includes(required), `curriculum missing DP-700 topic: ${required}`);
}

for (const file of ['customers.csv', 'products.csv', 'sales.csv', 'events.jsonl', 'README.md']) {
  assert.equal(
    existsSync(path.join(process.cwd(), 'public/labs/data-engineering', file)),
    true,
    `missing DP-700 lab asset: ${file}`
  );
}

// Simulate an existing production v1 course: upgrade exactly once while preserving
// explicit admin status/pricing choices and stable IDs used by learner progress.
const migrated: any = freshDb();
migrated.courses.push({
  id: DATA_ENGINEERING_COURSE_ID,
  slug: 'data-engineering-foundations-to-microsoft-fabric-dp-700',
  title: 'Data Engineering Foundations to Microsoft Fabric (DP-700 Prep)',
  courseVersion: '1.0.0',
  status: 'Archived',
  pricingType: 'paid',
  price: 199,
  createdAt: '2026-09-23T13:30:00.000Z'
});
migrated.modules.push({ id: 'de-mod-1', courseId: DATA_ENGINEERING_COURSE_ID, title: 'old', orderNumber: 1 });
migrated.lessons.push({ id: 'de-les-1-1', moduleId: 'de-mod-1', courseId: DATA_ENGINEERING_COURSE_ID, title: 'old lesson', orderNumber: 1 });
migrated.publishingLogs.push({ id: 'de-course-seed-log-v1', courseId: DATA_ENGINEERING_COURSE_ID });

assert.equal(ensureDataEngineeringCourse(migrated), true, 'existing v1 course should upgrade');
const migratedCourse = migrated.courses.find((c: any) => c.id === DATA_ENGINEERING_COURSE_ID);
assert.equal(migratedCourse.courseVersion, '1.1.0');
assert.equal(migratedCourse.status, 'Archived', 'admin status must be preserved');
assert.equal(migratedCourse.pricingType, 'paid', 'admin pricing type must be preserved');
assert.equal(migratedCourse.price, 199, 'admin price must be preserved');
assert.equal(migrated.lessons.find((l: any) => l.id === 'de-les-1-1').title, 'What a Data Engineer Actually Does');
assert.equal(ensureDataEngineeringCourse(migrated), false, 'v1.1 upgrade must only run once');
assert.ok(migrated.publishingLogs.some((log: any) => log.id === 'de-course-upgrade-log-v1-1'));

console.log('DP-700 Data Engineering course v1.1 integrity tests passed.');
