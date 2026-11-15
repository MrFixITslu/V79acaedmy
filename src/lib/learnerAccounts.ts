import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { scoreFinalExam } from './programmeScoring';
import { loadDb } from './courseBuilderDb';
import { canReadCourse, hasMembership, requiresSubscription } from './academyAccess';
import { queueAcademyEvent } from './platformEvents';
import { issueLearnerSession, learnerSessionUserId, revokeLearnerSession, revokeLearnerSessionsForUser } from './learnerSessions';
import { issueCertificate } from './certificateRegistry';
import { createAcademyCourseOrder, getAcademyBillingCapabilities, getAcademyOrderStatus } from './billingClient';

const file = path.join(process.cwd(), 'data', 'learners.json');
function read(): any[] { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []; }
function write(users: any[]) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file + '.tmp', JSON.stringify(users), { mode: 0o600 }); fs.renameSync(file + '.tmp', file); }
const juniorFile = path.join(process.cwd(), 'data', 'junior-academy.json');
function safeQueueAcademyEvent(event: Parameters<typeof queueAcademyEvent>[0]) {
  try { return queueAcademyEvent(event); }
  catch (error: any) { console.warn('[V79 Hub Events] Could not queue Academy event:', error?.message || error); return null; }
}
function juniorTeamWorkComplete(userId: string, courseId: string): boolean {
  if (!fs.existsSync(juniorFile)) return false;
  try {
    const store = JSON.parse(fs.readFileSync(juniorFile, 'utf8'));
    const team = (store.teams || []).find((t: any) => t.courseId === courseId && (t.memberIds || []).includes(userId));
    if (!team) return false;
    for (let mission = 1; mission <= 16; mission++) {
      const submission = (store.submissions || []).find((x: any) => x.teamId === team.id && x.missionNumber === mission);
      if (!submission || submission.status !== 'Approved') return false;
      const reflection = submission.individualReflections?.[userId];
      if (!reflection || !String(reflection.helped || '').trim() || !String(reflection.learned || '').trim() || !String(reflection.next || '').trim()) return false;
    }
    return true;
  } catch {
    return false;
  }
}
const digest = (password: string, salt: string) => crypto.scryptSync(password, salt, 64).toString('hex');
function learnerSessionToken(req: express.Request) {
  return /(?:^|;\s*)academy_session=([^;]+)/.exec(req.headers.cookie || '')?.[1] || null;
}
export function learner(req: express.Request) {
  const userId = learnerSessionUserId(learnerSessionToken(req));
  return userId ? read().find(u => u.id === userId) || null : null;
}
function publicUser(u: any) { return { id: u.id, email: u.email, name: u.name, membershipStatus: hasMembership(u) ? 'active' : 'inactive', membershipExpiresAt: u.membershipExpiresAt, nonRenewalRequestedAt:u.nonRenewalRequestedAt || null, enrolledCourseIds: u.enrolledCourseIds || [] }; }
function cookie(req: express.Request, value: string, age: number) { return `academy_session=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${age}${req.secure || process.env.NODE_ENV === 'production' ? '; Secure' : ''}`; }
export const learnerRouter = express.Router();
learnerRouter.get('/session', async (req, res) => {
  const u = learner(req);
  let billing = { provider: 'wipay', managedBy: 'v79-hub', available: false, environment: null as string | null, currency: null as string | null };
  try {
    const capabilities = await getAcademyBillingCapabilities();
    billing = {
      provider: 'wipay',
      managedBy: 'v79-hub',
      available: Boolean(capabilities?.checkoutAvailable),
      environment: capabilities?.provider?.environment || null,
      currency: capabilities?.provider?.currency || null,
    };
  } catch {
    // Billing capability failure must never break learner sign-in/session access.
  }
  res.json({ user: u ? publicUser(u) : null, billing });
});
for (const action of ['register', 'login']) learnerRouter.post('/' + action, (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length < 12 || password.length > 256) return res.status(400).json({ error: 'Enter a valid email and a password of 12–256 characters.' });
  const users = read();
  let user = users.find(u => u.email === email);
  if (action === 'register') {
    const name = String(req.body.name || '').trim().slice(0, 100);
    if (!name) return res.status(400).json({ error: 'Your name is required.' });
    if (user) return res.status(409).json({ error: 'An account already exists. Sign in instead.' });
    const salt = crypto.randomBytes(16).toString('hex');
    user = { id: crypto.randomUUID(), email, name, salt, hash: digest(password, salt), enrolledCourseIds: [], progress: {}, membershipStatus: 'inactive', createdAt: new Date().toISOString() };
    users.push(user); write(users);
  } else {
    const computed = digest(password, user?.salt || 'invalid-account');
    if (!user || !crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(user.hash, 'hex'))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  }
  const token = issueLearnerSession(user.id);
  res.setHeader('Set-Cookie', cookie(req, token, 43200));
  res.json({ user: publicUser(user) });
});
learnerRouter.post('/logout', (req, res) => {
  revokeLearnerSession(learnerSessionToken(req));
  res.setHeader('Set-Cookie', cookie(req, '', 0)); res.json({ success: true });
});
learnerRouter.use((req, res, next) => { if (!learner(req)) return res.status(401).json({ error: 'Sign in to your learner account.' }); next(); });
// Study state is resolved from trusted lesson/course IDs and isolated to the signed-in user.
learnerRouter.post('/membership/non-renewal',(req,res)=>{
 const users=read();const user=users.find(u=>u.id===learner(req).id);
 user.nonRenewalRequestedAt ||= new Date().toISOString();write(users);
 res.json({user:publicUser(user),message:'Non-renewal preference recorded. Current access remains until the membership expiry. Academy has no automatic recurring collection configured; any external payment arrangement must be managed with V79 separately.'});
});
learnerRouter.get('/learning', (req, res) => {
  const user = learner(req); const db = loadDb();
  const courses = db.courses.filter((c:any) => ['Published', 'Uploaded'].includes(c.status) && (user.enrolledCourseIds || []).includes(c.id));
  res.json(courses.map((course:any) => {
    const lessons = db.lessons.filter((l:any) => l.courseId === course.id);
    const progress = user.progress?.[course.id] || {};
    const completed = lessons.filter((l:any) => progress.completedLessons?.[l.id]).length;
    const last = lessons.find((l:any) => l.id === progress.lastLessonId);
    const next = last || lessons.find((l:any) => !progress.completedLessons?.[l.id]) || lessons[0];
    return { courseId: course.id, completed, total: lessons.length, percent: lessons.length ? Math.round(completed / lessons.length * 100) : 0,
      resumeLessonId: next?.id, updatedAt: progress.updatedAt || null,
      bookmarks: lessons.filter((l:any) => progress.study?.[l.id]?.bookmarked).map((l:any) => ({id:l.id,title:l.title})) };
  }));
});
function studyContext(req: express.Request) {
 const users=read(); const user=users.find(u=>u.id===learner(req)?.id); const db=loadDb();
 const lesson=db.lessons.find((l:any)=>l.id===req.params.lessonId);
 const course=lesson && db.courses.find((c:any)=>c.id===lesson.courseId && ['Published','Uploaded'].includes(c.status));
 return user && course && canReadCourse(course,user) ? {users,user,lesson,course} : null;
}
learnerRouter.get('/study/:lessonId',(req,res)=>{
 const ctx=studyContext(req);if(!ctx)return res.status(403).json({error:'Course access required.'});
 const saved=ctx.user.progress?.[ctx.course.id]?.study?.[ctx.lesson.id];
 res.json({note:saved?.note || '',bookmarked:Boolean(saved?.bookmarked)});
});
learnerRouter.put('/study/:lessonId',(req,res)=>{
 const ctx=studyContext(req);if(!ctx)return res.status(403).json({error:'Course access required.'});
 if(typeof req.body.note!=='string' || req.body.note.length>10000 || typeof req.body.bookmarked!=='boolean') return res.status(400).json({error:'Enter notes of up to 10,000 characters and a valid bookmark choice.'});
 ctx.user.progress ||= {};const p=ctx.user.progress[ctx.course.id] ||= {};p.study ||= {};
 p.study[ctx.lesson.id]={note:req.body.note,bookmarked:req.body.bookmarked,savedAt:new Date().toISOString()};p.updatedAt=new Date().toISOString();
 write(ctx.users);res.json({saved:true});
});
learnerRouter.post('/visits/:lessonId',(req,res)=>{
 const ctx=studyContext(req);if(!ctx)return res.status(403).json({error:'Course access required.'});
 ctx.user.progress ||= {};const p=ctx.user.progress[ctx.course.id] ||= {};p.lastLessonId=ctx.lesson.id;p.lastVisitedAt=new Date().toISOString();
 // Direct course links also create a genuine enrolment, only after access is checked.
 ctx.user.enrolledCourseIds=[...new Set([...(ctx.user.enrolledCourseIds || []),ctx.course.id])];
 write(ctx.users);res.json({saved:true});
});
learnerRouter.post('/enroll/:courseId', (req, res) => {
  const users = read(); const user = users.find(u => u.id === learner(req).id);
  const course = loadDb().courses.find(c => c.id === req.params.courseId && ['Published', 'Uploaded'].includes(c.status));
  if (!course) return res.status(404).json({ error: 'Course is no longer available.' });
  if (!canReadCourse(course, user)) return res.status(403).json({ error: 'An active academy subscription is required. Online subscriptions are coming soon.', code: 'SUBSCRIPTION_REQUIRED' });
  const alreadyEnrolled = (user.enrolledCourseIds || []).includes(course.id);
  user.enrolledCourseIds = [...new Set([...(user.enrolledCourseIds || []), course.id])];
  write(users);
  if (!alreadyEnrolled) {
    safeQueueAcademyEvent({
      type: 'course.enrolled',
      occurredAt: new Date().toISOString(),
      organizationRef: user.id,
      subjectId: user.id,
      payload: { courseId: course.id, courseTitle: course.title }
    });
  }
  res.json({ user: publicUser(user) });
});
learnerRouter.get('/progress/:courseId', (req, res) => { res.json(learner(req).progress?.[req.params.courseId] || {}); });
learnerRouter.post('/lessons/:lessonId/complete', (req, res) => {
  const users = read(); const user = users.find(u => u.id === learner(req).id);
  const db = loadDb();
  const lesson = db.lessons.find((row: any) => row.id === req.params.lessonId);
  const course = lesson && db.courses.find((row: any) => row.id === lesson.courseId && ['Published', 'Uploaded'].includes(row.status));
  if (!lesson || !course || !canReadCourse(course, user)) return res.status(403).json({ error: 'Course access required.' });
  const quiz = db.quizzes.find((row: any) => row.lessonId === lesson.id && Array.isArray(row.questions) && row.questions.length > 0);
  user.progress ||= {};
  const progress = user.progress[course.id] ||= { completedLessons: {}, assignmentSubmissions: {}, quizPasses: {} };
  if (quiz && !progress.quizPasses?.[lesson.id]?.passed) {
    return res.status(409).json({ error: 'Pass this lesson quiz before marking the lesson complete.', code: 'QUIZ_REQUIRED' });
  }
  progress.completedLessons ||= {};
  progress.completedLessons[lesson.id] = true;
  progress.updatedAt = new Date().toISOString();
  write(users);
  res.json(progress);
});
learnerRouter.post('/assignments/:assignmentId/submit', (req, res) => {
  const users = read(); const user = users.find(u => u.id === learner(req).id);
  const db = loadDb();
  const assignment = db.assignments.find((row: any) => row.id === req.params.assignmentId);
  const course = assignment && db.courses.find((row: any) => row.id === assignment.courseId && ['Published', 'Uploaded'].includes(row.status));
  if (!assignment || !course || !canReadCourse(course, user)) return res.status(403).json({ error: 'Course access required.' });
  const text = String(req.body?.text || '').trim();
  if (!text || text.length > 12000) return res.status(400).json({ error: 'Enter an assignment response of 1–12,000 characters.' });
  user.progress ||= {};
  const progress = user.progress[course.id] ||= { completedLessons: {}, assignmentSubmissions: {}, quizPasses: {} };
  progress.assignmentSubmissions ||= {};
  progress.assignmentSubmissions[assignment.id] = {
    text,
    fileSubmitted: false,
    submittedAt: new Date().toISOString(),
    status: 'submitted'
  };
  progress.updatedAt = new Date().toISOString();
  write(users);
  res.json({ submission: progress.assignmentSubmissions[assignment.id], progress });
});
learnerRouter.put('/progress/:courseId', (req, res) => {
  const users = read(); const user = users.find(u => u.id === learner(req).id);
  const db = loadDb(); const course = db.courses.find(c => c.id === req.params.courseId && ['Published', 'Uploaded'].includes(c.status));
  if (!course || !canReadCourse(course, user)) return res.status(403).json({ error: 'Course access required.' });
  user.progress ||= {};
  const current = user.progress[course.id] || { completedLessons: {}, assignmentSubmissions: {}, quizPasses: {} };
  user.progress[course.id] = {
    ...current,
    programmeState: {
      ...(req.body.programmeState || current.programmeState || {}),
      examAttempts: current.programmeState?.examAttempts || [],
      certificateId: current.programmeState?.certificateId
    },
    completedLessons: current.completedLessons || {},
    assignmentSubmissions: current.assignmentSubmissions || {},
    quizPasses: current.quizPasses || {},
    updatedAt: new Date().toISOString()
  };
  write(users); res.json(user.progress[course.id]);
});
learnerRouter.post('/exam/:courseId', (req, res) => {
  const users = read(); const user = users.find(u => u.id === learner(req).id);
  const db = loadDb(); const course = db.courses.find(c => c.id === req.params.courseId && ['Published', 'Uploaded'].includes(c.status));
  if (!course?.programme || !canReadCourse(course, user)) return res.status(403).json({ error: 'Course access required.' });
  const progress = user.progress?.[course.id] || {};
  const lessons = db.lessons.filter(l => l.courseId === course.id);
  const assignments = db.assignments.filter((a: any) => a.courseId === course.id && a.required !== false);
  if (!lessons.length || lessons.some(l => !progress.completedLessons?.[l.id]) || assignments.some(a => !progress.assignmentSubmissions?.[a.id]?.text?.trim())) return res.status(409).json({ error: 'Complete all lessons and required assignments, and allow progress to save, before submitting the exam.' });
  const answers = req.body.answers || {};
  if (course.programme.finalExam.questions.some((q: any) => !q.options.includes(answers[q.id]))) return res.status(400).json({ error: 'Answer every exam question.' });
  const attempt = scoreFinalExam(course.programme, answers);
  progress.programmeState ||= {};
  progress.programmeState.examAttempts = [...(progress.programmeState.examAttempts || []).slice(-99), attempt];
  if (attempt.passed && !progress.programmeState.certificateId) progress.programmeState.certificateId = `V79-${crypto.randomUUID()}`;
  write(users); res.json({ attempt, certificateId: progress.programmeState.certificateId });
});
learnerRouter.post('/certificate/:courseId', (req, res) => {
  const users = read(); const user = users.find(u => u.id === learner(req).id);
  const db = loadDb(); const course = db.courses.find(c => c.id === req.params.courseId && ['Published', 'Uploaded'].includes(c.status));
  if (!course || !canReadCourse(course, user)) return res.status(403).json({ error: 'Course access required.' });
  const progress = user.progress?.[course.id] || {};
  const lessons = db.lessons.filter(l => l.courseId === course.id);
  const assignments = db.assignments.filter((a: any) => a.courseId === course.id && a.required !== false);
  const juniorComplete = course.id !== 'course-junior-ai-academy-01' || juniorTeamWorkComplete(user.id, course.id);
  if (!lessons.length || lessons.some(l => !progress.completedLessons?.[l.id]) || assignments.some(a => !progress.assignmentSubmissions?.[a.id]?.text?.trim()) || (course.programme && !(progress.programmeState?.examAttempts || []).some((a: any) => a.passed)) || !juniorComplete) return res.status(409).json({ error: course.id === 'course-junior-ai-academy-01' ? 'Complete all lessons, earn approval on all 16 Weekly Studio Check-Ins, and save your individual reflections before requesting a certificate.' : 'Complete the required lessons, assignments and assessment before requesting a certificate.' });
  const certificateAlreadyIssued = Boolean(progress.certificate?.id);
  const certificateId = progress.certificate?.id || progress.programmeState?.certificateId || `V79-${crypto.randomUUID()}`;
  const issuedAt = progress.certificate?.issuedAt || new Date().toISOString();
  const registered = issueCertificate({
    id: certificateId,
    learnerId: user.id,
    learnerName: user.name,
    courseId: course.id,
    courseTitle: course.title,
    issuedAt
  });
  progress.certificate ||= { id: registered.id, name: registered.learnerName, issuedAt: registered.issuedAt, courseTitle: registered.courseTitle };
  write(users);
  if (!certificateAlreadyIssued) {
    safeQueueAcademyEvent({
      type: 'certificate.issued',
      occurredAt: progress.certificate.issuedAt,
      organizationRef: user.id,
      subjectId: user.id,
      correlationId: progress.certificate.id,
      payload: { courseId: course.id, courseTitle: course.title, certificateId: progress.certificate.id }
    });
  }
  res.json(progress.certificate);
});
export function recordLearnerQuizPass(req: express.Request, lessonId: string, score: number, passingScore: number) {
  const currentUser = learner(req);
  if (!currentUser) return false;
  const users = read(); const user = users.find(u => u.id === currentUser.id);
  const db = loadDb(); const lesson = db.lessons.find((row: any) => row.id === lessonId);
  const course = lesson && db.courses.find((row: any) => row.id === lesson.courseId && ['Published', 'Uploaded'].includes(row.status));
  if (!user || !lesson || !course || !canReadCourse(course, user)) return false;
  user.progress ||= {};
  const progress = user.progress[course.id] ||= { completedLessons: {}, assignmentSubmissions: {}, quizPasses: {} };
  progress.quizAttempts ||= [];
  progress.quizAttempts = [...progress.quizAttempts.slice(-199), {lessonId,score,passingScore,passed:score>=passingScore,at:new Date().toISOString()}];
  progress.updatedAt = new Date().toISOString();
  if(score < passingScore) { write(users); return false; }
  progress.quizPasses ||= {};
  progress.completedLessons ||= {};
  progress.quizPasses[lesson.id] = { passed: true, score, passedAt: new Date().toISOString() };
  progress.completedLessons[lesson.id] = true;
  progress.updatedAt = new Date().toISOString();
  write(users);
  return true;
}

