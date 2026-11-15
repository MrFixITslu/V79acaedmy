// Read-only structural audit. Never evaluates course code or marks lessons reviewed.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { reviewErrors } from '../src/lib/lessonReview';

const input = process.argv[2];
if (!input) throw new Error('Usage: node --import tsx scripts/audit-curriculum.ts /path/to/store.json');
const db = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
const courses = db.courses.map((course: any) => {
  const lessons = db.lessons.filter((l: any) => l.courseId === course.id).map((l: any) => {
    const text = l.lessonContent || '';
    const sources = [...new Set<string>([...text.matchAll(/https:\/\/[^\s<>"\)]+/g)].map((m: any) => m[0]).concat((l.review?.sources || []).map((s: any) => s.url)))];
    return { id: l.id, title: l.title, words: text.trim().split(/\s+/).filter(Boolean).length,
      sha256: crypto.createHash('sha256').update(text).digest('hex'),
      reviewErrors: reviewErrors(l), sources,
      hasWorkedExample: /worked example|example|demonstrat/i.test(text),
      hasPractice: /practice|activity|exercise|mission|build steps/i.test(text),
      hasDedicatedSolution: Boolean(l.studySolution),
      codeLanguages: [...text.matchAll(/```([a-z]+)/g)].map((m: any) => m[1]),
      supervisionMentioned: /instructor|teacher|guardian|adult supervision|coach/i.test(text) };
  });
  return { id: course.id, title: course.title, version: course.courseVersion, status: course.status,
    lessonCount: lessons.length, words: lessons.reduce((sum: number, l: any) => sum + l.words, 0),
    lessonsWithReviewGaps: lessons.filter((l: any) => l.reviewErrors.length).length,
    lessonsWithoutLinks: lessons.filter((l: any) => !l.sources.length).length,
    lessonsWithDedicatedSolutions: lessons.filter((l: any) => l.hasDedicatedSolution).length,
    lessonsMentioningSupervision: lessons.filter((l: any) => l.supervisionMentioned).length, lessons };
});
console.log(JSON.stringify({ schemaVersion: 1, scope: 'Structural evidence only; no accuracy or execution attestation. No learner records included.', courses }, null, 2));
