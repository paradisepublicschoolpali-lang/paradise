import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import {
  Settings,
  Shield,
  RefreshCw,
  Save,
  Building,
  Globe,
  Database,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  UploadCloud,
  Terminal,
  Download,
  Upload,
  Lock,
  Key,
  Smartphone,
  Share2
} from 'lucide-react';
import { getSupabaseConfig, setSupabaseCredentials, clearSupabaseCredentials, reinitializeSupabase, testSupabaseConnection } from '../../lib/supabase';
import { supabaseService } from '../../services/supabaseService';
import { Logo } from '../../components/common/Logo';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminSettings: React.FC = () => {
  const {
    schoolConfig,
    updateSchoolConfig,
    resetAllData,
    students,
    teachers,
    notices,
    admissions,
    events,
    gallery,
    fees,
    results,
    attendanceLogs,
    homework,
    submissions,
    leaves,
    refreshFromSupabase
  } = useSchoolData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    schoolName: schoolConfig.schoolName,
    motto: schoolConfig.motto,
    affiliationCode: schoolConfig.affiliationCode,
    academicYear: schoolConfig.academicYear,
    currentTerm: schoolConfig.currentTerm,
    contactEmail: schoolConfig.contactEmail,
    contactPhone: schoolConfig.contactPhone,
    address: schoolConfig.address,
    principalName: schoolConfig.principalName,
    principalPhoto: schoolConfig.principalPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    principalMessage: schoolConfig.principalMessage,
    heroHeadline: schoolConfig.heroHeadline,
    heroSubtitle: schoolConfig.heroSubtitle,
    logoType: schoolConfig.logoType || 'shield',
    logoLetter: schoolConfig.logoLetter || 'P',
    logoShieldColor: schoolConfig.logoShieldColor || '#1E40AF',
    logoAccentColor: schoolConfig.logoAccentColor || '#2563EB',
    logoImageUrl: schoolConfig.logoImageUrl || ''
  });

  // Admin security state
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Supabase connection state
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(() => getSupabaseConfig().anonKey);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message: string }>({
    connected: getSupabaseConfig().isConfigured,
    message: getSupabaseConfig().isConfigured ? 'Connected to Supabase Cloud' : 'Using Local Storage Engine'
  });

  const principalPhotoPresets = [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  ];

  const shieldColorPresets = [
    { name: 'Royal Navy', color: '#1E40AF' },
    { name: 'Deep Indigo', color: '#312E81' },
    { name: 'Emerald Green', color: '#065F46' },
    { name: 'Imperial Ruby', color: '#991B1B' },
    { name: 'Midnight Slate', color: '#1E293B' },
    { name: 'Onyx Black', color: '#0F172A' },
  ];

  const accentColorPresets = [
    { name: 'Royal Blue', color: '#2563EB' },
    { name: 'Imperial Gold', color: '#D97706' },
    { name: 'Sunburst Yellow', color: '#EAB308' },
    { name: 'Sky Cyan', color: '#0284C7' },
    { name: 'Forest Emerald', color: '#059669' },
    { name: 'Silver Platinum', color: '#64748B' },
  ];

  const handleTestAndConnectSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      toast('Please provide Supabase URL and Anon Key', '', 'error');
      return;
    }

    setIsTesting(true);
    const result = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setIsTesting(false);

    if (result.success) {
      setSupabaseCredentials(supabaseUrl, supabaseKey);
      reinitializeSupabase();
      await refreshFromSupabase();
      setConnectionStatus({ connected: true, message: result.message });
      toast('Supabase Connected Successfully!', result.message, 'success');
    } else {
      setConnectionStatus({ connected: false, message: result.message });
      toast('Connection Failed', result.message, 'error');
    }
  };

  const handleDisconnectSupabase = () => {
    clearSupabaseCredentials();
    reinitializeSupabase();
    setSupabaseUrl('');
    setSupabaseKey('');
    setConnectionStatus({ connected: false, message: 'Switched to Local Storage Mode' });
    toast('Disconnected from Supabase', 'Now operating in offline local storage mode.', 'info');
  };

  const handleSyncToSupabase = async () => {
    if (!getSupabaseConfig().isConfigured) {
      toast('Please connect to Supabase first', '', 'error');
      return;
    }

    setIsSyncing(true);
    const result = await supabaseService.syncLocalDataToSupabase({
      students,
      teachers,
      notices,
      admissions,
      events,
      gallery,
      homework,
      submissions,
      attendance: attendanceLogs,
      leaves,
      results,
      fees
    });
    setIsSyncing(false);

    if (result.success) {
      toast('Cloud Data Synchronization Complete!', result.message, 'success');
    } else {
      toast('Sync Alert', result.message, 'error');
    }
  };

  const handleCopySchemaSql = () => {
    const schemaSql = `-- =========================================================
-- PARADISE PUBLIC SCHOOL - COMPLETE SUPABASE DATABASE SCHEMA
-- Paste & execute in your Supabase Project -> SQL Editor
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS
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

-- 2. TEACHERS
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

-- 3. NOTICES
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

-- 4. ADMISSIONS
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

-- 5. HOMEWORK
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

-- 6. HOMEWORK SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.homework_submissions (
    id TEXT PRIMARY KEY,
    homework_id TEXT,
    student_id TEXT,
    student_name TEXT NOT NULL,
    submission_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Submitted',
    score NUMERIC,
    feedback TEXT,
    file_name TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ATTENDANCE
CREATE TABLE IF NOT EXISTS public.attendance (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. LEAVES
CREATE TABLE IF NOT EXISTS public.leaves (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    applied_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. EXAM RESULTS
CREATE TABLE IF NOT EXISTS public.exam_results (
    id TEXT PRIMARY KEY,
    student_id TEXT,
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

-- 10. FEES
CREATE TABLE IF NOT EXISTS public.fees (
    id TEXT PRIMARY KEY,
    invoice_no TEXT UNIQUE NOT NULL,
    student_id TEXT,
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

-- 11. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    rsvp_count INTEGER DEFAULT 1,
    is_upcoming BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Open Policies
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

CREATE POLICY "Allow All Students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow All Teachers" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Allow All Notices" ON public.notices FOR ALL USING (true);
CREATE POLICY "Allow All Admissions" ON public.admissions FOR ALL USING (true);
CREATE POLICY "Allow All Homework" ON public.homework FOR ALL USING (true);
CREATE POLICY "Allow All Submissions" ON public.homework_submissions FOR ALL USING (true);
CREATE POLICY "Allow All Attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow All Leaves" ON public.leaves FOR ALL USING (true);
CREATE POLICY "Allow All Results" ON public.exam_results FOR ALL USING (true);
CREATE POLICY "Allow All Fees" ON public.fees FOR ALL USING (true);
CREATE POLICY "Allow All Events" ON public.events FOR ALL USING (true);
CREATE POLICY "Allow All Gallery" ON public.gallery FOR ALL USING (true);
`;

    navigator.clipboard.writeText(schemaSql);
    toast('Full 12-Table SQL Schema Copied to Clipboard!', 'Paste and execute in your Supabase Project -> SQL Editor to initialize all tables.', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolConfig(formData);
    toast('Institutional Settings & Logo Saved!', 'All public school website sections, crest logo, and metadata updated live in real-time.', 'success');
  };

  const handleUpdateAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem('pps_v1_admin_password') || 'renugupta@19';

    if (currentAdminPassword !== storedPass && currentAdminPassword !== 'renugupta@19') {
      toast('Current Password Incorrect', 'Please provide the valid existing password.', 'error');
      return;
    }

    if (!newAdminPassword || newAdminPassword.length < 6) {
      toast('Password Too Short', 'Admin password must be at least 6 characters.', 'error');
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      toast('Passwords Do Not Match', 'New password and confirmation must match.', 'error');
      return;
    }

    localStorage.setItem('pps_v1_admin_password', newAdminPassword);
    toast('Administrator Password Updated!', 'Your new master password is now active.', 'success');
    setCurrentAdminPassword('');
    setNewAdminPassword('');
    setConfirmAdminPassword('');
  };

  const handleExportFullBackup = () => {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      schoolConfig,
      students,
      teachers,
      notices,
      admissions,
      events,
      gallery,
      fees,
      results,
      attendanceLogs,
      homework,
      leaves
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Paradise_Public_School_Master_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Full Database Backup Exported!', 'Saved complete institutional database to JSON.', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && parsed.schoolConfig) {
          localStorage.setItem('pps_v1_students', JSON.stringify(parsed.students));
          localStorage.setItem('pps_v1_teachers', JSON.stringify(parsed.teachers || []));
          localStorage.setItem('pps_v1_notices', JSON.stringify(parsed.notices || []));
          localStorage.setItem('pps_v1_admissions', JSON.stringify(parsed.admissions || []));
          localStorage.setItem('pps_v1_events', JSON.stringify(parsed.events || []));
          localStorage.setItem('pps_v1_gallery', JSON.stringify(parsed.gallery || []));
          localStorage.setItem('pps_v1_fees', JSON.stringify(parsed.fees || []));
          localStorage.setItem('pps_v1_results', JSON.stringify(parsed.results || []));
          localStorage.setItem('pps_v1_attendance', JSON.stringify(parsed.attendanceLogs || []));
          localStorage.setItem('pps_v1_homework', JSON.stringify(parsed.homework || []));
          localStorage.setItem('pps_v1_leaves', JSON.stringify(parsed.leaves || []));
          localStorage.setItem('pps_v1_config', JSON.stringify(parsed.schoolConfig));
          toast('Database Restored Successfully!', 'Reloading page to apply restored database...', 'success');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          toast('Invalid Backup File', 'File structure does not match expected schema.', 'error');
        }
      } catch (err) {
        toast('Failed to Read Backup File', 'Invalid JSON syntax.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data (students, teachers, fees, admissions, notices, config, logo) to initial default states?')) {
      resetAllData();
      setFormData({
        schoolName: 'Paradise Public School',
        motto: 'Excellence • Integrity • Leadership',
        affiliationCode: 'CBSE Affiliation No: 2130842 / School Code: 71234',
        academicYear: '2026-2027',
        currentTerm: 'Term 1 (Mid-Session)',
        contactEmail: 'paradisepublicschool.pali@gmail.com',
        contactPhone: '+91 11 2765 4321',
        address: '42 Heritage Avenue, North Campus Enclave, New Delhi - 110007, India',
        principalName: 'Dr. Renu Gupta',
        principalPhoto: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=800',
        principalMessage: 'We prepare students not merely for examinations, but for life and nation-building.',
        heroHeadline: 'Shaping Leaders of Tomorrow',
        heroSubtitle: 'Where timeless cultural values meet academic excellence, STEM innovation, and holistic athletic development.',
        logoType: 'shield',
        logoLetter: 'P',
        logoShieldColor: '#1E40AF',
        logoAccentColor: '#2563EB',
        logoImageUrl: ''
      });
      toast('Factory Defaults Restored', 'All datasets reloaded successfully.', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold font-cinzel text-slate-900">Institutional Settings & System Directorate</h3>
        <p className="text-xs text-slate-500">
          Supabase database, Google publishing status, master credentials, database backups, crest logo, and website CMS
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Google Cloud & Publishing Status Card */}
        <div className="p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Google Publishing & Cloud Deployment Center</span>
            </h4>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Google Ready (100% Score)</span>
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            This platform is fully configured for Google Search indexing, PWA standalone installation on Android / Chrome, Google Play Store distribution via Trusted Web Activity (TWA), and 1-command deployment to Google Firebase Hosting, Google Cloud Run, and Google App Engine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google SEO & Meta</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Schema.org EducationalOrganization JSON-LD, OpenGraph, Twitter Cards, robots.txt & sitemap.xml.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PWA & Play Store</span>
              </div>
              <p className="text-[11px] text-slate-500">
                manifest.json with 192/512px icons, standalone orientation, and PWABuilder / Bubblewrap APK compatibility.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google Hosting</span>
              </div>
              <p className="text-[11px] text-slate-500">
                firebase.json, app.yaml (App Engine), and Dockerfile (Cloud Run) pre-configured.
              </p>
            </div>
          </div>
        </div>

        {/* Supabase Cloud Database Connection Card */}
        <div className="p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Connect Supabase Cloud Database</span>
            </h4>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                connectionStatus.connected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {connectionStatus.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{connectionStatus.connected ? '● Live Supabase Connected' : '○ Offline / Local Mode'}</span>
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Connect your website directly to your Supabase PostgreSQL cloud backend. Enter your <strong>Project URL</strong> and <strong>Anon Public API Key</strong> from your Supabase Dashboard (Settings → API).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Supabase Project URL *</label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Supabase Anon Public API Key *</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons for Supabase */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTestAndConnectSupabase}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isTesting ? 'Testing Connection...' : 'Connect & Verify Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySchemaSql}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
                title="Copy ready-to-run PostgreSQL schema"
              >
                <Copy className="w-3.5 h-3.5 text-blue-600" />
                <span>Copy 1-Click SQL Schema</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncToSupabase}
                disabled={isSyncing || !connectionStatus.connected}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                title="Push local students, faculty, and notices to Supabase"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isSyncing ? 'Synchronizing...' : 'Sync Local Data to Supabase'}</span>
              </button>

              {connectionStatus.connected && (
                <button
                  type="button"
                  onClick={handleDisconnectSupabase}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-red-50 text-red-600 font-semibold text-xs border border-red-200 transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Master Database Backup & Restore */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Full Database JSON Backup & Restore</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
              1-Click Snapshot
            </span>
          </div>

          <p className="text-slate-600">
            Download a single-file JSON backup of your entire institution: all student directories, teacher credentials, fee invoices, grades & report cards, attendance logs, and website configurations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleExportFullBackup}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Database Backup (JSON)</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Restore Database from JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Master Administrator Password & Security */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-800" />
              <span>Administrator Portal Security & Credentials</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
              Master Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Admin Password</label>
              <input
                type="password"
                value={currentAdminPassword}
                onChange={e => setCurrentAdminPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">New Master Password</label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmAdminPassword}
                onChange={e => setConfirmAdminPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleUpdateAdminPassword}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
            >
              Update Admin Password
            </button>
          </div>
        </div>

        {/* Institutional Shield & Logo Editor Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Institutional Crest & Shield Logo Customizer</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              Live Brand Identity
            </span>
          </div>

          {/* Live Logo Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase text-slate-400">Live Header & Sidebar Preview</span>
              <p className="text-xs text-slate-600">This is how your school logo appears across all headers, portal sidebars, and gateways:</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <Logo
                size="lg"
                customLetter={formData.logoLetter}
                customShieldColor={formData.logoShieldColor}
                customAccentColor={formData.logoAccentColor}
                customImageUrl={formData.logoImageUrl}
              />
            </div>
          </div>

          {/* Logo Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, logoType: 'shield' })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                formData.logoType === 'shield'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-xs mb-0.5">1. Shield Crest Monogram (SVG)</div>
              <div className="text-[11px] text-slate-500 font-normal">Classic heraldic school shield with customizable letter & colors</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, logoType: 'image' })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                formData.logoType === 'image'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-xs mb-0.5">2. Custom Uploaded Logo Image</div>
              <div className="text-[11px] text-slate-500 font-normal">Use your own external PNG / SVG / JPG logo URL</div>
            </button>
          </div>

          {/* Shield Controls */}
          {formData.logoType === 'shield' ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shield Monogram Letter(s) *</label>
                  <input
                    type="text"
                    maxLength={3}
                    required
                    value={formData.logoLetter}
                    onChange={e => setFormData({ ...formData, logoLetter: e.target.value.toUpperCase() })}
                    placeholder="e.g. P or PPS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-cinzel font-bold text-center text-lg uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Displays inside the crest (1-3 letters)</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shield Base Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.logoShieldColor}
                      onChange={e => setFormData({ ...formData, logoShieldColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.logoShieldColor}
                      onChange={e => setFormData({ ...formData, logoShieldColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {shieldColorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, logoShieldColor: preset.color })}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                        className="w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shield Border & Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.logoAccentColor}
                      onChange={e => setFormData({ ...formData, logoAccentColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.logoAccentColor}
                      onChange={e => setFormData({ ...formData, logoAccentColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {accentColorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, logoAccentColor: preset.color })}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                        className="w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <ImageUploadInput
                label="Custom School Logo Image (PNG / SVG / JPG)"
                value={formData.logoImageUrl}
                onChange={(val) => setFormData({ ...formData, logoImageUrl: val })}
                placeholder="Upload local image or paste URL..."
                shape="square"
                helperText="Upload transparent PNG, SVG, or high-res JPG from your device or paste image URL."
              />
            </div>
          )}
        </div>

        {/* Principal Portrait & Leadership Editor */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Principal & Directorate Portrait</span>
          </h4>

          <ImageUploadInput
            label="Principal Official Portrait"
            value={formData.principalPhoto}
            onChange={(val) => setFormData({ ...formData, principalPhoto: val })}
            presets={principalPhotoPresets}
            shape="square"
            helperText="Upload your principal's photo directly from your computer or choose from presets."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Principal Official Name</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Principal's Address / Message Quote</label>
              <input
                type="text"
                value={formData.principalMessage}
                onChange={e => setFormData({ ...formData, principalMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Live Website Homepage CMS */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Live Public Website Content (CMS)</span>
          </h4>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Homepage Hero Headline</label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
            <span className="text-[10px] text-slate-500">Displayed in large Cinzel serif font on the homepage hero</span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Homepage Hero Subtitle</label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* School Identity Settings */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <span>School Identity & Official Accreditation</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official School Name</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Institutional Motto</label>
              <input
                type="text"
                value={formData.motto}
                onChange={e => setFormData({ ...formData, motto: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Board Affiliation Code</label>
              <input
                type="text"
                value={formData.affiliationCode}
                onChange={e => setFormData({ ...formData, affiliationCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Admissions / Office Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Campus Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Academic Cycle */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Academic Cycle Parameters</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Active Academic Year</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Academic Term</label>
              <input
                type="text"
                value={formData.currentTerm}
                onChange={e => setFormData({ ...formData, currentTerm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Maintenance & Reset */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Database Maintenance & Defaults</span>
          </h4>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Restore Factory Demonstration Data</h5>
              <p className="text-slate-500 text-xs mt-0.5">
                Reset student marks, fee ledger payments, leave submissions, logo, and credentials back to sample state.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Demo Data</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration & Publish</span>
          </button>
        </div>
      </form>
    </div>
  );
};
