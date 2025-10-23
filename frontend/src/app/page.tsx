import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
}