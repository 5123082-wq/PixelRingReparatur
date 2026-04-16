'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LocationPickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'light' | 'dark';
}

interface PhotonFeature {
  properties: {
    name?: string;
    city?: string;
    street?: string;
    housenumber?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

const LocationPicker = ({ value, onChange, placeholder, className, variant = 'light' }: LocationPickerProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        // Bias towards Germany but works globally
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lat=51.16&lon=10.45`);
        const data = await res.json();
        setSuggestions(data.features || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Photon API error:', error);
      }
    };

    const debounceId = setTimeout(() => {
      if (query !== value) {
        fetchSuggestions();
      }
    }, 500);

    return () => clearTimeout(debounceId);
  }, [query, value]);

  const handleSelect = (feature: PhotonFeature) => {
    const p = feature.properties;
    const parts = [p.name, p.street, p.housenumber, p.postcode, p.city, p.state].filter(Boolean);
    const label = Array.from(new Set(parts)).join(', ');
    setQuery(label);
    onChange(label);
    setIsOpen(false);
  };

  const getDropdownClass = () => {
    if (variant === 'dark') {
      return 'bg-[#1A2E47] border border-white/10 text-white shadow-xl';
    }
    return 'bg-white border text-[#0E1A2B] shadow-lg';
  };
  
  const getItemClass = (index: number) => {
     let c = 'px-4 py-2.5 cursor-pointer text-sm transition-colors ';
     if (variant === 'dark') {
        c += 'hover:bg-white/10 border-b border-white/5 last:border-0';
     } else {
        c += 'hover:bg-[#F7F1E8] border-b border-[#E7DDD3] last:border-0';
     }
     return c;
  };

  return (
    <div className="relative flex flex-col gap-1 w-full" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
           setQuery(e.target.value);
           if (!e.target.value) onChange('');
        }}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true) }}
        autoComplete="new-password"
        placeholder={placeholder}
        className={className}
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-1 z-50 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto ${getDropdownClass()}`}>
          {suggestions.map((feature, i) => {
             const p = feature.properties;
             const primary = p.name || p.street;
             const secondary = [p.postcode, p.city, p.country].filter(Boolean).join(', ');
             
             return (
              <div key={i} onClick={() => handleSelect(feature)} className={getItemClass(i)}>
                <div className="font-semibold text-[14px] leading-tight">{primary} {p.name ? '' : p.housenumber}</div>
                {(secondary && secondary !== primary) && (
                  <div className={`text-[12px] truncate mt-0.5 ${variant === 'dark' ? 'text-white/60' : 'text-[#72665D]'}`}>
                    {secondary}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
