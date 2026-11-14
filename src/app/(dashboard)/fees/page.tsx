'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Coins,
  PlusCircle,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const mockVouchers = [
  {
    id: 'vch-001',
    voucher_number: 'VCH-202611-1001',
    student_name: 'Sophia Martinez',
    father_name: 'Carlos Martinez',
    roll_number: '1001',
    class: 'Class 10-A',
    billing_month: 'November 2026',
    due_date: '2026-11-20',
    base_amount: 3800.0,
    fine_after_due_date: 300.0,
    paid_amount: 3800.0,
    status: 'paid',
  },
  {
    id: 'vch-002',
    voucher_number: 'VCH-202611-1002',
    student_name: 'Aaliyah Khan',
    father_name: 'Farhan Khan',
    roll_number: '1002',
    class: 'Class 10-A',
    billing_month: 'November 2026',
    due_date: '2026-11-20',
    base_amount: 3800.0,
    fine_after_due_date: 300.0,
    paid_amount: 0.0,
    status: 'unpaid',
  },
  {
    id: 'vch-003',
    voucher_number: 'VCH-202610-1003',
    student_name: 'Muhammad Bilal',
    father_name: 'Tariq Mahmood',
    roll_number: '1003',
    class: 'Class 10-A',
    billing_month: 'October 2026',
    due_date: '2026-10-20',
    base_amount: 3800.0,
    fine_after_due_date: 300.0,
    paid_amount: 0.0,
    status: 'overdue',
  },
  {
    id: 'vch-004',
    voucher_number: 'VCH-202611-0914',
    student_name: 'Liam Johnson',
    father_name: 'David Johnson',
    roll_number: '0914',
    class: 'Class 9-B',
    billing_month: 'November 2026',
    due_date: '2026-11-20',
    base_amount: 3500.0,
    fine_after_due_date: 300.0,
    paid_amount: 3500.0,
    status: 'paid',
  },
  {
    id: 'vch-005',
    voucher_number: 'VCH-202611-0501',
    student_name: 'Zainab Fatima',
    father_name: 'Imran Ashraf',
    roll_number: '0501',
    class: 'Class 5-A',
    billing_month: 'November 2026',
    due_date: '2026-11-20',
    base_amount: 2800.0,
    fine_after_due_date: 250.0,
    paid_amount: 0.0,
    status: 'unpaid',
  },
];

export default function FeesPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVouchers = mockVouchers.filter((v) => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch =
      v.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.voucher_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.roll_number.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Module 3: Fee Tracking & Vouchers
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Fee Management & Challans</h1>
          <p className="text-sm text-slate-500">
            Generate monthly fee structures, record payments, and print 3-part bank challans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow transition"
          >
            <PlusCircle className="h-4 w-4" />
            Generate Monthly Vouchers
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Billed</span>
            <Coins className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">Rs. 17,400</p>
          <p className="text-xs text-slate-500 mt-1">5 active Pakistani fee vouchers</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Collected Revenue</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">Rs. 7,300</p>
          <p className="text-xs text-slate-500 mt-1">2 vouchers paid via bank/cash</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Balance</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">Rs. 10,100</p>
          <p className="text-xs text-slate-500 mt-1">3 unpaid / overdue with fine</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search voucher, student, roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {['all', 'paid', 'unpaid', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Voucher #</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Grade</th>
                <th className="px-5 py-3.5">Month</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Print Challan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">
                    {v.voucher_number}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{v.student_name}</p>
                    <p className="text-[11px] text-slate-400">Roll: {v.roll_number}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{v.class}</td>
                  <td className="px-5 py-3.5 text-slate-600">{v.billing_month}</td>
                  <td className="px-5 py-3.5 text-slate-600">{v.due_date}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {formatCurrency(v.base_amount)}
                  </td>
                  <td className="px-5 py-3.5">
                    {v.status === 'paid' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Paid
                      </span>
                    )}
                    {v.status === 'unpaid' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                    {v.status === 'overdue' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" /> Overdue
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/fees/voucher/${v.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-md font-semibold text-xs transition"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print 3-Part Challan
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
