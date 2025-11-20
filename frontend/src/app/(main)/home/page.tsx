import { useActivityFeedStore } from '@/store/useActivityFeedStore';
import { useUser } from '@stackframe/stack';
import React, { use, useEffect } from 'react'

export default function Home() {

  const user = useUser();

  const feed = useActivityFeedStore((state) => state.activityFeed);
  const fetchFeed = useActivityFeedStore((state) => state.getActivityFeed);
  const fetchingFeed = useActivityFeedStore((state) => state.gettingActivityFeed);
  const fetchFeedError = useActivityFeedStore((state) => state.gettingFeedError);

  useEffect(() => {
    if (!user) return;
    fetchFeed(user.id);
  }, [])

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </div>

      {/* Feed Content */}
      <div className="divide-y divide-border">
        {/* Placeholder for activity posts */}
        <div className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
          <p className="text-muted-foreground text-center py-8">
            Activities shared by others will appear here
          </p>
        </div>
      </div>
    </div>
  )
}

