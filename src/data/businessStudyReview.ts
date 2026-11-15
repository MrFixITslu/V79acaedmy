import {createHash} from 'node:crypto';
import baseline from './businessStudyBaseline.json';
import {businessLessonRevisionInputs,IDEA_TO_ADVANTAGE_COURSE_ID as courseId} from './ideaToAdvantageCourse';
import {IDEA_TO_ADVANTAGE_MASTERY} from './ideaToAdvantageMastery';
import {BUSINESS_CHECKS,BUSINESS_PRACTICE,BUSINESS_SOURCES} from './businessStudyContent';
import {BUSINESS_VISUALS} from './businessVisuals';

const marker='ita-source-reviewed-self-study-v2-1-20261115';
export const businessTeachingHash=(lesson:any)=>createHash('sha256').update(JSON.stringify(baseline.keys.map(k=>[k,lesson[k]??null]))).digest('hex');
const version='2.1.0',reviewedAt='2026-11-15';
function correctPrinciple(s:string){
 if(s.startsWith('A weighted overall score prevents'))return 'A weighted overall score can still hide a weak category. Inspect the category results and the evidence behind each answer, not only the total.';
 if(s.startsWith('Course assignments increase assessment confidence'))return 'The workbook coverage indicator counts sections marked complete after the starting diagnostic. It does not measure statistical confidence, independently verify the work or certify business readiness.';
 if(s.startsWith('Markup is profit divided'))return 'Using a stated cost basis, markup is (selling price − cost) ÷ cost; margin is (selling price − cost) ÷ selling price. A 25% markup on EC$80 gives a price of EC$100 and a 20% gross margin on that cost basis. This is not net profit after every business cost.';
 if(s.startsWith('Service businesses must include direct labour'))return 'Model job-specific labour, travel, materials and fees explicitly. A direct cost is traceable to a job; a variable cost changes with volume. A fixed salary can be direct without being variable within the modelled range. Do not double-count labour in fixed and variable costs, and include owner time when testing capacity and sustainable pricing.';
 if(s.startsWith('Source documents support'))return 'Source documents support transactions, bookkeeping classifies them, and reconciliation compares records with independent balances and explains differences. Agreement alone does not prove that every transaction is genuine or classified correctly.';
 if(s.startsWith('Reconciliation is how the owner knows'))return 'Reconciliation compares records with independent balances and explains differences. Matching balances support control but do not establish that every transaction is genuine, complete or correctly classified.';
 if(s.startsWith('A proper accounting platform'))return 'Maintain an official ledger with supporting records and appropriate controls, using suitable software, paper records or qualified bookkeeping support as permitted locally. A general chatbot conversation is not a substitute for the official ledger.';
 if(s.startsWith('Receivables need clear terms'))return 'Manage receivables through clear terms, invoicing, reminders, dispute handling and escalation. Collection is a separate process from revenue recognition; use the applicable accounting policy rather than treating every invoice or sale as cash.';
 if(s.startsWith('ABC analysis applies'))return 'ABC analysis ranks inventory using a defined criterion, commonly a value or usage measure. State the criterion and review criticality separately: a low-cost part may still be essential. Use the result to inform controls rather than assuming every A item is automatically the most operationally critical.';
 if(s.startsWith('WhatsApp Business can'))return 'A direct-messaging channel can support customer conversations when the chosen service, permissions and workflow are suitable. Check current official capabilities and the applicable rules before enabling catalogues, bulk messages or automation.';
 if(s.startsWith('General assistants such as'))return 'General AI assistants may help draft, summarise, classify and transform information. Select a category by the task, data controls, verification method and required integrations; check the current official documentation for a particular product.';
 if(s.startsWith('Canva and Adobe Express'))return 'Design and video-editing tools may assist creative production. Check current features, rights to supplied and generated assets, export formats, accessibility and review requirements before selecting a product.';
 if(s.startsWith('HubSpot or Zoho'))return 'Choose a CRM for controlled customer records and follow-up, an appropriate campaign system for permission-based communication, an accounting ledger for official books, and an inventory/POS system for stock movements. A category name does not establish that a particular product supports local tax, currency, payment or integration requirements.';
 if(s.startsWith('Excel/Power BI'))return 'Spreadsheets and business-intelligence tools support structured calculations and reporting. Independently validate formulas, definitions and source quality. AI-generated analysis requires the same checks.';
 return s;
}

