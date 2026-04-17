interface SpecBadgeProps {
  label: string;
  value: string | number;
  icon?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function SpecBadge({ label, value, icon, variant = "default" }: SpecBadgeProps) {
  const variantClasses = {
    default: "bg-dark-700 text-dark-200 border-dark-500",
    success: "bg-green-500/10 text-green-400 border-green-500/30",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${variantClasses[variant]}`}
      aria-label={`${label}: ${value}`}
    >
      {icon && <span>{icon}</span>}
      <span className="font-semibold">{value}</span>
      <span className="opacity-70">{label}</span>
    </span>
  );
}
