import React from 'react';
import {
  Home,
  GraduationCap,
  FileText,
  Bell,
  LogIn,
  LayoutDashboard,
  CalendarCheck2,
  Award,
  CreditCard,
  Users,
  CheckSquare,
  Settings,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  role: 'guest' | 'parent' | 'teacher' | 'admin';
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  role,
  activeTab,
  setActiveTab
}) => {
  const { openGateway } = useAuth();

  let items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action?: () => void;
  }[] = [];

  if (role === 'guest') {
    items = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'academics', label: 'Academics', icon: GraduationCap },
      { id: 'admissions', label: 'Admissions', icon: FileText },
      { id: 'notices', label: 'Notices', icon: Bell },
      { id: 'portal', label: 'Portal', icon: LogIn, action: openGateway }
    ];
  } else if (role === 'parent') {
    items = [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
      { id: 'results', label: 'Report', icon: Award },
      { id: 'fees', label: 'Fees', icon: CreditCard },
      { id: 'notices', label: 'Circulars', icon: Bell }
    ];
  } else if (role === 'teacher') {
    items = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'classes', label: 'Classes', icon: Users },
      { id: 'attendance', label: 'Roll Call', icon: CheckSquare },
      { id: 'results', label: 'Marks', icon: Award },
      { id: 'notices', label: 'Circulars', icon: Bell }
    ];
  } else if (role === 'admin') {
    items = [
      { id: 'dashboard', label: 'Console', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'results', label: 'Gradebook', icon: Award },
      { id: 'attendance', label: 'Presence', icon: CalendarCheck2 },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)] print:hidden">
      <div className="max-w-md mx-auto grid grid-flow-col auto-cols-fr items-center px-2 py-1.5 sm:py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 rounded-xl select-none active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 line-clamp-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
