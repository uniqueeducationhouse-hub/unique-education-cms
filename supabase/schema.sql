-- ==============================================================================
-- School Management System (SMS) - Comprehensive PostgreSQL / Supabase Schema
-- Covers: Students, Teachers, Classes, Sections, Attendance, Fees & Exam Marks
-- 100% Idempotent - Safe to execute and re-run in Supabase SQL Editor
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types (Idempotent creation via exception handler)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'teacher', 'accountant', 'student', 'parent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admission_status AS ENUM ('active', 'suspended', 'graduated', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day', 'excused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fee_status AS ENUM ('unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'online_gateway', 'cheque');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Utility Function: Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. User Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Classes & Sections Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    numeric_order INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, name)
);

-- 6. Teachers Table (Module 1)
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    qualification TEXT,
    specialization TEXT,
    joining_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Students Table (Module 1)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admission_number TEXT NOT NULL UNIQUE,
    roll_number TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender gender_type NOT NULL,
    date_of_birth DATE NOT NULL,
    class_id UUID NOT NULL REFERENCES public.classes(id),
    section_id UUID NOT NULL REFERENCES public.sections(id),
    blood_group TEXT,
    emergency_contact TEXT,
    address TEXT,
    guardian_name TEXT NOT NULL,
    guardian_relation TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    guardian_email TEXT,
    admission_date DATE DEFAULT CURRENT_DATE,
    status admission_status DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, section_id, roll_number)
);

DROP TRIGGER IF EXISTS update_students_modtime ON public.students;
CREATE TRIGGER update_students_modtime
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Daily Attendance Table (Module 2)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id),
    section_id UUID NOT NULL REFERENCES public.sections(id),
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    remarks TEXT,
    marked_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- 9. Fee Structures & Vouchers (Module 3)
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tuition_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    computer_lab_fee DECIMAL(10, 2) DEFAULT 0.00,
    library_fee DECIMAL(10, 2) DEFAULT 0.00,
    sports_fee DECIMAL(10, 2) DEFAULT 0.00,
    exam_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (
        tuition_fee + computer_lab_fee + library_fee + sports_fee + exam_fee
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fee_vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_number TEXT NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    fee_structure_id UUID REFERENCES public.fee_structures(id),
    billing_month DATE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    base_amount DECIMAL(10, 2) NOT NULL,
    fine_after_due_date DECIMAL(10, 2) DEFAULT 0.00,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    status fee_status DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_id UUID NOT NULL REFERENCES public.fee_vouchers(id) ON DELETE CASCADE,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    amount_paid DECIMAL(10, 2) NOT NULL,
    method payment_method NOT NULL DEFAULT 'cash',
    transaction_ref TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    receipt_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Examinations, Subjects & Marks (Module 4)
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    term TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    academic_year TEXT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    total_marks DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    passing_marks DECIMAL(5, 2) NOT NULL DEFAULT 40.00,
    exam_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, class_id, subject_name)
);

CREATE TABLE IF NOT EXISTS public.exam_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_subject_id UUID NOT NULL REFERENCES public.exam_subjects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2) NOT NULL CHECK (marks_obtained >= 0),
    grade TEXT,
    remarks TEXT,
    entered_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_subject_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.grading_scales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade TEXT NOT NULL UNIQUE,
    min_percentage DECIMAL(5, 2) NOT NULL,
    max_percentage DECIMAL(5, 2) NOT NULL,
    gpa_point DECIMAL(3, 2) NOT NULL,
    description TEXT
);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- Configured for both authenticated staff and anon development access
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_scales ENABLE ROW LEVEL SECURITY;

-- Helper Function to Extract Current User Role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Academic Structure Policies
DROP POLICY IF EXISTS "Public view classes" ON public.classes;
CREATE POLICY "Public view classes" ON public.classes
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage classes" ON public.classes;
CREATE POLICY "Public manage classes" ON public.classes
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public view sections" ON public.sections;
CREATE POLICY "Public view sections" ON public.sections
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage sections" ON public.sections;
CREATE POLICY "Public manage sections" ON public.sections
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public view grading scales" ON public.grading_scales;
CREATE POLICY "Public view grading scales" ON public.grading_scales
    FOR SELECT TO anon, authenticated USING (true);

-- Profiles Policy
DROP POLICY IF EXISTS "Users read own profile; Admins read all" ON public.profiles;
CREATE POLICY "Users read own profile; Admins read all" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.current_user_role() IN ('super_admin', 'admin') OR auth.role() = 'anon');

