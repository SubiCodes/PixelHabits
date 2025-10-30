

import React from 'react';
import Image from 'next/image';

export interface Activity {
    id: string;
    ownerId: string;
    habitId: string;
    caption: string;
    mediaUrls: (string | File)[];
    isPublic: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
}

interface CardActivityProps {
  activity: Activity;
}

function CardActivity({ activity }: CardActivityProps) {
  const firstMedia = activity.mediaUrls[0];
  let mediaElement = null;

  if (typeof firstMedia === 'string') {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(firstMedia);
    if (isVideo) {
      mediaElement = (
        <video
          src={firstMedia}
          className="w-full h-64 object-cover rounded"
          controls={false}
          playsInline
          muted
          preload="metadata"
          style={{ pointerEvents: 'none' }}
        />
      );
    } else {
      mediaElement = (
        <div className="w-full h-44 md:h-64 relative rounded overflow-hidden">
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
    <div className="w-full min-w-full max-w-full border rounded shadow bg-white">
      {mediaElement}
      <div className="p-4">
        <p className="text-sm text-gray-700">{activity.caption}</p>
      </div>
    </div>
  );
}

export default CardActivity;
