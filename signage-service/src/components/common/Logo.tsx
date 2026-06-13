import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  monochrome?: boolean;
  hideText?: boolean;
  compact?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, isDark = true, monochrome = false, hideText = false, compact = false }) => {
  const textColor = monochrome ? 'text-black' : isDark ? 'text-[#0E1A2B]' : 'text-white';
  const ringColor = monochrome ? '#000000' : isDark ? '#C86E4A' : '#FFFFFF';
  const pixelBgColor = monochrome ? '#333333' : '#2B2621';
  const nodeColor = monochrome ? '#666666' : '#E7B792';
  const logoBgColor = monochrome ? '#F0F0F0' : '#0E1A2B';
  const gapClass = compact ? 'gap-2.5' : 'gap-3';
  const textSizeClass = compact ? 'text-[22px]' : 'text-[24px] sm:text-[34px]';

  return (
    <div className={`flex items-center ${gapClass} ${className}`}>
      <div
        className="relative w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ backgroundColor: logoBgColor }}
      >
        {/* Ring Outer */}
        <div
          className="absolute rounded-full border-[3px]"
          style={{ width: '32px', height: '32px', left: '6px', top: '6px', borderColor: ringColor }}
        />
        {/* Pixel Cut */}
        <div
          className="absolute rounded-[3px]"
          style={{ width: '10px', height: '10px', left: '26px', top: '6px', backgroundColor: pixelBgColor }}
        />
        {/* Accent Node */}
        <div
          className="absolute rounded-[2px]"
          style={{ width: '8px', height: '8px', left: '27px', top: '7px', backgroundColor: nodeColor }}
        />
      </div>
      {!hideText ? (
        <span className={`${textSizeClass} font-bold tracking-[0.2px] leading-tight ${textColor}`} style={{ fontFamily: 'Manrope, sans-serif' }}>
          <span className="hidden sm:inline">PixelRing</span>
          <span className="sm:hidden">PR service</span>
        </span>
      ) : null}
    </div>
  );
};

export default Logo;
