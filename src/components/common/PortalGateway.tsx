import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, UserCheck, Shield, Globe, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

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

    // Small delay for UX
    await new Promise(r => setTimeout(r, 400));

    let result: { success: boolean; error?: string };

    if (view === 'parent-login') {
      result = loginAsParent(loginId, password);
    } else if (view === 'teacher-login') {
      result = loginAsTeacher(loginId, password);
    } else {
      result = loginAsAdmin(loginId, password);
    }

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  // Login form for a specific role
  const renderLoginForm = (title: string, subtitle: string, icon: React.ReactNode, accentColor: string) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          ← Back to Portal Selection
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className={`px-8 py-6 ${accentColor} text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-bold font-cinzel">{title}</h2>
                <p className="text-sm opacity-90">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {view === 'parent-login' ? 'Student ID' : view === 'teacher-login' ? 'Teacher ID' : 'Admin ID'}
              </label>
              <input
                type="text"
                required
                value={loginId}
                onChange={e => { setLoginId(e.target.value); setError(''); }}
                placeholder={view === 'parent-login' ? 'e.g. aryan10' : view === 'teacher-login' ? 'e.g. sarah.physics' : 'e.g. admin'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${accentColor} hover:opacity-90 shadow-md`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* School Branding */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Paradise Public School • Established 1994
        </div>
      </div>
    </div>
  );

  // Login views
  if (view === 'parent-login') {
    return renderLoginForm(
      'Parent / Student Login',
      'Access results, attendance & fees',
      <GraduationCap className="w-6 h-6" />,
      'bg-blue-600'
    );
  }
  if (view === 'teacher-login') {
    return renderLoginForm(
      'Teacher Login',
      'Manage classes, grades & attendance',
      <UserCheck className="w-6 h-6" />,
      'bg-emerald-600'
    );
  }
  if (view === 'admin-login') {
    return renderLoginForm(
      'Admin Login',
      'Full school management access',
      <Shield className="w-6 h-6" />,
      'bg-slate-800'
    );
  }

  // Main 4-option gateway
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* School Header */}
        <div className="text-center mb-10">
          {/* Shield Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-lg">
                <path
                  d="M 50 5 L 90 22 C 90 68 50 102 50 102 C 50 102 10 68 10 22 Z"
                  fill="#1E40AF"
                  stroke="#2563EB"
                  strokeWidth="3"
                />
                <path
                  d="M 50 14 L 82 28 C 82 63 50 92 50 92 C 50 92 18 63 18 28 Z"
                  fill="none"
                  stroke="#93C5FD"
                  strokeWidth="1"
                  strokeDasharray="2 1"
                  opacity="0.6"
                />
                <text
                  x="50" y="65"
                  fontFamily="'Cinzel', serif"
                  fontSize="34" fontWeight="900"
                  fill="white"
                  textAnchor="middle"
                >
                  P
                </text>
                <polygon points="50,22 52,27 57,27 53,30 55,35 50,32 45,35 47,30 43,27 48,27" fill="#93C5FD" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-slate-900 tracking-wide">
            Paradise Public School
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium tracking-wider uppercase">
            Estd. 1994 • Excellence • Integrity • Leadership
          </p>
        </div>

        {/* 4 Portal Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Guest */}
          <button
            onClick={enterAsGuest}
            className="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">Guest</h3>
            <p className="text-sm text-slate-500 mt-1">
              Browse school information, admissions, events & gallery
            </p>
          </button>

          {/* Parent / Student */}
          <button
            onClick={() => { resetForm(); setView('parent-login'); }}
            className="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">Parent / Student</h3>
            <p className="text-sm text-slate-500 mt-1">
              View results, attendance, fees & homework
            </p>
          </button>

          {/* Teacher */}
          <button
            onClick={() => { resetForm(); setView('teacher-login'); }}
            className="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 transition-colors">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">Teacher</h3>
            <p className="text-sm text-slate-500 mt-1">
              Manage classes, attendance & grade students
            </p>
          </button>

          {/* Admin */}
          <button
            onClick={() => { resetForm(); setView('admin-login'); }}
            className="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-700 hover:shadow-lg transition-all text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-slate-800 group-hover:text-white text-slate-600 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800">Admin</h3>
            <p className="text-sm text-slate-500 mt-1">
              Full school management, students, teachers & settings
            </p>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-slate-400">
          © 2026 Paradise Public School. All rights reserved.
        </div>
      </div>
    </div>
  );
};