learnerRouter.post('/checkout', async (req, res) => {
  const current = learner(req);
  const users = read();
  const user = users.find(u => u.id === current.id);
  const courseId = String(req.body?.courseId || '').trim();
  const course = loadDb().courses.find((c: any) => c.id === courseId && ['Published', 'Uploaded'].includes(c.status));
  if (!user || !course) return res.status(404).json({ error: 'Course is no longer available.' });
  if (!requiresSubscription(course)) return res.status(400).json({ error: 'This course does not require payment.' });
  if (canReadCourse(course, user)) return res.json({ alreadyHasAccess: true, user: publicUser(user) });
  if (course.pricingType !== 'premium') {
    return res.status(409).json({ code: 'RECURRING_BILLING_NOT_ENABLED', error: 'Recurring Academy subscriptions are not enabled yet. No payment has been taken.' });
  }
  const amount = Number(course.price);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    return res.status(409).json({ code: 'COURSE_PRICE_NOT_CONFIGURED', error: 'This paid course does not have a valid checkout price.' });
  }
  try {
    const result = await createAcademyCourseOrder({
      learnerId: user.id,
      courseId: course.id,
      courseTitle: course.title,
      amount,
      returnPath: `/course/${encodeURIComponent(course.id)}`,
    });
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(error?.status || 503).json({ code: 'BILLING_UNAVAILABLE', error: error?.message || 'V79 Billing is unavailable. No payment has been taken.' });
  }
});

