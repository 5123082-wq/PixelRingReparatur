import type { ReactNode } from 'react';

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionEyebrow({ children, className = '' }: SectionEyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-[2px] w-8 bg-[#8F4C2F]" />
      <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8F4C2F]">
        {children}
      </span>
    </div>
  );
}
