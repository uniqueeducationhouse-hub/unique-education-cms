'use client';

import { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';

const mockStudents = [
  {
    id: 's-001',
    admission_number: 'ADM-2026-10-001',
    roll_number: '1001',
    name: 'Sophia Martinez',
    class: 'Grade 10',
    section: 'Section A',
    guardian: 'Carlos Martinez (Father)',
    phone: '+1 555-0192',
    status: 'active',
    admission_date: '2026-08-15',
  },
  {
    id: 's-002',
    admission_number: 'ADM-2026-10-002',
    roll_number: '1002',
    name: 'Aaliyah Khan',
    class: 'Grade 10',
    section: 'Section A',
    guardian: 'Farhan Khan (Father)',
    phone: '+1 555-0144',
    status: 'active',
    admission_date: '2026-08-16',
  },
  {
    id: 's-003',
    admission_number: 'ADM-2026-09-014',
    roll_number: '0914',
    name: 'Liam Johnson',
    class: 'Grade 9',
    section: 'Section B',
    guardian: 'Emma Johnson (Mother)',
    phone: '+1 555-0187',
    status: 'active',
    admission_date: '2026-08-18',
  },
  {
    id: 's-004',
    admission_number: 'ADM-2026-09-015',
    roll_number: '0915',
    name: 'Noah Davis',
    class: 'Grade 9',
    section: 'Section A',
    guardian: 'David Davis (Father)',
    phone: '+1 555-0123',
    status: 'active',
    admission_date: '2026-08-20',
  },
];

const mockTeachers = [
  {
    id: 't-001',
    employee_id: 'EMP-2026-001',
    name: 'Dr. Robert Miller',
    qualification: 'Ph.D. in Mathematics',
    specialization: 'Higher Mathematics & Calculus',
    email: 'r.miller@apex.edu',
    phone: '+1 555-0321',
    joining_date: '2024-01-15',
    status: 'active',
  },
  {
    id: 't-002',
    employee_id: 'EMP-2026-002',
    name: 'Sarah Jenkins',
    qualification: 'M.Sc. Physics',
    specialization: 'Applied Physics & Chemistry',
    email: 's.jenkins@apex.edu',
    phone: '+1 555-0399',
    joining_date: '2024-03-01',
    status: 'active',
  },
];

export default function AdmissionsPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Module 1: Admissions & Directory
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Student & Teacher Admissions</h1>
          <p className="text-sm text-slate-500">
            Manage student registrations, personal profiles, roll number assignments, and staff onboarding.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-lg transition"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow transition"
          >
            <UserPlus className="h-4 w-4" />
            {activeTab === 'students' ? 'New Student Admission' : 'Onboard Teacher'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Enrolled Students ({mockStudents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'teachers'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Faculty & Teachers ({mockTeachers.length})</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700">
            <option>All Classes</option>
            <option>Grade 10</option>
            <option>Grade 9</option>
          </select>
          <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700">
            <option>Status: All</option>
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Content Tables */}
      {activeTab === 'students' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Admission No</th>
                  <th className="px-5 py-3.5">Roll No</th>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-5 py-3.5">Class & Section</th>
                  <th className="px-5 py-3.5">Guardian Contact</th>
                  <th className="px-5 py-3.5">Admission Date</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-mono text-slate-900 font-semibold">
                      {student.admission_number}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{student.roll_number}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{student.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {student.class} - {student.section}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-900 font-medium">{student.guardian}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Phone className="h-3 w-3" />
                        <span>{student.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{student.admission_date}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Employee ID</th>
                  <th className="px-5 py-3.5">Faculty Name</th>
                  <th className="px-5 py-3.5">Qualification</th>
                  <th className="px-5 py-3.5">Specialization</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Joining Date</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-mono text-slate-900 font-semibold">
                      {teacher.employee_id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{teacher.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{teacher.qualification}</td>
                    <td className="px-5 py-3.5 text-indigo-600 font-medium">
                      {teacher.specialization}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Phone className="h-3 w-3" />
                        <span>{teacher.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{teacher.joining_date}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
