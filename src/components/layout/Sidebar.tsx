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
  Settings,
  Briefcase,
  X,
} from 'lucide-react';
import { useSchoolSettings } from '@/lib/school-settings';
import { useSidebar } from './SidebarContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Admissions', href: '/admissions', icon: Users, badge: 'Module 1' },
  { name: 'Staff & Payroll', href: '/staff', icon: Briefcase, badge: 'HR' },
  { name: 'Daily Attendance', href: '/attendance', icon: CalendarCheck2, badge: 'Module 2' },
  { name: 'Fees & Vouchers', href: '/fees', icon: Receipt, badge: 'Module 3' },
  { name: 'Exams & Reports', href: '/exams', icon: FileSpreadsheet, badge: 'Module 4' },
  { name: 'School Settings', href: '/settings', icon: Settings, badge: 'Config' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useSchoolSettings();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col no-print border-r border-slate-800 shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between gap-3 px-5 border-b border-slate-800 bg-slate-950 shrink-0">
          <Link 
            href="/" 
            onClick={close}
            className="flex items-center gap-3 min-w-0 hover:opacity-90 transition-opacity"
          >
            {settings.logoUrl ? (
              <div className="h-9 w-9 rounded-lg overflow-hidden bg-white p-0.5 shrink-0 flex items-center justify-center border border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.logoUrl}
                  alt={settings.schoolName}
                  className="h-full w-full object-contain rounded"
                />
              </div>
            ) : (
              <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-sm tracking-wide text-white truncate" title={settings.schoolName}>
                {settings.schoolName}
              </h1>
              <p className="text-[10px] text-emerald-400 font-medium truncate uppercase tracking-tighter">Pakistan Campus</p>
            </div>
          </Link>
          
          <button 
            onClick={close}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Core Modules &amp; Setup
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={close}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-2 ${
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
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 shrink-0">
          <div className="text-[11px] text-slate-400">
            <p className="font-medium text-slate-300">Session 2026-2027</p>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{settings.bankName}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
