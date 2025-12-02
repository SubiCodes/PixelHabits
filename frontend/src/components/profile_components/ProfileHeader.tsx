import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/store/useProfileStore';

interface ProfileHeaderProps {
  user: User;
}

function ProfileHeader({ user }: ProfileHeaderProps) {
  // Extract profile_image_url from rawJson with type assertion
  const profileImageUrl = (user.rawJson as Record<string, unknown>)?.profile_image_url || '/default-profile.png';

  return (
    <div className="flex justify-center px-4 sm:px-6 py-6 sm:py-8 border-b w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 lg:gap-10 w-full max-w-2xl lg:max-w-3xl">
        {/* Profile Picture */}
        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border">
          <AvatarImage
            src={profileImageUrl as string}
            alt={user.name || 'User'}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl sm:text-3xl lg:text-4xl">
            {user.name ? user.name[0] : 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex flex-col gap-4 sm:gap-4 lg:gap-5 flex-1 w-full sm:w-auto text-center sm:text-left">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-xl lg:text-2xl font-normal">{user.name || 'User'}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email || ''}</p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 lg:gap-10 text-sm sm:text-base">
            <span><strong>{user.habitsCount}</strong> Habits</span>
            <span><strong>{user.activitiesCount}</strong> Activities</span>
            <span><strong>{user.longestStreak}</strong> Streak</span>
          </div>

          {/* Bio Section */}
          <div className="text-sm">
            <p>{user.bio || 'No bio yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
