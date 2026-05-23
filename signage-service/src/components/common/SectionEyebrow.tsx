import type { ReactNode } from 'react';

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionEyebrow({ children, className = '' }: SectionEyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-[2px] w-8 bg-[#B8643E]" />
      <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#B8643E]">
        {children}
      </span>
    </div>
  );
}
