import Link from 'next/link';
import {
  Users,
  CalendarCheck2,
  Receipt,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  DollarSign,
  Award,
} from 'lucide-react';

export default function DashboardPage() {
  const kpis = [
    {
      title: 'Enrolled Students',
      value: '1,280',
      change: '+14% this semester',
      icon: Users,
      color: 'bg-blue-500',
      href: '/admissions',
      module: 'Module 1: Admissions',
    },
    {
      title: "Today's Attendance",
      value: '96.4%',
      change: '1,234 present / 46 absent',
      icon: CalendarCheck2,
      color: 'bg-emerald-500',
      href: '/attendance',
      module: 'Module 2: Daily Attendance',
    },
    {
      title: 'Monthly Fees Collected',
      value: '$48,250',
      change: '88% of target ($54,800)',
      icon: DollarSign,
      color: 'bg-indigo-500',
      href: '/fees',
      module: 'Module 3: Fee Vouchers',
    },
    {
      title: 'Exam Passing Rate',
      value: '91.8%',
      change: 'Term 1 Midterms published',
      icon: Award,
      color: 'bg-amber-500',
      href: '/exams',
      module: 'Module 4: Exam Marks',
    },
  ];

  const recentAdmissions = [
    { name: 'Sophia Martinez', id: 'ADM-2026-10-001', grade: 'Grade 10-A', date: 'Nov 10, 2026', status: 'Active' },
    { name: 'Liam Johnson', id: 'ADM-2026-09-014', grade: 'Grade 9-B', date: 'Nov 08, 2026', status: 'Active' },
    { name: 'Aaliyah Khan', id: 'ADM-2026-10-002', grade: 'Grade 10-A', date: 'Nov 05, 2026', status: 'Active' },
    { name: 'Noah Davis', id: 'ADM-2026-08-032', grade: 'Grade 8-A', date: 'Nov 02, 2026', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-xs mb-2">
            Academic Session 2026-2027
          </span>
          <h2 className="text-2xl font-bold">Welcome to Apex Academy ERP</h2>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Integrated Next.js & Supabase portal covering student admissions, daily attendance roster, fee challans, and printable report cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admissions"
            className="px-4 py-2 bg-white text-indigo-700 font-semibold text-xs rounded-lg shadow hover:bg-indigo-50 transition"
          >
            + New Admission
          </Link>
          <Link
            href="/attendance"
            className="px-4 py-2 bg-indigo-900/60 text-white font-semibold text-xs rounded-lg border border-indigo-400/30 hover:bg-indigo-900/80 transition"
          >
            Mark Attendance
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
                <span>{kpi.change}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Modules Quick Links */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Core Modules Status</h3>
              <p className="text-xs text-slate-500">Active subsystems configured in this architecture</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
              Supabase Ready
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

        {/* Recent Admissions Sidebar */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Enrolled</h3>
            <Link href="/admissions" className="text-xs text-indigo-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {recentAdmissions.map((student) => (
              <div key={student.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-900">{student.name}</p>
                  <p className="text-[11px] text-slate-400">{student.id} • {student.grade}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {student.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
