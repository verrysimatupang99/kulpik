interface SpecBadgeProps {
  label: string;
  value: string | number;
  icon?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function SpecBadge({
  label,
  value,
  icon,
  variant = "default",
}: SpecBadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-medium ${variantClasses[variant]}`}
      aria-label={`${label}: ${value}`}
    >
      {icon && <span>{icon}</span>}
      <span className="font-semibold">{value}</span>
      <span className="opacity-70">{label}</span>
    </span>
  );
}