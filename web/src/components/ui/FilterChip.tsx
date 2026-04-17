"use client";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export default function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 text-primary-400 hover:text-primary-600"
        aria-label={`Hapus filter ${label}`}
      >
        ×
      </button>
    </span>
  );
}
