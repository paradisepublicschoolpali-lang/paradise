import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, GraduationCap, Globe, UserCheck, ChevronUp, ChevronDown, LayoutGrid } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole, logout, currentUser } = useAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const roles: { key: UserRole; label: string; icon: React.ReactNode; desc: string; badge: string }[] = [
    {
      key: 'guest',
      label: 'Guest Website',
      icon: <Globe className="w-4 h-4 text-blue-600" />,
      desc: 'Public Information, Admissions & Tours',
      badge: 'Public'
    },
    {
      key: 'parent',
      label: 'Parent / Student',
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
      desc: 'Aryan Sharma (Grade 10-A)',
      badge: 'Student ID'
    },
    {
      key: 'teacher',
      label: 'Teacher Portal',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      desc: 'Dr. Sarah Jenkins (Physics)',
      badge: 'Teacher ID'
    },
    {
      key: 'admin',
      label: 'Admin Portal',
      icon: <Shield className="w-4 h-4 text-purple-600" />,
      desc: 'Dr. Robert Vance (Principal)',
      badge: 'Admin'
    }
  ];

  const handleSelectRole = (newRole: UserRole, label: string) => {
    if (newRole === role) return;
    switchRole(newRole);
    toast(`Viewing ${label}`, 'Switched demo portal view', 'info');
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-3 w-80 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Switch Portal
              </span>
            </div>
            <button
              onClick={logout}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Open Gateway Screen →
            </button>
          </div>

          {/* Role list */}
          <div className="space-y-1.5">
            {roles.map(r => {
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => handleSelectRole(r.key, r.label)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center gap-3 border cursor-pointer ${
                    active
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'}`}>
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{r.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Pill */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-slate-300 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all text-xs font-semibold text-slate-800 cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        <span className="text-slate-500">Portal:</span>
        <span className="capitalize font-bold text-blue-600">
          {role === 'guest' ? 'Guest Website' : role === 'parent' ? 'Parent / Student' : role === 'teacher' ? 'Teacher' : 'Admin'}
        </span>
        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
      </button>
    </div>
  );
};
