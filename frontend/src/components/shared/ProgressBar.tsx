interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "severity" | "health";
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  variant = "default",
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const barColor =
    variant === "severity"
      ? percent < 30
        ? "bg-primary-500"
        : percent < 70
          ? "bg-secondary-500"
          : "bg-red-500"
      : variant === "health"
        ? percent > 70
          ? "bg-primary-500"
          : percent > 30
            ? "bg-secondary-500"
            : "bg-red-500"
        : "bg-primary-500";

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-text-secondary">{Math.round(percent)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
