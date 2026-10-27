import { Container, StatCard, LeafIcon, ScanIcon, ShieldIcon, ChartIcon } from "@/components/shared";

const stats = [
  { value: "10K+", label: "Plants Monitored", icon: <LeafIcon className="w-6 h-6" /> },
  { value: "95%", label: "Detection Accuracy", icon: <ScanIcon className="w-6 h-6" /> },
  { value: "50+", label: "Diseases Identified", icon: <ShieldIcon className="w-6 h-6" /> },
  { value: "24/7", label: "Real-time Monitoring", icon: <ChartIcon className="w-6 h-6" /> },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-primary-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Trusted by Farmers
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            DeepLeaf is making agriculture smarter, one leaf at a time
          </p>
          <div className="mt-4 mx-auto w-16 h-1 bg-primary-500 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
