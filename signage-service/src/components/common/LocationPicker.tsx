'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LocationPickerProps {
  value: string;
  onChange: (val: string) => void;
  onLocationSelect?: (location: SelectedLocation | null) => void;
  inputId?: string;
  ariaLabel?: string;
  placeholder?: string;
  onBlur?: () => void;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  variant?: 'light' | 'dark';
  dropdownPosition?: 'top' | 'bottom';
}

interface PhotonFeature {
  geometry?: {
    coordinates?: [number, number];
  };
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

export type SelectedLocation = {
  label: string;
  latitude: number;
  longitude: number;
  source: 'photon';
};

function isFiniteCoordinate(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function buildLocationLabel(feature: PhotonFeature): string {
  const p = feature.properties;
  const streetLine = [p.street, p.housenumber].filter(Boolean).join(' ');
  const localityLine = [p.postcode, p.city].filter(Boolean).join(' ');
  const parts = [
    p.name && p.name !== p.street ? p.name : null,
    streetLine || p.street || null,
    localityLine || p.state || null,
    p.country,
  ].filter(Boolean);

  return Array.from(new Set(parts)).join(', ');
}

const LocationPicker = ({
  value,
  onChange,
  onLocationSelect,
  inputId,
  ariaLabel,
  placeholder,
  onBlur,
  disabled,
  maxLength,
  className,
  variant = 'light',
  dropdownPosition = 'bottom',
}: LocationPickerProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastSelectedLabelRef = useRef('');

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
      if (disabled || query.trim().length < 3) {
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
      if (query !== lastSelectedLabelRef.current) {
        fetchSuggestions();
      }
    }, 500);

    return () => clearTimeout(debounceId);
  }, [disabled, query, value]);

  const handleSelect = (feature: PhotonFeature) => {
    const label = buildLocationLabel(feature);
    const [longitude, latitude] = feature.geometry?.coordinates ?? [];

    lastSelectedLabelRef.current = label;
    setQuery(label);
    onChange(label);
    if (
      onLocationSelect &&
      isFiniteCoordinate(latitude) &&
      isFiniteCoordinate(longitude)
    ) {
      onLocationSelect({
        label,
        latitude,
        longitude,
        source: 'photon',
      });
    } else {
      onLocationSelect?.(null);
    }
    setIsOpen(false);
  };

  const getDropdownClass = () => {
    if (variant === 'dark') {
      return 'bg-[#1A2E47] border border-white/10 text-white shadow-xl';
    }
    return 'bg-white border border-[#E7DDD3] text-[#0E1A2B] shadow-lg';
  };
  
  const getItemClass = () => {
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
        id={inputId}
        type="text"
        value={query}
        onChange={(e) => {
           const nextValue = e.target.value;
           lastSelectedLabelRef.current = '';
           setQuery(nextValue);
           onChange(nextValue);
           onLocationSelect?.(null);
        }}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true) }}
        onBlur={onBlur}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete="new-password"
        aria-label={ariaLabel}
        placeholder={placeholder}
        className={className}
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className={`absolute left-0 right-[20%] z-50 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto no-scrollbar ${getDropdownClass()} ${
          dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
        }`}>
          {suggestions.map((feature, i) => {
             const p = feature.properties;
             const primary = p.name || p.street;
             const secondary = [p.postcode, p.city, p.country].filter(Boolean).join(', ');
             
             return (
              <div key={i} onClick={() => handleSelect(feature)} className={getItemClass()}>
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
