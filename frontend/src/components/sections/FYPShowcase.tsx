import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActivityCard {
  id: number
  user: {
    name: string
    avatar: string
  }
  activity: string
  streak: number
  points: number
  media: {
    type: 'image' | 'video'
    placeholder: string
    aspectRatio: '9/16' | '4/5' | '1/1'
  }
}

const mockActivities: ActivityCard[] = [
  {
    id: 1,
    user: {
      name: "Alex",
      avatar: "A"
    },
    activity: "Morning Run",
    streak: 10,
    points: 150,
    media: {
      type: 'video',
      placeholder: 'bg-gradient-to-br from-orange-400 to-rose-400',
      aspectRatio: '9/16'
    }
  },
  {
    id: 2,
    user: {
      name: "Sarah",
      avatar: "S"
    },
    activity: "Gym Workout",
    streak: 15,
    points: 225,
    media: {
      type: 'video',
      placeholder: 'bg-gradient-to-br from-blue-400 to-purple-400',
      aspectRatio: '9/16'
    }
  },
  {
    id: 3,
    user: {
      name: "Mike",
      avatar: "M"
    },
    activity: "Meditate",
    streak: 7,
    points: 105,
    media: {
      type: 'video',
      placeholder: 'bg-gradient-to-br from-emerald-400 to-cyan-400',
      aspectRatio: '9/16'
    }
  }
]

function ActivityCard({ activity }: { activity: ActivityCard }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2">
      <CardHeader className="p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center font-medium border-2">
            {activity.user.avatar}
          </div>
          <div>
            <p className="font-medium">{activity.user.name}</p>
          </div>
        </div>
      </CardHeader>

      {/* Media Preview */}
      <div className={cn(
        "relative w-full",
        activity.media.aspectRatio === "9/16" ? "aspect-9/16" :
        activity.media.aspectRatio === "4/5" ? "aspect-4/5" :
        "aspect-square"
      )}>
        <div className={cn(
          "absolute inset-0",
          activity.media.placeholder
        )}>
          {activity.media.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{activity.activity}</h3>
          <div className="flex items-center gap-1">
            <span className="text-orange-500">🔥</span>
            <span className="text-sm font-medium">{activity.streak}d</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">Points earned</div>
          <div className="font-medium text-primary">{activity.points}</div>
        </div>

        {/* Pixel Border Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-primary/20 via-primary/40 to-primary/20" />
        <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-linear-to-b from-primary/20 via-primary/40 to-primary/20" />
      </CardContent>
    </Card>
  )
}

export function FYPShowcase() {
  return (
    <section className="w-full py-16 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">
            Community Highlights
          </h2>
          <p className="text-muted-foreground text-lg">
            See how others are building their habits and get inspired by their progress.
            Join the community and share your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:hidden max-w-sm mx-auto gap-6">
          <ActivityCard activity={mockActivities[0]} />
        </div>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {mockActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </section>
  )
}