import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, User as UserIcon } from 'lucide-react';
import { User } from '@/store/useProfileStore';

interface ProfileHeaderProps {
  user: User;
  isOwner?: boolean;
}

function ProfileHeader({ user, isOwner = false }: ProfileHeaderProps) {
  // Extract profile_image_url from rawJson with type assertion
  const profileImageUrl = (user.rawJson as Record<string, unknown>)?.profile_image_url || '/default-profile.png';

  return (
    <div className="flex justify-center px-4 sm:px-6 py-6 sm:py-8 border-b w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 lg:gap-10 w-full max-w-2xl lg:max-w-3xl relative">
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

        {/* Edit Dropdown - Only visible if isOwner */}
        {isOwner && (
          <div className="absolute top-0 right-0 sm:relative sm:self-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Edit className="h-4 w-4" />
                  <span>Edit Bio</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <UserIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
