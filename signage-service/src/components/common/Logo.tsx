import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  monochrome?: boolean;
  hideText?: boolean;
  compact?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  isDark = true,
  monochrome = false,
  hideText = false,
  compact = false,
}) => {
  const id = useId();
  const markBgId = `markBg-${id}`;
  const ringStrokeId = `ringStroke-${id}`;
  const pixelNodeId = `pixelNode-${id}`;

  const textColor = monochrome
    ? 'text-black'
    : isDark
    ? 'text-[#0E1A2B]'
    : 'text-white';

  const gapClass = compact ? 'gap-2.5' : 'gap-3';
  const textSizeClass = compact ? 'text-[22px]' : 'text-[24px] sm:text-[34px]';

  // Determine gradient colors based on monochrome / normal mode
  const bgStop1 = monochrome ? '#333333' : '#122238';
  const bgStop2 = monochrome ? '#111111' : '#07101F';
  const ringStop1 = monochrome ? '#888888' : '#FF8A39';
  const ringStop2 = monochrome ? '#555555' : '#E26024';
  const nodeStop1 = monochrome ? '#CCCCCC' : '#FFD0A2';
  const nodeStop2 = monochrome ? '#999999' : '#F0792E';
  const cutoutFill = monochrome ? '#111111' : '#07101F';

  return (
    <div className={`flex items-center ${gapClass} ${className}`}>
      <svg
        className="w-11 h-11 flex-shrink-0"
        viewBox="0 0 160 160"
        role="img"
        aria-labelledby={`title-${id} desc-${id}`}
      >
        <title id={`title-${id}`}>PixelRing</title>
        <desc id={`desc-${id}`}>Rounded square logo mark with gradient ring and pixel node.</desc>
        <defs>
          <linearGradient id={markBgId} x1="18" y1="18" x2="142" y2="142" gradientUnits="userSpaceOnUse">
            <stop stopColor={bgStop1} />
            <stop offset="1" stopColor={bgStop2} />
          </linearGradient>
          <linearGradient id={ringStrokeId} x1="39" y1="41" x2="116" y2="121" gradientUnits="userSpaceOnUse">
            <stop stopColor={ringStop1} />
            <stop offset="1" stopColor={ringStop2} />
          </linearGradient>
          <linearGradient id={pixelNodeId} x1="102" y1="33" x2="129" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor={nodeStop1} />
            <stop offset="1" stopColor={nodeStop2} />
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="136" height="136" rx="32" fill={`url(#${markBgId})`} />
        <circle cx="80" cy="83" r="45" fill="none" stroke={`url(#${ringStrokeId})`} strokeWidth="12" />
        <path d="M102 31h24c8.3 0 15 6.7 15 15v21h-31c-8.3 0-15-6.7-15-15v-14c0-3.9 3.1-7 7-7Z" fill={cutoutFill} />
        <rect x="103" y="32" width="29" height="29" rx="7" fill={`url(#${pixelNodeId})`} />
      </svg>

      {!hideText ? (
        <span
          className={`${textSizeClass} font-bold tracking-[0.2px] leading-tight ${textColor}`}
          style={{ fontFamily: 'Manrope, sans-serif' }}
        >
          <span className="hidden sm:inline">PixelRing</span>
          <span className="sm:hidden">PR service</span>
        </span>
      ) : null}
    </div>
  );
};

export default Logo;
