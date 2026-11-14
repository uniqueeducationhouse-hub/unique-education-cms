import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck2,
  Receipt,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  Coins,
  Award,
  Database,
  Building,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/actions/admissions';
import { formatCurrency } from '@/lib/utils';

async function DashboardContent() {
  const stats = await getDashboardStats();

  const kpis = [
    {
      title: 'Enrolled Students',
      value: stats.studentsCount.toLocaleString(),
      change: stats.studentsCount > 0 ? `${stats.studentsCount} active students in DB` : 'Awaiting enrollment in Supabase',
      icon: Users,
      color: 'bg-blue-500',
      href: '/admissions',
      module: 'Module 1: Admissions',
    },
    {
      title: 'Active Faculty',
      value: stats.teachersCount.toLocaleString(),
      change: `${stats.teachersCount} faculty onboarded`,
      icon: GraduationCap,
      color: 'bg-purple-500',
      href: '/admissions',
      module: 'Module 1: Faculty',
    },
    {
      title: 'Academic Classes',
      value: stats.classesCount.toLocaleString(),
      change: `${stats.classesCount} grades configured`,
      icon: Building,
      color: 'bg-emerald-500',
      href: '/admissions',
      module: 'Academic Structure',
    },
    {
      title: 'Fees Collected',
      value: formatCurrency(stats.totalCollected),
      change: 'Synced from fee_vouchers table (PKR)',
      icon: Coins,
      color: 'bg-indigo-500',
      href: '/fees',
      module: 'Module 3: Billing',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium backdrop-blur-xs">
              Academic Session 2026-2027
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-100 text-xs font-semibold border border-emerald-400/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Supabase
            </span>
          </div>
          <h2 className="text-2xl font-bold">Apex Academy Management Portal</h2>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Integrated Next.js App Router & Supabase cloud backend covering Student & Teacher Admissions, Daily Attendance, Billing Vouchers, and Exam Marks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admissions"
            className="px-4 py-2 bg-white text-indigo-700 font-semibold text-xs rounded-lg shadow hover:bg-indigo-50 transition"
          >
            + Enroll Student
          </Link>
          <Link
            href="/attendance"
            className="px-4 py-2 bg-indigo-900/60 text-white font-semibold text-xs rounded-lg border border-indigo-400/30 hover:bg-indigo-900/80 transition"
          >
            Attendance Roster
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              href={kpi.href}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    {kpi.module}
                  </span>
                  <div className={`h-8 w-8 rounded-lg ${kpi.color} text-white flex items-center justify-center shadow-xs`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{kpi.value}</h3>
                <p className="text-xs text-slate-600 font-medium">{kpi.title}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">{kpi.change}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Core Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Core Modules Status</h3>
              <p className="text-xs text-slate-500">Active subsystems connected to Supabase PostgreSQL</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              Supabase Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link
              href="/admissions"
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600">
                    Student & Teacher Admissions
                  </h4>
                  <p className="text-xs text-slate-500">Profiles, auto-enrollment, roll numbers</p>
                </div>
              </div>
            </Link>

            <Link
              href="/attendance"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700">
                    Daily Attendance System
                  </h4>
                  <p className="text-xs text-slate-500">Class roster, bulk mark, attendance rates</p>
                </div>
              </div>
            </Link>

            <Link
              href="/fees"
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600">
                    Fee Tracking & Vouchers
                  </h4>
                  <p className="text-xs text-slate-500">3-copy printable bank challans, payments</p>
                </div>
              </div>
            </Link>

            <Link
              href="/exams"
              className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 group-hover:text-amber-700">
                    Exam Marks & Report Cards
                  </h4>
                  <p className="text-xs text-slate-500">Grade matrix, GPA, printable A4 cards</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Live Recent Admissions from Supabase */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Enrolled</h3>
            <Link href="/admissions" className="text-xs text-indigo-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {stats.recentStudents.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <p>No students enrolled yet.</p>
                <Link
                  href="/admissions"
                  className="mt-2 inline-block font-semibold text-indigo-600 hover:underline"
                >
                  + Enroll first student
                </Link>
              </div>
            ) : (
              stats.recentStudents.map((student: any) => (
                <div key={student.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {student.admission_number} • {student.class?.name || 'Class'}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                    {student.status || 'Active'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span>Loading Apex Academy dashboard from Supabase...</span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
