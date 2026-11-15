import React, { useEffect, useState } from 'react';
import { GraduationCap, Search, ArrowRight, BookOpen, Award, Clock, X, LogOut, RefreshCw } from 'lucide-react';
import { Course } from '../types';
import { requiresSubscription } from '../lib/academyAccess';
import { LearningDashboard } from './LearningDashboard';

type Learner = { id: string; name: string; email: string; membershipStatus: string; enrolledCourseIds: string[] };
export function AcademyLandingPage({ initialCourseSlug }: { initialCourseSlug?: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<Learner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [access, setAccess] = useState('All');
  const [tab, setTab] = useState('catalog');
  const [topic, setTopic] = useState('All');
  const [detail, setDetail] = useState<Course | null>(null);
  const [outline, setOutline] = useState<any[]>([]);
  const [auth, setAuth] = useState<'' | 'login' | 'register'>('');
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pending, setPending] = useState<Course | null>(null);
  const refresh = async () => {
    try {
      const [catalog, session] = await Promise.all([fetch('/api/public/courses'), fetch('/api/learner/session')]);
      if (!catalog.ok || !session.ok) throw new Error('Unable to load the academy. Please try again.');
      const list = await catalog.json(); const account = await session.json();
      setCourses([...list].sort((a:Course,b:Course)=>Number(Boolean(b.selfPaced))-Number(Boolean(a.selfPaced)))); setUser(account.user); setError('');
      setDetail(current => current ? list.find((c: Course) => c.id === current.id) || null : null);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => {
    refresh(); const timer = setInterval(refresh, 30000); window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  useEffect(() => {
    if(!auth)return;
    const previous=document.activeElement as HTMLElement|null;
    const dialog=document.querySelector<HTMLElement>('[role="dialog"]');
    const focusable=()=>Array.from(dialog?.querySelectorAll<HTMLElement>('button,input,a[href],select,textarea')||[]).filter(e=>!(e as HTMLButtonElement).disabled);
    const timer=setTimeout(()=>focusable().find(e=>e.tagName==='INPUT')?.focus(),0);
    const trap=(e:KeyboardEvent)=>{if(e.key!=='Tab')return;const items=focusable();const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};
    dialog?.addEventListener('keydown',trap);return()=>{clearTimeout(timer);dialog?.removeEventListener('keydown',trap);previous?.focus();};
  },[auth]);
  useEffect(() => {
    if (initialCourseSlug) setDetail(courses.find(c => c.id === initialCourseSlug || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === initialCourseSlug) || null);
  }, [initialCourseSlug, loading]);
  useEffect(() => {
    setOutline([]); if (!detail) return;
    const controller = new AbortController();
    fetch(`/api/public/courses/${detail.id}/modules`, { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('Unable to load curriculum.'); return r.json(); }).then(setOutline).catch(e => { if (e.name !== 'AbortError') setError(e.message); });
    return () => controller.abort();
  }, [detail?.id]);
  const start = async (course: Course, account = user) => {
    if (!account) { setPending(course); setAuth('register'); setAuthError(''); return; }
    if (requiresSubscription(course) && account.membershipStatus !== 'active') { window.location.href = `/course/${course.id}`; return; }
    setBusy(true);
    try {
      const r = await fetch(`/api/learner/enroll/${course.id}`, { method: 'POST' }); const data = await r.json();
      if (!r.ok) throw new Error(data.error); window.location.href = `/course/${course.id}`;
    } catch (e: any) { setError(e.message); } finally { setBusy(false); }
  };
  const authenticate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setAuthError(''); const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const r = await fetch(`/api/learner/${auth}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }); const data = await r.json();
      if (!r.ok) throw new Error(data.error); setUser(data.user); setAuth('');
      if (pending) { await start(pending, data.user); setPending(null); }
    } catch (e: any) { setAuthError(e.message); } finally { setBusy(false); }
  };
  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const filtered = courses.filter(c => (tab !== 'learning' || user?.enrolledCourseIds.includes(c.id)) &&
    (topic === 'All' || c.topic === topic || (topic === 'Other programmes' && !c.topic)) && (category === 'All' || c.category === category) && (level === 'All' || c.difficultyLevel === level) &&
    (access === 'All' || (access === 'Free' ? !requiresSubscription(c) : requiresSubscription(c))) &&
    `${c.title} ${c.shortDescription} ${c.category} ${c.topic || ""}`.toLowerCase().includes(query.toLowerCase()));
  const label = (c: Course) => requiresSubscription(c) ? 'Academy subscription' : 'Free course';
  return <div className="v79-academy-public academy-shell min-h-screen bg-[#f7f8f6] text-slate-900">
    <a href="#course-catalog" className="sr-only focus:not-sr-only">Skip to courses</a>
    <header className="sticky top-0 z-30 border-b border-[#17324d] bg-[#07111f]/95 backdrop-blur-xl px-5 sm:px-10 text-white">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 py-4">
        <a href="/" className="flex items-center gap-3 font-black text-lg"><img src="/brand/icon-transparent-256.png" alt="" width={40} height={40} className="h-10 w-10 object-contain"/>V79 Digital Academy</a>
        <nav aria-label="Academy navigation" className="flex items-center gap-2 text-sm font-semibold">
          <a href="https://hub.v79sl.com/" className="academy-tab">Back to Hub</a>
          <button className={tab === 'catalog' ? 'academy-tab active' : 'academy-tab'} onClick={() => { setTab('catalog'); setDetail(null); }}>Explore</button>
          {user && <button className={tab === 'learning' ? 'academy-tab active' : 'academy-tab'} onClick={() => { setTab('learning'); setDetail(null); }}>My learning</button>}
          {user ? <button className="academy-tab" aria-label="Sign out" onClick={async () => { await fetch('/api/learner/logout', { method: 'POST' }); setUser(null); setTab('catalog'); }}><LogOut size={18}/></button> : <button className="academy-primary" onClick={() => { setAuth('login'); setAuthError(''); }}>Sign in</button>}
        </nav>
      </div>
    </header>
    {!detail && <section className="academy-study-hero">
      <div className="academy-hero-copy"><h1>{tab === 'learning' ? `Keep growing, ${user?.name.split(' ')[0]}.` : <>Understand it.<br/>Practise it.<br/><span>Make it useful.</span></>}</h1><p>Practical AI and networking skills for Caribbean businesses and curious minds. Read the full explanation, try the activity, check your understanding and build something you can use.</p><a href="#course-catalog" className="academy-primary">{tab === 'learning' ? 'Continue learning' : 'Explore the courses'}<ArrowRight size={18}/></a><p className="hero-note">Adult foundation courses include independent practice and model solutions. Junior programmes retain their own support requirements.</p></div>
      <div className="academy-hero-visual"><img src="/study/learning-path.svg" width={650} height={510} alt="Learning path from understanding a concept through guided practice and checking to independent application"/><div className="hero-visual-caption"><BookOpen size={20}/><span>Learn at your own pace.<br/><strong>Evidence of progress, one lesson at a time.</strong></span></div></div>
    </section>}
    <main id="course-catalog" className="max-w-7xl mx-auto px-5 sm:px-10 py-10 scroll-mt-24">
      {tab === 'learning' && user && !detail && <LearningDashboard courses={courses}/>}
      {error && <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-800 flex justify-between gap-4">{error}<button onClick={refresh}>Retry</button></div>}
      {detail ? <div className="space-y-8">
        <button onClick={() => setDetail(null)} className="text-indigo-700 font-semibold">← Back to courses</button>
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
          <div><p className="text-indigo-700 font-semibold text-sm">{detail.category} · {detail.difficultyLevel}</p><h1 className="text-3xl sm:text-5xl font-bold tracking-tight mt-4">{detail.title}</h1><p className="text-slate-600 leading-relaxed mt-6 whitespace-pre-line">{detail.fullDescription || detail.shortDescription}</p>
            <h2 className="text-xl font-bold mt-8 mb-4">What you’ll learn</h2><ul className="space-y-3 list-disc pl-5 text-slate-700">{(detail.learningObjectives || []).map((goal, i) => <li key={i}>{goal}</li>)}</ul>
            {!!detail.prerequisites?.length && <><h2 className="text-xl font-bold mt-8 mb-3">Before you begin</h2><ul className="list-disc pl-5 space-y-2">{detail.prerequisites.map((v,i) => <li key={i}>{v}</li>)}</ul></>}
            <h2 className="text-xl font-bold mt-8 mb-4">Course outline</h2><ol className="divide-y border rounded-2xl bg-white px-5">{outline.map((m,i) => <li key={m.id} className="py-5"><span className="text-indigo-600 font-bold mr-3">{String(i+1).padStart(2,'0')}</span><strong>{m.title}</strong><p className="text-slate-500 text-sm mt-2">{m.description}</p></li>)}</ol>
          </div>
          <aside className="bg-white border rounded-3xl p-6 h-fit lg:sticky lg:top-28"><img src={detail.thumbnail} alt="" className="w-full h-48 object-cover rounded-2xl bg-slate-100"/><p className="text-xl font-bold mt-6">{label(detail)}</p><p className="text-slate-500 mt-2">{detail.estimatedDuration} · {detail.lessonCount || 0} lessons</p><p className="text-sm text-slate-500 mt-2">With {detail.instructor}</p>
            {requiresSubscription(detail) && user?.membershipStatus !== 'active' && <p className="text-sm rounded-xl p-3 bg-amber-50 text-amber-900 mt-5">Membership access is available to active members. The proposed unlimited plan is US$35 / EC$94 monthly; automatic recurring checkout is not yet configured. Contact V79 through the Hub for membership arrangements.</p>}
            <button disabled={busy} onClick={() => start(detail)} className="academy-primary w-full mt-6">{requiresSubscription(detail) && user?.membershipStatus !== 'active' ? 'View access options' : user?.enrolledCourseIds.includes(detail.id) ? 'Continue learning' : 'Start learning'}</button>
          </aside>
        </div>
      </div> : <>
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6"><div><h2 className="text-3xl font-bold mt-2">{tab === 'learning' ? 'My courses' : 'Find your next advantage'}</h2></div><button onClick={refresh} aria-label="Refresh courses" className="p-3 rounded-xl border bg-white"><RefreshCw size={18}/></button></div>
        <div className="study-paths" aria-label="Learning paths">{['All','AI & business','Networking','Business','Other programmes'].map(t=><button key={t} aria-pressed={topic===t} onClick={()=>setTopic(t)}>{t==='All'?'All learning paths':t}</button>)}</div>
        <div className="flex flex-wrap gap-3 mb-8 bg-white p-4 border rounded-2xl">
          <label className="flex items-center gap-2 flex-1 min-w-52"><Search size={20} className="text-slate-400"/><input className="w-full p-2 outline-none" aria-label="Search courses" placeholder="Search skills, topics or courses" value={query} onChange={e => setQuery(e.target.value)}/></label>
          {[[category,setCategory,categories,'Application'],[level,setLevel,['All','Beginner','Intermediate','Advanced'],'Level'],[access,setAccess,['All','Free','Subscription'],'Access']].map(([value,setter,options,name]: any) => <select key={name} aria-label={name} value={value} onChange={e => setter(e.target.value)} className="border rounded-xl px-3 py-2 bg-slate-50">{options.map((o:string) => <option key={o} value={o}>{o === 'All' ? `All ${name.toLowerCase()}s` : o}</option>)}</select>)}
        </div>
        {loading ? <p role="status" className="py-16 text-center">Loading courses…</p> : filtered.length === 0 ? <div className="border border-dashed rounded-3xl p-12 text-center"><BookOpen className="mx-auto text-indigo-500 mb-4" size={36}/><h3 className="text-xl font-bold">{tab === 'learning' ? 'Your next chapter starts here' : 'No courses match your filters'}</h3><p className="text-slate-500 mt-3">{tab === 'learning' ? 'Explore a course and enrol to add it to your learning space.' : 'Try a different topic or clear the filters.'}</p><button className="academy-primary mt-6" onClick={() => { setQuery('');setTopic('All');setCategory('All');setLevel('All');setAccess('All');setTab('catalog'); }}>Explore all courses</button></div> : <>
          <p className="text-sm text-slate-500 mb-5">{filtered.length} course{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{filtered.map(c => <article key={c.id} className="academy-course-card bg-white border rounded-2xl overflow-hidden transition-all flex flex-col">
            <button onClick={() => setDetail(c)} className="text-left relative"><img src={c.thumbnail} alt="" loading="lazy" className="h-44 w-full object-cover bg-slate-200"/><span className="absolute left-4 top-4 px-3 py-1 rounded-full bg-white text-xs font-bold">{label(c)}</span></button>
            <div className="p-6 flex flex-col flex-1"><p className="text-xs font-bold text-indigo-700">{c.topic || c.category} · {c.difficultyLevel} {c.selfPaced ? "· Self-paced" : ""}</p><h3 className="mt-3 text-xl font-bold leading-snug"><button className="text-left hover:text-indigo-700" onClick={() => setDetail(c)}>{c.title}</button></h3><p className="text-sm text-slate-500 leading-relaxed mt-3 line-clamp-3">{c.shortDescription}</p><p className="text-xs text-slate-500 mt-5">{c.estimatedDuration} · {c.lessonCount || 0} lessons</p>{c.lastReviewedAt && <p className="text-xs text-slate-600 mt-2">Source-checked {c.lastReviewedAt} · v{c.courseVersion}</p>}<div className="flex justify-between gap-3 mt-auto pt-6"><button className="font-semibold text-sm text-slate-600" onClick={() => setDetail(c)}>View details</button><button disabled={busy} className="font-bold text-sm text-indigo-700 inline-flex items-center gap-2" onClick={() => start(c)}>{user?.enrolledCourseIds.includes(c.id) ? 'Continue' : requiresSubscription(c) ? 'View access' : 'Start free'}<ArrowRight size={16}/></button></div></div>
          </article>)}</div>
        </>}
      </>}
    </main>
    <footer className="border-t px-6 py-8 mt-12 text-sm text-slate-500 flex flex-wrap justify-between gap-4"><span>© {new Date().getFullYear()} V79 Digital Academy - From Idea to Advantage</span><a href="https://hub.v79sl.com/">V79 Hub</a></footer>
    {auth && <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-5" onKeyDown={e => { if (e.key === 'Escape') setAuth(''); }}><section role="dialog" aria-modal="true" aria-labelledby="auth-heading" className="bg-white rounded-3xl w-full max-w-md p-8 relative"><button aria-label="Close sign in" className="absolute top-4 right-4 p-2" onClick={() => setAuth('')}><X size={20}/></button><GraduationCap className="text-indigo-600 mb-5" size={36}/><h2 id="auth-heading" className="text-2xl font-bold">{auth === 'login' ? 'Welcome back' : 'Start your learning journey'}</h2><p className="text-sm text-slate-500 mt-2 mb-6">Save your progress and keep your courses together.</p>{authError && <p role="alert" className="bg-rose-50 text-rose-800 p-3 rounded-xl mb-4">{authError}</p>}<form onSubmit={authenticate} className="space-y-4">{auth === 'register' && <label className="block text-sm font-semibold">Full name<input name="name" required autoComplete="name" className="academy-input"/></label>}<label className="block text-sm font-semibold">Email<input name="email" type="email" required autoFocus autoComplete="email" className="academy-input"/></label><label className="block text-sm font-semibold">Password<input name="password" type="password" required minLength={12} maxLength={256} autoComplete={auth === 'login' ? 'current-password' : 'new-password'} className="academy-input"/><span className="text-xs text-slate-500 font-normal">At least 12 characters</span></label><button disabled={busy} className="academy-primary w-full">{busy ? 'Please wait…' : auth === 'login' ? 'Sign in' : 'Create account'}</button></form><button className="text-indigo-700 text-sm font-semibold mt-6" onClick={() => { setAuth(auth === 'login' ? 'register' : 'login'); setAuthError(''); }}>{auth === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}</button><p className="mt-4 text-xs text-slate-500">Forgot your password? Contact your academy administrator for a reset.</p></section></div>}
  </div>;
}
