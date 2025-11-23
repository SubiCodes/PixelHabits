"use client"

import CarouselMediaWithActionButtons from '@/components/CarouselMediaWithActionButtons';
import LoadingPage from '@/components/LoadingPage';
import { Button } from '@/components/ui/button';
import { useActivityFeedStore } from '@/store/useActivityFeedStore';
import { useUser } from '@stackframe/stack';
import React, { useEffect } from 'react'
import './custom-scrollbar.css';

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
    <div className="w-full h-screen bg-[#181818]">
      {/* Feed Content */}
      <div
        className="flex-1 overflow-y-scroll w-full snap-y snap-mandatory custom-scrollbar h-full"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {feed && feed.map((activity) => (
          <section key={activity.id} className="w-full h-dvh flex items-center justify-center snap-start">
            <CarouselMediaWithActionButtons
              media={activity.mediaUrls}
              posterName={activity?.owner?.name ?? ""}
              posterAvatar={activity?.owner?.profileImageUrl ?? ""}
              postDate={new Date(activity.createdAt).toLocaleDateString()}
              caption={activity.caption ?? ""}
            />
          </section>
        ))}
        {fetchingFeed && (
          <section className="w-full h-dvh flex items-center justify-center snap-start">
            <LoadingPage isMoonLoader={true}/>
          </section>
        )}
        {fetchFeedError && (
          <section className="w-full h-full flex flex-col gap-4 items-center justify-center snap-start">
            <p className="text-gray-300">Error loading feed. Please try again.</p>
            <Button onClick={() => fetchFeed(user?.id ?? "")} className='bg-white text-black hover:bg-gray-200 cursor-pointer'>Retry</Button>
          </section>
        )}
      </div>
    </div>
  )
}

