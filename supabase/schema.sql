-- ==============================================================================
-- School Management System (SMS) - Supabase / PostgreSQL Schema & Seed Data
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types
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

-- 3. Profiles (Linked with Supabase auth.users)
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

-- 4. Classes & Sections
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

-- 5. Teachers Table
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

-- 6. Students Table (Module 1)
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

-- 7. Daily Attendance Table (Module 2)
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

-- 8. Fee Structures & Vouchers (Module 3)
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

-- 9. Exams, Subjects & Report Cards (Module 4)
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
-- Default Seed Data
-- ==============================================================================

-- Grading Scales
INSERT INTO public.grading_scales (grade, min_percentage, max_percentage, gpa_point, description) VALUES
('A+', 90.00, 100.00, 4.00, 'Outstanding / Distinction'),
('A',  80.00, 89.99,  3.70, 'Excellent'),
('B',  70.00, 79.99,  3.00, 'Very Good'),
('C',  60.00, 69.99,  2.00, 'Satisfactory'),
('D',  50.00, 59.99,  1.00, 'Pass'),
('F',   0.00, 49.99,  0.00, 'Fail')
ON CONFLICT (grade) DO NOTHING;

-- Sample Classes & Sections
INSERT INTO public.classes (id, name, numeric_order) VALUES
('c1000000-0000-0000-0000-000000000009', 'Grade 9', 9),
('c1000000-0000-0000-0000-000000000010', 'Grade 10', 10)
ON CONFLICT DO NOTHING;

INSERT INTO public.sections (id, class_id, name, capacity) VALUES
('s1000000-0000-0000-0000-00000000009a', 'c1000000-0000-0000-0000-000000000009', 'Section A', 35),
('s1000000-0000-0000-0000-00000000009b', 'c1000000-0000-0000-0000-000000000009', 'Section B', 35),
('s1000000-0000-0000-0000-00000000010a', 'c1000000-0000-0000-0000-000000000010', 'Section A', 35)
ON CONFLICT DO NOTHING;

-- Sample Fee Structure for Grade 10
INSERT INTO public.fee_structures (id, class_id, title, tuition_fee, computer_lab_fee, library_fee, sports_fee, exam_fee) VALUES
('f1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000010', 'Grade 10 Regular Session 2026', 150.00, 30.00, 20.00, 15.00, 25.00)
ON CONFLICT DO NOTHING;
