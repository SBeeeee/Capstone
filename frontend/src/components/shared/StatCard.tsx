import Card from "./Card";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export default function StatCard({
  value,
  label,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <Card className={`text-center ${className}`} hover>
      {icon && <div className="flex justify-center mb-3 text-primary-600">{icon}</div>}
      <div className="text-3xl font-bold text-primary-800">{value}</div>
      <div className="mt-1 text-sm text-text-muted font-medium">{label}</div>
    </Card>
  );
}