export function reviewedBusinessLesson(input:ReturnType<typeof businessLessonRevisionInputs>[number]){
 const {moduleNumber:n,lessonIndex:i}=input;
 const practice=BUSINESS_PRACTICE[n][i],check=BUSINESS_CHECKS[`${n}-${i+1}`]||input.check,mastery=IDEA_TO_ADVANTAGE_MASTERY[n];
 const visual=BUSINESS_VISUALS[n],url=`/idea-to-advantage/images/study-module-${n}.svg`;
 const method=i===0 ? mastery.mentalModel : i===1 ? mastery.buildSystem : mastery.controlLoop;
 const wrong=check.options.filter(option=>option!==check.correct);
 const feedback=check.options.map(option=>option===check.correct ? `${option}: correct. ${check.explanation}` : `${option}: incorrect. ${practice.wrong[wrong.indexOf(option)]}`);
 const prerequisites=['Basic numeracy; a calculator or spreadsheet and a private notebook. Use the fictional cases if you do not operate a business.',n===1&&i===0?'No previous business training required.':'Complete preceding lessons or check that you can explain their objectives.'];
 const principles=input.principles.map(correctPrinciple);
 const earlierWorkedExample=n===3
  ? 'Illustrative service case: a visit priced at EC$250 has EC$160 of specified per-visit variable costs, leaving EC$90 contribution. With EC$5,400 monthly fixed costs, break-even is 60 visits. At capacity of 24 visits, this model cannot cover the listed fixed costs. A different case with only EC$70 of variable costs would have EC$180 contribution; the cost assumptions must not be mixed.'
  : mastery.workedExample;
 const lines=[`# ${input.title}`,'',input.description,'','## Learn independently',
  'Read the explanation, work through the example, complete the practice in your notebook, answer the knowledge check, then reveal the model solution. You can use invented details throughout; no instructor, customer contact or purchase is required for these learning activities.',
  'The examples, amounts, targets and outcomes are illustrative teaching data. They are not V79 client results, market statistics or universal operating targets.',
  '','## Learning objectives',...input.objectives.map(s=>'- '+s),'','## Prerequisites',...prerequisites.map(s=>'- '+s),
  '','## Explain the concept',...principles.map(s=>'- '+s),'','## Worked business example',input.scenario,
  ...(i===0?['','## A second worked example',earlierWorkedExample]:[]),
  '','## See the relationship',visual.caption,'','## Apply the method',...method.map((s,j)=>`${j+1}. ${correctPrinciple(s)}`),
  ...(i===1?['','## Operating actions',...mastery.operatorMoves.map((s,j)=>`${j+1}. ${s}`)]:[]),
  '','## Guided practice',...input.actions.map((s,j)=>`${j+1}. ${s}`),
  '','## Red-team your answer',...mastery.redTeamQuestions.map((s,j)=>`${j+1}. ${s}`),
  '','## Independent practice case',practice.task,
  'Record the calculation or decision, assumptions, evidence you would need and a condition that would change your answer. Attempt this before revealing the model solution.',
  '','## Knowledge check',check.question,...check.options.map((s,j)=>`${String.fromCharCode(65+j)}. ${s}`),
  'Choose an answer and explain why. The model solution below explains the correct choice and each alternative. This practice check does not change the existing graded module assessment.',
  '','## Common mistake and troubleshooting',input.warning,
  n===3||n===4||n===5 ? 'If your calculation differs, check the time period, currency, units, cost classification and arithmetic. Keep an assumption explicit rather than filling a missing input with a guess.' : 'If you cannot complete the task, identify the missing input, owner, decision rule or evidence. Build the smallest fictional example first, then transfer the method to a real situation when authorised.',
  '','## Explain it back',`Explain this lesson’s decision in plain language, identify one assumption, and show how your practice answer supports or changes that decision. A copied model answer is not evidence that you can apply it.`,
  '','## Summary',...input.objectives.map(s=>'- '+s),
  '','## Sources and review boundaries',...BUSINESS_SOURCES[n].map(s=>`- ${s.title}: ${s.url}`),
  'These sources support the general concepts. Overseas legal, tax, employment or government-programme details are not adopted as Saint Lucia or Caribbean requirements. Check the appropriate local authority or qualified adviser before a real regulated decision. Product examples are categories to investigate, not endorsements or confirmed country availability.',
  'Course certificates recognise the defined completion requirements. They are not accredited qualifications, professional licences or independent verification of a business’s performance.'
 ];
 if(i===2)lines.push('','## Workbook and required assignment',`Complete Workbook Section ${n} and the existing required module assignment. Retain your assumptions, calculations and decision rules. The practice model answer helps you learn; it does not automatically complete the workbook or submit the assignment.`,
   '','## Evidence of mastery',...mastery.masteryEvidence.map(s=>'- [ ] '+s),'','## Transfer challenge',mastery.transferChallenge,'','## 30-day proof',mastery.thirtyDayProof,
   'A planned real-world experiment is different from a completed result. When using the fictional case, label the exercise as a simulation; never invent interviews, sales or outcomes.');
 if(n===12&&i===2)lines.push('','## Final independent benchmark',
  'Apply DEFINE → MODEL → TEST → CONTROL → MEASURE → IMPROVE: define the actual decision; model assumptions; test the weakest assumption; control execution with owners and limits; measure against a baseline; improve the plan from evidence.',
  'Use this new fictional case: a small service business is offered a regional contract while a supplier delay and a two-week payment delay threaten cash and delivery. Write an initial decision, a list of unknowns, a 90-day sequence and stop/change rules. Make any extra numbers explicit assumptions. Use the existing Business Operator Benchmark worksheet and Graduation Rubric to self-review; a completed worksheet does not establish verified professional competence.');
 return {lessonContent:lines.join('\n'),studySolution:`Model approach — illustrative, not the only defensible answer:\n${practice.answer}\n\nKnowledge-check feedback:\n${feedback.join('\n\n')}`,
  imageUrl:url,imageAlt:`${visual.title}. The full relationships and illustrative data are explained in the lesson text.`,
  ...(n===3?{studyVisual:'business-finance' as const}:{}),
  review:{status:'source-checked',version,lastReviewedAt:reviewedAt,prerequisites,sources:BUSINESS_SOURCES[n]}};
}

