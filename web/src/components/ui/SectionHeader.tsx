import { forwardRef, HTMLAttributes } from "react";

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ label, title, description, align = "center", className = "", ...props }, ref) => {
    const alignStyles = {
      left: "text-left max-w-2xl",
      center: "text-center mx-auto max-w-2xl",
    };

    return (
      <div ref={ref} className={`${alignStyles[align]} ${className}`} {...props}>
        {label && (
          <span className="section-label">{label}</span>
        )}
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className="mt-4 text-lg leading-8 text-ink-subtle">{description}</p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
