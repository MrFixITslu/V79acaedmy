import React from 'react';
import { Course } from '../types';
import { ArrowLeft, BookOpen, LayoutDashboard, Settings, GraduationCap, PlusCircle, UploadCloud, Image, FileCheck } from 'lucide-react';

interface SidebarProps {
  courses: Course[];
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedAppCategory: string;
  setSelectedAppCategory: (cat: string) => void;
  userRole: 'Admin' | 'Instructor' | 'Student';
}

export function Sidebar({ courses, currentView, setCurrentView, selectedAppCategory, setSelectedAppCategory, userRole }: SidebarProps) {
  const categories = ['All Applications', ...Array.from(new Set(courses.map(c => c.category || 'General'))).sort()];

  const canEdit = userRole === 'Admin' || userRole === 'Instructor';
  const isAdmin = userRole === 'Admin';

  return (
    <aside className="w-[252px] bg-[#06101d] text-slate-300 flex flex-col border-r border-[#17324d]/70 shrink-0 relative overflow-hidden">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#17324d]/70 flex items-center space-x-3 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0A86FF] flex items-center justify-center text-white shadow-[0_0_24px_rgba(20,184,166,.15)]">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-black text-white text-base tracking-wide">V79 Digital Academy</h1>
          <p className="text-[9px] text-[#68e6d4] font-black uppercase tracking-[0.14em]">Authoring studio</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1 space-y-6 overflow-y-auto">
        {/* Authoring Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Authoring Engine</p>
          
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-[#14B8A6]/25 to-[#0A86FF]/12 text-white border border-[#14B8A6]/35'
                : 'hover:bg-white/[0.045] text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {canEdit && (
            <>
              <button
                onClick={() => setCurrentView('courses')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'courses' || currentView === 'editor'
                    ? 'bg-gradient-to-r from-[#14B8A6]/25 to-[#0A86FF]/12 text-white border border-[#14B8A6]/35'
                    : 'hover:bg-white/[0.045] text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>My Courses</span>
              </button>

              <button
                onClick={() => setCurrentView('create-course')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'create-course'
                    ? 'bg-gradient-to-r from-[#14B8A6]/25 to-[#0A86FF]/12 text-white border border-[#14B8A6]/35'
                    : 'hover:bg-white/[0.045] text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Course</span>
              </button>

              <button
                onClick={() => setCurrentView('import-curriculum')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'import-curriculum'
                    ? 'bg-gradient-to-r from-[#14B8A6]/25 to-[#0A86FF]/12 text-white border border-[#14B8A6]/35'
                    : 'hover:bg-white/[0.045] text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Import Curriculum</span>
              </button>
            </>
          )}

          <div className="pt-2 px-3">
            <a
              href="/academy"
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#0A86FF]/10 border border-[#0A86FF]/30 text-[#74d0ff] hover:bg-[#0A86FF]/18 transition text-center"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Launch Student Portal ↗</span>
            </a>
            <p className="text-[9px] text-slate-600 mt-2 leading-relaxed">
              Visit the public V79 Academy landing page & catalog (<code className="text-indigo-400">/academy</code>).
            </p>
          </div>
        </div>

        {/* Application Filters */}
        {canEdit && (
          <div className="space-y-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">V79 Applications</p>
            <div className="space-y-1 pl-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedAppCategory(cat);
                    if (currentView !== 'courses') {
                      setCurrentView('courses');
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedAppCategory === cat
                      ? 'bg-slate-800 text-indigo-400 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[10px]">{cat === 'All Applications' ? courses.length : courses.filter(c => c.category === cat).length}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => setCurrentView('learners')} className={`w-full text-left px-3 py-3 rounded-xl text-sm font-semibold ${currentView === 'learners' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>Learners & memberships</button>
        {canEdit && <button onClick={() => setCurrentView('junior-academy')} className={`w-full text-left px-3 py-3 rounded-xl text-sm font-semibold ${currentView === 'junior-academy' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>Junior Academy Teams</button>}
        {/* Assets & Deployments */}
        {canEdit && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Systems</p>
            
            <button
              onClick={() => setCurrentView('media-library')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'media-library'
                  ? 'bg-gradient-to-r from-[#14B8A6]/25 to-[#0A86FF]/12 text-white border border-[#14B8A6]/35'
                  : 'hover:bg-white/[0.045] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Media Library</span>
            </button>

            <button
              onClick={() => setCurrentView('publishing')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'publishing'
                  ? 'bg-gradient-to-r from-[#14B8A6]/25 to-[#0A86FF]/12 text-white border border-[#14B8A6]/35'
                  : 'hover:bg-white/[0.045] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Publishing & Versions</span>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'settings'
                  ? 'bg-gradient-to-r from-[#14B8A6]/25 to-[#0A86FF]/12 text-white border border-[#14B8A6]/35'
                  : 'hover:bg-white/[0.045] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Academy Settings</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3.5 pb-3 bg-[#050d17]">
        <a href="https://hub.v79sl.com/" className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#0A86FF]/30 bg-[#0A86FF]/10 text-[10px] font-bold text-[#74d0ff] hover:bg-[#0A86FF]/18 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to V79 Digital Hub
        </a>
      </div>

      <div className="p-3.5 border-t border-[#17324d]/70 bg-[#050d17]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0A86FF] flex items-center justify-center text-[10px] font-black text-white">
            {userRole === 'Admin' ? 'AD' : userRole === 'Instructor' ? 'IN' : 'ST'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">
              {userRole === 'Admin' ? 'Administrator' : userRole === 'Instructor' ? 'Instructor' : 'Student'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {userRole === 'Admin' ? 'V79 Academy Root' : userRole === 'Instructor' ? 'Course Instructor' : 'Public Viewer'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}