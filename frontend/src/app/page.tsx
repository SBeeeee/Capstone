import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import DecisionEngineSection from "@/components/landing/DecisionEngineSection";
import UploadSection from "@/components/landing/UploadSection";
import PlantProfilePreview from "@/components/landing/PlantProfilePreview";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <DecisionEngineSection />
      <UploadSection />
      <PlantProfilePreview />
      <FeaturesSection />
      <StatsSection />
    </>
  );
}
