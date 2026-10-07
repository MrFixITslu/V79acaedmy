import React from 'react';
import { Search, Plus, Sparkles, Bell, Globe, LogOut } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNewCourse: () => void;
  onOpenAiAssistant: () => void;
  selectedAppCategory: string;
  onLogout?: () => void;
  userRole: 'Admin' | 'Instructor' | 'Student';
  setUserRole: (role: 'Admin' | 'Instructor' | 'Student') => void;
}

export function Header({
  searchQuery,
  setSearchQuery,
  onNewCourse,
  onOpenAiAssistant,
  selectedAppCategory,
  onLogout,
  userRole,
  setUserRole
}: HeaderProps) {
  return (
    <header className="min-h-[64px] flex-wrap gap-2 sm:gap-3 py-2 sm:py-3 bg-[#07111f]/95 backdrop-blur-xl border-b border-[#17324d]/80 px-3 sm:px-5 xl:px-7 flex items-center justify-between sticky top-0 z-30">
      <div className="flex min-w-0 items-center gap-2 sm:space-x-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#091728] border border-[#1a3854] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6]/60 transition-all"
          />
        </div>
        {selectedAppCategory !== 'All Applications' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0A86FF]/10 text-[#74d0ff] border border-[#0A86FF]/25 shrink-0">
            <Globe className="w-3 h-3 mr-1" />
            {selectedAppCategory}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:space-x-4">
        <button
          onClick={onOpenAiAssistant}
          className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-[#14B8A6]/12 text-[#68e6d4] border border-[#14B8A6]/30 hover:bg-[#14B8A6]/20 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Course Architect</span>
        </button>

        <button
          onClick={onNewCourse}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#14B8A6] to-[#0A86FF] text-white hover:brightness-110 shadow-[0_8px_28px_rgba(20,184,166,.14)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Course</span>
        </button>

        <div className="hidden sm:block h-6 w-px bg-[#17324d] mx-1 shrink-0"></div>



        {onLogout && (
          <button
            onClick={onLogout}
            title="Log out"
            className="p-2 rounded-xl text-slate-600 hover:text-rose-300 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}