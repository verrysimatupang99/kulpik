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
      default: "bg-dark-800 border border-dark-600",
      elevated: "bg-dark-800 border border-dark-600 shadow-xl shadow-black/20",
      bordered: "bg-transparent border border-dark-500",
      glass: "bg-dark-800/50 backdrop-blur-xl border border-dark-600/50",
      gradient: "bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hover
      ? "hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-0.5 cursor-pointer"
      : "";

    const glowStyles = glow
      ? "shadow-lg shadow-primary-600/10"
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