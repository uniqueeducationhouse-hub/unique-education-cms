'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  DollarSign,
  Coins,
  Receipt,
  Sparkles,
  CheckCircle2,
  Calculator,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  type FeeVoucher,
  type CustomFeeCharge,
  calculateVoucherTotal,
} from '@/lib/fee-store';

interface EditFeeModalProps {
  voucher: FeeVoucher | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVoucher: FeeVoucher) => void;
}

const COMMON_CHARGE_PRESETS = [
  { label: 'Van / Transport Service', defaultAmount: 1500 },
  { label: 'Exam Paper Fund', defaultAmount: 300 },
  { label: 'Books & Stationery Kit', defaultAmount: 1200 },
  { label: 'Computer / Science Lab Fee', defaultAmount: 500 },
  { label: 'Generator & AC Charges', defaultAmount: 400 },
  { label: 'School Uniform / Badges', defaultAmount: 800 },
  { label: 'Annual Sports & Activity', defaultAmount: 500 },
  { label: 'School ID Card & Badge', defaultAmount: 200 },
];

export function EditFeeModal({
  voucher,
  isOpen,
  onClose,
  onSave,
}: EditFeeModalProps) {
  const [tuitionFee, setTuitionFee] = useState(3000);
  const [discount, setDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [admissionFee, setAdmissionFee] = useState(0);
  const [examFee, setExamFee] = useState(400);
  const [miscCharges, setMiscCharges] = useState(400);
  const [arrears, setArrears] = useState(0);
  const [customCharges, setCustomCharges] = useState<CustomFeeCharge[]>([]);

  // New custom charge inputs
  const [newChargeLabel, setNewChargeLabel] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState<number | ''>('');

  useEffect(() => {
    if (voucher) {
      setTuitionFee(voucher.tuition_fee || 3000);
      setDiscount(voucher.discount || 0);
      setDiscountReason(voucher.discount_reason || '');
      setAdmissionFee(voucher.admission_fee || 0);
      setExamFee(voucher.exam_fee || 400);
      setMiscCharges(voucher.misc_charges || 400);
      setArrears(voucher.arrears || 0);
      setCustomCharges(voucher.custom_charges || []);
      setNewChargeLabel('');
      setNewChargeAmount('');
    }
  }, [voucher]);

  if (!isOpen || !voucher) return null;

  // Add a custom charge
  const handleAddCustomCharge = (label: string, amount: number) => {
    if (!label.trim() || amount <= 0) return;
    const newCharge: CustomFeeCharge = {
      id: `chg-${Date.now().toString().slice(-6)}`,
      label: label.trim(),
      amount,
    };
    setCustomCharges([...customCharges, newCharge]);
    setNewChargeLabel('');
    setNewChargeAmount('');
  };

  const handleRemoveCustomCharge = (id: string) => {
    setCustomCharges(customCharges.filter((c) => c.id !== id));
  };

  // Live recalculated total
  const calculatedTotal = calculateVoucherTotal({
    tuition_fee: tuitionFee,
    discount,
    admission_fee: admissionFee,
    exam_fee: examFee,
    misc_charges: miscCharges,
    arrears,
    custom_charges: customCharges,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FeeVoucher = {
      ...voucher,
      tuition_fee: tuitionFee,
      discount,
      discount_reason: discount > 0 ? discountReason : '',
      admission_fee: admissionFee,
      exam_fee: examFee,
      misc_charges: miscCharges,
      arrears,
      custom_charges: customCharges,
      base_amount: calculatedTotal,
      paid_amount: voucher.status === 'paid' ? calculatedTotal : voucher.paid_amount,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Custom Student Fee &amp; Named Charges</h3>
              <p className="text-[11px] text-slate-400">
                {voucher.student_name} • {voucher.class} ({voucher.section}) • Roll: {voucher.roll_number}
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          {/* Section 1: Base Tuition Fee & Concession/Scholarship */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <span>1. Monthly Tuition Fee &amp; Concessions</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Monthly Tuition Fee (Rs.) <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  step={50}
                  value={tuitionFee}
                  onChange={(e) => setTuitionFee(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 text-sm focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Overrides default class fee for this student.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fee Discount / Concession (Rs.)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-emerald-700 text-sm focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Sibling discount, scholarship, or financial relief.
                </span>
              </div>
            </div>

            {discount > 0 && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discount Reason / Label <span className="text-slate-400">(Printed on Challan &amp; Receipt)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sibling Concession, Kinship Relief, Need-based Scholarship"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Section 2: Standard Charges (Exam, Misc, Arrears) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              2. Standard Academic &amp; Facility Charges
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exam &amp; Paper Fee</label>
                <input
                  type="number"
                  min={0}
                  value={examFee}
                  onChange={(e) => setExamFee(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual / Misc Charges</label>
                <input
                  type="number"
                  min={0}
                  value={miscCharges}
                  onChange={(e) => setMiscCharges(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Previous Arrears (Rs.)</label>
                <input
                  type="number"
                  min={0}
                  value={arrears}
                  onChange={(e) => setArrears(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-xs text-rose-700 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Custom Named Additional Charges */}
          <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>3. Additional Custom Named Charges</span>
              </h4>
              <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded">
                Printed as Itemized Rows
              </span>
            </div>

            {/* Quick Presets Pills */}
            <div>
              <span className="text-[10px] text-slate-500 font-medium block mb-1.5">
                Quick Preset Charges (Click to add):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_CHARGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleAddCustomCharge(preset.label, preset.defaultAmount)}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-lg text-[11px] text-indigo-800 font-medium transition shadow-2xs flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{preset.label}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({preset.defaultAmount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Custom Charge Inputs */}
            <div className="pt-2 border-t border-indigo-100">
              <span className="text-[10px] text-slate-600 font-bold block mb-1">
                Or Add Custom Named Charge:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Charge Name (e.g. Van Transport, Uniform...)"
                  value={newChargeLabel}
                  onChange={(e) => setNewChargeLabel(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Amount (Rs.)"
                  value={newChargeAmount}
                  onChange={(e) => setNewChargeAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-28 bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newChargeLabel && Number(newChargeAmount) > 0) {
                      handleAddCustomCharge(newChargeLabel, Number(newChargeAmount));
                    }
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shrink-0 transition"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* List of Configured Custom Charges */}
            {customCharges.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Active Custom Charges ({customCharges.length}):
                </span>
                <div className="divide-y divide-indigo-100 bg-white border border-indigo-200 rounded-lg overflow-hidden">
                  {customCharges.map((chg) => (
                    <div
                      key={chg.id}
                      className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        <span className="font-semibold text-slate-900">{chg.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900">
                          {formatCurrency(chg.amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomCharge(chg.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                          title="Remove Charge"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recalculation Summary Box */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-md">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                Total Recalculated Amount
              </span>
              <p className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {formatCurrency(calculatedTotal)}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Within Due Date • Includes Tuition, Concessions &amp; Custom Add-ons
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Apply &amp; Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
