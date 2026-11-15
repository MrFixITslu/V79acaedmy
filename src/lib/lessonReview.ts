export function reviewErrors(lesson:any):string[]{
 const r=lesson.review;const errors:string[]=[];
 if(!Array.isArray(lesson.learningObjectives)||!lesson.learningObjectives.length)errors.push('Learning objectives are required.');
 if(!r || r.status!=='source-checked')errors.push('A source check must be recorded after the last lesson edit.');
 if(!r?.version || !r?.lastReviewedAt || !Number.isFinite(Date.parse(r.lastReviewedAt)) || Date.parse(r.lastReviewedAt)>Date.now()+86400000)errors.push('A valid review date and version are required.');
 if(!Array.isArray(r?.prerequisites)||!r.prerequisites.length||r.prerequisites.length>20||r.prerequisites.some((s:any)=>typeof s!=='string'||!s.trim()||s.length>1000))errors.push('Record prerequisites, including none if appropriate.');
 if(!Array.isArray(r?.sources)||!r.sources.length||r.sources.length>15||r.sources.some((s:any)=>{try{return typeof s.title!=='string'||!s.title.trim()||s.title.length>300||typeof s.url!=='string'||s.url.length>2048||new URL(s.url).protocol!=='https:';}catch{return true;}}))errors.push('Provide 1–15 titled HTTPS source links.');
 return errors;
}

export function invalidateLessonReview(db:any,lesson:any){
 if(!lesson?.review)return;
 lesson.review={...lesson.review,status:'review-required'};
 const course=db.courses.find((c:any)=>c.id===lesson.courseId&&c.reviewPolicy==='source-checked-v1');
 if(course&&['Published','Uploaded'].includes(course.status))course.status='Review';
}
