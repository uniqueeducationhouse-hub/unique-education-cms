'use client';

import React from 'react';
import { X, Printer, Building2, CheckCircle2 } from 'lucide-react';
import { type PayrollVoucher } from '@/lib/staff-store';
import { formatCurrency } from '@/lib/utils';
import { useSchoolSettings } from '@/lib/school-settings';

interface PrintableSalarySlipProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: PayrollVoucher | null;
}

export function PrintableSalarySlip({ isOpen, onClose, voucher }: PrintableSalarySlipProps) {
  const { settings } = useSchoolSettings();

  if (!isOpen || !voucher) return null;

  const handlePrint = () => {
    window.print();
  };

  const slipCopies = [
    { title: 'ACCOUNTS DEPARTMENT COPY', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' },
    { title: 'STAFF MEMBER COPY', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 my-4 flex flex-col max-h-[95vh]">
        {/* Modal Toolbar (No-Print) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm">Official Salary Slip - 2-Copy View</h3>
              <p className="text-xs text-slate-400">Slip #{voucher.slip_number} | {voucher.staff_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow transition-colors"
            >
              <Printer className="h-4 w-4" /> Print Salary Slips
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Area: 2-Copy Grid */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex-1 flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6 print:shadow-none print:p-0 print:gap-4 print:w-full">
            {slipCopies.map((copyInfo, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed border-slate-300 rounded-xl p-5 flex flex-col justify-between bg-white relative print:border-solid print:border-slate-800"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-xs">
                      AS
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{settings.schoolName}</h4>
                      <p className="text-[10px] text-slate-500">HR &amp; Payroll Department</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${copyInfo.badgeBg}`}>
                    {copyInfo.title}
                  </span>
                </div>

                {/* Slip Meta */}
                <div className="py-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Slip Number:</span>
                    <span className="font-mono font-bold text-slate-800">{voucher.slip_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billing Month:</span>
                    <span className="font-semibold text-indigo-700">{voucher.billing_month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employee Name:</span>
                    <span className="font-bold text-slate-900">{voucher.staff_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employee ID / Role:</span>
                    <span className="font-medium text-slate-700">{voucher.employee_id} ({voucher.category})</span>
                  </div>
                </div>

                {/* Salary Breakdown Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden my-2 text-xs">
                  <div className="bg-slate-100 px-3 py-1 font-bold text-slate-700 flex justify-between">
                    <span>Description</span>
                    <span>Amount (PKR)</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="px-3 py-1.5 flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(voucher.basic_salary)}</span>
                    </div>
                    {voucher.allowances.map((a) => (
                      <div key={a.id} className="px-3 py-1 flex justify-between text-emerald-700">
                        <span>+ {a.label}</span>
                        <span>+{formatCurrency(a.amount)}</span>
                      </div>
                    ))}
                    {voucher.deductions.map((d) => (
                      <div key={d.id} className="px-3 py-1 flex justify-between text-red-600">
                        <span>- {d.label}</span>
                        <span>-{formatCurrency(d.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Net Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Earnings:</span>
                    <span className="font-semibold">{formatCurrency(voucher.gross_salary)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Deductions:</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(voucher.total_deductions)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-sm text-indigo-900">
                    <span>Net Salary Payable:</span>
                    <span className="text-emerald-700">{formatCurrency(voucher.net_salary)}</span>
                  </div>
                </div>

                {/* Payment Status & Details */}
                <div className="py-2 text-[11px] text-slate-600 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-bold ${voucher.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {voucher.payment_status === 'paid' ? `PAID (${voucher.payment_method?.replace('_', ' ').toUpperCase()})` : 'UNPAID PENDING'}
                    </span>
                  </div>
                  {voucher.receipt_number && (
                    <div className="flex justify-between">
                      <span>Receipt / Ref:</span>
                      <span className="font-mono">{voucher.receipt_number} {voucher.transaction_ref ? `(${voucher.transaction_ref})` : ''}</span>
                    </div>
                  )}
                </div>

                {/* Signatures */}
                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-500">
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-400 mb-1"></div>
                    <span>Prepared / Accountant</span>
                  </div>
                  <div>
                    <div className="h-8 border-b border-dashed border-slate-400 mb-1"></div>
                    <span>Receiver / Employee Sign</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
