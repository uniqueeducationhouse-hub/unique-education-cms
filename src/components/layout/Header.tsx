'use client';

import { Bell, Search, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between no-print sticky top-0 z-10 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center gap-2 max-w-md w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students, teachers, roll number, vouchers..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-xs">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Admin Portal</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <ShieldCheck className="h-3 w-3" />
              <span>Super Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
