
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
      {/* Feed Content */}
      <div
        className="flex-1 overflow-y-scroll h-dvh w-full snap-y snap-mandatory scrollbar-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {feed && feed.map((activity) => (
          <section
            key={activity.id}
            className="w-full h-dvh flex items-center justify-center snap-start"
          >
            <CarouselMediaWithActionButtons
              media={activity.mediaUrls}
              posterName={activity?.owner?.name ?? ""}
              posterAvatar={activity?.owner?.profileImageUrl ?? ""}
              postDate={new Date(activity.createdAt).toLocaleDateString()}
              caption={activity.caption ?? ""}
            />
          </section>
        ))}
      </div>
    </div>
  )
}

