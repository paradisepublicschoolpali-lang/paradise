-- =========================================================
-- PARADISE PUBLIC SCHOOL - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor to initialize
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    login_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'password123',
    admission_no TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    house TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT NOT NULL,
    blood_group TEXT,
    guardian_name TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    guardian_email TEXT,
    address TEXT,
    bus_route TEXT,
    bus_number TEXT,
    locker_number TEXT,
    avatar TEXT,
    attendance_rate NUMERIC DEFAULT 96.0,
    gpa NUMERIC DEFAULT 3.9,
    fee_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY,
    login_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'teacher123',
    employee_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    designation TEXT NOT NULL,
    department TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience_years INTEGER DEFAULT 5,
    assigned_classes JSONB DEFAULT '[]'::jsonb,
    avatar TEXT,
    joining_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    target_audience TEXT NOT NULL DEFAULT 'All',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    pdf_url TEXT,
    author TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ADMISSIONS APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admissions (
    id TEXT PRIMARY KEY,
    application_no TEXT UNIQUE NOT NULL,
    applicant_name TEXT NOT NULL,
    grade_applying TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    address TEXT,
    previous_school TEXT,
    submission_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Pending',
    notes TEXT,
    test_score NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. HOMEWORK TABLE
CREATE TABLE IF NOT EXISTS public.homework (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    description TEXT NOT NULL,
    max_points INTEGER DEFAULT 50,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. HOMEWORK SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.homework_submissions (
    id TEXT PRIMARY KEY,
    homework_id TEXT REFERENCES public.homework(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    submission_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Submitted',
    score NUMERIC,
    feedback TEXT,
    file_name TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ATTENDANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. LEAVE APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.leaves (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    applied_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. EXAM RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.exam_results (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_marks NUMERIC NOT NULL,
    max_total NUMERIC NOT NULL,
    percentage NUMERIC NOT NULL,
    gpa NUMERIC NOT NULL,
    rank INTEGER,
    overall_grade TEXT NOT NULL,
    teacher_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. FEES TABLE
CREATE TABLE IF NOT EXISTS public.fees (
    id TEXT PRIMARY KEY,
    invoice_no TEXT UNIQUE NOT NULL,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    term TEXT NOT NULL,
    due_date DATE NOT NULL,
    breakdown JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    paid_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    payment_date DATE,
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    rsvp_count INTEGER DEFAULT 0,
    is_upcoming BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) with Public Access policies for demo simplicity
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for authenticated & anonymous users (adjust for strict production)
CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public Write Students" ON public.students FOR ALL USING (true);

CREATE POLICY "Public Read Teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Public Write Teachers" ON public.teachers FOR ALL USING (true);

CREATE POLICY "Public Read Notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public Write Notices" ON public.notices FOR ALL USING (true);

CREATE POLICY "Public Read Admissions" ON public.admissions FOR SELECT USING (true);
CREATE POLICY "Public Write Admissions" ON public.admissions FOR ALL USING (true);

CREATE POLICY "Public Read Homework" ON public.homework FOR SELECT USING (true);
CREATE POLICY "Public Write Homework" ON public.homework FOR ALL USING (true);

CREATE POLICY "Public Read Fees" ON public.fees FOR SELECT USING (true);
CREATE POLICY "Public Write Fees" ON public.fees FOR ALL USING (true);

CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Write Events" ON public.events FOR ALL USING (true);

CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Write Gallery" ON public.gallery FOR ALL USING (true);
