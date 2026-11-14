'use client';

export interface CustomFeeCharge {
  id: string;
  label: string;
  amount: number;
}

export interface FeeVoucher {
  id: string;
  voucher_number: string;
  student_name: string;
  father_name: string;
  guardian_phone: string;
  roll_number: string;
  admission_number: string;
  class: string;
  section: string;
  billing_month: string;
  issue_date: string;
  due_date: string;
  tuition_fee: number;
  discount: number;
  discount_reason?: string;
  admission_fee: number;
  exam_fee: number;
  misc_charges: number;
  custom_charges: CustomFeeCharge[];
  arrears: number;
  late_fee: number;
  base_amount: number;
  paid_amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  payment_method?: 'cash' | 'bank_transfer' | 'online_gateway' | 'cheque';
  payment_date?: string;
  receipt_number?: string;
  transaction_ref?: string;
  received_by?: string;
}

export function calculateVoucherTotal(v: Partial<FeeVoucher>): number {
  const tuition = v.tuition_fee || 0;
  const discount = v.discount || 0;
  const admission = v.admission_fee || 0;
  const exam = v.exam_fee || 0;
  const misc = v.misc_charges || 0;
  const arrears = v.arrears || 0;
  const customSum = (v.custom_charges || []).reduce((acc, c) => acc + (c.amount || 0), 0);

  return Math.max(0, (tuition - discount) + admission + exam + misc + arrears + customSum);
}

export const DEFAULT_PAKISTANI_VOUCHERS: FeeVoucher[] = [
  {
    id: 'vch-001',
    voucher_number: 'VCH-202611-1001',
    student_name: 'Sophia Martinez',
    father_name: 'Carlos Martinez',
    guardian_phone: '+923001234561',
    roll_number: '1001',
    admission_number: 'ADM-2026-10-001',
    class: 'Class 10',
    section: 'Section A',
    billing_month: 'November 2026',
    issue_date: '2026-11-01',
    due_date: '2026-11-20',
    tuition_fee: 3500,
    discount: 500,
    discount_reason: 'Sibling Concession',
    admission_fee: 0,
    exam_fee: 400,
    misc_charges: 400,
    custom_charges: [
      { id: 'chg-1', label: 'Van / Transport Service', amount: 1500 },
      { id: 'chg-2', label: 'Generator & AC Fund', amount: 300 },
    ],
    arrears: 0,
    late_fee: 300,
    base_amount: 5100,
    paid_amount: 5100,
    status: 'paid',
    payment_method: 'cash',
    payment_date: '2026-11-14',
    receipt_number: 'RCP-2026-0001',
    received_by: 'Principal / Admin Office',
    transaction_ref: 'Counter Cash Slip #01',
  },
  {
    id: 'vch-002',
    voucher_number: 'VCH-202611-1002',
    student_name: 'Aaliyah Khan',
    father_name: 'Farhan Khan',
    guardian_phone: '+923001234562',
    roll_number: '1002',
    admission_number: 'ADM-2026-10-002',
    class: 'Class 10',
    section: 'Section A',
    billing_month: 'November 2026',
    issue_date: '2026-11-01',
    due_date: '2026-11-20',
    tuition_fee: 3500,
    discount: 0,
    admission_fee: 0,
    exam_fee: 400,
    misc_charges: 400,
    custom_charges: [
      { id: 'chg-3', label: 'Science Lab Chemicals Fee', amount: 500 },
    ],
    arrears: 0,
    late_fee: 300,
    base_amount: 4800,
    paid_amount: 0,
    status: 'unpaid',
  },
  {
    id: 'vch-003',
    voucher_number: 'VCH-202610-1003',
    student_name: 'Muhammad Bilal',
    father_name: 'Tariq Mahmood',
    guardian_phone: '+923001234563',
    roll_number: '1003',
    admission_number: 'ADM-2026-10-003',
    class: 'Class 10',
    section: 'Section A',
    billing_month: 'October 2026',
    issue_date: '2026-10-01',
    due_date: '2026-10-20',
    tuition_fee: 3500,
    discount: 0,
    admission_fee: 0,
    exam_fee: 400,
    misc_charges: 400,
    custom_charges: [],
    arrears: 0,
    late_fee: 300,
    base_amount: 4300,
    paid_amount: 0,
    status: 'overdue',
  },
  {
    id: 'vch-004',
    voucher_number: 'VCH-202611-0914',
    student_name: 'Liam Johnson',
    father_name: 'David Johnson',
    guardian_phone: '+923001234564',
    roll_number: '0914',
    admission_number: 'ADM-2026-09-014',
    class: 'Class 9',
    section: 'Section B',
    billing_month: 'November 2026',
    issue_date: '2026-11-01',
    due_date: '2026-11-20',
    tuition_fee: 3000,
    discount: 300,
    discount_reason: 'Academic Merit Scholarship',
    admission_fee: 0,
    exam_fee: 350,
    misc_charges: 350,
    custom_charges: [
      { id: 'chg-4', label: 'Van / Transport Service', amount: 1500 },
    ],
    arrears: 0,
    late_fee: 300,
    base_amount: 4900,
    paid_amount: 4900,
    status: 'paid',
    payment_method: 'bank_transfer',
    payment_date: '2026-11-10',
    receipt_number: 'RCP-2026-0002',
    received_by: 'Meezan Bank Branch #0102',
    transaction_ref: 'TRX-87429103',
  },
  {
    id: 'vch-005',
    voucher_number: 'VCH-202611-0501',
    student_name: 'Zainab Fatima',
    father_name: 'Imran Ashraf',
    guardian_phone: '+923001234565',
    roll_number: '0501',
    admission_number: 'ADM-2026-05-001',
    class: 'Class 5',
    section: 'Section A',
    billing_month: 'November 2026',
    issue_date: '2026-11-01',
    due_date: '2026-11-20',
    tuition_fee: 2500,
    discount: 0,
    admission_fee: 0,
    exam_fee: 300,
    misc_charges: 300,
    custom_charges: [
      { id: 'chg-5', label: 'Exam Paper Fund & Stationery', amount: 400 },
    ],
    arrears: 0,
    late_fee: 250,
    base_amount: 3500,
    paid_amount: 0,
    status: 'unpaid',
  },
];

