import React, { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { Phone, Mail, Clock, Lock, Menu, X, ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notices', label: 'Notices' },
    { id: 'contact', label: 'Contact' },
  ];

  const navigateTo = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcements Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+91 11 2765 4321</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>paradisepublicschool.pali@gmail.com</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Mon - Sat: 08:00 AM - 04:30 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Admissions Open 2026-27</span>
            </span>

            <button
              onClick={logout}
              className="text-xs font-semibold text-white hover:text-blue-300 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 transition-colors cursor-pointer shadow-xs"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>← Portal Gateway</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main White Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button onClick={() => navigateTo('home')} className="cursor-pointer text-left">
              <Logo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(link => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => navigateTo(link.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
              >
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Portal Login</span>
              </button>

              <button
                onClick={() => navigateTo('admissions')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
                title="Portal Login"
              >
                <LayoutGrid className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id)}
                  className={`p-3 text-left rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === link.id
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-2 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Portal Login (Parent/Teacher/Admin)</span>
              </button>
              <button
                onClick={() => navigateTo('admissions')}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
