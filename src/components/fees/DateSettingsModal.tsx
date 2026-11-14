'use client';

import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface DateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIssueDate: string;
  currentDueDate: string;
  onSave: (issueDate: string, dueDate: string) => void;
}

export function DateSettingsModal({
  isOpen,
  onClose,
  currentIssueDate,
  currentDueDate,
  onSave,
}: DateSettingsModalProps) {
  const [issueDate, setIssueDate] = useState(currentIssueDate || '2026-11-01');
  const [dueDate, setDueDate] = useState(currentDueDate || '2026-11-20');

  React.useEffect(() => {
    if (currentIssueDate) setIssueDate(currentIssueDate);
    if (currentDueDate) setDueDate(currentDueDate);
  }, [currentIssueDate, currentDueDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(issueDate, dueDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-sm">Fee Schedule &amp; Dates Customization</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-600 text-xs">
            Set the default Issue Date and Due Date for monthly fee vouchers. These dates will automatically be updated across all fee challans and printed on the 3-part bank vouchers.
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Fee Voucher Issue Date <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Fee Voucher Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Late fee surcharge applies to payments received after this date.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
            >
              Update Dates on Challans
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
