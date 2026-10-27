import { Container, SectionHeader, Card, CameraIcon, ScanIcon, ShieldIcon } from "@/components/shared";

const steps = [
  {
    icon: <CameraIcon className="w-8 h-8" />,
    number: "01",
    title: "Capture",
    description: "Take a photo of your plant leaf using your phone, camera, or Raspberry Pi device.",
  },
  {
    icon: <ScanIcon className="w-8 h-8" />,
    number: "02",
    title: "Analyze",
    description: "Our AI model (YOLO v11) scans the image and identifies diseases with high accuracy.",
  },
  {
    icon: <ShieldIcon className="w-8 h-8" />,
    number: "03",
    title: "Treat",
    description: "Receive actionable treatment recommendations, dosage info, and preventive measures.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-earth-50">
      <Container>
        <SectionHeader
          title="How It Works"
          subtitle="Three simple steps to protect your crops from disease"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card key={step.number} hover className="text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                Step {step.number}
              </div>
              <div className="mt-4 flex justify-center">
                <div className="p-4 bg-primary-50 text-primary-700 rounded-2xl">
                  {step.icon}
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
