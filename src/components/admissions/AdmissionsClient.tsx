'use client';

import React, { useState } from 'react';
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
  Database,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NewStudentModal } from '@/components/admissions/NewStudentModal';
import { NewTeacherModal } from '@/components/admissions/NewTeacherModal';
import { AddClassModal } from '@/components/admissions/AddClassModal';
import type { Student, Teacher, SchoolClass, Section } from '@/types/database.types';

interface AdmissionsClientProps {
  initialStudents: Student[];
  initialTeachers: Teacher[];
  classes: (SchoolClass & { sections: Section[] })[];
  dbError?: string | null;
}

export function AdmissionsClient({
  initialStudents,
  initialTeachers,
  classes,
  dbError,
}: AdmissionsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  // Filter students
  const filteredStudents = initialStudents.filter((student) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    const admNo = student.admission_number?.toLowerCase() || '';
    const roll = student.roll_number || '';
    const matchesSearch = fullName.includes(q) || admNo.includes(q) || roll.includes(q);

    const matchesClass =
      selectedClassFilter === 'all' || student.class_id === selectedClassFilter;

    return matchesSearch && matchesClass;
  });

  // Filter teachers
  const filteredTeachers = initialTeachers.filter((teacher) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    const empId = teacher.employee_id?.toLowerCase() || '';
    const email = teacher.email?.toLowerCase() || '';
    return fullName.includes(q) || empId.includes(q) || email.includes(q);
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Top Banner with Supabase indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Module 1: Admissions & Directory
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              <Database className="h-3 w-3 text-emerald-600" />
              Connected to Supabase
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 break-words">Student & Teacher Admissions</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time enrollment directory powered by Supabase PostgreSQL tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition shrink-0"
            title="Refresh from Supabase"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsAddClassModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-lg transition shrink-0 whitespace-nowrap"
            title="Add new class / section"
          >
            <PlusCircle className="h-4 w-4 text-indigo-500" />
            Add Class
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'students') {
                setIsStudentModalOpen(true);
              } else {
                setIsTeacherModalOpen(true);
              }
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow transition whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            {activeTab === 'students' ? 'New Student Admission' : 'Onboard Teacher'}
          </button>
        </div>
      </div>

      {dbError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between w-full min-w-0">
          <div>
            <p className="font-bold">Notice regarding database query:</p>
            <p className="mt-0.5 text-amber-700">{dbError}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap pb-px no-scrollbar w-full min-w-0">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-semibold border-b-2 transition shrink-0 whitespace-nowrap ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4 shrink-0" />
          <span>Enrolled Students ({initialStudents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-semibold border-b-2 transition shrink-0 whitespace-nowrap ${
            activeTab === 'teachers'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4 shrink-0" />
          <span>Faculty & Teachers ({initialTeachers.length})</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between w-full min-w-0">
        <div className="relative w-full sm:w-72 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto min-w-0">
          {activeTab === 'students' && (
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 flex-1 sm:flex-initial"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          )}
          <span className="text-xs text-slate-400 shrink-0">
            {activeTab === 'students' ? `${filteredStudents.length} results` : `${filteredTeachers.length} results`}
          </span>
        </div>
      </div>

      {/* Content Tables */}
      {activeTab === 'students' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
          {filteredStudents.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Student Records Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {initialStudents.length === 0
                  ? 'Your Supabase students table is ready. Click "New Student Admission" to enroll your first student!'
                  : 'No students matched your search criteria.'}
              </p>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
              >
                + Add Student Record
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Admission No</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Roll No</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Student Name</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Class & Section</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Guardian Contact</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Admission Date</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const className = student.class?.name || 'Class assigned';
                    const sectionName = student.section?.name || '';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap font-mono text-slate-900 font-semibold">
                          {student.admission_number}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-600">{student.roll_number}</td>
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap font-semibold text-slate-900">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium whitespace-nowrap">
                            {className} {sectionName ? `- ${sectionName}` : ''}
                          </span>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                          <div className="text-slate-900 font-medium whitespace-nowrap">{student.guardian_name}</div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{student.guardian_phone}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-500">{student.admission_date}</td>
                        <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize whitespace-nowrap">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            {student.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
          {filteredTeachers.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No Faculty Records Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {initialTeachers.length === 0
                  ? 'Your Supabase teachers table is ready. Click "Onboard Teacher" to add your first faculty member!'
                  : 'No teachers matched your search criteria.'}
              </p>
              <button
                type="button"
                onClick={() => setIsTeacherModalOpen(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
              >
                + Onboard Teacher
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Employee ID</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Faculty Name</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Qualification</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Specialization</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Contact</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Joining Date</th>
                    <th className="px-4 sm:px-5 py-3.5 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap font-mono text-slate-900 font-semibold">
                        {teacher.employee_id}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap font-semibold text-slate-900">
                        {teacher.first_name} {teacher.last_name}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-600">{teacher.qualification || '—'}</td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-indigo-600 font-medium">
                        {teacher.specialization || 'General'}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-600 whitespace-nowrap">
                          <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{teacher.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-slate-500">{teacher.joining_date}</td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          <CheckCircle2 className="h-3 w-3 shrink-0" />
                          {teacher.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <NewStudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        classes={classes}
        onSuccess={() => router.refresh()}
        onAddClass={() => setIsAddClassModalOpen(true)}
      />

      <NewTeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSuccess={() => router.refresh()}
      />

      <AddClassModal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        onSuccess={() => { router.refresh(); setIsAddClassModalOpen(false); }}
      />
    </div>
  );
}
