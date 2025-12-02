'use client';

import React, { useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

function Profile() {
  const user = useUser();


  useEffect(() => {
    console.log('User data:', user);  
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Profile Header */}
      <div className="flex flex-col items-center px-4 py-6 border-b">
        <div className="flex items-center gap-6 w-full max-w-4xl">
          {/* Profile Picture */}
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={user.profileImageUrl || '/default-profile.png'}
              alt={user.displayName || 'User'}
              className="object-cover"
            />
            <AvatarFallback className="text-3xl">
              {user.displayName ? user.displayName[0] : 'U'}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-normal">{user.displayName || 'User'}</h1>
              <p className="text-sm text-muted-foreground">{user.primaryEmail || ''}</p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 text-sm">
              <span><strong>3</strong> posts</span>
              <span><strong>184</strong> followers</span>
              <span><strong>198</strong> following</span>
            </div>

            {/* Bio Section */}
            <div className="text-sm">
              <p>Welcome to my profile!!!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-4xl">
          {/* Add your content here */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
