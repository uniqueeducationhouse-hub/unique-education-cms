'use client';

import React, { useState, useEffect } from 'react';
import { X, Receipt, Plus, Trash2, Calculator, CheckCircle2 } from 'lucide-react';
import { type StaffMember, type PayrollVoucher, type StaffAllowance, type StaffDeduction, type PaymentMethod } from '@/lib/staff-store';
import { formatCurrency } from '@/lib/utils';

interface ProcessPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  existingVouchers: PayrollVoucher[];
  onSavePayroll: (voucher: PayrollVoucher) => void;
}

export function ProcessPayrollModal({
  isOpen,
  onClose,
  staff,
  existingVouchers,
  onSavePayroll,
}: ProcessPayrollModalProps) {
  const [billingMonth, setBillingMonth] = useState('November 2026');
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [allowances, setAllowances] = useState<StaffAllowance[]>([]);
  const [deductions, setDeductions] = useState<StaffDeduction[]>([]);
  const [newAllowLabel, setNewAllowLabel] = useState('Medical Allowance');
  const [newAllowAmount, setNewAllowAmount] = useState<number>(3000);
  const [newDedLabel, setNewDedLabel] = useState('Staff Benevolent Fund');
  const [newDedAmount, setNewDedAmount] = useState<number>(500);

  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [paymentDate, setPaymentDate] = useState('2026-11-01');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (staff) {
      setBasicSalary(staff.basic_salary || 0);
      setAllowances([
        { id: 'alw-def-1', label: 'Medical Allowance', amount: 3000 },
        { id: 'alw-def-2', label: 'Transport / Conveys', amount: 2000 },
      ]);
      setDeductions([
        { id: 'ded-def-1', label: 'Benevolent Fund', amount: 500 },
      ]);
      setReceiptNumber(`PRCP-2026-${Math.floor(100 + Math.random() * 900)}`);
      setTransactionRef(`TRX-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [staff, isOpen]);

  if (!isOpen || !staff) return null;

  const totalAllowances = allowances.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const totalDeductions = deductions.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const grossSalary = Number(basicSalary) + totalAllowances;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  const handleAddAllowance = () => {
    if (!newAllowLabel || newAllowAmount <= 0) return;
    setAllowances([
      ...allowances,
      { id: `alw-${Date.now()}`, label: newAllowLabel, amount: Number(newAllowAmount) },
    ]);
    setNewAllowLabel('');
    setNewAllowAmount(1000);
  };

  const handleRemoveAllowance = (id: string) => {
    setAllowances(allowances.filter((a) => a.id !== id));
  };

  const handleAddDeduction = () => {
    if (!newDedLabel || newDedAmount <= 0) return;
    setDeductions([
      ...deductions,
      { id: `ded-${Date.now()}`, label: newDedLabel, amount: Number(newDedAmount) },
    ]);
    setNewDedLabel('');
    setNewDedAmount(500);
  };

  const handleRemoveDeduction = (id: string) => {
    setDeductions(deductions.filter((d) => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slipNumber = `SLIP-202611-${String(existingVouchers.length + 1).padStart(3, '0')}`;

    const voucher: PayrollVoucher = {
      id: `pay-${Date.now()}`,
      slip_number: slipNumber,
      staff_id: staff.id,
      staff_name: `${staff.first_name} ${staff.last_name}`,
      employee_id: staff.employee_id,
      category: staff.category,
      billing_month: billingMonth,
      basic_salary: Number(basicSalary),
      allowances,
      deductions,
      gross_salary: grossSalary,
      total_deductions: totalDeductions,
      net_salary: netSalary,
      payment_status: paymentStatus,
      payment_method: paymentStatus === 'paid' ? paymentMethod : undefined,
      payment_date: paymentStatus === 'paid' ? paymentDate : undefined,
      receipt_number: paymentStatus === 'paid' ? receiptNumber : undefined,
      transaction_ref: paymentStatus === 'paid' ? transactionRef : undefined,
      notes,
      created_at: new Date().toISOString(),
    };

    onSavePayroll(voucher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Receipt className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Process Salary Slip &amp; Payroll</h3>
              <p className="text-xs text-emerald-200">
                Staff: {staff.first_name} {staff.last_name} ({staff.employee_id} - {staff.category})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Billing Month
              </label>
              <input
                type="text"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Basic Salary (PKR)
              </label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-emerald-700 bg-emerald-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Allowances section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Allowances &amp; Bonuses
            </h4>
            <div className="space-y-2">
              {allowances.map((a) => (
                <div key={a.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
                  <span className="text-slate-700 font-medium">{a.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600">+{formatCurrency(a.amount)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllowance(a.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newAllowLabel}
                onChange={(e) => setNewAllowLabel(e.target.value)}
                placeholder="Allowance Title (e.g. Exam Duty)"
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
              <input
                type="number"
                value={newAllowAmount}
                onChange={(e) => setNewAllowAmount(Number(e.target.value))}
                placeholder="Amount"
                className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
              <button
                type="button"
                onClick={handleAddAllowance}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Deductions section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Deductions (Tax, Advance, Absence)
            </h4>
            <div className="space-y-2">
              {deductions.map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm">
                  <span className="text-slate-700 font-medium">{d.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600">-{formatCurrency(d.amount)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeduction(d.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newDedLabel}
                onChange={(e) => setNewDedLabel(e.target.value)}
                placeholder="Deduction Title (e.g. Late Arrival)"
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
              <input
                type="number"
                value={newDedAmount}
                onChange={(e) => setNewDedAmount(Number(e.target.value))}
                placeholder="Amount"
                className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
              <button
                type="button"
                onClick={handleAddDeduction}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Net Calculation Summary */}
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-700 font-semibold uppercase">Gross Salary: {formatCurrency(grossSalary)}</p>
              <p className="text-xs text-red-600 font-semibold uppercase mt-0.5">Deductions: -{formatCurrency(totalDeductions)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Final Net Payable</span>
              <span className="text-xl font-black text-indigo-900">{formatCurrency(netSalary)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'unpaid')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="paid">Paid (Disbursed)</option>
                <option value="unpaid">Unpaid (Pending Voucher)</option>
              </select>
            </div>
            {paymentStatus === 'paid' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Disbursement Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="bank_transfer">Bank Transfer (Online Salary)</option>
                  <option value="cash">Counter Cash Payment</option>
                  <option value="cheque">Bank Cheque</option>
                </select>
              </div>
            )}
          </div>

          {paymentStatus === 'paid' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Transaction Ref / Cheque #
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              HR Remarks / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 100% attendance bonus included."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-md shadow-emerald-200 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Save Salary Slip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
