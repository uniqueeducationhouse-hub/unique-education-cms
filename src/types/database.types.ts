export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'accountant' | 'student' | 'parent';
export type GenderType = 'male' | 'female' | 'other';
export type AdmissionStatus = 'active' | 'suspended' | 'graduated' | 'withdrawn';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'excused';
export type FeeStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'online_gateway' | 'cheque';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  numeric_order: number;
  created_at?: string;
}

export interface Section {
  id: string;
  class_id: string;
  name: string;
  capacity: number;
  created_at?: string;
}

export interface Teacher {
  id: string;
  profile_id?: string | null;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  qualification?: string | null;
  specialization?: string | null;
  joining_date: string;
  salary?: number | null;
  status: string;
  created_at?: string;
}

export interface Student {
  id: string;
  profile_id?: string | null;
  admission_number: string;
  roll_number: string;
  first_name: string;
  last_name: string;
  gender: GenderType;
  date_of_birth: string;
  class_id: string;
  section_id: string;
  blood_group?: string | null;
  emergency_contact?: string | null;
  address?: string | null;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  guardian_email?: string | null;
  admission_date: string;
  status: AdmissionStatus;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  // Joins
  class?: SchoolClass;
  section?: Section;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  section_id: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string | null;
  marked_by?: string | null;
  created_at?: string;
  // Joins
  student?: Student;
}

export interface FeeStructure {
  id: string;
  class_id: string;
  title: string;
  tuition_fee: number;
  computer_lab_fee: number;
  library_fee: number;
  sports_fee: number;
  exam_fee: number;
  total_amount: number;
  created_at?: string;
}

export interface FeeVoucher {
  id: string;
  voucher_number: string;
  student_id: string;
  fee_structure_id?: string | null;
  billing_month: string;
  issue_date: string;
  due_date: string;
  base_amount: number;
  fine_after_due_date: number;
  paid_amount: number;
  status: FeeStatus;
  notes?: string | null;
  created_at?: string;
  // Joins
  student?: Student;
  fee_structure?: FeeStructure;
}

export interface FeePayment {
  id: string;
  voucher_id: string;
  payment_date: string;
  amount_paid: number;
  method: PaymentMethod;
  transaction_ref?: string | null;
  recorded_by?: string | null;
  receipt_number: string;
  created_at?: string;
}

export interface Exam {
  id: string;
  title: string;
  term: string;
  start_date: string;
  end_date: string;
  academic_year: string;
  is_published: boolean;
  created_at?: string;
}

export interface ExamSubject {
  id: string;
  exam_id: string;
  class_id: string;
  subject_name: string;
  total_marks: number;
  passing_marks: number;
  exam_date?: string | null;
  created_at?: string;
}

export interface ExamMark {
  id: string;
  exam_subject_id: string;
  student_id: string;
  marks_obtained: number;
  grade?: string | null;
  remarks?: string | null;
  entered_by?: string | null;
  created_at?: string;
  // Joins
  subject?: ExamSubject;
  student?: Student;
}

export interface GradingScale {
  id: string;
  grade: string;
  min_percentage: number;
  max_percentage: number;
  gpa_point: number;
  description?: string | null;
}
