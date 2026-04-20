import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "sm", dot = false, children, className = "", ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-semibold rounded-full border";

    const variants = {
      default: "bg-dark-700 border-dark-500 text-dark-200",
      primary: "bg-primary-500/10 border-primary-500/30 text-primary-400",
      success: "bg-green-500/10 border-green-500/30 text-green-400",
      warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      danger: "bg-red-500/10 border-red-500/30 text-red-400",
      info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {dot && (
          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
            variant === "success" ? "bg-green-400" :
            variant === "warning" ? "bg-amber-400" :
            variant === "danger" ? "bg-red-400" :
            variant === "primary" ? "bg-primary-400" :
            variant === "info" ? "bg-blue-400" :
            "bg-dark-400"
          }`} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;