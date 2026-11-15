import { aiLessons, networkingLessons, type StudyLesson } from './selfPacedCurriculum';
export const SELF_PACED_IDS = ['course-practical-ai-business-01', 'course-small-business-networking-01'];
export const REVIEW_DATE = '2026-11-15';
export const foundationCourses = [
  { id: SELF_PACED_IDS[0], title: 'Practical AI for Business: From First Prompt to Safe Workflow', topic: 'AI & business', description: 'Learn to choose AI tasks, write useful prompts, verify outputs and build a safe, repeatable business workflow. Complete an independent playbook using fictional Caribbean business cases.', duration: '4–6 hours including practice', prerequisites: ['Basic reading and computer skills', 'A browser and a place to keep notes; an AI account is optional for the clearly labelled manual track'], lessons: aiLessons, thumbnail: '/study/ai-course.svg' },
  { id: SELF_PACED_IDS[1], title: 'Small-Business Networking: Connect, Measure & Troubleshoot', topic: 'Networking', description: 'Understand how a small-business network works, calculate IPv4 subnets, plan Wi-Fi, interpret performance and diagnose faults. Build an address plan and evidence-based troubleshooting portfolio.', duration: '5–7 hours including practice', prerequisites: ['Basic computer skills', 'A browser; no purchased equipment or live network changes required'], lessons: networkingLessons, thumbnail: '/study/network-course.svg' }
];
export function lessonText(spec: StudyLesson) {
 return `## What you will learn\n${spec.objectives.map(s=>`- ${s}`).join('\n')}\n\n## Understand the concept\n${spec.concept}\n\n## Worked example — fictional business case\n${spec.example}\n\n## Practise independently\n${spec.practice.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n## Common mistakes and troubleshooting\n${spec.mistakes}\n\n## Remember\n${spec.recap}\n\n## Check your understanding\nComplete the interactive activity and the lesson assessment below. If you miss a question, read the explanation, revisit the relevant concept and try again. Record your own explanation before opening the model solution.`;
}
export function ensureSelfPacedCourses(db: any): boolean {
 let changed=false;
 for(const definition of foundationCourses) {
  const marker=`seed-${definition.id}-v1`;
  if(db.courses.some((c:any)=>c.id===definition.id) || db.publishingLogs.some((l:any)=>l.id===marker)) continue;
  const now=`${REVIEW_DATE}T00:00:00.000Z`;
  const course={id:definition.id,title:definition.title,shortDescription:definition.description,fullDescription:`${definition.description}\n\nA complete adult beginner foundation course. Study the explanations, use the browser simulations, complete each practice task, compare your work with model solutions and pass every lesson assessment. No instructor is required for this adult path. The final portfolio is self-assessed; submission is recorded, not independently graded. A completion certificate is not an accredited qualification. Time estimates include reading and practice and vary by learner.`,category:'General',topic:definition.topic,difficultyLevel:'Beginner',instructor:'V79 Academy',courseVersion:'1.0.0',thumbnail:definition.thumbnail,estimatedDuration:definition.duration,prerequisites:definition.prerequisites,learningObjectives:definition.lessons.flatMap(l=>l.objectives).filter((_,i)=>i%3===0),status:'Published',pricingType:'subscription',price:0,createdAt:now,updatedAt:now,selfPaced:true,reviewPolicy:'source-checked-v1',lastReviewedAt:REVIEW_DATE};
  db.courses.push(course);
  definition.lessons.forEach((spec,index)=>{
   const moduleId=`${definition.id}-module-${index+1}`;
   const lessonId=`${definition.id}-${spec.slug}`;
   db.modules.push({id:moduleId,courseId:definition.id,title:spec.title,description:spec.objectives.join(' · '),orderNumber:index+1});
   db.lessons.push({id:lessonId,moduleId,courseId:definition.id,title:spec.title,description:spec.objectives[0],learningObjectives:spec.objectives,estimatedTime:index===definition.lessons.length-1?'60–90 mins':'25–35 mins',lessonContent:lessonText(spec),orderNumber:1,studyVisual:spec.visual,studySolution:spec.solution,review:{status:'source-checked',version:'1.0.0',lastReviewedAt:REVIEW_DATE,prerequisites:index===0?definition.prerequisites:['Complete the preceding lessons or check that you can meet their objectives'],sources:spec.sources.map(url=>({url,title:sourceTitle(url)}))}});
   const quizId=`${lessonId}-quiz`;
   db.quizzes.push({id:quizId,lessonId,title:`${spec.title} — knowledge check`,passingScore:100,questions:spec.checks.map(([questionText,options,correctAnswer,explanation],i)=>({id:`${quizId}-${i+1}`,quizId,questionText,questionType:'multiple_choice',options,correctAnswer,explanation,orderNumber:i+1}))});
   if(index===definition.lessons.length-1) db.assignments.push({id:`${definition.id}-capstone`,courseId:definition.id,moduleId,lessonId,title:'Independent capstone evidence pack',description:`Submit your completed work, checking record, limitations and self-review against the model solution. Include the practical evidence requested in this lesson. Do not submit real personal data, passwords or private network details. Submission records your work; it is not instructor grading or accreditation.`,maxPoints:100,submissionType:'text',required:true,createdAt:now,updatedAt:now});
  });
  db.downloads.push({id:`${definition.id}-reference`,courseId:definition.id,name:'Course reference and independent-study workbook',fileType:'document',url:`/study/${definition.topic==='Networking'?'networking':'ai'}-workbook.html`,fileSize:'HTML — printable',createdAt:now});
  db.publishingLogs.push({id:marker,courseId:definition.id,courseTitle:definition.title,event:'Self-paced curriculum seeded',fromStatus:'None',toStatus:'Published',performedBy:'System Migration',timestamp:now,details:'Additive, original adult foundation curriculum with source-checked metadata; existing courses and deliberate deletions are preserved.'});
  changed=true;
 }
 return changed;
}
function sourceTitle(url:string) {
 if(url.includes('rfc')) return `IETF / RFC Editor — ${url.match(/rfc(\d+)/)?.[1] || 'network standard'}`;
 if(url.includes('nist.gov')) return url.includes('600-1')?'NIST — Generative AI Profile, AI 600-1':'NIST — AI Risk Management Framework';
 if(url.includes('w3.org')) return 'W3C WAI — accessible images';
 if(url.includes('cisa.gov')) return 'CISA — Secure Our World';
 if(url.includes('cisco.com')) return 'Cisco — networking documentation';
 return 'Cloudflare — networking concepts';
}
