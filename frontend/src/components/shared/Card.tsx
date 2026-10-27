import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`bg-surface-card rounded-[var(--radius-lg)] border border-primary-100 ${hover ? "transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]" : "shadow-[var(--shadow-card)]"} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
