export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryTint: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  card: string;
  border: string;
  borderLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  tabBar: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  statusBar: 'dark-content' | 'light-content';
}

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    primary: '#1E3A8A', // Deep Navy
    primaryLight: '#2563EB', // Royal Blue
    primaryTint: '#EFF6FF', // Soft Blue Tint
    accent: '#D97706', // Golden Amber
    accentLight: '#FEF3C7',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#EA580C',
    warningLight: '#FFEDD5',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabBarActive: '#1E3A8A',
    tabBarInactive: '#64748B',
    statusBar: 'dark-content',
  },
  dark: {
    primary: '#3B82F6', // Lighter Royal Blue for contrast
    primaryLight: '#60A5FA',
    primaryTint: '#1E293B',
    accent: '#F59E0B',
    accentLight: '#78350F',
    background: '#0B0F17', // Rich deep slate-black
    surface: '#151D2A',
    card: '#1B2434',
    border: '#2A3649',
    borderLight: '#1F2937',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    success: '#22C55E',
    successLight: '#14532D',
    warning: '#F97316',
    warningLight: '#7C2D12',
    error: '#EF4444',
    errorLight: '#7F1D1D',
    tabBar: '#151D2A',
    tabBarBorder: '#2A3649',
    tabBarActive: '#60A5FA',
    tabBarInactive: '#94A3B8',
    statusBar: 'light-content',
  }
};
