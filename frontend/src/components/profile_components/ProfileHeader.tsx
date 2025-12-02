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
    <div className="flex flex-col items-center px-4 py-6 border-b">
      <div className="flex items-center gap-6 w-full max-w-4xl">
        {/* Profile Picture */}
        <Avatar className="w-32 h-32 border">
          <AvatarImage
            src={profileImageUrl as string}
            alt={user.name || 'User'}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl">
            {user.name ? user.name[0] : 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-normal">{user.name || 'User'}</h1>
            <p className="text-sm text-muted-foreground">{user.email || ''}</p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-8 text-sm">
            <span><strong>{user.habitsCount}</strong> Habits</span>
            <span><strong>{user.activitiesCount}</strong> Activities</span>
            <span><strong>{user.longestStreak}</strong> Longest Streak</span>
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
