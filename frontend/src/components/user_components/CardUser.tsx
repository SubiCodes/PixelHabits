import React from 'react';
import Image from 'next/image';
import { User } from '@/store/useProfileStore';

interface CardUserProps {
  user: User;
  onClick?: () => void;
}

function CardUser({ user, onClick }: CardUserProps) {
  // Extract profile image URL from rawJson
  const profileImageUrl = user.rawJson && typeof user.rawJson === 'object' && 'profile_image_url' in user.rawJson 
    ? (user.rawJson as { profile_image_url?: string }).profile_image_url 
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer text-left"
    >
      {/* User Icon */}
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold overflow-hidden relative flex-shrink-0">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt={user.name || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <span>{user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}</span>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-foreground truncate">
          {user.name || user.email || "User"}
        </h3>
        {user.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {user.bio}
          </p>
        )}
      </div>
    </button>
  );
}

export default CardUser;
