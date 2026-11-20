'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar,
  Banknote,
  MessageCircle,
  Wallet,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useSchoolSettings } from '@/lib/school-settings';
import {
  type FeeVoucher,
  loadVouchers,
  saveVouchers,
  calculateTodayCashCollection,
  generateNextReceiptNumber,
  buildWhatsAppMessage,
  getWhatsAppUrl,
} from '@/lib/fee-store';
import { PaymentModal } from '@/components/fees/PaymentModal';
import { CashReceiptModal } from '@/components/fees/CashReceiptModal';
import { DateSettingsModal } from '@/components/fees/DateSettingsModal';
import { EditFeeModal } from '@/components/fees/EditFeeModal';

function FeesContent() {
  const { settings } = useSchoolSettings();
  const [vouchers, setVouchers] = useState<FeeVoucher[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [todayDateStr, setTodayDateStr] = useState('2026-11-14');

  // Modals state
  const [payingVoucher, setPayingVoucher] = useState<FeeVoucher | null>(null);
  const [receiptVoucher, setReceiptVoucher] = useState<FeeVoucher | null>(null);
  const [editingFeeVoucher, setEditingFeeVoucher] = useState<FeeVoucher | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load vouchers from storage on mount
  useEffect(() => {
    const list = loadVouchers();
    setVouchers(list);
    setTodayDateStr(new Date().toISOString().split('T')[0]);
    setIsLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.student_name.toLowerCase().includes(q) ||
      v.voucher_number.toLowerCase().includes(q) ||
      v.roll_number.includes(q) ||
      (v.father_name && v.father_name.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // Calculate Real-time Financial Totals
  const totalBilled = vouchers.reduce((sum, v) => sum + (v.base_amount || 0), 0);
  const totalCollected = vouchers
    .filter((v) => v.status === 'paid')
    .reduce((sum, v) => sum + (v.paid_amount || v.base_amount || 0), 0);
  const totalOutstanding = vouchers
    .filter((v) => v.status !== 'paid')
    .reduce((sum, v) => sum + (v.base_amount || 0), 0);
  const todayCashCollection = calculateTodayCashCollection(vouchers, todayDateStr);

  // Handle Mark as Paid Confirmation
  const handleConfirmPayment = (paymentData: {
    payment_method: 'cash' | 'bank_transfer' | 'online_gateway' | 'cheque';
    payment_date: string;
    receipt_number: string;
    transaction_ref: string;
    received_by: string;
  }) => {
    if (!payingVoucher) return;

    const updated = vouchers.map((v) => {
      if (v.id === payingVoucher.id) {
        return {
          ...v,
          status: 'paid' as const,
          paid_amount: v.base_amount,
          payment_method: paymentData.payment_method,
          payment_date: paymentData.payment_date,
          receipt_number: paymentData.receipt_number,
          transaction_ref: paymentData.transaction_ref,
          received_by: paymentData.received_by,
        };
      }
      return v;
    });

    setVouchers(updated);
    saveVouchers(updated);

    const updatedVoucher = updated.find((v) => v.id === payingVoucher.id);
    setPayingVoucher(null);
    showToast(`Payment of ${formatCurrency(payingVoucher.base_amount)} recorded under Receipt #${paymentData.receipt_number}!`);

    // Automatically prompt with Cash Receipt Modal if cash or desired
    if (updatedVoucher) {
      setReceiptVoucher(updatedVoucher);
    }
  };

  // Update Dates across vouchers
  const handleSaveDates = (newIssueDate: string, newDueDate: string) => {
    const updated = vouchers.map((v) => ({
      ...v,
      issue_date: newIssueDate,
      due_date: newDueDate,
    }));
    setVouchers(updated);
    saveVouchers(updated);
    showToast(`Challan dates updated: Issue Date ${newIssueDate} & Due Date ${newDueDate}!`);
  };

  // Quick 1-click WhatsApp Dispatch
  const handleQuickWhatsApp = (v: FeeVoucher) => {
    const msg = buildWhatsAppMessage(settings.schoolName, v);
    const url = getWhatsAppUrl(v.guardian_phone || '+923001234567', msg);
    window.open(url, '_blank');
  };

  // Custom Fee & Named Charges Update
  const handleSaveCustomFee = (updatedVoucher: FeeVoucher) => {
    const updated = vouchers.map((v) => (v.id === updatedVoucher.id ? updatedVoucher : v));
    setVouchers(updated);
    saveVouchers(updated);
    showToast(`Updated fee structure for ${updatedVoucher.student_name}: Total ${formatCurrency(updatedVoucher.base_amount)}`);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Module 3: Fee Tracking &amp; Collections
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 break-words">Fee Management &amp; Cash Collections</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Collect fees by hand at the counter, print 2-copy cash slips, send WhatsApp receipts, and print 3-part bank challans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsDateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            title="Update voucher issue date and due date"
          >
            <Calendar className="h-3.5 w-3.5 text-indigo-600" />
            Set Issue / Due Dates
          </button>

          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <Coins className="h-3.5 w-3.5 text-emerald-600" />
            Bank &amp; Account Info
          </Link>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Financial KPI Stats - Including Today's Cash Collection Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Cash Collection (Prominently Highlighted for Principal) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Today's Cash Collection
              </span>
              <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Banknote className="h-4 w-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black mt-2 font-mono">
              {formatCurrency(todayCashCollection)}
            </h2>
            <p className="text-[11px] text-emerald-100 mt-1">
              Cash-in-hand verified at office counter
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px] text-emerald-100">
            <span>Verified by Principal</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">Today</span>
          </div>
        </div>

        {/* Card 2: Total Billed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Total Billed</span>
              <Receipt className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {formatCurrency(totalBilled)}
            </p>
            <p className="text-xs text-slate-500 mt-1">{vouchers.length} total monthly vouchers</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Active Billing Cycle: November 2026
          </div>
        </div>

        {/* Card 3: Collected Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Collected Revenue</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700 mt-2 font-mono">
              {formatCurrency(totalCollected)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {vouchers.filter((v) => v.status === 'paid').length} vouchers paid &amp; stamped
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
            Cash + Bank Deposit + Online Raast
          </div>
        </div>

        {/* Card 4: Outstanding Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase">Pending / Overdue</span>
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="text-2xl font-black text-rose-700 mt-2 font-mono">
              {formatCurrency(totalOutstanding)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {vouchers.filter((v) => v.status !== 'paid').length} awaiting deposit
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-rose-600 font-medium">
            Subject to Rs. 300 late fee fine
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Student Name, Roll #, or Challan #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1">Status:</span>
          {[
            { id: 'all', label: 'All Vouchers', count: vouchers.length },
            { id: 'unpaid', label: 'Unpaid', count: vouchers.filter((v) => v.status === 'unpaid').length },
            { id: 'paid', label: 'Paid', count: vouchers.filter((v) => v.status === 'paid').length },
            { id: 'overdue', label: 'Overdue', count: vouchers.filter((v) => v.status === 'overdue').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1 py-0.2 rounded-full ${
                  filterStatus === tab.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5 whitespace-nowrap">Challan #</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Student &amp; Father</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Class / Roll</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Month &amp; Due Date</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Amount (PKR)</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Actions &amp; Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.map((v) => {
                const isPaid = v.status === 'paid';

                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {v.voucher_number}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="font-bold text-slate-900 whitespace-nowrap">{v.student_name}</p>
                      <p className="text-[11px] text-slate-500 whitespace-nowrap">S/O, D/O: {v.father_name}</p>
                    </td>

                    <td className="px-3 py-3.5 text-slate-700 whitespace-nowrap">
                      <span className="font-semibold block whitespace-nowrap">{v.class}</span>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">Roll: {v.roll_number}</span>
                    </td>

                    <td className="px-3 py-3.5 text-slate-600 text-[11px] whitespace-nowrap">
                      <span className="block font-medium text-slate-800 whitespace-nowrap">{v.billing_month}</span>
                      <span className={`whitespace-nowrap ${v.status === 'overdue' ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        Due: {v.due_date}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(v.base_amount)}
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      {v.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                          PAID
                        </span>
                      )}
                      {v.status === 'unpaid' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                          <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                          PENDING
                        </span>
                      )}
                      {v.status === 'overdue' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 whitespace-nowrap">
                          <AlertTriangle className="h-3 w-3 text-rose-600 shrink-0" />
                          OVERDUE
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        {/* If NOT paid: Show "Mark as Paid" button */}
                        {!isPaid ? (
                          <button
                            type="button"
                            onClick={() => setPayingVoucher(v)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-xs shadow-xs transition"
                          >
                            <Banknote className="h-3.5 w-3.5" />
                            <span>Mark as Paid</span>
                          </button>
                        ) : (
                          <>
                            {/* If Paid: Print Cash Receipt Button */}
                            <button
                              type="button"
                              onClick={() => setReceiptVoucher(v)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-md font-bold text-xs transition"
                              title="Print 2-Copy Cash Slip (Office & Parent)"
                            >
                              <Printer className="h-3.5 w-3.5 text-indigo-600" />
                              <span>Cash Receipt</span>
                            </button>

                            {/* WhatsApp Button */}
                            <button
                              type="button"
                              onClick={() => handleQuickWhatsApp(v)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-bold text-xs transition"
                              title="Send official payment confirmation on WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </button>
                          </>
                        )}

                        {/* Edit Fee / Add Custom Charges Button */}
                        <button
                          type="button"
                          onClick={() => setEditingFeeVoucher(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition"
                          title="Custom Tuition Fee, Sibling Discount & Named Charges"
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Edit Fee / Charges</span>
                        </button>

                        {/* 3-Part Bank Challan Link */}
                        <Link
                          href={`/fees/voucher/${v.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition"
                          title="Print 3-Part Bank Challan (A4 Landscape)"
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          <span>3-Part Challan</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Fee / Custom Charges Modal */}
      <EditFeeModal
        voucher={editingFeeVoucher}
        isOpen={Boolean(editingFeeVoucher)}
        onClose={() => setEditingFeeVoucher(null)}
        onSave={handleSaveCustomFee}
      />

      {/* Payment Confirmation Modal */}
      <PaymentModal
        voucher={payingVoucher}
        isOpen={Boolean(payingVoucher)}
        onClose={() => setPayingVoucher(null)}
        onConfirm={handleConfirmPayment}
        nextReceiptNo={generateNextReceiptNumber(vouchers)}
      />

      {/* Printable 2-Copy Cash Receipt Modal */}
      <CashReceiptModal
        voucher={receiptVoucher}
        isOpen={Boolean(receiptVoucher)}
        onClose={() => setReceiptVoucher(null)}
      />

      {/* Date Settings Modal */}
      <DateSettingsModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentIssueDate={vouchers[0]?.issue_date || '2026-11-01'}
        currentDueDate={vouchers[0]?.due_date || '2026-11-20'}
        onSave={handleSaveDates}
      />
    </div>
  );
}

export default function FeesPage() {
  return (
    <React.Suspense fallback={<div className="p-6 text-xs text-slate-500">Loading Pakistani fee vouchers...</div>}>
      <FeesContent />
    </React.Suspense>
  );
}
