"use client"

import CarouselMediaWithActionButtons from '@/components/CarouselMediaWithActionButtons';
import LoadingPage from '@/components/LoadingPage';
import { Button } from '@/components/ui/button';
import { useActivityFeedStore } from '@/store/useActivityFeedStore';
import { useUser } from '@stackframe/stack';
import React, { useEffect, useRef, useState } from 'react'
import './custom-scrollbar.css';
import { useViewStore } from '@/store/useViewStore';

export default function Home() {

  const user = useUser();

  const feed = useActivityFeedStore((state) => state.activityFeed);
  const fetchFeed = useActivityFeedStore((state) => state.getActivityFeed);
  const fetchingFeed = useActivityFeedStore((state) => state.gettingActivityFeed);
  const fetchFeedError = useActivityFeedStore((state) => state.gettingFeedError);

  const view = useViewStore((state) => state.viewContent);

  //Current visible content states
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [visibleId, setVisibleId] = useState<string>('');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  //#region Track the currently visible item
  useEffect(() => {
    if (!user) return;
    fetchFeed(user.id);
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            const id = entry.target.getAttribute('data-id') || '';
            setVisibleIndex(index);
            setVisibleId(id);

            console.log('Currently visible:', { index, id });
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
        rootMargin: '0px'
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [feed]);
  //#endregion

  //Fetch new content when user reaches near end of feed
  useEffect(() => {
    if (((visibleIndex + 1) % 10 === 8) && (feed.length - (visibleIndex + 1) === 2)) {
      const lastTwoIds = feed.slice(-2).map(item => item.id);
      fetchFeed(user?.id ?? "", lastTwoIds);
    }
  }, [visibleId]);

  //View the currently visible content
  useEffect(() => {
    if (!user) return;
    view(visibleId, user?.id ?? "");
  }, [visibleId])

  //Initial fetch of feed
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
        {feed && feed.map((activity, index) => (
          <section
            key={activity.id}
            ref={(el) => { sectionRefs.current[index] = el }}
            data-index={index}
            data-id={activity.id}
            className="w-full h-dvh flex items-center justify-center snap-start"
          >
            <CarouselMediaWithActionButtons
              media={activity.mediaUrls}
              posterName={activity?.owner?.name ?? ""}
              posterAvatar={activity?.owner?.profileImageUrl ?? ""}
              postDate={new Date(activity.createdAt).toLocaleDateString()}
              caption={activity.caption ?? ""}
              likesNumber={activity.likes.length}
              commentsNumber={activity.comments}
            />
          </section>
        ))}
        {fetchingFeed && (
          <section className="w-full h-dvh flex items-center justify-center snap-start">
            <LoadingPage isMoonLoader={true} />
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

