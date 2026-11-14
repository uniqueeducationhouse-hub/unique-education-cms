'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, GraduationCap, Settings } from 'lucide-react';
import { useSchoolSettings } from '@/lib/school-settings';

interface PrintableReportCardProps {
  studentId: string;
}

export function PrintableReportCard({ studentId }: PrintableReportCardProps) {
  const { settings } = useSchoolSettings();

  const reportData = {
    session: 'Academic Session 2026-2027',
    term: 'Midterm Examination 2026-27',
    student: {
      name:
        studentId === 's-002'
          ? 'Aaliyah Khan'
          : studentId === 's-003'
          ? 'Muhammad Bilal'
          : studentId === 's-004'
          ? 'Zainab Fatima'
          : 'Sophia Martinez',
      fatherName:
        studentId === 's-002'
          ? 'Farhan Khan'
          : studentId === 's-003'
          ? 'Tariq Mahmood'
          : studentId === 's-004'
          ? 'Imran Ashraf'
          : 'Carlos Martinez',
      rollNumber: studentId === 's-002' ? '1002' : studentId === 's-003' ? '1003' : '1001',
      admissionNumber:
        studentId === 's-002'
          ? 'ADM-2026-10-002'
          : studentId === 's-003'
          ? 'ADM-2026-10-003'
          : 'ADM-2026-10-001',
      className: 'Class 10',
      section: 'Section A',
      dob: '14 May 2011',
      attendance: '98.2% (110 / 112 Days)',
    },
    subjects: [
      {
        name: 'English Language & Literature',
        max: 75,
        pass: 25,
        obtained: 70,
        grade: 'A+',
        remarks: 'Excellent comprehension & expression',
      },
      {
        name: 'Urdu Lazmi (Compulsory)',
        max: 75,
        pass: 25,
        obtained: 68,
        grade: 'A',
        remarks: 'Very good handwriting & grammar',
      },
      {
        name: 'Mathematics (Science Group)',
        max: 75,
        pass: 25,
        obtained: 72,
        grade: 'A+',
        remarks: 'Exceptional analytical & problem-solving skills',
      },
      {
        name: 'Physics (Theory + Practical)',
        max: 75,
        pass: 25,
        obtained: 69,
        grade: 'A',
        remarks: 'Strong conceptual clarity',
      },
      {
        name: 'Chemistry',
        max: 75,
        pass: 25,
        obtained: 67,
        grade: 'A',
        remarks: 'Good experimental & formula knowledge',
      },
      {
        name: 'Biology / Computer Science',
        max: 75,
        pass: 25,
        obtained: 71,
        grade: 'A+',
        remarks: 'Thorough subject grasp',
      },
      {
        name: 'Pakistan Studies (Mutala-e-Pakistan)',
        max: 50,
        pass: 17,
        obtained: 46,
        grade: 'A+',
        remarks: 'Active participation in discussions',
      },
      {
        name: 'Tarjuma-tul-Quran Majeed',
        max: 50,
        pass: 17,
        obtained: 48,
        grade: 'A+',
        remarks: 'Excellent recitation & translation',
      },
    ],
    totalMax: 500,
    totalObtained: 511 > 500 ? 465 : 465,
    percentage: 93.0,
    finalGrade: 'A+',
    gpa: 4.0,
    position: '1st in Class (Distinction)',
    generalRemarks:
      'The student has displayed exemplary discipline, remarkable intellectual curiosity, and stellar moral conduct throughout the term. Keep it up!',
  };

  const totalMax = reportData.subjects.reduce((sum, s) => sum + s.max, 0);
  const totalObt = reportData.subjects.reduce((sum, s) => sum + s.obtained, 0);
  const pct = Number(((totalObt / totalMax) * 100).toFixed(1));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (No Print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/exams"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Official Academic Report Card</h2>
            <p className="text-xs text-slate-500">
              Student: {reportData.student.name} • A4 Portrait Official Report Sheet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <Settings className="h-3.5 w-3.5 text-indigo-600" />
            School Settings
          </Link>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Printer className="h-4 w-4" />
            Print Report Card (A4 Portrait)
          </button>
        </div>
      </div>

      {/* Official Printable Report Card Sheet */}
      <div className="bg-white max-w-4xl mx-auto p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-lg print:p-0 print:border-none print:shadow-none print:max-w-none report-card-sheet text-slate-900 font-sans">
        {/* Header with School Crest / Logo */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
          <div className="flex justify-center mb-2">
            {settings.logoUrl ? (
              <div className="h-16 w-16 rounded-xl bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.logoUrl}
                  alt={settings.schoolName}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="h-9 w-9" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900 leading-tight">
            {settings.schoolName}
          </h1>
          <p className="text-xs text-slate-600 font-medium tracking-wide mt-0.5">
            {settings.tagline}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {settings.campusAddress} • Ph: {settings.phone}
          </p>

          <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">
            {reportData.term} • {reportData.session}
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-5 text-xs">
          <div>
            <span className="text-slate-500 block text-[9.5px] uppercase font-bold">Student Full Name</span>
            <span className="font-bold text-slate-900 text-sm">{reportData.student.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9.5px] uppercase font-bold">Father's Name</span>
            <span className="font-bold text-slate-900">{reportData.student.fatherName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9.5px] uppercase font-bold">Class &amp; Section</span>
            <span className="font-bold text-slate-900">{reportData.student.className} - {reportData.student.section}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9.5px] uppercase font-bold">Roll # / Admission #</span>
            <span className="font-mono font-bold text-slate-900">{reportData.student.rollNumber} / {reportData.student.admissionNumber}</span>
          </div>
        </div>

        {/* Subject-wise Marks Table */}
        <div className="mb-5">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10.5px]">
                <th className="p-2.5 border border-slate-300">Sr. Subject Title</th>
                <th className="p-2.5 border border-slate-300 text-center">Max</th>
                <th className="p-2.5 border border-slate-300 text-center">Pass</th>
                <th className="p-2.5 border border-slate-300 text-center">Obtained</th>
                <th className="p-2.5 border border-slate-300 text-center">%</th>
                <th className="p-2.5 border border-slate-300 text-center">Grade</th>
                <th className="p-2.5 border border-slate-300">Subject Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {reportData.subjects.map((sub, idx) => {
                const subPct = Math.round((sub.obtained / sub.max) * 100);
                return (
                  <tr key={sub.name} className="hover:bg-slate-50/50">
                    <td className="p-2 border border-slate-300 font-semibold text-slate-900">
                      {idx + 1}. {sub.name}
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600 font-mono">{sub.max}</td>
                    <td className="p-2 border border-slate-300 text-center text-slate-600 font-mono">{sub.pass}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900 font-mono text-xs">
                      {sub.obtained}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono text-slate-700">{subPct}%</td>
                    <td className="p-2 border border-slate-300 text-center">
                      <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 text-[10px]">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-600 text-[10.5px] italic">{sub.remarks}</td>
                  </tr>
                );
              })}

              {/* Totals Row */}
              <tr className="bg-slate-100 font-bold text-slate-900 text-xs">
                <td className="p-2.5 border border-slate-300 uppercase">Grand Total (Aggregate)</td>
                <td className="p-2.5 border border-slate-300 text-center font-mono">{totalMax}</td>
                <td className="p-2.5 border border-slate-300 text-center font-mono">170</td>
                <td className="p-2.5 border border-slate-300 text-center text-indigo-700 font-mono font-black text-sm">
                  {totalObt}
                </td>
                <td className="p-2.5 border border-slate-300 text-center font-mono text-indigo-700 font-bold">
                  {pct}%
                </td>
                <td className="p-2.5 border border-slate-300 text-center text-indigo-700 font-black text-xs">
                  {reportData.finalGrade}
                </td>
                <td className="p-2.5 border border-slate-300 text-emerald-700 font-bold">Passed with Distinction</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Overall Assessment Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-5 text-center">
          <div>
            <span className="text-[9.5px] text-slate-500 uppercase font-bold">Percentage</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{pct}%</p>
          </div>
          <div>
            <span className="text-[9.5px] text-slate-500 uppercase font-bold">Final Grade</span>
            <p className="text-lg font-black text-indigo-600 mt-0.5">{reportData.finalGrade}</p>
          </div>
          <div>
            <span className="text-[9.5px] text-slate-500 uppercase font-bold">GPA / Point</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{reportData.gpa.toFixed(1)} / 4.0</p>
          </div>
          <div>
            <span className="text-[9.5px] text-slate-500 uppercase font-bold">Position in Class</span>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{reportData.position}</p>
          </div>
        </div>

        {/* General Principal Remarks */}
        <div className="p-3 border border-slate-200 rounded-lg mb-8 text-xs bg-white">
          <span className="font-bold text-slate-900 block mb-0.5">Principal / Faculty Evaluation Remarks:</span>
          <p className="text-slate-600 italic leading-relaxed">"{reportData.generalRemarks}"</p>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-6 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
          <div>
            <div className="w-36 mx-auto border-b-2 border-slate-900 mb-1.5 h-6" />
            <p className="font-bold text-slate-900">Class Teacher</p>
            <p className="text-[9.5px] text-slate-400">Signature &amp; Date</p>
          </div>

          <div>
            <div className="h-16 w-16 mx-auto border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-[9px] text-slate-400 mb-1.5">
              SEAL
            </div>
            <p className="font-bold text-slate-900">Official School Stamp</p>
          </div>

          <div>
            <div className="w-36 mx-auto border-b-2 border-slate-900 mb-1.5 h-6" />
            <p className="font-bold text-slate-900">{settings.principalName || 'Principal'}</p>
            <p className="text-[9.5px] text-slate-400">Principal / Headmaster</p>
          </div>
        </div>
      </div>
    </div>
  );
}
