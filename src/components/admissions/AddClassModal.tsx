'use client';

import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import { createClass } from '@/lib/actions/admissions';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddClassModal({ isOpen, onClose, onSuccess }: AddClassModalProps) {
  const [className, setClassName] = useState('');
  const [numericOrder, setNumericOrder] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      setErrorMsg('Class name is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await createClass(className.trim(), numericOrder);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create class.');
    } else {
      setSuccessMsg(`"${className.trim()}" created with Section A & B!`);
      setClassName('');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-base">Add New Class</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Class Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Class 1, Nursery, KG…"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Display Order <span className="text-slate-400">(for sorting)</span>
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={numericOrder}
              onChange={(e) => setNumericOrder(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm"
            />
          </div>

          <p className="text-slate-500 text-[11px] bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
            <span className="font-semibold text-slate-700">ℹ️ Auto-setup:</span> Section A &amp; Section B will be created automatically for this class.
          </p>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow flex items-center gap-2 transition disabled:opacity-50 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating…</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
