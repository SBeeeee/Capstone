type BadgeVariant = "healthy" | "warning" | "critical" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  healthy: "bg-primary-100 text-primary-800 border-primary-200",
  warning: "bg-secondary-100 text-secondary-800 border-secondary-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-earth-100 text-earth-700 border-earth-200",
};

export default function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
