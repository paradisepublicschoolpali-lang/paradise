import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCcw,
  Wifi,
  Battery,
  Shield,
  GraduationCap,
  Users,
  Compass,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobilePreviewWrapperProps {
  children: React.ReactNode;
}

export const MobilePreviewWrapper: React.FC<MobilePreviewWrapperProps> = ({ children }) => {
  // If native Capacitor app or already on actual mobile screen, do not show preview frame
  const isNative = Capacitor.isNativePlatform();
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [deviceType, setDeviceType] = useState<'ios' | 'android'>('ios');
  const [currentTime, setCurrentTime] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const { role, switchRole, enterAsGuest } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // When on native mobile app or on screens smaller than 800px, render native/direct
  if (isNative || windowWidth < 800) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-blue-600 selection:text-white">
      {/* Top Mobile Preview Controller Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                Paradise Mobile App
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Cross-Platform Build
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Native iOS & Android Capacitor preview
            </p>
          </div>
        </div>

        {/* Device Switcher & Quick Role Switchers */}
        <div className="flex items-center gap-2">
          {/* Platform Toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setDeviceType('ios')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                deviceType === 'ios'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🍎 iPhone 16 Pro</span>
            </button>
            <button
              onClick={() => setDeviceType('android')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                deviceType === 'android'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🤖 Android (Pixel 9)</span>
            </button>
          </div>

          {/* Quick Role Switcher for Testing */}
          <div className="hidden lg:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 px-2">Role:</span>
            <button
              onClick={enterAsGuest}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                role === 'guest' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Public
            </button>
            <button
              onClick={() => switchRole('parent')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                role === 'parent' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Parent
            </button>
            <button
              onClick={() => switchRole('teacher')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                role === 'teacher' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                role === 'admin' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Toggle Full Screen / Preview */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title={isPreviewMode ? 'View Full Screen' : 'View Mobile Frame'}
          >
            {isPreviewMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Full Web</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Device Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {isPreviewMode ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
          {/* Mobile Device Mockup */}
          <div
            className={`relative flex flex-col transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(37,99,235,0.15)] ${
              deviceType === 'ios'
                ? 'w-[393px] h-[830px] rounded-[52px] border-[12px] border-slate-800 ring-1 ring-slate-700/60 bg-white'
                : 'w-[392px] h-[820px] rounded-[42px] border-[10px] border-slate-800 ring-1 ring-slate-700/60 bg-white'
            }`}
          >
            {/* Status Bar */}
            <div
              className={`w-full z-40 select-none flex items-center justify-between px-7 shrink-0 ${
                deviceType === 'ios'
                  ? 'h-11 bg-slate-900 text-white pt-1'
                  : 'h-9 bg-slate-900 text-white'
              }`}
            >
              {/* Left: Clock */}
              <span className="text-[12px] font-semibold tracking-tight">
                {currentTime || '09:41'}
              </span>

              {/* iOS Dynamic Island */}
              {deviceType === 'ios' && (
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 space-x-1 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 border border-slate-700" />
                </div>
              )}

              {/* Android Center Camera Hole */}
              {deviceType === 'android' && (
                <div className="w-3 h-3 bg-black rounded-full shadow-inner border border-slate-800" />
              )}

              {/* Right: Icons */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">5G</span>
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Inner Mobile Screen Content */}
            <div className="relative flex-1 w-full bg-white overflow-y-auto overscroll-contain flex flex-col text-slate-900">
              {children}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div
              className={`w-full shrink-0 flex items-center justify-center bg-white ${
                deviceType === 'ios' ? 'h-6 pb-2' : 'h-4 pb-1'
              }`}
            >
              <div
                className={`rounded-full bg-slate-800/70 ${
                  deviceType === 'ios' ? 'w-32 h-1' : 'w-24 h-1'
                }`}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white text-slate-900">
          {children}
        </div>
      )}
    </div>
  );
};
