'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Scissors, Settings, Landmark, GraduationCap } from 'lucide-react';
import { formatCurrency, numberToWordsPKR } from '@/lib/utils';
import { useSchoolSettings } from '@/lib/school-settings';

interface VoucherData {
  voucherNumber: string;
  studentName: string;
  fatherName: string;
  admissionNumber: string;
  rollNumber: string;
  className: string;
  section: string;
  billingMonth: string;
  issueDate: string;
  dueDate: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  miscCharges: number;
  arrears: number;
  lateFee: number;
}

interface PrintableChallanProps {
  voucherId: string;
}

export function PrintableChallan({ voucherId }: PrintableChallanProps) {
  const { settings } = useSchoolSettings();

  // Mock database lookup based on ID, defaulting to standard Pakistani fee voucher
  const voucher: VoucherData = {
    voucherNumber: voucherId ? `CH-202611-${voucherId.replace(/[^0-9]/g, '') || '1001'}` : 'CH-202611-1001',
    studentName: voucherId === 'vch-002' ? 'Aaliyah Khan' : voucherId === 'vch-004' ? 'Liam Johnson' : 'Sophia Martinez',
    fatherName: voucherId === 'vch-002' ? 'Farhan Khan' : voucherId === 'vch-004' ? 'David Johnson' : 'Carlos Martinez',
    admissionNumber: voucherId === 'vch-002' ? 'ADM-2026-10-002' : 'ADM-2026-10-001',
    rollNumber: voucherId === 'vch-002' ? '1002' : voucherId === 'vch-004' ? '0914' : '1001',
    className: voucherId === 'vch-004' ? 'Class 9' : 'Class 10',
    section: voucherId === 'vch-004' ? 'Section B' : 'Section A',
    billingMonth: 'November 2026',
    issueDate: '01 Nov 2026',
    dueDate: '20 Nov 2026',
    tuitionFee: 3000,
    admissionFee: 0,
    examFee: 400,
    miscCharges: 400,
    arrears: 0,
    lateFee: 300,
  };

  const totalWithinDueDate =
    voucher.tuitionFee + voucher.admissionFee + voucher.examFee + voucher.miscCharges + voucher.arrears;
  const totalAfterDueDate = totalWithinDueDate + voucher.lateFee;

  const copies = [
    {
      copyType: 'BANK COPY',
      subtext: 'To be retained by receiving bank branch',
      badgeColor: 'bg-indigo-900 text-white',
    },
    {
      copyType: 'SCHOOL COPY',
      subtext: 'To be submitted to school accounts department',
      badgeColor: 'bg-emerald-800 text-white',
    },
    {
      copyType: 'STUDENT / PARENT COPY',
      subtext: 'To be retained by parent/student as proof of deposit',
      badgeColor: 'bg-slate-800 text-white',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar (Hidden during print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/fees"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Back to Fees"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Pakistani 3-Part Fee Challan</h2>
            <p className="text-xs text-slate-500">
              Voucher #{voucher.voucherNumber} • Formatted for standard A4 Landscape printing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <Settings className="h-3.5 w-3.5 text-indigo-600" />
            Edit Bank / Logo
          </Link>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            <Printer className="h-4 w-4" />
            Print Challan (A4 Landscape)
          </button>
        </div>
      </div>

      {/* Printable Challan Container */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none print:m-0 challan-container">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-300 print:border-slate-400 bg-white">
          {copies.map((copy, index) => (
            <div
              key={copy.copyType}
              className={`p-3.5 flex flex-col justify-between text-[10px] text-slate-900 relative ${
                index < 2
                  ? 'border-b md:border-b-0 md:border-r-2 border-dashed border-slate-400 print:border-r-2 print:border-dashed print:border-slate-400'
                  : ''
              }`}
            >
              {/* Scissors Cut indicator */}
              {index < 2 && (
                <div className="hidden md:flex absolute -right-3 top-2 bg-white px-1 text-slate-400 z-10 print:flex">
                  <Scissors className="h-3.5 w-3.5 rotate-90" />
                </div>
              )}

              <div>
                {/* 1. School Header & Logo */}
                <div className="text-center border-b border-slate-300 pb-2 mb-2">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {settings.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={settings.logoUrl}
                        alt="Logo"
                        className="h-8 w-8 object-contain shrink-0"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded bg-indigo-700 text-white flex items-center justify-center shrink-0">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                    )}
                    <h1 className="font-black text-xs uppercase tracking-tight text-slate-950 leading-tight">
                      {settings.schoolName}
                    </h1>
                  </div>

                  <p className="text-[8.5px] text-slate-600 font-medium leading-tight">
                    {settings.campusAddress}
                  </p>
                  <p className="text-[8px] text-slate-500 font-mono">
                    Ph: {settings.phone}
                  </p>

                  {/* Copy Badge */}
                  <div className="mt-1 flex items-center justify-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${copy.badgeColor}`}
                    >
                      {copy.copyType}
                    </span>
                  </div>
                  <p className="text-[7.5px] text-slate-500 mt-0.5 italic">{copy.subtext}</p>
                </div>

                {/* 2. Bank Details Box */}
                <div className="bg-slate-50 border border-slate-300 rounded p-1.5 mb-2 leading-tight">
                  <div className="flex items-center justify-between font-bold text-[9px] text-slate-900">
                    <span>{settings.bankName}</span>
                    <span className="text-[8px] font-normal text-slate-500">Online Branch Collection</span>
                  </div>
                  <div className="flex justify-between text-[8.5px] text-slate-700 mt-0.5">
                    <span>A/C Title:</span>
                    <span className="font-semibold text-right truncate max-w-[170px]" title={settings.accountTitle}>
                      {settings.accountTitle}
                    </span>
                  </div>
                  <div className="flex justify-between text-[8.5px] text-slate-700">
                    <span>Account/IBAN:</span>
                    <span className="font-mono font-bold text-slate-900">{settings.accountNumber}</span>
                  </div>
                </div>

                {/* 3. Challan Meta Info */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 bg-slate-50/50 p-1.5 border border-slate-200 rounded text-[9px]">
                  <div>
                    <span className="text-slate-500 block text-[7.5px] uppercase">Challan #</span>
                    <span className="font-mono font-black text-slate-900">{voucher.voucherNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[7.5px] uppercase">Billing Month</span>
                    <span className="font-bold text-slate-800">{voucher.billingMonth}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[7.5px] uppercase">Issue Date</span>
                    <span className="font-medium">{voucher.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-rose-600 block text-[7.5px] uppercase font-bold">Due Date</span>
                    <span className="font-black text-rose-700">{voucher.dueDate}</span>
                  </div>
                </div>

                {/* 4. Student Information */}
                <div className="space-y-0.5 mb-2 border border-slate-200 rounded p-1.5 text-[8.5px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-black text-slate-900">{voucher.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Father's Name:</span>
                    <span className="font-semibold text-slate-800">{voucher.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Class &amp; Section:</span>
                    <span className="font-semibold">{voucher.className} ({voucher.section})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Roll # / Admission:</span>
                    <span className="font-mono font-medium">{voucher.rollNumber} / {voucher.admissionNumber}</span>
                  </div>
                </div>

                {/* 5. Itemized Fee Heads Table */}
                <table className="w-full text-left border-collapse border border-slate-300 mb-2 text-[8.5px]">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-800">
                      <th className="p-1 border border-slate-300">Sr. Fee Particulars</th>
                      <th className="p-1 border border-slate-300 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-1 border border-slate-300 text-slate-700">1. Tuition Fee</td>
                      <td className="p-1 border border-slate-300 text-right font-medium">{formatCurrency(voucher.tuitionFee)}</td>
                    </tr>
                    {voucher.admissionFee > 0 && (
                      <tr>
                        <td className="p-1 border border-slate-300 text-slate-700">2. Admission Fee</td>
                        <td className="p-1 border border-slate-300 text-right font-medium">{formatCurrency(voucher.admissionFee)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="p-1 border border-slate-300 text-slate-700">2. Examination Fee</td>
                      <td className="p-1 border border-slate-300 text-right font-medium">{formatCurrency(voucher.examFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-1 border border-slate-300 text-slate-700">3. Annual / Misc Charges</td>
                      <td className="p-1 border border-slate-300 text-right font-medium">{formatCurrency(voucher.miscCharges)}</td>
                    </tr>
                    {voucher.arrears > 0 && (
                      <tr>
                        <td className="p-1 border border-slate-300 text-rose-700 font-semibold">4. Previous Arrears</td>
                        <td className="p-1 border border-slate-300 text-right text-rose-700 font-bold">{formatCurrency(voucher.arrears)}</td>
                      </tr>
                    )}

                    {/* Total Within Due Date */}
                    <tr className="bg-slate-100 font-bold text-slate-900">
                      <td className="p-1 border border-slate-300 uppercase">Payable Within Due Date</td>
                      <td className="p-1 border border-slate-300 text-right text-indigo-900 font-black">
                        {formatCurrency(totalWithinDueDate)}
                      </td>
                    </tr>

                    {/* Late Fee */}
                    <tr className="text-rose-700 text-[8px]">
                      <td className="p-1 border border-slate-300">Late Fee Fine (After {voucher.dueDate})</td>
                      <td className="p-1 border border-slate-300 text-right font-bold">
                        {formatCurrency(voucher.lateFee)}
                      </td>
                    </tr>

                    {/* Total After Due Date */}
                    <tr className="bg-rose-50/70 text-rose-900 font-black">
                      <td className="p-1 border border-slate-300 uppercase">Payable After Due Date</td>
                      <td className="p-1 border border-slate-300 text-right text-rose-700 font-black">
                        {formatCurrency(totalAfterDueDate)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 6. Amount in Words */}
                <div className="bg-slate-50 border border-slate-200 p-1 rounded mb-2 text-[8px]">
                  <span className="text-slate-500 font-semibold block text-[7px] uppercase">Amount in Words:</span>
                  <span className="font-bold text-slate-800 leading-tight block">
                    {numberToWordsPKR(totalWithinDueDate)}
                  </span>
                </div>

                {/* 7. Important Instructions */}
                <div className="text-[7.5px] text-slate-500 leading-tight mb-2 pl-2 border-l border-slate-300">
                  <p>• Fee once deposited is non-refundable and non-transferable.</p>
                  <p>• Late fee surcharge of Rs. 300 will be charged strictly after due date.</p>
                </div>
              </div>

              {/* 8. Signatures & Stamp Box */}
              <div className="pt-2 border-t border-slate-300 space-y-2">
                <div className="flex justify-between text-[7.5px] text-slate-600">
                  <div className="text-center w-24">
                    <div className="border-b border-slate-400 mb-0.5 h-4" />
                    <span>Depositor Signature</span>
                  </div>
                  <div className="text-center w-24">
                    <div className="border-b border-slate-400 mb-0.5 h-4" />
                    <span>Bank Cashier / Officer</span>
                  </div>
                </div>

                {/* Bank Stamp Area */}
                <div className="h-9 border border-dashed border-slate-300 rounded flex items-center justify-center text-[7.5px] text-slate-400 bg-slate-50/50">
                  [ Bank Receiving Stamp Area ]
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