const STORAGE_KEY = 'sms_fee_vouchers_pk';

export function loadVouchers(): FeeVoucher[] {
  if (typeof window === 'undefined') return DEFAULT_PAKISTANI_VOUCHERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load vouchers from localStorage', e);
  }
  return DEFAULT_PAKISTANI_VOUCHERS;
}

export function saveVouchers(vouchers: FeeVoucher[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
  } catch (e) {
    console.error('Failed to save vouchers to localStorage', e);
  }
}

export function generateNextReceiptNumber(vouchers: FeeVoucher[], year: number = 2026): string {
  let maxSeq = 0;
  vouchers.forEach((v) => {
    if (v.receipt_number && v.receipt_number.startsWith(`RCP-${year}-`)) {
      const parts = v.receipt_number.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });
  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `RCP-${year}-${nextSeq}`;
}

export function calculateTodayCashCollection(vouchers: FeeVoucher[], todayDate?: string): number {
  const targetDate = todayDate || '2026-11-14';
  return vouchers
    .filter((v) => v.status === 'paid' && v.payment_method === 'cash' && v.payment_date === targetDate)
    .reduce((sum, v) => sum + (v.paid_amount || v.base_amount || 0), 0);
}

// Generate pre-typed WhatsApp message for payment confirmation
export function buildWhatsAppMessage(schoolName: string, voucher: FeeVoucher): string {
  const total = (voucher.paid_amount || voucher.base_amount || 0).toLocaleString('en-PK');
  const paymentMethodLabel =
    voucher.payment_method === 'cash'
      ? 'Cash at Counter (By Hand)'
      : voucher.payment_method === 'online_gateway'
      ? 'Online Transfer / Raast'
      : 'Bank Deposit (Challan)';

  const lines = [
    `🎓 *${schoolName.toUpperCase()}*`,
    `*OFFICIAL FEE PAYMENT RECEIPT*`,
    `───────────────────────────`,
    `📄 *Receipt No:* ${voucher.receipt_number || 'RCP-PAID'}`,
    `📑 *Challan No:* ${voucher.voucher_number}`,
    `👤 *Student Name:* ${voucher.student_name}`,
    `👨‍👧 *Father's Name:* ${voucher.father_name}`,
    `🏫 *Class & Section:* ${voucher.class} (${voucher.section})`,
    `🔢 *Roll No:* ${voucher.roll_number} | *Adm No:* ${voucher.admission_number}`,
    `📅 *Fee Month:* ${voucher.billing_month}`,
    `💰 *Amount Paid:* Rs. ${total}`,
    `💳 *Payment Mode:* ${paymentMethodLabel}`,
    `🗓 *Payment Date:* ${voucher.payment_date || '2026-11-14'}`,
    `✍ *Received By:* ${voucher.received_by || 'Principal / Accounts Desk'}`,
    `✅ *Status:* PAID & VERIFIED`,
    `───────────────────────────`,
    `Thank you for the timely deposit of your ward's school fee. This is a computer-generated confirmation receipt.`,
  ];

  return lines.join('\n');
}

export function getWhatsAppUrl(phone: string, text: string): string {
  // Clean phone number: remove spaces, dashes, parentheses
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  // If starts with 03..., replace with 923...
  if (cleanPhone.startsWith('03')) {
    cleanPhone = '92' + cleanPhone.substring(1);
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
