import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const originalCwd = process.cwd();
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v79-academy-db-test-'));
process.chdir(tempDir);

try {
  const mod = await import('./courseBuilderDb');
  const { loadDb, saveDb, CourseBuilderService } = mod;

  // Rollback must remove records created after the restore point.
  let db = loadDb();
  db.courses.push({ id: 'rt-course', title: 'Rollback Test', status: 'Draft', courseVersion: '1.0.0' });
  db.modules.push({ id: 'rt-module', courseId: 'rt-course', title: 'Module', orderNumber: 1 });
  db.lessons.push({ id: 'rt-lesson-old', courseId: 'rt-course', moduleId: 'rt-module', title: 'Old lesson', orderNumber: 1 });
  db.contentBlocks.push({ id: 'rt-block-old', lessonId: 'rt-lesson-old', type: 'Rich Text', orderNumber: 1, contentData: { html: '<p>old</p>' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  db.quizzes.push({ id: 'rt-quiz-old', lessonId: 'rt-lesson-old', title: 'Old quiz', passingScore: 80, questions: [] });
  db.assets.push({ id: 'rt-asset', courseId: 'rt-course', name: 'Asset', url: '/asset.pdf' });
  db.media.push({ id: 'rt-media', courseId: 'rt-course', name: 'Media', fileType: 'image', url: '/image.png', fileSize: '1 KB', createdAt: new Date().toISOString() });
  saveDb(db);

  const version = CourseBuilderService.createVersion('rt-course', '1.0.0', 'Restore point', 'Test');
  assert.ok(version);

  db = loadDb();
  db.lessons.push({ id: 'rt-lesson-new', courseId: 'rt-course', moduleId: 'rt-module', title: 'New lesson', orderNumber: 2 });
  db.contentBlocks.push({ id: 'rt-block-new', lessonId: 'rt-lesson-new', type: 'Rich Text', orderNumber: 1, contentData: { html: '<p>new</p>' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  db.quizzes.push({ id: 'rt-quiz-new', lessonId: 'rt-lesson-new', title: 'New quiz', passingScore: 80, questions: [] });
  saveDb(db);

  assert.equal(CourseBuilderService.rollbackToVersion('rt-course', version.id), true);
  db = loadDb();
  assert.equal(db.lessons.some((row: any) => row.id === 'rt-lesson-new'), false);
  assert.equal(db.contentBlocks.some((row: any) => row.id === 'rt-block-new'), false);
  assert.equal(db.quizzes.some((row: any) => row.id === 'rt-quiz-new'), false);
  assert.equal(db.assets.some((row: any) => row.id === 'rt-asset'), true);
  assert.equal(db.media.some((row: any) => row.id === 'rt-media'), true);

  // Import package IDs must never collide with records owned by another course.
  db.courses.push({ id: 'other-course', title: 'Other Course', status: 'Draft', courseVersion: '1.0.0' });
  db.modules.push({ id: 'shared-module-id', courseId: 'other-course', title: 'Protected module', orderNumber: 1 });
  db.lessons.push({ id: 'shared-lesson-id', courseId: 'other-course', moduleId: 'shared-module-id', title: 'Protected lesson', orderNumber: 1 });
  db.contentBlocks.push({ id: 'shared-block-id', lessonId: 'shared-lesson-id', type: 'Rich Text', orderNumber: 1, contentData: { html: '<p>protected</p>' }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  saveDb(db);

  const failed = CourseBuilderService.importCoursePackage({
    course: { id: 'incoming-course', title: 'Incoming Course' },
    modules: [{ id: 'shared-module-id', title: 'Collision', lessons: [] }]
  }, 'Test', 'collision.json');

  assert.equal(failed.status, 'Failed');
  db = loadDb();
  assert.equal(db.courses.some((row: any) => row.id === 'incoming-course'), false);
  assert.equal(db.modules.find((row: any) => row.id === 'shared-module-id')?.courseId, 'other-course');
  assert.equal(db.contentBlocks.find((row: any) => row.id === 'shared-block-id')?.lessonId, 'shared-lesson-id');

  console.log('✓ Course database rollback and import integrity tests passed');
} finally {
  process.chdir(originalCwd);
  fs.rmSync(tempDir, { recursive: true, force: true });
}
