import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HabitTrackerPreview } from "@/components/sections/HabitTrackerPreview";
import { FYPShowcase } from "@/components/sections/FYPShowcase";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <main className="flex-1 pt-24">
        <HeroSection />
        <FeaturesSection />
        <HabitTrackerPreview />
        <FYPShowcase />
      </main>
      <Footer />
    </div>
  );
}