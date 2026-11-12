import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PrintButton } from '@/components/ui/PrintButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [
    { id: 'vch-001' },
    { id: 'vch-002' },
    { id: 'vch-003' },
    { id: 'vch-004' },
  ];
}

export default async function PrintableVoucherPage({ params }: PageProps) {
  const { id } = await params;

  const voucherData = {
    voucherNumber: id ? `VCH-202611-${id.replace('vch-', '')}` : 'VCH-202611-1001',
    studentName: 'Sophia Martinez',
    admissionNumber: 'ADM-2026-10-001',
    rollNumber: '1001',
    class: 'Grade 10',
    section: 'Section A',
    billingMonth: 'November 2026',
    issueDate: '01 Nov 2026',
    dueDate: '20 Nov 2026',
    bankName: 'National Trust Bank',
    accountNumber: '0012-983471-01',
    breakdown: [
      { title: 'Monthly Tuition Fee', amount: 150.0 },
      { title: 'Computer Lab Charges', amount: 30.0 },
      { title: 'Library Access Fee', amount: 20.0 },
      { title: 'Sports & Activity Fund', amount: 15.0 },
      { title: 'Exam / Assessment Fee', amount: 25.0 },
    ],
    baseAmount: 240.0,
    lateFee: 25.0,
  };

  const copies = [
    { title: 'BANK COPY', subtitle: 'To be retained by receiving bank teller' },
    { title: 'SCHOOL COPY', subtitle: 'To be submitted to school accounts desk' },
    { title: 'STUDENT COPY', subtitle: 'To be retained by parent / student' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar - Hidden in print */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/fees"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Printable Bank Fee Challan</h2>
            <p className="text-xs text-slate-500">
              Voucher #{voucherData.voucherNumber} • Standard 3-Fold A4 Landscape Challan
            </p>
          </div>
        </div>

        <PrintButton label="Print Challan (A4 Landscape)" />
      </div>

      {/* 3-Column Tri-fold Challan Sheet */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none">
        <div className="challan-sheet grid grid-cols-1 md:grid-cols-3 gap-6">
          {copies.map((copy, index) => (
            <div
              key={copy.title}
              className={`p-4 border border-dashed border-slate-300 rounded-lg flex flex-col justify-between text-[11px] text-slate-800 ${
                index < 2 ? 'md:border-r md:border-dashed md:border-slate-300' : ''
              }`}
            >
              <div>
                {/* Header */}
                <div className="text-center border-b border-slate-300 pb-2 mb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                    Apex Academy
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Official Fee Deposit Challan</p>
                  <div className="mt-1 inline-block px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-800 border border-slate-300">
                    {copy.title}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">{copy.subtitle}</p>
                </div>

                {/* Bank Account Info */}
                <div className="bg-slate-50 p-2 rounded border border-slate-200 mb-2">
                  <p className="font-semibold text-slate-900 text-[10px]">{voucherData.bankName}</p>
                  <p className="text-[10px] text-slate-600 font-mono">A/C: {voucherData.accountNumber}</p>
                </div>

                {/* Voucher Meta */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Challan #:</span>
                    <span className="font-mono font-bold">{voucherData.voucherNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student:</span>
                    <span className="font-semibold">{voucherData.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Adm / Roll:</span>
                    <span>{voucherData.admissionNumber} / {voucherData.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Class:</span>
                    <span>{voucherData.class} ({voucherData.section})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Month:</span>
                    <span className="font-medium">{voucherData.billingMonth}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Due Date:</span>
                    <span>{voucherData.dueDate}</span>
                  </div>
                </div>

                {/* Itemized Breakdown Table */}
                <table className="w-full text-left border-collapse border border-slate-200 mb-3 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="p-1 border border-slate-200">Particulars</th>
                      <th className="p-1 border border-slate-200 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voucherData.breakdown.map((item) => (
                      <tr key={item.title}>
                        <td className="p-1 border border-slate-200 text-slate-600">{item.title}</td>
                        <td className="p-1 border border-slate-200 text-right font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-1 border border-slate-200">Total Payable By Due Date</td>
                      <td className="p-1 border border-slate-200 text-right">
                        {formatCurrency(voucherData.baseAmount)}
                      </td>
                    </tr>
                    <tr className="text-rose-600 font-semibold">
                      <td className="p-1 border border-slate-200">After Due Date (Incl. Fine)</td>
                      <td className="p-1 border border-slate-200 text-right">
                        {formatCurrency(voucherData.baseAmount + voucherData.lateFee)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures & Stamp Box */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <div className="text-center">
                    <div className="w-20 border-b border-slate-400 mb-1" />
                    <span>Depositor Sign</span>
                  </div>
                  <div className="text-center">
                    <div className="w-20 border-b border-slate-400 mb-1" />
                    <span>Bank Cashier Sign</span>
                  </div>
                </div>
                <div className="h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400">
                  Bank / Cashier Stamp Area
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
