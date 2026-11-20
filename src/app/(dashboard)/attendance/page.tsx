'use client';

import { useState } from 'react';
import {
  CalendarCheck2,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  CheckCheck,
} from 'lucide-react';
import type { AttendanceStatus } from '@/types/database.types';

interface StudentRosterItem {
  id: string;
  roll_number: string;
  name: string;
  status: AttendanceStatus;
  remarks: string;
}

const initialRoster: StudentRosterItem[] = [
  { id: 's-001', roll_number: '1001', name: 'Sophia Martinez', status: 'present', remarks: '' },
  { id: 's-002', roll_number: '1002', name: 'Aaliyah Khan', status: 'present', remarks: '' },
  { id: 's-003', roll_number: '1003', name: 'Benjamin Chen', status: 'present', remarks: '' },
  { id: 's-004', roll_number: '1004', name: 'Chloe Taylor', status: 'absent', remarks: 'Sick leave informed' },
  { id: 's-005', roll_number: '1005', name: 'Daniel Wilson', status: 'late', remarks: 'Bus breakdown' },
  { id: 's-006', roll_number: '1006', name: 'Elena Gomez', status: 'present', remarks: '' },
  { id: 's-007', roll_number: '1007', name: 'Farhan Zaidi', status: 'excused', remarks: 'Sports tournament' },
  { id: 's-008', roll_number: '1008', name: 'Grace Hopper', status: 'present', remarks: '' },
];

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState('2026-11-12');
  const [selectedClass, setSelectedClass] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [roster, setRoster] = useState<StudentRosterItem[]>(initialRoster);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Status updates
  const setStatus = (id: string, status: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((item) => ({ ...item, status: 'present' })));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Stats calculation
  const totalStudents = roster.length;
  const presentCount = roster.filter((r) => r.status === 'present').length;
  const absentCount = roster.filter((r) => r.status === 'absent').length;
  const lateCount = roster.filter((r) => r.status === 'late').length;
  const excusedCount = roster.filter((r) => r.status === 'excused').length;
  const attendanceRate = totalStudents > 0
    ? (((presentCount + lateCount * 0.5) / totalStudents) * 100).toFixed(1)
    : '0';

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Module 2: Daily Attendance
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Class Attendance Roster</h1>
          <p className="text-sm text-slate-500">
            Rapid single-click daily attendance marking, automated rate calculations, and absence records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllPresent}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-lg transition"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow transition"
          >
            <Save className="h-4 w-4" />
            Save Attendance
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Attendance records successfully saved to database for {selectedClass} ({selectedSection}).</span>
        </div>
      )}

      {/* Date & Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Grade / Class</label>
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

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium"
            >
              <option>Section A</option>
              <option>Section B</option>
            </select>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance Rate</span>
            <span className="font-extrabold text-slate-900 text-lg leading-none">{attendanceRate}%</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold">{presentCount} P</span>
            <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-semibold">{absentCount} A</span>
            <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-semibold">{lateCount} L</span>
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold">{excusedCount} E</span>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap">Roll No</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Student Name</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center">Status Toggle</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roster.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {student.roll_number}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900 text-sm whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setStatus(student.id, 'present')}
                        className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
                          student.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(student.id, 'absent')}
                        className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
                          student.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(student.id, 'late')}
                        className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
                          student.status === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(student.id, 'excused')}
                        className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
                          student.status === 'excused'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Excused
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Optional notes or excuse reason..."
                      value={student.remarks}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRoster((prev) =>
                          prev.map((i) => (i.id === student.id ? { ...i, remarks: val } : i))
                        );
                      }}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
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
