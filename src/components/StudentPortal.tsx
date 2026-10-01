import { requiresSubscription } from '../lib/academyAccess';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Play,
  Award,
  CheckCircle2,
  FileText,
  Download,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Send,
  FileCode,
  ChevronRight,
  Printer,
  X,
  Compass,
  CheckSquare,
  HelpCircle,
  Volume2,
  Lock,
  Unlock,
  CreditCard,
  ShieldCheck,
  DollarSign,
  Info,
  Layers,
  Sparkle,
  BarChart3
} from 'lucide-react';
import { Course, Module, Lesson, Quiz } from '../types';
import { ContentBlock, Assignment, Download as DownloadType } from '../types/course-builder-v2';
import { ProgrammeStatus } from '../types/programme';
import { BusinessAdvantageProgramme } from './BusinessAdvantageProgramme';
import { JuniorTeamStudio } from './JuniorTeamStudio';
import { NetworkingLab } from './NetworkingLab';
import { buildProgrammeStatus, normalizeProgrammeState } from '../lib/programmeScoring';

interface StudentPortalProps {
  courseSlug: string;
}

export function StudentPortal({ courseSlug }: StudentPortalProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessonsMap, setLessonsMap] = useState<{ [moduleId: string]: Lesson[] }>({});
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [showProgrammeHub, setShowProgrammeHub] = useState<boolean>(false);
  const [programmeStatus, setProgrammeStatus] = useState<ProgrammeStatus | null>(null);
  
  // Custom public-only sub-collections
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  
  // Payment & Enrollment States
  const [isEnrolled, setIsEnrolled] = useState<boolean>(true);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const [learnerId, setLearnerId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState('');
  const [programmeRevision, setProgrammeRevision] = useState(0);
  useEffect(() => { const saved = () => setProgrammeRevision(v => v + 1); window.addEventListener('academy-programme-saved', saved); return () => window.removeEventListener('academy-programme-saved', saved); }, []);
  const progressLoaded = useRef(false);
  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allPublishedCourses, setAllPublishedCourses] = useState<Course[]>([]);
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  // Assignment states
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<{ [assignId: string]: { text: string; fileSubmitted: boolean; submittedAt: string } }>({});
  const [currentAssignmentText, setCurrentAssignmentText] = useState<string>('');
  
  // Progress states (persisted via LocalStorage)
  const [completedLessons, setCompletedLessons] = useState<{ [lesId: string]: boolean }>({});
  
  // Certificate states
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [issuedCertificateId, setIssuedCertificateId] = useState('');
  const [studentName, setStudentName] = useState<string>('');
  const [certDate, setCertDate] = useState<string>(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  // Scroll to active lesson ref
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Fetch all published courses to recommend or fallback
  const fetchAllPublished = async () => {
    try {
      const res = await fetch('/api/public/courses');
      if (res.ok) {
        const data = await res.json();
        setAllPublishedCourses(data || []);
      }
    } catch (e) {
      console.error('Error fetching catalog', e);
    }
  };

  useEffect(() => {
    fetchAllPublished();
    try {
      const savedStudent = JSON.parse(localStorage.getItem('v79_student_user') || 'null');
      if (savedStudent?.name) setStudentName(savedStudent.name);
    } catch {
      // Keep the editable fallback when no student profile exists.
    }
  }, []);

  useEffect(() => {
    if (programmeStatus?.finalExamPassedAt) {
      setCertDate(new Date(programmeStatus.finalExamPassedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
  }, [programmeStatus?.finalExamPassedAt]);

  const handleProgrammeStatusChange = useCallback((nextStatus: ProgrammeStatus) => {
    setProgrammeStatus(nextStatus);
  }, []);

  useEffect(() => {
    if (!course || !learnerId || loading || !progressLoaded.current || (requiresSubscription(course) && !isEnrolled)) return;
    const timer = setTimeout(async () => {
      try {
        const raw = localStorage.getItem(`v79_programme_state_${learnerId}_${course.id}`);
        const response = await fetch(`/api/learner/progress/${course.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completedLessons, assignmentSubmissions, programmeState: raw ? JSON.parse(raw) : undefined }) });
        if (!response.ok) throw new Error('Progress could not sync. Sign in again to save to your account.');
        setSyncMessage('Progress saved to your account');
      } catch (e: any) { setSyncMessage(e.message); }
    }, 700);
    return () => clearTimeout(timer);
  }, [course, learnerId, loading, completedLessons, assignmentSubmissions, programmeStatus, programmeRevision]);

  const isCoursePaid = (c: Course | null) => {
    if (!c) return false;
    return requiresSubscription(c);
  };

  const isLessonIntro = (_les: Lesson, _lesIdx: number, _modIdx: number) => false;

  const canAccessLesson = (les: Lesson, lesIdx: number, modIdx: number) => {
    if (!course) return true;
    if (!isCoursePaid(course)) return true; // Free course -> everyone has access
    if (isEnrolled) return true; // Enrolled student -> access everything
    return false; // Paid curriculum is protected by the server.
  };

  // Main load course routine
  useEffect(() => {
    if (!courseSlug) return;
    
    const loadCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseRes = await fetch(`/api/public/courses/by-slug/${courseSlug}`);
        if (!courseRes.ok) {
          throw new Error('Course not found or is currently not published.');
        }
        const courseData: Course = await courseRes.json();
        setCourse(courseData);
        setProgrammeStatus(null);
        setShowProgrammeHub(Boolean(courseData.programme));

        let loadedProgress: Record<string, boolean> = {};
        progressLoaded.current = false;
        setCurrentLesson(null); setCompletedLessons({}); setAssignmentSubmissions({}); setAssignments([]); setDownloads([]);
        const paidCourse = requiresSubscription(courseData);
        const hasPaidInStorage = courseData.hasAccess === true;
        setIsEnrolled(!paidCourse || hasPaidInStorage);
        const sessionRes = await fetch('/api/learner/session');
        const session = await sessionRes.json();
        setLearnerId(session.user?.id || null);
        if (session.user) {
          setStudentName(session.user.name);
          const progressRes = await fetch(`/api/learner/progress/${courseData.id}`);
          if (!progressRes.ok) throw new Error('Could not load your saved progress. Please sign in again.');
          const saved = await progressRes.json();
          loadedProgress = saved.completedLessons || {};
          setCompletedLessons(loadedProgress);
          setAssignmentSubmissions(saved.assignmentSubmissions || {});
          const programmeKey = `v79_programme_state_${session.user.id}_${courseData.id}`;
          localStorage.setItem(programmeKey, JSON.stringify(saved.programmeState || {}));
        } else {
          try {
            setCompletedLessons(JSON.parse(localStorage.getItem(`v79_student_progress_guest_${courseData.id}`) || '{}'));
            setAssignmentSubmissions(JSON.parse(localStorage.getItem(`v79_student_submissions_guest_${courseData.id}`) || '{}'));
          } catch { /* Start clean if guest cache is invalid. */ }
        }
        progressLoaded.current = true;

        // Fetch Modules
        const modulesRes = await fetch(`/api/public/courses/${courseData.id}/modules`);
        if (!modulesRes.ok) throw new Error("Could not load the course outline.");
        const modulesData = await modulesRes.json();
        setModules(modulesData);

        // Fetch Lessons for all modules
        const lMap: { [id: string]: Lesson[] } = {};
        let firstLesson: Lesson | null = null;
        for (let mIdx = 0; mIdx < modulesData.length; mIdx++) {
          const m = modulesData[mIdx];
          const lessonsRes = await fetch(`/api/public/modules/${m.id}/lessons`);
          if (!lessonsRes.ok) throw new Error("Could not load course lessons.");
          const lessonsData = await lessonsRes.json();
          lMap[m.id] = lessonsData;
          if (!firstLesson && lessonsData.length > 0) {
            firstLesson = lessonsData[0];
          }
        }
        setLessonsMap(lMap);

        // Programme courses start in their diagnostic/workbook hub. Ordinary
        // courses retain the existing behaviour of opening the first lesson.
        if (courseData.programme) {
          setCurrentLesson(null);
        } else if ((!paidCourse || hasPaidInStorage) && firstLesson) {
          setCurrentLesson(Object.values(lMap).flat().find(lesson => !loadedProgress[lesson.id]) || firstLesson);
        }

        // Fetch course-wide assignments & downloads
        const assignRes = await fetch(`/api/public/courses/${courseData.id}/assignments`);
        if (assignRes.ok) {
          const assignData = await assignRes.json();
          setAssignments(assignData || []);
        }

        const dlRes = await fetch(`/api/public/courses/${courseData.id}/downloads`);
        if (dlRes.ok) {
          const dlData = await dlRes.json();
          setDownloads(dlData || []);
        }

      } catch (err: any) {
        setError(err.message || 'An error occurred loading the course portal.');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseSlug]);

  // Handle active lesson context switching (fetching quiz & blocks)
  useEffect(() => {
    if (!currentLesson) return;
    const controller = new AbortController();

    // Scroll back to top of center main screen
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }

    // Reset temporary states
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setCurrentAssignmentText('');
    setContentBlocks([]); setActiveQuiz(null);

    const fetchLessonSubCollections = async () => {
      try {
        // Fetch Content Blocks
        const blockRes = await fetch(`/api/public/lessons/${currentLesson.id}/content-blocks`, { signal: controller.signal });
        if (blockRes.ok) {
          const blockData = await blockRes.json();
          setContentBlocks(blockData || []);
        }

        // Fetch Quiz
        const quizRes = await fetch(`/api/public/lessons/${currentLesson.id}/quiz`, { signal: controller.signal });
        if (quizRes.ok) {
          const quizData = await quizRes.json();
          setActiveQuiz(quizData);
        } else {
          setActiveQuiz(null);
        }
      } catch (e) {
        console.error('Error fetching lesson components', e);
      }
    };

    fetchLessonSubCollections();
    return () => controller.abort();
  }, [currentLesson]);

  // Persist completion status when updated
  const toggleLessonCompletion = (lessonId: string) => {
    if (!course) return;
    const nextCompleted = { ...completedLessons, [lessonId]: !completedLessons[lessonId] };
    setCompletedLessons(nextCompleted);
    localStorage.setItem(`v79_student_progress_${learnerId || "guest"}_${course.id}`, JSON.stringify(nextCompleted));
  };

  // Check if a specific lesson is completed
  const isLessonCompleted = (lessonId: string) => {
    return !!completedLessons[lessonId];
  };

  // Calculate stats
  let totalLessons = 0;
  Object.values(lessonsMap).forEach((list: any) => {
    if (list && Array.isArray(list)) {
      totalLessons += list.length;
    }
  });
  const completedCount = (Object.values(lessonsMap) as Lesson[][]).flat().filter(lesson => completedLessons[lesson.id]).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const certificateEligible = course?.programme
    ? programmeStatus?.readyForCertificate === true
    : progressPercent === 100;

  useEffect(() => {
    if (!course?.programme) return;
    try {
      const raw = localStorage.getItem(`v79_programme_state_${learnerId || "guest"}_${course.id}`);
      const saved = normalizeProgrammeState(raw ? JSON.parse(raw) : null, course.programme.version);
      const requiredAssignments = assignments.filter((assignment) => assignment.courseId === course.id && (assignment as Assignment & { required?: boolean }).required !== false);
      const submittedCount = requiredAssignments.filter((assignment) => Boolean(assignmentSubmissions[assignment.id])).length;
      setProgrammeStatus(buildProgrammeStatus(
        course.programme,
        progressPercent,
        submittedCount,
        requiredAssignments.length,
        saved.examAttempts,
        saved.certificateId
      ));
    } catch {
      // The programme hub will offer a fresh, valid state if browser data is corrupt.
    }
  }, [course, progressPercent, assignments, assignmentSubmissions]);

  const openProgrammeModule = (moduleNumber: number, target: 'first' | 'last' = 'first') => {
    const moduleIndex = moduleNumber - 1;
    const module = modules[moduleIndex];
    if (!module) return;
    const moduleLessons = lessonsMap[module.id] || [];
    if (!moduleLessons.length) return;
    const lesson = target === 'last' ? moduleLessons[moduleLessons.length - 1] : moduleLessons[0];
    setCurrentModuleIndex(moduleIndex);
    setCurrentLesson(lesson);
    setShowProgrammeHub(false);
  };

  // Handle Quiz Submissions
  const handleQuizSubmit = async () => {
    if (!activeQuiz || !currentLesson) return;
    try {
      const response = await fetch(`/api/public/lessons/${currentLesson.id}/quiz/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers: quizAnswers }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setQuizScore(result.score); setQuizSubmitted(true);
      if (result.score >= activeQuiz.passingScore) setCompletedLessons(current => ({ ...current, [currentLesson.id]: true }));
    } catch (e: any) { setSyncMessage(e.message); }
  };
  const claimCertificate = async () => {
    if (!course) return;
    if (!learnerId) { setSyncMessage('Sign in to your learner account to earn and save a certificate.'); return; }
    try {
      const response = await fetch(`/api/learner/certificate/${course.id}`, { method: 'POST' }); const certificate = await response.json();
      if (!response.ok) throw new Error(certificate.error);
      setIssuedCertificateId(certificate.id); setStudentName(certificate.name); setCertDate(new Date(certificate.issuedAt).toLocaleDateString()); setShowCertificate(true);
    } catch (e: any) { setSyncMessage(e.message); }
  };

  // Handle Assignment Submissions
  const handleAssignmentSubmit = (assignId: string) => {
    if (!course || !currentLesson) return;
    
    const newSubmission = {
      text: currentAssignmentText,
      fileSubmitted: false,
      submittedAt: new Date().toLocaleDateString()
    };

    const nextSubmissions = {
      ...assignmentSubmissions,
      [assignId]: newSubmission
    };

    setAssignmentSubmissions(nextSubmissions);
    localStorage.setItem(`v79_student_submissions_${learnerId || "guest"}_${course.id}`, JSON.stringify(nextSubmissions));
    
    // Auto-mark lesson complete upon submitting assignments
    const nextCompleted = { ...completedLessons, [currentLesson.id]: true };
    setCompletedLessons(nextCompleted);
    localStorage.setItem(`v79_student_progress_${learnerId || "guest"}_${course.id}`, JSON.stringify(nextCompleted));

    setCurrentAssignmentText('');
  };

  // Custom Markdown renderer for visual elegance
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-4 text-slate-700 leading-relaxed text-sm font-normal">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('### ')) {
            return <h4 key={idx} className="text-sm font-bold text-slate-900 mt-5 mb-2 flex items-center gap-1.5">{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="text-base font-bold text-slate-900 mt-6 mb-3 border-b border-slate-100 pb-1.5">{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('# ')) {
            return <h2 key={idx} className="text-lg font-bold text-indigo-950 mt-8 mb-4">{line.replace('# ', '')}</h2>;
          }
          // Blockquote
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-xl italic text-indigo-900 my-4 text-xs font-medium">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          // Bullets
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 my-2 text-slate-600">
                <li>{line.substring(2)}</li>
              </ul>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <ol key={idx} className="list-decimal pl-5 space-y-1.5 my-2 text-slate-600">
                <li>{line.replace(/^\d+\.\s/, '')}</li>
              </ol>
            );
          }
          // Blank line
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          // Default paragraph
          return <p key={idx} className="mb-2.5 text-slate-600">{line}</p>;
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-700">Entering your V79 Academy Classroom...</p>
        <p className="text-xs text-slate-400 mt-1">Preparing modules, lectures, and resources.</p>
      </div>
    );
  }

  // Course not found or not published state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl p-10 space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Classroom Unavailable</h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              The course URL you entered is either incorrect, or this academy course has not been marked as **Published** yet.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-left space-y-3">
            <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              Published Courses Directory
            </h3>
            {allPublishedCourses.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {allPublishedCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => window.location.pathname = `/course/${c.id}`}
                    className="w-full text-left p-3 bg-white hover:bg-indigo-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{c.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.category} • {c.instructor}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-indigo-700/80 leading-relaxed">
                No courses are currently published. Go to the course builder settings as an administrator and set a course internal status to **Published** to preview it here instantly.
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => window.location.pathname = '/'}
              className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Back to Builder Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Find currently active lesson's module name
  const currentModule = modules.find(m => m.id === currentLesson?.moduleId);
  const paidCourse = isCoursePaid(course);
  const coursePriceFormatted = 'Academy subscription';

  return (
    <div className="v79-academy-classroom classroom-shell min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased overflow-hidden h-screen">
      
      {/* 1. Left Navigation Sidebar (Classroom Index) */}
      <aside className="academy-classroom-nav w-80 bg-[#06101d] border-r border-[#17324d] flex flex-col shrink-0 h-full overflow-hidden text-slate-200">
        
        {/* Course Core Header */}
        <div className="p-6 border-b border-[#17324d] space-y-4 shrink-0 bg-[#07111f]">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {course.category}
              </span>
              {paidCourse ? (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 ${
                  isEnrolled 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>ENROLLED</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>{coursePriceFormatted}</span>
                    </>
                  )}
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase">
                  FREE COURSE
                </span>
              )}
            </div>

            <h1 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">{course.title}</h1>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Instructor: {course.instructor}</p>
          </div>

          {course.programme && isEnrolled && (
            <button
              onClick={() => {
                setShowProgrammeHub(true);
                setCurrentLesson(null);
              }}
              className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                showProgrammeHub
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Business Advantage Hub</span>
              </div>
              <span className="text-[9px] uppercase font-extrabold">Score · Plan · Exam</span>
            </button>
          )}

          {/* Quick Access to Course Introduction / Overview */}
          <button
            onClick={() => {
              setShowProgrammeHub(false);
              setCurrentLesson(null);
            }}
            className={`w-full p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
              currentLesson === null && !showProgrammeHub
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Course Introduction</span>
            </div>
            <span className="text-[10px] opacity-80 uppercase font-semibold">
              {!isEnrolled && paidCourse ? 'Course details' : 'Overview'}
            </span>
          </button>

          {/* Paywall Callout if unenrolled */}
          {!isEnrolled && paidCourse && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 space-y-2">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 font-medium leading-tight">
                  <p className="font-bold text-amber-950">Membership required</p>
                  <p className="mt-0.5 text-amber-800 text-[10px]">
                    An active academy membership is needed for this course.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>View membership options</span>
              </button>
            </div>
          )}

          {/* Progress Tracker (Only shown if enrolled or free) */}
          {isEnrolled && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Course Completion</span>
                <span className="font-bold text-indigo-700">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>{completedCount} of {totalLessons} completed</span>
                {certificateEligible && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                    Ready for Certificate! 🎓
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Certificate Badge Callout */}
          {isEnrolled && certificateEligible && (
            <button
              onClick={claimCertificate}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 "
            >
              <Award className="w-4 h-4" />
              Claim Your Certificate
            </button>
          )}
        </div>

        {/* Modules & Lessons Curriculum Accordion/List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {modules.map((mod, modIdx) => {
            const moduleLessons = lessonsMap[mod.id] || [];
            return (
              <div key={mod.id} className="space-y-2">
                <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-900/80 uppercase tracking-wider">
                    MODULE {modIdx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {moduleLessons.length} lessons
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-800 truncate px-1" title={mod.title}>
                  {mod.title}
                </h3>

                <div className="space-y-1 pl-1.5 border-l-2 border-slate-100">
                  {moduleLessons.map((les, lesIdx) => {
                    const isActive = currentLesson?.id === les.id;
                    const isComplete = isLessonCompleted(les.id);
                    const accessible = canAccessLesson(les, lesIdx, modIdx);
                    const isIntro = isLessonIntro(les, lesIdx, modIdx);

                    return (
                      <button
                        key={les.id}
                        onClick={() => {
                          if (accessible) {
                            setCurrentLesson(les);
                            setCurrentModuleIndex(modIdx);
                            setShowProgrammeHub(false);
                          } else {
                            setShowPaymentModal(true);
                          }
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md'
                            : accessible
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            : 'text-slate-400 bg-slate-50/50 hover:bg-amber-50/60 hover:text-amber-900 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {!accessible ? (
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : isComplete ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                          ) : (
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          )}
                          <span className="truncate">{lesIdx + 1}. {les.title}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-1.5">
                          {!isEnrolled && isIntro && (
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tight ${
                              isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              Preview
                            </span>
                          )}
                          {!accessible && (
                            <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase bg-amber-100 text-amber-900">
                              Locked
                            </span>
                          )}
                          <span className={`text-[9px] opacity-80 ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                            {les.estimatedTime}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {moduleLessons.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic pl-3">No lessons yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#17324d] bg-[#07111f] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-white">V79 Digital Academy</span>
          </div>

        </div>
      </aside>

      {/* 2. Main Content Center Screen (Classroom Player or Introduction View) */}
      <div 
        ref={mainContentRef}
        className="flex-1 overflow-y-auto flex flex-col h-full bg-slate-50"
      >
        
        <div role="status" className="px-5 py-2 text-xs bg-[#0A86FF]/10 text-[#21527a] border-b border-[#0A86FF]/15 flex justify-between gap-3"><a href="/academy">← Course catalogue</a><span>{learnerId ? syncMessage || 'Account progress enabled' : 'Guest progress stays on this browser. Sign in to save across devices.'}</span></div>
        {/* Dynamic Header */}
        <header className="h-16 bg-[#07111f]/95 backdrop-blur-xl border-b border-[#17324d] px-5 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">
              {currentLesson && currentModule ? `Module ${currentModuleIndex + 1}: ${currentModule.title}` : 'Course Overview'}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-xs font-bold text-slate-800 truncate max-w-sm">
              {currentLesson ? currentLesson.title : 'Course Introduction'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href="https://hub.v79sl.com/"
              className="px-3 py-1.5 bg-[#0A86FF]/10 hover:bg-[#0A86FF]/18 border border-[#0A86FF]/30 text-[#74d0ff] rounded-xl text-[10px] font-bold transition-colors"
            >
              V79 Hub
            </a>
            {currentLesson && isEnrolled && (
              <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-xl cursor-pointer transition-all text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={isLessonCompleted(currentLesson.id)}
                  onChange={() => toggleLessonCompletion(currentLesson.id)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className={isLessonCompleted(currentLesson.id) ? 'text-emerald-700' : 'text-slate-600'}>
                  {isLessonCompleted(currentLesson.id) ? 'Lesson Completed ✓' : 'Mark Lesson Complete'}
                </span>
              </label>
            )}

            {!isEnrolled && paidCourse && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>View access options</span>
              </button>
            )}
          </div>
        </header>

        {paymentSuccessMsg && (
          <div className="bg-emerald-600 text-white px-8 py-3 text-xs font-bold flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{paymentSuccessMsg}</span>
            </div>
            <button 
              onClick={() => setPaymentSuccessMsg(null)}
              className="text-emerald-100 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* --- VIEW CHOICE: Programme Hub, Course Introduction, or Active Lesson --- */}
        {showProgrammeHub && course.programme ? (
          <BusinessAdvantageProgramme
            courseId={course.id}
                storageScope={learnerId || "guest"}
            programme={course.programme}
            modules={modules}
            lessonsMap={lessonsMap}
            completedLessons={completedLessons}
            assignments={assignments}
            assignmentSubmissions={assignmentSubmissions}
            onOpenModule={openProgrammeModule}
            onStatusChange={handleProgrammeStatusChange}
          />
        ) : currentLesson === null ? (
          /* COURSE INTRODUCTION & OVERVIEW PAGE */
          <div className="p-8 max-w-4xl mx-auto w-full space-y-8 flex-1">
            
            {/* Hero Course Introduction Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-100">
                      {course.category}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg">
                      Level: {course.difficultyLevel}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.estimatedDuration || '4.5 hours'}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                    {course.title}
                  </h1>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {course.shortDescription || course.fullDescription || 'Welcome to this comprehensive course. Preview the curriculum below and enroll to unlock full access.'}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">Instructor: {course.instructor}</span>
                    <span>•</span>
                    <span>Version {course.courseVersion}</span>
                  </div>
                </div>

                {/* Pricing / Enrollment Action Box */}
                <div className="w-full md:w-72 bg-slate-50 p-6 rounded-2xl border border-slate-200 shrink-0 text-center space-y-4">
                  {paidCourse ? (
                    <>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Course access
                        </span>
                        <div className="text-3xl font-black text-slate-900">
                          {coursePriceFormatted}
                        </div>
                      </div>

                      {isEnrolled ? (
                        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold space-y-1">
                          <p className="flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>You are Enrolled!</span>
                          </p>
                          <p className="text-[10px] text-emerald-700 font-normal">
                            Full access enabled. Select any lesson in the sidebar to continue learning.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>View membership options</span>
                          </button>
                          <p className="text-[10px] text-slate-400">
                            Online subscriptions are coming soon. Existing members can sign in.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                        100% Free Course
                      </span>
                      <p className="text-xs text-slate-500">
                        This course is open to all students free of charge.
                      </p>
                      {modules.length > 0 && lessonsMap[modules[0].id]?.length > 0 && (
                        <button
                          onClick={() => {
                            setCurrentLesson(lessonsMap[modules[0].id][0]);
                            setCurrentModuleIndex(0);
                            setShowProgrammeHub(false);
                          }}
                          className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          Start Learning Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Course Description & Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                
                {/* Full Description */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Course Introduction & Overview</span>
                  </h3>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {course.fullDescription || course.shortDescription || 'This course offers an in-depth, structured curriculum designed to build practical mastery step-by-step.'}
                  </div>
                </div>

                {/* Learning Objectives */}
                {course.learningObjectives && course.learningObjectives.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>What You Will Learn</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.learningObjectives.map((obj, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course Curriculum Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Course Syllabus ({modules.length} Modules)</span>
                    </h3>
                    {!isEnrolled && paidCourse && (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-bold border border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Membership required</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {modules.map((m, mIdx) => {
                      const mLessons = lessonsMap[m.id] || [];
                      return (
                        <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">
                              Module {mIdx + 1}: {m.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {mLessons.length} Lessons
                            </span>