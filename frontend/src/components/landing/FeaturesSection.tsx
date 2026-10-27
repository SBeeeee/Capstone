import { Container, SectionHeader, Card, ScanIcon, ShieldIcon, DropletIcon, UsersIcon, ChartIcon, CalendarIcon } from "@/components/shared";

const features = [
  {
    icon: <ScanIcon className="w-6 h-6" />,
    title: "Disease Detection",
    description: "YOLO v11 powered detection identifies diseases from leaf images with high precision.",
  },
  {
    icon: <ShieldIcon className="w-6 h-6" />,
    title: "Treatment Recommendations",
    description: "Get specific pesticide recommendations with correct dosage for each detected disease.",
  },
  {
    icon: <DropletIcon className="w-6 h-6" />,
    title: "Environmental Monitoring",
    description: "Track temperature, humidity, and soil moisture data alongside disease analysis.",
  },
  {
    icon: <UsersIcon className="w-6 h-6" />,
    title: "Cohort Analysis",
    description: "Compare plants to determine if disease is environmental or plant-specific.",
  },
  {
    icon: <ChartIcon className="w-6 h-6" />,
    title: "Historical Trends",
    description: "Visualize disease severity over time with detailed charts and trend analysis.",
  },
  {
    icon: <CalendarIcon className="w-6 h-6" />,
    title: "Spray Tracking",
    description: "Log and track all pesticide applications with dosage history and effectiveness.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <Container>
        <SectionHeader
          title="Powerful Features"
          subtitle="Everything you need to monitor and protect your crops"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} hover>
              <div className="p-3 bg-primary-50 text-primary-700 rounded-xl w-fit">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
