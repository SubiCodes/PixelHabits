

import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Activity } from '@/store/useActivityStore';

interface CardActivityProps {
  activity: Activity;
  openActivity: () => void
}

function CardActivity({ activity, openActivity }: CardActivityProps) {
  const firstMedia = activity.mediaUrls[0];
  let mediaElement = null;

  if (typeof firstMedia === 'string') {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(firstMedia);
    if (isVideo) {
      mediaElement = (
        <video
          src={firstMedia}
          className="w-full h-72 md:h-80 object-cover rounded"
          controls={false}
          playsInline
          muted
          preload="metadata"
          style={{ pointerEvents: 'none' }}
        />
      );
    } else {
      mediaElement = (
        <div className="w-full h-72 md:h-80 relative rounded overflow-hidden">
          <Image
            src={firstMedia}
            alt={activity.caption}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded"
            sizes="100vw"
            priority
          />
        </div>
      );
    }
  }

  return (
    <button className="w-full min-w-full max-w-full border rounded-xs shadow bg-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => openActivity()}>
      {mediaElement}
      {/* User Info and Likes */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {/* User Icon */}
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold overflow-hidden relative flex-shrink-0">
            {activity.owner?.profileImageUrl ? (
              <Image
                src={activity.owner.profileImageUrl}
                alt={activity.owner.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <span>{activity.owner?.name?.[0]?.toUpperCase() || "U"}</span>
            )}
          </div>
          
          {/* User Name */}
          <span className="text-sm font-medium text-foreground truncate">
            {activity.owner?.name || "User"}
          </span>
        </div>
        
        {/* Likes */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Heart className="h-4 w-4" />
          <span className="text-sm">{activity?.likes.length || 0}</span>
        </div>
      </div>
      
    </button>
  );
}

export default CardActivity;
