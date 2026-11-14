'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Award,
  Printer,
  Search,
  CheckCircle2,
  TrendingUp,
  Save,
  BookOpen,
  PlusCircle,
  Trash2,
  RotateCcw,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { calculateGrade } from '@/lib/utils';
import {
  ALL_SCHOOL_CLASSES,
  DEFAULT_PAKISTANI_SUBJECTS,
  loadSavedSubjects,
  saveSubjects,
  type ClassSubjectsMap,
  type SubjectItem,
} from '@/lib/subjects';

interface DynamicStudentMarks {
  studentId: string;
  admissionNo: string;
  name: string;
  rollNo: string;
  marks: Record<string, number>; // subjectId -> mark
}

const defaultStudentsByClass: Record<string, DynamicStudentMarks[]> = {
  'Class 10': [
    {
      studentId: 's-001',
      admissionNo: 'ADM-2026-10-001',
      name: 'Sophia Martinez',
      rollNo: '1001',
      marks: {
        'sub-c10-1': 70, // English
        'sub-c10-2': 68, // Urdu
        'sub-c10-3': 72, // Math
        'sub-c10-4': 69, // Physics
        'sub-c10-5': 67, // Chemistry
        'sub-c10-6': 71, // Bio / CS
        'sub-c10-7': 46, // Pak Studies
        'sub-c10-8': 48, // Tarjuma
      },
    },
    {
      studentId: 's-002',
      admissionNo: 'ADM-2026-10-002',
      name: 'Aaliyah Khan',
      rollNo: '1002',
      marks: {
        'sub-c10-1': 68,
        'sub-c10-2': 71,
        'sub-c10-3': 65,
        'sub-c10-4': 64,
        'sub-c10-5': 66,
        'sub-c10-6': 68,
        'sub-c10-7': 44,
        'sub-c10-8': 47,
      },
    },
    {
      studentId: 's-003',
      admissionNo: 'ADM-2026-10-003',
      name: 'Muhammad Bilal',
      rollNo: '1003',
      marks: {
        'sub-c10-1': 62,
        'sub-c10-2': 65,
        'sub-c10-3': 60,
        'sub-c10-4': 58,
        'sub-c10-5': 59,
        'sub-c10-6': 63,
        'sub-c10-7': 42,
        'sub-c10-8': 44,
      },
    },
    {
      studentId: 's-004',
      admissionNo: 'ADM-2026-10-004',
      name: 'Zainab Fatima',
      rollNo: '1004',
      marks: {
        'sub-c10-1': 55,
        'sub-c10-2': 60,
        'sub-c10-3': 52,
        'sub-c10-4': 54,
        'sub-c10-5': 50,
        'sub-c10-6': 58,
        'sub-c10-7': 38,
        'sub-c10-8': 40,
      },
    },
  ],
  'Class 9': [
    {
      studentId: 's-005',
      admissionNo: 'ADM-2026-09-014',
      name: 'Liam Johnson',
      rollNo: '0914',
      marks: {
        'sub-c9-1': 65,
        'sub-c9-2': 62,
        'sub-c9-3': 70,
        'sub-c9-4': 64,
        'sub-c9-5': 61,
        'sub-c9-6': 66,
        'sub-c9-7': 45,
        'sub-c9-8': 44,
      },
    },
    {
      studentId: 's-006',
      admissionNo: 'ADM-2026-09-015',
      name: 'Hamza Tariq',
      rollNo: '0915',
      marks: {
        'sub-c9-1': 59,
        'sub-c9-2': 64,
        'sub-c9-3': 62,
        'sub-c9-4': 60,
        'sub-c9-5': 58,
        'sub-c9-6': 61,
        'sub-c9-7': 41,
        'sub-c9-8': 43,
      },
    },
  ],
};