export function applyBusinessStudyReview(db:any):boolean{
 if(!Array.isArray(db.publishingLogs)||db.publishingLogs.some((x:any)=>x.id===marker))return false;
 const course=db.courses?.find((c:any)=>c.id===courseId);if(!course)return false;
 const inputs=businessLessonRevisionInputs(),changed:string[]=[],skipped:string[]=[];
 // Preserve the complete pre-change content using the existing version-history schema.
 const lessonIds=new Set(db.lessons.filter((l:any)=>l.courseId===courseId).map((l:any)=>l.id));
 const snapshot={course:structuredClone(course),modules:structuredClone(db.modules.filter((m:any)=>m.courseId===courseId)),lessons:structuredClone(db.lessons.filter((l:any)=>l.courseId===courseId)),
  contentBlocks:structuredClone((db.contentBlocks||[]).filter((r:any)=>lessonIds.has(r.lessonId))),quizzes:structuredClone(db.quizzes.filter((r:any)=>lessonIds.has(r.lessonId))),assignments:structuredClone(db.assignments.filter((r:any)=>r.courseId===courseId)),
  downloads:structuredClone((db.downloads||[]).filter((r:any)=>r.courseId===courseId)),assets:structuredClone((db.assets||[]).filter((r:any)=>r.courseId===courseId)),media:structuredClone((db.media||[]).filter((r:any)=>r.courseId===courseId))};
 for(const input of inputs){
  const lesson=db.lessons.find((l:any)=>l.id===input.id&&l.courseId===courseId);
  if(!lesson||businessTeachingHash(lesson)!==baseline.lessons[input.id as keyof typeof baseline.lessons]){skipped.push(input.id);continue;}
  const revised=reviewedBusinessLesson(input);const {imageUrl,imageAlt,...content}=revised;
  Object.assign(lesson,content,{imageUrls:[...(lesson.imageUrls||[]),imageUrl],imageAltTexts:{...(lesson.imageAltTexts||{}),[imageUrl]:imageAlt}});changed.push(input.id);
 }
 if(changed.length){
  db.courseVersions ||= [];
  if(!db.courseVersions.some((v:any)=>v.id==='ita-before-self-study-v2-1'))db.courseVersions.push({id:'ita-before-self-study-v2-1',courseId,versionNumber:course.courseVersion||'2.0.0',changelog:'Preserved complete content before source-reviewed self-study revision.',snapshot,exportedBy:'V79 curriculum maintenance',exportedAt:new Date().toISOString()});
  if(course.courseVersion==='2.0.0')course.courseVersion=version;
  // Only advertise whole-course independent review if every existing lesson is checked.
  const courseLessons=db.lessons.filter((l:any)=>l.courseId===courseId);
  if(courseLessons.length===36&&skipped.length===0){course.selfPaced=true;course.topic='Business';course.reviewPolicy='source-checked-v1';course.lastReviewedAt=reviewedAt;}
 }
 db.publishingLogs.push({id:marker,courseId,courseTitle:course.title,event:'Business self-study content review',fromStatus:snapshot.course.courseVersion,toStatus:course.courseVersion,performedBy:'V79 curriculum maintenance',timestamp:new Date().toISOString(),details:`Reviewed unchanged seed lessons: ${changed.join(', ')}. Preserved edited/missing lessons: ${skipped.join(', ')||'none'}. Accounts, progress, pricing, publication choices, assessment IDs and pass requirements are unchanged. Overseas references support general concepts, not local legal or regulatory advice.`});
 return true;
}
