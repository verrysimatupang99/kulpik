import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hover = false,
      glow = false,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles = "rounded-2xl transition-all duration-300";

    const variants = {
      default: "bg-surface border border-edge",
      elevated: "bg-surface border border-edge shadow-card",
      bordered: "bg-transparent border border-edge-hover",
      glass: "bg-surface/50 backdrop-blur-xl border border-edge/50",
      gradient: "bg-gradient-to-br from-surface-raised to-surface border border-edge",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hover
      ? "hover:border-edge-hover hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer"
      : "";

    const glowStyles = glow
      ? "shadow-glow"
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${glowStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;