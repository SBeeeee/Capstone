interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""} ${className}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-text-secondary max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-16 h-1 bg-primary-500 rounded-full" />
    </div>
  );
}
