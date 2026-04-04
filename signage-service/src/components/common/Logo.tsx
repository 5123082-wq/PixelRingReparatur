import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, isDark = true }) => {
  const textColor = isDark ? 'text-[#0E1A2B]' : 'text-white';
  const ringColor = isDark ? '#C86E4A' : '#FFFFFF';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-11 h-11 bg-[#0E1A2B] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
        {/* Ring Outer */}
        <div 
          className="absolute rounded-full border-[3px]"
          style={{ width: '32px', height: '32px', left: '6px', top: '6px', borderColor: ringColor }}
        />
        {/* Pixel Cut */}
        <div 
          className="absolute bg-[#2B2621] rounded-[3px]"
          style={{ width: '10px', height: '10px', left: '26px', top: '6px' }}
        />
        {/* Accent Node */}
        <div 
          className="absolute rounded-[2px]"
          style={{ width: '8px', height: '8px', left: '27px', top: '7px', backgroundColor: '#E7B792' }}
        />
      </div>
      <span className={`text-[24px] sm:text-[34px] font-bold tracking-[0.2px] leading-tight ${textColor}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
        <span className="hidden sm:inline">PixelRing</span>
        <span className="sm:hidden">PR service</span>
      </span>
    </div>
  );
};

export default Logo;
