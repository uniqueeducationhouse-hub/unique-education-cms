-- 1. Enable RLS on all sensitive tables
//ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- 2. Helper Function: Get current user role from profiles
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Universal "Authenticated Staff" Read/Write Policies
-- This ensures ONLY logged-in users (auth.uid() is not null) can access data.

-- Example: Students Table
CREATE POLICY "Authenticated staff can view students" ON public.students
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated admins can manage students" ON public.students
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        public.current_user_role() IN ('super_admin', 'admin')
    );

-- Example: Fee Vouchers Table
CREATE POLICY "Authenticated staff can view vouchers" ON public.fee_vouchers
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Accountants and Admins manage vouchers" ON public.fee_vouchers
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        public.current_user_role() IN ('super_admin', 'admin', 'accountant')
    );

-- Example: Staff & Payroll (Restricted to HR/Admin)
CREATE POLICY "Admins and Accountants manage staff & payroll" ON public.staff
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        public.current_user_role() IN ('super_admin', 'admin', 'accountant')
    );

-- Example: School Settings
CREATE POLICY "Anyone authenticated can read school settings" ON public.school_settings
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update school settings" ON public.school_settings
    FOR ALL USING (
        auth.uid() IS NOT NULL AND 
        public.current_user_role() IN ('super_admin', 'admin')
    );//
