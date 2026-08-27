import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  Bell,
  CreditCard,
  Users,
  UserCheck,
  FileCheck2,
  Calendar,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface PortalSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { role, currentUser, logout } = useAuth();
  const { fees, homework, admissions } = useSchoolData();

  // Badges calculation
  const pendingFeesCount = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue').length;
  const activeHomeworkCount = homework.filter(h => h.status === 'Active').length;
  const pendingAdmissionsCount = admissions.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

  const parentMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'profile', label: 'Student Profile', icon: <User className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance & Leaves', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'results', label: 'Results & Gradebook', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'homework', label: 'Homework & Tasks', icon: <BookOpen className="w-4 h-4" />, badge: activeHomeworkCount ? `${activeHomeworkCount}` : undefined },
    { id: 'notices', label: 'Notices & Circulars', icon: <Bell className="w-4 h-4" /> },
    { id: 'fees', label: 'Fees & Payment', icon: <CreditCard className="w-4 h-4" />, badge: pendingFeesCount > 0 ? 'Due' : undefined, badgeColor: 'bg-red-100 text-red-700' },
  ];

  const teacherMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'classes', label: 'Classes & Timetable', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'attendance', label: 'Daily Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'homework', label: 'Homework Manager', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'results', label: 'Results Entry', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'notices', label: 'Notice Broadcaster', icon: <Bell className="w-4 h-4" /> },
  ];

  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard & KPIs', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Students Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'teachers', label: 'Faculty Directory', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'fees', label: 'Fee Management', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'admissions', label: 'Admissions Queue', icon: <FileCheck2 className="w-4 h-4" />, badge: pendingAdmissionsCount ? `${pendingAdmissionsCount}` : undefined, badgeColor: 'bg-blue-100 text-blue-700' },
    { id: 'notices', label: 'Notices & Circulars', icon: <Bell className="w-4 h-4" /> },
    { id: 'events', label: 'Events Manager', icon: <Calendar className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Manager', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'School Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const menuItems: MenuItem[] = role === 'parent' ? parentMenuItems : role === 'teacher' ? teacherMenuItems : adminMenuItems;

  const roleTitle = role === 'parent' ? 'Parent & Student' : role === 'teacher' ? 'Faculty & Teacher' : 'Administration';
  const roleBadgeColor = role === 'parent' ? 'bg-blue-100 text-blue-800' : role === 'teacher' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800';

  const selectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Header */}
          <div className="p-4 border-b border-slate-100">
            <Logo size="sm" showSubtitle={false} />
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${roleBadgeColor}`}>
                {roleTitle} Portal
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-3 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h5>
              <p className="text-[10px] text-slate-500 truncate">
                {currentUser.designation || (currentUser.grade ? `${currentUser.grade}-${currentUser.section}` : currentUser.email)}
              </p>
              {currentUser.loginId && (
                <span className="text-[9px] font-mono text-blue-600 font-semibold">ID: {currentUser.loginId}</span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-1 space-y-1 max-h-[calc(100vh-270px)] overflow-y-auto">
            {menuItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => selectTab(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        item.badgeColor || (active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <button
            onClick={logout}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            <LogOut className="w-4 h-4 text-blue-600" />
            <span>← Return to Portal Gateway</span>
          </button>
        </div>
      </aside>
    </>
  );
};
