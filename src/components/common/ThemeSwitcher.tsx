import React, { useState } from 'react';
import { useTheme, THEMES, AccentTheme } from '../../context/ThemeContext';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ThemeSwitcherProps {
  compact?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ compact = false }) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const themeList = Object.values(THEMES);

  const handleSelectTheme = (themeId: AccentTheme, themeName: string) => {
    setTheme(themeId);
    toast(`Palette: ${themeName}`, 'Accent theme activated across all portals', 'info');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Color Theme Palette"
        className={`flex items-center gap-2 rounded-xl border transition-all cursor-pointer ${
          compact
            ? 'p-2 bg-[#0E1017] border-white/15 hover:border-white/40 text-white'
            : 'px-3 py-1.5 bg-[#0E1017] border-white/15 hover:border-white/40 text-xs font-semibold text-white'
        }`}
      >
        <div
          className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: THEMES[theme].dotColor, color: THEMES[theme].dotColor }}
        />
        {!compact && (
          <span className="hidden sm:inline text-slate-300 hover:text-white truncate">
            {THEMES[theme].badge}
          </span>
        )}
        <Palette className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Dropdown Swatch Popover */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
          <div className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-[#090A0E]/95 border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                  Color Theme Palette
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1.5">
              {themeList.map(t => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id, t.name)}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all text-xs cursor-pointer border ${
                      isActive
                        ? 'bg-white/10 border-white/40 text-white font-bold shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                        : 'bg-black/40 hover:bg-white/5 border-transparent text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full border border-black shadow-sm shrink-0"
                        style={{ backgroundColor: t.dotColor }}
                      />
                      <span className="truncate">{t.name}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-slate-400 text-center">
              Premium Black & White + Dynamic Accents
            </div>
          </div>
        </>
      )}
    </div>
  );
};
