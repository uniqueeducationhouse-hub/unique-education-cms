'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Users,
  CalendarCheck2,
  Receipt,
  FileSpreadsheet,
  LayoutDashboard,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Admissions', href: '/admissions', icon: Users, badge: 'Module 1' },
  { name: 'Daily Attendance', href: '/attendance', icon: CalendarCheck2, badge: 'Module 2' },
  { name: 'Fees & Vouchers', href: '/fees', icon: Receipt, badge: 'Module 3' },
  { name: 'Exams & Reports', href: '/exams', icon: FileSpreadsheet, badge: 'Module 4' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col no-print border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-white">Apex Academy</h1>
          <p className="text-[11px] text-slate-400">School ERP System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Core Modules
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="text-xs text-slate-400">
          <p className="font-medium text-slate-300">Session 2026-2027</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Connected to Supabase DB</p>
        </div>
      </div>
    </aside>
  );
}
