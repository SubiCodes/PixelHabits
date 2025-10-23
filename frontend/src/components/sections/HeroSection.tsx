import Image from 'next/image'
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[60vh] w-full flex flex-col items-center justify-center px-4 py-16 scroll-mt-16">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="grid grid-cols-12 h-full w-full">
          {[...Array(144)].map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-foreground/10"
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-full max-w-[600px] sm:max-w-[800px] md:max-w-[1000px] relative aspect-video">
          <Image
            src="/logos/logo.png"
            alt="Pixel Habits"
            fill
            priority
            className="object-contain"
          />
        </div>

        <p className="text-xl sm:text-2xl text-muted-foreground font-mono">
          Track habits, earn streaks, stay consistent, share progress.
        </p>

        <Button
          size="lg"
          className="px-8 text-lg font-semibold hover:animate-pulse"
        >
          Get Started
        </Button>
      </div>
    </section>
  )
}