'use client';

export type StaffCategory = 'Teacher' | 'Clerk' | 'Peon' | 'Guard' | 'Driver' | 'Admin' | 'Accountant';
export type StaffStatus = 'active' | 'on_leave' | 'resigned';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'cheque';
export type PayrollStatus = 'paid' | 'unpaid';

export interface StaffAllowance {
  id: string;
  label: string;
  amount: number;
}

export interface StaffDeduction {
  id: string;
  label: string;
  amount: number;
}

export interface StaffMember {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  category: StaffCategory;
  phone: string;
  email: string;
  cnic: string;
  qualification: string;
  joining_date: string;
  basic_salary: number;
  bank_account?: string;
  address?: string;
  status: StaffStatus;
  created_at?: string;
}

export interface PayrollVoucher {
  id: string;
  slip_number: string;
  staff_id: string;
  staff_name: string;
  employee_id: string;
  category: StaffCategory;
  billing_month: string; // e.g. 'November 2026'
  basic_salary: number;
  allowances: StaffAllowance[];
  deductions: StaffDeduction[];
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  payment_status: PayrollStatus;
  payment_method?: PaymentMethod;
  payment_date?: string;
  receipt_number?: string;
  transaction_ref?: string;
  notes?: string;
  created_at?: string;
}

const STAFF_STORAGE_KEY = 'sms_staff_members_pk_v1';
const PAYROLL_STORAGE_KEY = 'sms_payroll_vouchers_pk_v1';

export const DEFAULT_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'stf-001',
    employee_id: 'EMP-2024-001',
    first_name: 'Prof. Muhammad',
    last_name: 'Tariq',
    category: 'Teacher',
    phone: '+92 300 4567891',
    email: 'tariq.math@apexschool.edu.pk',
    cnic: '35202-1234567-1',
    qualification: 'M.Sc. Mathematics, B.Ed',
    joining_date: '2021-08-15',
    basic_salary: 65000,
    bank_account: 'Meezan Bank PK36MEZN0001234567890101',
    address: 'House 14, Street 3, Gulberg II, Lahore',
    status: 'active',
  },
  {
    id: 'stf-002',
    employee_id: 'EMP-2022-004',
    first_name: 'Ayesha',
    last_name: 'Malik',
    category: 'Teacher',
    phone: '+92 321 9876543',
    email: 'ayesha.english@apexschool.edu.pk',
    cnic: '35201-9876543-2',
    qualification: 'M.A. English Literature',
    joining_date: '2022-03-10',
    basic_salary: 55000,
    bank_account: 'HBL PK12HABB0009876543210102',
    address: 'Flat 4B, Moon Star Apartments, Garden Town, Lahore',
    status: 'active',
  },
  {
    id: 'stf-003',
    employee_id: 'EMP-2023-012',
    first_name: 'Shahid',
    last_name: 'Mehmood',
    category: 'Clerk',
    phone: '+92 333 5544332',
    email: 'accounts@apexschool.edu.pk',
    cnic: '35204-5544332-3',
    qualification: 'B.Com, DIT',
    joining_date: '2023-01-20',
    basic_salary: 35000,
    bank_account: 'Allied Bank PK55ABPA000112233445501',
    address: 'Near Madina Masjid, Ferozepur Road, Lahore',
    status: 'active',
  },
  {
    id: 'stf-004',
    employee_id: 'EMP-2025-018',
    first_name: 'Abdul',
    last_name: 'Qayyum',
    category: 'Guard',
    phone: '+92 312 7788990',
    email: 'security.gate@apexschool.edu.pk',
    cnic: '35202-7788990-4',
    qualification: 'Matric',
    joining_date: '2025-02-01',
    basic_salary: 28000,
    bank_account: 'Cash Payment',
    address: 'Chungi Amar Sidhu, Lahore',
    status: 'active',
  },
  {
    id: 'stf-005',
    employee_id: 'EMP-2024-009',
    first_name: 'Muhammad',
    last_name: 'Ramzan',
    category: 'Driver',
    phone: '+92 301 2233445',
    email: 'transport@apexschool.edu.pk',
    cnic: '35205-2233445-5',
    qualification: 'Middle, HTV License',
    joining_date: '2024-06-15',
    basic_salary: 32000,
    bank_account: 'Cash Payment',
    address: 'Kot Lakhpat, Lahore',
    status: 'active',
  },
  {
    id: 'stf-006',
    employee_id: 'EMP-2023-002',
    first_name: 'Rashid',
    last_name: 'Ali',
    category: 'Peon',
    phone: '+92 304 1122334',
    email: 'office.boy@apexschool.edu.pk',
    cnic: '35201-1122334-6',
    qualification: 'Middle',
    joining_date: '2023-09-01',
    basic_salary: 25000,
    bank_account: 'Cash Payment',
    address: 'Model Town Link Road, Lahore',
    status: 'active',
  },
];