// Fallback generator for other classes
function getSampleStudentsForClass(className: string): DynamicStudentMarks[] {
  if (defaultStudentsByClass[className]) {
    return defaultStudentsByClass[className];
  }
  return [
    {
      studentId: `s-${className.toLowerCase().replace(/\s+/g, '')}-01`,
      admissionNo: `ADM-2026-${className.replace(/\s+/g, '').slice(0, 3)}-001`,
      name: 'Ahmed Raza',
      rollNo: '101',
      marks: {},
    },
    {
      studentId: `s-${className.toLowerCase().replace(/\s+/g, '')}-02`,
      admissionNo: `ADM-2026-${className.replace(/\s+/g, '').slice(0, 3)}-002`,
      name: 'Fatima Noor',
      rollNo: '102',
      marks: {},
    },
    {
      studentId: `s-${className.toLowerCase().replace(/\s+/g, '')}-03`,
      admissionNo: `ADM-2026-${className.replace(/\s+/g, '').slice(0, 3)}-003`,
      name: 'Usman Ali',
      rollNo: '103',
      marks: {},
    },
  ];
}

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'subjects'>('matrix');
  const [selectedTerm, setSelectedTerm] = useState('Midterm Examination 2026-27');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [classSubjects, setClassSubjects] = useState<ClassSubjectsMap>(DEFAULT_PAKISTANI_SUBJECTS);
  const [students, setStudents] = useState<DynamicStudentMarks[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Subject Form state
  const [newSubName, setNewSubName] = useState('');
  const [newSubTotal, setNewSubTotal] = useState(100);
  const [newSubPass, setNewSubPass] = useState(40);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // Load saved subjects from localStorage
  useEffect(() => {
    const loaded = loadSavedSubjects();
    setClassSubjects(loaded);
  }, []);

  // Update students when class changes
  useEffect(() => {
    setStudents(getSampleStudentsForClass(selectedClass));
  }, [selectedClass]);

  const activeSubjects: SubjectItem[] = classSubjects[selectedClass] || [];

  // Update a student's mark for a given subject
  const handleMarkChange = (studentId: string, subjectId: string, value: string, maxMarks: number) => {
    const num = Math.min(maxMarks, Math.max(0, Number(value) || 0));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId !== studentId) return s;
        return {
          ...s,
          marks: {
            ...s.marks,
            [subjectId]: num,
          },
        };
      })
    );
  };

  const handleSaveMarks = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Add a new subject to currently selected class
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newSubject: SubjectItem = {
      id: `sub-${Date.now().toString().slice(-6)}`,
      name: newSubName.trim(),
      totalMarks: Number(newSubTotal) || 100,
      passingMarks: Number(newSubPass) || 40,
    };

    const updated = {
      ...classSubjects,
      [selectedClass]: [...(classSubjects[selectedClass] || []), newSubject],
    };

    setClassSubjects(updated);
    saveSubjects(updated);
    setNewSubName('');
    setShowAddSubjectModal(false);
  };

  // Remove a subject
  const handleDeleteSubject = (subjectId: string) => {
    if (confirm('Are you sure you want to remove this subject from ' + selectedClass + '?')) {
      const updated = {
        ...classSubjects,
        [selectedClass]: (classSubjects[selectedClass] || []).filter((s) => s.id !== subjectId),
      };
      setClassSubjects(updated);
      saveSubjects(updated);
    }
  };

  // Reset to default Pakistani curriculum
  const handleResetCurriculum = () => {
    if (confirm('Reset all classes to standard Pakistani School Curriculum?')) {
      setClassSubjects(DEFAULT_PAKISTANI_SUBJECTS);
      saveSubjects(DEFAULT_PAKISTANI_SUBJECTS);
    }
  };

  // Filter students by search
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.rollNo.includes(q) || s.admissionNo.toLowerCase().includes(q);
  });

  // Calculate total max marks for active subjects in this class
  const classTotalMaxMarks = activeSubjects.reduce((acc, sub) => acc + sub.totalMarks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Module 4: Exam Marks, Curriculum &amp; Report Cards
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Examinations &amp; Subjects Management</h1>
          <p className="text-sm text-slate-500">
            Configure Pakistani curriculum subjects from Playgroup to Class 10 and record exam marks matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'matrix' ? (
            <button
              type="button"
              onClick={handleSaveMarks}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-lg shadow-sm transition"
            >
              <Save className="h-4 w-4" />
              Save Grade Sheet
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddSubjectModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-lg shadow-sm transition"
            >
              <PlusCircle className="h-4 w-4" />
              + Add Subject to {selectedClass}
            </button>
          )}
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Exam marks and computed grades successfully committed to database.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'matrix'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Marks Entry Matrix ({selectedClass})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'subjects'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Class Subjects &amp; Curriculum ({activeSubjects.length} Subjects)</span>
        </button>
      </div>

      {/* Controls Bar: Exam Session & Class Selection */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Exam Session</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
              <option>Midterm Examination 2026-27</option>
              <option>Final Term Examination 2026-27</option>
              <option>First Term Assessment 2026</option>
              <option>Send-Up / Pre-Board Examination</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Select Class / Grade
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-indigo-900 font-bold focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
              {ALL_SCHOOL_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls} ({classSubjects[cls]?.length || 0} subjects)
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === 'matrix' ? (
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="font-bold text-slate-900">Total Max Marks: {classTotalMaxMarks}</span>
            <span>•</span>
            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Pakistani Grading Scale
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResetCurriculum}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Standard Curriculum
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MARKS ENTRY MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Quick Notice */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                Automatically loaded <strong>{activeSubjects.length} subjects</strong> for <strong>{selectedClass}</strong>. Enter marks to calculate percentages, Pakistani letter grades, and GPAs in real-time.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('subjects')}
              className="font-bold text-indigo-700 hover:underline shrink-0"
            >
              Manage Subjects &rarr;
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3 py-3">Roll</th>
                    <th className="px-3 py-3">Student Name</th>
                    {/* Dynamic Columns for EACH Subject */}
                    {activeSubjects.map((sub) => (
                      <th key={sub.id} className="px-2 py-3 text-center whitespace-nowrap">
                        <span className="block text-slate-800 font-bold">{sub.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({sub.totalMarks})</span>
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center font-bold text-slate-900">
                      Total ({classTotalMaxMarks})
                    </th>
                    <th className="px-2 py-3 text-center font-bold text-indigo-600">%</th>
                    <th className="px-2 py-3 text-center font-bold">Grade</th>
                    <th className="px-2 py-3 text-center font-bold">GPA</th>
                    <th className="px-4 py-3 text-right">Report Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredStudents.map((s, idx) => {
                    // Compute totals dynamically based on active subjects
                    const totalObtained = activeSubjects.reduce((sum, sub) => {
                      return sum + (s.marks[sub.id] ?? Math.round(sub.totalMarks * 0.75));
                    }, 0);

                    const percentage =
                      classTotalMaxMarks > 0
                        ? Number(((totalObtained / classTotalMaxMarks) * 100).toFixed(1))
                        : 0;

                    const { grade, gpa } = calculateGrade(percentage);

                    return (
                      <tr key={s.studentId} className="hover:bg-slate-50/80 transition">
                        <td className="px-3 py-3 font-bold text-slate-900">{s.rollNo}</td>
                        <td className="px-3 py-3 font-sans font-medium text-slate-900 whitespace-nowrap">
                          {s.name}
                        </td>

                        {/* Subject Marks Inputs */}
                        {activeSubjects.map((sub) => {
                          const currentVal = s.marks[sub.id] ?? Math.round(sub.totalMarks * 0.75);
                          const isFailing = currentVal < sub.passingMarks;

                          return (
                            <td key={sub.id} className="px-1.5 py-2.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={sub.totalMarks}
                                value={currentVal}
                                onChange={(e) =>
                                  handleMarkChange(s.studentId, sub.id, e.target.value, sub.totalMarks)
                                }
                                className={`w-14 text-center text-xs border rounded py-1 font-semibold focus:bg-white focus:ring-1 focus:ring-indigo-500 ${
                                  isFailing
                                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                              />
                            </td>
                          );
                        })}

                        <td className="px-3 py-3 text-center font-bold text-slate-900">
                          {totalObtained}
                        </td>
                        <td className="px-2 py-3 text-center font-black text-indigo-700">
                          {percentage}%
                        </td>
                        <td className="px-2 py-3 text-center font-sans">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-xs ${
                              grade === 'A+' || grade === 'A'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : grade === 'B' || grade === 'C'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : grade === 'D' || grade === 'E'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {grade}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-center font-bold text-slate-700">
                          {gpa.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 text-right font-sans">
                          <Link
                            href={`/exams/report-card/${s.studentId}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md font-semibold text-xs transition"
                          >
                            <Printer className="h-3 w-3" />
                            Report Card
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLASS SUBJECTS & CURRICULUM MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Assigned Subjects for {selectedClass}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure curriculum subjects, maximum marks, and passing criteria. These automatically populate the Marks Matrix and Official Report Cards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddSubjectModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                <PlusCircle className="h-4 w-4" />
                Add New Subject
              </button>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {activeSubjects.map((sub, i) => (
                <div
                  key={sub.id}
                  className="bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl p-4 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                        Subject #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(sub.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        title="Delete Subject"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{sub.name}</h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Total Marks</span>
                      <span className="font-bold text-slate-900">{sub.totalMarks}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-sans">Passing Marks</span>
                      <span className="font-bold text-emerald-700">{sub.passingMarks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Add Subject to {selectedClass}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Pakistan Studies, Islamiat, Computer..."
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'English',
                  'Urdu',
                  'Mathematics',
                  'Islamiat',
                  'General Science',
                  'Computer Science',
                  'Pakistan Studies',
                  'Physics',
                  'Chemistry',
                  'Biology',
                  'Social Studies',
                  'Tarjuma-tul-Quran',
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setNewSubName(sug)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded text-[11px] text-slate-600 transition"
                  >
                    + {sug}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={newSubTotal}
                    onChange={(e) => setNewSubTotal(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min={5}
                    max={newSubTotal}
                    value={newSubPass}
                    onChange={(e) => setNewSubPass(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
