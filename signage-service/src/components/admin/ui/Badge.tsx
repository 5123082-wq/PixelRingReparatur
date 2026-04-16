import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'pink' | string;
  customColor?: string;
  className?: string;
}

export function Badge({ children, variant = 'default', customColor, className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-zinc-800 text-zinc-300',
    success: 'bg-emerald-500/15 text-emerald-500',
    warning: 'bg-amber-500/15 text-amber-500',
    error: 'bg-red-500/15 text-red-500',
    info: 'bg-blue-500/15 text-blue-500',
    purple: 'bg-purple-500/15 text-purple-500',
    pink: 'bg-pink-500/15 text-pink-500',
  };
  
  const baseClasses = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${customColor ? '' : (variants[variant] || variants.default)} ${className}`;

  return (
    <span className={baseClasses} style={customColor ? { backgroundColor: customColor, color: '#fff' } : undefined}>
      {children}
    </span>
  );
}
