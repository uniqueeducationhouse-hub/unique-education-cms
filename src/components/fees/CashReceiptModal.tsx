'use client';

import React from 'react';
import {
  X,
  Printer,
  MessageCircle,
  Scissors,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { formatCurrency, numberToWordsPKR } from '@/lib/utils';
import { useSchoolSettings } from '@/lib/school-settings';
import { type FeeVoucher, buildWhatsAppMessage, getWhatsAppUrl } from '@/lib/fee-store';

interface CashReceiptModalProps {
  voucher: FeeVoucher | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CashReceiptModal({ voucher, isOpen, onClose }: CashReceiptModalProps) {
  const { settings } = useSchoolSettings();

  if (!isOpen || !voucher) return null;

  const totalPaid = voucher.paid_amount || voucher.base_amount || 0;
  const paymentDate = voucher.payment_date || '2026-11-14';
  const receiptNo = voucher.receipt_number || 'RCP-2026-0001';
  const receivedBy = voucher.received_by || 'Principal / Accounts Office';

  const copies = [
    {
      title: 'OFFICE / PRINCIPAL COPY',
      sub: 'To be retained in school office records',
      badgeClass: 'bg-indigo-900 text-white',
    },
    {
      title: 'STUDENT / PARENT COPY',
      sub: 'Proof of fee deposit for parents',
      badgeClass: 'bg-emerald-900 text-white',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const message = buildWhatsAppMessage(settings.schoolName, voucher);
    const url = getWhatsAppUrl(voucher.guardian_phone || '+923001234567', message);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-4 max-h-[95vh] flex flex-col">
        {/* Modal Toolbar - Hidden during print */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Official Cash Fee Receipt</h3>
              <p className="text-[11px] text-slate-400">
                Receipt #{receiptNo} • {voucher.student_name} ({voucher.class})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              title="Send official receipt to parent's WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Send on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print 2-Copy Receipt</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Container (A4 / A5 2-Copy Layout) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 print:p-0 print:overflow-visible bg-slate-50 print:bg-white">
          <div className="max-w-3xl mx-auto space-y-6 print:space-y-4 print:max-w-none">
            {copies.map((copy, idx) => (
              <React.Fragment key={copy.title}>
                {idx > 0 && (
                  <div className="relative py-2 flex items-center justify-center">
                    <div className="w-full border-t-2 border-dashed border-slate-400" />
                    <span className="absolute bg-white px-3 text-[10px] text-slate-500 font-mono flex items-center gap-1 border border-slate-300 rounded-full py-0.5">
                      <Scissors className="h-3.5 w-3.5" />
                      CUT HERE • FOLD ALONG LINE
                    </span>
                  </div>
                )}

                {/* Single Copy Slip */}
                <div className="bg-white border-2 border-slate-300 rounded-xl p-4 sm:p-5 shadow-xs relative text-slate-900 text-xs print:border-slate-800 print:shadow-none print:p-4">
                  {/* Watermark PAID stamp */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-20 sm:opacity-25 rotate-[-15deg] z-0">
                    <div className="border-4 border-emerald-600 text-emerald-700 font-black text-4xl sm:text-5xl px-6 py-2 rounded-xl tracking-widest uppercase">
                      PAID
                    </div>
                  </div>

                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      {settings.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={settings.logoUrl}
                          alt="School Logo"
                          className="h-10 w-10 object-contain shrink-0 rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h1 className="font-black text-sm uppercase tracking-tight text-slate-900 leading-tight">
                          {settings.schoolName}
                        </h1>
                        <p className="text-[10px] text-slate-600 font-medium">
                          {settings.campusAddress} • Ph: {settings.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider block ${copy.badgeClass}`}>
                        {copy.title}
                      </span>
                      <span className="text-[8px] text-slate-500 block mt-0.5 italic">{copy.sub}</span>
                    </div>
                  </div>

                  {/* Receipt Meta & Student Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-3 text-[10px] relative z-10">
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Receipt No</span>
                      <span className="font-mono font-black text-indigo-700 text-xs">{receiptNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Challan Ref #</span>
                      <span className="font-mono font-bold text-slate-800">{voucher.voucher_number}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Payment Date</span>
                      <span className="font-bold text-slate-900">{paymentDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Fee Month</span>
                      <span className="font-bold text-emerald-800">{voucher.billing_month}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Student Name</span>
                      <span className="font-black text-slate-900 text-xs">{voucher.student_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Father's Name</span>
                      <span className="font-semibold text-slate-800">{voucher.father_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Class &amp; Section</span>
                      <span className="font-bold text-slate-900">{voucher.class} ({voucher.section})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-bold">Roll # / Adm #</span>
                      <span className="font-mono text-slate-700">{voucher.roll_number} / {voucher.admission_number}</span>
                    </div>
                  </div>

                  {/* Fee Items Table */}
                  <div className="mb-2 relative z-10">
                    <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-slate-800">
                          <th className="p-1.5 border border-slate-300">Sr. Fee Particulars</th>
                          <th className="p-1.5 border border-slate-300 text-right">Amount (PKR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1.5 border border-slate-300 text-slate-700">1. Monthly Tuition Fee</td>
                          <td className="p-1.5 border border-slate-300 text-right font-medium">{formatCurrency(voucher.tuition_fee)}</td>
                        </tr>
                        {voucher.exam_fee > 0 && (
                          <tr>
                            <td className="p-1.5 border border-slate-300 text-slate-700">2. Examination &amp; Assessment Fee</td>
                            <td className="p-1.5 border border-slate-300 text-right font-medium">{formatCurrency(voucher.exam_fee)}</td>
                          </tr>
                        )}
                        {voucher.misc_charges > 0 && (
                          <tr>
                            <td className="p-1.5 border border-slate-300 text-slate-700">3. Annual / Computer / Misc Charges</td>
                            <td className="p-1.5 border border-slate-300 text-right font-medium">{formatCurrency(voucher.misc_charges)}</td>
                          </tr>
                        )}
                        {voucher.arrears > 0 && (
                          <tr>
                            <td className="p-1.5 border border-slate-300 text-rose-700 font-semibold">4. Previous Arrears</td>
                            <td className="p-1.5 border border-slate-300 text-right text-rose-700 font-bold">{formatCurrency(voucher.arrears)}</td>
                          </tr>
                        )}

                        <tr className="bg-slate-100/80 font-black text-slate-900 text-xs">
                          <td className="p-1.5 border border-slate-300 uppercase">
                            Total Cash Received (Fully Paid)
                          </td>
                          <td className="p-1.5 border border-slate-300 text-right text-emerald-800 font-mono text-sm">
                            {formatCurrency(totalPaid)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Amount in words & Received by */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-[9.5px] mb-3 relative z-10">
                    <div>
                      <span className="text-slate-500 font-semibold uppercase block text-[8px]">Amount in Words:</span>
                      <span className="font-bold text-slate-800">{numberToWordsPKR(totalPaid)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-semibold uppercase block text-[8px]">Payment Mode:</span>
                      <span className="font-bold text-emerald-700">Cash at Counter (By Hand)</span>
                    </div>
                  </div>

                  {/* Signatures & Stamp */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-600 relative z-10">
                    <div className="text-center w-36">
                      <div className="border-b border-slate-400 mb-1 h-5" />
                      <span>Parent / Depositor</span>
                    </div>

                    <div className="text-center px-4 py-1 border border-dashed border-emerald-500 rounded bg-emerald-50/50">
                      <span className="font-black text-emerald-800 text-[10px] block">VERIFIED &amp; RECEIVED</span>
                      <span className="text-[8px] text-emerald-600">{receivedBy}</span>
                    </div>

                    <div className="text-center w-36">
                      <div className="border-b border-slate-400 mb-1 h-5" />
                      <span>Authorized Signature &amp; Stamp</span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
