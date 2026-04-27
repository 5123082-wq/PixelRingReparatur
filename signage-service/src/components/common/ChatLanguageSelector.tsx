'use client';

import React from 'react';

const LANGUAGES = [
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'PL', name: 'Polski', flag: '🇵🇱' },
  { code: 'AR', name: 'العربية', flag: '🇸🇦' },
];

interface ChatLanguageSelectorProps {
  onSelect: (languageName: string) => void;
}

export default function ChatLanguageSelector({ onSelect }: ChatLanguageSelectorProps) {
  return (
    <div className="inline-flex flex-col bg-white/90 backdrop-blur-md rounded-[20px] border border-black/5 p-2.5 shadow-sm animate-in fade-in zoom-in duration-300 max-w-full">
      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onSelect(lang.name)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-black/[0.03] bg-white/50 hover:bg-[#B8643E] hover:text-white transition-all group active:scale-90"
            title={lang.name}
          >
            <span className="text-[14px] leading-none">{lang.flag}</span>
            <span className="text-[11px] font-extrabold tracking-tight uppercase">
              {lang.code}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
