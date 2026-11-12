'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Award,
  Printer,
  Search,
  CheckCircle2,
  TrendingUp,
  Save,
} from 'lucide-react';
import { calculateGrade } from '@/lib/utils';

interface StudentExamRow {
  studentId: string;
  admissionNo: string;
  name: string;
  rollNo: string;
  math: number;
  science: number;
  english: number;
  history: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  position: string;
}

const initialExamStudents: StudentExamRow[] = [
  {
    studentId: 's-001',
    admissionNo: 'ADM-2026-10-001',
    name: 'Sophia Martinez',
    rollNo: '1001',
    math: 94,
    science: 92,
    english: 88,
    history: 90,
    totalMarks: 364,
    percentage: 91.0,
    grade: 'A+',
    gpa: 4.0,
    position: '1st',
  },
  {
    studentId: 's-002',
    admissionNo: 'ADM-2026-10-002',
    name: 'Aaliyah Khan',
    rollNo: '1002',
    math: 88,
    science: 85,
    english: 92,
    history: 87,
    totalMarks: 352,
    percentage: 88.0,
    grade: 'A',
    gpa: 3.7,
    position: '2nd',
  },
  {
    studentId: 's-003',
    admissionNo: 'ADM-2026-10-003',
    name: 'Benjamin Chen',
    rollNo: '1003',
    math: 78,
    science: 82,
    english: 74,
    history: 80,
    totalMarks: 314,
    percentage: 78.5,
    grade: 'B',
    gpa: 3.0,
    position: '3rd',
  },
  {
    studentId: 's-004',
    admissionNo: 'ADM-2026-10-004',
    name: 'Chloe Taylor',
    rollNo: '1004',
    math: 65,
    science: 70,
    english: 68,
    history: 62,
    totalMarks: 265,
    percentage: 66.2,
    grade: 'C',
    gpa: 2.0,
    position: '4th',
  },
];

export default function ExamsPage() {
  const [selectedTerm, setSelectedTerm] = useState('Midterm Examination 2026-27');
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [students, setStudents] = useState<StudentExamRow[]>(initialExamStudents);
  const [isSaved, setIsSaved] = useState(false);

  // Update a single mark and recalculate
  const handleMarkChange = (
    studentId: string,
    subject: 'math' | 'science' | 'english' | 'history',
    value: string
  ) => {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId !== studentId) return s;
        const updated = { ...s, [subject]: num };
        const total = updated.math + updated.science + updated.english + updated.history;
        const pct = total / 4;
        const { grade, gpa } = calculateGrade(pct);
        return {
          ...updated,
          totalMarks: total,
          percentage: Number(pct.toFixed(1)),
          grade,
          gpa,
        };
      })
    );
  };

  const handleSaveMarks = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Module 4: Exam Marks & Report Cards
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Examinations & Grade Sheets</h1>
          <p className="text-sm text-slate-500">
            Spreadsheet-style bulk marks entry matrix, automated GPA calculation, and printable official report cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveMarks}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow transition"
          >
            <Save className="h-4 w-4" />
            Save Grade Sheet
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Exam marks and computed grades successfully committed to database.</span>
        </div>
      )}

      {/* Selector Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Exam Session</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium"
            >
              <option>Midterm Examination 2026-27</option>
              <option>Final Term Examination 2026-27</option>
              <option>Quarterly Assessment 1</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium"
            >
              <option>Grade 10</option>
              <option>Grade 9</option>
              <option>Grade 8</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Max Marks Per Subject: 100</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">Pass: 40%</span>
        </div>
      </div>

      {/* Spreadsheet Marks Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-3 py-3 text-center">Math (100)</th>
                <th className="px-3 py-3 text-center">Science (100)</th>
                <th className="px-3 py-3 text-center">English (100)</th>
                <th className="px-3 py-3 text-center">History (100)</th>
                <th className="px-3 py-3 text-center">Total (400)</th>
                <th className="px-3 py-3 text-center">%</th>
                <th className="px-3 py-3 text-center">Grade</th>
                <th className="px-3 py-3 text-center">GPA</th>
                <th className="px-4 py-3 text-right">Official Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {students.map((s) => (
                <tr key={s.studentId} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.rollNo}</td>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900">{s.name}</td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      value={s.math}
                      onChange={(e) => handleMarkChange(s.studentId, 'math', e.target.value)}
                      className="w-16 text-center text-xs bg-slate-50 border border-slate-200 rounded py-1 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      value={s.science}
                      onChange={(e) => handleMarkChange(s.studentId, 'science', e.target.value)}
                      className="w-16 text-center text-xs bg-slate-50 border border-slate-200 rounded py-1 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      value={s.english}
                      onChange={(e) => handleMarkChange(s.studentId, 'english', e.target.value)}
                      className="w-16 text-center text-xs bg-slate-50 border border-slate-200 rounded py-1 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      value={s.history}
                      onChange={(e) => handleMarkChange(s.studentId, 'history', e.target.value)}
                      className="w-16 text-center text-xs bg-slate-50 border border-slate-200 rounded py-1 font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-slate-900">{s.totalMarks}</td>
                  <td className="px-3 py-3 text-center font-bold text-indigo-600">{s.percentage}%</td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {s.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-slate-700">{s.gpa.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right font-sans">
                    <Link
                      href={`/exams/report-card/${s.studentId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md font-semibold text-xs transition"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print Card
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