export const DEFAULT_PAYROLL_VOUCHERS: PayrollVoucher[] = [
  {
    id: 'pay-001',
    slip_number: 'SLIP-202611-001',
    staff_id: 'stf-001',
    staff_name: 'Prof. Muhammad Tariq',
    employee_id: 'EMP-2024-001',
    category: 'Teacher',
    billing_month: 'November 2026',
    basic_salary: 65000,
    allowances: [
      { id: 'alw-1', label: 'Medical Allowance', amount: 5000 },
      { id: 'alw-2', label: 'Transport Subsidy', amount: 4000 },
      { id: 'alw-3', label: 'Senior Teacher Bonus', amount: 3000 },
    ],
    deductions: [
      { id: 'ded-1', label: 'Staff Benevolent Fund', amount: 500 },
      { id: 'ded-2', label: 'Tax Deduction', amount: 1500 },
    ],
    gross_salary: 77000,
    total_deductions: 2000,
    net_salary: 75000,
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    payment_date: '2026-11-01',
    receipt_number: 'PRCP-2026-001',
    transaction_ref: 'MEZN-TRX-994821',
    notes: 'Paid via Meezan Bank online salary transfer.',
  },
  {
    id: 'pay-002',
    slip_number: 'SLIP-202611-002',
    staff_id: 'stf-002',
    staff_name: 'Ayesha Malik',
    employee_id: 'EMP-2022-004',
    category: 'Teacher',
    billing_month: 'November 2026',
    basic_salary: 55000,
    allowances: [
      { id: 'alw-4', label: 'Medical Allowance', amount: 4000 },
      { id: 'alw-5', label: 'Transport Subsidy', amount: 3000 },
    ],
    deductions: [
      { id: 'ded-3', label: 'Provident Fund', amount: 2000 },
    ],
    gross_salary: 62000,
    total_deductions: 2000,
    net_salary: 60000,
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    payment_date: '2026-11-01',
    receipt_number: 'PRCP-2026-002',
    transaction_ref: 'HBL-TRX-338291',
    notes: 'Paid via HBL direct deposit.',
  },
  {
    id: 'pay-003',
    slip_number: 'SLIP-202611-003',
    staff_id: 'stf-003',
    staff_name: 'Shahid Mehmood',
    employee_id: 'EMP-2023-012',
    category: 'Clerk',
    billing_month: 'November 2026',
    basic_salary: 35000,
    allowances: [
      { id: 'alw-6', label: 'Dوست Allowance', amount: 2500 },
    ],
    deductions: [],
    gross_salary: 37500,
    total_deductions: 0,
    net_salary: 37500,
    payment_status: 'unpaid',
  },
  {
    id: 'pay-004',
    slip_number: 'SLIP-202611-004',
    staff_id: 'stf-004',
    staff_name: 'Abdul Qayyum',
    employee_id: 'EMP-2025-018',
    category: 'Guard',
    billing_month: 'November 2026',
    basic_salary: 28000,
    allowances: [
      { id: 'alw-7', label: 'Night Shift Allowance', amount: 2000 },
    ],
    deductions: [],
    gross_salary: 30000,
    total_deductions: 0,
    net_salary: 30000,
    payment_status: 'unpaid',
  },
];

export function loadStaffMembers(): StaffMember[] {
  if (typeof window === 'undefined') return DEFAULT_STAFF_MEMBERS;
  try {
    const stored = localStorage.getItem(STAFF_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load staff members', e);
  }
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF_MEMBERS));
  return DEFAULT_STAFF_MEMBERS;
}

export function saveStaffMembers(members: StaffMember[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save staff members', e);
  }
}

export function loadPayrollVouchers(): PayrollVoucher[] {
  if (typeof window === 'undefined') return DEFAULT_PAYROLL_VOUCHERS;
  try {
    const stored = localStorage.getItem(PAYROLL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load payroll vouchers', e);
  }
  localStorage.setItem(PAYROLL_STORAGE_KEY, JSON.stringify(DEFAULT_PAYROLL_VOUCHERS));
  return DEFAULT_PAYROLL_VOUCHERS;
}

export function savePayrollVouchers(vouchers: PayrollVoucher[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PAYROLL_STORAGE_KEY, JSON.stringify(vouchers));
  } catch (e) {
    console.error('Failed to save payroll vouchers', e);
  }
}

export function generateNextSlipNumber(vouchers: PayrollVoucher[]): string {
  const currentMonthYear = '202611';
  const count = vouchers.length + 1;
  return `SLIP-${currentMonthYear}-${String(count).padStart(3, '0')}`;
}
