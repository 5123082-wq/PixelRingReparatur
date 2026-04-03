import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, isDark = true }) => {
  const textColor = isDark ? 'text-[#0E1A2B]' : 'text-white';
  const ringColor = isDark ? '#B8643E' : '#FFFFFF'; // Using primary accent color for ring

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-11 h-11 bg-[#0E1A2B] rounded-xl flex items-center justify-center overflow-hidden">
        {/* Ring Outer */}
        <div 
          className="absolute w-8 h-8 rounded-full border-3"
          style={{ borderColor: ringColor }}
        />
        {/* Accent Node */}
        <div 
          className="absolute w-2 h-2 bg-[#37C7C0] rounded-sm top-[7px] right-[7px]"
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
