"use client";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export default function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-500/30 bg-primary-600/20 px-3 py-1.5 text-xs font-medium text-primary-300">
      {label}
      <button
        onClick={onRemove}
        className="text-primary-400 transition-colors hover:text-white"
        aria-label={`Hapus filter ${label}`}
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
