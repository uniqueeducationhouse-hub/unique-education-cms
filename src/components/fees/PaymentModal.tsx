'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Banknote,
  Landmark,
  Smartphone,
  Receipt,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { type FeeVoucher } from '@/lib/fee-store';

interface PaymentModalProps {
  voucher: FeeVoucher | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: {
    payment_method: 'cash' | 'bank_transfer' | 'online_gateway' | 'cheque';
    payment_date: string;
    receipt_number: string;
    transaction_ref: string;
    received_by: string;
  }) => void;
  nextReceiptNo: string;
}

export function PaymentModal({
  voucher,
  isOpen,
  onClose,
  onConfirm,
  nextReceiptNo,
}: PaymentModalProps) {
  const [method, setMethod] = useState<'cash' | 'bank_transfer' | 'online_gateway'>('cash');
  const [paymentDate, setPaymentDate] = useState('2026-11-14');
  const [receiptNumber, setReceiptNumber] = useState(nextReceiptNo);
  const [reference, setReference] = useState('');
  const [receivedBy, setReceivedBy] = useState('Principal / Admin Accounts');

  // Set today's date and update receipt number
  React.useEffect(() => {
    setPaymentDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Update receipt number when nextReceiptNo prop changes
  React.useEffect(() => {
    if (nextReceiptNo) {
      setReceiptNumber(nextReceiptNo);
    }
  }, [nextReceiptNo]);

  if (!isOpen || !voucher) return null;

  const totalPayable = voucher.base_amount || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      payment_method: method,
      payment_date: paymentDate,
      receipt_number: receiptNumber.trim() || nextReceiptNo,
      transaction_ref: reference.trim() || (method === 'cash' ? 'Cash at Counter' : 'Bank Deposit Slip'),
      received_by: receivedBy.trim() || 'Principal / Office',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Fee Collection &amp; Payment Confirmation</h3>
              <p className="text-[11px] text-slate-400">Challan #{voucher.voucher_number}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Voucher Student Summary Card */}
        <div className="px-6 pt-4 pb-2 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 text-sm">{voucher.student_name}</p>
            <p className="text-slate-600 text-[11px]">
              {voucher.class} ({voucher.section}) • Roll: {voucher.roll_number}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">Payable Amount</span>
            <span className="text-lg font-black text-emerald-700 font-mono">
              {formatCurrency(totalPayable)}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Payment Method Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
              Select Payment Method <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMethod('cash');
                  setReference('Cash Received at Office Counter');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-center ${
                  method === 'cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                }`}
              >
                <Banknote className="h-5 w-5 text-emerald-600" />
                <span className="text-[11px]">Cash at Counter (By Hand)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('bank_transfer');
                  setReference('Bank Deposit Slip');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-center ${
                  method === 'bank_transfer'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                }`}
              >
                <Landmark className="h-5 w-5 text-indigo-600" />
                <span className="text-[11px]">Bank Deposit (Challan)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('online_gateway');
                  setReference('Raast / 1Link Online Transfer');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-center ${
                  method === 'online_gateway'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-1 ring-purple-600'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
                }`}
              >
                <Smartphone className="h-5 w-5 text-purple-600" />
                <span className="text-[11px]">Online / Raast (Instant)</span>
              </button>
            </div>
          </div>

          {/* Payment Date & Receipt Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Auto Receipt # <span className="text-emerald-600 font-bold">(Generated)</span>
              </label>
              <input
                required
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-xs text-indigo-700"
              />
            </div>
          </div>

          {/* Reference / Slip # & Received By Note */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {method === 'cash' ? 'Office Cash Note' : 'Bank Slip / Ref #'}
              </label>
              <input
                type="text"
                placeholder={method === 'cash' ? 'e.g. Received by Principal' : 'e.g. Deposit Slip #7890'}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Received By (Official)
              </label>
              <input
                type="text"
                placeholder="e.g. Principal / Accounts Desk"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Helpful Information Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800">✅ Instant Automation:</span> Marking this as Paid will generate a 2-copy printable cash receipt, allow 1-click WhatsApp receipt dispatch to parents, and update today's cash collections on your dashboard.
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm text-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm &amp; Mark as Paid</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
