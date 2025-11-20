"use client"

import CarouselMediaWithActionButtons from '@/components/CarouselMediaWithActionButtons';
import { useActivityFeedStore } from '@/store/useActivityFeedStore';
import { useUser } from '@stackframe/stack';
import React, { useEffect } from 'react'

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
    <div className="w-full h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex flex-1 min-h-full min-w-full items-center justify-center ">
        {feed && (
          <div className="w-full h-full">
            {/* <CarouselMediaWithActionButtons /> */}
          </div>
        )}
      </div>
    </div>
  )
}