learnerRouter.post('/checkout/confirm', async (req, res) => {
  const current = learner(req);
  const orderId = String(req.body?.orderId || '').trim();
  if (!/^v79_[A-Za-z0-9_]+$/.test(orderId) || orderId.length > 64) return res.status(400).json({ error: 'Invalid billing order.' });
  try {
    const result = await getAcademyOrderStatus(orderId);
    const order = result?.order;
    if (!order || order.sourceApp !== 'academy' || order.kind !== 'course' || order.subjectReference !== current.id) {
      return res.status(403).json({ error: 'This payment order does not belong to the signed-in learner.' });
    }
    if (order.status !== 'paid') return res.status(409).json({ code: 'PAYMENT_NOT_VERIFIED', error: 'The payment has not been verified by V79 Billing.' });
    if (order.providerEnvironment !== 'live') {
      return res.status(409).json({
        code: 'SANDBOX_PAYMENT_VERIFIED',
        error: 'WiPay sandbox payment verified successfully. Test payments do not unlock paid courses.'
      });
    }

    const users = read();
    const user = users.find(u => u.id === current.id);
    const course = loadDb().courses.find((c: any) => c.id === order.externalReference && ['Published', 'Uploaded'].includes(c.status));
    if (!user || !course) return res.status(404).json({ error: 'The purchased course is no longer available.' });

    user.enrolledCourseIds = [...new Set([...(user.enrolledCourseIds || []), course.id])];
    user.coursePurchases ||= [];
    if (!user.coursePurchases.some((purchase: any) => purchase.orderId === order.id)) {
      user.coursePurchases.push({
        orderId: order.id,
        courseId: course.id,
        amount: order.amount,
        currency: order.currency,
        provider: 'wipay',
        providerEnvironment: order.providerEnvironment,
        providerTransactionId: order.providerTransactionId || null,
        paidAt: order.paidAt || new Date().toISOString(),
      });
      safeQueueAcademyEvent({
        type: 'course.purchased',
        occurredAt: order.paidAt || new Date().toISOString(),
        organizationRef: user.id,
        subjectId: user.id,
        correlationId: order.id,
        payload: { courseId: course.id, courseTitle: course.title, amount: order.amount, currency: order.currency }
      });
    }
    write(users);
    return res.json({ success: true, courseId: course.id, user: publicUser(user), order: { id: order.id, amount: order.amount, currency: order.currency, paidAt: order.paidAt } });
  } catch (error: any) {
    return res.status(error?.status || 503).json({ code: 'BILLING_UNAVAILABLE', error: error?.message || 'Could not verify the V79 Billing order.' });
  }
});
export const learnerAdminRouter = express.Router();
learnerAdminRouter.get('/insights', (_req,res) => {
 const users=read();const db=loadDb();
 res.json({generatedAt:new Date().toISOString(),measurement:'Saved learner records; historical attempts before this release were not recorded. Inactivity is not proof of drop-out.',courses:db.courses.map((c:any)=>{
 const lessons=db.lessons.filter((l:any)=>l.courseId===c.id);const enrolled=users.filter(u=>(u.enrolledCourseIds||[]).includes(c.id));
 const attempts=enrolled.flatMap(u=>u.progress?.[c.id]?.quizAttempts||[]);
 return {id:c.id,title:c.title,enrolled:enrolled.length,completedLessons:enrolled.reduce((n,u)=>n+lessons.filter((l:any)=>u.progress?.[c.id]?.completedLessons?.[l.id]).length,0),courseCompletions:enrolled.filter(u=>lessons.length>0&&lessons.every((l:any)=>u.progress?.[c.id]?.completedLessons?.[l.id])&&db.assignments.filter((a:any)=>a.courseId===c.id&&a.required!==false).every((a:any)=>u.progress?.[c.id]?.assignmentSubmissions?.[a.id]?.text?.trim())&&(!c.programme||(u.progress?.[c.id]?.programmeState?.examAttempts||[]).some((a:any)=>a.passed))).length,certificates:enrolled.filter(u=>u.progress?.[c.id]?.certificate?.id).length,quizAttempts:attempts.length,quizPasses:attempts.filter((a:any)=>a.passed).length,inactive14Days:enrolled.filter(u=>{const p=u.progress?.[c.id];const date=p?.lastVisitedAt||p?.updatedAt;return date && Date.parse(date)<Date.now()-14*86400000 && !p?.certificate?.id;}).length};
 })});
});
learnerAdminRouter.get('/', (_req, res) => res.json(read().map(publicUser)));
learnerAdminRouter.put('/:id/membership', (req, res) => {
  const users = read(); const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Learner not found.' });
  const active = req.body.status === 'active';
  if (active && !(Date.parse(req.body.expiresAt) > Date.now())) return res.status(400).json({ error: 'Select a future expiry date.' });
  user.membershipStatus = active ? 'active' : 'inactive'; user.membershipExpiresAt = active ? new Date(req.body.expiresAt).toISOString() : null;
  user.membershipSource = 'admin'; user.membershipUpdatedAt = new Date().toISOString(); write(users); res.json(publicUser(user));
});
learnerAdminRouter.post('/:id/reset-password', (req, res) => {
  const password = String(req.body.password || '');
  if (password.length < 12 || password.length > 256) return res.status(400).json({ error: 'Use 12–256 characters.' });
  const users = read(); const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Learner not found.' });
  user.salt = crypto.randomBytes(16).toString('hex'); user.hash = digest(password, user.salt); write(users);
  revokeLearnerSessionsForUser(user.id);
  res.json({ success: true });
});
