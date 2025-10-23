import { cn } from "@/lib/utils"

function generateMockData(weeks: number): boolean[] {
  return Array.from({ length: weeks * 7 }, () => 
    Math.random() > 0.3 // 70% chance of having activity
  )
}

export function HabitTrackerPreview() {
  const activityData = generateMockData(12) // 12 weeks of data

  return (
    <section id="preview" className="w-full py-16 px-4 bg-muted/30 scroll-mt-16">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">
            Your Streaks in Pixels
          </h2>
          <p className="text-muted-foreground text-lg">
            Each pixel represents a day of activity. Complete your habits to keep your streak going
            and watch your progress grow over time.
          </p>
        </div>

        {/* Tracker Preview Container */}
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm border p-6">
          <div className="space-y-6">
            {/* Calendar Grid */}
            <div className="flex justify-center gap-1 overflow-x-auto pb-4">
              {Array.from({ length: 12 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const hasActivity = activityData[weekIndex * 7 + dayIndex]
                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "w-3 h-3 rounded-sm transition-colors",
                          hasActivity ? "bg-emerald-500" : "bg-muted/50 border-2"
                        )}
                      />
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-muted/50" />
                <span>No activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span>Completed</span>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">28</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">156</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">85%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}