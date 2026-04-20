import { forwardRef, HTMLAttributes } from "react";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, change, icon, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl border border-edge bg-surface p-5 shadow-card ${className}`}
        {...props}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            {label}
          </p>
          {icon && <span className="text-ink-faint">{icon}</span>}
        </div>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          {value}
        </p>
        {change && (
          <p className="mt-1 text-xs text-accent-400">{change}</p>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;
