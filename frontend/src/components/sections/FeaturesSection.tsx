import { cn } from "@/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

function FeatureCard({ title, description, children, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "group relative p-6 rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1",
      className
    )}>
      <div className="mb-4 aspect-square w-16 overflow-hidden rounded-lg border bg-muted p-2">
        {children}
      </div>
      <h3 className="mb-2 font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 px-4 scroll-mt-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to build better habits
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Track Habits Feature */}
          <FeatureCard
            title="Track Your Habits Like a Pro"
            description="Monitor your daily activities with our GitHub-inspired streak calendar. Watch your progress grow day by day."
          >
            <div className="grid grid-cols-4 gap-1 h-full w-full">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-sm transition-colors",
                    i % 3 === 0 ? "bg-primary/20" :
                    i % 4 === 0 ? "bg-primary/40" :
                    i % 5 === 0 ? "bg-primary/60" :
                    "bg-primary/10"
                  )}
                />
              ))}
            </div>
          </FeatureCard>

          {/* Streaks Feature */}
          <FeatureCard
            title="Earn Points and Build Streaks"
            description="Turn consistency into achievement. Earn points and watch your streaks grow with every completed habit."
          >
            <div className="grid grid-cols-4 gap-1 h-full w-full">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-sm",
                    i < 5 ? "bg-primary" : "bg-primary/20"
                  )}
                />
              ))}
            </div>
          </FeatureCard>

          {/* Share Feature */}
          <FeatureCard
            title="Share Activities and Gain Motivation"
            description="Connect with others, share your progress, and stay motivated with our supportive community."
          >
            <div className="grid grid-cols-3 gap-1 h-full w-full">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-linear-to-br from-primary/20 to-primary/40"
                />
              ))}
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}