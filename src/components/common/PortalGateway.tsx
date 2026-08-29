import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import {
  GraduationCap,
  UserCheck,
  Shield,
  Globe,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Phone,
  Mail,
  Clock,
  Sparkles,
  KeyRound,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

type GatewayView = 'select' | 'parent-login' | 'teacher-login' | 'admin-login';

export const PortalGateway: React.FC = () => {
  const { enterAsGuest, loginAsParent, loginAsTeacher, loginAsAdmin } = useAuth();
  const [view, setView] = useState<GatewayView>('select');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setLoginId('');
    setPassword('');
    setError('');
    setShowPassword(false);
    setIsLoading(false);
  };

  const handleBack = () => {
    resetForm();
    setView('select');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small brief delay for realistic smooth transition
    await new Promise(r => setTimeout(r, 350));

    let result: { success: boolean; error?: string };

    if (view === 'parent-login') {
      result = loginAsParent(loginId.trim(), password);
    } else if (view === 'teacher-login') {
      result = loginAsTeacher(loginId.trim(), password);
    } else {
      result = loginAsAdmin(loginId.trim(), password);
    }

    if (!result.success) {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    setIsLoading(false);
  };

  // Render Role-specific Login Form
  const renderLoginForm = (
    title: string,
    titleHindi: string,
    subtitle: string,
    icon: React.ReactNode,
    accentBg: string,
    idLabel: string,
    idPlaceholder: string
  ) => (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/40 to-slate-100 flex flex-col justify-between p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto my-auto space-y-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-blue-700 text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer"
        >
          ← Back to Portal Selection (वापस जाएं)
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className={`px-6 py-5 ${accentBg} text-white space-y-2`}>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-bold font-cinzel leading-snug">{title}</h2>
                <span className="text-xs text-white/80 font-medium">{titleHindi}</span>
              </div>
            </div>
            <p className="text-xs text-white/90 leading-relaxed pt-1 border-t border-white/20">
              {subtitle}
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleLogin} className="p-6 sm:p-7 space-y-4.5">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-snug animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Login Unsuccessful</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {idLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={loginId}
                onChange={e => { setLoginId(e.target.value); setError(''); }}
                placeholder={idPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs font-semibold"
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password (पासवर्ड) <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your secret password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${accentBg} hover:brightness-110 shadow-md`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </span>
              ) : (
                <>
                  <span>Sign In to School Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Forgot ID or Password? Contact School Reception: <strong className="text-slate-700">+91 11 2765 4321</strong>
            </div>
          </form>
        </div>

        {/* School Branding Footer */}
        <div className="text-center text-xs text-slate-500 space-y-0.5">
          <p className="font-semibold text-slate-700">Paradise Public School • CBSE Affiliated (Estd. 1994)</p>
          <p className="text-[11px] text-slate-400">Pali, Rajasthan • Empowering Future Leaders</p>
        </div>
      </div>
    </div>
  );

  // Login View Routing
  if (view === 'parent-login') {
    return renderLoginForm(
      'Student & Parent Portal',
      'विद्यार्थी एवं अभिभावक लॉगिन',
      'View daily attendance, unit test marks, school notices & pay fees online',
      <GraduationCap className="w-6 h-6 text-white" />,
      'bg-blue-600',
      'Student ID / Admission No. (छात्र आईडी)',
      'e.g. PPS-2026-0842'
    );
  }

  if (view === 'teacher-login') {
    return renderLoginForm(
      'Teacher & Staff Portal',
      'अध्यापक एवं फैकल्टी लॉगिन',
      'Mark daily classroom roll call, enter exam marks, and manage period timetable',
      <UserCheck className="w-6 h-6 text-white" />,
      'bg-emerald-600',
      'Teacher ID / Employee ID (शिक्षक आईडी)',
      'e.g. PPS-FAC-014'
    );
  }

  if (view === 'admin-login') {
    return renderLoginForm(
      'Principal & Admin Portal',
      'प्रधानाचार्य एवं प्रबंधन लॉगिन',
      'Central institutional operations, fee treasury, staff records & admissions',
      <Shield className="w-6 h-6 text-white" />,
      'bg-slate-800',
      'Admin / Principal Login ID (प्रशासन आईडी)',
      'e.g. admin or principal'
    );
  }

  // ==========================================
  // MAIN 4-PORTAL GATEWAY SELECTION SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/30 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar for School Info */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
            CBSE Affiliated Senior Secondary School
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline font-medium">Affiliation No. 1730248</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden md:flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>+91 11 2765 4321</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Session 2026-27 Active</span>
          </span>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="max-w-4xl w-full mx-auto my-auto py-6 sm:py-8 space-y-8">
        {/* School Logo & Hero Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="xl" showSubtitle={false} className="justify-center" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-cinzel text-slate-900 tracking-wide">
              Paradise Public School
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold tracking-wider uppercase">
              पैराडाइज पब्लिक स्कूल • Estd. 1994 • Excellence • Integrity • Leadership
            </p>
          </div>

          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            Choose your login portal below / कृपया अपना पोर्टल चुनें:
          </div>
        </div>

        {/* 4 Clean Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* 1. Public School Website */}
          <button
            onClick={enterAsGuest}
            className="group p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  No Login Required
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-cinzel text-slate-900 group-hover:text-blue-700 flex items-center gap-2">
                  <span>School Website & Admissions</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium block">
                  विद्यालय मुख्य वेबसाइट एवं प्रवेश जानकारी
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Explore school overview, CBSE curriculum, online admission enquiry, campus photo gallery, and latest event circulars.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <span>Enter School Website →</span>
              <span className="text-[10px] font-normal text-slate-400">Open to All</span>
            </div>
          </button>

          {/* 2. Parent / Student Portal */}
          <button
            onClick={() => { resetForm(); setView('parent-login'); }}
            className="group p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  For Parents & Students
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-cinzel text-slate-900 group-hover:text-blue-700 flex items-center gap-2">
                  <span>Student & Parent Portal</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium block">
                  विद्यार्थी एवं अभिभावक लॉगिन
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Check monthly attendance ledger, exam report cards, quarterly tuition fee invoices, online payment, and teacher notices.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <span>Parent / Student Sign In →</span>
              <span className="text-[10px] font-mono text-slate-400">Secure Sign In</span>
            </div>
          </button>

          {/* 3. Teacher Portal */}
          <button
            onClick={() => { resetForm(); setView('teacher-login'); }}
            className="group p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Faculty & Staff
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-cinzel text-slate-900 group-hover:text-emerald-700 flex items-center gap-2">
                  <span>Teacher & Staff Portal</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium block">
                  शिक्षक एवं अध्यापिका लॉगिन
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Mark daily classroom roll call, enter unit test marks, enroll new scholars with initial fees, and view weekly timetable periods.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
              <span>Teacher Workstation Login →</span>
              <span className="text-[10px] font-mono text-slate-400">Faculty Sign In</span>
            </div>
          </button>

          {/* 4. Principal & Admin Portal */}
          <button
            onClick={() => { resetForm(); setView('admin-login'); }}
            className="group p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-xs">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                  School Directorate
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-cinzel text-slate-900 group-hover:text-slate-900 flex items-center gap-2">
                  <span>Principal & Admin Directorate</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium block">
                  प्रधानाचार्य एवं प्रबंधन लॉगिन
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Full school management, admission queue approvals, fee accounts & treasury, curriculum subjects, and faculty appointments.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Admin Console Sign In →</span>
              <span className="text-[10px] font-mono text-slate-400">Authorized Sign In</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Helpdesk & Indian School Footer */}
      <div className="max-w-5xl w-full mx-auto pt-6 border-t border-slate-200/80 text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>School Helpline: <strong>+91 11 2765 4321</strong></span>
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>paradisepublicschool.pali@gmail.com</span>
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Mon - Sat: 08:00 AM - 04:30 PM</span>
          </span>
        </div>

        <p className="text-[11px] text-slate-400">
          © 2026 Paradise Public School, Pali (Rajasthan). All rights reserved. Recognized by Government of Rajasthan & Affiliated with CBSE, New Delhi.
        </p>
      </div>
    </div>
  );
};
