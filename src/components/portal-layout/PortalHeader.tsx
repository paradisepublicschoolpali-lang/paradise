import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Menu, Bell, Calendar, LogOut } from 'lucide-react';
import { Modal } from '../common/Modal';

interface PortalHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu
}) => {
  const { role, currentUser, logout } = useAuth();
  const { notices } = useSchoolData();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Trigger + Back Button + Titles */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 lg:hidden"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.hash = '#/dashboard';
                }
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Go to Previous Page"
            >
              <span className="text-base leading-none">←</span>
              <span className="hidden sm:inline text-xs">Back</span>
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-cinzel tracking-wide">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-slate-500 hidden sm:block mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {/* Right: Date, Notifications, User */}
          <div className="flex items-center gap-3">
            {/* Date Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{todayFormatted}</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600" />
            </button>

            {/* User Info & Logout */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 font-mono capitalize">{role} portal</div>
              </div>

              <button
                onClick={logout}
                title="Switch Portal / Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Modal */}
      <Modal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        title="School Circulars & Notifications"
        subtitle="Latest official broadcasts"
        maxWidth="lg"
      >
        <div className="space-y-3">
          {notices.map(notice => (
            <div
              key={notice.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {notice.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
              </div>
              <h5 className="text-xs font-bold text-slate-900">{notice.title}</h5>
              <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