-- Students Policies (Read & Manage)
DROP POLICY IF EXISTS "App view students" ON public.students;
CREATE POLICY "App view students" ON public.students
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App manage students" ON public.students;
CREATE POLICY "App manage students" ON public.students
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Teachers Policies (Read & Manage)
DROP POLICY IF EXISTS "App view teachers" ON public.teachers;
CREATE POLICY "App view teachers" ON public.teachers
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App manage teachers" ON public.teachers;
CREATE POLICY "App manage teachers" ON public.teachers
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Attendance Policies
DROP POLICY IF EXISTS "App view attendance" ON public.attendance;
CREATE POLICY "App view attendance" ON public.attendance
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App manage attendance" ON public.attendance;
CREATE POLICY "App manage attendance" ON public.attendance
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Fee Policies
DROP POLICY IF EXISTS "App view fee structures" ON public.fee_structures;
CREATE POLICY "App view fee structures" ON public.fee_structures
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App manage fee structures" ON public.fee_structures;
CREATE POLICY "App manage fee structures" ON public.fee_structures
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "App view fee vouchers" ON public.fee_vouchers;
CREATE POLICY "App view fee vouchers" ON public.fee_vouchers
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App manage fee vouchers" ON public.fee_vouchers;
CREATE POLICY "App manage fee vouchers" ON public.fee_vouchers
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Exams & Marks Policies
DROP POLICY IF EXISTS "App view exams" ON public.exams;
CREATE POLICY "App view exams" ON public.exams
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App view exam subjects" ON public.exam_subjects;
CREATE POLICY "App view exam subjects" ON public.exam_subjects
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App view exam marks" ON public.exam_marks;
CREATE POLICY "App view exam marks" ON public.exam_marks
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "App manage exam marks" ON public.exam_marks;
CREATE POLICY "App manage exam marks" ON public.exam_marks
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- Default Seed Data (All UUIDs strictly use valid hex characters [0-9, a-f])
-- ==============================================================================

-- 1. Grading Scale
INSERT INTO public.grading_scales (grade, min_percentage, max_percentage, gpa_point, description) VALUES
('A+', 90.00, 100.00, 4.00, 'Outstanding / Distinction'),
('A',  80.00, 89.99,  3.70, 'Excellent'),
('B',  70.00, 79.99,  3.00, 'Very Good'),
('C',  60.00, 69.99,  2.00, 'Satisfactory'),
('D',  50.00, 59.99,  1.00, 'Pass'),
('F',   0.00, 49.99,  0.00, 'Fail')
ON CONFLICT (grade) DO NOTHING;

