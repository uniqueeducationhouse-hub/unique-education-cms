import React from 'react';
import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { PrintButton } from '@/components/ui/PrintButton';

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export function generateStaticParams() {
  return [
    { studentId: 's-001' },
    { studentId: 's-002' },
    { studentId: 's-003' },
    { studentId: 's-004' },
  ];
}

export default async function PrintableReportCardPage({ params }: PageProps) {
  const { studentId } = await params;

  const reportData = {
    institution: 'APEX ACADEMY SENIOR SCHOOL',
    tagline: 'Affiliated with Central Board of Secondary Education • ISO 9001:2020 Certified',
    session: 'Academic Session 2026-2027',
    term: 'First Term Examination Report',
    student: {
      name: studentId === 's-002' ? 'Aaliyah Khan' : 'Sophia Martinez',
      rollNumber: studentId === 's-002' ? '1002' : '1001',
      admissionNumber: studentId === 's-002' ? 'ADM-2026-10-002' : 'ADM-2026-10-001',
      class: 'Grade 10',
      section: 'Section A',
      dob: 'May 14, 2011',
      attendance: '98.2% (110 / 112 Days)',
    },
    subjects: [
      { name: 'Mathematics & Algebra', max: 100, pass: 40, obtained: 94, grade: 'A+', remarks: 'Exceptional problem-solving skills' },
      { name: 'Physical & Biological Sciences', max: 100, pass: 40, obtained: 92, grade: 'A+', remarks: 'Thorough conceptual understanding' },
      { name: 'English Literature & Composition', max: 100, pass: 40, obtained: 88, grade: 'A', remarks: 'Good critical reading & writing' },
      { name: 'World History & Social Studies', max: 100, pass: 40, obtained: 90, grade: 'A+', remarks: 'Active classroom participation' },
    ],
    totalMax: 400,
    totalObtained: 364,
    percentage: 91.0,
    finalGrade: 'A+',
    gpa: 4.0,
    position: '1st in Class',
    generalRemarks: 'Sophia demonstrates exemplary academic discipline and outstanding moral conduct. Keep up the high standards!',
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (No Print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
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
              Student: {reportData.student.name} • Standard A4 Portrait Printable Sheet
            </p>
          </div>
        </div>

        <PrintButton label="Print Report Card (A4 Portrait)" />
      </div>

      {/* Official Printable Report Card Sheet */}
      <div className="bg-white max-w-4xl mx-auto p-10 rounded-2xl border border-slate-300 shadow-lg print:p-0 print:border-none print:shadow-none print:max-w-none report-card-sheet text-slate-900 font-sans">
        {/* Header with School Crest */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
            {reportData.institution}
          </h1>
          <p className="text-xs text-slate-600 font-medium tracking-wide mt-0.5">
            {reportData.tagline}
          </p>
          <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">
            {reportData.term} • {reportData.session}
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Full Name</span>
            <span className="font-bold text-slate-900 text-sm">{reportData.student.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Admission / Roll No</span>
            <span className="font-bold text-slate-900">{reportData.student.admissionNumber} / {reportData.student.rollNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class & Section</span>
            <span className="font-bold text-slate-900">{reportData.student.class} - {reportData.student.section}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Term Attendance</span>
            <span className="font-bold text-emerald-700">{reportData.student.attendance}</span>
          </div>
        </div>

        {/* Subject-wise Marks Table */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3 border border-slate-300">Subject</th>
                <th className="p-3 border border-slate-300 text-center">Max Marks</th>
                <th className="p-3 border border-slate-300 text-center">Pass Marks</th>
                <th className="p-3 border border-slate-300 text-center">Marks Obtained</th>
                <th className="p-3 border border-slate-300 text-center">Grade</th>
                <th className="p-3 border border-slate-300">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reportData.subjects.map((sub) => (
                <tr key={sub.name} className="hover:bg-slate-50/50">
                  <td className="p-3 border border-slate-300 font-semibold text-slate-900">{sub.name}</td>
                  <td className="p-3 border border-slate-300 text-center text-slate-600">{sub.max}</td>
                  <td className="p-3 border border-slate-300 text-center text-slate-600">{sub.pass}</td>
                  <td className="p-3 border border-slate-300 text-center font-bold text-slate-900 font-mono text-sm">
                    {sub.obtained}
                  </td>
                  <td className="p-3 border border-slate-300 text-center">
                    <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="p-3 border border-slate-300 text-slate-600 text-[11px]">{sub.remarks}</td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-slate-100/80 font-bold">
                <td className="p-3 border border-slate-300 uppercase">Grand Total</td>
                <td className="p-3 border border-slate-300 text-center">{reportData.totalMax}</td>
                <td className="p-3 border border-slate-300 text-center">160</td>
                <td className="p-3 border border-slate-300 text-center text-indigo-700 font-mono text-base">
                  {reportData.totalObtained}
                </td>
                <td className="p-3 border border-slate-300 text-center text-indigo-700 text-sm">
                  {reportData.finalGrade}
                </td>
                <td className="p-3 border border-slate-300 text-slate-700">Passed with Distinction</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Overall Assessment Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-center">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Percentage</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{reportData.percentage}%</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Overall Grade</span>
            <p className="text-xl font-black text-indigo-600 mt-0.5">{reportData.finalGrade}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Grade Point (GPA)</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{reportData.gpa.toFixed(1)} / 4.0</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Class Position</span>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{reportData.position}</p>
          </div>
        </div>

        {/* General Principal Remarks */}
        <div className="p-3 border border-slate-200 rounded-lg mb-10 text-xs bg-white">
          <span className="font-bold text-slate-900 block mb-0.5">Faculty Evaluation Remarks:</span>
          <p className="text-slate-600 italic leading-relaxed">"{reportData.generalRemarks}"</p>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
          <div>
            <div className="w-36 mx-auto border-b-2 border-slate-900 mb-2" />
            <p className="font-bold">Class Teacher</p>
            <p className="text-[10px] text-slate-400">Signature & Date</p>
          </div>

          <div>
            <div className="h-16 w-16 mx-auto border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-[9px] text-slate-400 mb-2">
              SEAL
            </div>
            <p className="font-bold">Official School Stamp</p>
          </div>

          <div>
            <div className="w-36 mx-auto border-b-2 border-slate-900 mb-2" />
            <p className="font-bold">Principal / Headmaster</p>
            <p className="text-[10px] text-slate-400">Signature & Date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
