import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HabitTrackerPreview } from "@/components/sections/HabitTrackerPreview";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        <HeroSection />
        <FeaturesSection />
        <HabitTrackerPreview />
      </main>
    </div>
  );
}