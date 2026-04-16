import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
      <input 
        className={`bg-zinc-950 border ${error ? 'border-red-500/50' : 'border-zinc-800'} text-zinc-100 placeholder:text-zinc-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/50 focus:border-zinc-600 transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
      <textarea 
        className={`bg-zinc-950 border ${error ? 'border-red-500/50' : 'border-zinc-800'} text-zinc-100 placeholder:text-zinc-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/50 focus:border-zinc-600 transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
      <select 
        className={`bg-zinc-950 border ${error ? 'border-red-500/50' : 'border-zinc-800'} text-zinc-100 placeholder:text-zinc-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700/50 focus:border-zinc-600 transition-colors appearance-none ${className}`}
        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23a1a1aa\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
