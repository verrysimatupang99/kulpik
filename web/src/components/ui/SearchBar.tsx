"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Cari...",
  suggestions = [],
  onSelectSuggestion,
}: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setTimeout(() => setShowSuggestions(false), 150);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center gap-2 rounded-xl border border-dark-600 bg-dark-700 px-3 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/20">
        <svg className="h-5 w-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) onSubmit();
          }}
          placeholder={placeholder}
          aria-label="Cari laptop"
          aria-expanded={showSuggestions}
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder-dark-400"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="text-dark-400 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div role="listbox" className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-dark-600 bg-dark-800 shadow-xl shadow-black/50">
          {filtered.slice(0, 8).map((s) => (
            <button
              key={s}
              role="option"
              onClick={() => {
                onChange(s);
                setShowSuggestions(false);
                onSelectSuggestion?.(s);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-dark-200 transition-colors hover:bg-dark-700 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
