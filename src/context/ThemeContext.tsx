import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccentTheme = 'gold' | 'monochrome' | 'sapphire' | 'emerald' | 'amethyst' | 'crimson';

export interface ThemeConfig {
  id: AccentTheme;
  name: string;
  badge: string;
  dotColor: string;
  previewClass: string;
  primary: string;
  light: string;
  dark: string;
  glow: string;
  gradientText: string;
  gradientBg: string;
}

export const THEMES: Record<AccentTheme, ThemeConfig> = {
  monochrome: {
    id: 'monochrome',
    name: 'Pure Monochrome (B&W)',
    badge: 'Black & White',
    dotColor: '#FFFFFF',
    previewClass: 'from-zinc-100 to-zinc-400',
    primary: '#FFFFFF',
    light: '#F8FAFC',
    dark: '#71717A',
    glow: 'rgba(255, 255, 255, 0.35)',
    gradientText: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #A1A1AA 100%)',
    gradientBg: 'linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 50%, #A1A1AA 100%)'
  },
  gold: {
    id: 'gold',
    name: 'Imperial Gold',
    badge: 'Gold Luxe',
    dotColor: '#D4AF37',
    previewClass: 'from-amber-200 via-yellow-400 to-amber-600',
    primary: '#D4AF37',
    light: '#F5D77F',
    dark: '#996515',
    glow: 'rgba(212, 175, 55, 0.35)',
    gradientText: 'linear-gradient(135deg, #FFF6D6 0%, #F5D77F 25%, #D4AF37 50%, #B8860B 75%, #F5D77F 100%)',
    gradientBg: 'linear-gradient(135deg, #F5D77F 0%, #D4AF37 50%, #B8860B 100%)'
  },
  sapphire: {
    id: 'sapphire',
    name: 'Royal Sapphire',
    badge: 'Prestige Blue',
    dotColor: '#38BDF8',
    previewClass: 'from-cyan-300 via-sky-400 to-blue-600',
    primary: '#38BDF8',
    light: '#7DD3FC',
    dark: '#0369A1',
    glow: 'rgba(56, 189, 248, 0.35)',
    gradientText: 'linear-gradient(135deg, #E0F2FE 0%, #7DD3FC 30%, #38BDF8 60%, #0284C7 100%)',
    gradientBg: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 50%, #0369A1 100%)'
  },
  emerald: {
    id: 'emerald',
    name: 'Ivy Emerald',
    badge: 'Oxford Green',
    dotColor: '#34D399',
    previewClass: 'from-emerald-300 via-emerald-400 to-teal-600',
    primary: '#34D399',
    light: '#6EE7B7',
    dark: '#047857',
    glow: 'rgba(52, 211, 153, 0.35)',
    gradientText: 'linear-gradient(135deg, #ECFDF5 0%, #6EE7B7 30%, #34D399 60%, #059669 100%)',
    gradientBg: 'linear-gradient(135deg, #34D399 0%, #059669 50%, #047857 100%)'
  },
  amethyst: {
    id: 'amethyst',
    name: 'Imperial Amethyst',
    badge: 'Royal Violet',
    dotColor: '#C084FC',
    previewClass: 'from-purple-300 via-fuchsia-400 to-indigo-600',
    primary: '#C084FC',
    light: '#E9D5FF',
    dark: '#7E22CE',
    glow: 'rgba(192, 132, 252, 0.35)',
    gradientText: 'linear-gradient(135deg, #FAF5FF 0%, #E9D5FF 30%, #C084FC 60%, #9333EA 100%)',
    gradientBg: 'linear-gradient(135deg, #C084FC 0%, #9333EA 50%, #7E22CE 100%)'
  },
  crimson: {
    id: 'crimson',
    name: 'Crown Crimson',
    badge: 'Ruby Red',
    dotColor: '#FB7185',
    previewClass: 'from-rose-300 via-rose-400 to-red-600',
    primary: '#FB7185',
    light: '#FECDD3',
    dark: '#BE123C',
    glow: 'rgba(251, 113, 133, 0.35)',
    gradientText: 'linear-gradient(135deg, #FFF1F2 0%, #FECDD3 30%, #FB7185 60%, #E11D48 100%)',
    gradientBg: 'linear-gradient(135deg, #FB7185 0%, #E11D48 50%, #BE123C 100%)'
  }
};

interface ThemeContextType {
  theme: AccentTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: AccentTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'paradise_school_theme_accent';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AccentTheme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AccentTheme;
    return saved && THEMES[saved] ? saved : 'monochrome';
  });

  const themeConfig = THEMES[theme] || THEMES.monochrome;

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent-primary', themeConfig.primary);
    root.style.setProperty('--accent-light', themeConfig.light);
    root.style.setProperty('--accent-dark', themeConfig.dark);
    root.style.setProperty('--accent-glow', themeConfig.glow);
    root.style.setProperty('--accent-gradient-text', themeConfig.gradientText);
    root.style.setProperty('--accent-gradient-bg', themeConfig.gradientBg);
  }, [theme, themeConfig]);

  const setTheme = (newTheme: AccentTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