-- 2. Classes (13 Standard School Classes)
INSERT INTO public.classes (id, name, numeric_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Playgroup',  1),
('c0000000-0000-0000-0000-000000000002', 'Nursery',    2),
('c0000000-0000-0000-0000-000000000003', 'KG',         3),
('c0000000-0000-0000-0000-000000000004', 'Class 1',    4),
('c0000000-0000-0000-0000-000000000005', 'Class 2',    5),
('c0000000-0000-0000-0000-000000000006', 'Class 3',    6),
('c0000000-0000-0000-0000-000000000007', 'Class 4',    7),
('c0000000-0000-0000-0000-000000000008', 'Class 5',    8),
('c0000000-0000-0000-0000-000000000009', 'Class 6',    9),
('c0000000-0000-0000-0000-000000000010', 'Class 7',   10),
('c0000000-0000-0000-0000-000000000011', 'Class 8',   11),
('c0000000-0000-0000-0000-000000000012', 'Class 9',   12),
('c0000000-0000-0000-0000-000000000013', 'Class 10',  13)
ON CONFLICT (id) DO NOTHING;

-- Section A & B for every class
INSERT INTO public.sections (id, class_id, name, capacity) VALUES
-- Playgroup
('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Section A', 25),
('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Section B', 25),
-- Nursery
('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Section A', 25),
('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Section B', 25),
-- KG
('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'Section A', 30),
('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', 'Section B', 30),
-- Class 1
('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000004', 'Section A', 35),
('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000004', 'Section B', 35),
-- Class 2
('b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000005', 'Section A', 35),
('b0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000005', 'Section B', 35),
-- Class 3
('b0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000006', 'Section A', 35),
('b0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000006', 'Section B', 35),
-- Class 4
('b0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000007', 'Section A', 35),
('b0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000007', 'Section B', 35),
-- Class 5
('b0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000008', 'Section A', 35),
('b0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000008', 'Section B', 35),
-- Class 6
('b0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000009', 'Section A', 40),
('b0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000009', 'Section B', 40),
-- Class 7
('b0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000010', 'Section A', 40),
('b0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000010', 'Section B', 40),
-- Class 8
('b0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000011', 'Section A', 40),
('b0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000011', 'Section B', 40),
-- Class 9
('b0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000012', 'Section A', 40),
('b0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000012', 'Section B', 40),
-- Class 10
('b0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000013', 'Section A', 40),
('b0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000013', 'Section B', 40)
ON CONFLICT (class_id, name) DO NOTHING;

-- 3. Teachers
INSERT INTO public.teachers (id, employee_id, first_name, last_name, email, phone, qualification, specialization, joining_date, salary, status) VALUES
('d1a00000-0000-0000-0000-000000000001', 'EMP-2026-001', 'Robert', 'Miller', 'r.miller@apex.edu', '+1 555-0321', 'Ph.D. in Mathematics', 'Higher Mathematics & Calculus', '2024-01-15', 5500.00, 'active'),
('d1a00000-0000-0000-0000-000000000002', 'EMP-2026-002', 'Sarah', 'Jenkins', 's.jenkins@apex.edu', '+1 555-0399', 'M.Sc. Physics', 'Applied Physics & Chemistry', '2024-03-01', 5200.00, 'active')
ON CONFLICT (employee_id) DO NOTHING;

-- 4. Students (referencing new Class 9 / Class 10 UUIDs)
INSERT INTO public.students (id, admission_number, roll_number, first_name, last_name, gender, date_of_birth, class_id, section_id, blood_group, emergency_contact, address, guardian_name, guardian_relation, guardian_phone, guardian_email, admission_date, status) VALUES
('a1000000-0000-0000-0000-000000000001', 'ADM-2026-10-001', '1001', 'Sophia',  'Martinez', 'female', '2011-05-14', 'c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000025', 'O+', '+1 555-0192', '742 Evergreen Terrace', 'Carlos Martinez', 'Father', '+1 555-0192', 'carlos.m@example.com', '2026-08-15', 'active'),
('a1000000-0000-0000-0000-000000000002', 'ADM-2026-10-002', '1002', 'Aaliyah', 'Khan',     'female', '2011-08-22', 'c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000025', 'A+', '+1 555-0144', '124 Elm Street',        'Farhan Khan',     'Father', '+1 555-0144', 'farhan.k@example.com',  '2026-08-16', 'active'),
('a1000000-0000-0000-0000-000000000003', 'ADM-2026-09-014', '0914', 'Liam',    'Johnson',  'male',   '2012-03-10', 'c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000024', 'B+', '+1 555-0187', '58 Maple Avenue',       'Emma Johnson',    'Mother', '+1 555-0187', 'emma.j@example.com',    '2026-08-18', 'active')
ON CONFLICT (admission_number) DO NOTHING;

-- 5. Fee Structure
INSERT INTO public.fee_structures (id, class_id, title, tuition_fee, computer_lab_fee, library_fee, sports_fee, exam_fee) VALUES
('f1000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000013', 'Class 10 Regular Session 2026', 150.00, 30.00, 20.00, 15.00, 25.00)
ON CONFLICT (id) DO NOTHING;

-- 6. Fee Vouchers
INSERT INTO public.fee_vouchers (id, voucher_number, student_id, fee_structure_id, billing_month, issue_date, due_date, base_amount, fine_after_due_date, paid_amount, status) VALUES
('e1a00000-0000-0000-0000-000000000001', 'VCH-202611-1001', 'a1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000010', '2026-11-01', '2026-11-01', '2026-11-20', 240.00, 25.00, 240.00, 'paid'),
('e1a00000-0000-0000-0000-000000000002', 'VCH-202611-1002', 'a1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000010', '2026-11-01', '2026-11-01', '2026-11-20', 240.00, 25.00, 0.00, 'unpaid')
ON CONFLICT (voucher_number) DO NOTHING;

-- 7. Examinations
INSERT INTO public.exams (id, title, term, start_date, end_date, academic_year, is_published) VALUES
('e0000000-0000-0000-0000-000000000001', 'Midterm Examination 2026-27', 'First Term', '2026-10-10', '2026-10-25', '2026-2027', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 8. Exam Subjects
INSERT INTO public.exam_subjects (id, exam_id, class_id, subject_name, total_marks, passing_marks) VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000013', 'Mathematics', 100.00, 40.00),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000013', 'Science',     100.00, 40.00),
('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000013', 'English',     100.00, 40.00),
('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000013', 'History',     100.00, 40.00)
ON CONFLICT (exam_id, class_id, subject_name) DO NOTHING;

-- 9. Exam Marks for Student 1001 (Sophia Martinez)
INSERT INTO public.exam_marks (exam_subject_id, student_id, marks_obtained, grade, remarks) VALUES
('f0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 94.00, 'A+', 'Exceptional problem solving'),
('f0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 92.00, 'A+', 'Thorough conceptual understanding'),
('f0000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 88.00, 'A', 'Good critical reading'),
('f0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 90.00, 'A+', 'Active participation')
ON CONFLICT (exam_subject_id, student_id) DO NOTHING;
