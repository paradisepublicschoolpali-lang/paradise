import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  customLetter?: string;
  customShieldColor?: string;
  customAccentColor?: string;
  customImageUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  customLetter,
  customShieldColor,
  customAccentColor,
  customImageUrl
}) => {
  let schoolConfig;
  try {
    const context = useSchoolData();
    schoolConfig = context.schoolConfig;
  } catch {
    schoolConfig = {
      schoolName: 'Paradise Public School',
      motto: 'Excellence • Integrity • Leadership',
      logoType: 'shield' as const,
      logoLetter: 'P',
      logoShieldColor: '#1E40AF',
      logoAccentColor: '#2563EB',
      logoImageUrl: ''
    };
  }

  const letter = customLetter !== undefined ? customLetter : (schoolConfig?.logoLetter || 'P');
  const shieldColor = customShieldColor || schoolConfig?.logoShieldColor || '#1E40AF';
  const accentColor = customAccentColor || schoolConfig?.logoAccentColor || '#2563EB';
  const logoType = schoolConfig?.logoType || 'shield';
  const imageUrl = customImageUrl !== undefined ? customImageUrl : (schoolConfig?.logoImageUrl || '');

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-18 h-18'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  };

  // Split school name for two-tone styling if 3 words e.g. "Paradise Public School"
  const nameParts = (schoolConfig?.schoolName || 'Paradise Public School').split(' ');
  const firstWord = nameParts[0] || 'PARADISE';
  const restWords = nameParts.slice(1).join(' ') || 'PUBLIC SCHOOL';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem / Shield / Custom Image */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        {logoType === 'image' && imageUrl ? (
          <img
            src={imageUrl}
            alt="School Logo"
            className="w-full h-full object-contain rounded-xl drop-shadow-md"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md">
            {/* Outer Shield Frame with Dynamic Shield Color */}
            <path
              d="M 50 5 L 90 22 C 90 68 50 102 50 102 C 50 102 10 68 10 22 Z"
              fill={shieldColor}
              stroke={accentColor}
              strokeWidth="3.5"
            />
            {/* Inner Inset Border */}
            <path
              d="M 50 14 L 82 28 C 82 63 50 92 50 92 C 50 92 18 63 18 28 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeDasharray="2 1"
              opacity="0.6"
            />
            {/* Emblem Backing */}
            <path
              d="M 32 45 C 42 40 50 48 50 48 C 50 48 58 40 68 45 C 68 62 50 67 50 67 C 50 67 32 62 32 45 Z"
              fill={accentColor}
              opacity="0.4"
            />
            {/* Dynamic Central Monogram (Default 'P' or customized letter) */}
            <text
              x="50"
              y="66"
              fontFamily="'Cinzel', serif"
              fontSize={letter.length > 2 ? '22' : letter.length === 2 ? '28' : '34'}
              fontWeight="900"
              fill="#FFFFFF"
              textAnchor="middle"
            >
              {letter}
            </text>
            {/* Star Top */}
            <polygon points="50,22 52,27 57,27 53,30 55,35 50,32 45,35 47,30 43,27 48,27" fill="#FDE047" />
          </svg>
        )}
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-cinzel font-black tracking-wider uppercase text-blue-700 ${titleSizes[size]}`}>
            {firstWord}
          </span>
          <span className={`font-cinzel font-semibold tracking-widest text-slate-800 uppercase ${titleSizes[size]}`}>
            {restWords}
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-500 uppercase font-medium mt-1">
            <span className="text-blue-600 font-bold">Estd. 1994</span>
            <span>•</span>
            <span className="truncate max-w-[240px]">{schoolConfig?.motto || 'Excellence • Integrity • Leadership'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
